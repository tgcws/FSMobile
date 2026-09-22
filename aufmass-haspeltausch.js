(function () {
  'use strict';
  const moduleId = 'aufmass-haspeltausch';
  const storage = { current: moduleId + '-current-v1', archive: moduleId + '-archive-v1', pointer: moduleId + '-current-archive-id-v1' };
  const capabilities = { draft: true, archive: true, pdf: true, signatures: false, import: true, export: false };
  function runtime() {
    'use strict';
    const MODULE_ID = 'aufmass-haspeltausch';
    const KEYS = { current: MODULE_ID + '-current-v1', archive: MODULE_ID + '-archive-v1', pointer: MODULE_ID + '-current-archive-id-v1' };
    const ASSET = 'assets/aufmass-haspeltausch/';
    const artwork = 'haspel-zeichnung.png';
    const metaFields = [['objekt', 'Objekt'], ['kundenNr', 'Kunden Nr.'], ['ansprechpartner', 'Name'], ['datum', 'Datum']];
    const productFields = [['schlauchlaenge', 'Schlauchlänge', 'm'], ['schlauchdurchmesser', 'Innendurchmesser des Schlauches', 'mm'], ['scheibendurchmesser', 'Außendurchmesser der Haspelscheiben', 'mm'], ['scheibenabstand', 'Scheibenabstand der Haspelscheiben', 'mm'], ['anzahlRechts', 'Stückzahl Wasseranschluss rechts', 'Stück'], ['anzahlLinks', 'Stückzahl Wasseranschluss links', 'Stück']];
    // Crops reference the original 767 x 699 image. No technical image is redrawn.
    // The same reference geometry drives the HTML overlay and vector PDF dimensions.
    const front = [0, 55, 432, 367], side = [612, 55, 115, 367], plan = [0, 575, 435, 123];
    const diagrams = [
      { name: 'Wandhydrant / Haspelfach – Breite und Höhe', w: 1000, h: 800,
        image: [front, 45, 20, 580, 492.73],
        lines: [[73.19,493,850,493], [608.89,44.17,850,44.17], [840,44.17,840,493,'both'], [73.19,493,73.19,770], [249.07,493,249.07,640], [608.89,493,608.89,770], [249.07,630,608.89,630,'both'], [73.19,760,608.89,760,'both']],
        fields: [['schrankhoehe','Innenhöhe',730,215,220], ['fachbreite','Haspelfachbreite',300,550,260], ['schrankbreite','Innenbreite gesamt',205,680,270]] },
      { name: 'Ventil und Aufhängung', w: 1000, h: 640,
        image: [front, 30, 160, 520, 441.76],
        lines: [[458.52,181.67,458.52,130], [535.56,181.67,535.56,130], [458.52,135,535.56,135,'both'], [535.56,181.67,920,181.67], [516.30,287.59,660,287.59], [535.56,336.94,790,336.94], [535.56,430.83,920,430.83], [650,181.67,650,287.59,'both'], [780,336.94,780,430.83,'both'], [910,181.67,910,430.83,'both']],
        fields: [['ventilabstand','Ventilabstand',390,30,220], ['ventilunterkante','Ventilunterkante',560,190,180,'Oberkante innen bis Ventilunterkante'], ['oesenabstand','Ösenabstand',555,345,210,'Abstand der Aufhängungsösen'], ['untereOese','Oberkante bis untere Öse',820,190,180]] },
      { name: 'Seitenansicht – Tiefe', w: 480, h: 560,
        image: [side, 150, 20, 120, 382.96],
        lines: [[160.43,387.30,160.43,530], [259.57,387.30,259.57,530], [160.43,525,259.57,525,'both']],
        fields: [['tiefe','Tiefe',100,420,240]] },
      { name: 'Draufsicht – Öse', w: 480, h: 540,
        image: [plan, 10, 50, 450, 127.24],
        lines: [[435.17,150.34,385,235,'start'], [385,235,265,235]],
        fields: [['oesenInnendurchmesser','Ösen-Innendurchmesser',190,255,260]] }
    ];
    const measureKeys = diagrams.flatMap(d => d.fields.map(f => f[0]));
    const textKeys = [...metaFields, ...productFields].map(f => f[0]).concat(measureKeys);
    const numericKeys = productFields.filter(f => f[0] !== 'schlauchdurchmesser').map(f => f[0]).concat(measureKeys);
    const clone = value => JSON.parse(JSON.stringify(value));
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
    const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
    const blank = () => ({ version: 1, fields: { ...Object.fromEntries(textKeys.map(k => [k, ''])), datum: today() } });
    function normalize(data) {
      const source = isObject(data) ? clone(data) : {};
      const fields = isObject(source.fields) ? source.fields : {};
      return { ...source, version: 1, fields: { ...fields, ...Object.fromEntries(textKeys.map(k => [k, String(fields[k] ?? '')])) } };
    }
    let state = blank(), timer = 0, storageBlocked = false, saveFailed = false, busy = false;
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
      storageBlocked = false; state = next; render(); return true;
    }
    function grow(el) { if (el.tagName === 'TEXTAREA') { el.style.height = 'auto'; el.style.height = Math.max(46, el.scrollHeight) + 'px'; } }
    function numericInput(key, label, unit) {
      return '<label class="field-group"><span>' + esc(label) + '</span><span class="input-unit"><input type="text" inputmode="' + (key.startsWith('anzahl') ? 'numeric' : 'decimal') + '" data-field="' + key + '" aria-label="' + esc(label + ' (' + unit + ')') + '"><span class="unit">' + unit + '</span></span></label>';
    }
    function svgGeometry(d, index) {
      const [crop, x, y, w, h] = d.image;
      const id = 'haspel-arrow-' + index;
      return '<svg viewBox="0 0 ' + d.w + ' ' + d.h + '" aria-label="Maßzeichnung ' + esc(d.name) + '" role="img"><defs><marker id="' + id + '" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#447dc5"/></marker></defs><svg class="original-view" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="' + crop.join(' ') + '" overflow="hidden"><image href="' + ASSET + artwork + '" width="767" height="699"/></svg>' + d.lines.map(([x1,y1,x2,y2,a]) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#447dc5" stroke-width="1.5"' + (a === 'both' || a === 'start' ? ' marker-start="url(#' + id + ')"' : '') + (a === 'both' ? ' marker-end="url(#' + id + ')"' : '') + '/>').join('') + '</svg>';
    }
    function diagram(d, index) {
      return '<figure class="measure-board"><figcaption>' + esc(d.name) + '</figcaption><div class="diagram" style="aspect-ratio:' + d.w + '/' + d.h + '">' + svgGeometry(d,index) + d.fields.map(([key,label,x,y,w,fullLabel]) => '<label class="dimension" style="left:' + x / d.w * 100 + '%;top:' + y / d.h * 100 + '%;width:' + w / d.w * 100 + '%"><span class="dimension-label">' + esc(label) + '</span><span class="input-unit"><input type="text" inputmode="decimal" data-field="' + key + '" aria-label="' + esc((fullLabel || label) + ' (mm)') + '"><span class="unit">mm</span></span></label>').join('') + '</div></figure>';
    }
    function render() {
      document.querySelectorAll('[data-field]').forEach(el => { el.value = state.fields[el.dataset.field]; el.setCustomValidity(''); el.removeAttribute('aria-invalid'); grow(el); });
    }
    function updateValue(event) {
      const el = event.target, key = el.dataset.field; if (!key) return;
      state.fields[key] = el.value;
      const valid = !numericKeys.includes(key) || !el.value || (key.startsWith('anzahl') ? /^\d+$/.test(el.value) : /^\d+(?:[,.]\d+)?$/.test(el.value));
      el.setCustomValidity(valid ? '' : 'Bitte eine nicht negative Zahl' + (key.startsWith('anzahl') ? ' ohne Nachkommastellen' : '') + ' eingeben.');
      el.setAttribute('aria-invalid', String(!valid)); grow(el);
      clearTimeout(timer); timer = setTimeout(saveFormNow, 120);
    }
    function archiveEntries() {
      const raw = localStorage.getItem(KEYS.archive);
      const data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data) || data.some(e => !isObject(e) || !e.id || !isObject(e.data))) throw new Error('invalid-archive');
      return data;
    }
    const archiveTitle = data => (data.fields.objekt || 'Ohne Objekt') + ' · rechts: ' + (data.fields.anzahlRechts || '-') + ' / links: ' + (data.fields.anzahlLinks || '-');
    function saveArchive() {
      if (!saveFormNow()) return false;
      try {
        const entries = archiveEntries(), pointer = localStorage.getItem(KEYS.pointer);
        const index = entries.findIndex(e => e.id === pointer), previous = entries[index];
        const standard = window.FSMOBILE_STANDARD.createArchiveEntry({ moduleId: MODULE_ID, title: archiveTitle(state), meta: { object: state.fields.objekt, date: state.fields.datum, type: 'Aufmaß Haspeltausch', anlage: state.fields.ansprechpartner }, data: collectData(), previous });
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
          '<div class="archive-detail-host"><div class="archive-detail"><div class="archive-detail-head"><span class="archive-type-badge">Aufmaß Haspeltausch</span><span class="archive-entry-date">' + esc(archiveDate(e.data?.fields?.datum)) + '</span></div>' +
          '<div class="archive-detail-object">Objekt: ' + esc(e.meta?.object || e.data?.fields?.objekt || 'nicht vorhanden') + '</div>' +
          '<div class="archive-detail-grid"><span class="archive-detail-pair"><b>Kunden Nr.: </b><span>' + esc(e.data?.fields?.kundenNr || 'nicht vorhanden') + '</span></span><span class="archive-detail-pair"><b>Name: </b><span>' + esc(e.data?.fields?.ansprechpartner || e.meta?.anlage || 'nicht vorhanden') + '</span></span></div>' +
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
        state = next; storageBlocked = false; render(); closeArchive(); notify('Archiv-Eintrag wurde geöffnet.');
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
      storageBlocked = false; state = blank(); render(); notify('Formular geleert.'); return true;
    }
    function pdfFileName(data) {
      return window.FSMOBILE_STANDARD.pdfFileName([data.fields.objekt || 'Aufmass_Haspeltausch', data.fields.datum || today()]);
    }
    window.FSMOBILE_PDF_EXPORT_FORMAT = 'zip';
    window.FSMOBILE_REPORT_EXPORT_FILE_NAME = () => pdfFileName(state).replace(/\.pdf$/, '.zip');
    function validateImport(payload) {
      if (payload?.kind !== 'fsmobile-aufmass-export' || payload.version !== 1 || payload.moduleId !== MODULE_ID || !isObject(payload.data?.fields) || !['', '19', '25'].includes(payload.data.fields.schlauchdurchmesser ?? '')) throw new Error('format');
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
        state = next; storageBlocked = false; render(); notify('Datei wurde importiert.'); return true;
      } catch (_) { notify('Datei konnte nicht importiert werden. Bitte eine gültige Haspeltausch-Aufmaßdatei wählen.'); return false; }
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
        const data = collectData(), f = data.fields, img = await imageForPdf(artwork);
        if (!window.jspdf?.jsPDF) throw new Error('PDF-Bibliothek ist nicht verfügbar.');
        const doc = new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true});
        const val = v => String(v ?? '').trim() || '-';
        let y = 44;
        function header() {
          doc.setFillColor(255,180,71);doc.rect(10,24,190,10,'F');doc.setTextColor(0);doc.setFont('helvetica','bold');doc.setFontSize(12);doc.text('Aufmaß Haspeltausch',14,30.7);
          doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.text(doc.splitTextToSize((f.objekt || 'Ohne Objekt').replace(/\s+/g,' '),182)[0],14,38);y=44;
        }
        function nextPage(){doc.addPage();header();}
        function ensure(h){if(y+h>280)nextPage();}
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
        function line(x1,y1,x2,y2,a){
          doc.setDrawColor(68,125,197);doc.setFillColor(68,125,197);doc.setLineWidth(.2);doc.line(x1,y1,x2,y2);
          const angle=Math.atan2(y2-y1,x2-x1),size=1;
          const arrow=(x,yy,theta)=>doc.triangle(x,yy,x-size*Math.cos(theta)+size/2*Math.sin(theta),yy-size*Math.sin(theta)-size/2*Math.cos(theta),x-size*Math.cos(theta)-size/2*Math.sin(theta),yy-size*Math.sin(theta)+size/2*Math.cos(theta),'F');
          if(a==='start'||a==='both')arrow(x1,y1,angle+Math.PI);if(a==='both')arrow(x2,y2,angle);
        }
        function drawDiagram(d,x,top,width){
          const s=width/d.w,[crop,ix,iy,iw,ih]=d.image,[cx,cy,cw,ch]=crop;
          const scale=iw/cw*s;
          doc.saveGraphicsState();doc.rect(x+ix*s,top+iy*s,iw*s,ih*s,null);doc.clip();doc.discardPath();
          doc.addImage(img,'PNG',x+ix*s-cx*scale,top+iy*s-cy*scale,767*scale,699*scale,'haspel-original');doc.restoreGraphicsState();
          d.lines.forEach(([x1,y1,x2,y2,a])=>line(x+x1*s,top+y1*s,x+x2*s,top+y2*s,a));
          d.fields.forEach(([key,label,fx,fy,fw])=>{
            const dx=x+fx*s,dy=top+fy*s,dw=fw*s;
            doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(0);
            const labels=doc.splitTextToSize(label,dw),value=val(f[key])+' mm';
            doc.setFillColor(255);doc.rect(dx-.5,dy-2.5,dw+1,labels.length*3+8,'F');doc.text(labels,dx,dy,{lineHeightFactor:1.2});
            const vy=dy+labels.length*3;doc.setDrawColor(165);doc.rect(dx,vy,dw,6);
            doc.setFontSize(Math.max(4,Math.min(8,8*(dw-3)/Math.max(doc.getTextWidth(value),1))));doc.text(value,dx+1,vy+4.1);
          });
        }
        function title(label){ensure(14);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(0);doc.text(label,14,y+4);y+=8;}
        header();
        metadataRow([['Objekt', f.objekt], ['Kunden Nr.', f.kundenNr]]);
        metadataRow([['Name', f.ansprechpartner], ['Datum', f.datum]]);
        title('Haspel und Stückzahlen');
        for(let i=0;i<productFields.length;i+=2){
          ensure(16);for(let j=0;j<2;j++){
            const [key,label,unit]=productFields[i+j],x=14+j*93;
            doc.setFillColor(247,248,251);doc.rect(x,y,89,15,'F');doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(0);doc.text(doc.splitTextToSize(label,84),x+2,y+3.5,{lineHeightFactor:1.2});
            doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(val(f[key])+' '+unit,x+2,y+12);
          }y+=15;
        }
        for(const d of diagrams.slice(0,2)){
          const h=d.h*182/d.w;ensure(h+10);title(d.name);drawDiagram(d,14,y,182);y+=h+4;
        }
        const smallWidth=81,smallHeight=diagrams[2].h*smallWidth/diagrams[2].w;ensure(smallHeight+12);
        diagrams.slice(2).forEach((d,i)=>{const x=14+i*94;doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(0);doc.text(d.name,x,y+4);drawDiagram(d,x,y+9,smallWidth);});
        for(let p=1;p<=doc.getNumberOfPages();p++){doc.setPage(p);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(80);doc.text('Seite '+p+' / '+doc.getNumberOfPages(),196,288,{align:'right'});}
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
    document.getElementById('productFields').innerHTML=productFields.map(([key,label,unit])=>key==='schlauchdurchmesser'?'<label class="field-group"><span>'+label+' (mm)</span><select data-field="'+key+'" aria-label="'+label+' (mm)"><option value="">Bitte auswählen</option><option value="19">19 mm</option><option value="25">25 mm</option></select></label>':numericInput(key,label,unit)).join('');
    document.getElementById('diagrams').innerHTML=diagrams.map(diagram).join('');
    document.getElementById('haspelForm').addEventListener('input',updateValue);
    document.getElementById('haspelForm').addEventListener('change',updateValue);
    document.getElementById('haspelForm').addEventListener('submit',e=>e.preventDefault());
    document.getElementById('archiveList').addEventListener('click',event=>{const open=event.target.closest('[data-archive-open]'),del=event.target.closest('[data-archive-delete]');if(open)openEntry(open.dataset.archiveOpen);if(del)deleteEntry(del.dataset.archiveDelete);});
    document.getElementById('archiveFilter').addEventListener('input',()=>{try{applyArchiveFilter();}catch(_){notify('Archiv konnte nicht gelesen werden.');}});
    document.getElementById('archiveCloseButton').addEventListener('click',closeArchive);
    document.getElementById('importFile').addEventListener('change',e=>importFile(e.target.files[0]));
    const actions={save:saveArchive,archive:openArchive,clear:clearForm,pdf:exportPdf,import:()=>document.getElementById('importFile').click()};
    Object.entries(actions).forEach(([key,action])=>document.querySelector('[data-global-action="'+key+'"]').addEventListener('click',action));
    document.addEventListener('visibilitychange',()=>{if(document.hidden)saveFormNow();});window.addEventListener('pagehide',saveFormNow);
    try{const raw=localStorage.getItem(KEYS.current);if(raw){const parsed=JSON.parse(raw);if(!isObject(parsed))throw new Error('draft');state=normalize(parsed);}}
    catch(_){storageBlocked=true;notify('Entwurf konnte nicht gelesen werden. Gespeicherte Daten bleiben erhalten; bitte vor dem Leeren ein Backup erstellen.');}
    render();
    window.FSMOBILE_MODULE_API=window.FSMOBILE_STANDARD.createModuleApi({moduleId:MODULE_ID,storage:KEYS,
      capabilities:{draft:true,archive:true,pdf:true,signatures:false,import:true,export:false},
      state:{collect:collectData,apply:applyData},lifecycle:{flush:saveFormNow},
      actions:Object.fromEntries(Object.entries(actions).map(([key,invoke])=>[key,{invoke,isDisabled:()=>busy}]))});
  }
  const css = `
    :root{--primary:#007aff;--accent:#ff9500;--text:#1c1c1e;--muted:#454b55}*{box-sizing:border-box}html{background:transparent;-webkit-text-size-adjust:100%}body{margin:0;background:transparent;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Arial,sans-serif}input,textarea,select,button{font:inherit}.container{width:min(100%,1180px);margin:auto;padding:18px}h1{font-size:34px;font-weight:850;margin:4px 0 18px}h2{font-size:22px}h3{font-size:18px;margin:20px 0 12px}.form-section{padding:16px;margin:0 0 16px;border:1px solid #d8dee7;border-radius:22px;background:rgba(248,250,252,.8)}.section-heading{display:flex;align-items:center;gap:10px}.section-heading:before{content:'';width:4px;height:20px;border-radius:3px;background:var(--accent)}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.field-group{display:flex;flex-direction:column;gap:6px;min-width:0;font-size:13px;font-weight:700}.field-group>span{color:var(--muted)}input:not([type=checkbox]),textarea,select{width:100%;min-height:46px;border:1px solid #c4cbd4;border-radius:10px;padding:10px 12px;background:#fff;color:var(--text);font-size:16px;font-weight:400}textarea{resize:none;overflow:hidden;line-height:1.4}input:focus,textarea:focus{outline:3px solid #007aff33;border-color:#007aff}input[aria-invalid=true]{outline:2px solid #ff3b30}button{min-width:44px;min-height:46px;border:0;border-radius:999px;padding:10px 18px;background:linear-gradient(#2f93ff,#0a84ff);color:#fff;font-size:15px;font-weight:800;cursor:pointer}button:disabled{opacity:.45;cursor:default}button:focus-visible,summary:focus-visible{outline:3px solid #007aff66;outline-offset:3px}.row-actions,.position-footer{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.row-actions{justify-content:flex-end;margin:0 0 16px}.position-footer{justify-content:space-between}.position-count{font-size:14px;color:var(--muted)}button[data-fsmobile-action=copy]{background:#5856d6}button[data-fsmobile-action=delete]{background:#ff3b30}button[data-fsmobile-action=add]{background:#34c759}.global-actions{display:flex;flex-wrap:wrap;gap:8px}.fsmobile-parent-actions-active .global-actions{display:none}.position>summary{cursor:pointer;min-height:52px;list-style-position:inside;padding:4px 0 12px;font-size:18px;overflow-wrap:anywhere}.position>summary strong{margin-right:14px}.position>summary span{display:block;padding:6px 0 0 21px;font-size:14px;color:var(--muted);font-weight:400}.position-content{padding-top:8px}.position-meta{margin-bottom:18px}fieldset{border:0;padding:0;margin:18px 0;min-width:0}legend{font-size:13px;font-weight:700;padding:0 0 8px}.choice-grid{display:flex;flex-wrap:wrap;gap:8px}.choice{display:flex;align-items:center;gap:9px;min-height:46px;padding:10px 12px;border:1px solid #c4cbd4;border-radius:10px;background:rgba(255,255,255,.8);cursor:pointer;font-size:14px;font-weight:600}.choice:has(input:checked){border-color:#e49525;background:#fff5df}.choice input{width:20px;height:20px;flex:none;accent-color:#e28a00}.choice span{flex:1}.choice img{width:30px;height:40px;object-fit:contain}.measures{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.measures .choice{align-items:flex-start;flex-wrap:wrap}.measures .choice img{width:46px;height:60px;margin-left:auto}.diagrams{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.measure-board{margin:0;padding:12px;background:#fff;border:1px solid #d8dee7;border-radius:16px;min-width:0}.measure-board figcaption{font-size:14px;font-weight:750;margin-bottom:10px;color:#454b55}.kranz-board{grid-column:1/-1}.diagram{position:relative;width:100%}.diagram>svg{display:block;width:100%;height:100%}.dimension{position:absolute;min-width:0}.dimension-label{display:block;font-size:12px;font-weight:650;line-height:1.25;margin-bottom:5px;background:#fff;width:fit-content}.dimension-values{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto;gap:4px;align-items:center;font-size:13px;background:#fff}.dimension-values.single{grid-template-columns:minmax(0,1fr) auto}.dimension-values input{padding:8px 5px;text-align:center}.unit{font-size:11px}.water-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,.6fr);align-items:center;gap:18px}.archive-overlay[hidden]{display:none}.archive-overlay{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:18px;background:#1c1c1e55}.archive-dialog{width:min(100%,820px);max-height:90vh;display:flex;flex-direction:column;background:#f8fafc;border-radius:22px;overflow:hidden}.archive-header{display:flex;justify-content:space-between;align-items:center;padding:16px;gap:12px}.archive-header h2{margin:0}.archive-close-btn{background:#8e8e93}.archive-filter-tools{display:flex;align-items:center;gap:12px;padding:0 16px 14px}.archive-filter-count,#archiveFilterCount{white-space:nowrap}.archive-filter-input{min-width:0;flex:1}.archive-list{overflow:auto;padding:12px;display:grid;gap:10px}.archive-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:center;padding:14px;border:1px solid #d8dee7;border-radius:14px;background:#fff}.archive-item-current{border-color:#007aff;box-shadow:0 0 0 1px #007aff}.archive-title{font-weight:800;overflow-wrap:anywhere}.archive-meta{font-size:12px;line-height:1.4;margin-top:5px;color:#454b55;overflow-wrap:anywhere}.archive-empty{padding:24px;text-align:center}#importFile{display:none}@media(max-width:700px){.diagrams{grid-template-columns:1fr}.kranz-board{grid-column:auto}.kranz-board .diagram{min-width:600px}.kranz-board{overflow-x:auto}.measures{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}.water-row{grid-template-columns:1fr}.archive-item{grid-template-columns:1fr}.container{padding:12px}}
  `;
  const localCss = `.input-unit{display:flex;align-items:center;gap:6px;min-width:0}.input-unit input{min-width:0;flex:1}.unit{font-size:12px;font-weight:500;flex:none}.dimension-label{line-height:1.2;font-size:12px}.dimension .input-unit{background:#fff}.dimension input{padding:8px 5px;text-align:center}.diagrams{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.diagrams .measure-board:nth-child(-n+2){grid-column:1/-1}.diagram .original-view{overflow:hidden}.form-grid .wide{grid-column:1/-1}#importFile{display:none}@media(max-width:700px){.diagrams{grid-template-columns:1fr}.measure-board{overflow-x:auto}.diagrams>.measure-board:nth-child(-n+2) .diagram{min-width:640px}}`;
  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Aufmaß Haspeltausch</title><script defer src="vendor/jspdf.umd.min.js"></script><style>${css}${localCss}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid>*{order:initial!important;grid-column:auto!important}@media(max-width:600px){html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid{grid-template-columns:1fr!important}}</style></head><body><main class="container"><h1>Aufmaß Haspeltausch</h1><div class="global-actions"><button type="button" class="archive-save" data-global-action="save">Im Archiv speichern</button><button type="button" class="archive-btn" data-global-action="archive">Archiv</button><button type="button" class="fsmobile-data-import" data-global-action="import">Import</button><button type="button" class="clear-btn" data-global-action="clear">Leeren</button><button type="button" class="pdf-btn" data-global-action="pdf">PDF</button></div><form id="haspelForm"><section class="form-section"><h2 class="section-heading">Stammdaten</h2><div class="form-grid aufmass-stammdaten"><label class="field-group"><span>Objekt</span><textarea id="objekt" rows="1" data-field="objekt"></textarea></label><label class="field-group"><span>Kunden Nr.</span><input id="kundenNr" type="text" data-field="kundenNr"></label><label class="field-group"><span>Name</span><textarea id="ansprechpartner" rows="1" data-field="ansprechpartner"></textarea></label><label class="field-group"><span>Datum</span><input id="datum" type="date" data-field="datum"></label></div></section><section class="form-section"><h2 class="section-heading">Haspel und Stückzahlen</h2><div class="form-grid" id="productFields"></div></section><section class="form-section"><h2 class="section-heading">Abmessungen Wandhydrant / Haspelfach</h2><div class="diagrams" id="diagrams"></div></section></form><input type="file" id="importFile" accept=".json,.zip,application/json,application/zip"></main><div id="archiveOverlay" class="archive-overlay" hidden><div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle"><div class="archive-header"><h2 id="archiveTitle">Archiv – Aufmaß Haspeltausch</h2><button type="button" id="archiveCloseButton" class="archive-close-btn">Schließen</button></div><div class="archive-filter-tools"><input id="archiveFilter" class="archive-filter-input" type="search" placeholder="Objekt, Kunden Nr., Name, Datum …" aria-label="Archiv filtern"><span id="archiveFilterCount"></span></div><div id="archiveList" class="archive-list"></div></div></div><script>(${runtime.toString()})();</script></body></html>`;
  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES[moduleId] = {title:'Aufmaß Haspeltausch',group:'Kalkulation',description:'Schlauchhaspeln, Anschlussseiten und Einbaumaße mit Originalzeichnungen aufnehmen.',html,apiContract:{version:1,storage,capabilities}};
}());
