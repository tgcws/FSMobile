(function () {
  "use strict";

  const modules = window.FSMOBILE_MODULES = window.FSMOBILE_MODULES || {};
  const assetVersion = "345";
  const lazyModules = {
    "maengelliste": {
      title: "Mängelliste",
      group: "Arbeitsliste",
      description: "Mängel erfassen, archivieren und als PDF ausgeben.",
      src: "maengelliste.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"maengelliste-pwa-v2-formdata","archive":"maengelliste-pwa-v1-archive","pointer":"maengelliste-pwa-current-archive-id"},
        capabilities: {"draft":true,"archive":false,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "maengelliste-bilddoku": {
      title: "Mängelliste mit Bilddokumentation",
      group: "Arbeitsliste",
      description: "Mängel mit Fotos dokumentieren, archivieren und exportieren.",
      src: "maengelliste-bilddoku.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"maengelliste-bilddoku-pwa-v1-formdata","archive":"maengelliste-bilddoku-pwa-v1-archive","pointer":"maengelliste-bilddoku-pwa-current-archive-id"},
        capabilities: {"draft":true,"archive":false,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "aufmass-akku": {
      title: "Aufmaß Akku",
      group: "Aufmaß",
      description: "Akkudaten und Einbaudetails als Aufmaßblatt erfassen.",
      src: "aufmass-akku.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"aufmass-akku-form-v1","archive":"","pointer":""},
        capabilities: {"draft":true,"archive":false,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "aufmass-einsteckschloss": {
      title: "Aufmaß Einsteckschloss",
      group: "Aufmaß",
      description: "Einsteckschloss-Maße strukturiert aufnehmen und exportieren.",
      src: "aufmass-einsteckschloss.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"aufmass-einsteckschloss-form-v1","archive":"","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "aufmass-tueren": {
      title: "Aufmaß Türen",
      group: "Aufmaß",
      description: "Türmaße mit optionalem Bild erfassen und als PDF sichern.",
      src: "aufmass-tueren.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"aufmass-tueren-form-v1","archive":"","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "pb-rwa": {
      title: "Prüfbericht RWA-Anlagen",
      group: "Prüfbericht",
      description: "RWA-Anlagen mit dynamischen Feldern, Archiv und Signatur bearbeiten.",
      src: "pb-rwa.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"rwa_pruefbericht_formular_v1","archive":"rwa_pruefbericht_archiv_v1","pointer":"rwa_pruefbericht_current_archive_id"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-not-sicherheitsbeleuchtung": {
      title: "Prüfbericht Not-/Sicherheitsbeleuchtungen",
      group: "Prüfbericht",
      description: "Not- und Sicherheitsbeleuchtungen mit automatischem Prüfergebnis erfassen.",
      src: "pb-not-sicherheitsbeleuchtung.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-not-sicherheitsbeleuchtung-current-v1","archive":"pb-not-sicherheitsbeleuchtung-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-brandschutzklappen": {
      title: "Prüfbericht Brandschutzklappen",
      group: "Prüfbericht",
      description: "Brandschutzklappen mit Signalisierung, Funktion und Prüfbefund erfassen.",
      src: "pb-brandschutzklappen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-brandschutzklappen-current-v1","archive":"pb-brandschutzklappen-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-brandschutzschiebetor": {
      title: "Prüfbericht Brandschutzschiebetore",
      group: "Prüfbericht",
      description: "Brandschutzschiebetore mit RM-Anzahl, Schlupftür und Prüfbefund erfassen.",
      src: "pb-brandschutzschiebetor.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-brandschutzschiebetor-current-v1","archive":"pb-brandschutzschiebetor-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-brandschutzrolltore": {
      title: "Prüfbericht Brandschutzrolltore",
      group: "Prüfbericht",
      description: "Brandschutzrolltore und Sektionaltore mit Prüfergebnis erfassen.",
      src: "pb-brandschutzrolltore.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-brandschutzrolltore-current-v1","archive":"pb-brandschutzrolltore-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-rolltoranlagen": {
      title: "Prüfbericht Rolltoranlagen",
      group: "Prüfbericht",
      description: "Rolltoranlagen mit Torlauf, Steuerung und Ergebnis dokumentieren.",
      src: "pb-rolltoranlagen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-rolltoranlagen-current-v1","archive":"pb-rolltoranlagen-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-schiebetuerantrieb": {
      title: "Prüfbericht Schiebetürantriebe",
      group: "Prüfbericht",
      description: "Schiebetürantriebe mit Radar, Lichtschranke, Notaus und Prüfbefund erfassen.",
      src: "pb-schiebetuerantrieb.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-schiebetuerantrieb-current-v1","archive":"pb-schiebetuerantrieb-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-drehfluegelantrieb": {
      title: "Prüfbericht Drehflügelantriebe",
      group: "Prüfbericht",
      description: "Drehflügelantriebe mit Sensorik, Sicherheit und Ergebnis prüfen.",
      src: "pb-drehfluegelantrieb.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-drehfluegelantrieb-current-v1","archive":"pb-drehfluegelantrieb-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-rauchschutzvorhaenge": {
      title: "Prüfbericht Rauchschutzvorhänge",
      group: "Prüfbericht",
      description: "Rauchschutzvorhänge mit RM-Anzahl, Baujahr RM und Prüfbefund erfassen.",
      src: "pb-rauchschutzvorhaenge.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-rauchschutzvorhaenge-current-v1","archive":"pb-rauchschutzvorhaenge-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-feststellanlagen": {
      title: "Prüfbericht Feststellanlagen",
      group: "Prüfbericht",
      description: "Feststellanlagen mit RM-Anzahl, Handauslösung, Zentrale und Prüfbefund erfassen.",
      src: "pb-feststellanlagen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-feststellanlagen-current-v1","archive":"pb-feststellanlagen-archive-v1","pointer":""},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-fluchttuer-steuerungen": {
      title: "Prüfbericht Fluchttür-Steuerungen",
      group: "Prüfbericht",
      description: "Fluchttür-Steuerungen mit Haltemagnet, Türschließer, Entriegelung, Zentrale und Prüfbefund dokumentieren.",
      src: "pb-fluchttuer-steuerungen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-fluchttuer-steuerungen-current-v1","archive":"pb-fluchttuer-steuerungen-archive-v1","pointer":"pb-fluchttuer-steuerungen-current-archive-id-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-druckerhoehungsanlage": {
      title: "Prüfbericht Druckerhöhungsanlagen",
      group: "Prüfbericht",
      description: "Druckerhöhungsanlagen mit Messwerten, Prüfungen und Ergebnis erfassen.",
      src: "pb-druckerhoehungsanlage.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-druckerhoehungsanlage-report-v1","archive":"pb-druckerhoehungsanlage-report-archive-v1","pointer":"pb-druckerhoehungsanlage-current-archive-id"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-loeschwasser-trocken": {
      title: "Prüfbericht Löschwassereinrichtung Trocken",
      group: "Prüfbericht",
      description: "Trockene Löschwassereinrichtungen mit Hydranten-Messwerten dokumentieren.",
      src: "pb-loeschwasser-trocken.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-loeschwasser-trocken-report-v1","archive":"pb-loeschwasser-trocken-report-archive-v1","pointer":"pb-loeschwasser-trocken-current-archive-id"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-wandhydranten": {
      title: "Wandhydranten Einzelprüfung",
      group: "Prüfbericht",
      description: "Wandhydranten einzeln erfassen, archivieren und exportieren.",
      src: "pb-wandhydranten.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-wandhydranten-report-v1","archive":"pb-wandhydranten-report-archive-v1","pointer":"pb-wandhydranten-current-archive-id"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "anleitung-rwa-pyro": {
      title: "RWA Pyro",
      group: "Wartungsanleitung",
      description: "Prüfliste für pyrotechnische Rauchabzugsanlagen.",
      src: "anleitung-rwa-pyro.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-rwa-elektrisch": {
      title: "RWA Elektrisch",
      group: "Wartungsanleitung",
      description: "Prüfliste für elektrische Rauchabzugsanlagen.",
      src: "anleitung-rwa-elektrisch.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-rwa-co2": {
      title: "RWA CO2",
      group: "Wartungsanleitung",
      description: "Prüfliste für CO2-Rauchabzugsanlagen.",
      src: "anleitung-rwa-co2.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-fsa-1-flg": {
      title: "FSA 1-flg",
      group: "Wartungsanleitung",
      description: "Prüfliste für einflügelige Feststellanlagen.",
      src: "anleitung-fsa-1-flg.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-fsa-2-flg": {
      title: "FSA 2-flg",
      group: "Wartungsanleitung",
      description: "Prüfliste für zweiflügelige Feststellanlagen.",
      src: "anleitung-fsa-2-flg.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-dfa-1-flg": {
      title: "DFA 1-flg",
      group: "Wartungsanleitung",
      description: "Prüfliste für einflügelige Drehflügelantriebe.",
      src: "anleitung-dfa-1-flg.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-dfa-2-flg": {
      title: "DFA 2-flg",
      group: "Wartungsanleitung",
      description: "Prüfliste für zweiflügelige Drehflügelantriebe.",
      src: "anleitung-dfa-2-flg.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-bst-1-flg": {
      title: "BST 1-flg",
      group: "Wartungsanleitung",
      description: "Prüfliste für einflügelige Brandschutztüren.",
      src: "anleitung-bst-1-flg.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-bst-2-flg": {
      title: "BST 2-flg",
      group: "Wartungsanleitung",
      description: "Prüfliste für zweiflügelige Brandschutztüren.",
      src: "anleitung-bst-2-flg.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-zba": {
      title: "ZBA",
      group: "Wartungsanleitung",
      description: "Prüfliste für Zentralbatterieanlagen.",
      src: "anleitung-zba.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-sibel-ezb": {
      title: "SiBel EZB",
      group: "Wartungsanleitung",
      description: "Prüfliste für Einzelbatterieleuchten.",
      src: "anleitung-sibel-ezb.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-schiebetor": {
      title: "Schiebetor",
      group: "Wartungsanleitung",
      description: "Prüfliste für kraftbetätigte Schiebetore.",
      src: "anleitung-schiebetor.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-fluchttuer-steuerung": {
      title: "Fluchttür Steuerung",
      group: "Wartungsanleitung",
      description: "Prüfliste für Fluchtwegsteuerungen.",
      src: "anleitung-fluchttuer-steuerung.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-rolltore": {
      title: "Rolltore",
      group: "Wartungsanleitung",
      description: "Prüfliste für Rolltore und Rollgitter.",
      src: "anleitung-rolltore.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-bsk": {
      title: "BSK",
      group: "Wartungsanleitung",
      description: "Prüfliste für Brandschutzklappen.",
      src: "anleitung-bsk.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "anleitung-bs-vorhang": {
      title: "BS-Vorhang",
      group: "Wartungsanleitung",
      description: "Prüfliste für Brandschutzvorhänge.",
      src: "anleitung-bs-vorhang.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "pb-rauchwarnmelder": {
      title: "Prüfbericht Rauchwarnmelder",
      group: "",
      description: "Rauchwarnmelder mit Standort, Typ, Baujahr und Prüfbefund dokumentieren.",
      src: "pb-rauchwarnmelder.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-rauchwarnmelder-current-v1","archive":"pb-rauchwarnmelder-archive-v1","pointer":"pb-rauchwarnmelder-current-archive-id-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "auftrag-bescheinigungen": {
      title: "Auftrag Bescheinigungen",
      group: "Kalkulation",
      description: "Auftrags- und Projektdaten für Bescheinigungen erfassen, archivieren und als PDF ausgeben.",
      src: "auftrag-bescheinigungen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"auftrag-bescheinigungen-current-v1","archive":"auftrag-bescheinigungen-archive-v1","pointer":"auftrag-bescheinigungen-current-archive-id-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "pb-druckpruefung-din-14462": {
      title: "Druckprüfung DIN 14462",
      group: "Prüfberichte",
      description: "Druckprüfungen von Löschwasserleitungen nach DIN 14462 mit Prüfdrücken, Voraussetzungen und zwei Unterschriften dokumentieren.",
      src: "druckpruefung-din-14462.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-druckpruefung-din-14462-current-v1","archive":"pb-druckpruefung-din-14462-archive-v1","pointer":"pb-druckpruefung-din-14462-current-archive-id-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "planungshilfe-bma": {
      title: "Planungshilfe BMA",
      group: "Kalkulation",
      description: "Herstellerneutrale Planungshilfe für Brandmelde- und Brandwarnanlagen mit Archiv und PDF-Export.",
      src: "planungshilfe-bma.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"planungshilfe-bma-current-v1","archive":"planungshilfe-bma-archive-v1","pointer":"planungshilfe-bma-current-archive-id-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-feuerloescher": {
      title: "Prüfbericht Feuerlöscher",
      group: "Prüfbericht",
      description: "Feuerlöscher-Prüfberichte mit Archiv und PDF-Export erstellen.",
      src: "pb-feuerloescher.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-feuerloescher-current-v2","archive":"pb-feuerloescher-archive-v2","pointer":"pb-feuerloescher-current-archive-id-v2"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-brandschutztueren": {
      title: "Prüfbericht Brandschutztüren",
      group: "Prüfbericht",
      description: "Brandschutztüren mit automatischer Prüfbefund-Logik erfassen.",
      src: "pb-brandschutztueren.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"pb-brandschutztueren-current-v2","archive":"pb-brandschutztueren-archive-v2","pointer":"pb-brandschutztueren-current-archive-id-v2"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "maengel-bt-fsa": {
      title: "Mängelbeschreibung Brandschutztüren/Feststellanlagen",
      group: "Mängelbeschreibungen",
      description: "Typische Mängel an Brandschutztüren, Toren und Feststellanlagen.",
      src: "maengel-bt-fsa.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "maengel-bsk": {
      title: "Mängelbeschreibung Brandschutzklappen",
      group: "Mängelbeschreibungen",
      description: "Mängeltexte für Brandschutzklappen, Einbausituationen und Auslösungen.",
      src: "maengel-bsk.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "maengel-automatiktueren": {
      title: "Mängelbeschreibung Automatiktüren",
      group: "Mängelbeschreibungen",
      description: "Mängeltexte für automatische Türen, Schiebetür- und Drehflügelantriebe.",
      src: "maengel-automatiktueren.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "maengel-not-sicherheitsleuchte": {
      title: "Mängelbeschreibung Not- und Sicherheitsleuchte",
      group: "Mängelbeschreibungen",
      description: "Mängeltexte für Not- und Sicherheitsleuchten, Akkus und Piktogramme.",
      src: "maengel-not-sicherheitsleuchte.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "maengel-rauchwarnmelder": {
      title: "Mängelbeschreibung Rauchwarnmelder",
      group: "Mängelbeschreibungen",
      description: "Mängeltexte und Kürzel für Rauchwarnmelder und Funkmodule.",
      src: "maengel-rauchwarnmelder.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"","archive":"","pointer":""},
        capabilities: {"draft":false,"archive":false,"pdf":false,"signatures":false,"import":false,"export":false}
      }
    },
    "maengelliste-maengelbeschreibungen": {
      title: "Mängelliste-MB",
      group: "Arbeitsliste",
      description: "Mängel erfassen, passende Mängelbeschreibung übernehmen, archivieren und als PDF ausgeben.",
      src: "maengelliste-maengelbeschreibungen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"maengelliste-maengelbeschreibungen-pwa-v1","archive":"maengelliste-maengelbeschreibungen-pwa-v1-archive","pointer":"maengelliste-maengelbeschreibungen-pwa-current-archive-id"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "aufmass-brandabschottungen": {
      title: "Aufmaß Brandabschottungen",
      group: "Aufmaß",
      description: "Brandabschottungen mit Bild, Standort, Art, Maßen und Wandbeschaffenheit erfassen.",
      src: "aufmass-brandabschottungen.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"fsmobile-aufmass-brandabschottungen-form-v1","archive":"fsmobile-aufmass-brandabschottungen-archive-v1","pointer":"fsmobile-aufmass-brandabschottungen-archive-current-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":false,"import":false,"export":false}
      }
    },
    "pb-zentralbatterie-anlage": {
      title: "Prüfbericht Zentralbatterie-Anlage",
      group: "Prüfberichte",
      description: "Zentralbatterie-Anlage prüfen, Messwerte erfassen, archivieren und als PDF ausgeben.",
      src: "pb-zentralbatterie-anlage.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"fsmobile-pb-zentralbatterie-v1","archive":"fsmobile-pb-zentralbatterie-archive-v1","pointer":"fsmobile-pb-zentralbatterie-current-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-loeschwasser-nass": {
      title: "Prüfbericht Löschwassereinrichtung Nass",
      group: "Prüfberichte",
      description: "Nasse Löschwassereinrichtungen mit Wandhydranten, Wasseranschluss, Messwerten und Schlauchprüfung dokumentieren.",
      src: "pb-loeschwasser-nass.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"fsmobile-pb-loeschwasser-nass-v1","archive":"fsmobile-pb-loeschwasser-nass-archive-v1","pointer":"fsmobile-pb-loeschwasser-nass-current-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-nass-trocken-station": {
      title: "Prüfbericht Nass/Trocken-Station",
      group: "Prüfberichte",
      description: "Nass/Trocken-Stationen mit Pumpenprüfung, Messwerten, Anlagendaten und Wasseranschluss dokumentieren.",
      src: "pb-nass-trocken-station.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"fsmobile-pb-nass-trocken-station-v1","archive":"fsmobile-pb-nass-trocken-station-archive-v1","pointer":"fsmobile-pb-nass-trocken-station-current-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    },
    "pb-hydranten": {
      title: "Prüfbericht Hydranten",
      group: "Prüfberichte",
      description: "Hydranten, Löschwasserbehälter, Brunnen und Saugstellen mit Messwerten dokumentieren.",
      src: "pb-hydranten.js?v=345",
      apiContract: {
        version: 1,
        storage: {"current":"fsmobile-pb-hydranten-v1","archive":"fsmobile-pb-hydranten-archive-v1","pointer":"fsmobile-pb-hydranten-current-v1"},
        capabilities: {"draft":true,"archive":true,"pdf":true,"signatures":true,"import":false,"export":false}
      }
    }
  };

  Object.entries(lazyModules).forEach(([moduleId, definition]) => {
    if (modules[moduleId] && typeof modules[moduleId].html === "string") return;
    modules[moduleId] = {
      title: definition.title,
      group: definition.group,
      description: definition.description,
      lazy: Object.freeze({ src: definition.src }),
      apiContract: Object.freeze({
        version: definition.apiContract.version,
        storage: Object.freeze({ ...definition.apiContract.storage }),
        capabilities: Object.freeze({ ...definition.apiContract.capabilities })
      })
    };
  });

  window.FSMOBILE_MODULE_MANIFEST = Object.freeze({
    version: 1,
    assetVersion,
    lazyModuleIds: Object.freeze(Object.keys(lazyModules))
  });
}());
