(function () {
  "use strict";

  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES["pb-druckpruefung-din-14462"] = {
    title: "Druckprüfung DIN 14462",
    group: "Prüfberichte",
    description: "Druckprüfungen von Löschwasserleitungen nach DIN 14462 mit Prüfdrücken, Voraussetzungen und zwei Unterschriften dokumentieren.",
    html: String.raw`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#d6001c" />
  <meta name="application-name" content="Druckprüfung DIN 14462" />
  <title>Druckprüfung DIN 14462</title>
  <script defer src="vendor/jspdf.umd.min.js"></script>
  <style>
    :root {
      --brand: #d6001c;
      --primary: #007aff;
      --success: #34c759;
      --danger: #ff3b30;
      --neutral: #8e8e93;
      --warning: #ff9500;
      --text: #1c1c1e;
      --muted: #6e6e73;
      --surface: rgba(255,255,255,.1);
      --field: rgba(255,255,255,.065);
      --line: rgba(255,255,255,.42);
      --radius-lg: 22px;
      --radius-md: 14px;
      --radius-sm: 11px;
      --shadow: 0 12px 34px rgba(0,0,0,.08);
    }

    * { box-sizing: border-box; }
    html { background: transparent; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--text);
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Arial, sans-serif;
    }
    input, textarea, button { font: inherit; }
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
    h2, h3, legend, label { letter-spacing: 0; }
    .title-actions, .button-area, .approval-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .title-actions {
      justify-content: flex-end;
      padding: 0;
      background: transparent;
      border: 0;
      box-shadow: none;
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
    .archive-save { background: linear-gradient(180deg, #ffad33 0%, var(--warning) 100%); }
    .clear-btn, .archive-close-btn { background: linear-gradient(180deg, #a4a4aa 0%, var(--neutral) 100%); }
    .archive-delete-btn, .danger { background: linear-gradient(180deg, #ff5147 0%, var(--danger) 100%); }

    .form-section {
      margin-bottom: 14px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: linear-gradient(145deg, rgba(255,255,255,.2), rgba(255,255,255,.08) 58%, rgba(214,0,28,.025)), var(--surface);
      box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,.28);
      -webkit-backdrop-filter: blur(18px) saturate(1.08);
      backdrop-filter: blur(18px) saturate(1.08);
    }
    .section-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 14px;
      font-size: 20px;
      line-height: 1.2;
      font-weight: 850;
    }
    .section-heading::before {
      width: 4px;
      height: 22px;
      border-radius: 3px;
      background: var(--brand);
      content: "";
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: start;
    }
    .identifier-grid { margin-bottom: 12px; }
    .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .field-group { display: flex; min-width: 0; flex-direction: column; gap: 6px; }
    .field-group > label, .group-label {
      padding-left: 2px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.25;
      font-weight: 760;
    }
    input[type="text"], input[type="date"], input[type="number"], textarea {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: var(--radius-sm);
      color: var(--text);
      background: var(--field);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
      font-size: 16px;
      line-height: 1.35;
      outline: none;
    }
    textarea { min-height: 86px; resize: vertical; }
    textarea.dynamic-textarea { min-height: 86px; overflow-y: hidden; resize: none; }
    input:focus, textarea:focus { border-color: rgba(214,0,28,.5); box-shadow: 0 0 0 4px rgba(214,0,28,.11); }
    .input-unit {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding-right: 12px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: var(--radius-sm);
      background: var(--field);
    }
    .input-unit input { min-height: 42px; border: 0; background: transparent; box-shadow: none; }
    .unit { color: var(--muted); font-size: 14px; font-weight: 850; white-space: nowrap; }

    .notice {
      margin: 0;
      padding: 14px 16px;
      border-left: 4px solid var(--brand);
      border-radius: 12px;
      color: var(--text);
      background: rgba(214,0,28,.055);
      font-size: 14px;
      line-height: 1.5;
      font-weight: 650;
    }
    .notice strong { font-weight: 850; }
    .notice.temperature { border-left-color: var(--warning); background: rgba(255,149,0,.07); }

    fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }
    legend { width: 100%; padding: 0; }
    .choice-stack { display: grid; gap: 10px; }
    .choice-card {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr);
      gap: 10px;
      align-items: start;
      padding: 13px;
      border: 1px solid rgba(255,255,255,.4);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.055);
      cursor: pointer;
    }
    .choice-card:has(input:checked) {
      border-color: rgba(214,0,28,.55);
      background: rgba(214,0,28,.08);
      box-shadow: 0 0 0 2px rgba(214,0,28,.08);
    }
    .choice-card input, .binary-option input {
      width: 22px;
      height: 22px;
      margin: 0;
      accent-color: var(--brand);
    }
    .choice-title { display: block; margin-bottom: 4px; font-size: 15px; font-weight: 850; }
    .choice-description { display: block; color: var(--muted); font-size: 13px; line-height: 1.4; font-weight: 650; }

    .binary-list { display: grid; gap: 9px; }
    .binary-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
      padding: 11px 12px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.05);
    }
    .binary-label { font-size: 14px; line-height: 1.4; font-weight: 720; }
    .binary-options { display: flex; flex-wrap: nowrap; gap: 10px; }
    .binary-option {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 68px;
      padding: 7px 9px;
      border-radius: 10px;
      background: rgba(255,255,255,.055);
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }
    .test-card {
      padding: 14px;
      border: 1px solid rgba(255,255,255,.4);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.055);
    }
    .test-card h3 { margin: 0 0 12px; font-size: 17px; }
    .fixed-time {
      display: flex;
      min-height: 44px;
      align-items: center;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,.055);
      font-size: 15px;
      font-weight: 800;
    }
    .conditional-field[hidden] { display: none; }

    .approval-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .approval-card {
      min-width: 0;
      padding: 14px;
      border: 1px solid rgba(255,255,255,.4);
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.055);
    }
    .approval-card h3 { margin: 0 0 10px; font-size: 17px; }
    .approval-pad {
      display: block;
      width: 100%;
      height: 170px;
      border: 2px dashed rgba(255,255,255,.46);
      border-radius: 12px;
      background: linear-gradient(145deg, rgba(255,255,255,.075), rgba(255,255,255,.025));
      touch-action: none;
    }
    .approval-actions { margin-top: 10px; }
    .approval-actions button { min-height: 42px; padding: 10px 15px; }
    .signature-sentinel { display: none !important; width: 1px; height: 1px; }

    .button-area { margin-top: 16px; }
    .archive-status { display: none; }
    .is-invalid { border-color: var(--danger) !important; box-shadow: 0 0 0 3px rgba(255,59,48,.13) !important; }
    .binary-row.is-invalid, .choice-stack.is-invalid { border-radius: var(--radius-md); outline: 3px solid rgba(255,59,48,.13); }

    .archive-overlay[hidden] { display: none; }
    .archive-overlay {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(15,23,42,.42);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
    .archive-dialog {
      width: min(820px, 100%);
      max-height: min(760px, 90vh);
      overflow: auto;
      padding: 18px;
      border: 1px solid rgba(255,255,255,.52);
      border-radius: 22px;
      background: rgba(245,247,251,.96);
      box-shadow: 0 26px 80px rgba(15,23,42,.28);
    }
    .archive-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .archive-header h2 { margin: 0; font-size: 24px; }
    .archive-filter-tools { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; margin-top: 14px; }
    .archive-filter-input { min-height: 44px; }
    .archive-filter-count { color: var(--muted); font-size: 13px; font-weight: 750; white-space: nowrap; }
    .archive-list { display: grid; gap: 10px; margin-top: 14px; }
    .archive-empty { margin: 0; color: var(--muted); font-weight: 700; }
    .archive-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 10px;
      align-items: center;
      padding: 12px;
      border: 1px solid rgba(60,60,67,.12);
      border-radius: 14px;
      background: rgba(255,255,255,.78);
    }
    .archive-item-current { border-color: rgba(0,122,255,.58); box-shadow: 0 0 0 2px rgba(0,122,255,.1); }
    .archive-title { font-weight: 850; overflow-wrap: anywhere; }
    .archive-meta { margin-top: 4px; color: var(--muted); font-size: 13px; font-weight: 680; line-height: 1.35; }
    .archive-item button { min-height: 42px; padding: 10px 14px; }

    .shell-metadata-field { display: none !important; }

    body.generating-pdf .title-actions,
    body.generating-pdf .button-area,
    body.generating-pdf .approval-actions,
    body.generating-pdf .archive-status { display: none !important; }

    @media (max-width: 900px) {
      .container { padding: 12px; }
      .title-bar { align-items: stretch; flex-direction: column; }
      .title-actions, .title-actions button { width: 100%; }
      .form-grid.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .binary-row { grid-template-columns: 1fr; }
      .binary-options { justify-content: flex-start; }
    }
    @media (max-width: 680px) {
      .form-grid, .form-grid.three, .approval-grid { grid-template-columns: 1fr; }
      .archive-item { grid-template-columns: 1fr; }
      .archive-item button { width: 100%; }
      .archive-filter-tools { grid-template-columns: 1fr; }
      .binary-options { width: 100%; }
      .binary-option { flex: 1 1 0; justify-content: center; }
    }
  </style>
</head>
<body>
  <main class="container">
    <header class="title-bar">
      <h1>Druckprüfung DIN 14462</h1>
      <div class="title-actions" aria-label="Berichtsaktionen">
        <button type="button" class="archive-save" id="archiveSaveBtn">Im Archiv speichern</button>
        <button type="button" class="archive-open" id="archiveBtn">Archiv</button>
      </div>
    </header>

    <form id="druckpruefungForm" novalidate>
      <input class="shell-metadata-field" id="objectInput" name="object" type="text" tabindex="-1" aria-hidden="true" />
      <input class="shell-metadata-field" id="dateInput" name="date" type="text" tabindex="-1" aria-hidden="true" />
      <section class="form-section" aria-labelledby="allgemeineAngabenTitle">
        <h2 class="section-heading" id="allgemeineAngabenTitle">Allgemeine Angaben</h2>
        <div class="form-grid identifier-grid">
          <div class="field-group">
            <label for="anlagenNrInput">Anlagen Nr.</label>
            <input id="anlagenNrInput" name="anlagenNr" type="text" autocomplete="off" />
          </div>
          <div class="field-group">
            <label for="kundenNrInput">Kunden Nr.</label>
            <input id="kundenNrInput" name="kundenNr" type="text" autocomplete="off" />
          </div>
        </div>
        <div class="form-grid">
          <div class="field-group">
            <label for="bauvorhabenInput">Bauvorhaben</label>
            <textarea id="bauvorhabenInput" name="bauvorhaben" required></textarea>
          </div>
          <div class="field-group">
            <label for="auftraggeberInput">Auftraggeber/Vertreter</label>
            <textarea id="auftraggeberInput" name="auftraggeberVertreter" required></textarea>
          </div>
          <div class="field-group">
            <label for="auftragnehmerInput">Auftragnehmer/Vertreter</label>
            <textarea id="auftragnehmerInput" name="auftragnehmerVertreter" required></textarea>
          </div>
        </div>
      </section>

      <section class="form-section" aria-labelledby="anforderungTitle">
        <h2 class="section-heading" id="anforderungTitle">Anforderung gemäß DIN 14462</h2>
        <p class="notice"><strong>Anforderung gem. DIN 14462:</strong> Sofern nicht höhere Innendrücke (höchster Systembetriebsdruck MDP) einen höheren Nenndruck erforderlich machen, sind Löschwasserleitungen und deren Armaturen bei Wandhydrantenanlagen sowie Hydrantenanlagen mindestens für Nenndruck PN 10 und bei Löschwasseranlagen „trocken“ für Nenndruck PN 16 zu bemessen.</p>
      </section>

      <section class="form-section" aria-labelledby="anlagenartTitle">
        <h2 class="section-heading" id="anlagenartTitle">Anlagenart</h2>
        <fieldset>
          <legend class="group-label">Genau eine Anlagenart auswählen</legend>
          <div class="choice-stack" id="anlagenartChoices">
            <label class="choice-card">
              <input type="radio" name="anlagenart" value="Löschwasseranlage „trocken“" />
              <span><span class="choice-title">Löschwasseranlage „trocken“</span><span class="choice-description">Die Löschwasserleitung und deren Armaturen werden mit Wasser 10 Minuten bei 1,6 MPa auf Dichtheit und vor der Abnahme zusätzlich 2 Minuten mit 2,4 MPa auf Festigkeit geprüft.</span></span>
            </label>
            <label class="choice-card">
              <input type="radio" name="anlagenart" value="Wandhydrantenanlage" />
              <span><span class="choice-title">Wandhydrantenanlage</span><span class="choice-description">Die Löschwasserleitung wird mit Wasser 10 Minuten bei Nenndruck auf Dichtheit und vor der Abnahme zusätzlich 2 Minuten mit dem 1,5-fachen Nenndruck auf Festigkeit geprüft.</span></span>
            </label>
            <label class="choice-card">
              <input type="radio" name="anlagenart" value="Hydrantenanlage mit Über- und/oder Unterflurhydranten" />
              <span><span class="choice-title">Hydrantenanlage mit Über- und/oder Unterflurhydranten</span><span class="choice-description">Die Löschwasserleitung wird mit Wasser 10 Minuten bei Nenndruck auf Dichtheit und vor der Abnahme zusätzlich 2 Minuten mit dem 1,5-fachen Nenndruck auf Festigkeit geprüft.</span></span>
            </label>
          </div>
        </fieldset>
      </section>

      <section class="form-section" aria-labelledby="pruefangabenTitle">
        <h2 class="section-heading" id="pruefangabenTitle">Prüf- und Anlagenangaben</h2>
        <div class="form-grid">
          <div class="field-group">
            <label for="mdpInput">Höchster Systembetriebsdruck MDP</label>
            <div class="input-unit"><input id="mdpInput" name="mdp" type="number" min="0.01" step="0.01" inputmode="decimal" required /><span class="unit">MPa</span></div>
          </div>
          <fieldset>
            <legend class="group-label">Prüfumfang der Löschwasserleitung</legend>
            <div class="binary-options" id="pruefumfangChoices">
              <label class="binary-option"><input type="radio" name="pruefumfang" value="Gesamtleitung" />Gesamtleitung</label>
              <label class="binary-option"><input type="radio" name="pruefumfang" value="Teilabschnitte" />Teilabschnitte</label>
            </div>
          </fieldset>
          <div class="field-group conditional-field" id="teilabschnitteField" hidden>
            <label for="teilabschnitteInput">Anzahl der Teilabschnitte</label>
            <input id="teilabschnitteInput" name="teilabschnitte" type="number" min="1" step="1" inputmode="numeric" />
            <span class="group-label">Erhöhung der Prüfsicherheit</span>
          </div>
        </div>
      </section>

      <section class="form-section" aria-labelledby="voraussetzungenTitle">
        <h2 class="section-heading" id="voraussetzungenTitle">Prüfvoraussetzungen</h2>
        <div class="binary-list">
          <div class="binary-row" data-required-radio="leitungenArmaturen"><span class="binary-label">Alle Leitungen und erforderlichen Armaturen sind verbaut; nicht geprüfte Teilabschnitte waren verschlossen.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="leitungenArmaturen" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="leitungenArmaturen" value="Nein" />Nein</label></div></div>
          <div class="binary-row" data-required-radio="trinkwasser"><span class="binary-label">Die Löschwasseranlage wurde mit sauberem Trinkwasser befüllt.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="trinkwasser" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="trinkwasser" value="Nein" />Nein</label></div></div>
          <div class="binary-row" data-required-radio="entlueftet"><span class="binary-label">Das Rohrleitungssystem wurde entlüftet.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="entlueftet" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="entlueftet" value="Nein" />Nein</label></div></div>
        </div>
        <p class="notice temperature" style="margin-top:12px">Bei mehr als 10 °C Temperaturunterschied zwischen Prüfmedium und Umgebungstemperatur sollte nach Herstellung des Prüfdrucks eine Wartezeit von 30 Minuten für den Temperaturausgleich eingehalten werden.</p>
        <div class="binary-list" style="margin-top:12px">
          <div class="binary-row" data-required-radio="temperaturausgleichErforderlich"><span class="binary-label">Temperaturausgleich erforderlich.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="temperaturausgleichErforderlich" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="temperaturausgleichErforderlich" value="Nein" />Nein</label></div></div>
          <div class="binary-row" data-required-radio="temperaturausgleichDurchgefuehrt"><span class="binary-label">Temperaturausgleich wurde durchgeführt.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="temperaturausgleichDurchgefuehrt" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="temperaturausgleichDurchgefuehrt" value="Nein" />Nein</label></div></div>
          <div class="binary-row" data-required-radio="vorVerdeckung"><span class="binary-label">Prüfung durchgeführt, bevor die Löschwasserleitung verdeckt wurde.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="vorVerdeckung" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="vorVerdeckung" value="Nein" />Nein</label></div></div>
          <div class="binary-row" data-required-radio="materialnachweis"><span class="binary-label">Nachweis über die Eignung des Rohrleitungsmaterials gemäß DIN 14462 Tabelle 1 liegt vor.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="materialnachweis" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="materialnachweis" value="Nein" />Nein</label></div></div>
        </div>
      </section>

      <section class="form-section" aria-labelledby="pruefungenTitle">
        <h2 class="section-heading" id="pruefungenTitle">Dichtheits- und Festigkeitsprüfung</h2>
        <div class="form-grid">
          <article class="test-card">
            <h3>Dichtheitsprüfung</h3>
            <div class="form-grid">
              <div class="field-group"><label for="dichtheitsdruckInput">Prüfdruck</label><div class="input-unit"><input id="dichtheitsdruckInput" name="dichtheitsdruck" type="number" min="0.01" step="0.01" inputmode="decimal" required /><span class="unit">MPa</span></div></div>
              <div class="field-group"><span class="group-label">Prüfzeit</span><div class="fixed-time">10 Minuten</div></div>
            </div>
            <div class="binary-row" data-required-radio="dichtheitspruefungDruckabfall" style="margin-top:12px"><span class="binary-label">Druckabfall nach Ablauf der Prüfzeit festgestellt.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="dichtheitspruefungDruckabfall" value="Nein" />Nein</label><label class="binary-option"><input type="radio" name="dichtheitspruefungDruckabfall" value="Ja" />Ja</label></div></div>
          </article>
          <article class="test-card">
            <h3>Festigkeitsprüfung</h3>
            <div class="form-grid">
              <div class="field-group"><label for="festigkeitsdruckInput">Prüfdruck</label><div class="input-unit"><input id="festigkeitsdruckInput" name="festigkeitsdruck" type="number" min="0.01" step="0.01" inputmode="decimal" required /><span class="unit">MPa</span></div></div>
              <div class="field-group"><span class="group-label">Prüfzeit</span><div class="fixed-time">2 Minuten</div></div>
            </div>
            <div class="binary-row" data-required-radio="festigkeitspruefungDruckabfall" style="margin-top:12px"><span class="binary-label">Druckabfall nach Ablauf der Prüfzeit festgestellt.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="festigkeitspruefungDruckabfall" value="Nein" />Nein</label><label class="binary-option"><input type="radio" name="festigkeitspruefungDruckabfall" value="Ja" />Ja</label></div></div>
          </article>
        </div>
      </section>

      <section class="form-section" aria-labelledby="ergebnisTitle">
        <h2 class="section-heading" id="ergebnisTitle">Prüfergebnis</h2>
        <div class="binary-row" data-required-radio="systemDicht"><span class="binary-label">Das Rohrleitungssystem wurde fachgerecht geprüft und ist dicht.</span><div class="binary-options"><label class="binary-option"><input type="radio" name="systemDicht" value="Ja" />Ja</label><label class="binary-option"><input type="radio" name="systemDicht" value="Nein" />Nein</label></div></div>
        <div class="form-grid" style="margin-top:12px">
          <div class="field-group"><label for="ortInput">Ort</label><input id="ortInput" name="ort" type="text" required /></div>
          <div class="field-group"><label for="datumInput">Datum</label><input id="datumInput" name="datum" type="date" required /></div>
        </div>
        <div class="field-group" style="margin-top:12px">
          <label for="bemerkungenInput">Bemerkungen</label>
          <textarea class="dynamic-textarea" id="bemerkungenInput" name="bemerkungen" rows="3"></textarea>
        </div>
      </section>

      <section class="form-section" aria-labelledby="unterschriftenTitle">
        <h2 class="section-heading" id="unterschriftenTitle">Unterschriften</h2>
        <div class="approval-grid">
          <article class="approval-card">
            <h3>Unterschrift Auftraggeber/Vertreter</h3>
            <canvas class="approval-pad" id="auftraggeberPad" aria-label="Zeichenfeld Auftraggeber oder Vertreter"></canvas>
            <div class="approval-actions"><button class="danger" type="button" data-clear-approval="auftraggeber">Unterschrift löschen</button></div>
          </article>
          <article class="approval-card">
            <h3>Unterschrift Auftragnehmer/Vertreter</h3>
            <canvas class="approval-pad" id="auftragnehmerPad" aria-label="Zeichenfeld Auftragnehmer oder Vertreter"></canvas>
            <div class="approval-actions"><button class="danger" type="button" data-clear-approval="auftragnehmer">Unterschrift löschen</button></div>
          </article>
        </div>
      </section>

      <div class="button-area">
        <button class="clear-btn" id="clearBtn" type="button">Leeren</button>
        <button class="pdf-btn" id="pdfBtn" type="button">PDF</button>
      </div>
    </form>
    <p class="archive-status" id="archiveStatus" role="status" aria-live="polite"></p>
    <canvas id="fsmobileSignatureSentinel" class="signature-sentinel" aria-label="Signature sentinel" hidden></canvas>
  </main>

  <section class="archive-overlay" id="archiveOverlay" aria-labelledby="archiveTitle" hidden>
    <div class="archive-dialog" role="dialog" aria-modal="true">
      <div class="archive-header"><h2 id="archiveTitle">Archiv Druckprüfung DIN 14462</h2><button type="button" class="archive-close-btn" id="archiveCloseBtn">Schließen</button></div>
      <div class="archive-filter-tools"><input class="archive-filter-input" id="archiveFilter" type="search" autocomplete="off" aria-label="Archiv filtern" placeholder="Bauvorhaben, Anlagenart, Datum oder Berichtstext filtern" /><span class="archive-filter-count" id="archiveFilterCount" aria-live="polite"></span></div>
      <div class="archive-list" id="archiveList"></div>
    </div>
  </section>

  <script>
    "use strict";

    const MODULE_ID = "pb-druckpruefung-din-14462";
    const STORAGE_KEY = "pb-druckpruefung-din-14462-current-v1";
    const ARCHIVE_STORAGE_KEY = "pb-druckpruefung-din-14462-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "pb-druckpruefung-din-14462-current-archive-id-v1";
    const REPORT_TITLE = "Druckprüfung DIN 14462";
    const NORM_TEXT = "Anforderung gem. DIN 14462: Sofern nicht höhere Innendrücke (höchster Systembetriebsdruck MDP) einen höheren Nenndruck erforderlich machen, sind Löschwasserleitungen und deren Armaturen bei Wandhydrantenanlagen sowie Hydrantenanlagen mindestens für Nenndruck PN 10 und bei Löschwasseranlagen „trocken“ für Nenndruck PN 16 zu bemessen.";
    const TEMPERATURE_TEXT = "Bei mehr als 10 °C Temperaturunterschied zwischen Prüfmedium und Umgebungstemperatur sollte nach Herstellung des Prüfdrucks eine Wartezeit von 30 Minuten für den Temperaturausgleich eingehalten werden.";
    const FIELD_IDS = ["anlagenNr", "kundenNr", "bauvorhaben", "auftraggeberVertreter", "auftragnehmerVertreter", "mdp", "teilabschnitte", "dichtheitsdruck", "festigkeitsdruck", "ort", "datum", "bemerkungen"];
    const RADIO_NAMES = ["anlagenart", "pruefumfang", "leitungenArmaturen", "trinkwasser", "entlueftet", "temperaturausgleichErforderlich", "temperaturausgleichDurchgefuehrt", "vorVerdeckung", "materialnachweis", "dichtheitspruefungDruckabfall", "festigkeitspruefungDruckabfall", "systemDicht"];
    const REQUIRED_RADIO_LABELS = {
      anlagenart: "Anlagenart",
      pruefumfang: "Prüfumfang",
      leitungenArmaturen: "Leitungen und Armaturen",
      trinkwasser: "Befüllung mit Trinkwasser",
      entlueftet: "Entlüftung",
      temperaturausgleichErforderlich: "Temperaturausgleich erforderlich",
      temperaturausgleichDurchgefuehrt: "Temperaturausgleich durchgeführt",
      vorVerdeckung: "Prüfung vor Verdeckung",
      materialnachweis: "Materialnachweis",
      dichtheitspruefungDruckabfall: "Druckabfall Dichtheitsprüfung",
      festigkeitspruefungDruckabfall: "Druckabfall Festigkeitsprüfung",
      systemDicht: "Prüfergebnis"
    };
    const PLANT_DESCRIPTIONS = {
      "Löschwasseranlage „trocken“": "Die Löschwasserleitung und deren Armaturen werden mit Wasser 10 Minuten bei 1,6 MPa auf Dichtheit und vor der Abnahme zusätzlich 2 Minuten mit 2,4 MPa auf Festigkeit geprüft.",
      "Wandhydrantenanlage": "Die Löschwasserleitung wird mit Wasser 10 Minuten bei Nenndruck auf Dichtheit und vor der Abnahme zusätzlich 2 Minuten mit dem 1,5-fachen Nenndruck auf Festigkeit geprüft.",
      "Hydrantenanlage mit Über- und/oder Unterflurhydranten": "Die Löschwasserleitung wird mit Wasser 10 Minuten bei Nenndruck auf Dichtheit und vor der Abnahme zusätzlich 2 Minuten mit dem 1,5-fachen Nenndruck auf Festigkeit geprüft."
    };

    const form = document.getElementById("druckpruefungForm");
    const archiveOverlay = document.getElementById("archiveOverlay");
    const archiveList = document.getElementById("archiveList");
    const archiveFilter = document.getElementById("archiveFilter");
    const archiveFilterCount = document.getElementById("archiveFilterCount");
    const teilabschnitteField = document.getElementById("teilabschnitteField");
    const pads = {};
    let saveTimer = 0;

    function setStatus(message) {
      document.getElementById("archiveStatus").textContent = message || "";
      try {
        window.parent.postMessage({ type: "fsmobile-toast", moduleId: MODULE_ID, message: message || "" }, "*");
      } catch (error) {}
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

    function syncShellMetadata() {
      const object = document.getElementById("objectInput");
      const date = document.getElementById("dateInput");
      if (object) object.value = firstLine(fieldValue("bauvorhaben"));
      if (date) date.value = fieldValue("datum");
    }

    function autoResizeTextarea(textarea) {
      if (!textarea || !textarea.classList.contains("dynamic-textarea")) return;
      textarea.style.height = "auto";
      textarea.style.height = Math.max(86, textarea.scrollHeight) + "px";
    }

    function escapeHtml(value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function(char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char];
      });
    }

    function fieldElement(name) {
      return form.elements.namedItem(name);
    }

    function fieldValue(name) {
      const element = fieldElement(name);
      return element && "value" in element ? String(element.value || "") : "";
    }

    function radioValue(name) {
      const checked = form.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : "";
    }

    function setRadioValue(name, value) {
      form.querySelectorAll('input[name="' + name + '"]').forEach(function(input) {
        input.checked = String(input.value) === String(value || "");
      });
    }

    function canvasIsBlank(canvas) {
      if (!canvas || canvas.width < 2 || canvas.height < 2) return true;
      try {
        const data = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data;
        for (let index = 3; index < data.length; index += 4) if (data[index] > 0) return false;
      } catch (error) {}
      return true;
    }

    function approvalData(key) {
      const state = pads[key];
      if (!state || canvasIsBlank(state.canvas)) return "";
      try { return state.canvas.toDataURL("image/png"); } catch (error) { return ""; }
    }

    function drawApprovalData(key, dataUrl) {
      const state = pads[key];
      if (!state || !dataUrl) return;
      const image = new Image();
      image.onload = function() {
        const canvas = state.canvas;
        const context = state.context;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.restore();
        context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
        context.lineWidth = 2.4;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "#1c1c1e";
      };
      image.src = dataUrl;
    }

    function resizeApprovalPad(key, keep) {
      const state = pads[key];
      if (!state) return;
      const oldData = keep ? approvalData(key) : "";
      const rect = state.canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      state.ratio = ratio;
      state.canvas.width = Math.max(1, Math.round(rect.width * ratio));
      state.canvas.height = Math.max(1, Math.round(rect.height * ratio));
      state.context.setTransform(ratio, 0, 0, ratio, 0, 0);
      state.context.lineWidth = 2.4;
      state.context.lineCap = "round";
      state.context.lineJoin = "round";
      state.context.strokeStyle = "#1c1c1e";
      if (oldData) drawApprovalData(key, oldData);
    }

    function setupApprovalPad(key, canvasId) {
      const canvas = document.getElementById(canvasId);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      pads[key] = { canvas: canvas, context: context, ratio: 1, drawing: false, lastPoint: null };

      function point(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }
      function start(event) {
        event.preventDefault();
        pads[key].drawing = true;
        pads[key].lastPoint = point(event);
      }
      function move(event) {
        const state = pads[key];
        if (!state.drawing) return;
        event.preventDefault();
        const current = point(event);
        context.beginPath();
        context.moveTo(state.lastPoint.x, state.lastPoint.y);
        context.lineTo(current.x, current.y);
        context.stroke();
        state.lastPoint = current;
      }
      function end() {
        const state = pads[key];
        if (!state.drawing) return;
        state.drawing = false;
        state.lastPoint = null;
        saveFormNow();
      }
      canvas.addEventListener("pointerdown", start, { passive: false });
      canvas.addEventListener("pointermove", move, { passive: false });
      canvas.addEventListener("pointerup", end);
      canvas.addEventListener("pointercancel", end);
      canvas.addEventListener("pointerleave", end);
      resizeApprovalPad(key, false);
    }

    function clearApproval(key, persist) {
      const state = pads[key];
      if (!state) return;
      state.context.save();
      state.context.setTransform(1, 0, 0, 1, 0, 0);
      state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);
      state.context.restore();
      state.context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
      if (persist !== false) saveFormNow();
    }

    function collectData() {
      syncShellMetadata();
      const fields = {};
      FIELD_IDS.forEach(function(name) { fields[name] = fieldValue(name); });
      RADIO_NAMES.forEach(function(name) { fields[name] = radioValue(name); });
      fields.object = fields.bauvorhaben;
      fields.objekt = fields.bauvorhaben;
      fields.anlage = fields.anlagenNr;
      fields.date = fields.datum;
      if (fields.pruefumfang !== "Teilabschnitte") fields.teilabschnitte = "";
      return {
        fields: fields,
        approvals: {
          auftraggeber: approvalData("auftraggeber"),
          auftragnehmer: approvalData("auftragnehmer")
        }
      };
    }

    function archiveEntryData(entry) {
      if (!entry || typeof entry !== "object") return {};
      return entry.data || entry.report || entry;
    }

    function normalizePayload(payload) {
      const source = payload && typeof payload === "object" ? payload : {};
      const data = source.data && typeof source.data === "object" ? source.data : source;
      const fields = data.fields && typeof data.fields === "object" ? data.fields : data;
      const approvals = data.approvals && typeof data.approvals === "object" ? data.approvals : {};
      return { fields: fields || {}, approvals: approvals };
    }

    function applyData(payload, options) {
      const normalized = normalizePayload(payload);
      FIELD_IDS.forEach(function(name) {
        const element = fieldElement(name);
        if (!element || !("value" in element)) return;
        const value = name === "anlagenNr" && normalized.fields[name] == null ? normalized.fields.anlage : normalized.fields[name];
        element.value = value == null ? "" : String(value);
      });
      RADIO_NAMES.forEach(function(name) { setRadioValue(name, normalized.fields[name]); });
      updateConditionalFields();
      syncShellMetadata();
      autoResizeTextarea(fieldElement("bemerkungen"));
      clearApproval("auftraggeber", false);
      clearApproval("auftragnehmer", false);
      if (normalized.approvals.auftraggeber) drawApprovalData("auftraggeber", normalized.approvals.auftraggeber);
      if (normalized.approvals.auftragnehmer) drawApprovalData("auftragnehmer", normalized.approvals.auftragnehmer);
      clearValidationState();
      if (!options || options.persist !== false) saveFormNow();
    }

    function saveFormNow() {
      window.clearTimeout(saveTimer);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData()));
        return true;
      } catch (error) {
        console.error("Druckprüfungsformular konnte nicht gespeichert werden.", error);
        return false;
      }
    }

    function scheduleSave() {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(saveFormNow, 140);
    }

    function restoreDraft() {
      let payload = null;
      try { payload = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) {}
      if (payload && typeof payload === "object") applyData(payload, { persist: false });
      else {
        fieldElement("datum").value = todayIso();
        updateConditionalFields();
        syncShellMetadata();
      }
      saveFormNow();
    }

    function getArchive() {
      try {
        const parsed = JSON.parse(localStorage.getItem(ARCHIVE_STORAGE_KEY) || "[]");
        return Array.isArray(parsed) ? parsed.filter(function(entry) { return entry && typeof entry === "object"; }) : [];
      } catch (error) { return []; }
    }

    function setArchive(entries) {
      try {
        localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(Array.isArray(entries) ? entries : []));
        return true;
      } catch (error) { return false; }
    }

    function currentArchiveId() {
      try { return localStorage.getItem(CURRENT_ARCHIVE_ID_KEY) || ""; } catch (error) { return ""; }
    }

    function createArchiveId() {
      return window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "druckpruefung-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    }

    function archiveFields(entry) {
      return normalizePayload(archiveEntryData(entry)).fields;
    }

    function archiveTitle(entry) {
      const fields = archiveFields(entry);
      return [fields.anlagenNr || fields.anlage || "Ohne Anlagen Nr.", firstLine(fields.bauvorhaben) || "Ohne Bauvorhaben", fields.anlagenart || REPORT_TITLE, displayDate(fields.datum)].filter(Boolean).join(" · ");
    }

    function archiveMeta(entry) {
      const fields = archiveFields(entry);
      const updated = entry.updatedAt || entry.savedAt || entry.createdAt || "";
      const parts = [];
      if (fields.kundenNr) parts.push("Kunden Nr.: " + fields.kundenNr);
      if (fields.auftraggeberVertreter) parts.push("Auftraggeber: " + firstLine(fields.auftraggeberVertreter));
      if (fields.pruefumfang) parts.push("Prüfumfang: " + fields.pruefumfang);
      if (updated) parts.push("Geändert: " + new Date(updated).toLocaleString("de-DE"));
      return parts.join(" · ");
    }

    function createArchiveEntry(data, previous) {
      const meta = {
        type: REPORT_TITLE,
        object: data.fields.bauvorhaben || "",
        anlage: data.fields.anlagenNr || "",
        kundenNr: data.fields.kundenNr || "",
        date: data.fields.datum || ""
      };
      let entry = null;
      if (window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.createArchiveEntry === "function") {
        entry = window.FSMOBILE_STANDARD.createArchiveEntry({ moduleId: MODULE_ID, title: archiveTitle({ data: data }), meta: meta, data: data, previous: previous || null });
      }
      if (!entry) {
        const now = new Date().toISOString();
        entry = { id: previous && previous.id ? previous.id : createArchiveId(), moduleId: MODULE_ID, title: archiveTitle({ data: data }), createdAt: previous && previous.createdAt ? previous.createdAt : now, updatedAt: now, meta: meta, data: data };
      }
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
      if (!entry) { setStatus("Archiv-Eintrag konnte nicht geöffnet werden."); return; }
      localStorage.setItem(CURRENT_ARCHIVE_ID_KEY, id);
      applyData(archiveEntryData(entry));
      closeArchive();
      setStatus("Archiv-Eintrag wurde geöffnet.");
    }

    function deleteArchiveEntry(id) {
      const entry = getArchive().find(function(item) { return item.id === id; });
      if (!entry || !window.confirm("Archiv-Eintrag wirklich löschen?")) return;
      const remaining = getArchive().filter(function(item) { return item.id !== id; });
      if (!setArchive(remaining)) { setStatus("Archiv-Eintrag konnte nicht gelöscht werden."); return; }
      if (currentArchiveId() === id) localStorage.removeItem(CURRENT_ARCHIVE_ID_KEY);
      renderArchiveList();
      setStatus("Archiv-Eintrag wurde gelöscht.");
    }

    function renderArchiveList() {
      const entries = getArchive().slice().sort(function(a, b) { return String(b.updatedAt || b.savedAt || "").localeCompare(String(a.updatedAt || a.savedAt || "")); });
      archiveFilterCount.textContent = entries.length + (entries.length === 1 ? " Eintrag" : " Einträge");
      if (!entries.length) {
        archiveList.innerHTML = '<p class="archive-empty">Noch keine Archiv-Einträge vorhanden.</p>';
        return;
      }
      const pointer = currentArchiveId();
      archiveList.innerHTML = entries.map(function(entry) {
        return '<article class="archive-item' + (entry.id === pointer ? ' archive-item-current' : '') + '" data-archive-id="' + escapeHtml(entry.id) + '">' +
          '<div><div class="archive-title">' + escapeHtml(archiveTitle(entry)) + '</div><div class="archive-meta">' + escapeHtml(archiveMeta(entry)) + '</div></div>' +
          '<button type="button" class="archive-open-btn" data-archive-open="' + escapeHtml(entry.id) + '">Öffnen</button>' +
          '<button type="button" class="archive-delete-btn" data-archive-delete="' + escapeHtml(entry.id) + '">Löschen</button></article>';
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
      archiveFilterCount.textContent = items.length ? (query ? visible + " von " + items.length + " Einträgen" : items.length + (items.length === 1 ? " Eintrag" : " Einträge")) : "";
    }

    function openArchive() {
      archiveFilter.value = "";
      renderArchiveList();
      archiveOverlay.hidden = false;
      window.setTimeout(function() { archiveFilter.focus(); }, 0);
      setStatus("Archiv wurde geöffnet.");
    }

    function closeArchive() { archiveOverlay.hidden = true; }

    function clearValidationState() {
      form.querySelectorAll(".is-invalid").forEach(function(element) { element.classList.remove("is-invalid"); });
    }

    function validationTargetForRadio(name) {
      if (name === "anlagenart") return document.getElementById("anlagenartChoices");
      if (name === "pruefumfang") return document.getElementById("pruefumfangChoices");
      return form.querySelector('[data-required-radio="' + name + '"]');
    }

    function validateForPdf() {
      clearValidationState();
      const missing = [];
      const textRequirements = [
        ["bauvorhaben", "Bauvorhaben"], ["auftraggeberVertreter", "Auftraggeber/Vertreter"], ["auftragnehmerVertreter", "Auftragnehmer/Vertreter"],
        ["mdp", "Systembetriebsdruck MDP"], ["dichtheitsdruck", "Prüfdruck Dichtheitsprüfung"], ["festigkeitsdruck", "Prüfdruck Festigkeitsprüfung"], ["ort", "Ort"], ["datum", "Datum"]
      ];
      let firstTarget = null;
      textRequirements.forEach(function(item) {
        const element = fieldElement(item[0]);
        const numeric = element && element.type === "number";
        const valid = element && String(element.value || "").trim() && (!numeric || Number(element.value) > 0);
        if (valid) return;
        missing.push(item[1]);
        if (element) element.classList.add("is-invalid");
        if (!firstTarget) firstTarget = element;
      });
      RADIO_NAMES.forEach(function(name) {
        if (radioValue(name)) return;
        missing.push(REQUIRED_RADIO_LABELS[name]);
        const target = validationTargetForRadio(name);
        if (target) target.classList.add("is-invalid");
        if (!firstTarget) firstTarget = target;
      });
      if (radioValue("pruefumfang") === "Teilabschnitte") {
        const count = fieldElement("teilabschnitte");
        if (!count.value || Number(count.value) < 1 || !Number.isInteger(Number(count.value))) {
          missing.push("Anzahl der Teilabschnitte");
          count.classList.add("is-invalid");
          if (!firstTarget) firstTarget = count;
        }
      }
      if (missing.length) {
        setStatus("Bitte Pflichtfelder prüfen: " + missing.slice(0, 4).join(", ") + (missing.length > 4 ? " …" : "") + ".");
        if (firstTarget && typeof firstTarget.scrollIntoView === "function") firstTarget.scrollIntoView({ behavior: "smooth", block: "center" });
        if (firstTarget && typeof firstTarget.focus === "function") window.setTimeout(function() { firstTarget.focus(); }, 280);
        return false;
      }
      return true;
    }

    function updateConditionalFields() {
      const partial = radioValue("pruefumfang") === "Teilabschnitte";
      teilabschnitteField.hidden = !partial;
      fieldElement("teilabschnitte").disabled = !partial;
      if (!partial) fieldElement("teilabschnitte").classList.remove("is-invalid");
    }

    function clearForm() {
      if (!window.confirm("Formular wirklich leeren?")) return;
      form.reset();
      fieldElement("datum").value = todayIso();
      localStorage.removeItem(CURRENT_ARCHIVE_ID_KEY);
      clearApproval("auftraggeber", false);
      clearApproval("auftragnehmer", false);
      updateConditionalFields();
      autoResizeTextarea(fieldElement("bemerkungen"));
      clearValidationState();
      saveFormNow();
      setStatus("Formular geleert.");
    }

    function loadJsPdfIfNeeded() {
      if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
      return new Promise(function(resolve) {
        const script = document.createElement("script");
        script.src = "vendor/jspdf.umd.min.js";
        script.onload = function() { resolve(window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : null); };
        script.onerror = function() { resolve(null); };
        document.head.appendChild(script);
      });
    }

    function pdfValue(value) {
      const text = String(value || "").trim();
      return text || "-";
    }

    async function exportPdf() {
      if (!validateForPdf()) return;
      const JsPdf = await loadJsPdfIfNeeded();
      if (!JsPdf) { setStatus("PDF-Export konnte nicht erstellt werden."); return; }
      const pdfButton = document.getElementById("pdfBtn");
      const oldText = pdfButton.textContent;
      pdfButton.disabled = true;
      pdfButton.textContent = "PDF wird erstellt...";
      document.body.classList.add("generating-pdf");
      try {
        const data = collectData();
        const fields = data.fields;
        const doc = new JsPdf({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        doc.__fsmobileCustomerNumberPdfTextSeen = true;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 12;
        const contentWidth = pageWidth - margin * 2;
        const pageBottom = pageHeight - 18;
        const lineHeight = 4.25;
        let y = 0;

        function drawHeader(continued) {
          doc.setFillColor(235, 0, 69);
          doc.rect(margin, 24, contentWidth, 10, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          doc.text(continued ? "Druckprüfung DIN 14462 (Fortsetzung)" : "Druckprüfung DIN 14462", pageWidth / 2, 30.8, { align: "center" });
          doc.setTextColor(28, 28, 30);
          y = 40;
        }

        function addPage() { doc.addPage(); drawHeader(true); }
        function ensureSpace(height) { if (y + height > pageBottom) addPage(); }

        function section(title) {
          ensureSpace(11);
          doc.setFillColor(255, 180, 71);
          doc.setDrawColor(255, 180, 71);
          doc.rect(margin, y, contentWidth, 7, "FD");
          doc.setTextColor(28, 28, 30);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.8);
          doc.text(title, margin + 2, y + 4.8);
          y += 9;
        }

        function textLines(value, width, size) {
          doc.setFontSize(size || 8.6);
          const lines = doc.splitTextToSize(pdfValue(value), width);
          return Array.isArray(lines) && lines.length ? lines : ["-"];
        }

        function keyValue(label, value, options) {
          const opts = options || {};
          const lines = textLines(value, contentWidth - 6, opts.fontSize || 8.7);
          const height = Math.max(opts.minHeight || 12, 7 + lines.length * lineHeight);
          ensureSpace(height + 1.5);
          doc.setFillColor(247, 247, 250);
          doc.setDrawColor(220, 221, 226);
          doc.rect(margin, y, contentWidth, height, "FD");
          doc.setTextColor(101, 101, 108);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.7);
          doc.text(label, margin + 2, y + 4.1);
          doc.setTextColor(28, 28, 30);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(opts.fontSize || 8.7);
          doc.text(lines, margin + 2, y + 8.2);
          y += height + 1.5;
        }

        function pair(left, right) {
          const gap = 2;
          const width = (contentWidth - gap) / 2;
          const leftLines = textLines(left.value, width - 5, 8.5);
          const rightLines = textLines(right.value, width - 5, 8.5);
          const height = Math.max(12, 7 + Math.max(leftLines.length, rightLines.length) * lineHeight);
          ensureSpace(height + 1.5);
          [left, right].forEach(function(item, index) {
            const x = margin + index * (width + gap);
            const lines = index === 0 ? leftLines : rightLines;
            doc.setFillColor(247, 247, 250);
            doc.setDrawColor(220, 221, 226);
            doc.rect(x, y, width, height, "FD");
            doc.setTextColor(101, 101, 108);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(6.7);
            doc.text(item.label, x + 2, y + 4.1);
            doc.setTextColor(28, 28, 30);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.text(lines, x + 2, y + 8.2);
          });
          y += height + 1.5;
        }

        function choiceRow(label, value, tone) {
          const labelWidth = contentWidth - 34;
          const lines = textLines(label, labelWidth - 4, 8.2);
          const height = Math.max(11, 4.5 + lines.length * lineHeight);
          ensureSpace(height + 1.2);
          doc.setFillColor(247, 247, 250);
          doc.setDrawColor(220, 221, 226);
          doc.rect(margin, y, contentWidth, height, "FD");
          doc.setTextColor(28, 28, 30);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.2);
          doc.text(lines, margin + 2, y + 5.1);
          if (tone === "good") doc.setTextColor(22, 125, 55);
          else if (tone === "bad") doc.setTextColor(196, 37, 30);
          else doc.setTextColor(101, 101, 108);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.text(pdfValue(value), margin + contentWidth - 2, y + 5.1, { align: "right" });
          doc.setTextColor(28, 28, 30);
          y += height + 1.2;
        }

        function notice(value) {
          const lines = textLines(value, contentWidth - 6, 8.1);
          const maxLines = Math.max(1, Math.floor((pageBottom - y - 8) / lineHeight));
          let offset = 0;
          while (offset < lines.length) {
            if (y + 12 > pageBottom) addPage();
            const available = Math.max(1, Math.floor((pageBottom - y - 8) / lineHeight));
            const chunk = lines.slice(offset, offset + Math.min(maxLines, available));
            const height = 5 + chunk.length * lineHeight;
            doc.setFillColor(252, 244, 235);
            doc.setDrawColor(255, 180, 71);
            doc.rect(margin, y, contentWidth, height, "FD");
            doc.setTextColor(28, 28, 30);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.1);
            doc.text(chunk, margin + 3, y + 5.1);
            y += height + 1.5;
            offset += chunk.length;
            if (offset < lines.length) addPage();
          }
        }

        function signatureBlock() {
          ensureSpace(51);
          const gap = 3;
          const width = (contentWidth - gap) / 2;
          const items = [
            { label: "Auftraggeber/Vertreter", dataUrl: data.approvals.auftraggeber },
            { label: "Auftragnehmer/Vertreter", dataUrl: data.approvals.auftragnehmer }
          ];
          items.forEach(function(item, index) {
            const x = margin + index * (width + gap);
            doc.setFillColor(247, 247, 250);
            doc.setDrawColor(220, 221, 226);
            doc.rect(x, y, width, 43, "FD");
            doc.setTextColor(101, 101, 108);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.2);
            doc.text(item.label, x + 2, y + 5);
            if (item.dataUrl) {
              try { doc.addImage(item.dataUrl, "PNG", x + 3, y + 8, width - 6, 28, undefined, "SLOW"); }
              catch (error) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.text("Unterschrift konnte nicht eingebettet werden.", x + 3, y + 17);
              }
            } else {
              doc.setTextColor(130, 130, 136);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(7.5);
              doc.text("Keine Unterschrift erfasst", x + width / 2, y + 23, { align: "center" });
            }
            doc.setDrawColor(130, 130, 136);
            doc.line(x + 4, y + 37, x + width - 4, y + 37);
            doc.setTextColor(101, 101, 108);
            doc.setFontSize(6.5);
            doc.text("Unterschrift " + item.label, x + width / 2, y + 41, { align: "center" });
          });
          y += 45;
        }

        drawHeader(false);
        section("Allgemeine Angaben");
        pair({ label: "Anlagen Nr.", value: fields.anlagenNr }, { label: "Kunden Nr.", value: fields.kundenNr });
        keyValue("Bauvorhaben", fields.bauvorhaben, { minHeight: 14 });
        pair({ label: "Auftraggeber/Vertreter", value: fields.auftraggeberVertreter }, { label: "Auftragnehmer/Vertreter", value: fields.auftragnehmerVertreter });

        section("Anforderung gemäß DIN 14462");
        notice(NORM_TEXT);

        section("Anlagenart");
        keyValue("Ausgewählte Anlagenart", fields.anlagenart, { minHeight: 12 });
        keyValue("Prüfanforderung", PLANT_DESCRIPTIONS[fields.anlagenart] || "-", { minHeight: 18, fontSize: 8.2 });

        section("Prüf- und Anlagenangaben");
        pair({ label: "Höchster Systembetriebsdruck MDP", value: pdfValue(fields.mdp) + " MPa" }, { label: "Prüfumfang", value: fields.pruefumfang });
        if (fields.pruefumfang === "Teilabschnitte") keyValue("Anzahl der Teilabschnitte (Erhöhung der Prüfsicherheit)", fields.teilabschnitte, { minHeight: 12 });

        section("Prüfvoraussetzungen");
        choiceRow("Alle Leitungen und erforderlichen Armaturen sind verbaut; nicht geprüfte Teilabschnitte waren verschlossen.", fields.leitungenArmaturen, fields.leitungenArmaturen === "Ja" ? "good" : "bad");
        choiceRow("Die Löschwasseranlage wurde mit sauberem Trinkwasser befüllt.", fields.trinkwasser, fields.trinkwasser === "Ja" ? "good" : "bad");
        choiceRow("Das Rohrleitungssystem wurde entlüftet.", fields.entlueftet, fields.entlueftet === "Ja" ? "good" : "bad");
        notice(TEMPERATURE_TEXT);
        choiceRow("Temperaturausgleich erforderlich.", fields.temperaturausgleichErforderlich, "neutral");
        choiceRow("Temperaturausgleich wurde durchgeführt.", fields.temperaturausgleichDurchgefuehrt, fields.temperaturausgleichDurchgefuehrt === "Ja" ? "good" : "bad");
        choiceRow("Prüfung durchgeführt, bevor die Löschwasserleitung verdeckt wurde.", fields.vorVerdeckung, fields.vorVerdeckung === "Ja" ? "good" : "bad");
        choiceRow("Nachweis über die Eignung des Rohrleitungsmaterials gemäß DIN 14462 Tabelle 1 liegt vor.", fields.materialnachweis, fields.materialnachweis === "Ja" ? "good" : "bad");

        section("Dichtheitsprüfung");
        pair({ label: "Prüfdruck", value: pdfValue(fields.dichtheitsdruck) + " MPa" }, { label: "Prüfzeit", value: "10 Minuten" });
        choiceRow("Druckabfall nach Ablauf der Prüfzeit festgestellt.", fields.dichtheitspruefungDruckabfall, fields.dichtheitspruefungDruckabfall === "Nein" ? "good" : "bad");

        section("Festigkeitsprüfung");
        pair({ label: "Prüfdruck", value: pdfValue(fields.festigkeitsdruck) + " MPa" }, { label: "Prüfzeit", value: "2 Minuten" });
        choiceRow("Druckabfall nach Ablauf der Prüfzeit festgestellt.", fields.festigkeitspruefungDruckabfall, fields.festigkeitspruefungDruckabfall === "Nein" ? "good" : "bad");

        section("Prüfergebnis");
        choiceRow("Das Rohrleitungssystem wurde fachgerecht geprüft und ist dicht.", fields.systemDicht, fields.systemDicht === "Ja" ? "good" : "bad");
        pair({ label: "Ort", value: fields.ort }, { label: "Datum", value: displayDate(fields.datum) });
        keyValue("Bemerkungen", fields.bemerkungen, { minHeight: 14 });

        section("Unterschriften");
        signatureBlock();

        const pageCount = doc.getNumberOfPages();
        for (let page = 1; page <= pageCount; page += 1) {
          doc.setPage(page);
          doc.setDrawColor(209, 209, 214);
          doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
          doc.setTextColor(80, 80, 86);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.2);
          doc.text("FSMobile · Druckprüfung DIN 14462", margin, pageHeight - 7.5);
          doc.text("Seite " + page + " von " + pageCount, pageWidth - margin, pageHeight - 7.5, { align: "right" });
        }

        if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(doc);
        const fileName = window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.pdfFileName === "function"
          ? window.FSMOBILE_STANDARD.pdfFileName(["Pruefbericht", "DIN-14462", firstLine(fields.bauvorhaben) || "Ohne Bauvorhaben", fields.datum || todayIso()], "Pruefbericht_Druckpruefung_DIN_14462")
          : ("Pruefbericht_DIN-14462_" + (firstLine(fields.bauvorhaben) || "Ohne_Bauvorhaben") + "_" + (fields.datum || todayIso()) + ".pdf").replace(/[\\/:*?"<>|\s]+/g, "_");
        doc.save(fileName);
        setStatus("PDF-Export wurde erstellt.");
      } catch (error) {
        console.error("PDF-Export Druckprüfung DIN 14462 fehlgeschlagen.", error);
        setStatus("PDF-Export konnte nicht erstellt werden.");
      } finally {
        document.body.classList.remove("generating-pdf");
        pdfButton.disabled = false;
        pdfButton.textContent = oldText || "PDF";
      }
    }

    setupApprovalPad("auftraggeber", "auftraggeberPad");
    setupApprovalPad("auftragnehmer", "auftragnehmerPad");
    restoreDraft();

    form.addEventListener("input", function(event) {
      if (event.target && event.target.classList) event.target.classList.remove("is-invalid");
      autoResizeTextarea(event.target);
      syncShellMetadata();
      scheduleSave();
    });
    form.addEventListener("change", function(event) {
      if (event.target && event.target.name === "pruefumfang") updateConditionalFields();
      if (event.target && event.target.name) {
        const target = validationTargetForRadio(event.target.name);
        if (target) target.classList.remove("is-invalid");
      }
      syncShellMetadata();
      scheduleSave();
    });
    document.getElementById("archiveSaveBtn").addEventListener("click", saveCurrentFormToArchive);
    document.getElementById("archiveBtn").addEventListener("click", openArchive);
    document.getElementById("archiveCloseBtn").addEventListener("click", closeArchive);
    document.getElementById("clearBtn").addEventListener("click", clearForm);
    document.getElementById("pdfBtn").addEventListener("click", exportPdf);
    document.querySelectorAll("[data-clear-approval]").forEach(function(button) {
      button.addEventListener("click", function() { clearApproval(button.dataset.clearApproval); });
    });
    archiveFilter.addEventListener("input", applyArchiveFilter);
    archiveList.addEventListener("click", function(event) {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.archiveOpen) openArchiveEntry(button.dataset.archiveOpen);
      if (button.dataset.archiveDelete) deleteArchiveEntry(button.dataset.archiveDelete);
    });
    archiveOverlay.addEventListener("click", function(event) { if (event.target === archiveOverlay) closeArchive(); });
    document.addEventListener("keydown", function(event) { if (event.key === "Escape" && !archiveOverlay.hidden) closeArchive(); });
    window.addEventListener("resize", function() {
      window.clearTimeout(window.__druckpruefungResizeTimer);
      window.__druckpruefungResizeTimer = window.setTimeout(function() {
        resizeApprovalPad("auftraggeber", true);
        resizeApprovalPad("auftragnehmer", true);
      }, 120);
    });
    window.addEventListener("beforeunload", saveFormNow);

    window.collectData = collectData;
    window.applyData = applyData;
    window.saveFormNow = saveFormNow;
    window.saveToStorageNow = saveFormNow;
    window.saveCurrentFormToArchive = saveCurrentFormToArchive;
    window.openArchive = openArchive;
    window.closeArchive = closeArchive;
    window.clearForm = clearForm;
    window.exportPdf = exportPdf;
    window.loadJsPdfIfNeeded = loadJsPdfIfNeeded;
  </script>
</body>
</html>`
  };
}());
