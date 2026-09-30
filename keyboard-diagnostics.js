/* Opt-in, memory-only keyboard diagnostics. Never reads field values or typed text. */
(function () {
  'use strict';
  const assetVersion = new URL(document.currentScript.src).searchParams.get('v');
  const limit = 100;
  const navigationKeys = new Set(['Tab','Shift','Control','Alt','Meta','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown','CapsLock','Unidentified','Dead']);
  let session = null;

  function record(run, item) {
    if (session !== run || !run.active) return;
    run.events.push({ ms: Math.round(performance.now() - run.started), ...item });
    if (run.events.length > limit) { run.events.shift(); run.dropped++; }
  }
  function field(run, element, area) {
    if (!element || element.nodeType !== 1) return null;
    // Session-local numbers identify fields without IDs, labels or user content.
    if (!run.elements.has(element)) run.elements.set(element, ++run.serial);
    return {
      n: run.elements.get(element), area, tag: element.tagName,
      ...(element.matches('input,textarea,select') ? { type: element.type, readonly: !!element.readOnly, disabled: !!element.disabled } : {}),
      tabIndex: element.tabIndex, visible: !!element.getClientRects().length,
      inert: !!element.closest('[inert]'), connected: element.isConnected
    };
  }
  function attach(run, win, area) {
    const doc = win.document;
    if (run.documents.has(doc)) return;
    run.documents.add(doc);
    const controller = new win.AbortController();
    run.controllers.add(controller);
    win.addEventListener('pagehide', () => { controller.abort(); run.controllers.delete(controller); }, { once: true, signal: controller.signal });
    const options = { capture: true, passive: true, signal: controller.signal };
    const active = () => field(run, doc.activeElement, area);
    const isTab = e => e.key === 'Tab' || e.code === 'Tab' || e.keyCode === 9;
    for (const type of ['keydown', 'keyup']) win.addEventListener(type, e => {
      const tab = isTab(e), serial = ++run.eventSerial;
      // A printable key and its hardware code are both redacted. InputEvent.data,
      // field values, labels, selection text and storage contents are never read.
      const key = navigationKeys.has(e.key) ? e.key : 'Andere/Zeichen';
      const code = navigationKeys.has(e.code) || /^(Shift|Control|Alt|Meta)(Left|Right)$/.test(e.code) ? e.code : 'Andere/Zeichen';
      record(run, { event: type, serial, key, code, tab, tabKeyCode: e.keyCode === 9, trusted: e.isTrusted,
        composing: e.isComposing, cancelable: e.cancelable, prevented: e.defaultPrevented,
        modifiers: [e.shiftKey, e.ctrlKey, e.altKey, e.metaKey],
        target: field(run, e.target, area), active: active(),
        ...(tab ? { moduleUiInstalled: !!doc.__fsmobileConsistentUi,
          generatingPdf: !!doc.body?.classList.contains('generating-pdf'),
          visibleDialogs: [...doc.querySelectorAll('.fsmobile-dialog-overlay')].filter(el => !el.hidden && el.getClientRects().length).length } : {}) });
      if (tab) {
        // Observe after existing handlers and after WebKit's default action.
        // Do not cancel the event, focus a field, or retry the navigation.
        for (const delay of [0, 100]) {
          const timer = window.setTimeout(() => {
            run.timers.delete(timer);
            record(run, { event: type + (delay ? '-100ms' : '-after'), serial,
              prevented: e.defaultPrevented, active: active(), documentFocused: doc.hasFocus() });
          }, delay);
          run.timers.add(timer);
        }
      }
    }, options);
    for (const type of ['focusin','focusout']) win.addEventListener(type, e => {
      record(run, { event: type, target: field(run, e.target, area), related: field(run, e.relatedTarget, area) });
    }, options);
    for (const type of ['beforeinput','input','compositionstart','compositionend']) win.addEventListener(type, e => {
      record(run, { event: type, target: field(run, e.target, area), composing: !!e.isComposing,
        tabData: e.data === '\t' });
    }, options);
    win.addEventListener('blur', e => {
      if (e.target === win) record(run, { event: 'window-blur', area, active: active() });
    }, options);
    record(run, { event: 'document', area, moduleUiInstalled: !!doc.__fsmobileConsistentUi });
  }
  function attachModule() {
    if (!session?.active) return;
    const frame = document.getElementById('moduleFrame');
    if (frame?.contentDocument) attach(session, frame.contentWindow, 'Formular');
  }
  function stop() {
    if (!session?.active) return;
    session.elapsedMs = Math.round(performance.now() - session.started);
    session.active = false;
    session.controllers.forEach(controller => controller.abort());
    session.controllers.clear();
    session.timers.forEach(timer => window.clearTimeout(timer));
    session.timers.clear();
  }
  function start() {
    stop();
    session = { active: true, started: performance.now(), startedAt: new Date().toISOString(),
      events: [], dropped: 0, controllers: new Set(), documents: new WeakSet(), elements: new WeakMap(),
      timers: new Set(), serial: 0, eventSerial: 0 };
    attach(session, window, 'App'); attachModule();
  }
  function report() {
    if (!session) return '';
    return JSON.stringify({ format: 'FSMobile-Tastaturdiagnose-1', assetVersion,
      userAgent: navigator.userAgent, standalone: !!navigator.standalone || matchMedia('(display-mode: standalone)').matches,
      startedAt: session.startedAt, elapsedMs: session.elapsedMs,
      dropped: session.dropped, events: session.events }, null, 2);
  }
  function show() {
    stop();
    const ui = window.FSMOBILE_UI.createDialog('Tastaturdiagnose');
    ui.dialog.id = 'keyboardDiagnosticsDialog';
    const instructions = document.createElement('p');
    instructions.textContent = 'Diagnose starten, ein Modul öffnen und ein Textfeld antippen. „Test“ schreiben, einmal Tab drücken und „Weiter“ schreiben. Danach zum Menü zurückkehren und Optionen → Tastaturdiagnose öffnen.';
    const privacy = document.createElement('p');
    privacy.textContent = 'Erfasst werden nur Tastatur- und Fokusereignisse. Eingegebene Texte und Berichtsdaten werden nicht aufgezeichnet. Das Protokoll bleibt bis zum Neuladen im Arbeitsspeicher und wird nicht automatisch versendet.';
    const label = document.createElement('label'); label.htmlFor = 'keyboardDiagnosticsReport'; label.textContent = 'Diagnosebericht';
    const output = document.createElement('textarea'); output.id = label.htmlFor; output.readOnly = true;
    output.style.cssText = 'box-sizing:border-box;width:100%;min-height:120px;max-height:22vh;font:12px monospace;';
    output.value = report(); output.hidden = label.hidden = !session;
    const status = document.createElement('p'); status.setAttribute('role','status');
    status.textContent = session ? 'Aufzeichnung beendet. Bitte den Bericht zur Auswertung kopieren.' : 'Die Diagnose ist ausgeschaltet.';
    ui.body.append(instructions, privacy, label, output, status);
    ui.button(session ? 'Neu starten' : 'Diagnose starten', 'primary', () => {
      ui.remove();
      document.getElementById('optionsCloseButton').click();
      start();
    });
    if (session) ui.button('Bericht kopieren','primary',async () => {
      try { await navigator.clipboard.writeText(output.value); status.textContent = 'Bericht kopiert.'; }
      catch (_) { output.focus(); output.select(); status.textContent = 'Bitte den markierten Bericht über „Kopieren“ kopieren.'; }
    });
    ui.button('Schließen','neutral',ui.remove); ui.show();
  }
  function initialize() {
    const actions = document.querySelector('#optionsOverlay .options-actions');
    if (!actions || !window.FSMOBILE_UI) return;
    const button = document.createElement('button'); button.type = 'button';
    button.id = 'keyboardDiagnosticsButton'; button.className = 'options-action-button secondary';
    button.textContent = 'Tastaturdiagnose'; button.addEventListener('click',show); actions.append(button);
    document.getElementById('moduleFrame').addEventListener('load',attachModule);
    window.addEventListener('pagehide',stop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else initialize();
}());
