(function () {
  "use strict";
  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES["pb-loeschwasser-nass-whd"] = {
    "title": "Löschwassereinrichtung Nass mit WHD Einzelprüfung",
    "group": "Prüfberichte",
    "description": "Löschwassereinrichtung Nass mit Leitungsstrang-Messwerten und vollständiger Wandhydranten-Einzelprüfung.",
    "apiContract": {"version": 1, "storage": {"current": "pb-loeschwasser-nass-whd-current-v1", "archive": "pb-loeschwasser-nass-whd-archive-v1", "pointer": "pb-loeschwasser-nass-whd-current-archive-id-v1"}, "capabilities": {"draft": true, "archive": true, "pdf": true, "signatures": true, "import": true, "export": true}},
    html: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Prüfbericht Löschwassereinrichtung Nass mit WHD Einzelprüfung</title>
  <meta name="theme-color" content="#d6001c" />
  <style>
    :root {
      --primary: #007aff;
      --success: #34c759;
      --danger: #ff3b30;
      --neutral: #8e8e93;
      --warning: #ff9500;
      --bg: #f4f4f6;
      --card: #ffffff;
      --field: rgba(255,255,255,.03);
      --text: #1c1c1e;
      --muted: #6e6e73;
      --line: rgba(60, 60, 67, .14);
      --radius: 16px;
      --shadow: 0 8px 28px rgba(0,0,0,.08);
      --ios-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    body {
      margin: 0;
      padding: 18px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Arial, sans-serif;
    }
    .container {
      width: min(100%, 1280px);
      margin: 0 auto;
      padding: 20px;
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }
    .title-bar,
    .archive-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title-bar { margin-bottom: 16px; }
    .title-actions,
    .actions,
    .signature-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .title-actions {
      justify-content: flex-end;
      padding: 12px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.36);
      border-radius: var(--radius);
      box-shadow: 0 8px 24px rgba(0,0,0,.06);
      -webkit-backdrop-filter: blur(18px);
      backdrop-filter: blur(18px);
    }
    h1 { margin: 0; font-size: 34px; line-height: 1.1; letter-spacing: 0; }
    h2, h3, label { letter-spacing: 0; }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .grid.one { grid-template-columns: 1fr; }
    .grid.two { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
    .grid.three { grid-template-columns: repeat(3, minmax(160px, 1fr)); }
    .field { min-width: 0; display: flex; flex-direction: column; }
    label {
      margin: 0 0 6px;
      color: var(--muted);
      font-size: 15px;
      font-weight: 700;
    }
    input[type="text"],
    input[type="date"],
    input[type="number"],
    textarea,
    select {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border: 0;
      border-radius: 12px;
      background: var(--field);
      color: var(--text);
      font: inherit;
      font-size: 16px;
      font-weight: 650;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    textarea {
      min-height: 110px;
      resize: vertical;
      line-height: 1.35;
      text-align: left;
    }
    input:focus,
    textarea:focus,
    select:focus { box-shadow: 0 0 0 3px rgba(214,0,28,.18); }
    button {
      min-height: 46px;
      padding: 12px 18px;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      font: inherit;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0;
      color: #ffffff;
      background: linear-gradient(180deg, #1688ff 0%, var(--primary) 100%);
      box-shadow: 0 10px 20px rgba(0,122,255,.24), inset 0 1px 0 rgba(255,255,255,.32);
      transition: transform .18s var(--ios-ease), box-shadow .18s var(--ios-ease), filter .18s var(--ios-ease);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    button:hover { filter: brightness(1.02); }
    button:active { transform: scale(.975); }
    .success { background: linear-gradient(180deg, #40d96a 0%, var(--success) 100%); }
    .danger { background: linear-gradient(180deg, #ff453a 0%, var(--danger) 100%); }
    .secondary { background: linear-gradient(180deg, #a6a6ad 0%, var(--neutral) 100%); }
    .archive-save { background: linear-gradient(180deg, #ffb340 0%, var(--warning) 100%); }
    .card {
      margin-top: 16px;
      padding: 16px;
      border-radius: 16px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.42);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05);
      -webkit-backdrop-filter: blur(24px) saturate(1.18);
      backdrop-filter: blur(24px) saturate(1.18);
    }
    .section-title { margin: 0 0 12px; font-size: 22px; line-height: 1.2; }
    .check-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .check-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(120px, 170px);
      gap: 10px;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(255,255,255,.045);
    }
    .check-label { font-weight: 780; line-height: 1.25; }
    .hint {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.35;
    }
    .dynamic-list { display: grid; gap: 10px; }
    .strand-row {
      display: grid;
      grid-template-columns: 64px repeat(4, minmax(120px, 1fr)) auto;
      gap: 10px;
      align-items: end;
      padding: 12px;
      background: rgba(255,255,255,.045);
      border-radius: 14px;
    }
    .row-number {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(255,255,255,.08);
      font-weight: 800;
    }
    .input-unit {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding-right: 10px;
      border-radius: 12px;
      background: var(--field);
    }
    .input-unit input { min-height: 44px; background: transparent; }
    .unit { color: var(--muted); font-weight: 850; white-space: nowrap; }
    .actions { margin-top: 16px; }
    .signature-block {
      margin-top: 16px;
      padding: 14px;
      background: var(--field);
      border-radius: 14px;
    }
    .signature-block h3 { margin: 0 0 10px; font-size: 18px; }
    #signaturePad {
      display: block;
      width: 100%;
      height: 180px;
      border: 2px dashed rgba(255,255,255,.5);
      border-radius: 12px;
      background: rgba(255,255,255,.08);
      touch-action: none;
    }
    .signature-actions { margin-top: 16px; }
    .archive-status {
      min-height: 18px;
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
    }
    .archive-overlay[hidden] { display: none; }
    .archive-overlay {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0,0,0,.34);
    }
    .archive-dialog {
      width: min(760px, 100%);
      max-height: min(680px, 90vh);
      overflow: auto;
      padding: 18px;
      background: var(--card);
      border-radius: 20px;
      box-shadow: 0 24px 70px rgba(0,0,0,.25);
    }
    .archive-header h2 { margin: 0; font-size: 24px; }
    .archive-list { display: grid; gap: 10px; margin-top: 14px; }
    .archive-empty { margin: 0; color: var(--muted); font-weight: 700; }
    .archive-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 10px;
      align-items: center;
      padding: 12px;
      background: var(--field);
      border-radius: 14px;
    }
    .archive-title { font-weight: 850; overflow-wrap: anywhere; }
    .archive-meta { margin-top: 3px; color: var(--muted); font-size: 13px; font-weight: 700; }
    body.generating-pdf .title-actions,
    body.generating-pdf .actions,
    body.generating-pdf .hydrant-actions,
    body.generating-pdf .signature-actions,
    body.generating-pdf .archive-status { display: none !important; }
    body { padding: 0 !important; background: transparent !important; }
    .container { width: 100% !important; max-width: none !important; margin: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
    .title-actions { padding: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
    .title-bar > .title-actions, header > .title-actions, header > .toolbar { margin-right: calc(86px + env(safe-area-inset-right, 0px)) !important; }
    body.generating-pdf .title-bar > .title-actions, body.generating-pdf header > .title-actions, body.generating-pdf header > .toolbar { margin-right: 0 !important; }
    @media (max-width: 980px) {
      .grid, .grid.one, .grid.two, .grid.three, .check-grid { grid-template-columns: 1fr; }
      .strand-row { grid-template-columns: 64px 1fr; }
      .strand-row .field { grid-column: 1 / -1; }
      .strand-row > button { grid-column: 1 / -1; justify-self: start; min-width: max-content; }
      .title-bar, .archive-header { align-items: stretch; flex-direction: column; }
      .title-actions, .title-actions button, .archive-header button { width: 100%; }
    }
    @media (max-width: 720px) {
      .title-bar > .title-actions, header > .title-actions, header > .toolbar { margin-right: 0 !important; }
    }
  

    /* Hochformat-Transparenz: Unterschrift und lokale Formularflächen */
    .input-unit,
    .archive-item,
    .row-number,
    .cell-number,
    .hydrant-number,
    .card,
    .check-item,
    .result-item,
    .dynamic-row,
    .strand-row,
    .cell-row,
    .signature-block,
    .signature-wrap {
      border: 1px solid rgba(255,255,255,.42) !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.06) 58%, rgba(235,0,69,.035)),
        rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    #signaturePad,
    .signature-wrap canvas,
    canvas.signature-pad {
      border: 2px dashed rgba(255,255,255,.5) !important;
      background: rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(235,0,69,.035) !important;
    }

    .input-unit input,
    .input-unit select,
    .card input,
    .card textarea,
    .card select,
    .signature-block input,
    .signature-block textarea,
    .signature-block select,
    .signature-wrap input,
    .signature-wrap textarea,
    .signature-wrap select {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
    }

    .signature-actions {
      background: transparent !important;
      border-color: rgba(255,255,255,.28) !important;
      box-shadow: none !important;
    }

    .title-actions,
    .button-area,
    .toolbar {
      background: rgba(255,255,255,.08) !important;
      border-color: rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 8px 24px rgba(0,0,0,.045) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    .row-number,
    .cell-number,
    .hydrant-number {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
    }

    /* FSMobile report dropdown height alignment */
    select,
    .card select,
    .field select,
    .input-unit select,
    .dynamic-row select,
    .measurement-row select,
    .cell-row select,
    .signature-block select,
    .signature-wrap select {
      min-height: 44px !important;
      height: 44px !important;
      padding: 10px 12px !important;
      line-height: 1.25 !important;
      display: block !important;
      align-self: stretch !important;
    }


    .whd-card { margin: 14px 0; padding: 16px; border: 1px solid var(--line); border-radius: 22px; }
    .whd-card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .whd-title { margin: 0; font-size: 20px; }
    .field-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .whd-card .check-item { display: flex; justify-content: flex-start; min-height: 46px; gap: 10px; }
    .whd-card input[type="checkbox"] { width: 22px; min-width: 22px; height: 22px; min-height: 22px; margin: 0; }
    .whd-card textarea { min-height: 46px; overflow-y: hidden; resize: none; }
    .duplicate-btn { background: #5856d6; }
    .archive-item-current { border: 2px solid #007aff; }
    .archive-filter { display: block; margin: 12px 0; }
    .archive-item[hidden] { display: none; }
    @media (max-width: 900px) { .field-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 550px) { .field-grid { grid-template-columns: minmax(0, 1fr); } }
  </style>
</head>
<body>
  <div class="container" id="reportRoot">
    <div class="title-bar">
      <h1>Prüfbericht Löschwassereinrichtung Nass mit WHD Einzelprüfung</h1>
      <div class="title-actions" aria-label="Archivaktionen">
        <button type="button" onclick="saveCurrentReportToArchive()" class="archive-save">Im Archiv speichern</button>
        <button type="button" onclick="openArchive()" class="archive-open">Archiv</button>
      </div>
    </div>

    <section class="card">
      <h2 class="section-title">Zuordnung</h2>
      <div class="grid">
        <div class="field">
          <label for="anlageInput">Anlagen Nr.</label>
          <input id="anlageInput" name="anlage" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="objectInput">Objekt</label>
          <input id="objectInput" name="object" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="anlagenstandortInput">Anlagenstandort</label>
          <input id="anlagenstandortInput" name="anlagenstandort" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="dateInput">Datum</label>
          <input id="dateInput" name="date" type="date" />
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Anlagentyp</h2>
      <div class="grid one">
        <div class="field">
          <label for="anlagentypSelect">Anlagentyp</label>
          <select id="anlagentypSelect" name="anlagentyp">
            <option>Löschwasserleitung nass</option>
            <option>Löschwasserleitung nass /trocken</option>
          </select>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Anlagenausführung</h2>
      <div class="grid">
        <div class="field"><label for="geschossAnzahlInput">Anzahl Geschosse</label><input id="geschossAnzahlInput" name="geschossAnzahl" type="number" min="0" inputmode="numeric" /></div>
        <div class="field"><label for="schlauchanschlussAnzahlInput">Anzahl Schlauchanschlüsse</label><input id="schlauchanschlussAnzahlInput" name="schlauchanschlussAnzahl" type="number" min="0" inputmode="numeric" /></div>
        <div class="field"><label for="endtasterAnzahlInput">Schlauchanschlüsse mit Endtaster</label><input id="endtasterAnzahlInput" name="endtasterAnzahl" type="number" min="0" inputmode="numeric" /></div>
        <div class="field"><label for="faltschlauchLaengeInput">Schlauchlänge Faltschlauch</label><div class="input-unit"><input id="faltschlauchLaengeInput" name="faltschlauchLaenge" type="number" step="0.1" inputmode="decimal" /><span class="unit">m</span></div></div>
        <div class="field"><label for="druckschlauchLaengeInput">Schlauchlänge formbeständiger Druckschlauch</label><div class="input-unit"><input id="druckschlauchLaengeInput" name="druckschlauchLaenge" type="number" step="0.1" inputmode="decimal" /><span class="unit">m</span></div></div>
        <div class="field">
          <label for="wandhydrantAusfuehrungSelect">Wandhydrant Ausführung</label>
          <select id="wandhydrantAusfuehrungSelect" name="wandhydrantAusfuehrung">
            <option>Typ F</option>
            <option>Typ S</option>
          </select>
        </div>
      </div>
      <div class="check-grid" id="anlageChecks"></div>
    </section>

    <section class="card">
      <h2 class="section-title">Messwerte Leitungsstrang</h2>
      <div class="dynamic-list" id="strandList"></div>
      <div class="actions">
        <button type="button" class="success" onclick="addStrand()">Leitungsstrang hinzufügen</button>
        <button type="button" class="danger" onclick="removeStrand()">Letzten Leitungsstrang löschen</button>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Schlauchprüfung</h2>
      <div class="check-grid" id="hoseChecks"></div>
      <div class="grid two" style="margin-top:12px">
        <div class="field"><label for="lastHoseDateInput">Letzte Schlauchdruckprüfung</label><input id="lastHoseDateInput" name="lastHoseDate" type="date" /></div>
        <div class="field"><label for="nextHoseDateInput">Nächste Schlauchdruckprüfung</label><input id="nextHoseDateInput" name="nextHoseDate" type="date" /></div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Wasseranschluss</h2>
      <div class="check-grid" id="waterChecks"></div>
      <div class="grid one" style="margin-top:12px">
        <div class="field">
          <label for="anschlussSelect">Anschluss</label>
          <select id="anschlussSelect" name="anschluss">
            <option>Mittelbarer Anschluss getrennt</option>
            <option>Unmittelbarer Anschluss am Trinkwassernetz</option>
          </select>
          <p class="hint">Bei unmittelbarem Anschluss an das Trinkwassernetz sind nach Trinkwasserverordnung Maßnahmen zu treffen, um eine Verkeimung des Wassers durch die Löschanlage zu verhindern.</p>
        </div>
      </div>
    </section>

    <section class="card" id="whdSection">
      <h2 class="section-title">Einzelprüfung Wandhydranten</h2>
      <div id="whdList"></div>
      <div class="actions">
        <button type="button" class="success" onclick="addWhd()">Wandhydrant hinzufügen</button>
        <button type="button" class="duplicate-btn" onclick="duplicateLastWhd()">Duplizieren</button>
        <button type="button" class="danger" onclick="removeLastWhd()">Letzten löschen</button>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfergebnis</h2>
      <div class="grid one">
        <div class="field">
          <label for="pruefergebnisSelect">Prüfergebnis</label>
          <select id="pruefergebnisSelect" name="pruefergebnis">
            <option>Anlage nicht einsatzbereit</option>
            <option>Anlage bedingt einsatzbereit</option>
            <option>Anlage einsatzbereit</option>
          </select>
        </div>
        <div class="field">
          <label for="bemerkungInput">Bemerkung</label>
          <textarea id="bemerkungInput" name="bemerkung"></textarea>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfer und Unterschrift</h2>
      <div class="grid one">
        <div class="field">
          <label for="prueferInput">Prüfer</label>
          <input id="prueferInput" name="pruefer" type="text" autocomplete="off" />
        </div>
      </div>
      <div class="signature-block">
        <h3>Unterschrift Techniker</h3>
        <canvas id="signaturePad" aria-label="Unterschrift Techniker"></canvas>
        <div class="signature-actions">
          <button type="button" onclick="clearSignature()" class="danger">Unterschrift löschen</button>
        </div>
      </div>
      <p style="margin:12px 0 0;color:var(--muted);font-weight:700;font-size:13px">Wir weisen auf die 3-jährliche Sachverständigenprüfpflicht nach TPrüfVO Hessen hin.</p>
    </section>

    <div class="actions">
      <button type="button" class="secondary clear-btn" id="clearButton" onclick="clearForm()">Leeren</button>
      <button type="button" id="pdfButton" class="pdf-btn" onclick="exportPdf()">PDF</button>
    </div>
  </div>

  <div class="archive-overlay" id="archiveOverlay" hidden>
    <div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle">
      <div class="archive-header">
        <h2 id="archiveTitle">Archiv</h2>
        <button type="button" class="secondary archive-close-btn" onclick="closeArchive()">Schließen</button>
      </div>
      <div class="archive-filter-tools"><input id="archiveFilter" class="archive-filter-input" type="search" autocomplete="off" aria-label="Archiv filtern" placeholder="Objekt, Anlagen Nr., Datum oder Berichtstyp" oninput="renderArchiveList()" /><span class="archive-filter-count" aria-live="polite"></span></div>
      <div class="archive-list" id="archiveList"></div>
    </div>
  </div>

  <script>
    const MODULE_ID = "pb-loeschwasser-nass-whd";
    const REPORT_TITLE = "Löschwassereinrichtung Nass mit WHD Einzelprüfung";
    const STORAGE_KEY = "pb-loeschwasser-nass-whd-current-v1";
    const ARCHIVE_STORAGE_KEY = "pb-loeschwasser-nass-whd-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "pb-loeschwasser-nass-whd-current-archive-id-v1";
    const CHECK_FIELDS = [
      ["haspelRichtung", "Abrollrichtung der Haspel in Ordnung", "anlageChecks"],
      ["beschilderung", "Beschilderung vorhanden", "anlageChecks"],
      ["bedienungsanleitung", "Bedienungsanleitung vorhanden", "anlageChecks"],
      ["anschlussventil", "Anschlussventil leichtgängig", "anlageChecks"],
      ["entlueftung", "Entlüftung vorhanden", "anlageChecks"],
      ["entleerungNassTrocken", "Entleerung vorhanden bei nass/trocken", "anlageChecks"],
      ["fliessdruckKleiner85", "Fließdruck an den Ventilen kleiner 8 bar", "anlageChecks"],
      ["standdruckKleiner12", "Standdruck an den Ventilen kleiner 12 bar", "anlageChecks"],
      ["schlaeucheGeprueft", "Schläuche geprüft", "hoseChecks"],
      ["strahlrohrGeprueft", "Strahlrohr / Eurodüse geprüft", "hoseChecks"],
      ["druckerhoehungsanlage", "Druckerhöhungsanlage vorhanden", "waterChecks"],
      ["fuellstation", "Nass-/Trocken Füllstation vorhanden", "waterChecks"]
    ];
    const SELECT_OPTIONS = {
      bauart: ["", "Aufputz", "Unterputz"],
      strahlrohr: ["", "Eurodüse", "Mehrzweckstrahlrohr", "Hohlstrahlrohr"],
      ausfuehrung: ["", "Typ S", "Typ F", "Schaum Wasser"],
      schlauchart: ["", "C42", "C52", "Formstabil"],
      schlauchlaenge: ["", "15m", "20m", "25m", "30m", "35m", "40m"]
    };
    const WHD_CHECK_FIELDS = [
      ["zugangFrei", "Zugang frei"],
      ["kennzeichnung", "Kennzeichnung ist vorhanden"],
      ["bedienungsanleitung", "Bedienungsanleitung ist vorhanden und gut lesbar"],
      ["tuerenVerriegelung", "Türen und Verriegelung ist funktionsfähig"],
      ["schlauchhaspelUnbeschaedigt", "Schlauchhaspel ist unbeschädigt"],
      ["wasserfuehrendeTeileDicht", "Wasserführende Teile der Schlauchhaspel sind dicht"],
      ["schwenkbar", "Schlauchhaspel um 180° schwenkbar"],
      ["dinKennzeichnung", "DIN Kennzeichnung und Prüfnummer am Schlauch"],
      ["schlauchanschlussventil", "Schlauchanschlussventil ist leichtgängig und dicht"],
      ["eurodueseStrahlrohr", "Eurodüse / Strahlrohr leichtgängig und dicht"]
    ];
    const FIELD_LABELS = {
      standort: "Standort",
      bauart: "Bauart",
      strahlrohr: "Strahlrohr",
      ausfuehrung: "Ausführung",
      schlauchart: "Schlauchart",
      schlauchlaenge: "Schlauchlänge",
      ruhedruck: "Ruhedruck",
      fliessdruck: "Fließdruck",
      fliessmenge: "Fließmenge",
      naechstePruefung: "Nächste Prüfung",
      bemerkung: "Bemerkung"
    };
    function createField(labelText, field) {
      const wrapper = document.createElement("div");
      wrapper.className = "field";
      const label = document.createElement("label");
      label.htmlFor = field.id;
      label.textContent = labelText;
      wrapper.append(label, field);
      return wrapper;
    }

    function fillSelect(select, options) {
      select.innerHTML = "";
      options.forEach(optionValue => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue || "Bitte auswählen";
        select.appendChild(option);
      });
    }

    function autoResizeTextarea(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = \`\${Math.max(44, textarea.scrollHeight)}px\`;
    }

    function numberWhdCard(card, number) {
      card.dataset.whdNumber = String(number);
      card.querySelector(".whd-title").textContent = \`Wandhydrant Nr. \${number}\`;
      card.querySelectorAll("[data-field]").forEach(field => {
        const key = field.dataset.field;
        field.id = \`whd\${number}-\${key}\`;
        field.name = \`whd\${number}-\${key}\`;
        const label = card.querySelector(\`label[data-label-for="\${key}"]\`);
        if (label) label.htmlFor = field.id;
      });
    }

    function renumberWhd() {
      document.querySelectorAll(".whd-card").forEach((card, index) => numberWhdCard(card, index + 1));
    }

    function addWhd(values = {}, options = {}) {
      const liveList = document.getElementById("whdList");
      const list = options.target || liveList;
      const number = options.number || liveList.children.length + 1;
      const card = document.createElement("section");
      card.className = "whd-card";
      card._source = { ...values };
      card.dataset.whdNumber = String(number);

      const header = document.createElement("div");
      header.className = "whd-card-header";
      const title = document.createElement("h2");
      title.className = "whd-title";
      title.textContent = \`Wandhydrant Nr. \${number}\`;
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "danger";
      removeButton.textContent = "Löschen";
      removeButton.addEventListener("click", () => {
        if (document.querySelectorAll(".whd-card").length <= 1) {
          clearWhdCard(card);
        } else {
          card.remove();
          renumberWhd();
        }
        scheduleStorageSave();
      });
      header.append(title, removeButton);

      const grid = document.createElement("div");
      grid.className = "field-grid";

      const standort = document.createElement("textarea");
      standort.dataset.field = "standort";
      standort.value = values.standort || "";
      standort.addEventListener("input", () => autoResizeTextarea(standort));

      const bauart = document.createElement("select");
      bauart.dataset.field = "bauart";
      fillSelect(bauart, SELECT_OPTIONS.bauart);
      bauart.value = values.bauart || "";

      const strahlrohr = document.createElement("select");
      strahlrohr.dataset.field = "strahlrohr";
      fillSelect(strahlrohr, SELECT_OPTIONS.strahlrohr);
      strahlrohr.value = values.strahlrohr || "";

      const ausfuehrung = document.createElement("select");
      ausfuehrung.dataset.field = "ausfuehrung";
      fillSelect(ausfuehrung, SELECT_OPTIONS.ausfuehrung);
      ausfuehrung.value = values.ausfuehrung || "";

      const schlauchart = document.createElement("select");
      schlauchart.dataset.field = "schlauchart";
      fillSelect(schlauchart, SELECT_OPTIONS.schlauchart);
      schlauchart.value = values.schlauchart || "";

      const schlauchlaenge = document.createElement("select");
      schlauchlaenge.dataset.field = "schlauchlaenge";
      fillSelect(schlauchlaenge, SELECT_OPTIONS.schlauchlaenge);
      schlauchlaenge.value = values.schlauchlaenge || "";

      const ruhedruck = document.createElement("input");
      ruhedruck.type = "number";
      ruhedruck.step = "0.01";
      ruhedruck.inputMode = "decimal";
      ruhedruck.dataset.field = "ruhedruck";
      ruhedruck.value = values.ruhedruck || "";

      const fliessdruck = document.createElement("input");
      fliessdruck.type = "number";
      fliessdruck.step = "0.01";
      fliessdruck.inputMode = "decimal";
      fliessdruck.dataset.field = "fliessdruck";
      fliessdruck.value = values.fliessdruck || "";

      const fliessmenge = document.createElement("input");
      fliessmenge.type = "number";
      fliessmenge.step = "1";
      fliessmenge.inputMode = "decimal";
      fliessmenge.dataset.field = "fliessmenge";
      fliessmenge.value = values.fliessmenge || "";

      const naechstePruefung = document.createElement("input");
      naechstePruefung.type = "text";
      naechstePruefung.inputMode = "numeric";
      naechstePruefung.placeholder = "mm.jjjj";
      naechstePruefung.dataset.field = "naechstePruefung";
      naechstePruefung.value = values.naechstePruefung || "";

      const bemerkung = document.createElement("textarea");
      bemerkung.dataset.field = "bemerkung";
      bemerkung.value = values.bemerkung || "";
      bemerkung.addEventListener("input", () => autoResizeTextarea(bemerkung));

      [
        ["standort", "Standort", standort],
        ["bauart", "Bauart", bauart],
        ["strahlrohr", "Strahlrohr", strahlrohr],
        ["ausfuehrung", "Ausführung", ausfuehrung],
        ["schlauchart", "Schlauchart", schlauchart],
        ["schlauchlaenge", "Schlauchlänge", schlauchlaenge],
        ["ruhedruck", "Ruhedruck in MPa", ruhedruck],
        ["fliessdruck", "Fließdruck in MPa", fliessdruck],
        ["fliessmenge", "Fließmenge in l/min", fliessmenge],
        ["naechstePruefung", "Nächste Prüfung", naechstePruefung],
        ["bemerkung", "Bemerkung", bemerkung]
      ].forEach(([key, labelText, field]) => {
        field.dataset.field = key;
        const wrapper = createField(labelText, field);
        wrapper.querySelector("label").dataset.labelFor = key;
        grid.appendChild(wrapper);
      });

      const checkGrid = document.createElement("div");
      checkGrid.className = "check-grid";
      WHD_CHECK_FIELDS.forEach(([key, labelText]) => {
        const label = document.createElement("label");
        label.className = "check-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.field = key;
        checkbox.checked = values[key] === true || values[key] === "true";
        label.append(checkbox, document.createTextNode(labelText));
        checkGrid.appendChild(label);
      });

      card.append(header, grid, checkGrid);
      list.appendChild(card);
      if (options.batch) {
        numberWhdCard(card, number);
      } else {
        renumberWhd();
        card.querySelectorAll("textarea").forEach(autoResizeTextarea);
        scheduleStorageSave();
      }
      return card;
    }

    function renderWhdRows(rows) {
      const list = document.getElementById("whdList");
      const fragment = document.createDocumentFragment();
      rows.forEach((row, index) => addWhd(row, { target: fragment, number: index + 1, batch: true }));
      list.replaceChildren(fragment);
    }

    function clearWhdCard(card) {
      card._source = {};
      card.querySelectorAll("input, textarea").forEach(field => {
        if (field.type === "checkbox") field.checked = false;
        else field.value = "";
      });
      card.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0;
      });
      card.querySelectorAll("textarea").forEach(autoResizeTextarea);
    }

    function duplicateLastWhd() {
      const cards = document.querySelectorAll(".whd-card");
      const last = cards[cards.length - 1];
      if (!last) return;
      addWhd(readWhdCard(last));
    }

    function removeLastWhd() {
      const cards = document.querySelectorAll(".whd-card");
      if (cards.length <= 1) {
        if (cards[0]) clearWhdCard(cards[0]);
      } else {
        cards[cards.length - 1].remove();
        renumberWhd();
      }
      scheduleStorageSave();
    }

    function readWhdCard(card) {
      const data = { ...card._source };
      card.querySelectorAll("[data-field]").forEach(field => {
        data[field.dataset.field] = field.type === "checkbox" ? field.checked : field.value || "";
      });
      return data;
    }

    let preservedData = {};
    let signatureValue = "";
    let signatureGeneration = 0;
    const signaturePadState = { canvas: null, ctx: null, isDrawing: false, lastPoint: null };
    let storageSaveTimer = 0;
    let storageRestoreInProgress = false;
    let archiveStatusTimer = 0;

    function todayIso() {
      const now = new Date();
      return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    }

    function setTodayIfEmpty() {
      const dateInput = document.getElementById("dateInput");
      if (dateInput && !dateInput.value) dateInput.value = todayIso();
    }

    function renderChecks() {
      CHECK_FIELDS.forEach(([key, label, targetId]) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        const row = document.createElement("label");
        row.className = "check-item";
        row.innerHTML = '<span class="check-label">' + label + '</span><select data-field="' + key + '" name="' + key + '"><option value="false">Nein</option><option value="true">Ja</option></select>';
        target.appendChild(row);
      });
    }

    function strandRow(data = {}) {
      const list = document.getElementById("strandList");
      const row = document.createElement("div");
      row.className = "strand-row";
      row._source = { ...data };
      row.innerHTML = '<div class="row-number"></div>' +
        '<div class="field"><label>Erste Entnahmestelle Druck</label><div class="input-unit"><input data-field="ersteDruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>' +
        '<div class="field"><label>Erste Entnahmestelle Volumenstrom</label><div class="input-unit"><input data-field="ersteVolumenstrom" type="number" step="0.01" inputmode="decimal"><span class="unit">l/min</span></div></div>' +
        '<div class="field"><label>Letzte Entnahmestelle Druck</label><div class="input-unit"><input data-field="letzteDruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>' +
        '<div class="field"><label>Letzte Entnahmestelle Volumenstrom</label><div class="input-unit"><input data-field="letzteVolumenstrom" type="number" step="0.01" inputmode="decimal"><span class="unit">l/min</span></div></div>' +
        '<button type="button" class="danger" aria-label="Leitungsstrang löschen">Löschen</button>';
      row.querySelector("[data-field='ersteDruck']").value = data.ersteDruck || "";
      row.querySelector("[data-field='ersteVolumenstrom']").value = data.ersteVolumenstrom || "";
      row.querySelector("[data-field='letzteDruck']").value = data.letzteDruck || "";
      row.querySelector("[data-field='letzteVolumenstrom']").value = data.letzteVolumenstrom || "";
      row.querySelector("button").addEventListener("click", () => {
        const rows = Array.from(document.querySelectorAll(".strand-row"));
        if (rows.length <= 1) row.querySelectorAll("input").forEach(input => { input.value = ""; });
        else row.remove();
        renumberStrands();
        scheduleStorageSave();
      });
      list.appendChild(row);
      renumberStrands();
      return row;
    }

    function addStrand(data) {
      strandRow(data || {});
      scheduleStorageSave();
    }

    function removeStrand() {
      const rows = Array.from(document.querySelectorAll(".strand-row"));
      if (rows.length <= 1) {
        if (rows[0]) rows[0].querySelectorAll("input").forEach(input => { input.value = ""; });
      } else rows[rows.length - 1].remove();
      renumberStrands();
      scheduleStorageSave();
    }

    function renumberStrands() {
      document.querySelectorAll(".strand-row").forEach((row, index) => {
        row.querySelector(".row-number").textContent = String(index + 1);
      });
    }

    function collectStrand(row) {
      return {
        ...row._source,
        ersteDruck: row.querySelector("[data-field='ersteDruck']").value || "",
        ersteVolumenstrom: row.querySelector("[data-field='ersteVolumenstrom']").value || "",
        letzteDruck: row.querySelector("[data-field='letzteDruck']").value || "",
        letzteVolumenstrom: row.querySelector("[data-field='letzteVolumenstrom']").value || ""
      };
    }

    function textValue(id) {
      const el = document.getElementById(id);
      return el && "value" in el ? el.value || "" : "";
    }

    function boolLabel(value) {
      return String(value) === "true" ? "Ja" : "Nein";
    }

    function withUnit(value, unit) {
      const clean = String(value || "").trim();
      return clean ? clean + " " + unit : "";
    }

    function collectData() {
      const fields = {
        ...preservedData.fields,
        anlage: textValue("anlageInput"),
        object: textValue("objectInput"),
        anlagenstandort: textValue("anlagenstandortInput"),
        date: textValue("dateInput"),
        anlagentyp: textValue("anlagentypSelect"),
        geschossAnzahl: textValue("geschossAnzahlInput"),
        schlauchanschlussAnzahl: textValue("schlauchanschlussAnzahlInput"),
        endtasterAnzahl: textValue("endtasterAnzahlInput"),
        faltschlauchLaenge: textValue("faltschlauchLaengeInput"),
        druckschlauchLaenge: textValue("druckschlauchLaengeInput"),
        wandhydrantAusfuehrung: textValue("wandhydrantAusfuehrungSelect"),
        lastHoseDate: textValue("lastHoseDateInput"),
        nextHoseDate: textValue("nextHoseDateInput"),
        anschluss: textValue("anschlussSelect"),
        pruefergebnis: textValue("pruefergebnisSelect"),
        bemerkung: textValue("bemerkungInput"),
        pruefer: textValue("prueferInput")
      };
      document.querySelectorAll("[data-field]").forEach(field => {
        if (field.closest(".strand-row, .whd-card")) return;
        fields[field.dataset.field] = field.value || "";
      });
      return {
        ...preservedData,
        fields,
        whd: Array.from(document.querySelectorAll(".whd-card")).map(readWhdCard),
        strands: Array.from(document.querySelectorAll(".strand-row")).map(collectStrand),
        signature: getStorageSignature(),
        savedAt: new Date().toISOString()
      };
    }

    function setValue(id, value) {
      const el = document.getElementById(id);
      if (el && "value" in el) el.value = value || "";
    }

    function applyData(data) {
      window.clearTimeout(storageSaveTimer);
      data = data && (data.data || data.report || data) || {};
      preservedData = JSON.parse(JSON.stringify(data));
      storageRestoreInProgress = true;
      const fields = data && data.fields ? data.fields : {};
      setValue("anlageInput", fields.anlage);
      setValue("objectInput", fields.object);
      setValue("anlagenstandortInput", fields.anlagenstandort);
      setValue("dateInput", fields.date);
      setValue("anlagentypSelect", fields.anlagentyp || "Löschwasserleitung nass");
      setValue("geschossAnzahlInput", fields.geschossAnzahl);
      setValue("schlauchanschlussAnzahlInput", fields.schlauchanschlussAnzahl);
      setValue("endtasterAnzahlInput", fields.endtasterAnzahl);
      setValue("faltschlauchLaengeInput", fields.faltschlauchLaenge);
      setValue("druckschlauchLaengeInput", fields.druckschlauchLaenge);
      setValue("wandhydrantAusfuehrungSelect", fields.wandhydrantAusfuehrung || "Typ F");
      setValue("lastHoseDateInput", fields.lastHoseDate);
      setValue("nextHoseDateInput", fields.nextHoseDate);
      setValue("anschlussSelect", fields.anschluss || "Mittelbarer Anschluss getrennt");
      setValue("pruefergebnisSelect", fields.pruefergebnis || "Anlage einsatzbereit");
      setValue("bemerkungInput", fields.bemerkung);
      setValue("prueferInput", fields.pruefer);
      document.querySelectorAll("[data-field]").forEach(field => {
        if (field.closest(".strand-row, .whd-card")) return;
        field.value = fields[field.dataset.field] || "false";
      });
      const list = document.getElementById("strandList");
      list.innerHTML = "";
      const rows = Array.isArray(data && data.strands) && data.strands.length ? data.strands : [{}];
      rows.forEach(row => strandRow(row));
      renderWhdRows(Array.isArray(data.whd) && data.whd.length ? data.whd : [{}]);
      document.querySelectorAll("textarea").forEach(autoResizeTextarea);
      setTodayIfEmpty();
      clearSignature(true);
      restoreSignatureFromStorage(data && data.signature);
      storageRestoreInProgress = false;
    }

    function saveToStorageNow() {
      window.clearTimeout(storageSaveTimer);
      if (storageRestoreInProgress) return true;
      return commitStorage([[STORAGE_KEY, JSON.stringify(collectData())]]);
    }

    // Journal the module's own keys so a failed multi-key operation preserves
    // the previous draft, archive and selected report together.
    function commitStorage(changes) {
      const before = new Map();
      try {
        changes.forEach(([key]) => before.set(key, localStorage.getItem(key)));
        changes.forEach(([key, value]) => {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
          if (localStorage.getItem(key) !== value) throw new Error("Storage verification failed");
        });
        return true;
      } catch (error) {
        before.forEach((value, key) => {
          try {
            // The shell's module bridge adds current UI metadata on writes.
            // Restore exact journal bytes through the unchanged parent realm.
            const storage = window.parent !== window ? window.parent.localStorage : localStorage;
            if (storage.getItem(key) === value) return;
            if (value === null) storage.removeItem(key); else storage.setItem(key, value);
            if (storage.getItem(key) !== value) throw new Error("Storage rollback verification failed");
          } catch (rollbackError) { console.error("Bericht konnte nicht wiederhergestellt werden.", rollbackError); }
        });
        setArchiveStatus("Eingaben konnten nicht gespeichert werden.");
        return false;
      }
    }

    function scheduleStorageSave() {
      if (storageRestoreInProgress) return;
      window.clearTimeout(storageSaveTimer);
      storageSaveTimer = window.setTimeout(saveToStorageNow, 180);
    }

    function restoreFromStorage() {
      let saved = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        saved = raw ? JSON.parse(raw) : null;
      } catch (error) {
        console.warn("Gespeicherte Eingaben konnten nicht geladen werden:", error);
      }
      applyData(saved);
    }

    function clearForm() {
      if (!confirm("Alle Eingaben wirklich löschen?")) return;
      window.clearTimeout(storageSaveTimer);
      if (!commitStorage([[STORAGE_KEY, null], [CURRENT_ARCHIVE_ID_KEY, null]])) return;
      applyData(null);
      setArchiveStatus("Formular geleert.");
    }
    function readStoredValue(key) { try { return localStorage.getItem(key); } catch { return null; } }
    function getCurrentArchiveId() { return readStoredValue(CURRENT_ARCHIVE_ID_KEY); }
    function clearCurrentArchiveId() { return commitStorage([[CURRENT_ARCHIVE_ID_KEY, null]]); }
    function loadArchiveEntries() {
      const entries = JSON.parse(readStoredValue(ARCHIVE_STORAGE_KEY) || "[]");
      if (!Array.isArray(entries)) throw new Error("Ungültiges Archiv");
      return entries;
    }

    function formatDateForFile(dateValue) {
      if (!dateValue) return new Date().toLocaleDateString("de-DE").replaceAll(".", "-");
      const parts = dateValue.split("-");
      if (parts.length !== 3) return dateValue;
      return parts[2] + "." + parts[1] + "." + parts[0];
    }

    function getDisplayDate(value) { return value ? formatDateForFile(value) : "Ohne Datum"; }

    function getArchiveTitle(entry) {
      const report = entry && (entry.data || entry.report) || {};
      const fields = report.fields || {};
      const object = String(fields.object || "").trim() || "Ohne Objekt";
      const anlage = String(fields.anlage || "").trim() || "Ohne Anlagen Nr.";
      return anlage + " - " + object + " - " + getDisplayDate(fields.date || "") + " - " + REPORT_TITLE;
    }

    function saveCurrentReportToArchive() {
      window.clearTimeout(storageSaveTimer);
      try {
        const data = collectData();
        const entries = loadArchiveEntries();
        const existingIndex = entries.findIndex(entry => entry.id === getCurrentArchiveId());
        const previous = existingIndex >= 0 ? entries[existingIndex] : null;
        const standard = window.FSMOBILE_STANDARD.createArchiveEntry({
          moduleId: MODULE_ID, title: getArchiveTitle({ data }), data, previous,
          meta: { type: REPORT_TITLE, object: data.fields.object, anlage: data.fields.anlage, date: data.fields.date }
        });
        const entry = { ...previous, ...standard, meta: { ...previous?.meta, ...standard.meta } };
        if (existingIndex >= 0) entries[existingIndex] = entry; else entries.unshift(entry);
        if (!commitStorage([[STORAGE_KEY, JSON.stringify(data)], [ARCHIVE_STORAGE_KEY, JSON.stringify(entries)], [CURRENT_ARCHIVE_ID_KEY, entry.id]])) return false;
        renderArchiveList();
        setArchiveStatus(existingIndex >= 0 ? "Formular aktualisiert." : "Formular im Archiv gespeichert.");
        return entry;
      } catch (error) { setArchiveStatus("Formular konnte nicht im Archiv gespeichert werden."); return false; }
    }
    function openArchiveEntry(id) {
      try {
        const entry = loadArchiveEntries().find(item => item.id === id);
        if (!entry) return false;
        window.clearTimeout(storageSaveTimer);
        const data = entry.data || entry.report || {};
        const previous = collectData();
        // Apply first so the shared customer-number bridge sees the restored
        // value when it verifies the draft write. Roll back UI on write failure.
        applyData(data);
        if (!commitStorage([[STORAGE_KEY, JSON.stringify(collectData())], [CURRENT_ARCHIVE_ID_KEY, id]])) {
          applyData(previous);
          return false;
        }
        closeArchive();
        setArchiveStatus("Archiv-Eintrag wurde geöffnet.");
        return true;
      } catch (error) { setArchiveStatus("Archiv-Eintrag konnte nicht geöffnet werden."); return false; }
    }
    function deleteArchiveEntry(id) {
      const entries = loadArchiveEntries();
      if (!entries.some(entry => entry.id === id) || !confirm("Archiv-Eintrag wirklich löschen?")) return false;
      const changes = [[ARCHIVE_STORAGE_KEY, JSON.stringify(entries.filter(entry => entry.id !== id))]];
      if (getCurrentArchiveId() === id) changes.push([CURRENT_ARCHIVE_ID_KEY, null]);
      if (!commitStorage(changes)) return false;
      renderArchiveList();
      setArchiveStatus("Archiv-Eintrag wurde gelöscht.");
      return true;
    }

    function renderArchiveList() {
      const archiveList = document.getElementById("archiveList");
      const entries = loadArchiveEntries().slice().sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
      archiveList.innerHTML = "";
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "archive-empty";
        empty.textContent = "Archiv leer - zuerst im Archiv speichern legt den ersten Eintrag an.";
        archiveList.appendChild(empty);
        return;
      }
      entries.forEach(entry => {
        const item = document.createElement("article");
        item.className = "archive-item" + (entry.id === getCurrentArchiveId() ? " archive-item-current" : "");
        item.dataset.archiveId = entry.id;
        const text = document.createElement("div");
        const title = document.createElement("div");
        const meta = document.createElement("div");
        title.className = "archive-title";
        meta.className = "archive-meta";
        title.textContent = getArchiveTitle(entry);
        meta.textContent = "Geändert: " + getDisplayDate((entry.updatedAt || "").slice(0, 10));
        text.append(title, meta);
        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.textContent = "Öffnen";
        openButton.addEventListener("click", () => openArchiveEntry(entry.id));
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "danger";
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", () => deleteArchiveEntry(entry.id));
        item.append(text, openButton, deleteButton);
        const query = document.getElementById("archiveFilter").value.trim().toLocaleLowerCase("de-DE");
        item.hidden = !!query && !item.textContent.toLocaleLowerCase("de-DE").includes(query);
        archiveList.appendChild(item);
      });
    }

    function openArchive() {
      document.getElementById("archiveFilter").value = "";
      renderArchiveList();
      document.getElementById("archiveOverlay").hidden = false;
    }

    function closeArchive() {
      document.getElementById("archiveOverlay").hidden = true;
    }

    function setArchiveStatus(message) {
      window.FSMOBILE_STANDARD?.showToast(message);
    }
    function getPdfFileName() {
      return window.FSMOBILE_STANDARD.pdfFileName(["PB", textValue("anlageInput") || "Ohne Anlagen Nr.", textValue("objectInput") || "Ohne Objekt", textValue("dateInput") || todayIso()]);
    }

    function ensureJsPdf() {
      if (window.jspdf && typeof window.jspdf.jsPDF === "function") return window.jspdf.jsPDF;
      if (typeof window.jsPDF === "function") return window.jsPDF;
      return null;
    }

    async function loadJsPdfIfNeeded() {
      const existing = ensureJsPdf();
      if (existing) return existing;
      return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "vendor/jspdf.umd.min.js";
        script.onload = () => resolve(ensureJsPdf());
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
      });
    }

    function savePdfDocument(doc, fileName) {
      try { doc.save(fileName); }
      catch {
        try {
          const blob = doc.output("blob");
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch {
          alert("PDF konnte nicht gespeichert werden. Bitte im Browser erneut öffnen und noch einmal versuchen.");
        }
      }
    }

    async function exportPdf() {
      const JsPdf = await loadJsPdfIfNeeded();
      if (!JsPdf) { setArchiveStatus("PDF-Export konnte nicht erstellt werden."); return; }
      const button = document.getElementById("pdfButton");
      button.disabled = true;
      try {
        const data = collectData();
        const fields = data.fields;
        const pdf = new JsPdf({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const margin = 12, width = 186, bottom = 278, lineHeight = 4;
        let y = 0, currentSection = "";
        const clean = value => String(value ?? "").trim() || "-";
        function lines(value, maxWidth, size = 8.5) {
          pdf.setFont("helvetica", "normal"); pdf.setFontSize(size);
          return pdf.splitTextToSize(clean(value), maxWidth);
        }
        function header() {
          pdf.setFillColor(235, 0, 69); pdf.rect(margin, 30, width, 14, "F");
          pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(255, 255, 255);
          pdf.text("Prüfbericht Löschwassereinrichtung Nass", 105, 35.5, { align: "center" });
          pdf.text("mit WHD Einzelprüfung", 105, 41, { align: "center" });
          pdf.setTextColor(28, 28, 30); pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
          const meta = "Anlagen Nr.: " + clean(fields.anlage) + " | Objekt: " + clean(fields.object) + " | " + formatDateForFile(fields.date);
          const metaLines = lines(meta, width, 7);
          pdf.text(metaLines[0] + (metaLines.length > 1 ? " ..." : ""), margin, 49);
          y = 54;
        }
        function sectionBar(title) {
          pdf.setFillColor(255, 180, 71); pdf.rect(margin, y, width, 7, "F");
          pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(28, 28, 30);
          pdf.text(title, margin + 2, y + 4.8); y += 8;
        }
        function newPage(repeat = true) {
          pdf.addPage(); header();
          if (repeat && currentSection) sectionBar(currentSection + " (Fortsetzung)");
        }
        function section(title, minSpace = 22) {
          if (y + minSpace > bottom) newPage(false);
          currentSection = title; sectionBar(title);
        }
        function row(label, value, color = null) {
          let labelLines = lines(label, 62, 8), valueLines = lines(value, width - 70);
          while (labelLines.length || valueLines.length) {
            if (y + 12 > bottom) newPage();
            const capacity = Math.max(1, Math.floor((bottom - y - 4) / lineHeight));
            const l = labelLines.splice(0, capacity), v = valueLines.splice(0, capacity);
            const height = Math.max(9, Math.max(l.length, v.length) * lineHeight + 4);
            pdf.setFillColor(245, 245, 245); pdf.setDrawColor(255, 255, 255);
            pdf.rect(margin, y, width, height, "FD");
            pdf.setTextColor(75, 75, 80); pdf.setFontSize(8); pdf.setFont("helvetica", "normal");
            if (l.length) pdf.text(l, margin + 2, y + 5);
            pdf.setTextColor(...(color || [28, 28, 30])); pdf.setFontSize(8.5);
            if (v.length) pdf.text(v, margin + 68, y + 5);
            y += height;
            if (labelLines.length || valueLines.length) newPage();
          }
        }
        function group(title, entries) {
          section(title); entries.forEach(entry => row(...entry)); y += 4;
        }
        function measurementTable() {
          section("Messwerte Leitungsstrang", 36);
          const widths = [12, 43.5, 43.5, 43.5, 43.5];
          const heads = ["Nr.", "Erste Entnahmestelle\\nDruck (bar)", "Erste Entnahmestelle\\nVolumenstrom (l/min)", "Letzte Entnahmestelle\\nDruck (bar)", "Letzte Entnahmestelle\\nVolumenstrom (l/min)"];
          function tableHead() {
            let x = margin;
            heads.forEach((head, i) => {
              pdf.setFillColor(255, 180, 71); pdf.setDrawColor(255,255,255); pdf.rect(x,y,widths[i],15,"FD");
              const text = lines(head,widths[i]-4,7); pdf.setTextColor(28,28,30); pdf.text(text,x+2,y+4.5); x+=widths[i];
            }); y+=15;
          }
          tableHead();
          data.strands.forEach((strand, i) => {
            const values = [String(i+1),strand.ersteDruck,strand.ersteVolumenstrom,strand.letzteDruck,strand.letzteVolumenstrom];
            const wrapped = values.map((v,j)=>lines(v,widths[j]-4,8));
            const height = Math.max(10,...wrapped.map(a=>a.length*lineHeight+4));
            if (y+height>bottom) { newPage(); tableHead(); }
            let x=margin;
            wrapped.forEach((text,j)=>{pdf.setFillColor(245,245,245);pdf.setDrawColor(255,255,255);pdf.rect(x,y,widths[j],height,"FD");pdf.setFontSize(8);pdf.setTextColor(28,28,30);pdf.text(text,x+2,y+5);x+=widths[j];});
            y+=height;
          }); y+=4;
        }
        header();
        group("Zuordnung", [["Anlagen Nr.",fields.anlage],["Kunden Nr.",fields.kundenNr],["Objekt",fields.object],["Anlagenstandort",fields.anlagenstandort],["Datum",formatDateForFile(fields.date)],["Prüfer",fields.pruefer]]);
        group("Anlagentyp",[["Anlagentyp",fields.anlagentyp]]);
        group("Anlagenausführung",[
          ["Anzahl Geschosse",fields.geschossAnzahl],["Anzahl Schlauchanschlüsse",fields.schlauchanschlussAnzahl],["Schlauchanschlüsse mit Endtaster",fields.endtasterAnzahl],
          ["Schlauchlänge Faltschlauch",withUnit(fields.faltschlauchLaenge,"m")],["Schlauchlänge formbeständiger Druckschlauch",withUnit(fields.druckschlauchLaenge,"m")],["Wandhydrant Ausführung",fields.wandhydrantAusfuehrung],
          ...CHECK_FIELDS.filter(item=>item[2]==="anlageChecks").map(([key,label])=>[label,boolLabel(fields[key])])
        ]);
        measurementTable();
        group("Schlauchprüfung",[
          ...CHECK_FIELDS.filter(item=>item[2]==="hoseChecks").map(([key,label])=>[label,boolLabel(fields[key])]),
          ["Letzte Schlauchdruckprüfung",fields.lastHoseDate ? formatDateForFile(fields.lastHoseDate) : ""],["Nächste Schlauchdruckprüfung",fields.nextHoseDate ? formatDateForFile(fields.nextHoseDate) : ""]
        ]);
        group("Wasseranschluss",[...CHECK_FIELDS.filter(item=>item[2]==="waterChecks").map(([key,label])=>[label,boolLabel(fields[key])]),["Anschluss",fields.anschluss]]);
        data.whd.forEach((whd,index)=>{
          group("Einzelprüfung Wandhydranten - Wandhydrant Nr. "+(index+1),[
            ["Standort",whd.standort],["Bauart",whd.bauart],["Strahlrohr",whd.strahlrohr],["Ausführung",whd.ausfuehrung],["Schlauchart",whd.schlauchart],["Schlauchlänge",whd.schlauchlaenge],
            ["Ruhedruck in MPa",whd.ruhedruck],["Fließdruck in MPa",whd.fliessdruck],["Fließmenge in l/min",whd.fliessmenge],["Nächste Prüfung",whd.naechstePruefung],["Bemerkung",whd.bemerkung],
            ...WHD_CHECK_FIELDS.map(([key,label])=>[label,whd[key] ? "Ja" : "Nein"])
          ]);
        });
        group("Prüfergebnis",[["Prüfergebnis",fields.pruefergebnis,fields.pruefergebnis==="Anlage einsatzbereit" ? [0,120,50] : [195,30,40]],["Bemerkung",fields.bemerkung]]);
        section("Unterschrift Techniker",44);
        pdf.setFillColor(245,245,245);pdf.rect(margin,y,width,27,"F");
        if(data.signature) pdf.addImage(data.signature,"PNG",margin+2,y+2,68,23,undefined,"FAST");
        y+=32;
        const note="Wir weisen auf die 3-jährliche Sachverständigenprüfpflicht nach TPrüfVO Hessen hin.";
        pdf.setFont("helvetica","normal");pdf.setFontSize(7);pdf.setTextColor(28,28,30);pdf.text(note,margin,y);
        const total=pdf.getNumberOfPages();
        for(let i=1;i<=total;i++) { pdf.setPage(i);pdf.setFont("helvetica","normal");pdf.setFontSize(8);pdf.setTextColor(100,100,105);pdf.text("Seite "+i+" / "+total,198,289,{align:"right"}); }
        window.FSMOBILE_STAMP_PDF_LOGO?.(pdf);
        savePdfDocument(pdf,getPdfFileName());
      } catch(error) { console.error("PDF-Export fehlgeschlagen",error);setArchiveStatus("PDF-Export konnte nicht erstellt werden."); }
      finally { button.disabled=false; }
    }

    function readSignatureCanvas() {
      const canvas = document.getElementById("signaturePad");
      if (!canvas) return "";
      try {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let index = 3; index < pixels.length; index += 4) if (pixels[index] !== 0) return canvas.toDataURL("image/png");
      } catch {}
      return "";
    }

    function getStorageSignature() { return signatureValue; }

    function restoreSignatureFromStorage(dataUrl) {
      signatureValue = dataUrl || "";
      const generation = ++signatureGeneration;
      if (!dataUrl) return;
      const canvas = document.getElementById("signaturePad");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const img = new Image();
      img.onload = () => {
        const draw = () => {
          if (generation !== signatureGeneration) return;
          const ratio = window.devicePixelRatio || 1;
          context.save();
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          context.restore();
          context.setTransform(ratio, 0, 0, ratio, 0, 0);
          context.lineWidth = 2.4;
          context.lineCap = "round";
          context.lineJoin = "round";
          context.strokeStyle = "#1c1c1e";
        };
        draw();
        setTimeout(draw, 80);
        setTimeout(draw, 260);
      };
      img.src = dataUrl;
    }

    function setupSignaturePad() {
      const canvas = document.getElementById("signaturePad");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      signaturePadState.canvas = canvas;
      signaturePadState.ctx = context;
      function resize(keep) {
        const dataUrl = keep ? getStorageSignature() : "";
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * ratio));
        canvas.height = Math.max(1, Math.round(rect.height * ratio));
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.lineWidth = 2.4;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "#1c1c1e";
        restoreSignatureFromStorage(dataUrl);
      }
      function point(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }
      function start(event) {
        event.preventDefault();
        ++signatureGeneration;
        signaturePadState.isDrawing = true;
        signaturePadState.lastPoint = point(event);
      }
      function move(event) {
        if (!signaturePadState.isDrawing) return;
        event.preventDefault();
        const current = point(event);
        context.beginPath();
        context.moveTo(signaturePadState.lastPoint.x, signaturePadState.lastPoint.y);
        context.lineTo(current.x, current.y);
        context.stroke();
        signaturePadState.lastPoint = current;
      }
      function end() {
        if (!signaturePadState.isDrawing) return;
        signaturePadState.isDrawing = false;
        signaturePadState.lastPoint = null;
        signatureValue = readSignatureCanvas();
        scheduleStorageSave();
      }
      canvas.addEventListener("pointerdown", start);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", end);
      canvas.addEventListener("pointercancel", end);
      canvas.addEventListener("pointerleave", end);
      window.addEventListener("resize", () => resize(true));
      resize(false);
    }

    function clearSignature(skipSave = false) {
      signatureValue = "";
      ++signatureGeneration;
      const canvas = document.getElementById("signaturePad");
      const context = canvas && canvas.getContext("2d", { willReadFrequently: true });
      if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
      if (!skipSave) scheduleStorageSave();
    }

    function registerModuleApi() {
      window.FSMOBILE_MODULE_API = window.FSMOBILE_STANDARD.createModuleApi({
        moduleId: MODULE_ID,
        storage: { current: STORAGE_KEY, archive: ARCHIVE_STORAGE_KEY, pointer: CURRENT_ARCHIVE_ID_KEY },
        capabilities: { draft: true, archive: true, pdf: true, signatures: true, import: true, export: true },
        state: { collect: collectData, apply: applyData },
        lifecycle: { flush: saveToStorageNow },
        actions: {
          save: saveCurrentReportToArchive, archive: openArchive, clear: clearForm,
          export: () => window.FSMOBILE_DOWNLOAD_REPORT_EXPORT(),
          import: () => document.querySelector(".fsmobile-data-import")?.click(),
          pdf: { invoke: exportPdf, isDisabled: () => document.getElementById("pdfButton").disabled }
        }
      });
    }
    renderChecks();
    setupSignaturePad();
    restoreFromStorage();
    registerModuleApi();
    setTodayIfEmpty();
    document.addEventListener("input", event => { if (event.target.tagName === "TEXTAREA") autoResizeTextarea(event.target); scheduleStorageSave(); });
    document.addEventListener("change", scheduleStorageSave);
    document.getElementById("archiveOverlay").addEventListener("click", event => {
      if (event.target.id === "archiveOverlay") closeArchive();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !document.getElementById("archiveOverlay").hidden) closeArchive();
    });
  </script>
</body>
</html>`
  };
})();
