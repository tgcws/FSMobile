(function () {
  'use strict';
  const moduleId = 'planungshilfe-lwue-lwa';
  const storage = { current: moduleId + '-current-v1', archive: moduleId + '-archive-v1', pointer: moduleId + '-current-archive-id-v1' };
  const capabilities = { draft:true, archive:true, pdf:true, signatures:false, import:true, export:false };
  const schema = {
  "metadata": [
    {
      "key": "objekt",
      "label": "Objekt",
      "kind": "text"
    },
    {
      "key": "kundenNr",
      "label": "Kunden Nr.",
      "kind": "input"
    },
    {
      "key": "name",
      "label": "Name",
      "kind": "text"
    },
    {
      "key": "datum",
      "label": "Datum",
      "kind": "date"
    }
  ],
  "sections": [
    {
      "title": "1 Stammdaten",
      "groups": [
        {
          "title": "1.2 Angaben zum Bauvorhaben",
          "hint": "",
          "fields": [
            {
              "key": "objektAnschrift",
              "label": "Anschrift des Objekts",
              "kind": "text"
            },
            {
              "key": "wasserversorger",
              "label": "Wasserversorger",
              "kind": "text",
              "hint": "Zuständige Stelle, sofern bekannt. Eine Kontaktaufnahme erfolgt nur nach Rücksprache mit dem Einreicher."
            },
            {
              "key": "brandschutzbehoerde",
              "label": "Brandschutzbehörde",
              "kind": "text",
              "hint": "Zuständige Stelle, sofern bekannt. Eine Kontaktaufnahme erfolgt nur nach Rücksprache mit dem Einreicher."
            },
            {
              "key": "sachverstaendiger",
              "label": "Sachverständiger",
              "kind": "text",
              "hint": "Zuständige Stelle, sofern bekannt. Eine Kontaktaufnahme erfolgt nur nach Rücksprache mit dem Einreicher."
            },
            {
              "key": "neuerrichtung",
              "label": "Maßnahme: Neuerrichtung",
              "kind": "check"
            },
            {
              "key": "erweiterung",
              "label": "Maßnahme: Erweiterung",
              "kind": "check"
            },
            {
              "key": "sanierung",
              "label": "Maßnahme: Sanierung",
              "kind": "check"
            }
          ]
        }
      ]
    },
    {
      "title": "2 Angaben zur Löschwasseranlage",
      "groups": [
        {
          "title": "2.1 Art der Löscheinrichtung",
          "hint": "Informationen dem Brandschutzkonzept bzw. der Baugenehmigung entnehmen. Die für die Löschwasseranlage relevanten Dokumentseiten zur Planung bereitstellen.",
          "fields": [
            {
              "key": "typF",
              "label": "Wandhydranten Typ F nach DIN 14461-1",
              "kind": "check",
              "hint": "Formstabiler Schlauch DN 25; Schlauchanschlussventil 2 Zoll mit Anschlussmöglichkeit für die Feuerwehr."
            },
            {
              "key": "typFAnzahl",
              "label": "Anzahl Typ F",
              "kind": "integer",
              "unit": "Stück"
            },
            {
              "key": "typS",
              "label": "Wandhydranten Typ S nach DIN 14461-1",
              "kind": "check",
              "hint": "Formstabiler Schlauch DN 19; Schlauchanschlussventil 1 Zoll ohne Anschlussmöglichkeit für die Feuerwehr."
            },
            {
              "key": "typSAnzahl",
              "label": "Anzahl Typ S",
              "kind": "integer",
              "unit": "Stück"
            },
            {
              "key": "flachschlauch",
              "label": "Wandhydranten mit Flachschlauch nach DIN 14461-6",
              "kind": "check",
              "hint": "Für ausgebildetes Personal/Werkfeuerwehr; typischerweise Druckschlauch C-42 oder C-52 nach DIN EN 14540 bzw. DIN 14811."
            },
            {
              "key": "flachschlauchAnzahl",
              "label": "Anzahl mit Flachschlauch",
              "kind": "integer",
              "unit": "Stück"
            },
            {
              "key": "schaummittel",
              "label": "Vorgenannte Wandhydranten mit Schaummittelzumischung (Sonderfall)",
              "kind": "check"
            },
            {
              "key": "hydranten",
              "label": "Über-/Unterflurhydranten",
              "kind": "check"
            },
            {
              "key": "hydrantenAnzahlNennweite",
              "label": "Anzahl und Nennweite der Über-/Unterflurhydranten",
              "kind": "text"
            },
            {
              "key": "automatischeAnlage",
              "label": "Automatische/selbsttätige Löschanlage",
              "kind": "check"
            },
            {
              "key": "automatischeAnlageArt",
              "label": "Angaben zur automatischen/selbsttätigen Löschanlage",
              "kind": "text"
            }
          ]
        },
        {
          "title": "2.2 Löschwasserbedarf",
          "hint": "",
          "fields": [
            {
              "key": "bedarfWhVolumen",
              "label": "Wandhydranten: Volumenstrom",
              "kind": "decimal",
              "unit": "l/min",
              "hint": "Richtwerte laut Vorlage / DIN 14462: 2 × 24 l/min bei 2,0 bar (Typ S ohne Feuerwehrnutzung); 3 × 100 l/min bei 3,0 bar (CM-Strahlrohr mit Mundstück); 3 × 200 l/min bei 4,5 bar (Hohlstrahlrohr / C-Strahlrohr ohne Mundstück)."
            },
            {
              "key": "bedarfWhDruck",
              "label": "Wandhydranten: Fließdruck",
              "kind": "decimal",
              "unit": "bar",
              "hint": "Ruhedruck maximal 12 bar."
            },
            {
              "key": "bedarfHydrantenVolumen",
              "label": "Über-/Unterflurhydranten: Volumenstrom",
              "kind": "decimal",
              "unit": "l/min",
              "hint": "Richtwerte laut Vorlage / DIN 14462: DN 80: 1 × 800 l/min (48 m³/h); DN 100: 1 × 1.600 l/min (96 m³/h); mindestens 1,5 bar Fließdruck."
            },
            {
              "key": "bedarfHydrantenDruck",
              "label": "Über-/Unterflurhydranten: Fließdruck",
              "kind": "decimal",
              "unit": "bar",
              "hint": "Ruhedruck maximal 12 bar."
            },
            {
              "key": "bedarfAutomatikVolumen",
              "label": "Automatische Löschanlagen: Volumenstrom",
              "kind": "decimal",
              "unit": "l/min"
            },
            {
              "key": "bedarfAutomatikDruck",
              "label": "Automatische Löschanlagen: Fließdruck",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "bedarfAutomatikRuhedruck",
              "label": "Automatische Löschanlagen: maximaler Ruhedruck",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "bereitstellungsdauer",
              "label": "Bereitstellungsdauer",
              "kind": "decimal",
              "unit": "Stunden",
              "hint": "Regelwert laut Vorlage / DIN 14462: 2 Stunden."
            }
          ]
        },
        {
          "title": "2.3 Löschwasserversorgung",
          "hint": "",
          "fields": [
            {
              "key": "trinkwasser",
              "label": "Fortlaufende Nachspeisung aus der Trinkwasser-Installation",
              "kind": "check"
            },
            {
              "key": "trinkwasserDn",
              "label": "Nennweite der Versorgungsleitung",
              "kind": "input",
              "unit": "DN"
            },
            {
              "key": "trinkwasserDruckMin",
              "label": "Trinkwasser: Versorgungsdruck mindestens",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "trinkwasserDruckMax",
              "label": "Trinkwasser: Versorgungsdruck maximal",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "trinkwasserVolumen",
              "label": "Trinkwasser: Mindestvolumenstrom laut Versorger",
              "kind": "decimal",
              "unit": "m³/h"
            },
            {
              "key": "trinkwasserZaehler",
              "label": "Trinkwasser: Wasserzähler QN",
              "kind": "input"
            },
            {
              "key": "brauchwasser",
              "label": "Versorgung über Brauchwasserinstallation",
              "kind": "check",
              "hint": "Mindestanforderungen nach DIN 14462 beachten, z. B. Wasserbereitstellung auch bei Ausfall der Energieversorgung."
            },
            {
              "key": "brauchwasserDruckMin",
              "label": "Brauchwasser: Versorgungsdruck mindestens",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "brauchwasserDruckMax",
              "label": "Brauchwasser: Versorgungsdruck maximal",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "brauchwasserVolumen",
              "label": "Brauchwasser: Mindestvolumenstrom laut Versorger",
              "kind": "decimal",
              "unit": "m³/h"
            },
            {
              "key": "brauchwasserZaehler",
              "label": "Brauchwasser: Wasserzähler QN",
              "kind": "input"
            },
            {
              "key": "tank",
              "label": "Versorgung über Löschwassertank / Löschwasserteich",
              "kind": "check",
              "hint": "Detaillierte Dokumentation mit notwendigen Saughöhen und Nachspeiseeinrichtung zur Planung bereitstellen."
            },
            {
              "key": "tankVolumen",
              "label": "Nutzinhalt / bereitgestellte Löschwassermenge",
              "kind": "decimal",
              "unit": "m³"
            }
          ]
        },
        {
          "title": "2.4 Vorgaben zur Löschwasserübergabestelle (LWÜ)",
          "hint": "",
          "fields": [
            {
              "key": "vorgabeOffen",
              "label": "Noch keine Vorgaben; Auswahl soll im Rahmen der Auslegung erfolgen",
              "kind": "check"
            },
            {
              "key": "fuellEntleerung",
              "label": "Füll- und Entleerungsstation nach DIN 14461-1",
              "kind": "check"
            },
            {
              "key": "vorlagebehaelter",
              "label": "Vorlagebehälter mit freiem Auslauf A/A oder A/B nach DIN EN 1717 und Feuerlösch-Druckerhöhungsanlage",
              "kind": "check"
            },
            {
              "key": "direktanschluss",
              "label": "Direktanschlussstation (DAS) nach DIN 14464",
              "kind": "check"
            },
            {
              "key": "multibarriere",
              "label": "Multibarrierensystem",
              "kind": "check"
            },
            {
              "key": "vorgabeSonstige",
              "label": "Sonstige Vorgaben",
              "kind": "check"
            },
            {
              "key": "vorgabeSonstigeText",
              "label": "Sonstige Vorgaben: Angaben",
              "kind": "text"
            }
          ]
        }
      ]
    },
    {
      "title": "3 Weitere Anforderungen",
      "groups": [
        {
          "title": "3.1 Spüleinrichtungen",
          "hint": "",
          "fields": [
            {
              "key": "spuelLwue",
              "label": "Spüleinrichtung nach DIN 1988-600 in der Löschwasserübergabestelle",
              "kind": "check"
            },
            {
              "key": "spuelBauseits",
              "label": "Spüleinrichtung bauseitig; nur Alarmmeldekontakt zur Abschaltung im Brandfall erforderlich",
              "kind": "check"
            },
            {
              "key": "spuelKeine",
              "label": "Keine Spüleinrichtung erforderlich; keine Nachspeisung aus der Trinkwasser-Installation geplant",
              "kind": "check"
            }
          ]
        },
        {
          "title": "3.2 Trinkwasserabschottungen",
          "hint": "",
          "fields": [
            {
              "key": "abschottung",
              "label": "Trinkwasserabschottung nach DIN 1988-600 / DIN 14462 vorsehen",
              "kind": "check"
            },
            {
              "key": "abschottungMetall",
              "label": "Keine Abschottung erforderlich: ausschließlich metallische Leitungen und Armaturen oder ausreichender Schutz gegen Brandeinwirkung",
              "kind": "check"
            },
            {
              "key": "abschottungNachweis",
              "label": "Keine Abschottung erforderlich: ausreichende Löschwasserversorgung selbst bei Rohrbruch in der Trinkwasser-Installation gemäß Nachweis des Fachplaners",
              "kind": "check"
            }
          ]
        },
        {
          "title": "3.3 Anforderungen an die Ausfallsicherheit",
          "hint": "",
          "fields": [
            {
              "key": "redundanz",
              "label": "Redundanz im Sinne von DIN 14462 gemäß Brandschutzkonzept, Baugenehmigung o. ä. gefordert",
              "kind": "check"
            },
            {
              "key": "sicherheitsstrom",
              "label": "Sicherheitsstromversorgung gemäß Brandschutzkonzept, Baugenehmigung o. ä. gefordert",
              "kind": "check"
            },
            {
              "key": "bevorratung",
              "label": "Löschwasserbevorratung gemäß Brandschutzkonzept, Baugenehmigung o. ä. zwingend erforderlich",
              "kind": "check"
            }
          ]
        },
        {
          "title": "3.4 Alarmierungseinrichtungen",
          "hint": "",
          "fields": [
            {
              "key": "alarmGlt",
              "label": "Stör- und Betriebsmeldungen bauseitig (z. B. GLT) an eine ständig besetzte Stelle",
              "kind": "check"
            },
            {
              "key": "alarmAnzeige",
              "label": "Stör- und Betriebsmeldungen über Alarmanzeige an eine ständig besetzte Stelle",
              "kind": "check"
            },
            {
              "key": "alarmOptisch",
              "label": "Stör- und Betriebsmeldungen über optisch-akustischen Warnmelder",
              "kind": "check"
            }
          ]
        },
        {
          "title": "3.5 Fernüberwachung / Fernzugriff",
          "hint": "",
          "fields": [
            {
              "key": "fernGsm",
              "label": "Zusätzliche Stör- und Betriebsmeldungen über GSM-Netz an eine externe Stelle",
              "kind": "check"
            },
            {
              "key": "fernTelefon",
              "label": "Zusätzliche Stör- und Betriebsmeldungen über Telefonleitung an eine externe Stelle",
              "kind": "check"
            },
            {
              "key": "fernPc",
              "label": "Fernüberwachung/Fernzugriff über Intranet/Internet und PC",
              "kind": "check"
            },
            {
              "key": "fernSmartphone",
              "label": "Fernüberwachung/Fernzugriff über Internet und Smartphone",
              "kind": "check",
              "hint": "Laut Vorlage für Android- bzw. iOS-basierte Smartphones; ggf. zusätzliche Firewall-Einstellungen erforderlich."
            }
          ]
        },
        {
          "title": "3.6 Notentwässerung",
          "hint": "",
          "fields": [
            {
              "key": "entwaesserungAngebot",
              "label": "LWÜ unterhalb der Rückstauebene; Notentwässerung soll mit angeboten werden",
              "kind": "check"
            },
            {
              "key": "entwaesserungBauseits",
              "label": "LWÜ unterhalb der Rückstauebene; Entwässerung von Expansionswasser wird bauseitig geregelt",
              "kind": "check"
            },
            {
              "key": "entwaesserungOberhalb",
              "label": "LWÜ oberhalb der Rückstauebene",
              "kind": "check"
            }
          ]
        }
      ]
    },
    {
      "title": "4 Anlageninstallation und Rohrleitungsführung",
      "groups": [
        {
          "title": "4.1 Aufstellraum der Löschwasserübergabestelle",
          "hint": "Der Aufstell-/Installationsraum muss frei von Brandlasten, ausreichend gegen Brandeinwirkung von außen geschützt (i. d. R. F90), ausreichend belüftet und überflutungssicher sein. Zugang nur für befugte Personen.",
          "fields": [
            {
              "key": "hoeheVersorgung",
              "label": "Höhendifferenz zwischen Versorgungsanschluss und Aufstellhöhe der LWÜ",
              "kind": "text"
            }
          ]
        },
        {
          "title": "4.2 Leitungsführung bis zur Löschwasserübergabestelle",
          "hint": "",
          "fields": [
            {
              "key": "versorgungsleitung",
              "label": "Länge und Nennweite der gemeinsamen Versorgungsleitung bis zur LWÜ",
              "kind": "text"
            },
            {
              "key": "materialVersorgung",
              "label": "Verwendetes Rohrleitungsmaterial bis zur LWÜ",
              "kind": "text"
            },
            {
              "key": "aufstellflaeche",
              "label": "Zur Verfügung stehende Aufstellfläche",
              "kind": "text",
              "hint": "Möglichst eine Zeichnung des Aufstellraums zur Planung bereitstellen."
            }
          ]
        },
        {
          "title": "4.3 Leitungsführung von der LWÜ bis zu den Löschwasserentnahmen",
          "hint": "",
          "fields": [
            {
              "key": "hoeheHoechste",
              "label": "Höhendifferenz zwischen LWÜ und höchst gelegener Entnahmestelle",
              "kind": "text"
            },
            {
              "key": "hoeheNiedrigste",
              "label": "Höhendifferenz zwischen LWÜ und niedrigster Entnahmestelle",
              "kind": "text"
            },
            {
              "key": "frost",
              "label": "Frostgefahr im Bereich der Löschwasserleitungen",
              "kind": "select",
              "options": [
                "Nein",
                "Nur in Teilbereichen",
                "Ja, durchgängig"
              ]
            },
            {
              "key": "materialEntnahme",
              "label": "Verwendetes Rohrleitungsmaterial zu den Entnahmestellen",
              "kind": "text"
            },
            {
              "key": "gefaelle",
              "label": "Durchgängig mindestens 0,5 % Gefälle zur LWÜ möglich?",
              "kind": "select",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "title": "4.4 Ermittlung des Druckverlustes durch Fließdruckmessung",
          "hint": "Zur Bestimmung der geeigneten Feuerlösch-Druckerhöhungsanlage kann eine Fließdruckmessung durchgeführt werden. Mit den unter 2.2 genannten Volumenströmen an der von der LWÜ entferntesten Entnahmestelle messen; gleichzeitig den Fließdruck am Aufstellungsort der LWÜ erfassen.",
          "fields": [
            {
              "key": "messungVolumen",
              "label": "Entferntester Wandhydrant: Volumenstrom",
              "kind": "decimal",
              "unit": "l/min",
              "hint": "Richtwerte laut Vorlage / DIN 14462: 2 × 24 l/min bei 2,0 bar (Typ S ohne Feuerwehrnutzung); 3 × 100 l/min bei 3,0 bar (CM-Strahlrohr mit Mundstück); 3 × 200 l/min bei 4,5 bar (Hohlstrahlrohr / C-Strahlrohr ohne Mundstück)."
            },
            {
              "key": "messungDruck",
              "label": "Entferntester Wandhydrant: Fließdruck",
              "kind": "decimal",
              "unit": "bar"
            },
            {
              "key": "messungLwueDruck",
              "label": "Gleichzeitiger Fließdruck am Aufstellungsraum der LWÜ",
              "kind": "decimal",
              "unit": "bar"
            }
          ]
        },
        {
          "title": "4.5 Rohrleitungsisometrie",
          "hint": "",
          "fields": [],
          "drawing": true
        }
      ]
    },
    {
      "title": "5 Sonstige Angaben",
      "groups": [
        {
          "title": "",
          "hint": "",
          "fields": [
            {
              "key": "sonstigeAngaben",
              "label": "Sonstige Angaben",
              "kind": "longtext"
            }
          ]
        }
      ]
    },
    {
      "title": "6 Angebotsgrundlagen",
      "groups": [
        {
          "title": "",
          "hint": "",
          "fields": [
            {
              "key": "ausschreibung",
              "label": "Ausschreibung erfolgt voraussichtlich",
              "kind": "text"
            },
            {
              "key": "ausfuehrung",
              "label": "Ausführungsbeginn / Beschaffung",
              "kind": "text"
            },
            {
              "key": "angebotBis",
              "label": "Angebot wird benötigt bis zum",
              "kind": "date"
            },
            {
              "key": "preisart",
              "label": "Preisangaben als",
              "kind": "select",
              "options": [
                "Listenpreise",
                "Einkaufspreis"
              ]
            },
            {
              "key": "angebotHinweise",
              "label": "Sonstige Hinweise",
              "kind": "longtext"
            }
          ]
        }
      ]
    }
  ]
};
  function runtime(schema) {
    'use strict';
    const MODULE_ID = 'planungshilfe-lwue-lwa', TITLE = 'Planungshilfe einer LWÜ oder LWA';
    const KEYS = { current: MODULE_ID + '-current-v1', archive: MODULE_ID + '-archive-v1', pointer: MODULE_ID + '-current-archive-id-v1' };
    const ASSET = 'assets/planungshilfe-lwue-lwa/', artwork = 'isometrie-raster.png';
    const fields = [...schema.metadata, ...schema.sections.flatMap(s => s.groups.flatMap(g => g.fields))];
    const byKey = Object.fromEntries(fields.map(f => [f.key, f]));
    const clone = value => JSON.parse(JSON.stringify(value));
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
    const uid = () => window.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
    const DRAW_WIDTH = 1000, DRAW_HEIGHT = 1000 * 421.25 / 492;
    const MAX_STROKES = 5000, MAX_POINTS = 50000;
    const blank = () => ({ version: 1, fields: { ...Object.fromEntries(fields.map(f => [f.key, f.kind === 'check' ? false : ''])), datum: today() }, drawing: { version: 1, strokes: [] } });
    function normalizeDrawing(value) {
      if (value === undefined) return { version: 1, strokes: [] };
      if (!isObject(value) || value.version !== 1 || !Array.isArray(value.strokes) || value.strokes.length > MAX_STROKES) throw new Error('drawing');
      let points = 0; const ids = new Set();
      for (const stroke of value.strokes) {
        if (!isObject(stroke) || typeof stroke.id !== 'string' || !stroke.id || ids.has(stroke.id) || !['free', 'line'].includes(stroke.kind) || !Array.isArray(stroke.points) || !stroke.points.length || (stroke.kind === 'line' && stroke.points.length !== 2)) throw new Error('stroke');
        ids.add(stroke.id); points += stroke.points.length;
        if (points > MAX_POINTS || stroke.points.some(p => !Array.isArray(p) || p.length !== 2 || p.some(n => typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 1))) throw new Error('points');
      }
      return value;
    }
    function normalize(data) {
      const source = isObject(data) ? clone(data) : {};
      if (source.version !== undefined && source.version !== 1) throw new Error('version');
      if (source.fields !== undefined && !isObject(source.fields)) throw new Error('fields');
      const saved = source.fields || {}, next = { ...saved };
      for (const f of fields) {
        next[f.key] = f.kind === 'check' ? saved[f.key] === true : String(saved[f.key] ?? '');
        if (f.kind === 'select' && next[f.key] && !f.options.includes(next[f.key])) throw new Error('selection');
      }
      return { ...source, version: 1, fields: next, drawing: normalizeDrawing(source.drawing) };
    }
    let state = blank(), timer = 0, storageBlocked = false, saveFailed = false, busy = false;
    let active = null, tool = 'free';
    const undo = [];
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
      clearTimeout(timer); finishGesture();
      const ok = !storageBlocked && commit({ [KEYS.current]: JSON.stringify(state) });
      if (!ok && !saveFailed) notify('Eingaben konnten nicht gespeichert werden. Bitte diese Planungshilfe geöffnet lassen.');
      saveFailed = !ok;
      return ok;
    }
    function applyData(data, options) {
      const next = normalize(data);
      if ((!options || options.persist !== false) && !commit({ [KEYS.current]: JSON.stringify(next) })) return false;
      storageBlocked = false; state = next; render(); return true;
    }
    function grow(el) {
      if (el.tagName === 'TEXTAREA') { el.style.height = 'auto'; el.style.height = Math.max(el.dataset.kind === 'longtext' ? 120 : 46, el.scrollHeight) + 'px'; }
    }
    function fieldHtml(f) {
      const label = esc(f.label + (f.unit ? ' (' + f.unit + ')' : ''));
      const hint = f.hint ? '<small id="hint-' + f.key + '" class="field-hint">' + esc(f.hint) + '</small>' : '';
      const attr = ' id="' + f.key + '" data-field="' + f.key + '" data-kind="' + f.kind + '"' + (f.hint ? ' aria-describedby="hint-' + f.key + '"' : '');
      if (f.kind === 'check') return '<label class="choice-field"><input type="checkbox"' + attr + '><span><span class="choice-label">' + label + '</span>' + hint + '</span></label>';
      let input;
      if (f.kind === 'select') input = '<select' + attr + '><option value="">Bitte auswählen</option>' + f.options.map(o => '<option>' + esc(o) + '</option>').join('') + '</select>';
      else if (['text','longtext'].includes(f.kind)) input = '<textarea rows="' + (f.kind === 'longtext' ? '4' : '1') + '"' + attr + '></textarea>';
      else input = '<input type="' + (f.kind === 'date' ? 'date' : 'text') + '"' + (f.kind === 'integer' ? ' inputmode="numeric"' : f.kind === 'decimal' ? ' inputmode="decimal"' : '') + attr + '>';
      return '<label class="field-group' + (f.kind === 'longtext' ? ' wide' : '') + '"><span>' + label + '</span>' + input + hint + '</label>';
    }
    function drawingHtml() {
      return '<div class="drawing-tools" role="group" aria-label="Zeichenwerkzeuge">' + [['free','Freihand'],['line','Gerade Linie'],['erase','Radieren']].map(([key,label]) => '<button type="button" class="drawing-tool neutral" data-tool="' + key + '" aria-pressed="' + (key === tool) + '">' + label + '</button>').join('') + '<button type="button" id="drawingUndo" class="neutral" disabled>Rückgängig</button><button type="button" id="drawingClear" class="danger" disabled>Zeichnung leeren</button></div>' +
        '<p class="field-hint" id="drawingHelp">Mit Finger, Stift oder Maus zeichnen. „Radieren“ entfernt berührte Striche. Zum Scrollen außerhalb der Zeichenfläche wischen.</p>' +
        '<svg id="isometryCanvas" viewBox="0 0 ' + DRAW_WIDTH + ' ' + DRAW_HEIGHT + '" role="img" aria-label="Zeichenfläche Rohrleitungsisometrie" aria-describedby="drawingHelp"><image id="isometryGrid" href="' + ASSET + artwork + '" x="0" y="0" width="' + DRAW_WIDTH + '" height="' + DRAW_HEIGHT + '" preserveAspectRatio="none"/><g id="drawingInk"></g></svg>';
    }
    document.getElementById('metadataFields').innerHTML = schema.metadata.map(fieldHtml).join('');
    document.getElementById('planningSections').innerHTML = schema.sections.map(s => '<section class="form-section" data-section="' + esc(s.title.split(' ')[0]) + '"><h2 class="section-heading">' + esc(s.title) + '</h2>' + s.groups.map(g => '<div class="planning-group"' + (g.drawing ? ' id="isometrySection"' : '') + '>' + (g.title ? '<h3>' + esc(g.title) + '</h3>' : '') + (g.hint ? '<p class="group-hint">' + esc(g.hint) + '</p>' : '') + (g.drawing ? drawingHtml() : '<div class="form-grid">' + g.fields.map(fieldHtml).join('') + '</div>') + '</div>').join('') + '</section>').join('');
    const surface = document.getElementById('isometryCanvas');
    function render() {
      active = null; undo.length = 0;
      document.querySelectorAll('[data-field]').forEach(el => {
        if (el.type === 'checkbox') el.checked = state.fields[el.dataset.field]; else el.value = state.fields[el.dataset.field];
        el.setCustomValidity(''); el.removeAttribute('aria-invalid'); grow(el);
      });
      drawInk(); updateTools();
    }
    function updateValue(event) {
      const el = event.target, key = el.dataset.field, f = byKey[key]; if (!f) return;
      state.fields[key] = f.kind === 'check' ? el.checked : el.value;
      const valid = !el.value || !['integer','decimal'].includes(f.kind) || (f.kind === 'integer' ? /^\d+$/.test(el.value) : /^\d+(?:[,.]\d+)?$/.test(el.value));
      el.setCustomValidity(valid ? '' : 'Bitte eine nicht negative Zahl' + (f.kind === 'integer' ? ' ohne Nachkommastellen' : '') + ' eingeben.');
      el.setAttribute('aria-invalid', String(!valid)); grow(el);
      clearTimeout(timer); timer = setTimeout(saveFormNow, 120);
    }
    function drawInk(strokes = state.drawing.strokes) {
      document.getElementById('drawingInk').innerHTML = strokes.map(s => {
        const pts = s.points.map(([x,y]) => [x * DRAW_WIDTH, y * DRAW_HEIGHT]);
        if (pts.length === 1) return '<circle data-stroke="' + esc(s.id) + '" cx="' + pts[0][0] + '" cy="' + pts[0][1] + '" r="1.8" fill="#153f71"/>';
        return '<path data-stroke="' + esc(s.id) + '" d="' + pts.map((p,i) => (i ? 'L' : 'M') + p.join(' ')).join(' ') + '" fill="none" stroke="#153f71" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>';
      }).join('');
    }
    function updateTools() {
      document.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === tool)));
      document.getElementById('drawingUndo').disabled = !undo.length;
      document.getElementById('drawingClear').disabled = !state.drawing.strokes.length;
      surface.style.cursor = tool === 'erase' ? 'cell' : 'crosshair';
    }
    function writeDrawing(strokes, remember = true) {
      const next = { ...state, drawing: { ...state.drawing, strokes } };
      try { normalizeDrawing(next.drawing); } catch (_) { notify('Die Zeichenfläche ist voll. Bitte nicht benötigte Striche entfernen.'); drawInk(); return false; }
      if (storageBlocked || !commit({ [KEYS.current]: JSON.stringify(next) })) { notify('Zeichnung konnte nicht gespeichert werden. Der vorherige Stand bleibt erhalten.'); drawInk(); return false; }
      if (remember) { undo.push(state.drawing.strokes); if (undo.length > 30) undo.shift(); }
      state = next; saveFailed = false; drawInk(); updateTools(); return true;
    }
    function point(event) {
      const r = surface.getBoundingClientRect();
      return [Math.max(0, Math.min(1, (event.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (event.clientY - r.top) / r.height))].map(n => Math.round(n * 100000) / 100000);
    }
    function distanceToSegment(p,a,b) {
      const dx = b[0]-a[0], dy = b[1]-a[1], length = dx*dx+dy*dy;
      const t = length ? Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/length)) : 0;
      return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
    }
    function eraseAt(p) {
      const rect = surface.getBoundingClientRect(), screen = q => [q[0]*rect.width,q[1]*rect.height], cursor = screen(p);
      active.strokes = active.strokes.filter(s => {
        const points = s.points.map(screen);
        return !points.some((a,i) => distanceToSegment(cursor,a,points[i+1] || a) <= 14);
      });
      drawInk(active.strokes);
    }
    function finishGesture() {
      if (!active) return;
      const gesture = active; active = null;
      if (gesture.tool === 'erase') {
        if (gesture.strokes.length !== state.drawing.strokes.length) writeDrawing(gesture.strokes);
        else drawInk();
      } else writeDrawing([...state.drawing.strokes, gesture.stroke]);
      try { surface.releasePointerCapture(gesture.id); } catch (_) {}
    }
    surface.addEventListener('pointerdown', event => {
      if (active || event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
      event.preventDefault(); clearTimeout(timer);
      if (tool !== 'erase' && (state.drawing.strokes.length >= MAX_STROKES || state.drawing.strokes.reduce((n,s) => n+s.points.length,0) + (tool === 'line' ? 2 : 1) > MAX_POINTS)) { notify('Die Zeichenfläche ist voll. Bitte nicht benötigte Striche entfernen.'); return; }
      const p = point(event);
      active = { id: event.pointerId, tool, strokes: state.drawing.strokes, stroke: { id: uid(), kind: tool === 'line' ? 'line' : 'free', points: tool === 'line' ? [p,p] : [p] } };
      try { surface.setPointerCapture(event.pointerId); } catch (_) {}
      if (tool === 'erase') eraseAt(p); else drawInk([...state.drawing.strokes,active.stroke]);
    }, {passive:false});
    surface.addEventListener('pointermove', event => {
      if (!active || event.pointerId !== active.id) return;
      event.preventDefault(); const p = point(event);
      if (active.tool === 'erase') { eraseAt(p); return; }
      if (active.tool === 'line') active.stroke.points[1] = p;
      else {
        const points = active.stroke.points, last = points[points.length-1];
        if (Math.hypot(p[0]-last[0],p[1]-last[1]) < .001) return;
        if (points.length + state.drawing.strokes.reduce((n,s) => n+s.points.length,0) >= MAX_POINTS) { finishGesture(); notify('Die Zeichenfläche ist voll. Bitte nicht benötigte Striche entfernen.'); return; }
        points.push(p);
      }
      drawInk([...state.drawing.strokes,active.stroke]);
    }, {passive:false});
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => surface.addEventListener(type, event => { if (active?.id === event.pointerId) finishGesture(); }));
    window.addEventListener('resize', finishGesture);
    document.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => { finishGesture(); tool = b.dataset.tool; updateTools(); }));
    document.getElementById('drawingUndo').addEventListener('click', () => { finishGesture(); if (undo.length && writeDrawing(undo[undo.length-1],false)) { undo.pop(); updateTools(); } });
    document.getElementById('drawingClear').addEventListener('click', async () => {
      finishGesture(); if (!state.drawing.strokes.length) return;
      if (await window.parent.FSMOBILE_UI.confirm('Nur die eigene Zeichnung leeren? Das Raster und alle Formularangaben bleiben erhalten.', 'Zeichnung leeren?', 'Leeren')) writeDrawing([]);
    });
    function archiveEntries() {
      const raw = localStorage.getItem(KEYS.archive);
      const data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data) || data.some(e => !isObject(e) || !e.id || !isObject(e.data))) throw new Error('invalid-archive');
      return data;
    }
    const archiveTitle = data => data.fields.objekt || 'Ohne Objekt';
    function saveArchive() {
      if (!saveFormNow()) return false;
      try {
        const entries = archiveEntries(), pointer = localStorage.getItem(KEYS.pointer);
        const index = entries.findIndex(e => e.id === pointer), previous = entries[index];
        const standard = window.FSMOBILE_STANDARD.createArchiveEntry({ moduleId: MODULE_ID, title: archiveTitle(state), meta: { object: state.fields.objekt, date: state.fields.datum, type: 'Planungshilfe einer LWÜ oder LWA', anlage: state.fields.name }, data: collectData(), previous });
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
          '<div class="archive-detail-host"><div class="archive-detail"><div class="archive-detail-head"><span class="archive-type-badge">Planungshilfe einer LWÜ oder LWA</span><span class="archive-entry-date">' + esc(archiveDate(e.data?.fields?.datum)) + '</span></div>' +
          '<div class="archive-detail-object">Objekt: ' + esc(e.meta?.object || e.data?.fields?.objekt || 'nicht vorhanden') + '</div>' +
          '<div class="archive-detail-grid"><span class="archive-detail-pair"><b>Kunden Nr.: </b><span>' + esc(e.data?.fields?.kundenNr || 'nicht vorhanden') + '</span></span><span class="archive-detail-pair"><b>Name: </b><span>' + esc(e.data?.fields?.name || e.meta?.anlage || 'nicht vorhanden') + '</span></span></div>' +
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
      return window.FSMOBILE_STANDARD.pdfFileName([data.fields.objekt || 'Planungshilfe_LWUE_LWA', data.fields.datum || today()]);
    }
    window.FSMOBILE_PDF_EXPORT_FORMAT = 'zip';
    window.FSMOBILE_REPORT_EXPORT_FILE_NAME = () => pdfFileName(state).replace(/\.pdf$/, '.zip');
    function validateImport(payload) {
      if (payload?.kind !== 'fsmobile-aufmass-export' || payload.version !== 1 || payload.moduleId !== MODULE_ID || !isObject(payload.data?.fields)) throw new Error('format');
      normalize(payload.data); return payload;
    }
    async function importFile(file) {
      if (!file) return false;
      try {
        const reports = await window.parent.FSMOBILE_REPORT_FILES.read(file, validateImport);
        if (reports.length !== 1) throw new Error('ambiguous');
        const next = normalize(reports[0].payload.data);
        if (!await replaceConfirmation('Den aktuellen Entwurf durch die ausgewählte Planungsdatei ersetzen? Archiviere wichtige Änderungen zuvor. Bestehende Archiveinträge bleiben erhalten.')) return false;
        clearTimeout(timer);
        if (!commit({ [KEYS.current]: JSON.stringify(next), [KEYS.pointer]: null })) throw new Error('write');
        state = next; storageBlocked = false; render(); notify('Datei wurde importiert.'); return true;
      } catch (_) { notify('Datei konnte nicht importiert werden. Bitte eine gültige LWÜ-/LWA-Planungsdatei wählen.'); return false; }
      finally { document.getElementById('importFile').value = ''; }
    }

    const pdfImageCache = new Map();
    async function imageForPdf(file) {
      if (!pdfImageCache.has(file)) pdfImageCache.set(file, new Promise((resolve, reject) => {
        const img = new Image(); img.onload = () => resolve(img); img.onerror = () => { pdfImageCache.delete(file); reject(new Error('Raster konnte nicht geladen werden.')); }; img.src = ASSET + file;
      }));
      return pdfImageCache.get(file);
    }
    async function exportPdf() {
      if (busy) return false;
      finishGesture(); busy = true;
      const transaction = window.FSMOBILE_UI_EXPORT_TRANSACTION;
      try {
        const data = collectData(), img = await imageForPdf(artwork);
        if (!window.jspdf?.jsPDF) throw new Error('PDF-Bibliothek ist nicht verfügbar.');
        const doc = new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true});
        const val = value => String(value ?? '').trim() || '-';
        let y = 44;
        function header() {
          doc.setFillColor(255,180,71); doc.rect(10,24,190,10,'F');
          doc.setTextColor(0); doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text(TITLE,14,30.7);
          doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
          const context = (data.fields.objekt || 'Ohne Objekt').replace(/\s+/g,' ') + ' | ' + val(data.fields.datum);
          doc.text(doc.splitTextToSize(context,182)[0],14,38); y = 44;
        }
        function nextPage() { doc.addPage(); header(); }
        function ensure(height) { if (y + height > 280) nextPage(); }
        function title(text, primary = false) {
          doc.setFont('helvetica','bold'); doc.setFontSize(primary ? 10 : 9);
          const lines = doc.splitTextToSize(text,178), h = lines.length * 4.1 + 5;
          ensure(h+12);
          if (primary) { doc.setFillColor(255,228,186); doc.rect(14,y,182,h,'F'); }
          doc.setFont('helvetica','bold'); doc.setFontSize(primary ? 10 : 9); doc.setTextColor(0);
          lines.forEach((line,i) => doc.text(line,primary ? 16 : 14,y+4+i*4.1)); y += h+2;
        }
        function note(text) {
          if (!text) return;
          doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
          const lines = doc.splitTextToSize(text,180);
          for (const line of lines) { ensure(5); doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(65); doc.text(line,15,y+3); y+=3.5; }
          y+=2;
        }
        function metadataRow(items) {
          doc.setFont('helvetica','normal'); doc.setFontSize(8);
          const columns = items.map(([label,value]) => ({label,lines:doc.splitTextToSize(val(value),63),offset:0}));
          while (columns.some(c=>c.offset<c.lines.length)) {
            ensure(12); doc.setFontSize(8);
            const capacity = Math.max(1,Math.floor((280-y-4)/3.8));
            const chunks = columns.map(c=>c.lines.slice(c.offset,c.offset+capacity));
            const labels = columns.map(c=>doc.splitTextToSize(c.label+(c.offset && c.offset<c.lines.length?' (Forts.)':''),21));
            const height = Math.max(...chunks.map(c=>c.length),...labels.map(l=>l.length))*3.8+4;
            ensure(height);
            columns.forEach((c,i)=>{
              const x=14+i*93;doc.setFillColor(247,248,251);doc.rect(x,y,89,height,'F');
              doc.setTextColor(0);doc.setFont('helvetica','bold');doc.text(labels[i],x+2,y+4,{lineHeightFactor:1.35});
              doc.setFont('helvetica','normal');if(chunks[i].length)doc.text(chunks[i],x+24,y+4,{lineHeightFactor:1.35});c.offset+=chunks[i].length;
            });
            y+=height;if(columns.some(c=>c.offset<c.lines.length))nextPage();
          }
        }
        function fieldRow(f) {
          if (f.kind === 'check') {
            doc.setFont('helvetica','normal');doc.setFontSize(8.5);
            const lines=doc.splitTextToSize((data.fields[f.key]?'[x] ':'[ ] ')+f.label,180);
            ensure(lines.length*4+2);
            doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(0);
            lines.forEach((line,i)=>doc.text(line,15,y+3.5+i*4));y+=lines.length*4+2;
          } else {
            doc.setFont('helvetica','normal');doc.setFontSize(8.5);
            const lines=doc.splitTextToSize(val(data.fields[f.key])+(f.unit?' '+f.unit:''),112);let offset=0;
            while(offset<lines.length){
              doc.setFont('helvetica','bold');doc.setFontSize(8.5);
              const labels=doc.splitTextToSize(f.label+(offset?' (Forts.)':''),63);
              ensure(labels.length*4+5);
              const count=Math.max(1,Math.min(lines.length-offset,Math.floor((280-y-5)/4)));
              const height=Math.max(count,labels.length)*4+5;
              doc.setFillColor(247,248,251);doc.rect(14,y,182,height,'F');doc.setTextColor(0);doc.setFont('helvetica','bold');doc.setFontSize(8.5);
              labels.forEach((line,i)=>doc.text(line,16,y+4+i*4));
              doc.setFont('helvetica','normal');lines.slice(offset,offset+count).forEach((line,i)=>doc.text(line,82,y+4+i*4));
              y+=height+1;offset+=count;if(offset<lines.length)nextPage();
            }
          }
          note(f.hint);
        }
        function drawingPage() {
          nextPage();title('4.5 Rohrleitungsisometrie',true);
          const x=14,w=182,h=w*DRAW_HEIGHT/DRAW_WIDTH;
          doc.addImage(img,'PNG',x,y,w,h,'original-isometrie');
          doc.saveGraphicsState();doc.rect(x,y,w,h,null);doc.clip();doc.discardPath();
          doc.setDrawColor(21,63,113);doc.setFillColor(21,63,113);doc.setLineWidth(w/DRAW_WIDTH*3.6);doc.setLineCap('round');doc.setLineJoin('round');
          for(const stroke of data.drawing.strokes){
            const points=stroke.points.map(([px,py])=>[x+px*w,y+py*h]);
            if(points.length===1)doc.circle(points[0][0],points[0][1],w/DRAW_WIDTH*1.8,'F');
            else doc.path(points.map(([px,py],i)=>({op:i?'l':'m',c:[px,py]}))).stroke();
          }
          doc.restoreGraphicsState();nextPage();
        }
        header();metadataRow([['Objekt',data.fields.objekt],['Kunden Nr.',data.fields.kundenNr]]);metadataRow([['Name',data.fields.name],['Datum',data.fields.datum]]);y+=4;
        for(const section of schema.sections){
          title(section.title,true);
          for(const group of section.groups){
            if(group.drawing){drawingPage();continue;}
            if(group.title)title(group.title);
            note(group.hint);for(const field of group.fields)fieldRow(field);y+=3;
          }
        }
        for(let p=1;p<=doc.getNumberOfPages();p++){doc.setPage(p);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(80);doc.text('Seite '+p+' / '+doc.getNumberOfPages(),196,288,{align:'right'});}
        window.FSMOBILE_STAMP_PDF_LOGO(doc);
        const name=pdfFileName(data),zipName=name.replace(/\.pdf$/,'.zip');
        const payload={kind:'fsmobile-aufmass-export',version:1,moduleId:MODULE_ID,data};
        const zip=window.parent.fflate.zipSync({[name]:new Uint8Array(doc.output('arraybuffer')),[name.replace(/\.pdf$/,'.json')]:new TextEncoder().encode(JSON.stringify(payload,null,2))},{level:0});
        const blob=new Blob([zip],{type:'application/zip'});
        if(!window.parent.FSMOBILE_UI?.receiveExport(window,transaction,blob,zipName)){
          const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=zipName;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
        }
        notify('PDF-Export wurde erstellt.');return true;
      } catch(error){notify('PDF-Export konnte nicht erstellt werden. '+error.message);return false;}
      finally{busy=false;}
    }
    document.getElementById('planningForm').addEventListener('input',updateValue);
    document.getElementById('planningForm').addEventListener('change',updateValue);
    document.getElementById('planningForm').addEventListener('submit',e=>e.preventDefault());
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
    *{box-sizing:border-box}html{background:transparent;-webkit-text-size-adjust:100%}body{margin:0;background:transparent;color:#1c1c1e;font-family:Arial,sans-serif}.container{max-width:1200px;margin:auto;padding:20px}h1{font-size:34px;font-weight:850;margin:0 0 20px;line-height:1.15}button,input,textarea,select{font:inherit}button{min-height:44px;cursor:pointer}button:disabled{opacity:.45;cursor:default}.form-section{background:#fff;border:1px solid #d8dee7;border-radius:22px;padding:16px;margin-bottom:18px}.section-heading{font-size:23px;margin:0 0 18px;padding-left:12px;border-left:4px solid #ff9500}.planning-group+ .planning-group{margin-top:22px;border-top:1px solid #d8dee7;padding-top:16px}.planning-group h3{font-size:18px;line-height:1.35;margin:0 0 12px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}.field-group{display:flex;flex-direction:column;gap:6px;min-width:0}.field-group>span,.choice-label{font-size:14px;font-weight:650;line-height:1.35}.field-group input,.field-group select,.field-group textarea{width:100%;min-width:0;min-height:46px;padding:10px 12px;border:1px solid #bdc5d0;border-radius:10px;background:#fff;font-size:16px;color:#111}.field-group textarea{resize:none;overflow:hidden}.field-group.wide{grid-column:1/-1}.field-hint,.group-hint{font-size:13px;line-height:1.5;color:#4d5764;overflow-wrap:anywhere}.field-hint{display:block;margin-top:3px;font-weight:400}.group-hint{margin:0 0 12px}.choice-field{grid-column:1/-1;display:flex;align-items:flex-start;gap:12px;min-height:48px;padding:12px;border:1px solid #d8dee7;border-radius:14px;background:#fafbfc;cursor:pointer}.choice-field input{width:22px;height:22px;flex:none;margin:0;accent-color:#e48a00}.choice-field>span{min-width:0}.drawing-tools{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}.drawing-tools button{padding:10px 16px;border:1px solid #cad0d8;border-radius:999px;font-size:15px;font-weight:650;background:#eceef2;color:#253246}.drawing-tools [aria-pressed=true]{background:#ffdfad;border-color:#d28200;color:#472c00}.drawing-tools .danger{background:#ff3b30;color:#fff;border-color:#ff3b30}#isometryCanvas{display:block;width:min(100%,75.92vh);margin:0 auto;height:auto;aspect-ratio:492/421.25;background:#fff;border:1px solid #98a4b3;border-radius:4px;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden}#isometryCanvas *{pointer-events:none}.button-area{display:flex;gap:10px}.fsmobile-parent-actions-active .button-area{display:none}#importFile{display:none}.archive-overlay[hidden]{display:none}.archive-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:16px}.archive-dialog{width:min(860px,100%);max-height:90vh;display:flex;flex-direction:column;background:#fff;border-radius:22px;padding:20px}.archive-header{display:flex;justify-content:space-between;align-items:center;gap:12px}.archive-header h2{font-size:24px;margin:0}.archive-close-btn{min-width:44px;min-height:44px}.archive-filter-input{width:100%;min-height:46px;margin:14px 0}.archive-list{overflow:auto;min-height:0}.archive-item{padding:14px;border:1px solid #d8dee7;border-radius:16px;margin:10px 0}.archive-item-filtered-out{display:none!important}.archive-item-current{border-color:#ff9500}.archive-empty{padding:14px;color:#586273}.archive-item button{margin:8px 8px 0 0}.archive-detail-object{overflow-wrap:anywhere}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid>*{order:initial!important;grid-column:auto!important}@media(max-width:600px){.container{padding:10px}.form-grid{grid-template-columns:1fr}html#fsmobileUiRoot body:not(.generating-pdf) .aufmass-stammdaten.fsmobile-meta-grid{grid-template-columns:1fr!important}}`;
  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Planungshilfe einer LWÜ oder LWA</title><script defer src="vendor/jspdf.umd.min.js"></script><style>${css}</style></head><body><main class="container"><h1>Planungshilfe einer LWÜ oder LWA</h1><div class="global-actions"><button type="button" class="archive-save" data-global-action="save">Im Archiv speichern</button><button type="button" class="archive-btn" data-global-action="archive">Archiv</button><button type="button" class="fsmobile-data-import" data-global-action="import">Import</button><button type="button" class="clear-btn" data-global-action="clear">Leeren</button><button type="button" class="pdf-btn" data-global-action="pdf">PDF</button></div><form id="planningForm"><section class="form-section"><h2 class="section-heading">Zuordnung</h2><div id="metadataFields" class="form-grid aufmass-stammdaten"></div></section><div id="planningSections"></div></form><input type="file" id="importFile" accept=".json,.zip,application/json,application/zip"></main><div id="archiveOverlay" class="archive-overlay" hidden><div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle"><div class="archive-header"><h2 id="archiveTitle">Archiv – Planungshilfe einer LWÜ oder LWA</h2><button type="button" id="archiveCloseButton" class="archive-close-btn">Schließen</button></div><div class="archive-filter-tools"><input id="archiveFilter" class="archive-filter-input" type="search" placeholder="Objekt, Kunden Nr., Name, Datum …" aria-label="Archiv filtern"><span id="archiveFilterCount"></span></div><div id="archiveList" class="archive-list"></div></div></div><script>(${runtime.toString()})(${JSON.stringify(schema)});</script></body></html>`;
  window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  window.FSMOBILE_MODULES[moduleId] = { title: 'Planungshilfe einer LWÜ oder LWA', group:'Kalkulation', description:'Löschwasseranlagen und Löschwasserübergabestellen mit Rohrleitungsisometrie planen.', html, apiContract:{version:1,storage,capabilities} };
}());
