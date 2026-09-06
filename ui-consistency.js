/* Shared presentation/interaction adapters. Storage, module APIs and PDF data stay owned by modules. */
(function () {
  'use strict';
  const scriptUrl = new URL(document.currentScript.src);
  const cssUrl = new URL('ui-consistency.css' + scriptUrl.search, scriptUrl).href;
  const modalStack = [];
  const nativeApproval = new WeakSet();
  const sessions = new WeakMap();
  const pendingConfirmation = new WeakSet();
  let serial = 0;
  let shellInvoke = null;
  const visible = el => !!el && !el.hidden && el.getAttribute('aria-hidden') !== 'true' && el.style.display !== 'none' && el.getClientRects().length > 0 && el.ownerDocument.defaultView.getComputedStyle(el).visibility !== 'hidden';
  const text = el => String(el?.textContent || '').replace(/\s+/g, ' ').trim();
  const metadataOrder = Object.freeze({objekt:10,objectInput:10,objektInput:10,anlageInput:20,anlagenNr:20,anlagenNrInput:20,kundenNr:30,kundenNrInput:30,kundenNummer:30,gewerk:40,anlagenstandortInput:50,standort:50,montagestandort:50,name:60,nameInput:60,prueferInput:60,datum:70,dateInput:70});
  function hideToast() {
    const toast = document.getElementById('appToast');
    if (toast) { toast.hidden = true; toast.classList.add('fsmobile-toast-suppressed'); }
  }
  function focusables(root) {
    return [...root.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,[tabindex]')]
      .filter(el => !el.disabled && el.tabIndex >= 0 && !el.closest('[inert]') && visible(el));
  }
  function lockOutside(target) {
    const changed = [];
    for (let node = target; node && node.parentElement; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && !sibling.inert && !['SCRIPT','STYLE','LINK'].includes(sibling.tagName)) {
          sibling.inert = true; changed.push(sibling);
        }
      }
      if (node.parentElement === target.ownerDocument.body) break;
    }
    return () => changed.forEach(el => { el.inert = false; });
  }
  function bindDialog(overlay, dialog, onClose, initial) {
    if (overlay.__fsmobileDialogBinding) return overlay.__fsmobileDialogBinding;
    const win = overlay.ownerDocument.defaultView, doc = overlay.ownerDocument;
    const listeners = new win.AbortController();
    let active = false, restore = null, restoreParent = null, unlock = null, unlockParent = null, backdrop = null, host = null;
    overlay.classList.add('fsmobile-dialog-overlay');
    dialog.classList.add('fsmobile-dialog');
    dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true'); dialog.tabIndex = -1;
    const heading = dialog.querySelector('h2');
    if (heading) { heading.id ||= 'fsmobileDialogTitle-' + (++serial); dialog.setAttribute('aria-labelledby', heading.id); }
    function focusFirst() { (initial?.() || focusables(dialog)[0] || dialog).focus({preventScroll:true}); }
    const binding = {
      dialog, overlay, win, focusFirst,
      sync() {
        const next = visible(overlay);
        if (next === active) return;
        active = next;
        if (active) {
          restore = doc.activeElement; restoreParent = win !== window ? document.activeElement : null; hideToast();
          unlock = lockOutside(overlay);
          if (win !== window) {
            const frame = win.frameElement;
            unlockParent = lockOutside(frame);
            backdrop = document.createElement('div'); backdrop.className = 'fsmobile-frame-backdrop'; backdrop.setAttribute('aria-hidden','true'); document.body.append(backdrop);
            host = frame.parentElement; host.classList.add('fsmobile-frame-modal-host');
          }
          modalStack.push(binding); focusFirst();
        } else {
          const index = modalStack.indexOf(binding); if (index >= 0) modalStack.splice(index,1);
          unlock?.(); unlockParent?.(); backdrop?.remove(); host?.classList.remove('fsmobile-frame-modal-host');
          unlock = unlockParent = backdrop = host = null;
          const parentTrigger = win !== window && document.querySelector('#moduleActionBar [data-action-key=archive]');
          if (modalStack.length) modalStack.at(-1).focusFirst();
          else if (parentTrigger && visible(parentTrigger) && !parentTrigger.closest('[inert]')) parentTrigger.focus({preventScroll:true});
          else if (restoreParent?.isConnected && !['IFRAME','BODY','HTML'].includes(restoreParent.tagName) && !restoreParent.closest('[inert]')) restoreParent.focus({preventScroll:true});
          else if (restore?.isConnected && restore !== doc.body && visible(restore) && !restore.closest('[inert]')) restore.focus({preventScroll:true});
          else document.querySelector('#moduleActionBar [data-action-key=archive],#menuOptionsButton')?.focus({preventScroll:true});
        }
      },
      close() { onClose?.(); binding.sync(); },
      dispose() { overlay.hidden = true; binding.sync(); observer.disconnect(); listeners.abort(); }
    };
    const observer = new win.MutationObserver(() => binding.sync());
    observer.observe(overlay,{attributes:true,attributeFilter:['hidden','class','style','aria-hidden']});
    doc.addEventListener('keydown', e => {
      if (modalStack.at(-1) !== binding) return;
      if (e.key === 'Tab') {
        e.preventDefault(); e.stopImmediatePropagation();
        const list = focusables(dialog), index = list.indexOf(doc.activeElement);
        (list.length ? list[(index + (e.shiftKey ? -1 : 1) + list.length) % list.length] : dialog).focus({preventScroll:true});
      } else if (e.key === 'Escape') {
        // Options owns its nested backup/delete cancellation before closing the outer dialog.
        if (overlay.id === 'optionsOverlay' && [...doc.querySelectorAll('#archiveDeleteConfirm, #archiveBackupImportActions')].some(visible)) return;
        e.preventDefault(); e.stopImmediatePropagation(); binding.close();
      }
    },{capture:true,signal:listeners.signal});
    doc.addEventListener('focusin', e => {
      if (modalStack.at(-1) === binding && !dialog.contains(e.target)) focusFirst();
    },{capture:true,signal:listeners.signal});
    win.addEventListener('pagehide', () => binding.dispose(),{once:true});
    overlay.__fsmobileDialogBinding = binding; binding.sync(); return binding;
  }
  document.addEventListener('focusin', e => {
    const active = modalStack.at(-1);
    if (active && active.win !== window && e.target !== active.win.frameElement) active.focusFirst();
  },true);
  function createDialog(title, compact = true) {
    const overlay = document.createElement('section'); overlay.hidden = true; overlay.className = 'fsmobile-dialog-overlay'; overlay.style.display = 'flex';
    const dialog = document.createElement('div'); dialog.className = 'fsmobile-dialog' + (compact ? ' fsmobile-dialog-compact' : '');
    const header = document.createElement('header'); header.className = 'fsmobile-dialog-header';
    const heading = document.createElement('h2'); heading.textContent = title;
    const close = document.createElement('button'); close.type = 'button'; close.className = 'fsmobile-dialog-close'; close.textContent = '×'; close.setAttribute('aria-label','Dialog schließen');
    const body = document.createElement('div'); body.className = 'fsmobile-dialog-body';
    const footer = document.createElement('footer'); footer.className = 'fsmobile-dialog-footer';
    header.append(heading,close); dialog.append(header,body,footer); overlay.append(dialog); document.body.append(overlay);
    let cancel = () => remove();
    const binding = bindDialog(overlay,dialog,() => cancel(),() => footer.querySelector('[data-tone=neutral]'));
    function remove() { binding.dispose(); overlay.remove(); }
    function button(label,tone,handler) { const el = document.createElement('button'); el.type='button'; el.textContent=label; el.dataset.tone=tone; el.addEventListener('click',handler); footer.append(el); return el; }
    close.addEventListener('click',() => cancel());
    overlay.addEventListener('click',e => { if(e.target === overlay) cancel(); });
    return {overlay,dialog,body,footer,heading,button,remove,setCancel(fn){cancel=fn;},show(){overlay.hidden=false;binding.sync();}};
  }
  function confirmAction(message, title = 'Aktion bestätigen', label = 'Löschen') {
    return new Promise(resolve => {
      const ui = createDialog(title), description = document.createElement('p'); description.textContent = message; ui.body.append(description);
      let resolved = false;
      const finish = ok => { if(resolved)return; resolved=true; ui.remove();resolve(ok); };
      ui.button('Abbrechen','neutral',() => finish(false)); ui.button(label,'delete',() => finish(true)); ui.setCancel(() => finish(false)); ui.show();
    });
  }
  function withConfirmation(win, invoke) {
    nativeApproval.add(win);
    try { return invoke(); } finally { nativeApproval.delete(win); }
  }
  function alertMessage(message, title='Hinweis') {
    const ui=createDialog(title), p=document.createElement('p');p.textContent=message;ui.body.append(p);ui.button('Schließen','neutral',ui.remove);ui.show();
  }
  function decorateModule(win) {
    const doc=win.document;
    if (!doc.body || doc.__fsmobileConsistentUi) return;
    doc.__fsmobileConsistentUi = true; doc.documentElement.id ||= 'fsmobileUiRoot';
    const css=doc.createElement('link');css.rel='stylesheet';css.href=cssUrl;doc.head.append(css);
    const oldConfirm=win.confirm.bind(win);
    win.confirm=message => nativeApproval.has(win) ? true : oldConfirm(message);
    win.alert=message => {
      const session=sessions.get(win), value=String(message);
      if(session?.state==='cancelled' && session.transaction?.cancelled && !session.transaction.delivered && /pdf|export/i.test(value))return;
      if(session?.state==='running')failExport(session,value);else alertMessage(value);
    };
    let pending=false;
    function refresh() {
      pending=false;
      doc.querySelectorAll('button').forEach(button => {
        if(button.closest('.archive-dialog,.pdf-render-wrapper'))return;
        const label=text(button);
        const role=/löschen|entfernen/i.test(label)?'delete':/duplizieren/i.test(label)?'copy':/hinzufügen|neue zeile/i.test(label)?'add':'';
        if(role && button.dataset.fsmobileAction!==role)button.dataset.fsmobileAction=role;
      });
      doc.querySelectorAll('.button-area,.button-row,.table-actions,.actions').forEach(row => {
        if([...row.children].some(el=>el.matches('button[data-fsmobile-action=add],button[data-fsmobile-action=copy]')))row.classList.add('fsmobile-row-actions');
      });
      const metadataGroups=new Set(doc.querySelectorAll('.header-row,.header-grid,.info-grid,.fsmobile-portrait-assignment'));
      ['objekt','objectInput','objektInput'].forEach(id=>{const field=doc.getElementById(id);const group=field?.closest('.grid,.form-grid');if(group)metadataGroups.add(group);});
      metadataGroups.forEach(row => {
        if(row.closest('.archive-dialog,.pdf-render-wrapper') || row.querySelectorAll('input,textarea,select').length<2)return;
        row.classList.add('fsmobile-meta-grid');
        [...row.children].forEach(field=>{const input=field.matches('input,textarea,select')?field:field.querySelector('input,textarea,select');if(!input)return;if(/^(objekt|objectInput|objektInput|object)$/i.test(input.id||input.name))field.classList.add('fsmobile-meta-object');field.style.setProperty('--fsmobile-meta-order',String(metadataOrder[input.id]||45));});
      });
      doc.querySelectorAll('.archive-overlay').forEach(overlay=>{
        const dialog=overlay.querySelector('.archive-dialog');if(!dialog)return;
        const close=()=>{const button=dialog.querySelector('.archive-close-btn,button[aria-label*=schließen]');if(button)withConfirmation(win,()=>button.click());else if(typeof win.closeArchive==='function')win.closeArchive();};
        bindDialog(overlay,dialog,close,()=>dialog.querySelector('.archive-filter-input'));
        dialog.querySelectorAll('.archive-title,.archive-detail-object').forEach(title=>{
          if(title.dataset.fsmobileExpanded || text(title).length<100)return;
          title.dataset.fsmobileExpanded='false';title.classList.add('fsmobile-archive-title-collapsed');
          const more=doc.createElement('button');more.type='button';more.className='fsmobile-archive-expand';more.textContent='Mehr anzeigen';more.setAttribute('aria-expanded','false');
          more.addEventListener('click',()=>{const open=title.dataset.fsmobileExpanded!=='true';title.dataset.fsmobileExpanded=String(open);title.classList.toggle('fsmobile-archive-title-collapsed',!open);more.textContent=open?'Weniger anzeigen':'Mehr anzeigen';more.setAttribute('aria-expanded',String(open));});title.after(more);
        });
      });
      alignLabels();
    }
    function alignLabels() {
      const groups=doc.querySelectorAll('.fsmobile-meta-grid,.grid,.form-grid');
      const labels=new Set();groups.forEach(group=>[...group.children].forEach(field=>{const label=field.querySelector?.(':scope > label');if(label)labels.add(label);}));
      labels.forEach(label=>{label.classList.add('fsmobile-aligned-label');label.style.removeProperty('--fsmobile-label-height');});
      groups.forEach(group=>{
        const rows=new Map();
        [...group.children].forEach(field=>{const label=field.querySelector?.(':scope > label');if(!label||!visible(field))return;const y=Math.round(field.getBoundingClientRect().top);if(!rows.has(y))rows.set(y,[]);rows.get(y).push(label);});
        rows.forEach(row=>{if(row.length<2)return;const h=Math.max(...row.map(label=>label.getBoundingClientRect().height));row.forEach(label=>label.style.setProperty('--fsmobile-label-height',h+'px'));});
      });
    }
    const schedule=()=>{if(!pending){pending=true;win.requestAnimationFrame(refresh);}};
    let labelsPending=false;
    const scheduleLabels=()=>{if(!labelsPending){labelsPending=true;win.requestAnimationFrame(()=>{labelsPending=false;alignLabels();});}};
    const observer=new win.MutationObserver(records=>{
      if(records.some(record=>!record.target.closest?.('#archiveStatus,.archive-status,[role=status],.fsmobile-dialog-status')))schedule();
    });observer.observe(doc.body,{childList:true,subtree:true});
    // Label wrapping changes with layout or structural updates, not typed values.
    // Avoid invalidating the whole form layout on every table-cell change.
    win.addEventListener('resize',scheduleLabels);css.addEventListener('load',schedule);
    // Follow the visual metadata order without changing index-based storage/PDF bindings.
    doc.addEventListener('keydown',e=>{
      if(e.key!=='Tab'||modalStack.length)return;
      const group=e.target.closest?.('.fsmobile-meta-grid');if(!group)return;
      const ordered=focusables(group).sort((a,b)=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.abs(x.top-y.top)>1?x.top-y.top:x.left-y.left;});
      const index=ordered.indexOf(e.target),next=ordered[index+(e.shiftKey?-1:1)];
      if(index<0)return;
      if(next){e.preventDefault();next.focus();}
      else {const all=focusables(doc.body),indices=ordered.map(el=>all.indexOf(el));const outside=all[(e.shiftKey?Math.min(...indices):Math.max(...indices))+(e.shiftKey?-1:1)];if(outside){e.preventDefault();outside.focus();}}
    });
    win.addEventListener('click',async e=>{
      const button=e.target.closest?.('button');if(!button||button.disabled||nativeApproval.has(win))return;
      const label=text(button);
      if(button.matches('.archive-close-btn')){
        const binding=button.closest('.archive-overlay')?.__fsmobileDialogBinding;
        if(binding){e.preventDefault();e.stopImmediatePropagation();binding.close();return;}
      }
      const isPdf=/^(PDF|PDF Export)$/.test(label)||/^(pdfButton|pdfBtn)$/.test(button.id);
      if(isPdf && shellInvoke){e.preventDefault();e.stopImmediatePropagation();shellInvoke('pdf');return;}
      const clear=/^Leeren$/.test(label)||/^(clearBtn|clearButton)$/.test(button.id);
      if(!clear && !/löschen|entfernen/i.test(label))return;
      e.preventDefault();e.stopImmediatePropagation();
      if(pendingConfirmation.has(button))return;
      pendingConfirmation.add(button);
      const archive=button.closest('.archive-item');
      const message=clear?'Die aktuellen Formulareingaben werden geleert. Andere Archiveinträge bleiben erhalten.':archive?'Diesen Archiveintrag löschen? '+text(archive.querySelector('.archive-title')):'„'+label+'“ ausführen?';
      try { if(await confirmAction(message,clear?'Formular leeren?':archive?'Archiveintrag löschen?':'Eintrag löschen?',clear?'Leeren':'Löschen'))withConfirmation(win,()=>button.click()); }
      finally { pendingConfirmation.delete(button); }
    },true);
    refresh();
    win.addEventListener('pagehide',()=>{observer.disconnect();sessions.get(win)?.cancelAction?.();},{once:true});
  }
  function suggestedName(win,id) {
    try { if(typeof win.FSMOBILE_REPORT_EXPORT_FILE_NAME==='function')return win.FSMOBILE_REPORT_EXPORT_FILE_NAME(); if(typeof win.getPdfFileName==='function')return win.getPdfFileName(); }catch{}
    const field=win.document.querySelector('#objekt,#objectInput,[name=objekt]');
    const part=window.FSMOBILE_STANDARD?.fileSegment(field?.value || win.FSMOBILE_MODULE_TITLE || id,'FSMobile') || 'FSMobile';
    const suffix={'aufmass-akku':'_Aufmass_Akku','aufmass-einsteckschloss':'_Aufmass_Einsteckschloss','aufmass-tueren':'_Aufmass_Tueren','aufmass-brandabschottungen':'_Aufmass_Brandabschottungen'}[id]||'';
    return part+suffix+(/^pb-/.test(id)?'.zip':'.pdf');
  }
  function failExport(session,message) {
    if(session.state==='cancelled'||session.state==='ready')return;
    session.state='error';session.status.textContent=message||'Die Datei konnte nicht erstellt werden.';session.status.dataset.tone='error';
    if(session.transaction)session.transaction.cancelled=true;
    session.create.disabled=false;session.create.textContent='Erneut versuchen';
  }
  function receiveExport(win, transaction, blob, name) {
    if(!transaction)return false;
    if(transaction.delivered||transaction.cancelled){if(win.FSMOBILE_UI_EXPORT_TRANSACTION===transaction)win.FSMOBILE_UI_EXPORT_TRANSACTION=null;return true;}
    transaction.delivered=true;
    if(win.FSMOBILE_UI_EXPORT_TRANSACTION===transaction)win.FSMOBILE_UI_EXPORT_TRANSACTION=null;
    const session=sessions.get(win);
    if(!session || session.transaction!==transaction || session.state==='cancelled')return true;
    session.state='ready';session.blob=blob;session.fileName=session.name.value!==session.suggestion?session.name.value:name;
    const extension=/^pb-/.test(session.id)?'.zip':'.pdf';
    session.fileName=(session.fileName||name).replace(/[\\/:*?"<>|]/g,'_').replace(/\.(pdf|zip)$/i,'')+extension;
    session.name.value=session.fileName;session.status.textContent='Datei erstellt – zur Ausgabe bereit.';session.status.dataset.tone='success';
    session.create.hidden=true;session.output.hidden=false;session.cancel.textContent='Schließen';return true;
  }
  async function exportDialog(win,id,invoke) {
    const previous=sessions.get(win);
    if(previous && visible(previous.ui.overlay)) { previous.ui.dialog.focus(); return; }
    const ui=createDialog('PDF exportieren');ui.overlay.id='fsmobileExportDialog';
    const description=document.createElement('p');description.textContent=win.FSMOBILE_MODULE_TITLE||id;
    const format=document.createElement('p');format.id='fsmobileExportFormat';format.textContent=/^pb-/.test(id)?'Format: PDF mit Formulardaten (ZIP)':'Format: PDF';
    const label=document.createElement('label');label.htmlFor='fsmobileExportName';label.textContent='Dateiname';
    const name=document.createElement('input');name.id='fsmobileExportName';name.type='text';name.value=suggestedName(win,id);
    const hint=document.createElement('p');hint.textContent='Der automatische Name folgt den Berichtsdaten. Du kannst einen eigenen Namen eingeben.';
    const status=document.createElement('p');status.id='fsmobileExportStatus';status.className='fsmobile-dialog-status';status.setAttribute('role','status');status.textContent='Bereit zur Erstellung.';
    ui.body.append(description,format,label,name,hint,status);
    const session={ui,win,id,name,status,suggestion:name.value,state:'idle'};sessions.set(win,session);
    const cancel=()=>{ if(session.transaction){session.transaction.cancelled=true;if(session.state!=='running'&&win.FSMOBILE_UI_EXPORT_TRANSACTION===session.transaction)win.FSMOBILE_UI_EXPORT_TRANSACTION=null;}session.state='cancelled';session.blob=null;ui.remove();hideToast(); };
    session.cancelAction=cancel;session.cancel=ui.button('Abbrechen','neutral',cancel);ui.setCancel(cancel);
    session.create=ui.button('Erstellen','open',async()=>{
      if(session.state==='running')return;
      session.state='running';session.create.disabled=true;session.create.textContent='Wird erstellt …';status.textContent='Datei wird erstellt …';status.dataset.tone='info';
      const transaction={id:++serial,cancelled:false,delivered:false};session.transaction=transaction;win.FSMOBILE_UI_EXPORT_TRANSACTION=transaction;
      try {
        const result=withConfirmation(win,invoke);if(result?.then)await result;
        win.setTimeout(()=>{
          if(session.state!=='running'||session.transaction!==transaction||transaction.delivered)return;
          const invalid=win.document.querySelector(':invalid,.is-invalid,[aria-invalid=true]');
          const message=text(win.document.querySelector('#archiveStatus,.archive-status,[role=alert]'));
          if(invalid || /bitte|fehlt|erforderlich|konnte nicht|ungültig/i.test(message)) {
            failExport(session,message||'Bitte die erforderlichen Angaben im Formular ergänzen.');
            if(invalid&&!session.fieldButton)session.fieldButton=ui.button('Zum Feld','neutral',()=>{cancel();invalid.scrollIntoView({block:'center'});invalid.focus();});
          }
        },350);
        win.setTimeout(()=>{if(session.state==='running'&&session.transaction===transaction) {transaction.cancelled=true;failExport(session,'Die Erstellung wurde nicht abgeschlossen. Bitte erneut versuchen.');}},180000);
      }catch(error){transaction.cancelled=true;if(session.transaction===transaction)failExport(session,'Die Datei konnte nicht erstellt werden. '+(error?.message||''));}
    });
    session.output=ui.button('Datei ausgeben','open',()=>{
      if(!session.blob || session.output.disabled)return;
      const extension=/^pb-/.test(session.id)?'.zip':'.pdf';
      session.fileName=(session.name.value.trim()||session.fileName).replace(/[\\/:*?"<>|]/g,'_').replace(/\.(pdf|zip)$/i,'')+extension;
      session.name.value=session.fileName;
      session.output.disabled=true;
      setTimeout(()=>{if(session.state==='ready'){session.output.disabled=false;session.output.textContent='Erneut ausgeben';}},1500);
      const url=URL.createObjectURL(session.blob), a=document.createElement('a');a.href=url;a.download=session.fileName;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
      status.textContent='Datei an den Browser übergeben. Dort kannst du sie öffnen, speichern oder teilen.';status.dataset.tone='info';
    });session.output.hidden=true;ui.show();
  }
  function routeStatus(message,sourceWin) {
    sourceWin?.document.querySelectorAll('.archive-overlay').forEach(overlay=>overlay.__fsmobileDialogBinding?.sync());
    const session=sourceWin&&sessions.get(sourceWin);
    if(session && /pdf|export|datei/i.test(message) && (visible(session.ui.overlay)||(session.state==='cancelled'&&session.transaction?.cancelled&&!session.transaction.delivered&&/pdf|export/i.test(message)))) {
      if(/konnte nicht|fehlgeschlagen/i.test(message))failExport(session,message);
      return true;
    }
    const active=modalStack.at(-1);
    if(active){
      hideToast();
      if(active.win === sourceWin && active.dialog.classList.contains('archive-dialog')) {
        if(/gespeichert|aktualisiert/i.test(message))return true;
        let status=active.dialog.querySelector('.fsmobile-dialog-status');
        if(!status){status=active.win.document.createElement('p');status.className='fsmobile-dialog-status';status.setAttribute('role','status');active.dialog.append(status);}
        if(status.textContent!==message)status.textContent=message;
      }
      return true;
    }
    document.getElementById('appToast')?.classList.remove('fsmobile-toast-suppressed');
    return false;
  }
  function initialize() {
    const options=document.getElementById('optionsOverlay');
    if(options) {
      const dialog=options.querySelector('.options-dialog');dialog.classList.add('fsmobile-dialog-compact');
      bindDialog(options,dialog,()=>document.getElementById('optionsCloseButton').click(),()=>document.getElementById('archiveBackupExportButton'));
    }
    function viewport() { document.documentElement.style.setProperty('--fsmobile-visual-height',(window.visualViewport?.height||innerHeight)+'px'); }
    window.visualViewport?.addEventListener('resize',viewport);viewport();
  }
  window.FSMOBILE_UI=Object.freeze({version:1,installModule:decorateModule,confirm:confirmAction,withConfirmation,exportDialog,receiveExport,routeStatus,hideToast,setActionHandler(fn){shellInvoke=fn;}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
}());
