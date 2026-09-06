(function () {
  "use strict";

  const registry = window.FSMOBILE_MODULES || {};
  const moduleGrid = document.getElementById("moduleGrid");
  const menuSearchShell = document.getElementById("menuSearchShell");
  const menuSearchInput = document.getElementById("menuSearchInput");
  const menuSearchClear = document.getElementById("menuSearchClear");
  const menuSearchResult = document.getElementById("menuSearchResult");
  const moduleView = document.getElementById("moduleView");
  const menuView = document.getElementById("menuView");
  const frame = document.getElementById("moduleFrame");
  const backButton = document.getElementById("backButton");
  const quickSwitchButton = document.getElementById("quickSwitchButton");
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
  const appToast = document.getElementById("appToast");
  const appToastText = document.getElementById("appToastText");
  const appConnectionStatus = document.getElementById("appConnectionStatus");
  const appConnectionStatusText = document.getElementById("appConnectionStatusText");
  const updateToast = document.getElementById("updateToast");
  const updateButton = document.getElementById("updateButton");
  const updateTitle = updateToast ? updateToast.querySelector(".update-title") : null;
  const updateText = updateToast ? updateToast.querySelector(".update-text") : null;
  const menuOptionsButton = document.getElementById("menuOptionsButton");
  const optionsOverlay = document.getElementById("optionsOverlay");
  const optionsCloseButton = document.getElementById("optionsCloseButton");
  const optionsOfflineReady = document.getElementById("optionsOfflineReady");
  const optionsCacheVersion = document.getElementById("optionsCacheVersion");
  const optionsCacheUsage = document.getElementById("optionsCacheUsage");
  const optionsLocalDataUsage = document.getElementById("optionsLocalDataUsage");
  const optionsImageStorageUsage = document.getElementById("optionsImageStorageUsage");
  const optionsStorageReserve = document.getElementById("optionsStorageReserve");
  const optionsLastBackup = document.getElementById("optionsLastBackup");
  const archiveBackupExportButton = document.getElementById("archiveBackupExportButton");
  const archiveBackupImportButton = document.getElementById("archiveBackupImportButton");
  const archiveDeleteButton = document.getElementById("archiveDeleteButton");
  const archiveDeleteConfirm = document.getElementById("archiveDeleteConfirm");
  const archiveDeleteCancelButton = document.getElementById("archiveDeleteCancelButton");
  const archiveDeleteConfirmButton = document.getElementById("archiveDeleteConfirmButton");
  const archiveBackupFile = document.getElementById("archiveBackupFile");
  const archiveBackupStatus = document.getElementById("archiveBackupStatus");
  const archiveBackupSummary = document.getElementById("archiveBackupSummary");
  const archiveBackupSummaryTitle = document.getElementById("archiveBackupSummaryTitle");
  const archiveBackupSummaryText = document.getElementById("archiveBackupSummaryText");
  const archiveBackupSummaryList = document.getElementById("archiveBackupSummaryList");
  const archiveBackupSummaryNote = document.getElementById("archiveBackupSummaryNote");
  const archiveBackupImportActions = document.getElementById("archiveBackupImportActions");
  const archiveBackupImportCancelButton = document.getElementById("archiveBackupImportCancelButton");
  const archiveBackupImportConfirmButton = document.getElementById("archiveBackupImportConfirmButton");
  const OLD_PASS_HASH_KEY = "fsmobile-unified-passhash-v1";
  const AUTH_UNLOCK_KEY = "fsmobile-auth-unlocked-v2";
  const AUTH_UNLOCK_VALUE = "confirmed";
  const UPDATE_RELOAD_KEY = "fsmobile-update-reload-v1";
  const LAST_BACKUP_KEY = "fsmobile-last-backup-created-at-v1";
  const REQUIRED_PASS_HASH = "745731644d9e569b873095e3a2a5a3fae47202b83d2d5879397ea14415edee95";
  let isUnlocked = false;
  let activeModuleId = null;
  let previousModuleId = null;
  let quickSwitchTransitionPending = false;
  let moduleOpenRequest = 0;
  let actionSyncTimer = 0;
  let actionStatusTimer = 0;
  let appToastTimer = 0;
  let appConnectionStatusTimer = 0;
  let brandTransitionTimer = 0;
  let titleStartAnimationPending = document.body.classList.contains("app-start-pending");
  let titleStartAnimationTimer = 0;
  let optionsCloseTimer = 0;
  let viewTransitionTimers = [];
  let menuCarouselCleanup = null;
  let favoritesSortMode = false;
  let menuSearchQuery = "";
  let pendingBackupImportPayload = null;
  let pendingBackupImportSummary = null;
  const signatureClearUntilByModule = new Map();
  const moduleDefinitionLoads = new Map();
  const FAVORITES_SECTION_ID = "favoriten";
  const FAVORITES_STORAGE_KEY = "fsmobile-menu-favorites-v1";
  const MENU_SECTION_GLYPHS = {
    favoriten: "★",
    kalkulation: "∑",
    pruefberichte: "✓",
    wartungsanleitungen: "▤",
    maengelbeschreibungen: "!"
  };
  const expandedMenuSections = new Set();

  const MENU_SECTIONS = [
    {
      id: "kalkulation",
      title: "Kalkulation",
      accent: "accent-orange",
      modules: [
        "auftrag-bescheinigungen",
        "planungshilfe-bma",
        "maengelliste",
        "maengelliste-bilddoku",
        "maengelliste-maengelbeschreibungen",
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
        "pb-fluchttuer-steuerungen",
        "pb-druckerhoehungsanlage",
        "pb-nass-trocken-station",
        "pb-druckpruefung-din-14462",
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
    "auftrag-bescheinigungen": "Auftrag Bescheinigungen",
    "planungshilfe-bma": "Planungshilfe BMA",
    "maengelliste-maengelbeschreibungen": "Mängelliste-MB",
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
    "pb-fluchttuer-steuerungen": "Fluchttür-Steuerungen",
    "pb-druckerhoehungsanlage": "Druckerhöhungsanlagen",
    "pb-nass-trocken-station": "Nass/Trocken-Station",
    "pb-druckpruefung-din-14462": "Druckprüfung DIN 14462",
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

  function normalizeFavoriteIds(value) {
    const source = Array.isArray(value) ? value : [];
    const seen = new Set();
    const result = [];
    source.forEach(id => {
      const moduleId = String(id || "").trim();
      if (!moduleId || seen.has(moduleId) || !registry[moduleId]) return;
      seen.add(moduleId);
      result.push(moduleId);
    });
    return result;
  }

  function loadFavoriteIds() {
    let parsed = [];
    try {
      parsed = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
    } catch {
      parsed = [];
    }
    const normalized = normalizeFavoriteIds(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) saveFavoriteIds(normalized);
    return normalized;
  }

  function saveFavoriteIds(ids) {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalizeFavoriteIds(ids)));
      return true;
    } catch {
      return false;
    }
  }

  function setFavorite(moduleId, enabled) {
    const ids = loadFavoriteIds();
    const exists = ids.includes(moduleId);
    if (enabled && !exists) ids.push(moduleId);
    if (!enabled && exists) ids.splice(ids.indexOf(moduleId), 1);
    saveFavoriteIds(ids);
    expandedMenuSections.add(FAVORITES_SECTION_ID);
    renderMenu();
  }

  function moveFavorite(moduleId, direction) {
    const ids = loadFavoriteIds();
    const index = ids.indexOf(moduleId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return;
    const next = ids[nextIndex];
    ids[nextIndex] = moduleId;
    ids[index] = next;
    saveFavoriteIds(ids);
    expandedMenuSections.add(FAVORITES_SECTION_ID);
    renderMenu();
  }

  function normalizeMenuSearchText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/²/g, "2")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function moduleMatchesSearch(moduleId, sectionId, query) {
    const normalizedQuery = normalizeMenuSearchText(query);
    if (!normalizedQuery) return true;
    const module = registry[moduleId];
    if (!module) return false;
    const section = sectionId
      ? MENU_SECTIONS.find(sectionConfig => sectionConfig.id === sectionId)
      : MENU_SECTIONS.find(sectionConfig => sectionConfig.modules.includes(moduleId));
    const haystack = normalizeMenuSearchText([
      moduleId,
      CARD_TITLES[moduleId],
      module.title,
      module.description,
      module.group,
      KICKERS[section && section.id],
      section && section.title
    ].filter(Boolean).join(" "));
    return normalizedQuery.split(" ").every(part => haystack.includes(part));
  }

  function updateMenuSearchUi(matchCount, isSearching) {
    if (menuSearchShell) menuSearchShell.classList.toggle("is-active", Boolean(isSearching));
    if (menuSearchClear) menuSearchClear.hidden = !isSearching;
    if (!menuSearchResult) return;
    if (!isSearching) {
      menuSearchResult.textContent = "";
      return;
    }
    menuSearchResult.textContent = matchCount === 1
      ? "1 Treffer"
      : (matchCount > 1 ? `${matchCount} Treffer` : "Keine Treffer gefunden");
  }

  function renderMenuSection(sectionConfig, options = {}) {
      const section = document.createElement("section");
      const isFavoriteSection = Boolean(options.isFavoriteSection);
      const isExpanded = isFavoriteSection || Boolean(options.forceExpanded) || expandedMenuSections.has(sectionConfig.id);
      section.className = `menu-section ${sectionConfig.accent}${isExpanded ? "" : " is-collapsed"}${isFavoriteSection && favoritesSortMode ? " is-favorite-sort-mode" : ""}`;
      section.setAttribute("aria-labelledby", `${sectionConfig.id}Title`);

      const header = document.createElement("div");
      header.className = `menu-section-header${isFavoriteSection ? " favorites-section-header" : ""}`;
      const toggle = document.createElement(isFavoriteSection ? "div" : "button");
      toggle.className = "menu-section-toggle";
      if (isFavoriteSection) {
        toggle.setAttribute("role", "heading");
        toggle.setAttribute("aria-level", "2");
      } else {
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", String(isExpanded));
        toggle.setAttribute("aria-controls", `${sectionConfig.id}Grid`);
      }

      const title = document.createElement("span");
      title.className = "menu-section-title";
      title.id = `${sectionConfig.id}Title`;
      title.textContent = sectionConfig.title;
      const titleGroup = document.createElement("span");
      titleGroup.className = "menu-section-title-group";
      const glyph = document.createElement("span");
      glyph.className = "menu-section-glyph";
      glyph.textContent = MENU_SECTION_GLYPHS[sectionConfig.id] || "";
      glyph.setAttribute("aria-hidden", "true");
      titleGroup.append(glyph, title);
      const icon = document.createElement("span");
      icon.className = "menu-section-icon";
      icon.setAttribute("aria-hidden", "true");
      let collapseButton = null;
      let sortButton = null;
      let carouselControls = null;
      let carouselPrevButton = null;
      let carouselNextButton = null;

      if (isFavoriteSection) {
        toggle.classList.add("favorites-title-toggle");
        toggle.append(titleGroup);

        sortButton = document.createElement("button");
        sortButton.className = `favorites-sort-toggle${favoritesSortMode ? " is-active" : ""}`;
        sortButton.type = "button";
        sortButton.textContent = "…";
        sortButton.setAttribute("aria-label", favoritesSortMode ? "Favoriten-Sortiermodus deaktivieren" : "Favoriten sortieren");
        sortButton.setAttribute("aria-pressed", String(favoritesSortMode));
        sortButton.title = favoritesSortMode ? "Sortieren beenden" : "Favoriten sortieren";

        header.append(toggle, sortButton);
      } else {
        toggle.append(titleGroup, icon);
        header.append(toggle);
      }

      const grid = document.createElement("div");
      grid.className = "menu-grid";
      grid.id = `${sectionConfig.id}Grid`;
      grid.setAttribute("aria-hidden", String(!isExpanded));
      const gridInner = document.createElement("div");
      gridInner.className = "menu-grid-inner";

      const favoriteIds = Array.isArray(options.favoriteIds) ? options.favoriteIds : loadFavoriteIds();
      sectionConfig.modules.forEach(id => {
        const module = registry[id];
        if (!module) return;
        gridInner.append(createModuleCard(id, module, sectionConfig.id, {
          favoriteIds,
          isFavoriteSection,
          favoriteIndex: favoriteIds.indexOf(id),
          favoriteCount: favoriteIds.length,
          sourceSectionId: isFavoriteSection ? getModuleSectionId(id) : sectionConfig.id
        }));
      });
      if (isFavoriteSection && !gridInner.children.length) {
        const empty = document.createElement("p");
        empty.className = "favorites-empty";
        empty.textContent = "Noch keine Favoriten - Stern in einer Modulkarte antippen.";
        gridInner.append(empty);
      }
      grid.append(gridInner);

      if (isFavoriteSection && gridInner.querySelector(".module-card")) {
        let currentCarouselIndex = 0;
        let carouselFrame = 0;
        let carouselResizeObserver = null;
        const carouselTimers = new Set();
        const setCarouselTimer = (callback, delay) => {
          const timer = window.setTimeout(() => {
            carouselTimers.delete(timer);
            callback();
          }, delay);
          carouselTimers.add(timer);
          return timer;
        };
        const getCarouselMetrics = () => {
          const cards = Array.from(gridInner.querySelectorAll(".module-card"));
          if (!cards.length) return { cards, cardWidth: 0, gap: 0, step: 0, visibleCount: 0, maxIndex: 0, hasOverflow: false };
          const firstRect = cards[0].getBoundingClientRect();
          const secondRect = cards[1] ? cards[1].getBoundingClientRect() : null;
          const computed = window.getComputedStyle(gridInner);
          const columnGap = Number.parseFloat(computed.columnGap || "");
          const gridGap = Number.parseFloat(computed.gap || "");
          const gap = Number.isFinite(columnGap) ? columnGap : (Number.isFinite(gridGap) ? gridGap : 0);
          const cardWidth = firstRect.width;
          const step = secondRect ? Math.max(cardWidth + gap, secondRect.left - firstRect.left) : cardWidth + gap;
          const available = Math.max(0, section.clientWidth);
          const visibleCount = Math.max(1, Math.min(cards.length, Math.floor((available + gap) / step)));
          const maxIndex = Math.max(0, cards.length - visibleCount);
          return { cards, cardWidth, gap, step, visibleCount, maxIndex, hasOverflow: cards.length > visibleCount };
        };
        const fitCarouselToWholeCards = metrics => {
          if (!metrics.cards.length) return;
          const width = Math.ceil(metrics.cardWidth + (Math.max(0, metrics.visibleCount - 1) * metrics.step) + 2);
          grid.style.setProperty("--favorites-carousel-width", `${width}px`);
        };
        const updateCarouselButtons = () => {
          if (!section.isConnected) return;
          if (!carouselControls || !carouselPrevButton || !carouselNextButton) return;
          const metrics = getCarouselMetrics();
          fitCarouselToWholeCards(metrics);
          currentCarouselIndex = metrics.step ? Math.min(metrics.maxIndex, Math.max(0, Math.round(gridInner.scrollLeft / metrics.step))) : 0;
          carouselControls.hidden = !metrics.hasOverflow;
          carouselPrevButton.disabled = !metrics.hasOverflow || currentCarouselIndex <= 0;
          carouselNextButton.disabled = !metrics.hasOverflow || currentCarouselIndex >= metrics.maxIndex;
        };
        const scrollFavorites = direction => {
          const metrics = getCarouselMetrics();
          fitCarouselToWholeCards(metrics);
          const nextIndex = Math.min(metrics.maxIndex, Math.max(0, currentCarouselIndex + direction));
          currentCarouselIndex = nextIndex;
          gridInner.scrollTo({
            left: metrics.step * nextIndex,
            behavior: prefersReducedMotion() ? "auto" : "smooth"
          });
          setCarouselTimer(scheduleCarouselUpdate, prefersReducedMotion() ? 0 : 320);
        };
        const scheduleCarouselUpdate = () => {
          if (carouselFrame) return;
          carouselFrame = window.requestAnimationFrame(() => {
            carouselFrame = 0;
            updateCarouselButtons();
          });
        };
        const createCarouselButton = direction => {
          const button = document.createElement("button");
          button.className = `favorites-carousel-button favorites-carousel-${direction < 0 ? "prev" : "next"}`;
          button.type = "button";
          button.textContent = direction < 0 ? "←" : "→";
          button.setAttribute("aria-label", direction < 0 ? "Favoriten nach links scrollen" : "Favoriten nach rechts scrollen");
          button.title = direction < 0 ? "Nach links scrollen" : "Nach rechts scrollen";
          button.addEventListener("click", event => {
            event.stopPropagation();
            scrollFavorites(direction);
          });
          return button;
        };
        carouselControls = document.createElement("div");
        carouselControls.className = "favorites-carousel-controls";
        carouselControls.setAttribute("aria-label", "Favoriten-Carousel Navigation");
        carouselPrevButton = createCarouselButton(-1);
        carouselNextButton = createCarouselButton(1);
        carouselControls.append(carouselPrevButton, carouselNextButton);
        gridInner.addEventListener("scroll", scheduleCarouselUpdate, { passive: true });
        if (typeof ResizeObserver === "function") {
          carouselResizeObserver = new ResizeObserver(scheduleCarouselUpdate);
          carouselResizeObserver.observe(section);
        } else {
          window.addEventListener("resize", scheduleCarouselUpdate, { passive: true });
        }
        window.requestAnimationFrame(() => {
          updateCarouselButtons();
          scheduleCarouselUpdate();
        });
        [120, 360].forEach(delay => setCarouselTimer(scheduleCarouselUpdate, delay));
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(scheduleCarouselUpdate).catch(() => {});
        }
        menuCarouselCleanup = () => {
          gridInner.removeEventListener("scroll", scheduleCarouselUpdate);
          if (carouselResizeObserver) carouselResizeObserver.disconnect();
          else window.removeEventListener("resize", scheduleCarouselUpdate);
          if (carouselFrame) window.cancelAnimationFrame(carouselFrame);
          carouselTimers.forEach(timer => window.clearTimeout(timer));
          carouselTimers.clear();
        };
      }

      const setExpanded = expanded => {
        toggle.setAttribute("aria-expanded", String(expanded));
        if (collapseButton) collapseButton.setAttribute("aria-expanded", String(expanded));
        section.classList.toggle("is-collapsed", !expanded);
        grid.setAttribute("aria-hidden", String(!expanded));
        if (expanded) expandedMenuSections.add(sectionConfig.id);
        else expandedMenuSections.delete(sectionConfig.id);
      };

      if (!isFavoriteSection) {
        toggle.addEventListener("click", () => setExpanded(toggle.getAttribute("aria-expanded") !== "true"));
      }
      if (collapseButton) {
        collapseButton.addEventListener("click", () => setExpanded(collapseButton.getAttribute("aria-expanded") !== "true"));
      }
      if (sortButton) {
        sortButton.addEventListener("click", () => {
          favoritesSortMode = !favoritesSortMode;
          expandedMenuSections.add(FAVORITES_SECTION_ID);
          renderMenu();
        });
      }

      section.append(header, grid);
      if (carouselControls) section.append(carouselControls);
      return section;
  }

  function renderMenu() {
    if (typeof menuCarouselCleanup === "function") menuCarouselCleanup();
    menuCarouselCleanup = null;
    const fragment = document.createDocumentFragment();
    const query = String(menuSearchQuery || "").trim();
    const isSearching = Boolean(query);
    const matchedModuleIds = new Set();
    const favoriteModules = loadFavoriteIds();
    if (!isSearching) {
      fragment.append(renderMenuSection({
        id: FAVORITES_SECTION_ID,
        title: "Favoriten",
        accent: "accent-favorites",
        modules: favoriteModules
      }, { isFavoriteSection: true, favoriteIds: favoriteModules }));
    }
    MENU_SECTIONS.forEach(sectionConfig => {
      const modules = isSearching
        ? sectionConfig.modules.filter(id => moduleMatchesSearch(id, sectionConfig.id, query))
        : sectionConfig.modules;
      if (isSearching && !modules.length) return;
      modules.forEach(id => matchedModuleIds.add(id));
      fragment.append(renderMenuSection(
        Object.assign({}, sectionConfig, { modules }),
        { forceExpanded: isSearching, favoriteIds: favoriteModules }
      ));
    });
    if (isSearching && !matchedModuleIds.size) {
      const empty = document.createElement("section");
      empty.className = "menu-search-empty";
      empty.setAttribute("role", "status");
      empty.innerHTML = "<span>Keine Treffer - Suchbegriff prüfen oder kürzer suchen.</span>";
      fragment.append(empty);
    }
    moduleGrid.replaceChildren(fragment);
    updateMenuSearchUi(matchedModuleIds.size, isSearching);
  }

  function normalizeShellStatusMessage(message) {
    const text = String(message || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    if (/lokale berichte, archive und favoriten/i.test(text)) return text;
    if (/offline.*verfügbar/i.test(text)) return "Offline verfügbar.";
    if (/offline/i.test(text)) return "Offline - lokal gespeicherte Inhalte bleiben verfügbar.";
    if (/^online\.?$/i.test(text)) return "Online.";
    if (/backup-datei ungültig/i.test(text)) return "Backup-Datei konnte nicht gelesen werden.";
    if (/import fehlgeschlagen/i.test(text)) return "Backup konnte nicht importiert werden.";
    if (/export erfolgreich/i.test(text)) return `${text} Lokale Berichte, Archive und Favoriten sind enthalten.`;
    if (/import erfolgreich/i.test(text)) return `${text} Lokale Berichte, Archive und Favoriten wurden wiederhergestellt.`;
    if (/keine archivdaten gefunden/i.test(text)) return "Backup enthält keine wiederherstellbaren Archivdaten.";
    if (/konnte nicht.*archiv/i.test(text)) return "Formular konnte nicht im Archiv gespeichert werden.";
    if (/vorhandener archiv-eintrag aktualisiert/i.test(text)) return "Formular aktualisiert.";
    if (/bericht im archiv gespeichert|aufmaß.*archiv gespeichert|archiv.*gespeichert|gespeichert.*archiv/i.test(text)) return "Formular im Archiv gespeichert.";
    if (/archiv-eintrag.*geöffnet/i.test(text)) return "Archiv-Eintrag wurde geöffnet.";
    if (/aus dem archiv geöffnet/i.test(text)) return "Archiv-Eintrag wurde geöffnet.";
    if (/archiv.*geöffnet/i.test(text)) return "Archiv wurde geöffnet.";
    if (/archiv.*gelöscht/i.test(text)) return "Archiv-Eintrag wurde gelöscht.";
    if (/geleert|eingaben.*löschen/i.test(text)) return "Formular geleert.";
    if (/pdf export.*wird erstellt|pdf.*wird erstellt/i.test(text)) return "PDF-Export wird erstellt...";
    if (/pdf export.*nicht|pdf.*nicht|kombinierter.*nicht/i.test(text)) return "PDF-Export konnte nicht erstellt werden.";
    if (/pdf export.*erstellt|zip.*erstellt|pdf.*erstellt/i.test(text)) return "PDF-Export wurde erstellt.";
    if (/backup-datei ungültig|fehlgeschlagen|fehler|konnte nicht|ungültig|passt nicht/i.test(text)) return text;
    if (/export erfolgreich|import erfolgreich|importiert|gespeichert|aktualisiert|erstellt|geöffnet|gelöscht|geleert/i.test(text)) return text;
    return text;
  }

  function shellStatusTone(message) {
    const text = String(message || "");
    if (/fehlgeschlagen|fehler|konnte nicht|ungültig|passt nicht|nicht erstellt|nicht gespeichert/i.test(text)) return "error";
    if (/wird |werden |läuft|bitte.*bestätigen/i.test(text)) return "info";
    if (/erstellt|gespeichert|aktualisiert|erfolgreich|importiert|gelöscht/i.test(text)) return "success";
    return "info";
  }

  function showAppToast(message) {
    if (window.FSMOBILE_UI?.routeStatus(String(message || ""), frameDocument()?.defaultView)) return;
    const normalized = normalizeShellStatusMessage(message);
    if (!appToast || !appToastText || !normalized) return;
    const tone = shellStatusTone(normalized);
    appToastText.textContent = normalized;
    appToast.classList.remove("is-success", "is-error", "is-info");
    appToast.classList.add(`is-${tone}`);
    appToast.hidden = false;
    window.clearTimeout(appToastTimer);
    appToastTimer = window.setTimeout(() => {
      appToast.hidden = true;
    }, tone === "error" ? 7600 : 5800);
  }

  function standardFileSegment(value, fallback = "Ohne_Wert") {
    const text = String(value || "").replace(/\s+/g, " ").trim() || fallback;
    return text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 90) || fallback;
  }

  function standardPdfFileName(parts = [], fallback = "FSMobile_Export") {
    const segments = (Array.isArray(parts) ? parts : [parts])
      .map(part => standardFileSegment(part, ""))
      .filter(Boolean);
    return `${segments.length ? segments.join("_") : standardFileSegment(fallback)}.pdf`;
  }

  function createStandardArchiveEntry({ moduleId = "", title = "", meta = {}, data = {}, previous = null } = {}) {
    const now = new Date().toISOString();
    const id = previous && previous.id
      ? previous.id
      : (window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `archive-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
    return {
      id,
      moduleId,
      title: String(title || meta.type || moduleId || "Archiv-Eintrag"),
      createdAt: previous && previous.createdAt ? previous.createdAt : now,
      updatedAt: now,
      meta: {
        type: meta.type || "",
        object: meta.object || meta.objekt || "",
        anlage: meta.anlage || meta.anlagenNr || "",
        date: meta.date || meta.datum || ""
      },
      data
    };
  }

  function createStandardModuleApi(options = {}) {
    const moduleId = String(options.moduleId || "").trim();
    if (!moduleId) throw new TypeError("FSMobile Modul-API: moduleId fehlt.");

    const storageSource = options.storage && typeof options.storage === "object" ? options.storage : {};
    const storage = Object.freeze({
      current: String(storageSource.current || ""),
      archive: String(storageSource.archive || ""),
      pointer: String(storageSource.pointer || "")
    });
    const capabilitySource = options.capabilities && typeof options.capabilities === "object" ? options.capabilities : {};
    const capabilities = Object.freeze({
      draft: Boolean(capabilitySource.draft),
      archive: Boolean(capabilitySource.archive),
      pdf: Boolean(capabilitySource.pdf),
      signatures: Boolean(capabilitySource.signatures),
      import: Boolean(capabilitySource.import),
      export: Boolean(capabilitySource.export)
    });
    const actionSource = options.actions && typeof options.actions === "object" ? options.actions : {};
    const actions = {};
    Object.entries(actionSource).forEach(([key, value]) => {
      const invoke = typeof value === "function" ? value : value && value.invoke;
      if (typeof invoke !== "function") return;
      const isDisabled = value && typeof value.isDisabled === "function"
        ? value.isDisabled
        : () => false;
      actions[key] = Object.freeze({ invoke, isDisabled });
    });
    const stateSource = options.state && typeof options.state === "object" ? options.state : {};
    const lifecycleSource = options.lifecycle && typeof options.lifecycle === "object" ? options.lifecycle : {};
    const state = Object.freeze({
      collect: typeof stateSource.collect === "function" ? stateSource.collect : null,
      apply: typeof stateSource.apply === "function" ? stateSource.apply : null
    });
    const lifecycle = Object.freeze({
      flush: typeof lifecycleSource.flush === "function" ? lifecycleSource.flush : null
    });

    return Object.freeze({
      version: 1,
      moduleId,
      storage,
      capabilities,
      actions: Object.freeze(actions),
      state,
      lifecycle
    });
  }

  function standardStorageByteLength(value) {
    const text = String(value == null ? "" : value);
    if (typeof TextEncoder === "function") return new TextEncoder().encode(text).byteLength;
    try { return new Blob([text]).size; }
    catch (error) { return text.length * 2; }
  }

  function standardStorageErrorCode(error) {
    const name = String(error && error.name || "");
    const message = String(error && error.message || "");
    const code = Number(error && error.code || 0);
    if (name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED" || code === 22 || code === 1014 || /quota/i.test(message)) {
      return "quota-exceeded";
    }
    if (name === "SecurityError") return "storage-unavailable";
    return "write-failed";
  }

  const standardStorageContract = Object.freeze({
    byteLength: standardStorageByteLength,
    errorCode: standardStorageErrorCode
  });

  window.FSMOBILE_STANDARD = Object.freeze({
    version: 2,
    normalizeStatusMessage: normalizeShellStatusMessage,
    showToast: showAppToast,
    fileSegment: standardFileSegment,
    pdfFileName: standardPdfFileName,
    createArchiveEntry: createStandardArchiveEntry,
    createModuleApi: createStandardModuleApi,
    storage: standardStorageContract
  });

  function showConnectionStatus(message, tone = "ready", options = {}) {
    if (!appConnectionStatus || !appConnectionStatusText || !message) return;
    appConnectionStatusText.textContent = message;
    appConnectionStatus.classList.remove("is-online", "is-offline", "is-ready");
    appConnectionStatus.classList.add(`is-${tone}`);
    appConnectionStatus.hidden = false;
    window.clearTimeout(appConnectionStatusTimer);
    if (options.persist) return;
    appConnectionStatusTimer = window.setTimeout(() => {
      appConnectionStatus.hidden = true;
    }, Number(options.duration) || 4400);
  }

  function hideConnectionStatus() {
    if (!appConnectionStatus) return;
    window.clearTimeout(appConnectionStatusTimer);
    appConnectionStatus.hidden = true;
  }

  function updateConnectionStatus(options = {}) {
    if (!("onLine" in navigator)) return;
    if (navigator.onLine === false) {
      showConnectionStatus("Offline", "offline", { persist: true });
      return;
    }
    if (options.showReady) {
      showConnectionStatus("Offline verfügbar", "ready", { duration: 4400 });
      return;
    }
    hideConnectionStatus();
  }

  function initializeConnectionStatus() {
    updateConnectionStatus();
    window.addEventListener("offline", () => {
      showConnectionStatus("Offline", "offline", { persist: true });
      showAppToast("Offline");
    });
    window.addEventListener("online", () => {
      showConnectionStatus("Online", "online", { duration: 3400 });
      showAppToast("Online");
    });
  }

  function setOptionsStatus(message) {
    if (!archiveBackupStatus) return;
    archiveBackupStatus.textContent = message || "";
    if (window.FSMOBILE_UI) window.FSMOBILE_UI.hideToast();
  }

  function hideBackupSummary() {
    if (!archiveBackupSummary) return;
    archiveBackupSummary.hidden = true;
    if (archiveBackupImportActions) archiveBackupImportActions.hidden = true;
    pendingBackupImportPayload = null;
    pendingBackupImportSummary = null;
  }

  function hideArchiveDeleteConfirm() {
    if (!archiveDeleteConfirm) return;
    archiveDeleteConfirm.hidden = true;
  }

  function showArchiveDeleteConfirm() {
    if (!archiveDeleteConfirm) return;
    setOptionsStatus("");
    hideBackupSummary();
    archiveDeleteConfirm.hidden = false;
    window.setTimeout(() => archiveDeleteCancelButton && archiveDeleteCancelButton.focus(), 40);
  }

  function openOptionsDialog() {
    if (!optionsOverlay) return;
    window.clearTimeout(optionsCloseTimer);
    setOptionsStatus("");
    hideArchiveDeleteConfirm();
    hideBackupSummary();
    refreshOptionsSecuritySummary();
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
    hideBackupSummary();
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

  function archiveEntryFields(entry, storageKey = "") {
    const isLegacyFeuerloescher = storageKey === "pb-feuerloescher-report-archive-v1";
    const isLegacyBrandschutztueren = [
      "pb-brandschutztueren-report-archive-v1",
      "pb-brandschutztueren-archive-v1",
      "fsmobile-pb-brandschutztueren-archive-v1"
    ].includes(storageKey);
    const isLegacyFlatArchive = isLegacyFeuerloescher || isLegacyBrandschutztueren;
    const report = entry && entry.report && typeof entry.report === "object"
      ? entry.report
      : entry && entry.data && typeof entry.data === "object"
        ? entry.data
        : isLegacyFlatArchive && entry && typeof entry === "object"
          ? entry
          : {};
    const fields = report.fields && typeof report.fields === "object" && !Array.isArray(report.fields)
      ? { ...report.fields }
      : {};
    const header = report.header && typeof report.header === "object" && !Array.isArray(report.header)
      ? report.header
      : {};
    const anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
      || firstArchiveValue(header, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
      || (isLegacyFlatArchive ? firstArchiveValue(report, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]) : "");
    const object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
      || firstArchiveValue(header, ["object", "objekt", "objectInput", "objektInput"])
      || (isLegacyFlatArchive ? firstArchiveValue(report, ["object", "objekt", "objectInput", "objektInput"]) : "");
    const date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
      || firstArchiveValue(header, ["date", "datum", "dateInput", "datumInput"])
      || (isLegacyFlatArchive ? firstArchiveValue(report, ["date", "datum", "dateInput", "datumInput"]) : "");
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
    return Object.keys(fields).length ? fields : report;
  }

  function archiveEntryAssignmentKey(storageKey, entry) {
    const fields = archiveEntryFields(entry, storageKey);
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

  const KNOWN_ARCHIVE_STORAGE_KEYS = new Set([
    "auftrag-bescheinigungen-archive-v1",
    "planungshilfe-bma-archive-v1",
    "maengelliste-pwa-v1-archive",
    "maengelliste-bilddoku-pwa-v1-archive",
    "maengelliste-maengelbeschreibungen-pwa-v1-archive",
    "rwa_pruefbericht_archiv_v1"
  ]);

  const KNOWN_ARCHIVE_POINTER_STORAGE_KEYS = new Set([
    "auftrag-bescheinigungen-current-archive-id-v1",
    "planungshilfe-bma-current-archive-id-v1",
    "maengelliste-pwa-current-archive-id",
    "maengelliste-bilddoku-pwa-current-archive-id",
    "maengelliste-maengelbeschreibungen-pwa-current-archive-id",
    "rwa_pruefbericht_current_archive_id"
  ]);

  function imageStorageApi() {
    return window.FSMOBILE_IMAGE_STORAGE && typeof window.FSMOBILE_IMAGE_STORAGE.loadPayload === "function"
      ? window.FSMOBILE_IMAGE_STORAGE
      : null;
  }

  function isImageShadowStorageKey(key) {
    const prefix = window.FSMOBILE_IMAGE_STORAGE && window.FSMOBILE_IMAGE_STORAGE.shadowPrefix
      ? window.FSMOBILE_IMAGE_STORAGE.shadowPrefix
      : "fsmobile-image-shadow-v1:";
    return String(key || "").startsWith(prefix);
  }

  function parseImageShadowValue(value) {
    try {
      const shadow = JSON.parse(String(value || ""));
      return shadow && shadow.schemaVersion === 1 && shadow.moduleId && shadow.storageKey ? shadow : null;
    } catch {
      return null;
    }
  }

  function isArchiveStorageKey(key) {
    const value = String(key || "");
    if (isImageShadowStorageKey(value)) return false;
    if (/current|session|temp|draft|pending/i.test(value)) return false;
    if (KNOWN_ARCHIVE_STORAGE_KEYS.has(value)) return true;
    return /^(?:fsmobile-.*archive.*v\d+|pb-.*archive.*v\d+)$/i.test(value);
  }

  function isArchivePointerStorageKey(key) {
    const value = String(key || "");
    if (isImageShadowStorageKey(value)) return false;
    if (KNOWN_ARCHIVE_POINTER_STORAGE_KEYS.has(value)) return true;
    if (/^pb-.*current-archive-id(?:-v\d+)?$/i.test(value)) return true;
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

  function isBackupExcludedStorageKey(key) {
    return [AUTH_UNLOCK_KEY, OLD_PASS_HASH_KEY, UPDATE_RELOAD_KEY, LAST_BACKUP_KEY].includes(String(key || ""));
  }

  const POSITION_CHECKBOX_UI_METADATA_KEY = "positionCheckboxes";

  function withoutPositionCheckboxUiMetadata(entry) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return entry;
    const copy = { ...entry };
    const uiMetadata = copy.uiMetadata && typeof copy.uiMetadata === "object" && !Array.isArray(copy.uiMetadata)
      ? { ...copy.uiMetadata }
      : null;
    if (!uiMetadata || !Object.prototype.hasOwnProperty.call(uiMetadata, POSITION_CHECKBOX_UI_METADATA_KEY)) return copy;
    delete uiMetadata[POSITION_CHECKBOX_UI_METADATA_KEY];
    if (Object.keys(uiMetadata).length) copy.uiMetadata = uiMetadata;
    else delete copy.uiMetadata;
    return copy;
  }

  function withoutPositionCheckboxUiMetadataFromEntries(entries) {
    return (Array.isArray(entries) ? entries : []).map(withoutPositionCheckboxUiMetadata);
  }

  function collectLocalStorageBackupData() {
    const storage = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || isBackupExcludedStorageKey(key)) continue;
      let value = localStorage.getItem(key);
      if (value != null && isArchiveStorageKey(key)) {
        try {
          const entries = JSON.parse(value);
          if (Array.isArray(entries)) value = JSON.stringify(withoutPositionCheckboxUiMetadataFromEntries(entries));
        } catch {}
      }
      if (value != null) storage[key] = value;
    }
    return Object.keys(storage).sort().reduce((result, key) => {
      result[key] = storage[key];
      return result;
    }, {});
  }

  function collectArchiveBackupData() {
    const archives = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!isArchiveStorageKey(key)) continue;
      const entries = readArchiveEntries(key);
      if (entries.length) archives[key] = withoutPositionCheckboxUiMetadataFromEntries(entries);
    }
    return archives;
  }

  function backupLocalStoragePayload(payload) {
    const storage = payload && payload.storage && payload.storage.localStorage;
    if (storage && typeof storage === "object" && !Array.isArray(storage)) return storage;
    const legacy = payload && payload.localStorage;
    if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) return legacy;
    return null;
  }

  function backupIndexedDbPayload(payload) {
    const storage = payload && payload.storage && payload.storage.indexedDB;
    return storage && typeof storage === "object" && !Array.isArray(storage) ? storage : null;
  }

  function parseArchiveEntriesFromBackupValue(value) {
    try {
      const entries = JSON.parse(String(value || "[]"));
      return Array.isArray(entries)
        ? withoutPositionCheckboxUiMetadataFromEntries(entries.filter(entry => entry && typeof entry === "object"))
        : null;
    } catch {
      return null;
    }
  }

  function collectArchiveStorageKeys() {
    const archiveKeys = new Set();
    const pointerKeys = new Set();
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (isImageShadowStorageKey(key)) {
        const shadow = parseImageShadowValue(localStorage.getItem(key));
        if (shadow && isArchiveStorageKey(shadow.storageKey)) archiveKeys.add(shadow.storageKey);
      } else if (isArchiveStorageKey(key)) archiveKeys.add(key);
      else if (isArchivePointerStorageKey(key)) pointerKeys.add(key);
    }
    return { archiveKeys: Array.from(archiveKeys), pointerKeys: Array.from(pointerKeys) };
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

  function isBackupArchiveDataKey(key) {
    const value = String(key || "");
    if (isArchiveStorageKey(value)) return true;
    if (isArchivePointerStorageKey(value)) return false;
    if (/current|session|temp|draft|pending|auth|update/i.test(value)) return false;
    return /archive|archiv/i.test(value);
  }

  function parseBackupJsonValue(value) {
    try {
      return JSON.parse(String(value || ""));
    } catch {
      return null;
    }
  }

  function backupArrayEntryCount(value) {
    const parsed = Array.isArray(value) ? value : parseBackupJsonValue(value);
    return Array.isArray(parsed) ? parsed.filter(entry => entry && typeof entry === "object").length : 0;
  }

  function backupFavoriteCount(storage) {
    const parsed = parseBackupJsonValue(storage && storage[FAVORITES_STORAGE_KEY]);
    return Array.isArray(parsed) ? parsed.length : 0;
  }

  function backupLocalReportKeyCount(storage) {
    if (!storage || typeof storage !== "object") return 0;
    return Object.keys(storage).filter(key => (
      key !== FAVORITES_STORAGE_KEY &&
      !isBackupExcludedStorageKey(key) &&
      !isImageShadowStorageKey(key) &&
      !isBackupArchiveDataKey(key) &&
      !isArchivePointerStorageKey(key)
    )).length;
  }

  function summarizeArchiveContent(storage, archives, imageArchives) {
    const archiveCounts = new Map();
    if (storage && typeof storage === "object") {
      Object.entries(storage).forEach(([key, value]) => {
        if (!isBackupArchiveDataKey(key)) return;
        const count = backupArrayEntryCount(value);
        if (count > 0) archiveCounts.set(key, count);
      });
    }
    if (archives && typeof archives === "object" && !Array.isArray(archives)) {
      Object.entries(archives).forEach(([key, value]) => {
        const count = backupArrayEntryCount(value);
        if (count > 0) archiveCounts.set(key, count);
      });
    }
    if (imageArchives && typeof imageArchives.forEach === "function") {
      imageArchives.forEach((value, key) => {
        const entries = value && Array.isArray(value.entries) ? value.entries : [];
        if (entries.length) archiveCounts.set(key, entries.length);
      });
    }
    const archiveAreaCount = archiveCounts.size;
    const archiveEntryCount = Array.from(archiveCounts.values()).reduce((sum, count) => sum + count, 0);
    return { archiveAreaCount, archiveEntryCount };
  }

  function formatBackupDateTime(value) {
    const timestamp = Date.parse(String(value || ""));
    if (!Number.isFinite(timestamp)) return "nicht angegeben";
    return new Date(timestamp).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function expectedCacheVersionLabel() {
    const appVersion = getAppVersion();
    return /^v\d+/i.test(appVersion) ? `fsmobile-${appVersion}` : appVersion;
  }

  function formatCacheMegabytes(bytes) {
    const megabytes = Math.max(0, Number(bytes) || 0) / (1024 * 1024);
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(megabytes);
  }

  function cacheUsageLabel(status) {
    if (!status || !Number.isFinite(status.totalBytes) || !Number.isFinite(status.maxCacheBytes)) return "Nicht prüfbar";
    return `${formatCacheMegabytes(status.totalBytes)} MB von max. ${formatCacheMegabytes(status.maxCacheBytes)} MB`;
  }

  function localStorageUsageBytes() {
    try {
      let total = 0;
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index) || "";
        const value = localStorage.getItem(key) || "";
        total += (key.length + value.length) * 2;
      }
      return total;
    } catch {
      return null;
    }
  }

  function formatStoragePercentage(value) {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(Math.max(0, Math.min(100, Number(value) || 0)));
  }

  async function currentAppStorageStatus() {
    const localBytes = localStorageUsageBytes();
    const result = {
      localDataUsage: Number.isFinite(localBytes) ? `${formatCacheMegabytes(localBytes)} MB` : "Nicht prüfbar",
      imageDataUsage: "Keine ausgelagerten Bilder",
      storageReserve: "Nicht prüfbar",
      storageWarning: false
    };
    const imageStorage = imageStorageApi();
    if (imageStorage && typeof imageStorage.stats === "function") {
      try {
        const imageStats = await imageStorage.stats();
        if (imageStats && imageStats.ok) {
          result.imageDataUsage = imageStats.imageCount
            ? `${imageStats.imageCount} ${imageStats.imageCount === 1 ? "Bild" : "Bilder"} · ${formatCacheMegabytes(imageStats.bytes)} MB`
            : "Keine ausgelagerten Bilder";
        } else {
          result.imageDataUsage = "Nicht prüfbar";
        }
      } catch {
        result.imageDataUsage = "Nicht prüfbar";
      }
    }
    const storageManager = navigator.storage;
    if (!storageManager || typeof storageManager.estimate !== "function") return result;
    try {
      const estimate = await storageManager.estimate();
      const usage = Number(estimate && estimate.usage);
      const quota = Number(estimate && estimate.quota);
      if (!Number.isFinite(usage) || !Number.isFinite(quota) || quota <= 0) return result;
      let persistence = "Status unbekannt";
      if (typeof storageManager.persisted === "function") {
        try {
          persistence = await storageManager.persisted() ? "dauerhaft" : "Browser verwaltet";
        } catch {}
      }
      const freePercent = Math.max(0, 100 - (usage / quota * 100));
      result.storageWarning = freePercent < 20;
      result.storageReserve = `${result.storageWarning ? "Knapp · " : ""}${formatStoragePercentage(freePercent)} % frei · ${persistence}`;
      return result;
    } catch {
      return result;
    }
  }

  function requestServiceWorkerCacheStatus(worker, timeout = 1600) {
    if (!worker || typeof MessageChannel === "undefined") return Promise.resolve(null);
    return new Promise(resolve => {
      const channel = new MessageChannel();
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        channel.port1.onmessage = null;
        try { channel.port1.close(); } catch {}
        resolve(value || null);
      };
      const timer = window.setTimeout(() => finish(null), timeout);
      channel.port1.onmessage = event => {
        const payload = event.data || {};
        finish(payload.type === "CACHE_STATUS" && payload.status ? payload.status : null);
      };
      try {
        channel.port1.start();
        worker.postMessage({ type: "GET_CACHE_STATUS" }, [channel.port2]);
      } catch {
        finish(null);
      }
    });
  }

  async function currentServiceWorkerCacheStatus(registration) {
    const workers = [
      registration && registration.waiting,
      registration && registration.active,
      navigator.serviceWorker && navigator.serviceWorker.controller
    ].filter((worker, index, items) => worker && items.indexOf(worker) === index);
    for (const worker of workers) {
      const status = await requestServiceWorkerCacheStatus(worker);
      if (status && status.cacheName && Array.isArray(status.missingCoreAssets)) return status;
    }
    return null;
  }

  function setOptionsSecurityValues(values = {}) {
    if (optionsOfflineReady) optionsOfflineReady.textContent = values.offlineReady || "Wird geprüft...";
    if (optionsCacheVersion) optionsCacheVersion.textContent = values.cacheVersion || "Wird geprüft...";
    if (optionsCacheUsage) optionsCacheUsage.textContent = values.cacheUsage || "Wird geprüft...";
    if (optionsLocalDataUsage) optionsLocalDataUsage.textContent = values.localDataUsage || "Wird geprüft...";
    if (optionsImageStorageUsage) optionsImageStorageUsage.textContent = values.imageDataUsage || "Wird geprüft...";
    if (optionsStorageReserve) {
      optionsStorageReserve.textContent = values.storageReserve || "Wird geprüft...";
      optionsStorageReserve.dataset.state = values.storageWarning ? "warning" : "ok";
    }
    if (optionsLastBackup) optionsLastBackup.textContent = values.lastBackup || "Noch kein Backup erstellt";
  }

  function updateOptionsLastBackup() {
    if (!optionsLastBackup) return;
    const backupTime = localStorage.getItem(LAST_BACKUP_KEY);
    optionsLastBackup.textContent = backupTime ? formatBackupDateTime(backupTime) : "Noch kein Backup erstellt";
  }

  async function refreshOptionsSecuritySummary() {
    if (!optionsOfflineReady && !optionsCacheVersion && !optionsCacheUsage && !optionsLocalDataUsage && !optionsImageStorageUsage && !optionsStorageReserve && !optionsLastBackup) return;
    setOptionsSecurityValues({
      offlineReady: "Wird geprüft...",
      cacheVersion: expectedCacheVersionLabel(),
      cacheUsage: "Wird geprüft...",
      localDataUsage: "Wird geprüft...",
      imageDataUsage: "Wird geprüft...",
      storageReserve: "Wird geprüft...",
      lastBackup: localStorage.getItem(LAST_BACKUP_KEY) ? formatBackupDateTime(localStorage.getItem(LAST_BACKUP_KEY)) : "Noch kein Backup erstellt"
    });
    const storageStatus = await currentAppStorageStatus();
    if (optionsLocalDataUsage) optionsLocalDataUsage.textContent = storageStatus.localDataUsage;
    if (optionsImageStorageUsage) optionsImageStorageUsage.textContent = storageStatus.imageDataUsage;
    if (optionsStorageReserve) {
      optionsStorageReserve.textContent = storageStatus.storageReserve;
      optionsStorageReserve.dataset.state = storageStatus.storageWarning ? "warning" : "ok";
    }
    try {
      const cacheNames = typeof caches !== "undefined" ? await caches.keys() : [];
      const fsmobileCache = cacheNames
        .filter(name => /^fsmobile-v\d+/i.test(name))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .pop();
      const registration = navigator.serviceWorker && navigator.serviceWorker.ready
        ? await navigator.serviceWorker.ready.catch(() => null)
        : null;
      const cacheStatus = registration ? await currentServiceWorkerCacheStatus(registration) : null;
      const offlineReady = cacheStatus
        ? Boolean(cacheStatus.offlineReady && cacheStatus.withinBudget && cacheStatus.missingCoreAssets.length === 0)
        : Boolean(registration && registration.active && fsmobileCache);
      setOptionsSecurityValues({
        offlineReady: offlineReady ? "Ja" : "Nein",
        cacheVersion: (cacheStatus && cacheStatus.cacheName) || fsmobileCache || expectedCacheVersionLabel(),
        cacheUsage: cacheStatus ? cacheUsageLabel(cacheStatus) : (fsmobileCache ? "Nach Update prüfbar" : "Nicht verfügbar"),
        localDataUsage: storageStatus.localDataUsage,
        imageDataUsage: storageStatus.imageDataUsage,
        storageReserve: storageStatus.storageReserve,
        storageWarning: storageStatus.storageWarning,
        lastBackup: localStorage.getItem(LAST_BACKUP_KEY) ? formatBackupDateTime(localStorage.getItem(LAST_BACKUP_KEY)) : "Noch kein Backup erstellt"
      });
    } catch {
      setOptionsSecurityValues({
        offlineReady: "Nicht prüfbar",
        cacheVersion: expectedCacheVersionLabel(),
        cacheUsage: "Nicht prüfbar",
        localDataUsage: storageStatus.localDataUsage,
        imageDataUsage: storageStatus.imageDataUsage,
        storageReserve: storageStatus.storageReserve,
        storageWarning: storageStatus.storageWarning,
        lastBackup: localStorage.getItem(LAST_BACKUP_KEY) ? formatBackupDateTime(localStorage.getItem(LAST_BACKUP_KEY)) : "Noch kein Backup erstellt"
      });
    }
  }

  function backupSummaryFromPayload(payload) {
    const storage = backupLocalStoragePayload(payload) || {};
    const indexedDb = backupIndexedDbPayload(payload);
    const imageRecords = indexedDb && Array.isArray(indexedDb.records) ? indexedDb.records : [];
    const archiveStats = summarizeArchiveContent(storage, payload && payload.archives, collectIncomingImageArchives(payload));
    const storageKeys = Object.keys(storage);
    const pointerKeyCount = storageKeys.filter(isArchivePointerStorageKey).length;
    const metadata = payload && payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {};
    return {
      archiveAreaCount: archiveStats.archiveAreaCount,
      archiveEntryCount: archiveStats.archiveEntryCount,
      favoriteCount: backupFavoriteCount(storage),
      localReportKeyCount: backupLocalReportKeyCount(storage),
      storageKeyCount: storageKeys.length,
      pointerKeyCount,
      imageRecordCount: imageRecords.length,
      imageCount: imageRecords.reduce((sum, record) => sum + Number(record && record.imageCount || 0), 0),
      imageBytes: imageRecords.reduce((sum, record) => sum + Number(record && record.bytes || 0), 0),
      appVersion: metadata.appVersion || "unbekannt",
      exportedAt: metadata.exportedAt || "",
      formatVersion: payload && payload.formatVersion ? payload.formatVersion : "unbekannt"
    };
  }

  function backupSummaryValueLabel(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  function renderBackupSummary(summary, mode) {
    if (!archiveBackupSummary || !archiveBackupSummaryTitle || !archiveBackupSummaryText || !archiveBackupSummaryList || !archiveBackupSummaryNote) return;
    const isImport = mode === "import";
    const isImported = mode === "imported";
    archiveBackupSummaryTitle.textContent = isImport ? "Backup importieren?" : (isImported ? "Backup importiert" : "Backup erstellt");
    archiveBackupSummaryText.textContent = isImport
      ? "Diese Sicherung wurde gelesen und enthält folgende Daten:"
      : isImported
        ? "Diese Sicherung wurde wiederhergestellt:"
      : "Diese Sicherung enthält folgende Daten:";
    archiveBackupSummaryList.replaceChildren();
    [
      ["Archivdaten", `${summary.archiveEntryCount} ${backupSummaryValueLabel(summary.archiveEntryCount, "Eintrag", "Einträge")} in ${summary.archiveAreaCount} ${backupSummaryValueLabel(summary.archiveAreaCount, "Bereich", "Bereichen")}`],
      ["Favoriten", `${summary.favoriteCount} ${backupSummaryValueLabel(summary.favoriteCount, "Favorit", "Favoriten")}`],
      ["Lokale Berichte / Entwürfe", `${summary.localReportKeyCount} ${backupSummaryValueLabel(summary.localReportKeyCount, "Datenwert", "Datenwerte")}`],
      ["Ausgelagerte Bilder", summary.imageCount ? `${summary.imageCount} ${backupSummaryValueLabel(summary.imageCount, "Bild", "Bilder")} · ${formatCacheMegabytes(summary.imageBytes)} MB` : "Keine"],
      ["Archiv-Zuordnungen", `${summary.pointerKeyCount} ${backupSummaryValueLabel(summary.pointerKeyCount, "Verknüpfung", "Verknüpfungen")}`],
      ["Erstellt am", formatBackupDateTime(summary.exportedAt)],
      ["FSMobile-Version", String(summary.appVersion || "unbekannt")]
    ].forEach(([label, value]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const detail = document.createElement("dd");
      detail.textContent = value;
      archiveBackupSummaryList.append(term, detail);
    });
    archiveBackupSummaryNote.textContent = isImport
      ? "Beim Import werden Archivdaten zusammengeführt. Lokale Berichte, Entwürfe, ausgelagerte Bilder und Favoriten aus der Datei werden wiederhergestellt."
      : isImported
        ? "Archivdaten wurden zusammengeführt. Lokale Berichte, Entwürfe, ausgelagerte Bilder und Favoriten wurden aus der Datei wiederhergestellt."
      : "Archivdaten, Favoriten, lokale Berichte und ausgelagerte Bilder sind in der Backup-Datei enthalten.";
    if (archiveBackupImportActions) archiveBackupImportActions.hidden = !isImport;
    archiveBackupSummary.hidden = false;
  }

  function cancelPendingBackupImport() {
    hideBackupSummary();
    if (archiveBackupFile) archiveBackupFile.value = "";
    setOptionsStatus("");
    archiveBackupImportButton && archiveBackupImportButton.focus();
  }

  async function exportAllArchiveData() {
    const originalButtonText = archiveBackupExportButton && archiveBackupExportButton.textContent;
    if (archiveBackupExportButton) {
      archiveBackupExportButton.disabled = true;
      archiveBackupExportButton.textContent = "Backup wird erstellt...";
    }
    try {
      const imageStorage = imageStorageApi();
      const indexedDbBackup = imageStorage && typeof imageStorage.exportBackup === "function"
        ? await imageStorage.exportBackup()
        : null;
      const archives = collectArchiveBackupData();
      const localStorageBackup = collectLocalStorageBackupData();
      const archiveKeys = Object.keys(archives);
      const entryCount = archiveKeys.reduce((sum, key) => sum + archives[key].length, 0);
      const storageKeys = Object.keys(localStorageBackup);
      const pointerKeyCount = storageKeys.filter(isArchivePointerStorageKey).length;
      const payload = {
        format: "FSMobileArchiveBackup",
        formatVersion: 3,
        metadata: {
          appName: "FSMobile",
          appVersion: getAppVersion(),
          exportedAt: new Date().toISOString(),
          archiveAreaCount: archiveKeys.length,
          entryCount,
          storageKeyCount: storageKeys.length,
          pointerKeyCount,
          indexedDbImageRecordCount: indexedDbBackup && Array.isArray(indexedDbBackup.records) ? indexedDbBackup.records.length : 0,
          includesFavorites: Object.prototype.hasOwnProperty.call(localStorageBackup, FAVORITES_STORAGE_KEY)
        },
        storage: {
          localStorage: localStorageBackup,
          indexedDB: indexedDbBackup
        },
        archives
      };
      const summary = backupSummaryFromPayload(payload);
      hideArchiveDeleteConfirm();
      renderBackupSummary(summary, "export");
      downloadJsonFile(`FSMobile_Backup_${todayIso()}.json`, payload);
      localStorage.setItem(LAST_BACKUP_KEY, payload.metadata.exportedAt);
      updateOptionsLastBackup();
      if (storageKeys.length || summary.imageCount) {
        setOptionsStatus(`Backup erstellt. ${summary.archiveEntryCount} Archiv-Einträge, ${summary.imageCount} ausgelagerte Bilder, ${summary.favoriteCount} Favoriten und ${summary.localReportKeyCount} lokale Datenwerte sind enthalten.`);
      } else {
        setOptionsStatus("Backup erstellt. Keine lokalen Daten vorhanden.");
      }
    } catch (error) {
      console.error("Vollständiges Backup konnte nicht erstellt werden", error);
      hideBackupSummary();
      setOptionsStatus("Backup konnte nicht vollständig erstellt werden. Es wurde keine Datei ausgegeben.");
    } finally {
      if (archiveBackupExportButton) {
        archiveBackupExportButton.disabled = false;
        archiveBackupExportButton.textContent = originalButtonText || "Backup erstellen";
      }
    }
  }

  function validateArchiveBackup(payload) {
    if (!payload || typeof payload !== "object") return false;
    if (payload.format !== "FSMobileArchiveBackup") return false;
    const hasArchives = payload.archives && typeof payload.archives === "object" && !Array.isArray(payload.archives);
    const localStorageBackup = backupLocalStoragePayload(payload);
    const hasLocalStorage = Boolean(localStorageBackup);
    if (!hasArchives && !hasLocalStorage) return false;
    const imageBackup = backupIndexedDbPayload(payload);
    const imageStorage = imageStorageApi();
    if (Number(payload.formatVersion || 0) >= 3 && (!imageBackup || !imageStorage)) return false;
    if (imageBackup) {
      if (!imageStorage || typeof imageStorage.validateBackup !== "function" || !imageStorage.validateBackup(imageBackup)) return false;
      const shadows = Object.entries(localStorageBackup || {}).filter(([key]) => isImageShadowStorageKey(key));
      if (shadows.some(([, value]) => !imageStorage.resolveBackupPayload(imageBackup, value))) return false;
    } else if (Object.keys(localStorageBackup || {}).some(isImageShadowStorageKey)) {
      return false;
    }
    return true;
  }

  function mergeArchiveEntries(storageKey, existingEntries, incomingEntries) {
    const merged = existingEntries.slice();
    let added = 0;
    let updated = 0;
    incomingEntries.forEach(rawIncoming => {
      const incoming = withoutPositionCheckboxUiMetadata(rawIncoming);
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
        merged[index] = Object.assign({}, withoutPositionCheckboxUiMetadata(existing), incoming, {
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

  async function collectCurrentImageArchives() {
    const result = new Map();
    const imageStorage = imageStorageApi();
    if (!imageStorage) return result;
    const shadows = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const shadowKey = localStorage.key(index);
      if (!isImageShadowStorageKey(shadowKey)) continue;
      const shadow = parseImageShadowValue(localStorage.getItem(shadowKey));
      if (shadow && isArchiveStorageKey(shadow.storageKey)) shadows.push(shadow);
    }
    for (const shadow of shadows) {
      const loaded = await imageStorage.loadPayload({ moduleId: shadow.moduleId, storageKey: shadow.storageKey });
      if (loaded && loaded.ok && Array.isArray(loaded.payload)) {
        result.set(shadow.storageKey, { moduleId: shadow.moduleId, entries: loaded.payload });
      }
    }
    return result;
  }

  function collectIncomingImageArchives(payload) {
    const result = new Map();
    const imageStorage = imageStorageApi();
    const imageBackup = backupIndexedDbPayload(payload);
    const localStorageBackup = backupLocalStoragePayload(payload) || {};
    if (!imageStorage || !imageBackup) return result;
    Object.entries(localStorageBackup).forEach(([key, value]) => {
      if (!isImageShadowStorageKey(key)) return;
      const resolved = imageStorage.resolveBackupPayload(imageBackup, value);
      if (resolved && isArchiveStorageKey(resolved.storageKey) && Array.isArray(resolved.payload)) {
        result.set(resolved.storageKey, { moduleId: resolved.moduleId, entries: resolved.payload });
      }
    });
    return result;
  }

  function incomingLegacyArchiveEntries(payload, storageKey) {
    const localStorageBackup = backupLocalStoragePayload(payload) || {};
    if (Object.prototype.hasOwnProperty.call(localStorageBackup, storageKey)) {
      const parsed = parseArchiveEntriesFromBackupValue(localStorageBackup[storageKey]);
      if (parsed) return parsed;
    }
    const archives = payload && payload.archives;
    return archives && Array.isArray(archives[storageKey])
      ? withoutPositionCheckboxUiMetadataFromEntries(archives[storageKey])
      : null;
  }

  async function importArchiveBackupPayload(payload, summary) {
    if (!validateArchiveBackup(payload)) {
      setOptionsStatus("Backup-Datei ungültig.");
      return;
    }
    try {
      let areaCount = 0;
      let importedCount = 0;
      let restoredStorageKeys = 0;
      const processedArchiveKeys = new Set();
      const localStorageBackup = backupLocalStoragePayload(payload);
      const imageStorage = imageStorageApi();
      const imageBackup = backupIndexedDbPayload(payload);
      const currentImageArchives = await collectCurrentImageArchives();
      const incomingImageArchives = collectIncomingImageArchives(payload);
      const imageArchiveTargets = new Map();

      new Set([...currentImageArchives.keys(), ...incomingImageArchives.keys()]).forEach(storageKey => {
        const current = currentImageArchives.get(storageKey);
        const incoming = incomingImageArchives.get(storageKey);
        const incomingEntries = incoming ? incoming.entries : incomingLegacyArchiveEntries(payload, storageKey);
        if (!incomingEntries) return;
        const existingEntries = current ? current.entries : readArchiveEntries(storageKey);
        const merged = mergeArchiveEntries(storageKey, existingEntries, incomingEntries);
        imageArchiveTargets.set(storageKey, {
          moduleId: (incoming && incoming.moduleId) || (current && current.moduleId),
          entries: merged.entries
        });
      });

      if (imageBackup) {
        const importedImages = await imageStorage.importBackup(imageBackup);
        if (!importedImages || !importedImages.ok) throw new Error("IndexedDB image import failed");
      }
      if (localStorageBackup) {
        Object.entries(localStorageBackup).forEach(([storageKey, value]) => {
          if (!storageKey || value == null) return;
          if (isImageShadowStorageKey(storageKey)) {
            const shadow = parseImageShadowValue(value);
            if (shadow && isArchiveStorageKey(shadow.storageKey)) return;
            localStorage.setItem(storageKey, String(value));
            restoredStorageKeys += 1;
            return;
          }
          if (!isArchiveStorageKey(storageKey)) {
            localStorage.setItem(storageKey, String(value));
            restoredStorageKeys += 1;
            return;
          }
          const entries = parseArchiveEntriesFromBackupValue(value);
          if (!entries) {
            localStorage.setItem(storageKey, String(value));
            restoredStorageKeys += 1;
            processedArchiveKeys.add(storageKey);
            return;
          }
          processedArchiveKeys.add(storageKey);
          if (!entries.length) {
            if (!localStorage.getItem(storageKey)) localStorage.setItem(storageKey, "[]");
            return;
          }
          const existing = readArchiveEntries(storageKey);
          const merged = mergeArchiveEntries(storageKey, existing, entries);
          writeArchiveEntries(storageKey, merged.entries);
          areaCount += 1;
          importedCount += merged.added + merged.updated;
        });
      }
      Object.entries(payload.archives || {}).forEach(([storageKey, entries]) => {
        if (processedArchiveKeys.has(storageKey)) return;
        if (!isArchiveStorageKey(storageKey) || !Array.isArray(entries) || !entries.length) return;
        const existing = readArchiveEntries(storageKey);
        const merged = mergeArchiveEntries(storageKey, existing, entries);
        writeArchiveEntries(storageKey, merged.entries);
        areaCount += 1;
        importedCount += merged.added + merged.updated;
      });
      for (const [storageKey, target] of imageArchiveTargets) {
        if (!target.moduleId || !imageStorage) throw new Error(`Image archive target invalid: ${storageKey}`);
        const saved = await imageStorage.savePayload({
          moduleId: target.moduleId,
          storageKey,
          payload: target.entries
        });
        if (!saved || !saved.ok) throw new Error(`Image archive merge failed: ${storageKey}`);
      }
      if (!areaCount && !importedCount && !restoredStorageKeys && !imageArchiveTargets.size) {
        setOptionsStatus("Keine Archivdaten gefunden.");
        return;
      }
      refreshOpenArchiveLists();
      renderBackupSummary(summary || backupSummaryFromPayload(payload), "imported");
      if (archiveBackupSummaryTitle) archiveBackupSummaryTitle.textContent = "Backup importiert";
      const importedImageCount = summary && Number(summary.imageCount || 0);
      setOptionsStatus(`Import erfolgreich. ${importedCount} Archiv-Einträge, ${importedImageCount} ausgelagerte Bilder und ${restoredStorageKeys} Datenwerte eingespielt.`);
    } catch (error) {
      console.error("Backup-Import fehlgeschlagen", error);
      setOptionsStatus("Import fehlgeschlagen.");
    }
  }

  async function importArchiveBackupFile(file) {
    if (!file) return;
    hideArchiveDeleteConfirm();
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!validateArchiveBackup(payload)) {
        hideBackupSummary();
        setOptionsStatus("Backup-Datei ungültig.");
        return;
      }
      pendingBackupImportPayload = payload;
      pendingBackupImportSummary = backupSummaryFromPayload(payload);
      renderBackupSummary(pendingBackupImportSummary, "import");
      setOptionsStatus("Backup-Datei geprüft. Bitte Zusammenfassung vor dem Import bestätigen.");
      window.setTimeout(() => archiveBackupImportConfirmButton && archiveBackupImportConfirmButton.focus(), 40);
    } catch (error) {
      hideBackupSummary();
      setOptionsStatus(error instanceof SyntaxError ? "Backup-Datei ungültig." : "Backup-Datei konnte nicht gelesen werden.");
    } finally {
      if (archiveBackupFile) archiveBackupFile.value = "";
    }
  }

  async function confirmPendingBackupImport() {
    const payload = pendingBackupImportPayload;
    const summary = pendingBackupImportSummary;
    pendingBackupImportPayload = null;
    pendingBackupImportSummary = null;
    if (!payload) {
      hideBackupSummary();
      setOptionsStatus("Keine Backup-Datei zum Import vorgemerkt.");
      return;
    }
    const originalText = archiveBackupImportConfirmButton && archiveBackupImportConfirmButton.textContent;
    if (archiveBackupImportConfirmButton) {
      archiveBackupImportConfirmButton.disabled = true;
      archiveBackupImportConfirmButton.textContent = "Import läuft...";
    }
    try {
      await importArchiveBackupPayload(payload, summary);
    } finally {
      if (archiveBackupImportConfirmButton) {
        archiveBackupImportConfirmButton.disabled = false;
        archiveBackupImportConfirmButton.textContent = originalText || "Importieren";
      }
    }
  }

  async function deleteAllArchiveData() {
    hideArchiveDeleteConfirm();
    try {
      const { archiveKeys, pointerKeys } = collectArchiveStorageKeys();
      const entryCount = archiveKeys.reduce((sum, key) => sum + readArchiveEntries(key).length, 0);
      if (!archiveKeys.length && !pointerKeys.length) {
        setOptionsStatus("Keine Archivdaten vorhanden.");
        return;
      }
      const imageStorage = imageStorageApi();
      if (imageStorage) {
        const deletion = await imageStorage.deleteByStorageKeys(archiveKeys);
        if (!deletion || !deletion.ok) throw new Error("IndexedDB archive deletion failed");
      }
      archiveKeys.concat(pointerKeys).forEach(key => localStorage.removeItem(key));
      refreshOpenArchiveLists();
      setOptionsStatus(archiveKeys.length || entryCount ? "Archivdaten gelöscht." : "Keine Archivdaten vorhanden.");
      refreshOptionsSecuritySummary();
    } catch {
      setOptionsStatus("Archivdaten konnten nicht gelöscht werden.");
    }
  }

  function createFavoriteButton(id, isFavorite) {
      const button = document.createElement("button");
      button.className = `favorite-toggle${isFavorite ? " is-active" : ""}`;
      button.type = "button";
      button.textContent = "★";
      button.setAttribute("aria-pressed", String(isFavorite));
      button.setAttribute("aria-label", isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen");
      button.title = isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen";
      button.addEventListener("click", event => {
        event.stopPropagation();
        setFavorite(id, !isFavorite);
      });
      return button;
  }

  function createFavoriteMoveButton(id, direction, disabled) {
      const button = document.createElement("button");
      button.className = "favorite-move-button favorite-sort-control";
      button.type = "button";
      button.textContent = direction < 0 ? "‹" : "›";
      button.disabled = Boolean(disabled);
      button.setAttribute("aria-label", direction < 0 ? "Favorit nach links verschieben" : "Favorit nach rechts verschieben");
      button.title = direction < 0 ? "Nach links" : "Nach rechts";
      button.addEventListener("click", event => {
        event.stopPropagation();
        moveFavorite(id, direction);
      });
      return button;
  }

  function createModuleCard(id, module, sectionId, options = {}) {
      const card = document.createElement("article");
      const isFavorite = Array.isArray(options.favoriteIds)
        ? options.favoriteIds.includes(id)
        : loadFavoriteIds().includes(id);
      const sourceSectionId = options.sourceSectionId || sectionId;
      card.className = `module-card has-card-actions${options.isFavoriteSection ? " favorite-card" : ""}`;
      if (options.isFavoriteSection && sourceSectionId) {
        card.classList.add(`favorite-card-accent-${sourceSectionId}`);
      }
      card.dataset.moduleId = id;

      const body = document.createElement("div");
      body.className = "module-card-body";
      const type = document.createElement("div");
      type.className = "module-kicker";
      type.textContent = KICKERS[sourceSectionId] || module.group || "Modul";
      const title = document.createElement("h3");
      title.textContent = CARD_TITLES[id] || module.title;
      const description = document.createElement("p");
      description.textContent = module.description || "Bestehende FSMobile-Funktion.";
      body.append(type, title, description);

      if (options.isFavoriteSection) {
        const controls = document.createElement("div");
        controls.className = "favorite-card-actions";
        controls.append(
          createFavoriteMoveButton(id, -1, options.favoriteIndex <= 0),
          createFavoriteMoveButton(id, 1, options.favoriteIndex >= options.favoriteCount - 1),
          createFavoriteButton(id, true)
        );
        card.append(controls);
      } else {
        card.append(createFavoriteButton(id, isFavorite));
      }

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
      brand.style.transition = "transform 0.52s var(--menu-ease), opacity 0.46s var(--menu-ease)";
      brand.style.transform = "translate3d(0, 0, 0)";
    });

    brandTransitionTimer = window.setTimeout(() => {
      brand.style.transition = "";
      brand.style.transform = "";
    }, 560);
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
      view.classList.remove("view-enter", "view-enter-active", "view-exit", "quick-switch-exit", "quick-switch-enter", "quick-switch-enter-active");
    });
  }

  function runQuickSwitchTransition(updateContent) {
    if (typeof updateContent !== "function") return;
    if (prefersReducedMotion() || moduleView.hidden) {
      updateContent();
      return;
    }
    resetViewTransitionState();
    moduleView.classList.add("quick-switch-exit");
    setViewTransitionTimer(() => {
      updateContent();
      moduleView.classList.remove("quick-switch-exit");
      moduleView.classList.add("quick-switch-enter");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          moduleView.classList.add("quick-switch-enter-active");
          setViewTransitionTimer(() => {
            moduleView.classList.remove("quick-switch-enter", "quick-switch-enter-active");
          }, 180);
        });
      });
    }, 90);
  }

  function enterView(view) {
    view.hidden = false;
    view.classList.add("view-enter");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        view.classList.add("view-enter-active");
        setViewTransitionTimer(() => {
          view.classList.remove("view-enter", "view-enter-active");
        }, 180);
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
    }, 110);
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
    }, 110);
  }

  function menuFavoritesDockScrollTop() {
    if (!menuView || !moduleGrid) return 0;
    const favoritesSection = moduleGrid.querySelector(".menu-section.accent-favorites");
    if (!favoritesSection) return 0;
    const menuRect = menuView.getBoundingClientRect();
    const favoritesRect = favoritesSection.getBoundingClientRect();
    return Math.max(0, Math.round(menuView.scrollTop + favoritesRect.top - menuRect.top));
  }

  function resetMenuScrollPosition() {
    const targetTop = menuFavoritesDockScrollTop();
    try {
      menuView.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
    } catch (error) {
      menuView.scrollTop = targetTop;
      menuView.scrollLeft = 0;
    }
  }

  function scheduleMenuScrollReset() {
    resetMenuScrollPosition();
    window.requestAnimationFrame(() => {
      resetMenuScrollPosition();
      window.requestAnimationFrame(resetMenuScrollPosition);
    });
    window.setTimeout(resetMenuScrollPosition, 360);
    window.setTimeout(resetMenuScrollPosition, 760);
  }

  function resetMenuSearchForFavoriteDock() {
    if (!menuSearchQuery && (!menuSearchInput || !menuSearchInput.value)) return;
    menuSearchQuery = "";
    if (menuSearchInput) menuSearchInput.value = "";
    renderMenu();
  }

  function reportSignatureStorageKeys(moduleId) {
    const keys = {
      "pb-feuerloescher": ["pb-feuerloescher-current-v2"],
      "pb-brandschutztueren": ["pb-brandschutztueren-current-v2"],
      "pb-rwa": ["rwa_pruefbericht_formular_v1"],
      "pb-not-sicherheitsbeleuchtung": ["pb-not-sicherheitsbeleuchtung-current-v1"],
      "pb-brandschutzklappen": ["pb-brandschutzklappen-current-v1"],
      "pb-brandschutzschiebetor": ["pb-brandschutzschiebetor-current-v1"],
      "pb-brandschutzrolltore": ["pb-brandschutzrolltore-current-v1"],
      "pb-rolltoranlagen": ["pb-rolltoranlagen-current-v1"],
      "pb-schiebetuerantrieb": ["pb-schiebetuerantrieb-current-v1"],
      "pb-drehfluegelantrieb": ["pb-drehfluegelantrieb-current-v1"],
      "pb-rauchschutzvorhaenge": ["pb-rauchschutzvorhaenge-current-v1"],
      "pb-feststellanlagen": ["pb-feststellanlagen-current-v1"],
      "pb-fluchttuer-steuerungen": ["pb-fluchttuer-steuerungen-current-v1"],
      "pb-druckerhoehungsanlage": ["pb-druckerhoehungsanlage-report-v1"],
      "pb-nass-trocken-station": ["fsmobile-pb-nass-trocken-station-v1"],
      "pb-loeschwasser-trocken": ["pb-loeschwasser-trocken-report-v1"],
      "pb-loeschwasser-nass": ["fsmobile-pb-loeschwasser-nass-v1"],
      "pb-zentralbatterie-anlage": ["fsmobile-pb-zentralbatterie-v1"],
      "pb-wandhydranten": ["pb-wandhydranten-report-v1"],
      "pb-hydranten": ["fsmobile-pb-hydranten-v1"],
      "pb-rauchwarnmelder": ["pb-rauchwarnmelder-current-v1"]
    }[moduleId] || [];
    return [`fsmobile-generated-techniker-signature:${moduleId}`, ...keys];
  }

  function reportSignatureDataUrlFromValue(value, depth = 0) {
    if (!value || depth > 5) return "";
    if (typeof value === "string") {
      return /^data:image\/png;base64,/i.test(value) && value.length > 18000 ? value : "";
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = reportSignatureDataUrlFromValue(item, depth + 1);
        if (found) return found;
      }
      return "";
    }
    if (typeof value !== "object") return "";
    const preferredKeys = [
      "signature",
      "signatureData",
      "signaturePad",
      "technikerSignature",
      "technicianSignature",
      "unterschrift",
      "digitaleUnterschrift",
      "signatur",
      "fsmobileSignature",
      "fsmobileTechnikerSignature"
    ];
    for (const key of preferredKeys) {
      const found = reportSignatureDataUrlFromValue(value[key], depth + 1);
      if (found) return found;
    }
    for (const key of Object.keys(value)) {
      if (!/signature|signatur|unterschrift/i.test(key)) continue;
      const found = reportSignatureDataUrlFromValue(value[key], depth + 1);
      if (found) return found;
    }
    return "";
  }

  function stripReportSignatureFields(value, depth = 0) {
    if (!value || depth > 6 || typeof value !== "object") return value;
    if (Array.isArray(value)) {
      value.forEach(item => stripReportSignatureFields(item, depth + 1));
      return value;
    }
    [
      "signature",
      "signatureData",
      "signaturePad",
      "technikerSignature",
      "technicianSignature",
      "unterschrift",
      "digitaleUnterschrift",
      "signatur",
      "fsmobileSignature",
      "fsmobileTechnikerSignature"
    ].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(value, key)) delete value[key];
    });
    Object.keys(value).forEach(key => {
      if (/signature|signatur|unterschrift/i.test(key)) {
        delete value[key];
      } else {
        stripReportSignatureFields(value[key], depth + 1);
      }
    });
    return value;
  }

  function removeStoredModuleSignature(moduleId) {
    reportSignatureStorageKeys(moduleId).forEach(storageKey => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        if (/^data:image\/png;base64,/i.test(raw)) {
          localStorage.removeItem(storageKey);
          return;
        }
        const payload = JSON.parse(raw);
        stripReportSignatureFields(payload);
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {}
    });
  }

  function readStoredModuleSignature(moduleId) {
    if ((signatureClearUntilByModule.get(moduleId) || 0) > Date.now()) return "";
    for (const storageKey of reportSignatureStorageKeys(moduleId)) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) continue;
        if (/^data:image\/png;base64,/i.test(raw)) return raw;
        const signature = reportSignatureDataUrlFromValue(JSON.parse(raw));
        if (signature) return signature;
      } catch {}
    }
    return "";
  }

  function drawSignatureDataUrlToCanvas(canvas, dataUrl) {
    if (!canvas || !dataUrl) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();
    image.onload = () => {
      const ratio = window.devicePixelRatio || 1;
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.restore();
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 2.4;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#1c1c1e";
    };
    image.src = dataUrl;
  }

  function rehydrateModuleSignature(moduleId) {
    if (moduleId !== activeModuleId) return;
    if ((signatureClearUntilByModule.get(moduleId) || 0) > Date.now()) return;
    const doc = frameDocument();
    if (!doc) return;
    const signature = readStoredModuleSignature(moduleId);
    const reportCanvas = doc.querySelector("#signaturePad");
    if (signature && reportCanvas) drawSignatureDataUrlToCanvas(reportCanvas, signature);
    const generatedCanvas = doc.querySelector("#fsmobileTechnikerSignaturePad");
    if (generatedCanvas) {
      try {
        const generated = localStorage.getItem(`fsmobile-generated-techniker-signature:${moduleId}`) || "";
        if (generated) drawSignatureDataUrlToCanvas(generatedCanvas, generated);
      } catch {}
    }
  }

  function scheduleModuleSignatureRehydration(moduleId) {
    [120, 360, 900].forEach(delay => {
      window.setTimeout(() => rehydrateModuleSignature(moduleId), delay);
    });
  }

  function moduleDisplayName(id) {
    const module = registry[id];
    return (module && module.title) || CARD_TITLES[id] || id || "Modul";
  }

  function updateQuickSwitchButton() {
    if (!quickSwitchButton) return;
    const canSwitch = Boolean(activeModuleId && previousModuleId && previousModuleId !== activeModuleId && registry[previousModuleId]);
    quickSwitchButton.hidden = !canSwitch;
    quickSwitchButton.disabled = !canSwitch;
    if (canSwitch) {
      const label = `Zuletzt geöffnetes Modul öffnen: ${moduleDisplayName(previousModuleId)}`;
      quickSwitchButton.setAttribute("aria-label", label);
      quickSwitchButton.title = label;
    } else {
      quickSwitchButton.setAttribute("aria-label", "Zuletzt geöffnetes Modul öffnen");
      quickSwitchButton.title = "Schnellwechsel";
    }
  }

  function rememberPreviousModule(nextModuleId) {
    if (activeModuleId && activeModuleId !== nextModuleId && registry[activeModuleId]) {
      previousModuleId = activeModuleId;
    }
  }

  function frameModuleApi(doc = frameDocument()) {
    try {
      const api = doc && doc.defaultView ? doc.defaultView.FSMOBILE_MODULE_API : null;
      if (!api || api.version !== 1 || api.moduleId !== activeModuleId) return null;
      return api;
    } catch (error) {
      return null;
    }
  }

  function firstFrameModuleFunction(win, names) {
    if (!win) return null;
    for (const name of names) {
      try {
        if (typeof win[name] === "function") return win[name].bind(win);
      } catch (error) {}
    }
    return null;
  }

  function installFrameModuleApiAdapter(id, module) {
    const doc = frameDocument();
    const win = doc && doc.defaultView;
    if (!doc || !win || !win.FSMOBILE_STANDARD || typeof win.FSMOBILE_STANDARD.createModuleApi !== "function") return null;
    try {
      const existing = win.FSMOBILE_MODULE_API;
      if (existing && existing.version === 1 && existing.moduleId === id) return existing;
    } catch (error) {}

    const contract = module && module.apiContract && typeof module.apiContract === "object"
      ? module.apiContract
      : {};
    const storageSource = contract.storage && typeof contract.storage === "object" ? contract.storage : {};
    const storage = {
      current: String(storageSource.current || ""),
      archive: String(storageSource.archive || ""),
      pointer: String(storageSource.pointer || "")
    };
    const legacyActions = collectFrameActionButtons(doc);
    const actions = {};
    legacyActions.forEach(({ key, source }) => {
      if (!source) return;
      actions[key] = {
        invoke: function() {
          source.click();
          return true;
        },
        isDisabled: function() {
          return Boolean(source.disabled);
        }
      };
    });

    const stateBridge = win.FSMOBILE_MODULE_STATE_BRIDGE && typeof win.FSMOBILE_MODULE_STATE_BRIDGE === "object"
      ? win.FSMOBILE_MODULE_STATE_BRIDGE
      : {};
    const collect = typeof stateBridge.collect === "function" ? stateBridge.collect : firstFrameModuleFunction(win, [
      "collectData",
      "collectReportData",
      "getCurrentReport",
      "getFormValues",
      "values",
      "collectFormData"
    ]);
    const apply = typeof stateBridge.apply === "function" ? stateBridge.apply : firstFrameModuleFunction(win, [
      "applyData",
      "applyReportData",
      "applyReport",
      "applyFormValues",
      "apply"
    ]);
    let flush = typeof stateBridge.flush === "function" ? stateBridge.flush : firstFrameModuleFunction(win, [
      "flushCurrentReportSave",
      "saveToStorageNow",
      "saveFormNow",
      "persistFormNow",
      "saveCurrentReport",
      "saveFormToStorage",
      "saveCurrentDraft",
      "saveForm",
      "saveToStorage",
      "save"
    ]);
    if (!flush && collect && storage.current) {
      flush = function() {
        try {
          win.localStorage.setItem(storage.current, JSON.stringify(collect()));
          return true;
        } catch (error) {
          return false;
        }
      };
    }
    const declaredCapabilities = contract.capabilities && typeof contract.capabilities === "object"
      ? contract.capabilities
      : {};
    const capabilities = {
      draft: Boolean(declaredCapabilities.draft || storage.current),
      archive: Boolean(storage.archive || actions.save || actions.archive),
      pdf: Boolean(declaredCapabilities.pdf || actions.pdf),
      signatures: Boolean(
        declaredCapabilities.signatures ||
        doc.querySelector("canvas[id*='signature' i], canvas[id*='signatur' i], [data-signature]")
      ),
      import: Boolean(actions.import),
      export: Boolean(actions.export)
    };

    const api = win.FSMOBILE_STANDARD.createModuleApi({
      moduleId: id,
      storage,
      capabilities,
      state: { collect, apply },
      lifecycle: { flush },
      actions
    });
    win.FSMOBILE_MODULE_API = api;
    return api;
  }

  function frameSafeStorageSnapshot(win) {
    try {
      const safeStorage = win && win.FSMOBILE_SAFE_STORAGE;
      if (safeStorage && typeof safeStorage.snapshot === "function") {
        const snapshot = safeStorage.snapshot();
        return snapshot && typeof snapshot === "object" ? snapshot : { sequence: 0, lastResult: null };
      }
    } catch (error) {}
    return { sequence: 0, lastResult: null };
  }

  function frameFlushOutcome(before, after, returned, error, attempted) {
    const result = after && Number(after.sequence || 0) > Number(before && before.sequence || 0)
      ? after.lastResult
      : returned && typeof returned === "object" && Object.prototype.hasOwnProperty.call(returned, "ok")
        ? returned
        : null;
    if (result && result.ok === false) {
      return { ok: false, attempted: Boolean(attempted), code: String(result.code || "write-failed"), result };
    }
    if (error || returned === false) {
      return { ok: false, attempted: Boolean(attempted), code: "write-failed", error: error || null };
    }
    return { ok: true, attempted: Boolean(attempted), code: result && result.code ? String(result.code) : "ok", result };
  }

  function flushFailureMessage(outcome) {
    return outcome && outcome.code === "quota-exceeded"
      ? "Speicher voll. Das aktuelle Modul bleibt geöffnet; der letzte gültige Stand ist erhalten. Bitte Bericht exportieren oder Archivdaten löschen."
      : "Eingaben konnten nicht sicher gespeichert werden. Das aktuelle Modul bleibt geöffnet; der letzte gültige Stand ist erhalten.";
  }

  function keepActiveModuleAfterFlushFailure(outcome) {
    quickSwitchTransitionPending = false;
    if (activeModuleId) {
      history.replaceState({ module: activeModuleId }, "", `#${encodeURIComponent(activeModuleId)}`);
      subtitle.textContent = moduleDisplayName(activeModuleId);
    }
    showAppToast(flushFailureMessage(outcome));
    return false;
  }

  function flushActiveModuleState() {
    const doc = frameDocument();
    if (!doc || !doc.body) return { ok: true, attempted: false, code: "no-frame" };
    let win = null;
    try {
      win = frame.contentWindow;
    } catch (error) {
      win = null;
    }
    if (!win) return { ok: true, attempted: false, code: "no-window" };
    const beforeInteraction = frameSafeStorageSnapshot(win);
    try {
      const activeElement = doc.activeElement;
      if (activeElement && activeElement.matches && activeElement.matches("input, textarea, select")) {
        activeElement.dispatchEvent(new Event("input", { bubbles: true }));
        activeElement.dispatchEvent(new Event("change", { bubbles: true }));
        if (typeof activeElement.blur === "function") activeElement.blur();
      }
    } catch (error) {}

    const api = frameModuleApi(doc);
    if (api && api.lifecycle && typeof api.lifecycle.flush === "function") {
      let returned;
      let flushError = null;
      try {
        returned = api.lifecycle.flush();
      } catch (error) {
        flushError = error;
      }
      return frameFlushOutcome(beforeInteraction, frameSafeStorageSnapshot(win), returned, flushError, true);
    }

    const fallbackNames = [
      "saveToStorageNow",
      "saveFormToStorage",
      "saveCurrentDraft",
      "saveForm",
      "saveToStorage"
    ];
    for (const name of fallbackNames) {
      const fn = win[name];
      if (typeof fn !== "function") continue;
      let returned;
      let flushError = null;
      try {
        returned = fn.call(win);
      } catch (error) {
        flushError = error;
      }
      return frameFlushOutcome(beforeInteraction, frameSafeStorageSnapshot(win), returned, flushError, true);
    }
    return { ok: true, attempted: false, code: "no-flush" };
  }

  let lastPageLifecycleFlushAt = 0;
  let lastPageLifecycleFlushOutcome = null;
  let pendingPageLifecycleFlushFailure = null;

  function emitPageLifecycleFlush(source, outcome, deduplicated) {
    try {
      window.dispatchEvent(new CustomEvent("fsmobile:lifecycle-flush", {
        detail: {
          source: String(source || "unknown"),
          moduleId: activeModuleId || "",
          ok: Boolean(outcome && outcome.ok),
          attempted: Boolean(outcome && outcome.attempted),
          code: String(outcome && outcome.code || "unknown"),
          deduplicated: Boolean(deduplicated),
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.warn("Lifecycle-Ergebnis konnte nicht gemeldet werden.", error);
    }
  }

  function flushActiveModuleForPageLifecycle(source) {
    const now = Date.now();
    if (lastPageLifecycleFlushOutcome && now - lastPageLifecycleFlushAt < 80) {
      emitPageLifecycleFlush(source, lastPageLifecycleFlushOutcome, true);
      return lastPageLifecycleFlushOutcome;
    }

    const outcome = flushActiveModuleState();
    lastPageLifecycleFlushAt = Date.now();
    lastPageLifecycleFlushOutcome = outcome;
    if (!outcome.ok) {
      pendingPageLifecycleFlushFailure = outcome;
      console.warn("Eingaben konnten beim App-Hintergrundwechsel nicht sicher gespeichert werden.", outcome);
    }
    emitPageLifecycleFlush(source, outcome, false);
    return outcome;
  }

  function reportPendingPageLifecycleFlushFailure() {
    if (!pendingPageLifecycleFlushFailure) return;
    const outcome = pendingPageLifecycleFlushFailure;
    pendingPageLifecycleFlushFailure = null;
    showAppToast(flushFailureMessage(outcome));
  }

  function loadLazyModuleDefinition(id, module) {
    if (module && typeof module.html === "string" && module.html.trim()) return Promise.resolve(module);
    if (moduleDefinitionLoads.has(id)) return moduleDefinitionLoads.get(id);

    const source = module && module.lazy && typeof module.lazy.src === "string"
      ? module.lazy.src.trim()
      : "";
    if (!source) return Promise.reject(new Error(`Moduldefinition fehlt: ${id}`));

    let sourceUrl = null;
    try {
      sourceUrl = new URL(source, document.baseURI);
      if (sourceUrl.origin !== location.origin) throw new Error("fremder Ursprung");
    } catch (error) {
      return Promise.reject(new Error(`Ungueltige Modulquelle: ${id}`));
    }

    const request = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = sourceUrl.href;
      script.dataset.fsmobileModuleDefinition = id;
      script.addEventListener("load", () => {
        const loaded = registry[id];
        if (!loaded || typeof loaded.html !== "string" || !loaded.html.trim()) {
          reject(new Error(`Moduldefinition wurde nicht registriert: ${id}`));
          return;
        }
        resolve(loaded);
      }, { once: true });
      script.addEventListener("error", () => {
        script.remove();
        reject(new Error(`Moduldefinition konnte nicht geladen werden: ${id}`));
      }, { once: true });
      document.head.appendChild(script);
    });
    const trackedRequest = request.catch(error => {
      if (moduleDefinitionLoads.get(id) === trackedRequest) moduleDefinitionLoads.delete(id);
      throw error;
    });
    moduleDefinitionLoads.set(id, trackedRequest);
    return trackedRequest;
  }

  function loadModuleContent(id, module, replaceHistory) {
    finishTitleStartAnimation();
    const html = decorateModuleHtml(module.html, id, module.title);
    activeModuleId = id;
    if (topbar) topbar.classList.add("is-module-active");
    applyModuleHeadingAccent(id);
    clearModuleActionBar();
    updateMenuOptionsVisibility();
    frame.addEventListener("load", () => {
      installFrameModuleApiAdapter(id, module);
      scheduleModuleSignatureRehydration(id);
      window.dispatchEvent(new CustomEvent("fsmobile:module-ready", { detail: { moduleId: id } }));
    }, { once: true });
    frame.srcdoc = html;
    frame.title = module.title;
    backButton.hidden = false;
    updateQuickSwitchButton();
    subtitle.textContent = module.title;
    switchToModuleView();

    if (!replaceHistory) {
      history.pushState({ module: id }, "", `#${encodeURIComponent(id)}`);
    }
    window.setTimeout(syncModuleActionBar, 180);
    window.setTimeout(syncModuleActionBar, 520);
    scheduleModuleSignatureRehydration(id);
  }

  async function openModule(id, replaceHistory) {
    if (!isUnlocked) {
      showAuth();
      return;
    }

    let module = registry[id];
    if (!module) return;

    const shouldAnimateQuickSwitch = Boolean(
      quickSwitchTransitionPending &&
      activeModuleId &&
      activeModuleId !== id &&
      !moduleView.hidden
    );
    quickSwitchTransitionPending = false;
    if (activeModuleId && activeModuleId !== id) {
      const flushOutcome = flushActiveModuleState();
      if (!flushOutcome.ok) return keepActiveModuleAfterFlushFailure(flushOutcome);
    }

    const requestId = ++moduleOpenRequest;

    if (typeof module.html !== "string" || !module.html.trim()) {
      subtitle.textContent = `${module.title || moduleDisplayName(id)} wird geladen …`;
      try {
        module = await loadLazyModuleDefinition(id, module);
      } catch (error) {
        if (requestId === moduleOpenRequest) {
          subtitle.textContent = activeModuleId ? moduleDisplayName(activeModuleId) : "Menüauswahl";
          showAppToast("Modul konnte nicht geladen werden.");
        }
        console.error(error);
        return;
      }
    }

    if (requestId !== moduleOpenRequest) return;
    rememberPreviousModule(id);

    if (shouldAnimateQuickSwitch) {
      runQuickSwitchTransition(() => loadModuleContent(id, module, replaceHistory));
      return;
    }
    loadModuleContent(id, module, replaceHistory);
  }

  function showMenu(replaceHistory) {
    if (!isUnlocked) {
      showAuth();
      return;
    }

    if (activeModuleId) {
      const flushOutcome = flushActiveModuleState();
      if (!flushOutcome.ok) return keepActiveModuleAfterFlushFailure(flushOutcome);
    }
    moduleOpenRequest += 1;
    rememberPreviousModule(null);
    resetMenuSearchForFavoriteDock();
    activeModuleId = null;
    if (topbar) topbar.classList.remove("is-module-active");
    clearModuleHeadingAccent();
    clearModuleActionBar();
    updateMenuOptionsVisibility();
    backButton.hidden = true;
    updateQuickSwitchButton();
    subtitle.textContent = "Menüauswahl";
    scheduleMenuScrollReset();
    switchToMenuView(() => {
      frame.srcdoc = "";
      updateMenuOptionsVisibility();
      scheduleMenuScrollReset();
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
    window.FSMOBILE_UI?.hideToast();
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
    const api = frameModuleApi(doc);
    return order.flatMap(key => {
      const source = found.get(key) || null;
      const apiAction = api && api.actions ? api.actions[key] : null;
      if (!source && (!apiAction || typeof apiAction.invoke !== "function")) return [];
      let disabled = Boolean(source && source.disabled);
      if (apiAction && typeof apiAction.isDisabled === "function") {
        try {
          disabled = Boolean(apiAction.isDisabled());
        } catch (error) {}
      }
      return [{
        key,
        source,
        disabled,
        provider: apiAction ? "module-api" : "legacy-dom",
        invoke: apiAction && typeof apiAction.invoke === "function" ? apiAction.invoke : null
      }];
    });
  }

  function readFrameArchiveStatus(doc) {
    if (!doc) return "";
    const status = doc.querySelector("#archiveStatus, .archive-status");
    return status ? (status.textContent || "").replace(/\s+/g, " ").trim() : "";
  }

  function frameFormFingerprint(doc) {
    if (!doc) return "";
    const fields = Array.from(doc.querySelectorAll("input, textarea, select"))
      .filter(field => {
        if (field.closest(".archive-dialog, .archive-overlay, .pdf-render-wrapper")) return false;
        const type = String(field.type || "").toLowerCase();
        return !["button", "file", "hidden", "image", "reset", "submit"].includes(type);
      })
      .map(field => {
        const key = field.name || field.id || field.getAttribute("aria-label") || field.dataset.field || field.tagName;
        const type = String(field.type || "").toLowerCase();
        const value = type === "checkbox" || type === "radio" ? String(Boolean(field.checked)) : String(field.value || "");
        return `${field.tagName}:${key}:${type}:${value}`;
      });
    return JSON.stringify(fields);
  }

  function appToastShows(pattern) {
    const toast = document.getElementById("appToast");
    if (!toast || toast.hidden) return false;
    return pattern.test(document.getElementById("appToastText")?.textContent || "");
  }

  function notifyClearActionStatusIfNeeded(doc, beforeState, toastOnlyStatus) {
    if (!beforeState || appToastShows(/geleert/i)) return;
    const statusText = readFrameArchiveStatus(doc);
    const beforeStatus = normalizeShellStatusMessage(beforeState.status);
    const normalizedStatus = normalizeShellStatusMessage(statusText);
    if (normalizedStatus && normalizedStatus !== beforeStatus) {
      if (toastOnlyStatus) showAppToast(normalizedStatus);
      else updateModuleActionStatus(normalizedStatus);
      return;
    }
    const afterFingerprint = frameFormFingerprint(doc);
    if (beforeState.fingerprint && afterFingerprint && beforeState.fingerprint !== afterFingerprint) {
      if (toastOnlyStatus) showAppToast("Formular geleert.");
      else updateModuleActionStatus("Formular geleert.");
    }
  }

  function updateModuleActionStatus(message) {
    const status = document.getElementById("moduleActionStatus");
    const normalized = normalizeShellStatusMessage(message);
	    if (status) {
	      status.textContent = normalized;
	      status.hidden = !normalized;
	    }
	    if (normalized) showAppToast(normalized);
	  }

	  function moduleUsesToastOnlyStatus(id) {
	    return [
	      "auftrag-bescheinigungen",
	      "planungshilfe-bma",
	      "maengelliste",
	      "maengelliste-bilddoku",
	      "maengelliste-maengelbeschreibungen",
	      "aufmass-akku",
	      "aufmass-einsteckschloss",
	      "aufmass-tueren",
	      "aufmass-brandabschottungen",
	      "pb-feuerloescher",
	      "pb-brandschutztueren",
	      "pb-druckpruefung-din-14462",
	      "pb-hydranten"
	    ].includes(id || "");
	  }

	  window.addEventListener("message", event => {
	    const data = event.data || {};
	    if (!data) return;
	    if (data.type === "fsmobile-signature-clear") {
	      if (data.moduleId && data.moduleId !== activeModuleId) return;
	      const moduleId = data.moduleId || activeModuleId;
	      if (!moduleId) return;
	      signatureClearUntilByModule.set(moduleId, Date.now() + 4200);
	      removeStoredModuleSignature(moduleId);
	      return;
	    }
	    if (data.type === "fsmobile-toast") {
	      if (data.moduleId && data.moduleId !== activeModuleId) return;
	      showAppToast(String(data.message || ""));
	      return;
	    }
	    if (data.type !== "fsmobile-action-status") return;
	    if (data.moduleId && data.moduleId !== activeModuleId) return;
	    if (moduleUsesToastOnlyStatus(activeModuleId)) {
	      const status = document.getElementById("moduleActionStatus");
	      if (status) {
	        status.textContent = "";
	        status.hidden = true;
	      }
	      const normalized = normalizeShellStatusMessage(String(data.message || ""));
	      if (normalized) showAppToast(normalized);
	      return;
	    }
	    updateModuleActionStatus(String(data.message || ""));
	  });

  function syncModuleActionStatus() {
    const doc = frameDocument();
    updateModuleActionStatus(readFrameArchiveStatus(doc));
  }

  const pendingClearDialogs = new WeakSet();
  async function activateFrameAction(key, approved = false) {
    const doc = frameDocument();
    if (!doc) return;
    const action = collectFrameActionButtons(doc).find(item => item.key === key);
    if (!action || action.disabled) return;
    if (!approved && window.FSMOBILE_UI) {
      if (key === "pdf") {
        return window.FSMOBILE_UI.exportDialog(doc.defaultView, activeModuleId, () => activateFrameAction(key, true));
      }
      if (key === "clear") {
        if (pendingClearDialogs.has(doc)) return;
        pendingClearDialogs.add(doc);
        try {
          const confirmed = await window.FSMOBILE_UI.confirm("Die aktuellen Formulareingaben werden geleert. Andere Archiveinträge bleiben erhalten.", "Formular leeren?", "Leeren");
          if (!confirmed || frameDocument() !== doc) return;
          return window.FSMOBILE_UI.withConfirmation(doc.defaultView, () => activateFrameAction(key, true));
        } finally { pendingClearDialogs.delete(doc); }
      }
    }
    const toastOnlyStatus = moduleUsesToastOnlyStatus(activeModuleId);
    const clearBeforeState = key === "clear"
      ? { fingerprint: frameFormFingerprint(doc), status: readFrameArchiveStatus(doc) }
      : null;
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
    if (key === "pdf") {
      if (toastOnlyStatus) showAppToast("PDF Export wird erstellt...");
      else updateModuleActionStatus("PDF Export wird erstellt...");
    }
    try {
      const result = action.invoke ? action.invoke() : action.source && action.source.click();
      if (key === "pdf" && result && typeof result.then === "function") await result;
      if (result && typeof result.catch === "function") {
        result.catch(error => {
          console.error("FSMobile Modulaktion fehlgeschlagen.", error);
          showAppToast("Aktion konnte nicht ausgeführt werden.");
        });
      }
    } catch (error) {
      console.error("FSMobile Modulaktion fehlgeschlagen.", error);
      if (key === "pdf" && approved) throw error;
      showAppToast("Aktion konnte nicht ausgeführt werden.");
      return;
    }
    if (key === "archive") {
      if (toastOnlyStatus) showAppToast("Archiv wurde geöffnet.");
      else updateModuleActionStatus("Archiv wurde geöffnet.");
    }
    if (key === "clear") {
      [80, 240, 700].forEach(delay => window.setTimeout(() => {
        notifyClearActionStatusIfNeeded(frameDocument(), clearBeforeState, toastOnlyStatus);
      }, delay));
    }
    if (!toastOnlyStatus) {
      [80, 240, 700].forEach(delay => window.setTimeout(syncModuleActionStatus, delay));
    }
	    window.setTimeout(syncModuleActionBar, 120);
	  }

  window.FSMOBILE_UI?.setActionHandler(activateFrameAction);

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
    actions.forEach(({ key, disabled, provider }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `module-action-button ${actionClass(key)}`;
      button.dataset.actionKey = key;
      button.textContent = actionLabel(key);
      button.setAttribute("aria-label", actionLabel(key));
      button.title = actionLabel(key);
      button.dataset.actionProvider = provider;
      button.disabled = Boolean(disabled);
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

  function decorateModuleHtml(html, id, title) {
    const bridge = `
<script>
window.FSMOBILE_EMBEDDED_MODULE = true;
window.FSMOBILE_MODULE_ID = ${JSON.stringify(id)};
window.FSMOBILE_MODULE_TITLE = ${JSON.stringify(title || id)};
(function captureInitialReportStorage() {
var keys = {
"pb-druckpruefung-din-14462": "pb-druckpruefung-din-14462-current-v1",
"pb-druckerhoehungsanlage": "pb-druckerhoehungsanlage-report-v1",
"pb-hydranten": "fsmobile-pb-hydranten-v1",
"pb-loeschwasser-nass": "fsmobile-pb-loeschwasser-nass-v1",
"pb-loeschwasser-trocken": "pb-loeschwasser-trocken-report-v1",
"pb-nass-trocken-station": "fsmobile-pb-nass-trocken-station-v1",
"pb-rauchwarnmelder": "pb-rauchwarnmelder-current-v1",
"pb-wandhydranten": "pb-wandhydranten-report-v1"
};
var key = keys[String(window.FSMOBILE_MODULE_ID || "")];
if (!key) return;
try {
window.__fsmobileInitialCurrentState = { key: key, value: localStorage.getItem(key) };
} catch (error) {
window.__fsmobileInitialCurrentState = { key: key, value: null };
}
}());
(function installSignatureCanvasReadOptimization() {
if (!window.HTMLCanvasElement || HTMLCanvasElement.prototype.__fsmobileReadOptimizedContext) return;
var nativeGetContext = HTMLCanvasElement.prototype.getContext;
Object.defineProperty(HTMLCanvasElement.prototype, "__fsmobileReadOptimizedContext", { value: true });
HTMLCanvasElement.prototype.getContext = function(type, options) {
if (String(type || "").toLowerCase() !== "2d") {
return nativeGetContext.apply(this, arguments);
}
var identity = [
this.id || "",
typeof this.className === "string" ? this.className : "",
this.getAttribute && this.getAttribute("aria-label") || "",
this.getAttribute && this.getAttribute("data-signature") || ""
].join(" ").toLowerCase();
var signatureHost = this.closest && this.closest(".signature-block, .signature, .signatur");
if (!signatureHost && !/signature|signatur|unterschrift/.test(identity)) {
return nativeGetContext.apply(this, arguments);
}
var optimizedOptions = Object.assign({}, options || {}, { willReadFrequently: true });
return nativeGetContext.call(this, type, optimizedOptions);
};
}());
try {
if (window.parent && window.parent.FSMOBILE_STANDARD) {
window.FSMOBILE_STANDARD = window.parent.FSMOBILE_STANDARD;
}
} catch (error) {}
try {
if (window.parent && window.parent.FSMOBILE_IMAGE_STORAGE) {
window.FSMOBILE_IMAGE_STORAGE = window.parent.FSMOBILE_IMAGE_STORAGE;
}
} catch (error) {}
(function installSafeStorageContract() {
if (window.FSMOBILE_SAFE_STORAGE || !window.Storage || !window.Storage.prototype) return;
var nativeSetItem = window.Storage.prototype.setItem;
var nativeGetItem = window.Storage.prototype.getItem;
var nativeRemoveItem = window.Storage.prototype.removeItem;
if (typeof nativeSetItem !== "function" || typeof nativeGetItem !== "function") return;
var sequence = 0;
var failureCount = 0;
var lastResult = null;
var lastFailureNoticeAt = 0;

function storageBytes(value) {
try {
if (window.FSMOBILE_STANDARD && window.FSMOBILE_STANDARD.storage && typeof window.FSMOBILE_STANDARD.storage.byteLength === "function") {
return window.FSMOBILE_STANDARD.storage.byteLength(value);
}
} catch (error) {}
return String(value == null ? "" : value).length * 2;
}

function storageErrorCode(error) {
try {
if (window.FSMOBILE_STANDARD && window.FSMOBILE_STANDARD.storage && typeof window.FSMOBILE_STANDARD.storage.errorCode === "function") {
return window.FSMOBILE_STANDARD.storage.errorCode(error);
}
} catch (ignored) {}
return /quota/i.test(String(error && (error.name || error.message) || "")) ? "quota-exceeded" : "write-failed";
}

function publicResult(result) {
return Object.freeze({
ok: Boolean(result.ok),
code: String(result.code || (result.ok ? "ok" : "write-failed")),
key: String(result.key || ""),
storage: String(result.storage || "localStorage"),
moduleId: String(window.FSMOBILE_MODULE_ID || ""),
bytes: Number(result.bytes || 0),
previousBytes: Number(result.previousBytes || 0),
verified: Boolean(result.verified),
previousValuePreserved: result.previousValuePreserved !== false,
durationMs: Math.round(Number(result.durationMs || 0) * 100) / 100,
sequence: ++sequence,
at: new Date().toISOString()
});
}

function notifyFailure(result) {
failureCount += 1;
var now = Date.now();
if (now - lastFailureNoticeAt < 5000) return;
lastFailureNoticeAt = now;
var message = result.code === "quota-exceeded"
? "Speicher voll. Der letzte gültige Stand bleibt erhalten. Bitte Bericht exportieren oder Archivdaten löschen."
: "Eingaben konnten nicht gespeichert werden. Der letzte gültige Stand bleibt erhalten.";
try {
if (typeof window.setUnifiedActionStatus === "function") window.setUnifiedActionStatus(message);
} catch (error) {}
try {
if (window.parent && window.parent !== window && window.parent.FSMOBILE_STANDARD && typeof window.parent.FSMOBILE_STANDARD.showToast === "function") {
window.parent.FSMOBILE_STANDARD.showToast(message);
}
} catch (error) {}
}

function record(result) {
lastResult = publicResult(result);
if (!lastResult.ok) notifyFailure(lastResult);
try {
window.dispatchEvent(new CustomEvent("fsmobile:storage-write-result", { detail: lastResult }));
} catch (error) {}
return lastResult;
}

Object.defineProperty(window.Storage.prototype, "__fsmobileSafeStoragePatched", { value: true });
window.Storage.prototype.setItem = function(key, value) {
var storageArea = this === localStorage ? "localStorage" : "sessionStorage";
var text = String(value);
var previous = null;
var started = performance.now();
try { previous = nativeGetItem.call(this, key); } catch (error) {}
try {
nativeSetItem.call(this, key, text);
var written = nativeGetItem.call(this, key);
if (written !== text) {
var verificationError = new Error("Storage write verification failed");
verificationError.name = "StorageVerificationError";
try {
if (previous == null && typeof nativeRemoveItem === "function") nativeRemoveItem.call(this, key);
else nativeSetItem.call(this, key, previous);
} catch (rollbackError) {}
record({
ok: false,
code: "verification-failed",
key: key,
storage: storageArea,
bytes: storageBytes(text),
previousBytes: storageBytes(previous),
verified: false,
previousValuePreserved: nativeGetItem.call(this, key) === previous,
durationMs: performance.now() - started
});
throw verificationError;
}
record({
ok: true,
code: "ok",
key: key,
storage: storageArea,
bytes: storageBytes(text),
previousBytes: storageBytes(previous),
verified: true,
previousValuePreserved: true,
durationMs: performance.now() - started
});
return undefined;
} catch (error) {
if (error && error.name === "StorageVerificationError") throw error;
var preserved = true;
try { preserved = nativeGetItem.call(this, key) === previous; } catch (readError) { preserved = false; }
record({
ok: false,
code: storageErrorCode(error),
key: key,
storage: storageArea,
bytes: storageBytes(text),
previousBytes: storageBytes(previous),
verified: false,
previousValuePreserved: preserved,
durationMs: performance.now() - started
});
throw error;
}
};

window.FSMOBILE_SAFE_STORAGE = Object.freeze({
version: 1,
write: function(key, value) {
var before = sequence;
try { localStorage.setItem(String(key || ""), String(value)); }
catch (error) {}
return sequence > before ? lastResult : record({ ok: false, code: "write-failed", key: key });
},
writeJson: function(key, value) {
var serialized = "";
try { serialized = JSON.stringify(value); }
catch (error) {
return record({
ok: false,
code: "serialization-failed",
key: key,
storage: "localStorage",
bytes: 0,
previousBytes: 0,
verified: false,
previousValuePreserved: true,
durationMs: 0
});
}
return this.write(key, serialized);
},
lastResult: function() { return lastResult; },
snapshot: function() {
return Object.freeze({ sequence: sequence, failureCount: failureCount, lastResult: lastResult });
}
});
}());
(function(){
var fsmobilePilotSection = "";
try {
document.documentElement.classList.add("fsmobile-embedded-module");
if (/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) {
document.documentElement.classList.add("fsmobile-pb-module");
}
if ({
"auftrag-bescheinigungen": true,
"planungshilfe-bma": true,
"maengelliste": true,
"maengelliste-bilddoku": true,
"maengelliste-maengelbeschreibungen": true,
"aufmass-akku": true,
"aufmass-einsteckschloss": true,
"aufmass-tueren": true,
"aufmass-brandabschottungen": true
}[window.FSMOBILE_MODULE_ID || ""]) {
document.documentElement.classList.add("fsmobile-kalkulation-module");
}
fsmobilePilotSection = /^pb-/.test(window.FSMOBILE_MODULE_ID || "")
? "pruefberichte"
: document.documentElement.classList.contains("fsmobile-kalkulation-module")
? "kalkulation"
: "";
if (fsmobilePilotSection) {
document.documentElement.classList.add("fsmobile-ui-pilot");
document.documentElement.classList.add("fsmobile-ui-pilot-" + fsmobilePilotSection);
}
if (!document.getElementById("fsmobileEmbeddedActionSourceStyle")) {
var actionSourceStyle = document.createElement("style");
actionSourceStyle.id = "fsmobileEmbeddedActionSourceStyle";
actionSourceStyle.textContent = [
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .title-bar > .title-actions,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active header > .title-actions,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active header > .toolbar,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .archive-save,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .archive-open,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .archive-btn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .btn-archive-save,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .btn-clear,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .clear-btn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .pdf-btn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .fsmobile-data-export,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > .fsmobile-data-import,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > #archiveSaveBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > #archiveBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > #clearButton,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > #clearBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > #pdfButton,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .button-area > #pdfBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .archive-save,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .archive-open,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .archive-btn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .btn-archive-save,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .btn-clear,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .clear-btn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .pdf-btn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .fsmobile-data-export,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > .fsmobile-data-import,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > #archiveSaveBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > #archiveBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > #clearButton,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > #clearBtn,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > #pdfButton,",
"html.fsmobile-kalkulation-module body.fsmobile-parent-actions-active .actions > #pdfBtn,",
"html.fsmobile-pb-module .title-bar > .title-actions,",
"html.fsmobile-pb-module header > .toolbar,",
"html.fsmobile-embedded-module body.fsmobile-parent-actions-active .fsmobile-parent-action-source,",
"html.fsmobile-embedded-module body.fsmobile-parent-actions-active .fsmobile-header-actions,",
"html.fsmobile-embedded-module body.fsmobile-parent-actions-active .fsmobile-actions-empty { display: none !important; }",
"html.fsmobile-kalkulation-module body:not(.generating-pdf) h1 { margin: 0 !important; font-size: clamp(30px, 3vw, 36px) !important; line-height: 1.12 !important; letter-spacing: 0 !important; font-weight: 850 !important; }"
].join("\\n");
(document.head || document.documentElement).appendChild(actionSourceStyle);
}
if (fsmobilePilotSection && !document.getElementById("fsmobilePilotUiStyle")) {
var pilotUiStyle = document.createElement("style");
pilotUiStyle.id = "fsmobilePilotUiStyle";
pilotUiStyle.textContent = [
"html.fsmobile-ui-pilot { --fsmobile-ui-text: #1c1c1e; --fsmobile-ui-muted: #5f6368; --fsmobile-ui-field: rgba(255,255,255,.68); --fsmobile-ui-border: rgba(255,255,255,.62); --fsmobile-ui-radius-field: 10px; --fsmobile-ui-radius-card: 22px; --fsmobile-ui-shadow: 0 12px 34px rgba(2,8,23,.09), inset 0 1px 0 rgba(255,255,255,.34); }",
"html.fsmobile-ui-pilot-pruefberichte { --fsmobile-ui-accent: #eb0045; --fsmobile-ui-focus: rgba(235,0,69,.16); --fsmobile-ui-card-tint: rgba(235,0,69,.035); }",
"html.fsmobile-ui-pilot-kalkulation { --fsmobile-ui-accent: #ff9500; --fsmobile-ui-focus: rgba(255,149,0,.18); --fsmobile-ui-card-tint: rgba(255,149,0,.04); }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) { color: var(--fsmobile-ui-text) !important; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Arial, sans-serif !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) h1 { margin: 0 !important; color: var(--fsmobile-ui-text) !important; font-size: 34px !important; line-height: 1.12 !important; font-weight: 850 !important; letter-spacing: 0 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(.form-section, .card, .info-grid, .remarks-section, .photo-section, .test-card) { border: 1px solid rgba(255,255,255,.48) !important; border-radius: var(--fsmobile-ui-radius-card) !important; background: linear-gradient(145deg, rgba(255,255,255,.22), rgba(255,255,255,.085) 58%, var(--fsmobile-ui-card-tint)) !important; box-shadow: var(--fsmobile-ui-shadow) !important; -webkit-backdrop-filter: blur(18px) saturate(1.08) !important; backdrop-filter: blur(18px) saturate(1.08) !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(.form-section, .info-grid, .remarks-section, .photo-section) { padding: 16px !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) .table-wrapper { border: 1px solid rgba(255,255,255,.48) !important; border-radius: var(--fsmobile-ui-radius-card) !important; background: rgba(255,255,255,.08) !important; box-shadow: var(--fsmobile-ui-shadow) !important; -webkit-overflow-scrolling: touch; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(label:not(.fsmobile-ui-touch-target), legend, .field-label, .group-label) { color: var(--fsmobile-ui-muted) !important; font-size: 13px !important; line-height: 1.25 !important; font-weight: 700 !important; letter-spacing: 0 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(.field, .field-group) { min-width: 0 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(input:not([type='radio']):not([type='checkbox']):not([type='button']):not([type='submit']), textarea) { box-sizing: border-box !important; width: 100%; min-width: 0 !important; max-width: 100% !important; min-height: 46px !important; padding: 10px 12px !important; border: 1px solid var(--fsmobile-ui-border) !important; border-radius: var(--fsmobile-ui-radius-field) !important; color: var(--fsmobile-ui-text) !important; background: var(--fsmobile-ui-field) !important; box-shadow: inset 0 1px 1px rgba(255,255,255,.54), inset 0 -1px 1px rgba(2,8,23,.06) !important; font-size: 16px !important; line-height: 1.35; }",
"html.fsmobile-ui-pilot-kalkulation body:not(.generating-pdf) > :is(.container, .app) :is(.remarks-card, .remarks-section) textarea#reportRemarks { min-height: 88px !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) input[type='date'] { box-sizing: border-box !important; width: 100% !important; min-width: 0 !important; max-width: 100% !important; height: 46px !important; max-height: 46px !important; -webkit-appearance: none !important; appearance: none !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) select { box-sizing: border-box !important; width: 100% !important; min-width: 0 !important; max-width: 100% !important; height: 46px !important; min-height: 46px !important; max-height: 46px !important; padding: 10px 34px 10px 12px !important; border: 1px solid var(--fsmobile-ui-border) !important; border-radius: var(--fsmobile-ui-radius-field) !important; color: var(--fsmobile-ui-text) !important; background-color: var(--fsmobile-ui-field) !important; background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1.5 1.75 6 6.25l4.5-4.5%27 fill=%27none%27 stroke=%27%235f6368%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E') !important; background-repeat: no-repeat !important; background-position: right 13px center !important; background-size: 12px 8px !important; box-shadow: inset 0 1px 1px rgba(255,255,255,.54), inset 0 -1px 1px rgba(2,8,23,.06) !important; -webkit-appearance: none !important; appearance: none !important; font-size: 16px !important; line-height: 1.35 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) select.fsmobile-result-ok { color: #126b36 !important; border-color: rgba(52,199,89,.34) !important; background-color: rgba(52,199,89,.08) !important; background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1.5 1.75 6 6.25l4.5-4.5%27 fill=%27none%27 stroke=%27%23126b36%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E'), linear-gradient(145deg, rgba(52,199,89,.16), rgba(255,255,255,.035)) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 0 0 1px rgba(52,199,89,.08) !important; font-weight: 850 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) select.fsmobile-result-bad { color: #9f1d1d !important; border-color: rgba(255,59,48,.34) !important; background-color: rgba(255,59,48,.075) !important; background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1.5 1.75 6 6.25l4.5-4.5%27 fill=%27none%27 stroke=%27%239f1d1d%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E'), linear-gradient(145deg, rgba(255,59,48,.15), rgba(255,255,255,.03)) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 0 0 1px rgba(255,59,48,.08) !important; font-weight: 850 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) table :is(input:not([type='radio']):not([type='checkbox']), select, textarea) { min-height: 46px !important; }",
"html.fsmobile-ui-pilot-kalkulation body:not(.generating-pdf) > :is(.container, .app) table :is(input:not([type='radio']):not([type='checkbox']), select, textarea) { min-width: 44px !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) button { min-width: 44px !important; min-height: 46px !important; }",
"html.fsmobile-ui-pilot-kalkulation body:not(.generating-pdf) > :is(.container, .app) table { min-width: 960px !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(input, select, textarea):focus { outline: none !important; border-color: var(--fsmobile-ui-accent) !important; box-shadow: 0 0 0 4px var(--fsmobile-ui-focus), inset 0 1px 1px rgba(255,255,255,.56) !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) .section-heading::before { background: var(--fsmobile-ui-accent) !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) :is(.choice-card, .binary-option, .pill-option, .checkbox-option, .radio-option, .radio-pill) { min-height: 44px !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) label.fsmobile-ui-touch-target { display: inline-flex !important; box-sizing: border-box !important; width: 44px !important; min-width: 44px !important; height: 44px !important; min-height: 44px !important; align-items: center !important; justify-content: center !important; margin: 0 !important; padding: 0 !important; border-radius: 10px; color: var(--fsmobile-ui-muted) !important; font-size: 15px !important; font-weight: 700 !important; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) label.fsmobile-ui-touch-target > :is(input[type='checkbox'], input[type='radio']) { box-sizing: border-box !important; width: 24px !important; min-width: 24px !important; height: 24px !important; min-height: 24px !important; margin: 0 !important; padding: 0 !important; accent-color: var(--fsmobile-ui-accent) !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) label.fsmobile-ui-touch-target:focus-within { outline: 3px solid var(--fsmobile-ui-focus) !important; outline-offset: -2px; }",
"html.fsmobile-ui-pilot-pruefberichte body:not(.generating-pdf) > :is(.container, .app) th { background-color: var(--fsmobile-ui-accent) !important; color: #fff !important; }",
"html.fsmobile-ui-pilot-kalkulation body:not(.generating-pdf) > :is(.container, .app) th { background-color: var(--fsmobile-ui-accent) !important; color: #1c1c1e !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-overlay { padding: 16px !important; background: rgba(15,23,42,.52) !important; -webkit-backdrop-filter: blur(12px) !important; backdrop-filter: blur(12px) !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-dialog { display: flex !important; box-sizing: border-box !important; width: min(100%, 820px) !important; max-height: min(760px, calc(100dvh - 32px)) !important; flex-direction: column !important; overflow: hidden !important; padding: 0 !important; border: 1px solid rgba(255,255,255,.82) !important; border-radius: var(--fsmobile-ui-radius-card) !important; color: var(--fsmobile-ui-text) !important; background: #f8fafc !important; box-shadow: 0 26px 80px rgba(2,8,23,.32) !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-header { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 12px !important; padding: 16px 18px !important; border-bottom: 1px solid rgba(60,60,67,.16) !important; background: #f8fafc !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-header h2 { margin: 0 !important; color: var(--fsmobile-ui-text) !important; font-size: 22px !important; line-height: 1.15 !important; font-weight: 800 !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-filter-tools { margin: 0 !important; padding: 12px 16px !important; border-bottom: 1px solid rgba(60,60,67,.12) !important; background: #f8fafc !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-filter-input { min-height: 46px !important; border: 1px solid rgba(60,60,67,.2) !important; border-radius: var(--fsmobile-ui-radius-field) !important; color: var(--fsmobile-ui-text) !important; background: #fff !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-list { min-height: 0; margin: 0 !important; padding: 12px !important; overflow: auto !important; background: #f8fafc !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-item { border: 1px solid rgba(60,60,67,.14) !important; border-radius: 14px !important; color: var(--fsmobile-ui-text) !important; background: #fff !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }",
"html.fsmobile-ui-pilot body:not(.generating-pdf) :is(.archive-close-btn, .archive-item button) { min-height: 44px !important; }",
"@media (max-width: 900px) { html.fsmobile-ui-pilot body:not(.generating-pdf) > :is(.container, .app) h1 { font-size: 34px !important; } html.fsmobile-ui-pilot body:not(.generating-pdf) .archive-header { align-items: center !important; flex-direction: row !important; } }",
"@media (prefers-reduced-motion: reduce) { html.fsmobile-ui-pilot *, html.fsmobile-ui-pilot *::before, html.fsmobile-ui-pilot *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }"
].join(String.fromCharCode(10));
(document.head || document.documentElement).appendChild(pilotUiStyle);
}
} catch (error) {}
function installFsmobilePilotTouchTargets() {
if (!fsmobilePilotSection || !document.body) return;
Array.from(document.querySelectorAll("body > :is(.container, .app) input[type='checkbox'], body > :is(.container, .app) input[type='radio']")).forEach(function(input) {
if (!input || input.closest("label")) return;
var label = document.createElement("label");
var accessibleName = input.getAttribute("aria-label") || input.getAttribute("title") || input.getAttribute("data-field") || input.name || "Auswahl";
label.className = "fsmobile-ui-touch-target";
label.setAttribute("aria-label", accessibleName);
if (!input.getAttribute("aria-label")) input.setAttribute("aria-label", accessibleName);
if (!input.parentNode) return;
input.parentNode.insertBefore(label, input);
label.appendChild(input);
});
}
if (fsmobilePilotSection) {
document.addEventListener("DOMContentLoaded", function() {
installFsmobilePilotTouchTargets();
if (!window.MutationObserver || !document.body) return;
var pilotTouchObserver = new MutationObserver(installFsmobilePilotTouchTargets);
pilotTouchObserver.observe(document.body, { childList: true, subtree: true });
}, { once: true });
}
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

var FSMOBILE_POSITION_CHECKBOX_MODULES = Object.freeze({
"pb-brandschutztueren": true,
"pb-feststellanlagen": true,
"pb-drehfluegelantrieb": true,
"pb-feuerloescher": true,
"pb-not-sicherheitsbeleuchtung": true,
"pb-brandschutzklappen": true,
"pb-rauchwarnmelder": true,
"pb-schiebetuerantrieb": true,
"pb-brandschutzschiebetor": true,
"pb-brandschutzrolltore": true,
"pb-rolltoranlagen": true,
"pb-fluchttuer-steuerungen": true,
"pb-rauchschutzvorhaenge": true
});
var FSMOBILE_POSITION_CHECKBOX_META_KEY = "positionCheckboxes";

function usesPositionCheckboxUi() {
return Boolean(FSMOBILE_POSITION_CHECKBOX_MODULES[window.FSMOBILE_MODULE_ID || ""]);
}

function positionCheckboxHeader(table) {
if (!table || !table.tHead) return null;
return Array.from(table.tHead.querySelectorAll("th")).find(function(cell) {
return String(cell.textContent || "").replace(/\\s+/g, " ").trim() === "Pos.";
}) || null;
}

function installPositionCheckboxStyle() {
if (!usesPositionCheckboxUi() || document.getElementById("fsmobilePositionCheckboxStyle")) return;
var style = document.createElement("style");
style.id = "fsmobilePositionCheckboxStyle";
style.textContent = [
"col.fsmobile-position-checkbox-col { width: 44px !important; min-width: 44px !important; max-width: 44px !important; }",
"th.fsmobile-position-checkbox-head, td.fsmobile-position-checkbox-cell { width: 44px !important; min-width: 44px !important; max-width: 44px !important; text-align: center !important; vertical-align: middle !important; }",
"th.fsmobile-position-checkbox-head { padding: 6px !important; }",
"td.fsmobile-position-checkbox-cell { padding: 0 !important; }",
"th.fsmobile-position-checkbox-head { position: sticky; top: 0; z-index: 2; }",
"label.fsmobile-position-checkbox-hit-target { display: inline-flex !important; box-sizing: border-box !important; width: 44px !important; min-width: 44px !important; max-width: 44px !important; height: 44px !important; min-height: 44px !important; align-items: center !important; justify-content: center !important; margin: 0 !important; padding: 0 !important; cursor: pointer; touch-action: pan-x pan-y; -webkit-tap-highlight-color: transparent; }",
"input.fsmobile-position-checkbox { display: inline-block !important; width: 22px !important; min-width: 22px !important; max-width: 22px !important; height: 22px !important; min-height: 22px !important; margin: 0 !important; padding: 0 !important; border: 1px solid rgba(60, 60, 67, .32) !important; border-radius: 5px !important; box-shadow: none !important; accent-color: #eb0045; cursor: pointer; vertical-align: middle; }",
"label.fsmobile-position-checkbox-hit-target:focus-within { outline: 3px solid rgba(0, 122, 255, .32) !important; outline-offset: -3px !important; border-radius: 7px; }",
"input.fsmobile-position-checkbox:focus-visible { outline: 2px solid rgba(0, 122, 255, .55) !important; outline-offset: 2px !important; }",
"body:not(.generating-pdf) .table-wrapper { overscroll-behavior-y: auto !important; }",
"body.generating-pdf col.fsmobile-position-checkbox-col, body.generating-pdf .fsmobile-position-checkbox-head, body.generating-pdf .fsmobile-position-checkbox-cell, .pdf-render-wrapper col.fsmobile-position-checkbox-col, .pdf-render-wrapper .fsmobile-position-checkbox-head, .pdf-render-wrapper .fsmobile-position-checkbox-cell { display: none !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; padding: 0 !important; border: 0 !important; }",
"@media print { col.fsmobile-position-checkbox-col, .fsmobile-position-checkbox-head, .fsmobile-position-checkbox-cell { display: none !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; padding: 0 !important; border: 0 !important; } }"
].join("\\n");
(document.head || document.documentElement).appendChild(style);
}

function createPositionCheckboxRowId() {
if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
return "position-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

function ensurePositionCheckboxRowId(row, preferredId) {
if (!row) return "";
var id = String(preferredId || row.dataset.fsmobilePositionCheckboxId || "").trim().slice(0, 120);
if (!id) id = createPositionCheckboxRowId();
row.dataset.fsmobilePositionCheckboxId = id;
return id;
}

function positionCheckboxRows() {
if (!usesPositionCheckboxUi()) return [];
return Array.from(document.querySelectorAll("table.fsmobile-position-checkbox-table tbody tr")).filter(function(row) {
return Boolean(row.querySelector("input[data-fsmobile-position-checkbox='true']"));
});
}

function refreshPositionCheckboxLabels() {
positionCheckboxRows().forEach(function(row, index) {
var checkbox = row.querySelector("input[data-fsmobile-position-checkbox='true']");
if (!checkbox) return;
var label = "Position " + (index + 1) + " markieren";
checkbox.setAttribute("aria-label", label);
checkbox.title = label;
});
}

function ensurePositionCheckboxUi() {
if (!usesPositionCheckboxUi() || !document.body) return;
installPositionCheckboxStyle();
Array.from(document.querySelectorAll("table")).forEach(function(table) {
var positionHeader = positionCheckboxHeader(table);
if (!positionHeader) return;
table.classList.add("fsmobile-position-checkbox-table");
var originalPositionIndex = positionHeader.cellIndex;
var colgroup = table.querySelector("colgroup");
if (colgroup && !colgroup.querySelector("col.fsmobile-position-checkbox-col")) {
var markerCol = document.createElement("col");
markerCol.className = "fsmobile-position-checkbox-col";
colgroup.insertBefore(markerCol, colgroup.children[originalPositionIndex] || null);
}
if (!positionHeader.parentElement.querySelector("th.fsmobile-position-checkbox-head")) {
var markerHeader = document.createElement("th");
markerHeader.className = "fsmobile-position-checkbox-head";
markerHeader.scope = "col";
markerHeader.setAttribute("aria-label", "UI-Markierung");
markerHeader.setAttribute("data-html2canvas-ignore", "true");
positionHeader.parentElement.insertBefore(markerHeader, positionHeader);
}
Array.from(table.tBodies || []).forEach(function(body) {
Array.from(body.rows || []).forEach(function(row) {
var positionField = row.querySelector(".pos-field");
var positionCell = positionField && positionField.closest ? positionField.closest("td") : null;
if (!positionCell) return;
var hasMarkerCell = Array.from(row.cells || []).some(function(cell) {
return cell.classList.contains("fsmobile-position-checkbox-cell");
});
if (hasMarkerCell) {
ensurePositionCheckboxRowId(row);
return;
}
ensurePositionCheckboxRowId(row);
var markerCell = document.createElement("td");
markerCell.className = "fsmobile-position-checkbox-cell";
markerCell.setAttribute("data-html2canvas-ignore", "true");
var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.className = "fsmobile-position-checkbox";
checkbox.setAttribute("data-fsmobile-position-checkbox", "true");
checkbox.setAttribute("data-html2canvas-ignore", "true");
var hitTarget = document.createElement("label");
hitTarget.className = "fsmobile-position-checkbox-hit-target";
hitTarget.setAttribute("data-html2canvas-ignore", "true");
var pointerStartX = 0;
var pointerStartY = 0;
var pointerIsDown = false;
var pointerMoved = false;
hitTarget.addEventListener("pointerdown", function(event) {
pointerStartX = event.clientX;
pointerStartY = event.clientY;
pointerIsDown = true;
pointerMoved = false;
});
hitTarget.addEventListener("pointermove", function(event) {
if (!pointerIsDown) return;
if (Math.abs(event.clientX - pointerStartX) > 8 || Math.abs(event.clientY - pointerStartY) > 8) {
pointerMoved = true;
}
});
hitTarget.addEventListener("pointerup", function() {
pointerIsDown = false;
});
hitTarget.addEventListener("pointercancel", function() {
pointerIsDown = false;
pointerMoved = false;
});
hitTarget.addEventListener("click", function(event) {
if (!pointerMoved) return;
event.preventDefault();
event.stopPropagation();
pointerMoved = false;
});
hitTarget.appendChild(checkbox);
markerCell.appendChild(hitTarget);
row.insertBefore(markerCell, positionCell);
});
});
});
refreshPositionCheckboxLabels();
}

function collectPositionCheckboxUiMetadata() {
if (!usesPositionCheckboxUi()) return null;
ensurePositionCheckboxUi();
return {
version: 1,
rows: positionCheckboxRows().map(function(row) {
var checkbox = row.querySelector("input[data-fsmobile-position-checkbox='true']");
return {
id: ensurePositionCheckboxRowId(row),
checked: Boolean(checkbox && checkbox.checked)
};
})
};
}

function positionCheckboxUiMetadataFromEntry(entry) {
if (!entry || typeof entry !== "object") return null;
var uiMetadata = entry.uiMetadata;
if (!uiMetadata || typeof uiMetadata !== "object" || Array.isArray(uiMetadata)) return null;
var value = uiMetadata[FSMOBILE_POSITION_CHECKBOX_META_KEY];
return value && typeof value === "object" && Array.isArray(value.rows) ? value : null;
}

function applyPositionCheckboxUiMetadata(metadata) {
if (!usesPositionCheckboxUi()) return;
ensurePositionCheckboxUi();
var savedRows = metadata && Array.isArray(metadata.rows) ? metadata.rows : [];
positionCheckboxRows().forEach(function(row, index) {
var saved = savedRows[index] && typeof savedRows[index] === "object" ? savedRows[index] : null;
var checkbox = row.querySelector("input[data-fsmobile-position-checkbox='true']");
ensurePositionCheckboxRowId(row, saved && saved.id);
if (checkbox) checkbox.checked = Boolean(saved && saved.checked === true);
});
refreshPositionCheckboxLabels();
}

function resetPositionCheckboxUi() {
applyPositionCheckboxUiMetadata(null);
}

function restorePositionCheckboxUiFromEntry(entry) {
if (!usesPositionCheckboxUi()) return;
applyPositionCheckboxUiMetadata(positionCheckboxUiMetadataFromEntry(entry));
}

function restorePositionCheckboxUiFromCurrentArchive() {
if (!usesPositionCheckboxUi()) return false;
ensurePositionCheckboxUi();
var primaryKey = resolveArchiveStorageKey();
var storageKeys = archiveStorageKeysForDisplay(primaryKey);
for (var keyIndex = 0; keyIndex < storageKeys.length; keyIndex += 1) {
var storageKey = storageKeys[keyIndex];
var currentId = readCurrentArchiveIdForKey(storageKey);
if (!currentId) continue;
var entry = readArchiveEntriesForKey(storageKey).find(function(item) {
return item && String(item.id || "") === String(currentId);
});
if (!entry) continue;
restorePositionCheckboxUiFromEntry(entry);
return true;
}
return false;
}

function schedulePositionCheckboxUiRefresh() {
if (!usesPositionCheckboxUi()) return;
window.clearTimeout(window.__fsmobilePositionCheckboxRefreshTimer);
window.__fsmobilePositionCheckboxRefreshTimer = window.setTimeout(ensurePositionCheckboxUi, 0);
}

function installPositionCheckboxUi() {
if (!usesPositionCheckboxUi() || window.__fsmobilePositionCheckboxUiInstalled) return;
window.__fsmobilePositionCheckboxUiInstalled = true;
ensurePositionCheckboxUi();
document.addEventListener("click", function(event) {
var button = event.target && event.target.closest ? event.target.closest("button") : null;
if (!button || button.closest(".archive-dialog, .archive-overlay")) return;
var text = String(button.textContent || "").replace(/\\s+/g, " ").trim();
var haystack = (button.id || "") + " " + (button.className || "");
if (text === "Leeren" || /clearButton|clearBtn|clear-btn|btn-clear/.test(haystack)) {
window.setTimeout(resetPositionCheckboxUi, 0);
window.setTimeout(resetPositionCheckboxUi, 80);
}
}, true);
if (window.MutationObserver) {
var observer = new MutationObserver(function(mutations) {
var rowsChanged = mutations.some(function(mutation) {
return mutation.type === "childList" && (mutation.addedNodes.length || mutation.removedNodes.length);
});
if (rowsChanged) schedulePositionCheckboxUiRefresh();
});
observer.observe(document.body, { childList: true, subtree: true });
}
[0, 80, 240].forEach(function(delay) {
window.setTimeout(function() {
ensurePositionCheckboxUi();
if (!window.__fsmobilePositionCheckboxArchiveRestored) {
window.__fsmobilePositionCheckboxArchiveRestored = restorePositionCheckboxUiFromCurrentArchive();
}
}, delay);
});
}

window.FSMOBILE_POSITION_CHECKBOX_UI = Object.freeze({
collect: collectPositionCheckboxUiMetadata,
apply: applyPositionCheckboxUiMetadata,
reset: resetPositionCheckboxUi,
refresh: ensurePositionCheckboxUi
});

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

var fsmobileTextareaResizeTimer = 0;
var fsmobileTextareaResizeFrame = 0;
var fsmobileTextareaResizeAllPending = false;
var fsmobileTextareaResizeVisiblePending = false;
var fsmobilePendingTextareaFields = new Set();
var fsmobileVisibleTextareaDone = typeof WeakSet === "function" ? new WeakSet() : null;
var fsmobileTextareaMeasureCache = typeof WeakMap === "function" ? new WeakMap() : null;
var fsmobileTextareaMirror = null;
var fsmobileTextareaStyleProps = [
"fontFamily",
"fontSize",
"fontStyle",
"fontWeight",
"fontVariant",
"lineHeight",
"letterSpacing",
"textTransform",
"textIndent",
"textRendering",
"wordSpacing",
"wordBreak",
"overflowWrap",
"whiteSpace",
"paddingTop",
"paddingRight",
"paddingBottom",
"paddingLeft",
"borderTopWidth",
"borderRightWidth",
"borderBottomWidth",
"borderLeftWidth"
];

function fsmobileTextareaLayout(field) {
if (!field || field.tagName !== "TEXTAREA" || !document.contains(field)) return null;
if (field.closest(".archive-overlay, .archive-dialog, .pdf-render-wrapper, .pdf-render-area")) return null;
if (document.body && document.body.classList.contains("generating-pdf")) return null;
var style = window.getComputedStyle(field);
if (style.display === "none" || style.visibility === "hidden") return null;
var rect = field.getBoundingClientRect();
if (rect.width <= 0 || rect.height < 0) return null;
return { rect: rect, style: style };
}

function fsmobileNumericStyle(style, prop) {
var value = parseFloat(style.getPropertyValue(prop));
return Number.isFinite(value) ? value : 0;
}

function fsmobileTextareaHasOwnAutosize(field) {
if (!field || field.tagName !== "TEXTAREA" || !field.getAttribute) return false;
var inlineHandler = field.getAttribute("oninput") || "";
if (/\\b(?:handleInput|autoGrow)\\s*\\(/.test(inlineHandler)) return true;
return Boolean(
field.closest("tr[data-row-id]") &&
typeof window.syncRowFieldHeights === "function"
);
}

function fsmobileTextareaMirrorElement() {
if (fsmobileTextareaMirror && document.contains(fsmobileTextareaMirror)) return fsmobileTextareaMirror;
fsmobileTextareaMirror = document.createElement("textarea");
fsmobileTextareaMirror.setAttribute("aria-hidden", "true");
fsmobileTextareaMirror.setAttribute("data-fsmobile-textarea-mirror", "true");
fsmobileTextareaMirror.tabIndex = -1;
fsmobileTextareaMirror.style.position = "absolute";
fsmobileTextareaMirror.style.left = "-9999px";
fsmobileTextareaMirror.style.top = "0";
fsmobileTextareaMirror.style.zIndex = "-1";
fsmobileTextareaMirror.style.visibility = "hidden";
fsmobileTextareaMirror.style.pointerEvents = "none";
fsmobileTextareaMirror.style.overflow = "hidden";
fsmobileTextareaMirror.style.resize = "none";
(document.body || document.documentElement).appendChild(fsmobileTextareaMirror);
return fsmobileTextareaMirror;
}

function fsmobileTextareaMeasureKey(field, width, style) {
return [width, field.rows || 1, field.value || ""].concat(fsmobileTextareaStyleProps.map(function(prop) {
return style[prop] || "";
})).join("\\n");
}

function fsmobileMeasureTextareaHeight(field, layout) {
var rect = layout.rect;
var style = layout.style;
var width = Math.max(1, Math.round(rect.width || field.clientWidth || 1));
var measureKey = fsmobileTextareaMeasureKey(field, width, style);
var cached = fsmobileTextareaMeasureCache ? fsmobileTextareaMeasureCache.get(field) : null;
if (cached && cached.key === measureKey) return cached.height;
var mirror = fsmobileTextareaMirrorElement();
mirror.value = field.value || "";
mirror.rows = field.rows || 1;
mirror.style.boxSizing = style.boxSizing;
mirror.style.width = width + "px";
mirror.style.minHeight = "0";
mirror.style.maxHeight = "none";
mirror.style.height = "auto";
fsmobileTextareaStyleProps.forEach(function(prop) {
mirror.style[prop] = style[prop];
});
var measured = Math.ceil(mirror.scrollHeight);
if (style.boxSizing === "border-box") {
measured += fsmobileNumericStyle(style, "border-top-width") + fsmobileNumericStyle(style, "border-bottom-width");
}
var minHeight = parseFloat(style.minHeight);
if (!Number.isFinite(minHeight) || minHeight <= 0) {
var lineHeight = parseFloat(style.lineHeight);
if (!Number.isFinite(lineHeight)) lineHeight = parseFloat(style.fontSize) * 1.35;
minHeight = Math.max(30, lineHeight + fsmobileNumericStyle(style, "padding-top") + fsmobileNumericStyle(style, "padding-bottom"));
}
var height = Math.max(Math.ceil(minHeight), measured);
if (fsmobileTextareaMeasureCache) fsmobileTextareaMeasureCache.set(field, { key: measureKey, height: height });
return height;
}

function fsmobileSafeResizeTextarea(field) {
var layout = fsmobileTextareaLayout(field);
if (!layout) return;
try {
var measured = fsmobileMeasureTextareaHeight(field, layout);
if (field.style.height !== measured + "px") field.style.height = measured + "px";
field.style.overflowY = "hidden";
} catch (error) {}
}

var FSMOBILE_TABULAR_REPORT_MODULE_IDS = Object.freeze({
"pb-brandschutztueren": true,
"pb-feststellanlagen": true,
"pb-drehfluegelantrieb": true,
"pb-feuerloescher": true,
"pb-not-sicherheitsbeleuchtung": true,
"pb-brandschutzklappen": true,
"pb-schiebetuerantrieb": true,
"pb-brandschutzschiebetor": true,
"pb-brandschutzrolltore": true,
"pb-rolltoranlagen": true,
"pb-fluchttuer-steuerungen": true,
"pb-rauchschutzvorhaenge": true
});

function fsmobileIsTabularReportModule() {
return Boolean(FSMOBILE_TABULAR_REPORT_MODULE_IDS[String(window.FSMOBILE_MODULE_ID || "")]);
}

function fsmobileUsesDeferredTextareaResize(fields) {
var moduleId = String(window.FSMOBILE_MODULE_ID || "");
var largeReportModules = {
"pb-rwa": true,
"pb-rauchwarnmelder": true,
"pb-wandhydranten": true
};
if (fsmobileIsTabularReportModule()) return true;
return Boolean(largeReportModules[moduleId] && fields.length >= 100);
}

function fsmobileResizeVisibleTextareas(fields) {
var visible = new Set();
var active = document.activeElement;
if (active && active.tagName === "TEXTAREA") visible.add(active);
if (!fsmobileIsTabularReportModule()) {
var width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
var height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
var xPositions = [width * 0.2, width * 0.5, width * 0.8];
for (var y = 16; y < height; y += 72) {
xPositions.forEach(function(x) {
var element = document.elementFromPoint(Math.max(1, Math.min(width - 1, x)), y);
var group = element && element.closest ? element.closest("#rowsBody tr, .whd-card, .dynamic-row, .field") : null;
if (!group) return;
group.querySelectorAll("textarea:not([data-fsmobile-textarea-mirror])").forEach(function(field) { visible.add(field); });
});
}
}
if (!visible.size) fields.slice(0, 8).forEach(function(field) { visible.add(field); });
var resized = 0;
visible.forEach(function(field) {
if (resized >= 1 || fsmobileTextareaHasOwnAutosize(field)) return;
if (fsmobileVisibleTextareaDone && fsmobileVisibleTextareaDone.has(field) && field !== active) return;
fsmobileSafeResizeTextarea(field);
if (fsmobileVisibleTextareaDone) fsmobileVisibleTextareaDone.add(field);
resized += 1;
});
}

function fsmobileResizeAllTextareas(allowLargeVisibleResize) {
if (fsmobileIsTabularReportModule()) {
if (allowLargeVisibleResize) fsmobileResizeVisibleTextareas([]);
return;
}
var fields = Array.from(document.querySelectorAll("textarea:not([data-fsmobile-textarea-mirror])"));
if (fsmobileUsesDeferredTextareaResize(fields)) {
if (allowLargeVisibleResize) fsmobileResizeVisibleTextareas(fields);
return;
}
fields.forEach(function(field) {
if (!fsmobileTextareaHasOwnAutosize(field)) fsmobileSafeResizeTextarea(field);
});
}

function fsmobileFlushTextareaResize() {
fsmobileTextareaResizeFrame = 0;
if (fsmobileTextareaResizeAllPending) {
fsmobileTextareaResizeAllPending = false;
fsmobilePendingTextareaFields.clear();
var allowLargeVisibleResize = fsmobileTextareaResizeVisiblePending;
fsmobileTextareaResizeVisiblePending = false;
fsmobileResizeAllTextareas(allowLargeVisibleResize);
return;
}
var fields = Array.from(fsmobilePendingTextareaFields);
fsmobilePendingTextareaFields.clear();
fields.forEach(fsmobileSafeResizeTextarea);
}

function fsmobileRequestTextareaResizeFrame() {
if (fsmobileTextareaResizeFrame) return;
fsmobileTextareaResizeFrame = window.requestAnimationFrame(fsmobileFlushTextareaResize);
}

function fsmobileScheduleTextareaFieldResize(field) {
if (!field) return;
fsmobilePendingTextareaFields.add(field);
fsmobileRequestTextareaResizeFrame();
}

function fsmobileScheduleTextareaResize(delay, allowLargeVisibleResize) {
fsmobileTextareaResizeVisiblePending = fsmobileTextareaResizeVisiblePending || Boolean(allowLargeVisibleResize);
window.clearTimeout(fsmobileTextareaResizeTimer);
fsmobileTextareaResizeTimer = window.setTimeout(function() {
fsmobileTextareaResizeAllPending = true;
fsmobileRequestTextareaResizeFrame();
}, delay == null ? 0 : delay);
}

function installFsmobileTextareaAutosizeGuard() {
if (window.__fsmobileTextareaAutosizeGuardInstalled) return;
window.__fsmobileTextareaAutosizeGuardInstalled = true;
document.addEventListener("input", function(event) {
if (event.target && event.target.tagName === "TEXTAREA" && !fsmobileTextareaHasOwnAutosize(event.target)) {
fsmobileScheduleTextareaFieldResize(event.target);
}
}, true);
document.addEventListener("change", function(event) {
if (event.target && event.target.tagName === "TEXTAREA" && !fsmobileTextareaHasOwnAutosize(event.target)) {
fsmobileScheduleTextareaFieldResize(event.target);
}
}, true);
document.addEventListener("focusin", function(event) {
if (event.target && event.target.tagName === "TEXTAREA" && !fsmobileTextareaHasOwnAutosize(event.target)) {
fsmobileScheduleTextareaFieldResize(event.target);
}
}, true);
if (window.MutationObserver) {
var observer = new MutationObserver(function(mutations) {
if (mutations.some(function(mutation) {
return Array.from(mutation.addedNodes || []).some(function(node) {
return node && node.nodeType === 1 && !(
node.matches && node.matches("[data-fsmobile-textarea-mirror]")
) && (
node.matches && node.matches("textarea:not([data-fsmobile-textarea-mirror]), tr, .card, .dynamic-row") ||
node.querySelector && node.querySelector("textarea:not([data-fsmobile-textarea-mirror])")
);
});
})) {
fsmobileScheduleTextareaResize(40);
}
});
observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
}
document.addEventListener("scroll", function() {
if (fsmobileIsTabularReportModule()) return;
fsmobileScheduleTextareaResize(24, true);
}, true);
window.addEventListener("resize", function() {
if (typeof WeakSet === "function") fsmobileVisibleTextareaDone = new WeakSet();
fsmobileScheduleTextareaResize(120, true);
});
fsmobileScheduleTextareaResize(0);
}

var FSMOBILE_PORTRAIT_REPORT_IDS = {
"pb-rwa": true,
"pb-druckerhoehungsanlage": true,
"pb-nass-trocken-station": true,
"pb-druckpruefung-din-14462": true,
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
"pb-fluchttuer-steuerungen": true,
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

var FSMOBILE_CUSTOMER_NUMBER_LABEL = "Kunden Nr.";
window.FSMOBILE_CUSTOMER_NUMBER_LABEL = FSMOBILE_CUSTOMER_NUMBER_LABEL;

var FSMOBILE_CUSTOMER_NUMBER_ALIGNED_HEADER_IDS = {
"pb-druckerhoehungsanlage": true,
"pb-nass-trocken-station": true,
"pb-druckpruefung-din-14462": true,
"pb-loeschwasser-trocken": true,
"pb-loeschwasser-nass": true,
"pb-zentralbatterie-anlage": true,
"pb-wandhydranten": true,
"pb-hydranten": true
};

function isCustomerNumberAlignedHeaderReport() {
return Boolean(FSMOBILE_CUSTOMER_NUMBER_ALIGNED_HEADER_IDS[window.FSMOBILE_MODULE_ID || ""]);
}

function customerNumberKeys() {
return ["kundenNr", "kundennr", "kundenNummer", "kundennummer", "kunden_nr", "customerNumber", "customerNo", "customerId"];
}

function fieldLooksLikeCustomerNumber(field) {
if (!field || !("value" in field)) return false;
var haystack = normalizeFsmobileKey([
field.id || "",
field.name || "",
field.dataset ? field.dataset.field || "" : "",
field.getAttribute("aria-label") || "",
field.getAttribute("placeholder") || "",
fieldLabelText(field)
].join(" "));
return haystack === "kundennr" ||
haystack.indexOf("kundennr") >= 0 ||
haystack.indexOf("kundennummer") >= 0 ||
haystack.indexOf("customernumber") >= 0 ||
haystack.indexOf("customerno") >= 0;
}

function customerNumberField() {
var direct = document.getElementById("kundenNrInput") ||
document.getElementById("kundenNummerInput") ||
document.getElementById("kundennrInput");
if (direct && "value" in direct) return direct;
var selector = "[name='kundenNr'], [name='kundennr'], [name='kundenNummer'], [data-field='kundenNr'], [data-field='kundennr'], [data-field='kundenNummer']";
var scopes = document.querySelectorAll(".fsmobile-kunden-nr-field, .fsmobile-portrait-assignment, .header-row, .info-grid, .form-grid, .assignment-grid");
for (var scopeIndex = 0; scopeIndex < scopes.length; scopeIndex += 1) {
var scoped = scopes[scopeIndex].querySelector(selector);
if (scoped && "value" in scoped) return scoped;
}
var controlCount = document.getElementsByTagName("input").length + document.getElementsByTagName("textarea").length + document.getElementsByTagName("select").length;
if (controlCount > 2000) return null;
var fallback = document.querySelector(selector);
if (fallback && "value" in fallback) return fallback;
return Array.from(document.querySelectorAll("input, textarea, select")).find(fieldLooksLikeCustomerNumber) || null;
}

function currentCustomerNumberValue() {
var field = customerNumberField();
return field && "value" in field ? String(field.value || "").trim() : "";
}

function setCustomerNumberFieldValue(value, options) {
var field = customerNumberField();
if (!field || !("value" in field)) return false;
field.value = value == null ? "" : String(value);
if (!options || options.dispatch !== false) {
try { field.dispatchEvent(new Event("input", { bubbles: true })); } catch (error) {}
try { field.dispatchEvent(new Event("change", { bubbles: true })); } catch (error) {}
}
return true;
}

function findAnlageFieldForCustomerPlacement() {
var ids = ["anlageInput", "anlagenNrInput", "anlagenNummerInput", "anlageNrInput", "anlagennrInput"];
for (var index = 0; index < ids.length; index += 1) {
var field = document.getElementById(ids[index]);
if (field && "value" in field) return field;
}
return Array.from(document.querySelectorAll("input, textarea, select")).find(function(field) {
var text = normalizeFsmobileKey([
field.id || "",
field.name || "",
field.dataset ? field.dataset.field || "" : "",
fieldLabelText(field)
].join(" "));
return text.indexOf("anlagennr") >= 0 || text.indexOf("anlagennummer") >= 0 || (text.indexOf("anlagen") >= 0 && text.indexOf("nr") >= 0);
}) || null;
}

function createCustomerNumberControl(container) {
var wrapper = document.createElement("div");
var useFieldGroup = container && (
container.classList.contains("info-grid") ||
container.classList.contains("header-row") ||
container.classList.contains("form-grid")
);
wrapper.className = useFieldGroup ? "field-group fsmobile-kunden-nr-field" : "field fsmobile-kunden-nr-field";
var label = document.createElement("label");
label.setAttribute("for", "kundenNrInput");
label.textContent = FSMOBILE_CUSTOMER_NUMBER_LABEL;
var input = document.createElement("input");
input.id = "kundenNrInput";
input.name = "kundenNr";
input.type = "text";
input.autocomplete = "off";
input.setAttribute("data-field", "kundenNr");
input.setAttribute("aria-label", FSMOBILE_CUSTOMER_NUMBER_LABEL);
wrapper.append(label, input);
return wrapper;
}

function ensureCustomerNumberField() {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "") || !document.body || document.body.classList.contains("generating-pdf")) return;
document.body.classList.toggle("fsmobile-kunden-nr-aligned-header", isCustomerNumberAlignedHeaderReport());
if (customerNumberField()) return;
var anlageField = findAnlageFieldForCustomerPlacement();
var anlageHost = anlageField ? anlageField.closest(".field, .field-group, .form-field, .control, label") : null;
var container = anlageHost ? anlageHost.parentElement : null;
if (!container) {
var assignmentSection = Array.from(document.querySelectorAll("section.card, .card, .info-grid, .header-row, .form-grid")).find(function(section) {
return section && section.textContent && normalizeFsmobileKey(section.textContent).indexOf("zuordnung") >= 0;
});
container = assignmentSection && assignmentSection.matches(".grid, .info-grid, .header-row, .form-grid")
? assignmentSection
: assignmentSection && assignmentSection.querySelector(".grid, .info-grid, .header-row, .form-grid");
}
if (!container) {
container = document.createElement("div");
container.className = "grid fsmobile-portrait-assignment fsmobile-generated-assignment";
var anchor = document.querySelector(".title-bar, header") || document.body.firstElementChild;
if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(container, anchor.nextSibling);
else document.body.insertBefore(container, document.body.firstChild);
}
var control = createCustomerNumberControl(container);
if (anlageHost && anlageHost.parentNode === container) container.insertBefore(control, anlageHost.nextSibling);
else container.insertBefore(control, container.firstChild || null);
}

function extractCustomerNumberFromData(data) {
if (!data || typeof data !== "object") return "";
var direct = firstArchiveValue(data, customerNumberKeys());
if (direct) return String(direct).trim();
if (data.fields && typeof data.fields === "object") {
var fieldValue = firstArchiveValue(data.fields, customerNumberKeys());
if (fieldValue) return String(fieldValue).trim();
}
if (data.header && typeof data.header === "object") {
var headerValue = firstArchiveValue(data.header, customerNumberKeys());
if (headerValue) return String(headerValue).trim();
}
if (data.meta && typeof data.meta === "object") {
var metaValue = firstArchiveValue(data.meta, customerNumberKeys());
if (metaValue) return String(metaValue).trim();
}
if (data.report && typeof data.report === "object") return extractCustomerNumberFromData(data.report);
if (data.data && typeof data.data === "object") return extractCustomerNumberFromData(data.data);
return "";
}

function assignCustomerNumberToReportData(data, value) {
if (!data || typeof data !== "object" || Array.isArray(data)) return data;
if (!data.fields || typeof data.fields !== "object" || Array.isArray(data.fields)) data.fields = {};
data.fields.kundenNr = value;
if (data.header && typeof data.header === "object" && !Array.isArray(data.header)) data.header.kundenNr = value;
if (data.meta && typeof data.meta === "object" && !Array.isArray(data.meta)) data.meta.kundenNr = value;
return data;
}

function mergeCustomerNumberIntoReportData(data) {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return data;
var value = currentCustomerNumberValue();
return assignCustomerNumberToReportData(data, value);
}

function installCustomerNumberDataBridge() {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "") || window.__fsmobileCustomerNumberBridgeInstalled) return;
window.__fsmobileCustomerNumberBridgeInstalled = true;
["getCurrentReport", "collectData", "collectReportData", "buildStoragePayload"].forEach(function(name) {
var original = window[name];
if (typeof original !== "function" || original.__fsmobileCustomerNumberWrapped) return;
window[name] = function() {
return mergeCustomerNumberIntoReportData(original.apply(this, arguments));
};
window[name].__fsmobileCustomerNumberWrapped = true;
});
["applyReport", "applyData", "applyReportData", "applyStoragePayload", "restoreReportData"].forEach(function(name) {
var original = window[name];
if (typeof original !== "function" || original.__fsmobileCustomerNumberWrapped) return;
window[name] = function(data) {
var value = extractCustomerNumberFromData(data);
var result = original.apply(this, arguments);
window.setTimeout(function() {
ensureCustomerNumberField();
setCustomerNumberFieldValue(value, { dispatch: false });
}, 0);
return result;
};
window[name].__fsmobileCustomerNumberWrapped = true;
});
if (window.Storage && window.Storage.prototype && !window.Storage.prototype.__fsmobileCustomerNumberPatched) {
var originalSetItem = window.Storage.prototype.setItem;
Object.defineProperty(window.Storage.prototype, "__fsmobileCustomerNumberPatched", { value: true });
window.Storage.prototype.setItem = function(key, value) {
if (this === localStorage && /^pb-/.test(window.FSMOBILE_MODULE_ID || "") && !window.__fsmobileReportImportInProgress) {
try {
var text = String(value || "");
if (/^\\s*\\{/.test(text) && isModuleDraftStorageKey(key)) {
var payload = JSON.parse(text);
value = JSON.stringify(mergeCustomerNumberIntoReportData(payload));
}
} catch (error) {}
}
return originalSetItem.call(this, key, value);
};
}
}

function restoreCustomerNumberFromDraft() {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
ensureCustomerNumberField();
var field = customerNumberField();
if (!field || !("value" in field) || String(field.value || "").trim()) return false;
var keys = moduleDraftStorageKeys();
for (var index = 0; index < keys.length; index += 1) {
var raw = "";
try { raw = localStorage.getItem(keys[index]) || ""; } catch (error) { continue; }
if (!/^\s*\{/.test(raw)) continue;
try {
var value = extractCustomerNumberFromData(JSON.parse(raw));
if (!value) continue;
setCustomerNumberFieldValue(value, { dispatch: false });
return true;
} catch (error) {}
}
return false;
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
if (window.FSMOBILE_MODULE_ID === "pb-fluchttuer-steuerungen") {
return value
.replace(/^Prüfer(?=\\s+und\\s+)/i, FSMOBILE_TECHNICIAN_LABEL)
.replace(/^Prüfer(\\s*(?::|\\(|$))/i, FSMOBILE_TECHNICIAN_LABEL + "$1");
}
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
return /^(Objekt|Anlagen\s*Nr\.?|Kunden\s*Nr\.?|Techniker|Name|Prüfer|Datum)\s*:?\s*$/i.test(value);
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
if (!canvas || typeof canvas.getAttribute !== "function") return false;
var haystack = normalizeFsmobileKey([
canvas.id || "",
canvas.className || "",
canvas.getAttribute("aria-label") || "",
canvas.closest && canvas.closest(".signature-block, .signature, .signatur") ? "signature" : ""
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
markFsmobileSignatureCanvasDirty(canvas);
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
try { drawSignatureImageToCanvas(canvas, context, image); } catch (error) {}
};
image.src = oldData;
}
}

function drawSignatureImageToCanvas(canvas, context, image) {
if (!canvas || !context || !image) return;
var ratio = window.devicePixelRatio || 1;
context.save();
context.setTransform(1, 0, 0, 1, 0, 0);
context.clearRect(0, 0, canvas.width, canvas.height);
context.imageSmoothingEnabled = true;
context.imageSmoothingQuality = "high";
context.drawImage(image, 0, 0, canvas.width, canvas.height);
context.restore();
context.setTransform(ratio, 0, 0, ratio, 0, 0);
context.lineWidth = 2.4;
context.lineCap = "round";
context.lineJoin = "round";
context.strokeStyle = "#1c1c1e";
markFsmobileSignatureCanvasDirty(canvas);
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

var fsmobileSignatureCanvasCache = typeof WeakMap === "function" ? new WeakMap() : null;

function markFsmobileSignatureCanvasDirty(canvas) {
if (canvas && fsmobileSignatureCanvasCache) fsmobileSignatureCanvasCache.delete(canvas);
}

function cacheFsmobileSignatureCanvasData(canvas, value) {
if (canvas && fsmobileSignatureCanvasCache) fsmobileSignatureCanvasCache.set(canvas, String(value || ""));
}

function generatedSignatureStorageKey() {
return "fsmobile-generated-techniker-signature:" + (window.FSMOBILE_MODULE_ID || "module");
}

function fsmobileSignatureStorageKeyCandidates() {
var moduleId = window.FSMOBILE_MODULE_ID || "";
var known = {
"pb-feuerloescher": ["pb-feuerloescher-current-v2"],
"pb-brandschutztueren": ["pb-brandschutztueren-current-v2"],
"pb-rwa": ["rwa_pruefbericht_formular_v1"],
"pb-not-sicherheitsbeleuchtung": ["pb-not-sicherheitsbeleuchtung-current-v1"],
"pb-brandschutzklappen": ["pb-brandschutzklappen-current-v1"],
"pb-brandschutzschiebetor": ["pb-brandschutzschiebetor-current-v1"],
"pb-brandschutzrolltore": ["pb-brandschutzrolltore-current-v1"],
"pb-rolltoranlagen": ["pb-rolltoranlagen-current-v1"],
"pb-schiebetuerantrieb": ["pb-schiebetuerantrieb-current-v1"],
"pb-drehfluegelantrieb": ["pb-drehfluegelantrieb-current-v1"],
"pb-rauchschutzvorhaenge": ["pb-rauchschutzvorhaenge-current-v1"],
"pb-feststellanlagen": ["pb-feststellanlagen-current-v1"],
"pb-fluchttuer-steuerungen": ["pb-fluchttuer-steuerungen-current-v1"],
"pb-druckerhoehungsanlage": ["pb-druckerhoehungsanlage-report-v1"],
"pb-nass-trocken-station": ["fsmobile-pb-nass-trocken-station-v1"],
"pb-loeschwasser-trocken": ["pb-loeschwasser-trocken-report-v1"],
"pb-loeschwasser-nass": ["fsmobile-pb-loeschwasser-nass-v1"],
"pb-zentralbatterie-anlage": ["fsmobile-pb-zentralbatterie-v1"],
"pb-wandhydranten": ["pb-wandhydranten-report-v1"],
"pb-hydranten": ["fsmobile-pb-hydranten-v1"],
"pb-rauchwarnmelder": ["pb-rauchwarnmelder-current-v1"]
}[moduleId] || [];
var keys = known.slice();
var moduleToken = normalizeFsmobileKey(moduleId);
try {
for (var index = 0; index < localStorage.length; index += 1) {
var key = localStorage.key(index) || "";
var keyToken = normalizeFsmobileKey(key);
if (!moduleToken || keyToken.indexOf(moduleToken) < 0) continue;
if (/archive|current.*archive/i.test(key)) continue;
if (keys.indexOf(key) < 0) keys.push(key);
}
} catch (error) {}
keys.push(generatedSignatureStorageKey());
return keys;
}

function fsmobileSignatureDataUrlFromValue(value, depth) {
depth = depth || 0;
if (!value || depth > 5) return "";
if (typeof value === "string") {
return /^data:image\\/png;base64,/i.test(value) && value.length > 18000 ? value : "";
}
if (Array.isArray(value)) {
for (var index = 0; index < value.length; index += 1) {
var arrayResult = fsmobileSignatureDataUrlFromValue(value[index], depth + 1);
if (arrayResult) return arrayResult;
}
return "";
}
if (typeof value !== "object") return "";
var preferredKeys = [
"signature",
"signatureData",
"signaturePad",
"technikerSignature",
"technicianSignature",
"unterschrift",
"digitaleUnterschrift",
"signatur",
"fsmobileSignature",
"fsmobileTechnikerSignature"
];
for (var preferredIndex = 0; preferredIndex < preferredKeys.length; preferredIndex += 1) {
var preferredResult = fsmobileSignatureDataUrlFromValue(value[preferredKeys[preferredIndex]], depth + 1);
if (preferredResult) return preferredResult;
}
var keys = Object.keys(value);
for (var keyIndex = 0; keyIndex < keys.length; keyIndex += 1) {
var key = keys[keyIndex];
if (!/signature|signatur|unterschrift/i.test(key)) continue;
var keyResult = fsmobileSignatureDataUrlFromValue(value[key], depth + 1);
if (keyResult) return keyResult;
}
return "";
}

function fsmobileSignatureCanvases() {
return Array.from(document.querySelectorAll("canvas")).filter(canvasLooksLikeSignature);
}

function primaryFsmobileSignatureCanvas() {
return document.getElementById("signaturePad") ||
document.getElementById("fsmobileTechnikerSignaturePad") ||
fsmobileSignatureCanvases()[0] ||
null;
}

function canvasHasUsableFsmobileSignature(canvas) {
if (!canvas || canvas.width < 80 || canvas.height < 30) return false;
try {
var context = canvas.getContext("2d", { willReadFrequently: true });
var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
var dark = 0;
var edge = 0;
for (var index = 0; index < data.length; index += 4) {
var alpha = data[index + 3];
if (alpha <= 15) continue;
var luminance = data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
if (luminance < 160) dark += 1;
if (index >= 4 && Math.abs(alpha - data[index - 1]) > 80) edge += 1;
if (index >= canvas.width * 4 && Math.abs(alpha - data[index - canvas.width * 4 + 3]) > 80) edge += 1;
if (dark >= 30 && edge >= 12) return true;
}
return dark >= 45;
} catch (error) {
return false;
}
}

function currentFsmobileSignatureDataUrl() {
var canvas = primaryFsmobileSignatureCanvas();
if (!canvas) return "";
if (fsmobileSignatureCanvasCache && fsmobileSignatureCanvasCache.has(canvas)) {
return fsmobileSignatureCanvasCache.get(canvas) || "";
}
var signature = "";
if (!canvasIsBlank(canvas) && canvasHasUsableFsmobileSignature(canvas)) {
try { signature = canvas.toDataURL("image/png"); } catch (error) { signature = ""; }
}
cacheFsmobileSignatureCanvasData(canvas, signature);
return signature;
}

function mergeFsmobileSignatureIntoReportData(data, signature) {
if (!data || typeof data !== "object" || Array.isArray(data) || !signature) return data;
[
"signatureData",
"signaturePad",
"technikerSignature",
"technicianSignature",
"unterschrift",
"digitaleUnterschrift",
"signatur",
"fsmobileSignature",
"fsmobileTechnikerSignature"
].forEach(function(key) {
if (Object.prototype.hasOwnProperty.call(data, key)) delete data[key];
});
if (data.fields && typeof data.fields === "object" && !Array.isArray(data.fields)) {
[
"signature",
"signatureData",
"signaturePad",
"technikerSignature",
"technicianSignature",
"unterschrift",
"digitaleUnterschrift",
"signatur",
"fsmobileSignature",
"fsmobileTechnikerSignature"
].forEach(function(key) {
if (Object.prototype.hasOwnProperty.call(data.fields, key)) delete data.fields[key];
});
}
data.signature = signature;
return data;
}

function stripFsmobileSignatureFromReportData(value, depth) {
depth = depth || 0;
if (!value || depth > 6 || typeof value !== "object") return value;
if (Array.isArray(value)) {
value.forEach(function(item) { stripFsmobileSignatureFromReportData(item, depth + 1); });
return value;
}
[
"signature",
"signatureData",
"signaturePad",
"technikerSignature",
"technicianSignature",
"unterschrift",
"digitaleUnterschrift",
"signatur",
"fsmobileSignature",
"fsmobileTechnikerSignature"
].forEach(function(key) {
if (Object.prototype.hasOwnProperty.call(value, key)) delete value[key];
});
Object.keys(value).forEach(function(key) {
if (/signature|signatur|unterschrift/i.test(key)) {
delete value[key];
} else {
stripFsmobileSignatureFromReportData(value[key], depth + 1);
}
});
return value;
}

function readStoredFsmobileSignature() {
if (window.__fsmobileSignatureClearInProgress) return "";
var keys = fsmobileSignatureStorageKeyCandidates();
for (var index = 0; index < keys.length; index += 1) {
try {
var raw = localStorage.getItem(keys[index]);
if (!raw) continue;
var rawSignature = fsmobileSignatureDataUrlFromValue(raw);
if (rawSignature) return rawSignature;
var signature = fsmobileSignatureDataUrlFromValue(JSON.parse(raw));
if (signature) return signature;
} catch (error) {}
}
return "";
}

function storageKeyCanCarryFsmobileSignature(key) {
return fsmobileSignatureStorageKeyCandidates().indexOf(String(key || "")) >= 0;
}

function installFsmobileSignatureStorageGuard() {
if (window.__fsmobileSignatureStorageGuardInstalled || !window.Storage || !window.Storage.prototype) return;
var nativeSetItem = window.Storage.prototype.setItem;
if (typeof nativeSetItem !== "function") return;
Object.defineProperty(window, "__fsmobileSignatureStorageGuardInstalled", { value: true });
window.Storage.prototype.setItem = function(key, value) {
if (this === localStorage && storageKeyCanCarryFsmobileSignature(key) && !window.__fsmobileReportImportInProgress) {
try {
if (window.__fsmobileSignatureClearInProgress && String(key || "") === generatedSignatureStorageKey()) {
localStorage.removeItem(key);
return undefined;
}
var nextPayload = JSON.parse(String(value || "null"));
if (nextPayload && typeof nextPayload === "object") {
if (window.__fsmobileSignatureClearInProgress) {
stripFsmobileSignatureFromReportData(nextPayload);
value = JSON.stringify(nextPayload);
} else {
var nextSignature = fsmobileSignatureDataUrlFromValue(nextPayload);
var previousSignature = fsmobileSignatureDataUrlFromValue(JSON.parse(localStorage.getItem(key) || "null"));
var currentSignature = window.__fsmobileLastUsableSignature || previousSignature || currentFsmobileSignatureDataUrl();
var preservedSignature = currentSignature || "";
if (preservedSignature && !nextSignature) {
mergeFsmobileSignatureIntoReportData(nextPayload, preservedSignature);
value = JSON.stringify(nextPayload);
}
}
}
} catch (error) {}
}
return nativeSetItem.call(this, key, value);
};
}
installFsmobileSignatureStorageGuard();

function restoreFsmobileSignatureDataUrl(signature, options) {
if (window.__fsmobileSignatureClearInProgress) return false;
if (!signature) return false;
window.__fsmobileLastUsableSignature = signature;
var canvases = fsmobileSignatureCanvases();
if (!canvases.length) return false;
canvases.forEach(function(canvas) {
resizeSignatureCanvasForCurrentLayout(canvas);
cacheFsmobileSignatureCanvasData(canvas, signature);
var context = canvas.getContext("2d", { willReadFrequently: true });
var image = new Image();
image.onload = function() {
var draw = function() {
drawSignatureImageToCanvas(canvas, context, image);
try { canvas.dispatchEvent(new Event("change", { bubbles: true })); } catch (error) {}
};
draw();
setTimeout(draw, 80);
setTimeout(draw, 260);
};
image.src = signature;
});
if (document.getElementById("fsmobileTechnikerSignaturePad") && (!options || options.persist !== false)) {
try { localStorage.setItem(generatedSignatureStorageKey(), signature); } catch (error) {}
}
return true;
}

function restoreFsmobileSignatureFromStorage() {
if (window.__fsmobileSignatureClearInProgress) return;
var signature = readStoredFsmobileSignature();
if (signature) restoreFsmobileSignatureDataUrl(signature, { persist: false });
}

function clearFsmobileSignatureCanvasesNow() {
fsmobileSignatureCanvases().forEach(function(canvas) {
try {
var context = canvas.getContext("2d", { willReadFrequently: true });
context.save();
context.setTransform(1, 0, 0, 1, 0, 0);
context.clearRect(0, 0, canvas.width, canvas.height);
context.restore();
cacheFsmobileSignatureCanvasData(canvas, "");
} catch (error) {}
});
}

function scheduleFsmobileSignatureRestore() {
[0, 80, 220, 500, 900, 1400].forEach(function(delay) {
window.setTimeout(restoreFsmobileSignatureFromStorage, delay);
});
}

function persistFsmobileSignatureAfterInput() {
var signature = currentFsmobileSignatureDataUrl();
if (!signature) return;
window.__fsmobileLastUsableSignature = signature;
if (document.getElementById("fsmobileTechnikerSignaturePad")) {
try { localStorage.setItem(generatedSignatureStorageKey(), signature); } catch (error) {}
}
["saveToStorageNow", "saveFormToStorage", "saveCurrentDraft", "saveForm", "saveToStorage"].some(function(name) {
var fn = window[name];
if (typeof fn !== "function") return false;
try { fn(); } catch (error) {}
return true;
});
}

function installFsmobileSignatureDataBridge() {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "") || window.__fsmobileSignatureDataBridgeInstalled) return;
window.__fsmobileSignatureDataBridgeInstalled = true;
["getSignatureData", "getStorageSignature"].forEach(function(name) {
var original = window[name];
if (typeof original !== "function" || original.__fsmobileSignatureWrapped) return;
window[name] = function() {
if (window.__fsmobileSignatureClearInProgress) return "";
return original.apply(this, arguments);
};
window[name].__fsmobileSignatureWrapped = true;
});
["getCurrentReport", "collectData", "collectReportData", "buildStoragePayload"].forEach(function(name) {
var original = window[name];
if (typeof original !== "function" || original.__fsmobileSignatureWrapped) return;
window[name] = function() {
var data = original.apply(this, arguments);
if (window.__fsmobileSignatureClearInProgress) {
return stripFsmobileSignatureFromReportData(data);
}
var dataSignature = fsmobileSignatureDataUrlFromValue(data);
if (dataSignature) {
window.__fsmobileLastUsableSignature = dataSignature;
cacheFsmobileSignatureCanvasData(primaryFsmobileSignatureCanvas(), dataSignature);
}
var signature = dataSignature || window.__fsmobileLastUsableSignature || currentFsmobileSignatureDataUrl() || readStoredFsmobileSignature();
return mergeFsmobileSignatureIntoReportData(data, signature);
};
window[name].__fsmobileSignatureWrapped = true;
});
["applyReport", "applyData", "applyReportData", "applyStoragePayload", "restoreReportData"].forEach(function(name) {
var original = window[name];
if (typeof original !== "function" || original.__fsmobileSignatureWrapped) return;
window[name] = function(data) {
if (window.__fsmobileReportImportInProgress) {
return original.apply(this, arguments);
}
if (window.__fsmobileSignatureClearInProgress) {
return original.apply(this, arguments);
}
var signature = fsmobileSignatureDataUrlFromValue(data);
var result = original.apply(this, arguments);
if (signature) {
[0, 80, 260, 700].forEach(function(delay) {
window.setTimeout(function() {
restoreFsmobileSignatureDataUrl(signature, { persist: true });
}, delay);
});
} else {
scheduleFsmobileSignatureRestore();
}
return result;
};
window[name].__fsmobileSignatureWrapped = true;
});
document.addEventListener("pointerdown", function(event) {
if (event.target && canvasLooksLikeSignature(event.target)) {
markFsmobileSignatureCanvasDirty(event.target);
window.__fsmobileSignatureClearToken = (window.__fsmobileSignatureClearToken || 0) + 1;
window.__fsmobileSignatureClearInProgress = false;
}
}, true);
document.addEventListener("pointerup", function(event) {
if (event.target && canvasLooksLikeSignature(event.target)) {
window.setTimeout(persistFsmobileSignatureAfterInput, 0);
window.setTimeout(persistFsmobileSignatureAfterInput, 120);
}
}, true);
document.addEventListener("change", function(event) {
if (event.target && canvasLooksLikeSignature(event.target)) {
window.setTimeout(persistFsmobileSignatureAfterInput, 0);
}
}, true);
document.addEventListener("click", function(event) {
var button = event.target && event.target.closest ? event.target.closest("button") : null;
if (!button || !button.closest(".signature-actions")) return;
if (!/unterschrift.*löschen|signatur.*löschen|signature.*clear/i.test(button.textContent || button.className || "")) return;
window.__fsmobileSignatureClearInProgress = true;
window.__fsmobileLastUsableSignature = "";
var clearToken = (window.__fsmobileSignatureClearToken || 0) + 1;
window.__fsmobileSignatureClearToken = clearToken;
try {
window.parent.postMessage({ type: "fsmobile-signature-clear", moduleId: window.FSMOBILE_MODULE_ID }, "*");
} catch (error) {}
try {
fsmobileSignatureStorageKeyCandidates().forEach(function(key) {
if (key === generatedSignatureStorageKey()) {
localStorage.removeItem(key);
return;
}
var raw = localStorage.getItem(key);
if (!raw) return;
if (/^data:image\\/png;base64,/i.test(raw)) {
localStorage.removeItem(key);
return;
}
var payload = JSON.parse(raw);
stripFsmobileSignatureFromReportData(payload);
localStorage.setItem(key, JSON.stringify(payload));
});
} catch (error) {}
[0, 40, 120, 260, 520, 900, 1300, 1550, 2100, 2800].forEach(function(delay) {
window.setTimeout(function() {
if (window.__fsmobileSignatureClearToken !== clearToken) return;
clearFsmobileSignatureCanvasesNow();
}, delay);
});
window.setTimeout(function() {
if (window.__fsmobileSignatureClearToken === clearToken) window.__fsmobileSignatureClearInProgress = false;
}, 3600);
}, true);
installFsmobileSignatureStorageGuard();
scheduleFsmobileSignatureRestore();
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
var draw = function() { drawSignatureImageToCanvas(canvas, context, image); };
draw();
setTimeout(draw, 80);
setTimeout(draw, 260);
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
image.onload = function() { drawSignatureImageToCanvas(canvas, context, image); };
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

function fsmobilePdfImageMatchesReference(imageData, referenceDataUrl) {
if (!imageData || !referenceDataUrl || typeof imageData !== "string" || typeof referenceDataUrl !== "string") return false;
if (imageData === referenceDataUrl) return true;
return imageData.length > 10000 && referenceDataUrl.length > 10000 && imageData.slice(0, 220) === referenceDataUrl.slice(0, 220);
}

function isFsmobileSignaturePdfImage(imageData, width, height) {
if (typeof imageData !== "string" || !/^data:image\\/png;base64,/i.test(imageData)) return false;
var currentSignature = currentFsmobileSignatureDataUrl();
var generatedSignature = generatedSignatureDataUrl();
if (fsmobilePdfImageMatchesReference(imageData, currentSignature) || fsmobilePdfImageMatchesReference(imageData, generatedSignature)) return true;
var imageWidth = Number(width);
var imageHeight = Number(height);
var signatureSized = imageWidth >= 55 && imageWidth <= 90 && imageHeight >= 15 && imageHeight <= 35;
return !!(signatureSized && imageData.length > 5000 && (currentSignature || generatedSignature));
}

function appendGeneratedSignatureToPdf(doc) {
if (!doc || doc.__fsmobileGeneratedSignatureAppended || doc.__fsmobileSignaturePdfTextSeen || doc.__fsmobileSignatureImageSeen) return;
var signature = currentFsmobileSignatureDataUrl() || generatedSignatureDataUrl();
if (!signature) return;
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
try { doc.addImage(signature, "PNG", margin, y + 8, 74, 24, undefined, "SLOW"); } catch (error) {}
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
return /^pb-/.test(window.FSMOBILE_MODULE_ID || "") || window.FSMOBILE_MODULE_ID === "auftrag-bescheinigungen" || window.FSMOBILE_MODULE_ID === "planungshilfe-bma" || window.FSMOBILE_MODULE_ID === "aufmass-brandabschottungen" || window.FSMOBILE_MODULE_ID === "maengelliste" || window.FSMOBILE_MODULE_ID === "maengelliste-bilddoku" || window.FSMOBILE_MODULE_ID === "maengelliste-maengelbeschreibungen";
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

function appendCustomerNumberToPdf(doc) {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "") || !doc || doc.__fsmobileCustomerNumberPdfAppended || doc.__fsmobileCustomerNumberPdfTextSeen) return doc;
var label = FSMOBILE_CUSTOMER_NUMBER_LABEL + ": " + (currentCustomerNumberValue() || "-");
try { Object.defineProperty(doc, "__fsmobileCustomerNumberPdfAppended", { value: true }); }
catch (error) { doc.__fsmobileCustomerNumberPdfAppended = true; }
try {
var pageCount = getFsmobilePdfPageCount(doc);
var currentPage = getFsmobileCurrentPdfPage(doc);
var pageWidth = getFsmobilePdfPageWidth(doc);
var x = 12;
var y = 24;
var maxWidth = Math.max(50, pageWidth - 24);
for (var page = 1; page <= pageCount; page += 1) {
try { if (typeof doc.setPage === "function") doc.setPage(page); } catch (error) {}
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.setTextColor("#111827");
doc.text(doc.splitTextToSize(label, maxWidth), x, y);
}
try { if (currentPage && typeof doc.setPage === "function") doc.setPage(currentPage); } catch (error) {}
} catch (error) {}
return doc;
}

window.FSMOBILE_STAMP_PDF_LOGO = stampFsmobilePdfLogo;

async function buildFsmobileVectorListPdf(options) {
options = options || {};
var JsPDF = options.JsPDF;
if (typeof JsPDF !== "function") throw new Error("PDF-Bibliothek ist nicht verfügbar.");

var doc = new JsPDF({
orientation: "landscape",
unit: "mm",
format: "a4",
compress: true,
putOnlyUsedFonts: true,
precision: 12
});
var pageWidth = doc.internal.pageSize.getWidth();
var pageHeight = doc.internal.pageSize.getHeight();
var margin = 10;
var contentWidth = pageWidth - margin * 2;
var bottom = pageHeight - 16;
var title = String(options.title || "Mängelliste");
var meta = Array.isArray(options.meta) ? options.meta : [];
var rows = Array.isArray(options.rows) ? options.rows : [];
var remarks = String(options.remarks || "").trim();
var photos = Array.isArray(options.photos) ? options.photos : [];
var started = false;
var tableBodyTop = 0;

var sourceColumns = Array.isArray(options.columns) ? options.columns : [];
var sourceWidth = sourceColumns.reduce(function(sum, column) {
return sum + (Number(column.width) || 0);
}, 0) || contentWidth;
var widthScale = contentWidth / sourceWidth;
var columns = sourceColumns.map(function(column) {
return {
label: String(column.label || ""),
width: (Number(column.width) || 1) * widthScale,
align: column.align === "center" || column.align === "right" ? column.align : "left"
};
});

function cleanValue(value, fallback) {
var text = String(value == null ? "" : value)
.split(String.fromCharCode(13)).join("")
.trim();
return text || (fallback == null ? "-" : String(fallback));
}

function splitText(value, width, style, size, fallback) {
doc.setFont("helvetica", style || "normal");
doc.setFontSize(size || 8);
var paragraphs = cleanValue(value, fallback).split(String.fromCharCode(10));
var lines = [];
paragraphs.forEach(function(paragraph) {
var wrapped = doc.splitTextToSize(paragraph || " ", Math.max(2, width));
if (Array.isArray(wrapped)) lines = lines.concat(wrapped);
else lines.push(String(wrapped || " "));
});
return lines.length ? lines : [" "];
}

function drawDocumentHeader() {
doc.setFillColor(235, 0, 69);
doc.rect(margin, 30, contentWidth, 10, "F");
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(13);
doc.text(title, pageWidth / 2, 36.8, { align: "center" });

var metaTop = 45;
var metaWidth = meta.length ? contentWidth / meta.length : contentWidth;
var metaLines = [];
var maxLines = 1;
meta.forEach(function(pair) {
var lines = splitText(pair && pair[1], metaWidth - 4, "normal", 7.7, "-");
metaLines.push(lines);
maxLines = Math.max(maxLines, lines.length);
});
meta.forEach(function(pair, index) {
var x = margin + index * metaWidth;
doc.setTextColor(98, 106, 117);
doc.setFont("helvetica", "bold");
doc.setFontSize(6.8);
doc.text(cleanValue(pair && pair[0], ""), x, metaTop);
doc.setTextColor(17, 24, 39);
doc.setFont("helvetica", "normal");
doc.setFontSize(7.7);
doc.text(metaLines[index], x, metaTop + 4.8);
});
return metaTop + 5 + maxLines * 3.4 + 4;
}

function drawTableHeader(y) {
doc.setFont("helvetica", "bold");
doc.setFontSize(6.35);
var wrapped = columns.map(function(column) {
return splitText(column.label, column.width - 3, "bold", 6.35, "");
});
var maxLines = wrapped.reduce(function(maximum, lines) {
return Math.max(maximum, lines.length);
}, 1);
var height = Math.max(9, maxLines * 3 + 3.2);
var x = margin;
columns.forEach(function(column, index) {
doc.setDrawColor(255, 255, 255);
doc.setLineWidth(0.2);
doc.setFillColor(255, 180, 71);
doc.rect(x, y, column.width, height, "FD");
doc.setTextColor(17, 24, 39);
doc.setFont("helvetica", "bold");
doc.setFontSize(6.35);
wrapped[index].forEach(function(line, lineIndex) {
var lineY = y + 3.5 + lineIndex * 3;
if (column.align === "center") doc.text(line, x + column.width / 2, lineY, { align: "center" });
else if (column.align === "right") doc.text(line, x + column.width - 1.5, lineY, { align: "right" });
else doc.text(line, x + 1.5, lineY);
});
x += column.width;
});
return y + height;
}

function beginPage(withTableHeader) {
if (started) doc.addPage("a4", "landscape");
started = true;
var y = drawDocumentHeader();
if (withTableHeader) y = drawTableHeader(y);
return y;
}

function drawCellText(lines, column, x, y, lineHeight) {
doc.setTextColor(17, 24, 39);
doc.setFont("helvetica", "normal");
doc.setFontSize(6.55);
lines.forEach(function(line, index) {
var lineY = y + 3.5 + index * lineHeight;
if (column.align === "center") doc.text(line, x + column.width / 2, lineY, { align: "center" });
else if (column.align === "right") doc.text(line, x + column.width - 1.5, lineY, { align: "right" });
else doc.text(line, x + 1.5, lineY);
});
}

function drawRowChunk(lineGroups, y, height, rowIndex) {
var x = margin;
columns.forEach(function(column, index) {
doc.setDrawColor(255, 255, 255);
doc.setLineWidth(0.2);
if (rowIndex % 2) doc.setFillColor(245, 245, 245);
else doc.setFillColor(250, 250, 250);
doc.rect(x, y, column.width, height, "FD");
drawCellText(lineGroups[index] || [], column, x, y, 3.15);
x += column.width;
});
return y + height;
}

function drawRows(y) {
var maximumRowHeight = bottom - tableBodyTop;
rows.forEach(function(sourceRow, rowIndex) {
var row = Array.isArray(sourceRow) ? sourceRow : [];
var lineGroups = columns.map(function(column, columnIndex) {
return splitText(row[columnIndex], column.width - 3, "normal", 6.55, "-");
});
var maxLines = lineGroups.reduce(function(maximum, lines) {
return Math.max(maximum, lines.length);
}, 1);
var fullHeight = Math.max(8, maxLines * 3.15 + 3.4);

if (fullHeight <= maximumRowHeight && y + fullHeight > bottom) {
y = beginPage(true);
}

if (fullHeight <= bottom - y) {
y = drawRowChunk(lineGroups, y, fullHeight, rowIndex);
return;
}

if (y > tableBodyTop + 0.1) y = beginPage(true);
var offsets = columns.map(function() { return 0; });
while (offsets.some(function(offset, index) { return offset < lineGroups[index].length; })) {
var maxFit = Math.floor((bottom - y - 3.4) / 3.15);
if (maxFit < 1) {
y = beginPage(true);
maxFit = Math.max(1, Math.floor((bottom - y - 3.4) / 3.15));
}
var remaining = lineGroups.reduce(function(maximum, lines, index) {
return Math.max(maximum, lines.length - offsets[index]);
}, 0);
var take = Math.min(remaining, maxFit);
var chunks = lineGroups.map(function(lines, index) {
var chunk = lines.slice(offsets[index], offsets[index] + take);
offsets[index] += take;
return chunk;
});
y = drawRowChunk(chunks, y, Math.max(8, take * 3.15 + 3.4), rowIndex);
if (offsets.some(function(offset, index) { return offset < lineGroups[index].length; })) {
y = beginPage(true);
}
}
});
return y;
}

function drawSectionHeader(y, label) {
doc.setDrawColor(255, 255, 255);
doc.setLineWidth(0.2);
doc.setFillColor(255, 180, 71);
doc.rect(margin, y, contentWidth, 8, "FD");
doc.setTextColor(17, 24, 39);
doc.setFont("helvetica", "bold");
doc.setFontSize(8);
doc.text(label, margin + 2, y + 5.2);
return y + 8;
}

function drawRemarks(y) {
if (!remarks) return y;
var lines = splitText(remarks, contentWidth - 4, "normal", 8, "-");
var offset = 0;
var continued = false;
while (offset < lines.length) {
if (y + 24 > bottom) y = beginPage(false);
y += 4;
y = drawSectionHeader(y, continued ? "Bemerkungen (Fortsetzung)" : "Bemerkungen");
var maxLines = Math.max(1, Math.floor((bottom - y - 5) / 4));
var chunk = lines.slice(offset, offset + maxLines);
var height = Math.max(12, chunk.length * 4 + 5);
doc.setDrawColor(255, 255, 255);
doc.setLineWidth(0.2);
doc.setFillColor(245, 245, 245);
doc.rect(margin, y, contentWidth, height, "FD");
doc.setTextColor(17, 24, 39);
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.text(chunk, margin + 2, y + 5);
y += height;
offset += chunk.length;
if (offset < lines.length) {
y = beginPage(false);
continued = true;
}
}
return y;
}

function loadPhotoInfo(source) {
return new Promise(function(resolve, reject) {
var image = new Image();
image.onload = function() {
resolve({
width: image.naturalWidth || image.width || 1,
height: image.naturalHeight || image.height || 1
});
};
image.onerror = reject;
image.src = source;
});
}

async function drawPhotos() {
if (!photos.length) return;
var chunkSize = 4;
for (var start = 0; start < photos.length; start += chunkSize) {
var y = beginPage(false);
y = drawSectionHeader(y, "Bilddokumentation");
var gap = 5;
var cellWidth = (contentWidth - gap) / 2;
var cellHeight = (bottom - y - gap) / 2;
var chunk = photos.slice(start, start + chunkSize);
for (var index = 0; index < chunk.length; index += 1) {
var photo = chunk[index] || {};
var columnIndex = index % 2;
var rowIndex = Math.floor(index / 2);
var x = margin + columnIndex * (cellWidth + gap);
var top = y + rowIndex * (cellHeight + gap);
var labelHeight = 13;
doc.setDrawColor(255, 255, 255);
doc.setLineWidth(0.2);
doc.setFillColor(245, 245, 245);
doc.rect(x, top, cellWidth, cellHeight, "FD");
doc.setFillColor(255, 180, 71);
doc.rect(x, top + cellHeight - labelHeight, cellWidth, labelHeight, "F");
doc.setTextColor(17, 24, 39);
doc.setFont("helvetica", "bold");
doc.setFontSize(6.4);
doc.text("Bauteilzuordnung", x + 2, top + cellHeight - 8.8);
var assignmentLines = splitText(photo.assignment, cellWidth - 4, "normal", 7.2, "-").slice(0, 2);
doc.setFont("helvetica", "normal");
doc.setFontSize(7.2);
doc.text(assignmentLines, x + 2, top + cellHeight - 4.8);

var source = String(photo.src || "");
if (!source) continue;
try {
var info = await loadPhotoInfo(source);
var maxWidth = cellWidth - 4;
var maxHeight = cellHeight - labelHeight - 4;
var scale = Math.min(maxWidth / info.width, maxHeight / info.height);
var imageWidth = info.width * scale;
var imageHeight = info.height * scale;
var imageX = x + (cellWidth - imageWidth) / 2;
var imageY = top + 2 + (maxHeight - imageHeight) / 2;
var format = source.toLowerCase().indexOf("data:image/png") === 0 ? "PNG" : "JPEG";
doc.addImage(source, format, imageX, imageY, imageWidth, imageHeight, undefined, "FAST");
} catch (error) {
doc.setTextColor(98, 106, 117);
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.text("Foto konnte nicht eingebettet werden.", x + 3, top + 10);
}
}
}
}

function addPageNumbers() {
var pageCount = getFsmobilePdfPageCount(doc);
var currentPage = getFsmobileCurrentPdfPage(doc);
for (var page = 1; page <= pageCount; page += 1) {
if (typeof doc.setPage === "function") doc.setPage(page);
doc.setTextColor(98, 106, 117);
doc.setFont("helvetica", "normal");
doc.setFontSize(7);
doc.text("Seite " + page + " von " + pageCount, pageWidth - margin, pageHeight - 8, { align: "right" });
}
if (currentPage && typeof doc.setPage === "function") doc.setPage(currentPage);
}

var y = beginPage(true);
tableBodyTop = y;
y = drawRows(y);
drawRemarks(y);
await drawPhotos();
addPageNumbers();
stampFsmobilePdfLogo(doc);
return doc;
}

window.FSMOBILE_BUILD_VECTOR_LIST_PDF = buildFsmobileVectorListPdf;

function patchPdfLogoMethods(target) {
if (!target || target.__fsmobileLogoMethodsPatched) return;
Object.defineProperty(target, "__fsmobileLogoMethodsPatched", { value: true });
if (typeof target.output === "function") {
var originalOutput = target.output;
target.output = function() {
appendCustomerNumberToPdf(this);
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

function finishCombinedPdfExport(pdfBlob, fileName, transaction) {
var builder = window.FSMOBILE_CREATE_REPORT_EXPORT_ZIP;
if ((!window.FSMOBILE_COMBINED_PDF_EXPORT && !transaction) || typeof builder !== "function" || !/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
window.FSMOBILE_COMBINED_PDF_EXPORT = null;
var pdfName = fsmobilePdfFileName(fileName || "Pruefbericht.pdf");
Promise.resolve(builder(pdfBlob, pdfName, transaction)).catch(function(error) {
console.warn("Kombinierter PDF/JSON-Export konnte nicht erstellt werden:", error);
if (typeof window.FSMOBILE_SET_ACTION_STATUS === "function") window.FSMOBILE_SET_ACTION_STATUS("PDF Export konnte nicht erstellt werden.");
if (!transaction) downloadRawBlob(pdfBlob, pdfName);
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
if (/unterschrift\s+techniker/i.test(pdfArgumentPlainText(originalPdfText)) || /unterschrift\s+techniker/i.test(pdfArgumentPlainText(args[0]))) {
this.__fsmobileSignaturePdfTextSeen = true;
}
if (/kunden\s*nr\.?/i.test(pdfArgumentPlainText(originalPdfText)) || /kunden\s*nr\.?/i.test(pdfArgumentPlainText(args[0]))) {
this.__fsmobileCustomerNumberPdfTextSeen = true;
}
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

function patchPdfImageMethod(target) {
if (!target || target.__fsmobileImagePatched || typeof target.addImage !== "function") return;
var originalAddImage = target.addImage;
Object.defineProperty(target, "__fsmobileImagePatched", { value: true });
target.addImage = function(imageData, format, x, y, width, height) {
if (isFsmobileSignaturePdfImage(imageData, width, height)) {
this.__fsmobileSignatureImageSeen = true;
}
return originalAddImage.apply(this, arguments);
};
}

function patchPdfInstance(instance) {
if (!instance) return instance;
instance.__fsmobileUiExportTransaction = window.FSMOBILE_UI_EXPORT_TRANSACTION || null;
patchPdfTextMethod(instance);
patchPdfImageMethod(instance);
patchPdfLogoMethods(instance);
if (instance.__fsmobileSavePatched || typeof instance.save !== "function") return instance;
var originalSave = instance.save;
Object.defineProperty(instance, "__fsmobileSavePatched", { value: true });
instance.save = function(fileName) {
var args = Array.prototype.slice.call(arguments);
args[0] = fsmobilePdfFileName(fileName);
appendCustomerNumberToPdf(this);
appendLandscapeReportRemarkToPdf(this);
appendGeneratedSignatureToPdf(this);
stampFsmobilePdfLogo(this);
try {
if (finishCombinedPdfExport(this.output("blob"), args[0], this.__fsmobileUiExportTransaction)) return this;
if (window.parent.FSMOBILE_UI && window.parent.FSMOBILE_UI.receiveExport(window, this.__fsmobileUiExportTransaction, this.output("blob"), args[0])) return this;
} catch (error) {}
return originalSave.apply(this, args);
};
return instance;
}

function patchJsPdfPrototype(JsPDF) {
if (!JsPDF || !JsPDF.prototype) return;
patchPdfTextMethod(JsPDF.prototype);
patchPdfImageMethod(JsPDF.prototype);
patchPdfImageMethod(JsPDF.API);
patchPdfLogoMethods(JsPDF.prototype);
if (JsPDF.prototype.__fsmobileSavePatched) return;
var originalSave = JsPDF.prototype.save;
if (typeof originalSave !== "function") return;
Object.defineProperty(JsPDF.prototype, "__fsmobileSavePatched", { value: true });
JsPDF.prototype.save = function(fileName) {
var args = Array.prototype.slice.call(arguments);
args[0] = fsmobilePdfFileName(fileName);
appendCustomerNumberToPdf(this);
appendLandscapeReportRemarkToPdf(this);
appendGeneratedSignatureToPdf(this);
stampFsmobilePdfLogo(this);
try {
if (finishCombinedPdfExport(this.output("blob"), args[0], this.__fsmobileUiExportTransaction)) return this;
if (window.parent.FSMOBILE_UI && window.parent.FSMOBILE_UI.receiveExport(window, this.__fsmobileUiExportTransaction, this.output("blob"), args[0])) return this;
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
if (typeof window.ensurePdf === "function" && !window.ensurePdf.__fsmobilePatched) {
var originalEnsurePdf = window.ensurePdf;
window.ensurePdf = function() {
return Promise.resolve(originalEnsurePdf.apply(this, arguments))
.then(function(JsPDF) { return currentPatchedJsPdf(JsPDF); });
};
Object.defineProperty(window.ensurePdf, "__fsmobilePatched", { value: true });
}
}

function installPdfFileNamePatch() {
if (!document.__fsmobileScriptLoadPdfPatchInstalled) {
Object.defineProperty(document, "__fsmobileScriptLoadPdfPatchInstalled", { value: true });
document.addEventListener("load", function(event) {
if (!event.target || String(event.target.tagName || "").toUpperCase() !== "SCRIPT") return;
patchAvailableJsPdf();
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

function isFeuerloescherModule() {
return window.FSMOBILE_MODULE_ID === "pb-feuerloescher";
}

function feuerloescherLegacyArchiveKeys() {
return [
"pb-feuerloescher-report-archive-v1",
"pb-feuerloescher-archive-v1",
"fsmobile-pb-feuerloescher-archive-v1"
];
}

function isFeuerloescherLegacyArchiveKey(storageKey) {
return feuerloescherLegacyArchiveKeys().indexOf(String(storageKey || "")) >= 0;
}

function isBrandschutztuerenModule() {
return window.FSMOBILE_MODULE_ID === "pb-brandschutztueren";
}

function brandschutztuerenLegacyArchiveKeys() {
return [
"pb-brandschutztueren-report-archive-v1",
"pb-brandschutztueren-archive-v1",
"fsmobile-pb-brandschutztueren-archive-v1"
];
}

function isBrandschutztuerenLegacyArchiveKey(storageKey) {
return brandschutztuerenLegacyArchiveKeys().indexOf(String(storageKey || "")) >= 0;
}

function isRwaModule() {
return window.FSMOBILE_MODULE_ID === "pb-rwa";
}

function isFluchttuerSteuerungenModule() {
return window.FSMOBILE_MODULE_ID === "pb-fluchttuer-steuerungen";
}

function isRwaArchiveKey(storageKey) {
return String(storageKey || "") === "rwa_pruefbericht_archiv_v1";
}

function legacyArchiveCompatModule() {
return isFeuerloescherModule() || isBrandschutztuerenModule();
}

function legacyArchiveCompatKeys() {
if (isFeuerloescherModule()) return feuerloescherLegacyArchiveKeys();
if (isBrandschutztuerenModule()) return brandschutztuerenLegacyArchiveKeys();
return [];
}

function isLegacyArchiveCompatKey(storageKey) {
return (isFeuerloescherModule() && isFeuerloescherLegacyArchiveKey(storageKey))
|| (isBrandschutztuerenModule() && isBrandschutztuerenLegacyArchiveKey(storageKey));
}

function archiveSourceHasAnyKey(source, keys) {
if (!source || typeof source !== "object") return false;
var wanted = keys.map(function(key) { return String(key).toLowerCase(); });
return Object.keys(source).some(function(key) {
return wanted.indexOf(String(key).toLowerCase()) >= 0;
});
}

function feuerloescherArchiveRow(row) {
if (!Array.isArray(row)) {
return row && typeof row === "object" ? Object.assign({}, row) : {};
}
var values = row.slice();
if (values.length === 12) values.splice(3, 0, "");
if (values.length >= 14) {
return {
btNr: values[1] || "",
standort: values[2] || "",
typ: values[3] || "",
hersteller: values[4] || "",
baujahr: values[5] || "",
ausseninspektion: values[6] || "I.O",
innenkontrolle: values[7] || "I.O",
betrSichV: values[8] || "I.O",
schlauchpruefung: values[9] || "I.O",
reinigung: values[10] || "",
loeschmittelTauschBis: values[11] || "",
pruefplakette: values[12] || "",
bemerkung: values[13] || ""
};
}
var druckDichtheit = values[10] || "";
return {
btNr: "",
standort: values[1] || "",
typ: values[2] || "",
hersteller: values[3] || "",
baujahr: values[4] || "",
ausseninspektion: values[5] || "I.O",
innenkontrolle: values[6] || "I.O",
betrSichV: values[7] || "I.O",
schlauchpruefung: values[8] || "I.O",
reinigung: values[9] || "",
loeschmittelTauschBis: values[11] || "",
pruefplakette: values[12] || "",
bemerkung: druckDichtheit ? "Druck-/Dichtheit: " + druckDichtheit : ""
};
}

function normalizeFeuerloescherArchiveReport(report) {
if (!isFeuerloescherModule() || !report || typeof report !== "object" || Array.isArray(report)) return report || {};
var fields = report.fields && typeof report.fields === "object" && !Array.isArray(report.fields)
? Object.assign({}, report.fields)
: {};
var sourceHeader = report.header && typeof report.header === "object" && !Array.isArray(report.header)
? report.header
: {};
var object = firstArchiveValue(sourceHeader, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(report, ["object", "objekt", "objectInput", "objektInput"]);
var anlage = firstArchiveValue(sourceHeader, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(report, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]);
var technician = firstArchiveValue(sourceHeader, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])
|| firstArchiveValue(fields, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])
|| firstArchiveValue(report, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"]);
var date = firstArchiveValue(sourceHeader, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(report, ["date", "datum", "dateInput", "datumInput"]);
var customer = firstArchiveValue(sourceHeader, customerNumberKeys())
|| firstArchiveValue(fields, customerNumberKeys())
|| firstArchiveValue(report, customerNumberKeys());
var header = Object.assign({}, sourceHeader, {
objekt: String(object || "").trim(),
anlage: String(anlage || "").trim(),
kundenNr: String(customer || "").trim(),
name: String(technician || "").trim(),
datum: normalizeArchiveDate(date)
});
fields.object = header.objekt;
fields.objekt = header.objekt;
fields.anlage = header.anlage;
fields.anlagenNr = header.anlage;
fields.kundenNr = header.kundenNr;
fields.pruefer = header.name;
fields.techniker = header.name;
fields.name = header.name;
fields.date = header.datum;
fields.datum = header.datum;
var normalized = Object.assign({}, report, {
fields: fields,
header: header,
rows: Array.isArray(report.rows) && report.rows.length ? report.rows.map(feuerloescherArchiveRow) : [{}]
});
var remark = firstArchiveValue(report, ["berichtBemerkung", "reportRemark", "reportBemerkung"])
|| firstArchiveValue(fields, ["berichtBemerkung", "reportRemark", "reportBemerkung", "bemerkung"]);
if (remark && !normalized.berichtBemerkung) normalized.berichtBemerkung = remark;
try {
var signature = fsmobileSignatureDataUrlFromValue(report, 0);
if (signature) normalized.signature = signature;
} catch (error) {}
return normalized;
}

function brandschutztuerenArchiveRow(row) {
if (!Array.isArray(row)) {
return row && typeof row === "object" ? Object.assign({}, row) : {};
}
var values = row.slice();
if (values.length >= 14) {
return {
btNr: values[1] || "",
standort: values[2] || "",
art: values[3] || "",
schliesseinrichtung: values[4] || "i.O",
schloss: values[5] || "i.O",
dichtung: values[6] || "i.O",
tuerfluegelAnzahl: values[7] || "1",
tuerfluegel: values[8] || "i.O",
gangfluegel: values[9] || "i.O",
standfluegel: values[10] || "i.O",
schliessfolge: values[11] || "i.O",
pruefergebnis: values[12] || "i.O",
bemerkung: values[13] || ""
};
}
return {
btNr: "",
standort: values[1] || "",
art: values[2] || "",
schliesseinrichtung: values[3] || "i.O",
schloss: values[4] || "i.O",
dichtung: values[5] || "i.O",
tuerfluegelAnzahl: values[6] || "1",
tuerfluegel: values[7] || "i.O",
gangfluegel: values[8] || "i.O",
standfluegel: values[9] || "i.O",
schliessfolge: values[10] || "i.O",
pruefergebnis: values[11] || "i.O",
bemerkung: values[12] || ""
};
}

function normalizeBrandschutztuerenArchiveReport(report) {
if (!isBrandschutztuerenModule() || !report || typeof report !== "object" || Array.isArray(report)) return report || {};
var fields = report.fields && typeof report.fields === "object" && !Array.isArray(report.fields)
? Object.assign({}, report.fields)
: {};
var sourceHeader = report.header && typeof report.header === "object" && !Array.isArray(report.header)
? report.header
: {};
var object = firstArchiveValue(sourceHeader, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(report, ["object", "objekt", "objectInput", "objektInput"]);
var anlage = firstArchiveValue(sourceHeader, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(report, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]);
var technician = firstArchiveValue(sourceHeader, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])
|| firstArchiveValue(fields, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])
|| firstArchiveValue(report, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"]);
var date = firstArchiveValue(sourceHeader, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(report, ["date", "datum", "dateInput", "datumInput"]);
var customer = firstArchiveValue(sourceHeader, customerNumberKeys())
|| firstArchiveValue(fields, customerNumberKeys())
|| firstArchiveValue(report, customerNumberKeys());
var header = Object.assign({}, sourceHeader, {
objekt: String(object || "").trim(),
anlage: String(anlage || "").trim(),
kundenNr: String(customer || "").trim(),
name: String(technician || "").trim(),
datum: normalizeArchiveDate(date)
});
fields.object = header.objekt;
fields.objekt = header.objekt;
fields.anlage = header.anlage;
fields.anlagenNr = header.anlage;
fields.kundenNr = header.kundenNr;
fields.pruefer = header.name;
fields.techniker = header.name;
fields.name = header.name;
fields.date = header.datum;
fields.datum = header.datum;
var normalized = Object.assign({}, report, {
fields: fields,
header: header,
rows: Array.isArray(report.rows) && report.rows.length ? report.rows.map(brandschutztuerenArchiveRow) : [{}]
});
var remark = firstArchiveValue(report, ["berichtBemerkung", "reportRemark", "reportBemerkung"])
|| firstArchiveValue(fields, ["berichtBemerkung", "reportRemark", "reportBemerkung", "bemerkung"]);
if (remark && !normalized.berichtBemerkung) normalized.berichtBemerkung = remark;
try {
var signature = fsmobileSignatureDataUrlFromValue(report, 0);
if (signature) normalized.signature = signature;
} catch (error) {}
return normalized;
}

function archiveEntryReport(entry, storageKey) {
if (!entry || typeof entry !== "object") return {};
var report = entry.report && typeof entry.report === "object"
? entry.report
: entry.data && typeof entry.data === "object"
? entry.data
: legacyArchiveCompatModule() && (
Array.isArray(entry.rows)
|| entry.header
|| entry.fields
|| archiveSourceHasAnyKey(entry, ["object", "objekt", "anlage", "anlagenNr", "name", "date", "datum"].concat(customerNumberKeys()))
)
? entry
: {};
if (isFeuerloescherModule()) return normalizeFeuerloescherArchiveReport(report);
if (isBrandschutztuerenModule()) return normalizeBrandschutztuerenArchiveReport(report);
return report;
}

function archiveFields(entry, storageKey) {
var report = archiveEntryReport(entry, storageKey);
var fields = report.fields && typeof report.fields === "object" && !Array.isArray(report.fields)
? Object.assign({}, report.fields)
: {};
var header = report.header && typeof report.header === "object" && !Array.isArray(report.header)
? report.header
: {};
var anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(header, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]);
var object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(header, ["object", "objekt", "objectInput", "objektInput"]);
var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(header, ["date", "datum", "dateInput", "datumInput"]);
var customer = firstArchiveValue(fields, customerNumberKeys())
|| firstArchiveValue(header, customerNumberKeys());
if (anlage) {
fields.anlage = String(anlage).trim();
if (!fields.anlagenNr) fields.anlagenNr = fields.anlage;
}
if (customer || archiveSourceHasAnyKey(fields, customerNumberKeys()) || archiveSourceHasAnyKey(header, customerNumberKeys())) {
fields.kundenNr = String(customer || "").trim();
}
if (object) {
fields.object = String(object).trim();
if (!fields.objekt) fields.objekt = fields.object;
}
if (date) {
fields.date = normalizeArchiveDate(date);
if (!fields.datum) fields.datum = fields.date;
}
return Object.keys(fields).length ? fields : report;
}

function archiveEntryIdentity(storageKey, entry) {
var fields = archiveFields(entry, storageKey);
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
var header = report.header && typeof report.header === "object" && !Array.isArray(report.header) ? report.header : {};
var domFields = currentArchiveDomFields();
var anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(header, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| domFields.anlage;
var object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(header, ["object", "objekt", "objectInput", "objektInput"])
|| domFields.object;
var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(header, ["date", "datum", "dateInput", "datumInput"])
|| domFields.date;
var customer = firstArchiveValue(fields, customerNumberKeys())
|| firstArchiveValue(header, customerNumberKeys())
|| domFields.kundenNr;
var technician = firstArchiveValue(fields, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])
|| firstArchiveValue(header, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"]);
if (anlage) {
fields.anlage = String(anlage).trim();
if (!fields.anlagenNr) fields.anlagenNr = fields.anlage;
}
if (customer || archiveHasAnyKey(fields, customerNumberKeys()) || archiveHasAnyKey(header, customerNumberKeys()) || customerNumberField()) {
fields.kundenNr = String(customer || "").trim();
if (report.header && typeof report.header === "object" && !Array.isArray(report.header)) report.header.kundenNr = fields.kundenNr;
}
if (object) {
fields.object = String(object).trim();
if (!fields.objekt) fields.objekt = fields.object;
}
if (date) {
fields.date = normalizeArchiveDate(date);
if (!fields.datum) fields.datum = fields.date;
}
if (technician) {
fields.pruefer = String(technician).trim();
if (!fields.techniker) fields.techniker = fields.pruefer;
if (!fields.name) fields.name = fields.pruefer;
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
),
kundenNr: firstArchiveDomValue(
["kundenNrInput", "kundenNummerInput", "kundennrInput"],
["[name='kundenNr']", "[name='kundennr']", "[name='kundenNummer']", "[data-field='kundenNr']", "[data-field='kundennr']", "[data-field='kundenNummer']", "[aria-label='Kunden Nr.']", "[aria-label='Kunden Nr']", "[placeholder*='Kunden']"],
[["kunden", "nr"], ["kunde", "nr"], ["customer"]]
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
if (isFeuerloescherModule()) normalized = normalizeFeuerloescherArchiveReport(normalized);
if (isBrandschutztuerenModule()) normalized = normalizeBrandschutztuerenArchiveReport(normalized);
var fields = normalized.fields && typeof normalized.fields === "object" && !Array.isArray(normalized.fields)
? Object.assign({}, normalized.fields)
: {};
var header = normalized.header && typeof normalized.header === "object" && !Array.isArray(normalized.header)
? normalized.header
: {};
var anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(header, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]);
var object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(header, ["object", "objekt", "objectInput", "objektInput"]);
var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(header, ["date", "datum", "dateInput", "datumInput"]);
var customer = firstArchiveValue(fields, customerNumberKeys())
|| firstArchiveValue(header, customerNumberKeys());
var technician = firstArchiveValue(fields, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"])
|| firstArchiveValue(header, ["pruefer", "techniker", "name", "technician", "prueferInput", "technikerInput"]);
if (anlage) {
fields.anlage = String(anlage).trim();
if (!fields.anlagenNr) fields.anlagenNr = fields.anlage;
}
if (customer || archiveHasAnyKey(fields, customerNumberKeys()) || archiveHasAnyKey(header, customerNumberKeys())) {
fields.kundenNr = String(customer || "").trim();
}
if (object) {
fields.object = String(object).trim();
if (!fields.objekt) fields.objekt = fields.object;
}
if (date) {
fields.date = normalizeArchiveDate(date);
if (!fields.datum) fields.datum = fields.date;
}
if (technician) {
fields.pruefer = String(technician).trim();
if (!fields.techniker) fields.techniker = fields.pruefer;
if (!fields.name) fields.name = fields.pruefer;
}
return Object.keys(fields).length ? fields : normalized;
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
var customer = firstArchiveValue(fields, customerNumberKeys());
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
if (archiveHasAnyKey(fields, customerNumberKeys())) {
ensureCustomerNumberField();
setFirstArchiveDomValue(
["kundenNrInput", "kundenNummerInput", "kundennrInput"],
["[name='kundenNr']", "[name='kundennr']", "[name='kundenNummer']", "[data-field='kundenNr']", "[data-field='kundennr']", "[data-field='kundenNummer']", "[aria-label='Kunden Nr.']", "[aria-label='Kunden Nr']"],
[["kunden", "nr"], ["kunde", "nr"], ["customer"]],
customer
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
if (isModuleDraftStorageKey(key)) continue;
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
if (moduleToken === "pbrwa" && isRwaArchiveKey(key)) return true;
if (keyToken.indexOf(moduleToken) >= 0) return true;
if (moduleToken === "pbzentralbatterieanlage" && keyToken.indexOf("pbzentralbatterie") >= 0) return true;
return false;
}

function archiveStorageKeys(options) {
var keys = [];
try {
for (var index = 0; index < localStorage.length; index += 1) {
var key = localStorage.key(index);
if (isRwaModule() && isRwaArchiveKey(key)) {
keys.push(key);
continue;
}
if (!/^(?:fsmobile-.*pb.*archive.*v\\d+|pb-.*archive.*v\\d+)$/i.test(key) || /current/i.test(key)) continue;
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
var match = text.match(/\\b(?:ARCHIVE_STORAGE_KEY|ARCHIVE_KEY)\\s*=\\s*["']([^"']+)["']/);
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

function addUniqueArchiveStorageKey(keys, storageKey) {
if (!storageKey || keys.indexOf(storageKey) >= 0) return;
keys.push(storageKey);
}

function archiveStorageKeysForDisplay(primaryKey) {
var keys = [];
addUniqueArchiveStorageKey(keys, primaryKey);
if (legacyArchiveCompatModule()) {
legacyArchiveCompatKeys().forEach(function(key) {
addUniqueArchiveStorageKey(keys, key);
});
}
archiveStorageKeys({ currentOnly: true }).forEach(function(key) {
addUniqueArchiveStorageKey(keys, key);
});
return keys;
}

function archiveEntryRecordsForDisplay(primaryKey) {
var records = [];
archiveStorageKeysForDisplay(primaryKey).forEach(function(storageKey) {
readArchiveEntriesForKey(storageKey).forEach(function(entry, index) {
records.push({
storageKey: storageKey,
entry: entry,
index: index
});
});
});
return records;
}

function moduleDraftStorageKeys() {
var keys = [];
var pattern = /\\b(?:STORAGE_KEY|CURRENT_STORAGE_KEY|FORM_STORAGE_KEY|REPORT_STORAGE_KEY)\\s*=\\s*["']([^"']+)["']/g;
document.querySelectorAll("script").forEach(function(script) {
var text = script.textContent || "";
var match = null;
pattern.lastIndex = 0;
while ((match = pattern.exec(text))) {
if (match[1] && keys.indexOf(match[1]) < 0) keys.push(match[1]);
}
});
return keys;
}

function isModuleDraftStorageKey(storageKey) {
return moduleDraftStorageKeys().indexOf(storageKey) >= 0;
}

function recoverDraftStorageOverwrittenByArchiveId() {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return;
var archiveKey = resolveArchiveStorageKey();
if (!archiveKey) return;
var records = archiveEntryRecordsForDisplay(archiveKey);
if (!records.length) return;
moduleDraftStorageKeys().forEach(function(draftKey) {
var raw = "";
try { raw = localStorage.getItem(draftKey) || ""; } catch (error) { return; }
var pointer = String(raw || "").trim();
if (!pointer || /^[{\[]/.test(pointer)) return;
var record = records.find(function(item) {
return item && item.entry && item.entry.id === pointer && archiveEntryReport(item.entry, item.storageKey);
});
if (!record) return;
try { localStorage.setItem(draftKey, JSON.stringify(archiveEntryReport(record.entry, record.storageKey))); } catch (error) {}
});
}

document.addEventListener("DOMContentLoaded", recoverDraftStorageOverwrittenByArchiveId, { once: true });

function createBridgeArchiveId() {
if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
return "archive-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

function archiveDisplayDate(value) {
var normalized = normalizeArchiveDate(value);
var parts = normalized.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
return parts ? parts[3] + "." + parts[2] + "." + parts[1] : (String(value || "").trim() || "Ohne Datum");
}

function archiveDisplayDateTime(value) {
var raw = String(value || "").trim();
if (!raw) return "nicht verfügbar";
var parsed = Date.parse(raw);
if (!Number.isFinite(parsed)) return archiveDisplayDate(raw);
var date = new Date(parsed);
return String(date.getDate()).padStart(2, "0") + "."
+ String(date.getMonth() + 1).padStart(2, "0") + "."
+ date.getFullYear() + ", "
+ String(date.getHours()).padStart(2, "0") + ":"
+ String(date.getMinutes()).padStart(2, "0") + " Uhr";
}

function archiveMissingText(value, fallback) {
var text = String(value || "").replace(/\\s+/g, " ").trim();
return text || fallback;
}

function archiveModuleTypeLabel() {
return archiveMissingText(window.FSMOBILE_MODULE_TITLE || document.title || window.FSMOBILE_MODULE_ID, "Archiv-Eintrag");
}

function archiveEntryMetadata(entry, storageKey) {
var report = archiveEntryReport(entry, storageKey);
var fields = archiveFields(entry, storageKey);
var meta = entry && entry.meta && typeof entry.meta === "object" && !Array.isArray(entry.meta) ? entry.meta : {};
var reportFields = report && report.fields && typeof report.fields === "object" && !Array.isArray(report.fields) ? report.fields : {};
var reportHeader = report && report.header && typeof report.header === "object" && !Array.isArray(report.header) ? report.header : {};
var object = firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(meta, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(reportFields, ["object", "objekt", "objectInput", "objektInput"])
|| firstArchiveValue(reportHeader, ["object", "objekt", "objectInput", "objektInput"]);
var anlage = firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(meta, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(reportFields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"])
|| firstArchiveValue(reportHeader, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]);
var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(meta, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(reportFields, ["date", "datum", "dateInput", "datumInput"])
|| firstArchiveValue(reportHeader, ["date", "datum", "dateInput", "datumInput"]);
var name = firstArchiveValue(fields, ["name", "pruefer", "prüfer", "techniker", "technician", "nameInput", "prueferInput", "technikerInput"])
|| firstArchiveValue(meta, ["name", "pruefer", "prüfer", "techniker", "technician", "nameInput", "prueferInput", "technikerInput"])
|| firstArchiveValue(reportFields, ["name", "pruefer", "prüfer", "techniker", "technician", "nameInput", "prueferInput", "technikerInput"])
|| firstArchiveValue(reportHeader, ["name", "pruefer", "prüfer", "techniker", "technician", "nameInput", "prueferInput", "technikerInput"]);
var customer = firstArchiveValue(fields, customerNumberKeys())
|| firstArchiveValue(meta, customerNumberKeys())
|| firstArchiveValue(reportFields, customerNumberKeys())
|| firstArchiveValue(reportHeader, customerNumberKeys());
var trade = firstArchiveValue(meta, ["gewerk", "trade"]) || firstArchiveValue(fields, ["gewerk", "trade"]) || firstArchiveValue(reportFields, ["gewerk", "trade"]);
return {
type: archiveModuleTypeLabel(),
object: archiveMissingText(object, "nicht vorhanden"),
anlage: archiveMissingText(anlage, "nicht vorhanden"),
kundenNr: archiveMissingText(customer, ""),
date: date ? archiveDisplayDate(date) : "Datum fehlt",
updated: archiveDisplayDateTime(entry && (entry.updatedAt || entry.savedAt || entry.createdAt)),
name: archiveMissingText(name, ""),
trade: archiveMissingText(trade, "")
};
}

function appendArchiveMetaPair(host, label, value) {
var item = document.createElement("span");
item.className = "archive-detail-pair";
var key = document.createElement("b");
key.textContent = label + ": ";
var val = document.createElement("span");
val.textContent = value;
item.append(key, val);
host.appendChild(item);
}

function createArchiveMetadataNode(entry, storageKey) {
var meta = archiveEntryMetadata(entry, storageKey);
var wrapper = document.createElement("div");
wrapper.className = "archive-detail";
var head = document.createElement("div");
head.className = "archive-detail-head";
var type = document.createElement("span");
type.className = "archive-type-badge";
type.textContent = meta.type;
var date = document.createElement("span");
date.className = "archive-entry-date";
date.textContent = meta.date;
head.append(type, date);
var object = document.createElement("div");
object.className = "archive-detail-object";
object.textContent = "Objekt: " + meta.object;
var grid = document.createElement("div");
grid.className = "archive-detail-grid";
appendArchiveMetaPair(grid, "Anlagen-Nr.", meta.anlage);
if (meta.kundenNr) appendArchiveMetaPair(grid, "Kunden-Nr.", meta.kundenNr);
if (meta.name) appendArchiveMetaPair(grid, "Name", meta.name);
if (meta.trade) appendArchiveMetaPair(grid, "Gewerk", meta.trade);
var updated = document.createElement("div");
updated.className = "archive-detail-updated";
updated.textContent = "Zuletzt geändert: " + meta.updated;
wrapper.append(head, object, grid, updated);
return wrapper;
}

function applyArchiveMetadataToItem(item, entry, storageKey) {
if (!item || !entry) return;
item.classList.add("archive-item-detailed");
var text = Array.prototype.find.call(item.children, function(child) {
return child && child.tagName !== "BUTTON";
});
if (!text) {
text = document.createElement("div");
item.insertBefore(text, item.firstChild);
}
text.className = "archive-detail-host";
text.replaceChildren(createArchiveMetadataNode(entry, storageKey));
Array.prototype.forEach.call(item.querySelectorAll("button"), function(button) {
var label = (button.textContent || "").replace(/\\s+/g, " ").trim();
if (/^Öffnen$/i.test(label)) button.classList.add("archive-open-list-btn");
if (/^Löschen$/i.test(label)) {
button.classList.add("archive-delete-list-btn", "danger");
}
});
updateArchiveCurrentMarker(item, entry, storageKey);
}

function updateArchiveCurrentMarker(item, entry, storageKey) {
if (!item || !entry) return;
var currentId = readCurrentArchiveIdForKey(storageKey);
var isCurrent = Boolean(currentId && entry.id && String(currentId) === String(entry.id));
item.classList.toggle("archive-item-current", isCurrent);
if (isCurrent) item.setAttribute("aria-current", "true");
else item.removeAttribute("aria-current");
}

function normalizeArchiveSearchText(value) {
return String(value || "").replace(/\\s+/g, " ").trim().toLowerCase();
}

function ensureArchiveFilterControls(archiveList) {
if (!archiveList) return null;
var dialog = archiveList.closest(".archive-dialog") || archiveList.parentElement;
if (!dialog) return null;
var controls = dialog.querySelector(".archive-filter-tools");
if (!controls) {
controls = document.createElement("div");
controls.className = "archive-filter-tools";
var input = document.createElement("input");
input.type = "search";
input.className = "archive-filter-input";
input.autocomplete = "off";
input.setAttribute("aria-label", "Archiv filtern");
input.placeholder = "Archiv filtern: Objekt, Anlagen-Nr., Datum";
var count = document.createElement("span");
count.className = "archive-filter-count";
count.setAttribute("aria-live", "polite");
controls.append(input, count);
(archiveList.parentNode || dialog).insertBefore(controls, archiveList);
input.addEventListener("input", function() { applyArchiveListFilter(archiveList); });
}
return controls;
}

function applyArchiveListFilter(archiveList) {
if (!archiveList) return;
var controls = ensureArchiveFilterControls(archiveList);
if (!controls) return;
var input = controls.querySelector(".archive-filter-input");
var count = controls.querySelector(".archive-filter-count");
var query = normalizeArchiveSearchText(input && input.value);
var items = Array.prototype.slice.call(archiveList.querySelectorAll(".archive-item"));
var visible = 0;
items.forEach(function(item) {
var matches = !query || normalizeArchiveSearchText(item.textContent).indexOf(query) >= 0;
item.hidden = !matches;
item.classList.toggle("archive-item-filtered-out", !matches);
if (matches) visible += 1;
});
var empty = archiveList.querySelector(".archive-filter-empty");
if (!empty) {
empty = document.createElement("p");
empty.className = "archive-empty archive-filter-empty";
empty.hidden = true;
empty.textContent = "Keine Archiv-Einträge zum Filter gefunden.";
archiveList.appendChild(empty);
}
empty.hidden = !(query && items.length && visible === 0);
if (count) {
count.textContent = items.length
? (query ? visible + " von " + items.length + " Einträgen" : items.length + (items.length === 1 ? " Eintrag" : " Einträge"))
: "";
}
}

function enhanceArchiveListMetadata(storageKey) {
var archiveList = document.getElementById("archiveList");
if (!archiveList || archiveList.__fsmobileArchiveMetadataEnhancing) return;
var primaryKey = storageKey || resolveArchiveStorageKey();
if (!primaryKey) return;
ensureArchiveFilterControls(archiveList);
var records = archiveEntryRecordsForDisplay(primaryKey).sort(function(a, b) {
return archiveTimestamp(b.entry, b.index) - archiveTimestamp(a.entry, a.index);
});
if (!records.length) {
applyArchiveListFilter(archiveList);
return;
}
var items = Array.prototype.slice.call(archiveList.querySelectorAll(".archive-item"));
if (!items.length) {
applyArchiveListFilter(archiveList);
return;
}
archiveList.__fsmobileArchiveMetadataEnhancing = true;
try {
items.forEach(function(item, index) {
var record = records[index];
if (!record) return;
applyArchiveMetadataToItem(item, record.entry, record.storageKey);
});
ensureArchiveFilterControls(archiveList);
applyArchiveListFilter(archiveList);
} finally {
archiveList.__fsmobileArchiveMetadataEnhancing = false;
}
}

function scheduleArchiveMetadataEnhancement(storageKey, delay) {
window.clearTimeout(window.__fsmobileArchiveMetadataTimer);
window.__fsmobileArchiveMetadataTimer = window.setTimeout(function() {
enhanceArchiveListMetadata(storageKey || resolveArchiveStorageKey());
}, delay == null ? 40 : delay);
}

function archiveDisplayTitle(entry, storageKey) {
var fields = archiveFields(entry, storageKey);
var anlage = String(firstArchiveValue(fields, ["anlage", "anlagenNr", "anlagenNummer", "anlageNr", "anlagennr", "anlagen_nr"]) || "").trim() || "Ohne Anlagen Nr.";
var object = String(firstArchiveValue(fields, ["object", "objekt", "objectInput", "objektInput"]) || "").trim() || "Ohne Objekt";
var date = firstArchiveValue(fields, ["date", "datum", "dateInput", "datumInput"]);
var report = archiveEntryReport(entry, storageKey);
var count = Array.isArray(report.rows) ? " (" + report.rows.length + ")" : "";
return anlage + " - " + object + count + " - " + archiveDisplayDate(date);
}

function applyArchiveEntryReport(entry, storageKey) {
entry = latestArchiveEntryForOpen(storageKey, entry);
var report = archiveEntryReport(entry, storageKey);
if (!entry || !report || typeof report !== "object") return;
var applied = false;
["applyReport", "applyData", "applyReportData", "restoreReportData", "applyStoragePayload"].some(function(name) {
var fn = window[name];
if (typeof fn !== "function") return false;
try {
fn(report);
applied = true;
} catch (error) {}
return applied;
});
if (!applied || !archiveReportMatchesDom(report)) applyArchiveReportDomFallback(report);
if (usesPositionCheckboxUi()) {
restorePositionCheckboxUiFromEntry(entry);
window.__fsmobilePositionCheckboxArchiveRestored = true;
}
if (entry.id) writeCurrentArchiveIdForKey(storageKey, entry.id);
persistCurrentDraftBeforeArchive();
var overlay = document.getElementById("archiveOverlay");
if (overlay) overlay.hidden = true;
setUnifiedActionStatus("Prüfbericht wurde aus dem Archiv geöffnet.");
}

function deleteArchiveEntryFromDisplay(entry, storageKey, entryIndex) {
if (!entry || !storageKey) return;
if (!confirm("Archiv-Eintrag '" + archiveDisplayTitle(entry, storageKey) + "' löschen?")) return;
var entries = readArchiveEntriesForKey(storageKey).filter(function(item, index) {
if (entry.id) return item && item.id !== entry.id;
return index !== entryIndex;
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
var records = archiveEntryRecordsForDisplay(storageKey).sort(function(a, b) {
return archiveTimestamp(b.entry, b.index) - archiveTimestamp(a.entry, a.index);
});
archiveList.innerHTML = "";
if (!records.length) {
var empty = document.createElement("p");
empty.className = "archive-empty";
empty.textContent = "Archiv leer - zuerst im Archiv speichern legt den ersten Eintrag an.";
archiveList.appendChild(empty);
return;
}
records.forEach(function(record) {
var entry = record.entry;
var entryStorageKey = record.storageKey;
var item = document.createElement("article");
item.className = "archive-item";
var text = document.createElement("div");
var title = document.createElement("div");
var meta = document.createElement("div");
title.className = "archive-title";
meta.className = "archive-meta";
title.textContent = archiveDisplayTitle(entry, entryStorageKey);
meta.textContent = "Geändert: " + archiveDisplayDate(String((entry && (entry.updatedAt || entry.savedAt || entry.createdAt)) || "").slice(0, 10));
text.append(title, meta);
var openButton = document.createElement("button");
openButton.type = "button";
openButton.textContent = "Öffnen";
openButton.addEventListener("click", function() { applyArchiveEntryReport(latestArchiveEntryForOpen(entryStorageKey, entry), entryStorageKey); });
var deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.className = "danger";
deleteButton.textContent = "Löschen";
deleteButton.addEventListener("click", function() { deleteArchiveEntryFromDisplay(entry, entryStorageKey, record.index); });
item.append(text, openButton, deleteButton);
applyArchiveMetadataToItem(item, entry, entryStorageKey);
archiveList.appendChild(item);
});
ensureArchiveFilterControls(archiveList);
applyArchiveListFilter(archiveList);
}

function persistCurrentDraftBeforeArchive() {
["saveToStorageNow", "saveFormToStorage", "saveCurrentDraft", "saveCurrentReport", "saveForm", "saveToStorage"].some(function(name) {
var fn = window[name];
if (typeof fn !== "function") return false;
try { fn(); } catch (error) {}
return true;
});
}

function readCurrentArchiveIdForKey(storageKey) {
var currentId = "";
candidateCurrentArchiveIdKeys(storageKey).some(function(key) {
try { currentId = localStorage.getItem(key) || ""; } catch (error) { currentId = ""; }
return Boolean(currentId);
});
return currentId;
}

function saveReportArchiveByIdentity() {
if (!/^pb-/.test(window.FSMOBILE_MODULE_ID || "")) return false;
persistCurrentDraftBeforeArchive();
var primaryStorageKey = resolveArchiveStorageKey();
var report = currentArchiveReport();
var existingAcrossKeys = legacyArchiveCompatModule() ? findArchiveEntryByIdentity(report) : null;
var storageKey = existingAcrossKeys && existingAcrossKeys.storageKey ? existingAcrossKeys.storageKey : primaryStorageKey;
var entries = readArchiveEntriesForKey(storageKey);
var currentId = isRwaModule() || isFluchttuerSteuerungenModule() ? readCurrentArchiveIdForKey(storageKey) : "";
var identity = archiveEntryIdentity(storageKey, { report: report });
var existingIndex = existingAcrossKeys && existingAcrossKeys.storageKey === storageKey
? existingAcrossKeys.index
: currentId ? entries.findIndex(function(entry) {
return entry && entry.id === currentId;
}) : identity ? entries.findIndex(function(entry) {
return archiveEntryIdentity(storageKey, entry) === identity;
}) : -1;
var now = new Date().toISOString();
var wasUpdate = existingIndex >= 0;
var previous = wasUpdate ? entries[existingIndex] : null;
var entry = previous && typeof previous === "object" && !Array.isArray(previous)
? Object.assign({}, previous)
: {};
entry.id = previous && previous.id ? previous.id : createBridgeArchiveId();
entry.createdAt = previous && previous.createdAt ? previous.createdAt : now;
entry.updatedAt = now;
if (usesPositionCheckboxUi()) {
var uiMetadata = previous && previous.uiMetadata && typeof previous.uiMetadata === "object" && !Array.isArray(previous.uiMetadata)
? Object.assign({}, previous.uiMetadata)
: {};
uiMetadata[FSMOBILE_POSITION_CHECKBOX_META_KEY] = collectPositionCheckboxUiMetadata();
entry.uiMetadata = uiMetadata;
}
if (isRwaModule() && isRwaArchiveKey(storageKey)) entry.data = report;
else entry.report = report;
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
if (isFeuerloescherModule() && isFeuerloescherLegacyArchiveKey(storageKey)) {
keys.push("pb-feuerloescher-current-archive-id");
keys.push("pb-feuerloescher-current-archive-id-v2");
}
if (isBrandschutztuerenModule() && isBrandschutztuerenLegacyArchiveKey(storageKey)) {
keys.push("pb-brandschutztueren-current-archive-id");
keys.push("pb-brandschutztueren-current-archive-id-v2");
}
if (isRwaModule() && isRwaArchiveKey(storageKey)) {
keys.push("rwa_pruefbericht_current_archive_id");
}
var match = String(storageKey || "").match(/^(.*)-archive-v(\\d+)$/i);
if (match && !isLegacyArchiveCompatKey(storageKey)) {
var legacyCurrentKey = match[1] + "-current-v" + match[2];
if (!isModuleDraftStorageKey(legacyCurrentKey)) keys.push(legacyCurrentKey);
keys.push(match[1] + "-current-archive-id-v" + match[2]);
}
try {
for (var index = 0; index < localStorage.length; index += 1) {
var key = localStorage.key(index);
if (!/current/i.test(key) || !archiveKeyMatchesCurrentModule(key)) continue;
if (isModuleDraftStorageKey(key)) continue;
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
var keys = legacyArchiveCompatModule()
? archiveStorageKeysForDisplay(resolveArchiveStorageKey())
: archiveStorageKeys({ currentOnly: true });
keys.forEach(function(storageKey) {
candidateCurrentArchiveIdKeys(storageKey).forEach(function(key) {
try { localStorage.removeItem(key); } catch (error) {}
});
});
}

function findArchiveEntryByIdentity(report) {
var match = null;
var storageKeys = legacyArchiveCompatModule()
? archiveStorageKeysForDisplay(resolveArchiveStorageKey())
: archiveStorageKeys({ currentOnly: true });
storageKeys.some(function(storageKey) {
var wanted = archiveEntryIdentity(storageKey, { report: report });
if (!wanted) return false;
var entries = readArchiveEntriesForKey(storageKey);
if (!Array.isArray(entries) || !entries.length) return false;
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

function installArchiveMetadataCards() {
if (window.__fsmobileArchiveMetadataCardsInstalled) return;
window.__fsmobileArchiveMetadataCardsInstalled = true;
var originalRenderArchiveList = window.renderArchiveList;
if (typeof originalRenderArchiveList === "function" && !originalRenderArchiveList.__fsmobileArchiveMetadataWrapped) {
window.renderArchiveList = function() {
var result = originalRenderArchiveList.apply(this, arguments);
scheduleArchiveMetadataEnhancement(resolveArchiveStorageKey(), 0);
return result;
};
window.renderArchiveList.__fsmobileArchiveMetadataWrapped = true;
}
document.addEventListener("click", function(event) {
var button = event.target && event.target.closest ? event.target.closest("button") : null;
if (!isArchiveOpenButton(button)) return;
[0, 60, 180].forEach(function(delay) {
scheduleArchiveMetadataEnhancement(resolveArchiveStorageKey(), delay);
});
}, true);
var observer = null;
var attachObserver = function() {
var list = document.getElementById("archiveList");
if (!list || !window.MutationObserver || list.__fsmobileArchiveMetadataObserved) return;
list.__fsmobileArchiveMetadataObserved = true;
observer = new MutationObserver(function() {
scheduleArchiveMetadataEnhancement(resolveArchiveStorageKey(), 20);
});
observer.observe(list, { childList: true, subtree: false });
};
attachObserver();
[80, 260, 620, 1200].forEach(function(delay) {
window.setTimeout(function() {
attachObserver();
scheduleArchiveMetadataEnhancement(resolveArchiveStorageKey(), 0);
}, delay);
});
}

function normalizedActionStatus(message) {
var text = String(message || "").replace(/\\s+/g, " ").trim();
if (!text) return "";
if (/konnte nicht.*archiv/i.test(text)) return "Formular konnte nicht im Archiv gespeichert werden.";
if (/vorhandener archiv-eintrag aktualisiert/i.test(text)) return "Formular aktualisiert.";
if (/bericht im archiv gespeichert/i.test(text)) return "Formular im Archiv gespeichert.";
if (/aufmaß.*archiv gespeichert|archiv.*gespeichert|gespeichert.*archiv/i.test(text)) return "Formular im Archiv gespeichert.";
if (/aus dem archiv geöffnet/i.test(text)) return "Archiv-Eintrag wurde geöffnet.";
if (/archiv.*geöffnet/i.test(text)) return "Archiv wurde geöffnet.";
if (/archiv.*gelöscht/i.test(text)) return "Archiv-Eintrag wurde gelöscht.";
if (/geleert|eingaben.*löschen/i.test(text)) return "Formular geleert.";
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

function relayUnifiedActionStatusFromDom() {
var status = document.getElementById("archiveStatus") || document.querySelector(".archive-status");
var normalized = normalizedActionStatus(status ? status.textContent : "");
if (normalized === window.__fsmobileLastRelayedActionStatus) return;
window.__fsmobileLastRelayedActionStatus = normalized;
try {
window.parent.postMessage({ type: "fsmobile-action-status", moduleId: window.FSMOBILE_MODULE_ID, message: normalized }, "*");
} catch (error) {}
}

function wrapLateArchiveStatusFunction() {
if (!document.documentElement.classList.contains("fsmobile-kalkulation-module")) return;
if (typeof window.setArchiveStatus !== "function") return;
if (window.setArchiveStatus.__fsmobileUnifiedActionStatusWrapped) return;
var originalSetArchiveStatus = window.setArchiveStatus;
window.setArchiveStatus = function(message) {
var result = originalSetArchiveStatus.apply(this, arguments);
setUnifiedActionStatus(message);
window.setTimeout(relayUnifiedActionStatusFromDom, 0);
return result;
};
window.setArchiveStatus.__fsmobileUnifiedActionStatusWrapped = true;
}

function installKalkulationStatusRelay() {
if (!document.documentElement.classList.contains("fsmobile-kalkulation-module")) return;
if (window.__fsmobileKalkulationStatusRelayInstalled) return;
window.__fsmobileKalkulationStatusRelayInstalled = true;
wrapLateArchiveStatusFunction();
[0, 60, 180, 420, 900].forEach(function(delay) {
window.setTimeout(wrapLateArchiveStatusFunction, delay);
});
document.addEventListener("DOMContentLoaded", function() {
wrapLateArchiveStatusFunction();
var status = document.getElementById("archiveStatus") || document.querySelector(".archive-status");
if (!status || !window.MutationObserver) return;
var observer = new MutationObserver(function() {
relayUnifiedActionStatusFromDom();
});
observer.observe(status, { childList: true, characterData: true, subtree: true });
});
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
installKalkulationStatusRelay();
}

function resultToneValue(element) {
if (!element) return "";
var source = /^(INPUT|SELECT|TEXTAREA)$/i.test(element.tagName || "")
? element.value
: element.textContent;
var value = String(source || "").replace(/\\s+/g, " ").trim().toLowerCase();
if (value === "i.o") return "ok";
if (value === "n.i.o") return "bad";
return "";
}

function applyResultToneMarker(element) {
if (!element || !element.classList) return;
var tone = resultToneValue(element);
var shouldOk = tone === "ok";
var shouldBad = tone === "bad";
if (element.classList.contains("fsmobile-result-ok") !== shouldOk) {
element.classList.toggle("fsmobile-result-ok", shouldOk);
}
if (element.classList.contains("fsmobile-result-bad") !== shouldBad) {
element.classList.toggle("fsmobile-result-bad", shouldBad);
}
}

function refreshResultToneMarkers() {
var selector = [
"select",
"input",
"textarea",
"[data-result]",
".result-field",
".result-ok",
".result-bad"
].join(",");
Array.prototype.forEach.call(document.querySelectorAll(selector), applyResultToneMarker);
}

function refreshResultToneMarkersWithin(root) {
if (!root || root.nodeType !== 1) return;
var selector = "select,input,textarea,[data-result],.result-field,.result-ok,.result-bad";
if (root.matches && root.matches(selector)) applyResultToneMarker(root);
if (root.querySelectorAll) {
Array.prototype.forEach.call(root.querySelectorAll(selector), applyResultToneMarker);
}
}

function refreshDerivedResultToneMarkers() {
var selector = [
"[data-result]",
".result-field",
".result-ok",
".result-bad",
"input[readonly]:not(.pos-field)",
"select:disabled",
"[data-field*='ergebnis']",
"[data-field*='befund']",
"[data-field*='status']",
"[id*='ergebnis']",
"[id*='befund']",
"[id*='result']"
].join(",");
Array.prototype.forEach.call(document.querySelectorAll(selector), applyResultToneMarker);
}

function normalizedResultToneClass(value) {
return String(value || "")
.split(/\s+/)
.filter(function(name) { return name && name !== "fsmobile-result-ok" && name !== "fsmobile-result-bad"; })
.sort()
.join(" ");
}

function isRelevantResultToneClassMutation(mutation) {
return mutation && mutation.type === "attributes" && mutation.attributeName === "class" &&
normalizedResultToneClass(mutation.oldValue) !== normalizedResultToneClass(mutation.target && mutation.target.className);
}

var pendingResultToneRoots = new Set();
var pendingGlobalResultToneRefresh = false;

function resultToneRowScope(node) {
var element = node && node.nodeType === 1 ? node : node && node.parentElement;
return fsmobileIsTabularReportModule() && element && element.closest
? element.closest("#tableBody tr, #rowsBody tr")
: null;
}

function queueResultToneRefresh(node, forceGlobal) {
var scope = forceGlobal ? null : resultToneRowScope(node);
if (scope) pendingResultToneRoots.add(scope);
else {
pendingGlobalResultToneRefresh = true;
pendingResultToneRoots.clear();
}
if (window.__fsmobileResultToneRefreshFrame) return;
window.__fsmobileResultToneRefreshFrame = window.requestAnimationFrame(function() {
window.__fsmobileResultToneRefreshFrame = 0;
if (pendingGlobalResultToneRefresh) refreshDerivedResultToneMarkers();
else pendingResultToneRoots.forEach(refreshResultToneMarkersWithin);
pendingResultToneRoots.clear();
pendingGlobalResultToneRefresh = false;
});
}

function scheduleResultToneRefresh(event) {
if (event && event.target && event.target.nodeType === 1) applyResultToneMarker(event.target);
queueResultToneRefresh(event && event.target, false);
}

function installResultToneMarkers() {
if (window.__fsmobileResultToneMarkersInstalled) return;
window.__fsmobileResultToneMarkersInstalled = true;
document.addEventListener("input", scheduleResultToneRefresh, true);
document.addEventListener("change", scheduleResultToneRefresh, true);
if (window.MutationObserver) {
var observer = new MutationObserver(function(mutations) {
var addedNodeCount = mutations.reduce(function(total, mutation) {
return total + (mutation.addedNodes ? mutation.addedNodes.length : 0);
}, 0);
if (mutations.length > 24 || addedNodeCount > 24) {
queueResultToneRefresh(null, true);
return;
}
mutations.forEach(function(mutation) {
if (mutation.type === "childList") {
Array.prototype.forEach.call(mutation.addedNodes || [], refreshResultToneMarkersWithin);
} else if (mutation.type === "attributes") {
if (mutation.attributeName === "value" || isRelevantResultToneClassMutation(mutation)) {
applyResultToneMarker(mutation.target);
}
} else if (mutation.type === "characterData") {
applyResultToneMarker(mutation.target && mutation.target.parentElement);
}
});
var shouldRefresh = mutations.some(function(mutation) {
if (mutation.type === "characterData") return true;
if (mutation.type === "childList") return mutation.addedNodes.length || mutation.removedNodes.length;
if (mutation.type === "attributes") return mutation.attributeName === "value" || isRelevantResultToneClassMutation(mutation);
return false;
});
if (shouldRefresh) {
mutations.forEach(function(mutation) {
if (mutation.type === "characterData" || mutation.type === "childList" ||
mutation.type === "attributes" && (mutation.attributeName === "value" || isRelevantResultToneClassMutation(mutation))) {
queueResultToneRefresh(mutation.target && mutation.target.nodeType === 1 ? mutation.target : mutation.target && mutation.target.parentElement, false);
}
});
}
});
observer.observe(document.documentElement, {
attributes: true,
attributeFilter: ["class", "value"],
attributeOldValue: true,
childList: true,
characterData: true,
subtree: true
});
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
signatur: true,
positioncheckboxes: true,
fsmobilepositioncheckbox: true,
fsmobilepositioncheckboxes: true
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
if (field.matches && field.matches("[data-fsmobile-position-checkbox='true']")) return true;
if (field.matches && field.matches("[data-fsmobile-textarea-mirror='true']")) return true;
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
var classKey = normalizeKey(fieldData.className);
if (classKey.indexOf("fsmobilepositioncheckbox") >= 0) return true;
var typeKey = normalizeKey(fieldData.type);
var columnKey = normalizeKey(fieldData.columnLabel);
var hasSemanticIdentity = Boolean(
normalizeKey(fieldData.id) ||
normalizeKey(fieldData.name) ||
normalizeKey(fieldData.dataField)
);
if (
usesPositionCheckboxUi() &&
typeKey === "checkbox" &&
!hasSemanticIdentity &&
(!columnKey || columnKey === "uimarkierung" || columnKey === "markierung")
) return true;
return Boolean(
excludedStructuredKeys[normalizeKey(fieldData.id)] ||
excludedStructuredKeys[normalizeKey(fieldData.name)] ||
excludedStructuredKeys[normalizeKey(fieldData.dataField)] ||
excludedStructuredKeys[classKey]
);
}

function isLegacyTextareaMirrorFieldData(fieldData, index, fields) {
if (!fieldData || !Array.isArray(fields) || index !== fields.length - 1) return false;
if (normalizeKey(fieldData.tag) !== "textarea" || normalizeKey(fieldData.type) !== "textarea") return false;
return !normalizeKey(fieldData.id) &&
!normalizeKey(fieldData.name) &&
!normalizeKey(fieldData.dataField) &&
!normalizeKey(fieldData.className) &&
!normalizeKey(fieldData.columnLabel);
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
var candidates = [
document.getElementById(key + "Input"),
document.getElementById(key),
document.querySelector("[name='" + key + "']")
];
for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex += 1) {
var field = candidates[candidateIndex];
if (field && "value" in field && field.type !== "radio" && field.type !== "checkbox" && field.type !== "file" && field.type !== "hidden" && String(field.value || "").trim()) return field.value;
}
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

function fieldColumnLabel(field) {
var cell = field && field.closest ? field.closest("td") : null;
var table = cell && cell.closest ? cell.closest("table") : null;
if (!cell || !table || !table.tHead || !table.tHead.rows.length) return "";
var headerRow = table.tHead.rows[table.tHead.rows.length - 1];
var header = headerRow && headerRow.cells ? headerRow.cells[cell.cellIndex] : null;
return header ? String(header.textContent || "").replace(/\\s+/g, " ").trim() : "";
}

function fieldIdentity(field, index) {
return {
index: index,
tag: field.tagName.toLowerCase(),
type: field.type || "",
id: field.id || "",
name: field.name || "",
dataField: field.dataset ? field.dataset.field || "" : "",
className: field.className || "",
columnLabel: fieldColumnLabel(field)
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
var preferredAppliers = {
buildStoragePayload: "applyStoragePayload",
collectReportData: "applyReportData",
collectData: "applyData",
getCurrentReport: "applyReport"
};
var appliers = [];
var preferred = preferredAppliers[structured.collector];
if (preferred) appliers.push(preferred);
["applyStoragePayload", "applyReportData", "applyData", "applyReport"].forEach(function(name) {
if (appliers.indexOf(name) < 0) appliers.push(name);
});
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

function drawStoredImageToCanvas(canvas, dataUrl, onDone) {
if (!canvas || !dataUrl) return;
var context = canvas.getContext("2d", { willReadFrequently: true });
var image = new Image();
image.onload = function() {
context.save();
context.setTransform(1, 0, 0, 1, 0, 0);
context.clearRect(0, 0, canvas.width, canvas.height);
context.imageSmoothingEnabled = true;
context.imageSmoothingQuality = "high";
context.drawImage(image, 0, 0, canvas.width, canvas.height);
context.restore();
if (typeof onDone === "function") onDone();
};
image.src = dataUrl;
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
drawStoredImageToCanvas(item.canvas, item.dataUrl, function() {
item.canvas.dispatchEvent(new Event("change", { bubbles: true }));
});
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

function fieldIdentityKeys(fieldData) {
if (!fieldData) return [];
var keys = [];
var idKey = normalizeKey(fieldData.id);
var dataKey = normalizeKey(fieldData.dataField);
var nameKey = normalizeKey(fieldData.name);
var columnKey = normalizeKey(fieldData.columnLabel);
if (idKey) keys.push("id:" + idKey);
if (dataKey) keys.push("data:" + dataKey);
if (nameKey) keys.push("name:" + nameKey);
if (columnKey) keys.push("column:" + columnKey);
if (!keys.length) {
var classKey = normalizeKey(fieldData.className);
if (classKey) keys.push("class:" + classKey);
}
return keys;
}

function fieldKind(fieldData) {
if (!fieldData) return "";
var tagKey = normalizeKey(fieldData.tag);
var typeKey = normalizeKey(fieldData.type);
if (tagKey === "select" || typeKey === "selectone" || typeKey === "selectmultiple") return "select";
if (typeKey === "checkbox" || typeKey === "radio") return typeKey;
if (tagKey === "textarea") return "textarea";
if (tagKey === "input") return "input:" + typeKey;
return tagKey || typeKey;
}

function applyImportedFields(controls, importFields) {
var targets = controls.map(fieldIdentity);
var targetKeys = targets.map(fieldIdentityKeys);
var usedTargets = {};
var unresolved = [];
var appliedCount = 0;

importFields.forEach(function(fieldData, sourceIndex) {
var sourceKeys = fieldIdentityKeys(fieldData);
var sourceKind = fieldKind(fieldData);
var targetIndex = -1;

sourceKeys.some(function(key) {
var compatibleIndex = targetKeys.findIndex(function(keys, index) {
return !usedTargets[index] && keys.indexOf(key) >= 0 && (!sourceKind || fieldKind(targets[index]) === sourceKind);
});
if (compatibleIndex < 0) {
compatibleIndex = targetKeys.findIndex(function(keys, index) {
return !usedTargets[index] && keys.indexOf(key) >= 0;
});
}
if (compatibleIndex < 0) return false;
targetIndex = compatibleIndex;
return true;
});

if (targetIndex >= 0) {
applyField(controls[targetIndex], fieldData);
usedTargets[targetIndex] = true;
appliedCount += 1;
return;
}
unresolved.push({ data: fieldData, sourceIndex: sourceIndex, hasIdentity: sourceKeys.length > 0 });
});

unresolved.forEach(function(item) {
if (item.hasIdentity) return;
var sourceKind = fieldKind(item.data);
var targetIndex = targets.findIndex(function(target, index) {
return !usedTargets[index] && (!sourceKind || fieldKind(target) === sourceKind);
});
if (targetIndex < 0) return;
applyField(controls[targetIndex], item.data);
usedTargets[targetIndex] = true;
appliedCount += 1;
});

return appliedCount;
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
drawStoredImageToCanvas(canvas, item.dataUrl, function() {
canvas.dispatchEvent(new Event("change", { bubbles: true }));
});
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

async function downloadCombinedExport(pdfBlob, pdfName, transaction) {
var payload = buildExportPayload();
var jsonName = exportFileName();
var finalPdfName = ensurePbFilePrefix((window.FSMOBILE_PDF_FILE_NAME ? window.FSMOBILE_PDF_FILE_NAME(pdfName) : pdfName) || reportExportBaseName() + ".pdf");
var zipBlob = await createZipBlob([
{ name: jsonName, blob: jsonExportBlob(payload) },
{ name: finalPdfName, blob: pdfBlob }
]);
var outputName = ensurePbFilePrefix(reportExportBaseName() + ".zip");
if (!window.parent.FSMOBILE_UI || !window.parent.FSMOBILE_UI.receiveExport(window, transaction, zipBlob, outputName)) downloadExportBlob(zipBlob, outputName);
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
window.FSMOBILE_REPORT_EXPORT_FILE_NAME = function() { return ensurePbFilePrefix(reportExportBaseName() + ".zip"); };

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
var importFields = payload.fields.filter(function(fieldData, index, fields) {
return !isExcludedFieldData(fieldData) && !isLegacyTextareaMirrorFieldData(fieldData, index, fields);
});
var excludedSnapshot = rememberExcludedValues();
var usedStructuredImport = false;
window.__fsmobileReportImportInProgress = true;
try {
usedStructuredImport = applyStructuredData(sanitizeStructuredData(payload.structured));
await ensureEnoughControls(importFields.length);
var controls = reportControls();
if (!usedStructuredImport) {
applyImportedFields(controls, importFields);
}
applyCanvases(payload.canvases);
} finally {
window.__fsmobileReportImportInProgress = false;
}
restoreExcludedValues(excludedSnapshot);
if (usesPositionCheckboxUi()) {
resetPositionCheckboxUi();
window.__fsmobilePositionCheckboxArchiveRestored = true;
}
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
function installLargeReportStatePilot() {
var moduleId = String(window.FSMOBILE_MODULE_ID || "");
var tableModuleIds = {
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
"pb-fluchttuer-steuerungen": true
};
var isFire = moduleId === "pb-feuerloescher";
var isDoors = moduleId === "pb-brandschutztueren";
if (!tableModuleIds[moduleId] || window.__fsmobileLargeReportStatePilotInstalled) return;
if (typeof window.getCurrentReport !== "function" || typeof window.applyReport !== "function" || typeof window.saveCurrentReport !== "function") return;
window.__fsmobileLargeReportStatePilotInstalled = true;

var original = {
getCurrentReport: window.getCurrentReport,
applyReport: window.applyReport,
saveCurrentReport: window.saveCurrentReport,
scheduleCurrentReportSave: window.scheduleCurrentReportSave,
flushCurrentReportSave: window.flushCurrentReportSave,
rowData: window.rowData,
addRow: window.addRow,
removeRow: window.removeRow,
insertRowAfter: window.insertRowAfter,
removeCurrentRow: window.removeCurrentRow,
renumberRows: window.renumberRows
};
var reportState = null;
var optimizeInputPersistence = Boolean(tableModuleIds[moduleId]);
var deferredSaveTimer = 0;
var deferredSaveSource = null;
var directPersistSnapshot = false;
var capturedInputSource = null;
var capturedChangeSource = null;
var pagedRowSize = optimizeInputPersistence ? 30 : 0;
var pagedRowPage = 0;
var pagedRowHosts = [];
var metrics = {
rowSyncs: 0,
fullRowSyncs: 0,
snapshots: 0,
applies: 0,
flushes: 0
};

function cloneSerializable(value) {
if (value == null) return value;
try { return JSON.parse(JSON.stringify(value)); }
catch (error) { return value; }
}

function text(value, fallback) {
return String(value == null || value === "" ? (fallback == null ? "" : fallback) : value);
}

function checked(value) {
return value === true || value === "true" || value === "Ja";
}

function normalizeFireRow(value) {
var source = value && typeof value === "object" && !Array.isArray(value) ? cloneSerializable(value) : {};
return Object.assign({}, source, {
btNr: text(source.btNr),
standort: text(source.standort),
typ: text(source.typ),
hersteller: text(source.hersteller),
baujahr: text(source.baujahr),
ausseninspektion: text(source.ausseninspektion, "I.O"),
innenkontrolle: text(source.innenkontrolle, "I.O"),
betrSichV: text(source.betrSichV, "I.O"),
schlauchpruefung: text(source.schlauchpruefung, "I.O"),
reinigung: checked(source.reinigung),
loeschmittelTauschBis: text(source.loeschmittelTauschBis),
pruefplakette: checked(source.pruefplakette),
bemerkung: text(source.bemerkung)
});
}

function normalizeDoorRow(value) {
var source = value && typeof value === "object" && !Array.isArray(value) ? cloneSerializable(value) : {};
var count = text(source.tuerfluegelAnzahl, "1");
var normalized = Object.assign({}, source, {
btNr: text(source.btNr),
standort: text(source.standort),
art: text(source.art),
schliesseinrichtung: text(source.schliesseinrichtung, "i.O"),
schloss: text(source.schloss, "i.O"),
dichtung: text(source.dichtung, "i.O"),
tuerfluegelAnzahl: count,
tuerfluegel: text(source.tuerfluegel, "i.O"),
gangfluegel: text(source.gangfluegel, "i.O"),
standfluegel: text(source.standfluegel, "i.O"),
schliessfolge: text(source.schliessfolge, "i.O"),
bemerkung: text(source.bemerkung)
});
var resultFields = count === "2"
? ["schliesseinrichtung", "schloss", "dichtung", "gangfluegel", "standfluegel", "schliessfolge"]
: ["schliesseinrichtung", "schloss", "dichtung", "tuerfluegel"];
normalized.pruefergebnis = resultFields.some(function(key) { return normalized[key] === "n.i.O"; }) ? "n.i.O" : "i.O";
return normalized;
}

function normalizeRow(value) {
if (isFire) return normalizeFireRow(value);
if (isDoors) return normalizeDoorRow(value);
return value && typeof value === "object" && !Array.isArray(value) ? cloneSerializable(value) : {};
}

function normalizeReport(value) {
var source = value && typeof value === "object" && !Array.isArray(value) ? cloneSerializable(value) : {};
var headerSource = source.header && typeof source.header === "object" && !Array.isArray(source.header) ? source.header : {};
source.header = Object.assign({}, headerSource, {
objekt: text(headerSource.objekt),
anlage: text(headerSource.anlage),
name: text(headerSource.name),
datum: text(headerSource.datum, new Date().toISOString().slice(0, 10))
});
var rows = Array.isArray(source.rows) && source.rows.length ? source.rows : [{}];
source.rows = rows.map(normalizeRow);
source.signature = text(source.signature);
var remark = source.berichtBemerkung;
if (remark == null) remark = source.reportRemark;
if (remark == null && source.fields && typeof source.fields === "object") remark = source.fields.berichtBemerkung;
source.berichtBemerkung = text(remark);
return source;
}

function ensureState() {
if (!reportState) reportState = normalizeReport(null);
return reportState;
}

function tableBody() {
return document.getElementById("tableBody");
}

function bindRowIndexes() {
var body = tableBody();
if (!body) return;
Array.prototype.forEach.call(body.children, function(row, index) {
row.dataset.fsmobileStateIndex = String(index);
});
}

function rowIndex(row) {
if (!row) return -1;
var fromData = Number(row.dataset && row.dataset.fsmobileStateIndex);
var body = tableBody();
if (Number.isInteger(fromData) && fromData >= 0 && body && body.children[fromData] === row) return fromData;
return body ? Array.prototype.indexOf.call(body.children, row) : -1;
}

function pagedRowCount() {
var body = tableBody();
return body ? body.children.length : 0;
}

function pagedRowPageCount() {
return pagedRowSize ? Math.max(1, Math.ceil(pagedRowCount() / pagedRowSize)) : 1;
}

function installPagedRowStyles() {
if (!pagedRowSize || document.getElementById("fsmobileLargeReportPagerStyles")) return;
var style = document.createElement("style");
style.id = "fsmobileLargeReportPagerStyles";
style.textContent = [
".fsmobile-large-report-row-hidden{display:none!important}",
".fsmobile-large-report-pager{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:12px 0;padding:10px 12px;border:1px solid rgba(255,255,255,.38);border-radius:14px;background:rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)}",
".fsmobile-large-report-pager[hidden]{display:none!important}",
".fsmobile-large-report-pager button{min-height:44px!important;padding:9px 15px!important;box-shadow:none!important}",
".fsmobile-large-report-page-label{display:inline-flex;align-items:center;gap:8px;margin:0;color:var(--text,#1c1c1e);font-size:14px;font-weight:750}",
".fsmobile-large-report-page-select{width:auto!important;min-width:132px;min-height:44px!important;padding:8px 34px 8px 12px!important;background-color:rgba(255,255,255,.28)!important}",
".fsmobile-large-report-page-status{min-width:170px;color:var(--muted,#6e6e73);font-size:14px;font-weight:750;text-align:center}",
"@media(max-width:560px){.fsmobile-large-report-pager{align-items:stretch}.fsmobile-large-report-pager button,.fsmobile-large-report-page-label{flex:1 1 auto}.fsmobile-large-report-page-status{flex-basis:100%}}"
].join("");
document.head.appendChild(style);
}

function createPagedRowHost(position) {
var host = document.createElement("nav");
host.className = "fsmobile-large-report-pager";
host.dataset.fsmobilePagerPosition = position;
host.setAttribute("aria-label", "Zeilenabschnitt auswählen");

var previous = document.createElement("button");
previous.type = "button";
previous.className = "secondary fsmobile-large-report-page-previous";
previous.textContent = "‹ Vorherige";
previous.addEventListener("click", function() { showPagedRowPage(pagedRowPage - 1, true); });

var label = document.createElement("label");
label.className = "fsmobile-large-report-page-label";
label.appendChild(document.createTextNode("Zeilen"));
var select = document.createElement("select");
select.className = "fsmobile-large-report-page-select";
select.setAttribute("aria-label", "Zeilenbereich");
select.addEventListener("change", function() { showPagedRowPage(Number(select.value), true); });
label.appendChild(select);

var status = document.createElement("span");
status.className = "fsmobile-large-report-page-status";
status.setAttribute("aria-live", "polite");

var next = document.createElement("button");
next.type = "button";
next.className = "secondary fsmobile-large-report-page-next";
next.textContent = "Nächste ›";
next.addEventListener("click", function() { showPagedRowPage(pagedRowPage + 1, true); });

host.append(previous, label, status, next);
return host;
}

function ensurePagedRowHosts() {
if (!pagedRowSize || pagedRowHosts.length) return;
var body = tableBody();
var table = body && body.closest ? body.closest("table") : null;
var wrapper = table && table.closest ? table.closest(".table-wrapper, .table-wrap") : null;
if (!wrapper || !wrapper.parentNode) return;
installPagedRowStyles();
var top = createPagedRowHost("top");
var bottom = createPagedRowHost("bottom");
wrapper.parentNode.insertBefore(top, wrapper);
wrapper.parentNode.insertBefore(bottom, wrapper.nextSibling);
pagedRowHosts = [top, bottom];
}

function refreshPagedRows(options) {
if (!pagedRowSize) return;
options = options || {};
ensurePagedRowHosts();
var body = tableBody();
if (!body) return;
var rows = Array.prototype.slice.call(body.children);
var total = rows.length;
var pageCount = Math.max(1, Math.ceil(total / pagedRowSize));
if (options.reset) pagedRowPage = 0;
if (options.followEnd) pagedRowPage = pageCount - 1;
pagedRowPage = Math.max(0, Math.min(pageCount - 1, Number(pagedRowPage) || 0));
var start = pagedRowPage * pagedRowSize;
var end = Math.min(total, start + pagedRowSize);
rows.forEach(function(row, index) {
row.classList.toggle("fsmobile-large-report-row-hidden", total > pagedRowSize && (index < start || index >= end));
});

pagedRowHosts.forEach(function(host) {
host.hidden = total <= pagedRowSize;
var select = host.querySelector(".fsmobile-large-report-page-select");
if (select && (select.options.length !== pageCount || select.dataset.fsmobileRowTotal !== String(total))) {
select.textContent = "";
for (var pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
var option = document.createElement("option");
var optionStart = pageIndex * pagedRowSize + 1;
var optionEnd = Math.min(total, optionStart + pagedRowSize - 1);
option.value = String(pageIndex);
option.textContent = optionStart + "–" + optionEnd;
select.appendChild(option);
}
select.dataset.fsmobileRowTotal = String(total);
}
if (select) select.value = String(pagedRowPage);
var previous = host.querySelector(".fsmobile-large-report-page-previous");
var next = host.querySelector(".fsmobile-large-report-page-next");
if (previous) previous.disabled = pagedRowPage === 0;
if (next) next.disabled = pagedRowPage >= pageCount - 1;
var status = host.querySelector(".fsmobile-large-report-page-status");
if (status) status.textContent = total ? "Zeilen " + (start + 1) + "–" + end + " von " + total : "Keine Zeilen";
});

if (options.scroll) {
var table = body.closest ? body.closest("table") : null;
var wrapper = table && table.closest ? table.closest(".table-wrapper, .table-wrap") : null;
if (wrapper) wrapper.scrollTop = 0;
if (pagedRowHosts[0] && pagedRowHosts[0].scrollIntoView) pagedRowHosts[0].scrollIntoView({ block: "nearest" });
}
}

function showPagedRowPage(page, scroll) {
var active = document.activeElement;
if (active && active.closest && active.closest("#tableBody tr")) {
syncControl(active);
if (typeof active.blur === "function") active.blur();
}
pagedRowPage = Number(page) || 0;
refreshPagedRows({ scroll: Boolean(scroll) });
return pagedRowsSnapshot();
}

function showPagedRow(position, scroll) {
var rowNumber = Math.max(1, Math.min(pagedRowCount(), Number(position) || 1));
return showPagedRowPage(Math.floor((rowNumber - 1) / pagedRowSize), scroll);
}

function pagedRowsSnapshot() {
var total = pagedRowCount();
var start = total ? pagedRowPage * pagedRowSize + 1 : 0;
return Object.freeze({
enabled: Boolean(pagedRowSize && total > pagedRowSize),
pageSize: pagedRowSize,
page: pagedRowPage,
pages: pagedRowPageCount(),
start: start,
end: total ? Math.min(total, start + pagedRowSize - 1) : 0,
total: total
});
}

function readRow(row) {
if (!row) return {};
if (typeof original.rowData === "function") {
try { return original.rowData.call(window, row) || {}; } catch (error) {}
}
var data = {};
row.querySelectorAll("[data-field]").forEach(function(field) {
data[field.dataset.field] = field.type === "checkbox" ? field.checked : field.value;
});
return data;
}

function syncRow(row) {
var state = ensureState();
var index = rowIndex(row);
if (index < 0) return false;
state.rows[index] = normalizeRow(Object.assign({}, state.rows[index] || {}, readRow(row)));
metrics.rowSyncs += 1;
return true;
}

function syncAllRows() {
var state = ensureState();
var body = tableBody();
if (!body) return;
state.rows = Array.prototype.map.call(body.children, function(row, index) {
return normalizeRow(Object.assign({}, state.rows[index] || {}, readRow(row)));
});
if (!state.rows.length) state.rows = [normalizeRow({})];
metrics.fullRowSyncs += 1;
bindRowIndexes();
}

function syncHeaderAndRemark() {
var state = ensureState();
var mapping = {
objectInput: "objekt",
anlageInput: "anlage",
nameInput: "name",
dateInput: "datum"
};
Object.keys(mapping).forEach(function(id) {
var field = document.getElementById(id);
if (field && "value" in field) state.header[mapping[id]] = String(field.value || "");
});
var customerField = typeof customerNumberField === "function" ? customerNumberField() : document.getElementById("kundenNrInput");
if (customerField && "value" in customerField) {
var customerValue = String(customerField.value || "").trim();
state.header.kundenNr = customerValue;
if (!state.fields || typeof state.fields !== "object" || Array.isArray(state.fields)) state.fields = {};
state.fields.kundenNr = customerValue;
}
var remarkField = document.getElementById("fsmobileReportBemerkung");
if (remarkField && "value" in remarkField) {
var value = String(remarkField.value || "");
state.berichtBemerkung = value;
if (Object.prototype.hasOwnProperty.call(state, "reportRemark")) state.reportRemark = value;
if (!state.fields || typeof state.fields !== "object" || Array.isArray(state.fields)) state.fields = {};
state.fields.berichtBemerkung = value;
}
}

function sourceElement(source) {
if (source && source.target && source.target.nodeType === 1) return source.target;
if (source && source.nodeType === 1) return source;
try {
if (window.event && window.event.target && window.event.target.nodeType === 1) return window.event.target;
} catch (error) {}
return document.activeElement && document.activeElement.nodeType === 1 ? document.activeElement : null;
}

function syncControl(source) {
var element = sourceElement(source);
if (!element) return;
var row = element.closest && element.closest("#tableBody tr");
if (row) syncRow(row);
else syncHeaderAndRemark();
}

function syncBeforeSnapshot(source) {
syncHeaderAndRemark();
var body = tableBody();
if (body && body.children.length !== ensureState().rows.length) syncAllRows();
else syncControl(source);
}

function currentSignature() {
if (window.__fsmobileSignatureClearInProgress) return "";
if (typeof window.getSignatureData !== "function") return ensureState().signature || "";
try { return String(window.getSignatureData() || ""); }
catch (error) { return ensureState().signature || ""; }
}

function snapshotState(source, cloneResult) {
syncBeforeSnapshot(source);
var state = ensureState();
state.signature = currentSignature();
metrics.snapshots += 1;
return cloneResult === false ? state : cloneSerializable(state);
}

function snapshot(source) {
return snapshotState(source, true);
}

function storageSnapshot() {
var safe = window.FSMOBILE_SAFE_STORAGE;
return safe && typeof safe.snapshot === "function" ? safe.snapshot() : { sequence: 0, lastResult: null };
}

function writeOutcome(before, returned, thrown) {
var after = storageSnapshot();
if (after.sequence > before.sequence && after.lastResult) return after.lastResult;
if (returned && typeof returned === "object" && Object.prototype.hasOwnProperty.call(returned, "ok")) return returned;
if (thrown || returned === false) return { ok: false, code: "write-failed", sequence: after.sequence };
return { ok: true, code: "no-write", sequence: after.sequence };
}

function clearDeferredSave() {
if (deferredSaveTimer) window.clearTimeout(deferredSaveTimer);
deferredSaveTimer = 0;
deferredSaveSource = null;
}

function activeEventType(source) {
if (source && typeof source.type === "string") return source.type;
if (capturedInputSource) return "input";
if (capturedChangeSource) return "change";
try {
if (window.event && typeof window.event.type === "string") return window.event.type;
} catch (error) {}
return "";
}

function saveNow(source) {
clearDeferredSave();
syncBeforeSnapshot(source);
var before = storageSnapshot();
var returned;
var thrown = null;
var previousDirectPersistSnapshot = directPersistSnapshot;
directPersistSnapshot = optimizeInputPersistence;
try { returned = original.saveCurrentReport.call(window); }
catch (error) { thrown = error; }
finally { directPersistSnapshot = previousDirectPersistSnapshot; }
metrics.flushes += 1;
return writeOutcome(before, returned, thrown);
}

function scheduleOptimizedSave(source) {
syncBeforeSnapshot(source);
deferredSaveSource = sourceElement(source);
if (deferredSaveTimer) window.clearTimeout(deferredSaveTimer);
deferredSaveTimer = window.setTimeout(function() {
var pendingSource = deferredSaveSource;
deferredSaveTimer = 0;
deferredSaveSource = null;
saveNow(pendingSource);
}, 180);
}

window.getCurrentReport = function(source) {
return snapshotState(source, directPersistSnapshot ? false : true);
};
window.getCurrentReport.__fsmobileCanonicalState = true;

window.applyReport = function(value) {
reportState = normalizeReport(value);
metrics.applies += 1;
var result = original.applyReport.call(window, cloneSerializable(reportState));
if (typeof ensureCustomerNumberField === "function") ensureCustomerNumberField();
if (typeof setCustomerNumberFieldValue === "function") {
var customerValue = "";
if (reportState.fields && typeof reportState.fields === "object") customerValue = reportState.fields.kundenNr || "";
if (!customerValue && reportState.header && typeof reportState.header === "object") customerValue = reportState.header.kundenNr || "";
setCustomerNumberFieldValue(customerValue, { dispatch: false });
}
if (typeof setReportRemarkValue === "function") {
setReportRemarkValue(reportState.berichtBemerkung || "", { persist: true, dispatch: false });
}
syncAllRows();
syncHeaderAndRemark();
bindRowIndexes();
refreshPagedRows({ reset: true });
return result;
};
window.applyReport.__fsmobileCanonicalState = true;

window.saveCurrentReport = function(source) {
if (optimizeInputPersistence && /^(?:input|change)$/.test(activeEventType(source))) {
return scheduleOptimizedSave(source);
}
return saveNow(source);
};
window.saveCurrentReport.__fsmobileCanonicalState = true;

if (typeof original.scheduleCurrentReportSave === "function") {
window.scheduleCurrentReportSave = function(source) {
if (optimizeInputPersistence) return scheduleOptimizedSave(source);
syncBeforeSnapshot(source);
return original.scheduleCurrentReportSave.call(window);
};
window.scheduleCurrentReportSave.__fsmobileCanonicalState = true;
}

window.flushCurrentReportSave = function(source) {
return saveNow(source);
};
window.flushCurrentReportSave.__fsmobileCanonicalState = true;

function wrapRowMutation(name, beforeMutation, afterMutation) {
var fn = original[name];
if (typeof fn !== "function") return;
window[name] = function() {
var args = arguments;
if (typeof beforeMutation === "function") beforeMutation.apply(window, args);
var result = fn.apply(window, args);
if (typeof afterMutation === "function") afterMutation.apply(window, args);
bindRowIndexes();
return result;
};
window[name].__fsmobileCanonicalState = true;
}

function syncRowsAndRefresh(options) {
syncAllRows();
refreshPagedRows(options);
}

wrapRowMutation("addRow", function(data) {
ensureState().rows.push(normalizeRow(data || {}));
}, function() { syncRowsAndRefresh({ followEnd: true, scroll: true }); });
wrapRowMutation("removeRow", function() {
var rows = ensureState().rows;
if (rows.length > 1) rows.pop();
}, function() { syncRowsAndRefresh({ scroll: true }); });
wrapRowMutation("insertRowAfter", function(button) {
var row = button && button.closest ? button.closest("tr") : null;
var index = rowIndex(row);
if (index >= 0) ensureState().rows.splice(index + 1, 0, normalizeRow({}));
}, function() { syncRowsAndRefresh(); });
wrapRowMutation("removeCurrentRow", function(button) {
var row = button && button.closest ? button.closest("tr") : null;
var index = rowIndex(row);
var rows = ensureState().rows;
if (index >= 0 && rows.length > 1) rows.splice(index, 1);
}, function() { syncRowsAndRefresh(); });
wrapRowMutation("renumberRows", null, function() {
bindRowIndexes();
refreshPagedRows();
});

document.addEventListener("input", function(event) {
capturedInputSource = event && event.target && event.target.nodeType === 1 ? event.target : null;
syncControl(event);
var currentInputSource = capturedInputSource;
Promise.resolve().then(function() {
if (capturedInputSource === currentInputSource) capturedInputSource = null;
});
}, true);
document.addEventListener("change", function(event) {
capturedChangeSource = event && event.target && event.target.nodeType === 1 ? event.target : null;
syncControl(event);
var currentChangeSource = capturedChangeSource;
Promise.resolve().then(function() {
if (capturedChangeSource === currentChangeSource) capturedChangeSource = null;
});
}, true);

var previousApi = window.FSMOBILE_MODULE_API;
if (window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.createModuleApi === "function" && previousApi && previousApi.version === 1) {
window.FSMOBILE_MODULE_API = window.FSMOBILE_STANDARD.createModuleApi({
moduleId: moduleId,
storage: previousApi.storage,
capabilities: previousApi.capabilities,
state: { collect: snapshot, apply: window.applyReport },
lifecycle: { flush: saveNow },
actions: previousApi.actions
});
}

window.FSMOBILE_LARGE_REPORT_STATE = Object.freeze({
version: 1,
moduleId: moduleId,
kind: "table",
snapshot: snapshot,
pagination: pagedRowsSnapshot,
showRow: showPagedRow,
metrics: function() { return Object.freeze(Object.assign({}, metrics)); }
});
refreshPagedRows({ reset: true });
}

function installStructuredReportStatePilot() {
var moduleId = String(window.FSMOBILE_MODULE_ID || "");
var config = moduleId === "pb-rwa" ? {
kind: "rwa",
storageKey: "rwa_pruefbericht_formular_v1",
collectName: "collectData",
applyName: "applyData",
saveName: "persistFormNow",
signatureNames: ["currentSignatureData"]
} : moduleId === "pb-zentralbatterie-anlage" ? {
kind: "cells",
storageKey: "fsmobile-pb-zentralbatterie-v1",
collectName: "collectReportData",
applyName: "applyReportData",
saveName: "saveToStorageNow",
signatureNames: ["getStorageSignature"]
} : null;
if (!config || window.__fsmobileLargeReportStatePilotInstalled) return;
if (typeof window[config.collectName] !== "function" || typeof window[config.applyName] !== "function" || typeof window[config.saveName] !== "function") return;
window.__fsmobileLargeReportStatePilotInstalled = true;

var RWA_OBJECT_GROUPS = [
"co2Patronen",
"co2Thermofaesschen",
"druckgaserzeuger",
"bodenstueck",
"mraVentilatoren",
"mraZuluftoeffnungen",
"mraAbstroemoeffnungen",
"suelaAbstroemoeffnungen",
"oeffnungselemente"
];
var RWA_ALL_GROUPS = RWA_OBJECT_GROUPS.concat(["ausloeseStandorte"]);
var RWA_ADD_FUNCTIONS = {
addCo2Patrone: "co2Patronen",
addCo2Thermofaesschen: "co2Thermofaesschen",
addDruckgaserzeuger: "druckgaserzeuger",
addBodenstueck: "bodenstueck",
addMraVentilator: "mraVentilatoren",
addMraZuluftoeffnung: "mraZuluftoeffnungen",
addMraAbstroemoeffnung: "mraAbstroemoeffnungen",
addSuelaAbstroemoeffnung: "suelaAbstroemoeffnungen",
addOeffnungselement: "oeffnungselemente"
};
var RWA_RESET_FUNCTIONS = {
co2Patronen: "resetCo2Patronen",
co2Thermofaesschen: "resetCo2Thermofaesschen",
druckgaserzeuger: "resetDruckgaserzeuger",
bodenstueck: "resetBodenstueck",
mraVentilatoren: "resetMraVentilatoren",
mraZuluftoeffnungen: "resetMraZuluftoeffnungen",
mraAbstroemoeffnungen: "resetMraAbstroemoeffnungen",
suelaAbstroemoeffnungen: "resetSuelaAbstroemoeffnungen",
oeffnungselemente: "resetOeffnungselemente"
};
var ZBA_FIELD_IDS = {
anlageInput: "anlage",
objectInput: "object",
anlagenstandortInput: "anlagenstandort",
dateInput: "date",
anlagentypInput: "anlagentyp",
batterietypInput: "batterietyp",
batterietemperaturInput: "batterietemperatur",
elektrolytSelect: "elektrolyt",
pruefergebnisSelect: "pruefergebnis",
nextDateInput: "nextDate",
bemerkungInput: "bemerkung",
prueferInput: "pruefer"
};
var original = {
collect: window[config.collectName],
apply: window[config.applyName],
save: window[config.saveName],
addCell: window.addCell,
removeCell: window.removeCell,
updateAusloeseStandorte: window.updateAusloeseStandorte
};
var reportState = null;
var applying = false;
var forceRwaRebase = false;
var rwaDirtyGroups = {};
var lastKnownStorageText = null;
var stateDirty = false;
var metrics = {
rowSyncs: 0,
fullRowSyncs: 0,
snapshots: 0,
applies: 0,
flushes: 0
};

function cloneSerializable(value) {
if (value == null) return value;
try { return JSON.parse(JSON.stringify(value)); }
catch (error) { return value; }
}

function objectValue(value) {
return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function mergeObject(base, current) {
return Object.assign({}, objectValue(base), objectValue(current));
}

function normalizeObjectRows(value) {
return Array.isArray(value) ? value.map(function(row) {
return Object.assign({}, objectValue(cloneSerializable(row)));
}) : [];
}

function normalizeRwa(value) {
var source = Object.assign({}, objectValue(cloneSerializable(value)));
source.fields = Object.assign({}, objectValue(source.fields));
source.checked = Object.assign({}, objectValue(source.checked));
source.radios = Object.assign({}, objectValue(source.radios));
source.dynamic = Object.assign({}, objectValue(source.dynamic));
RWA_OBJECT_GROUPS.forEach(function(group) {
source.dynamic[group] = normalizeObjectRows(source.dynamic[group]);
});
source.dynamic.ausloeseStandorte = Array.isArray(source.dynamic.ausloeseStandorte)
? source.dynamic.ausloeseStandorte.map(function(item) { return String(item == null ? "" : item); })
: [];
source.signature = String(source.signature || "");
return source;
}

function normalizeZba(value) {
var source = Object.assign({}, objectValue(cloneSerializable(value)));
source.fields = Object.assign({}, objectValue(source.fields));
source.cells = normalizeObjectRows(source.cells);
if (!source.cells.length) source.cells = [{}];
source.signature = String(source.signature || "");
source.savedAt = String(source.savedAt || "");
return source;
}

function mergeRwa(sourceValue, renderedValue) {
var source = normalizeRwa(sourceValue);
var rendered = normalizeRwa(renderedValue);
var merged = Object.assign({}, source, rendered);
merged.fields = mergeObject(source.fields, rendered.fields);
merged.checked = mergeObject(source.checked, rendered.checked);
merged.radios = mergeObject(source.radios, rendered.radios);
merged.dynamic = mergeObject(source.dynamic, rendered.dynamic);
RWA_OBJECT_GROUPS.forEach(function(group) {
var previousRows = normalizeObjectRows(source.dynamic[group]);
var renderedRows = normalizeObjectRows(rendered.dynamic[group]);
if (previousRows.length && previousRows.length !== renderedRows.length) {
merged.dynamic[group] = previousRows;
return;
}
var length = Math.max(previousRows.length, renderedRows.length);
merged.dynamic[group] = Array.from({ length: length }, function(_, index) {
return mergeObject(previousRows[index], renderedRows[index]);
});
});
var previousLocations = Array.isArray(source.dynamic.ausloeseStandorte) ? source.dynamic.ausloeseStandorte : [];
var renderedLocations = Array.isArray(rendered.dynamic.ausloeseStandorte) ? rendered.dynamic.ausloeseStandorte : [];
merged.dynamic.ausloeseStandorte = previousLocations.length && previousLocations.length !== renderedLocations.length
? previousLocations.slice()
: renderedLocations.slice();
merged.signature = rendered.signature || source.signature || "";
return normalizeRwa(merged);
}

function mergeZba(sourceValue, renderedValue) {
var source = normalizeZba(sourceValue);
var rendered = normalizeZba(renderedValue);
var merged = Object.assign({}, source, rendered);
merged.fields = mergeObject(source.fields, rendered.fields);
var length = Math.max(source.cells.length, rendered.cells.length);
merged.cells = Array.from({ length: length }, function(_, index) {
return mergeObject(source.cells[index], rendered.cells[index]);
});
if (!merged.cells.length) merged.cells = [{}];
merged.signature = rendered.signature || source.signature || "";
merged.savedAt = source.savedAt || rendered.savedAt || "";
return normalizeZba(merged);
}

function normalizeReport(value) {
return config.kind === "rwa" ? normalizeRwa(value) : normalizeZba(value);
}

function mergeRendered(source, rendered) {
return config.kind === "rwa" ? mergeRwa(source, rendered) : mergeZba(source, rendered);
}

function readStoredText() {
try {
return localStorage.getItem(config.storageKey);
} catch (error) {
return null;
}
}

function readStoredReport() {
var raw = readStoredText();
lastKnownStorageText = raw;
try { return raw ? JSON.parse(raw) : null; }
catch (error) { return null; }
}

function renderedReport() {
try { return original.collect.call(window); }
catch (error) { return {}; }
}

function ensureState() {
if (!reportState) reportState = normalizeReport({});
return reportState;
}

function sourceElement(source) {
if (source && source.target && source.target.nodeType === 1) return source.target;
if (source && source.nodeType === 1) return source;
try {
if (window.event && window.event.target && window.event.target.nodeType === 1) return window.event.target;
} catch (error) {}
return document.activeElement && document.activeElement.nodeType === 1 ? document.activeElement : null;
}

function currentSignature() {
if (window.__fsmobileSignatureClearInProgress) return "";
for (var index = 0; index < config.signatureNames.length; index += 1) {
var fn = window[config.signatureNames[index]];
if (typeof fn !== "function") continue;
try {
var value = fn.call(window);
if (value) return String(value);
} catch (error) {}
}
return ensureState().signature || "";
}

function syncAuxiliaryFields() {
var state = ensureState();
if (!state.fields || typeof state.fields !== "object" || Array.isArray(state.fields)) state.fields = {};
var customerField = typeof customerNumberField === "function" ? customerNumberField() : document.getElementById("kundenNrInput");
if (customerField && "value" in customerField) state.fields.kundenNr = String(customerField.value || "").trim();
state.signature = currentSignature();
}

function rwaRows(group) {
var fields = Array.prototype.slice.call(document.querySelectorAll("[data-dynamic-group='" + group + "']"));
var rows = [];
fields.forEach(function(field) {
var row = field.closest && field.closest(".dynamic-row");
if (row && rows.indexOf(row) < 0) rows.push(row);
});
return rows;
}

function rwaLocations() {
return Array.prototype.slice.call(document.querySelectorAll("#ausloeseStandorteList [data-dynamic-group='ausloeseStandorte']"));
}

function bindRwaIndexes() {
var state = ensureState();
RWA_OBJECT_GROUPS.forEach(function(group) {
var rows = rwaRows(group);
var values = state.dynamic[group];
while (values.length < rows.length) values.push({});
if (values.length > rows.length) values.length = rows.length;
rows.forEach(function(row, index) { row.dataset.fsmobileStateIndex = String(index); });
});
var locations = rwaLocations();
while (state.dynamic.ausloeseStandorte.length < locations.length) state.dynamic.ausloeseStandorte.push("");
if (state.dynamic.ausloeseStandorte.length > locations.length) state.dynamic.ausloeseStandorte.length = locations.length;
locations.forEach(function(field, index) { field.dataset.fsmobileStateIndex = String(index); });
}

function readRwaRow(row) {
var data = {};
if (!row) return data;
row.querySelectorAll("[data-dynamic-field]").forEach(function(field) {
data[field.dataset.dynamicField] = field.type === "checkbox" ? field.checked : String(field.value || "");
});
return data;
}

function syncRwaGroupFromDom(group) {
var state = ensureState();
if (group === "ausloeseStandorte") {
state.dynamic.ausloeseStandorte = rwaLocations().map(function(field) { return String(field.value || ""); });
} else {
state.dynamic[group] = rwaRows(group).map(function(row, index) {
return mergeObject(state.dynamic[group][index], readRwaRow(row));
});
}
metrics.fullRowSyncs += 1;
bindRwaIndexes();
}

function rwaIndex(element, group) {
var index = Number(element && element.dataset && element.dataset.fsmobileStateIndex);
if (Number.isInteger(index) && index >= 0) return index;
if (group === "ausloeseStandorte") return rwaLocations().indexOf(element);
var row = element && element.closest ? element.closest(".dynamic-row") : null;
return rwaRows(group).indexOf(row);
}

function syncRwaControl(element) {
if (!element || element.dataset && element.dataset.archiveCompat === "true") return;
var state = ensureState();
var group = element.dataset && element.dataset.dynamicGroup;
if (group && RWA_ALL_GROUPS.indexOf(group) >= 0) {
var index = rwaIndex(group === "ausloeseStandorte" ? element : element.closest(".dynamic-row"), group);
if (index < 0) return;
if (group === "ausloeseStandorte") {
state.dynamic.ausloeseStandorte[index] = String(element.value || "");
} else {
while (state.dynamic[group].length <= index) state.dynamic[group].push({});
var key = element.dataset.dynamicField;
if (key) state.dynamic[group][index][key] = element.type === "checkbox" ? element.checked : String(element.value || "");
}
metrics.rowSyncs += 1;
return;
}
var name = String(element.name || element.dataset && element.dataset.field || "");
if (!name || element.type === "file" || element.type === "button" || element.type === "submit") return;
if (element.type === "checkbox") {
state.checked[name + "::" + String(element.value || element.id || "")] = Boolean(element.checked);
} else if (element.type === "radio") {
if (element.checked) state.radios[name] = String(element.value || "");
} else if ("value" in element) {
state.fields[name] = String(element.value || "");
}
}

function bindZbaIndexes() {
var state = ensureState();
var rows = Array.prototype.slice.call(document.querySelectorAll(".cell-row"));
while (state.cells.length < rows.length) state.cells.push({});
if (state.cells.length > rows.length) state.cells.length = rows.length;
if (!state.cells.length) state.cells = [{}];
rows.forEach(function(row, index) { row.dataset.fsmobileStateIndex = String(index); });
}

function readZbaCell(row) {
var data = {};
if (!row) return data;
row.querySelectorAll("[data-field]").forEach(function(field) {
data[field.dataset.field] = String(field.value || "");
});
return data;
}

function syncZbaCellsFromDom() {
var state = ensureState();
state.cells = Array.prototype.map.call(document.querySelectorAll(".cell-row"), function(row, index) {
return mergeObject(state.cells[index], readZbaCell(row));
});
if (!state.cells.length) state.cells = [{}];
metrics.fullRowSyncs += 1;
bindZbaIndexes();
}

function syncZbaControl(element) {
if (!element || element.type === "file" || element.type === "button" || element.type === "submit") return;
var state = ensureState();
var row = element.closest && element.closest(".cell-row");
if (row) {
var index = Number(row.dataset.fsmobileStateIndex);
if (!Number.isInteger(index) || index < 0) index = Array.prototype.indexOf.call(document.querySelectorAll(".cell-row"), row);
if (index < 0) return;
while (state.cells.length <= index) state.cells.push({});
var cellKey = element.dataset && element.dataset.field;
if (cellKey) state.cells[index][cellKey] = String(element.value || "");
metrics.rowSyncs += 1;
return;
}
var key = element.dataset && element.dataset.field || ZBA_FIELD_IDS[element.id] || element.name;
if (key && "value" in element) state.fields[key] = String(element.value || "");
}

function syncControl(source) {
var element = sourceElement(source);
if (!element) return;
if (config.kind === "rwa") syncRwaControl(element);
else syncZbaControl(element);
}

function meaningfulValue(value) {
if (value == null) return false;
if (typeof value === "string") return Boolean(value.trim());
if (typeof value === "object") return Boolean(Object.keys(value).length);
return Boolean(value) || value === 0;
}

function rwaSnapshot() {
var result = normalizeRwa(ensureState());
RWA_OBJECT_GROUPS.forEach(function(group) {
result.dynamic[group] = result.dynamic[group].filter(function(row) {
return Object.keys(row).some(function(key) { return meaningfulValue(row[key]); });
});
});
return result;
}

function rebaseRwaAfterClear() {
reportState = normalizeRwa(renderedReport());
forceRwaRebase = false;
rwaDirtyGroups = {};
metrics.fullRowSyncs += 1;
bindRwaIndexes();
}

function syncBeforeSnapshot(source) {
if (config.kind === "rwa") {
if (forceRwaRebase) rebaseRwaAfterClear();
Object.keys(rwaDirtyGroups).forEach(function(group) {
if (rwaDirtyGroups[group]) syncRwaGroupFromDom(group);
});
rwaDirtyGroups = {};
}
syncControl(source);
syncAuxiliaryFields();
}

function renderExplicitRwaGroups(source) {
if (config.kind !== "rwa" || !source || !source.dynamic || typeof source.dynamic !== "object") return;
Object.keys(RWA_RESET_FUNCTIONS).forEach(function(group) {
if (!Object.prototype.hasOwnProperty.call(source.dynamic, group) || !Array.isArray(source.dynamic[group])) return;
var reset = window[RWA_RESET_FUNCTIONS[group]];
if (typeof reset === "function") reset.call(window, cloneSerializable(source.dynamic[group]));
});
if (Object.prototype.hasOwnProperty.call(source.dynamic, "ausloeseStandorte") && Array.isArray(source.dynamic.ausloeseStandorte) && typeof window.updateAusloeseStandorte === "function") {
window.updateAusloeseStandorte(cloneSerializable(source.dynamic.ausloeseStandorte));
}
}

function snapshot(source) {
refreshFromStorageIfChanged();
syncBeforeSnapshot(source);
if (config.kind === "cells") ensureState().savedAt = new Date().toISOString();
metrics.snapshots += 1;
return cloneSerializable(config.kind === "rwa" ? rwaSnapshot() : normalizeZba(ensureState()));
}

function applyReport(value, fromStorage) {
var source = normalizeReport(value);
applying = true;
var result;
try {
result = original.apply.call(window, cloneSerializable(source));
renderExplicitRwaGroups(source);
}
finally { applying = false; }
reportState = mergeRendered(source, renderedReport());
metrics.applies += 1;
if (config.kind === "rwa") bindRwaIndexes();
else bindZbaIndexes();
syncAuxiliaryFields();
stateDirty = !fromStorage;
return result;
}

function refreshFromStorageIfChanged() {
if (applying || stateDirty) return;
var currentText = readStoredText();
if (currentText === lastKnownStorageText) return;
lastKnownStorageText = currentText;
if (!currentText) return;
try { applyReport(JSON.parse(currentText), true); }
catch (error) {}
}

function storageSnapshot() {
var safe = window.FSMOBILE_SAFE_STORAGE;
return safe && typeof safe.snapshot === "function" ? safe.snapshot() : { sequence: 0, lastResult: null };
}

function writeOutcome(before, returned, thrown) {
var after = storageSnapshot();
if (after.sequence > before.sequence && after.lastResult) return after.lastResult;
if (returned && typeof returned === "object" && Object.prototype.hasOwnProperty.call(returned, "ok")) return returned;
if (thrown || returned === false) return { ok: false, code: "write-failed", sequence: after.sequence };
return { ok: true, code: "no-write", sequence: after.sequence };
}

function saveNow() {
var before = storageSnapshot();
var returned;
var thrown = null;
try { returned = original.save.apply(window, arguments); }
catch (error) { thrown = error; }
lastKnownStorageText = readStoredText();
metrics.flushes += 1;
var outcome = writeOutcome(before, returned, thrown);
if (outcome && outcome.ok) stateDirty = false;
return outcome;
}

if (config.kind === "rwa") {
Object.keys(RWA_ADD_FUNCTIONS).forEach(function(name) {
var fn = window[name];
if (typeof fn !== "function") return;
window[name] = function() {
var result = fn.apply(window, arguments);
if (!applying) {
ensureState().dynamic[RWA_ADD_FUNCTIONS[name]].push(Object.assign({}, objectValue(cloneSerializable(arguments[0]))));
rwaDirtyGroups[RWA_ADD_FUNCTIONS[name]] = true;
stateDirty = true;
}
return result;
};
window[name].__fsmobileCanonicalState = true;
});
if (typeof original.updateAusloeseStandorte === "function") {
window.updateAusloeseStandorte = function() {
var result = original.updateAusloeseStandorte.apply(window, arguments);
if (!applying) {
rwaDirtyGroups.ausloeseStandorte = true;
stateDirty = true;
}
return result;
};
window.updateAusloeseStandorte.__fsmobileCanonicalState = true;
}
document.addEventListener("click", function(event) {
var button = event.target && event.target.closest ? event.target.closest("button") : null;
if (!button) return;
if (button.id === "clearBtn") {
forceRwaRebase = true;
stateDirty = true;
window.setTimeout(function() { forceRwaRebase = false; }, 0);
return;
}
if (!button.classList.contains("dynamic-remove")) return;
var row = button.closest(".dynamic-row");
var field = row && row.querySelector("[data-dynamic-group]");
var group = field && field.dataset.dynamicGroup;
if (!group || RWA_OBJECT_GROUPS.indexOf(group) < 0) return;
var rows = rwaRows(group);
var index = rows.indexOf(row);
if (index < 0) return;
var values = ensureState().dynamic[group];
if (rows.length <= 1) values[0] = {};
else values.splice(index, 1);
rwaDirtyGroups[group] = true;
stateDirty = true;
}, true);
document.addEventListener("input", function(event) {
if (event.target && event.target.id === "anzahlAusloese") rwaDirtyGroups.ausloeseStandorte = true;
}, true);
document.addEventListener("change", function(event) {
if (!event.target) return;
if (event.target.id === "druckgaserzeuger") rwaDirtyGroups.druckgaserzeuger = true;
if (event.target.id === "bodenstueck") rwaDirtyGroups.bodenstueck = true;
}, true);
} else {
if (typeof original.addCell === "function") {
window.addCell = function(data) {
var result = original.addCell.apply(window, arguments);
if (!applying) {
ensureState().cells.push(Object.assign({}, objectValue(cloneSerializable(data))));
bindZbaIndexes();
metrics.fullRowSyncs += 1;
stateDirty = true;
}
return result;
};
window.addCell.__fsmobileCanonicalState = true;
}
if (typeof original.removeCell === "function") {
window.removeCell = function() {
var cells = ensureState().cells;
if (!applying) {
if (cells.length <= 1) cells[0] = {};
else cells.pop();
stateDirty = true;
}
var result = original.removeCell.apply(window, arguments);
if (!applying) syncZbaCellsFromDom();
return result;
};
window.removeCell.__fsmobileCanonicalState = true;
}
document.addEventListener("click", function(event) {
var button = event.target && event.target.closest ? event.target.closest(".cell-row button") : null;
if (!button) return;
var row = button.closest(".cell-row");
var rows = Array.prototype.slice.call(document.querySelectorAll(".cell-row"));
var index = rows.indexOf(row);
if (index < 0) return;
var cells = ensureState().cells;
if (rows.length <= 1) cells[index] = {};
else cells.splice(index, 1);
metrics.fullRowSyncs += 1;
stateDirty = true;
window.setTimeout(bindZbaIndexes, 0);
}, true);
}

document.addEventListener("input", function(event) {
if (!applying) stateDirty = true;
syncControl(event);
}, true);
document.addEventListener("change", function(event) {
if (!applying) stateDirty = true;
syncControl(event);
}, true);
document.addEventListener("pointerup", function(event) {
if (!applying && event.target && event.target.tagName === "CANVAS") stateDirty = true;
}, true);

var stored = readStoredReport();
if (stored) {
applying = true;
try {
original.apply.call(window, cloneSerializable(stored));
renderExplicitRwaGroups(stored);
}
catch (error) {}
finally { applying = false; }
}
reportState = mergeRendered(stored || {}, renderedReport());
if (config.kind === "rwa") bindRwaIndexes();
else bindZbaIndexes();

window[config.collectName] = snapshot;
window[config.collectName].__fsmobileCanonicalState = true;
window[config.applyName] = applyReport;
window[config.applyName].__fsmobileCanonicalState = true;
window[config.saveName] = saveNow;
window[config.saveName].__fsmobileCanonicalState = true;
window.flushCurrentReportSave = saveNow;
window.flushCurrentReportSave.__fsmobileCanonicalState = true;

var previousApi = window.FSMOBILE_MODULE_API;
if (window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.createModuleApi === "function" && previousApi && previousApi.version === 1) {
window.FSMOBILE_MODULE_API = window.FSMOBILE_STANDARD.createModuleApi({
moduleId: moduleId,
storage: previousApi.storage,
capabilities: previousApi.capabilities,
state: { collect: snapshot, apply: applyReport },
lifecycle: { flush: saveNow },
actions: previousApi.actions
});
}

window.FSMOBILE_LARGE_REPORT_STATE = Object.freeze({
version: 1,
moduleId: moduleId,
kind: config.kind,
snapshot: snapshot,
metrics: function() { return Object.freeze(Object.assign({}, metrics)); }
});
}

function installRemainingReportStateMigration() {
var moduleId = String(window.FSMOBILE_MODULE_ID || "");
var configs = {
"pb-druckpruefung-din-14462": {
kind: "form-approvals",
storageKey: "pb-druckpruefung-din-14462-current-v1",
collectName: "collectData",
applyName: "applyData",
saveName: "saveFormNow",
objectKeys: ["fields", "approvals"],
nativeSyncKeys: ["fields", "approvals"]
},
"pb-druckerhoehungsanlage": {
kind: "form-inspections",
storageKey: "pb-druckerhoehungsanlage-report-v1",
collectName: "collectReportData",
applyName: "applyReportData",
saveName: "saveToStorageNow",
objectKeys: ["fields", "inspections"],
arrayKeys: ["results"],
checkboxArrays: { pruefergebnis: "results" },
signatureNames: ["getStorageSignature"],
hasSavedAt: true
},
"pb-hydranten": {
kind: "cards",
storageKey: "fsmobile-pb-hydranten-v1",
collectName: "collectReportData",
applyName: "applyReportData",
saveName: "saveToStorageNow",
objectKeys: ["fields"],
checkboxChoices: { dinCompliant: "dinCompliant" },
signatureNames: ["getStorageSignature"],
hasSavedAt: true,
repeatGroups: [{ key: "hydrants", selector: ".hydrant-card", containerSelector: "#hydrantList", attribute: "field", property: "field", addNames: ["addHydrant"] }]
},
"pb-loeschwasser-nass": {
kind: "strands",
storageKey: "fsmobile-pb-loeschwasser-nass-v1",
collectName: "collectData",
applyName: "applyData",
saveName: "saveToStorageNow",
objectKeys: ["fields"],
signatureNames: ["getStorageSignature"],
hasSavedAt: true,
repeatGroups: [{ key: "strands", selector: ".strand-row", containerSelector: "#strandList", attribute: "field", property: "field", addNames: ["addStrand"] }]
},
"pb-loeschwasser-trocken": {
kind: "hydrant-measurements",
storageKey: "pb-loeschwasser-trocken-report-v1",
collectName: "collectReportData",
applyName: "applyReportData",
saveName: "saveToStorageNow",
objectKeys: ["fields"],
signatureNames: ["getStorageSignature"],
hasSavedAt: true,
repeatGroups: [{ key: "hydrants", selector: "[data-hydrant-row]", containerSelector: "#hydrantList", attribute: "hydrant-field", property: "hydrantField", omitEmpty: true, addNames: ["addHydrant"] }]
},
"pb-nass-trocken-station": {
kind: "form",
storageKey: "fsmobile-pb-nass-trocken-station-v1",
collectName: "collectData",
applyName: "applyData",
saveName: "saveToStorageNow",
objectKeys: ["fields"],
signatureNames: ["getStorageSignature"],
hasSavedAt: true
},
"pb-rauchwarnmelder": {
kind: "rows",
storageKey: "pb-rauchwarnmelder-current-v1",
collectName: "collectData",
applyName: "applyData",
saveName: "saveToStorageNow",
objectKeys: ["fields"],
hasSavedAt: true,
repeatGroups: [{ key: "rows", selector: "#rowsBody tr", containerSelector: "#rowsBody", attribute: "field", property: "field", addNames: ["addRow"] }]
},
"pb-wandhydranten": {
kind: "cards",
storageKey: "pb-wandhydranten-report-v1",
collectName: "collectReportData",
applyName: "applyReportData",
saveName: "saveToStorageNow",
objectKeys: ["fields"],
hasSavedAt: true,
repeatGroups: [{ key: "whd", selector: ".whd-card", containerSelector: "#whdList", attribute: "field", property: "field", addNames: ["addWhd"] }]
}
};
var config = configs[moduleId];
if (!config || window.__fsmobileLargeReportStatePilotInstalled) return;
if (typeof window[config.collectName] !== "function" || typeof window[config.applyName] !== "function" || typeof window[config.saveName] !== "function") return;
window.__fsmobileLargeReportStatePilotInstalled = true;

config.objectKeys = config.objectKeys || [];
config.arrayKeys = config.arrayKeys || [];
config.nativeSyncKeys = config.nativeSyncKeys || [];
config.signatureNames = config.signatureNames || [];
config.repeatGroups = config.repeatGroups || [];
config.repeatGroups.forEach(function(group) {
group.addNames = group.addNames || [];
group.refs = new WeakMap();
group.dirty = false;
group.observer = null;
});

var original = {
collect: window[config.collectName],
apply: window[config.applyName],
save: window[config.saveName]
};
var reportState = null;
var applying = false;
var lastEventElement = null;
var lastKnownStorageText = null;
var clearPending = null;
var repairInitialStorage = false;
var stateDirty = false;
var metrics = {
fieldSyncs: 0,
rowSyncs: 0,
fullRowSyncs: 0,
fullRebases: 0,
snapshots: 0,
applies: 0,
flushes: 0
};

function cloneSerializable(value) {
if (value == null) return value;
try { return JSON.parse(JSON.stringify(value)); }
catch (error) { return value; }
}

function objectValue(value) {
return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function mergeObject(base, current) {
return Object.assign({}, objectValue(base), objectValue(current));
}

function objectRows(value) {
return Array.isArray(value) ? value.map(function(row) {
return Object.assign({}, objectValue(cloneSerializable(row)));
}) : [];
}

function normalizeReport(value) {
var source = Object.assign({}, objectValue(cloneSerializable(value)));
config.objectKeys.forEach(function(key) {
source[key] = Object.assign({}, objectValue(source[key]));
});
config.arrayKeys.forEach(function(key) {
source[key] = Array.isArray(source[key]) ? source[key].slice() : [];
});
config.repeatGroups.forEach(function(group) {
source[group.key] = objectRows(source[group.key]);
if (!source[group.key].length) source[group.key] = [{}];
});
if (config.signatureNames.length || Object.prototype.hasOwnProperty.call(source, "signature")) {
source.signature = String(source.signature || "");
}
if (config.hasSavedAt || Object.prototype.hasOwnProperty.call(source, "savedAt")) {
source.savedAt = String(source.savedAt || "");
}
return source;
}

function mergeRendered(sourceValue, renderedValue) {
var source = normalizeReport(sourceValue);
var rendered = normalizeReport(renderedValue);
var merged = Object.assign({}, source, rendered);
config.objectKeys.forEach(function(key) {
merged[key] = mergeObject(source[key], rendered[key]);
});
config.arrayKeys.forEach(function(key) {
merged[key] = Array.isArray(rendered[key]) ? rendered[key].slice() : source[key].slice();
});
config.repeatGroups.forEach(function(group) {
var previousRows = objectRows(source[group.key]);
var renderedRows = objectRows(rendered[group.key]);
var length = Math.max(previousRows.length, renderedRows.length);
merged[group.key] = Array.from({ length: length }, function(_, index) {
return mergeObject(previousRows[index], renderedRows[index]);
});
if (!merged[group.key].length) merged[group.key] = [{}];
});
if (config.signatureNames.length) merged.signature = rendered.signature || source.signature || "";
if (config.hasSavedAt) merged.savedAt = source.savedAt || rendered.savedAt || "";
return normalizeReport(merged);
}

function ensureState() {
if (!reportState) reportState = normalizeReport({});
return reportState;
}

function readStoredText() {
try { return localStorage.getItem(config.storageKey); }
catch (error) { return null; }
}

function readStoredReport() {
var currentRaw = readStoredText();
var raw = currentRaw;
var initial = window.__fsmobileInitialCurrentState;
if (initial && initial.key === config.storageKey && typeof initial.value === "string") {
raw = initial.value;
repairInitialStorage = initial.value !== currentRaw;
}
window.__fsmobileInitialCurrentState = null;
lastKnownStorageText = currentRaw;
try { return raw ? JSON.parse(raw) : null; }
catch (error) { return null; }
}

function renderedReport() {
try { return original.collect.call(window); }
catch (error) { return {}; }
}

function controlsForGroup(group) {
return Array.prototype.slice.call(document.querySelectorAll(group.selector));
}

function readRepeatRow(row, group) {
var result = {};
if (!row) return result;
var selector = "[data-" + group.attribute + "]";
row.querySelectorAll(selector).forEach(function(field) {
if (field.dataset && field.dataset.fsmobilePositionCheckbox === "true") return;
var key = field.dataset && field.dataset[group.property];
if (!key) return;
result[key] = field.type === "checkbox" ? Boolean(field.checked) : String(field.value || "");
});
return result;
}

function bindRepeatRows(group) {
var rows = controlsForGroup(group);
if (!rows.length) return;
var values = ensureState()[group.key];
while (values.length < rows.length) values.push({});
if (values.length > rows.length) values.length = rows.length;
rows.forEach(function(row, index) {
group.refs.set(row, values[index]);
row.dataset.fsmobileStateIndex = String(index);
});
}

function bindAllRepeatRows() {
config.repeatGroups.forEach(bindRepeatRows);
}

function repeatGroupForElement(element) {
if (!element || !element.closest) return null;
for (var index = 0; index < config.repeatGroups.length; index += 1) {
var group = config.repeatGroups[index];
if (element.closest(group.selector)) return group;
}
return null;
}

function syncRepeatRow(element, group) {
var row = element && element.matches && element.matches(group.selector) ? element : element && element.closest ? element.closest(group.selector) : null;
if (!row) return false;
var rows = controlsForGroup(group);
var index = rows.indexOf(row);
if (index < 0) return false;
var state = ensureState();
while (state[group.key].length <= index) state[group.key].push({});
var base = group.refs.get(row) || state[group.key][index] || {};
var current = mergeObject(base, readRepeatRow(row, group));
state[group.key][index] = current;
group.refs.set(row, current);
row.dataset.fsmobileStateIndex = String(index);
metrics.rowSyncs += 1;
return true;
}

function syncRepeatGroup(group) {
var rows = controlsForGroup(group);
var values = rows.map(function(row) {
return mergeObject(group.refs.get(row), readRepeatRow(row, group));
});
if (!values.length) values = [{}];
ensureState()[group.key] = values;
group.dirty = false;
metrics.fullRowSyncs += 1;
bindRepeatRows(group);
}

function repeatGroupNeedsSync(group) {
if (group.dirty) return true;
var rows = controlsForGroup(group);
var values = ensureState()[group.key];
if (rows.length !== values.length) return true;
return rows.some(function(row) { return !group.refs.has(row); });
}

function valueForControl(element) {
return element.type === "checkbox" ? Boolean(element.checked) : String(element.value || "");
}

function syncCheckboxCollections() {
var state = ensureState();
Object.keys(config.checkboxArrays || {}).forEach(function(name) {
var target = config.checkboxArrays[name];
state[target] = Array.prototype.slice.call(document.querySelectorAll("input[type='checkbox'][name='" + name + "']:checked")).map(function(field) {
return String(field.value || "");
});
});
Object.keys(config.checkboxChoices || {}).forEach(function(name) {
var target = config.checkboxChoices[name];
var checkedField = document.querySelector("input[type='checkbox'][name='" + name + "']:checked");
if (!state.fields || typeof state.fields !== "object") state.fields = {};
state.fields[target] = checkedField ? String(checkedField.value || "") : "";
});
}

function syncFixedControl(element) {
if (!element || !element.matches || !element.matches("input, select, textarea")) return false;
if (element.type === "file" || element.type === "button" || element.type === "submit" || element.type === "search") return false;
if (element.dataset && (element.dataset.archiveCompat === "true" || element.dataset.fsmobilePositionCheckbox === "true")) return false;
var state = ensureState();
if (element.dataset && element.dataset.inspectionLabel) {
if (!state.inspections || typeof state.inspections !== "object") state.inspections = {};
state.inspections[element.dataset.inspectionLabel] = String(element.value || "");
metrics.fieldSyncs += 1;
return true;
}
var name = String(element.name || "");
if (name && config.checkboxArrays && config.checkboxArrays[name]) {
syncCheckboxCollections();
metrics.fieldSyncs += 1;
return true;
}
if (name && config.checkboxChoices && config.checkboxChoices[name]) {
syncCheckboxCollections();
metrics.fieldSyncs += 1;
return true;
}
var key = String(element.dataset && element.dataset.field || name || "");
if (!key) return false;
if (!state.fields || typeof state.fields !== "object") state.fields = {};
if (element.type === "radio") {
if (element.checked) state.fields[key] = String(element.value || "");
} else {
state.fields[key] = valueForControl(element);
}
metrics.fieldSyncs += 1;
return true;
}

function sourceElement(source) {
if (source && source.target && source.target.nodeType === 1) return source.target;
if (source && source.nodeType === 1) return source;
return lastEventElement && lastEventElement.nodeType === 1 ? lastEventElement : null;
}

function syncControl(source) {
var element = sourceElement(source);
if (!element) return false;
var group = repeatGroupForElement(element);
if (group) return syncRepeatRow(element, group);
return syncFixedControl(element);
}

function currentSignature() {
if (window.__fsmobileSignatureClearInProgress) return "";
for (var index = 0; index < config.signatureNames.length; index += 1) {
var getter = window[config.signatureNames[index]];
if (typeof getter !== "function") continue;
try {
var value = getter.call(window);
if (value) return String(value);
} catch (error) {}
}
return ensureState().signature || "";
}

function syncNativeContainers() {
if (!config.nativeSyncKeys.length) return;
var nativeState = normalizeReport(renderedReport());
var state = ensureState();
config.nativeSyncKeys.forEach(function(key) {
state[key] = mergeObject(state[key], nativeState[key]);
});
}

function syncAuxiliaryFields() {
var state = ensureState();
syncCheckboxCollections();
syncNativeContainers();
if (!state.fields || typeof state.fields !== "object") state.fields = {};
var customerField = typeof customerNumberField === "function" ? customerNumberField() : document.getElementById("kundenNrInput");
if (customerField && "value" in customerField) state.fields.kundenNr = String(customerField.value || "").trim();
if (config.signatureNames.length) state.signature = currentSignature();
if (config.hasSavedAt) state.savedAt = new Date().toISOString();
}

function syncBeforeSnapshot(source) {
config.repeatGroups.forEach(function(group) {
if (repeatGroupNeedsSync(group)) syncRepeatGroup(group);
});
syncControl(source);
syncAuxiliaryFields();
}

function meaningfulValue(value) {
if (value == null) return false;
if (typeof value === "string") return Boolean(value.trim());
if (typeof value === "object") return Object.keys(value).some(function(key) { return meaningfulValue(value[key]); });
return Boolean(value) || value === 0;
}

function publicSnapshot() {
var result = normalizeReport(ensureState());
config.repeatGroups.forEach(function(group) {
if (!group.omitEmpty) return;
result[group.key] = result[group.key].filter(function(row) {
return Object.keys(row).some(function(key) { return meaningfulValue(row[key]); });
});
});
return result;
}

function stopObservers() {
config.repeatGroups.forEach(function(group) {
if (!group.observer) return;
group.observer.takeRecords();
group.observer.disconnect();
});
}

function startObservers() {
config.repeatGroups.forEach(function(group) {
var container = document.querySelector(group.containerSelector);
if (!container || typeof MutationObserver !== "function") return;
if (!group.observer) {
group.observer = new MutationObserver(function(records) {
if (!applying && records.some(function(record) { return record.type === "childList"; })) {
group.dirty = true;
stateDirty = true;
}
});
}
group.observer.observe(container, { childList: true });
});
}

function installRepeatAddWrappers() {
config.repeatGroups.forEach(function(group) {
group.addNames.forEach(function(name) {
var nativeAdd = window[name];
if (typeof nativeAdd !== "function" || nativeAdd.__fsmobileCanonicalState) return;
window[name] = function() {
var seed = Object.assign({}, objectValue(cloneSerializable(arguments[0])));
var result = nativeAdd.apply(window, arguments);
if (!applying) {
var state = ensureState();
var rows = controlsForGroup(group);
rows.forEach(function(row, index) {
if (group.refs.has(row)) return;
var value = Object.assign({}, seed);
state[group.key].splice(index, 0, value);
group.refs.set(row, value);
});
group.dirty = true;
stateDirty = true;
}
return result;
};
window[name].__fsmobileCanonicalState = true;
});
});
}

function applyAuxiliaryFields(state) {
if (typeof ensureCustomerNumberField === "function") ensureCustomerNumberField();
if (typeof setCustomerNumberFieldValue === "function") {
var customerValue = state.fields && state.fields.kundenNr || "";
setCustomerNumberFieldValue(customerValue, { dispatch: false });
}
if (typeof setReportRemarkValue === "function") {
var remark = state.fields && state.fields.berichtBemerkung;
if (remark != null) setReportRemarkValue(String(remark), { persist: false, dispatch: false });
}
}

function applyReport(value, fromStorage) {
var source = normalizeReport(value);
stopObservers();
applying = true;
reportState = source;
var result;
try {
result = original.apply.call(window, cloneSerializable(source));
applyAuxiliaryFields(source);
} finally {
applying = false;
}
reportState = mergeRendered(source, renderedReport());
applyAuxiliaryFields(reportState);
bindAllRepeatRows();
config.repeatGroups.forEach(function(group) { group.dirty = false; });
syncAuxiliaryFields();
lastKnownStorageText = readStoredText();
stateDirty = !fromStorage;
metrics.applies += 1;
startObservers();
return result;
}

function refreshFromStorageIfChanged() {
if (applying || stateDirty) return;
var currentText = readStoredText();
if (currentText === lastKnownStorageText) return;
lastKnownStorageText = currentText;
if (!currentText) return;
try { applyReport(JSON.parse(currentText), true); }
catch (error) {}
}

function snapshot(source) {
refreshFromStorageIfChanged();
syncBeforeSnapshot(source);
metrics.snapshots += 1;
return cloneSerializable(publicSnapshot());
}

function storageSnapshot() {
var safe = window.FSMOBILE_SAFE_STORAGE;
return safe && typeof safe.snapshot === "function" ? safe.snapshot() : { sequence: 0, lastResult: null };
}

function writeOutcome(before, returned, thrown) {
var after = storageSnapshot();
if (after.sequence > before.sequence && after.lastResult) return after.lastResult;
if (returned && typeof returned === "object" && Object.prototype.hasOwnProperty.call(returned, "ok")) return returned;
if (thrown || returned === false) return { ok: false, code: "write-failed", sequence: after.sequence };
return { ok: true, code: "no-write", sequence: after.sequence };
}

function rebaseFromRendered() {
stopObservers();
if (typeof setCustomerNumberFieldValue === "function") setCustomerNumberFieldValue("", { dispatch: false });
else {
var customerField = document.getElementById("kundenNrInput");
if (customerField && "value" in customerField) customerField.value = "";
}
if (typeof setReportRemarkValue === "function") setReportRemarkValue("", { persist: false, dispatch: false });
reportState = normalizeReport(renderedReport());
bindAllRepeatRows();
config.repeatGroups.forEach(function(group) { group.dirty = false; });
metrics.fullRowSyncs += config.repeatGroups.length;
metrics.fullRebases += 1;
syncAuxiliaryFields();
stateDirty = false;
startObservers();
}

function saveNow() {
if (clearPending) {
rebaseFromRendered();
clearPending = null;
} else {
syncBeforeSnapshot(arguments[0]);
}
var before = storageSnapshot();
var returned;
var thrown = null;
try { returned = original.save.apply(window, arguments); }
catch (error) { thrown = error; }
lastKnownStorageText = readStoredText();
metrics.flushes += 1;
var outcome = writeOutcome(before, returned, thrown);
if (outcome && outcome.ok) stateDirty = false;
return outcome;
}

function stableVisibleString(value) {
var comparable = cloneSerializable(value) || {};
if (comparable && typeof comparable === "object") delete comparable.savedAt;
try { return JSON.stringify(comparable); }
catch (error) { return ""; }
}

function clearButton(button) {
if (!button) return false;
var label = String(button.textContent || button.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
return /^(Formular |Prüfbericht )?leeren$/i.test(label);
}

function finishPendingClear(pending) {
if (!clearPending || clearPending !== pending) return;
var afterRaw = readStoredText();
var rendered = renderedReport();
var changed = afterRaw !== pending.storage || stableVisibleString(rendered) !== pending.visible;
if (changed) {
rebaseFromRendered();
lastKnownStorageText = afterRaw;
}
clearPending = null;
}

document.addEventListener("click", function(event) {
var button = event.target && event.target.closest ? event.target.closest("button") : null;
if (!button) return;
config.repeatGroups.forEach(function(group) {
var container = document.querySelector(group.containerSelector);
if (container && container.contains(button)) {
group.dirty = true;
stateDirty = true;
}
});
if (!clearButton(button)) return;
var pending = {
storage: readStoredText(),
visible: stableVisibleString(renderedReport())
};
clearPending = pending;
window.setTimeout(function() { finishPendingClear(pending); }, 0);
}, true);

document.addEventListener("input", function(event) {
lastEventElement = event.target;
if (!applying && (syncControl(event.target) || config.signatureNames.length && event.target && event.target.tagName === "CANVAS")) stateDirty = true;
}, true);
document.addEventListener("change", function(event) {
lastEventElement = event.target;
if (!applying && (syncControl(event.target) || config.signatureNames.length && event.target && event.target.tagName === "CANVAS")) stateDirty = true;
}, true);
document.addEventListener("pointerup", function(event) {
if (!applying && config.signatureNames.length && event.target && event.target.tagName === "CANVAS") stateDirty = true;
}, true);

var stored = readStoredReport();
reportState = mergeRendered(stored || {}, renderedReport());
bindAllRepeatRows();
syncAuxiliaryFields();
startObservers();
installRepeatAddWrappers();

window[config.collectName] = snapshot;
window[config.collectName].__fsmobileCanonicalState = true;
window[config.applyName] = applyReport;
window[config.applyName].__fsmobileCanonicalState = true;
window[config.saveName] = saveNow;
window[config.saveName].__fsmobileCanonicalState = true;
window.flushCurrentReportSave = saveNow;
window.flushCurrentReportSave.__fsmobileCanonicalState = true;

var previousApi = window.FSMOBILE_MODULE_API;
if (window.FSMOBILE_STANDARD && typeof window.FSMOBILE_STANDARD.createModuleApi === "function" && previousApi && previousApi.version === 1) {
window.FSMOBILE_MODULE_API = window.FSMOBILE_STANDARD.createModuleApi({
moduleId: moduleId,
storage: previousApi.storage,
capabilities: previousApi.capabilities,
state: { collect: snapshot, apply: applyReport },
lifecycle: { flush: saveNow },
actions: previousApi.actions
});
}

window.FSMOBILE_LARGE_REPORT_STATE = Object.freeze({
version: 1,
moduleId: moduleId,
kind: config.kind,
groups: Object.freeze(config.repeatGroups.map(function(group) { return group.key; })),
snapshot: snapshot,
metrics: function() { return Object.freeze(Object.assign({}, metrics)); }
});
if (repairInitialStorage) window.setTimeout(function() { saveNow(); }, 0);
}

function installRauchwarnmelderPagination() {
if (String(window.FSMOBILE_MODULE_ID || "") !== "pb-rauchwarnmelder" || window.__fsmobileTablePaginationInstalled) return;
var body = document.getElementById("rowsBody");
if (!body) return;
window.__fsmobileTablePaginationInstalled = true;

var pageSize = 30;
var currentPage = 0;
var hosts = [];
var activeInputRow = null;
var originalUpdateResults = window.updateResults;

if (typeof originalUpdateResults === "function" && typeof window.readRow === "function" && typeof window.statusFromRow === "function") {
function captureActiveInputRow(event) {
var row = event.target && event.target.closest ? event.target.closest("#rowsBody tr") : null;
if (!row) return;
activeInputRow = row;
Promise.resolve().then(function() {
if (activeInputRow === row) activeInputRow = null;
});
}
document.addEventListener("input", captureActiveInputRow, true);
document.addEventListener("change", captureActiveInputRow, true);
window.updateResults = function() {
if (!activeInputRow || !body.contains(activeInputRow)) return originalUpdateResults.apply(window, arguments);
var result = activeInputRow.querySelector("[data-result]");
if (!result) return;
var value = window.statusFromRow(window.readRow(activeInputRow));
result.textContent = value;
result.classList.toggle("bad", value === "n.i.O");
result.classList.toggle("good", value !== "n.i.O");
};
window.updateResults.__fsmobileIncremental = true;
}

function rowCount() {
return body.children.length;
}

function pageCount() {
return Math.max(1, Math.ceil(rowCount() / pageSize));
}

function installStyles() {
if (document.getElementById("fsmobileLargeReportPagerStyles")) return;
var style = document.createElement("style");
style.id = "fsmobileLargeReportPagerStyles";
style.textContent = [
".fsmobile-large-report-row-hidden{display:none!important}",
".fsmobile-large-report-pager{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:12px 0;padding:10px 12px;border:1px solid rgba(255,255,255,.38);border-radius:14px;background:rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)}",
".fsmobile-large-report-pager[hidden]{display:none!important}",
".fsmobile-large-report-pager button{min-height:44px!important;padding:9px 15px!important;box-shadow:none!important}",
".fsmobile-large-report-page-label{display:inline-flex;align-items:center;gap:8px;margin:0;color:var(--text,#1c1c1e);font-size:14px;font-weight:750}",
".fsmobile-large-report-page-select{width:auto!important;min-width:132px;min-height:44px!important;padding:8px 34px 8px 12px!important;background-color:rgba(255,255,255,.28)!important}",
".fsmobile-large-report-page-status{min-width:170px;color:var(--muted,#6e6e73);font-size:14px;font-weight:750;text-align:center}",
"@media(max-width:560px){.fsmobile-large-report-pager{align-items:stretch}.fsmobile-large-report-pager button,.fsmobile-large-report-page-label{flex:1 1 auto}.fsmobile-large-report-page-status{flex-basis:100%}}"
].join("");
document.head.appendChild(style);
}

function snapshot() {
var total = rowCount();
var start = total ? currentPage * pageSize + 1 : 0;
return Object.freeze({
enabled: total > pageSize,
pageSize: pageSize,
page: currentPage,
pages: pageCount(),
start: start,
end: total ? Math.min(total, start + pageSize - 1) : 0,
total: total
});
}

function createHost(position) {
var host = document.createElement("nav");
host.className = "fsmobile-large-report-pager";
host.dataset.fsmobilePagerPosition = position;
host.setAttribute("aria-label", "Zeilenabschnitt auswählen");

var previous = document.createElement("button");
previous.type = "button";
previous.className = "secondary fsmobile-large-report-page-previous";
previous.textContent = "‹ Vorherige";
previous.addEventListener("click", function() { showPage(currentPage - 1, true); });

var label = document.createElement("label");
label.className = "fsmobile-large-report-page-label";
label.appendChild(document.createTextNode("Zeilen"));
var select = document.createElement("select");
select.className = "fsmobile-large-report-page-select";
select.setAttribute("aria-label", "Zeilenbereich");
select.addEventListener("change", function() { showPage(Number(select.value), true); });
label.appendChild(select);

var status = document.createElement("span");
status.className = "fsmobile-large-report-page-status";
status.setAttribute("aria-live", "polite");

var next = document.createElement("button");
next.type = "button";
next.className = "secondary fsmobile-large-report-page-next";
next.textContent = "Nächste ›";
next.addEventListener("click", function() { showPage(currentPage + 1, true); });

host.append(previous, label, status, next);
return host;
}

function ensureHosts() {
if (hosts.length) return;
var table = body.closest("table");
var wrapper = table && table.closest ? table.closest(".table-wrap, .table-wrapper") : null;
if (!wrapper || !wrapper.parentNode) return;
installStyles();
var top = createHost("top");
var bottom = createHost("bottom");
wrapper.parentNode.insertBefore(top, wrapper);
wrapper.parentNode.insertBefore(bottom, wrapper.nextSibling);
hosts = [top, bottom];
}

function refresh(options) {
options = options || {};
ensureHosts();
var rows = Array.prototype.slice.call(body.children);
var total = rows.length;
var pages = pageCount();
if (options.reset) currentPage = 0;
if (options.showIndex != null) currentPage = Math.floor(Math.max(0, Number(options.showIndex) || 0) / pageSize);
currentPage = Math.max(0, Math.min(pages - 1, Number(currentPage) || 0));
var start = currentPage * pageSize;
var end = Math.min(total, start + pageSize);
rows.forEach(function(row, index) {
row.classList.toggle("fsmobile-large-report-row-hidden", total > pageSize && (index < start || index >= end));
});

hosts.forEach(function(host) {
host.hidden = total <= pageSize;
var select = host.querySelector(".fsmobile-large-report-page-select");
if (select && (select.options.length !== pages || select.dataset.fsmobileRowTotal !== String(total))) {
select.textContent = "";
for (var pageIndex = 0; pageIndex < pages; pageIndex += 1) {
var option = document.createElement("option");
var optionStart = pageIndex * pageSize + 1;
var optionEnd = Math.min(total, optionStart + pageSize - 1);
option.value = String(pageIndex);
option.textContent = optionStart + "–" + optionEnd;
select.appendChild(option);
}
select.dataset.fsmobileRowTotal = String(total);
}
if (select) select.value = String(currentPage);
var previous = host.querySelector(".fsmobile-large-report-page-previous");
var next = host.querySelector(".fsmobile-large-report-page-next");
if (previous) previous.disabled = currentPage === 0;
if (next) next.disabled = currentPage >= pages - 1;
var status = host.querySelector(".fsmobile-large-report-page-status");
if (status) status.textContent = total ? "Zeilen " + (start + 1) + "–" + end + " von " + total : "Keine Zeilen";
});

if (options.scroll) {
var table = body.closest("table");
var wrapper = table && table.closest ? table.closest(".table-wrap, .table-wrapper") : null;
if (wrapper) wrapper.scrollTop = 0;
if (hosts[0] && hosts[0].scrollIntoView) hosts[0].scrollIntoView({ block: "nearest" });
}
}

function showPage(page, scroll) {
var active = document.activeElement;
if (active && body.contains(active) && typeof active.blur === "function") active.blur();
currentPage = Number(page) || 0;
refresh({ scroll: Boolean(scroll) });
return snapshot();
}

function showRow(position, scroll) {
var rowNumber = Math.max(1, Math.min(rowCount(), Number(position) || 1));
return showPage(Math.floor((rowNumber - 1) / pageSize), scroll);
}

var observer = new MutationObserver(function(records) {
var addedRows = [];
var removedRows = 0;
records.forEach(function(record) {
Array.prototype.forEach.call(record.addedNodes || [], function(node) {
if (node && node.nodeType === 1 && node.matches("tr")) addedRows.push(node);
});
Array.prototype.forEach.call(record.removedNodes || [], function(node) {
if (node && node.nodeType === 1 && node.matches("tr")) removedRows += 1;
});
});
if (addedRows.length > 1 || removedRows > 1 || addedRows.length && removedRows) {
refresh({ reset: true });
return;
}
if (addedRows.length === 1) {
refresh({ showIndex: Array.prototype.indexOf.call(body.children, addedRows[0]), scroll: true });
return;
}
refresh();
});
observer.observe(body, { childList: true });

var state = window.FSMOBILE_LARGE_REPORT_STATE || {};
window.FSMOBILE_LARGE_REPORT_STATE = Object.freeze(Object.assign({}, state, {
pagination: snapshot,
showRow: showRow
}));
refresh({ reset: true });
}

document.addEventListener("DOMContentLoaded", function() {
installLargeReportStatePilot();
installStructuredReportStatePilot();
installRemainingReportStateMigration();
installRauchwarnmelderPagination();
installFsmobileTextareaAutosizeGuard();
markPositionCells();
installPositionCheckboxUi();
normalizePortraitAssignmentSections();
ensureCustomerNumberField();
installCustomerNumberDataBridge();
restoreCustomerNumberFromDraft();
ensureLandscapeReportRemarkField();
installRwaChoicePillTapFix();
ensureGeneratedTechnikerSignatureField();
installFsmobileSignatureDataBridge();
normalizeSignatureLabels();
refreshSignatureCanvasesForReadyLayout();
installUnifiedActionStatus();
installResultToneMarkers();
refreshResultToneMarkers();
installArchiveDedupe();
installArchiveMetadataCards();
installPdfFileNamePatch();
installJsPdfLoaderPatch();
setupReportDataTransfer();
ensureRwaClearButton();
arrangeHeaderActions();
var arrangeTimer = 0;
var reportEnhancementFrame = 0;
function refreshReportEnhancements() {
fsmobileResizeAllTextareas();
normalizePortraitAssignmentSections();
ensurePositionCheckboxUi();
ensureCustomerNumberField();
installCustomerNumberDataBridge();
restoreCustomerNumberFromDraft();
ensureLandscapeReportRemarkField();
installRwaChoicePillTapFix();
markPositionCells();
ensureGeneratedTechnikerSignatureField();
installFsmobileSignatureDataBridge();
normalizeSignatureLabels();
refreshResultToneMarkers();
installJsPdfLoaderPatch();
}
function runReportEnhancementRefresh() {
reportEnhancementFrame = 0;
refreshReportEnhancements();
arrangeHeaderActions();
}
function requestReportEnhancementRefresh() {
if (reportEnhancementFrame) return;
reportEnhancementFrame = window.requestAnimationFrame(runReportEnhancementRefresh);
}
function scheduleReportEnhancementRefresh(delay) {
window.setTimeout(requestReportEnhancementRefresh, delay);
}
[160, 700].forEach(scheduleReportEnhancementRefresh);
[180, 720].forEach(scheduleSignatureCanvasReadyRefresh);
window.addEventListener("resize", function() {
window.clearTimeout(arrangeTimer);
arrangeTimer = window.setTimeout(function() {
requestReportEnhancementRefresh();
scheduleSignatureCanvasReadyRefresh(0);
}, 80);
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
align-items: end !important;
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

body:not(.generating-pdf).fsmobile-portrait-report.fsmobile-kunden-nr-aligned-header .fsmobile-portrait-assignment {
grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
}

body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment .field,
body:not(.generating-pdf).fsmobile-portrait-report .fsmobile-portrait-assignment .field-group {
min-width: 0 !important;
display: flex !important;
flex-direction: column !important;
gap: 0 !important;
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

body:not(.generating-pdf) button {
border: 0 !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.22),
0 8px 16px rgba(2,8,23,.07) !important;
}

body:not(.generating-pdf) button.archive-save,
body:not(.generating-pdf) button.archive-save-btn,
body:not(.generating-pdf) button.btn-archive-save,
body:not(.generating-pdf) #archiveSaveBtn {
color: #fff !important;
background: linear-gradient(180deg, #ffb02e 0%, #ff9500 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.26),
0 8px 16px rgba(255,149,0,.16) !important;
}

body:not(.generating-pdf) button.archive-open,
body:not(.generating-pdf) button.archive-btn,
body:not(.generating-pdf) #archiveBtn,
body:not(.generating-pdf) button.pdf-btn,
body:not(.generating-pdf) #pdfButton,
body:not(.generating-pdf) #pdfBtn,
body:not(.generating-pdf) button.fsmobile-data-export {
color: #fff !important;
background: linear-gradient(180deg, #2f93ff 0%, #0a84ff 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.24),
0 8px 16px rgba(0,122,255,.14) !important;
}

body:not(.generating-pdf) button.clear-btn,
body:not(.generating-pdf) button.btn-clear,
body:not(.generating-pdf) #clearButton,
body:not(.generating-pdf) #clearBtn,
body:not(.generating-pdf) button.secondary,
body:not(.generating-pdf) button.fsmobile-data-import {
color: #fff !important;
background: linear-gradient(180deg, #a6a6ad 0%, #8e8e93 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.22),
0 8px 16px rgba(142,142,147,.14) !important;
}

body:not(.generating-pdf) button.danger,
body:not(.generating-pdf) button.archive-delete-btn,
body:not(.generating-pdf) button.archive-delete-button {
color: #fff !important;
background: linear-gradient(180deg, #ff4f45 0%, #ff3b30 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.24),
0 8px 16px rgba(255,59,48,.16) !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-item.archive-item-detailed {
display: grid !important;
grid-template-columns: minmax(0, 1fr) auto auto !important;
align-items: stretch !important;
gap: 10px !important;
padding: 12px !important;
flex: 0 0 auto !important;
height: auto !important;
min-width: 0 !important;
overflow: visible !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-host,
html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail {
min-width: 0 !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail {
display: grid !important;
gap: 7px !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-head {
display: flex !important;
align-items: center !important;
justify-content: space-between !important;
flex-wrap: wrap !important;
gap: 8px !important;
min-width: 0 !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-type-badge {
display: inline-flex !important;
align-items: center !important;
min-width: 0 !important;
max-width: 100% !important;
padding: 4px 8px !important;
border: 1px solid rgba(255,255,255,.36) !important;
border-radius: 999px !important;
color: rgba(23,32,51,.76) !important;
background: rgba(255,255,255,.12) !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,.22) !important;
font-size: 11px !important;
font-weight: 850 !important;
line-height: 1.15 !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
white-space: nowrap !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-entry-date,
html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-updated {
color: rgba(23,32,51,.62) !important;
font-size: 12px !important;
font-weight: 750 !important;
line-height: 1.25 !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-object {
color: rgba(23,32,51,.92) !important;
font-size: 16px !important;
font-weight: 850 !important;
line-height: 1.2 !important;
overflow-wrap: anywhere !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-grid {
display: flex !important;
flex-wrap: wrap !important;
gap: 6px !important;
min-width: 0 !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-pair {
display: inline-flex !important;
align-items: center !important;
max-width: 100% !important;
padding: 5px 8px !important;
border: 1px solid rgba(255,255,255,.28) !important;
border-radius: 10px !important;
color: rgba(23,32,51,.78) !important;
background: rgba(255,255,255,.075) !important;
line-height: 1.15 !important;
overflow: hidden !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-pair b {
margin-right: 3px !important;
color: rgba(23,32,51,.88) !important;
font-weight: 850 !important;
white-space: nowrap !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-detail-pair span {
min-width: 0 !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
white-space: nowrap !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-open-list-btn,
html.fsmobile-embedded-module body:not(.generating-pdf) .archive-delete-list-btn {
align-self: center !important;
min-height: 40px !important;
padding: 9px 14px !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-open-list-btn {
color: #fff !important;
background: linear-gradient(180deg, #2f93ff 0%, #0a84ff 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.24),
0 8px 16px rgba(0,122,255,.14) !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-delete-list-btn {
color: #fff !important;
background: linear-gradient(180deg, #ff4f45 0%, #ff3b30 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.24),
0 8px 16px rgba(255,59,48,.16) !important;
}

html.fsmobile-kalkulation-module body:not(.generating-pdf) > .container {
background: transparent !important;
border-color: transparent !important;
box-shadow: none !important;
-webkit-backdrop-filter: none !important;
backdrop-filter: none !important;
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

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-item.archive-item-detailed {
grid-template-columns: 1fr !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-open-list-btn,
html.fsmobile-embedded-module body:not(.generating-pdf) .archive-delete-list-btn {
width: 100% !important;
}
}


/* Hochformat-Transparenz: Unterschrift und lokale Formularflächen */
body:not(.generating-pdf) table {
border-collapse: separate !important;
border-spacing: 0 !important;
overflow: hidden !important;
border-color: rgba(255,255,255,.34) !important;
}

body:not(.generating-pdf) thead th,
body:not(.generating-pdf) table th {
padding-top: 10px !important;
padding-bottom: 10px !important;
border-bottom: 1px solid rgba(15,23,42,.1) !important;
line-height: 1.25 !important;
}

body:not(.generating-pdf) table td {
padding-top: 9px !important;
padding-bottom: 9px !important;
border-bottom: 1px solid rgba(255,255,255,.24) !important;
line-height: 1.3 !important;
vertical-align: middle !important;
}

body:not(.generating-pdf) table tr:last-child td {
border-bottom-color: transparent !important;
}

body:not(.generating-pdf) table tbody tr:nth-child(even) td {
background-color: rgba(255,255,255,.025) !important;
}

body:not(.generating-pdf) .fsmobile-result-ok {
color: #126b36 !important;
background:
linear-gradient(145deg, rgba(52,199,89,.16), rgba(255,255,255,.035)),
rgba(52,199,89,.08) !important;
border-color: rgba(52,199,89,.34) !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 0 0 1px rgba(52,199,89,.08) !important;
font-weight: 850 !important;
}

body:not(.generating-pdf) .fsmobile-result-bad {
color: #9f1d1d !important;
background:
linear-gradient(145deg, rgba(255,59,48,.15), rgba(255,255,255,.03)),
rgba(255,59,48,.075) !important;
border-color: rgba(255,59,48,.34) !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 0 0 1px rgba(255,59,48,.08) !important;
font-weight: 850 !important;
}

body:not(.generating-pdf) select.fsmobile-result-ok,
body:not(.generating-pdf) select.fsmobile-result-bad {
-webkit-appearance: none !important;
appearance: none !important;
padding-right: 34px !important;
background-repeat: no-repeat, no-repeat !important;
background-position: right 13px center, 0 0 !important;
background-size: 12px 8px, auto !important;
}

body:not(.generating-pdf) select.fsmobile-result-ok {
background-image:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1.5 1.75 6 6.25l4.5-4.5' fill='none' stroke='%23126b36' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"),
linear-gradient(145deg, rgba(52,199,89,.16), rgba(255,255,255,.035)) !important;
background-color: rgba(52,199,89,.08) !important;
}

body:not(.generating-pdf) select.fsmobile-result-bad {
background-image:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1.5 1.75 6 6.25l4.5-4.5' fill='none' stroke='%239f1d1d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"),
linear-gradient(145deg, rgba(255,59,48,.15), rgba(255,255,255,.03)) !important;
background-color: rgba(255,59,48,.075) !important;
}

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
background: rgba(15, 23, 42, .30) !important;
-webkit-backdrop-filter: blur(20px) saturate(1.06) !important;
backdrop-filter: blur(20px) saturate(1.06) !important;
}

body:not(.generating-pdf) .archive-dialog {
box-sizing: border-box !important;
width: min(820px, calc(100vw - 36px)) !important;
max-width: min(820px, calc(100vw - 36px)) !important;
max-height: min(680px, calc(100vh - 36px)) !important;
display: flex !important;
flex-direction: column !important;
overflow: hidden !important;
margin: 0 !important;
padding: 0 !important;
color: #172033 !important;
border: 1px solid rgba(255,255,255,.50) !important;
border-radius: 24px !important;
background:
linear-gradient(145deg, rgba(255,255,255,.30), rgba(255,255,255,.13) 58%, rgba(122,162,211,.08)),
rgba(238,244,252,.22) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.42),
inset 0 -1px 0 rgba(255,255,255,.10),
0 22px 58px rgba(2,8,23,.20) !important;
-webkit-backdrop-filter: blur(28px) saturate(1.10) !important;
backdrop-filter: blur(28px) saturate(1.10) !important;
}

body:not(.generating-pdf) .archive-header {
flex: 0 0 auto !important;
display: flex !important;
flex-direction: row !important;
align-items: center !important;
justify-content: space-between !important;
gap: 14px !important;
min-height: 66px !important;
margin: 0 !important;
padding: 17px 20px 13px !important;
border: 0 !important;
border-bottom: 1px solid rgba(255,255,255,.34) !important;
background: linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.04)) !important;
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
border: 0 !important;
border-radius: 999px !important;
color: #fff !important;
background: linear-gradient(180deg, #a6a6ad 0%, #8e8e93 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.22),
0 8px 16px rgba(142,142,147,.14) !important;
-webkit-backdrop-filter: blur(16px) saturate(1.08) !important;
backdrop-filter: blur(16px) saturate(1.08) !important;
}

body:not(.generating-pdf) .archive-filter-tools {
flex: 0 0 auto !important;
display: flex !important;
align-items: center !important;
gap: 10px !important;
margin: 0 !important;
padding: 12px 16px 0 !important;
background: transparent !important;
border: 0 !important;
box-shadow: none !important;
}

body:not(.generating-pdf) .archive-filter-input {
flex: 1 1 auto !important;
min-width: 0 !important;
min-height: 42px !important;
margin: 0 !important;
padding: 10px 13px !important;
color: rgba(17,24,39,.9) !important;
border: 1px solid rgba(255,255,255,.42) !important;
border-radius: 999px !important;
background:
linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.07)),
rgba(255,255,255,.08) !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,.26) !important;
-webkit-backdrop-filter: blur(18px) saturate(1.06) !important;
backdrop-filter: blur(18px) saturate(1.06) !important;
font-size: 14px !important;
font-weight: 700 !important;
line-height: 1.2 !important;
}

body:not(.generating-pdf) .archive-filter-count {
flex: 0 0 auto !important;
color: rgba(17,24,39,.58) !important;
font-size: 12px !important;
font-weight: 800 !important;
white-space: nowrap !important;
}

body:not(.generating-pdf) .archive-list {
flex: 1 1 auto !important;
display: flex !important;
flex-direction: column !important;
gap: 9px !important;
min-height: 0 !important;
margin: 0 !important;
padding: 16px !important;
overflow: auto !important;
-webkit-overflow-scrolling: touch !important;
background: transparent !important;
}

body:not(.generating-pdf) .archive-empty {
margin: 0 !important;
padding: 10px 14px !important;
text-align: center !important;
color: rgba(17,24,39,.64) !important;
font-size: 14px !important;
line-height: 1.3 !important;
font-weight: 800 !important;
border: 1px solid rgba(255,255,255,.26) !important;
border-radius: 999px !important;
background: rgba(255,255,255,.075) !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,.20) !important;
-webkit-backdrop-filter: blur(16px) saturate(1.05) !important;
backdrop-filter: blur(16px) saturate(1.05) !important;
}

body:not(.generating-pdf) .archive-item {
display: grid !important;
grid-template-columns: minmax(0, 1fr) auto auto !important;
gap: 8px !important;
align-items: center !important;
min-height: 70px !important;
margin: 0 !important;
padding: 13px !important;
color: #172033 !important;
border: 1px solid rgba(255,255,255,.38) !important;
border-radius: 16px !important;
background:
linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.065) 62%, rgba(122,162,211,.028)),
rgba(255,255,255,.075) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.28),
0 8px 18px rgba(2,8,23,.045) !important;
-webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
backdrop-filter: blur(18px) saturate(1.08) !important;
}

html.fsmobile-embedded-module body:not(.generating-pdf) .archive-item[hidden],
body:not(.generating-pdf) .archive-item[hidden] {
display: none !important;
}

body:not(.generating-pdf) .archive-item.archive-item-current {
border-color: rgba(10,132,255,.58) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.30),
0 0 0 2px rgba(10,132,255,.12),
0 8px 18px rgba(2,8,23,.045) !important;
}

body:not(.generating-pdf) .archive-item-current .archive-detail-head::after,
body:not(.generating-pdf) .archive-item-current .archive-title::after {
content: "Geöffnet" !important;
display: inline-flex !important;
align-items: center !important;
margin-left: 8px !important;
padding: 4px 8px !important;
border: 1px solid rgba(10,132,255,.22) !important;
border-radius: 999px !important;
color: #0a5fc8 !important;
background: rgba(10,132,255,.12) !important;
font-size: 11px !important;
font-weight: 850 !important;
line-height: 1.1 !important;
vertical-align: middle !important;
white-space: nowrap !important;
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
min-width: 78px !important;
min-height: 38px !important;
padding: 9px 12px !important;
border: 0 !important;
border-radius: 999px !important;
font-size: 13px !important;
line-height: 1.1 !important;
font-weight: 850 !important;
white-space: nowrap !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.30),
0 7px 14px rgba(2,8,23,.07) !important;
}

body:not(.generating-pdf) .archive-item button:not(.danger):not(.btn-danger):not(.archive-delete-btn):not(.archive-delete-button),
body:not(.generating-pdf) .archive-open-btn,
body:not(.generating-pdf) .archive-open-button,
body:not(.generating-pdf) button.archive-open {
color: #fff !important;
background: linear-gradient(180deg, #2f93ff 0%, #0a84ff 100%) !important;
}

body:not(.generating-pdf) .archive-item button.danger,
body:not(.generating-pdf) .archive-item button.btn-danger,
body:not(.generating-pdf) .archive-item button.archive-delete-btn,
body:not(.generating-pdf) .archive-item button.archive-delete-button,
body:not(.generating-pdf) .btn-danger,
body:not(.generating-pdf) .archive-delete-btn,
body:not(.generating-pdf) .archive-delete-button {
color: #fff !important;
border: 0 !important;
background: linear-gradient(180deg, #ff4f45 0%, #ff3b30 100%) !important;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.24),
0 7px 14px rgba(255,59,48,.16) !important;
}

body:not(.generating-pdf) #archiveStatus,
body:not(.generating-pdf) .archive-status,
body:not(.generating-pdf) .status[role="status"] {
display: none !important;
min-height: 0 !important;
margin: 0 !important;
padding: 0 !important;
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

body:not(.generating-pdf) .archive-filter-tools {
align-items: stretch !important;
flex-direction: column !important;
}

body:not(.generating-pdf) .archive-filter-count {
align-self: flex-start !important;
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
  if (quickSwitchButton) {
    quickSwitchButton.addEventListener("click", () => {
      const targetModuleId = previousModuleId;
      if (!targetModuleId || targetModuleId === activeModuleId || !registry[targetModuleId]) {
        updateQuickSwitchButton();
        return;
      }
      quickSwitchTransitionPending = true;
      openModule(targetModuleId);
    });
  }
  if (menuOptionsButton) menuOptionsButton.addEventListener("click", openOptionsDialog);
  if (optionsCloseButton) optionsCloseButton.addEventListener("click", closeOptionsDialog);
  if (optionsOverlay) {
    optionsOverlay.addEventListener("click", event => {
      if (event.target === optionsOverlay) closeOptionsDialog();
    });
  }
  if (archiveBackupExportButton) archiveBackupExportButton.addEventListener("click", exportAllArchiveData);
  if (archiveBackupImportButton && archiveBackupFile) {
    archiveBackupImportButton.addEventListener("click", () => {
      setOptionsStatus("");
      hideArchiveDeleteConfirm();
      hideBackupSummary();
      archiveBackupFile.click();
    });
    archiveBackupFile.addEventListener("change", () => importArchiveBackupFile(archiveBackupFile.files && archiveBackupFile.files[0]));
  }
  if (archiveBackupImportCancelButton) archiveBackupImportCancelButton.addEventListener("click", cancelPendingBackupImport);
  if (archiveBackupImportConfirmButton) archiveBackupImportConfirmButton.addEventListener("click", confirmPendingBackupImport);
  if (archiveDeleteButton) archiveDeleteButton.addEventListener("click", showArchiveDeleteConfirm);
  if (archiveDeleteCancelButton) archiveDeleteCancelButton.addEventListener("click", () => {
    hideArchiveDeleteConfirm();
    setOptionsStatus("");
    archiveDeleteButton && archiveDeleteButton.focus();
  });
  if (archiveDeleteConfirmButton) archiveDeleteConfirmButton.addEventListener("click", deleteAllArchiveData);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && archiveBackupSummary && !archiveBackupSummary.hidden && archiveBackupImportActions && !archiveBackupImportActions.hidden) {
      event.preventDefault();
      cancelPendingBackupImport();
      return;
    }
    if (event.key === "Escape" && archiveDeleteConfirm && !archiveDeleteConfirm.hidden) {
      hideArchiveDeleteConfirm();
      archiveDeleteButton && archiveDeleteButton.focus();
      return;
    }
    if (event.key === "Escape" && optionsOverlay && !optionsOverlay.hidden) closeOptionsDialog();
  });
  frame.addEventListener("load", () => {
    if (frame.contentWindow && frame.contentDocument?.body) window.FSMOBILE_UI?.installModule(frame.contentWindow);
    window.clearTimeout(actionSyncTimer);
    actionSyncTimer = window.setTimeout(syncModuleActionBar, 120);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushActiveModuleForPageLifecycle("visibility-hidden");
      return;
    }
    if (document.visibilityState === "visible") reportPendingPageLifecycleFlushFailure();
  });
  window.addEventListener("pagehide", () => flushActiveModuleForPageLifecycle("pagehide"));
  window.addEventListener("pageshow", reportPendingPageLifecycleFlushFailure);
  window.addEventListener("popstate", () => handleRoute(true));
  initializeConnectionStatus();

  if ("serviceWorker" in navigator && window.self === window.top) {
    let serviceWorkerReloading = false;
    let serviceWorkerHadController = Boolean(navigator.serviceWorker.controller);
    let updateRegistration = null;
    let pendingServiceWorker = null;
    let updateCheckTimer = 0;

    function resetUpdateButton() {
      if (updateTitle) updateTitle.textContent = "Neue Version bereit";
      if (updateText) updateText.textContent = "Neue Version geladen. Jetzt aktualisieren.";
      if (!updateButton) return;
      updateButton.disabled = false;
      updateButton.textContent = "Aktualisieren";
    }

    function showUpdateApplyingState() {
      if (updateTitle) updateTitle.textContent = "Update wird angewendet...";
      if (updateText) updateText.textContent = "Die App wird gleich neu geladen.";
      if (!updateButton) return;
      updateButton.disabled = true;
      updateButton.textContent = "Aktualisiere...";
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
      window.setTimeout(() => showAppToast("App wurde aktualisiert."), 450);
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!serviceWorkerHadController) {
        serviceWorkerHadController = true;
        updateConnectionStatus({ showReady: true });
        return;
      }
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
        showUpdateApplyingState();
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

        navigator.serviceWorker.ready
          .then(() => updateConnectionStatus({ showReady: true }))
          .catch(() => undefined);

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
    if (window.crypto && window.crypto.subtle) {
      const hash = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
    }

    // Local HTTP previews have no SubtleCrypto. Verify the same SHA-256 hash
    // there as well; absence of Web Crypto must never grant access by itself.
    const constants = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const state = new Uint32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);
    const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    const bitLength = bytes.length * 8;
    view.setUint32(padded.length - 8, Math.floor(bitLength / 0x100000000));
    view.setUint32(padded.length - 4, bitLength >>> 0);
    const words = new Uint32Array(64);
    const rotate = (word, bits) => (word >>> bits) | (word << (32 - bits));
    for (let offset = 0; offset < padded.length; offset += 64) {
      for (let i = 0; i < 16; i++) words[i] = view.getUint32(offset + i * 4);
      for (let i = 16; i < 64; i++) {
        const x = words[i - 15], y = words[i - 2];
        const s0 = rotate(x, 7) ^ rotate(x, 18) ^ (x >>> 3);
        const s1 = rotate(y, 17) ^ rotate(y, 19) ^ (y >>> 10);
        words[i] = words[i - 16] + s0 + words[i - 7] + s1;
      }
      let [a, b, c, d, e, f, g, h] = state;
      for (let i = 0; i < 64; i++) {
        const s1 = rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25);
        const choice = (e & f) ^ (~e & g);
        const t1 = (h + s1 + choice + constants[i] + words[i]) >>> 0;
        const s0 = rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22);
        const majority = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (s0 + majority) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      [a, b, c, d, e, f, g, h].forEach((word, i) => { state[i] += word; });
    }
    return Array.from(state, word => word.toString(16).padStart(8, "0")).join("");
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
    activeModuleId = null;
    quickSwitchTransitionPending = false;
    if (topbar) topbar.classList.remove("is-module-active");
    frame.srcdoc = "";
    menuView.hidden = false;
    moduleView.hidden = true;
    backButton.hidden = true;
    updateQuickSwitchButton();
    updateMenuOptionsVisibility();
    subtitle.textContent = "Menüauswahl";
    history.replaceState({ module: null }, "", location.pathname);
    showAuth();
  }

  authForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (authSubmit.disabled) return;
    const value = authCode.value;
    authError.textContent = "";
    authSubmit.disabled = true;
    authSubmit.textContent = "Wird geprüft …";
    try {
      const hash = await digest(value);
      if (hash === REQUIRED_PASS_HASH) {
        localStorage.setItem(AUTH_UNLOCK_KEY, AUTH_UNLOCK_VALUE);
        localStorage.removeItem(OLD_PASS_HASH_KEY);
        unlockApp();
        return;
      }
      authError.textContent = "Passwort ist nicht korrekt.";
      authCode.select();
    } catch {
      authError.textContent = "Entsperren fehlgeschlagen. Bitte erneut versuchen. Falls der Fehler bleibt, die App neu laden und den Browser-Speicherzugriff prüfen.";
      authCode.focus();
    } finally {
      authSubmit.disabled = false;
      authSubmit.textContent = "Entsperren";
    }
  });

  if (menuSearchInput) {
    menuSearchInput.addEventListener("input", () => {
      menuSearchQuery = menuSearchInput.value || "";
      renderMenu();
    });
    menuSearchInput.addEventListener("keydown", event => {
      if (event.key === "Escape" && menuSearchInput.value) {
        event.preventDefault();
        menuSearchInput.value = "";
        menuSearchQuery = "";
        renderMenu();
      }
    });
  }

  if (menuSearchClear) {
    menuSearchClear.addEventListener("click", () => {
      if (menuSearchInput) menuSearchInput.value = "";
      menuSearchQuery = "";
      renderMenu();
      if (menuSearchInput) menuSearchInput.focus({ preventScroll: true });
    });
  }

  renderMenu();
  localStorage.removeItem(OLD_PASS_HASH_KEY);
  showAuth();
}());
