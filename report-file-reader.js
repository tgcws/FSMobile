/* Local report files only. PDF entries are never decompressed or imported. */
(function () {
  'use strict';
  const KIND = 'fsmobile-pruefbericht-export';
  const limits = Object.freeze({ file: 50 * 1024 * 1024, json: 16 * 1024 * 1024, totalJson: 32 * 1024 * 1024, entries: 256, reports: 32 });
  const fail = message => { throw new Error(message); };
  const invalidZip = () => fail('Die ZIP-Datei ist beschädigt oder wird nicht unterstützt.');
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let crcTable;
  function crc32(bytes) {
    crcTable ||= Array.from({ length: 256 }, (_, n) => {
      for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
      return n >>> 0;
    });
    let crc = 0xffffffff;
    for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function validate(payload) {
    if (payload?.format === 'FSMobileArchiveBackup') fail('Das ist eine vollständige Sicherung. Bitte „Backup importieren“ in den Optionen verwenden.');
    if (!payload || payload.kind !== KIND || typeof payload.moduleId !== 'string' || !/^pb-[a-z0-9-]+$/.test(payload.moduleId) || !Array.isArray(payload.fields)) {
      fail('Die Datei enthält keinen gültigen FSMobile-Prüfbericht.');
    }
    if (payload.version != null && payload.version !== 1) fail('Diese Berichtsversion wird noch nicht unterstützt.');
    if (payload.fields.length > 100000 || payload.fields.some(field => !field || typeof field !== 'object' || Array.isArray(field))) fail('Die Berichtsdaten sind ungültig oder zu umfangreich.');
    if (payload.structured != null && (typeof payload.structured !== 'object' || Array.isArray(payload.structured))) fail('Die strukturierten Berichtsdaten sind ungültig.');
    if (payload.canvases != null && (!Array.isArray(payload.canvases) || payload.canvases.some(item => !item || typeof item.selector !== 'string' || typeof item.dataUrl !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(item.dataUrl)))) fail('Die Bilddaten des Berichts sind ungültig.');
    return payload;
  }
  function parse(bytes) {
    if (bytes.length > limits.json) fail('Die Berichtsdaten sind zu groß. Maximal 16 MB pro JSON-Datei.');
    let payload;
    try {
      payload = JSON.parse(decoder.decode(bytes).replace(/^\uFEFF/, ''), (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw new Error('Invalid key');
        return value;
      });
    } catch { fail('Die JSON-Datei konnte nicht gelesen werden.'); }
    return validate(payload);
  }
  function zipEntries(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const u16 = offset => view.getUint16(offset, true), u32 = offset => view.getUint32(offset, true);
    let end = bytes.length - 22;
    for (; end >= Math.max(0, bytes.length - 65557); end--) {
      if (u32(end) === 0x06054b50 && end + 22 + u16(end + 20) === bytes.length) break;
    }
    if (end < 0 || end < bytes.length - 65557) invalidZip();
    const count = u16(end + 10), size = u32(end + 12), start = u32(end + 16);
    if (u16(end + 4) || u16(end + 6) || u16(end + 8) !== count || count === 65535 || start + size !== end) invalidZip();
    if (count > limits.entries) fail('Die ZIP-Datei enthält zu viele Dateien. Maximal 256 Einträge.');
    const entries = [], names = new Set();
    let cursor = start, total = 0;
    for (let i = 0; i < count; i++) {
      if (cursor + 46 > end || u32(cursor) !== 0x02014b50) invalidZip();
      const flags = u16(cursor + 8), method = u16(cursor + 10), crc = u32(cursor + 16);
      const compressed = u32(cursor + 20), original = u32(cursor + 24), nameLength = u16(cursor + 28);
      const next = cursor + 46 + nameLength + u16(cursor + 30) + u16(cursor + 32), local = u32(cursor + 42);
      if (next > end || u16(cursor + 34) || compressed === 0xffffffff || original === 0xffffffff || local === 0xffffffff) invalidZip();
      const name = new TextDecoder().decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
      cursor = next;
      if (!/\.json$/i.test(name) || /(^|\/)__MACOSX\//.test(name)) continue;
      if (names.has(name)) fail('Die ZIP-Datei enthält doppelte JSON-Dateinamen. Bitte einen eindeutigen Bericht auswählen.');
      names.add(name);
      if (flags & 65) fail('Passwortgeschützte ZIP-Dateien können nicht importiert werden.');
      if (method !== 0 && method !== 8) fail('Die Komprimierung dieser ZIP-Datei wird nicht unterstützt.');
      total += original;
      if (original > limits.json || total > limits.totalJson || entries.length >= limits.reports) fail('Die ZIP-Datei enthält zu viele oder zu große Berichtsdaten.');
      if (local + 30 > start || u32(local) !== 0x04034b50 || u16(local + 8) !== method || (u16(local + 6) & 65)) invalidZip();
      const dataStart = local + 30 + u16(local + 26) + u16(local + 28);
      if (dataStart > start || dataStart + compressed > start) invalidZip();
      const localName = new TextDecoder().decode(bytes.subarray(local + 30, local + 30 + u16(local + 26)));
      if (localName !== name || (method === 0 && compressed !== original)) invalidZip();
      entries.push({ name, method, original, crc, data: bytes.subarray(dataStart, dataStart + compressed) });
    }
    if (cursor !== end) invalidZip();
    return entries;
  }
  async function inflateEntry(entry) {
    const output = new Uint8Array(entry.original);
    let size = 0, finished = false;
    const stream = new window.fflate.Inflate((chunk, final) => {
      size += chunk.length;
      if (size > entry.original) invalidZip();
      output.set(chunk, size - chunk.length);
      finished = final;
    });
    for (let offset = 0; offset < entry.data.length; offset += 1024) {
      stream.push(entry.data.subarray(offset, offset + 1024), offset + 1024 >= entry.data.length);
      if (offset % 16384 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (!finished || size !== entry.original) invalidZip();
    return output;
  }
  async function read(file) {
    if (!file || !file.size) fail('Bitte eine JSON- oder ZIP-Datei auswählen.');
    if (file.size > limits.file) fail('Die Datei ist zu groß. Maximal 50 MB sind möglich.');
    let bytes;
    try { bytes = new Uint8Array(await file.arrayBuffer()); }
    catch { fail('Die Datei konnte nicht gelesen werden. Bitte lokal speichern und erneut auswählen.'); }
    const zip = bytes[0] === 0x50 && bytes[1] === 0x4b;
    if (!zip) return [{ name: file.name, payload: parse(bytes) }];
    let entries;
    try { entries = zipEntries(bytes); } catch (error) { if (error instanceof RangeError) invalidZip(); throw error; }
    const candidates = [], rejected = [];
    for (const entry of entries) {
      let data;
      try {
        // Small compressed chunks bound transient allocations; reject an
        // expanded stream as soon as it exceeds its validated declared size.
        data = entry.method === 0 ? entry.data : await inflateEntry(entry);
        if (data.length !== entry.original || crc32(data) !== entry.crc) invalidZip();
      } catch { fail('Die ZIP-Datei konnte nicht vollständig gelesen werden. Bitte erneut exportieren.'); }
      try { candidates.push({ name: entry.name, payload: parse(data) }); }
      catch (error) { rejected.push(error.message); }
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (!candidates.length) fail(rejected[0] || 'Die ZIP-Datei enthält keine importierbare Prüfbericht-JSON.');
    return candidates;
  }
  window.FSMOBILE_REPORT_FILES = Object.freeze({ read, validate, limits });
}());
