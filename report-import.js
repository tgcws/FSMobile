/* Coordinates the same local JSON/ZIP import from the menu and report header. */
(function () {
  'use strict';
  window.FSMOBILE_CREATE_REPORT_IMPORT = function (host) {
    let busy = false, lastResult = null;
    const files = window.FSMOBILE_REPORT_FILES;
    const allowed = new Set(host.modules.map(module => module.id));
    const title = id => host.modules.find(module => module.id === id)?.title || id;
    const menuButton = document.getElementById('reportImportButton');
    const fileInput = document.getElementById('reportImportFile');
    const createDialog = (heading, text, id) => {
      const ui = window.FSMOBILE_UI.createDialog(heading);
      ui.overlay.id = id;
      const description = document.createElement('p');
      description.textContent = text;
      ui.body.append(description);
      return ui;
    };
    function choice(heading, text, options, id) {
      return new Promise(resolve => {
        const ui = createDialog(heading, text, id);
        let settled = false;
        const finish = value => { if (settled) return; settled = true; ui.remove(); resolve(value); };
        ui.button('Abbrechen', 'neutral', () => finish(null));
        for (const option of options) {
          const button = ui.button(option.label, option.tone || 'open', () => finish(option.value));
          button.dataset.importChoice = option.value;
        }
        ui.setCancel(() => finish(null));
        ui.show();
      });
    }
    function selectReport(candidates) {
      return new Promise(resolve => {
        const ui = createDialog('Bericht auswählen', 'Die ZIP-Datei enthält mehrere Prüfberichte. Welchen möchtest du öffnen?', 'fsmobileReportImportSelection');
        const label = document.createElement('label'); label.htmlFor = 'fsmobileReportImportCandidate'; label.textContent = 'Prüfbericht';
        const select = document.createElement('select'); select.id = label.htmlFor;
        candidates.forEach((entry, index) => {
          const option = document.createElement('option'); option.value = String(index);
          option.textContent = title(entry.payload.moduleId) + ' – ' + entry.name;
          select.append(option);
        });
        ui.body.append(label, select);
        let settled = false;
        const finish = value => { if (settled) return; settled = true; ui.remove(); resolve(value); };
        ui.button('Abbrechen', 'neutral', () => finish(null));
        ui.button('Bericht öffnen', 'open', () => finish(candidates[Number(select.value)]));
        ui.setCancel(() => finish(null)); ui.show();
      });
    }
    function notice(text) {
      const ui = createDialog('Bericht importieren', text, 'fsmobileReportImportNotice');
      ui.button('Schließen', 'neutral', ui.remove); ui.show();
    }
    async function importFile(file, sourceModule = '') {
      if (!file || busy || !host.unlocked()) return { ok: false, cancelled: true };
      busy = true; menuButton.disabled = true; lastResult = null;
      let progress = null, cancelled = false;
      const showProgress = message => {
        progress?.remove();
        progress = createDialog('Bericht importieren', message, 'fsmobileReportImportProgress');
        progress.dialog.setAttribute('aria-busy', 'true');
        // A partially applied report must finish or roll back before closing.
        progress.setCancel(() => { cancelled = true; });
        progress.show();
      };
      try {
        showProgress('Datei wird gelesen …');
        const candidates = await files.read(file);
        if (cancelled) return lastResult = { ok: false, cancelled: true };
        const supported = candidates.filter(entry => allowed.has(entry.payload.moduleId));
        if (!supported.length) throw new Error('Der Berichtstyp dieser Datei ist in dieser App nicht verfügbar.');
        if (supported.length !== candidates.length) throw new Error('Die ZIP enthält einen unbekannten Berichtstyp. Bitte den gewünschten Bericht einzeln importieren.');
        progress.remove(); progress = null;
        const candidate = supported.length === 1 ? supported[0] : await selectReport(supported);
        if (!candidate) return lastResult = { ok: false, cancelled: true };
        const moduleId = candidate.payload.moduleId;
        if (sourceModule && sourceModule !== moduleId) {
          const answer = await choice('Anderen Prüfbericht öffnen?', 'Diese Datei gehört zu „' + title(moduleId) + '“. Der aktuell geöffnete Bericht bleibt gespeichert.', [{ label: 'Bericht öffnen', value: 'open' }], 'fsmobileReportImportSwitch');
          if (!answer) return lastResult = { ok: false, cancelled: true };
        }
        showProgress('Prüfbericht wird geöffnet …');
        const win = await host.open(moduleId);
        if (cancelled) return lastResult = { ok: false, cancelled: true };
        const transfer = win?.FSMOBILE_REPORT_TRANSFER;
        if (!transfer) throw new Error('Der Prüfbericht konnte nicht für den Import vorbereitet werden.');
        const flushed = host.flush();
        if (!flushed.ok) throw new Error('Der vorhandene Bericht konnte nicht sicher gespeichert werden. Der Import wurde abgebrochen.');
        progress.remove(); progress = null;
        if (transfer.hasData()) {
          const answer = await choice('Vorhandenen Entwurf ersetzen?', 'In „' + title(moduleId) + '“ sind bereits Eingaben vorhanden. Du kannst sie zuerst im Archiv sichern oder den Entwurf ersetzen. Beim Archivieren wird ein passender Archiveintrag wie gewohnt aktualisiert.', [
            { label: 'Entwurf ersetzen', value: 'replace', tone: 'delete' },
            { label: 'Archivieren & importieren', value: 'archive' }
          ], 'fsmobileReportImportConflict');
          if (!answer) return lastResult = { ok: false, cancelled: true };
          if (answer === 'archive') {
            showProgress('Vorhandener Bericht wird im Archiv gesichert …');
            const saved = await transfer.archive();
            if (!saved.ok) {
              host.reload(moduleId);
              throw new Error(saved.restored ? 'Der Bericht konnte nicht im Archiv gesichert werden. Der vorherige Stand bleibt erhalten.' : 'Die Sicherung ist fehlgeschlagen. Bitte den vorhandenen Bericht und Speicher prüfen.');
            }
          }
        }
        showProgress('Berichtsdaten werden übernommen …');
        const result = await transfer.apply(candidate.payload);
        if (!result.ok) {
          host.reload(moduleId);
          throw new Error(result.restored ? 'Import fehlgeschlagen. Der vorherige Bericht wurde wiederhergestellt.' : 'Import fehlgeschlagen. Der vorherige Stand konnte nicht vollständig wiederhergestellt werden. Bitte die gespeicherten Daten prüfen.');
        }
        progress.remove(); progress = null;
        lastResult = { ok: true, moduleId, name: candidate.name };
        host.notify(title(moduleId) + ' importiert.');
        return lastResult;
      } catch (error) {
        progress?.remove(); progress = null;
        lastResult = { ok: false, error: error.message || 'Die Datei konnte nicht importiert werden.' };
        notice(lastResult.error);
        return lastResult;
      } finally {
        progress?.remove(); busy = false; menuButton.disabled = false;
        window.dispatchEvent(new CustomEvent('fsmobile:report-import-finished', { detail: lastResult }));
      }
    }
    menuButton.addEventListener('click', () => { if (!busy && host.unlocked()) fileInput.click(); });
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0]; fileInput.value = '';
      void importFile(file);
    });
    return Object.freeze({ importFile, get busy() { return busy; }, get lastResult() { return lastResult; } });
  };
}());
