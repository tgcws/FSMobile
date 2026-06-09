(function () {
  "use strict";

  const registry = window.FSMOBILE_MODULES || {};
  const moduleGrid = document.getElementById("moduleGrid");
  const moduleView = document.getElementById("moduleView");
  const menuView = document.getElementById("menuView");
  const frame = document.getElementById("moduleFrame");
  const backButton = document.getElementById("backButton");
  const subtitle = document.getElementById("viewSubtitle");
  const topbar = document.querySelector(".topbar");
  const authOverlay = document.getElementById("authOverlay");
  const authForm = document.getElementById("authForm");
  const authCode = document.getElementById("authCode");
  const authMode = document.getElementById("authMode");
  const authTitle = document.getElementById("authTitle");
  const authHint = document.getElementById("authHint");
  const authSubmit = document.getElementById("authSubmit");
  const authError = document.getElementById("authError");
  const OLD_PASS_HASH_KEY = "fsmobile-unified-passhash-v1";
  const AUTH_UNLOCK_KEY = "fsmobile-auth-unlocked-v2";
  const AUTH_UNLOCK_VALUE = "confirmed";
  const REQUIRED_PASS_HASH = "745731644d9e569b873095e3a2a5a3fae47202b83d2d5879397ea14415edee95";
  let isUnlocked = false;
  let activeModuleId = null;
  let actionSyncTimer = 0;
  let actionStatusTimer = 0;

  const MENU_SECTIONS = [
    {
      id: "kalkulation",
      title: "Kalkulation",
      accent: "accent-orange",
      modules: [
        "maengelliste",
        "maengelliste-bilddoku",
        "aufmass-akku",
        "aufmass-einsteckschloss",
        "aufmass-tueren"
      ]
    },
    {
      id: "pruefberichte",
      title: "Prüfberichte",
      accent: "accent-red",
      modules: [
        "pb-feuerloescher",
        "pb-brandschutztueren",
        "pb-rwa",
        "pb-not-sicherheitsbeleuchtung",
        "pb-brandschutzklappen",
        "pb-brandschutzschiebetor",
        "pb-brandschutzrolltore",
        "pb-rolltoranlagen",
        "pb-schiebetuerantrieb",
        "pb-drehfluegelantrieb",
        "pb-rauchschutzvorhaenge",
        "pb-feststellanlagen",
        "pb-druckerhoehungsanlage",
        "pb-loeschwasser-trocken",
        "pb-zentralbatterie-anlage",
        "pb-wandhydranten"
      ]
    },
    {
      id: "wartungsanleitungen",
      title: "Wartungsanleitungen",
      accent: "accent-teal",
      modules: [
        "anleitung-rwa-pyro",
        "anleitung-rwa-elektrisch",
        "anleitung-rwa-co2",
        "anleitung-fsa-1-flg",
        "anleitung-fsa-2-flg",
        "anleitung-dfa-1-flg",
        "anleitung-dfa-2-flg",
        "anleitung-bst-1-flg",
        "anleitung-bst-2-flg",
        "anleitung-zba",
        "anleitung-sibel-ezb",
        "anleitung-schiebetor",
        "anleitung-fluchttuer-steuerung",
        "anleitung-rolltore",
        "anleitung-bsk",
        "anleitung-bs-vorhang"
      ]
    }
  ];

  const CARD_TITLES = {
    "pb-feuerloescher": "Feuerlöscher",
    "pb-brandschutztueren": "Brandschutztüren",
    "pb-rwa": "RWA-Anlagen",
    "pb-not-sicherheitsbeleuchtung": "Not-/Sicherheitsbeleuchtungen",
    "pb-brandschutzklappen": "Brandschutzklappen",
    "pb-brandschutzschiebetor": "Brandschutzschiebetore",
    "pb-brandschutzrolltore": "Brandschutzrolltore",
    "pb-rolltoranlagen": "Rolltoranlagen",
    "pb-schiebetuerantrieb": "Schiebetürantriebe",
    "pb-drehfluegelantrieb": "Drehflügelantriebe",
    "pb-rauchschutzvorhaenge": "Rauchschutzvorhänge",
    "pb-feststellanlagen": "Feststellanlagen",
    "pb-druckerhoehungsanlage": "Druckerhöhungsanlagen",
    "pb-loeschwasser-trocken": "Löschwassereinrichtung Trocken",
    "pb-zentralbatterie-anlage": "Zentralbatterie-Anlage",
    "anleitung-rwa-pyro": "RWA Pyro",
    "anleitung-rwa-elektrisch": "RWA Elektrisch",
    "anleitung-rwa-co2": "RWA CO2"
  };

  const KICKERS = {
    kalkulation: "Kalkulation",
    pruefberichte: "Prüfbericht",
    wartungsanleitungen: "Wartung"
  };

  registry["pb-zentralbatterie-anlage"] = registry["pb-zentralbatterie-anlage"] || {
    title: "Prüfbericht Zentralbatterie-Anlage",
    group: "Prüfberichte",
    description: "Zentralbatterie-Anlage prüfen, Messwerte erfassen, archivieren und als PDF ausgeben.",
    html: centralBatteryReportHtml()
  };

  function centralBatteryReportHtml() {
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Prüfbericht Zentralbatterie-Anlage</title>
  <meta name="app-version" content="01" />
  <meta name="theme-color" content="#d6001c" />
  <style>
    :root {
      --brand: #d6001c;
      --primary: #007aff;
      --success: #34c759;
      --danger: #ff3b30;
      --neutral: #8e8e93;
      --warning: #ff9500;
      --bg: #f4f4f6;
      --card: #ffffff;
      --field: #f2f2f7;
      --text: #1c1c1e;
      --muted: #6e6e73;
      --line: rgba(60, 60, 67, .14);
      --radius: 16px;
      --shadow: 0 8px 28px rgba(0, 0, 0, .08);
      --ios-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    * { box-sizing: border-box; }

    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

    body {
      margin: 0;
      padding: 18px;
      padding-left: max(18px, env(safe-area-inset-left));
      padding-right: max(18px, env(safe-area-inset-right));
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
      background: rgba(255,255,255,.72);
      border: 1px solid rgba(60,60,67,.16);
      border-radius: var(--radius);
      box-shadow: 0 8px 24px rgba(0,0,0,.06);
      -webkit-backdrop-filter: blur(18px);
      backdrop-filter: blur(18px);
    }

    h1 { margin: 0; font-size: 34px; line-height: 1.1; letter-spacing: 0; }
    h2, h3, label { letter-spacing: 0; }

    .header-row,
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(170px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    .grid.two { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
    .grid.three { grid-template-columns: repeat(3, minmax(160px, 1fr)); }
    .grid.four { grid-template-columns: repeat(4, minmax(130px, 1fr)); }

    .field {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

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
      min-height: 92px;
      resize: vertical;
      line-height: 1.35;
      text-align: left;
    }

    input:focus,
    textarea:focus,
    select:focus {
      box-shadow: 0 0 0 3px rgba(214,0,28,.18);
    }

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
      transition: transform .18s var(--ios-ease), box-shadow .18s var(--ios-ease), background .18s var(--ios-ease), filter .18s var(--ios-ease);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    button:hover { filter: brightness(1.02); }
    button:active { transform: scale(.975); }
    button:disabled { opacity: .55; cursor: default; transform: none; }

    .success { background: linear-gradient(180deg, #40d96a 0%, var(--success) 100%); }
    .danger { background: linear-gradient(180deg, #ff453a 0%, var(--danger) 100%); }
    .secondary { background: linear-gradient(180deg, #a6a6ad 0%, var(--neutral) 100%); }
    .archive-save { background: linear-gradient(180deg, #ffb340 0%, var(--warning) 100%); }

    .card {
      margin-top: 16px;
      padding: 16px;
      border-radius: 16px;
      background: rgba(255, 255, 255, .72);
      border: 1px solid rgba(255, 255, 255, .58);
      box-shadow: 0 18px 42px rgba(2, 8, 23, .10), inset 0 1px 0 rgba(255,255,255,.48);
      -webkit-backdrop-filter: blur(24px) saturate(1.18);
      backdrop-filter: blur(24px) saturate(1.18);
    }

    .section-title {
      margin: 0 0 12px;
      font-size: 22px;
      line-height: 1.2;
    }

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
      background: rgba(255,255,255,.72);
    }

    .check-label { font-weight: 780; line-height: 1.25; }

    .dynamic-list { display: grid; gap: 10px; }

    .cell-row {
      display: grid;
      grid-template-columns: 70px repeat(3, minmax(150px, 1fr)) auto;
      gap: 10px;
      align-items: end;
      padding: 12px;
      background: rgba(242, 242, 247, .65);
      border-radius: 14px;
    }

    .cell-number {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #fff;
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

    .input-unit input,
    .input-unit select {
      min-height: 44px;
      background: transparent;
    }

    .unit {
      color: var(--muted);
      font-weight: 850;
      white-space: nowrap;
    }

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
      border: 2px dashed rgba(60,60,67,.25);
      border-radius: 12px;
      background: #fff;
      touch-action: none;
    }

    .signature-actions { margin-top: 10px; }

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
    body.generating-pdf .signature-actions,
    body.generating-pdf .archive-status { display: none !important; }

    body { padding: 0 !important; background: transparent !important; }
    .container { width: 100% !important; max-width: none !important; margin: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
    .title-actions { padding: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
    .title-bar > .title-actions, header > .title-actions, header > .toolbar { margin-right: calc(86px + env(safe-area-inset-right, 0px)) !important; }
    body.generating-pdf .title-bar > .title-actions, body.generating-pdf header > .title-actions, body.generating-pdf header > .toolbar { margin-right: 0 !important; }

    @media (max-width: 900px) {
      .header-row, .grid, .grid.two, .grid.three, .grid.four, .check-grid { grid-template-columns: 1fr; }
      .cell-row { grid-template-columns: 64px 1fr; }
      .cell-row .field { grid-column: 1 / -1; }
      .title-bar, .archive-header { align-items: stretch; flex-direction: column; }
      .title-actions, .title-actions button, .archive-header button { width: 100%; }
    }

    @media (max-width: 720px) {
      .title-bar > .title-actions, header > .title-actions, header > .toolbar { margin-right: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="container" id="reportRoot">
    <div class="title-bar">
      <h1>Prüfbericht Zentralbatterie-Anlage</h1>
      <div class="title-actions" aria-label="Archivaktionen">
        <button type="button" onclick="saveCurrentReportToArchive()" class="archive-save">Im Archiv speichern</button>
        <button type="button" onclick="openArchive()" class="archive-open">Archiv</button>
      </div>
    </div>

    <section class="card">
      <h2 class="section-title">Zuordnung</h2>
      <div class="header-row">
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
      <h2 class="section-title">Besichtigung</h2>
      <div class="check-grid" id="inspectionGrid"></div>
    </section>

    <section class="card">
      <h2 class="section-title">Zellenmessung</h2>
      <div class="dynamic-list" id="cellList"></div>
      <div class="actions">
        <button type="button" class="success" onclick="addCell()">Zelle hinzufügen</button>
        <button type="button" class="danger" onclick="removeCell()">Letzte Zelle löschen</button>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Messungen</h2>
      <div class="grid four" id="measurementGrid"></div>
    </section>

    <section class="card">
      <h2 class="section-title">Anlagendaten und Ergebnis</h2>
      <div class="grid four">
        <div class="field">
          <label for="anlagentypInput">Anlagentyp</label>
          <input id="anlagentypInput" name="anlagentyp" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="batterietypInput">Batterietyp</label>
          <input id="batterietypInput" name="batterietyp" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="batterietemperaturInput">Batterietemperatur</label>
          <div class="input-unit"><input id="batterietemperaturInput" name="batterietemperatur" type="number" step="0.1" inputmode="decimal" /><span class="unit">°C</span></div>
        </div>
        <div class="field">
          <label for="elektrolytSelect">Elektrolyt</label>
          <select id="elektrolytSelect" name="elektrolyt">
            <option>-</option>
            <option>Destilliertes Wasser</option>
            <option>Schwefelsäure</option>
          </select>
        </div>
        <div class="field">
          <label for="pruefergebnisSelect">Prüfergebnis</label>
          <select id="pruefergebnisSelect" name="pruefergebnis">
            <option>Keine Mängel festgestellt</option>
            <option>Mängel festgestellt</option>
          </select>
        </div>
        <div class="field">
          <label for="nextDateInput">Nächster Prüftermin</label>
          <input id="nextDateInput" name="nextDate" type="date" />
        </div>
      </div>
      <div class="field" style="margin-top:14px">
        <label for="bemerkungInput">Bemerkungen</label>
        <textarea id="bemerkungInput" name="bemerkung"></textarea>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfer und Unterschrift</h2>
      <div class="grid two">
        <div class="field">
          <label for="prueferInput">Prüfer</label>
          <input id="prueferInput" name="pruefer" type="text" autocomplete="off" />
        </div>
      </div>
      <div class="signature-block">
        <h3>Digitale Unterschrift</h3>
        <canvas id="signaturePad" aria-label="Digitale Unterschrift"></canvas>
        <div class="signature-actions">
          <button type="button" onclick="clearSignature()" class="danger">Unterschrift löschen</button>
        </div>
      </div>
    </section>

    <div class="actions">
      <button type="button" class="secondary clear-btn" id="clearButton" onclick="clearForm()">Leeren</button>
      <button type="button" id="pdfButton" class="pdf-btn" onclick="exportPdf()">PDF</button>
    </div>
    <p class="archive-status" id="archiveStatus" role="status" aria-live="polite"></p>
  </div>

  <div class="archive-overlay" id="archiveOverlay" hidden>
    <div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle">
      <div class="archive-header">
        <h2 id="archiveTitle">Archiv</h2>
        <button type="button" class="secondary archive-close-btn" onclick="closeArchive()">Schließen</button>
      </div>
      <div class="archive-list" id="archiveList"></div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = "fsmobile-pb-zentralbatterie-v1";
    const ARCHIVE_STORAGE_KEY = "fsmobile-pb-zentralbatterie-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "fsmobile-pb-zentralbatterie-current-v1";
    const INSPECTION_FIELDS = [
      ["funktionsdauertest", "Funktionsdauertest durchgeführt"],
      ["tiefentladeschutz", "Tiefentladeschutz geprüft"],
      ["netzueberwachungsrelais", "Netzüberwachungsrelais geprüft"],
      ["optischeKontrolleLeuchten", "Optische Kontrolle der angeschlossenen Leuchten"],
      ["umschaltungNetzausfall", "Umschaltung bei Netzausfall geprüft"],
      ["batteriepole", "Batteriepole geprüft, gereinigt, nachgezogen"],
      ["fuellstandZellen", "Füllstand der Zellen geprüft"],
      ["anzeigeelemente", "Anzeigeelemente geprüft"],
      ["ladeautomatik", "Ladeautomatik geprüft"],
      ["dauerlichtschaltung", "Dauerlichtschaltung geprüft"],
      ["bereitschaftslichtschaltung", "Bereitschaftslichtschaltung geprüft"],
      ["anlageGereinigt", "Anlage gesäubert"]
    ];
    const MEASUREMENT_FIELDS = [
      ["uBatterie", "U Batterie", "V"],
      ["uBatterieNetzausfall", "U Batterie Netzausfall", "V"],
      ["uTiefentladeschutz", "U Tiefentladeschutz", "V"],
      ["uBatterie3h", "U Batterie nach 3h", "V"],
      ["ladestrom", "Ladestrom", "A"],
      ["erhaltungsladestrom", "Erhaltungsladestrom", "mA"],
      ["iBereitschaftslicht", "I Bereitschaftslicht", "A"],
      ["iDauerlicht", "I Dauerlicht", "A"],
      ["leuchtenspannung", "Leuchtenspannung", "V", "spannungType"]
    ];
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

    function renderInspection() {
      const grid = document.getElementById("inspectionGrid");
      grid.innerHTML = "";
      INSPECTION_FIELDS.forEach(([key, label]) => {
        const row = document.createElement("label");
        row.className = "check-item";
        row.innerHTML = '<span class="check-label">' + label + '</span><select data-field="' + key + '"><option value="false">Nein</option><option value="true">Ja</option></select>';
        grid.appendChild(row);
      });
    }

    function renderMeasurements() {
      const grid = document.getElementById("measurementGrid");
      grid.innerHTML = "";
      MEASUREMENT_FIELDS.forEach(([key, label, unit, typeKey]) => {
        const field = document.createElement("div");
        field.className = "field";
        const labelEl = document.createElement("label");
        labelEl.setAttribute("for", key + "Input");
        labelEl.textContent = label;
        const unitWrap = document.createElement("div");
        unitWrap.className = "input-unit";
        const input = document.createElement("input");
        input.id = key + "Input";
        input.name = key;
        input.dataset.field = key;
        input.type = "number";
        input.step = "0.01";
        input.inputMode = "decimal";
        unitWrap.appendChild(input);
        if (typeKey) {
          const select = document.createElement("select");
          select.name = typeKey;
          select.dataset.field = typeKey;
          select.innerHTML = "<option>AC</option><option>DC</option>";
          unitWrap.appendChild(select);
        } else {
          const span = document.createElement("span");
          span.className = "unit";
          span.textContent = unit;
          unitWrap.appendChild(span);
        }
        field.append(labelEl, unitWrap);
        grid.appendChild(field);
      });
    }

    function cellRow(data = {}) {
      const row = document.createElement("div");
      row.className = "cell-row";
      row.innerHTML = '<div class="cell-number"></div>' +
        '<div class="field"><label>U Netzausfall</label><div class="input-unit"><input data-field="uNetzausfall" type="number" step="0.01" inputmode="decimal"><span class="unit">V</span></div></div>' +
        '<div class="field"><label>U Netzausfall 3h</label><div class="input-unit"><input data-field="uNetzausfall3h" type="number" step="0.01" inputmode="decimal"><span class="unit">V</span></div></div>' +
        '<div class="field"><label>Elektrolytdichte</label><input data-field="elektrolytdichte" type="text"></div>' +
        '<button type="button" class="danger" aria-label="Zelle löschen">Löschen</button>';
      row.querySelector("[data-field='uNetzausfall']").value = data.uNetzausfall || "";
      row.querySelector("[data-field='uNetzausfall3h']").value = data.uNetzausfall3h || "";
      row.querySelector("[data-field='elektrolytdichte']").value = data.elektrolytdichte || "";
      row.querySelector("button").addEventListener("click", () => {
        const rows = Array.from(document.querySelectorAll(".cell-row"));
        if (rows.length <= 1) clearCellRow(row);
        else row.remove();
        renumberCells();
        scheduleStorageSave();
      });
      return row;
    }

    function clearCellRow(row) {
      row.querySelectorAll("input").forEach(input => { input.value = ""; });
    }

    function addCell(data) {
      document.getElementById("cellList").appendChild(cellRow(data || {}));
      renumberCells();
      scheduleStorageSave();
    }

    function removeCell() {
      const rows = Array.from(document.querySelectorAll(".cell-row"));
      if (rows.length <= 1) {
        if (rows[0]) clearCellRow(rows[0]);
      } else rows[rows.length - 1].remove();
      renumberCells();
      scheduleStorageSave();
    }

    function renumberCells() {
      document.querySelectorAll(".cell-row").forEach((row, index) => {
        row.querySelector(".cell-number").textContent = String(index + 1);
      });
    }

    function collectCell(row) {
      return {
        uNetzausfall: row.querySelector("[data-field='uNetzausfall']").value || "",
        uNetzausfall3h: row.querySelector("[data-field='uNetzausfall3h']").value || "",
        elektrolytdichte: row.querySelector("[data-field='elektrolytdichte']").value || ""
      };
    }

    function textValue(id) {
      const el = document.getElementById(id);
      return el && "value" in el ? el.value || "" : "";
    }

    function collectReportData() {
      const fields = {
        anlage: textValue("anlageInput"),
        object: textValue("objectInput"),
        anlagenstandort: textValue("anlagenstandortInput"),
        date: textValue("dateInput"),
        anlagentyp: textValue("anlagentypInput"),
        batterietyp: textValue("batterietypInput"),
        batterietemperatur: textValue("batterietemperaturInput"),
        elektrolyt: textValue("elektrolytSelect"),
        pruefergebnis: textValue("pruefergebnisSelect"),
        nextDate: textValue("nextDateInput"),
        bemerkung: textValue("bemerkungInput"),
        pruefer: textValue("prueferInput")
      };
      document.querySelectorAll("[data-field]").forEach(field => {
        if (field.closest(".cell-row")) return;
        fields[field.dataset.field] = field.value || "";
      });
      return {
        fields,
        cells: Array.from(document.querySelectorAll(".cell-row")).map(collectCell),
        signature: getStorageSignature(),
        savedAt: new Date().toISOString()
      };
    }

    function setValue(id, value) {
      const el = document.getElementById(id);
      if (el && "value" in el) el.value = value || "";
    }

    function applyReportData(data) {
      storageRestoreInProgress = true;
      const fields = data && data.fields ? data.fields : {};
      setValue("anlageInput", fields.anlage);
      setValue("objectInput", fields.object);
      setValue("anlagenstandortInput", fields.anlagenstandort);
      setValue("dateInput", fields.date);
      setValue("anlagentypInput", fields.anlagentyp);
      setValue("batterietypInput", fields.batterietyp);
      setValue("batterietemperaturInput", fields.batterietemperatur);
      setValue("elektrolytSelect", fields.elektrolyt || "-");
      setValue("pruefergebnisSelect", fields.pruefergebnis || "Keine Mängel festgestellt");
      setValue("nextDateInput", fields.nextDate);
      setValue("bemerkungInput", fields.bemerkung);
      setValue("prueferInput", fields.pruefer);
      document.querySelectorAll("[data-field]").forEach(field => {
        if (field.closest(".cell-row")) return;
        const key = field.dataset.field;
        const isInspection = INSPECTION_FIELDS.some(item => item[0] === key);
        field.value = fields[key] || (isInspection ? "false" : "");
      });
      const list = document.getElementById("cellList");
      list.innerHTML = "";
      const rows = Array.isArray(data && data.cells) && data.cells.length ? data.cells : [{}];
      rows.forEach(row => addCell(row));
      setTodayIfEmpty();
      clearSignature(true);
      restoreSignatureFromStorage(data && data.signature);
      storageRestoreInProgress = false;
    }

    function saveToStorageNow() {
      if (storageRestoreInProgress) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collectReportData())); }
      catch (error) { console.warn("Eingaben konnten nicht lokal gespeichert werden:", error); }
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
      applyReportData(saved);
    }

    function clearForm() {
      if (!confirm("Alle Eingaben wirklich löschen?")) return;
      localStorage.removeItem(STORAGE_KEY);
      clearCurrentArchiveId();
      applyReportData(null);
      setArchiveStatus("Aktueller Prüfbericht wurde geleert. Archivierte Prüfberichte bleiben erhalten.");
    }

    function readStoredValue(key) { try { return localStorage.getItem(key); } catch { return null; } }
    function writeStoredValue(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
    function removeStoredValue(key) { try { localStorage.removeItem(key); } catch {} }
    function createArchiveId() { return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : "archive-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10); }
    function getCurrentArchiveId() { return readStoredValue(CURRENT_ARCHIVE_ID_KEY); }
    function setCurrentArchiveId(id) { if (id) writeStoredValue(CURRENT_ARCHIVE_ID_KEY, id); else clearCurrentArchiveId(); }
    function clearCurrentArchiveId() { removeStoredValue(CURRENT_ARCHIVE_ID_KEY); }
    function loadArchiveEntries() { try { const entries = JSON.parse(readStoredValue(ARCHIVE_STORAGE_KEY) || "[]"); return Array.isArray(entries) ? entries : []; } catch { return []; } }
    function writeArchiveEntries(entries) { return writeStoredValue(ARCHIVE_STORAGE_KEY, JSON.stringify(entries)); }

    function formatDateForFile(dateValue) {
      if (!dateValue) return new Date().toLocaleDateString("de-DE").replaceAll(".", "-");
      const parts = dateValue.split("-");
      if (parts.length !== 3) return dateValue;
      return parts[2] + "." + parts[1] + "." + parts[0];
    }

    function getDisplayDate(value) { return value ? formatDateForFile(value) : "Ohne Datum"; }

    function getArchiveTitle(entry) {
      const report = entry && entry.report ? entry.report : {};
      const fields = report.fields || {};
      const object = String(fields.object || "").trim() || "Ohne Objekt";
      const anlage = String(fields.anlage || "").trim() || "Ohne Anlagen Nr.";
      return anlage + " - " + object + " - " + getDisplayDate(fields.date || "");
    }

    function saveCurrentReportToArchive() {
      saveToStorageNow();
      const now = new Date().toISOString();
      const currentId = getCurrentArchiveId();
      const entries = loadArchiveEntries();
      const existingIndex = currentId ? entries.findIndex(entry => entry.id === currentId) : -1;
      const entry = {
        id: existingIndex >= 0 ? entries[existingIndex].id : createArchiveId(),
        createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now,
        updatedAt: now,
        report: collectReportData()
      };
      if (existingIndex >= 0) entries[existingIndex] = entry;
      else entries.push(entry);
      if (writeArchiveEntries(entries)) {
        setCurrentArchiveId(entry.id);
        renderArchiveList();
        setArchiveStatus("Prüfbericht wurde im Archiv gespeichert.");
      } else setArchiveStatus("Prüfbericht konnte nicht im Archiv gespeichert werden.");
    }

    function openArchiveEntry(id) {
      const entry = loadArchiveEntries().find(item => item.id === id);
      if (!entry) return;
      applyReportData(entry.report);
      setCurrentArchiveId(entry.id);
      saveToStorageNow();
      closeArchive();
      setArchiveStatus("Prüfbericht aus dem Archiv geöffnet.");
    }

    function deleteArchiveEntry(id) {
      const entries = loadArchiveEntries();
      const entry = entries.find(item => item.id === id);
      if (!entry) return;
      if (!confirm("Archiv-Eintrag '" + getArchiveTitle(entry) + "' löschen?")) return;
      writeArchiveEntries(entries.filter(item => item.id !== id));
      if (getCurrentArchiveId() === id) clearCurrentArchiveId();
      renderArchiveList();
      setArchiveStatus("Archiv-Eintrag wurde gelöscht.");
    }

    function renderArchiveList() {
      const archiveList = document.getElementById("archiveList");
      const entries = loadArchiveEntries().slice().sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
      archiveList.innerHTML = "";
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "archive-empty";
        empty.textContent = "Noch keine gespeicherten Prüfberichte im Archiv.";
        archiveList.appendChild(empty);
        return;
      }
      entries.forEach(entry => {
        const item = document.createElement("article");
        item.className = "archive-item";
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
        archiveList.appendChild(item);
      });
    }

    function openArchive() {
      renderArchiveList();
      document.getElementById("archiveOverlay").hidden = false;
    }

    function closeArchive() {
      document.getElementById("archiveOverlay").hidden = true;
    }

    function setArchiveStatus(message) {
      const status = document.getElementById("archiveStatus");
      if (!status) return;
      status.textContent = message || "";
      window.clearTimeout(archiveStatusTimer);
      if (message) archiveStatusTimer = window.setTimeout(() => { status.textContent = ""; }, 4000);
    }

    function sanitizeFileName(value) {
      return (value || "Pruefbericht-Zentralbatterie")
        .trim()
        .replace(/[\\\\/:*?"<>|]+/g, "-")
        .replace(/\\s+/g, "_")
        .slice(0, 80) || "Pruefbericht-Zentralbatterie";
    }

    function getPdfFileName() {
      const anlage = sanitizeFileName(document.getElementById("anlageInput").value || "Ohne Anlagen Nr.");
      const objectName = sanitizeFileName(document.getElementById("objectInput").value || "Ohne Objekt");
      const dateName = formatDateForFile(document.getElementById("dateInput").value);
      return anlage + "_" + objectName + "_" + dateName + ".pdf";
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

    function normalizePdfText(value) {
      return String(value || "").replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201C\\u201D]/g, '"').trim();
    }

    function yesNo(value) { return value === "true" ? "Ja" : "Nein"; }

    function addSectionTitle(doc, title, x, y, width) {
      doc.setFillColor("#d6001c");
      doc.rect(x, y, width, 6.2, "F");
      doc.setTextColor("#ffffff");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(title, x + 2, y + 4.3);
      return y + 6.2;
    }

    function drawCell(doc, label, value, x, y, width, height) {
      doc.setDrawColor("#9ca3af");
      doc.setLineWidth(0.2);
      doc.setFillColor("#ffffff");
      doc.rect(x, y, width, height, "FD");
      doc.setTextColor("#111827");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.9);
      doc.text(normalizePdfText(label), x + 1.7, y + 3.2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.6);
      const lines = doc.splitTextToSize(normalizePdfText(value || "-"), width - 3.4).slice(0, 2);
      doc.text(lines, x + 1.7, y + 6.8);
    }

    async function exportPdf() {
      const pdfButton = Array.from(document.querySelectorAll("button")).find(button => button.textContent.trim() === "PDF");
      const originalButtonText = pdfButton ? pdfButton.textContent : "";
      if (pdfButton) {
        pdfButton.disabled = true;
        pdfButton.textContent = "PDF wird erstellt...";
      }
      try {
        const JsPDF = await loadJsPdfIfNeeded();
        if (!JsPDF) {
          alert("PDF-Bibliothek konnte nicht geladen werden. Bitte Seite neu laden und erneut versuchen.");
          return;
        }
        const data = collectReportData();
        const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - margin * 2;
        let y = 9;

        function ensureSpace(needed) {
          if (y + needed <= pageHeight - margin - 10) return;
          doc.addPage("a4", "portrait");
          y = 12;
        }

        doc.setFillColor("#d6001c");
        doc.rect(margin, y, contentWidth, 10, "F");
        doc.setTextColor("#ffffff");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("PRÜFBERICHT ZENTRALBATTERIE-ANLAGE", pageWidth / 2, y + 6.8, { align: "center" });
        y += 14;

        y = addSectionTitle(doc, "Zuordnung", margin, y, contentWidth);
        const headerRows = [
          ["Anlagen Nr.", data.fields.anlage],
          ["Objekt", data.fields.object],
          ["Anlagenstandort", data.fields.anlagenstandort],
          ["Datum", data.fields.date ? formatDateForFile(data.fields.date) : ""]
        ];
        headerRows.forEach((row, index) => drawCell(doc, row[0], row[1], margin + (index % 2) * (contentWidth / 2), y + Math.floor(index / 2) * 9, contentWidth / 2, 9));
        y += 18 + 3;

        ensureSpace(55);
        y = addSectionTitle(doc, "Besichtigung", margin, y, contentWidth);
        INSPECTION_FIELDS.forEach(([key, label], index) => {
          const rowY = y + Math.floor(index / 2) * 7;
          const x = margin + (index % 2) * (contentWidth / 2);
          const labelWidth = contentWidth / 2 - 18;
          doc.setDrawColor("#d1d5db");
          doc.rect(x, rowY, labelWidth, 7);
          doc.rect(x + labelWidth, rowY, 18, 7);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.1);
          doc.setTextColor("#111827");
          doc.text(doc.splitTextToSize(label, labelWidth - 2).slice(0, 1), x + 1.4, rowY + 4.5);
          doc.setFont("helvetica", "bold");
          doc.text(yesNo(data.fields[key]), x + labelWidth + 9, rowY + 4.5, { align: "center" });
        });
        y += Math.ceil(INSPECTION_FIELDS.length / 2) * 7 + 3;

        ensureSpace(35);
        y = addSectionTitle(doc, "Zellenmessung", margin, y, contentWidth);
        const widths = [16, 42, 42, contentWidth - 100];
        const headers = ["Nr.", "U Netzausfall", "U Netzausfall 3h", "Elektrolytdichte"];
        let x = margin;
        headers.forEach((header, index) => {
          doc.setFillColor("#f2f2f7");
          doc.rect(x, y, widths[index], 7, "FD");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.2);
          doc.setTextColor("#111827");
          doc.text(header, x + 1.5, y + 4.7);
          x += widths[index];
        });
        y += 7;
        data.cells.forEach((cell, index) => {
          ensureSpace(8);
          const values = [String(index + 1), (cell.uNetzausfall || "-") + " V", (cell.uNetzausfall3h || "-") + " V", cell.elektrolytdichte || "-"];
          x = margin;
          values.forEach((value, valueIndex) => {
            doc.setFillColor("#ffffff");
            doc.rect(x, y, widths[valueIndex], 8, "FD");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.4);
            doc.text(String(value), x + 1.5, y + 5.2);
            x += widths[valueIndex];
          });
          y += 8;
        });
        y += 3;

        ensureSpace(45);
        y = addSectionTitle(doc, "Messungen", margin, y, contentWidth);
        MEASUREMENT_FIELDS.forEach(([key, label, unit, typeKey], index) => {
          const value = (data.fields[key] || "") + (data.fields[key] ? " " + unit : "");
          const extra = typeKey ? " " + (data.fields[typeKey] || "") : "";
          drawCell(doc, label, value + extra, margin + (index % 3) * (contentWidth / 3), y + Math.floor(index / 3) * 9, contentWidth / 3, 9);
        });
        y += Math.ceil(MEASUREMENT_FIELDS.length / 3) * 9 + 3;

        ensureSpace(55);
        y = addSectionTitle(doc, "Anlagendaten und Ergebnis", margin, y, contentWidth);
        const miscRows = [
          ["Anlagentyp", data.fields.anlagentyp],
          ["Batterietyp", data.fields.batterietyp],
          ["Batterietemperatur", data.fields.batterietemperatur ? data.fields.batterietemperatur + " °C" : ""],
          ["Elektrolyt", data.fields.elektrolyt],
          ["Prüfergebnis", data.fields.pruefergebnis],
          ["Nächster Prüftermin", data.fields.nextDate ? formatDateForFile(data.fields.nextDate) : ""]
        ];
        miscRows.forEach((row, index) => drawCell(doc, row[0], row[1], margin + (index % 2) * (contentWidth / 2), y + Math.floor(index / 2) * 9, contentWidth / 2, 9));
        y += Math.ceil(miscRows.length / 2) * 9 + 2;
        const remarkLines = doc.splitTextToSize(normalizePdfText(data.fields.bemerkung || "-"), contentWidth - 4);
        const remarkHeight = Math.max(14, Math.min(34, remarkLines.length * 4 + 6));
        drawCell(doc, "Bemerkungen", data.fields.bemerkung || "-", margin, y, contentWidth, remarkHeight);
        y += remarkHeight + 5;

        if (y + 35 > pageHeight - margin) {
          doc.addPage("a4", "portrait");
          y = 20;
        }
        const signatureHasContent = signaturePadState.canvas && !isCanvasBlank(signaturePadState.canvas);
        if (signatureHasContent) {
          try { doc.addImage(signaturePadState.canvas.toDataURL("image/png"), "PNG", margin, y, 62, 18, undefined, "FAST"); }
          catch { doc.text("Unterschrift konnte nicht eingebettet werden.", margin, y + 8); }
        }
        doc.setDrawColor("#9ca3af");
        doc.line(margin, y + 22, margin + 72, y + 22);
        doc.setTextColor("#111827");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text("Unterschrift", margin, y + 26);

        savePdfDocument(doc, getPdfFileName());
      } catch (error) {
        console.error("PDF-Export fehlgeschlagen:", error);
        alert("PDF konnte nicht erstellt werden. Bitte Seite neu laden und erneut versuchen.");
      } finally {
        if (pdfButton) {
          pdfButton.disabled = false;
          pdfButton.textContent = originalButtonText;
        }
      }
    }

    function setupSignatureCanvas() {
      const canvas = document.getElementById("signaturePad");
      if (!canvas) return;
      const oldData = signaturePadState.canvas && !isCanvasBlank(signaturePadState.canvas) ? signaturePadState.canvas.toDataURL("image/png") : null;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = "#1c1c1e";
      signaturePadState.canvas = canvas;
      signaturePadState.ctx = ctx;
      if (oldData) restoreSignatureFromStorage(oldData);
    }

    function getPointerPoint(event) {
      const rect = signaturePadState.canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function startSignature(event) {
      event.preventDefault();
      signaturePadState.isDrawing = true;
      signaturePadState.lastPoint = getPointerPoint(event);
    }

    function drawSignature(event) {
      if (!signaturePadState.isDrawing) return;
      event.preventDefault();
      const point = getPointerPoint(event);
      const ctx = signaturePadState.ctx;
      ctx.beginPath();
      ctx.moveTo(signaturePadState.lastPoint.x, signaturePadState.lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      signaturePadState.lastPoint = point;
    }

    function endSignature() {
      if (!signaturePadState.isDrawing) return;
      signaturePadState.isDrawing = false;
      signaturePadState.lastPoint = null;
      scheduleStorageSave();
    }

    function isCanvasBlank(canvas) {
      const context = canvas.getContext("2d");
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] !== 0) return false;
      }
      return true;
    }

    function getStorageSignature() {
      const canvas = signaturePadState.canvas;
      if (!canvas || isCanvasBlank(canvas)) return "";
      try { return canvas.toDataURL("image/png"); } catch { return ""; }
    }

    function clearSignature(skipSave = false) {
      const canvas = signaturePadState.canvas;
      const ctx = signaturePadState.ctx;
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!skipSave) scheduleStorageSave();
    }

    function restoreSignatureFromStorage(signatureData) {
      if (!signatureData || !signaturePadState.ctx || !signaturePadState.canvas) return;
      const canvas = signaturePadState.canvas;
      const ctx = signaturePadState.ctx;
      const rect = canvas.getBoundingClientRect();
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0, rect.width, rect.height);
      image.src = signatureData;
    }

    function init() {
      renderInspection();
      renderMeasurements();
      addCell();
      setupSignatureCanvas();
      restoreFromStorage();
      document.addEventListener("input", scheduleStorageSave);
      document.addEventListener("change", scheduleStorageSave);
      const canvas = document.getElementById("signaturePad");
      canvas.addEventListener("pointerdown", startSignature, { passive: false });
      canvas.addEventListener("pointermove", drawSignature, { passive: false });
      canvas.addEventListener("pointerup", endSignature);
      canvas.addEventListener("pointercancel", endSignature);
      window.addEventListener("resize", () => setupSignatureCanvas());
      document.getElementById("archiveOverlay").addEventListener("click", event => {
        if (event.target.id === "archiveOverlay") closeArchive();
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !document.getElementById("archiveOverlay").hidden) closeArchive();
      });
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          Promise.resolve({update:function(){return Promise.resolve();}}).catch(error => {
            console.warn("Service Worker konnte nicht registriert werden", error);
          });
        });
      }
    }

    init();
  <\/script>
</body>
</html>`;
  }

  function renderMenu() {
    const fragment = document.createDocumentFragment();
    MENU_SECTIONS.forEach(sectionConfig => {
      const section = document.createElement("section");
      section.className = `menu-section ${sectionConfig.accent} is-collapsed`;
      section.setAttribute("aria-labelledby", `${sectionConfig.id}Title`);

      const toggle = document.createElement("button");
      toggle.className = "menu-section-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", `${sectionConfig.id}Grid`);

      const title = document.createElement("span");
      title.className = "menu-section-title";
      title.id = `${sectionConfig.id}Title`;
      title.textContent = sectionConfig.title;
      const icon = document.createElement("span");
      icon.className = "menu-section-icon";
      icon.setAttribute("aria-hidden", "true");
      toggle.append(title, icon);

      const grid = document.createElement("div");
      grid.className = "menu-grid";
      grid.id = `${sectionConfig.id}Grid`;
      grid.setAttribute("aria-hidden", "true");
      const gridInner = document.createElement("div");
      gridInner.className = "menu-grid-inner";

      sectionConfig.modules.forEach(id => {
        const module = registry[id];
        if (!module) return;
        gridInner.append(createModuleCard(id, module, sectionConfig.id));
      });
      grid.append(gridInner);

      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(expanded));
        section.classList.toggle("is-collapsed", !expanded);
        grid.setAttribute("aria-hidden", String(!expanded));
      });

      section.append(toggle, grid);
      fragment.append(section);
    });
    moduleGrid.replaceChildren(fragment);
  }

  function createModuleCard(id, module, sectionId) {
      const card = document.createElement("article");
      card.className = "module-card";

      const body = document.createElement("div");
      const type = document.createElement("div");
      type.className = "module-kicker";
      type.textContent = KICKERS[sectionId] || module.group || "Modul";
      const title = document.createElement("h3");
      title.textContent = CARD_TITLES[id] || module.title;
      const description = document.createElement("p");
      description.textContent = module.description || "Bestehende FSMobile-Funktion.";
      body.append(type, title, description);

      const button = document.createElement("button");
      button.className = "open-module";
      button.type = "button";
      button.textContent = "Öffnen";
      button.addEventListener("click", () => openModule(id));

      card.append(body, button);
      return card;
  }

  function openModule(id, replaceHistory) {
    if (!isUnlocked) {
      showAuth();
      return;
    }

    const module = registry[id];
    if (!module) return;

    const html = decorateModuleHtml(module.html, id);
    activeModuleId = id;
    clearModuleActionBar();
    frame.srcdoc = html;
    frame.title = module.title;
    menuView.hidden = true;
    moduleView.hidden = false;
    backButton.hidden = false;
    subtitle.textContent = module.title;

    if (!replaceHistory) {
      history.pushState({ module: id }, "", `#${encodeURIComponent(id)}`);
    }
    window.setTimeout(syncModuleActionBar, 180);
    window.setTimeout(syncModuleActionBar, 520);
  }

  function showMenu(replaceHistory) {
    if (!isUnlocked) {
      showAuth();
      return;
    }

    activeModuleId = null;
    clearModuleActionBar();
    frame.srcdoc = "";
    menuView.hidden = false;
    moduleView.hidden = true;
    backButton.hidden = true;
    subtitle.textContent = "Menüauswahl";

    if (!replaceHistory) {
      history.pushState({ module: null }, "", location.pathname);
    }
  }

  function ensureModuleActionBar() {
    let actionBar = document.getElementById("moduleActionBar");
    if (!actionBar) {
      actionBar = document.createElement("div");
      actionBar.id = "moduleActionBar";
      actionBar.className = "module-action-bar";
      actionBar.setAttribute("aria-label", "Modul-Aktionen");
      topbar.appendChild(actionBar);
    }
    return actionBar;
  }

  function clearModuleActionBar() {
    window.clearTimeout(actionSyncTimer);
    window.clearTimeout(actionStatusTimer);
    const actionBar = document.getElementById("moduleActionBar");
    if (actionBar) {
      actionBar.replaceChildren();
      actionBar.hidden = true;
    }
    topbar.classList.remove("has-module-actions");
  }

  function frameDocument() {
    try {
      return frame.contentDocument;
    } catch (error) {
      return null;
    }
  }

  function actionKey(button) {
    const text = (button.textContent || "").replace(/\s+/g, " ").trim();
    const id = button.id || "";
    const classes = button.className || "";
    const haystack = `${id} ${classes}`;
    if (text === "Im Archiv speichern" || /archive-save|archiveSaveBtn|btn-archive-save/.test(haystack)) return "save";
    if (text === "Export" || /fsmobile-data-export/.test(classes)) return "export";
    if (text === "Import" || /fsmobile-data-import/.test(classes)) return "import";
    if (text === "Archiv" || /(^|\s)(archive-open|archive-btn)(\s|$)|archiveBtn/.test(haystack)) return "archive";
    if (text === "Leeren" || /(^|\s)(clear-btn|btn-clear)(\s|$)|clearButton|clearBtn/.test(haystack)) return "clear";
    if (text === "PDF" || text.indexOf("PDF wird erstellt") === 0 || /pdf-btn|pdfButton|pdfBtn/.test(haystack)) return "pdf";
    return "";
  }

  function actionLabel(key) {
    return {
      save: "Im Archiv speichern",
      archive: "Archiv",
      export: "Export",
      import: "Import",
      clear: "Leeren",
      pdf: "PDF"
    }[key] || key;
  }

  function actionClass(key) {
    return {
      save: "module-action-save",
      archive: "module-action-primary",
      export: "module-action-primary",
      import: "module-action-secondary",
      clear: "module-action-secondary",
      pdf: "module-action-primary"
    }[key] || "module-action-primary";
  }

  function collectFrameActionButtons(doc) {
    const order = ["save", "archive", "export", "import", "clear", "pdf"];
    const found = new Map();
    const directSelectors = {
      save: ".archive-save, .archive-save-btn, .btn-archive-save, #archiveSaveBtn",
      archive: ".archive-open, .archive-btn, #archiveBtn",
      export: ".fsmobile-data-export",
      import: ".fsmobile-data-import",
      clear: ".clear-btn, .btn-clear, #clearButton, #clearBtn",
      pdf: ".pdf-btn, #pdfButton, #pdfBtn"
    };
    Object.entries(directSelectors).forEach(([key, selector]) => {
      const button = doc.querySelector(selector);
      if (button && !button.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) found.set(key, button);
    });
    Array.from(doc.querySelectorAll("button")).forEach(button => {
      if (button.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) return;
      if (button.classList.contains("archive-close-btn") || button.classList.contains("danger")) return;
      const key = actionKey(button);
      if (!key || found.has(key)) return;
      found.set(key, button);
    });
    return order.filter(key => found.has(key)).map(key => ({ key, source: found.get(key) }));
  }

  function readFrameArchiveStatus(doc) {
    if (!doc) return "";
    const status = doc.querySelector("#archiveStatus, .archive-status");
    return status ? (status.textContent || "").replace(/\s+/g, " ").trim() : "";
  }

  function updateModuleActionStatus(message) {
    const status = document.getElementById("moduleActionStatus");
    if (!status) return;
    status.textContent = message || "";
    status.hidden = !message;
  }

  function syncModuleActionStatus() {
    const doc = frameDocument();
    updateModuleActionStatus(readFrameArchiveStatus(doc));
  }

  function activateFrameAction(key) {
    const doc = frameDocument();
    if (!doc) return;
    const action = collectFrameActionButtons(doc).find(item => item.key === key);
    if (!action) return;
    action.source.click();
    if (key === "save" || key === "archive" || key === "clear") {
      [80, 240, 700].forEach(delay => window.setTimeout(syncModuleActionStatus, delay));
    }
    window.setTimeout(syncModuleActionBar, 120);
  }

  function moduleUsesParentActions(id) {
    return /^pb-/.test(id || "") || MENU_SECTIONS.some(section => (
      section.id === "kalkulation" && section.modules.includes(id)
    ));
  }

  function syncModuleActionBar() {
    if (!activeModuleId || !moduleUsesParentActions(activeModuleId)) {
      clearModuleActionBar();
      return;
    }

    const doc = frameDocument();
    if (!doc || !doc.body) return;
    const actions = collectFrameActionButtons(doc);
    if (!actions.length) {
      actionSyncTimer = window.setTimeout(syncModuleActionBar, 180);
      return;
    }

    doc.body.classList.add("fsmobile-parent-actions-active");
    const actionBar = ensureModuleActionBar();
    const focusedKey = actionBar.contains(document.activeElement) ? document.activeElement.dataset.actionKey : "";
    actionBar.replaceChildren();
    const buttonRow = document.createElement("div");
    buttonRow.className = "module-action-buttons";
    actions.forEach(({ key, source }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `module-action-button ${actionClass(key)}`;
      button.dataset.actionKey = key;
      button.textContent = actionLabel(key);
      button.disabled = Boolean(source.disabled);
      button.addEventListener("click", () => activateFrameAction(key));
      buttonRow.appendChild(button);
      if (focusedKey === key) button.focus({ preventScroll: true });
    });
    const status = document.createElement("p");
    status.id = "moduleActionStatus";
    status.className = "module-action-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const statusText = readFrameArchiveStatus(doc);
    status.textContent = statusText;
    status.hidden = !statusText;
    actionBar.append(buttonRow, status);
    actionBar.hidden = false;
    topbar.classList.add("has-module-actions");
  }

  function decorateModuleHtml(html, id) {
    const bridge = `
      <script>
        window.FSMOBILE_EMBEDDED_MODULE = true;
        window.FSMOBILE_MODULE_ID = ${JSON.stringify(id)};
        (function(){
          if (navigator.serviceWorker) {
            try {
              navigator.serviceWorker.register = function(){ return Promise.resolve({ scope: location.href, update: function(){ return Promise.resolve(); } }); };
              navigator.serviceWorker.getRegistration = function(){ return Promise.resolve(null); };
              navigator.serviceWorker.getRegistrations = function(){ return Promise.resolve([]); };
            } catch (error) {}
          }
          document.addEventListener("click", function(event) {
            var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
            if (!link) return;
            var href = link.getAttribute("href") || "";
            if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) {
              event.preventDefault();
              if (/^(mailto:|tel:)/i.test(href)) location.href = href;
            }
          }, true);
          function markPositionCells() {
            document.querySelectorAll(".pos-field").forEach(function(field) {
              var cell = field.closest && field.closest("td");
              if (cell) cell.classList.add("fsm-pos-cell");
            });
          }

          function normalizedButtonText(button) {
            return (button.textContent || "").replace(/\\s+/g, " ").trim();
          }

          function actionRank(button) {
            var text = normalizedButtonText(button);
            var id = button.id || "";
            var classes = button.className || "";
            if (text === "Im Archiv speichern" || /archive-save|archiveSaveBtn|btn-archive-save/.test(id + " " + classes)) return 10;
            if (text === "Export" || /fsmobile-data-export/.test(classes)) return 30;
            if (text === "Import" || /fsmobile-data-import/.test(classes)) return 40;
            if (text === "Archiv" || /(^|\\s)(archive-open|archive-btn)(\\s|$)|archiveBtn/.test(id + " " + classes)) return 20;
            if (text === "Leeren" || /(^|\\s)(clear-btn|btn-clear)(\\s|$)|clearButton|clearBtn/.test(id + " " + classes)) return 45;
            if (text === "PDF" || text.indexOf("PDF wird erstellt") === 0 || /pdf-btn|pdfButton|pdfBtn/.test(id + " " + classes)) return 50;
            return 0;
          }

          function isHeaderActionButton(button) {
            if (!button || button.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) return false;
            if (button.classList.contains("archive-close-btn") || button.classList.contains("danger")) return false;
            return actionRank(button) > 0;
          }

          function ensureHeaderActions() {
            var header = document.querySelector("header, .title-bar");
            if (!header) {
              header = document.createElement("header");
              header.className = "fsmobile-generated-header";
              document.body.insertBefore(header, document.body.firstChild);
            }
            header.classList.add("fsmobile-actions-header");

            var actions = header.querySelector(".fsmobile-header-actions");
            if (!actions) {
              actions = header.querySelector(":scope > .title-actions, :scope > .toolbar");
            }
            if (!actions) {
              actions = document.createElement("div");
              header.appendChild(actions);
            }
            actions.classList.add("fsmobile-header-actions");
            actions.setAttribute("aria-label", "Aktionen");
            return actions;
          }

          function cleanupOldActionContainers(headerActions) {
            document.querySelectorAll(".button-area, .actions, .title-actions, .toolbar").forEach(function(container) {
              if (container === headerActions || container.closest(".fsmobile-header-actions, .archive-dialog, .archive-overlay, .pdf-render-wrapper")) return;
              var hasVisibleControl = Array.from(container.children).some(function(child) {
                if (child.matches && child.matches("input[type='hidden'], input[hidden], .fsmobile-report-transfer:empty")) return false;
                if (child.hidden) return false;
                if (child.matches && child.matches("button, a.button, input:not([type='hidden']), select, textarea")) return true;
                return (child.textContent || "").trim().length > 0 || child.querySelector("button, a.button, input:not([type='hidden']), select, textarea");
              });
              if (!hasVisibleControl) container.classList.add("fsmobile-actions-empty");
            });
          }

          function arrangeHeaderActions() {
            var buttons = Array.from(document.querySelectorAll("button")).filter(isHeaderActionButton);
            if (!buttons.length) return;
            var actions = ensureHeaderActions();
            buttons
              .sort(function(left, right) { return actionRank(left) - actionRank(right); })
              .forEach(function(button) { actions.appendChild(button); });
            cleanupOldActionContainers(actions);
          }

          function normalizeFsmobileKey(value) {
            return String(value || "")
              .toLowerCase()
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/ß/g, "ss")
              .replace(/[^a-z0-9]+/g, "");
          }

          function safeFsmobileFileSegment(value, fallback) {
            return String(value || fallback || "")
              .trim()
              .replace(/[\\\\/:*?"<>|]+/g, "-")
              .replace(/\\s+/g, "_")
              .replace(/_+/g, "_")
              .slice(0, 80) || fallback || "Ohne_Angabe";
          }

          function formatFsmobileDateForFile(value) {
            var raw = String(value || "").trim();
            var iso = raw.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
            if (iso) return iso[3] + "." + iso[2] + "." + iso[1];
            var german = raw.match(/^(\\d{1,2})\\.(\\d{1,2})\\.(\\d{4})$/);
            if (german) return german[1].padStart(2, "0") + "." + german[2].padStart(2, "0") + "." + german[3];
            if (raw) return raw;
            var now = new Date();
            var day = String(now.getDate()).padStart(2, "0");
            var month = String(now.getMonth() + 1).padStart(2, "0");
            return day + "." + month + "." + now.getFullYear();
          }

          function fieldLabelText(field) {
            var parts = [];
            if (field.id) {
              try {
                var explicit = document.querySelector("label[for='" + field.id.replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'") + "']");
                if (explicit) parts.push(explicit.textContent || "");
              } catch (error) {}
            }
            var wrapper = field.closest(".field-group, label, .form-field, .field, .control");
            if (wrapper) {
              var label = wrapper.matches("label") ? wrapper : wrapper.querySelector("label");
              if (label) parts.push(label.textContent || "");
            }
            parts.push(field.getAttribute("aria-label") || "");
            parts.push(field.getAttribute("placeholder") || "");
            return parts.join(" ");
          }

          function findFsmobileReportValue(keys) {
            var normalizedKeys = keys.map(normalizeFsmobileKey);
            var broadKeys = { anlage: true, nummer: true };
            for (var index = 0; index < keys.length; index += 1) {
              var key = keys[index];
              var direct = document.getElementById(key + "Input") || document.getElementById(key) || document.querySelector("[name='" + key + "']");
              if (direct && "value" in direct && direct.type !== "radio" && direct.type !== "checkbox" && direct.type !== "file" && direct.type !== "hidden" && String(direct.value || "").trim()) return direct.value;
            }
            var fields = Array.from(document.querySelectorAll("input, textarea, select")).filter(function(field) {
              return field.type !== "radio" && field.type !== "checkbox" && field.type !== "file" && field.type !== "hidden" && String(field.value || "").trim();
            });
            for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex += 1) {
              var field = fields[fieldIndex];
              var value = String(field.value || "").trim();
              if (value === "true" || value === "false") continue;
              var haystack = normalizeFsmobileKey([
                field.id || "",
                field.name || "",
                field.dataset ? field.dataset.field || "" : "",
                fieldLabelText(field)
              ].join(" "));
              if (normalizedKeys.some(function(key) { return key && !broadKeys[key] && haystack.indexOf(key) >= 0; })) return field.value;
            }
            return "";
          }

          function fsmobilePdfFileName(originalName) {
            if (originalName && !/\\.pdf$/i.test(String(originalName))) return originalName;
            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return originalName;
            var anlage = findFsmobileReportValue(["anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlage", "nummer"]);
            var object = findFsmobileReportValue(["object", "objekt"]);
            var date = findFsmobileReportValue(["date", "datum"]);
            if (!anlage && !object && !date) return originalName;
            return safeFsmobileFileSegment(anlage || "Ohne Anlagen Nr.", "Ohne Anlagen Nr.") + "_" +
              safeFsmobileFileSegment(object || "Ohne Objekt", "Ohne Objekt") + "_" +
              safeFsmobileFileSegment(formatFsmobileDateForFile(date), formatFsmobileDateForFile("")) + ".pdf";
          }
          window.FSMOBILE_PDF_FILE_NAME = fsmobilePdfFileName;

          function patchPdfInstance(instance) {
            if (!instance || instance.__fsmobileSavePatched || typeof instance.save !== "function") return instance;
            var originalSave = instance.save;
            Object.defineProperty(instance, "__fsmobileSavePatched", { value: true });
            instance.save = function(fileName) {
              var args = Array.prototype.slice.call(arguments);
              args[0] = fsmobilePdfFileName(fileName);
              return originalSave.apply(this, args);
            };
            return instance;
          }

          function patchJsPdfPrototype(JsPDF) {
            if (!JsPDF || !JsPDF.prototype || JsPDF.prototype.__fsmobileSavePatched) return;
            var originalSave = JsPDF.prototype.save;
            if (typeof originalSave !== "function") return;
            Object.defineProperty(JsPDF.prototype, "__fsmobileSavePatched", { value: true });
            JsPDF.prototype.save = function(fileName) {
              var args = Array.prototype.slice.call(arguments);
              args[0] = fsmobilePdfFileName(fileName);
              return originalSave.apply(this, args);
            };
          }

          function patchJsPdfConstructor(container, key) {
            var Original = container && container[key];
            if (typeof Original !== "function" || Original.__fsmobileConstructorPatched) return;
            function WrappedJsPDF() {
              var args = Array.prototype.slice.call(arguments);
              var Bound = Function.prototype.bind.apply(Original, [null].concat(args));
              return patchPdfInstance(new Bound());
            }
            Object.keys(Original).forEach(function(prop) {
              try { WrappedJsPDF[prop] = Original[prop]; } catch (error) {}
            });
            try { Object.setPrototypeOf(WrappedJsPDF, Original); } catch (error) {}
            WrappedJsPDF.prototype = Original.prototype;
            Object.defineProperty(WrappedJsPDF, "__fsmobileConstructorPatched", { value: true });
            Object.defineProperty(WrappedJsPDF, "__fsmobileOriginalConstructor", { value: Original });
            container[key] = WrappedJsPDF;
          }

          function installPdfFileNamePatch() {
            if (!document.__fsmobileDownloadNamePatched) {
              Object.defineProperty(document, "__fsmobileDownloadNamePatched", { value: true });
              document.addEventListener("click", function(event) {
                var link = event.target && event.target.closest ? event.target.closest("a[download]") : null;
                if (!link || !/\\.pdf$/i.test(link.download || "")) return;
                link.download = fsmobilePdfFileName(link.download);
              }, true);
            }
            var tries = 0;
            var timer = window.setInterval(function() {
              patchJsPdfPrototype(window.jspdf && window.jspdf.jsPDF);
              patchJsPdfPrototype(window.jsPDF);
              patchJsPdfConstructor(window.jspdf, "jsPDF");
              patchJsPdfConstructor(window, "jsPDF");
              tries += 1;
              if (tries > 80 || (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.__fsmobileConstructorPatched)) {
                window.clearInterval(timer);
              }
            }, 120);
          }

          function ensureRwaClearButton() {
            if (window.FSMOBILE_MODULE_ID !== "pb-rwa" || document.getElementById("fsmobileRwaClearButton")) return;
            var host = ensureHeaderActions();
            var button = document.createElement("button");
            button.type = "button";
            button.id = "fsmobileRwaClearButton";
            button.className = "clear-btn secondary";
            button.textContent = "Leeren";
            button.addEventListener("click", function() {
              if (typeof window.clearForm === "function") {
                window.clearForm();
                return;
              }
              if (typeof clearForm === "function") clearForm();
            });
            host.appendChild(button);
          }

          function setupReportDataTransfer() {
            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "") || document.getElementById("fsmobileReportImportFile")) return;

            var DATA_KIND = "fsmobile-pruefbericht-export";
            var FIELD_SELECTOR = "input, textarea, select";
            var addButtonPattern = /(hinzufügen|neue zeile|whd hinzufügen|patrone hinzufügen|druckgaserzeuger hinzufügen|öffnungselement hinzufügen)/i;
            var excludedStructuredKeys = {
              name: true,
              nameinput: true,
              pruefer: true,
              prueferinput: true,
              prufer: true,
              pruferinput: true,
              signature: true,
              signaturedata: true,
              signaturepad: true,
              unterschrift: true,
              digitaleunterschrift: true,
              signatur: true
            };

            function reportTitle() {
              return (document.title || window.FSMOBILE_MODULE_ID || "Pruefbericht").trim();
            }

            function normalizeKey(value) {
              return String(value || "")
                .toLowerCase()
                .replace(/ä/g, "ae")
                .replace(/ö/g, "oe")
                .replace(/ü/g, "ue")
                .replace(/ß/g, "ss")
                .replace(/[^a-z0-9]+/g, "");
            }

            function safeFileSegment(value, fallback) {
              return String(value || fallback || "")
                .trim()
                .replace(/[\\\\/:*?"<>|]+/g, "-")
                .replace(/\\s+/g, "_")
                .replace(/_+/g, "_")
                .slice(0, 80) || fallback || "Ohne_Angabe";
            }

            function formatDateForExportName(value) {
              var raw = String(value || "").trim();
              var match = raw.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
              if (match) return match[3] + "." + match[2] + "." + match[1];
              if (raw) return raw;
              var now = new Date();
              var day = String(now.getDate()).padStart(2, "0");
              var month = String(now.getMonth() + 1).padStart(2, "0");
              return day + "." + month + "." + now.getFullYear();
            }

            function labelTextFor(field) {
              var parts = [];
              if (field.id) {
                var explicit = null;
                try {
                  explicit = document.querySelector("label[for='" + field.id.replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'") + "']");
                } catch (error) {}
                if (explicit) parts.push(explicit.textContent || "");
              }
              var wrapper = field.closest(".field-group, label, .form-field, .field, .control");
              if (wrapper) {
                var label = wrapper.matches("label") ? wrapper : wrapper.querySelector("label");
                if (label) parts.push(label.textContent || "");
              }
              parts.push(field.getAttribute("aria-label") || "");
              parts.push(field.getAttribute("placeholder") || "");
              return parts.join(" ");
            }

            function isExcludedField(field) {
              if (!field) return false;
              var idKey = normalizeKey(field.id);
              var nameKey = normalizeKey(field.name);
              var dataKey = normalizeKey(field.dataset ? field.dataset.field || "" : "");
              var labelKey = normalizeKey(labelTextFor(field));
              return Boolean(
                excludedStructuredKeys[idKey] ||
                excludedStructuredKeys[nameKey] ||
                excludedStructuredKeys[dataKey] ||
                labelKey === "name" ||
                labelKey.indexOf("nameeingeben") >= 0 ||
                labelKey === "pruefer" ||
                labelKey === "prufer" ||
                labelKey.indexOf("unterschrift") >= 0 ||
                labelKey.indexOf("signatur") >= 0
              );
            }

            function isExcludedFieldData(fieldData) {
              if (!fieldData) return false;
              return Boolean(
                excludedStructuredKeys[normalizeKey(fieldData.id)] ||
                excludedStructuredKeys[normalizeKey(fieldData.name)] ||
                excludedStructuredKeys[normalizeKey(fieldData.dataField)] ||
                excludedStructuredKeys[normalizeKey(fieldData.className)]
              );
            }

            function isExcludedCanvas(canvas) {
              if (!canvas) return false;
              var idKey = normalizeKey(canvas.id);
              var labelKey = normalizeKey(canvas.getAttribute("aria-label") || "");
              return Boolean(
                excludedStructuredKeys[idKey] ||
                labelKey.indexOf("unterschrift") >= 0 ||
                labelKey.indexOf("signatur") >= 0
              );
            }

            function findReportValue(keys) {
              for (var index = 0; index < keys.length; index += 1) {
                var key = keys[index];
                var field = document.getElementById(key + "Input") || document.getElementById(key) || document.querySelector("[name='" + key + "']");
                if (field && "value" in field && field.type !== "radio" && field.type !== "checkbox" && field.type !== "file" && field.type !== "hidden" && String(field.value || "").trim()) return field.value;
              }
              return "";
            }

            function exportFileName() {
              var anlage = safeFileSegment(findReportValue(["anlagenNr", "anlagenNummer", "anlage"]) || "Ohne Anlagen Nr.", "Ohne Anlagen Nr.");
              var object = safeFileSegment(findReportValue(["object", "objekt"]) || "Ohne Objekt", "Ohne Objekt");
              var date = safeFileSegment(formatDateForExportName(findReportValue(["date", "datum"])), formatDateForExportName(""));
              return anlage + "_" + object + "_" + date + ".json";
            }

            function isExcludedStructuredKey(key) {
              return Boolean(excludedStructuredKeys[normalizeKey(key)]);
            }

            function sanitizeStructuredData(value) {
              if (Array.isArray(value)) return value.map(sanitizeStructuredData);
              if (!value || typeof value !== "object") return value;
              var copy = {};
              Object.keys(value).forEach(function(key) {
                if (isExcludedStructuredKey(key)) return;
                copy[key] = sanitizeStructuredData(value[key]);
              });
              return copy;
            }

            function reportControls() {
              return Array.from(document.querySelectorAll(FIELD_SELECTOR)).filter(function(field) {
                return field.type !== "file" && field.type !== "hidden" && !field.closest(".fsmobile-report-transfer") && !isExcludedField(field);
              });
            }

            function fieldIdentity(field, index) {
              return {
                index: index,
                tag: field.tagName.toLowerCase(),
                type: field.type || "",
                id: field.id || "",
                name: field.name || "",
                dataField: field.dataset ? field.dataset.field || "" : "",
                className: field.className || ""
              };
            }

            function serializeField(field, index) {
              var data = fieldIdentity(field, index);
              if (field.type === "checkbox" || field.type === "radio") {
                data.checked = Boolean(field.checked);
              } else if (field.tagName === "SELECT") {
                data.value = field.value;
                data.selectedIndex = field.selectedIndex;
              } else {
                data.value = field.value || "";
              }
              return data;
            }

            function canvasSelector(canvas, index) {
              return canvas.id && /^[A-Za-z][\\w:-]*$/.test(canvas.id) ? "#" + canvas.id : "canvas:nth-of-type(" + (index + 1) + ")";
            }

            function serializeCanvases() {
              return Array.from(document.querySelectorAll("canvas")).map(function(canvas, index) {
                if (isExcludedCanvas(canvas)) return null;
                try {
                  return {
                    selector: canvasSelector(canvas, index),
                    width: canvas.width,
                    height: canvas.height,
                    dataUrl: canvas.toDataURL("image/png")
                  };
                } catch (error) {
                  return null;
                }
              }).filter(Boolean);
            }

            function collectStructuredData() {
              var collectors = ["buildStoragePayload", "collectReportData", "collectData"];
              for (var index = 0; index < collectors.length; index += 1) {
                var fn = window[collectors[index]];
                if (typeof fn !== "function") continue;
                try {
                  return { collector: collectors[index], data: sanitizeStructuredData(fn()) };
                } catch (error) {}
              }
              return null;
            }

            function applyStructuredData(structured) {
              if (!structured || !structured.data) return false;
              var appliers = ["applyStoragePayload", "applyReportData", "applyData"];
              for (var index = 0; index < appliers.length; index += 1) {
                var fn = window[appliers[index]];
                if (typeof fn !== "function") continue;
                try {
                  fn(structured.data);
                  return true;
                } catch (error) {}
              }
              return false;
            }

            function dispatchFieldEvents(field) {
              field.dispatchEvent(new Event("input", { bubbles: true }));
              field.dispatchEvent(new Event("change", { bubbles: true }));
            }

            function excludedControls() {
              return Array.from(document.querySelectorAll(FIELD_SELECTOR)).filter(function(field) {
                return field.type !== "file" && field.type !== "hidden" && !field.closest(".fsmobile-report-transfer") && isExcludedField(field);
              });
            }

            function rememberExcludedValues() {
              return {
                fields: excludedControls().map(function(field) {
                  return {
                    field: field,
                    checked: Boolean(field.checked),
                    selectedIndex: field.selectedIndex,
                    value: field.value || ""
                  };
                }),
                canvases: Array.from(document.querySelectorAll("canvas")).filter(isExcludedCanvas).map(function(canvas) {
                  var dataUrl = "";
                  try { dataUrl = canvas.toDataURL("image/png"); } catch (error) {}
                  return { canvas: canvas, dataUrl: dataUrl };
                })
              };
            }

            function restoreExcludedValues(snapshot) {
              if (!snapshot) return;
              snapshot.fields.forEach(function(item) {
                if (!item.field || !document.contains(item.field)) return;
                if (item.field.type === "checkbox" || item.field.type === "radio") item.field.checked = item.checked;
                else if (item.field.tagName === "SELECT") {
                  item.field.value = item.value;
                  if (item.field.value !== item.value) item.field.selectedIndex = item.selectedIndex;
                } else item.field.value = item.value;
                dispatchFieldEvents(item.field);
              });
              snapshot.canvases.forEach(function(item) {
                if (!item.canvas || !document.contains(item.canvas) || !item.dataUrl) return;
                var context = item.canvas.getContext("2d");
                var image = new Image();
                image.onload = function() {
                  context.clearRect(0, 0, item.canvas.width, item.canvas.height);
                  context.drawImage(image, 0, 0, item.canvas.width, item.canvas.height);
                  item.canvas.dispatchEvent(new Event("change", { bubbles: true }));
                };
                image.src = item.dataUrl;
              });
            }

            function applyField(field, data) {
              if (!field || !data) return;
              if (field.type === "checkbox" || field.type === "radio") {
                field.checked = Boolean(data.checked);
              } else if (field.tagName === "SELECT") {
                field.value = data.value || "";
                if (field.value !== data.value && typeof data.selectedIndex === "number") field.selectedIndex = data.selectedIndex;
              } else {
                field.value = data.value || "";
                if (field.tagName === "TEXTAREA") {
                  field.style.height = "auto";
                  field.style.height = Math.max(field.scrollHeight, 30) + "px";
                }
              }
              dispatchFieldEvents(field);
            }

            function findAddButtons() {
              return Array.from(document.querySelectorAll("button")).filter(function(button) {
                if (button.closest(".fsmobile-report-transfer") || button.disabled) return false;
                var text = (button.textContent || "").trim();
                return addButtonPattern.test(text) || /(^|\\s)(success|add-btn|btn-success)(\\s|$)/.test(button.className || "") || /^add/i.test(button.id || "");
              });
            }

            async function ensureEnoughControls(targetCount) {
              var guard = 0;
              while (reportControls().length < targetCount && guard < 60) {
                var buttons = findAddButtons();
                if (!buttons.length) break;
                buttons[0].click();
                guard += 1;
                await new Promise(function(resolve) { setTimeout(resolve, 60); });
              }
            }

            function applyCanvases(canvases) {
              if (!Array.isArray(canvases)) return;
              canvases.forEach(function(item) {
                if (!item || !item.dataUrl || !item.selector) return;
                var canvas = document.querySelector(item.selector);
                if (!canvas || isExcludedCanvas(canvas)) return;
                var context = canvas.getContext("2d");
                var image = new Image();
                image.onload = function() {
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.drawImage(image, 0, 0, canvas.width, canvas.height);
                  canvas.dispatchEvent(new Event("change", { bubbles: true }));
                };
                image.src = item.dataUrl;
              });
            }

            function downloadExport() {
              var payload = {
                kind: DATA_KIND,
                version: 1,
                moduleId: window.FSMOBILE_MODULE_ID,
                title: reportTitle(),
                exportedAt: new Date().toISOString(),
                structured: collectStructuredData(),
                fields: reportControls().map(serializeField),
                canvases: serializeCanvases()
              };
              var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
              var url = URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = url;
              link.download = exportFileName();
              document.body.appendChild(link);
              link.click();
              link.remove();
              setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
            }

            async function importExportFile(file) {
              if (!file) return;
              var payload;
              try {
                payload = JSON.parse(await file.text());
              } catch (error) {
                alert("Exportdatei konnte nicht gelesen werden.");
                return;
              }
              if (!payload || payload.kind !== DATA_KIND || payload.moduleId !== window.FSMOBILE_MODULE_ID || !Array.isArray(payload.fields)) {
                alert("Diese Exportdatei passt nicht zu diesem Prüfbericht.");
                return;
              }
              var importFields = payload.fields.filter(function(fieldData) { return !isExcludedFieldData(fieldData); });
              var excludedSnapshot = rememberExcludedValues();
              var usedStructuredImport = applyStructuredData(sanitizeStructuredData(payload.structured));
              await ensureEnoughControls(importFields.length);
              var controls = reportControls();
              if (!usedStructuredImport) {
                importFields.forEach(function(fieldData, index) {
                  applyField(controls[index], fieldData);
                });
              }
              applyCanvases(payload.canvases);
              restoreExcludedValues(excludedSnapshot);
              window.setTimeout(function() {
                document.dispatchEvent(new Event("input", { bubbles: true }));
                document.dispatchEvent(new Event("change", { bubbles: true }));
              }, 80);
            }

            function installControls() {
              var host = ensureHeaderActions();
              if (!host) {
                host = document.createElement("div");
                host.className = "button-area fsmobile-report-transfer";
                document.body.insertBefore(host, document.body.firstChild);
              }

              var wrapper = document.createElement("span");
              wrapper.className = "fsmobile-report-transfer";
              var exportButton = document.createElement("button");
              exportButton.type = "button";
              exportButton.className = "fsmobile-data-export btn-archive";
              exportButton.textContent = "Export";
              exportButton.addEventListener("click", downloadExport);

              var importButton = document.createElement("button");
              importButton.type = "button";
              importButton.className = "fsmobile-data-import secondary";
              importButton.textContent = "Import";

              var fileInput = document.createElement("input");
              fileInput.id = "fsmobileReportImportFile";
              fileInput.type = "file";
              fileInput.accept = "application/json,.json";
              fileInput.hidden = true;
              fileInput.addEventListener("change", function() {
                importExportFile(fileInput.files && fileInput.files[0]).finally(function() {
                  fileInput.value = "";
                });
              });
              importButton.addEventListener("click", function() { fileInput.click(); });

              wrapper.append(exportButton, importButton, fileInput);
              host.append(wrapper);
              arrangeHeaderActions();
            }

            installControls();
          }
          document.addEventListener("DOMContentLoaded", function() {
            markPositionCells();
            installPdfFileNamePatch();
            setupReportDataTransfer();
            ensureRwaClearButton();
            arrangeHeaderActions();
            var arrangeTimer = 0;
            new MutationObserver(function() {
              markPositionCells();
              window.clearTimeout(arrangeTimer);
              arrangeTimer = window.setTimeout(arrangeHeaderActions, 60);
            }).observe(document.body, { childList: true, subtree: true });
          });
        }());
      <\/script>
      <style>
        #reportTable col.col-pos,
        table col.col-pos,
        .col-pos {
          width: 76px !important;
          min-width: 76px !important;
        }

        td.fsm-pos-cell,
        td:has(> .pos-field) {
          padding-inline: 3px !important;
        }

        .pos-field {
          width: 100% !important;
          min-width: 58px !important;
          padding-inline: 2px !important;
          text-align: center !important;
          font-variant-numeric: tabular-nums;
          overflow: visible !important;
        }

        .fsmobile-report-transfer {
          display: inline-flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          align-items: center !important;
        }

        .fsmobile-actions-header {
          display: flex !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          gap: 14px !important;
        }

        .fsmobile-header-actions {
          margin-left: auto !important;
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 8px !important;
          max-width: min(100%, 620px) !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }

        .fsmobile-header-actions button,
        .fsmobile-header-actions .fsmobile-report-transfer button {
          width: auto !important;
          min-width: 0 !important;
          flex: 0 0 auto !important;
          white-space: nowrap !important;
        }

        .fsmobile-actions-empty {
          display: none !important;
        }

        body.fsmobile-parent-actions-active .fsmobile-header-actions,
        body.fsmobile-parent-actions-active .fsmobile-actions-empty {
          display: none !important;
        }

        @media (max-width: 760px) {
          .fsmobile-actions-header {
            align-items: stretch !important;
            flex-direction: column !important;
          }

          .fsmobile-header-actions {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            justify-content: flex-start !important;
          }
        }
      </style>
    `;

    const patchedHtml = /^pb-/.test(id || "")
      ? html
        .replace(/(\b[\w$]+\.save\()([^\n;]+)(\);)/g, "$1(window.FSMOBILE_PDF_FILE_NAME ? window.FSMOBILE_PDF_FILE_NAME($2) : $2)$3")
        .replace(/(\blink\.download\s*=\s*)([^;\n]+)(;)/g, "$1(window.FSMOBILE_PDF_FILE_NAME ? window.FSMOBILE_PDF_FILE_NAME($2) : $2)$3")
      : html;

    return patchedHtml.replace(/<head([^>]*)>/i, `<head$1>${bridge}`);
  }

  function handleRoute(replaceHistory) {
    if (!isUnlocked) {
      showAuth();
      return;
    }

    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (id && registry[id]) {
      openModule(id, replaceHistory);
    } else {
      showMenu(replaceHistory);
    }
  }

  backButton.addEventListener("click", () => showMenu(false));
  frame.addEventListener("load", () => {
    window.clearTimeout(actionSyncTimer);
    actionSyncTimer = window.setTimeout(syncModuleActionBar, 120);
  });
  window.addEventListener("popstate", () => handleRoute(true));

  if ("serviceWorker" in navigator && window.self === window.top) {
    navigator.serviceWorker.register("sw.js").catch(() => undefined);
  }

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  function hasStoredAccess() {
    return localStorage.getItem(AUTH_UNLOCK_KEY) === AUTH_UNLOCK_VALUE;
  }

  function configureAuthText() {
    authMode.textContent = "FSMOBILE";
    authTitle.textContent = "Zugriff geschützt";
    authHint.textContent = "Bitte Passwort eingeben, um die App-Funktionen freizuschalten.";
    authSubmit.textContent = "Entsperren";
    authCode.autocomplete = "current-password";
  }

  function showAuth() {
    if (hasStoredAccess()) {
      unlockApp();
      return;
    }
    configureAuthText();
    authOverlay.hidden = false;
    window.setTimeout(() => authCode.focus(), 50);
  }

  function unlockApp() {
    isUnlocked = true;
    authError.textContent = "";
    authCode.value = "";
    authOverlay.hidden = true;
    handleRoute(true);
  }

  function lockApp() {
    isUnlocked = false;
    frame.srcdoc = "";
    menuView.hidden = false;
    moduleView.hidden = true;
    backButton.hidden = true;
    subtitle.textContent = "Menüauswahl";
    history.replaceState({ module: null }, "", location.pathname);
    showAuth();
  }

  authForm.addEventListener("submit", async event => {
    event.preventDefault();
    const value = authCode.value;

    const hash = await digest(value);
    if (hash === REQUIRED_PASS_HASH) {
      localStorage.setItem(AUTH_UNLOCK_KEY, AUTH_UNLOCK_VALUE);
      localStorage.removeItem(OLD_PASS_HASH_KEY);
      unlockApp();
      return;
    }

    authError.textContent = "Passwort ist nicht korrekt.";
    authCode.select();
  });

  renderMenu();
  localStorage.removeItem(OLD_PASS_HASH_KEY);
  showAuth();
}());
