(function () {
  'use strict';
  const moduleId = 'aufmass-lichtkuppel';
  const storage = { current: moduleId + '-current-v1', archive: moduleId + '-archive-v1', pointer: moduleId + '-current-archive-id-v1' };
  const capabilities = { draft: true, archive: true, pdf: true, signatures: false, import: true, export: false };

  function runtime() {
    'use strict';
    const MODULE_ID = 'aufmass-lichtkuppel';
    const KEYS = { current: MODULE_ID + '-current-v1', archive: MODULE_ID + '-archive-v1', pointer: MODULE_ID + '-current-archive-id-v1' };
    const ASSET = 'assets/aufmass-lichtkuppel/';
    const groups = [
      ['Maßnahme', [['original', 'Kuppel erneuern (Original)'], ['sanierungsrahmen', 'Kuppel erneuern mit Sanierungsrahmen', 'sanierungsrahmen.png'], ['komplett', 'Kuppel komplett erneuern inkl. RWA-Beschlag und 180 mm Aufstockelement', 'aufstockelement.png']]],
      ['Wassernase Aufsatzkranz', [['wassernaseOhne', 'Ohne'], ['wassernaseMit', 'Mit']]],
      ['Kranzgeometrie', [['schraeg', 'Schräg', 'schraeg.png'], ['steil', 'Steil', 'steil.png'], ['knick', 'Knick', 'knick.png']]],
      ['Ausführung', [['starr', 'Starr'], ['lueftbar', 'Lüftbar'], ['zweischalig', '2-schalig'], ['dreischalig', '3-schalig'], ['pc16', '+PC 16']]],
      ['RWA-Beschlag', [['rwaOhne', 'Ohne'], ['rwaAuf', 'Auf'], ['rwaAufZu', 'Auf-Zu'], ['rwaSonstiges', 'Sonstiges']]],
      ['Lüftung', [['lueftungOhne', 'Ohne'], ['pn1', 'PN 1-Rohr'], ['pn2', 'PN 2-Rohr'], ['motor230', 'Motor 230 V']]],
      ['Scharniere', [['langseite', 'Langseite'], ['kurzseite', 'Kurzseite']]],
      ['Befestigung', [['halteklammern', 'Mit Halteklammern'], ['verschraubt', 'Mit Tropfkante von oben verschraubt']]],
      ['Lüfterrahmen', [['aluminium', 'Aluminium'], ['kunststoff', 'Kunststoff']]]
    ];
    // Original image objects; extension lines retain the template's technical reference points.
    // The same geometry is used for the touch diagram and PDF. Dimensions never deform it.
    const diagrams = [
      { name: 'Kuppelschale', w: 440, h: 540,
        images: [['schale.png', 20, 340, 400, 170.49]],
        lines: [[52, 80, 420, 80, 'start'], [52, 80, 52, 485], [92, 175, 420, 175, 'start'], [92, 175, 92, 476]],
        fields: [['schale', 'Schale außen', 110, 28, 296], ['dom', 'Dommaß (Anfang Wölbung)', 110, 123, 296]] },
      { name: 'Lüfterrahmen', w: 440, h: 540,
        images: [['luefterrahmen.png', 20, 330, 400, 185.02]],
        lines: [[22, 80, 387, 80, 'end'], [387, 80, 387, 506], [22, 175, 374, 175, 'end'], [374, 175, 374, 484], [22, 270, 343, 270, 'end'], [343, 270, 343, 478]],
        fields: [['tropfkante', 'Tropfkante', 30, 28, 298], ['rahmenAussen', 'Lüfterrahmen außen', 30, 123, 298], ['rahmenInnen', 'Lüfterrahmen innen', 30, 218, 298]] },
      { name: 'Obere lichte Weite innen und außen', w: 900, h: 270,
        images: [['kranz-links.png', 167, 20, 120, 173.64], ['kranz-rechts.jpg', 740, 20, 150, 173.36]],
        lines: [[274, 20, 274, 108], [245, 20, 245, 221], [745, 20, 745, 221], [784, 20, 784, 221], [274, 88, 745, 88, 'both'], [245, 196, 784, 196, 'both'], [147, 27, 147, 192, 'both'], [147, 27, 274, 27], [147, 192, 196, 192]],
        fields: [['lichteInnen', 'Obere lichte Weite innen', 340, 36, 340], ['lichteAussen', 'Obere lichte Weite außen', 340, 144, 340], ['hoehe', 'Höhe h', 0, 54, 132, true]] }
    ];
    const measureKeys = diagrams.flatMap(d => d.fields.flatMap(f => f[5] ? [f[0]] : [f[0] + '1', f[0] + '2'])).concat('wassernaseBreite');
    const textKeys = ['gebaeude', 'gruppe', 'fabrikat', 'anzahl', 'rwaText'].concat(measureKeys);
    const checkKeys = groups.flatMap(g => g[1].map(o => o[0]));
    const clone = value => JSON.parse(JSON.stringify(value));
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const uid = () => crypto.randomUUID ? crypto.randomUUID() : 'lk-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
    const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
    const blankRow = () => ({ id: uid(), fields: Object.fromEntries([...textKeys.map(k => [k, '']), ...checkKeys.map(k => [k, false])]) });
    const blank = () => ({ version: 1, fields: { objekt: '', kundenNr: '', datum: today(), sachbearbeiter: '' }, rows: [blankRow()] });
    function normalize(data) {
      const source = isObject(data) ? clone(data) : {};
      const fields = isObject(source.fields) ? source.fields : {};
      const seen = new Set();
      return { ...source, version: 1, fields: { ...fields, ...Object.fromEntries(['objekt', 'kundenNr', 'datum', 'sachbearbeiter'].map(k => [k, String(fields[k] ?? '')])) },
        rows: (Array.isArray(source.rows) && source.rows.length ? source.rows : [blankRow()]).map(row => {
          row = isObject(row) ? row : {};
          const f = isObject(row.fields) ? row.fields : {};
          const id = typeof row.id === 'string' && row.id && !seen.has(row.id) ? row.id : uid(); seen.add(id);
          return { ...row, id, fields: { ...f, ...Object.fromEntries(textKeys.map(k => [k, String(f[k] ?? '')])), ...Object.fromEntries(checkKeys.map(k => [k, f[k] === true])) } };
        }) };
    }
    let state = blank(), timer = 0, storageBlocked = false, saveFailed = false, busy = false;
    const collapsed = new Set();
    function notify(message) { window.FSMOBILE_STANDARD.showToast(message); }
    function commit(writes) {
      const before = {};
      try {
        Object.keys(writes).forEach(k => { before[k] = localStorage.getItem(k); });
        Object.entries(writes).forEach(([k, v]) => {
          if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
          if (localStorage.getItem(k) !== v) throw new Error('write-verification');
        });
        return true;
      } catch (error) {
        let rollbackFailed = false;
        Object.entries(before).forEach(([k, v]) => {
          try {
            if (localStorage.getItem(k) === v) return;
            if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
            if (localStorage.getItem(k) !== v) rollbackFailed = true;
          } catch (_) { rollbackFailed = true; }
        });
        if (rollbackFailed) notify('Speichern fehlgeschlagen. Der vorherige Speicherstand konnte nicht vollständig wiederhergestellt werden. Eingaben bitte geöffnet lassen.');
        return false;
      }
    }
    function collectData() { return clone(state); }
    function saveFormNow() {
      clearTimeout(timer);
      const ok = !storageBlocked && commit({ [KEYS.current]: JSON.stringify(state) });
      if (!ok && !saveFailed) notify('Eingaben konnten nicht gespeichert werden. Bitte dieses Aufmaß geöffnet lassen.');
      saveFailed = !ok;
      return ok;
    }
    function applyData(data, options) {
      const next = normalize(data);
      if ((!options || options.persist !== false) && !commit({ [KEYS.current]: JSON.stringify(next) })) return false;
      storageBlocked = false; state = next; collapsed.clear(); render(); return true;
    }
    function grow(el) { if (el.tagName === 'TEXTAREA') { el.style.height = 'auto'; el.style.height = Math.max(46, el.scrollHeight) + 'px'; } }
    function field(key, label, value, attrs = '') {
      return '<label class="field-group"><span>' + esc(label) + '</span><textarea rows="1" data-field="' + key + '" ' + attrs + '>' + esc(value) + '</textarea></label>';
    }
    function choiceGroup(group, f) {
      return '<fieldset><legend>' + group[0] + '</legend><div class="choice-grid' + (group[0] === 'Maßnahme' ? ' measures' : '') + '">' + group[1].map(([key, label, img]) =>
        '<label class="choice"><input type="checkbox" data-field="' + key + '"' + (f[key] ? ' checked' : '') + '><span>' + esc(label) + '</span>' + (img ? '<img src="' + ASSET + img + '" alt="Skizze: ' + esc(label) + '">' : '') + '</label>'
      ).join('') + '</div></fieldset>';
    }
    function svgGeometry(d, id) {
      const arrows = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#447dc5"/></marker></defs>';
      return '<svg viewBox="0 0 ' + d.w + ' ' + d.h + '" role="img" aria-label="Maßzeichnung ' + d.name + '">' + arrows +
        d.images.map(([file, x, y, w, h]) => '<image preserveAspectRatio="none" href="' + ASSET + file + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>').join('') +
        d.lines.map(([x1, y1, x2, y2, arrow]) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#447dc5" stroke-width="1.5"' + (arrow === 'start' || arrow === 'both' ? ' marker-start="url(#' + id + ')"' : '') + (arrow === 'end' || arrow === 'both' ? ' marker-end="url(#' + id + ')"' : '') + '/>').join('') + '</svg>';
    }
    function diagram(d, f, index) {
      const fields = d.fields.map(([key, label, x, y, w, single]) => {
        const input = (name, part) => '<input data-field="' + name + '" type="text" inputmode="decimal" aria-label="' + label + (part ? ' – Maß ' + part : '') + ' (mm)" value="' + esc(f[name]) + '">';
        return '<div class="dimension" style="left:' + (x / d.w * 100) + '%;top:' + (y / d.h * 100) + '%;width:' + (w / d.w * 100) + '%"><span class="dimension-label">' + label + '</span><div class="dimension-values' + (single ? ' single' : '') + '">' + (single ? input(key, '') : input(key + '1', '1') + '<span>×</span>' + input(key + '2', '2')) + '<span class="unit">mm</span></div></div>';
      }).join('');
      return '<figure class="measure-board' + (index === 2 ? ' kranz-board' : '') + '"><figcaption>' + d.name + '</figcaption><div class="diagram" style="aspect-ratio:' + d.w + '/' + d.h + '">' + svgGeometry(d, 'arrow-' + uid()) + fields + '</div></figure>';
    }
    function summaryText(row, index) {
      const f = row.fields;
      return '<strong>Position ' + (index + 1) + '</strong><span>' + esc([f.gebaeude || 'Gebäude / Halle offen', f.gruppe && 'Gruppe ' + f.gruppe, f.fabrikat, f.anzahl && f.anzahl + ' Stück'].filter(Boolean).join(' · ')) + '</span>';
    }
    function render() {
      ['objekt', 'kundenNr', 'datum', 'sachbearbeiter'].forEach(k => { document.getElementById(k).value = state.fields[k]; });
      document.getElementById('positions').innerHTML = state.rows.map((row, index) => {
        const f = row.fields;
        return '<details class="position form-section" data-row="' + esc(row.id) + '"' + (collapsed.has(row.id) ? '' : ' open') + '><summary>' + summaryText(row, index) + '</summary><div class="position-content"><div class="row-actions"><button type="button" data-row-action="duplicate" data-fsmobile-action="copy">Position duplizieren</button><button type="button" data-row-action="delete" data-fsmobile-action="delete"' + (state.rows.length === 1 ? ' disabled' : '') + '>Position löschen</button></div><div class="form-grid position-meta">' + field('gebaeude', 'Gebäude / Halle', f.gebaeude) + field('gruppe', 'Gruppe', f.gruppe) + field('fabrikat', 'Fabrikat', f.fabrikat) + '<label class="field-group"><span>Benötigte Anzahl (Stück)</span><input type="text" inputmode="numeric" data-field="anzahl" value="' + esc(f.anzahl) + '"></label></div>' +
          choiceGroup(groups[0], f) + '<h3 class="section-heading">Datenaufnahme Lichtkuppel</h3><div class="diagrams">' + diagrams.map((d, i) => diagram(d, f, i)).join('') + '</div><div class="water-row">' + choiceGroup(groups[1], f) + '<label class="field-group"><span>Breite Wassernase (mm)</span><input type="text" inputmode="decimal" data-field="wassernaseBreite" value="' + esc(f.wassernaseBreite) + '"></label></div>' +
          choiceGroup(groups[2], f) + groups.slice(3).map(g => choiceGroup(g, f) + (g[0] === 'RWA-Beschlag' ? field('rwaText', 'RWA-Beschlag – freie Angabe', f.rwaText) : '')).join('') + '</div></details>';
      }).join('');
      document.querySelectorAll('textarea').forEach(grow);
      document.getElementById('positionCount').textContent = state.rows.length + (state.rows.length === 1 ? ' Position' : ' Positionen');
    }
    function updateValue(event) {
      const el = event.target, key = el.dataset.field;
      if (!key) return;
      const row = el.closest('[data-row]');
      const target = row ? state.rows.find(r => r.id === row.dataset.row)?.fields : state.fields;
      if (!target) return;
      target[key] = el.type === 'checkbox' ? el.checked : el.value;
      const numeric = measureKeys.includes(key) || key === 'anzahl';
      const valid = !numeric || !el.value || (key === 'anzahl' ? /^\d+$/.test(el.value) : /^\d+(?:[,.]\d+)?$/.test(el.value));
      el.setCustomValidity(valid ? '' : 'Bitte eine nicht negative Zahl' + (key === 'anzahl' ? ' ohne Nachkommastellen' : ' in mm') + ' eingeben.');
      el.setAttribute('aria-invalid', String(!valid));
      grow(el);
      if (row) row.querySelector('summary').innerHTML = summaryText(state.rows.find(r => r.id === row.dataset.row), state.rows.findIndex(r => r.id === row.dataset.row));
      clearTimeout(timer); timer = setTimeout(saveFormNow, 120);
    }
    function archiveEntries() {
      const raw = localStorage.getItem(KEYS.archive);
      const data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data) || data.some(e => !isObject(e) || !e.id || !isObject(e.data))) throw new Error('invalid-archive');
      return data;
    }
    const archiveTitle = data => (data.fields.objekt || 'Ohne Objekt') + ' · ' + (data.fields.datum || 'Ohne Datum') + ' · ' + data.rows.length + ' Position(en)';
    function saveArchive() {
      if (!saveFormNow()) return false;
      try {
        const entries = archiveEntries(), pointer = localStorage.getItem(KEYS.pointer);
        const index = entries.findIndex(e => e.id === pointer), previous = entries[index];
        const standard = window.FSMOBILE_STANDARD.createArchiveEntry({ moduleId: MODULE_ID, title: archiveTitle(state), meta: { object: state.fields.objekt, date: state.fields.datum, type: 'Aufmaß Lichtkuppel', anlage: state.rows.map(r => [r.fields.gebaeude, r.fields.gruppe].filter(Boolean).join(' / ')).filter(Boolean).join('; ') }, data: collectData(), previous });
        const entry = { ...previous, ...standard, meta: { ...previous?.meta, ...standard.meta } };
        if (index >= 0) entries[index] = entry; else entries.unshift(entry);
        if (!commit({ [KEYS.archive]: JSON.stringify(entries), [KEYS.pointer]: entry.id })) throw new Error('save-archive');
        renderArchive(); notify(index >= 0 ? 'Formular aktualisiert.' : 'Formular im Archiv gespeichert.'); return entry;
      } catch (_) { notify('Formular konnte nicht im Archiv gespeichert werden.'); return false; }
    }
    function archiveDate(value, time = false) {
      if (!value) return time ? 'nicht verfügbar' : 'Datum fehlt';
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return String(value);
      return time ? date.toLocaleString('de-DE') : date.toLocaleDateString('de-DE');
    }
    function renderArchive() {
      const entries = archiveEntries().sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
      const pointer = localStorage.getItem(KEYS.pointer);
      const list = document.getElementById('archiveList');
      list.innerHTML = entries.length ? entries.map(e => {
        const current = e.id === pointer;
        return '<article class="archive-item archive-item-detailed' + (current ? ' archive-item-current' : '') + '" data-archive-id="' + esc(e.id) + '"' + (current ? ' aria-current="true"' : '') + '>' +
          '<div class="archive-detail-host"><div class="archive-detail"><div class="archive-detail-head"><span class="archive-type-badge">Aufmaß Lichtkuppel</span><span class="archive-entry-date">' + esc(archiveDate(e.meta?.date)) + '</span></div>' +
          '<div class="archive-detail-object">Objekt: ' + esc(e.meta?.object || e.data?.fields?.objekt || 'nicht vorhanden') + '</div>' +
          '<div class="archive-detail-grid"><span class="archive-detail-pair"><b>Kunden Nr.: </b><span>' + esc(e.data?.fields?.kundenNr || 'nicht vorhanden') + '</span></span><span class="archive-detail-pair"><b>Name: </b><span>' + esc(e.data?.fields?.sachbearbeiter || 'nicht vorhanden') + '</span></span><span class="archive-detail-pair"><b>Gebäude / Gruppe: </b><span>' + esc(e.meta?.anlage || 'nicht vorhanden') + '</span></span></div>' +
          '<div class="archive-detail-updated">Zuletzt geändert: ' + esc(archiveDate(e.updatedAt || e.createdAt, true)) + (current ? ' · Aktuell geöffnet' : '') + '</div></div></div>' +
          '<button type="button" class="archive-open-list-btn" data-archive-open="' + esc(e.id) + '">Öffnen</button>' +
          '<button type="button" class="archive-delete-list-btn danger" data-archive-delete="' + esc(e.id) + '" data-fsmobile-action="delete">Löschen</button></article>';
      }).join('') : '<p class="archive-empty">Noch keine Archiv-Einträge vorhanden.</p>';
      applyArchiveFilter(entries);
    }
    function applyArchiveFilter(entries = archiveEntries()) {
      const query = document.getElementById('archiveFilter').value.trim().toLocaleLowerCase('de-DE');
      const list = document.getElementById('archiveList');
      let visible = 0;
      list.querySelectorAll('.archive-item').forEach(item => {
        const entry = entries.find(e => e.id === item.dataset.archiveId);
        const searchable = item.textContent + ' ' + JSON.stringify([entry?.title, entry?.meta, entry?.data]);
        const matches = !query || searchable.toLocaleLowerCase('de-DE').includes(query);
        item.hidden = !matches;
        item.classList.toggle('archive-item-filtered-out', !matches);
        if (matches) visible++;
      });
      let empty = list.querySelector('.archive-filter-empty');
      if (!empty) {
        empty = document.createElement('p'); empty.className = 'archive-empty archive-filter-empty';
        empty.textContent = 'Keine Archiv-Einträge zum Filter gefunden.'; list.appendChild(empty);
      }
      empty.hidden = !(query && entries.length && visible === 0);
      document.getElementById('archiveFilterCount').textContent = visible + ' / ' + entries.length;
    }
    function openArchive() {
      try { renderArchive(); document.getElementById('archiveOverlay').hidden = false; document.getElementById('archiveFilter').focus(); }
      catch (_) { notify('Archiv konnte nicht geöffnet werden. Gespeicherte Daten bleiben unverändert.'); }
    }
    function closeArchive() { document.getElementById('archiveOverlay').hidden = true; }
    async function replaceConfirmation(message) {
      const ui = window.parent.FSMOBILE_UI;
      return ui ? ui.confirm(message, 'Entwurf ersetzen?', 'Ersetzen') : window.confirm(message);
    }
    async function openEntry(id) {
      try {
        const entry = archiveEntries().find(e => e.id === id); if (!entry) return;
        if (JSON.stringify(state) !== JSON.stringify(normalize(entry.data)) && !await replaceConfirmation('Den aktuellen Entwurf durch diesen Archiveintrag ersetzen? Noch nicht archivierte Änderungen werden dabei ersetzt.')) return;
        clearTimeout(timer);
        const next = normalize(entry.data);
        if (!commit({ [KEYS.current]: JSON.stringify(next), [KEYS.pointer]: id })) throw new Error('open-archive');
        state = next; storageBlocked = false; collapsed.clear(); render(); closeArchive(); notify('Archiv-Eintrag wurde geöffnet.');
      } catch (_) { notify('Archiv-Eintrag konnte nicht geöffnet werden.'); }
    }
    function deleteEntry(id) {
      if (!window.confirm('Archiv-Eintrag wirklich löschen?')) return;
      try {
        const writes = { [KEYS.archive]: JSON.stringify(archiveEntries().filter(e => e.id !== id)) };
        if (localStorage.getItem(KEYS.pointer) === id) writes[KEYS.pointer] = null;
        if (!commit(writes)) throw new Error('delete-archive');
        renderArchive(); notify('Archiv-Eintrag wurde gelöscht.');
      } catch (_) { notify('Archiv-Eintrag konnte nicht gelöscht werden.'); }
    }
    function clearForm() {
      if (!window.confirm('Formular wirklich leeren?')) return false;
      clearTimeout(timer);
      if (!commit({ [KEYS.current]: null, [KEYS.pointer]: null })) { notify('Formular konnte nicht geleert werden.'); return false; }
      storageBlocked = false; state = blank(); collapsed.clear(); render(); notify('Formular geleert.'); return true;
    }
    function pdfFileName(data) {
      return window.FSMOBILE_STANDARD.pdfFileName([data.fields.objekt || 'Aufmass_Lichtkuppel', data.fields.datum || today()]);
    }
    window.FSMOBILE_PDF_EXPORT_FORMAT = 'zip';
    window.FSMOBILE_REPORT_EXPORT_FILE_NAME = () => pdfFileName(state).replace(/\.pdf$/, '.zip');
    function validateImport(payload) {
      if (payload?.kind !== 'fsmobile-aufmass-export' || payload.version !== 1 || payload.moduleId !== MODULE_ID || !isObject(payload.data?.fields) || !Array.isArray(payload.data?.rows) || payload.data.rows.some(r => !isObject(r?.fields))) throw new Error('format');
      return payload;
    }
    async function importFile(file) {
      if (!file) return false;
      try {
        const reports = await window.parent.FSMOBILE_REPORT_FILES.read(file, validateImport);
        if (reports.length !== 1) throw new Error('ambiguous');
        const next = normalize(reports[0].payload.data);
        if (!await replaceConfirmation('Den aktuellen Entwurf durch die ausgewählte Aufmaßdatei ersetzen? Archiviere wichtige Änderungen zuvor. Bestehende Archiveinträge bleiben erhalten.')) return false;
        clearTimeout(timer);
        if (!commit({ [KEYS.current]: JSON.stringify(next), [KEYS.pointer]: null })) throw new Error('write');
        state = next; storageBlocked = false; collapsed.clear(); render(); notify('Datei wurde importiert.'); return true;
      } catch (_) { notify('Datei konnte nicht importiert werden. Bitte eine gültige Lichtkuppel-Aufmaßdatei wählen.'); return false; }
      finally { document.getElementById('importFile').value = ''; }
    }

    const pdfImageCache = new Map();
    async function imageForPdf(file) {
      if (!pdfImageCache.has(file)) pdfImageCache.set(file, new Promise((resolve, reject) => {
        const img = new Image(); img.onload = () => resolve(img); img.onerror = () => { pdfImageCache.delete(file); reject(new Error('Zeichnung konnte nicht geladen werden.')); }; img.src = ASSET + file;
      }));
      return pdfImageCache.get(file);
    }
    async function exportPdf() {
      if (busy) return false;
      busy = true;
      const transaction = window.FSMOBILE_UI_EXPORT_TRANSACTION;
      try {
        const data = collectData();
        const files = [...new Set([...diagrams.flatMap(d => d.images.map(i => i[0])), ...groups.flatMap(g => g[1].map(o => o[2]).filter(Boolean))])];
        const images = Object.fromEntries(await Promise.all(files.map(async f => [f, await imageForPdf(f)])));
        if (!window.jspdf?.jsPDF) throw new Error('PDF-Bibliothek ist nicht verfügbar.');
        const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
        let y = 40, position = 0;
        const bottom = 280, val = v => String(v ?? '').trim() || '-';
        function header() {
          doc.setFillColor(255, 180, 71); doc.rect(10, 24, 190, 10, 'F');
          doc.setTextColor(0); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
          doc.text('Aufmaß Lichtkuppel', 14, 30.7); doc.setFontSize(9);
          doc.text('Position ' + (position + 1) + ' / ' + data.rows.length, 196, 30.7, { align: 'right' });
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
          const context = (data.fields.objekt || 'Ohne Objekt').replace(/\s+/g, ' ');
          doc.text(doc.splitTextToSize(context + ' | ' + val(data.fields.datum), 182)[0], 14, 38);
          y = 44;
        }
        function nextPage() { doc.addPage(); header(); }
        function ensure(height) { if (y + height > bottom) nextPage(); }
        function metadataRow(items) {
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
          const columns = items.map(([label, value]) => ({ label, lines: doc.splitTextToSize(val(value), 63), offset: 0 }));
          while (columns.some(c => c.offset < c.lines.length)) {
            ensure(12);
            doc.setFontSize(8);
            const capacity = Math.max(1, Math.floor((280 - y - 4) / 3.8));
            const chunks = columns.map(c => c.lines.slice(c.offset, c.offset + capacity));
            const labels = columns.map(c => doc.splitTextToSize(c.label + (c.offset && c.offset < c.lines.length ? ' (Forts.)' : ''), 21));
            const height = Math.max(...chunks.map(c => c.length), ...labels.map(l => l.length)) * 3.8 + 4;
            ensure(height);
            columns.forEach((c, index) => {
              const x = 14 + index * 93;
              doc.setFillColor(247, 248, 251); doc.rect(x, y, 89, height, 'F');
              doc.setTextColor(0); doc.setFont('helvetica', 'bold');
              doc.text(labels[index], x + 2, y + 4, { lineHeightFactor: 1.35 });
              doc.setFont('helvetica', 'normal');
              if (chunks[index].length) doc.text(chunks[index], x + 24, y + 4, { lineHeightFactor: 1.35 });
              c.offset += chunks[index].length;
            });
            y += height;
            if (columns.some(c => c.offset < c.lines.length)) nextPage();
          }
        }
        function textRow(label, value, size = 8) {
          doc.setFontSize(size); doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(val(value), 143);
          let offset = 0;
          while (offset < lines.length) {
            ensure(9);
            const labelLines = doc.splitTextToSize(label + (offset ? ' (Forts.)' : ''), 33);
            ensure(labelLines.length * 3.8 + 4);
            const count = Math.max(1, Math.min(lines.length - offset, Math.floor((bottom - y - 3) / 3.8)));
            const blockLines = Math.max(count, labelLines.length);
            doc.setFillColor(247, 248, 251); doc.rect(14, y, 182, blockLines * 3.8 + 3, 'F');
            doc.setTextColor(0); doc.setFont('helvetica', 'bold'); doc.setFontSize(size);
            doc.text(labelLines, 16, y + 4, { lineHeightFactor: 1.35 });
            doc.setFont('helvetica', 'normal'); doc.text(lines.slice(offset, offset + count), 51, y + 4, { lineHeightFactor: 1.35 });
            y += blockLines * 3.8 + 3; offset += count;
            if (offset < lines.length) nextPage();
          }
        }
        function line(x1, y1, x2, y2, arrow, scale) {
          doc.setDrawColor(68, 125, 197); doc.setFillColor(68, 125, 197); doc.setLineWidth(.2); doc.line(x1, y1, x2, y2);
          const angle = Math.atan2(y2 - y1, x2 - x1), size = Math.max(.8, 6 * scale);
          function triangle(x, yy, a) { doc.triangle(x, yy, x - size * Math.cos(a) + size / 2 * Math.sin(a), yy - size * Math.sin(a) - size / 2 * Math.cos(a), x - size * Math.cos(a) - size / 2 * Math.sin(a), yy - size * Math.sin(a) + size / 2 * Math.cos(a), 'F'); }
          if (arrow === 'start' || arrow === 'both') triangle(x1, y1, angle + Math.PI);
          if (arrow === 'end' || arrow === 'both') triangle(x2, y2, angle);
        }
        function drawDiagram(source, f, x, yy, width) {
          // Print has smaller controls: close vertical gaps without changing reference points or image proportions.
          const compactY = v => v > 300 ? v - 90 : v * .78;
          const d = source.h === 540 ? { ...source, h: 450,
            images: source.images.map(([file, ix, iy, iw, ih]) => [file, ix, iy - 90, iw, ih]),
            lines: source.lines.map(([x1,y1,x2,y2,a]) => [x1,compactY(y1),x2,compactY(y2),a]),
            fields: source.fields.map(([key,label,fx,fy,fw,single]) => [key,label,fx,fy*.78,fw,single])
          } : { ...source, h: 220,
            lines: source.lines.map(([x1,y1,x2,y2,a]) => [x1,y1===88?60:y1===196?154:y1,x2,y2===88?60:y2===196?154:y2,a]),
            fields: source.fields.map(([key,label,fx,fy,fw,single]) => [key,label,fx,key==='lichteInnen'?12:key==='lichteAussen'?106:fy,fw,single])
          };
          const s = width / d.w;
          d.images.forEach(([file, ix, iy, iw, ih]) => doc.addImage(images[file], /jpg$/.test(file) ? 'JPEG' : 'PNG', x + ix * s, yy + iy * s, iw * s, ih * s));
          d.lines.forEach(([x1, y1, x2, y2, a]) => line(x + x1 * s, yy + y1 * s, x + x2 * s, yy + y2 * s, a, s));
          d.fields.forEach(([key, label, fx, fy, fw, single]) => {
            const dx = x + fx * s, dy = yy + fy * s, dw = fw * s;
            doc.setTextColor(0); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.2);
            const labelLines = doc.splitTextToSize(label, dw + 4);
            doc.setFillColor(255); doc.rect(dx - .5, dy - 1, dw + 2, labelLines.length * 3.2 + 9, 'F');
            doc.text(labelLines, dx, dy + 1.5, { lineHeightFactor: 1.2 });
            const vy = dy + labelLines.length * 3.2 + 1, value = single ? val(f[key]) : val(f[key + '1']) + ' × ' + val(f[key + '2']);
            doc.setDrawColor(165); doc.setLineWidth(.2); doc.rect(dx, vy, dw, 6);
            doc.setFontSize(Math.max(4, Math.min(8.5, 8.5 * (dw - 3) / Math.max(doc.getTextWidth(value + ' mm'), 1))));
            doc.text(value + ' mm', dx + 1, vy + 4.2); doc.setFontSize(8);
          });
        }
        for (position = 0; position < data.rows.length; position++) {
          if (position) doc.addPage(); header();
          const f = data.rows[position].fields;
          metadataRow([['Objekt', data.fields.objekt], ['Kunden Nr.', data.fields.kundenNr]]);
          metadataRow([['Name', data.fields.sachbearbeiter], ['Datum', data.fields.datum]]);
          textRow('Gebäude / Gruppe', [val(f.gebaeude), val(f.gruppe)].join(' / '));
          textRow('Fabrikat / Anzahl', val(f.fabrikat) + ' / ' + val(f.anzahl) + ' Stück');
          ensure(23);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('Maßnahme', 14, y + 4); y += 6;
          groups[0][1].forEach(([key, label, file], i) => {
            const x = 14 + i * 61; doc.setFont('helvetica', 'normal'); doc.setFontSize(7.1);
            doc.text((f[key] ? '[x] ' : '[ ] ') + label, x, y + 3, { maxWidth: file ? 42 : 57, lineHeightFactor: 1.2 });
            if (file) doc.addImage(images[file], 'PNG', x + 44, y, 12, 15);
          });
          y += 15;
          ensure(74); drawDiagram(diagrams[0], f, 20, y, 72); drawDiagram(diagrams[1], f, 117, y, 72); y += 74;
          ensure(46); drawDiagram(diagrams[2], f, 14, y, 182); y += 46;
          for (const [label, options] of groups.slice(1)) {
            let value = options.map(([key, text]) => (f[key] ? '[x] ' : '[ ] ') + text).join('   ');
            if (label === 'Wassernase Aufsatzkranz') value += '   Breite: ' + val(f.wassernaseBreite) + ' mm';
            if (label === 'RWA-Beschlag') value += '   Freie Angabe: ' + val(f.rwaText);
            if (label === 'Kranzgeometrie') {
              ensure(13);
              doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0); doc.text(label, 16, y + 5);
              options.forEach(([key, text, file], index) => { const x = 51 + index * 48; doc.addImage(images[file], 'PNG', x, y, 7, 9); doc.setFont('helvetica', 'normal'); doc.text((f[key] ? '[x] ' : '[ ] ') + text, x + 9, y + 5); });
              y += 12;
            } else textRow(label, value, 7.5);
          }
        }
        for (let page = 1; page <= doc.getNumberOfPages(); page++) {
          doc.setPage(page); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(80);
          doc.text('Seite ' + page + ' / ' + doc.getNumberOfPages(), 196, 288, { align: 'right' });
        }
        window.FSMOBILE_STAMP_PDF_LOGO(doc);
        const name = pdfFileName(data), zipName = name.replace(/\.pdf$/, '.zip');
        const payload = { kind: 'fsmobile-aufmass-export', version: 1, moduleId: MODULE_ID, data };
        const zip = window.parent.fflate.zipSync({
          [name]: new Uint8Array(doc.output('arraybuffer')),
          [name.replace(/\.pdf$/, '.json')]: new TextEncoder().encode(JSON.stringify(payload, null, 2))
        }, { level: 0 });
        const blob = new Blob([zip], { type: 'application/zip' });
        if (!window.parent.FSMOBILE_UI?.receiveExport(window, transaction, blob, zipName)) {
          const url = URL.createObjectURL(blob), link = document.createElement('a');
          link.href = url; link.download = zipName; document.body.append(link); link.click(); link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 30000);
        }
        notify('PDF-Export wurde erstellt.'); return true;
      } catch (error) { notify('PDF-Export konnte nicht erstellt werden. ' + error.message); return false; }
      finally { busy = false; }
    }
    document.getElementById('lichtkuppelForm').addEventListener('input', updateValue);
    document.getElementById('lichtkuppelForm').addEventListener('change', updateValue);
    document.getElementById('lichtkuppelForm').addEventListener('submit', e => e.preventDefault());
    document.getElementById('positions').addEventListener('toggle', event => {
      const details = event.target;
      if (details.matches('details[data-row]')) { if (details.open) { collapsed.delete(details.dataset.row); details.querySelectorAll('textarea').forEach(grow); } else collapsed.add(details.dataset.row); }
    }, true);
    document.getElementById('positions').addEventListener('click', event => {
      const button = event.target.closest('[data-row-action]'); if (!button) return;
      const details = button.closest('[data-row]'), index = state.rows.findIndex(r => r.id === details.dataset.row);
      if (button.dataset.rowAction === 'duplicate') {
        const row = clone(state.rows[index]); row.id = uid(); state.rows.splice(index + 1, 0, row); render(); saveFormNow();
        document.querySelector('[data-row="' + row.id + '"] summary').focus();
      } else if (state.rows.length > 1 && window.confirm('Diese Lichtkuppelposition wirklich löschen?')) {
        state.rows.splice(index, 1); collapsed.delete(details.dataset.row); render(); saveFormNow();
      }
    });
    document.getElementById('addPosition').addEventListener('click', () => {
      state.rows.forEach(r => collapsed.add(r.id)); const row = blankRow(); state.rows.push(row); render(); saveFormNow();
      document.querySelector('[data-row="' + row.id + '"] summary').focus();
    });
    document.getElementById('archiveList').addEventListener('click', event => {
      const open = event.target.closest('[data-archive-open]'), del = event.target.closest('[data-archive-delete]');
      if (open) openEntry(open.dataset.archiveOpen); if (del) deleteEntry(del.dataset.archiveDelete);
    });
    document.getElementById('archiveFilter').addEventListener('input', () => { try { renderArchive(); } catch (_) { notify('Archiv konnte nicht gelesen werden.'); } });
    document.getElementById('archiveCloseButton').addEventListener('click', closeArchive);
    document.getElementById('importFile').addEventListener('change', e => importFile(e.target.files[0]));
    const actions = { save: saveArchive, archive: openArchive, clear: clearForm, pdf: exportPdf, import: () => document.getElementById('importFile').click() };
    Object.entries(actions).forEach(([key, action]) => document.querySelector('[data-global-action="' + key + '"]').addEventListener('click', action));
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveFormNow(); }); window.addEventListener('pagehide', saveFormNow);
    try {
      const raw = localStorage.getItem(KEYS.current);
      if (raw) { const parsed = JSON.parse(raw); if (!isObject(parsed)) throw new Error('draft'); state = normalize(parsed); }
    } catch (_) { storageBlocked = true; notify('Entwurf konnte nicht gelesen werden. Gespeicherte Daten bleiben erhalten; bitte vor dem Leeren ein Backup erstellen.'); }
    render();
    window.FSMOBILE_MODULE_API = window.FSMOBILE_STANDARD.createModuleApi({ moduleId: MODULE_ID, storage: KEYS,
      capabilities: { draft: true, archive: true, pdf: true, signatures: false, import: true, export: false },
      state: { collect: collectData, apply: applyData }, lifecycle: { flush: saveFormNow },
      actions: Object.fromEntries(Object.entries(actions).map(([key, invoke]) => [key, { invoke, isDisabled: () => busy }])) });
  }

  const css = `
    :root{--primary:#007aff;--accent:#ff9500;--text:#1c1c1e;--muted:#454b55}*{box-sizing:border-box}html{background:transparent;-webkit-text-size-adjust:100%}body{margin:0;background:transparent;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif}input,textarea,button{font:inherit}.container{width:min(100%,1180px);margin:auto;padding:18px}h1{font-size:34px;font-weight:850;margin:4px 0 18px}h2{font-size:22px}h3{font-size:18px;margin:20px 0 12px}.form-section{padding:16px;margin:0 0 16px;border:1px solid #d8dee7;border-radius:22px;background:rgba(248,250,252,.8)}.section-heading{display:flex;align-items:center;gap:10px}.section-heading:before{content:'';width:4px;height:20px;border-radius:3px;background:var(--accent)}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.field-group{display:flex;flex-direction:column;gap:6px;min-width:0;font-size:13px;font-weight:700}.field-group>span{color:var(--muted)}input:not([type=checkbox]),textarea{width:100%;min-height:46px;border:1px solid #c4cbd4;border-radius:10px;padding:10px 12px;background:#fff;color:var(--text);font-size:16px;font-weight:400}textarea{resize:none;overflow:hidden;line-height:1.4}input:focus,textarea:focus{outline:3px solid #007aff33;border-color:#007aff}input[aria-invalid=true]{outline:2px solid #ff3b30}button{min-width:44px;min-height:46px;border:0;border-radius:999px;padding:10px 18px;background:linear-gradient(#2f93ff,#0a84ff);color:#fff;font-size:15px;font-weight:800;cursor:pointer}button:disabled{opacity:.45;cursor:default}button:focus-visible,summary:focus-visible{outline:3px solid #007aff66;outline-offset:3px}.row-actions,.position-footer{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.row-actions{justify-content:flex-end;margin:0 0 16px}.position-footer{justify-content:space-between}.position-count{font-size:14px;color:var(--muted)}button[data-fsmobile-action=copy]{background:#5856d6}button[data-fsmobile-action=delete]{background:#ff3b30}button[data-fsmobile-action=add]{background:#34c759}.global-actions{display:flex;flex-wrap:wrap;gap:8px}.fsmobile-parent-actions-active .global-actions{display:none}.position>summary{cursor:pointer;min-height:52px;list-style-position:inside;padding:4px 0 12px;font-size:18px;overflow-wrap:anywhere}.position>summary strong{margin-right:14px}.position>summary span{display:block;padding:6px 0 0 21px;font-size:14px;color:var(--muted);font-weight:400}.position-content{padding-top:8px}.position-meta{margin-bottom:18px}fieldset{border:0;padding:0;margin:18px 0;min-width:0}legend{font-size:13px;font-weight:700;padding:0 0 8px}.choice-grid{display:flex;flex-wrap:wrap;gap:8px}.choice{display:flex;align-items:center;gap:9px;min-height:46px;padding:10px 12px;border:1px solid #c4cbd4;border-radius:10px;background:rgba(255,255,255,.8);cursor:pointer;font-size:14px;font-weight:600}.choice:has(input:checked){border-color:#e49525;background:#fff5df}.choice input{width:20px;height:20px;flex:none;accent-color:#e28a00}.choice span{flex:1}.choice img{width:30px;height:40px;object-fit:contain}.measures{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.measures .choice{align-items:flex-start;flex-wrap:wrap}.measures .choice img{width:46px;height:60px;margin-left:auto}.diagrams{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.measure-board{margin:0;padding:12px;background:#fff;border:1px solid #d8dee7;border-radius:16px;min-width:0}.measure-board figcaption{font-size:14px;font-weight:750;margin-bottom:10px;color:#454b55}.kranz-board{grid-column:1/-1}.diagram{position:relative;width:100%}.diagram>svg{display:block;width:100%;height:100%}.dimension{position:absolute;min-width:0}.dimension-label{display:block;font-size:12px;font-weight:650;line-height:1.25;margin-bottom:5px;background:#fff;width:fit-content}.dimension-values{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto;gap:4px;align-items:center;font-size:13px;background:#fff}.dimension-values.single{grid-template-columns:minmax(0,1fr) auto}.dimension-values input{padding:8px 5px;text-align:center}.unit{font-size:11px}.water-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,.6fr);align-items:center;gap:18px}.archive-overlay[hidden]{display:none}.archive-overlay{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:18px;background:#1c1c1e55}.archive-dialog{width:min(100%,820px);max-height:90vh;display:flex;flex-direction:column;background:#f8fafc;border-radius:22px;overflow:hidden}.archive-header{display:flex;justify-content:space-between;align-items:center;padding:16px;gap:12px}.archive-header h2{margin:0}.archive-close-btn{background:#8e8e93}.archive-filter-tools{display:flex;align-items:center;gap:12px;padding:0 16px 14px}.archive-filter-count,#archiveFilterCount{white-space:nowrap}.archive-filter-input{min-width:0;flex:1}.archive-list{overflow:auto;padding:12px;display:grid;gap:10px}.archive-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:center;padding:14px;border:1px solid #d8dee7;border-radius:14px;background:#fff}.archive-item-current{border-color:#007aff;box-shadow:0 0 0 1px #007aff}.archive-title{font-weight:800;overflow-wrap:anywhere}.archive-meta{font-size:12px;line-height:1.4;margin-top:5px;color:#454b55;overflow-wrap:anywhere}.archive-empty{padding:24px;text-align:center}#importFile{display:none}@media(max-width:700px){.diagrams{grid-template-columns:1fr}.kranz-board{grid-column:auto}.kranz-board .diagram{min-width:600px}.kranz-board{overflow-x:auto}.measures{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}.water-row{grid-template-columns:1fr}.archive-item{grid-template-columns:1fr}.container{padding:12px}}
  `;
  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Aufmaß Lichtkuppel</title><script defer src="vendor/jspdf.umd.min.js"></script><style>${css}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid>*{order:initial!important;grid-column:auto!important}@media(max-width:600px){html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid{grid-template-columns:1fr!important}}</style></head><body><main class="container"><h1>Aufmaß Lichtkuppel</h1><div class="global-actions"><button type="button" class="archive-save" data-global-action="save">Im Archiv speichern</button><button type="button" class="archive-btn" data-global-action="archive">Archiv</button><button type="button" class="fsmobile-data-import" data-global-action="import">Import</button><button type="button" class="clear-btn" data-global-action="clear">Leeren</button><button type="button" class="pdf-btn" data-global-action="pdf">PDF</button></div><form id="lichtkuppelForm"><section class="form-section"><h2 class="section-heading">Stammdaten</h2><div class="form-grid aufmass-stammdaten"><label class="field-group"><span>Objekt</span><textarea id="objekt" rows="1" data-field="objekt"></textarea></label><label class="field-group"><span>Kunden Nr.</span><input id="kundenNr" type="text" data-field="kundenNr"></label><label class="field-group"><span>Name</span><textarea id="sachbearbeiter" rows="1" data-field="sachbearbeiter"></textarea></label><label class="field-group"><span>Datum</span><input id="datum" type="date" data-field="datum"></label></div></section><div id="positions"></div><div class="position-footer"><span id="positionCount" class="position-count"></span><button id="addPosition" type="button" data-fsmobile-action="add">Lichtkuppel hinzufügen</button></div></form><input type="file" id="importFile" accept=".json,.zip,application/json,application/zip"></main><div id="archiveOverlay" class="archive-overlay" hidden><div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle"><div class="archive-header"><h2 id="archiveTitle">Archiv – Aufmaß Lichtkuppel</h2><button type="button" id="archiveCloseButton" class="archive-close-btn">Schließen</button></div><div class="archive-filter-tools"><input id="archiveFilter" class="archive-filter-input" type="search" placeholder="Objekt, Kunden Nr., Name, Gebäude, Gruppe, Datum …" aria-label="Archiv filtern"><span id="archiveFilterCount"></span></div><div id="archiveList" class="archive-list"></div></div></div><script>(${runtime.toString()})();</script></body></html>`;
  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES[moduleId] = { title: 'Aufmaß Lichtkuppel', group: 'Kalkulation', description: 'Lichtkuppeln mit Zeichnungen und Maßen aufnehmen, archivieren und als PDF ausgeben.', html, apiContract: { version: 1, storage, capabilities } };
}());
