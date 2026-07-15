(function () {
  "use strict";

  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES["auftrag-bescheinigungen"] = {
    title: "Auftrag Bescheinigungen",
    group: "Kalkulation",
    description: "Auftrags- und Projektdaten für Bescheinigungen erfassen, archivieren und als PDF ausgeben.",
    html: String.raw`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#ff9500" />
  <meta name="application-name" content="Auftrag Bescheinigungen" />
  <title>Auftrag Bescheinigungen</title>
  <script defer src="vendor/jspdf.umd.min.js"></script>
  <style>
    :root {
      --primary: #007aff;
      --accent: #ff9500;
      --danger: #ff3b30;
      --neutral: #8e8e93;
      --text: #1c1c1e;
      --muted: #6e6e73;
      --field: rgba(255,255,255,.07);
      --line: rgba(255,255,255,.42);
      --surface: rgba(255,255,255,.11);
      --radius-lg: 22px;
      --radius-md: 14px;
      --radius-sm: 10px;
      --shadow: 0 12px 34px rgba(0,0,0,.08);
    }

    * { box-sizing: border-box; }
    html { background: transparent; -webkit-text-size-adjust: 100%; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--text);
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Arial, sans-serif;
    }
    input, select, textarea, button { font: inherit; }
    button { -webkit-tap-highlight-color: transparent; }

    .container {
      width: min(100%, 1180px);
      margin: 0 auto;
      padding: 18px;
    }
    .title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
      padding: 4px 2px;
    }
    h1 {
      margin: 0;
      font-size: 34px;
      line-height: 1.1;
      font-weight: 850;
      letter-spacing: 0;
    }
    h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.2;
      font-weight: 800;
      letter-spacing: 0;
    }
    .title-actions,
    .button-area {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 10px;
      padding: 12px;
      border: 1px solid rgba(255,255,255,.44);
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,.07);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 8px 24px rgba(0,0,0,.05);
      -webkit-backdrop-filter: blur(18px) saturate(1.08);
      backdrop-filter: blur(18px) saturate(1.08);
    }
    .button-area { margin-top: 16px; }
    button {
      min-height: 46px;
      padding: 12px 18px;
      border: 0;
      border-radius: 999px;
      color: #fff;
      background: linear-gradient(180deg, #1688ff 0%, var(--primary) 100%);
      box-shadow: 0 9px 18px rgba(0,122,255,.2), inset 0 1px 0 rgba(255,255,255,.3);
      cursor: pointer;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0;
    }
    button:active { transform: scale(.98); }
    button:focus-visible { outline: 3px solid rgba(0,122,255,.24); outline-offset: 2px; }
    .archive-save { background: linear-gradient(180deg, #ffad33 0%, var(--accent) 100%); box-shadow: 0 9px 18px rgba(255,149,0,.22), inset 0 1px 0 rgba(255,255,255,.3); }
    .clear-btn, .archive-close-btn { background: linear-gradient(180deg, #a4a4aa 0%, var(--neutral) 100%); box-shadow: 0 9px 18px rgba(99,99,102,.15), inset 0 1px 0 rgba(255,255,255,.28); }
    .archive-delete-btn { background: linear-gradient(180deg, #ff5147 0%, var(--danger) 100%); }

    .form-section {
      margin-bottom: 14px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,.44);
      border-radius: var(--radius-lg);
      background: linear-gradient(145deg, rgba(255,255,255,.2), rgba(255,255,255,.08) 58%, rgba(255,149,0,.025)), var(--surface);
      box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,.28);
      -webkit-backdrop-filter: blur(18px) saturate(1.08);
      backdrop-filter: blur(18px) saturate(1.08);
    }
    .section-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .section-heading::before {
      width: 4px;
      height: 20px;
      border-radius: 3px;
      background: var(--accent);
      content: "";
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: start;
    }
    .field-group {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 6px;
    }
    .field-group label {
      min-height: 15px;
      padding-left: 2px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.2;
      font-weight: 760;
      letter-spacing: 0;
    }
    input, select, textarea {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: var(--radius-sm);
      color: var(--text);
      background: var(--field);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
      font-size: 15px;
      line-height: 1.35;
    }
    select { height: 44px; min-height: 44px; appearance: auto; }
    textarea { display: block; resize: none; overflow: hidden; }
    .address-field { min-height: 116px; }
    .remarks-field { min-height: 154px; }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: rgba(0,122,255,.5);
      box-shadow: 0 0 0 4px rgba(0,122,255,.12), inset 0 1px 0 rgba(255,255,255,.22);
    }
    .stacked-fields { display: grid; gap: 12px; }
    .single-field { margin-top: 12px; }
    .completion-grid {
      display: grid;
      width: min(100%, 620px);
      margin-left: auto;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .archive-status { display: none; }

    .archive-overlay[hidden] { display: none; }
    .archive-overlay {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(28,28,30,.36);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
    .archive-dialog {
      display: flex;
      width: min(100%, 820px);
      max-height: min(720px, 92vh);
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.6);
      border-radius: var(--radius-lg);
      background: rgba(244,247,251,.96);
      box-shadow: 0 24px 70px rgba(0,0,0,.22);
    }
    .archive-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 18px;
      border-bottom: 1px solid rgba(60,60,67,.16);
    }
    .archive-header h2 { font-size: 22px; }
    .archive-filter-tools {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(60,60,67,.12);
    }
    .archive-filter-tools input { min-width: 0; flex: 1; background: #fff; border-color: rgba(60,60,67,.18); }
    .archive-filter-count { color: var(--muted); font-size: 13px; font-weight: 750; white-space: nowrap; }
    .archive-list { display: grid; gap: 9px; padding: 12px; overflow: auto; }
    .archive-empty { margin: 0; padding: 24px 12px; color: var(--muted); text-align: center; font-weight: 750; }
    .archive-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 8px;
      align-items: center;
      padding: 13px;
      border: 1px solid rgba(60,60,67,.14);
      border-radius: var(--radius-md);
      background: #f7f7fb;
    }
    .archive-item-current { border-color: rgba(0,122,255,.46); box-shadow: 0 0 0 2px rgba(0,122,255,.1); }
    .archive-title { color: var(--text); font-weight: 850; line-height: 1.25; overflow-wrap: anywhere; }
    .archive-meta { margin-top: 4px; color: var(--muted); font-size: 12px; font-weight: 700; line-height: 1.35; overflow-wrap: anywhere; }
    .archive-item button { min-height: 40px; padding: 9px 14px; font-size: 13px; box-shadow: none; }

    @media (max-width: 680px) {
      .container { padding: 12px; }
      .title-bar, .archive-header { align-items: stretch; flex-direction: column; }
      .title-actions, .title-actions button, .button-area button, .archive-header button { width: 100%; }
      .form-grid, .completion-grid { grid-template-columns: 1fr; }
      .completion-grid { width: 100%; }
      .archive-item { grid-template-columns: 1fr; }
      .archive-item button { width: 100%; }
      .archive-filter-tools { align-items: stretch; flex-direction: column; }
    }
  </style>
</head>
<body>
  <main class="container">
    <header class="title-bar">
      <h1>Auftrag Bescheinigungen</h1>
      <div class="title-actions" aria-label="Formularaktionen">
        <button type="button" class="archive-save" id="archiveSaveBtn">Im Archiv speichern</button>
        <button type="button" class="archive-open" id="archiveBtn">Archiv</button>
        <button type="button" class="clear-btn" id="clearBtn">Leeren</button>
        <button type="button" class="pdf-btn" id="pdfBtn">PDF</button>
      </div>
    </header>

    <form id="auftragForm" autocomplete="off">
      <section class="form-section" aria-label="Projektdaten">
        <div class="form-grid">
          <div class="field-group">
            <label for="auftraggeber">Auftraggeber</label>
            <textarea class="address-field" id="auftraggeber" name="auftraggeber" rows="4"></textarea>
          </div>
          <div class="field-group">
            <label for="objekt">Objekt</label>
            <textarea class="address-field" id="objekt" name="objekt" rows="4"></textarea>
          </div>
        </div>
        <div class="form-grid single-field">
          <div class="field-group">
            <label for="gewerk">Gewerk</label>
            <input id="gewerk" name="gewerk" type="text" />
          </div>
          <div class="field-group">
            <label for="ansprechpartnerIntern">Projekt Ansprechpartner intern</label>
            <input id="ansprechpartnerIntern" name="ansprechpartnerIntern" type="text" />
          </div>
        </div>
      </section>

      <section class="form-section" aria-label="Standort- und Ansprechpartnerdaten">
        <div class="form-grid">
          <div class="field-group">
            <label for="standort">Standort</label>
            <textarea class="address-field" id="standort" name="standort" rows="4"></textarea>
          </div>
          <div class="stacked-fields">
            <div class="field-group">
              <label for="ansprechpartnerExternName">Projekt Ansprechpartner extern, Name</label>
              <input id="ansprechpartnerExternName" name="ansprechpartnerExternName" type="text" />
            </div>
            <div class="field-group">
              <label for="ansprechpartnerExternEmail">Projekt Ansprechpartner extern, Emailadresse</label>
              <input id="ansprechpartnerExternEmail" name="ansprechpartnerExternEmail" type="email" inputmode="email" />
            </div>
          </div>
        </div>
      </section>

      <section class="form-section" aria-label="Dokumentdaten">
        <div class="form-grid">
          <div class="field-group">
            <label for="lieferant">Lieferant</label>
            <input id="lieferant" name="lieferant" type="text" />
          </div>
          <div class="field-group">
            <label for="rgProjektIntern">RG-Nr/Projekt intern</label>
            <input id="rgProjektIntern" name="rgProjektIntern" type="text" />
          </div>
        </div>
        <div class="form-grid single-field">
          <div class="field-group">
            <label for="dokument">Dokument</label>
            <select id="dokument" name="dokument">
              <option value="">Bitte auswählen</option>
              <option value="Errichterbescheinigung">Errichterbescheinigung</option>
              <option value="Ausstattungsbescheinigung HFG">Ausstattungsbescheinigung HFG</option>
              <option value="Mängelfreimeldung">Mängelfreimeldung</option>
            </select>
          </div>
          <div class="field-group">
            <label for="datumErrichtung">Datum Errichtung</label>
            <input id="datumErrichtung" name="datumErrichtung" type="date" />
          </div>
        </div>
        <div class="field-group single-field">
          <label for="zulassung">Zulassung</label>
          <input id="zulassung" name="zulassung" type="text" />
        </div>
      </section>

      <section class="form-section" aria-label="Bemerkungen">
        <div class="field-group">
          <label for="bemerkungen">Bemerkungen</label>
          <textarea class="remarks-field" id="bemerkungen" name="bemerkungen" rows="6"></textarea>
        </div>
      </section>

      <section class="form-section" aria-label="Formularabschluss">
        <div class="completion-grid">
          <div class="field-group">
            <label for="datum">Datum</label>
            <input id="datum" name="datum" type="date" />
          </div>
          <div class="field-group">
            <label for="name">Name</label>
            <input id="name" name="name" type="text" />
          </div>
        </div>
      </section>
    </form>

    <p class="archive-status" id="archiveStatus" role="status" aria-live="polite"></p>
  </main>

  <div class="archive-overlay" id="archiveOverlay" hidden>
    <div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle">
      <div class="archive-header">
        <h2 id="archiveTitle">Archiv</h2>
        <button type="button" class="archive-close-btn" id="archiveCloseButton">Schließen</button>
      </div>
      <div class="archive-filter-tools">
        <input class="archive-filter-input" id="archiveFilter" type="search" placeholder="Archiv filtern: Objekt, Auftraggeber, Dokument, RG-Nr/Projekt, Datum" aria-label="Archiv filtern" />
        <span class="archive-filter-count" id="archiveFilterCount"></span>
      </div>
      <div class="archive-list" id="archiveList" aria-live="polite"></div>
    </div>
  </div>

  <script>
    "use strict";

    const MODULE_ID = "auftrag-bescheinigungen";
    const STORAGE_KEY = "auftrag-bescheinigungen-current-v1";
    const ARCHIVE_STORAGE_KEY = "auftrag-bescheinigungen-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "auftrag-bescheinigungen-current-archive-id-v1";
    const FIELD_IDS = [
      "auftraggeber",
      "objekt",
      "gewerk",
      "ansprechpartnerIntern",
      "standort",
      "ansprechpartnerExternName",
      "ansprechpartnerExternEmail",
      "lieferant",
      "rgProjektIntern",
      "dokument",
      "datumErrichtung",
      "zulassung",
      "bemerkungen",
      "datum",
      "name"
    ];
    const fields = Object.fromEntries(FIELD_IDS.map(function(id) { return [id, document.getElementById(id)]; }));
    const archiveOverlay = document.getElementById("archiveOverlay");
    const archiveList = document.getElementById("archiveList");
    const archiveFilter = document.getElementById("archiveFilter");
    const archiveFilterCount = document.getElementById("archiveFilterCount");
    let saveTimer = 0;

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function notifyHost(message) {
      try {
        window.parent.postMessage({ type: "fsmobile-toast", moduleId: MODULE_ID, message: message || "" }, "*");
      } catch (error) {}
    }

    function setStatus(message) {
      const status = document.getElementById("archiveStatus");
      if (status) status.textContent = "";
      notifyHost(message);
    }

    function autoGrow(element) {
      if (!element || element.tagName !== "TEXTAREA") return;
      element.style.height = "auto";
      const minHeight = Number.parseFloat(getComputedStyle(element).minHeight || "44") || 44;
      element.style.height = Math.max(minHeight, element.scrollHeight) + "px";
    }

    function autoGrowAll() {
      Object.values(fields).forEach(autoGrow);
    }

    function todayIso() {
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 10);
    }

    function displayDate(value) {
      const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
      return match ? match[3] + "." + match[2] + "." + match[1] : String(value || "");
    }

    function firstLine(value) {
      return String(value || "").split(/\r?\n/).map(function(line) { return line.trim(); }).find(Boolean) || "";
    }

    function collectData() {
      const dataFields = {};
      FIELD_IDS.forEach(function(id) { dataFields[id] = fields[id].value || ""; });
      return { fields: dataFields };
    }

    function applyData(payload, options) {
      const source = payload && typeof payload === "object" ? payload : {};
      const dataFields = source.fields && typeof source.fields === "object" ? source.fields : source;
      FIELD_IDS.forEach(function(id) {
        fields[id].value = dataFields[id] === undefined || dataFields[id] === null ? "" : String(dataFields[id]);
      });
      autoGrowAll();
      if (!options || options.persist !== false) saveFormNow();
    }

    function saveFormNow() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData()));
        return true;
      } catch (error) {
        return false;
      }
    }

    function scheduleSave() {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(saveFormNow, 120);
    }

    function restoreDraft() {
      let payload = null;
      try { payload = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) {}
      if (payload && typeof payload === "object") {
        applyData(payload, { persist: false });
      } else if (!fields.datum.value) {
        fields.datum.value = todayIso();
      }
      autoGrowAll();
      saveFormNow();
    }

    function getArchive() {
      try {
        const parsed = JSON.parse(localStorage.getItem(ARCHIVE_STORAGE_KEY) || "[]");
        return Array.isArray(parsed) ? parsed.filter(function(entry) { return entry && typeof entry === "object"; }) : [];
      } catch (error) {
        return [];
      }
    }

    function setArchive(entries) {
      try {
        localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(Array.isArray(entries) ? entries : []));
        return true;
      } catch (error) {
        return false;
      }
    }

    function currentArchiveId() {
      try { return localStorage.getItem(CURRENT_ARCHIVE_ID_KEY) || ""; } catch (error) { return ""; }
    }

    function createArchiveId() {
      return window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "archive-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    }

    function archiveEntryData(entry) {
      if (!entry || typeof entry !== "object") return {};
      return entry.data || entry.report || entry;
    }

    function archiveEntryFields(entry) {
      const data = archiveEntryData(entry);
      return data && data.fields && typeof data.fields === "object" ? data.fields : data;
    }

    function archiveTitle(entry) {
      const entryFields = archiveEntryFields(entry);
      const parts = [
        firstLine(entryFields.objekt) || "Ohne Objekt",
        entryFields.dokument || "Ohne Dokument",
        displayDate(entryFields.datum || entryFields.datumErrichtung || "")
      ].filter(Boolean);
      return parts.join(" · ");
    }

    function archiveMeta(entry) {
      const entryFields = archiveEntryFields(entry);
      const updated = entry.updatedAt || entry.savedAt || entry.createdAt || "";
      const parts = [];
      if (entryFields.auftraggeber) parts.push("Auftraggeber: " + firstLine(entryFields.auftraggeber));
      if (entryFields.rgProjektIntern) parts.push("RG/Projekt: " + entryFields.rgProjektIntern);
      if (updated) parts.push("Geändert: " + new Date(updated).toLocaleString("de-DE"));
      return parts.join(" · ");
    }

    function createArchiveEntry(data, previous) {
      const dataFields = data.fields || {};
      const meta = {
        type: "Auftrag Bescheinigungen",
        object: dataFields.objekt || "",
        anlage: dataFields.rgProjektIntern || dataFields.dokument || "",
        date: dataFields.datum || dataFields.datumErrichtung || ""
      };
      let entry = null;
      if (window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.createArchiveEntry === "function") {
        entry = window.FSMOBILE_STANDARD.createArchiveEntry({
          moduleId: MODULE_ID,
          title: archiveTitle({ data: data }),
          meta: meta,
          data: data,
          previous: previous || null
        });
      }
      if (!entry) {
        const now = new Date().toISOString();
        entry = {
          id: previous && previous.id ? previous.id : createArchiveId(),
          moduleId: MODULE_ID,
          title: archiveTitle({ data: data }),
          createdAt: previous && previous.createdAt ? previous.createdAt : now,
          updatedAt: now,
          meta: meta,
          data: data
        };
      }
      entry.meta = Object.assign({}, entry.meta || {}, {
        auftraggeber: dataFields.auftraggeber || "",
        dokument: dataFields.dokument || "",
        rgProjektIntern: dataFields.rgProjektIntern || ""
      });
      return entry;
    }

    function saveCurrentFormToArchive() {
      if (!saveFormNow()) {
        setStatus("Formular konnte nicht im Archiv gespeichert werden.");
        return null;
      }
      const entries = getArchive();
      const pointer = currentArchiveId();
      const existingIndex = pointer ? entries.findIndex(function(entry) { return entry.id === pointer; }) : -1;
      const previous = existingIndex >= 0 ? entries[existingIndex] : null;
      const entry = createArchiveEntry(collectData(), previous);
      if (existingIndex >= 0) entries[existingIndex] = entry;
      else entries.unshift(entry);
      if (!setArchive(entries)) {
        setStatus("Formular konnte nicht im Archiv gespeichert werden.");
        return null;
      }
      localStorage.setItem(CURRENT_ARCHIVE_ID_KEY, entry.id);
      renderArchiveList();
      setStatus(existingIndex >= 0 ? "Formular aktualisiert." : "Formular im Archiv gespeichert.");
      return entry;
    }

    function openArchiveEntry(id) {
      const entry = getArchive().find(function(item) { return item.id === id; });
      if (!entry) {
        setStatus("Archiv-Eintrag konnte nicht geöffnet werden.");
        return;
      }
      localStorage.setItem(CURRENT_ARCHIVE_ID_KEY, id);
      applyData(archiveEntryData(entry));
      closeArchive();
      setStatus("Archiv-Eintrag wurde geöffnet.");
    }

    function deleteArchiveEntry(id) {
      const entry = getArchive().find(function(item) { return item.id === id; });
      if (!entry) return;
      if (!window.confirm("Archiv-Eintrag wirklich löschen?")) return;
      const remaining = getArchive().filter(function(item) { return item.id !== id; });
      if (!setArchive(remaining)) {
        setStatus("Archiv-Eintrag konnte nicht gelöscht werden.");
        return;
      }
      if (currentArchiveId() === id) localStorage.removeItem(CURRENT_ARCHIVE_ID_KEY);
      renderArchiveList();
      setStatus("Archiv-Eintrag wurde gelöscht.");
    }

    function renderArchiveList() {
      const entries = getArchive()
        .slice()
        .sort(function(a, b) { return String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")); });
      archiveFilterCount.textContent = entries.length + (entries.length === 1 ? " Eintrag" : " Einträge");
      if (!entries.length) {
        archiveList.innerHTML = '<p class="archive-empty">Noch keine Archiv-Einträge vorhanden.</p>';
        return;
      }
      const pointer = currentArchiveId();
      archiveList.innerHTML = entries.map(function(entry) {
        const currentClass = pointer && entry.id === pointer ? " archive-item-current" : "";
        return '<article class="archive-item' + currentClass + '" data-archive-id="' + escapeHtml(entry.id) + '">' +
          "<div><div class=\"archive-title\">" + escapeHtml(archiveTitle(entry)) + "</div><div class=\"archive-meta\">" + escapeHtml(archiveMeta(entry)) + "</div></div>" +
          '<button type="button" class="archive-open-btn" data-archive-open="' + escapeHtml(entry.id) + '">Öffnen</button>' +
          '<button type="button" class="archive-delete-btn" data-archive-delete="' + escapeHtml(entry.id) + '">Löschen</button>' +
          "</article>";
      }).join("");
      applyArchiveFilter();
    }

    function applyArchiveFilter() {
      const query = String(archiveFilter.value || "").trim().toLocaleLowerCase("de-DE");
      const items = Array.from(archiveList.querySelectorAll(".archive-item"));
      let visible = 0;
      items.forEach(function(item) {
        const matches = !query || String(item.textContent || "").toLocaleLowerCase("de-DE").includes(query);
        item.hidden = !matches;
        item.classList.toggle("archive-item-filtered-out", !matches);
        if (matches) visible += 1;
      });
      let empty = archiveList.querySelector(".archive-filter-empty");
      if (!empty) {
        empty = document.createElement("p");
        empty.className = "archive-empty archive-filter-empty";
        empty.textContent = "Keine Archiv-Einträge zum Filter gefunden.";
        archiveList.appendChild(empty);
      }
      empty.hidden = !(query && items.length && visible === 0);
      archiveFilterCount.textContent = items.length
        ? (query ? visible + " von " + items.length + " Einträgen" : items.length + (items.length === 1 ? " Eintrag" : " Einträge"))
        : "";
    }

    function openArchive() {
      renderArchiveList();
      archiveOverlay.hidden = false;
      window.setTimeout(function() { archiveFilter.focus(); }, 0);
      setStatus("Archiv wurde geöffnet.");
    }

    function closeArchive() {
      archiveOverlay.hidden = true;
    }

    function clearForm() {
      if (!window.confirm("Formular wirklich leeren?")) return;
      document.getElementById("auftragForm").reset();
      localStorage.removeItem(CURRENT_ARCHIVE_ID_KEY);
      Object.values(fields).forEach(function(field) {
        if (field.tagName === "TEXTAREA") field.style.height = "";
      });
      saveFormNow();
      setStatus("Formular geleert.");
    }

    function pdfValue(value) {
      const text = String(value || "").trim();
      return text || "-";
    }

    function exportPdf() {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        setStatus("PDF-Export konnte nicht erstellt werden.");
        return;
      }

      const doc = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const dataFields = collectData().fields;
      const margin = 14;
      const contentWidth = 182;
      const pageBottom = 278;
      const lineHeight = 4.2;
      const PDF_ORANGE_RGB = [255, 180, 71];
      const PDF_ORANGE = PDF_ORANGE_RGB.map(function(channel) { return (channel / 255).toFixed(6); });
      const PDF_BLACK = [0, 0, 0];
      let y = 0;

      function drawPageHeader() {
        doc.setFillColor(PDF_ORANGE[0], PDF_ORANGE[1], PDF_ORANGE[2]);
        doc.rect(10, 24, 190, 10, "F");
        doc.setTextColor(PDF_BLACK[0], PDF_BLACK[1], PDF_BLACK[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Auftrag Bescheinigungen", 14, 30.7);
        return 42;
      }

      function nextPage() {
        doc.addPage();
        y = drawPageHeader();
      }

      function ensureSpace(height) {
        if (y + height > pageBottom) nextPage();
      }

      function fieldLines(value, width) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(pdfValue(value), Math.max(12, width - 8));
        return Array.isArray(lines) && lines.length ? lines : ["-"];
      }

      function drawPdfLine(value, x, lineY) {
        const text = String(value || "");
        if (/^Name(?=\s*(?::|\(|$))/i.test(text)) {
          doc.text("Na", x, lineY);
          doc.text(text.slice(2), x + doc.getTextWidth("Na"), lineY);
          return;
        }
        doc.text(text, x, lineY);
      }

      function drawPdfLines(lines, x, lineY) {
        const values = lines.length ? lines : [""];
        values.forEach(function(value, index) {
          drawPdfLine(value, x, lineY + index * lineHeight);
        });
      }

      function drawFields(specs, minimumHeight) {
        const gap = specs.length > 1 ? 4 : 0;
        const width = (contentWidth - gap * (specs.length - 1)) / specs.length;
        const states = specs.map(function(spec) {
          return { label: spec.label, lines: fieldLines(spec.value, width), offset: 0 };
        });
        let firstChunk = true;

        while (firstChunk || states.some(function(state) { return state.offset < state.lines.length; })) {
          firstChunk = false;
          ensureSpace(minimumHeight);
          const availableLines = Math.max(1, Math.floor((pageBottom - y - 10) / lineHeight));
          const remaining = Math.max.apply(null, states.map(function(state) { return state.lines.length - state.offset; }));
          const take = Math.max(1, Math.min(remaining, availableLines));
          const chunks = states.map(function(state) {
            const chunk = state.lines.slice(state.offset, state.offset + take);
            state.offset += chunk.length;
            return chunk;
          });
          const contentLines = Math.max(1, Math.max.apply(null, chunks.map(function(chunk) { return chunk.length; })));
          const height = Math.max(minimumHeight, 10 + contentLines * lineHeight);
          if (y + height > pageBottom) {
            nextPage();
            states.forEach(function(state, index) { state.offset -= chunks[index].length; });
            continue;
          }

          states.forEach(function(state, index) {
            const x = margin + index * (width + gap);
            const continued = state.offset > chunks[index].length;
            doc.setTextColor(PDF_BLACK[0], PDF_BLACK[1], PDF_BLACK[2]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            const label = state.label + (continued ? " (Fortsetzung)" : "");
            drawPdfLine(label, x + 4, y + 5.2);
            doc.setTextColor(PDF_BLACK[0], PDF_BLACK[1], PDF_BLACK[2]);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            drawPdfLines(chunks[index], x + 4, y + 10.2);
          });

          y += height + 4;
          if (states.some(function(state) { return state.offset < state.lines.length; })) nextPage();
        }
      }

      y = drawPageHeader();
      drawFields([
        { label: "Auftraggeber", value: dataFields.auftraggeber },
        { label: "Objekt", value: dataFields.objekt }
      ], 30);
      drawFields([
        { label: "Gewerk", value: dataFields.gewerk },
        { label: "Projekt Ansprechpartner intern", value: dataFields.ansprechpartnerIntern }
      ], 16);

      drawFields([
        { label: "Standort", value: dataFields.standort },
        {
          label: "Projekt Ansprechpartner extern",
          value: "Name: " + pdfValue(dataFields.ansprechpartnerExternName) + "\nEmailadresse: " + pdfValue(dataFields.ansprechpartnerExternEmail)
        }
      ], 26);

      drawFields([
        { label: "Lieferant", value: dataFields.lieferant },
        { label: "RG-Nr/Projekt intern", value: dataFields.rgProjektIntern }
      ], 16);
      drawFields([
        { label: "Dokument", value: dataFields.dokument },
        { label: "Datum Errichtung", value: displayDate(dataFields.datumErrichtung) }
      ], 16);
      drawFields([{ label: "Zulassung", value: dataFields.zulassung }], 16);

      drawFields([{ label: "Bemerkungen", value: dataFields.bemerkungen }], 28);

      drawFields([
        { label: "Datum", value: displayDate(dataFields.datum) },
        { label: "Name", value: dataFields.name }
      ], 16);

      const pageCount = doc.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setDrawColor(209, 209, 214);
        doc.line(margin, 284, 196, 284);
        doc.setTextColor(PDF_BLACK[0], PDF_BLACK[1], PDF_BLACK[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text("FSMobile · Auftrag Bescheinigungen", margin, 289);
        doc.text("Seite " + page + " von " + pageCount, 196, 289, { align: "right" });
      }

      if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(doc);
      const objectName = firstLine(dataFields.objekt) || "Ohne Objekt";
      const fileName = window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.pdfFileName === "function"
        ? window.FSMOBILE_STANDARD.pdfFileName([objectName, dataFields.datum || todayIso()], "Auftrag_Bescheinigungen")
        : (objectName + "_" + (dataFields.datum || todayIso()) + ".pdf").replace(/[\\/:*?"<>|\s]+/g, "_");
      doc.save(fileName);
      setStatus("PDF-Export wurde erstellt.");
    }

    document.getElementById("auftragForm").addEventListener("input", function(event) {
      autoGrow(event.target);
      scheduleSave();
    });
    document.getElementById("auftragForm").addEventListener("change", scheduleSave);
    document.getElementById("archiveSaveBtn").addEventListener("click", saveCurrentFormToArchive);
    document.getElementById("archiveBtn").addEventListener("click", openArchive);
    document.getElementById("clearBtn").addEventListener("click", clearForm);
    document.getElementById("pdfBtn").addEventListener("click", exportPdf);
    document.getElementById("archiveCloseButton").addEventListener("click", closeArchive);
    archiveFilter.addEventListener("input", applyArchiveFilter);
    archiveList.addEventListener("click", function(event) {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.archiveOpen) openArchiveEntry(button.dataset.archiveOpen);
      if (button.dataset.archiveDelete) deleteArchiveEntry(button.dataset.archiveDelete);
    });
    archiveOverlay.addEventListener("click", function(event) {
      if (event.target === archiveOverlay) closeArchive();
    });
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && !archiveOverlay.hidden) closeArchive();
    });
    window.addEventListener("beforeunload", saveFormNow);

    restoreDraft();
  </script>
</body>
</html>`
  };
}());
