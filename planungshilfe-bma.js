(function () {
  "use strict";

  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES["planungshilfe-bma"] = {
    title: "Planungshilfe BMA",
    group: "Kalkulation",
    description: "Herstellerneutrale Planungshilfe für Brandmelde- und Brandwarnanlagen mit Archiv und PDF-Export.",
    html: String.raw`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#ff9500" />
  <meta name="application-name" content="Planungshilfe BMA" />
  <title>Planungshilfe BMA</title>
  <script defer src="vendor/jspdf.umd.min.js"></script>
  <style>
    :root {
      --primary: #007aff;
      --accent: #ff9500;
      --danger: #ff3b30;
      --neutral: #8e8e93;
      --text: #1c1c1e;
      --muted: #6e6e73;
      --field: rgba(255,255,255,.08);
      --line: rgba(255,255,255,.44);
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
      font-size: clamp(30px, 3vw, 36px);
      line-height: 1.1;
      font-weight: 850;
      letter-spacing: 0;
    }
    h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.2;
      font-weight: 820;
      letter-spacing: 0;
    }
    .title-actions {
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
    }
    button:active { transform: scale(.98); }
    button:focus-visible { outline: 3px solid rgba(0,122,255,.24); outline-offset: 2px; }
    button:disabled { opacity: .55; cursor: default; transform: none; }
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
      flex: 0 0 auto;
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
    .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .form-grid + .form-grid, .field-group + .choice-fieldset, .choice-fieldset + .form-grid { margin-top: 12px; }
    .field-group {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 6px;
    }
    .field-group label, .field-label {
      min-height: 15px;
      padding-left: 2px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.25;
      font-weight: 760;
    }
    .required-mark { color: #c9342f; }
    input[type="text"], input[type="date"], input[type="number"], input[type="tel"], select, textarea {
      width: 100%;
      min-height: 46px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.4);
      border-radius: var(--radius-sm);
      color: var(--text);
      background: var(--field);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
      font-size: 15px;
      line-height: 1.35;
    }
    select { height: 46px; appearance: auto; }
    textarea { display: block; min-height: 92px; resize: none; overflow: hidden; }
    .large-textarea { min-height: 146px; }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: rgba(0,122,255,.5);
      box-shadow: 0 0 0 4px rgba(0,122,255,.12), inset 0 1px 0 rgba(255,255,255,.22);
    }
    input:disabled, select:disabled, textarea:disabled { opacity: .58; }

    .signature-field {
      margin-top: 12px;
    }
    .signature-capture {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(60,60,67,.24);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.62);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.5);
    }
    .signature-capture:focus-within {
      border-color: rgba(0,122,255,.5);
      box-shadow: 0 0 0 4px rgba(0,122,255,.12), inset 0 1px 0 rgba(255,255,255,.5);
    }
    .signature-pad {
      position: relative;
      z-index: 1;
      display: block;
      width: 100%;
      height: 180px;
      cursor: crosshair;
      touch-action: none;
      overscroll-behavior: contain;
      -webkit-user-select: none;
      user-select: none;
    }
    .signature-pad:focus { outline: none; }
    .signature-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      font-size: 14px;
      font-weight: 720;
      pointer-events: none;
    }
    .signature-capture.has-signature .signature-placeholder { display: none; }
    .signature-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 9px;
    }
    .signature-toolbar .helper-text { margin: 0; }
    .signature-reset-button {
      min-height: 44px;
      flex: 0 0 auto;
      padding: 10px 16px;
      background: linear-gradient(180deg, #a4a4aa 0%, var(--neutral) 100%);
      box-shadow: 0 7px 14px rgba(99,99,102,.14), inset 0 1px 0 rgba(255,255,255,.28);
    }

    .choice-fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }
    .choice-fieldset legend {
      width: 100%;
      margin: 0 0 8px;
      padding: 0 0 0 2px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.25;
      font-weight: 760;
    }
    .choice-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
    }
    .choice-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .choice-grid.four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .choice {
      display: flex;
      min-width: 0;
      min-height: 48px;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: 12px;
      background: rgba(255,255,255,.06);
      cursor: pointer;
      font-size: 14px;
      line-height: 1.25;
      font-weight: 720;
      overflow-wrap: anywhere;
    }
    .choice:has(input:checked) {
      border-color: rgba(0,122,255,.42);
      background: rgba(0,122,255,.09);
      box-shadow: inset 0 0 0 1px rgba(0,122,255,.1);
    }
    .choice input {
      width: 22px;
      height: 22px;
      flex: 0 0 auto;
      margin: 0;
      accent-color: var(--primary);
    }
    .helper-text {
      margin: 9px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.35;
      font-weight: 650;
    }
    .dependent-panel {
      margin-top: 12px;
      padding: 12px;
      border: 1px solid rgba(255,255,255,.34);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.045);
    }
    .dependent-panel[hidden] { display: none; }
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

    @media (max-width: 920px) {
      .choice-grid.four { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .form-grid.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 680px) {
      .container { padding: 12px; }
      .title-bar, .archive-header { align-items: stretch; flex-direction: column; }
      .title-actions, .title-actions button, .archive-header button { width: 100%; }
      .form-grid, .form-grid.three, .choice-grid, .choice-grid.three, .choice-grid.four { grid-template-columns: 1fr; }
      .archive-item { grid-template-columns: 1fr; }
      .archive-item button { width: 100%; }
      .archive-filter-tools { align-items: stretch; flex-direction: column; }
      .signature-toolbar { align-items: stretch; flex-direction: column; }
      .signature-reset-button { width: 100%; }
    }
  </style>
</head>
<body>
  <main class="container">
    <header class="title-bar">
      <h1>Planungshilfe BMA</h1>
      <div class="title-actions" aria-label="Formularaktionen">
        <button type="button" class="archive-save" id="archiveSaveBtn">Im Archiv speichern</button>
        <button type="button" class="archive-open" id="archiveBtn">Archiv</button>
        <button type="button" class="clear-btn" id="clearBtn">Leeren</button>
        <button type="button" class="pdf-btn" id="pdfBtn">PDF</button>
      </div>
    </header>

    <form id="bmaForm" autocomplete="off">
      <section class="form-section" aria-labelledby="projectHeading">
        <div class="section-heading"><h2 id="projectHeading">Projekt- und Objektdaten</h2></div>
        <div class="form-grid">
          <div class="field-group">
            <label for="projekt">Projekt <span class="required-mark" aria-hidden="true">*</span></label>
            <input id="projekt" name="projekt" type="text" required />
          </div>
          <div class="field-group">
            <label for="datum">Datum <span class="required-mark" aria-hidden="true">*</span></label>
            <input id="datum" name="datum" type="date" required />
          </div>
        </div>
        <div class="field-group" style="margin-top:12px">
          <label for="objektadresse">Objektadresse</label>
          <textarea id="objektadresse" name="objektadresse" rows="3"></textarea>
        </div>
      </section>

      <section class="form-section" aria-labelledby="generalHeading">
        <div class="section-heading"><h2 id="generalHeading">Allgemeines</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Anlagenart <span class="required-mark" aria-hidden="true">*</span></legend>
          <div class="choice-grid">
            <label class="choice"><input type="radio" name="anlagenart" value="Brandmeldeanlage" required />Brandmeldeanlage</label>
            <label class="choice"><input type="radio" name="anlagenart" value="Brandwarnanlage nach VDE 0826" required />Brandwarnanlage nach VDE 0826</label>
          </div>
        </fieldset>
        <div class="form-grid" style="margin-top:12px">
          <fieldset class="choice-fieldset">
            <legend>Planunterlagen vorhanden</legend>
            <div class="choice-grid">
              <label class="choice"><input type="radio" name="plaeneVorhanden" value="Nein" />Nein</label>
              <label class="choice"><input type="radio" name="plaeneVorhanden" value="Ja" />Ja</label>
            </div>
          </fieldset>
          <fieldset class="choice-fieldset">
            <legend>Nutzungsmodell</legend>
            <div class="choice-grid">
              <label class="choice"><input type="radio" name="nutzungsmodell" value="Miete" />Miete</label>
              <label class="choice"><input type="radio" name="nutzungsmodell" value="Kauf" />Kauf</label>
            </div>
          </fieldset>
        </div>
        <div class="form-grid three">
          <div class="field-group">
            <label for="nutzungAb">Nutzung ab</label>
            <input id="nutzungAb" name="nutzungAb" type="date" />
          </div>
          <div class="field-group">
            <label for="nutzungsdauerMonate">Nutzungsdauer in Monaten</label>
            <input id="nutzungsdauerMonate" name="nutzungsdauerMonate" type="number" inputmode="numeric" min="0" step="1" />
          </div>
          <div class="field-group">
            <label for="nutzungsart">Nutzungsart</label>
            <input id="nutzungsart" name="nutzungsart" type="text" />
          </div>
        </div>
      </section>

      <section class="form-section" aria-labelledby="documentsHeading">
        <div class="section-heading"><h2 id="documentsHeading">Dokumente und Gutachten</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Vorhandene Grundlagen</legend>
          <div class="choice-grid three">
            <label class="choice"><input type="checkbox" name="stellungnahmen" value="Nichts vorhanden" data-exclusive-none />Nichts vorhanden</label>
            <label class="choice"><input type="checkbox" name="stellungnahmen" value="Gutachten oder Brandschutzkonzept" />Gutachten oder Brandschutzkonzept</label>
            <label class="choice"><input type="checkbox" name="stellungnahmen" value="Baurechtsamt" />Baurechtsamt</label>
            <label class="choice"><input type="checkbox" name="stellungnahmen" value="Feuerwehr oder Brandschutzbehörde" />Feuerwehr oder Brandschutzbehörde</label>
            <label class="choice"><input type="checkbox" name="stellungnahmen" value="Sachversicherer" />Sachversicherer</label>
          </div>
        </fieldset>
        <div class="field-group" style="margin-top:12px">
          <label for="dokumenteErgaenzung">Ergänzende Angaben zu Unterlagen</label>
          <textarea id="dokumenteErgaenzung" name="dokumenteErgaenzung" rows="3"></textarea>
        </div>
      </section>

      <section class="form-section" aria-labelledby="protectionHeading">
        <div class="section-heading"><h2 id="protectionHeading">Schutzziele</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Schutzziele</legend>
          <div class="choice-grid four">
            <label class="choice"><input type="checkbox" name="schutzziele" value="Personenschutz" />Personenschutz</label>
            <label class="choice"><input type="checkbox" name="schutzziele" value="Sachwerteschutz" />Sachwerteschutz</label>
            <label class="choice"><input type="checkbox" name="schutzziele" value="Umweltschutz" />Umweltschutz</label>
            <label class="choice"><input type="checkbox" name="schutzziele" value="Heißarbeiten" />Heißarbeiten</label>
          </div>
        </fieldset>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Überwachungskategorie</legend>
          <div class="choice-grid four">
            <label class="choice"><input type="radio" name="ueberwachungskategorie" value="Kategorie 1 - Vollschutz" />Kategorie 1 - Vollschutz</label>
            <label class="choice"><input type="radio" name="ueberwachungskategorie" value="Kategorie 2 - Teilschutz" />Kategorie 2 - Teilschutz</label>
            <label class="choice"><input type="radio" name="ueberwachungskategorie" value="Kategorie 3 - Schutz von Flucht- und Rettungswegen" />Kategorie 3 - Flucht- und Rettungswege</label>
            <label class="choice"><input type="radio" name="ueberwachungskategorie" value="Kategorie 4 - Einrichtungsschutz" />Kategorie 4 - Einrichtungsschutz</label>
          </div>
        </fieldset>
      </section>

      <section class="form-section" aria-labelledby="areaHeading">
        <div class="section-heading"><h2 id="areaHeading">Sicherungsbereich und Gebäude</h2></div>
        <div class="field-group">
          <label for="sicherungsbereich">Was muss überwacht werden?</label>
          <textarea class="large-textarea" id="sicherungsbereich" name="sicherungsbereich" rows="6"></textarea>
        </div>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Denkmalschutz</legend>
          <div class="choice-grid">
            <label class="choice"><input type="radio" name="denkmalschutz" value="Nein" />Nein</label>
            <label class="choice"><input type="radio" name="denkmalschutz" value="Ja" />Ja</label>
          </div>
        </fieldset>
      </section>

      <section class="form-section" aria-labelledby="detectorHeading">
        <div class="section-heading"><h2 id="detectorHeading">Brandmelder</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Raumhöhe</legend>
          <div class="choice-grid three">
            <label class="choice"><input type="radio" name="raumhoehe" value="Unter 6 m" />Unter 6 m</label>
            <label class="choice"><input type="radio" name="raumhoehe" value="Über 6 m bis 12 m" />Über 6 m bis 12 m</label>
            <label class="choice"><input type="radio" name="raumhoehe" value="Andere Raumhöhe" />Andere Raumhöhe</label>
          </div>
        </fieldset>
        <div class="form-grid">
          <div class="field-group">
            <label for="raumhoeheAngabe">Genaue Raumhöhe in m</label>
            <input id="raumhoeheAngabe" name="raumhoeheAngabe" type="number" inputmode="decimal" min="0" step="0.1" />
          </div>
          <div class="field-group">
            <label for="zwischendeckeDetails">Zwischendecke/-boden: Bereich oder Details</label>
            <input id="zwischendeckeDetails" name="zwischendeckeDetails" type="text" />
          </div>
        </div>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Zwischendecke oder Zwischenboden über 0,2 m</legend>
          <div class="choice-grid">
            <label class="choice"><input type="radio" name="zwischendecke" value="Nein" />Nein</label>
            <label class="choice"><input type="radio" name="zwischendecke" value="Ja" />Ja</label>
          </div>
        </fieldset>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Mögliche Störgrößen</legend>
          <div class="choice-grid three">
            <label class="choice"><input type="checkbox" name="stoergroessen" value="Staub" />Staub</label>
            <label class="choice"><input type="checkbox" name="stoergroessen" value="Feuchtigkeit" />Feuchtigkeit</label>
            <label class="choice"><input type="checkbox" name="stoergroessen" value="Sonstige" />Sonstige</label>
          </div>
        </fieldset>
        <div class="field-group" style="margin-top:12px">
          <label for="stoergroessenDetails">Art und Ort der Störgrößen</label>
          <textarea id="stoergroessenDetails" name="stoergroessenDetails" rows="3"></textarea>
        </div>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Handfeuermelder</legend>
          <div class="choice-grid three">
            <label class="choice"><input type="radio" name="handfeuermelder" value="Nicht notwendig" />Nicht notwendig</label>
            <label class="choice"><input type="radio" name="handfeuermelder" value="Erforderlich" />Erforderlich</label>
            <label class="choice"><input type="radio" name="handfeuermelder" value="Position nach Planung festlegen" />Position nach Planung festlegen</label>
          </div>
        </fieldset>
      </section>

      <section class="form-section" aria-labelledby="alarmHeading">
        <div class="section-heading"><h2 id="alarmHeading">Alarmierung und Alarmweiterleitung</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Interner Alarmierungsbereich</legend>
          <div class="choice-grid four">
            <label class="choice"><input type="radio" name="interneAlarmierung" value="Nicht erforderlich" />Nicht erforderlich</label>
            <label class="choice"><input type="radio" name="interneAlarmierung" value="Im Sicherungsbereich" />Im Sicherungsbereich</label>
            <label class="choice"><input type="radio" name="interneAlarmierung" value="Im gesamten Gebäude" />Im gesamten Gebäude</label>
            <label class="choice"><input type="radio" name="interneAlarmierung" value="Durch vorhandene Brandmeldeanlage" />Durch vorhandene Brandmeldeanlage</label>
          </div>
        </fieldset>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Alarmweiterleitung</legend>
          <div class="choice-grid three">
            <label class="choice"><input type="checkbox" name="alarmweiterleitung" value="Nicht erforderlich" data-exclusive-none />Nicht erforderlich</label>
            <label class="choice"><input type="checkbox" name="alarmweiterleitung" value="Leitstelle oder Notruf- und Serviceleitstelle" />Leitstelle oder Notruf- und Serviceleitstelle</label>
            <label class="choice"><input type="checkbox" name="alarmweiterleitung" value="Sprachansage an ständig besetzte Stelle" />Sprachansage an ständig besetzte Stelle</label>
          </div>
        </fieldset>
        <div class="form-grid three">
          <div class="field-group">
            <label for="leitstelleTelefon">Telefonnummer Leitstelle</label>
            <input id="leitstelleTelefon" name="leitstelleTelefon" type="tel" inputmode="tel" />
          </div>
          <div class="field-group">
            <label for="bmzStandort">Standort Brandmelderzentrale</label>
            <input id="bmzStandort" name="bmzStandort" type="text" />
          </div>
          <fieldset class="choice-fieldset">
            <legend>Störschall vorhanden</legend>
            <div class="choice-grid">
              <label class="choice"><input type="radio" name="stoerschall" value="Nein" />Nein</label>
              <label class="choice"><input type="radio" name="stoerschall" value="Ja" />Ja</label>
            </div>
          </fieldset>
        </div>
        <div class="field-group" style="margin-top:12px">
          <label for="alarmierungDetails">Ergänzende Angaben zur Alarmierung</label>
          <textarea id="alarmierungDetails" name="alarmierungDetails" rows="3"></textarea>
        </div>
      </section>

      <section class="form-section" aria-labelledby="serviceHeading">
        <div class="section-heading"><h2 id="serviceHeading">Montage und Instandhaltung</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Montage</legend>
          <div class="choice-grid">
            <label class="choice"><input type="checkbox" id="arbeitsbuehne" name="arbeitsbuehne" value="Ja" />Arbeitsbühne erforderlich</label>
          </div>
        </fieldset>
        <div class="dependent-panel" id="arbeitsbuehnePanel" hidden>
          <div class="form-grid">
            <div class="field-group">
              <label for="arbeitsbuehneHoehe">Arbeitshöhe in m</label>
              <input id="arbeitsbuehneHoehe" name="arbeitsbuehneHoehe" type="number" inputmode="decimal" min="0" step="0.1" />
            </div>
            <div class="field-group">
              <label for="arbeitsbuehneArt">Art der Arbeitsbühne</label>
              <select id="arbeitsbuehneArt" name="arbeitsbuehneArt">
                <option value="">Bitte auswählen</option>
                <option value="Scherenarbeitsbühne">Scherenarbeitsbühne</option>
                <option value="Teleskoparbeitsbühne">Teleskoparbeitsbühne</option>
                <option value="Teleskopgelenkbühne">Teleskopgelenkbühne</option>
                <option value="Sonstige">Sonstige</option>
              </select>
            </div>
          </div>
          <div class="field-group" style="margin-top:12px">
            <label for="arbeitsbuehneDetails">Weitere Angaben zur Arbeitsbühne</label>
            <input id="arbeitsbuehneDetails" name="arbeitsbuehneDetails" type="text" />
          </div>
        </div>
        <fieldset class="choice-fieldset" style="margin-top:12px">
          <legend>Instandhaltung</legend>
          <div class="choice-grid">
            <label class="choice"><input type="radio" name="instandhaltung" value="Jahreswartung" />Jahreswartung</label>
            <label class="choice"><input type="radio" name="instandhaltung" value="Quartalswartung" />Quartalswartung</label>
          </div>
        </fieldset>
        <p class="helper-text">Inbetriebnahme und Demontage sind nicht Bestandteil dieser Planungshilfe.</p>
      </section>

      <section class="form-section" aria-labelledby="fireHeading">
        <div class="section-heading"><h2 id="fireHeading">Feuerwehr</h2></div>
        <fieldset class="choice-fieldset">
          <legend>Erstinformationsstelle und ergänzende Einrichtungen</legend>
          <div class="choice-grid four">
            <label class="choice"><input type="checkbox" name="feuerwehrEinrichtungen" value="Nicht notwendig" data-exclusive-none />Nicht notwendig</label>
            <label class="choice"><input type="checkbox" name="feuerwehrEinrichtungen" value="Feuerwehr-Informationszentrale" />Feuerwehr-Informationszentrale</label>
            <label class="choice"><input type="checkbox" name="feuerwehrEinrichtungen" value="Depot für Feuerwehr-Laufkarten" />Depot für Feuerwehr-Laufkarten</label>
            <label class="choice"><input type="checkbox" name="feuerwehrEinrichtungen" value="Abgesetzte Blitzleuchte" />Abgesetzte Blitzleuchte</label>
          </div>
        </fieldset>
        <div class="field-group" style="margin-top:12px">
          <label for="feuerwehrDetails">Standort und ergänzende Angaben</label>
          <textarea id="feuerwehrDetails" name="feuerwehrDetails" rows="3"></textarea>
        </div>
      </section>

      <section class="form-section" aria-labelledby="supplementHeading">
        <div class="section-heading"><h2 id="supplementHeading">Ergänzungen</h2></div>
        <div class="field-group">
          <label for="ergaenzungen">Weitere Anforderungen und Hinweise</label>
          <textarea class="large-textarea" id="ergaenzungen" name="ergaenzungen" rows="7"></textarea>
        </div>
      </section>

      <section class="form-section" aria-labelledby="completionHeading">
        <div class="section-heading"><h2 id="completionHeading">Abschluss</h2></div>
        <div class="form-grid three">
          <div class="field-group">
            <label for="abschlussOrt">Ort</label>
            <input id="abschlussOrt" name="abschlussOrt" type="text" />
          </div>
          <div class="field-group">
            <label for="abschlussDatum">Datum</label>
            <input id="abschlussDatum" name="abschlussDatum" type="date" />
          </div>
          <div class="field-group">
            <label for="abschlussName">Name Kunde</label>
            <input id="abschlussName" name="abschlussName" type="text" />
          </div>
        </div>
        <div class="field-group signature-field">
          <span class="field-label" id="customerSignatureLabel">Unterschrift Kunde</span>
          <div class="signature-capture" id="customerSignatureCapture">
            <canvas class="signature-pad" id="customerSignaturePad" width="900" height="270" tabindex="0" role="img" aria-labelledby="customerSignatureLabel" aria-describedby="customerSignatureHint"></canvas>
            <span class="signature-placeholder" aria-hidden="true">Hier unterschreiben</span>
          </div>
          <div class="signature-toolbar">
            <p class="helper-text" id="customerSignatureHint">Mit Finger, Stift oder Maus unterschreiben.</p>
            <button type="button" data-fsmobile-action="delete" class="signature-reset-button" id="customerSignatureClear">Unterschrift löschen</button>
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
        <input class="archive-filter-input" id="archiveFilter" type="search" placeholder="Archiv filtern: Projekt, Objekt, Anlagenart oder Datum" aria-label="Archiv filtern" />
        <span class="archive-filter-count" id="archiveFilterCount"></span>
      </div>
      <div class="archive-list" id="archiveList" aria-live="polite"></div>
    </div>
  </div>

  <script>
    "use strict";

    const MODULE_ID = "planungshilfe-bma";
    const STORAGE_KEY = "planungshilfe-bma-current-v1";
    const ARCHIVE_STORAGE_KEY = "planungshilfe-bma-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "planungshilfe-bma-current-archive-id-v1";
    const FORM = document.getElementById("bmaForm");
    const archiveOverlay = document.getElementById("archiveOverlay");
    const archiveList = document.getElementById("archiveList");
    const archiveFilter = document.getElementById("archiveFilter");
    const archiveFilterCount = document.getElementById("archiveFilterCount");
    const SCHEMA = {
      projekt: "value",
      datum: "value",
      objektadresse: "value",
      anlagenart: "radio",
      plaeneVorhanden: "radio",
      nutzungsmodell: "radio",
      nutzungAb: "value",
      nutzungsdauerMonate: "value",
      nutzungsart: "value",
      stellungnahmen: "checkboxes",
      dokumenteErgaenzung: "value",
      schutzziele: "checkboxes",
      ueberwachungskategorie: "radio",
      sicherungsbereich: "value",
      denkmalschutz: "radio",
      raumhoehe: "radio",
      raumhoeheAngabe: "value",
      zwischendecke: "radio",
      zwischendeckeDetails: "value",
      stoergroessen: "checkboxes",
      stoergroessenDetails: "value",
      handfeuermelder: "radio",
      interneAlarmierung: "radio",
      alarmweiterleitung: "checkboxes",
      leitstelleTelefon: "value",
      bmzStandort: "value",
      stoerschall: "radio",
      alarmierungDetails: "value",
      arbeitsbuehne: "checkbox",
      arbeitsbuehneHoehe: "value",
      arbeitsbuehneArt: "value",
      arbeitsbuehneDetails: "value",
      instandhaltung: "radio",
      feuerwehrEinrichtungen: "checkboxes",
      feuerwehrDetails: "value",
      ergaenzungen: "value",
      abschlussOrt: "value",
      abschlussDatum: "value",
      abschlussName: "value",
      abschlussUnterschrift: "signature"
    };
    let saveTimer = 0;
    let restoreInProgress = false;
    const signatureCanvas = document.getElementById("customerSignaturePad");
    const signatureCapture = document.getElementById("customerSignatureCapture");
    const signatureClearButton = document.getElementById("customerSignatureClear");
    let signatureContext = null;
    let signatureDataUrl = "";
    let signatureDrawing = false;
    let signatureMoved = false;
    let signatureRenderToken = 0;

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");
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

    function autoGrow(element) {
      if (!element || element.tagName !== "TEXTAREA") return;
      element.style.height = "auto";
      const minimum = Number.parseFloat(getComputedStyle(element).minHeight || "92") || 92;
      element.style.height = Math.max(minimum, element.scrollHeight) + "px";
    }

    function autoGrowAll() {
      FORM.querySelectorAll("textarea").forEach(autoGrow);
    }

    function signaturePoint(event) {
      const rect = signatureCanvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function prepareSignatureContext() {
      if (!signatureCanvas) return null;
      signatureContext = signatureCanvas.getContext("2d", { willReadFrequently: true });
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      signatureContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      signatureContext.lineCap = "round";
      signatureContext.lineJoin = "round";
      signatureContext.lineWidth = 2.6;
      signatureContext.strokeStyle = "#1c1c1e";
      signatureContext.fillStyle = "#1c1c1e";
      return signatureContext;
    }

    function clearSignaturePixels() {
      if (!signatureContext) return;
      signatureContext.save();
      signatureContext.setTransform(1, 0, 0, 1, 0, 0);
      signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      signatureContext.restore();
    }

    function updateSignatureState() {
      signatureCapture.classList.toggle("has-signature", Boolean(signatureDataUrl));
      signatureCanvas.dataset.hasSignature = signatureDataUrl ? "true" : "false";
    }

    function renderSignature(value) {
      const normalized = /^data:image\/png;base64,/i.test(String(value || "")) ? String(value) : "";
      signatureDataUrl = normalized;
      const token = ++signatureRenderToken;
      clearSignaturePixels();
      updateSignatureState();
      if (!normalized || !signatureContext) return;
      const image = new Image();
      image.onload = function() {
        if (token !== signatureRenderToken || !signatureContext) return;
        const ratio = Math.max(1, window.devicePixelRatio || 1);
        const width = signatureCanvas.width / ratio;
        const height = signatureCanvas.height / ratio;
        clearSignaturePixels();
        signatureContext.drawImage(image, 0, 0, width, height);
      };
      image.onerror = function() {
        if (token !== signatureRenderToken) return;
        signatureDataUrl = "";
        clearSignaturePixels();
        updateSignatureState();
      };
      image.src = normalized;
    }

    function resizeSignatureCanvas() {
      if (!signatureCanvas) return;
      const rect = signatureCanvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (signatureCanvas.width === width && signatureCanvas.height === height && signatureContext) return;
      signatureCanvas.width = width;
      signatureCanvas.height = height;
      prepareSignatureContext();
      renderSignature(signatureDataUrl);
    }

    function clearCustomerSignature(options) {
      signatureDataUrl = "";
      signatureRenderToken += 1;
      clearSignaturePixels();
      updateSignatureState();
      if (!options || options.persist !== false) scheduleSave();
    }

    function finishSignature(event) {
      if (!signatureDrawing) return;
      if (event && event.cancelable) event.preventDefault();
      if (!signatureMoved && signatureContext && event) {
        const point = signaturePoint(event);
        signatureContext.beginPath();
        signatureContext.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        signatureContext.fill();
      }
      signatureDrawing = false;
      signatureMoved = false;
      try {
        if (event && signatureCanvas.hasPointerCapture(event.pointerId)) signatureCanvas.releasePointerCapture(event.pointerId);
      } catch (error) {}
      signatureDataUrl = signatureCanvas.toDataURL("image/png");
      updateSignatureState();
      scheduleSave();
    }

    function initializeSignaturePad() {
      resizeSignatureCanvas();
      signatureCanvas.addEventListener("pointerdown", function(event) {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (event.cancelable) event.preventDefault();
        resizeSignatureCanvas();
        const point = signaturePoint(event);
        signatureDrawing = true;
        signatureMoved = false;
        signatureContext.beginPath();
        signatureContext.moveTo(point.x, point.y);
        try { signatureCanvas.setPointerCapture(event.pointerId); } catch (error) {}
      });
      signatureCanvas.addEventListener("pointermove", function(event) {
        if (!signatureDrawing) return;
        if (event.cancelable) event.preventDefault();
        const point = signaturePoint(event);
        signatureContext.lineTo(point.x, point.y);
        signatureContext.stroke();
        signatureMoved = true;
      });
      signatureCanvas.addEventListener("pointerup", finishSignature);
      signatureCanvas.addEventListener("pointercancel", finishSignature);
      signatureCanvas.addEventListener("contextmenu", function(event) { event.preventDefault(); });
      signatureClearButton.addEventListener("click", function() { clearCustomerSignature(); });
      let resizeTimer = 0;
      window.addEventListener("resize", function() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resizeSignatureCanvas, 100);
      });
    }

    function fieldValue(name, kind) {
      if (kind === "signature") return signatureDataUrl;
      if (kind === "checkboxes") {
        return Array.from(FORM.querySelectorAll('[name="' + name + '"]:checked')).map(function(field) { return field.value; });
      }
      if (kind === "checkbox") {
        const checkbox = FORM.querySelector('[name="' + name + '"]');
        return Boolean(checkbox && checkbox.checked);
      }
      if (kind === "radio") {
        const selected = FORM.querySelector('[name="' + name + '"]:checked');
        return selected ? selected.value : "";
      }
      const field = FORM.elements.namedItem(name);
      return field && typeof field.value !== "undefined" ? String(field.value || "") : "";
    }

    function collectData() {
      const dataFields = {};
      Object.keys(SCHEMA).forEach(function(name) { dataFields[name] = fieldValue(name, SCHEMA[name]); });
      return { fields: dataFields };
    }
    window.collectData = collectData;

    function applyFieldValue(name, kind, value) {
      if (kind === "signature") {
        renderSignature(value);
        return;
      }
      if (kind === "checkboxes") {
        const selectedValues = Array.isArray(value) ? value.map(String) : (value ? [String(value)] : []);
        FORM.querySelectorAll('[name="' + name + '"]').forEach(function(field) {
          field.checked = selectedValues.includes(String(field.value));
        });
        return;
      }
      if (kind === "checkbox") {
        const checkbox = FORM.querySelector('[name="' + name + '"]');
        if (checkbox) checkbox.checked = value === true || value === "true" || value === "Ja";
        return;
      }
      if (kind === "radio") {
        FORM.querySelectorAll('[name="' + name + '"]').forEach(function(field) {
          field.checked = String(field.value) === String(value === undefined || value === null ? "" : value);
        });
        return;
      }
      const field = FORM.elements.namedItem(name);
      if (field && typeof field.value !== "undefined") field.value = value === undefined || value === null ? "" : String(value);
    }

    function updateDependentFields() {
      const checkbox = document.getElementById("arbeitsbuehne");
      const panel = document.getElementById("arbeitsbuehnePanel");
      const enabled = Boolean(checkbox && checkbox.checked);
      panel.hidden = !enabled;
      panel.querySelectorAll("input, select, textarea").forEach(function(field) { field.disabled = !enabled; });
    }

    function applyData(payload, options) {
      restoreInProgress = true;
      const source = payload && typeof payload === "object" ? payload : {};
      const dataFields = source.fields && typeof source.fields === "object" ? source.fields : source;
      Object.keys(SCHEMA).forEach(function(name) { applyFieldValue(name, SCHEMA[name], dataFields[name]); });
      if (!FORM.elements.namedItem("datum").value) FORM.elements.namedItem("datum").value = todayIso();
      if (!FORM.elements.namedItem("abschlussDatum").value) FORM.elements.namedItem("abschlussDatum").value = FORM.elements.namedItem("datum").value;
      updateDependentFields();
      autoGrowAll();
      restoreInProgress = false;
      if (!options || options.persist !== false) saveFormNow();
    }
    window.applyData = applyData;

    function saveFormNow() {
      if (restoreInProgress) return true;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData()));
        return true;
      } catch (error) {
        return false;
      }
    }

    function scheduleSave() {
      if (restoreInProgress) return;
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(saveFormNow, 120);
    }

    function restoreDraft() {
      let payload = null;
      try { payload = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) {}
      applyData(payload || {}, { persist: false });
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
      return [
        entryFields.projekt || "Ohne Projekt",
        firstLine(entryFields.objektadresse) || "Ohne Objekt",
        entryFields.anlagenart || "Ohne Anlagenart",
        displayDate(entryFields.datum || "")
      ].filter(Boolean).join(" · ");
    }

    function archiveMeta(entry) {
      const entryFields = archiveEntryFields(entry);
      const updated = entry.updatedAt || entry.savedAt || entry.createdAt || "";
      const parts = [];
      if (entryFields.ueberwachungskategorie) parts.push(entryFields.ueberwachungskategorie);
      if (entryFields.instandhaltung) parts.push(entryFields.instandhaltung);
      if (updated) parts.push("Geändert: " + new Date(updated).toLocaleString("de-DE"));
      return parts.join(" · ");
    }

    function createArchiveEntry(data, previous) {
      const dataFields = data.fields || {};
      const meta = {
        type: "Planungshilfe BMA",
        object: firstLine(dataFields.objektadresse),
        anlage: dataFields.anlagenart || "",
        date: dataFields.datum || ""
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
      entry.meta = Object.assign({}, entry.meta || {}, { projekt: dataFields.projekt || "" });
      return entry;
    }

    function validateArchiveFields() {
      if (FORM.reportValidity()) return true;
      setStatus("Bitte füllen Sie Projekt, Datum und Anlagenart aus.");
      return false;
    }

    function saveCurrentFormToArchive() {
      if (!validateArchiveFields()) return null;
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
    window.saveCurrentFormToArchive = saveCurrentFormToArchive;

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
      const entries = getArchive().slice().sort(function(a, b) {
        return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
      });
      archiveFilterCount.textContent = entries.length + (entries.length === 1 ? " Eintrag" : " Einträge");
      if (!entries.length) {
        archiveList.innerHTML = '<p class="archive-empty">Noch keine Archiv-Einträge vorhanden.</p>';
        return;
      }
      const pointer = currentArchiveId();
      archiveList.innerHTML = entries.map(function(entry) {
        const currentClass = pointer && entry.id === pointer ? " archive-item-current" : "";
        return '<article class="archive-item archive-item-detailed' + currentClass + '" data-archive-id="' + escapeHtml(entry.id) + '">' +
          '<div><div class="archive-title">' + escapeHtml(archiveTitle(entry)) + '</div><div class="archive-meta">' + escapeHtml(archiveMeta(entry)) + '</div></div>' +
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
    window.openArchive = openArchive;

    function closeArchive() {
      archiveOverlay.hidden = true;
    }

    function clearForm() {
      if (!window.confirm("Formular wirklich leeren?")) return;
      FORM.reset();
      localStorage.removeItem(CURRENT_ARCHIVE_ID_KEY);
      applyData({ fields: { datum: todayIso(), abschlussDatum: todayIso() } });
      setStatus("Formular geleert.");
    }
    window.clearForm = clearForm;

    function enforceExclusiveCheckbox(target) {
      if (!target || target.type !== "checkbox" || !target.name || !target.checked) return;
      const group = Array.from(FORM.querySelectorAll('input[type="checkbox"][name="' + target.name + '"]'));
      if (target.hasAttribute("data-exclusive-none")) {
        group.forEach(function(field) { if (field !== target) field.checked = false; });
      } else {
        group.forEach(function(field) { if (field.hasAttribute("data-exclusive-none")) field.checked = false; });
      }
    }

    function pdfValue(value) {
      if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
      if (value === true) return "Ja";
      if (value === false) return "Nein";
      const text = String(value === undefined || value === null ? "" : value).trim();
      return text || "-";
    }

    function exportPdf() {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        setStatus("PDF-Export konnte nicht erstellt werden.");
        return;
      }
      const button = document.getElementById("pdfBtn");
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "PDF wird erstellt...";
      setStatus("PDF Export wird erstellt...");
      try {
        const doc = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const dataFields = collectData().fields;
        const margin = 14;
        const contentWidth = 182;
        const labelWidth = 52;
        const valueWidth = contentWidth - labelWidth - 6;
        const pageBottom = 278;
        const lineHeight = 4.2;
        let y = 0;

        const sections = [
          { title: "Projekt- und Objektdaten", rows: [
            ["Projekt", dataFields.projekt], ["Datum", displayDate(dataFields.datum)], ["Objektadresse", dataFields.objektadresse]
          ] },
          { title: "Allgemeines", rows: [
            ["Anlagenart", dataFields.anlagenart], ["Planunterlagen vorhanden", dataFields.plaeneVorhanden],
            ["Nutzung ab", displayDate(dataFields.nutzungAb)], ["Nutzungsmodell", dataFields.nutzungsmodell],
            ["Nutzungsdauer", dataFields.nutzungsdauerMonate ? dataFields.nutzungsdauerMonate + " Monate" : ""], ["Nutzungsart", dataFields.nutzungsart]
          ] },
          { title: "Dokumente und Gutachten", rows: [
            ["Vorhandene Grundlagen", dataFields.stellungnahmen], ["Ergänzende Angaben", dataFields.dokumenteErgaenzung]
          ] },
          { title: "Schutzziele", rows: [
            ["Schutzziele", dataFields.schutzziele], ["Überwachungskategorie", dataFields.ueberwachungskategorie]
          ] },
          { title: "Sicherungsbereich und Gebäude", rows: [
            ["Überwachungsbereich", dataFields.sicherungsbereich], ["Denkmalschutz", dataFields.denkmalschutz]
          ] },
          { title: "Brandmelder", rows: [
            ["Raumhöhe", dataFields.raumhoehe], ["Genaue Raumhöhe", dataFields.raumhoeheAngabe ? dataFields.raumhoeheAngabe + " m" : ""],
            ["Zwischendecke/-boden über 0,2 m", dataFields.zwischendecke], ["Bereich oder Details", dataFields.zwischendeckeDetails],
            ["Störgrößen", dataFields.stoergroessen], ["Art und Ort der Störgrößen", dataFields.stoergroessenDetails],
            ["Handfeuermelder", dataFields.handfeuermelder]
          ] },
          { title: "Alarmierung und Alarmweiterleitung", rows: [
            ["Interne Alarmierung", dataFields.interneAlarmierung], ["Alarmweiterleitung", dataFields.alarmweiterleitung],
            ["Telefonnummer Leitstelle", dataFields.leitstelleTelefon], ["Standort Brandmelderzentrale", dataFields.bmzStandort],
            ["Störschall vorhanden", dataFields.stoerschall], ["Ergänzende Angaben", dataFields.alarmierungDetails]
          ] },
          { title: "Montage und Instandhaltung", rows: [
            ["Arbeitsbühne erforderlich", dataFields.arbeitsbuehne],
            ["Arbeitshöhe", dataFields.arbeitsbuehne && dataFields.arbeitsbuehneHoehe ? dataFields.arbeitsbuehneHoehe + " m" : ""],
            ["Art der Arbeitsbühne", dataFields.arbeitsbuehne ? dataFields.arbeitsbuehneArt : ""],
            ["Weitere Angaben", dataFields.arbeitsbuehne ? dataFields.arbeitsbuehneDetails : ""],
            ["Instandhaltung", dataFields.instandhaltung]
          ] },
          { title: "Feuerwehr", rows: [
            ["Einrichtungen", dataFields.feuerwehrEinrichtungen], ["Standort und Angaben", dataFields.feuerwehrDetails]
          ] },
          { title: "Ergänzungen", rows: [["Weitere Anforderungen und Hinweise", dataFields.ergaenzungen]] },
          { title: "Abschluss", keepTogether: true, rows: [
            ["Ort", dataFields.abschlussOrt], ["Datum", displayDate(dataFields.abschlussDatum)], ["Name Kunde", dataFields.abschlussName]
          ], signature: dataFields.abschlussUnterschrift }
        ];

        function drawPageHeader() {
          doc.setFillColor(255, 180, 71);
          doc.rect(10, 24, 190, 10, "F");
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.text("Planungshilfe BMA", 14, 30.7);
          return 42;
        }

        function nextPage() {
          doc.addPage();
          y = drawPageHeader();
        }

        function ensureSpace(height) {
          if (y + height > pageBottom) nextPage();
        }

        function drawSectionTitle(title) {
          ensureSpace(13);
          doc.setFillColor(237, 239, 243);
          doc.rect(margin, y, contentWidth, 8, "F");
          doc.setTextColor(28, 28, 30);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(title, margin + 3, y + 5.4);
          y += 10;
        }

        function drawRow(label, rawValue) {
          let labelLines = doc.splitTextToSize(String(label || ""), labelWidth - 4);
          let valueLines = doc.splitTextToSize(pdfValue(rawValue), valueWidth - 4);
          if (!Array.isArray(labelLines) || !labelLines.length) labelLines = [""];
          if (!Array.isArray(valueLines) || !valueLines.length) valueLines = ["-"];
          let labelOffset = 0;
          let valueOffset = 0;
          let continuation = false;
          while (labelOffset < labelLines.length || valueOffset < valueLines.length) {
            if (pageBottom - y < 10) nextPage();
            const availableLines = Math.max(1, Math.min(38, Math.floor((pageBottom - y - 8) / lineHeight)));
            const labelChunk = labelLines.slice(labelOffset, labelOffset + availableLines);
            const valueChunk = valueLines.slice(valueOffset, valueOffset + availableLines);
            const lines = Math.max(1, labelChunk.length, valueChunk.length);
            const height = Math.max(9, lines * lineHeight + 4);
            if (y + height > pageBottom) {
              nextPage();
              continue;
            }
            doc.setFillColor(249, 249, 251);
            doc.rect(margin, y, contentWidth, height, "F");
            doc.setDrawColor(224, 224, 229);
            doc.line(margin + labelWidth, y, margin + labelWidth, y + height);
            doc.setTextColor(28, 28, 30);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            const displayedLabel = continuation && !labelChunk.length ? ["Fortsetzung"] : labelChunk;
            displayedLabel.forEach(function(line, index) {
              doc.text(String(line || ""), margin + 2, y + 4.5 + index * lineHeight);
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            (valueChunk.length ? valueChunk : [""]).forEach(function(line, index) {
              doc.text(String(line || ""), margin + labelWidth + 3, y + 4.5 + index * lineHeight);
            });
            y += height + 1;
            labelOffset += labelChunk.length;
            valueOffset += valueChunk.length;
            continuation = true;
            if (labelOffset < labelLines.length || valueOffset < valueLines.length) nextPage();
          }
        }

        function estimatedRowHeight(label, rawValue) {
          const labelLines = doc.splitTextToSize(String(label || ""), labelWidth - 4) || [""];
          const valueLines = doc.splitTextToSize(pdfValue(rawValue), valueWidth - 4) || ["-"];
          return Math.max(9, Math.max(labelLines.length || 1, valueLines.length || 1) * lineHeight + 4) + 1;
        }

        function drawSignatureRow(rawValue) {
          const height = 34;
          ensureSpace(height + 1);
          doc.setFillColor(249, 249, 251);
          doc.rect(margin, y, contentWidth, height, "F");
          doc.setDrawColor(224, 224, 229);
          doc.line(margin + labelWidth, y, margin + labelWidth, y + height);
          doc.setTextColor(28, 28, 30);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.text("Unterschrift Kunde", margin + 2, y + 4.5);
          const signature = /^data:image\/png;base64,/i.test(String(rawValue || "")) ? String(rawValue) : "";
          if (signature) {
            try {
              doc.addImage(signature, "PNG", margin + labelWidth + 3, y + 2, valueWidth - 6, height - 4, undefined, "FAST");
            } catch (error) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.text("Signatur konnte nicht dargestellt werden.", margin + labelWidth + 3, y + 6);
            }
          } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("-", margin + labelWidth + 3, y + 6);
          }
          y += height + 1;
        }

        y = drawPageHeader();
        sections.forEach(function(section) {
          if (section.keepTogether) {
            const rowsHeight = section.rows.reduce(function(total, row) { return total + estimatedRowHeight(row[0], row[1]); }, 0);
            ensureSpace(10 + rowsHeight + 35 + 3);
          }
          drawSectionTitle(section.title);
          section.rows.forEach(function(row) { drawRow(row[0], row[1]); });
          if (Object.prototype.hasOwnProperty.call(section, "signature")) drawSignatureRow(section.signature);
          y += 3;
        });

        const pageCount = doc.getNumberOfPages();
        for (let page = 1; page <= pageCount; page += 1) {
          doc.setPage(page);
          drawPageHeader();
          doc.setDrawColor(209, 209, 214);
          doc.line(margin, 284, 196, 284);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.text("FSMobile · Planungshilfe BMA", margin, 289);
          doc.text("Seite " + page + " von " + pageCount, 196, 289, { align: "right" });
        }

        if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(doc);
        const objectName = firstLine(dataFields.objektadresse) || dataFields.projekt || "Planungshilfe_BMA";
        const fileName = window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.pdfFileName === "function"
          ? window.FSMOBILE_STANDARD.pdfFileName([objectName, dataFields.datum || todayIso()], "Planungshilfe_BMA")
          : (objectName + "_" + (dataFields.datum || todayIso()) + ".pdf").replace(/[\\/:*?\"<>|\s]+/g, "_");
        doc.save(fileName);
        setStatus("PDF-Export wurde erstellt.");
      } catch (error) {
        console.error("PDF-Export fehlgeschlagen:", error);
        setStatus("PDF-Export konnte nicht erstellt werden.");
      } finally {
        button.disabled = false;
        button.textContent = originalText || "PDF";
      }
    }
    window.exportPdf = exportPdf;

    function registerModuleApi() {
      if (!window.FSMOBILE_STANDARD || typeof window.FSMOBILE_STANDARD.createModuleApi !== "function") return;
      window.FSMOBILE_MODULE_API = window.FSMOBILE_STANDARD.createModuleApi({
        moduleId: MODULE_ID,
        storage: {
          current: STORAGE_KEY,
          archive: ARCHIVE_STORAGE_KEY,
          pointer: CURRENT_ARCHIVE_ID_KEY
        },
        capabilities: { draft: true, archive: true, pdf: true, signatures: true },
        state: { collect: collectData, apply: applyData },
        lifecycle: { flush: saveFormNow },
        actions: {
          save: { invoke: saveCurrentFormToArchive, isDisabled: function() { return Boolean(document.getElementById("archiveSaveBtn")?.disabled); } },
          archive: { invoke: openArchive, isDisabled: function() { return Boolean(document.getElementById("archiveBtn")?.disabled); } },
          clear: { invoke: clearForm, isDisabled: function() { return Boolean(document.getElementById("clearBtn")?.disabled); } },
          pdf: { invoke: exportPdf, isDisabled: function() { return Boolean(document.getElementById("pdfBtn")?.disabled); } }
        }
      });
    }

    FORM.addEventListener("input", function(event) {
      autoGrow(event.target);
      scheduleSave();
    });
    FORM.addEventListener("change", function(event) {
      enforceExclusiveCheckbox(event.target);
      updateDependentFields();
      scheduleSave();
    });
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

    window.FSMOBILE_MODULE_TEST_API = {
      moduleId: MODULE_ID,
      storageKey: STORAGE_KEY,
      archiveKey: ARCHIVE_STORAGE_KEY,
      pointerKey: CURRENT_ARCHIVE_ID_KEY,
      collectData: collectData,
      applyData: applyData,
      getArchive: getArchive,
      saveToArchive: saveCurrentFormToArchive,
      openArchiveEntry: openArchiveEntry,
      deleteArchiveEntry: deleteArchiveEntry,
      exportPdf: exportPdf,
      clearCustomerSignature: clearCustomerSignature
    };

    initializeSignaturePad();
    restoreDraft();
    registerModuleApi();
  </script>
</body>
</html>`
  };
}());
