(function (global) {
  "use strict";

  if (global.FSMOBILE_IMAGE_STORAGE) return;

  const API_VERSION = 1;
  const DATABASE_NAME = "fsmobile-image-storage";
  const DATABASE_VERSION = 1;
  const STORE_NAME = "payloads";
  const SHADOW_PREFIX = "fsmobile-image-shadow-v1:";
  const IMAGE_REF_KEY = "__fsmobileImageRef";
  const IMAGE_DATA_PATTERN = /^data:image\/[a-z0-9.+-]+;base64,/i;
  const activePayloads = new Map();
  let databasePromise = null;
  let latestResult = null;

  function publishResult(result) {
    latestResult = Object.freeze(Object.assign({ at: new Date().toISOString() }, result || {}));
    try {
      global.dispatchEvent(new CustomEvent("fsmobile:image-storage-result", { detail: latestResult }));
    } catch {}
    return latestResult;
  }

  function storageErrorCode(error) {
    const text = String(error && (error.name || error.message) || "");
    if (/quota|full|space/i.test(text)) return "quota-exceeded";
    if (/version/i.test(text)) return "version-error";
    if (/security|denied|private|invalidstate|notallowed/i.test(text)) return "unavailable";
    if (/verification/i.test(text)) return "verification-failed";
    return "write-failed";
  }

  function hashText(value) {
    const text = String(value == null ? "" : value);
    let first = 2166136261;
    let second = 2246822519;
    for (let index = 0; index < text.length; index += 1) {
      const code = text.charCodeAt(index);
      first ^= code;
      first = Math.imul(first, 16777619);
      second ^= code + index;
      second = Math.imul(second, 3266489917);
    }
    return `${(first >>> 0).toString(36)}-${(second >>> 0).toString(36)}-${text.length.toString(36)}`;
  }

  function cloneJson(value) {
    if (typeof value === "undefined") return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function groupKeyFor(moduleId, storageKey) {
    return `${encodeURIComponent(String(moduleId || "unknown"))}::${encodeURIComponent(String(storageKey || ""))}`;
  }

  function shadowKeyFor(moduleId, storageKey) {
    return `${SHADOW_PREFIX}${groupKeyFor(moduleId, storageKey)}`;
  }

  function imageByteLength(dataUrl) {
    const text = String(dataUrl || "");
    const comma = text.indexOf(",");
    const encoded = comma >= 0 ? text.slice(comma + 1) : text;
    const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
    return Math.max(0, Math.floor(encoded.length * 3 / 4) - padding);
  }

  function compactPayload(payload) {
    const images = {};
    const seen = new WeakSet();

    function visit(value) {
      if (typeof value === "string" && IMAGE_DATA_PATTERN.test(value)) {
        const ref = `image-${hashText(value)}`;
        if (Object.prototype.hasOwnProperty.call(images, ref) && images[ref] !== value) {
          throw new Error("Image reference collision");
        }
        images[ref] = value;
        return { [IMAGE_REF_KEY]: ref };
      }
      if (!value || typeof value !== "object") return value;
      if (seen.has(value)) throw new TypeError("Circular image payload");
      seen.add(value);
      const result = Array.isArray(value) ? [] : {};
      Object.keys(value).forEach(key => {
        result[key] = visit(value[key]);
      });
      seen.delete(value);
      return result;
    }

    return { compact: visit(payload), images };
  }

  function payloadImageRefs(payload) {
    const refs = new Set();
    const seen = new WeakSet();
    function visit(value) {
      if (!value || typeof value !== "object") return;
      if (seen.has(value)) return;
      seen.add(value);
      if (!Array.isArray(value) && Object.keys(value).length === 1 && typeof value[IMAGE_REF_KEY] === "string") {
        refs.add(value[IMAGE_REF_KEY]);
        return;
      }
      Object.keys(value).forEach(key => visit(value[key]));
    }
    visit(payload);
    return refs;
  }

  function hydratePayload(payload, images) {
    const seen = new WeakSet();
    function visit(value) {
      if (!value || typeof value !== "object") return value;
      if (seen.has(value)) throw new TypeError("Circular compact payload");
      if (!Array.isArray(value) && Object.keys(value).length === 1 && typeof value[IMAGE_REF_KEY] === "string") {
        const ref = value[IMAGE_REF_KEY];
        if (!Object.prototype.hasOwnProperty.call(images || {}, ref) || !IMAGE_DATA_PATTERN.test(String(images[ref] || ""))) {
          const error = new Error(`Image verification failed for ${ref}`);
          error.name = "StorageVerificationError";
          throw error;
        }
        return images[ref];
      }
      seen.add(value);
      const result = Array.isArray(value) ? [] : {};
      Object.keys(value).forEach(key => {
        result[key] = visit(value[key]);
      });
      seen.delete(value);
      return result;
    }
    return visit(payload);
  }

  function hasImages(payload) {
    try {
      return Object.keys(compactPayload(payload).images).length > 0;
    } catch {
      return false;
    }
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed"));
    });
  }

  function transactionFinished(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted"));
      transaction.onerror = () => reject(transaction.error || new Error("IndexedDB transaction failed"));
    });
  }

  function openDatabase() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        const error = new Error("IndexedDB unavailable");
        error.name = "NotSupportedError";
        reject(error);
        return;
      }
      let settled = false;
      const request = global.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      const timeout = global.setTimeout(() => {
        if (settled) return;
        settled = true;
        try { request.result && request.result.close(); } catch {}
        const error = new Error("IndexedDB open timeout");
        error.name = "InvalidStateError";
        reject(error);
      }, 5000);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: "key" });
          store.createIndex("groupKey", "groupKey", { unique: false });
          store.createIndex("storageKey", "storageKey", { unique: false });
        }
      };
      request.onsuccess = () => {
        if (settled) return;
        settled = true;
        global.clearTimeout(timeout);
        const database = request.result;
        database.onversionchange = () => database.close();
        resolve(database);
      };
      request.onerror = () => {
        if (settled) return;
        settled = true;
        global.clearTimeout(timeout);
        reject(request.error || new Error("IndexedDB open failed"));
      };
      request.onblocked = () => {
        if (settled) return;
        settled = true;
        global.clearTimeout(timeout);
        const error = new Error("IndexedDB upgrade blocked");
        error.name = "InvalidStateError";
        reject(error);
      };
    }).catch(error => {
      databasePromise = null;
      throw error;
    });
    return databasePromise;
  }

  async function readRecord(key) {
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readonly");
    return requestResult(transaction.objectStore(STORE_NAME).get(key));
  }

  async function putRecord(record) {
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(record);
    await transactionFinished(transaction);
  }

  async function allRecords() {
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readonly");
    return requestResult(transaction.objectStore(STORE_NAME).getAll());
  }

  async function deleteRecordKeys(keys) {
    if (!keys.length) return;
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    keys.forEach(key => store.delete(key));
    await transactionFinished(transaction);
  }

  function writeShadowValue(key, value, writer) {
    if (typeof writer === "function") {
      const result = writer(key, value);
      if (result === false || (result && typeof result === "object" && result.ok === false)) return false;
      return global.localStorage.getItem(key) === value;
    }
    global.localStorage.setItem(key, value);
    return global.localStorage.getItem(key) === value;
  }

  function removeShadowValue(key, remover) {
    if (typeof remover === "function") remover(key);
    else global.localStorage.removeItem(key);
  }

  function parseShadow(raw, expectedGroupKey) {
    const value = JSON.parse(String(raw || ""));
    if (!value || value.schemaVersion !== 1 || value.groupKey !== expectedGroupKey || !value.revision || !value.compactPayload) {
      throw new TypeError("Invalid image shadow");
    }
    return value;
  }

  function verifiedRecord(record, shadow) {
    if (!record || record.schemaVersion !== 1 || record.groupKey !== shadow.groupKey || record.revision !== shadow.revision) return false;
    if (!record.images || typeof record.images !== "object" || Array.isArray(record.images)) return false;
    if (record.checksum !== hashText(JSON.stringify(record.images))) return false;
    const refs = payloadImageRefs(shadow.compactPayload);
    return Array.from(refs).every(ref => IMAGE_DATA_PATTERN.test(String(record.images[ref] || "")));
  }

  function publicFailure(error, extra) {
    return Object.assign({
      ok: false,
      code: storageErrorCode(error),
      error: String(error && (error.message || error) || "Storage operation failed"),
      previousValuePreserved: true
    }, extra || {});
  }

  async function cleanupGroupRevisions(groupKey, keepKey) {
    try {
      const records = await allRecords();
      const staleKeys = records.filter(record => record && record.groupKey === groupKey && record.key !== keepKey).map(record => record.key);
      await deleteRecordKeys(staleKeys);
    } catch {}
  }

  async function savePayload(options) {
    const config = options || {};
    const moduleId = String(config.moduleId || "unknown");
    const storageKey = String(config.storageKey || "");
    const groupKey = groupKeyFor(moduleId, storageKey);
    const shadowKey = shadowKeyFor(moduleId, storageKey);
    let prepared;
    try {
      prepared = compactPayload(config.payload);
    } catch (error) {
      return publishResult(publicFailure(error, { code: "serialization-failed", moduleId, storageKey, shadowKey }));
    }
    const revision = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    const recordKey = `${groupKey}|${revision}`;
    const images = prepared.images;
    const record = {
      key: recordKey,
      schemaVersion: 1,
      groupKey,
      revision,
      moduleId,
      storageKey,
      updatedAt: new Date().toISOString(),
      imageCount: Object.keys(images).length,
      bytes: Object.values(images).reduce((sum, image) => sum + imageByteLength(image), 0),
      checksum: hashText(JSON.stringify(images)),
      images
    };
    const shadow = {
      schemaVersion: 1,
      groupKey,
      revision,
      moduleId,
      storageKey,
      updatedAt: record.updatedAt,
      compactPayload: prepared.compact
    };
    try {
      await putRecord(record);
      const copied = await readRecord(recordKey);
      if (!verifiedRecord(copied, shadow) || JSON.stringify(copied.images) !== JSON.stringify(images)) {
        const error = new Error("IndexedDB copy verification failed");
        error.name = "StorageVerificationError";
        throw error;
      }
      const shadowText = JSON.stringify(shadow);
      if (config.expectedShadow && global.localStorage.getItem(shadowKey) !== config.expectedShadow) {
        await deleteRecordKeys([recordKey]);
        return publishResult({ ok: false, code: "stale-write", moduleId, storageKey, shadowKey, previousValuePreserved: true });
      }
      if (!writeShadowValue(shadowKey, shadowText, config.writeShadow)) {
        const error = new Error("Image shadow verification failed");
        error.name = "StorageVerificationError";
        throw error;
      }
      activePayloads.set(groupKey, { revision, refs: new Set(Object.keys(images)) });
      await cleanupGroupRevisions(groupKey, recordKey);
      return publishResult({
        ok: true,
        code: "ok",
        moduleId,
        storageKey,
        shadowKey,
        revision,
        imageCount: record.imageCount,
        bytes: record.bytes,
        verified: true,
        previousValuePreserved: true
      });
    } catch (error) {
      try { await deleteRecordKeys([recordKey]); } catch {}
      return publishResult(publicFailure(error, { moduleId, storageKey, shadowKey }));
    }
  }

  async function loadPayload(options) {
    const config = options || {};
    const moduleId = String(config.moduleId || "unknown");
    const storageKey = String(config.storageKey || "");
    const groupKey = groupKeyFor(moduleId, storageKey);
    const shadowKey = shadowKeyFor(moduleId, storageKey);
    let indexedDbError = null;
    try {
      const rawShadow = global.localStorage.getItem(shadowKey);
      if (rawShadow) {
        const shadow = parseShadow(rawShadow, groupKey);
        const record = await readRecord(`${groupKey}|${shadow.revision}`);
        if (!verifiedRecord(record, shadow)) {
          const error = new Error("IndexedDB payload verification failed");
          error.name = "StorageVerificationError";
          throw error;
        }
        const payload = hydratePayload(shadow.compactPayload, record.images);
        activePayloads.set(groupKey, { revision: shadow.revision, refs: new Set(Object.keys(record.images)) });
        return { ok: true, code: "ok", source: "indexeddb", payload, migrated: false, verified: true };
      }
    } catch (error) {
      indexedDbError = error;
    }

    if (Object.prototype.hasOwnProperty.call(config, "legacyPayload")) {
      const legacyPayload = cloneJson(config.legacyPayload);
      let migration = null;
      if (hasImages(legacyPayload)) {
        migration = await savePayload({
          moduleId,
          storageKey,
          payload: legacyPayload,
          writeShadow: config.writeShadow
        });
      }
      return {
        ok: true,
        code: "ok",
        source: "legacy",
        payload: legacyPayload,
        migrated: Boolean(migration && migration.ok),
        migration,
        fallbackReason: indexedDbError ? storageErrorCode(indexedDbError) : ""
      };
    }

    if (indexedDbError) return publicFailure(indexedDbError, { source: "empty", payload: undefined });
    return { ok: true, code: "ok", source: "empty", payload: undefined, migrated: false };
  }

  function writeShadow(options) {
    const config = options || {};
    const moduleId = String(config.moduleId || "unknown");
    const storageKey = String(config.storageKey || "");
    const groupKey = groupKeyFor(moduleId, storageKey);
    const active = activePayloads.get(groupKey);
    if (!active) return { ok: false, code: "not-ready", previousValuePreserved: true };
    let prepared;
    try {
      prepared = compactPayload(config.payload);
    } catch (error) {
      return publicFailure(error, { code: "serialization-failed" });
    }
    const refs = Object.keys(prepared.images);
    if (!refs.every(ref => active.refs.has(ref))) {
      return { ok: false, code: "not-ready", previousValuePreserved: true };
    }
    const shadowKey = shadowKeyFor(moduleId, storageKey);
    const shadow = {
      schemaVersion: 1,
      groupKey,
      revision: active.revision,
      moduleId,
      storageKey,
      updatedAt: new Date().toISOString(),
      compactPayload: prepared.compact
    };
    try {
      const value = JSON.stringify(shadow);
      if (!writeShadowValue(shadowKey, value, config.writeShadow)) {
        const error = new Error("Image shadow verification failed");
        error.name = "StorageVerificationError";
        throw error;
      }
      if (refs.length < active.refs.size) {
        Promise.resolve().then(() => {
          if (global.localStorage.getItem(shadowKey) !== value) return null;
          return savePayload({
            moduleId,
            storageKey,
            payload: config.payload,
            writeShadow: config.writeShadow,
            expectedShadow: value
          });
        }).catch(() => {});
      }
      return { ok: true, code: "ok", shadowKey, imageCount: refs.length, verified: true };
    } catch (error) {
      return publicFailure(error, { shadowKey });
    }
  }

  async function removePayload(options) {
    const config = options || {};
    const moduleId = String(config.moduleId || "unknown");
    const storageKey = String(config.storageKey || "");
    const groupKey = groupKeyFor(moduleId, storageKey);
    const shadowKey = shadowKeyFor(moduleId, storageKey);
    try {
      const records = await allRecords();
      await deleteRecordKeys(records.filter(record => record && record.groupKey === groupKey).map(record => record.key));
      removeShadowValue(shadowKey, config.removeShadow);
      activePayloads.delete(groupKey);
      return { ok: true, code: "ok" };
    } catch (error) {
      return publicFailure(error, { shadowKey });
    }
  }

  async function exportBackup() {
    const referenced = [];
    for (let index = 0; index < global.localStorage.length; index += 1) {
      const key = global.localStorage.key(index);
      if (!key || !key.startsWith(SHADOW_PREFIX)) continue;
      try {
        const shadow = JSON.parse(global.localStorage.getItem(key) || "");
        if (shadow && shadow.groupKey && shadow.revision) referenced.push(shadow);
        else throw new TypeError("Invalid image shadow in local storage");
      } catch (error) {
        error.name = error.name || "StorageVerificationError";
        throw error;
      }
    }
    const availableRecords = await allRecords();
    const recordsByKey = new Map(availableRecords.filter(Boolean).map(record => [record.key, record]));
    const records = [];
    const included = new Set();
    referenced.forEach(shadow => {
      const key = `${shadow.groupKey}|${shadow.revision}`;
      const record = recordsByKey.get(key);
      if (!verifiedRecord(record, shadow)) {
        const error = new Error(`Image backup verification failed for ${key}`);
        error.name = "StorageVerificationError";
        throw error;
      }
      if (!included.has(key)) {
        included.add(key);
        records.push(cloneJson(record));
      }
    });
    return {
      format: "FSMobileIndexedDBImageBackup",
      formatVersion: 1,
      databaseName: DATABASE_NAME,
      storeName: STORE_NAME,
      records
    };
  }

  function validateBackup(backup) {
    if (!backup || backup.format !== "FSMobileIndexedDBImageBackup" || backup.formatVersion !== 1 || !Array.isArray(backup.records)) return false;
    return backup.records.every(record => (
      record && record.schemaVersion === 1 && typeof record.key === "string" && typeof record.groupKey === "string" &&
      typeof record.revision === "string" && record.key === `${record.groupKey}|${record.revision}` &&
      record.images && typeof record.images === "object" && !Array.isArray(record.images) &&
      record.checksum === hashText(JSON.stringify(record.images)) &&
      Object.values(record.images).every(image => IMAGE_DATA_PATTERN.test(String(image || "")))
    ));
  }

  function resolveBackupPayload(backup, shadowValue) {
    if (!validateBackup(backup)) return null;
    try {
      const shadow = JSON.parse(String(shadowValue || ""));
      if (!shadow || shadow.schemaVersion !== 1 || !shadow.groupKey || !shadow.revision) return null;
      const recordKey = `${shadow.groupKey}|${shadow.revision}`;
      const record = backup.records.find(item => item && item.key === recordKey);
      if (!verifiedRecord(record, shadow)) return null;
      return {
        moduleId: String(shadow.moduleId || record.moduleId || "unknown"),
        storageKey: String(shadow.storageKey || record.storageKey || ""),
        payload: hydratePayload(shadow.compactPayload, record.images)
      };
    } catch {
      return null;
    }
  }

  async function importBackup(backup) {
    if (!validateBackup(backup)) {
      const error = new TypeError("Invalid IndexedDB image backup");
      return publicFailure(error, { code: "invalid-backup", importedRecords: 0 });
    }
    try {
      for (const rawRecord of backup.records) {
        const record = cloneJson(rawRecord);
        await putRecord(record);
        const copied = await readRecord(record.key);
        if (!copied || copied.checksum !== record.checksum || JSON.stringify(copied.images) !== JSON.stringify(record.images)) {
          const error = new Error("Imported IndexedDB image record verification failed");
          error.name = "StorageVerificationError";
          throw error;
        }
      }
      activePayloads.clear();
      return { ok: true, code: "ok", importedRecords: backup.records.length, verified: true };
    } catch (error) {
      return publicFailure(error, { importedRecords: 0 });
    }
  }

  async function deleteByStorageKeys(storageKeys) {
    const targets = new Set((Array.isArray(storageKeys) ? storageKeys : []).map(String));
    if (!targets.size) return { ok: true, code: "ok", deletedRecords: 0 };
    try {
      const records = await allRecords();
      const keys = records.filter(record => record && targets.has(String(record.storageKey || ""))).map(record => record.key);
      await deleteRecordKeys(keys);
      for (let index = global.localStorage.length - 1; index >= 0; index -= 1) {
        const key = global.localStorage.key(index);
        if (!key || !key.startsWith(SHADOW_PREFIX)) continue;
        try {
          const shadow = JSON.parse(global.localStorage.getItem(key) || "");
          if (shadow && targets.has(String(shadow.storageKey || ""))) global.localStorage.removeItem(key);
        } catch {}
      }
      Array.from(activePayloads.keys()).forEach(groupKey => {
        const decodedStorageKey = decodeURIComponent(String(groupKey).split("::").slice(1).join("::"));
        if (targets.has(decodedStorageKey)) activePayloads.delete(groupKey);
      });
      return { ok: true, code: "ok", deletedRecords: keys.length };
    } catch (error) {
      return publicFailure(error, { deletedRecords: 0 });
    }
  }

  async function stats() {
    try {
      const backup = await exportBackup();
      return {
        ok: true,
        code: "ok",
        recordCount: backup.records.length,
        imageCount: backup.records.reduce((sum, record) => sum + Number(record.imageCount || 0), 0),
        bytes: backup.records.reduce((sum, record) => sum + Number(record.bytes || 0), 0)
      };
    } catch (error) {
      return publicFailure(error, { recordCount: 0, imageCount: 0, bytes: 0 });
    }
  }

  global.FSMOBILE_IMAGE_STORAGE = Object.freeze({
    version: API_VERSION,
    databaseName: DATABASE_NAME,
    databaseVersion: DATABASE_VERSION,
    shadowPrefix: SHADOW_PREFIX,
    shadowKeyFor,
    hasImages,
    loadPayload,
    savePayload,
    writeShadow,
    removePayload,
    exportBackup,
    importBackup,
    validateBackup,
    resolveBackupPayload,
    deleteByStorageKeys,
    stats,
    lastResult: function() { return latestResult; }
  });
}(window));
