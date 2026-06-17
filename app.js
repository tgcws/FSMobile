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
  const updateToast = document.getElementById("updateToast");
  const updateButton = document.getElementById("updateButton");
  const menuOptionsButton = document.getElementById("menuOptionsButton");
  const optionsOverlay = document.getElementById("optionsOverlay");
  const optionsCloseButton = document.getElementById("optionsCloseButton");
  const archiveBackupExportButton = document.getElementById("archiveBackupExportButton");
  const archiveBackupImportButton = document.getElementById("archiveBackupImportButton");
  const archiveDeleteButton = document.getElementById("archiveDeleteButton");
  const archiveDeleteConfirm = document.getElementById("archiveDeleteConfirm");
  const archiveDeleteCancelButton = document.getElementById("archiveDeleteCancelButton");
  const archiveDeleteConfirmButton = document.getElementById("archiveDeleteConfirmButton");
  const archiveBackupFile = document.getElementById("archiveBackupFile");
  const archiveBackupStatus = document.getElementById("archiveBackupStatus");
  const OLD_PASS_HASH_KEY = "fsmobile-unified-passhash-v1";
  const AUTH_UNLOCK_KEY = "fsmobile-auth-unlocked-v2";
  const AUTH_UNLOCK_VALUE = "confirmed";
  const UPDATE_RELOAD_KEY = "fsmobile-update-reload-v1";
  const REQUIRED_PASS_HASH = "745731644d9e569b873095e3a2a5a3fae47202b83d2d5879397ea14415edee95";
  let isUnlocked = false;
  let activeModuleId = null;
  let actionSyncTimer = 0;
  let actionStatusTimer = 0;
  let brandTransitionTimer = 0;
  let titleStartAnimationPending = document.body.classList.contains("app-start-pending");
  let titleStartAnimationTimer = 0;
  let optionsCloseTimer = 0;
  let viewTransitionTimers = [];

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
        "aufmass-tueren",
        "aufmass-brandabschottungen"
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
        "pb-rauchwarnmelder",
        "pb-brandschutzschiebetor",
        "pb-brandschutzrolltore",
        "pb-rolltoranlagen",
        "pb-schiebetuerantrieb",
        "pb-drehfluegelantrieb",
        "pb-rauchschutzvorhaenge",
        "pb-feststellanlagen",
        "pb-druckerhoehungsanlage",
        "pb-nass-trocken-station",
        "pb-loeschwasser-trocken",
        "pb-loeschwasser-nass",
        "pb-zentralbatterie-anlage",
        "pb-wandhydranten",
        "pb-hydranten"
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
    },
    {
      id: "maengelbeschreibungen",
      title: "Mängelbeschreibungen",
      accent: "accent-indigo",
      modules: [
        "maengel-bt-fsa",
        "maengel-bsk",
        "maengel-automatiktueren",
        "maengel-not-sicherheitsleuchte",
        "maengel-rauchwarnmelder"
      ]
    }
  ];

  const CARD_TITLES = {
    "aufmass-brandabschottungen": "Brandabschottungen",
    "pb-feuerloescher": "Feuerlöscher",
    "pb-brandschutztueren": "Brandschutztüren",
    "pb-rwa": "RWA-Anlagen",
    "pb-not-sicherheitsbeleuchtung": "Not-/Sicherheitsbeleuchtungen",
    "pb-brandschutzklappen": "Brandschutzklappen",
    "pb-rauchwarnmelder": "Rauchwarnmelder",
    "pb-brandschutzschiebetor": "Brandschutzschiebetore",
    "pb-brandschutzrolltore": "Brandschutzrolltore",
    "pb-rolltoranlagen": "Rolltoranlagen",
    "pb-schiebetuerantrieb": "Schiebetürantriebe",
    "pb-drehfluegelantrieb": "Drehflügelantriebe",
    "pb-rauchschutzvorhaenge": "Rauchschutzvorhänge",
    "pb-feststellanlagen": "Feststellanlagen",
    "pb-druckerhoehungsanlage": "Druckerhöhungsanlagen",
    "pb-nass-trocken-station": "Nass/Trocken-Station",
    "pb-loeschwasser-trocken": "Löschwassereinrichtung Trocken",
    "pb-loeschwasser-nass": "Löschwassereinrichtung Nass",
    "pb-zentralbatterie-anlage": "Zentralbatterie-Anlage",
    "pb-hydranten": "Hydranten",
    "anleitung-rwa-pyro": "RWA Pyro",
    "anleitung-rwa-elektrisch": "RWA Elektrisch",
    "anleitung-rwa-co2": "RWA CO2",
    "maengel-bt-fsa": "Brandschutztüren / Feststellanlagen",
    "maengel-bsk": "Brandschutzklappen",
    "maengel-automatiktueren": "Automatiktüren",
    "maengel-not-sicherheitsleuchte": "Not- und Sicherheitsleuchte",
    "maengel-rauchwarnmelder": "Rauchwarnmelder"
  };

  const KICKERS = {
    kalkulation: "Kalkulation",
    pruefberichte: "Prüfbericht",
    wartungsanleitungen: "Wartung",
    maengelbeschreibungen: "Mangel"
  };

  const MODULE_ACCENT_CLASSES = [
    "module-accent-kalkulation",
    "module-accent-pruefberichte",
    "module-accent-wartungsanleitungen",
    "module-accent-maengelbeschreibungen"
  ];

  const DEFECT_DESCRIPTION_MODULES = [
    {
      id: "maengel-bt-fsa",
      title: "Mängelbeschreibung Brandschutztüren/Feststellanlagen",
      cardDescription: "Typische Mängel an Brandschutztüren, Toren und Feststellanlagen.",
      eyebrow: "Brandschutztüren / Feststellanlagen",
      items: [
        "Tür, (-Tor) schließt nicht selbstständig",
        "Tür, (-Tor)blatt schleift",
        "Tür, (-Tor)blatt defekt / Zarge defekt",
        "Türblatt verriegelt nicht (Falle)",
        "Federband defekt / nicht einstellbar",
        "Federband nicht eingestellt",
        "Obentürschließer defekt",
        "Obentürschließer fehlt",
        "Staudruck im Raum (Türschließer montieren)",
        "Schließzylinder / Blindzylinder fehlt",
        "Beschlag lose",
        "Beschlag defekt",
        "Beschlag nach DIN 18273 nicht konform",
        "Einsteckschloss defekt",
        "Panikschloss fehlt / ist erforderlich",
        "Tür bzw. Zargendichtung fehlt",
        "Tür bzw. Zargendichtung defekt",
        "Absenkbare Bodendichtung fehlt",
        "Absenkbare Bodendichtung defekt",
        "Zarge nicht ordnungsgemäß befestigt",
        "Zarge nicht ordnungsgemäß vermörtelt",
        "Spaltmaß Türblatt - Boden zu groß",
        "Spaltmaß Türblatt - Zarge zu groß",
        "Hinweis: Tür besitzt offensichtlich keine bauaufsichtliche Zulassung",
        "Mechanische Feststellvorrichtung ist zu demontieren",
        "Tür/Zarge bestehende Löcher verschließen",
        "Bodenbelag Trennung fehlt",
        "Verglasung defekt",
        "Verglasung ohne Zulassung",
        "Tür verstellt / nicht zugänglich",
        "Nicht zugelassene Bauteile verbaut",
        "Wartung kann durch Umbaumaßnahmen nicht durchgeführt werden",
        "Schließfolgeregelung fehlt",
        "Schließfolgeregelung defekt",
        "Treibriegelstange verriegelt nicht",
        "Treibriegelstange lässt sich nicht lösen",
        "Mitnehmerklappe fehlt",
        "Feststellanlage defekt",
        "Rauchmeldezentrale defekt",
        "Feststell-/Rauchmeldezentrale nach DIN 14677 nicht abgenommen",
        "Rauchmelder defekt",
        "Rauchmelder fehlt",
        "Rauchmelder falsch angeordnet",
        "Rauchmelder falsch verdrahtet / ohne Funktion",
        "Rauchmelder zu alt nach DIN 14677",
        "Rauchschaltplatine defekt",
        "Rauchschaltplatine zu alt nach DIN 14677",
        "Die Feststellanlage wird durch die BMA angesteuert (keine eigenen Rauchmelder)",
        "Netzteil defekt",
        "Haltemagnet ist lose",
        "Elektromagnetische Feststellung lose / defekt",
        "Anbauteile haben keine Zulassung in Verbindung mit Feststellanlage",
        "Taster \"Tür zu\" ohne Funktion",
        "Taster \"Tür zu\" nicht beschriftet",
        "Taster \"Tür zu\" nicht vorhanden bei Haftmagnetanlagen",
        "Türöffner nachträglich in die Zarge eingefräst (ohne Zulassung)",
        "Türöffner ist nicht als Brandschutztüröffner ausgeführt",
        "Türöffner ist nicht als Rauchschutztüröffner ausgeführt (Fluchtweg)",
        "Elektrischer Türöffner defekt"
      ]
    },
    {
      id: "maengel-bsk",
      title: "Mängelbeschreibung Brandschutzklappen",
      cardDescription: "Mängeltexte für Brandschutzklappen, Einbausituationen und Auslösungen.",
      eyebrow: "Brandschutzklappen",
      items: [
        "Nicht zugänglich",
        "Revisionsöffnung zu klein (600x600mm nach VDI 3803)",
        "Revisionsöffnung sitzt falsch",
        "Revisionsöffnung fehlt",
        "Revisionsdeckel der BSK nicht zugänglich",
        "Zugang zur BSK durch Einbauten / Mobiliar verhindert",
        "Einbauort stimmt nicht mit Revisionsplan überein",
        "Im Plan verzeichnete BSK fehlt",
        "BSK schließt nicht einwandfrei",
        "BSK verriegelt nicht",
        "Die Handauslösung klemmt an anderen Teilen",
        "Die innere Mechanik ist beschädigt",
        "Die äußere Mechanik ist beschädigt / vermörtelt",
        "Das Klappenblatt ist beschädigt",
        "Die BSK ist stark korrodiert",
        "Das Auslöseelement (Schmelzlot) fehlt",
        "Das Auslöseelement wurde durch falsches Material ersetzt",
        "Der Endschalter wird nicht betätigt",
        "Die innenliegenden Dichtungen sind beschädigt",
        "Elektrische oder pneumatische Ansteuerung defekt",
        "Auslösung über Rauchmelder ohne Funktion",
        "Auslösung über Prüfschalter ohne Funktion",
        "Sonstige Fernauslösung ohne Funktion",
        "Keine Meldung ans Tableau / Schaltschrank",
        "Meldung ans Tableau / Schaltschrank vertauscht",
        "Endschalter defekt",
        "Die Bezeichnung der BSK fehlt",
        "Die Bezeichnung der BSK ist falsch",
        "Die Bezeichnung der BSK ist vertauscht",
        "Die Bezeichnung der BSK an der Revisionsöffnung / Decke fehlt",
        "Die BSK besitzt kein Prüfzeichen / Typenschild",
        "Die BSK ist nicht vollständig eingemörtelt",
        "Die BSK ist nicht flächenbündig eingebaut",
        "Beim Einbau wurden ungeeignete Materialien verwendet",
        "Einbau mit loser Mineralwolle ausgeführt",
        "Mit Mineralwolle verfüllter Spalt ist zu groß (>50mm)",
        "Es wurde falsche Mineralwolle (Schmelzpunkt >1000°C) eingebaut",
        "Der Einbauabstand zur Nebenklappe ist zu gering",
        "Der Abstand zu anderen Bauteilen ist zu gering",
        "Einbau in GK-Wand nicht nach Zulassung",
        "Mineralwollausstopfung fehlt",
        "Einbaurahmen fehlt",
        "Aufbau der GK-Wand nicht nach Zulassung der BSK (U-Profil)",
        "Flexibler Stutzen fehlt",
        "Der flexible Stutzen hat nicht die erforderliche Dehnungsaufnahme (10cm)",
        "Das Klappenblatt ragt in den flexiblen Stutzen",
        "Die Einbauart ist nicht zugelassen",
        "Die Abhängung fehlt",
        "Der L90 Anschluss ist nicht nach Zulassung ausgeführt",
        "Schutzgitter fehlt",
        "Potentialausgleich am flexiblen Stutzen fehlt"
      ],
      infoSections: [
        {
          title: "Hinweise",
          entries: [
            "A) BSK mit Baujahr vor 1980/1981 enthalten Asbest",
            "BSK mit Baujahr vor 1988 enthalten i.d.R. Dichtungen mit Asbest"
          ]
        },
        {
          title: "Typ",
          entries: [
            "BSK: Brandschutzklappe",
            "BSE: Brandschutzelement",
            "BSV: Brandschutzventil"
          ]
        }
      ]
    },
    {
      id: "maengel-automatiktueren",
      title: "Mängelbeschreibung Automatiktüren",
      cardDescription: "Mängeltexte für automatische Türen, Schiebetür- und Drehflügelantriebe.",
      eyebrow: "Automatiktüren",
      items: [
        "Antrieb defekt",
        "Hebelarm defekt",
        "Tür mechanisch defekt",
        "Not / Aus defekt",
        "Not / Aus nicht vorhanden",
        "Sicherheitssensorleiste defekt",
        "Sicherheitssensorleiste nicht vorhanden (Gangflügel - Bandseite)",
        "Sicherheitssensorleiste nicht vorhanden (Gangflügel - Bandgegenseite)",
        "Sicherheitssensorleiste nicht vorhanden (Standflügel - Bandseite)",
        "Sicherheitssensorleiste nicht vorhanden (Standflügel - Bandgegenseite)",
        "Lichtschranke / IR Vorhang defekt",
        "Lichtschranke / IR Vorhang fehlt",
        "Radaröffnungsmelder defekt",
        "Taster \"Tür auf\" defekt",
        "Taster \"Tür schließen\" fehlt",
        "Taster \"Tür schließen\" defekt",
        "Türöffner defekt",
        "Riegelschaltkontakt defekt",
        "Riegelschaltkontakt fehlt",
        "Rauchmeldezentrale defekt",
        "Rauchmeldezentrale fehlt",
        "Deckenrauchmelder defekt",
        "Deckenrauchmelder fehlt",
        "Programmschalter defekt",
        "Schließfolgeregelung fehlt",
        "Schließfolgeregelung defekt",
        "Treibriegelstange entriegelt nicht",
        "Treibriegelstange verriegelt nicht",
        "Absenkbare Bodendichtung fehlt",
        "Absenkbare Bodendichtung defekt",
        "Tür bzw. Zargendichtung fehlt",
        "Tür bzw. Zargendichtung defekt"
      ]
    },
    {
      id: "maengel-not-sicherheitsleuchte",
      title: "Mängelbeschreibung Not- und Sicherheitsleuchte",
      cardDescription: "Mängeltexte für Not- und Sicherheitsleuchten, Akkus und Piktogramme.",
      eyebrow: "Not- und Sicherheitsleuchte",
      items: [
        "Leuchtmittel defekt",
        "Akku defekt",
        "Akku älter als 4 Jahre",
        "NiCd Akku älter als 4 Jahre",
        "Leuchte defekt",
        "Leuchte ohne Strom",
        "Stromkreis Kennzeichnung fehlt",
        "Piktogramm falsch",
        "Hinweis: Norm Vermischung der Piktogramme"
      ]
    },
    {
      id: "maengel-rauchwarnmelder",
      title: "Mängelbeschreibung Rauchwarnmelder",
      cardDescription: "Mängeltexte und Kürzel für Rauchwarnmelder und Funkmodule.",
      eyebrow: "Rauchwarnmelder",
      items: [
        "Rauchmelder defekt",
        "Rauchmelder fehlt",
        "Rauchmelder hat max. Alter überschritten",
        "Testtaste defekt",
        "Funkvernetzung außer Funktion",
        "Funkmodul fehlt",
        "Rauchmelder verschmutzt",
        "Rauchmelder muss ummontiert werden aufgrund von Umgebungseinflüssen"
      ],
      infoSections: [
        {
          title: "Hinweise",
          entries: [
            "L: Lithium Batterie erneuert Typ 9V",
            "A9: Alkalische Batterie erneuert Typ 9V",
            "AM: Alkalische Batterie erneuert Typ Mignon"
          ]
        }
      ]
    }
  ];

  DEFECT_DESCRIPTION_MODULES.forEach(config => {
    registry[config.id] = registry[config.id] || {
      title: config.title,
      group: "Mängelbeschreibungen",
      description: config.cardDescription,
      html: defectDescriptionHtml(config)
    };
  });

  function escapeDefectText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function defectDescriptionHtml(config) {
    const rows = config.items.map((item, index) => `
        <li class="defect-row">
          <span class="defect-number">${index + 1}</span>
          <span class="defect-text">${escapeDefectText(item)}</span>
        </li>`).join("");
    const infoSections = (config.infoSections || []).map(section => `
        <section class="info-card">
          <h2>${escapeDefectText(section.title)}</h2>
          <ul>
            ${section.entries.map(entry => `<li>${escapeDefectText(entry)}</li>`).join("")}
          </ul>
        </section>`).join("");

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${escapeDefectText(config.title)}</title>
  <meta name="theme-color" content="#5856d6" />
  <style>
    :root {
      --accent: #5856d6;
      --accent-rgb: 88, 86, 214;
      --text: #172033;
      --muted: #5f6b80;
      --line: rgba(255,255,255,.42);
      --surface: rgba(255,255,255,.08);
      --surface-soft: rgba(255,255,255,.045);
      --radius: 20px;
      --ease: cubic-bezier(.22,1,.36,1);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Arial, sans-serif;
    }

    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; background: transparent; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--text);
      background: transparent;
      -webkit-font-smoothing: antialiased;
    }

    .defect-page {
      width: min(1080px, 100%);
      margin: 0 auto;
      padding: clamp(18px, 3vw, 30px);
    }

    .hero,
    .list-card,
    .info-card {
      border: 1px solid var(--line);
      background:
        linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.07) 58%, rgba(var(--accent-rgb), .055)),
        var(--surface);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.3),
        0 16px 38px rgba(2,8,23,.08);
      -webkit-backdrop-filter: blur(22px) saturate(1.12);
      backdrop-filter: blur(22px) saturate(1.12);
    }

    .hero {
      padding: clamp(18px, 3vw, 26px);
      border-radius: 24px;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: rgba(var(--accent-rgb), .95);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: rgba(17,24,39,.94);
      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.06;
      font-weight: 900;
      letter-spacing: 0;
      text-shadow: 0 1px 0 rgba(255,255,255,.45);
    }

    .hero-meta {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      margin-top: 18px;
      padding: 7px 12px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: 999px;
      color: rgba(17,24,39,.78);
      background: rgba(var(--accent-rgb), .12);
      font-size: 13px;
      font-weight: 850;
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
      margin-top: 18px;
    }

    .list-card,
    .info-card {
      border-radius: var(--radius);
      overflow: hidden;
    }

    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 54px;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255,255,255,.34);
      background: rgba(var(--accent-rgb), .14);
    }

    .section-title h2,
    .info-card h2 {
      margin: 0;
      color: rgba(17,24,39,.9);
      font-size: 18px;
      line-height: 1.2;
      font-weight: 900;
    }

    .count-pill {
      flex: 0 0 auto;
      min-height: 30px;
      padding: 6px 10px;
      border-radius: 999px;
      color: #fff;
      background: linear-gradient(180deg, rgba(255,255,255,.2), rgba(0,0,0,.02)), var(--accent);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.26), 0 8px 16px rgba(var(--accent-rgb), .18);
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .defect-list,
    .info-card ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .defect-row {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      min-height: 46px;
      padding: 8px 16px;
      border-bottom: 1px solid rgba(255,255,255,.28);
      background: rgba(255,255,255,.035);
    }

    .defect-row:nth-child(even) {
      background: rgba(255,255,255,.065);
    }

    .defect-row:last-child {
      border-bottom: 0;
    }

    .defect-number {
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255,255,255,.36);
      border-radius: 999px;
      color: rgba(17,24,39,.82);
      background: rgba(var(--accent-rgb), .12);
      font-size: 13px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
    }

    .defect-text,
    .info-card li {
      color: rgba(17,24,39,.88);
      font-size: 15px;
      font-weight: 760;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .info-card {
      padding: 16px 18px;
    }

    .info-card ul {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .info-card li {
      min-height: 34px;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,.28);
      border-radius: 12px;
      background: var(--surface-soft);
    }

    @media (max-width: 700px) {
      .defect-page { padding: 14px; }
      .section-title { align-items: flex-start; flex-direction: column; }
      .defect-row { grid-template-columns: 34px minmax(0, 1fr); padding-inline: 12px; }
      .defect-text, .info-card li { font-size: 14px; }
    }
  </style>
</head>
<body>
  <main class="defect-page">
    <header class="hero">
      <p class="eyebrow">${escapeDefectText(config.eyebrow || "Mängelbeschreibung")}</p>
      <h1>${escapeDefectText(config.title)}</h1>
      <div class="hero-meta">${config.items.length} Einträge</div>
    </header>
    <div class="content-grid">
      <section class="list-card">
        <div class="section-title">
          <h2>Mängelbeschreibung</h2>
          <span class="count-pill">${config.items.length}</span>
        </div>
        <ol class="defect-list">
          ${rows}
        </ol>
      </section>
      ${infoSections}
    </div>
  </main>
</body>
</html>`;
  }

  registry["aufmass-brandabschottungen"] = registry["aufmass-brandabschottungen"] || {
    title: "Aufmaß Brandabschottungen",
    group: "Aufmaß",
    description: "Brandabschottungen mit Bild, Standort, Art, Maßen und Wandbeschaffenheit erfassen.",
    html: fireStoppingMeasurementHtml()
  };

  function fireStoppingMeasurementHtml() {
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Aufmaß Brandabschottungen</title>
  <meta name="theme-color" content="#ff9500" />
  <meta name="application-name" content="Aufmaß Brandabschottungen" />
  <script defer src="vendor/jspdf.umd.min.js"></script>
  <style>
    :root {
      --primary:#007aff; --accent:#ff9500; --success:#34c759; --danger:#ff3b30; --neutral:#8e8e93;
      --text:#1c1c1e; --muted:#6e6e73; --line:rgba(60,60,67,.14); --field:rgba(255,255,255,.055);
      --radius-lg:22px; --radius-md:14px; --radius-sm:10px; --shadow:0 12px 34px rgba(0,0,0,.08);
      --ios-ease:cubic-bezier(.2,.8,.2,1);
    }
    *{box-sizing:border-box}
    html{-webkit-text-size-adjust:100%;background:transparent}
    body{margin:0;min-height:100vh;background:transparent;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Segoe UI",Arial,sans-serif}
    .container{width:min(100%,1280px);margin:0 auto;padding:18px}
    .title-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;padding:4px 2px}
    h1{margin:0;text-align:left;font-size:34px;line-height:1.08;font-weight:800;letter-spacing:0}
    h2{margin:0 0 12px;font-size:19px;line-height:1.15;font-weight:800;letter-spacing:0}
    .section,.table-shell,.title-actions,.button-area{background:linear-gradient(145deg,rgba(255,255,255,.24),rgba(255,255,255,.1) 52%,rgba(255,255,255,.04)),rgba(255,255,255,.065);border:1px solid rgba(255,255,255,.46);border-radius:var(--radius-lg);box-shadow:var(--shadow),inset 0 1px 0 rgba(255,255,255,.32);-webkit-backdrop-filter:blur(18px) saturate(1.08);backdrop-filter:blur(18px) saturate(1.08)}
    .section{margin-bottom:14px;padding:14px}
    .header-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .field-group{display:flex;min-width:0;flex-direction:column;gap:5px}
    .header-grid .field-group>input{display:block;min-width:0;max-width:100%}
    label{padding-left:2px;color:var(--muted);font-size:12px;line-height:1.15;font-weight:700;letter-spacing:0}
    input,select,textarea,button{font:inherit}
    input:not([type="file"]),select,textarea{width:100%;min-height:38px;padding:8px 11px;border:1px solid rgba(255,255,255,.34);border-radius:var(--radius-sm);color:var(--text);background:var(--field);font-size:14px;line-height:1.2;box-shadow:inset 0 1px 0 rgba(255,255,255,.22)}
    .table-shell select,.table-shell input[type="number"]{min-height:44px}
    textarea{display:block;min-height:44px;resize:none;overflow:hidden;line-height:1.35}
    input:focus,select:focus,textarea:focus{outline:none;border-color:rgba(0,122,255,.45);box-shadow:0 0 0 4px rgba(0,122,255,.12)}
    .title-actions,.button-area{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;padding:12px}
    .button-area{justify-content:flex-start;margin-top:14px}
    button{min-height:46px;padding:12px 18px;border:0;border-radius:999px;cursor:pointer;color:#fff;background:linear-gradient(180deg,#1688ff 0%,var(--primary) 100%);font-size:15px;font-weight:700;letter-spacing:0;box-shadow:0 10px 20px rgba(0,122,255,.24),inset 0 1px 0 rgba(255,255,255,.32);transition:transform .18s var(--ios-ease),box-shadow .18s var(--ios-ease),filter .18s var(--ios-ease);-webkit-tap-highlight-color:transparent}
    button:hover{filter:brightness(1.02)}
    button:active{transform:scale(.975)}
    button:disabled{opacity:.55;cursor:default;transform:none}
    .archive-save{background:linear-gradient(180deg,#ffad33 0%,var(--accent) 100%);box-shadow:0 10px 20px rgba(255,149,0,.24),inset 0 1px 0 rgba(255,255,255,.32)}
    .archive-open,.pdf-btn{background:linear-gradient(180deg,#1688ff 0%,var(--primary) 100%)}
    .clear-btn,.secondary{background:linear-gradient(180deg,#a6a6ad 0%,var(--neutral) 100%);box-shadow:0 10px 20px rgba(142,142,147,.22),inset 0 1px 0 rgba(255,255,255,.28)}
    .success{background:linear-gradient(180deg,#40d96a 0%,var(--success) 100%);box-shadow:0 10px 20px rgba(52,199,89,.22),inset 0 1px 0 rgba(255,255,255,.28)}
    .danger{background:linear-gradient(180deg,#ff453a 0%,var(--danger) 100%);box-shadow:0 10px 20px rgba(255,59,48,.22),inset 0 1px 0 rgba(255,255,255,.28)}
    .table-shell{overflow-x:auto;overflow-y:hidden}
    table{width:100%;min-width:1110px;border-collapse:separate;border-spacing:0;table-layout:fixed}
    th,td{padding:10px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:top;background:rgba(255,255,255,.045);overflow-wrap:anywhere;word-break:break-word}
    th:last-child,td:last-child{border-right:0} tbody tr:last-child td{border-bottom:0}
    th{position:sticky;top:0;z-index:1;background:linear-gradient(180deg,#ffad33 0%,var(--accent) 100%);color:#fff;text-align:left;font-size:12px;line-height:1.15;font-weight:800}
    td{font-size:14px}
    .pos-field{display:flex;align-items:center;justify-content:center;min-height:38px;border-radius:var(--radius-sm);background:rgba(255,255,255,.05);font-weight:800}
    .image-control{display:flex;flex-direction:column;gap:8px}
    .image-actions{display:flex;flex-wrap:wrap;gap:6px}
    .image-button,.image-clear{min-width:86px;min-height:34px;padding:8px 10px;font-size:12px;box-shadow:none}
    .image-button{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;color:#fff;cursor:pointer}
    .image-input{display:none}
    .image-box{display:flex;align-items:center;justify-content:center;width:100%;height:92px;border:1px dashed rgba(255,255,255,.48);border-radius:var(--radius-sm);background:rgba(255,255,255,.04);overflow:hidden;color:var(--muted);font-size:12px;font-weight:700;text-align:center}
    .image-box img{display:block;width:100%;height:100%;object-fit:contain}
    #duplicateRowButton{background:linear-gradient(180deg,#6b69ee 0%,#5856d6 100%);box-shadow:0 10px 20px rgba(88,86,214,.22),inset 0 1px 0 rgba(255,255,255,.28)}
    .row-actions{display:flex;flex-direction:column;align-items:center;gap:6px}
    .row-actions button{min-width:44px;width:44px;min-height:44px;padding:0;font-size:20px}
    .status{min-height:18px;margin:10px 2px 0;color:var(--muted);font-size:13px;font-weight:700;line-height:1.3}
    .archive-overlay[hidden]{display:none}
    .archive-overlay{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(28,28,30,.34);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
    .archive-dialog{width:min(100%,760px);max-height:min(680px,92vh);display:flex;flex-direction:column;overflow:hidden;background:rgba(245,247,251,.94);border:1px solid rgba(255,255,255,.52);border-radius:var(--radius-lg);box-shadow:0 18px 50px rgba(0,0,0,.18)}
    .archive-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line)}
    .archive-header h2{margin:0;font-size:22px}.archive-close-btn{min-width:46px;padding:8px 14px}
    .archive-list{display:flex;flex-direction:column;gap:8px;padding:12px;overflow:auto}
    .archive-empty{margin:0;padding:24px 12px;color:var(--muted);text-align:center;font-weight:700}
    .archive-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:12px;background:#f7f7fb;border:1px solid var(--line);border-radius:var(--radius-md)}
    .archive-title{min-width:0;font-weight:800;line-height:1.25;overflow-wrap:anywhere}.archive-meta{margin-top:3px;color:var(--muted);font-size:12px;font-weight:700;line-height:1.25}
    .archive-item button{min-height:38px;padding:8px 13px;font-size:13px;box-shadow:none}
    body.generating-pdf .title-actions,body.generating-pdf .button-area,body.generating-pdf .status{display:none!important}
    @media(max-width:900px){.container{padding:12px}.title-bar{align-items:stretch;flex-direction:column}.title-actions,.title-actions button,.button-area button{width:100%}.header-grid{grid-template-columns:1fr}.archive-item{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="container" id="reportRoot">
    <div class="title-bar">
      <h1>Aufmaß Brandabschottungen</h1>
      <div class="title-actions" aria-label="Archivaktionen">
        <button type="button" class="archive-save" id="archiveSaveBtn">Im Archiv speichern</button>
        <button type="button" class="archive-open" id="archiveBtn">Archiv</button>
        <button type="button" class="clear-btn secondary" id="clearButton">Leeren</button>
        <button type="button" class="pdf-btn" id="pdfButton">PDF</button>
      </div>
    </div>

    <section class="section">
      <div class="header-grid">
        <div class="field-group"><label for="objektInput">Objekt</label><input id="objektInput" name="objekt" type="text" autocomplete="off" /></div>
        <div class="field-group"><label for="nameInput">Name</label><input id="nameInput" name="name" type="text" autocomplete="off" /></div>
        <div class="field-group"><label for="dateInput">Datum</label><input id="dateInput" name="datum" type="date" /></div>
      </div>
    </section>

    <div class="table-shell">
      <table aria-label="Aufmaß Brandabschottungen">
        <colgroup>
          <col style="width:48px" />
          <col style="width:132px" />
          <col style="width:205px" />
          <col style="width:165px" />
          <col style="width:90px" />
          <col style="width:90px" />
          <col style="width:85px" />
          <col style="width:235px" />
          <col style="width:64px" />
        </colgroup>
        <thead>
          <tr>
            <th>Pos.</th>
            <th>Bild</th>
            <th>Standort</th>
            <th>Art</th>
            <th>Breite in mm</th>
            <th>Länge in mm</th>
            <th>Ø in mm</th>
            <th>Wandstärke und Beschaffenheit</th>
            <th aria-label="Zeilenaktionen"></th>
          </tr>
        </thead>
        <tbody id="rowsBody"></tbody>
      </table>
    </div>

    <div class="button-area">
      <button type="button" class="success" id="addRowButton">Neue Zeile</button>
      <button type="button" id="duplicateRowButton">Duplizieren</button>
      <button type="button" class="danger" id="removeRowButton">Letzte Zeile löschen</button>
    </div>
    <p class="status" id="archiveStatus" role="status" aria-live="polite"></p>
  </div>

  <div class="archive-overlay" id="archiveOverlay" hidden>
    <div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle">
      <div class="archive-header">
        <h2 id="archiveTitle">Archiv</h2>
        <button type="button" class="archive-close-btn secondary" id="archiveCloseBtn">Schließen</button>
      </div>
      <div class="archive-list" id="archiveList"></div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = "fsmobile-aufmass-brandabschottungen-form-v1";
    const ARCHIVE_STORAGE_KEY = "fsmobile-aufmass-brandabschottungen-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "fsmobile-aufmass-brandabschottungen-archive-current-v1";
    const ART_OPTIONS = ["Multischott","Kabel-Leichtbauschott","Kabelmörtelschott","MLAR-Schott","Vorschott","Schaumschott","Mörtel-Rohrschott","Einzelkabelschott","Manschette"];
    let rows = [];
    let saveTimer = 0;
    let statusTimer = 0;
    let restoring = false;

    function createRow(data) {
      return Object.assign({ id: "row-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8), image: "", standort: "", art: "", breite: "", laenge: "", durchschnitt: "", wand: "" }, data || {});
    }
    function escapeHtml(value) {
      return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function optionHtml(value, selected) {
      return '<option value="' + escapeHtml(value) + '"' + (value === selected ? " selected" : "") + ">" + escapeHtml(value) + "</option>";
    }
    function autoResize(textarea) {
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = Math.max(textarea.scrollHeight, 44) + "px";
    }
    function renderRows() {
      const body = document.getElementById("rowsBody");
      body.innerHTML = rows.map(function(row, index) {
        const image = row.image ? '<img src="' + escapeHtml(row.image) + '" alt="Bild Position ' + (index + 1) + '">' : "Kein Bild";
        return '<tr data-row-id="' + escapeHtml(row.id) + '">' +
          '<td><div class="pos-field">' + (index + 1) + '</div></td>' +
          '<td><div class="image-control"><div class="image-box">' + image + '</div><div class="image-actions"><label class="image-button success" for="image-' + escapeHtml(row.id) + '">Auswählen</label><button type="button" class="image-clear secondary" data-action="clear-image" data-row-id="' + escapeHtml(row.id) + '">Entfernen</button></div><input class="image-input" id="image-' + escapeHtml(row.id) + '" type="file" accept="image/*" data-action="image" data-row-id="' + escapeHtml(row.id) + '"></div></td>' +
          '<td><textarea data-field="standort" data-row-id="' + escapeHtml(row.id) + '" aria-label="Standort">' + escapeHtml(row.standort) + '</textarea></td>' +
          '<td><select data-field="art" data-row-id="' + escapeHtml(row.id) + '" aria-label="Art"><option value="">Bitte auswählen</option>' + ART_OPTIONS.map(function(option) { return optionHtml(option, row.art); }).join("") + '</select></td>' +
          '<td><input data-field="breite" data-row-id="' + escapeHtml(row.id) + '" type="number" inputmode="numeric" min="0" step="1" value="' + escapeHtml(row.breite) + '" aria-label="Breite in mm"></td>' +
          '<td><input data-field="laenge" data-row-id="' + escapeHtml(row.id) + '" type="number" inputmode="numeric" min="0" step="1" value="' + escapeHtml(row.laenge) + '" aria-label="Länge in mm"></td>' +
          '<td><input data-field="durchschnitt" data-row-id="' + escapeHtml(row.id) + '" type="number" inputmode="numeric" min="0" step="1" value="' + escapeHtml(row.durchschnitt) + '" aria-label="Durchschnitt in mm"></td>' +
          '<td><textarea data-field="wand" data-row-id="' + escapeHtml(row.id) + '" aria-label="Wandstärke und Beschaffenheit">' + escapeHtml(row.wand) + '</textarea></td>' +
          '<td><div class="row-actions"><button type="button" class="success" data-action="insert" data-row-id="' + escapeHtml(row.id) + '" aria-label="Zeile darunter hinzufügen">+</button><button type="button" class="danger" data-action="remove" data-row-id="' + escapeHtml(row.id) + '" aria-label="Diese Zeile entfernen">-</button></div></td>' +
        '</tr>';
      }).join("");
      document.querySelectorAll("textarea").forEach(autoResize);
    }
    function findRow(id) {
      return rows.find(function(row) { return row.id === id; });
    }
    function readHeaderFields() {
      return {
        objekt: document.getElementById("objektInput").value || "",
        name: document.getElementById("nameInput").value || "",
        datum: document.getElementById("dateInput").value || ""
      };
    }
    function applyHeaderFields(fields) {
      fields = fields || {};
      document.getElementById("objektInput").value = fields.objekt || "";
      document.getElementById("nameInput").value = fields.name || "";
      document.getElementById("dateInput").value = fields.datum || "";
    }
    function collectData() {
      return { fields: readHeaderFields(), rows: rows.map(function(row) { return Object.assign({}, row); }), savedAt: new Date().toISOString() };
    }
    window.collectData = collectData;
    function applyData(data) {
      restoring = true;
      applyHeaderFields(data && data.fields);
      rows = Array.isArray(data && data.rows) && data.rows.length ? data.rows.map(createRow) : [createRow()];
      renderRows();
      restoring = false;
    }
    window.applyData = applyData;
    function saveToStorageNow() {
      if (restoring) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData())); } catch (error) { console.warn("Aufmaß konnte nicht lokal gespeichert werden:", error); }
    }
    function scheduleSave() {
      if (restoring) return;
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(saveToStorageNow, 160);
    }
    function restoreFromStorage() {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) {}
      applyData(saved);
    }
    function setArchiveStatus(message) {
      const status = document.getElementById("archiveStatus");
      if (!status) return;
      status.textContent = message || "";
      window.clearTimeout(statusTimer);
      if (message) statusTimer = window.setTimeout(function() { status.textContent = ""; }, 4000);
      try { window.parent.postMessage({ type: "fsmobile-action-status", moduleId: window.FSMOBILE_MODULE_ID, message: message || "" }, "*"); } catch (error) {}
    }
    window.setArchiveStatus = setArchiveStatus;
    function readStoredValue(key) { try { return localStorage.getItem(key); } catch (error) { return null; } }
    function writeStoredValue(key, value) { try { localStorage.setItem(key, value); return true; } catch (error) { return false; } }
    function removeStoredValue(key) { try { localStorage.removeItem(key); } catch (error) {} }
    function createArchiveId() { return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : "archive-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10); }
    function getCurrentArchiveId() { return readStoredValue(CURRENT_ARCHIVE_ID_KEY); }
    function setCurrentArchiveId(id) { if (id) writeStoredValue(CURRENT_ARCHIVE_ID_KEY, id); else removeStoredValue(CURRENT_ARCHIVE_ID_KEY); }
    function loadArchiveEntries() {
      try { const entries = JSON.parse(readStoredValue(ARCHIVE_STORAGE_KEY) || "[]"); return Array.isArray(entries) ? entries : []; } catch (error) { return []; }
    }
    function writeArchiveEntries(entries) { return writeStoredValue(ARCHIVE_STORAGE_KEY, JSON.stringify(entries)); }
    function formatDisplayDate(value) {
      if (!value) return "Ohne Datum";
      const parts = String(value).split("-");
      return parts.length === 3 ? parts[2] + "." + parts[1] + "." + parts[0] : value;
    }
    function archiveTitle(entry) {
      const data = entry && entry.data ? entry.data : {};
      const fields = data.fields || {};
      const object = String(fields.objekt || "").trim() || "Ohne Objekt";
      const name = String(fields.name || "").trim() || "Ohne Name";
      const count = Array.isArray(data.rows) ? data.rows.length : 0;
      return object + " - " + name + " - Brandabschottungen (" + count + ") - " + formatDisplayDate(fields.datum || "");
    }
    function saveCurrentReportToArchive() {
      saveToStorageNow();
      const now = new Date().toISOString();
      const currentId = getCurrentArchiveId();
      const entries = loadArchiveEntries();
      const existingIndex = currentId ? entries.findIndex(function(entry) { return entry.id === currentId; }) : -1;
      const entry = { id: existingIndex >= 0 ? entries[existingIndex].id : createArchiveId(), createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now, updatedAt: now, data: collectData() };
      if (existingIndex >= 0) entries[existingIndex] = entry; else entries.push(entry);
      if (writeArchiveEntries(entries)) {
        setCurrentArchiveId(entry.id);
        renderArchiveList();
        setArchiveStatus(existingIndex >= 0 ? "Archiv-Eintrag wurde aktualisiert." : "Aufmaß wurde im Archiv gespeichert.");
      } else {
        setArchiveStatus("Aufmaß konnte nicht im Archiv gespeichert werden.");
      }
    }
    window.saveCurrentReportToArchive = saveCurrentReportToArchive;
    function openArchiveEntry(id) {
      const entry = loadArchiveEntries().find(function(item) { return item.id === id; });
      if (!entry) return;
      applyData(entry.data);
      setCurrentArchiveId(entry.id);
      saveToStorageNow();
      closeArchive();
      setArchiveStatus("Aufmaß wurde aus dem Archiv geöffnet.");
    }
    function deleteArchiveEntry(id) {
      const entries = loadArchiveEntries();
      const entry = entries.find(function(item) { return item.id === id; });
      if (!entry) return;
      if (!confirm('Archiv-Eintrag "' + archiveTitle(entry) + '" löschen?')) return;
      writeArchiveEntries(entries.filter(function(item) { return item.id !== id; }));
      if (getCurrentArchiveId() === id) setCurrentArchiveId("");
      renderArchiveList();
      setArchiveStatus("Archiv-Eintrag wurde gelöscht.");
    }
    function renderArchiveList() {
      const list = document.getElementById("archiveList");
      const entries = loadArchiveEntries().slice().sort(function(a, b) { return String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")); });
      list.innerHTML = "";
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "archive-empty";
        empty.textContent = "Noch keine gespeicherten Aufmaße im Archiv.";
        list.appendChild(empty);
        return;
      }
      entries.forEach(function(entry) {
        const item = document.createElement("article");
        item.className = "archive-item";
        const text = document.createElement("div");
        const title = document.createElement("div");
        const meta = document.createElement("div");
        title.className = "archive-title";
        meta.className = "archive-meta";
        title.textContent = archiveTitle(entry);
        meta.textContent = "Geändert: " + formatDisplayDate(String(entry.updatedAt || "").slice(0, 10));
        text.append(title, meta);
        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.textContent = "Öffnen";
        openButton.addEventListener("click", function() { openArchiveEntry(entry.id); });
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "danger";
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", function() { deleteArchiveEntry(entry.id); });
        item.append(text, openButton, deleteButton);
        list.appendChild(item);
      });
    }
    function openArchive() {
      renderArchiveList();
      document.getElementById("archiveOverlay").hidden = false;
      setArchiveStatus("Archiv wurde geöffnet.");
    }
    window.openArchive = openArchive;
    function closeArchive() { document.getElementById("archiveOverlay").hidden = true; }
    window.closeArchive = closeArchive;
    function clearForm() {
      if (!confirm("Alle Eingaben wirklich löschen?")) return;
      removeStoredValue(STORAGE_KEY);
      setCurrentArchiveId("");
      applyData(null);
      saveToStorageNow();
      setArchiveStatus("Aufmaß wurde geleert.");
    }
    window.clearForm = clearForm;
    function readImageFile(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function() { resolve(String(reader.result || "")); };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsDataURL(file);
      });
    }
    function loadImage(src) {
      return new Promise(function(resolve, reject) {
        const img = new Image();
        img.onload = function() { resolve(img); };
        img.onerror = reject;
        img.src = src;
      });
    }
    async function normalizeImage(src, maxSize, quality) {
      const img = await loadImage(src);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const scale = Math.min(1, (maxSize || 1400) / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", quality || 0.86);
    }
    async function handleImageInput(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      const row = findRow(input.dataset.rowId || "");
      if (!row) return;
      try {
        row.image = await normalizeImage(await readImageFile(file), 1400, 0.86);
        renderRows();
        saveToStorageNow();
        setArchiveStatus("Bild wurde eingefügt.");
      } catch (error) {
        console.error("Bild konnte nicht verarbeitet werden", error);
        alert("Bild konnte nicht verarbeitet werden.");
      }
    }
    function jsPdf() {
      if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
      if (window.jsPDF) return window.jsPDF;
      return null;
    }
    async function ensurePdf() {
      const existing = jsPdf();
      if (existing) return existing;
      return new Promise(function(resolve) {
        const script = document.createElement("script");
        script.src = "vendor/jspdf.umd.min.js";
        script.onload = function() { resolve(jsPdf()); };
        script.onerror = function() { resolve(null); };
        document.head.appendChild(script);
      });
    }
    function clean(value) { return String(value || "").trim() || "-"; }
    function filePart(value) {
      return String(value || "Aufmass_Brandabschottungen").trim().replace(/[\\\\/:*?"<>|]+/g, "_").replace(/\\s+/g, "_").slice(0, 80) || "Aufmass_Brandabschottungen";
    }
    function fitBox(width, height, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      return { width: width * ratio, height: height * ratio };
    }
    async function imageSize(src) {
      const img = await loadImage(src);
      return { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
    }
    async function addFittedImage(doc, src, x, y, maxWidth, maxHeight) {
      const pdfSrc = src.indexOf("data:image/jpeg") === 0 ? src : await normalizeImage(src, 1400, 0.86);
      const size = await imageSize(pdfSrc);
      const fitted = fitBox(size.width, size.height, maxWidth, maxHeight);
      doc.addImage(pdfSrc, "JPEG", x + (maxWidth - fitted.width) / 2, y + (maxHeight - fitted.height) / 2, fitted.width, fitted.height, undefined, "FAST");
    }
    function headerPdf(doc, pageWidth, margin, title, top) {
      top = typeof top === "number" ? top : 30;
      doc.setFillColor(255, 180, 71);
      doc.rect(margin, top, pageWidth - margin * 2, 10, "F");
      doc.setTextColor("#000000");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(title, pageWidth / 2, top + 6.8, { align: "center" });
      doc.setTextColor("#111827");
    }
    function drawMeta(doc, data, pageWidth, margin, y) {
      const fields = data.fields || {};
      y = typeof y === "number" ? y : 46;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#111827");
      doc.text("Objekt: " + clean(fields.objekt), margin, y);
      doc.text("Name: " + clean(fields.name), margin + 100, y);
      doc.text("Datum: " + formatDisplayDate(fields.datum), pageWidth - margin, y, { align: "right" });
    }
    function drawTableHeader(doc, columns, y, margin) {
      let x = margin;
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      columns.forEach(function(column) {
        doc.setFillColor(255, 180, 71);
        doc.setTextColor("#000000");
        doc.rect(x, y, column.width, 8, "FD");
        doc.text(doc.splitTextToSize(column.label, column.width - 2), x + 1, y + 3.2);
        x += column.width;
      });
      doc.setTextColor("#111827");
      return y + 8;
    }
    async function exportPdf() {
      const button = document.getElementById("pdfButton");
      const oldText = button.textContent;
      button.disabled = true;
      button.textContent = "PDF wird erstellt...";
      document.body.classList.add("generating-pdf");
      setArchiveStatus("PDF Export wird erstellt...");
      try {
        const JsPDF = await ensurePdf();
        if (!JsPDF) { alert("PDF-Bibliothek konnte nicht geladen werden."); return; }
        const data = collectData();
        const doc = new JsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 8;
        const bottom = pageHeight - margin;
        const title = "Aufmaß Brandabschottungen";
        const columns = [
          { label: "Pos.", width: 10 },
          { label: "Bild", width: 34 },
          { label: "Standort", width: 42 },
          { label: "Art", width: 37 },
          { label: "Breite mm", width: 22 },
          { label: "Länge mm", width: 22 },
          { label: "Ø mm", width: 20 },
          { label: "Wandstärke und Beschaffenheit", width: 94 }
        ];
        function newPage(continued) {
          if (continued) doc.addPage("a4", "landscape");
          headerPdf(doc, pageWidth, margin, continued ? title + " (Fortsetzung)" : title, 40);
          drawMeta(doc, data, pageWidth, margin, 56);
          return drawTableHeader(doc, columns, 64, margin);
        }
        let y = newPage(false);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.7);
        for (let index = 0; index < data.rows.length; index += 1) {
          const row = data.rows[index] || {};
          const values = [String(index + 1), "", clean(row.standort), clean(row.art), clean(row.breite), clean(row.laenge), clean(row.durchschnitt), clean(row.wand)];
          const wrapped = values.map(function(value, columnIndex) { return doc.splitTextToSize(value, columns[columnIndex].width - 2); });
          const lineCount = Math.max.apply(null, wrapped.map(function(lines) { return lines.length; }));
          const rowHeight = Math.max(row.image ? 28 : 10, lineCount * 3.2 + 4);
          if (y + rowHeight > bottom) y = newPage(true);
          let x = margin;
          for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
            const column = columns[columnIndex];
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.2);
            doc.setFillColor(245, 245, 245);
            doc.rect(x, y, column.width, rowHeight, "FD");
            doc.setTextColor("#111827");
            doc.setFont("helvetica", columnIndex === 0 ? "bold" : "normal");
            if (columnIndex === 1 && row.image) {
              try { await addFittedImage(doc, row.image, x + 1.5, y + 1.5, column.width - 3, rowHeight - 3); }
              catch (error) { doc.text("Bildfehler", x + 1, y + 4); }
            } else if (columnIndex !== 1) {
              doc.text(wrapped[columnIndex], x + 1, y + 4);
            }
            x += column.width;
          }
          y += rowHeight;
        }
        if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(doc);
        doc.save(filePart(data.fields.objekt) + "_Aufmass_Brandabschottungen.pdf");
        setArchiveStatus("PDF Export wurde erstellt.");
      } catch (error) {
        console.error("PDF Export fehlgeschlagen", error);
        alert("PDF konnte nicht erstellt werden. Bitte erneut versuchen.");
        setArchiveStatus("PDF Export konnte nicht erstellt werden.");
      } finally {
        document.body.classList.remove("generating-pdf");
        button.disabled = false;
        button.textContent = oldText || "PDF";
      }
    }
    function addRow(data) { rows.push(createRow(data)); renderRows(); scheduleSave(); }
    function duplicateLastRow() {
      if (!rows.length) { addRow(); return; }
      const copy = Object.assign({}, rows[rows.length - 1], { id: "" });
      addRow(copy);
      setArchiveStatus("Letzte Zeile wurde dupliziert.");
    }
    function removeLastRow() {
      if (rows.length <= 1) { setArchiveStatus("Mindestens eine Position muss erhalten bleiben."); return; }
      rows.pop();
      renderRows();
      scheduleSave();
      setArchiveStatus("Letzte Zeile wurde gelöscht.");
    }
    document.addEventListener("input", function(event) {
      const target = event.target;
      if (target.tagName === "TEXTAREA") autoResize(target);
      if (target.dataset && target.dataset.field) {
        const row = findRow(target.dataset.rowId || "");
        if (row) row[target.dataset.field] = target.value || "";
      }
      scheduleSave();
    }, true);
    document.addEventListener("change", function(event) {
      const target = event.target;
      if (target.dataset && target.dataset.action === "image") { handleImageInput(target); return; }
      if (target.dataset && target.dataset.field) {
        const row = findRow(target.dataset.rowId || "");
        if (row) row[target.dataset.field] = target.value || "";
      }
      scheduleSave();
    }, true);
    document.getElementById("rowsBody").addEventListener("click", function(event) {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const rowId = button.dataset.rowId || "";
      const index = rows.findIndex(function(row) { return row.id === rowId; });
      if (button.dataset.action === "insert") {
        rows.splice(index + 1, 0, createRow());
        renderRows();
        scheduleSave();
        setArchiveStatus("Neue Zeile wurde eingefügt.");
      } else if (button.dataset.action === "remove") {
        if (rows.length <= 1) { setArchiveStatus("Mindestens eine Position muss erhalten bleiben."); return; }
        rows.splice(index, 1);
        renderRows();
        scheduleSave();
        setArchiveStatus("Zeile wurde gelöscht.");
      } else if (button.dataset.action === "clear-image") {
        const row = findRow(rowId);
        if (row) row.image = "";
        renderRows();
        scheduleSave();
        setArchiveStatus("Bild wurde entfernt.");
      }
    });
    document.getElementById("addRowButton").addEventListener("click", function() { addRow(); });
    document.getElementById("duplicateRowButton").addEventListener("click", duplicateLastRow);
    document.getElementById("removeRowButton").addEventListener("click", removeLastRow);
    document.getElementById("archiveSaveBtn").addEventListener("click", saveCurrentReportToArchive);
    document.getElementById("archiveBtn").addEventListener("click", openArchive);
    document.getElementById("archiveCloseBtn").addEventListener("click", closeArchive);
    document.getElementById("archiveOverlay").addEventListener("click", function(event) { if (event.target.id === "archiveOverlay") closeArchive(); });
    document.getElementById("clearButton").addEventListener("click", clearForm);
    document.getElementById("pdfButton").addEventListener("click", exportPdf);
    document.addEventListener("keydown", function(event) { if (event.key === "Escape" && !document.getElementById("archiveOverlay").hidden) closeArchive(); });
    restoreFromStorage();
  </script>
</body>
</html>`;
  }

  registry["pb-zentralbatterie-anlage"] = registry["pb-zentralbatterie-anlage"] || {
    title: "Prüfbericht Zentralbatterie-Anlage",
    group: "Prüfberichte",
    description: "Zentralbatterie-Anlage prüfen, Messwerte erfassen, archivieren und als PDF ausgeben.",
    html: centralBatteryReportHtml()
  };

  registry["pb-loeschwasser-nass"] = registry["pb-loeschwasser-nass"] || {
    title: "Prüfbericht Löschwassereinrichtung Nass",
    group: "Prüfberichte",
    description: "Nasse Löschwassereinrichtungen mit Wandhydranten, Wasseranschluss, Messwerten und Schlauchprüfung dokumentieren.",
    html: wetExtinguishingWaterReportHtml()
  };

  registry["pb-nass-trocken-station"] = registry["pb-nass-trocken-station"] || {
    title: "Prüfbericht Nass/Trocken-Station",
    group: "Prüfberichte",
    description: "Nass/Trocken-Stationen mit Pumpenprüfung, Messwerten, Anlagendaten und Wasseranschluss dokumentieren.",
    html: wetDryStationReportHtml()
  };

  registry["pb-hydranten"] = registry["pb-hydranten"] || {
    title: "Prüfbericht Hydranten",
    group: "Prüfberichte",
    description: "Hydranten, Löschwasserbehälter, Brunnen und Saugstellen mit Messwerten dokumentieren.",
    html: hydrantsReportHtml()
  };

  function wetDryStationReportHtml() {
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Prüfbericht Nass/Trocken-Station</title>
  <meta name="theme-color" content="#d6001c" />
  <style>
    :root {
      --primary:#007aff; --success:#34c759; --danger:#ff3b30; --neutral:#8e8e93; --warning:#ff9500;
      --field: rgba(255,255,255,.03); --text:#1c1c1e; --muted:#6e6e73; --line:rgba(60,60,67,.14);
      --radius:16px; --shadow:0 8px 28px rgba(0,0,0,.08); --ios-ease:cubic-bezier(.2,.8,.2,1);
    }
    *{box-sizing:border-box} html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
    body{margin:0;padding:0!important;background:transparent!important;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Arial,sans-serif}
    .container{width:100%!important;max-width:none!important;margin:0!important;padding:20px;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
    .title-bar,.archive-header{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .title-bar{margin-bottom:16px}.title-actions,.actions,.signature-actions{display:flex;flex-wrap:wrap;gap:10px}
    .title-actions{justify-content:flex-end;padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
    .title-bar>.title-actions{margin-right:calc(86px + env(safe-area-inset-right,0px))!important}
    h1{margin:0;font-size:34px;line-height:1.1;letter-spacing:0}.section-title{margin:0 0 12px;font-size:22px;line-height:1.2}
    h2,h3,label{letter-spacing:0}.grid{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:12px;margin-bottom:12px}
    .grid.one{grid-template-columns:1fr}.grid.two{grid-template-columns:repeat(2,minmax(180px,1fr))}
    .field{min-width:0;display:flex;flex-direction:column}label{margin:0 0 6px;color:var(--muted);font-size:15px;font-weight:700}
    input[type="text"],input[type="date"],input[type="number"],textarea,select{width:100%;min-height:44px;padding:10px 12px;border:0;border-radius:12px;background:var(--field);color:var(--text);font:inherit;font-size:16px;font-weight:650;outline:none;-webkit-tap-highlight-color:transparent}
    textarea{min-height:112px;resize:vertical;line-height:1.35;text-align:left}input:focus,textarea:focus,select:focus{box-shadow:0 0 0 3px rgba(214,0,28,.18)}
    button{min-height:46px;padding:12px 18px;border:none;border-radius:999px;cursor:pointer;font:inherit;font-size:15px;font-weight:800;color:#fff;background:linear-gradient(180deg,#1688ff 0%,var(--primary) 100%);box-shadow:0 10px 20px rgba(0,122,255,.24),inset 0 1px 0 rgba(255,255,255,.32);transition:transform .18s var(--ios-ease),filter .18s var(--ios-ease);touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    button:hover{filter:brightness(1.02)}button:active{transform:scale(.975)}.secondary{background:linear-gradient(180deg,#a6a6ad 0%,var(--neutral) 100%)}.danger{background:linear-gradient(180deg,#ff453a 0%,var(--danger) 100%)}.archive-save{background:linear-gradient(180deg,#ffb340 0%,var(--warning) 100%)}
    .card{margin-top:16px;padding:16px;border-radius:16px;background: rgba(255,255,255,.045);border: 1px solid rgba(255,255,255,.42);box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05);-webkit-backdrop-filter:blur(24px) saturate(1.18);backdrop-filter:blur(24px) saturate(1.18)}
    .check-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.check-item{display:grid;grid-template-columns:minmax(0,1fr) minmax(120px,170px);gap:10px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.055)}.check-label{font-weight:780;line-height:1.25}
    .input-unit{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;min-height:44px;padding-right:10px;border-radius:12px;background:var(--field)}.input-unit input{min-height:44px;background:transparent}.unit{color:var(--muted);font-weight:850;white-space:nowrap}
    .hint{margin:8px 0 0;color:var(--muted);font-size:13px;font-weight:700;line-height:1.35}.actions{margin-top:16px}
    .signature-block{margin-top:16px;padding:14px;background:var(--field);border-radius:14px}.signature-block h3{margin:0 0 10px;font-size:18px}#signaturePad{display:block;width:100%;height:180px;border:2px dashed rgba(255,255,255,.5);border-radius:12px;background:rgba(255,255,255,.08);touch-action:none}
    .signature-actions{margin-top:16px}
    .archive-status{min-height:18px;margin:12px 0 0;color:var(--muted);font-size:13px;font-weight:700;line-height:1.3}.archive-overlay[hidden]{display:none}.archive-overlay{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.34)}.archive-dialog{width:min(760px,100%);max-height:min(680px,90vh);overflow:auto;padding:18px;background:rgba(255,255,255,.08);border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.25)}.archive-header h2{margin:0;font-size:24px}.archive-list{display:grid;gap:10px;margin-top:14px}.archive-empty{margin:0;color:var(--muted);font-weight:700}.archive-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:center;padding:12px;background:var(--field);border-radius:14px}.archive-title{font-weight:850;overflow-wrap:anywhere}.archive-meta{margin-top:3px;color:var(--muted);font-size:13px;font-weight:700}
    body.generating-pdf .title-actions,body.generating-pdf .actions,body.generating-pdf .signature-actions,body.generating-pdf .archive-status{display:none!important}
    @media(max-width:900px){.grid,.grid.one,.grid.two,.check-grid{grid-template-columns:1fr}.title-bar,.archive-header{align-items:stretch;flex-direction:column}.title-actions,.title-actions button,.archive-header button{width:100%}.title-bar>.title-actions{margin-right:0!important}}
  

    /* Hochformat-Transparenz: Unterschrift und lokale Formularflächen */
    .input-unit,
    .archive-item,
    .row-number,
    .cell-number,
    .hydrant-number,
    .card,
    .check-item,
    .result-item,
    .dynamic-row,
    .strand-row,
    .cell-row,
    .signature-block,
    .signature-wrap {
      border: 1px solid rgba(255,255,255,.42) !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.06) 58%, rgba(235,0,69,.035)),
        rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    #signaturePad,
    .signature-wrap canvas,
    canvas.signature-pad {
      border: 2px dashed rgba(255,255,255,.5) !important;
      background: rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(235,0,69,.035) !important;
    }

    .input-unit input,
    .input-unit select,
    .card input,
    .card textarea,
    .card select,
    .signature-block input,
    .signature-block textarea,
    .signature-block select,
    .signature-wrap input,
    .signature-wrap textarea,
    .signature-wrap select {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
    }

    .signature-actions {
      background: transparent !important;
      border-color: rgba(255,255,255,.28) !important;
      box-shadow: none !important;
    }

    .title-actions,
    .button-area,
    .toolbar {
      background: rgba(255,255,255,.08) !important;
      border-color: rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 8px 24px rgba(0,0,0,.045) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    .row-number,
    .cell-number,
    .hydrant-number {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
    }
</style>
</head>
<body>
  <div class="container" id="reportRoot">
    <div class="title-bar">
      <h1>Prüfbericht Nass/Trocken-Station</h1>
      <div class="title-actions" aria-label="Archivaktionen">
        <button type="button" onclick="saveCurrentReportToArchive()" class="archive-save">Im Archiv speichern</button>
        <button type="button" onclick="openArchive()" class="archive-open">Archiv</button>
      </div>
    </div>

    <section class="card">
      <h2 class="section-title">Zuordnung</h2>
      <div class="grid">
        <div class="field"><label for="anlageInput">Anlagen Nr.</label><input id="anlageInput" name="anlage" type="text" autocomplete="off"></div>
        <div class="field"><label for="objectInput">Objekt</label><input id="objectInput" name="object" type="text" autocomplete="off"></div>
        <div class="field"><label for="anlagenstandortInput">Anlagenstandort</label><input id="anlagenstandortInput" name="anlagenstandort" type="text" autocomplete="off"></div>
        <div class="field"><label for="dateInput">Datum</label><input id="dateInput" name="date" type="date"></div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Anlagentyp</h2>
      <div class="grid one"><div class="field"><label for="anlagentypSelect">Anlagentyp</label><select id="anlagentypSelect" name="anlagentyp">
        <option>Sicherheits-Trennstation</option><option>Trinkwasseranlage</option><option>Löschwasseranlage</option><option>Einzelpumpenanlage</option><option>Zweipumpenanlage Redundant</option><option>Kaskadenpumpenanlage</option>
      </select></div></div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfung</h2>
      <div class="check-grid" id="inspectionGrid"></div>
    </section>

    <section class="card">
      <h2 class="section-title">Messwerte</h2>
      <div class="grid">
        <div class="field"><label for="einschaltdruckInput">Einschaltdruck</label><div class="input-unit"><input id="einschaltdruckInput" name="einschaltdruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>
        <div class="field"><label for="ausschaltdruckInput">Ausschaltdruck</label><div class="input-unit"><input id="ausschaltdruckInput" name="ausschaltdruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>
        <div class="field"><label for="vordruckInput">Vordruck</label><div class="input-unit"><input id="vordruckInput" name="vordruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>
        <div class="field"><label for="vorspannungInput">Vorspannung Ausdehnungsgefäß</label><div class="input-unit"><input id="vorspannungInput" name="vorspannung" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Anlagendaten</h2>
      <div class="grid">
        <div class="field"><label for="herstellerInput">Hersteller</label><input id="herstellerInput" name="hersteller" type="text"></div>
        <div class="field"><label for="steuerungstypInput">Steuerungstyp</label><input id="steuerungstypInput" name="steuerungstyp" type="text"></div>
        <div class="field"><label for="pumpentypInput">Pumpentyp</label><input id="pumpentypInput" name="pumpentyp" type="text"></div>
        <div class="field"><label for="baujahrInput">Baujahr</label><input id="baujahrInput" name="baujahr" type="number" min="1900" max="2100" inputmode="numeric"></div>
        <div class="field"><label for="leistungKwInput">Leistung</label><div class="input-unit"><input id="leistungKwInput" name="leistungKw" type="number" step="0.01" inputmode="decimal"><span class="unit">KW</span></div></div>
        <div class="field"><label for="leistungHInput">Leistung</label><div class="input-unit"><input id="leistungHInput" name="leistungH" type="number" step="0.01" inputmode="decimal"><span class="unit">H</span></div></div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Wasseranschluss</h2>
      <div class="grid one"><div class="field"><label for="anschlussSelect">Anschluss</label><select id="anschlussSelect" name="anschluss"><option>Mittelbarer Anschluss getrennt</option><option>Unmittelbarer Anschluss am Trinkwassernetz</option></select></div></div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfergebnis</h2>
      <div class="grid one">
        <div class="field"><label for="pruefergebnisSelect">Prüfergebnis</label><select id="pruefergebnisSelect" name="pruefergebnis"><option>Anlage nicht einsatzbereit</option><option>Anlage bedingt einsatzbereit</option><option>Anlage einsatzbereit</option></select></div>
        <div class="field"><label for="bemerkungInput">Bemerkung</label><textarea id="bemerkungInput" name="bemerkung"></textarea></div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfer und Unterschrift</h2>
      <div class="grid one"><div class="field"><label for="prueferInput">Prüfer</label><input id="prueferInput" name="pruefer" type="text" autocomplete="off"></div></div>
      <div class="signature-block"><h3>Unterschrift Techniker</h3><canvas id="signaturePad" aria-label="Unterschrift Techniker"></canvas><div class="signature-actions"><button type="button" onclick="clearSignature()" class="danger">Unterschrift löschen</button></div></div>
      <p style="margin:12px 0 0;color:var(--muted);font-weight:700;font-size:13px">Wir weisen auf die 3-jährliche Sachverständigenprüfpflicht nach TPrüfVO Hessen hin.</p>
    </section>

    <div class="actions"><button type="button" class="secondary clear-btn" id="clearButton" onclick="clearForm()">Leeren</button><button type="button" id="pdfButton" class="pdf-btn" onclick="exportPdf()">PDF</button></div>
    <p class="archive-status" id="archiveStatus" role="status" aria-live="polite"></p>
  </div>

  <div class="archive-overlay" id="archiveOverlay" hidden><div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle"><div class="archive-header"><h2 id="archiveTitle">Archiv</h2><button type="button" class="secondary archive-close-btn" onclick="closeArchive()">Schließen</button></div><div class="archive-list" id="archiveList"></div></div></div>

  <script>
    const STORAGE_KEY = "fsmobile-pb-nass-trocken-station-v1";
    const ARCHIVE_STORAGE_KEY = "fsmobile-pb-nass-trocken-station-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "fsmobile-pb-nass-trocken-station-current-v1";
    const CHECK_FIELDS = [
      ["einschaltdruckOk", "Einschaltdruck", ["i.O", "n.i.O"]],
      ["ausschaltdruckOk", "Ausschaltdruck", ["i.O", "n.i.O", "n.v"]],
      ["stromaufnahmeOk", "Stromaufnahme", ["i.O", "n.i.O"]],
      ["motorschutzOk", "Motorschutz nur Meldung", ["i.O", "n.i.O", "n.v"]],
      ["dichtheitOk", "Dichtheit", ["i.O", "n.i.O"]],
      ["pumpendrehrichtungOk", "Pumpendrehrichtung", ["i.O", "n.i.O", "n.v"]],
      ["pumpeEntlueftetOk", "Pumpe entlüftet", ["i.O", "n.i.O", "n.v"]],
      ["stoermeldungOk", "Störmeldung", ["i.O", "n.i.O", "n.v"]],
      ["kaskadenschaltungOk", "Kaskadenschaltung", ["i.O", "n.i.O", "n.v"]],
      ["spueleinrichtungOk", "Spüleinrichtung", ["i.O", "n.i.O", "n.v"]],
      ["druckausgleichOk", "Druckausgleichsbehälter", ["i.O", "n.i.O", "n.v"]],
      ["anzeigeelementeOk", "Anzeigeelemente", ["i.O", "n.i.O", "n.v"]],
      ["anlagendatenOk", "Anlagendaten", ["i.O", "n.i.O", "n.v"]],
      ["steuerungOk", "Steuerung", ["i.O", "n.i.O", "n.v"]],
      ["schraubverbindungenOk", "Schraubverbindungen nachziehen", ["i.O", "n.i.O", "n.v"]]
    ];
    const signaturePadState = { canvas: null, ctx: null, isDrawing: false, lastPoint: null };
    let storageSaveTimer = 0;
    let storageRestoreInProgress = false;
    let archiveStatusTimer = 0;

    function todayIso(){const now=new Date();return now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")}
    function setTodayIfEmpty(){const dateInput=document.getElementById("dateInput");if(dateInput&&!dateInput.value)dateInput.value=todayIso()}
    function renderChecks(){const grid=document.getElementById("inspectionGrid");grid.innerHTML="";CHECK_FIELDS.forEach(([key,label,options])=>{const row=document.createElement("label");row.className="check-item";row.innerHTML='<span class="check-label">'+label+'</span><select data-field="'+key+'" name="'+key+'">'+options.map(value=>'<option value="'+value+'">'+value+'</option>').join("")+'</select>';grid.appendChild(row)})}
    function textValue(id){const el=document.getElementById(id);return el&&"value"in el?el.value||"":""}
    function withUnit(value,unit){const clean=String(value||"").trim();return clean?clean+" "+unit:""}
    function collectData(){const fields={anlage:textValue("anlageInput"),object:textValue("objectInput"),anlagenstandort:textValue("anlagenstandortInput"),date:textValue("dateInput"),anlagentyp:textValue("anlagentypSelect"),einschaltdruck:textValue("einschaltdruckInput"),ausschaltdruck:textValue("ausschaltdruckInput"),vordruck:textValue("vordruckInput"),vorspannung:textValue("vorspannungInput"),hersteller:textValue("herstellerInput"),steuerungstyp:textValue("steuerungstypInput"),pumpentyp:textValue("pumpentypInput"),baujahr:textValue("baujahrInput"),leistungKw:textValue("leistungKwInput"),leistungH:textValue("leistungHInput"),anschluss:textValue("anschlussSelect"),pruefergebnis:textValue("pruefergebnisSelect"),bemerkung:textValue("bemerkungInput"),pruefer:textValue("prueferInput")};document.querySelectorAll("[data-field]").forEach(field=>{fields[field.dataset.field]=field.value||""});return{fields,signature:getStorageSignature(),savedAt:new Date().toISOString()}}
    function setValue(id,value){const el=document.getElementById(id);if(el&&"value"in el)el.value=value||""}
    function applyData(data){storageRestoreInProgress=true;const fields=data&&data.fields?data.fields:{};setValue("anlageInput",fields.anlage);setValue("objectInput",fields.object);setValue("anlagenstandortInput",fields.anlagenstandort);setValue("dateInput",fields.date);setValue("anlagentypSelect",fields.anlagentyp||"Sicherheits-Trennstation");setValue("einschaltdruckInput",fields.einschaltdruck);setValue("ausschaltdruckInput",fields.ausschaltdruck);setValue("vordruckInput",fields.vordruck);setValue("vorspannungInput",fields.vorspannung);setValue("herstellerInput",fields.hersteller);setValue("steuerungstypInput",fields.steuerungstyp);setValue("pumpentypInput",fields.pumpentyp);setValue("baujahrInput",fields.baujahr);setValue("leistungKwInput",fields.leistungKw);setValue("leistungHInput",fields.leistungH);setValue("anschlussSelect",fields.anschluss||"Mittelbarer Anschluss getrennt");setValue("pruefergebnisSelect",fields.pruefergebnis||"Anlage einsatzbereit");setValue("bemerkungInput",fields.bemerkung);setValue("prueferInput",fields.pruefer);document.querySelectorAll("[data-field]").forEach(field=>{field.value=fields[field.dataset.field]||"i.O"});setTodayIfEmpty();clearSignature(true);restoreSignatureFromStorage(data&&data.signature);storageRestoreInProgress=false}
    function saveToStorageNow(){if(storageRestoreInProgress)return;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(collectData()))}catch(error){console.warn("Eingaben konnten nicht lokal gespeichert werden:",error)}}
    function scheduleStorageSave(){if(storageRestoreInProgress)return;window.clearTimeout(storageSaveTimer);storageSaveTimer=window.setTimeout(saveToStorageNow,180)}
    function restoreFromStorage(){let saved=null;try{const raw=localStorage.getItem(STORAGE_KEY);saved=raw?JSON.parse(raw):null}catch(error){console.warn("Gespeicherte Eingaben konnten nicht geladen werden:",error)}applyData(saved)}
    function clearForm(){if(!confirm("Alle Eingaben wirklich löschen?"))return;localStorage.removeItem(STORAGE_KEY);clearCurrentArchiveId();applyData(null);setArchiveStatus("Aktueller Prüfbericht wurde geleert. Archivierte Prüfberichte bleiben erhalten.")}
    function readStoredValue(key){try{return localStorage.getItem(key)}catch{return null}} function writeStoredValue(key,value){try{localStorage.setItem(key,value);return true}catch{return false}} function removeStoredValue(key){try{localStorage.removeItem(key)}catch{}}
    function createArchiveId(){return window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"archive-"+Date.now()+"-"+Math.random().toString(36).slice(2,10)} function getCurrentArchiveId(){return readStoredValue(CURRENT_ARCHIVE_ID_KEY)} function setCurrentArchiveId(id){if(id)writeStoredValue(CURRENT_ARCHIVE_ID_KEY,id);else clearCurrentArchiveId()} function clearCurrentArchiveId(){removeStoredValue(CURRENT_ARCHIVE_ID_KEY)}
    function loadArchiveEntries(){try{const entries=JSON.parse(readStoredValue(ARCHIVE_STORAGE_KEY)||"[]");return Array.isArray(entries)?entries:[]}catch{return[]}} function writeArchiveEntries(entries){return writeStoredValue(ARCHIVE_STORAGE_KEY,JSON.stringify(entries))}
    function formatDateForFile(dateValue){if(!dateValue)return new Date().toLocaleDateString("de-DE");const parts=dateValue.split("-");if(parts.length!==3)return dateValue;return parts[2]+"."+parts[1]+"."+parts[0]} function getDisplayDate(value){return value?formatDateForFile(value):"Ohne Datum"}
    function getArchiveTitle(entry){const report=entry&&entry.report?entry.report:{};const fields=report.fields||{};const object=String(fields.object||"").trim()||"Ohne Objekt";const anlage=String(fields.anlage||"").trim()||"Ohne Anlagen Nr.";return anlage+" - "+object+" - "+getDisplayDate(fields.date||"")}
    function saveCurrentReportToArchive(){saveToStorageNow();const now=new Date().toISOString();const currentId=getCurrentArchiveId();const entries=loadArchiveEntries();const existingIndex=currentId?entries.findIndex(entry=>entry.id===currentId):-1;const entry={id:existingIndex>=0?entries[existingIndex].id:createArchiveId(),createdAt:existingIndex>=0?entries[existingIndex].createdAt:now,updatedAt:now,report:collectData()};if(existingIndex>=0)entries[existingIndex]=entry;else entries.push(entry);if(writeArchiveEntries(entries)){setCurrentArchiveId(entry.id);renderArchiveList();setArchiveStatus("Prüfbericht wurde im Archiv gespeichert.")}else setArchiveStatus("Prüfbericht konnte nicht im Archiv gespeichert werden.")}
    function openArchiveEntry(id){const entry=loadArchiveEntries().find(item=>item.id===id);if(!entry)return;applyData(entry.report);setCurrentArchiveId(entry.id);saveToStorageNow();closeArchive();setArchiveStatus("Prüfbericht aus dem Archiv geöffnet.")}
    function deleteArchiveEntry(id){const entries=loadArchiveEntries();const entry=entries.find(item=>item.id===id);if(!entry)return;if(!confirm("Archiv-Eintrag '"+getArchiveTitle(entry)+"' löschen?"))return;writeArchiveEntries(entries.filter(item=>item.id!==id));if(getCurrentArchiveId()===id)clearCurrentArchiveId();renderArchiveList();setArchiveStatus("Archiv-Eintrag wurde gelöscht.")}
    function renderArchiveList(){const archiveList=document.getElementById("archiveList");const entries=loadArchiveEntries().slice().sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));archiveList.innerHTML="";if(!entries.length){const empty=document.createElement("p");empty.className="archive-empty";empty.textContent="Noch keine gespeicherten Prüfberichte im Archiv.";archiveList.appendChild(empty);return}entries.forEach(entry=>{const item=document.createElement("article");item.className="archive-item";const text=document.createElement("div");const title=document.createElement("div");const meta=document.createElement("div");title.className="archive-title";meta.className="archive-meta";title.textContent=getArchiveTitle(entry);meta.textContent="Geändert: "+getDisplayDate((entry.updatedAt||"").slice(0,10));text.append(title,meta);const openButton=document.createElement("button");openButton.type="button";openButton.textContent="Öffnen";openButton.addEventListener("click",()=>openArchiveEntry(entry.id));const deleteButton=document.createElement("button");deleteButton.type="button";deleteButton.className="danger";deleteButton.textContent="Löschen";deleteButton.addEventListener("click",()=>deleteArchiveEntry(entry.id));item.append(text,openButton,deleteButton);archiveList.appendChild(item)})}
    function openArchive(){renderArchiveList();document.getElementById("archiveOverlay").hidden=false} function closeArchive(){document.getElementById("archiveOverlay").hidden=true} function setArchiveStatus(message){const status=document.getElementById("archiveStatus");if(!status)return;status.textContent=message||"";window.clearTimeout(archiveStatusTimer);if(message)archiveStatusTimer=window.setTimeout(()=>{status.textContent=""},4000)}
    function sanitizeFileName(value){return(value||"Pruefbericht-Nass-Trocken-Station").trim().replace(/[\\\\/:*?"<>|]+/g,"-").replace(/\\s+/g,"_").slice(0,80)||"Pruefbericht-Nass-Trocken-Station"} function getPdfFileName(){const anlage=sanitizeFileName(document.getElementById("anlageInput").value||"Ohne Anlagen Nr.");const objectName=sanitizeFileName(document.getElementById("objectInput").value||"Ohne Objekt");const date=document.getElementById("dateInput").value||todayIso();return anlage+"_"+objectName+"_"+date+".pdf"}
    function ensureJsPdf(){if(window.jspdf&&typeof window.jspdf.jsPDF==="function")return window.jspdf.jsPDF;if(typeof window.jsPDF==="function")return window.jsPDF;return null} async function loadJsPdfIfNeeded(){const existing=ensureJsPdf();if(existing)return existing;return new Promise(resolve=>{const script=document.createElement("script");script.src="vendor/jspdf.umd.min.js";script.onload=()=>resolve(ensureJsPdf());script.onerror=()=>resolve(null);document.head.appendChild(script)})}
    function savePdfDocument(doc,fileName){try{doc["save"](fileName)}catch{try{const blob=doc["output"]("blob");const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=fileName;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}catch{alert("PDF konnte nicht gespeichert werden. Bitte im Browser erneut öffnen und noch einmal versuchen.")}}}
    async function exportPdf(){const JsPdf=await loadJsPdfIfNeeded();if(!JsPdf){alert("PDF-Bibliothek konnte nicht geladen werden.");return}const pdfButton=document.getElementById("pdfButton");const oldText=pdfButton.textContent;pdfButton.disabled=true;pdfButton.textContent="PDF wird erstellt...";try{const pdf=new JsPdf({orientation:"portrait",unit:"mm",format:"a4",compress:true});const margin=12;const pageWidth=pdf.internal.pageSize.getWidth();const pageHeight=pdf.internal.pageSize.getHeight();const bottom=pageHeight-margin;let y=30;function clean(value){return String(value||"-").trim()||"-"}function ensure(space){if(y+space<=bottom)return;pdf.addPage();y=30;header(true)}function header(continued){pdf.setFillColor(235,0,69);pdf.rect(margin,y,pageWidth-margin*2,10,"F");pdf.setTextColor("#ffffff");pdf.setFont("helvetica","bold");pdf.setFontSize(13);pdf.text(continued?"Prüfbericht Nass/Trocken-Station (Fortsetzung)":"Prüfbericht Nass/Trocken-Station",pageWidth/2,y+6.8,{align:"center"});y+=14}function section(title){ensure(10);pdf.setDrawColor(255,255,255);pdf.setLineWidth(0.2);pdf.setFillColor(255,180,71);pdf.rect(margin,y,pageWidth-margin*2,7,"FD");pdf.setTextColor("#1c1c1e");pdf.setFont("helvetica","bold");pdf.setFontSize(8.5);pdf.text(title,margin+2,y+4.8);pdf.setTextColor("#1c1c1e");y+=8}function kv(title,rows,columns){section(title);const colWidth=(pageWidth-margin*2)/columns;rows.forEach((row,index)=>{const col=index%columns;if(col===0)ensure(13);const x=margin+col*colWidth;pdf.setDrawColor(255,255,255);pdf.setLineWidth(0.2);pdf.setFillColor("#f5f5f5");pdf.rect(x,y,colWidth,13,"FD");pdf.setFont("helvetica","bold");pdf.setFontSize(6.5);pdf.setTextColor("#6b7280");pdf.text(pdf.splitTextToSize(clean(row[0]),colWidth-4),x+2,y+3.8);pdf.setFont("helvetica","normal");pdf.setFontSize(8.2);pdf.setTextColor("#1c1c1e");pdf.text(pdf.splitTextToSize(clean(row[1]),colWidth-4),x+2,y+8.5);if(col===columns-1||index===rows.length-1)y+=13});y+=4}header(false);kv("Zuordnung",[["Anlagen Nr.",textValue("anlageInput")],["Objekt",textValue("objectInput")],["Anlagenstandort",textValue("anlagenstandortInput")],["Datum",formatDateForFile(textValue("dateInput"))]],4);kv("Anlagentyp",[["Anlagentyp",textValue("anlagentypSelect")]],1);kv("Prüfung",CHECK_FIELDS.map(item=>[item[1],document.querySelector("[data-field='"+item[0]+"']").value]),3);kv("Messwerte",[["Einschaltdruck",withUnit(textValue("einschaltdruckInput"),"bar")],["Ausschaltdruck",withUnit(textValue("ausschaltdruckInput"),"bar")],["Vordruck",withUnit(textValue("vordruckInput"),"bar")],["Vorspannung Ausdehnungsgefäß",withUnit(textValue("vorspannungInput"),"bar")]],2);kv("Anlagendaten",[["Hersteller",textValue("herstellerInput")],["Steuerungstyp",textValue("steuerungstypInput")],["Pumpentyp",textValue("pumpentypInput")],["Baujahr",textValue("baujahrInput")],["Leistung",withUnit(textValue("leistungKwInput"),"KW")],["Leistung",withUnit(textValue("leistungHInput"),"H")]],2);kv("Wasseranschluss",[["Anschluss",textValue("anschlussSelect")]],1);kv("Prüfergebnis",[["Prüfergebnis",textValue("pruefergebnisSelect")],["Bemerkung",textValue("bemerkungInput")]],1);ensure(32);section("Unterschrift Techniker");pdf.setFillColor("#f5f5f5");pdf.rect(margin,y,pageWidth-margin*2,24,"F");const signature=getStorageSignature();if(signature){try{pdf.addImage(signature,"PNG",margin+2,y+2,68,20,undefined,"FAST")}catch{pdf.text("Unterschrift konnte nicht eingebettet werden.",margin+2,y+8)}}pdf.setTextColor("#1c1c1e");pdf.setFont("helvetica","normal");pdf.setFontSize(7);pdf.text("Wir weisen auf die 3-jährliche Sachverständigenprüfpflicht nach TPrüfVO Hessen hin.",margin,pageHeight-9);if(typeof window.FSMOBILE_STAMP_PDF_LOGO==="function")window.FSMOBILE_STAMP_PDF_LOGO(pdf);savePdfDocument(pdf,getPdfFileName())}catch(error){console.error("PDF Export fehlgeschlagen",error);alert("PDF konnte nicht erstellt werden. Bitte erneut versuchen.")}finally{pdfButton.disabled=false;pdfButton.textContent=oldText||"PDF"}}
    function getStorageSignature(){const canvas=document.getElementById("signaturePad");if(!canvas)return"";try{const context=canvas.getContext("2d", { willReadFrequently: true });const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;for(let index=3;index<pixels.length;index+=4)if(pixels[index]!==0)return canvas.toDataURL("image/png")}catch{}return""}
    function restoreSignatureFromStorage(dataUrl){if(!dataUrl)return;const canvas=document.getElementById("signaturePad");const context=canvas.getContext("2d", { willReadFrequently: true });const rect=canvas.getBoundingClientRect();const img=new Image();img.onload=()=>context.drawImage(img,0,0,rect.width,rect.height);img.src=dataUrl}
    function setupSignaturePad(){const canvas=document.getElementById("signaturePad");const context=canvas.getContext("2d", { willReadFrequently: true });signaturePadState.canvas=canvas;signaturePadState.ctx=context;function resize(keep){const dataUrl=keep?getStorageSignature():"";const rect=canvas.getBoundingClientRect();const ratio=window.devicePixelRatio||1;canvas.width=Math.max(1,Math.round(rect.width*ratio));canvas.height=Math.max(1,Math.round(rect.height*ratio));context.setTransform(ratio,0,0,ratio,0,0);context.lineWidth=2.4;context.lineCap="round";context.lineJoin="round";context.strokeStyle="#1c1c1e";restoreSignatureFromStorage(dataUrl)}function point(event){const rect=canvas.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}}function start(event){event.preventDefault();signaturePadState.isDrawing=true;signaturePadState.lastPoint=point(event)}function move(event){if(!signaturePadState.isDrawing)return;event.preventDefault();const current=point(event);context.beginPath();context.moveTo(signaturePadState.lastPoint.x,signaturePadState.lastPoint.y);context.lineTo(current.x,current.y);context.stroke();signaturePadState.lastPoint=current}function end(){if(!signaturePadState.isDrawing)return;signaturePadState.isDrawing=false;signaturePadState.lastPoint=null;scheduleStorageSave()}canvas.addEventListener("pointerdown",start);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);canvas.addEventListener("pointerleave",end);window.addEventListener("resize",()=>resize(true));resize(false)}
    function clearSignature(skipSave=false){const canvas=document.getElementById("signaturePad");const context=canvas&&canvas.getContext("2d", { willReadFrequently: true });if(canvas&&context)context.clearRect(0,0,canvas.width,canvas.height);if(!skipSave)scheduleStorageSave()}
    renderChecks();setupSignaturePad();restoreFromStorage();setTodayIfEmpty();document.addEventListener("input",scheduleStorageSave);document.addEventListener("change",scheduleStorageSave);document.getElementById("archiveOverlay").addEventListener("click",event=>{if(event.target.id==="archiveOverlay")closeArchive()});document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!document.getElementById("archiveOverlay").hidden)closeArchive()});
  </script>
</body>
</html>`;
  }

  function wetExtinguishingWaterReportHtml() {
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Prüfbericht Löschwassereinrichtung Nass</title>
  <meta name="theme-color" content="#d6001c" />
  <style>
    :root {
      --primary: #007aff;
      --success: #34c759;
      --danger: #ff3b30;
      --neutral: #8e8e93;
      --warning: #ff9500;
      --bg: #f4f4f6;
      --card: #ffffff;
      --field: rgba(255,255,255,.03);
      --text: #1c1c1e;
      --muted: #6e6e73;
      --line: rgba(60, 60, 67, .14);
      --radius: 16px;
      --shadow: 0 8px 28px rgba(0,0,0,.08);
      --ios-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    body {
      margin: 0;
      padding: 18px;
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
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.36);
      border-radius: var(--radius);
      box-shadow: 0 8px 24px rgba(0,0,0,.06);
      -webkit-backdrop-filter: blur(18px);
      backdrop-filter: blur(18px);
    }
    h1 { margin: 0; font-size: 34px; line-height: 1.1; letter-spacing: 0; }
    h2, h3, label { letter-spacing: 0; }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .grid.one { grid-template-columns: 1fr; }
    .grid.two { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
    .grid.three { grid-template-columns: repeat(3, minmax(160px, 1fr)); }
    .field { min-width: 0; display: flex; flex-direction: column; }
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
      min-height: 110px;
      resize: vertical;
      line-height: 1.35;
      text-align: left;
    }
    input:focus,
    textarea:focus,
    select:focus { box-shadow: 0 0 0 3px rgba(214,0,28,.18); }
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
      transition: transform .18s var(--ios-ease), box-shadow .18s var(--ios-ease), filter .18s var(--ios-ease);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    button:hover { filter: brightness(1.02); }
    button:active { transform: scale(.975); }
    .success { background: linear-gradient(180deg, #40d96a 0%, var(--success) 100%); }
    .danger { background: linear-gradient(180deg, #ff453a 0%, var(--danger) 100%); }
    .secondary { background: linear-gradient(180deg, #a6a6ad 0%, var(--neutral) 100%); }
    .archive-save { background: linear-gradient(180deg, #ffb340 0%, var(--warning) 100%); }
    .card {
      margin-top: 16px;
      padding: 16px;
      border-radius: 16px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.42);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05);
      -webkit-backdrop-filter: blur(24px) saturate(1.18);
      backdrop-filter: blur(24px) saturate(1.18);
    }
    .section-title { margin: 0 0 12px; font-size: 22px; line-height: 1.2; }
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
      background: rgba(255,255,255,.045);
    }
    .check-label { font-weight: 780; line-height: 1.25; }
    .hint {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.35;
    }
    .dynamic-list { display: grid; gap: 10px; }
    .strand-row {
      display: grid;
      grid-template-columns: 64px repeat(4, minmax(120px, 1fr)) auto;
      gap: 10px;
      align-items: end;
      padding: 12px;
      background: rgba(255,255,255,.045);
      border-radius: 14px;
    }
    .row-number {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(255,255,255,.08);
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
    .input-unit input { min-height: 44px; background: transparent; }
    .unit { color: var(--muted); font-weight: 850; white-space: nowrap; }
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
      border: 2px dashed rgba(255,255,255,.5);
      border-radius: 12px;
      background: rgba(255,255,255,.08);
      touch-action: none;
    }
    .signature-actions { margin-top: 16px; }
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
    body.generating-pdf .hydrant-actions,
    body.generating-pdf .signature-actions,
    body.generating-pdf .archive-status { display: none !important; }
    body { padding: 0 !important; background: transparent !important; }
    .container { width: 100% !important; max-width: none !important; margin: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
    .title-actions { padding: 0 !important; background: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
    .title-bar > .title-actions, header > .title-actions, header > .toolbar { margin-right: calc(86px + env(safe-area-inset-right, 0px)) !important; }
    body.generating-pdf .title-bar > .title-actions, body.generating-pdf header > .title-actions, body.generating-pdf header > .toolbar { margin-right: 0 !important; }
    @media (max-width: 980px) {
      .grid, .grid.one, .grid.two, .grid.three, .check-grid { grid-template-columns: 1fr; }
      .strand-row { grid-template-columns: 64px 1fr; }
      .strand-row .field { grid-column: 1 / -1; }
      .title-bar, .archive-header { align-items: stretch; flex-direction: column; }
      .title-actions, .title-actions button, .archive-header button { width: 100%; }
    }
    @media (max-width: 720px) {
      .title-bar > .title-actions, header > .title-actions, header > .toolbar { margin-right: 0 !important; }
    }
  

    /* Hochformat-Transparenz: Unterschrift und lokale Formularflächen */
    .input-unit,
    .archive-item,
    .row-number,
    .cell-number,
    .hydrant-number,
    .card,
    .check-item,
    .result-item,
    .dynamic-row,
    .strand-row,
    .cell-row,
    .signature-block,
    .signature-wrap {
      border: 1px solid rgba(255,255,255,.42) !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.06) 58%, rgba(235,0,69,.035)),
        rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    #signaturePad,
    .signature-wrap canvas,
    canvas.signature-pad {
      border: 2px dashed rgba(255,255,255,.5) !important;
      background: rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(235,0,69,.035) !important;
    }

    .input-unit input,
    .input-unit select,
    .card input,
    .card textarea,
    .card select,
    .signature-block input,
    .signature-block textarea,
    .signature-block select,
    .signature-wrap input,
    .signature-wrap textarea,
    .signature-wrap select {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
    }

    .signature-actions {
      background: transparent !important;
      border-color: rgba(255,255,255,.28) !important;
      box-shadow: none !important;
    }

    .title-actions,
    .button-area,
    .toolbar {
      background: rgba(255,255,255,.08) !important;
      border-color: rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 8px 24px rgba(0,0,0,.045) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    .row-number,
    .cell-number,
    .hydrant-number {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
    }

    /* FSMobile report dropdown height alignment */
    select,
    .card select,
    .field select,
    .input-unit select,
    .dynamic-row select,
    .measurement-row select,
    .cell-row select,
    .signature-block select,
    .signature-wrap select {
      min-height: 44px !important;
      height: 44px !important;
      padding: 10px 12px !important;
      line-height: 1.25 !important;
      display: block !important;
      align-self: stretch !important;
    }

  </style>
</head>
<body>
  <div class="container" id="reportRoot">
    <div class="title-bar">
      <h1>Prüfbericht Löschwassereinrichtung Nass</h1>
      <div class="title-actions" aria-label="Archivaktionen">
        <button type="button" onclick="saveCurrentReportToArchive()" class="archive-save">Im Archiv speichern</button>
        <button type="button" onclick="openArchive()" class="archive-open">Archiv</button>
      </div>
    </div>

    <section class="card">
      <h2 class="section-title">Zuordnung</h2>
      <div class="grid">
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
      <h2 class="section-title">Anlagentyp</h2>
      <div class="grid one">
        <div class="field">
          <label for="anlagentypSelect">Anlagentyp</label>
          <select id="anlagentypSelect" name="anlagentyp">
            <option>Löschwasserleitung nass</option>
            <option>Löschwasserleitung nass /trocken</option>
          </select>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Anlagenausführung</h2>
      <div class="grid">
        <div class="field"><label for="geschossAnzahlInput">Anzahl Geschosse</label><input id="geschossAnzahlInput" name="geschossAnzahl" type="number" min="0" inputmode="numeric" /></div>
        <div class="field"><label for="schlauchanschlussAnzahlInput">Anzahl Schlauchanschlüsse</label><input id="schlauchanschlussAnzahlInput" name="schlauchanschlussAnzahl" type="number" min="0" inputmode="numeric" /></div>
        <div class="field"><label for="endtasterAnzahlInput">Schlauchanschlüsse mit Endtaster</label><input id="endtasterAnzahlInput" name="endtasterAnzahl" type="number" min="0" inputmode="numeric" /></div>
        <div class="field"><label for="faltschlauchLaengeInput">Schlauchlänge Faltschlauch</label><div class="input-unit"><input id="faltschlauchLaengeInput" name="faltschlauchLaenge" type="number" step="0.1" inputmode="decimal" /><span class="unit">m</span></div></div>
        <div class="field"><label for="druckschlauchLaengeInput">Schlauchlänge formbeständiger Druckschlauch</label><div class="input-unit"><input id="druckschlauchLaengeInput" name="druckschlauchLaenge" type="number" step="0.1" inputmode="decimal" /><span class="unit">m</span></div></div>
        <div class="field">
          <label for="wandhydrantAusfuehrungSelect">Wandhydrant Ausführung</label>
          <select id="wandhydrantAusfuehrungSelect" name="wandhydrantAusfuehrung">
            <option>Typ F</option>
            <option>Typ S</option>
          </select>
        </div>
      </div>
      <div class="check-grid" id="anlageChecks"></div>
    </section>

    <section class="card">
      <h2 class="section-title">Messwerte Leitungsstrang</h2>
      <div class="dynamic-list" id="strandList"></div>
      <div class="actions">
        <button type="button" class="success" onclick="addStrand()">Leitungsstrang hinzufügen</button>
        <button type="button" class="danger" onclick="removeStrand()">Letzten Leitungsstrang löschen</button>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Schlauchprüfung</h2>
      <div class="check-grid" id="hoseChecks"></div>
      <div class="grid two" style="margin-top:12px">
        <div class="field"><label for="lastHoseDateInput">Letzte Schlauchdruckprüfung</label><input id="lastHoseDateInput" name="lastHoseDate" type="date" /></div>
        <div class="field"><label for="nextHoseDateInput">Nächste Schlauchdruckprüfung</label><input id="nextHoseDateInput" name="nextHoseDate" type="date" /></div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Wasseranschluss</h2>
      <div class="check-grid" id="waterChecks"></div>
      <div class="grid one" style="margin-top:12px">
        <div class="field">
          <label for="anschlussSelect">Anschluss</label>
          <select id="anschlussSelect" name="anschluss">
            <option>Mittelbarer Anschluss getrennt</option>
            <option>Unmittelbarer Anschluss am Trinkwassernetz</option>
          </select>
          <p class="hint">Bei unmittelbarem Anschluss an das Trinkwassernetz sind nach Trinkwasserverordnung Maßnahmen zu treffen, um eine Verkeimung des Wassers durch die Löschanlage zu verhindern.</p>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfergebnis</h2>
      <div class="grid one">
        <div class="field">
          <label for="pruefergebnisSelect">Prüfergebnis</label>
          <select id="pruefergebnisSelect" name="pruefergebnis">
            <option>Anlage nicht einsatzbereit</option>
            <option>Anlage bedingt einsatzbereit</option>
            <option>Anlage einsatzbereit</option>
          </select>
        </div>
        <div class="field">
          <label for="bemerkungInput">Bemerkung</label>
          <textarea id="bemerkungInput" name="bemerkung"></textarea>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfer und Unterschrift</h2>
      <div class="grid one">
        <div class="field">
          <label for="prueferInput">Prüfer</label>
          <input id="prueferInput" name="pruefer" type="text" autocomplete="off" />
        </div>
      </div>
      <div class="signature-block">
        <h3>Unterschrift Techniker</h3>
        <canvas id="signaturePad" aria-label="Unterschrift Techniker"></canvas>
        <div class="signature-actions">
          <button type="button" onclick="clearSignature()" class="danger">Unterschrift löschen</button>
        </div>
      </div>
      <p style="margin:12px 0 0;color:var(--muted);font-weight:700;font-size:13px">Wir weisen auf die 3-jährliche Sachverständigenprüfpflicht nach TPrüfVO Hessen hin.</p>
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
    const STORAGE_KEY = "fsmobile-pb-loeschwasser-nass-v1";
    const ARCHIVE_STORAGE_KEY = "fsmobile-pb-loeschwasser-nass-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "fsmobile-pb-loeschwasser-nass-current-v1";
    const CHECK_FIELDS = [
      ["haspelRichtung", "Abrollrichtung der Haspel in Ordnung", "anlageChecks"],
      ["beschilderung", "Beschilderung vorhanden", "anlageChecks"],
      ["bedienungsanleitung", "Bedienungsanleitung vorhanden", "anlageChecks"],
      ["anschlussventil", "Anschlussventil leichtgängig", "anlageChecks"],
      ["entlueftung", "Entlüftung vorhanden", "anlageChecks"],
      ["entleerungNassTrocken", "Entleerung vorhanden bei nass/trocken", "anlageChecks"],
      ["fliessdruckKleiner85", "Fließdruck an den Ventilen kleiner 8,5 bar", "anlageChecks"],
      ["standdruckKleiner12", "Standdruck an den Ventilen kleiner 12 bar", "anlageChecks"],
      ["schlaeucheGeprueft", "Schläuche geprüft", "hoseChecks"],
      ["strahlrohrGeprueft", "Strahlrohr / Eurodüse geprüft", "hoseChecks"],
      ["druckerhoehungsanlage", "Druckerhöhungsanlage vorhanden", "waterChecks"],
      ["fuellstation", "Nass-/Trocken Füllstation vorhanden", "waterChecks"]
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

    function renderChecks() {
      CHECK_FIELDS.forEach(([key, label, targetId]) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        const row = document.createElement("label");
        row.className = "check-item";
        row.innerHTML = '<span class="check-label">' + label + '</span><select data-field="' + key + '" name="' + key + '"><option value="false">Nein</option><option value="true">Ja</option></select>';
        target.appendChild(row);
      });
    }

    function strandRow(data = {}) {
      const list = document.getElementById("strandList");
      const row = document.createElement("div");
      row.className = "strand-row";
      row.innerHTML = '<div class="row-number"></div>' +
        '<div class="field"><label>Erste Entnahmestelle Druck</label><div class="input-unit"><input data-field="ersteDruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>' +
        '<div class="field"><label>Erste Entnahmestelle Volumenstrom</label><div class="input-unit"><input data-field="ersteVolumenstrom" type="number" step="0.01" inputmode="decimal"><span class="unit">l/min</span></div></div>' +
        '<div class="field"><label>Letzte Entnahmestelle Druck</label><div class="input-unit"><input data-field="letzteDruck" type="number" step="0.01" inputmode="decimal"><span class="unit">bar</span></div></div>' +
        '<div class="field"><label>Letzte Entnahmestelle Volumenstrom</label><div class="input-unit"><input data-field="letzteVolumenstrom" type="number" step="0.01" inputmode="decimal"><span class="unit">l/min</span></div></div>' +
        '<button type="button" class="danger" aria-label="Leitungsstrang löschen">Löschen</button>';
      row.querySelector("[data-field='ersteDruck']").value = data.ersteDruck || "";
      row.querySelector("[data-field='ersteVolumenstrom']").value = data.ersteVolumenstrom || "";
      row.querySelector("[data-field='letzteDruck']").value = data.letzteDruck || "";
      row.querySelector("[data-field='letzteVolumenstrom']").value = data.letzteVolumenstrom || "";
      row.querySelector("button").addEventListener("click", () => {
        const rows = Array.from(document.querySelectorAll(".strand-row"));
        if (rows.length <= 1) row.querySelectorAll("input").forEach(input => { input.value = ""; });
        else row.remove();
        renumberStrands();
        scheduleStorageSave();
      });
      list.appendChild(row);
      renumberStrands();
      return row;
    }

    function addStrand(data) {
      strandRow(data || {});
      scheduleStorageSave();
    }

    function removeStrand() {
      const rows = Array.from(document.querySelectorAll(".strand-row"));
      if (rows.length <= 1) {
        if (rows[0]) rows[0].querySelectorAll("input").forEach(input => { input.value = ""; });
      } else rows[rows.length - 1].remove();
      renumberStrands();
      scheduleStorageSave();
    }

    function renumberStrands() {
      document.querySelectorAll(".strand-row").forEach((row, index) => {
        row.querySelector(".row-number").textContent = String(index + 1);
      });
    }

    function collectStrand(row) {
      return {
        ersteDruck: row.querySelector("[data-field='ersteDruck']").value || "",
        ersteVolumenstrom: row.querySelector("[data-field='ersteVolumenstrom']").value || "",
        letzteDruck: row.querySelector("[data-field='letzteDruck']").value || "",
        letzteVolumenstrom: row.querySelector("[data-field='letzteVolumenstrom']").value || ""
      };
    }

    function textValue(id) {
      const el = document.getElementById(id);
      return el && "value" in el ? el.value || "" : "";
    }

    function boolLabel(value) {
      return String(value) === "true" ? "Ja" : "Nein";
    }

    function withUnit(value, unit) {
      const clean = String(value || "").trim();
      return clean ? clean + " " + unit : "";
    }

    function collectData() {
      const fields = {
        anlage: textValue("anlageInput"),
        object: textValue("objectInput"),
        anlagenstandort: textValue("anlagenstandortInput"),
        date: textValue("dateInput"),
        anlagentyp: textValue("anlagentypSelect"),
        geschossAnzahl: textValue("geschossAnzahlInput"),
        schlauchanschlussAnzahl: textValue("schlauchanschlussAnzahlInput"),
        endtasterAnzahl: textValue("endtasterAnzahlInput"),
        faltschlauchLaenge: textValue("faltschlauchLaengeInput"),
        druckschlauchLaenge: textValue("druckschlauchLaengeInput"),
        wandhydrantAusfuehrung: textValue("wandhydrantAusfuehrungSelect"),
        lastHoseDate: textValue("lastHoseDateInput"),
        nextHoseDate: textValue("nextHoseDateInput"),
        anschluss: textValue("anschlussSelect"),
        pruefergebnis: textValue("pruefergebnisSelect"),
        bemerkung: textValue("bemerkungInput"),
        pruefer: textValue("prueferInput")
      };
      document.querySelectorAll("[data-field]").forEach(field => {
        if (field.closest(".strand-row")) return;
        fields[field.dataset.field] = field.value || "";
      });
      return {
        fields,
        strands: Array.from(document.querySelectorAll(".strand-row")).map(collectStrand),
        signature: getStorageSignature(),
        savedAt: new Date().toISOString()
      };
    }

    function setValue(id, value) {
      const el = document.getElementById(id);
      if (el && "value" in el) el.value = value || "";
    }

    function applyData(data) {
      storageRestoreInProgress = true;
      const fields = data && data.fields ? data.fields : {};
      setValue("anlageInput", fields.anlage);
      setValue("objectInput", fields.object);
      setValue("anlagenstandortInput", fields.anlagenstandort);
      setValue("dateInput", fields.date);
      setValue("anlagentypSelect", fields.anlagentyp || "Löschwasserleitung nass");
      setValue("geschossAnzahlInput", fields.geschossAnzahl);
      setValue("schlauchanschlussAnzahlInput", fields.schlauchanschlussAnzahl);
      setValue("endtasterAnzahlInput", fields.endtasterAnzahl);
      setValue("faltschlauchLaengeInput", fields.faltschlauchLaenge);
      setValue("druckschlauchLaengeInput", fields.druckschlauchLaenge);
      setValue("wandhydrantAusfuehrungSelect", fields.wandhydrantAusfuehrung || "Typ F");
      setValue("lastHoseDateInput", fields.lastHoseDate);
      setValue("nextHoseDateInput", fields.nextHoseDate);
      setValue("anschlussSelect", fields.anschluss || "Mittelbarer Anschluss getrennt");
      setValue("pruefergebnisSelect", fields.pruefergebnis || "Anlage einsatzbereit");
      setValue("bemerkungInput", fields.bemerkung);
      setValue("prueferInput", fields.pruefer);
      document.querySelectorAll("[data-field]").forEach(field => {
        if (field.closest(".strand-row")) return;
        field.value = fields[field.dataset.field] || "false";
      });
      const list = document.getElementById("strandList");
      list.innerHTML = "";
      const rows = Array.isArray(data && data.strands) && data.strands.length ? data.strands : [{}];
      rows.forEach(row => strandRow(row));
      setTodayIfEmpty();
      clearSignature(true);
      restoreSignatureFromStorage(data && data.signature);
      storageRestoreInProgress = false;
    }

    function saveToStorageNow() {
      if (storageRestoreInProgress) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData())); }
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
      applyData(saved);
    }

    function clearForm() {
      if (!confirm("Alle Eingaben wirklich löschen?")) return;
      localStorage.removeItem(STORAGE_KEY);
      clearCurrentArchiveId();
      applyData(null);
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
        report: collectData()
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
      applyData(entry.report);
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
      return (value || "Pruefbericht-Loeschwasser-Nass").trim().replace(/[\\\\/:*?"<>|]+/g, "-").replace(/\\s+/g, "_").slice(0, 80) || "Pruefbericht-Loeschwasser-Nass";
    }

    function getPdfFileName() {
      const anlage = sanitizeFileName(document.getElementById("anlageInput").value || "Ohne Anlagen Nr.");
      const objectName = sanitizeFileName(document.getElementById("objectInput").value || "Ohne Objekt");
      const date = document.getElementById("dateInput").value || todayIso();
      return anlage + "_" + objectName + "_" + date + ".pdf";
    }

    function addPdfCell(doc, label, value) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.2);
      doc.text(label, 12, doc.lastAutoY || 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(String(value || "-"), 12, (doc.lastAutoY || 12) + 4);
      doc.lastAutoY = (doc.lastAutoY || 12) + 9;
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

    async function exportPdf() {
      const JsPdf = await loadJsPdfIfNeeded();
      if (!JsPdf) {
        alert("PDF-Bibliothek konnte nicht geladen werden.");
        return;
      }
      const pdfButton = document.getElementById("pdfButton");
      const oldText = pdfButton.textContent;
      pdfButton.disabled = true;
      pdfButton.textContent = "PDF wird erstellt...";
      try {
        const pdf = new JsPdf({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const margin = 12;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const bottom = pageHeight - margin;
        let y = 30;
        function clean(value) { return String(value || "-").trim() || "-"; }
        function ensure(space) { if (y + space <= bottom) return; pdf.addPage(); y = 30; header(true); }
        function header(continued) {
          pdf.setFillColor(235, 0, 69);
          pdf.rect(margin, y, pageWidth - margin * 2, 10, "F");
          pdf.setTextColor("#ffffff");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.text(continued ? "Prüfbericht Löschwassereinrichtung Nass (Fortsetzung)" : "Prüfbericht Löschwassereinrichtung Nass", pageWidth / 2, y + 6.8, { align: "center" });
          y += 14;
        }
        function section(title) {
          ensure(10);
          pdf.setDrawColor(255, 255, 255);
          pdf.setLineWidth(0.2);
          pdf.setFillColor(255, 180, 71);
          pdf.rect(margin, y, pageWidth - margin * 2, 7, "FD");
          pdf.setTextColor("#1c1c1e");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(8.5);
          pdf.text(title, margin + 2, y + 4.8);
          pdf.setTextColor("#1c1c1e");
          y += 8;
        }
        function kv(title, rows, columns) {
          section(title);
          const colWidth = (pageWidth - margin * 2) / columns;
          rows.forEach((row, index) => {
            const col = index % columns;
            if (col === 0) ensure(13);
            const x = margin + col * colWidth;
            pdf.setDrawColor(255, 255, 255);
            pdf.setLineWidth(0.2);
            pdf.setFillColor("#f5f5f5");
            pdf.rect(x, y, colWidth, 13, "FD");
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(6.5);
            pdf.setTextColor("#6b7280");
            pdf.text(pdf.splitTextToSize(clean(row[0]), colWidth - 4), x + 2, y + 3.8);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8.2);
            pdf.setTextColor("#1c1c1e");
            pdf.text(pdf.splitTextToSize(clean(row[1]), colWidth - 4), x + 2, y + 8.5);
            if (col === columns - 1 || index === rows.length - 1) y += 13;
          });
          y += 4;
        }
        function table(title, headers, rows, widths) {
          section(title);
          const tableRows = rows.length ? rows : [headers.map(() => "-")];
          function headerTextLines(head, index) {
            return String(head || "")
              .split(String.fromCharCode(10))
              .flatMap(part => pdf.splitTextToSize(clean(part), widths[index] - 4))
              .filter(Boolean);
          }
          function tableHeader() {
            let x = margin;
            const headerLines = headers.map(headerTextLines);
            const headerHeight = Math.max(10, ...headerLines.map(lines => lines.length * 3.4 + 4));
            const headerTop = y;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(6.8);
            headers.forEach((_, index) => {
              pdf.setDrawColor(255, 255, 255);
              pdf.setLineWidth(0.2);
              pdf.setFillColor(255, 180, 71);
              pdf.rect(x, headerTop, widths[index], headerHeight, "FD");
              x += widths[index];
            });
            x = margin;
            pdf.setTextColor("#1c1c1e");
            headerLines.forEach((lines, index) => {
              const firstLineY = headerTop + Math.max(4.2, (headerHeight - (lines.length - 1) * 3.3) / 2 + 1.7);
              lines.forEach((line, lineIndex) => {
                pdf.text(String(line), x + widths[index] / 2, firstLineY + lineIndex * 3.3, { align: "center" });
              });
              x += widths[index];
            });
            pdf.setTextColor("#1c1c1e");
            y = headerTop + headerHeight;
          }
          ensure(22);
          tableHeader();
          tableRows.forEach(row => {
            const wrapped = row.map((value, index) => pdf.splitTextToSize(clean(value), widths[index] - 4));
            const rowHeight = Math.max(9, ...wrapped.map(lines => lines.length * 3.5 + 4));
            if (y + rowHeight > bottom) { pdf.addPage(); y = 30; header(true); section(title + " (Fortsetzung)"); tableHeader(); }
            let x = margin;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7.8);
            pdf.setTextColor("#1c1c1e");
            wrapped.forEach((lines, index) => {
              pdf.setDrawColor(255, 255, 255);
              pdf.setLineWidth(0.2);
              pdf.setFillColor("#f5f5f5");
              pdf.rect(x, y, widths[index], rowHeight, "FD");
              pdf.text(lines, x + 2, y + 5);
              x += widths[index];
            });
            y += rowHeight;
          });
          y += 4;
        }
        header(false);
        kv("Zuordnung", [
          ["Anlagen Nr.", textValue("anlageInput")],
          ["Objekt", textValue("objectInput")],
          ["Anlagenstandort", textValue("anlagenstandortInput")],
          ["Datum", formatDateForFile(textValue("dateInput"))]
        ], 4);
        kv("Anlagentyp", [["Anlagentyp", textValue("anlagentypSelect")]], 1);
        kv("Anlagenausführung", [
          ["Anzahl Geschosse", textValue("geschossAnzahlInput")],
          ["Anzahl Schlauchanschlüsse", textValue("schlauchanschlussAnzahlInput")],
          ["Schlauchanschlüsse mit Endtaster", textValue("endtasterAnzahlInput")],
          ["Schlauchlänge Faltschlauch", withUnit(textValue("faltschlauchLaengeInput"), "m")],
          ["Schlauchlänge formbeständiger Druckschlauch", withUnit(textValue("druckschlauchLaengeInput"), "m")],
          ["Wandhydrant Ausführung", textValue("wandhydrantAusfuehrungSelect")],
          ...CHECK_FIELDS.filter(item => item[2] === "anlageChecks").map(item => [item[1], boolLabel(document.querySelector("[data-field='" + item[0] + "']").value)])
        ], 2);
        table("Messwerte Leitungsstrang", ["Nr.", "Erste Entnahmestelle\\nDruck (bar)", "Erste Entnahmestelle\\nVolumenstrom (l/min)", "Letzte Entnahmestelle\\nDruck (bar)", "Letzte Entnahmestelle\\nVolumenstrom (l/min)"],
          Array.from(document.querySelectorAll(".strand-row")).map((row, index) => {
            const data = collectStrand(row);
            return [String(index + 1), withUnit(data.ersteDruck, "bar"), withUnit(data.ersteVolumenstrom, "l/min"), withUnit(data.letzteDruck, "bar"), withUnit(data.letzteVolumenstrom, "l/min")];
          }),
          [12, 42, 42, 42, 42]
        );
        kv("Schlauchprüfung", [
          ...CHECK_FIELDS.filter(item => item[2] === "hoseChecks").map(item => [item[1], boolLabel(document.querySelector("[data-field='" + item[0] + "']").value)]),
          ["Letzte Schlauchdruckprüfung", formatDateForFile(textValue("lastHoseDateInput"))],
          ["Nächste Schlauchdruckprüfung", formatDateForFile(textValue("nextHoseDateInput"))]
        ], 2);
        kv("Wasseranschluss", [
          ...CHECK_FIELDS.filter(item => item[2] === "waterChecks").map(item => [item[1], boolLabel(document.querySelector("[data-field='" + item[0] + "']").value)]),
          ["Anschluss", textValue("anschlussSelect")]
        ], 1);
        kv("Prüfergebnis", [
          ["Prüfergebnis", textValue("pruefergebnisSelect")],
          ["Bemerkung", textValue("bemerkungInput")]
        ], 1);
        ensure(32);
        section("Unterschrift Techniker");
        pdf.setFillColor("#f5f5f5");
        pdf.rect(margin, y, pageWidth - margin * 2, 24, "F");
        const signature = getStorageSignature();
        if (signature) {
          try { pdf.addImage(signature, "PNG", margin + 2, y + 2, 68, 20, undefined, "FAST"); }
          catch { pdf.text("Unterschrift konnte nicht eingebettet werden.", margin + 2, y + 8); }
        }
        pdf.setTextColor("#1c1c1e");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.text("Wir weisen auf die 3-jährliche Sachverständigenprüfpflicht nach TPrüfVO Hessen hin.", margin, pageHeight - 9);
        if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(pdf);
        savePdfDocument(pdf, getPdfFileName());
      } catch (error) {
        console.error("PDF Export fehlgeschlagen", error);
        alert("PDF konnte nicht erstellt werden. Bitte erneut versuchen.");
      } finally {
        pdfButton.disabled = false;
        pdfButton.textContent = oldText || "PDF";
      }
    }

    function getStorageSignature() {
      const canvas = document.getElementById("signaturePad");
      if (!canvas) return "";
      try {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let index = 3; index < pixels.length; index += 4) if (pixels[index] !== 0) return canvas.toDataURL("image/png");
      } catch {}
      return "";
    }

    function restoreSignatureFromStorage(dataUrl) {
      if (!dataUrl) return;
      const canvas = document.getElementById("signaturePad");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const rect = canvas.getBoundingClientRect();
      const img = new Image();
      img.onload = () => context.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = dataUrl;
    }

    function setupSignaturePad() {
      const canvas = document.getElementById("signaturePad");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      signaturePadState.canvas = canvas;
      signaturePadState.ctx = context;
      function resize(keep) {
        const dataUrl = keep ? getStorageSignature() : "";
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * ratio));
        canvas.height = Math.max(1, Math.round(rect.height * ratio));
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.lineWidth = 2.4;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "#1c1c1e";
        restoreSignatureFromStorage(dataUrl);
      }
      function point(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }
      function start(event) {
        event.preventDefault();
        signaturePadState.isDrawing = true;
        signaturePadState.lastPoint = point(event);
      }
      function move(event) {
        if (!signaturePadState.isDrawing) return;
        event.preventDefault();
        const current = point(event);
        context.beginPath();
        context.moveTo(signaturePadState.lastPoint.x, signaturePadState.lastPoint.y);
        context.lineTo(current.x, current.y);
        context.stroke();
        signaturePadState.lastPoint = current;
      }
      function end() {
        if (!signaturePadState.isDrawing) return;
        signaturePadState.isDrawing = false;
        signaturePadState.lastPoint = null;
        scheduleStorageSave();
      }
      canvas.addEventListener("pointerdown", start);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", end);
      canvas.addEventListener("pointercancel", end);
      canvas.addEventListener("pointerleave", end);
      window.addEventListener("resize", () => resize(true));
      resize(false);
    }

    function clearSignature(skipSave = false) {
      const canvas = document.getElementById("signaturePad");
      const context = canvas && canvas.getContext("2d", { willReadFrequently: true });
      if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
      if (!skipSave) scheduleStorageSave();
    }

    renderChecks();
    setupSignaturePad();
    restoreFromStorage();
    setTodayIfEmpty();
    document.addEventListener("input", scheduleStorageSave);
    document.addEventListener("change", scheduleStorageSave);
    document.getElementById("archiveOverlay").addEventListener("click", event => {
      if (event.target.id === "archiveOverlay") closeArchive();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !document.getElementById("archiveOverlay").hidden) closeArchive();
    });
  </script>
</body>
</html>`;
  }

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
      --field: rgba(255,255,255,.03);
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
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.36);
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
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.42);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05);
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
      background: rgba(255,255,255,.045);
    }

    .check-label { font-weight: 780; line-height: 1.25; }

    .dynamic-list { display: grid; gap: 10px; }

    .cell-row {
      display: grid;
      grid-template-columns: 70px repeat(3, minmax(150px, 1fr)) auto;
      gap: 10px;
      align-items: end;
      padding: 12px;
      background: rgba(255,255,255,.045);
      border-radius: 14px;
    }

    .cell-number {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(255,255,255,.08);
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
      border: 2px dashed rgba(255,255,255,.5);
      border-radius: 12px;
      background: rgba(255,255,255,.08);
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
  

    /* Hochformat-Transparenz: Unterschrift und lokale Formularflächen */
    .input-unit,
    .archive-item,
    .row-number,
    .cell-number,
    .hydrant-number,
    .card,
    .check-item,
    .result-item,
    .dynamic-row,
    .strand-row,
    .cell-row,
    .signature-block,
    .signature-wrap {
      border: 1px solid rgba(255,255,255,.42) !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.06) 58%, rgba(235,0,69,.035)),
        rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    #signaturePad,
    .signature-wrap canvas,
    canvas.signature-pad {
      border: 2px dashed rgba(255,255,255,.5) !important;
      background: rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(235,0,69,.035) !important;
    }

    .input-unit input,
    .input-unit select,
    .card input,
    .card textarea,
    .card select,
    .signature-block input,
    .signature-block textarea,
    .signature-block select,
    .signature-wrap input,
    .signature-wrap textarea,
    .signature-wrap select {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
    }

    .signature-actions {
      background: transparent !important;
      border-color: rgba(255,255,255,.28) !important;
      box-shadow: none !important;
    }

    .title-actions,
    .button-area,
    .toolbar {
      background: rgba(255,255,255,.08) !important;
      border-color: rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 8px 24px rgba(0,0,0,.045) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    .row-number,
    .cell-number,
    .hydrant-number {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
    }

    /* FSMobile report dropdown height alignment */
    select,
    .card select,
    .field select,
    .input-unit select,
    .dynamic-row select,
    .measurement-row select,
    .cell-row select,
    .signature-block select,
    .signature-wrap select {
      min-height: 44px !important;
      height: 44px !important;
      padding: 10px 12px !important;
      line-height: 1.25 !important;
      display: block !important;
      align-self: stretch !important;
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
        <h3>Unterschrift Techniker</h3>
        <canvas id="signaturePad" aria-label="Unterschrift Techniker"></canvas>
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
      const dateName = document.getElementById("dateInput").value || todayIso();
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
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.setFillColor(255, 180, 71);
      doc.rect(x, y, width, 6.2, "FD");
      doc.setTextColor("#111827");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(title, x + 2, y + 4.3);
      return y + 6.2;
    }

    function drawCell(doc, label, value, x, y, width, height) {
      doc.setDrawColor(255, 255, 255);
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
        let y = 30;

        function drawDocumentHeader() {
          doc.setFillColor(235, 0, 69);
          doc.rect(margin, 30, contentWidth, 10, "F");
          doc.setTextColor("#ffffff");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.text("PRÜFBERICHT ZENTRALBATTERIE-ANLAGE", pageWidth / 2, 36.8, { align: "center" });
          doc.setTextColor("#111827");
          return 44;
        }

        function ensureSpace(needed) {
          if (y + needed <= pageHeight - margin - 10) return;
          doc.addPage("a4", "portrait");
          y = drawDocumentHeader();
        }

        y = drawDocumentHeader();

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
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.2);
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
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.2);
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
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.2);
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
        doc.text("Unterschrift Techniker", margin, y + 26);

        if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(doc);
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
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
      if (!canvas || !canvas.width || !canvas.height) return true;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return true;
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

  function hydrantsReportHtml() {
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Prüfbericht Hydranten</title>
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
      --card: rgba(255,255,255,.075);
      --field: rgba(255,255,255,.055);
      --text: #1c1c1e;
      --muted: #6e6e73;
      --line: rgba(60, 60, 67, .14);
      --radius: 16px;
      --shadow: inset 0 1px 0 rgba(255,255,255,.32), 0 12px 34px rgba(0,0,0,.06);
      --ios-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; background: transparent; }
    body {
      margin: 0;
      padding: 0 !important;
      background: transparent !important;
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Arial, sans-serif;
    }

    .container {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 20px;
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
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
    .signature-actions,
    .hydrant-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .title-actions {
      justify-content: flex-end;
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
      margin-right: calc(86px + env(safe-area-inset-right, 0px)) !important;
    }

    body.generating-pdf .title-actions { margin-right: 0 !important; }

    h1 { margin: 0; font-size: 34px; line-height: 1.1; letter-spacing: 0; }
    h2, h3, label { letter-spacing: 0; }

    .header-row,
    .field-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(160px, 1fr));
      gap: 12px;
    }

    .field-grid.three {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      align-items: start;
    }
    .field-grid.two { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
    .field-grid.one { grid-template-columns: 1fr; }

    .field {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .field-grid.three > .field,
    .field-grid.three input,
    .field-grid.three select {
      min-width: 0;
      max-width: 100%;
    }

    .field-grid.three.hydrant-foundation-grid {
      grid-template-columns: minmax(220px, .9fr) minmax(260px, 1fr) minmax(0, 240px);
      align-items: start;
    }

    .hydrant-foundation-grid .field {
      width: 100%;
      min-width: 0;
    }

    .hydrant-foundation-grid input:not([type="checkbox"]),
    .hydrant-foundation-grid select {
      width: 100% !important;
      max-width: 100% !important;
    }

    .hydrant-foundation-grid .next-date-field {
      justify-self: end;
      width: min(100%, 240px);
      max-width: 240px;
    }

    .hydrant-foundation-grid .next-date-field input {
      width: 100% !important;
      max-width: 240px !important;
    }

    .hydrant-foundation-grid .yes-no {
      flex-wrap: nowrap;
      align-items: stretch;
    }

    .hydrant-foundation-grid .yes-no .check-item {
      flex: 0 0 auto;
      min-width: 78px;
      white-space: nowrap;
    }

    label {
      margin: 0 0 6px;
      color: var(--muted);
      font-size: 15px;
      font-weight: 700;
      line-height: 1.2;
    }

    input[type="text"],
    input[type="date"],
    input[type="number"],
    textarea,
    select {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.30);
      border-radius: 12px;
      background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.016));
      color: var(--text);
      font: inherit;
      font-size: 16px;
      font-weight: 650;
      outline: none;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.13), 0 1px 0 rgba(2,8,23,.035);
      -webkit-tap-highlight-color: transparent;
    }

    select {
      min-height: 44px !important;
      height: 44px !important;
      padding: 10px 12px !important;
      line-height: 1.25 !important;
      display: block !important;
      align-self: stretch !important;
    }

    textarea {
      min-height: 44px;
      resize: none;
      overflow: hidden;
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
    .success { background: linear-gradient(180deg, #40d96a 0%, var(--success) 100%); box-shadow: 0 10px 20px rgba(52,199,89,.22), inset 0 1px 0 rgba(255,255,255,.28); }
    .danger { background: linear-gradient(180deg, #ff453a 0%, var(--danger) 100%); box-shadow: 0 10px 20px rgba(255,59,48,.22), inset 0 1px 0 rgba(255,255,255,.28); }
    .secondary { background: linear-gradient(180deg, #a6a6ad 0%, var(--neutral) 100%); box-shadow: 0 10px 20px rgba(142,142,147,.22), inset 0 1px 0 rgba(255,255,255,.28); }
    .archive-save { background: linear-gradient(180deg, #ffb340 0%, var(--warning) 100%); box-shadow: 0 10px 20px rgba(255,149,0,.22), inset 0 1px 0 rgba(255,255,255,.28); }
    .duplicate-btn { background: linear-gradient(180deg, #6e6cff 0%, #5856d6 100%); box-shadow: 0 10px 20px rgba(88,86,214,.24), inset 0 1px 0 rgba(255,255,255,.32); }

    .card,
    .hydrant-card,
    .check-item,
    .signature-block,
    .archive-item {
      margin-top: 16px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,.42);
      border-radius: var(--radius);
      background:
        linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.06) 58%, rgba(235,0,69,.035)),
        rgba(255,255,255,.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05);
      -webkit-backdrop-filter: blur(18px) saturate(1.08);
      backdrop-filter: blur(18px) saturate(1.08);
    }

    .section-title {
      margin: 0 0 12px;
      font-size: 22px;
      line-height: 1.2;
    }

    .hydrant-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 12px;
    }

    .hydrant-card-header h2 {
      margin: 0;
      font-size: 22px;
    }

    .hydrant-card-header .hydrant-number {
      min-width: 0 !important;
      min-height: 0 !important;
      display: inline !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
      font-weight: 850;
    }

    .input-unit {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding-right: 10px;
      border: 1px solid rgba(255,255,255,.30);
      border-radius: 12px;
      background: rgba(255,255,255,.018);
    }

    .input-unit input {
      min-height: 42px;
      border: 0;
      background: transparent;
      box-shadow: none;
    }

    .unit {
      color: var(--muted);
      font-weight: 850;
      white-space: nowrap;
    }

    .check-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .check-item {
      margin-top: 0;
      min-height: 44px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 9px;
      padding: 10px 12px;
      color: var(--text);
      font-weight: 760;
      line-height: 1.25;
      user-select: none;
    }

    .check-item input {
      width: 22px;
      min-width: 22px;
      height: 22px;
      min-height: 0;
      margin: 0;
      accent-color: var(--brand);
    }

    .yes-no {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .signature-block h3 { margin: 0 0 10px; font-size: 18px; }

    #signaturePad {
      display: block;
      width: 100%;
      height: 180px;
      border: 2px dashed rgba(255,255,255,.44);
      border-radius: 12px;
      background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
      box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 0 0 1px rgba(235,0,69,.025);
      touch-action: none;
    }

    .signature-actions { margin-top: 10px; }
    .actions { margin-top: 16px; }
    .hydrant-actions { margin-top: 16px; }
    .archive-status { min-height: 18px; margin: 12px 0 0; color: var(--muted); font-size: 13px; font-weight: 700; line-height: 1.3; }

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
      background: rgba(245,247,251,.94);
      border-radius: 20px;
      box-shadow: 0 24px 70px rgba(0,0,0,.25);
    }

    .archive-header h2 { margin: 0; font-size: 24px; }
    .archive-list { display: grid; gap: 10px; margin-top: 14px; }
    .archive-empty { margin: 0; color: var(--muted); font-weight: 700; }
    .archive-item { margin-top: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 10px; align-items: center; }
    .archive-title { font-weight: 850; overflow-wrap: anywhere; }
    .archive-meta { margin-top: 3px; color: var(--muted); font-size: 13px; font-weight: 700; }

    body.generating-pdf .title-actions,
    body.generating-pdf .actions,
    body.generating-pdf .signature-actions,
    body.generating-pdf .archive-status { display: none !important; }

    @media (max-width: 900px) {
      .header-row,
      .field-grid,
      .field-grid.three,
      .field-grid.two,
      .check-grid { grid-template-columns: 1fr; }
      .title-bar,
      .archive-header,
      .hydrant-card-header { align-items: stretch; flex-direction: column; }
      .title-actions,
      .title-actions button,
      .archive-header button { width: 100%; }
    }

    @media (max-width: 760px) {
      .field-grid.three.hydrant-foundation-grid {
        grid-template-columns: 1fr;
      }

      .hydrant-foundation-grid .next-date-field {
        justify-self: stretch;
        width: 100%;
        max-width: none;
      }

      .hydrant-foundation-grid .next-date-field input {
        max-width: 100% !important;
      }
    }

    @media (max-width: 720px) {
      .title-actions { margin-right: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="container" id="reportRoot">
    <div class="title-bar">
      <h1>Prüfbericht Hydranten</h1>
      <div class="title-actions" aria-label="Archivaktionen">
        <button type="button" onclick="saveCurrentReportToArchive()" class="archive-save">Im Archiv speichern</button>
        <button type="button" onclick="openArchive()" class="archive-open">Archiv</button>
      </div>
    </div>

    <section class="card">
      <h2 class="section-title">Zuordnung</h2>
      <div class="header-row">
        <div class="field">
          <label for="objectInput">Objekt</label>
          <input id="objectInput" name="object" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="anlageInput">Anlagen Nr.</label>
          <input id="anlageInput" name="anlage" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="prueferInput">Techniker</label>
          <input id="prueferInput" name="pruefer" type="text" autocomplete="off" />
        </div>
        <div class="field">
          <label for="dateInput">Datum</label>
          <input id="dateInput" name="date" type="date" />
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Prüfgrundlage</h2>
      <div class="field-grid three hydrant-foundation-grid">
        <div class="field">
          <label>Entspr. DIN 14462/DIN - EN1988/600</label>
          <div class="yes-no">
            <label class="check-item"><input id="dinYesInput" name="dinCompliant" type="checkbox" value="Ja" />Ja</label>
            <label class="check-item"><input id="dinNoInput" name="dinCompliant" type="checkbox" value="Nein" />Nein</label>
          </div>
        </div>
        <div class="field">
          <label for="waterLineSelect">Löschwasserleitung</label>
          <select id="waterLineSelect" name="waterLine">
            <option value="">Bitte auswählen</option>
            <option>LWT</option>
            <option>Brunnen</option>
            <option>Saugstelle</option>
            <option>UF/ÜF Hydranten</option>
          </select>
        </div>
        <div class="field next-date-field">
          <label for="nextDateInput">Nächstes Prüfdatum</label>
          <input id="nextDateInput" name="nextDate" type="date" />
        </div>
      </div>
    </section>

    <div id="hydrantList"></div>

    <div class="hydrant-actions" aria-label="Hydrantenaktionen">
      <button type="button" onclick="addHydrant()" class="success">Hinzufügen</button>
      <button type="button" onclick="duplicateLastHydrant()" class="duplicate-btn">Duplizieren</button>
      <button type="button" onclick="removeLastHydrant()" class="danger">Letzten löschen</button>
    </div>

    <section class="card">
      <h2 class="section-title">Bemerkung</h2>
      <div class="field-grid one">
        <div class="field">
          <label for="bemerkungInput">Bemerkung</label>
          <textarea id="bemerkungInput" name="bemerkung"></textarea>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="section-title">Unterschrift Techniker</h2>
      <div class="signature-block">
        <h3>Unterschrift Techniker</h3>
        <canvas id="signaturePad" aria-label="Unterschrift Techniker"></canvas>
        <div class="signature-actions">
          <button type="button" onclick="clearSignature()" class="danger">Unterschrift löschen</button>
        </div>
      </div>
    </section>

    <div class="actions">
      <button type="button" onclick="clearForm()" class="secondary clear-btn" id="clearButton">Leeren</button>
      <button type="button" class="pdf-btn" id="pdfButton" onclick="exportPdf()">PDF</button>
    </div>
    <p class="archive-status" id="archiveStatus" role="status" aria-live="polite"></p>
  </div>

  <div class="archive-overlay" id="archiveOverlay" hidden>
    <div class="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveTitle">
      <div class="archive-header">
        <h2 id="archiveTitle">Archiv</h2>
        <button type="button" onclick="closeArchive()" class="secondary archive-close-btn" aria-label="Archiv schließen">Schließen</button>
      </div>
      <div class="archive-list" id="archiveList" aria-live="polite"></div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = "fsmobile-pb-hydranten-v1";
    const ARCHIVE_STORAGE_KEY = "fsmobile-pb-hydranten-archive-v1";
    const CURRENT_ARCHIVE_ID_KEY = "fsmobile-pb-hydranten-current-v1";
    const TYPE_OPTIONS = ["", "Löschwassertank", "Löschwasserbrunnen", "Saugstelle", "Überflurhydrant", "Unterflurhydrant", "Einspeisearmatur Trocken", "Sonstige"];
    const RESULT_OPTIONS = ["funktionsbereit", "nicht funktionsbereit", "vorhandene Mängel"];
    const WORK_FIELDS = [
      ["annualInspection", "Prüfung jährlich"],
      ["levelOk", "Füllstand LWT i.O"],
      ["repair", "Instandsetzung"],
      ["pressureTest", "Dichtigkeits-/Druckprüfung"],
      ["flowMeasurement", "Volumenstrommessung"],
      ["misc", "Sonstiges"]
    ];
    const signaturePadState = { canvas: null, ctx: null, isDrawing: false, lastPoint: null };
    let storageRestoreInProgress = false;
    let storageSaveTimer = null;
    let archiveStatusTimer = null;

    function todayIso() {
      const now = new Date();
      return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    }

    function setTodayIfEmpty() {
      const input = document.getElementById("dateInput");
      if (input && !input.value) input.value = todayIso();
    }

    function createField(labelText, field) {
      const wrapper = document.createElement("div");
      wrapper.className = "field";
      const label = document.createElement("label");
      label.textContent = labelText;
      if (field.id) label.htmlFor = field.id;
      wrapper.append(label, field);
      return wrapper;
    }

    function fillSelect(select, options) {
      select.innerHTML = "";
      options.forEach(function(optionValue) {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue || "Bitte auswählen";
        select.appendChild(option);
      });
    }

    function createInput(type, field, value) {
      const input = document.createElement("input");
      input.type = type;
      input.dataset.field = field;
      if (type === "number") {
        input.step = "0.01";
        input.inputMode = "decimal";
      }
      input.value = value || "";
      return input;
    }

    function createUnitInput(field, value, unit) {
      const wrapper = document.createElement("div");
      wrapper.className = "input-unit";
      const input = createInput("number", field, value);
      const unitSpan = document.createElement("span");
      unitSpan.className = "unit";
      unitSpan.textContent = unit;
      wrapper.append(input, unitSpan);
      return wrapper;
    }

    function autoResizeTextarea(textarea) {
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = Math.max(44, textarea.scrollHeight) + "px";
    }

    function setDinValue(value) {
      document.getElementById("dinYesInput").checked = value === "Ja";
      document.getElementById("dinNoInput").checked = value === "Nein";
    }

    function readDinValue() {
      if (document.getElementById("dinYesInput").checked) return "Ja";
      if (document.getElementById("dinNoInput").checked) return "Nein";
      return "";
    }

    function enforceDinChoice(event) {
      if (!event || !event.target || !event.target.checked) return;
      if (event.target.id === "dinYesInput") document.getElementById("dinNoInput").checked = false;
      if (event.target.id === "dinNoInput") document.getElementById("dinYesInput").checked = false;
    }

    function hydrantDataFromCard(card) {
      const data = {};
      card.querySelectorAll("[data-field]").forEach(function(field) {
        if (field.type === "checkbox") data[field.dataset.field] = field.checked;
        else data[field.dataset.field] = field.value || "";
      });
      return data;
    }

    function createHydrantCard(data) {
      data = data || {};
      const card = document.createElement("article");
      card.className = "hydrant-card";

      const header = document.createElement("div");
      header.className = "hydrant-card-header";
      const title = document.createElement("h2");
      title.innerHTML = 'Pos. <span class="hydrant-number"></span>';
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "danger";
      removeButton.textContent = "Entfernen";
      removeButton.addEventListener("click", function() {
        const cards = Array.from(document.querySelectorAll(".hydrant-card"));
        if (cards.length <= 1) applyHydrantData(card, {});
        else card.remove();
        renumberHydrants();
        scheduleStorageSave();
      });
      header.append(title, removeButton);

      const fields = document.createElement("div");
      fields.className = "field-grid";
      const standort = document.createElement("textarea");
      standort.dataset.field = "standort";
      standort.value = data.standort || "";
      const type = document.createElement("select");
      type.dataset.field = "type";
      fillSelect(type, TYPE_OPTIONS);
      type.value = data.type || "";
      const dn = createInput("text", "dn", data.dn);
      fields.append(
        createField("Standort", standort),
        createField("Type", type),
        createField("DN", dn),
        createField("Ruhedruck", createUnitInput("ruhedruck", data.ruhedruck, "bar")),
        createField("Fließdruck", createUnitInput("fliessdruck", data.fliessdruck, "mpa")),
        createField("Wassermengen Messung", createUnitInput("wassermenge", data.wassermenge, "l/min"))
      );

      const workTitle = document.createElement("h3");
      workTitle.className = "section-title";
      workTitle.style.marginTop = "14px";
      workTitle.textContent = "Ausgeführte Arbeiten";
      const workGrid = document.createElement("div");
      workGrid.className = "check-grid";
      WORK_FIELDS.forEach(function(item) {
        const label = document.createElement("label");
        label.className = "check-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.field = item[0];
        checkbox.checked = Boolean(data[item[0]]);
        label.append(checkbox, document.createTextNode(item[1]));
        workGrid.appendChild(label);
      });

      const bottom = document.createElement("div");
      bottom.className = "field-grid two";
      bottom.style.marginTop = "12px";
      const remark = document.createElement("textarea");
      remark.dataset.field = "bemerkung";
      remark.value = data.bemerkung || "";
      const result = document.createElement("select");
      result.dataset.field = "pruefbefund";
      fillSelect(result, RESULT_OPTIONS);
      result.value = data.pruefbefund || "funktionsbereit";
      bottom.append(
        createField("Bemerkung", remark),
        createField("Prüfbefund", result)
      );

      card.append(header, fields, workTitle, workGrid, bottom);
      card.querySelectorAll("textarea").forEach(autoResizeTextarea);
      return card;
    }

    function applyHydrantData(card, data) {
      data = data || {};
      card.querySelectorAll("[data-field]").forEach(function(field) {
        const key = field.dataset.field;
        if (field.type === "checkbox") field.checked = Boolean(data[key]);
        else field.value = data[key] || (key === "pruefbefund" ? "funktionsbereit" : "");
        if (field.tagName === "TEXTAREA") autoResizeTextarea(field);
      });
    }

    function renumberHydrants() {
      document.querySelectorAll(".hydrant-card").forEach(function(card, index) {
        const number = card.querySelector(".hydrant-number");
        if (number) number.textContent = String(index + 1);
      });
    }

    function addHydrant(data) {
      document.getElementById("hydrantList").appendChild(createHydrantCard(data || {}));
      renumberHydrants();
      scheduleStorageSave();
    }

    function duplicateLastHydrant() {
      const cards = Array.from(document.querySelectorAll(".hydrant-card"));
      const source = cards[cards.length - 1];
      addHydrant(source ? hydrantDataFromCard(source) : {});
    }

    function removeLastHydrant() {
      const cards = Array.from(document.querySelectorAll(".hydrant-card"));
      if (cards.length <= 1) {
        if (cards[0]) applyHydrantData(cards[0], {});
      } else {
        cards[cards.length - 1].remove();
      }
      renumberHydrants();
      scheduleStorageSave();
    }

    function textValue(id) {
      const el = document.getElementById(id);
      return el && "value" in el ? el.value || "" : "";
    }

    function collectReportData() {
      return {
        fields: {
          object: textValue("objectInput"),
          anlage: textValue("anlageInput"),
          pruefer: textValue("prueferInput"),
          date: textValue("dateInput"),
          dinCompliant: readDinValue(),
          waterLine: textValue("waterLineSelect"),
          nextDate: textValue("nextDateInput"),
          bemerkung: textValue("bemerkungInput")
        },
        hydrants: Array.from(document.querySelectorAll(".hydrant-card")).map(hydrantDataFromCard),
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
      setValue("objectInput", fields.object);
      setValue("anlageInput", fields.anlage);
      setValue("prueferInput", fields.pruefer);
      setValue("dateInput", fields.date);
      setDinValue(fields.dinCompliant || "");
      setValue("waterLineSelect", fields.waterLine);
      setValue("nextDateInput", fields.nextDate);
      setValue("bemerkungInput", fields.bemerkung);
      autoResizeTextarea(document.getElementById("bemerkungInput"));
      const list = document.getElementById("hydrantList");
      list.innerHTML = "";
      const hydrants = Array.isArray(data && data.hydrants) && data.hydrants.length ? data.hydrants : [{}];
      hydrants.forEach(function(row) { addHydrant(row); });
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
      const parts = String(dateValue).split("-");
      if (parts.length !== 3) return dateValue;
      return parts[2] + "." + parts[1] + "." + parts[0];
    }

    function getDisplayDate(value) { return value ? formatDateForFile(value) : "Ohne Datum"; }

    function getArchiveTitle(entry) {
      const report = entry && entry.report ? entry.report : {};
      const fields = report.fields || {};
      const object = String(fields.object || "").trim() || "Ohne Objekt";
      const anlage = String(fields.anlage || "").trim() || "Ohne Anlagen Nr.";
      const count = Array.isArray(report.hydrants) ? report.hydrants.length : 0;
      return anlage + " - Hydranten (" + count + ") - " + object + " - " + getDisplayDate(fields.date || "");
    }

    function archiveAssignmentKey(report) {
      const fields = report && report.fields ? report.fields : {};
      const anlage = String(fields.anlage || "").trim().toLowerCase();
      const object = String(fields.object || "").trim().toLowerCase();
      const date = String(fields.date || "").trim();
      return anlage && object && date ? anlage + "||" + object + "||" + date : "";
    }

    function saveCurrentReportToArchive() {
      saveToStorageNow();
      const now = new Date().toISOString();
      const currentId = getCurrentArchiveId();
      const entries = loadArchiveEntries();
      const report = collectReportData();
      const assignmentKey = archiveAssignmentKey(report);
      let existingIndex = currentId ? entries.findIndex(function(entry) { return entry.id === currentId; }) : -1;
      if (existingIndex < 0 && assignmentKey) {
        existingIndex = entries.findIndex(function(entry) { return archiveAssignmentKey(entry && entry.report) === assignmentKey; });
      }
      const entry = {
        id: existingIndex >= 0 ? entries[existingIndex].id : createArchiveId(),
        createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : now,
        updatedAt: now,
        report: report
      };
      if (existingIndex >= 0) entries[existingIndex] = entry;
      else entries.push(entry);
      if (writeArchiveEntries(entries)) {
        setCurrentArchiveId(entry.id);
        renderArchiveList();
        setArchiveStatus("Prüfbericht wurde im Archiv gespeichert.");
      } else {
        setArchiveStatus("Prüfbericht konnte nicht im Archiv gespeichert werden.");
      }
    }

    function openArchiveEntry(id) {
      const entry = loadArchiveEntries().find(function(item) { return item.id === id; });
      if (!entry) return;
      applyReportData(entry.report);
      setCurrentArchiveId(entry.id);
      saveToStorageNow();
      closeArchive();
      setArchiveStatus("Prüfbericht aus dem Archiv geöffnet.");
    }

    function deleteArchiveEntry(id) {
      const entries = loadArchiveEntries();
      const entry = entries.find(function(item) { return item.id === id; });
      if (!entry) return;
      if (!confirm("Archiv-Eintrag '" + getArchiveTitle(entry) + "' löschen?")) return;
      writeArchiveEntries(entries.filter(function(item) { return item.id !== id; }));
      if (getCurrentArchiveId() === id) clearCurrentArchiveId();
      renderArchiveList();
      setArchiveStatus("Archiv-Eintrag wurde gelöscht.");
    }

    function renderArchiveList() {
      const archiveList = document.getElementById("archiveList");
      const entries = loadArchiveEntries().slice().sort(function(a, b) { return String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")); });
      archiveList.innerHTML = "";
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "archive-empty";
        empty.textContent = "Noch keine gespeicherten Prüfberichte im Archiv.";
        archiveList.appendChild(empty);
        return;
      }
      entries.forEach(function(entry) {
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
        openButton.addEventListener("click", function() { openArchiveEntry(entry.id); });
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "danger";
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", function() { deleteArchiveEntry(entry.id); });
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
      if (message) archiveStatusTimer = window.setTimeout(function() { status.textContent = ""; }, 4000);
    }

    function sanitizeFileName(value) {
      return (value || "Pruefbericht-Hydranten").trim().replace(/[\\\\/:*?"<>|]+/g, "-").replace(/\\s+/g, "_").slice(0, 80) || "Pruefbericht-Hydranten";
    }

    function getPdfFileName() {
      const anlage = sanitizeFileName(document.getElementById("anlageInput").value || "Ohne Anlagen Nr.");
      const objectName = sanitizeFileName(document.getElementById("objectInput").value || "Ohne Objekt");
      const dateName = document.getElementById("dateInput").value || todayIso();
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
      return new Promise(function(resolve) {
        const script = document.createElement("script");
        script.src = "vendor/jspdf.umd.min.js";
        script.onload = function() { resolve(ensureJsPdf()); };
        script.onerror = function() { resolve(null); };
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
          setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
        } catch {
          alert("PDF konnte nicht gespeichert werden. Bitte im Browser erneut öffnen und noch einmal versuchen.");
        }
      }
    }

    function normalizePdfText(value) {
      return String(value || "").replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201C\\u201D]/g, '"').trim();
    }

    function formatPdfValue(value) {
      if (value === true) return "Ja";
      if (value === false) return "Nein";
      return normalizePdfText(value || "-");
    }

    function withUnit(value, unit) {
      const clean = String(value || "").trim();
      return clean ? clean + " " + unit : "";
    }

    function addPdfSection(doc, title, rows, x, y, width, ensurePageBreak) {
      const lineHeight = 4.2;
      function drawSectionHeader(headerTitle) {
        doc.setFillColor(255, 180, 71);
        doc.rect(x, y, width, 6, "F");
        doc.setTextColor("#111827");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(headerTitle, x + 2, y + 4.2);
        y += 6;
        doc.setTextColor("#111827");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.6);
      }
      if (typeof ensurePageBreak === "function") y = ensurePageBreak(y, 13);
      drawSectionHeader(title);
      rows.forEach(function(row) {
        const label = row[0];
        const value = row[1];
        const rowType = row[2];
        const isCheck = rowType === "check";
        const isBold = rowType === "bold";
        if (!isCheck) {
          const text = normalizePdfText(label) + ": " + formatPdfValue(value);
          const lines = doc.splitTextToSize(text, width - 4);
          const height = Math.max(7, lines.length * lineHeight + 2);
          const previousY = y;
          if (typeof ensurePageBreak === "function") y = ensurePageBreak(y, height + 8);
          if (y < previousY) drawSectionHeader(title + " (Fortsetzung)");
          doc.setDrawColor("#d1d5db");
          doc.setFillColor("#ffffff");
          doc.rect(x, y, width, height, "FD");
          doc.setTextColor("#111827");
          doc.setFont("helvetica", isBold ? "bold" : "normal");
          doc.text(lines, x + 2, y + 4.8);
          doc.setFont("helvetica", "normal");
          y += height;
          return;
        }
        const valueWidth = 22;
        const labelWidth = width - valueWidth;
        const labelLines = doc.splitTextToSize(normalizePdfText(label), labelWidth - 4);
        const valueText = formatPdfValue(value);
        const lineCount = Math.max(labelLines.length, 1);
        const height = Math.max(7, lineCount * lineHeight + 2);
        const previousY = y;
        if (typeof ensurePageBreak === "function") y = ensurePageBreak(y, height + 8);
        if (y < previousY) drawSectionHeader(title + " (Fortsetzung)");
        doc.setDrawColor("#d1d5db");
        doc.setFillColor("#ffffff");
        doc.rect(x, y, labelWidth, height, "FD");
        doc.rect(x + labelWidth, y, valueWidth, height, "FD");
        doc.setTextColor("#111827");
        doc.setFont("helvetica", "normal");
        doc.text(labelLines, x + 2, y + 4.8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(value === true ? "#15803d" : "#111827");
        doc.text(valueText, x + labelWidth + valueWidth / 2, y + 4.8, { align: "center" });
        y += height;
      });
      return y + 2;
    }

    function hydrantPdfRows(hydrant) {
      const rows = [
        ["Standort", hydrant.standort],
        ["Type", hydrant.type],
        ["DN", hydrant.dn],
        ["Ruhedruck", withUnit(hydrant.ruhedruck, "bar")],
        ["Fließdruck", withUnit(hydrant.fliessdruck, "mpa")],
        ["Wassermengen Messung", withUnit(hydrant.wassermenge, "l/min")]
      ];
      WORK_FIELDS.forEach(function(item) {
        rows.push([item[1], Boolean(hydrant[item[0]]), "check"]);
      });
      rows.push(["Bemerkung", hydrant.bemerkung]);
      rows.push(["Prüfbefund", hydrant.pruefbefund, "bold"]);
      return rows;
    }

    async function exportPdf() {
      if (document.activeElement && typeof document.activeElement.blur === "function") document.activeElement.blur();
      const pdfButton = Array.from(document.querySelectorAll("button")).find(function(button) { return button.textContent.trim() === "PDF"; });
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
        const bottomLimit = pageHeight - margin - 8;

        function drawHeader() {
          doc.setFillColor(235, 0, 69);
          doc.rect(margin, 30, contentWidth, 10, "F");
          doc.setTextColor("#ffffff");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.text("PRÜFBERICHT HYDRANTEN", margin + contentWidth / 2, 36.8, { align: "center" });
          doc.setTextColor("#111827");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text("Objekt: " + normalizePdfText(data.fields.object || "-"), margin, 45);
          doc.text("Anlagen Nr.: " + normalizePdfText(data.fields.anlage || "-"), margin, 49);
          doc.text("Techniker: " + normalizePdfText(data.fields.pruefer || "-"), pageWidth / 2, 45, { align: "center" });
          doc.text("Datum: " + normalizePdfText(formatDateForFile(data.fields.date || "")), pageWidth - margin, 45, { align: "right" });
        }

        function ensureSpace(y, needed) {
          if (y + needed <= bottomLimit) return y;
          doc.addPage("a4", "portrait");
          drawHeader();
          return 55;
        }

        drawHeader();
        let y = 55;
        y = addPdfSection(doc, "Zuordnung", [
          ["Objekt", data.fields.object],
          ["Anlagen Nr.", data.fields.anlage],
          ["Techniker", data.fields.pruefer],
          ["Datum", data.fields.date ? formatDateForFile(data.fields.date) : ""]
        ], margin, y, contentWidth, ensureSpace);
        y = addPdfSection(doc, "Prüfgrundlage", [
          ["Entspr. DIN 14462/DIN - EN1988/600", data.fields.dinCompliant],
          ["Löschwasserleitung", data.fields.waterLine],
          ["Nächstes Prüfdatum", data.fields.nextDate ? formatDateForFile(data.fields.nextDate) : ""]
        ], margin, y, contentWidth, ensureSpace);
        data.hydrants.forEach(function(hydrant, index) {
          y = ensureSpace(y, 58);
          y = addPdfSection(doc, "Pos. " + (index + 1), hydrantPdfRows(hydrant), margin, y, contentWidth, ensureSpace);
        });
        y = addPdfSection(doc, "Bemerkung", [["Bemerkung", data.fields.bemerkung]], margin, y, contentWidth, ensureSpace);
        if (y + 35 > bottomLimit) {
          doc.addPage("a4", "portrait");
          drawHeader();
          y = 55;
        }
        y = addPdfSection(doc, "Unterschrift Techniker", [], margin, y, contentWidth, ensureSpace);
        const signature = getStorageSignature();
        if (signature) {
          try { doc.addImage(signature, "PNG", margin + 2, y + 2, 68, 20, undefined, "FAST"); }
          catch { doc.text("Unterschrift konnte nicht eingebettet werden.", margin + 2, y + 8); }
        }
        doc.setDrawColor("#9ca3af");
        doc.line(margin + 2, y + 24, margin + 78, y + 24);
        doc.setTextColor("#111827");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text("Unterschrift Techniker", margin + 2, y + 28);
        if (typeof window.FSMOBILE_STAMP_PDF_LOGO === "function") window.FSMOBILE_STAMP_PDF_LOGO(doc);
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
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
      if (!canvas || !canvas.width || !canvas.height) return true;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return true;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 3; index < pixels.length; index += 4) if (pixels[index] !== 0) return false;
      return true;
    }

    function getStorageSignature() {
      const canvas = signaturePadState.canvas;
      if (!canvas || isCanvasBlank(canvas)) return "";
      try { return canvas.toDataURL("image/png"); } catch { return ""; }
    }

    function clearSignature(skipSave) {
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
      image.onload = function() { ctx.drawImage(image, 0, 0, rect.width, rect.height); };
      image.src = signatureData;
    }

    function init() {
      addHydrant();
      setupSignatureCanvas();
      restoreFromStorage();
      setTodayIfEmpty();
      document.addEventListener("input", function(event) {
        if (event.target && event.target.tagName === "TEXTAREA") autoResizeTextarea(event.target);
        scheduleStorageSave();
      });
      document.addEventListener("change", function(event) {
        enforceDinChoice(event);
        scheduleStorageSave();
      });
      const canvas = document.getElementById("signaturePad");
      canvas.addEventListener("pointerdown", startSignature, { passive: false });
      canvas.addEventListener("pointermove", drawSignature, { passive: false });
      canvas.addEventListener("pointerup", endSignature);
      canvas.addEventListener("pointercancel", endSignature);
      canvas.addEventListener("pointerleave", endSignature);
      window.addEventListener("resize", function() { setupSignatureCanvas(); });
      document.getElementById("archiveOverlay").addEventListener("click", function(event) {
        if (event.target.id === "archiveOverlay") closeArchive();
      });
      document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && !document.getElementById("archiveOverlay").hidden) closeArchive();
      });
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

  function setOptionsStatus(message) {
    if (!archiveBackupStatus) return;
    archiveBackupStatus.textContent = message || "";
  }

  function hideArchiveDeleteConfirm() {
    if (!archiveDeleteConfirm) return;
    archiveDeleteConfirm.hidden = true;
  }

  function showArchiveDeleteConfirm() {
    if (!archiveDeleteConfirm) return;
    setOptionsStatus("");
    archiveDeleteConfirm.hidden = false;
    window.setTimeout(() => archiveDeleteCancelButton && archiveDeleteCancelButton.focus(), 40);
  }

  function openOptionsDialog() {
    if (!optionsOverlay) return;
    window.clearTimeout(optionsCloseTimer);
    setOptionsStatus("");
    hideArchiveDeleteConfirm();
    optionsOverlay.classList.remove("is-closing");
    optionsOverlay.hidden = false;
    optionsOverlay.setAttribute("aria-hidden", "false");
    window.setTimeout(() => archiveBackupExportButton && archiveBackupExportButton.focus(), 40);
  }

  function closeOptionsDialog() {
    if (!optionsOverlay) return;
    window.clearTimeout(optionsCloseTimer);
    if (optionsOverlay.hidden) return;
    hideArchiveDeleteConfirm();
    optionsOverlay.classList.add("is-closing");
    optionsOverlay.setAttribute("aria-hidden", "true");
    optionsCloseTimer = window.setTimeout(() => {
      optionsOverlay.hidden = true;
      optionsOverlay.classList.remove("is-closing");
      if (menuOptionsButton && !menuOptionsButton.hidden) menuOptionsButton.focus();
    }, prefersReducedMotion() ? 40 : 390);
  }

  function updateMenuOptionsVisibility() {
    if (!menuOptionsButton) return;
    menuOptionsButton.hidden = Boolean(activeModuleId) || !isUnlocked;
  }

  function normalizeArchiveKeyPart(value, options = {}) {
    const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
    return options.lower ? normalized.toLowerCase() : normalized;
  }

  function normalizeArchiveDate(value) {
    const raw = normalizeArchiveKeyPart(value);
    const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
    const german = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (german) return `${german[3]}-${german[2].padStart(2, "0")}-${german[1].padStart(2, "0")}`;
    return raw;
  }

  function firstArchiveValue(source, keys) {
    if (!source || typeof source !== "object") return "";
    for (const key of keys) {
      if (source[key] != null && String(source[key]).trim()) return source[key];
    }
    const wanted = keys.map(key => String(key).toLowerCase());
    for (const key of Object.keys(source)) {
      if (!wanted.includes(String(key).toLowerCase())) continue;
      if (source[key] != null && String(source[key]).trim()) return source[key];
    }
    return "";
  }

  function archiveEntryFields(entry) {
    const report = entry && entry.report && typeof entry.report === "object" ? entry.report : {};
    return report.fields && typeof report.fields === "object" ? report.fields : report;
  }

  function archiveEntryAssignmentKey(storageKey, entry) {
    const fields = archiveEntryFields(entry);
    const anlage = normalizeArchiveKeyPart(firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]));
    const object = normalizeArchiveKeyPart(firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]), { lower: true });
    const date = normalizeArchiveDate(firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]));
    if (!anlage || !object || !date) return "";
    return [
      storageKey,
      anlage,
      object,
      date
    ].join("||");
  }

  function archiveEntryTimestamp(entry) {
    const timestamp = Date.parse((entry && (entry.updatedAt || entry.savedAt || entry.createdAt)) || "");
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function isArchiveStorageKey(key) {
    const value = String(key || "");
    if (!/^fsmobile-.*archive.*v\d+$/i.test(value)) return false;
    if (/current|session|temp|draft|pending/i.test(value)) return false;
    return true;
  }

  function isArchivePointerStorageKey(key) {
    const value = String(key || "");
    if (!/^fsmobile-/i.test(value) || !/current/i.test(value)) return false;
    if (/session|temp|draft|pending|auth|update/i.test(value)) return false;
    if (/archive/i.test(value)) return true;
    return /^fsmobile-pb-.*-current-v\d+$/i.test(value);
  }

  function readArchiveEntries(key) {
    try {
      const entries = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(entries) ? entries.filter(entry => entry && typeof entry === "object") : [];
    } catch {
      return [];
    }
  }

  function writeArchiveEntries(key, entries) {
    localStorage.setItem(key, JSON.stringify(entries));
  }

  function collectArchiveBackupData() {
    const archives = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!isArchiveStorageKey(key)) continue;
      const entries = readArchiveEntries(key);
      if (entries.length) archives[key] = entries;
    }
    return archives;
  }

  function collectArchiveStorageKeys() {
    const archiveKeys = [];
    const pointerKeys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (isArchiveStorageKey(key)) archiveKeys.push(key);
      else if (isArchivePointerStorageKey(key)) pointerKeys.push(key);
    }
    return { archiveKeys, pointerKeys };
  }

  function getAppVersion() {
    const script = Array.from(document.scripts).find(item => /app\.js\?v=/.test(item.src || ""));
    const match = script && script.src.match(/[?&]v=([^&]+)/);
    return match ? `v${match[1]}` : "unbekannt";
  }

  function todayIso() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function downloadJsonFile(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportAllArchiveData() {
    const archives = collectArchiveBackupData();
    const archiveKeys = Object.keys(archives);
    const entryCount = archiveKeys.reduce((sum, key) => sum + archives[key].length, 0);
    const payload = {
      format: "FSMobileArchiveBackup",
      formatVersion: 1,
      metadata: {
        appName: "FSMobile",
        appVersion: getAppVersion(),
        exportedAt: new Date().toISOString(),
        archiveAreaCount: archiveKeys.length,
        entryCount
      },
      archives
    };
    downloadJsonFile(`FSMobile_Archiv_Backup_${todayIso()}.json`, payload);
    if (entryCount) {
      setOptionsStatus(`Export erfolgreich. ${entryCount} Archiv-Einträge exportiert.`);
    } else {
      setOptionsStatus("Export erfolgreich. Keine Archivdaten vorhanden.");
    }
  }

  function validateArchiveBackup(payload) {
    if (!payload || typeof payload !== "object") return false;
    if (payload.format !== "FSMobileArchiveBackup") return false;
    if (!payload.archives || typeof payload.archives !== "object" || Array.isArray(payload.archives)) return false;
    return true;
  }

  function mergeArchiveEntries(storageKey, existingEntries, incomingEntries) {
    const merged = existingEntries.slice();
    let added = 0;
    let updated = 0;
    incomingEntries.forEach(incoming => {
      if (!incoming || typeof incoming !== "object") return;
      const incomingId = String(incoming.id || "").trim();
      const incomingAssignment = archiveEntryAssignmentKey(storageKey, incoming);
      let index = incomingId
        ? merged.findIndex(entry => String(entry && entry.id || "").trim() === incomingId)
        : -1;
      if (index < 0 && incomingAssignment) {
        index = merged.findIndex(entry => archiveEntryAssignmentKey(storageKey, entry) === incomingAssignment);
      }
      if (index < 0) {
        merged.push(incoming);
        added += 1;
        return;
      }
      const existing = merged[index];
      if (archiveEntryTimestamp(incoming) >= archiveEntryTimestamp(existing)) {
        merged[index] = Object.assign({}, existing, incoming, {
          id: (existing && existing.id) || incoming.id,
          createdAt: (existing && existing.createdAt) || incoming.createdAt
        });
        updated += 1;
      }
    });
    return { entries: merged, added, updated };
  }

  function refreshOpenArchiveLists() {
    const doc = frameDocument();
    if (!doc) return;
    try {
      const win = doc.defaultView;
      if (win && typeof win.renderArchiveList === "function") win.renderArchiveList();
      win && win.postMessage({ type: "fsmobile-archives-imported" }, "*");
    } catch {}
  }

  async function importArchiveBackupFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!validateArchiveBackup(payload)) {
        setOptionsStatus("Backup-Datei ungültig.");
        return;
      }
      let areaCount = 0;
      let importedCount = 0;
      Object.entries(payload.archives).forEach(([storageKey, entries]) => {
        if (!isArchiveStorageKey(storageKey) || !Array.isArray(entries) || !entries.length) return;
        const existing = readArchiveEntries(storageKey);
        const merged = mergeArchiveEntries(storageKey, existing, entries);
        writeArchiveEntries(storageKey, merged.entries);
        areaCount += 1;
        importedCount += merged.added + merged.updated;
      });
      if (!areaCount || !importedCount) {
        setOptionsStatus("Keine Archivdaten gefunden.");
        return;
      }
      refreshOpenArchiveLists();
      setOptionsStatus(`Import erfolgreich. ${importedCount} Archiv-Einträge eingespielt.`);
    } catch (error) {
      setOptionsStatus(error instanceof SyntaxError ? "Backup-Datei ungültig." : "Import fehlgeschlagen.");
    } finally {
      if (archiveBackupFile) archiveBackupFile.value = "";
    }
  }

  function deleteAllArchiveData() {
    hideArchiveDeleteConfirm();
    try {
      const { archiveKeys, pointerKeys } = collectArchiveStorageKeys();
      const entryCount = archiveKeys.reduce((sum, key) => sum + readArchiveEntries(key).length, 0);
      if (!archiveKeys.length && !pointerKeys.length) {
        setOptionsStatus("Keine Archivdaten vorhanden.");
        return;
      }
      archiveKeys.concat(pointerKeys).forEach(key => localStorage.removeItem(key));
      refreshOpenArchiveLists();
      setOptionsStatus(entryCount ? "Archivdaten gelöscht." : "Keine Archivdaten vorhanden.");
    } catch {
      setOptionsStatus("Archivdaten konnten nicht gelöscht werden.");
    }
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

  function getModuleSectionId(moduleId) {
    const section = MENU_SECTIONS.find(sectionConfig => sectionConfig.modules.includes(moduleId));
    return section ? section.id : "";
  }

  function clearModuleHeadingAccent() {
    topbar.classList.remove(...MODULE_ACCENT_CLASSES);
  }

  function applyModuleHeadingAccent(moduleId) {
    clearModuleHeadingAccent();
    const sectionId = getModuleSectionId(moduleId);
    if (sectionId) topbar.classList.add(`module-accent-${sectionId}`);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function finishTitleStartAnimation() {
    const brandTitle = document.querySelector(".brand h1");
    titleStartAnimationPending = false;
    window.clearTimeout(titleStartAnimationTimer);
    document.body.classList.remove("app-start-pending", "app-starting");
    if (brandTitle) brandTitle.style.willChange = "";
  }

  function startTitleAnimationWhenReady() {
    if (!titleStartAnimationPending) return;

    const brandTitle = document.querySelector(".brand h1");
    const menuIsReady = isUnlocked && !activeModuleId && !menuView.hidden && authOverlay.hidden;
    if (!brandTitle || !menuIsReady) return;

    if (prefersReducedMotion()) {
      finishTitleStartAnimation();
      return;
    }

    if (document.readyState !== "complete") {
      window.addEventListener("load", startTitleAnimationWhenReady, { once: true });
      return;
    }

    window.clearTimeout(titleStartAnimationTimer);
    titleStartAnimationTimer = window.setTimeout(() => {
      if (!titleStartAnimationPending || activeModuleId || menuView.hidden || !authOverlay.hidden) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!titleStartAnimationPending || activeModuleId || menuView.hidden || !authOverlay.hidden) return;
          document.body.classList.remove("app-start-pending");
          document.body.classList.add("app-starting");
          brandTitle.addEventListener("animationend", finishTitleStartAnimation, { once: true });
          titleStartAnimationTimer = window.setTimeout(finishTitleStartAnimation, 2300);
        });
      });
    }, 280);
  }

  function animateBrandLayoutChange(updateLayout) {
    const brand = document.querySelector(".brand");
    if (!brand || prefersReducedMotion()) {
      updateLayout();
      return;
    }

    window.clearTimeout(brandTransitionTimer);
    brand.style.transition = "";
    brand.style.transform = "";
    const before = brand.getBoundingClientRect();
    updateLayout();
    const after = brand.getBoundingClientRect();
    const deltaX = before.left - after.left;
    const deltaY = before.top - after.top;

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

    brand.style.transition = "none";
    brand.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    brand.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      brand.style.transition = "transform 1.05s var(--menu-ease), opacity 0.8s var(--menu-ease)";
      brand.style.transform = "translate3d(0, 0, 0)";
    });

    brandTransitionTimer = window.setTimeout(() => {
      brand.style.transition = "";
      brand.style.transform = "";
    }, 1120);
  }

  function clearViewTransitionTimers() {
    viewTransitionTimers.forEach(timer => window.clearTimeout(timer));
    viewTransitionTimers = [];
  }

  function setViewTransitionTimer(callback, delay) {
    const timer = window.setTimeout(() => {
      viewTransitionTimers = viewTransitionTimers.filter(item => item !== timer);
      callback();
    }, delay);
    viewTransitionTimers.push(timer);
  }

  function resetViewTransitionState() {
    clearViewTransitionTimers();
    [menuView, moduleView].forEach(view => {
      view.classList.remove("view-enter", "view-enter-active", "view-exit");
    });
  }

  function enterView(view) {
    view.hidden = false;
    view.classList.add("view-enter");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        view.classList.add("view-enter-active");
        setViewTransitionTimer(() => {
          view.classList.remove("view-enter", "view-enter-active");
        }, 600);
      });
    });
  }

  function switchToModuleView() {
    resetViewTransitionState();
    if (prefersReducedMotion() || menuView.hidden) {
      menuView.hidden = true;
      moduleView.hidden = false;
      return;
    }

    menuView.classList.add("view-exit");
    setViewTransitionTimer(() => {
      menuView.hidden = true;
      menuView.classList.remove("view-exit");
      enterView(moduleView);
    }, 300);
  }

  function switchToMenuView(onModuleHidden) {
    resetViewTransitionState();
    if (prefersReducedMotion() || moduleView.hidden) {
      moduleView.hidden = true;
      menuView.hidden = false;
      if (typeof onModuleHidden === "function") onModuleHidden();
      return;
    }

    moduleView.classList.add("view-exit");
    setViewTransitionTimer(() => {
      moduleView.hidden = true;
      moduleView.classList.remove("view-exit");
      if (typeof onModuleHidden === "function") onModuleHidden();
      enterView(menuView);
    }, 300);
  }

  function openModule(id, replaceHistory) {
    if (!isUnlocked) {
      showAuth();
      return;
    }

    const module = registry[id];
    if (!module) return;

    finishTitleStartAnimation();
    const html = decorateModuleHtml(module.html, id);
    activeModuleId = id;
    applyModuleHeadingAccent(id);
    clearModuleActionBar();
    updateMenuOptionsVisibility();
    frame.srcdoc = html;
    frame.title = module.title;
    backButton.hidden = false;
    subtitle.textContent = module.title;
    switchToModuleView();

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
    clearModuleHeadingAccent();
    clearModuleActionBar();
    updateMenuOptionsVisibility();
    backButton.hidden = true;
    subtitle.textContent = "Menüauswahl";
    switchToMenuView(() => {
      frame.srcdoc = "";
      updateMenuOptionsVisibility();
    });

    if (!replaceHistory) {
      history.pushState({ module: null }, "", location.pathname);
    }
    startTitleAnimationWhenReady();
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
    animateBrandLayoutChange(() => {
      if (actionBar) {
        actionBar.replaceChildren();
        actionBar.hidden = true;
      }
      topbar.classList.remove("has-module-actions");
    });
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
    if (text === "PDF" || text === "PDF Export" || text.indexOf("PDF wird erstellt") === 0 || text.indexOf("PDF Export wird erstellt") === 0 || /pdf-btn|pdfButton|pdfBtn/.test(haystack)) return "pdf";
    return "";
  }

  function actionLabel(key) {
    return {
      save: "Im Archiv speichern",
      archive: "Archiv",
      export: "Export",
      import: "Import",
      clear: "Leeren",
      pdf: "PDF Export"
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
    const order = /^pb-/.test(activeModuleId || "")
      ? ["save", "archive", "import", "clear", "pdf"]
      : ["save", "archive", "export", "import", "clear", "pdf"];
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

	  window.addEventListener("message", event => {
	    const data = event.data || {};
	    if (!data || data.type !== "fsmobile-action-status") return;
	    if (data.moduleId && data.moduleId !== activeModuleId) return;
	    updateModuleActionStatus(String(data.message || ""));
	  });

  function syncModuleActionStatus() {
    const doc = frameDocument();
    updateModuleActionStatus(readFrameArchiveStatus(doc));
  }

	  function activateFrameAction(key) {
	    const doc = frameDocument();
	    if (!doc) return;
	    const action = collectFrameActionButtons(doc).find(item => item.key === key);
	    if (!action) return;
	    if (key === "pdf" && /^pb-/.test(activeModuleId || "")) {
	      try {
	        const win = doc.defaultView;
	        if (win && typeof win.FSMOBILE_CREATE_REPORT_EXPORT_ZIP === "function") {
	          win.FSMOBILE_COMBINED_PDF_EXPORT = { startedAt: Date.now() };
	          win.setTimeout(() => {
	            if (win.FSMOBILE_COMBINED_PDF_EXPORT && Date.now() - win.FSMOBILE_COMBINED_PDF_EXPORT.startedAt > 30000) {
	              win.FSMOBILE_COMBINED_PDF_EXPORT = null;
	            }
	          }, 31000);
	        }
	      } catch (error) {}
	    }
	    if (key === "pdf" && /^pb-/.test(activeModuleId || "")) {
	      updateModuleActionStatus("PDF Export wird erstellt...");
	    }
	    action.source.click();
	    if (key === "archive" && /^pb-/.test(activeModuleId || "")) {
	      updateModuleActionStatus("Archiv wurde geöffnet.");
	    }
	    if (key === "save" || key === "clear") {
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
    animateBrandLayoutChange(() => {
      actionBar.hidden = false;
      topbar.classList.add("has-module-actions");
    });
  }

  function decorateModuleHtml(html, id) {
    const bridge = `
      <script>
        window.FSMOBILE_EMBEDDED_MODULE = true;
        window.FSMOBILE_MODULE_ID = ${JSON.stringify(id)};
        (function(){
          try {
            document.documentElement.classList.add("fsmobile-embedded-module");
            if (/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) {
              document.documentElement.classList.add("fsmobile-pb-module");
            }
            if (!document.getElementById("fsmobileEmbeddedActionSourceStyle")) {
              var actionSourceStyle = document.createElement("style");
              actionSourceStyle.id = "fsmobileEmbeddedActionSourceStyle";
              actionSourceStyle.textContent = [
                "html.fsmobile-pb-module .title-bar > .title-actions,",
                "html.fsmobile-pb-module header > .toolbar,",
                "html.fsmobile-embedded-module body.fsmobile-parent-actions-active .fsmobile-parent-action-source,",
                "html.fsmobile-embedded-module body.fsmobile-parent-actions-active .fsmobile-header-actions,",
                "html.fsmobile-embedded-module body.fsmobile-parent-actions-active .fsmobile-actions-empty { display: none !important; }"
              ].join("\\n");
              (document.head || document.documentElement).appendChild(actionSourceStyle);
            }
          } catch (error) {}
          if (window.MutationObserver && window.MutationObserver.prototype && !window.MutationObserver.prototype.__fsmobileSafeObserve) {
            var nativeObserve = window.MutationObserver.prototype.observe;
            Object.defineProperty(window.MutationObserver.prototype, "__fsmobileSafeObserve", { value: true });
            window.MutationObserver.prototype.observe = function(target, options) {
              if (!target || typeof target.nodeType !== "number") return undefined;
              try {
                return nativeObserve.call(this, target, options);
              } catch (error) {
                if (error && /parameter 1 is not of type 'Node'/i.test(String(error.message || error))) return undefined;
                throw error;
              }
            };
          }
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
          function installPdfTableColorOverride() {
            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return;
            if (document.getElementById("fsmobilePdfTableColorOverride")) return;
            var style = document.createElement("style");
            style.id = "fsmobilePdfTableColorOverride";
            style.textContent = [
              "body.generating-pdf, .pdf-render-wrapper { --brand: rgb(235, 0, 69) !important; }",
              "body.generating-pdf th, body.generating-pdf thead th, .pdf-render-wrapper th, .pdf-render-wrapper thead th { background: rgb(235, 0, 69) !important; background-color: rgb(235, 0, 69) !important; }"
            ].join("\\n");
            (document.head || document.documentElement).appendChild(style);
          }
          installPdfTableColorOverride();
          document.addEventListener("DOMContentLoaded", installPdfTableColorOverride);
          function installPdfReportTitleStyleOverride() {
            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return;
            if (document.getElementById("fsmobilePdfReportTitleStyleOverride")) return;
            var style = document.createElement("style");
            style.id = "fsmobilePdfReportTitleStyleOverride";
            style.textContent = [
              "body.generating-pdf h1, .pdf-render-wrapper h1 { display: block !important; width: 100% !important; margin: 0 0 8px !important; padding: 9px 12px !important; border-radius: 0 !important; background: rgb(235, 0, 69) !important; color: #ffffff !important; text-align: center !important; font-size: 24px !important; line-height: 1.15 !important; font-weight: 800 !important; letter-spacing: 0 !important; box-shadow: none !important; }",
              "body.generating-pdf .title-bar, .pdf-render-wrapper .title-bar { display: block !important; margin-bottom: 8px !important; }"
            ].join("\\n");
            (document.head || document.documentElement).appendChild(style);
          }
          installPdfReportTitleStyleOverride();
          document.addEventListener("DOMContentLoaded", installPdfReportTitleStyleOverride);
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
            if (text === "PDF" || text === "PDF Export" || text.indexOf("PDF wird erstellt") === 0 || text.indexOf("PDF Export wird erstellt") === 0 || /pdf-btn|pdfButton|pdfBtn/.test(id + " " + classes)) return 50;
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
            actions.classList.add("fsmobile-parent-action-source");
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

          var FSMOBILE_PORTRAIT_REPORT_IDS = {
            "pb-rwa": true,
            "pb-druckerhoehungsanlage": true,
            "pb-nass-trocken-station": true,
            "pb-loeschwasser-trocken": true,
            "pb-loeschwasser-nass": true,
            "pb-zentralbatterie-anlage": true,
            "pb-wandhydranten": true,
            "pb-hydranten": true
          };

	          function isFsmobilePortraitReport() {
	            return Boolean(FSMOBILE_PORTRAIT_REPORT_IDS[window.FSMOBILE_MODULE_ID || ""]);
	          }

	          var FSMOBILE_LANDSCAPE_REMARK_REPORT_IDS = {
	            "pb-feuerloescher": true,
	            "pb-brandschutztueren": true,
	            "pb-not-sicherheitsbeleuchtung": true,
	            "pb-brandschutzklappen": true,
	            "pb-brandschutzschiebetor": true,
	            "pb-brandschutzrolltore": true,
	            "pb-rolltoranlagen": true,
	            "pb-schiebetuerantrieb": true,
	            "pb-drehfluegelantrieb": true,
	            "pb-rauchschutzvorhaenge": true,
	            "pb-feststellanlagen": true,
	            "pb-rauchwarnmelder": true
	          };

	          function isFsmobileLandscapeRemarkReport() {
	            return Boolean(FSMOBILE_LANDSCAPE_REMARK_REPORT_IDS[window.FSMOBILE_MODULE_ID || ""]);
	          }

          function isAssignmentTitle(node) {
            return node && normalizeFsmobileKey(node.textContent || "") === "zuordnung";
          }

          function findAssignmentTitle(section) {
            return Array.from(section.children || []).find(function(child) {
              return child.matches && child.matches("h2, h3, legend, .section-title") && isAssignmentTitle(child);
            }) || null;
          }

          function findAssignmentFields(section) {
            return Array.from(section.children || []).find(function(child) {
              return child.matches && child.matches(".grid, .header-row, .info-grid, .form-grid");
            }) || section.querySelector(".grid, .header-row, .info-grid, .form-grid");
          }

          function findAssignmentFieldsByKnownControls(section) {
            var controlSets = [
              ["objectInput", "anlageInput", "prueferInput", "dateInput"],
              ["objekt", "anlagenNr", "name", "datum"]
            ];
            for (var index = 0; index < controlSets.length; index += 1) {
              var controls = controlSets[index]
                .map(function(id) { return section.querySelector("#" + id); })
                .filter(Boolean);
              if (controls.length < 3) continue;
              var fieldGroup = controls[0].closest(".grid, .header-row, .info-grid, .form-grid");
              if (fieldGroup && controls.every(function(control) { return fieldGroup.contains(control); })) return fieldGroup;
            }
            return null;
          }

          function normalizePortraitAssignmentSections() {
            if (!isFsmobilePortraitReport() || !document.body || document.body.classList.contains("generating-pdf")) return;
            document.body.classList.add("fsmobile-portrait-report");
            if (window.FSMOBILE_MODULE_ID === "pb-rwa") document.body.classList.add("fsmobile-rwa-report");
            Array.from(document.querySelectorAll("section.card, .card")).forEach(function(section) {
              if (!section || section.closest(".archive-overlay, .archive-dialog, .pdf-render-wrapper, .pdf-render-area")) return;
              var title = findAssignmentTitle(section);
              var fields = title ? findAssignmentFields(section) : findAssignmentFieldsByKnownControls(section);
              if (!fields || !section.parentNode) return;
              fields.classList.add("fsmobile-portrait-assignment");
              if (title && title.parentNode) title.parentNode.removeChild(title);
              section.parentNode.replaceChild(fields, section);
            });
          }

	          function installRwaChoicePillTapFix() {
	            if (window.FSMOBILE_MODULE_ID !== "pb-rwa") return;
	            window.__fsmobileRwaChoicePillTapFixInstalled = true;
	            Array.from(document.querySelectorAll(".pill-check")).forEach(function(pill) {
	              if (pill.dataset.fsmobileRwaTapFix === "true") return;
	              pill.dataset.fsmobileRwaTapFix = "true";
	              pill.addEventListener("click", function(event) {
	                var input = pill.querySelector("input[type='checkbox']");
	                if (!input || input.disabled) return;
	                if (event.target === input || (event.target && event.target.closest && event.target.closest("input[type='checkbox']") === input)) {
	                  return;
	                }
	                event.preventDefault();
	                event.stopImmediatePropagation();
	                input.checked = !input.checked;
	                input.dispatchEvent(new Event("input", { bubbles: true }));
	                input.dispatchEvent(new Event("change", { bubbles: true }));
	              }, true);
	            });
	          }

          function safeFsmobileFileSegment(value, fallback) {
            return String(value || fallback || "")
              .trim()
              .replace(/[\\\\/:*?"<>|]+/g, "-")
              .replace(/\\s+/g, "_")
              .replace(/_+/g, "_")
              .slice(0, 80) || fallback || "Ohne_Angabe";
          }

          function ensurePbFilePrefix(fileName) {
            var name = String(fileName || "").trim();
            if (!name) return "PB";
            return /^PB(?:[_\-\s.]|$)/i.test(name) ? name : "PB_" + name;
          }

          function formatFsmobileDateForFile(value) {
            var raw = String(value || "").trim();
            var iso = raw.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
            if (iso) return iso[1] + "-" + iso[2] + "-" + iso[3];
            var german = raw.match(/^(\\d{1,2})\\.(\\d{1,2})\\.(\\d{4})$/);
            if (german) return german[3] + "-" + german[2].padStart(2, "0") + "-" + german[1].padStart(2, "0");
            if (raw) return raw;
            var now = new Date();
            var day = String(now.getDate()).padStart(2, "0");
            var month = String(now.getMonth() + 1).padStart(2, "0");
            return now.getFullYear() + "-" + month + "-" + day;
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

	          var FSMOBILE_SIGNATURE_LABEL = "Unterschrift Techniker";
	          var FSMOBILE_TECHNICIAN_LABEL = "Techniker";
	          window.FSMOBILE_SIGNATURE_LABEL = FSMOBILE_SIGNATURE_LABEL;
	          window.FSMOBILE_TECHNICIAN_LABEL = FSMOBILE_TECHNICIAN_LABEL;

	          function normalizeTechnicianText(value) {
	            var text = String(value || "").replace(/\\s+/g, " ").trim();
	            if (!text) return "";
	            return text
	              .replace(/^Prüfer(?=\\s+und\\s+)/i, FSMOBILE_TECHNICIAN_LABEL)
	              .replace(/^(Name|Prüfer)$/i, FSMOBILE_TECHNICIAN_LABEL);
	          }

	          function normalizeSignatureText(value) {
	            var text = normalizeTechnicianText(value);
	            if (!text) return "";
	            if (/^techniker und digitale unterschrift$/i.test(text) || /^techniker und unterschrift$/i.test(text) || /^techniker und signatur$/i.test(text) || /^techniker und unterschrift techniker$/i.test(text)) {
	              return FSMOBILE_TECHNICIAN_LABEL + " und Unterschrift";
	            }
	            if (/^(digitale unterschrift|unterschrift|signatur)$/i.test(text)) return FSMOBILE_SIGNATURE_LABEL;
	            return text;
	          }

	          function normalizeTechnicianPdfText(value) {
	            if (typeof value !== "string") return value;
	            return value
	              .replace(/^Prüfer(?=\\s+und\\s+)/i, FSMOBILE_TECHNICIAN_LABEL)
	              .replace(/^(Name|Prüfer)(\\s*(?::|\\(|$))/i, FSMOBILE_TECHNICIAN_LABEL + "$2");
	          }
	          window.FSMOBILE_NORMALIZE_TECHNICIAN_PDF_TEXT = normalizeTechnicianPdfText;

	          function normalizeSignaturePdfText(value) {
	            if (typeof value !== "string") return value;
	            return normalizeTechnicianPdfText(value)
	              .replace(/^Techniker und Digitale Unterschrift$/i, FSMOBILE_TECHNICIAN_LABEL + " und Unterschrift")
	              .replace(/^Techniker und Unterschrift Techniker$/i, FSMOBILE_TECHNICIAN_LABEL + " und Unterschrift")
	              .replace(/^Techniker und Unterschrift$/i, FSMOBILE_TECHNICIAN_LABEL + " und Unterschrift")
	              .replace(/^Techniker und Signatur$/i, FSMOBILE_TECHNICIAN_LABEL + " und Unterschrift")
	              .replace(/^(Digitale Unterschrift|Unterschrift|Signatur)(\\s*(?::|\\(|$))/i, FSMOBILE_SIGNATURE_LABEL + "$2");
	          }
          window.FSMOBILE_NORMALIZE_SIGNATURE_PDF_TEXT = normalizeSignaturePdfText;

          function normalizeSignaturePdfArgument(value) {
            if (Array.isArray(value)) return value.map(normalizeSignaturePdfArgument);
            return normalizeSignaturePdfText(value);
          }

          function pdfTextWidth(doc, value) {
            if (!doc || typeof doc.getTextWidth !== "function") return 0;
            if (Array.isArray(value)) {
              return value.reduce(function(max, item) {
                return Math.max(max, pdfTextWidth(doc, item));
              }, 0);
            }
            try { return doc.getTextWidth(String(value || "")); }
            catch (error) { return 0; }
          }

          function looksLikeInlinePdfLabel(value) {
            if (typeof value !== "string") return false;
            return /^(Objekt|Anlagen\s*Nr\.?|Techniker|Name|Prüfer|Datum)\s*:?\s*$/i.test(value);
          }

          function rememberInlinePdfLabel(doc, originalText, normalizedText, x, y) {
            if (!doc || typeof x !== "number" || typeof y !== "number") return;
            if (!looksLikeInlinePdfLabel(originalText) && !looksLikeInlinePdfLabel(normalizedText)) {
              doc.__fsmobileLastInlinePdfLabel = null;
              return;
            }
            doc.__fsmobileLastInlinePdfLabel = {
              y: y,
              minX: x + pdfTextWidth(doc, normalizedText) + 1.8
            };
          }

          function applyInlinePdfLabelSpacing(doc, args, normalizedText) {
            if (!doc || looksLikeInlinePdfLabel(normalizedText)) return;
            var last = doc.__fsmobileLastInlinePdfLabel;
            if (!last || typeof args[1] !== "number" || typeof args[2] !== "number") return;
            if (Math.abs(args[2] - last.y) > 0.25) {
              doc.__fsmobileLastInlinePdfLabel = null;
              return;
            }
            if (args[1] < last.minX) args[1] = last.minX;
            doc.__fsmobileLastInlinePdfLabel = null;
          }

          function pdfArgumentPlainText(value) {
            if (Array.isArray(value)) return value.map(pdfArgumentPlainText).join(" ");
            return String(value || "").replace(/\s+/g, " ").trim();
          }

          function looksLikePdfReportTitle(value) {
            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
            var text = pdfArgumentPlainText(value);
            if (!text || text.length > 120) return false;
            return /^prüfbericht\b/i.test(text);
          }

          function framePdfReportTitle(doc, args, textValue) {
            if (!doc || !looksLikePdfReportTitle(textValue) || typeof args[1] !== "number" || typeof args[2] !== "number") return false;
            try {
              var pageWidth = getFsmobilePdfPageWidth(doc);
              var margin = pageWidth > 240 ? 12 : 10;
              var width = Math.max(40, pageWidth - margin * 2);
              var barHeight = 10;
              var y = Math.max(22, args[2] - 6.8);
              doc.setFillColor(235, 0, 69);
              doc.rect(margin, y, width, barHeight, "F");
              doc.setTextColor("#ffffff");
              return true;
            } catch (error) {
              return false;
            }
          }

          function canvasLooksLikeSignature(canvas) {
            if (!canvas) return false;
            var haystack = normalizeFsmobileKey([
              canvas.id || "",
              canvas.className || "",
              canvas.getAttribute("aria-label") || "",
              canvas.closest(".signature-block, .signature, .signatur") ? "signature" : ""
            ].join(" "));
            return haystack.indexOf("signature") >= 0 || haystack.indexOf("signatur") >= 0 || haystack.indexOf("unterschrift") >= 0;
          }

	          function looksLikeSignatureNode(node) {
	            var text = normalizeFsmobileKey(node.textContent || "");
	            if (text === "digitaleunterschrift" || text === "unterschrift" || text === "signatur") return true;
	            if (text === "prueferundunterschrift" || text === "prueferunddigitaleunterschrift" || text === "prueferundsignatur") return true;
	            if (text === "technikerundunterschrift" || text === "technikerunddigitaleunterschrift" || text === "technikerundsignatur") return true;
	            if (text === "technikerundunterschrifttechniker") return true;
	            return false;
	          }

	          function normalizeSignatureLabels() {
	            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return;
	            document.querySelectorAll("h2, h3, h4, legend, label, th, .section-title").forEach(function(node) {
	              if (node.matches && node.matches("label") && node.querySelector("input, select, textarea, button")) return;
	              var normalized = looksLikeSignatureNode(node) ? normalizeSignatureText(node.textContent) : normalizeTechnicianText(node.textContent);
	              if (normalized && node.textContent !== normalized) node.textContent = normalized;
	            });
            document.querySelectorAll("canvas").forEach(function(canvas) {
              if (!canvasLooksLikeSignature(canvas)) return;
              canvas.setAttribute("aria-label", FSMOBILE_SIGNATURE_LABEL);
              var block = canvas.closest(".signature-block, .signature, .signatur, .field, section, article, div");
              if (!block) return;
              var title = block.querySelector("h2, h3, h4, legend, label, .section-title");
              if (title && looksLikeSignatureNode(title)) title.textContent = normalizeSignatureText(title.textContent);
            });
	          }

	          function resizeSignatureCanvasForCurrentLayout(canvas) {
	            if (!canvas || !canvasLooksLikeSignature(canvas)) return;
	            var rect = canvas.getBoundingClientRect();
	            if (!rect || rect.width < 8 || rect.height < 8) return;
	            var ratio = window.devicePixelRatio || 1;
	            var expectedWidth = Math.max(1, Math.round(rect.width * ratio));
	            var expectedHeight = Math.max(1, Math.round(rect.height * ratio));
	            canvas.style.pointerEvents = "auto";
	            canvas.style.touchAction = "none";
	            if (Math.abs((canvas.width || 0) - expectedWidth) <= 1 && Math.abs((canvas.height || 0) - expectedHeight) <= 1) return;
	            var context = canvas.getContext("2d", { willReadFrequently: true });
	            var oldData = "";
	            try {
	              if (!canvasIsBlank(canvas)) oldData = canvas.toDataURL("image/png");
	            } catch (error) {}
	            canvas.width = expectedWidth;
	            canvas.height = expectedHeight;
	            context.setTransform(ratio, 0, 0, ratio, 0, 0);
	            context.lineWidth = 2.4;
	            context.lineCap = "round";
	            context.lineJoin = "round";
	            context.strokeStyle = "#1c1c1e";
	            if (oldData) {
	              var image = new Image();
	              image.onload = function() {
	                try { context.drawImage(image, 0, 0, rect.width, rect.height); } catch (error) {}
	              };
	              image.src = oldData;
	            }
	          }

	          function refreshSignatureCanvasesForReadyLayout() {
	            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return;
	            Array.from(document.querySelectorAll("canvas")).forEach(resizeSignatureCanvasForCurrentLayout);
	          }

	          function scheduleSignatureCanvasReadyRefresh(delay) {
	            window.setTimeout(function() {
	              window.requestAnimationFrame(function() {
	                refreshSignatureCanvasesForReadyLayout();
	              });
	            }, delay);
	          }

	          function canvasIsBlank(canvas) {
	            if (!canvas) return true;
	            try {
              var data = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data;
              for (var index = 3; index < data.length; index += 4) {
                if (data[index] !== 0) return false;
              }
            } catch (error) {}
            return true;
          }

          function generatedSignatureStorageKey() {
            return "fsmobile-generated-techniker-signature:" + (window.FSMOBILE_MODULE_ID || "module");
          }

          function generatedSignatureDataUrl() {
            var canvas = document.getElementById("fsmobileTechnikerSignaturePad");
            if (!canvas || canvasIsBlank(canvas)) return "";
            try { return canvas.toDataURL("image/png"); } catch (error) { return ""; }
          }

          function restoreGeneratedSignature(canvas) {
            var saved = "";
            try { saved = localStorage.getItem(generatedSignatureStorageKey()) || ""; } catch (error) {}
            if (!saved) return;
            var context = canvas.getContext("2d", { willReadFrequently: true });
            var image = new Image();
            image.onload = function() {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            image.src = saved;
          }

          function saveGeneratedSignature(canvas) {
            try {
              if (canvasIsBlank(canvas)) localStorage.removeItem(generatedSignatureStorageKey());
              else localStorage.setItem(generatedSignatureStorageKey(), canvas.toDataURL("image/png"));
            } catch (error) {}
          }

          function setupGeneratedSignaturePad(canvas, clearButton) {
            if (!canvas || canvas.dataset.fsmobileSignatureReady === "1") return;
            canvas.dataset.fsmobileSignatureReady = "1";
            var context = canvas.getContext("2d", { willReadFrequently: true });
            var drawing = false;
            var lastPoint = null;

            function resize(keep) {
              var oldData = keep ? generatedSignatureDataUrl() : "";
              var rect = canvas.getBoundingClientRect();
              var ratio = window.devicePixelRatio || 1;
              canvas.width = Math.max(1, Math.round(rect.width * ratio));
              canvas.height = Math.max(1, Math.round(rect.height * ratio));
              context.setTransform(ratio, 0, 0, ratio, 0, 0);
              context.lineWidth = 2.4;
              context.lineCap = "round";
              context.lineJoin = "round";
              context.strokeStyle = "#1c1c1e";
              if (oldData) {
                var image = new Image();
                image.onload = function() { context.drawImage(image, 0, 0, rect.width, rect.height); };
                image.src = oldData;
              }
            }

            function point(event) {
              var rect = canvas.getBoundingClientRect();
              return { x: event.clientX - rect.left, y: event.clientY - rect.top };
            }

            function start(event) {
              event.preventDefault();
              drawing = true;
              lastPoint = point(event);
            }

            function move(event) {
              if (!drawing) return;
              event.preventDefault();
              var current = point(event);
              context.beginPath();
              context.moveTo(lastPoint.x, lastPoint.y);
              context.lineTo(current.x, current.y);
              context.stroke();
              lastPoint = current;
            }

            function end() {
              if (!drawing) return;
              drawing = false;
              lastPoint = null;
              saveGeneratedSignature(canvas);
            }

            canvas.addEventListener("pointerdown", start, { passive: false });
            canvas.addEventListener("pointermove", move, { passive: false });
            canvas.addEventListener("pointerup", end);
            canvas.addEventListener("pointercancel", end);
            canvas.addEventListener("pointerleave", end);
            window.addEventListener("resize", function() { resize(true); });
            if (clearButton) {
              clearButton.addEventListener("click", function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                saveGeneratedSignature(canvas);
              });
            }
            resize(false);
            restoreGeneratedSignature(canvas);
          }

	          function ensureGeneratedTechnikerSignatureField() {
	            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return;
	            if (Array.from(document.querySelectorAll("canvas")).some(canvasLooksLikeSignature)) return;
	            var block = document.createElement("section");
	            block.className = "signature-block fsmobile-generated-signature-block";
            block.innerHTML = '<h3>' + FSMOBILE_SIGNATURE_LABEL + '</h3><canvas id="fsmobileTechnikerSignaturePad" aria-label="' + FSMOBILE_SIGNATURE_LABEL + '"></canvas><div class="signature-actions"><button type="button" class="danger">Unterschrift löschen</button></div>';
            var anchor = document.getElementById("archiveOverlay") || document.querySelector("script");
            if (anchor && anchor.parentNode === document.body) document.body.insertBefore(block, anchor);
            else document.body.appendChild(block);
	            setupGeneratedSignaturePad(block.querySelector("canvas"), block.querySelector("button"));
	          }

	          function reportRemarkTextarea() {
	            return document.getElementById("fsmobileReportBemerkung") || document.querySelector("[data-field='berichtBemerkung']");
	          }

	          function reportRemarkStorageKey() {
	            return "fsmobile-report-remark-" + (window.FSMOBILE_MODULE_ID || "unknown") + "-v1";
	          }

	          function autoResizeReportRemarkField(field) {
	            if (!field) return;
	            field.style.height = "auto";
	            field.style.height = Math.max(field.scrollHeight, 88) + "px";
	          }

	          function readStoredReportRemark() {
	            try { return localStorage.getItem(reportRemarkStorageKey()) || ""; }
	            catch (error) { return ""; }
	          }

	          function writeStoredReportRemark(value) {
	            try { localStorage.setItem(reportRemarkStorageKey(), String(value || "")); }
	            catch (error) {}
	          }

	          function extractReportRemarkFromData(data) {
	            if (!data || typeof data !== "object") return "";
	            var candidates = [
	              data.berichtBemerkung,
	              data.reportRemark,
	              data.allgemeineBemerkung,
	              data.bemerkungGesamt
	            ];
	            if (data.fields && typeof data.fields === "object") {
	              candidates.push(data.fields.berichtBemerkung, data.fields.reportRemark, data.fields.allgemeineBemerkung, data.fields.bemerkungGesamt);
	            }
	            if (data.report && typeof data.report === "object") {
	              candidates.push(extractReportRemarkFromData(data.report));
	            }
	            for (var index = 0; index < candidates.length; index += 1) {
	              if (typeof candidates[index] === "string") return candidates[index];
	            }
	            return "";
	          }

	          function setReportRemarkValue(value, options) {
	            var field = reportRemarkTextarea();
	            if (!field) return;
	            field.value = String(value || "");
	            autoResizeReportRemarkField(field);
	            if (!options || options.persist !== false) writeStoredReportRemark(field.value);
	            if (options && options.dispatch) {
	              field.dispatchEvent(new Event("input", { bubbles: true }));
	              field.dispatchEvent(new Event("change", { bubbles: true }));
	            }
	          }

	          function currentReportRemarkValue() {
	            var field = reportRemarkTextarea();
	            return field ? String(field.value || "") : "";
	          }

	          function mergeReportRemarkIntoData(data) {
	            if (!isFsmobileLandscapeRemarkReport() || !data || typeof data !== "object") return data;
	            var value = currentReportRemarkValue();
	            data.berichtBemerkung = value;
	            if (!data.fields || typeof data.fields !== "object" || Array.isArray(data.fields)) data.fields = {};
	            if (data.fields && typeof data.fields === "object" && !Array.isArray(data.fields)) data.fields.berichtBemerkung = value;
	            return data;
	          }

	          function installReportRemarkDataBridge() {
	            if (!isFsmobileLandscapeRemarkReport() || window.__fsmobileReportRemarkDataBridgeInstalled) return;
	            window.__fsmobileReportRemarkDataBridgeInstalled = true;
	            ["getCurrentReport", "collectData", "collectReportData", "buildStoragePayload"].forEach(function(name) {
	              var original = window[name];
	              if (typeof original !== "function" || original.__fsmobileReportRemarkWrapped) return;
	              window[name] = function() {
	                return mergeReportRemarkIntoData(original.apply(this, arguments));
	              };
	              window[name].__fsmobileReportRemarkWrapped = true;
	            });
	            ["applyReport", "applyData", "applyReportData", "applyStoragePayload", "restoreReportData"].forEach(function(name) {
	              var original = window[name];
	              if (typeof original !== "function" || original.__fsmobileReportRemarkWrapped) return;
	              window[name] = function(data) {
	                var result = original.apply(this, arguments);
	                var value = extractReportRemarkFromData(data);
	                window.setTimeout(function() {
	                  if (value || !currentReportRemarkValue()) setReportRemarkValue(value, { persist: true, dispatch: false });
	                }, 0);
	                return result;
	              };
	              window[name].__fsmobileReportRemarkWrapped = true;
	            });
	            document.addEventListener("input", function(event) {
	              if (event.target && event.target.id === "fsmobileReportBemerkung") {
	                autoResizeReportRemarkField(event.target);
	                writeStoredReportRemark(event.target.value || "");
	              }
	            });
	          }

	          function restoreReportRemarkFromCurrentStorage() {
	            var field = reportRemarkTextarea();
	            if (!field || field.value) return;
	            var stored = readStoredReportRemark();
	            if (stored) {
	              setReportRemarkValue(stored, { persist: false, dispatch: false });
	              return;
	            }
	            try {
	              for (var index = 0; index < localStorage.length; index += 1) {
	                var key = localStorage.key(index) || "";
	                if (key.indexOf(window.FSMOBILE_MODULE_ID || "") < 0) continue;
	                var value = extractReportRemarkFromData(JSON.parse(localStorage.getItem(key) || "null"));
	                if (value) {
	                  setReportRemarkValue(value, { persist: true, dispatch: false });
	                  return;
	                }
	              }
	            } catch (error) {}
	          }

	          function ensureLandscapeReportRemarkField() {
	            if (!isFsmobileLandscapeRemarkReport() || document.body.classList.contains("generating-pdf")) return;
	            document.body.classList.add("fsmobile-landscape-report");
	            var field = reportRemarkTextarea();
	            if (!field) {
	              var block = document.createElement("section");
	              block.className = "fsmobile-report-remark-block";
	              block.innerHTML = '<label for="fsmobileReportBemerkung">Bemerkung</label><textarea id="fsmobileReportBemerkung" name="berichtBemerkung" data-field="berichtBemerkung" rows="3" aria-label="Bemerkung"></textarea>';
	              var signature = document.querySelector(".signature-block, .signature-wrap, .fsmobile-generated-signature-block");
	              var status = document.getElementById("archiveStatus");
	              var overlay = document.getElementById("archiveOverlay");
	              var anchor = signature || status || overlay || document.querySelector("script");
	              if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(block, anchor);
	              else document.body.appendChild(block);
	              field = block.querySelector("textarea");
	            }
	            autoResizeReportRemarkField(field);
	            restoreReportRemarkFromCurrentStorage();
	            installReportRemarkDataBridge();
	          }

	          function splitPdfText(doc, text, width) {
	            try {
	              var lines = doc.splitTextToSize(String(text || "-"), width);
	              return Array.isArray(lines) ? lines : [String(lines || "-")];
	            } catch (error) {
	              return String(text || "-").split(/\\n/);
	            }
	          }

	          function getFsmobilePdfPageHeight(doc) {
	            try {
	              if (doc && doc.internal && doc.internal.pageSize && typeof doc.internal.pageSize.getHeight === "function") {
	                return doc.internal.pageSize.getHeight();
	              }
	              if (doc && doc.internal && doc.internal.pageSize && doc.internal.pageSize.height) return doc.internal.pageSize.height;
	            } catch (error) {}
	            return 297;
	          }

	          function definePdfRemarkNextY(doc, value) {
	            try { Object.defineProperty(doc, "__fsmobileReportRemarkNextY", { value: value, configurable: true }); }
	            catch (error) { doc.__fsmobileReportRemarkNextY = value; }
	          }

	          function appendLandscapeReportRemarkToPdf(doc, y, options) {
	            if (!isFsmobileLandscapeRemarkReport() || !doc || doc.__fsmobileReportRemarkPdfAppended) return typeof y === "number" ? y : y;
	            try { Object.defineProperty(doc, "__fsmobileReportRemarkPdfAppended", { value: true }); }
	            catch (error) { doc.__fsmobileReportRemarkPdfAppended = true; }
	            options = options || {};
	            var pageWidth = Number(options.pageWidth) || getFsmobilePdfPageWidth(doc);
	            var pageHeight = Number(options.pageHeight) || getFsmobilePdfPageHeight(doc);
	            var margin = Number(options.margin) || 10;
	            var bottom = Number(options.bottom) || pageHeight - margin;
	            var top = Number(options.top) || 30;
	            var maxWidth = Math.max(30, pageWidth - margin * 2);
	            var currentY = typeof y === "number" ? y : top;
	            var text = currentReportRemarkValue().trim() || "-";
	            var lines = splitPdfText(doc, text, maxWidth - 4);
	            var lineHeight = 4;

	            function addPage() {
	              try { doc.addPage(); } catch (error) {}
	              currentY = top;
	            }

	            function ensure(space) {
	              if (currentY + space <= bottom) return;
	              addPage();
	            }

	            function drawHeader(title) {
	              ensure(10);
	              doc.setDrawColor(255, 255, 255);
	              doc.setLineWidth(0.2);
	              doc.setFillColor(255, 180, 71);
	              doc.rect(margin, currentY, maxWidth, 8, "FD");
	              doc.setTextColor(0, 0, 0);
	              doc.setFont("helvetica", "bold");
	              doc.setFontSize(8.5);
	              doc.text(title, margin + 2, currentY + 5.4);
	              currentY += 8;
	            }

	            drawHeader("Bemerkung");
	            while (lines.length) {
	              var availableLines = Math.max(1, Math.floor((bottom - currentY - 6) / lineHeight));
	              var chunk = lines.splice(0, availableLines);
	              var rowHeight = Math.max(12, chunk.length * lineHeight + 6);
	              ensure(rowHeight);
	              doc.setDrawColor(255, 255, 255);
	              doc.setLineWidth(0.2);
	              doc.setFillColor(245, 245, 245);
	              doc.rect(margin, currentY, maxWidth, rowHeight, "FD");
	              doc.setTextColor(17, 24, 39);
	              doc.setFont("helvetica", "normal");
	              doc.setFontSize(8);
	              doc.text(chunk, margin + 2, currentY + 5);
	              currentY += rowHeight;
	              if (lines.length) {
	                addPage();
	                drawHeader("Bemerkung (Fortsetzung)");
	              }
	            }
	            currentY += 6;
	            definePdfRemarkNextY(doc, currentY);
	            return currentY;
	          }

	          window.FSMOBILE_APPEND_REPORT_REMARK_TO_PDF = appendLandscapeReportRemarkToPdf;

	          function appendGeneratedSignatureToPdf(doc) {
	            if (!doc || doc.__fsmobileGeneratedSignatureAppended || !document.getElementById("fsmobileTechnikerSignaturePad")) return;
	            Object.defineProperty(doc, "__fsmobileGeneratedSignatureAppended", { value: true });
	            try {
	              var pageWidth = doc.internal.pageSize.getWidth();
	              var margin = 14;
	              var y = typeof doc.__fsmobileReportRemarkNextY === "number" ? doc.__fsmobileReportRemarkNextY : 24;
	              if (typeof doc.__fsmobileReportRemarkNextY !== "number") doc.addPage();
	              if (y + 46 > getFsmobilePdfPageHeight(doc) - 10) {
	                doc.addPage();
	                y = 24;
	              }
	              doc.setTextColor(17, 24, 39);
	              doc.setFont("helvetica", "bold");
	              doc.setFontSize(12);
              doc.text(FSMOBILE_SIGNATURE_LABEL, margin, y);
              var signature = generatedSignatureDataUrl();
              if (signature) {
                try { doc.addImage(signature, "PNG", margin, y + 8, 74, 24, undefined, "FAST"); } catch (error) {}
              }
              doc.setDrawColor(155, 155, 160);
              doc.setLineWidth(0.3);
              doc.line(margin, y + 38, Math.min(pageWidth - margin, margin + 86), y + 38);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.text(FSMOBILE_SIGNATURE_LABEL, margin, y + 43);
            } catch (error) {}
          }

          var FSMOBILE_PDF_LOGO_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAY0AAAA5CAIAAABF6eBRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjcgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wOC0wNFQxMDowMToxMSswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDItMDJUMTA6MDk6NTYrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDItMDJUMTA6MDk6NTYrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc1YTQ3ODhhLTQwYWEtNmE0Ni1hYmIwLTVlZWZhOTYzNDIwZSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowYWM5ZmQ4ZC0yNjliLTQ2NDktYWZhZC0yZDE3YWUzZWNiYzIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYWM5ZmQ4ZC0yNjliLTQ2NDktYWZhZC0yZDE3YWUzZWNiYzIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBhYzlmZDhkLTI2OWItNDY0OS1hZmFkLTJkMTdhZTNlY2JjMiIgc3RFdnQ6d2hlbj0iMjAyMy0wOC0wNFQxMDowMToxMSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjcgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NWE0Nzg4YS00MGFhLTZhNDYtYWJiMC01ZWVmYTk2MzQyMGUiIHN0RXZ0OndoZW49IjIwMjQtMDItMDJUMTA6MDk6NTYrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4zIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4DhjZYAAAh00lEQVR4nO2debhlVXnmf++39rlFMRRQFBSFTDIjIiqICogmcUgccEw0aaNxNhojprXN45BJ2xiNA3m6W9BOO0TbtIpinjaxbbuNRqBNtJnaAWPUAiwsSqQYROqevb63/1jr3CpAkpjcWxbJef+4z3Pv3Wfvtdde+13f937D0RYewRxzLB/2+8ghWr3pJz2KOf5FIX7SA5hjjjnm+Acw56k55phjV8ecp+aYY45dHXOemmOOOXZ1zHlqjjnm2NUx56k55phjV8ecp+aYY45dHXOemmOOOXZ1zHlqjjnm2NUx56k55phjV8ecp+aYY45dHXOemmOOOXZ1zHlqjjnm2NUx56k55phjV8ecp+aYY45dHTuDpwQGgQgD2ARg7DsduXzIfk4JsBLi9uePdoxml5bk2a+eDRtSUiJR2mGlHxDtgAHd/i6inSrx0qlmA1AVs4vGbE5ydpjbz0DL/VwGSC/z9O4kWAFg92nWpM9o+7X9EF5aSiEMBATGJBIyhEkL0laYXFoO3nFe+gI1QGCRJES7nG33ZRGzA/7BJxW2bS99ZAlJWtEvGe2iYRlitiiWJgEcS3faxjAbyfZhQ3HUfo2M2RTFbAaw8PY/FsvIVmxfwo4dTrj0d6M+lf0Ag4zUJ0re/sGVwbCiZwcEUzwgUVJp16BAhtKOy7npfL57OTd/nu+b7dywLBeWeQPHPceHGl3hWx/Oxbf7v9jsR4IgIUWZ4gESJEVbNZK98Bp/+V1cVUNtnVuB+TQPuLfWDGbaPrHER6TA9kCM5Gamj+LCaxllrPa4+/De6/s8hg03kp/k2g9o00W6ATusXLYp2I4tPEJsJ2FTNOPxXRxymlQppKBWflg0MYYiVYQzhNHsxU4bS7ZGaojBVBFW7RwmQZUKIwyzZ2pJwokCsrNHRYQKZJJCoZJk214qYENWPHGZynexC2TVIGwyCVEbKzntUGnUKQ/UUQhNlRNHpaAafVtXUU0P25QTO4OBWlGRcVSQnRFhwqox4wuXlMKZRAWRoUbICUMmRCILISVZIIlqWyijQgRJCkMMZpQiYswskiXQQFaVINMUtKiY2HmX8/DPw4rzVMKAClRqMTWUWUW5xD/8NS75Gj+U1FfJ8r6fDpMihUNOVwCWyAb3/SIFSSQOW83IciQq2PZv8ZVzdRUwIykgmzU0caMdhZROUECBEYCKb8Uv5rJro5YcqjpVtTfl3T7x0az/Orc8j8u+wi1hcBRUl5+mAqiiELZHvBsxpd5trCtbpdiSqiPKOIFRYbAzFKEYMUTYlu1uFIfqhDBOtZcQpAkaHZIzNY1SqIVipqlJsVNgpUzbUixJ6UxpFUxRkmFV1WDADjkoIzmK2L56pR39BBfUDGi1DYLMjAxFMSkKNYnRpeIiT9DsVR/sakmmUoxX4YwIyCzICZZFhiJcC2UxqoiBqHbIia0YnKm2GRdsNAyMGQVIIqxQ1sZ38oTBzoxcsHPmMwhXRUB1VViooCSnlOIawnIlJq4pD0RdiVWw4n5fgKTZq0tkDEzeEt96OBd9LW5rpkchmwGp5XtF1axUYbBlSVJga7sxi7rt3FZZIWo3lzPIRJ9g87lsDAt3J0EGU8gBVTLbZxtJSYaRdiFuJZ/F//0rbY2M2oys9nHxHt/3cWy4jsUn6gtf1i0zCysrbUnFcj4XJeRgZAO7EVOyLNvZVx4BKVEZQzVTU5eCCzUVNmMKqzDSPG2ZyPZGJs04jYqQItnWzVlHaMATotJNB+Mkmn8MDiw5bJCcbf0aVSgMpqIEj/j2bpruyP5yAbdNIbEdwQIgVzA1iUxSuUoJTggzIrs2xUJyyFKmI3BARJWaK0m4kIyKW+XSXFsbOUk5qnMUJrIxlRyMI8VY6cEIV9tyaX4hI3Ix26RsviikZapxEfJkJKZWoAGP0khRFjG1Bq8QSbETeEqoOguaORrx6rjyjfkNQNmmuqk2zcZZtvF0UnCIQKU4bCfNBIqmImV/DJnd/bM0JBZp+HO++0xdbpG4ERwSBCojsU0GSTLuHpRtELbzFvIZfOkvdQMOU9XloUB6pY84iwOm8iv0lc3u1lPtc9V8iWU1dWbU31SWKRIr4lquFCyojqBkn8E6tdJFGOUkahFTwjA0S8SlJpXArqHBrhlYiQYlyqSkbdpyiMhSySIm2NIAOGoqcFUjqi4eDqaoYpsQUWukKZCp2fvpO4muqs0xJR0hPEKtkd1+CSeWAo/IGYGrtWCKkCX39SUjSMfUqihMDQ2QqjWIZAErJaJJoCaMi1QojK5EwcAUFatCRlR5Kgehxo9VUwmcaOi7druDlLFVKYWxkBNRrcSTfl+JJ0FdQedsxXmqkiXKYt+n4i36u3fkt4Fm7EileWbRdiItp2jiICSRuDYRsL//ahY+BeWStk8X0ptF8wk2P1OXCalr6S5uqzWhQhYzLFlSsxMHDPhW/Mtc8jltlSlks+lkUD7fB7+cI0fqZhb/nC2NuwfETLqyGEgvr3ik9sNTOdu9343ivJpUVY0l6e4YGuRuelCqI9NhQUxnoYhJWHQ9apQmkQOUyLTSGmwrmz8WckauYqhoNDJTJFnhSgydpEpTTkc5XbLFZUwpGcrsy/j22K7rS5Fqa5G0JDuLJwR4dNRgoQtEMQQ1C+EkK0o1hmvxm7BclROlMIpV1EVCLgU5sKPGOBO5Q13ScJIMsUCtkKkJao4weLAHVCEcBhcPjjHlRl7JBNWu3gXK0mw8R8VSAtVR3EX0NuaVEhN2go4uZ12FquJS3/gmvgE7ykS1PYKUz/IBU9dYplcoQKkDKC0qUXpQQrhFPBKRblLUTF1wGotyCTc+i8sHa+xhQNnVXWBgxmVNh2r6a9M7ZXsr9em65EK24kCu/XIB+UIf9jqONzXRpb6RWVRxlEWBuoHd7ue9Z+HR5aOqTnsqM0a+m0hTAHixqGlSA3XaWN1OEThdTSiyoEw5JBAamxqsFqhKO6bKgiqaKKfNerZQo7gcM1MKuUnEbbYaNwUZxDZcmK1UVFAlA6DgVHjK7alKEirOpKbAIamQdab4L7qGEC7NkgoGxpEhwgGL6jJDmnYTKSAGXK0ipuSEAtXNOcRhRg0wRnMVaNJWJBnUStgM0azqtEuqThUL6W1BtUrFJZscJahu7rOK6OEHqyn9VW60W7FE0ypyFk7PFVpcK85TbgsHZL1Nfxemdo8v2uuznuFN3PuxPjCpy6mlS1hixBWiEkhKN+umjaxP9g4SKOTXufXp+hvD2DY/mx1MqjbElJvm0PQ17+CyvYlvXuitBer2VAMgX6jDXu9jk2piAW/SrW0MJnBC/Tmte6/vB8tu7yQMYvTS+sU7wY5ePshYYaUdIaed8ZhPt+dAFLIKrPLzp+33oVediqZygelff+PGB519sYkvvv3Uk4/eB2VlKJkOnvz6yy+4aJMb7aAnn77/2j30tIcd+tMn7YsnMG30g8dz/uyqf3veVyshpQm5p3e89YVHn33WEU3LDlq2xB33FWfedttt7/r05nf/j2su+9ZNhg1rd3/Gw/Z71S8dt2aPQSk0lSeQqRIeGeL1H/j6a9//dxCveOJhb3zucUHiibytk2C14RfeeOlHLtxUTO3SnWwj/N9/tpuQ1C9+fesDfuMLsxDzRJomMTjPOn3DR159krAdGnzOBd84+7yvLtnyAmuCp2h48mn7fvjVJyuhcM2WfNBLP/OdGyqw6X0P3bBuAfIHP6hHP+/Ca7f+ULDxT3764P0mImFhpmEsM3aCPtWnoHk6qe2moWC9ho/7lLM4IJf99mx3N73tTdmVx56tIljKBmGWz1W/ya1P5G+2NCOop0DFLL9lh5Xornh7O6dkwmu58h3aSF+zOdOz+FUOfb2PyWaOkVXNVKeFTgJZHOE9YdhhwD82dkzX2iGrK9o8MNszljVcsTPQA3Bkz6Bqcne00OssXci1yqjtOwklZvuLW/jMKLLF+6VuFzct8vwLt7zr09/9mVd98U8+fa0YoZjRAkXxWGNSyB40VtcrogpCKhB29mBwU8oVpC0T+pW3fOWl537l0m/d1J7ptd+/7Q8+dvUTfvdLpFElVzW3K2IkVZ3nfuI7zdd43+eu/eFtbaOcooLaAwypjJrKUenyxZIcZgUtraWJFdsTmqbpwFlFOBt5hRKXnoaxfQ33jEI8QsjRbIl7rIuXP/VwyAKvff+VpmB++4N/e+3WHwLnPP/YQ9YuKEUWa3GF1sDOyJ8KNJU/4y0yLfLWpR74A9/7SK2ZzsTj2rMcV3Y8hpTD2oYkFzcnK7+pxbP40nUsLon+BpQv9KHncU1fqO5nCWcTpKPnRA2/xdfO5apmZzlQ4tSAn+tDX8fx2f2EZmL5IFYjim1KyoP5D/p2dR7GboTGzMKPF5Rr0aFiA3uqHOU9jtOeq01QChrJNrGJi5oFd3dy/u4MpU+855pnP3JDOCFScdj+AzXviuQdqGKsQWIE7nPEvs9+5Pq0rt3ygzd/9Borz/nY1f/m4Rsiq6KQ6YgxUE5r4Tcev/7wdfukUgzy4gNPOKCFFJUCWSEqVvQkLMlx5TVbP/R/NgMb1u72yqcc8eB77fWmD3/z/Auv/8srvn/+xd998oMPRNWISC0uUMbPXXL9d7beBkBs/v5tn/rSdU84Y4NDcpgkB5VFcphksfI+R+z17IcfZAKlOiVlyx22XLXQhJUnnb7+zBPWwmgFqUMO2M2iOW5m+pB7r3nL844pims2/+DNF1yN80mn73/mCeuU9eD1q+zatFpRz37cEe/71KZLvvWDP/6fm170c4fvtke89aMbgfscufevPOIgcnAZ5VCWFbKndobfZzyYq7nV9LQmAPJe7P4Y1tu1EJCLMFn5rb5Z+y32VxB2gUreQr7CX9nCKLXoXNuo8ld96Ou517m6qrnebXilB+m8gKa2KK/ma+dpY9+sTCZtDT3Hh76OY03GDsKQ4b6smXmRNawRI72Dq/q/l3a2fzQ6W7b8rJkO9SIOfyVHraYbbyJEbeHXu5dJdWeYOPag3V961j3pu1+oc++PnjdhmKCxxdkRR23Y7SWPO1QE8KaPXoX50sYboPt8kuQUE4DkqWcefupR+6KKAgumXdWUrKpMAhQkLrVVQNx8a6UbgD7juL1OPmbde85e88qnbC1M1u+3u4U8ysUKyjgWf+Cz12Huse/ETDbdcOsHPnvdE09b3/w41UJMsTJq9SjK0QesfsnjjwwnUJXFUAtlJC3KxNvau3bmCfu89AmHMauN6MkQyLZK3P/Ife5/9H5y/vXf3vjmj11tOPOEfdqUZlNJqiWsQdXn/vp9Hnj2xQWec85Xjjlo0kywP37xvfdavSo1lUbqKhev0MJacZ5iZsJ8mZt61KLbKZzkvSFnYfKlgogVHozJbh0zsadQ4RZ4Bpe1nPjuq6tAfbEP+x2OM7U7eTMuqCAipEWnKL/NV89j45IcVUMlVZUv4vDf5aieFzorMhhQxQey26O0/194i5ukj5RdqTLbCxL+8WgWXP9wG4p5hzaezzUf50FHeTV9epcqNe7ekPLDF10Xj/mkQ6QDvfUFR730rMP5++3Qnms7YL7xnVv+6M82Qnz8os0ADA89cU3bw1T6ZupcLExGpg86++KWQ9P2sC+cc9qpR+4JMhPV6olUSWoU5Aka7XL8wXsdtHbVpu9v23TDtlNe/tcH7zV50In7PObUDU950N577Dko25JHnlK0+bp8z6euAp76UwcXj394wbaPXnjtphuO37DvKiIVwASmkZImts//wpaFR/95haauv/X5R734CUe3vZGoIwGIPPu8K88+72+bd2B42wuOP/usw2gqfUotS15ERqBEhYJM1tAka0ZMHItyuHDqUXu/7EkHv/2j11z67Zsu/TaQz37Uwaccs6eVUihXueQONQ/LjJ2hp1aWohLNge+3ciJ7twPuXOi3ssgW+KNSUd5MfSZf+jxbZzoGgex6hvZ9OUe1zL8ZBQWzXM3a4rXow1z7n9jYb6mZyakKv+rDfsdH9+1Lrb5DSFNyjAz5DT7+QAZaaE9pss4Y5MdmqXZT9PqvHcoUvZnxLF98E7VJY3dvZ28H2IHTRCOOxM7Bd8oP2H58C+cYQlYKLtt489nvvPJl5135mSu+Lzhw3/LOXzsBUIRrS+kMlRhjiqPbqtnXrjOt3QhJU4bQaBxBIZ0xgs3iHrsvfOYNJz/p9A2YkrrmpsWPfP57z3rbZce+8LNfu+Ym5KQShsI4fPryzTUQ/NIZBz7nZw/B1Ro+dOF3FKgGTjTFhTRkIZWuQpLkUa4Rkale41Mo0XRVSRAO3CJ3nuKWSlZRbaHrVKAxcShHp7EjcI3STTnbYoDhdb94/IFdL88N+y780fOPR5KHXmVBxSuVQbwz7KkFYkmB6gkuAnMR1z+HQwKkmDpBwwp5tztAyHJJZSuHNr+uyz7HVqCYCkRJ1zO07/vz/nvOqoWbkTLYLTF5SXj8BJtfzOXuxa/GbUnxNDb8no8RJINke2zuxAgLhNLGB2u3j/qBz+Gyr3BLn5z2vP8J1tTs47MQz/YzyLGF+kFtej6HVmdR9KSv5ZjMnyBE3vfwPX/5UQdNiBFJi2ccs/bv2c+lgisoM9vec9C+kzOOW/NXV9507fVY+fHfOuWYDXtmyRjd0/oUrjHkZGT68iccfPCBa8x08MT2YWtXw21WaIQS1rRXOoRiDIIgUT364L3Pf9VJ115/zJe/c8tFX735gs9dd8nGrZu/X9/ykWve+dITQpE5toTjc86/poVt/upr17echmB8z1989+zH3dMl0KgsVmoQUMVJ91z7zEesG6h4SMrpx+5NWFS3Sr9aUYbLEx+070Puu7ZUjxRJZxy7D0BL6dAszONsG5tbwmEXDSwXK9Wqy+rooj1Wlzc+8/hfedsV2G981nF7rJqgKRAVRwpmAZvlx87gqRaDeSjrPsH3eqWVAb6gG2+1dsdyj3yMK//+tJT0GiYx8Xtc+Qlftz2tXKH0mez3Ht93j1mMrAD2YI1yS/WSEXEB1z2Xy9tp7e54Cc7wmjdwvEgTAa2qqpHDRKr2BC2Sg3Uku/8lp/+Frvukv/tZtmzSyJIx9WNOhB3Fud1Bpa287kJ+kKuf70NXwW14uPuTFGDiiHusPvvxR6lWIqxmReouTXOnbaKEm/AcDz5+7Z++6gHnX3T1z//7yzBv+sjXP/Ta+8S4mhiTUQrVRamOTCU99aGHnHLUGlQcVa3GzdWjKZE4VAgYU8OQxeHEvOd/Xfest12C430vu9cv/8zBDz/pgNOP3fsRr/mbClt/sC1ke9oI7cpNN176rRusAvVl7/xGqx0wXL7xxi9eef0px+6PJ3aVwpXBBThqw6qXPf5IKgy4Jdu4YKSExAuAqWeetO7XHntYSyTr04blHSQ8W9btuj6kiaKotNytpssGLfvsXoesNg7KcYfu4Uh5MpY6TAseYeJS7651yABSxQd41ZLJABiu0+Kf+qrncLB6GXnslCL+sFLpgNfoa+/0RkDuz6Q4T2efP9Z993Rr2xJBjgRubKteeSPO96Z3sHHmOCctbG6fwdo/4ZTdZLmZbD0g1PP7XENlagrDIuOAIR/tdY9hnVXIUTOy+3E1pGbOFSLN53TDi7hsixebGxjoy/5BlWwtOBbF4PHulJL+o5EQytHDRDl2oTzvctZaJomzojLrGwCaPuW0DT994tX/+4qtF1x4/QWfv/6Jpx2oRBEQtMJ0kfbL/8s39utqagmPT/upg550+j2EjXtfAVpy+7ZgAoHy5x+836vfvdumG257xtv+36Ubb5bjLR/7lgiUZ5ywd49sJ4Tf9clrTcj1yadtgGwlph+9cIuVH/z8daccsx9CagkRObYaQy0aUarcIn7qaQrN94+x1Yf9509996Irvj+VIoG4z1F7vOZpx6h3Fmp+TdkedmnFgUHfi9XOHHJFKFfBVB4Q6RpOJZBDlVUVBVd5MivDX2bshHhf4Czkw1jX05e6Nxt2/iZf28Buj/b+0FXkZbuuMhyplFtGUkCPB2lW//JOb5zlQCGHI/fPeDcnr3G3pNrCj1k2XaOzLlGzEVhKq29Z6aex9v2ctEAOxFL/KZilXkm0MkMh12GpLVB3h+tM+/qnQCBaHms+zGufpA3nsrHfAwIP1hiZmQuO8Z+aovWTQBB2TamFP5BLj373tyixmntiWa4wYbtpGajCANPm81dVPIgeHIH4g2cd/4DfuDjJl7zjyoffb+2ahQkUZaJClrYCPnvF9cBsLuOME9e2t7pTzWz3lQci7YlcV+8++Y8vOu5F5375uuvrWz+2cZawkg+/19pnP/LQNnpUDf/1c9cA9z18zYdffdIspYWTXnLR5d+66b995ru//fRj9loleUCZvX9UxQtyzrz9vrlZTeefpcrAFd/cesU3+x8hzT26MWVAjlBrNzPz+6JpqS0N3rUFPWeCzYiokcrmVERGK+AOkdS2Ea8ISbETeCpIoEbZI/2L2vCnvtbdecrGVs/k0sex/1PYcD/2PlAL8vLs8/Jggi4oZcsjbelyNdQzLnFx67cSVm7I4QIevBdBN526yVGxZ0bwDi2kohdSuzdaOJN93sf9FlCr7Jil+HbeKfQSd0nhLGgEL7cJGZDEZdz0MV87+4uymXu4JBDbguHu0XuqIWkGjlvNCnb9wxceG7UefuAaVWVkSK0fiwwuSIhD9lt9zvOPlXSPtauJUbUAKIv09J9a95AT9zxk/4VW5HzK8Xu992Un3viD20Z583XjmsMmjQJsPeSEvd/+guPDIwzNflBWR3nI8fvINFc7IlreloUY8OgYcQnqWadtOPWYfT508XcuuuLmKu+9O094wMFnnbbeSpJUDbT5e9NXPuWIkhx7+BoATWGC8g+ff8yV377F1i03b1uzsHvzN4vj6Q/bcMaJ+xy+/2q7lVstVfn0TSmUB65b/fYXHGurUB0TZXW4miPWreqTeqfjz3nuUT/6vpqI1Q61Dlm78LYXHF2cB65b3dxb4p+zvf5joS08YkUvYGiNM6aqV3vbqVzYLwyKSOdS4s8ODRqXDb/Pcc/lMMhLueURunh7fQAspZs2i3p9xMfzwUewu6nIgyPVGzoUtI5PzXRp+sZIK81s5QucyZr3xP33SkmFWd77HZ5eC3pOnS1N7J3a+Fv++nLFDZZ86kbC20c7W5Df42dNXZQXZr0jVwj7feQQrd60bKfrklMQSUvUjMG4u3AEGvHsde3BhOgplLReU0TrUecgbFc3OZpURqqGIpmKodf2ORwpG4VbEM1Js+aaYa2YdeI00AQe6H1QWo10qkhSVmLAo41UespIs+RMBpG0TCW5tDGLgmsvW7ciIqlySCZNylHw1FHiDu5Hj6EUqGlFN7Uqs7Ex63vzo4/nru+LMKN6CnZkZFAyM2SWRrsystQSdkr/KdIwIQ5n99/nuFYripTZEqd6OoC1rOOZKcqz+UtMbxbcLmgPbgvG6zX5eD7wSHarrRrdqrDUjqbOmq0MSC0eJ0Sq1SrKZ2rv93LyXllE7x7TePAOj646sZcqWgZKXcaHq2bZ9Y5wiKDJp8XiF3RQ4sQLVvUsun63wFKKue0IifSoTBwlai+j7B4YO/RVDVr/tlojoDXiVDJWMQRVVNkoQ0GWYJUc2/Mhm1bZ8mkiCTdPpwXD5JYMV/sGO7s4NWieoRbC1UprUhmtoqDZ5cpZ/aYJV6JEc1qbeIDMSJpGcYyM00ggXdPCxWKqIKjdQJdvRxE22ZyYxNnqsAHX2d51l8ff5X1ZKRlaj9uMartGa8i8Y0fAJRttBbDiPNVaZZZZd9LncdgLfai8PaoVSx2XjJfPCWoU79Kms3b3Kty897Y1jKiY9Qwf98n3ZHXCKreaJwlCUcmB0qt5+p7SE5RmOw1neM17fd89aWt06eL9KS8tCWl7+5fGYGPn0mWCgajdLzWO1tbBroLn+jCTMwO93J36T0WxE9Ve3peE0q0xedvvHS4mbNnZmmEmtlqHAw00LQVBMEyaAmBKzwi10RRGVC3jgajOlidpDGNbSTl7vAFtowoUtCx/N92oZcg5qSgikaYFVBdxqaKnLPXHEGSxR+RKRVUSKVlEcbbWnROXAQbROt62YQxJwa2TXnEuaZxtLSVRdvg1RGDUckpbVc+PPP4u7qspqmRxy8GSaTn6QMzMWKvd1HIKzHdYBSt14hkECzB2sc8mf4/jf1/3ghgI3DoZzLh+GfvXSGFFq6WnVEVfB5KbWAMoq3iz731PrW7ZJItd0GmvuoWmaIGhaZ6dR1ujaYfhobnPu7nfnjNZekls2kFB7z93KIIm7d6CffncL99BGQ+3zAvgFT7ifqwROZDNYtDdKdiX6tmDEU5ioLfIm9K2eVrr2x5JoKuN7ha0Kt1+bPxVe42ux14oLqOFtqdpDMU4c+7AcnthCRGzUHWltQ13QLa2681Jojcppn+coTW+zpgQLu1WVIzMaFViIhcyiydYvTQDaC+C00oxNYszF6C9IDWoOMQwa/o5qyJ2C13Xxji0SaDpspUi9zP8iOPv6r4QoYBBkeSsoV6v464ztbafcDnf39tjJ/h9npIxs8gNJp/nQy/nIc/VwbT0MApE9++XCbazb6mluWq2UTb7grYqzLt90iO1XrO3fFjqmqeY+W5ZGVu1DTOiaTv76drn/Zy8NwXdzkK5M0nd4em1b3pYrjudndT0ewKIDIgN7PZHuve/42jk1txmiGLqMvfh2wloCQKYljI0szsAWlqAW9ndDo+hFdzRMwtawSWyVJqxQBNiUs5FHI4pQ9RZSFeuO1w82/cmAP1hujeeaOTXJc+sYqAOypCYtS+LUJIyhYKowmJBxiyiyiA7CfX+QJq28/eYs4taawh1GaPRZevvr+2l7Vg/oga755QJu/nGuuvj7+K+SOQe9SEU7atOdsg7D7U47Ira6Cse76s41HLR+pe4IKUXN7DwOh/7mz76s2z5Kjdfzk0DZdzenvifC+NgOIAFyOq6L/Fo7d/KtiwGx6j8BTY8lgNwq4zpo50JFG3Vt2+d4bFen5m9ONhd9noDJ6wiJFVnEWkKkzs0qHHPGOjKfdO8ijEcxMJj2H9Zbpamk4YiValS7O3hwax9NOvXuDXNbiU/GrOudEeK5UVLQMNRNZZW5M209dzomRwt2SfScuRETkfKBdObujWjAPq3MNBbp/f3thRl7WSnLFmIaiatp0JrKWONqvQkz6TZ3Bk1qvCgklhZatQC2RNBc5YEV1qpQs5iYs1Xaj1bAkRNTSrjILXWfRNHa/ZTVYtLqlU7ZI+T9/UZSf/Ch1T/3pqgN4IvUGehz3QbRGvlr/RdHN/NojvdF0BlHDyM7ftv2vJufkUha7sO7qddIVN9xeN9c/xrwzLH++aY427V13GOOeb4V4o5T80xxxy7OuY8Ncccc+zqmPPUHHPMsatjzlNzzDHHro45T80xxxy7OuY8Ncccc+zqmPPUHHPMsatjzlNzzDHHro45T80xxxy7OuY8Ncccc+zqmPPUHHPMsatjzlNzzDHHro45T80xxxy7OuY8Ncccc+zqGIYnP+AnPYY5/kWhLkyG/Tb8pEcxx78o/H9G33VreVT0qAAAAABJRU5ErkJggg==";
          var FSMOBILE_PDF_LOGO_WIDTH_MM = 70;
          var FSMOBILE_PDF_LOGO_HEIGHT_MM = 10;
          var FSMOBILE_PDF_LOGO_TOP_MM = 10;
          var FSMOBILE_PDF_LOGO_RIGHT_MM = 15;

          function shouldStampFsmobilePdfLogo() {
            return /^pb-/.test(window.FSMOBILE_MODULE_ID || "") || window.FSMOBILE_MODULE_ID === "aufmass-brandabschottungen";
          }

          function getFsmobilePdfPageWidth(doc) {
            try {
              if (doc && doc.internal && doc.internal.pageSize && typeof doc.internal.pageSize.getWidth === "function") {
                return doc.internal.pageSize.getWidth();
              }
              if (doc && doc.internal && doc.internal.pageSize && doc.internal.pageSize.width) return doc.internal.pageSize.width;
            } catch (error) {}
            return 210;
          }

          function getFsmobilePdfPageCount(doc) {
            try {
              if (doc && typeof doc.getNumberOfPages === "function") return doc.getNumberOfPages();
              if (doc && doc.internal && typeof doc.internal.getNumberOfPages === "function") return doc.internal.getNumberOfPages();
              if (doc && doc.internal && doc.internal.pages) return Math.max(1, doc.internal.pages.length - 1);
            } catch (error) {}
            return 1;
          }

          function getFsmobileCurrentPdfPage(doc) {
            try {
              if (doc && doc.internal && typeof doc.internal.getCurrentPageInfo === "function") {
                var info = doc.internal.getCurrentPageInfo();
                if (info && info.pageNumber) return info.pageNumber;
              }
            } catch (error) {}
            return null;
          }

          function stampFsmobilePdfLogoOnCurrentPage(doc) {
            if (!shouldStampFsmobilePdfLogo() || !doc || typeof doc.addImage !== "function") return;
            try {
              var pageWidth = getFsmobilePdfPageWidth(doc);
              var x = Math.max(0, pageWidth - FSMOBILE_PDF_LOGO_WIDTH_MM - FSMOBILE_PDF_LOGO_RIGHT_MM);
              doc.addImage(
                FSMOBILE_PDF_LOGO_DATA_URL,
                "PNG",
                x,
                FSMOBILE_PDF_LOGO_TOP_MM,
                FSMOBILE_PDF_LOGO_WIDTH_MM,
                FSMOBILE_PDF_LOGO_HEIGHT_MM,
                undefined,
                "FAST"
              );
            } catch (error) {}
          }

          function stampFsmobilePdfLogo(doc) {
            if (!shouldStampFsmobilePdfLogo() || !doc) return doc;
            var pageCount = getFsmobilePdfPageCount(doc);
            var currentPage = getFsmobileCurrentPdfPage(doc);
            var stampedPages = doc.__fsmobileLogoStampedPages;
            if (!stampedPages) {
              stampedPages = {};
              try { Object.defineProperty(doc, "__fsmobileLogoStampedPages", { value: stampedPages }); }
              catch (error) { doc.__fsmobileLogoStampedPages = stampedPages; }
            }
            for (var page = 1; page <= pageCount; page += 1) {
              if (stampedPages[page]) continue;
              try { if (typeof doc.setPage === "function") doc.setPage(page); } catch (error) {}
              stampFsmobilePdfLogoOnCurrentPage(doc);
              stampedPages[page] = true;
            }
            try { if (currentPage && typeof doc.setPage === "function") doc.setPage(currentPage); } catch (error) {}
            return doc;
          }

          window.FSMOBILE_STAMP_PDF_LOGO = stampFsmobilePdfLogo;

          function patchPdfLogoMethods(target) {
            if (!target || target.__fsmobileLogoMethodsPatched) return;
            Object.defineProperty(target, "__fsmobileLogoMethodsPatched", { value: true });
            if (typeof target.output === "function") {
              var originalOutput = target.output;
              target.output = function() {
                stampFsmobilePdfLogo(this);
                return originalOutput.apply(this, arguments);
              };
            }
          }


	          function fsmobilePdfFileName(originalName) {
            if (originalName && !/\\.pdf$/i.test(String(originalName))) return originalName;
            if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return originalName;
            var anlage = findFsmobileReportValue(["anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlage", "nummer"]);
            var object = findFsmobileReportValue(["object", "objekt"]);
            var date = findFsmobileReportValue(["date", "datum"]);
            if (!anlage && !object && !date) return originalName;
            return ensurePbFilePrefix(safeFsmobileFileSegment(anlage || "Ohne Anlagen Nr.", "Ohne Anlagen Nr.") + "_" +
              safeFsmobileFileSegment(object || "Ohne Objekt", "Ohne Objekt") + "_" +
              safeFsmobileFileSegment(formatFsmobileDateForFile(date), formatFsmobileDateForFile("")) + ".pdf");
	          }
	          window.FSMOBILE_PDF_FILE_NAME = fsmobilePdfFileName;

	          function downloadRawBlob(blob, fileName) {
	            var url = URL.createObjectURL(blob);
	            var link = document.createElement("a");
	            link.href = url;
	            link.download = fileName;
	            document.body.appendChild(link);
	            link.click();
	            link.remove();
	            setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
	          }

	          function finishCombinedPdfExport(pdfBlob, fileName) {
	            var builder = window.FSMOBILE_CREATE_REPORT_EXPORT_ZIP;
	            if (!window.FSMOBILE_COMBINED_PDF_EXPORT || typeof builder !== "function" || !/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
	            window.FSMOBILE_COMBINED_PDF_EXPORT = null;
	            var pdfName = fsmobilePdfFileName(fileName || "Pruefbericht.pdf");
	            Promise.resolve(builder(pdfBlob, pdfName)).catch(function(error) {
	              console.warn("Kombinierter PDF/JSON-Export konnte nicht erstellt werden:", error);
	              if (typeof window.FSMOBILE_SET_ACTION_STATUS === "function") window.FSMOBILE_SET_ACTION_STATUS("PDF Export konnte nicht erstellt werden.");
	              downloadRawBlob(pdfBlob, pdfName);
	            });
	            return true;
	          }

          function patchPdfTextMethod(target) {
            if (!target || target.__fsmobileTextPatched || typeof target.text !== "function") return;
            var originalText = target.text;
            Object.defineProperty(target, "__fsmobileTextPatched", { value: true });
            target.text = function(text) {
              var args = Array.prototype.slice.call(arguments);
              var originalPdfText = args[0];
              args[0] = normalizeSignaturePdfArgument(args[0]);
              var framedReportTitle = false;
              if (typeof args[1] === "number" && typeof args[2] === "number") {
                applyInlinePdfLabelSpacing(this, args, args[0]);
                framedReportTitle = framePdfReportTitle(this, args, args[0]);
                rememberInlinePdfLabel(this, originalPdfText, args[0], args[1], args[2]);
              }
              var result = originalText.apply(this, args);
              if (framedReportTitle && typeof this.setTextColor === "function") {
                try { this.setTextColor("#111827"); } catch (error) {}
              }
              return result;
            };
          }

          function patchPdfInstance(instance) {
            if (!instance) return instance;
            patchPdfTextMethod(instance);
            patchPdfLogoMethods(instance);
            if (instance.__fsmobileSavePatched || typeof instance.save !== "function") return instance;
            var originalSave = instance.save;
	            Object.defineProperty(instance, "__fsmobileSavePatched", { value: true });
		            instance.save = function(fileName) {
		              var args = Array.prototype.slice.call(arguments);
		              args[0] = fsmobilePdfFileName(fileName);
		              appendLandscapeReportRemarkToPdf(this);
		              appendGeneratedSignatureToPdf(this);
	              stampFsmobilePdfLogo(this);
		              try {
	                if (finishCombinedPdfExport(this.output("blob"), args[0])) return this;
	              } catch (error) {}
	              return originalSave.apply(this, args);
	            };
	            return instance;
	          }

          function patchJsPdfPrototype(JsPDF) {
            if (!JsPDF || !JsPDF.prototype) return;
            patchPdfTextMethod(JsPDF.prototype);
            patchPdfLogoMethods(JsPDF.prototype);
            if (JsPDF.prototype.__fsmobileSavePatched) return;
            var originalSave = JsPDF.prototype.save;
            if (typeof originalSave !== "function") return;
	            Object.defineProperty(JsPDF.prototype, "__fsmobileSavePatched", { value: true });
		            JsPDF.prototype.save = function(fileName) {
		              var args = Array.prototype.slice.call(arguments);
		              args[0] = fsmobilePdfFileName(fileName);
		              appendLandscapeReportRemarkToPdf(this);
		              appendGeneratedSignatureToPdf(this);
	              stampFsmobilePdfLogo(this);
	              try {
	                if (finishCombinedPdfExport(this.output("blob"), args[0])) return this;
	              } catch (error) {}
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

          function patchAvailableJsPdf() {
            patchJsPdfPrototype(window.jspdf && window.jspdf.jsPDF);
            patchJsPdfPrototype(window.jsPDF);
            patchJsPdfConstructor(window.jspdf, "jsPDF");
            patchJsPdfConstructor(window, "jsPDF");
          }

          function currentPatchedJsPdf(fallback) {
            patchAvailableJsPdf();
            return (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || fallback || null;
          }

          function installJsPdfLoaderPatch() {
            patchAvailableJsPdf();
            if (typeof window.ensureJsPdf === "function" && !window.ensureJsPdf.__fsmobilePatched) {
              var originalEnsureJsPdf = window.ensureJsPdf;
              window.ensureJsPdf = function() {
                return currentPatchedJsPdf(originalEnsureJsPdf.apply(this, arguments));
              };
              Object.defineProperty(window.ensureJsPdf, "__fsmobilePatched", { value: true });
            }
            if (typeof window.loadJsPdfIfNeeded === "function" && !window.loadJsPdfIfNeeded.__fsmobilePatched) {
              var originalLoadJsPdfIfNeeded = window.loadJsPdfIfNeeded;
              window.loadJsPdfIfNeeded = function() {
                return Promise.resolve(originalLoadJsPdfIfNeeded.apply(this, arguments))
                  .then(function(JsPDF) { return currentPatchedJsPdf(JsPDF); });
              };
              Object.defineProperty(window.loadJsPdfIfNeeded, "__fsmobilePatched", { value: true });
            }
          }

	          function installPdfFileNamePatch() {
	            if (!document.__fsmobileScriptLoadPdfPatchInstalled) {
	              Object.defineProperty(document, "__fsmobileScriptLoadPdfPatchInstalled", { value: true });
	              document.addEventListener("load", function(event) {
	                if (!event.target || String(event.target.tagName || "").toUpperCase() !== "SCRIPT") return;
	                window.setTimeout(patchAvailableJsPdf, 0);
	              }, true);
	            }
	            if (window.URL && typeof window.URL.createObjectURL === "function" && !window.URL.__fsmobileObjectUrlPatched) {
	              var originalCreateObjectURL = window.URL.createObjectURL.bind(window.URL);
	              var originalRevokeObjectURL = typeof window.URL.revokeObjectURL === "function" ? window.URL.revokeObjectURL.bind(window.URL) : null;
	              var objectUrlBlobs = {};
	              Object.defineProperty(window.URL, "__fsmobileObjectUrlPatched", { value: true });
	              window.FSMOBILE_OBJECT_URL_BLOBS = objectUrlBlobs;
	              window.URL.createObjectURL = function(blob) {
	                var url = originalCreateObjectURL(blob);
	                if (blob) objectUrlBlobs[url] = blob;
	                return url;
	              };
	              if (originalRevokeObjectURL) {
	                window.URL.revokeObjectURL = function(url) {
	                  setTimeout(function() { delete objectUrlBlobs[url]; }, 5000);
	                  return originalRevokeObjectURL(url);
	                };
	              }
	            }
	            if (!document.__fsmobileDownloadNamePatched) {
              Object.defineProperty(document, "__fsmobileDownloadNamePatched", { value: true });
	              document.addEventListener("click", function(event) {
	                var link = event.target && event.target.closest ? event.target.closest("a[download]") : null;
	                if (!link || !/\\.pdf$/i.test(link.download || "")) return;
	                link.download = fsmobilePdfFileName(link.download);
	                if (window.FSMOBILE_COMBINED_PDF_EXPORT && typeof window.FSMOBILE_CREATE_REPORT_EXPORT_ZIP === "function") {
	                  event.preventDefault();
	                  event.stopImmediatePropagation();
	                  var storedBlob = window.FSMOBILE_OBJECT_URL_BLOBS && window.FSMOBILE_OBJECT_URL_BLOBS[link.href];
	                  if (storedBlob) finishCombinedPdfExport(storedBlob, link.download);
	                  else fetch(link.href)
	                    .then(function(response) { return response.blob(); })
	                    .then(function(blob) { finishCombinedPdfExport(blob, link.download); })
	                    .catch(function(error) {
	                      window.FSMOBILE_COMBINED_PDF_EXPORT = null;
	                      console.warn("PDF-Download konnte nicht in den kombinierten Export übernommen werden:", error);
	                    });
	                }
	              }, true);
	            }
	            if (window.HTMLAnchorElement && window.HTMLAnchorElement.prototype && !window.HTMLAnchorElement.prototype.__fsmobileClickPatched) {
	              var originalAnchorClick = window.HTMLAnchorElement.prototype.click;
	              Object.defineProperty(window.HTMLAnchorElement.prototype, "__fsmobileClickPatched", { value: true });
	              window.HTMLAnchorElement.prototype.click = function() {
	                var link = this;
	                if (link && /\\.pdf$/i.test(link.download || "")) {
	                  link.download = fsmobilePdfFileName(link.download);
	                  if (window.FSMOBILE_COMBINED_PDF_EXPORT && typeof window.FSMOBILE_CREATE_REPORT_EXPORT_ZIP === "function" && link.href) {
	                    var clickBlob = window.FSMOBILE_OBJECT_URL_BLOBS && window.FSMOBILE_OBJECT_URL_BLOBS[link.href];
	                    if (clickBlob) finishCombinedPdfExport(clickBlob, link.download);
	                    else fetch(link.href)
	                      .then(function(response) { return response.blob(); })
	                      .then(function(blob) { finishCombinedPdfExport(blob, link.download); })
	                      .catch(function(error) {
	                        window.FSMOBILE_COMBINED_PDF_EXPORT = null;
	                        console.warn("PDF-Link konnte nicht in den kombinierten Export übernommen werden:", error);
	                        originalAnchorClick.call(link);
	                      });
	                    return;
	                  }
	                }
	                return originalAnchorClick.apply(this, arguments);
	              };
	              var originalAnchorDispatch = window.HTMLAnchorElement.prototype.dispatchEvent;
	              window.HTMLAnchorElement.prototype.dispatchEvent = function(event) {
	                var link = this;
	                if (event && event.type === "click" && link && /\\.pdf$/i.test(link.download || "")) {
	                  link.download = fsmobilePdfFileName(link.download);
	                  if (window.FSMOBILE_COMBINED_PDF_EXPORT && typeof window.FSMOBILE_CREATE_REPORT_EXPORT_ZIP === "function" && link.href) {
	                    var dispatchBlob = window.FSMOBILE_OBJECT_URL_BLOBS && window.FSMOBILE_OBJECT_URL_BLOBS[link.href];
	                    if (dispatchBlob) finishCombinedPdfExport(dispatchBlob, link.download);
	                    else fetch(link.href)
	                      .then(function(response) { return response.blob(); })
	                      .then(function(blob) { finishCombinedPdfExport(blob, link.download); })
	                      .catch(function(error) {
	                        window.FSMOBILE_COMBINED_PDF_EXPORT = null;
	                        console.warn("PDF-Dispatch konnte nicht in den kombinierten Export übernommen werden:", error);
	                        originalAnchorDispatch.call(link, event);
	                      });
	                    return true;
	                  }
	                }
	                return originalAnchorDispatch.apply(this, arguments);
	              };
	            }
	            var tries = 0;
            var timer = window.setInterval(function() {
              patchAvailableJsPdf();
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

            function normalizeArchiveKeyPart(value, options) {
              var text = String(value == null ? "" : value).trim().replace(/\\s+/g, " ");
              if (options && options.lower) text = text.toLocaleLowerCase("de-DE");
              return text;
            }

            function normalizeArchiveDate(value) {
              var raw = normalizeArchiveKeyPart(value);
              var iso = raw.match(/^(\\d{4})-(\\d{1,2})-(\\d{1,2})/);
              if (iso) return iso[1] + "-" + iso[2].padStart(2, "0") + "-" + iso[3].padStart(2, "0");
              var german = raw.match(/^(\\d{1,2})\\.(\\d{1,2})\\.(\\d{4})$/);
              if (german) return german[3] + "-" + german[2].padStart(2, "0") + "-" + german[1].padStart(2, "0");
              return raw;
            }

            function firstArchiveValue(source, keys) {
              if (!source || typeof source !== "object") return "";
              for (var index = 0; index < keys.length; index += 1) {
                var key = keys[index];
                if (source[key] != null && String(source[key]).trim()) return source[key];
              }
              var wanted = keys.map(function(key) { return String(key).toLowerCase(); });
              var found = "";
              Object.keys(source).some(function(key) {
                if (wanted.indexOf(String(key).toLowerCase()) < 0) return false;
                if (source[key] == null || !String(source[key]).trim()) return false;
                found = source[key];
                return true;
              });
              return found;
            }

            function archiveFields(entry) {
              var report = entry && entry.report && typeof entry.report === "object" ? entry.report : {};
              return report.fields && typeof report.fields === "object" ? report.fields : report;
            }

            function archiveEntryIdentity(storageKey, entry) {
              var fields = archiveFields(entry);
              var anlage = normalizeArchiveKeyPart(firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]));
              var object = normalizeArchiveKeyPart(firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]), { lower: true });
              var date = normalizeArchiveDate(firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]));
              if (!anlage || !object || !date) return "";
              return [
                storageKey,
                anlage,
                object,
                date
              ].join("||");
            }

            function currentArchiveReport() {
              var collectors = ["buildStoragePayload", "collectReportData", "collectData", "getCurrentReport"];
              for (var index = 0; index < collectors.length; index += 1) {
                var fn = window[collectors[index]];
                if (typeof fn !== "function") continue;
                try { return normalizeCurrentArchiveReport(fn()); } catch (error) {}
              }
              return normalizeCurrentArchiveReport({});
            }

            function normalizeCurrentArchiveReport(report) {
              if (!report || typeof report !== "object" || Array.isArray(report)) report = {};
              if (!report.fields || typeof report.fields !== "object" || Array.isArray(report.fields)) report.fields = {};
              var fields = report.fields;
              var domFields = currentArchiveDomFields();
              var anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]) || domFields.anlage;
              var object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]) || domFields.object;
              var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]) || domFields.date;
              if (anlage) {
                fields.anlage = String(anlage).trim();
                if (!fields.anlagenNr) fields.anlagenNr = fields.anlage;
              }
              if (object) {
                fields.object = String(object).trim();
                if (!fields.objekt) fields.objekt = fields.object;
              }
              if (date) {
                fields.date = normalizeArchiveDate(date);
                if (!fields.datum) fields.datum = fields.date;
              }
              return report;
            }

            function currentArchiveDomFields() {
              return {
                anlage: firstArchiveDomValue(
                  ["anlageInput", "anlagenNrInput", "anlagenNummerInput", "anlageNrInput", "anlagennrInput"],
                  ["[name='anlage']", "[name='anlagenNr']", "[name='anlagenNummer']", "[name='anlageNr']", "[name='anlagen_nr']", "[data-field='anlage']", "[data-field='anlagenNr']", "[data-field='anlagenNummer']", "[data-field='anlageNr']", "[data-field='anlagen_nr']", "[aria-label='Anlagen Nr.']", "[aria-label='Anlagen Nr']", "[placeholder*='Anlagen']"],
                  [["anlagen", "nr"], ["anlage", "nr"]]
                ),
                object: firstArchiveDomValue(
                  ["objectInput", "objektInput"],
                  ["[name='object']", "[name='objekt']", "[data-field='object']", "[data-field='objekt']", "[aria-label='Objekt']", "[placeholder*='Objekt']"],
                  [["objekt"], ["object"]]
                ),
                date: firstArchiveDomValue(
                  ["dateInput", "datumInput"],
                  ["[name='date']", "[name='datum']", "[data-field='date']", "[data-field='datum']", "[aria-label='Datum']", "input[type='date']"],
                  [["datum"], ["date"]]
                )
              };
            }

            function firstArchiveDomValue(ids, selectors, labelGroups) {
              return archiveDomFieldValue(firstArchiveDomField(ids, selectors, labelGroups));
            }

            function firstArchiveDomField(ids, selectors, labelGroups) {
              for (var index = 0; index < ids.length; index += 1) {
                var field = document.getElementById(ids[index]);
                if (field && "value" in field) return field;
              }
              selectors = selectors || [];
              for (var selectorIndex = 0; selectorIndex < selectors.length; selectorIndex += 1) {
                var found = null;
                try { found = document.querySelector(selectors[selectorIndex]); } catch (error) {}
                if (found && "value" in found) return found;
              }
              return firstArchiveLabeledDomField(labelGroups || []);
            }

            function archiveDomFieldValue(field) {
              if (!field || !("value" in field)) return "";
              return String(field.value || "").trim();
            }

            function firstArchiveLabeledDomValue(labelGroups) {
              return archiveDomFieldValue(firstArchiveLabeledDomField(labelGroups));
            }

            function firstArchiveLabeledDomField(labelGroups) {
              if (!labelGroups.length) return "";
              var labels = document.querySelectorAll("label");
              for (var index = 0; index < labels.length; index += 1) {
                var label = labels[index];
                var text = normalizeArchiveKeyPart(label.textContent, { lower: true });
                var matches = labelGroups.some(function(group) {
                  return group.every(function(needle) { return text.indexOf(needle) >= 0; });
                });
                if (!matches) continue;
                var host = label.closest("label, .field, .field-group, .form-field, .control, .input-group, .info-field, td");
                var field = host ? host.querySelector("input, select, textarea") : null;
                if (field && "value" in field) return field;
              }
              return "";
            }

            function setArchiveFieldValue(field, value) {
              if (!field || !("value" in field)) return false;
              field.value = value == null ? "" : String(value);
              try { field.dispatchEvent(new Event("input", { bubbles: true })); } catch (error) {}
              try { field.dispatchEvent(new Event("change", { bubbles: true })); } catch (error) {}
              if (field.tagName === "TEXTAREA") {
                field.style.height = "auto";
                field.style.height = Math.max(field.scrollHeight, 44) + "px";
              }
              return true;
            }

            function setFirstArchiveDomValue(ids, selectors, labelGroups, value) {
              return setArchiveFieldValue(firstArchiveDomField(ids, selectors, labelGroups), value);
            }

            function archiveReportFieldBundle(report) {
              var normalized = report && typeof report === "object" ? report : {};
              return normalized.fields && typeof normalized.fields === "object" ? normalized.fields : normalized;
            }

            function archiveHasAnyKey(source, keys) {
              if (!source || typeof source !== "object") return false;
              var wanted = keys.map(function(key) { return String(key).toLowerCase(); });
              return Object.keys(source).some(function(key) {
                return wanted.indexOf(String(key).toLowerCase()) >= 0;
              });
            }

            function latestArchiveEntryForOpen(storageKey, entry) {
              if (!storageKey || !entry) return entry;
              var entries = readArchiveEntriesForKey(storageKey);
              if (entry.id) {
                var byId = entries.find(function(item) { return item && item.id === entry.id; });
                if (byId) return byId;
              }
              var wanted = archiveEntryIdentity(storageKey, entry);
              if (!wanted) return entry;
              return entries.find(function(item) {
                return archiveEntryIdentity(storageKey, item) === wanted;
              }) || entry;
            }

            function archiveReportMatchesDom(report) {
              var fields = archiveReportFieldBundle(report);
              var expectedAnlage = normalizeArchiveKeyPart(firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]));
              var expectedObject = normalizeArchiveKeyPart(firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]), { lower: true });
              var expectedDate = normalizeArchiveDate(firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]));
              var domFields = currentArchiveDomFields();
              var actualAnlage = normalizeArchiveKeyPart(domFields.anlage);
              var actualObject = normalizeArchiveKeyPart(domFields.object, { lower: true });
              var actualDate = normalizeArchiveDate(domFields.date);
              if (expectedAnlage && expectedAnlage !== actualAnlage) return false;
              if (expectedObject && expectedObject !== actualObject) return false;
              if (expectedDate && expectedDate !== actualDate) return false;
              return true;
            }

            function applyArchiveReportDomFallback(report) {
              var fields = archiveReportFieldBundle(report);
              var anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]);
              var object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]);
              var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]);
              var technician = firstArchiveValue(fields, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"]);
              var hasReportRemark = archiveHasAnyKey(fields, ["berichtBemerkung", "reportRemark", "reportBemerkung"]) || archiveHasAnyKey(report, ["berichtBemerkung", "reportRemark", "reportBemerkung"]);
              var reportRemark = firstArchiveValue(fields, ["berichtBemerkung", "reportRemark", "reportBemerkung"]);
              if (!reportRemark && report && typeof report === "object") reportRemark = firstArchiveValue(report, ["berichtBemerkung", "reportRemark", "reportBemerkung"]);

              if (archiveHasAnyKey(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])) {
                setFirstArchiveDomValue(
                  ["anlageInput", "anlagenNrInput", "anlagenNummerInput", "anlageNrInput", "anlagennrInput"],
                  ["[name='anlage']", "[name='anlagenNr']", "[name='anlagenNummer']", "[name='anlageNr']", "[name='anlagen_nr']", "[data-field='anlage']", "[data-field='anlagenNr']", "[data-field='anlagenNummer']", "[data-field='anlageNr']", "[data-field='anlagen_nr']", "[aria-label='Anlagen Nr.']", "[aria-label='Anlagen Nr']"],
                  [["anlagen", "nr"], ["anlage", "nr"]],
                  anlage
                );
              }
              if (archiveHasAnyKey(fields, ["object", "objekt", "objectInput", "objektInput"])) {
                setFirstArchiveDomValue(
                  ["objectInput", "objektInput"],
                  ["[name='object']", "[name='objekt']", "[data-field='object']", "[data-field='objekt']", "[aria-label='Objekt']"],
                  [["objekt"], ["object"]],
                  object
                );
              }
              if (archiveHasAnyKey(fields, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])) {
                setFirstArchiveDomValue(
                  ["prueferInput", "technikerInput", "nameInput", "technicianInput"],
                  ["[name='pruefer']", "[name='techniker']", "[name='name']", "[name='technician']", "[data-field='pruefer']", "[data-field='techniker']", "[data-field='name']", "[aria-label='Techniker']", "[aria-label='Prüfer']"],
                  [["techniker"], ["prüfer"], ["pruefer"]],
                  technician
                );
              }
              if (archiveHasAnyKey(fields, ["date", "datum", "dateInput", "datumInput"])) {
                setFirstArchiveDomValue(
                  ["dateInput", "datumInput"],
                  ["[name='date']", "[name='datum']", "[data-field='date']", "[data-field='datum']", "[aria-label='Datum']", "input[type='date']"],
                  [["datum"], ["date"]],
                  date
                );
              }
              if (hasReportRemark) {
                setFirstArchiveDomValue(
                  ["fsmobileReportBemerkung", "berichtBemerkungInput", "reportRemarkInput"],
                  ["[name='berichtBemerkung']", "[name='reportRemark']", "[data-field='berichtBemerkung']", "[data-field='reportRemark']"],
                  [["bemerkung"]],
                  reportRemark
                );
              }
            }

            function archiveTimestamp(entry, fallbackIndex) {
              var value = Date.parse((entry && (entry.updatedAt || entry.savedAt || entry.createdAt)) || "");
              return Number.isFinite(value) ? value : fallbackIndex;
            }

            function dedupeArchiveEntriesForKey(storageKey) {
              var raw = null;
              try { raw = localStorage.getItem(storageKey); } catch (error) { return { changed: false }; }
              if (!raw) return { changed: false };
              var entries = null;
              try { entries = JSON.parse(raw); } catch (error) { return { changed: false }; }
              if (!Array.isArray(entries) || entries.length < 2) return { changed: false };

              var groups = {};
              entries.forEach(function(entry, index) {
                var key = archiveEntryIdentity(storageKey, entry);
                if (!key) key = "__incomplete__||" + (entry && entry.id ? entry.id : index);
                if (!groups[key]) groups[key] = [];
                groups[key].push({ entry: entry, index: index });
              });

              var changed = false;
              var removedIds = [];
              var idReplacements = {};
              var removeIndexes = {};
              Object.keys(groups).forEach(function(key) {
                var group = groups[key];
                if (group.length < 2) return;
                changed = true;
                var keep = group.reduce(function(best, item) {
                  return item.index < best.index ? item : best;
                }, group[0]);
                var latest = group.reduce(function(best, item) {
                  var itemTime = archiveTimestamp(item.entry, item.index);
                  var bestTime = archiveTimestamp(best.entry, best.index);
                  if (itemTime > bestTime) return item;
                  if (itemTime === bestTime && item.index > best.index) return item;
                  return best;
                }, group[0]);
                var keepId = keep.entry && keep.entry.id ? keep.entry.id : latest.entry && latest.entry.id;
                var latestId = latest.entry && latest.entry.id ? latest.entry.id : keepId;
                var merged = Object.assign({}, latest.entry, {
                  id: keepId,
                  createdAt: (keep.entry && keep.entry.createdAt) || (latest.entry && latest.entry.createdAt) || new Date().toISOString(),
                  updatedAt: (latest.entry && latest.entry.updatedAt) || new Date().toISOString()
                });
                entries[keep.index] = merged;
                group.forEach(function(item) {
                  if (item.index === keep.index) return;
                  removeIndexes[item.index] = true;
                  if (item.entry && item.entry.id) {
                    removedIds.push(item.entry.id);
                    idReplacements[item.entry.id] = keepId;
                  }
                });
                if (latestId && latestId !== keepId) idReplacements[latestId] = keepId;
              });

              if (!changed) return { changed: false };
              var deduped = entries.filter(function(entry, index) { return !removeIndexes[index]; });
              try { localStorage.setItem(storageKey, JSON.stringify(deduped)); } catch (error) { return { changed: false }; }

              try {
                for (var index = 0; index < localStorage.length; index += 1) {
                  var key = localStorage.key(index);
                  var value = localStorage.getItem(key);
                  if (idReplacements[value]) localStorage.setItem(key, idReplacements[value]);
                }
              } catch (error) {}

              return { changed: true, removedIds: removedIds };
            }

            function normalizedArchiveToken(value) {
              return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
            }

            function archiveKeyMatchesCurrentModule(key) {
              var moduleToken = normalizedArchiveToken(window.FSMOBILE_MODULE_ID || "");
              var keyToken = normalizedArchiveToken(key);
              if (!moduleToken) return true;
              if (keyToken.indexOf(moduleToken) >= 0) return true;
              if (moduleToken === "pbzentralbatterieanlage" && keyToken.indexOf("pbzentralbatterie") >= 0) return true;
              return false;
            }

            function archiveStorageKeys(options) {
              var keys = [];
              try {
                for (var index = 0; index < localStorage.length; index += 1) {
                  var key = localStorage.key(index);
                  if (!/^fsmobile-.*pb.*archive.*v\\d+$/i.test(key) || /current/i.test(key)) continue;
                  if (options && options.currentOnly && !archiveKeyMatchesCurrentModule(key)) continue;
                  keys.push(key);
                }
              } catch (error) {}
              return keys;
            }

            function archiveStorageKeyFromScripts() {
              var scripts = document.querySelectorAll("script");
              for (var index = 0; index < scripts.length; index += 1) {
                var text = scripts[index].textContent || "";
                var match = text.match(/\bARCHIVE_STORAGE_KEY\s*=\s*["']([^"']+)["']/);
                if (match && match[1]) return match[1];
              }
              return "";
            }

            function inferredArchiveStorageKeys() {
              var moduleId = String(window.FSMOBILE_MODULE_ID || "").trim();
              var keys = [];
              if (moduleId) keys.push("fsmobile-" + moduleId + "-archive-v1");
              if (moduleId === "pb-zentralbatterie-anlage") keys.push("fsmobile-pb-zentralbatterie-archive-v1");
              return keys;
            }

            function resolveArchiveStorageKey() {
              var scripted = archiveStorageKeyFromScripts();
              if (scripted && archiveKeyMatchesCurrentModule(scripted)) return scripted;
              var existing = archiveStorageKeys({ currentOnly: true });
              if (existing.length) return existing[0];
              return inferredArchiveStorageKeys()[0] || "";
            }

            function readArchiveEntriesForKey(storageKey) {
              if (!storageKey) return [];
              var raw = null;
              try { raw = localStorage.getItem(storageKey); } catch (error) { return []; }
              if (!raw) return [];
              try {
                var entries = JSON.parse(raw);
                return Array.isArray(entries) ? entries : [];
              } catch (error) {
                return [];
              }
            }

            function writeArchiveEntriesForKey(storageKey, entries) {
              if (!storageKey) return false;
              try {
                localStorage.setItem(storageKey, JSON.stringify(entries));
                return true;
              } catch (error) {
                return false;
              }
            }

            function createBridgeArchiveId() {
              if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
              return "archive-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
            }

            function archiveDisplayDate(value) {
              var normalized = normalizeArchiveDate(value);
              var parts = normalized.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
              return parts ? parts[3] + "." + parts[2] + "." + parts[1] : (String(value || "").trim() || "Ohne Datum");
            }

            function archiveDisplayTitle(entry) {
              var fields = archiveFields(entry);
              var anlage = String(firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]) || "").trim() || "Ohne Anlagen Nr.";
              var object = String(firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]) || "").trim() || "Ohne Objekt";
              var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]);
              var report = entry && entry.report && typeof entry.report === "object" ? entry.report : {};
              var count = Array.isArray(report.rows) ? " (" + report.rows.length + ")" : "";
              return anlage + " - " + object + count + " - " + archiveDisplayDate(date);
            }

            function applyArchiveEntryReport(entry, storageKey) {
              if (!entry || !entry.report) return;
              entry = latestArchiveEntryForOpen(storageKey, entry);
              var applied = false;
              ["applyReport", "applyData", "applyReportData", "restoreReportData", "applyStoragePayload"].some(function(name) {
                var fn = window[name];
                if (typeof fn !== "function") return false;
                try {
                  fn(entry.report);
                  applied = true;
                } catch (error) {}
                return applied;
              });
              if (!applied || !archiveReportMatchesDom(entry.report)) applyArchiveReportDomFallback(entry.report);
              if (entry.id) writeCurrentArchiveIdForKey(storageKey, entry.id);
              persistCurrentDraftBeforeArchive();
              var overlay = document.getElementById("archiveOverlay");
              if (overlay) overlay.hidden = true;
              setUnifiedActionStatus("Prüfbericht wurde aus dem Archiv geöffnet.");
            }

            function deleteArchiveEntryFromDisplay(entry, storageKey) {
              if (!entry || !entry.id || !storageKey) return;
              if (!confirm("Archiv-Eintrag '" + archiveDisplayTitle(entry) + "' löschen?")) return;
              var entries = readArchiveEntriesForKey(storageKey).filter(function(item) {
                return item && item.id !== entry.id;
              });
              if (writeArchiveEntriesForKey(storageKey, entries)) {
                candidateCurrentArchiveIdKeys(storageKey).forEach(function(key) {
                  try {
                    if (localStorage.getItem(key) === entry.id) localStorage.removeItem(key);
                  } catch (error) {}
                });
                refreshArchiveListDisplay(storageKey);
                setUnifiedActionStatus("Archiv-Eintrag wurde gelöscht.");
              }
            }

            function refreshArchiveListDisplay(storageKey) {
              var archiveList = document.getElementById("archiveList");
              if (!archiveList || !storageKey) return;
              var entries = readArchiveEntriesForKey(storageKey).slice().sort(function(a, b) {
                return String((b && b.updatedAt) || "").localeCompare(String((a && a.updatedAt) || ""));
              });
              archiveList.innerHTML = "";
              if (!entries.length) {
                var empty = document.createElement("p");
                empty.className = "archive-empty";
                empty.textContent = "Noch keine gespeicherten Prüfberichte im Archiv.";
                archiveList.appendChild(empty);
                return;
              }
              entries.forEach(function(entry) {
                var item = document.createElement("article");
                item.className = "archive-item";
                var text = document.createElement("div");
                var title = document.createElement("div");
                var meta = document.createElement("div");
                title.className = "archive-title";
                meta.className = "archive-meta";
                title.textContent = archiveDisplayTitle(entry);
                meta.textContent = "Geändert: " + archiveDisplayDate(String((entry && entry.updatedAt) || "").slice(0, 10));
                text.append(title, meta);
                var openButton = document.createElement("button");
                openButton.type = "button";
                openButton.textContent = "Öffnen";
                openButton.addEventListener("click", function() { applyArchiveEntryReport(latestArchiveEntryForOpen(storageKey, entry), storageKey); });
                var deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "danger";
                deleteButton.textContent = "Löschen";
                deleteButton.addEventListener("click", function() { deleteArchiveEntryFromDisplay(entry, storageKey); });
                item.append(text, openButton, deleteButton);
                archiveList.appendChild(item);
              });
            }

            function persistCurrentDraftBeforeArchive() {
              ["saveToStorageNow", "saveFormToStorage", "saveCurrentDraft"].some(function(name) {
                var fn = window[name];
                if (typeof fn !== "function") return false;
                try { fn(); } catch (error) {}
                return true;
              });
            }

            function saveReportArchiveByIdentity() {
              if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
              persistCurrentDraftBeforeArchive();
              var storageKey = resolveArchiveStorageKey();
              var report = currentArchiveReport();
              var entries = readArchiveEntriesForKey(storageKey);
              var identity = archiveEntryIdentity(storageKey, { report: report });
              var existingIndex = identity ? entries.findIndex(function(entry) {
                return archiveEntryIdentity(storageKey, entry) === identity;
              }) : -1;
              var now = new Date().toISOString();
              var wasUpdate = existingIndex >= 0;
              var previous = wasUpdate ? entries[existingIndex] : null;
              var entry = {
                id: previous && previous.id ? previous.id : createBridgeArchiveId(),
                createdAt: previous && previous.createdAt ? previous.createdAt : now,
                updatedAt: now,
                report: report
              };
              if (wasUpdate) entries[existingIndex] = entry;
              else entries.push(entry);
              if (!writeArchiveEntriesForKey(storageKey, entries)) {
                setUnifiedActionStatus("Prüfbericht konnte nicht im Archiv gespeichert werden.");
                return true;
              }
              var cleanup = dedupeArchiveEntriesForKey(storageKey);
              if (cleanup.changed) entries = readArchiveEntriesForKey(storageKey);
              writeCurrentArchiveIdForKey(storageKey, entry.id);
              if (typeof window.renderArchiveList === "function") {
                try { window.renderArchiveList(); } catch (error) {}
              }
              refreshArchiveListDisplay(storageKey);
              setUnifiedActionStatus(wasUpdate ? "Vorhandener Archiv-Eintrag aktualisiert." : (identity ? "Bericht im Archiv gespeichert." : "Bericht im Archiv gespeichert. Zuordnungsdaten unvollständig."));
              return true;
            }

            function candidateCurrentArchiveIdKeys(storageKey) {
              var keys = [];
              var match = String(storageKey || "").match(/^(.*)-archive-v(\\d+)$/i);
              if (match) {
                keys.push(match[1] + "-current-v" + match[2]);
                keys.push(match[1] + "-current-archive-id-v" + match[2]);
              }
              try {
                for (var index = 0; index < localStorage.length; index += 1) {
                  var key = localStorage.key(index);
                  if (!/current/i.test(key) || !archiveKeyMatchesCurrentModule(key)) continue;
                  if (keys.indexOf(key) < 0) keys.push(key);
                }
              } catch (error) {}
              return keys;
            }

            function writeCurrentArchiveIdForKey(storageKey, id) {
              if (!id) return;
              candidateCurrentArchiveIdKeys(storageKey).forEach(function(key) {
                try { localStorage.setItem(key, id); } catch (error) {}
              });
            }

            function clearCurrentArchiveIdsForCurrentModule() {
              archiveStorageKeys({ currentOnly: true }).forEach(function(storageKey) {
                candidateCurrentArchiveIdKeys(storageKey).forEach(function(key) {
                  try { localStorage.removeItem(key); } catch (error) {}
                });
              });
            }

            function findArchiveEntryByIdentity(report) {
              var match = null;
              archiveStorageKeys({ currentOnly: true }).some(function(storageKey) {
                var wanted = archiveEntryIdentity(storageKey, { report: report });
                if (!wanted) return false;
                var raw = null;
                try { raw = localStorage.getItem(storageKey); } catch (error) { return false; }
                if (!raw) return false;
                var entries = null;
                try { entries = JSON.parse(raw); } catch (error) { return false; }
                if (!Array.isArray(entries)) return false;
                return entries.some(function(entry, index) {
                  if (archiveEntryIdentity(storageKey, entry) !== wanted) return false;
                  match = { storageKey: storageKey, entry: entry, index: index };
                  return true;
                });
              });
              return match;
            }

            function prepareArchiveSaveTarget() {
              var report = currentArchiveReport();
              var existing = findArchiveEntryByIdentity(report);
              if (existing && existing.entry && existing.entry.id) {
                writeCurrentArchiveIdForKey(existing.storageKey, existing.entry.id);
                return true;
              }
              clearCurrentArchiveIdsForCurrentModule();
              return false;
            }

            function dedupeReportArchives() {
              if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
              var hadExistingIdentity = Boolean(window.__fsmobileArchiveSaveHadExistingIdentity);
              window.__fsmobileArchiveSaveHadExistingIdentity = false;
              var changed = archiveStorageKeys({ currentOnly: true }).some(function(key) {
                return dedupeArchiveEntriesForKey(key).changed;
              });
              if (changed && typeof window.renderArchiveList === "function") {
                try { window.renderArchiveList(); } catch (error) {}
              }
              setUnifiedActionStatus(changed || hadExistingIdentity ? "Vorhandener Archiv-Eintrag aktualisiert." : "Bericht im Archiv gespeichert.");
              return changed;
            }

            function isArchiveSaveButton(button) {
              if (!button || button.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) return false;
              var text = (button.textContent || "").replace(/\\s+/g, " ").trim();
              var haystack = (button.id || "") + " " + (button.className || "");
              return text === "Im Archiv speichern" || /archive-save|archiveSaveBtn|btn-archive-save/.test(haystack);
            }

            function isArchiveOpenButton(button) {
              if (!button || button.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) return false;
              var text = (button.textContent || "").replace(/\\s+/g, " ").trim();
              var haystack = (button.id || "") + " " + (button.className || "");
              return text === "Archiv" || /archive-open|archiveBtn|archive-btn/.test(haystack);
            }

            function scheduleArchiveDedupe() {
              window.clearTimeout(window.__fsmobileArchiveDedupeTimer);
              window.__fsmobileArchiveDedupeTimer = window.setTimeout(dedupeReportArchives, 80);
            }

            function installArchiveDedupe() {
              if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "") || document.__fsmobileArchiveDedupeInstalled) return;
              Object.defineProperty(document, "__fsmobileArchiveDedupeInstalled", { value: true });
              window.addEventListener("message", function(event) {
                var data = event.data || {};
                if (!data || data.type !== "fsmobile-archives-imported") return;
                refreshArchiveListDisplay(resolveArchiveStorageKey());
              });
              document.addEventListener("click", function(event) {
                var button = event.target && event.target.closest ? event.target.closest("button") : null;
                if (isArchiveSaveButton(button)) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  saveReportArchiveByIdentity();
                } else if (isArchiveOpenButton(button)) {
                  window.setTimeout(function() { refreshArchiveListDisplay(resolveArchiveStorageKey()); }, 0);
                }
              }, true);
              if (typeof window.saveCurrentReportToArchive === "function" && !window.saveCurrentReportToArchive.__fsmobileArchiveDedupeWrapped) {
                var originalSaveCurrentReportToArchive = window.saveCurrentReportToArchive;
                window.saveCurrentReportToArchive = function() {
                  if (saveReportArchiveByIdentity()) return;
                  return originalSaveCurrentReportToArchive.apply(this, arguments);
                };
                window.saveCurrentReportToArchive.__fsmobileArchiveDedupeWrapped = true;
              }
            }

	          function normalizedActionStatus(message) {
	            var text = String(message || "").replace(/\\s+/g, " ").trim();
	            if (!text) return "";
	            if (/konnte nicht.*archiv/i.test(text)) return "Prüfbericht konnte nicht im Archiv gespeichert werden.";
	            if (/vorhandener archiv-eintrag aktualisiert/i.test(text)) return "Vorhandener Archiv-Eintrag aktualisiert.";
	            if (/bericht im archiv gespeichert/i.test(text)) return "Bericht im Archiv gespeichert.";
	            if (/archiv.*gespeichert|gespeichert.*archiv/i.test(text)) return "Bericht im Archiv gespeichert.";
	            if (/aus dem archiv geöffnet/i.test(text)) return "Prüfbericht wurde aus dem Archiv geöffnet.";
	            if (/archiv.*geöffnet/i.test(text)) return "Archiv wurde geöffnet.";
	            if (/archiv.*gelöscht/i.test(text)) return "Archiv-Eintrag wurde gelöscht.";
	            if (/geleert|eingaben.*löschen/i.test(text)) return "Prüfbericht wurde geleert.";
	            if (/import.*nicht|exportdatei.*nicht|passt nicht/i.test(text)) return "Exportdatei konnte nicht importiert werden.";
	            if (/importiert|exportdatei.*geladen|daten.*geladen/i.test(text)) return "Exportdatei wurde importiert.";
	            if (/pdf export.*wird erstellt|pdf.*wird erstellt/i.test(text)) return "PDF Export wird erstellt...";
	            if (/pdf export.*nicht|pdf.*nicht|kombinierter.*nicht/i.test(text)) return "PDF Export konnte nicht erstellt werden.";
	            if (/pdf export.*erstellt|zip.*erstellt|pdf.*erstellt/i.test(text)) return "PDF Export wurde erstellt.";
	            return text;
	          }

	          function ensureActionStatusElement() {
	            var status = document.getElementById("archiveStatus") || document.querySelector(".archive-status");
	            if (!status) {
	              status = document.createElement("p");
	              status.id = "archiveStatus";
	              status.className = "archive-status";
	              status.setAttribute("role", "status");
	              status.setAttribute("aria-live", "polite");
	              var host = ensureHeaderActions();
	              if (host && host.parentNode) host.parentNode.insertBefore(status, host.nextSibling);
	              else document.body.insertBefore(status, document.body.firstChild);
	            }
	            return status;
	          }

	          function setUnifiedActionStatus(message) {
	            var normalized = normalizedActionStatus(message);
	            var status = ensureActionStatusElement();
	            status.textContent = normalized;
	            window.clearTimeout(window.__fsmobileActionStatusTimer);
	            if (normalized) {
	              window.__fsmobileActionStatusTimer = window.setTimeout(function() {
	                status.textContent = "";
	                try {
	                  window.parent.postMessage({ type: "fsmobile-action-status", moduleId: window.FSMOBILE_MODULE_ID, message: "" }, "*");
	                } catch (error) {}
	              }, 4000);
	            }
	            try {
	              window.parent.postMessage({ type: "fsmobile-action-status", moduleId: window.FSMOBILE_MODULE_ID, message: normalized }, "*");
	            } catch (error) {}
	          }

	          function installUnifiedActionStatus() {
	            if (window.__fsmobileUnifiedActionStatusInstalled) return;
	            window.__fsmobileUnifiedActionStatusInstalled = true;
	            window.FSMOBILE_SET_ACTION_STATUS = setUnifiedActionStatus;
	            var originalSetArchiveStatus = window.setArchiveStatus;
	            if (typeof originalSetArchiveStatus === "function") {
	              window.setArchiveStatus = function(message) {
	                setUnifiedActionStatus(message);
	              };
	            }
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
              if (match) return match[1] + "-" + match[2] + "-" + match[3];
              var german = raw.match(/^(\\d{1,2})\\.(\\d{1,2})\\.(\\d{4})$/);
              if (german) return german[3] + "-" + german[2].padStart(2, "0") + "-" + german[1].padStart(2, "0");
              if (raw) return raw;
              var now = new Date();
              var day = String(now.getDate()).padStart(2, "0");
              var month = String(now.getMonth() + 1).padStart(2, "0");
              return now.getFullYear() + "-" + month + "-" + day;
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
              return ensurePbFilePrefix(anlage + "_" + object + "_" + date + ".json");
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
              var collectors = ["buildStoragePayload", "collectReportData", "collectData", "getCurrentReport"];
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
                var context = item.canvas.getContext("2d", { willReadFrequently: true });
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
                var context = canvas.getContext("2d", { willReadFrequently: true });
                var image = new Image();
                image.onload = function() {
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.drawImage(image, 0, 0, canvas.width, canvas.height);
                  canvas.dispatchEvent(new Event("change", { bubbles: true }));
                };
                image.src = item.dataUrl;
              });
            }

	            function buildExportPayload() {
	              return {
	                kind: DATA_KIND,
	                version: 1,
	                moduleId: window.FSMOBILE_MODULE_ID,
                title: reportTitle(),
                exportedAt: new Date().toISOString(),
	                structured: collectStructuredData(),
	                fields: reportControls().map(serializeField),
	                canvases: serializeCanvases()
	              };
	            }

	            function jsonExportBlob(payload) {
	              return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
	            }

	            function downloadExportBlob(blob, fileName) {
	              var url = URL.createObjectURL(blob);
	              var link = document.createElement("a");
	              link.href = url;
	              link.download = fileName;
	              document.body.appendChild(link);
	              link.click();
	              link.remove();
	              setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
	            }

	            function reportExportBaseName() {
	              return exportFileName().replace(/\\.json$/i, "");
	            }

	            function crc32(bytes) {
	              var table = window.__fsmobileCrcTable;
	              if (!table) {
	                table = [];
	                for (var n = 0; n < 256; n += 1) {
	                  var c = n;
	                  for (var k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	                  table[n] = c >>> 0;
	                }
	                window.__fsmobileCrcTable = table;
	              }
	              var crc = 0xffffffff;
	              for (var index = 0; index < bytes.length; index += 1) {
	                crc = table[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
	              }
	              return (crc ^ 0xffffffff) >>> 0;
	            }

	            function zipDosTime(date) {
	              var hours = date.getHours();
	              var minutes = date.getMinutes();
	              var seconds = Math.floor(date.getSeconds() / 2);
	              return (hours << 11) | (minutes << 5) | seconds;
	            }

	            function zipDosDate(date) {
	              var year = Math.max(1980, date.getFullYear()) - 1980;
	              return (year << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
	            }

	            function push16(target, value) {
	              target.push(value & 0xff, (value >>> 8) & 0xff);
	            }

	            function push32(target, value) {
	              target.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
	            }

	            function bytesFromParts(parts) {
	              var length = parts.reduce(function(total, part) { return total + part.length; }, 0);
	              var output = new Uint8Array(length);
	              var offset = 0;
	              parts.forEach(function(part) {
	                output.set(part, offset);
	                offset += part.length;
	              });
	              return output;
	            }

	            async function createZipBlob(entries) {
	              var encoder = new TextEncoder();
	              var now = new Date();
	              var localParts = [];
	              var centralParts = [];
	              var offset = 0;

	              for (var entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
	                var entry = entries[entryIndex];
	                var nameBytes = encoder.encode(entry.name);
	                var dataBytes = new Uint8Array(await entry.blob.arrayBuffer());
	                var crc = crc32(dataBytes);
	                var local = [];
	                push32(local, 0x04034b50);
	                push16(local, 20);
	                push16(local, 0);
	                push16(local, 0);
	                push16(local, zipDosTime(now));
	                push16(local, zipDosDate(now));
	                push32(local, crc);
	                push32(local, dataBytes.length);
	                push32(local, dataBytes.length);
	                push16(local, nameBytes.length);
	                push16(local, 0);
	                var localBytes = bytesFromParts([new Uint8Array(local), nameBytes, dataBytes]);
	                localParts.push(localBytes);

	                var central = [];
	                push32(central, 0x02014b50);
	                push16(central, 20);
	                push16(central, 20);
	                push16(central, 0);
	                push16(central, 0);
	                push16(central, zipDosTime(now));
	                push16(central, zipDosDate(now));
	                push32(central, crc);
	                push32(central, dataBytes.length);
	                push32(central, dataBytes.length);
	                push16(central, nameBytes.length);
	                push16(central, 0);
	                push16(central, 0);
	                push16(central, 0);
	                push16(central, 0);
	                push32(central, 0);
	                push32(central, offset);
	                centralParts.push(bytesFromParts([new Uint8Array(central), nameBytes]));
	                offset += localBytes.length;
	              }

	              var centralSize = centralParts.reduce(function(total, part) { return total + part.length; }, 0);
	              var end = [];
	              push32(end, 0x06054b50);
	              push16(end, 0);
	              push16(end, 0);
	              push16(end, entries.length);
	              push16(end, entries.length);
	              push32(end, centralSize);
	              push32(end, offset);
	              push16(end, 0);

	              return new Blob(localParts.concat(centralParts, [new Uint8Array(end)]), { type: "application/zip" });
	            }

	            async function downloadCombinedExport(pdfBlob, pdfName) {
	              var payload = buildExportPayload();
	              var jsonName = exportFileName();
	              var finalPdfName = ensurePbFilePrefix((window.FSMOBILE_PDF_FILE_NAME ? window.FSMOBILE_PDF_FILE_NAME(pdfName) : pdfName) || reportExportBaseName() + ".pdf");
		              var zipBlob = await createZipBlob([
		                { name: jsonName, blob: jsonExportBlob(payload) },
		                { name: finalPdfName, blob: pdfBlob }
		              ]);
		              downloadExportBlob(zipBlob, ensurePbFilePrefix(reportExportBaseName() + ".zip"));
		              setUnifiedActionStatus("PDF Export wurde erstellt.");
		            }

		            function downloadExport() {
		              var payload = buildExportPayload();
		              var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
		              downloadExportBlob(blob, exportFileName());
		              setUnifiedActionStatus("Exportdatei wurde erstellt.");
			            }
		            window.FSMOBILE_DOWNLOAD_REPORT_EXPORT = downloadExport;
		            window.FSMOBILE_CREATE_REPORT_EXPORT_ZIP = downloadCombinedExport;

	            function isPdfExportButton(button) {
	              if (!button || button.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) return false;
	              var text = (button.textContent || "").replace(/\s+/g, " ").trim();
	              var haystack = (button.id || "") + " " + (button.className || "");
	              return text === "PDF" || text === "PDF Export" || text.indexOf("PDF wird erstellt") === 0 || text.indexOf("PDF Export wird erstellt") === 0 || /pdf-btn|pdfButton|pdfBtn/.test(haystack);
	            }

	            function installPdfExportHook() {
	              if (document.__fsmobilePdfExportHookInstalled) return;
	              Object.defineProperty(document, "__fsmobilePdfExportHookInstalled", { value: true });
		              document.addEventListener("click", function(event) {
		                var button = event.target && event.target.closest ? event.target.closest("button") : null;
		                if (!isPdfExportButton(button) || button.disabled) return;
		                setUnifiedActionStatus("PDF Export wird erstellt...");
			                window.FSMOBILE_COMBINED_PDF_EXPORT = { startedAt: Date.now() };
		                window.setTimeout(function() {
		                  if (window.FSMOBILE_COMBINED_PDF_EXPORT && Date.now() - window.FSMOBILE_COMBINED_PDF_EXPORT.startedAt > 30000) {
		                    window.FSMOBILE_COMBINED_PDF_EXPORT = null;
		                  }
		                }, 31000);
		              }, true);
		            }

            async function importExportFile(file) {
              if (!file) return;
              var payload;
              try {
                payload = JSON.parse(await file.text());
	              } catch (error) {
	                setUnifiedActionStatus("Exportdatei konnte nicht importiert werden.");
	                alert("Exportdatei konnte nicht gelesen werden.");
	                return;
	              }
	              if (!payload || payload.kind !== DATA_KIND || payload.moduleId !== window.FSMOBILE_MODULE_ID || !Array.isArray(payload.fields)) {
	                setUnifiedActionStatus("Exportdatei konnte nicht importiert werden.");
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
	              setUnifiedActionStatus("Exportdatei wurde importiert.");
	            }

            function installControls() {
              var host = ensureHeaderActions();
              if (!host) {
                host = document.createElement("div");
                host.className = "button-area fsmobile-report-transfer";
                document.body.insertBefore(host, document.body.firstChild);
              }

	              installPdfExportHook();

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

	              var wrapper = document.createElement("span");
	              wrapper.className = "fsmobile-report-transfer";
	              wrapper.append(importButton, fileInput);
	              host.append(wrapper);
	              arrangeHeaderActions();
	            }

            installControls();
          }
			          document.addEventListener("DOMContentLoaded", function() {
			            markPositionCells();
			            normalizePortraitAssignmentSections();
			            ensureLandscapeReportRemarkField();
			            installRwaChoicePillTapFix();
			            ensureGeneratedTechnikerSignatureField();
		            normalizeSignatureLabels();
		            refreshSignatureCanvasesForReadyLayout();
		            installUnifiedActionStatus();
		            installArchiveDedupe();
		            installPdfFileNamePatch();
		            installJsPdfLoaderPatch();
	            setupReportDataTransfer();
            ensureRwaClearButton();
            arrangeHeaderActions();
            var arrangeTimer = 0;
	            function refreshReportEnhancements() {
	                normalizePortraitAssignmentSections();
		                ensureLandscapeReportRemarkField();
		                installRwaChoicePillTapFix();
	                markPositionCells();
	                ensureGeneratedTechnikerSignatureField();
	                normalizeSignatureLabels();
	                refreshSignatureCanvasesForReadyLayout();
	                installJsPdfLoaderPatch();
	            }
            function runReportEnhancementRefresh() {
              refreshReportEnhancements();
              arrangeHeaderActions();
            }
            function scheduleReportEnhancementRefresh(delay) {
              window.setTimeout(runReportEnhancementRefresh, delay);
            }
	            [0, 80, 220, 500, 900, 1400, 2200].forEach(scheduleReportEnhancementRefresh);
	            [0, 120, 320, 700, 1200, 2000].forEach(scheduleSignatureCanvasReadyRefresh);
            window.addEventListener("resize", function() {
              window.clearTimeout(arrangeTimer);
              arrangeTimer = window.setTimeout(runReportEnhancementRefresh, 80);
            });
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

        body:not(.generating-pdf) .header-row .field input[type="date"],
        body:not(.generating-pdf) .info-grid .field input[type="date"],
        body:not(.generating-pdf) .info-grid .field-group input[type="date"] {
          box-sizing: border-box !important;
          height: 44px !important;
          min-height: 44px !important;
          max-height: 44px !important;
          padding-block: 0 !important;
          line-height: 44px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }

        body:not(.generating-pdf) .header-row .field input[type="date"]::-webkit-date-and-time-value,
        body:not(.generating-pdf) .info-grid .field input[type="date"]::-webkit-date-and-time-value,
        body:not(.generating-pdf) .info-grid .field-group input[type="date"]::-webkit-date-and-time-value {
          min-height: 44px !important;
          line-height: 44px !important;
          text-align: inherit !important;
        }

        body:not(.generating-pdf) .header-row .field input[type="date"]::-webkit-calendar-picker-indicator,
        body:not(.generating-pdf) .info-grid .field input[type="date"]::-webkit-calendar-picker-indicator,
        body:not(.generating-pdf) .info-grid .field-group input[type="date"]::-webkit-calendar-picker-indicator {
          margin: 0 !important;
          padding: 0 !important;
        }

        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(150px, 1fr)) !important;
          gap: 12px !important;
          width: 100% !important;
          margin: 0 0 18px !important;
          padding: 0 !important;
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }

        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment .field {
          min-width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment label {
          min-height: 18px !important;
          margin-bottom: 7px !important;
          line-height: 1.25 !important;
        }

        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment input:not([type="checkbox"]):not([type="radio"]),
        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment select {
          box-sizing: border-box !important;
          width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;
          padding: 0 14px !important;
          line-height: 48px !important;
          display: block !important;
          align-self: stretch !important;
          background: rgba(255,255,255,.08) !important;
          border: 1px solid rgba(255,255,255,.34) !important;
          border-radius: 14px !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }

        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment input[type="date"]::-webkit-date-and-time-value {
          min-height: 48px !important;
          line-height: 48px !important;
          text-align: inherit !important;
        }

        body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment input[type="date"]::-webkit-calendar-picker-indicator {
          margin: 0 !important;
          padding: 0 !important;
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

	        .fsmobile-report-remark-block {
	          margin-top: 18px !important;
	          padding: 14px !important;
	          background:
	            linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.035) 58%, rgba(235,0,69,.025)),
	            rgba(255,255,255,.045) !important;
	          border: 1px solid rgba(255,255,255,.38) !important;
	          border-radius: 14px !important;
	          box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 10px 26px rgba(0,0,0,.045) !important;
	          -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
	          backdrop-filter: blur(18px) saturate(1.08) !important;
	        }

	        .fsmobile-report-remark-block label {
	          display: block !important;
	          margin: 0 0 10px !important;
	          color: #1c1c1e !important;
	          font-size: 18px !important;
		          font-weight: 400 !important;
	          line-height: 1.2 !important;
	        }

	        .fsmobile-report-remark-block textarea {
	          display: block !important;
	          width: 100% !important;
	          min-height: 88px !important;
	          resize: none !important;
	          overflow: hidden !important;
	          line-height: 1.35 !important;
	          border: 1px solid rgba(255,255,255,.34) !important;
	          border-radius: 12px !important;
	          background:
	            linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)),
	            rgba(255,255,255,.018) !important;
	          box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
	          -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
	          backdrop-filter: blur(18px) saturate(1.08) !important;
	        }

	        .fsmobile-generated-signature-block {
	          margin-top: 16px !important;
          padding: 14px !important;
          background:
            linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.035) 58%, rgba(235,0,69,.025)),
            rgba(255,255,255,.045) !important;
          border: 1px solid rgba(255,255,255,.38) !important;
          border-radius: 14px !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 10px 26px rgba(0,0,0,.045) !important;
          -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
          backdrop-filter: blur(18px) saturate(1.08) !important;
        }

        .fsmobile-generated-signature-block h3 {
          margin: 0 0 10px !important;
          font-size: 18px !important;
        }

        #fsmobileTechnikerSignaturePad {
          display: block !important;
          width: 100% !important;
          height: 180px !important;
          border: 2px dashed rgba(255,255,255,.44) !important;
          border-radius: 12px !important;
          background:
            linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)),
            rgba(255,255,255,.018) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 0 0 1px rgba(235,0,69,.025) !important;
          -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
          backdrop-filter: blur(18px) saturate(1.08) !important;
          touch-action: none !important;
        }

        .fsmobile-generated-signature-block .signature-actions {
          margin-top: 16px !important;
        }

        body.fsmobile-parent-actions-active .fsmobile-header-actions,
        body.fsmobile-parent-actions-active .fsmobile-parent-action-source,
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

          body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment {
            grid-template-columns: 1fr !important;
          }
        }
      

    /* Hochformat-Transparenz: Unterschrift und lokale Formularflächen */
    .input-unit,
    .archive-item,
    .row-number,
    .cell-number,
    .hydrant-number,
    .card,
    .check-item,
    .result-item,
    .dynamic-row,
    .strand-row,
    .cell-row,
    .signature-block,
    .signature-wrap {
      border: 1px solid rgba(255,255,255,.42) !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.06) 58%, rgba(235,0,69,.035)),
        rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 26px rgba(0,0,0,.05) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    #signaturePad,
    .signature-wrap canvas,
    canvas.signature-pad {
      border: 2px dashed rgba(255,255,255,.5) !important;
      background: rgba(255,255,255,.018) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 0 0 1px rgba(235,0,69,.035) !important;
    }

    .input-unit input,
    .input-unit select,
    .card input,
    .card textarea,
    .card select,
    .signature-block input,
    .signature-block textarea,
    .signature-block select,
    .signature-wrap input,
    .signature-wrap textarea,
    .signature-wrap select {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
    }

    .signature-actions {
      background: transparent !important;
      border-color: rgba(255,255,255,.28) !important;
      box-shadow: none !important;
    }

    .title-actions,
    .button-area,
    .toolbar {
      background: rgba(255,255,255,.08) !important;
      border-color: rgba(255,255,255,.34) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 8px 24px rgba(0,0,0,.045) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    .row-number,
    .cell-number,
    .hydrant-number {
      background: rgba(255,255,255,.018) !important;
      border: 1px solid rgba(255,255,255,.34) !important;
    }

    body:not(.generating-pdf).fsmobile-portrait-report select {
      min-height: 44px !important;
      height: 44px !important;
      padding: 10px 12px !important;
      line-height: 1.25 !important;
      border-radius: 14px !important;
      background-clip: padding-box !important;
      display: block !important;
      align-self: stretch !important;
    }

    body:not(.generating-pdf).fsmobile-portrait-report input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report textarea,
    body:not(.generating-pdf).fsmobile-portrait-report select {
      border-radius: 14px !important;
      background-clip: padding-box !important;
    }

    body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment select {
      height: 48px !important;
      min-height: 48px !important;
      max-height: 48px !important;
      padding: 0 14px !important;
      line-height: 48px !important;
      border-radius: 14px !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report form {
      gap: 18px !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .card {
      background:
        linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.04) 58%, rgba(235,0,69,.025)),
        rgba(255,255,255,.02) !important;
      border-color: rgba(255,255,255,.38) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 10px 24px rgba(0,0,0,.04) !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .card > .sub-card,
    body:not(.generating-pdf).fsmobile-rwa-report .sub-card .sub-card {
      margin-top: 16px !important;
      padding: 14px 0 0 !important;
      border: 0 !important;
      border-top: 1px solid rgba(255,255,255,.3) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .card > .sub-card:first-child {
      margin-top: 0 !important;
      padding-top: 0 !important;
      border-top: 0 !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .sub-title {
      margin: 0 0 10px !important;
      color: rgba(23,32,51,.86) !important;
      font-size: 15px !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .dynamic-list {
      gap: 10px !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .dynamic-row,
    body:not(.generating-pdf).fsmobile-rwa-report .suela-abstroem-row {
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .dynamic-row + .dynamic-row {
      padding-top: 12px !important;
      border-top: 1px solid rgba(255,255,255,.24) !important;
    }

    body:not(.generating-pdf).fsmobile-rwa-report .dynamic-actions {
      margin-top: 10px !important;
    }

	    body:not(.generating-pdf).fsmobile-rwa-report .choice-row {
	      margin-bottom: 4px !important;
	    }

	    body:not(.generating-pdf).fsmobile-rwa-report .pill-check {
	      pointer-events: auto !important;
	      min-height: 44px !important;
	      touch-action: manipulation !important;
	    }

	    body:not(.generating-pdf).fsmobile-rwa-report .pill-check input[type="checkbox"] {
	      position: relative !important;
	      z-index: 2 !important;
	      pointer-events: auto !important;
	      touch-action: manipulation !important;
	      cursor: pointer !important;
	    }

	    body:not(.generating-pdf).fsmobile-rwa-report .yesno {
	      border-color: rgba(255,255,255,.28) !important;
	    }

    body:not(.generating-pdf).fsmobile-rwa-report input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-rwa-report textarea,
    body:not(.generating-pdf).fsmobile-rwa-report select {
      border-radius: 14px !important;
      background-clip: padding-box !important;
    }

    body:not(.generating-pdf).fsmobile-portrait-report .field input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .field select,
    body:not(.generating-pdf).fsmobile-portrait-report .field textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .card input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .card select,
    body:not(.generating-pdf).fsmobile-portrait-report .card textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .sub-card input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .sub-card select,
    body:not(.generating-pdf).fsmobile-portrait-report .sub-card textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .dynamic-row input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .dynamic-row select,
    body:not(.generating-pdf).fsmobile-portrait-report .dynamic-row textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .suela-abstroem-row input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .suela-abstroem-row select,
    body:not(.generating-pdf).fsmobile-portrait-report .suela-abstroem-row textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .strand-row input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .strand-row select,
    body:not(.generating-pdf).fsmobile-portrait-report .strand-row textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .cell-row input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .cell-row select,
    body:not(.generating-pdf).fsmobile-portrait-report .cell-row textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .hydrant-card input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .hydrant-card select,
    body:not(.generating-pdf).fsmobile-portrait-report .hydrant-card textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .whd-card input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .whd-card select,
    body:not(.generating-pdf).fsmobile-portrait-report .whd-card textarea,
    body:not(.generating-pdf).fsmobile-portrait-report .input-unit,
    body:not(.generating-pdf).fsmobile-portrait-report .input-unit input:not([type="checkbox"]):not([type="radio"]),
    body:not(.generating-pdf).fsmobile-portrait-report .input-unit select,
    body:not(.generating-pdf).fsmobile-portrait-report .input-unit textarea {
      border-radius: 14px !important;
      background-clip: padding-box !important;
    }

    /* Einheitliche Archiv-Ansicht in allen Prüfberichten */
    body:not(.generating-pdf) .archive-overlay[hidden] {
      display: none !important;
    }

    body:not(.generating-pdf) .archive-overlay {
      position: fixed !important;
      inset: 0 !important;
      z-index: 9999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding:
        max(18px, env(safe-area-inset-top))
        max(18px, env(safe-area-inset-right))
        max(18px, env(safe-area-inset-bottom))
        max(18px, env(safe-area-inset-left)) !important;
      background: rgba(15, 23, 42, .34) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    body:not(.generating-pdf) .archive-dialog {
      box-sizing: border-box !important;
      width: min(760px, calc(100vw - 36px)) !important;
      max-width: min(760px, calc(100vw - 36px)) !important;
      max-height: min(680px, calc(100vh - 36px)) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      color: #172033 !important;
      border: 1px solid rgba(255,255,255,.48) !important;
      border-radius: 24px !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.24), rgba(255,255,255,.10) 58%, rgba(122,162,211,.10)),
        rgba(238,244,252,.18) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.42),
        inset 0 -1px 0 rgba(255,255,255,.10),
        0 26px 72px rgba(2,8,23,.24) !important;
      -webkit-backdrop-filter: blur(26px) saturate(1.12) !important;
      backdrop-filter: blur(26px) saturate(1.12) !important;
    }

    body:not(.generating-pdf) .archive-header {
      flex: 0 0 auto !important;
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 14px !important;
      min-height: 68px !important;
      margin: 0 !important;
      padding: 18px 20px 14px !important;
      border: 0 !important;
      border-bottom: 1px solid rgba(255,255,255,.34) !important;
      background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.03)) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.24) !important;
    }

    body:not(.generating-pdf) .archive-header h2,
    body:not(.generating-pdf) #archiveTitle {
      margin: 0 !important;
      color: rgba(17,24,39,.92) !important;
      font-size: 24px !important;
      line-height: 1.12 !important;
      font-weight: 850 !important;
      letter-spacing: 0 !important;
      text-shadow: 0 1px 0 rgba(255,255,255,.42) !important;
    }

    body:not(.generating-pdf) .archive-header button,
    body:not(.generating-pdf) .archive-close-btn {
      flex: 0 0 auto !important;
      width: auto !important;
      min-width: 44px !important;
      min-height: 44px !important;
      padding: 10px 16px !important;
      border: 1px solid rgba(255,255,255,.42) !important;
      border-radius: 999px !important;
      color: rgba(17,24,39,.78) !important;
      background:
        linear-gradient(180deg, rgba(255,255,255,.30), rgba(255,255,255,.12)),
        rgba(255,255,255,.14) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.42),
        0 8px 18px rgba(2,8,23,.08) !important;
      -webkit-backdrop-filter: blur(16px) saturate(1.08) !important;
      backdrop-filter: blur(16px) saturate(1.08) !important;
    }

    body:not(.generating-pdf) .archive-list {
      flex: 1 1 auto !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 14px !important;
      overflow: auto !important;
      -webkit-overflow-scrolling: touch !important;
      background: transparent !important;
    }

    body:not(.generating-pdf) .archive-empty {
      margin: 0 !important;
      padding: 28px 14px !important;
      text-align: center !important;
      color: rgba(17,24,39,.62) !important;
      font-size: 14px !important;
      line-height: 1.35 !important;
      font-weight: 760 !important;
      border: 1px solid rgba(255,255,255,.36) !important;
      border-radius: 16px !important;
      background: rgba(255,255,255,.08) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.22) !important;
    }

    body:not(.generating-pdf) .archive-item {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) auto auto !important;
      gap: 10px !important;
      align-items: center !important;
      min-height: 72px !important;
      margin: 0 !important;
      padding: 12px !important;
      color: #172033 !important;
      border: 1px solid rgba(255,255,255,.40) !important;
      border-radius: 16px !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.055) 58%, rgba(235,0,69,.028)),
        rgba(255,255,255,.06) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.30),
        0 10px 24px rgba(2,8,23,.06) !important;
      -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
      backdrop-filter: blur(18px) saturate(1.08) !important;
    }

    body:not(.generating-pdf) .archive-title {
      min-width: 0 !important;
      color: rgba(17,24,39,.9) !important;
      font-size: 15px !important;
      line-height: 1.25 !important;
      font-weight: 850 !important;
      letter-spacing: 0 !important;
      overflow-wrap: anywhere !important;
    }

    body:not(.generating-pdf) .archive-meta {
      margin-top: 4px !important;
      color: rgba(17,24,39,.58) !important;
      font-size: 12px !important;
      line-height: 1.25 !important;
      font-weight: 720 !important;
      letter-spacing: 0 !important;
    }

    body:not(.generating-pdf) .archive-item button {
      width: auto !important;
      min-width: 86px !important;
      min-height: 42px !important;
      padding: 10px 14px !important;
      border: 0 !important;
      border-radius: 999px !important;
      font-size: 14px !important;
      line-height: 1.1 !important;
      font-weight: 850 !important;
      white-space: nowrap !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.32),
        0 10px 20px rgba(2,8,23,.10) !important;
    }

    body:not(.generating-pdf) .archive-item button:not(.danger),
    body:not(.generating-pdf) .archive-open-btn,
    body:not(.generating-pdf) .archive-open-button,
    body:not(.generating-pdf) button.archive-open {
      color: #fff !important;
      background: linear-gradient(180deg, #2f93ff 0%, #0a84ff 100%) !important;
    }

    body:not(.generating-pdf) .archive-item button.danger,
    body:not(.generating-pdf) .archive-delete-btn,
    body:not(.generating-pdf) .archive-delete-button {
      color: #fff !important;
      background: linear-gradient(180deg, #ff4f45 0%, #ff3b30 100%) !important;
    }

    body:not(.generating-pdf) .archive-status {
      min-height: 20px !important;
      margin: 10px 0 0 !important;
      color: rgba(17,24,39,.62) !important;
      font-size: 13px !important;
      line-height: 1.35 !important;
      font-weight: 740 !important;
    }

    @media (max-width: 760px) {
      body:not(.generating-pdf) .archive-dialog {
        width: calc(100vw - 28px) !important;
        max-width: calc(100vw - 28px) !important;
        max-height: calc(100vh - 28px) !important;
        border-radius: 22px !important;
      }

      body:not(.generating-pdf) .archive-header {
        flex-direction: row !important;
        align-items: center !important;
        padding: 16px !important;
      }

      body:not(.generating-pdf) .archive-item {
        grid-template-columns: 1fr !important;
      }

      body:not(.generating-pdf) .archive-item button {
        width: 100% !important;
      }
    }
</style>
    `;

    const patchedHtml = /^pb-/.test(id || "")
      ? html
        .replace(/(\b[\w$]+\.save\()([^\n;]+)(\);)/g, "$1(window.FSMOBILE_PDF_FILE_NAME ? window.FSMOBILE_PDF_FILE_NAME($2) : $2)$3")
        .replace(/(\blink\.download\s*=\s*)([^;\n]+)(;)/g, "$1(window.FSMOBILE_PDF_FILE_NAME ? window.FSMOBILE_PDF_FILE_NAME($2) : $2)$3")
      : html;

    if (/<\/head>/i.test(patchedHtml)) {
      return patchedHtml.replace(/<\/head>/i, `${bridge}</head>`);
    }
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
  if (menuOptionsButton) menuOptionsButton.addEventListener("click", openOptionsDialog);
  if (optionsCloseButton) optionsCloseButton.addEventListener("click", closeOptionsDialog);
  if (optionsOverlay) {
    optionsOverlay.addEventListener("click", event => {
      if (event.target === optionsOverlay) closeOptionsDialog();
    });
  }
  if (archiveBackupExportButton) archiveBackupExportButton.addEventListener("click", exportAllArchiveData);
  if (archiveBackupImportButton && archiveBackupFile) {
    archiveBackupImportButton.addEventListener("click", () => archiveBackupFile.click());
    archiveBackupFile.addEventListener("change", () => importArchiveBackupFile(archiveBackupFile.files && archiveBackupFile.files[0]));
  }
  if (archiveDeleteButton) archiveDeleteButton.addEventListener("click", showArchiveDeleteConfirm);
  if (archiveDeleteCancelButton) archiveDeleteCancelButton.addEventListener("click", () => {
    hideArchiveDeleteConfirm();
    setOptionsStatus("");
    archiveDeleteButton && archiveDeleteButton.focus();
  });
  if (archiveDeleteConfirmButton) archiveDeleteConfirmButton.addEventListener("click", deleteAllArchiveData);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && archiveDeleteConfirm && !archiveDeleteConfirm.hidden) {
      hideArchiveDeleteConfirm();
      archiveDeleteButton && archiveDeleteButton.focus();
      return;
    }
    if (event.key === "Escape" && optionsOverlay && !optionsOverlay.hidden) closeOptionsDialog();
  });
  frame.addEventListener("load", () => {
    window.clearTimeout(actionSyncTimer);
    actionSyncTimer = window.setTimeout(syncModuleActionBar, 120);
  });
  window.addEventListener("popstate", () => handleRoute(true));

  if ("serviceWorker" in navigator && window.self === window.top) {
    let serviceWorkerReloading = false;
    let updateRegistration = null;
    let pendingServiceWorker = null;
    let updateCheckTimer = 0;

    function resetUpdateButton() {
      if (!updateButton) return;
      updateButton.disabled = false;
      updateButton.textContent = "Aktualisieren";
    }

    function showUpdatePrompt(worker) {
      if (!updateToast || !updateButton || !navigator.serviceWorker.controller) return;
      pendingServiceWorker = worker || (updateRegistration && updateRegistration.waiting);
      if (!pendingServiceWorker) return;
      resetUpdateButton();
      updateToast.hidden = false;
    }

    function hideUpdatePrompt() {
      if (updateToast) updateToast.hidden = true;
    }

    function trackInstallingWorker(worker) {
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed") {
          if (navigator.serviceWorker.controller) showUpdatePrompt(worker);
          return;
        }
        if (worker.state === "redundant" && pendingServiceWorker === worker) {
          pendingServiceWorker = null;
          resetUpdateButton();
        }
      });
    }

    function checkForServiceWorkerUpdate() {
      if (!updateRegistration || document.visibilityState === "hidden") return;
      window.clearTimeout(updateCheckTimer);
      updateCheckTimer = window.setTimeout(() => {
        updateRegistration.update()
          .then(() => {
            if (updateRegistration.waiting) showUpdatePrompt(updateRegistration.waiting);
          })
          .catch(() => undefined);
      }, 250);
    }

    if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === "done") {
      sessionStorage.removeItem(UPDATE_RELOAD_KEY);
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (serviceWorkerReloading) return;
      serviceWorkerReloading = true;
      hideUpdatePrompt();
      sessionStorage.setItem(UPDATE_RELOAD_KEY, "done");
      window.location.reload();
    });

    if (updateButton) {
      updateButton.addEventListener("click", () => {
        const worker = pendingServiceWorker || (updateRegistration && updateRegistration.waiting);
        if (!worker) {
          hideUpdatePrompt();
          return;
        }
        updateButton.disabled = true;
        updateButton.textContent = "Aktualisiere...";
        sessionStorage.setItem(UPDATE_RELOAD_KEY, "pending");
        worker.postMessage({ type: "SKIP_WAITING" });
        window.setTimeout(() => {
          if (!serviceWorkerReloading) window.location.reload();
        }, 6500);
      });
    }

    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })
      .then(registration => {
        updateRegistration = registration;
        if (registration.waiting) showUpdatePrompt(registration.waiting);
        trackInstallingWorker(registration.installing);

        registration.addEventListener("updatefound", () => {
          trackInstallingWorker(registration.installing);
        });

        checkForServiceWorkerUpdate();
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") checkForServiceWorkerUpdate();
        });
        window.addEventListener("focus", checkForServiceWorkerUpdate);
        window.addEventListener("online", checkForServiceWorkerUpdate);
      })
      .catch(() => undefined);
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
    updateMenuOptionsVisibility();
    handleRoute(true);
  }

  function lockApp() {
    isUnlocked = false;
    frame.srcdoc = "";
    menuView.hidden = false;
    moduleView.hidden = true;
    backButton.hidden = true;
    updateMenuOptionsVisibility();
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
