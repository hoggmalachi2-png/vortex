/* =========================
   BACKGROUND SYSTEM (Hybrid Images + Colors + Panels)
   ========================= */

const background = document.getElementById('background'); // <-- background container

// Create two fade layers
const bgLayerA = document.createElement('div'); 
const bgLayerB = document.createElement('div');

bgLayerA.className = 'bg-layer active';
bgLayerB.className = 'bg-layer';

background.appendChild(bgLayerA);
background.appendChild(bgLayerB);

let activeLayer = bgLayerA;
let inactiveLayer = bgLayerB;

// Smooth background change (image or color)
function changeBackground(value) {
  if (!value) return;

  inactiveLayer.classList.add('active');
  activeLayer.classList.remove('active');

  // Detect if value is an image URL or CSS gradient
  const isImage = value.startsWith('http') || value.match(/\.(jpg|jpeg|png|gif|avif)$/i);
  const isGradient = /gradient\(/i.test(value);

  if (isImage) {
    inactiveLayer.style.backgroundImage = `url('${value}')`;
    inactiveLayer.style.backgroundColor = '';
  } else if (isGradient) {
    inactiveLayer.style.backgroundImage = value;
    inactiveLayer.style.backgroundColor = '';
  } else {
    inactiveLayer.style.backgroundImage = '';
    inactiveLayer.style.backgroundColor = value;
  }

  // Swap layers
  const temp = activeLayer;
  activeLayer = inactiveLayer;
  inactiveLayer = temp;
}

/* =========================
   PANEL NAVIGATION
   ========================= */

const navLinks = document.querySelectorAll('.top-nav a');
const panelTrack = document.querySelector('.panel-track');
const topNav = document.querySelector('.top-nav');
const cornerLogo = document.querySelector('.corner-logo');
const navIndicator = document.createElement('div');
navIndicator.className = 'nav-gloss-indicator';
if (topNav) topNav.prepend(navIndicator);

function moveNavIndicator(target) {
  if (!topNav || !target) return;
  const navRect = topNav.getBoundingClientRect();
  const linkRect = target.getBoundingClientRect();
  const x = linkRect.left - navRect.left;

  navIndicator.style.width = `${linkRect.width}px`;
  navIndicator.style.transform = `translateX(${x}px)`;
}

function alignCornerLogoToNav() {
  if (!topNav || !cornerLogo) return;
  const navRect = topNav.getBoundingClientRect();
  const logoHeight = cornerLogo.getBoundingClientRect().height;
  const y = navRect.top + (navRect.height - logoHeight) / 2;
  cornerLogo.style.top = `${Math.max(0, y)}px`;
}

navLinks.forEach((link, index) => {
  link.addEventListener('click', e => {
    e.preventDefault();

    panelTrack.style.transform = `translateX(-${index * 100}vw)`;
    navLinks.forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    moveNavIndicator(link);

    const panel = document.querySelector(link.getAttribute('href'));
    if (!panel) return;

    if (panel.id === 'home') {
      // Home: default to first Recently Played tile
      const recentTile = document.querySelector('.container-3 [data-bg]');
      if (recentTile) changeBackground(recentTile.dataset.bg);
    } else if (panel.dataset.bg) {
      // Non-home panels: solid color
      changeBackground(panel.dataset.bg);
    }
  });
});

panelTrack.style.transform = 'translateX(0vw)'; // start at Home
const activeNav = document.querySelector('.top-nav a.active') || navLinks[0];
if (activeNav) {
  requestAnimationFrame(() => {
    moveNavIndicator(activeNav);
    alignCornerLogoToNav();
  });
}
window.addEventListener('resize', () => {
  const current = document.querySelector('.top-nav a.active');
  if (current) moveNavIndicator(current);
  alignCornerLogoToNav();
});
if (cornerLogo) {
  cornerLogo.addEventListener('load', alignCornerLogoToNav);
}

/* =========================
   INITIAL HOME BACKGROUND (after Recent Played renders)
   ========================= */

function setInitialHomeBG() {
  const recentTile = document.querySelector('.container-3 [data-bg]');
  if (recentTile) changeBackground(recentTile.dataset.bg);
}


/* =========================
   HOME TILE HOVER
   ========================= */

document.addEventListener('mouseover', e => {
  const tile = e.target.closest('[data-bg]');
  if (!tile) return;
  const activeNavHref = document.querySelector('.top-nav a.active')?.getAttribute('href');
  const isHomeTile = !!tile.closest('#home');
  if (activeNavHref === '#home' && isHomeTile) {
    changeBackground(tile.dataset.bg);
  }
});

/* =========================
   RECENTLY PLAYED SYSTEM
   ========================= */

document.addEventListener('DOMContentLoaded', () => {
  const recentRow = document.querySelector('.container-3');
  const placeholders = Array.from(
    document.querySelectorAll('#placeholders [data-id]')
  );
  const placeholderIdMap = {
    'game-1': 'geo',
    'game-2': 'level',
    'game-3': 'bit',
    'game-4': 'blast',
    'game-5': 'retro'
  };

  let lastPlayed = JSON.parse(localStorage.getItem('lastPlayed')) || [];

  function normalizeGameId(id) {
    return placeholderIdMap[id] || id;
  }

  function dedupeRecent(list) {
    const seen = new Set();
    const unique = [];
    for (let i = list.length - 1; i >= 0; i--) {
      const id = normalizeGameId(list[i]);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      unique.push(id);
    }
    return unique.reverse();
  }

  function renderRecent() {
    recentRow.innerHTML = '';

    lastPlayed = dedupeRecent(lastPlayed).slice(-5);
    localStorage.setItem('lastPlayed', JSON.stringify(lastPlayed));

    lastPlayed.slice().reverse().forEach(id => {
      const tile = document.querySelector(`[data-id="${id}"]`);
      if (tile) recentRow.appendChild(tile.cloneNode(true));
    });

    const used = new Set(
      Array.from(recentRow.querySelectorAll('[data-id]')).map(el => normalizeGameId(el.dataset.id))
    );

    for (let i = 0; i < placeholders.length && recentRow.children.length < 5; i++) {
      const id = placeholders[i].dataset.id;
      const canonicalId = normalizeGameId(id);
      if (!canonicalId || used.has(canonicalId)) continue;
      used.add(canonicalId);
      recentRow.appendChild(placeholders[i].cloneNode(true));
    }

    setInitialHomeBG();
  }

  renderRecent();

  document.addEventListener('click', e => {
    const tile = e.target.closest('[data-id]');
    if (!tile) return;

    const id = normalizeGameId(tile.dataset.id);
    if (!id) return;

    lastPlayed = lastPlayed.filter(g => g !== id);
    lastPlayed.push(id);
    lastPlayed = lastPlayed.slice(-5);

    localStorage.setItem('lastPlayed', JSON.stringify(lastPlayed));
    setTimeout(renderRecent, 200);
  });
});

/* =========================
   CLOCK
   ========================= */

function updateClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;

  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';

  h = h % 12 || 12;
  m = m < 10 ? '0' + m : m;

  clock.textContent = `${h}:${m} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock();

const installPromptKey = 'pwaInstalled_v2';
const firstVisitOverlaySeenKey = 'firstVisitOverlaySeen_v1';

function isLikelyInstalled() {
  const isLocalPreviewHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  if (isLocalPreviewHost) return false;

  const isAppDisplayMode =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches;

  return (
    localStorage.getItem(installPromptKey) === 'true' ||
    isAppDisplayMode ||
    window.navigator.standalone === true
  );
}

window.addEventListener('appinstalled', () => {
  localStorage.setItem(installPromptKey, 'true');
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('updateOverlay');
  if (!overlay) return;

  // sessionStorage resets when tab is closed
  const hasShownThisSession = sessionStorage.getItem('overlayShown');

  if (!hasShownThisSession) {
    overlay.style.display = 'flex';
    sessionStorage.setItem('overlayShown', 'true');
  } else {
    overlay.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('firstVisitOverlay');
  const dismiss = document.getElementById('firstVisitDismiss');
  const installVideo = document.getElementById('firstVisitVideo');
  const videoFallback = document.getElementById('firstVisitVideoFallback');
  if (!overlay || !dismiss) return;

  if (isLikelyInstalled()) {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    return;
  }

  const isBrowserTabVisit = window.matchMedia('(display-mode: browser)').matches;
  if (!isBrowserTabVisit) {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    return;
  }

  const hasSeenFirstVisitOverlay = localStorage.getItem(firstVisitOverlaySeenKey) === 'true';
  if (hasSeenFirstVisitOverlay) {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    return;
  }

  localStorage.setItem(firstVisitOverlaySeenKey, 'true');

  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden', 'false');

  async function tryPlayInstallVideo() {
    if (!installVideo) return;
    installVideo.muted = true;
    installVideo.defaultMuted = true;
    try {
      await installVideo.play();
      if (videoFallback) videoFallback.style.display = 'none';
      return true;
    } catch {
      if (videoFallback) videoFallback.style.display = 'flex';
      return false;
    }
  }

  if (installVideo) {
    installVideo.addEventListener('error', () => {
      if (videoFallback) videoFallback.style.display = 'flex';
    });
    installVideo.addEventListener('loadeddata', () => {
      if (videoFallback) videoFallback.style.display = 'none';
    });
    installVideo.addEventListener('pause', () => {
      if (overlay.style.display !== 'none') {
        installVideo.play().catch(() => {});
      }
    });
    tryPlayInstallVideo().then(started => {
      if (!started) {
        const startOnInteraction = () => {
          tryPlayInstallVideo().then(ok => {
            if (ok) {
              overlay.removeEventListener('pointerdown', startOnInteraction);
            }
          });
        };
        overlay.addEventListener('pointerdown', startOnInteraction);
      }
    });
  }

  function closeOverlay() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    if (installVideo) installVideo.pause();
  }

  dismiss.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeOverlay();
  });
});

/* =========================
   GAME SEARCH
   ========================= */

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('gameSearch');
  if (!input) return;

  const count = document.getElementById('gameCount');
  const filterButtons = Array.from(document.querySelectorAll('#games .game-filter-btn'));
  const gameGrid = document.querySelector('#games .container-3');
  const tiles = Array.from(
    document.querySelectorAll('#games a.image-link-border, #games a.image-link-border1, #games a.image-link-border2')
  );
  const appIds = new Set(['chat', 'form', 'silk']);
  const newIds = new Set([
    '', '', '', '', '', '', '', '',
    'baby', 'baldi', 'blast', 'block', 'bubble', 'cattle', 'csgo', 'dragon',
    'egg', 'es2', 'fire', 'fnaf2', 'fnafe', 'fork', 'fort', 'hill', 'house',
    'indian', 'lego', 'level', 'little', 'mario2', 'miner', 'mk3', 'mortal',
    'pac', 'plane', 'ragdoll', 'russian', 'slope', 'slow', 'smashbros',
    'sonic', 'solar', 'solitare', 'soinc', 'south', 'ssf', 'subway', 'tank',
    'tennis', 'tetris', 'top', 'tower', 'tunnel', 'ultamite', 'uno', 'wordle',
    'world', 'yellow', 'smash', 'fnaf'
  ]);
  const shooterKeywords = ['shooter', 'fps', 'gun', 'counter', 'csgo', 'sniper', 'bullet', 'doom', 'cod', 'superhot', 'force'];
  const carKeywords = ['car', 'drive', 'drift', 'racing', 'race', 'truck', 'slope', 'subway', 'fortzone', 'road'];
  const sportsKeywords = ['sports', 'football', 'soccer', 'baseball', 'basketball', 'tennis', 'madden', 'mlb', 'bowl', 'fifa'];
  const horrorKeywords = ['horror', 'fnaf', 'granny', 'backrooms', 'baldi', 'freddys', 'scary', 'night'];
  let selectedFilter = 'all';

  function getCategory(tile) {
    const id = (tile.dataset.id || '').toLowerCase();
    if (tile.dataset.category) return tile.dataset.category.toLowerCase();
    if (appIds.has(id)) return 'apps';
    if (newIds.has(id)) return 'new';
    return 'games';
  }

  function updateSearch() {
    const q = input.value.trim().toLowerCase();
    let shown = 0;

    tiles.forEach(tile => {
      const hay = [
        tile.dataset.search,
        tile.dataset.title,
        tile.dataset.id,
        tile.textContent
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const textMatch = !q || hay.includes(q);
      const category = getCategory(tile);
      const hasKeyword = keywords => keywords.some(keyword => hay.includes(keyword));
      const filterMatch =
        selectedFilter === 'all' ||
        (selectedFilter === 'apps' && category === 'apps') ||
        (selectedFilter === 'new' && category === 'new') ||
        (selectedFilter === 'games' && category !== 'apps') ||
        (selectedFilter === 'shooter' && hasKeyword(shooterKeywords)) ||
        (selectedFilter === 'car' && hasKeyword(carKeywords)) ||
        (selectedFilter === 'sports' && hasKeyword(sportsKeywords)) ||
        (selectedFilter === 'horror' && hasKeyword(horrorKeywords));

      const match = textMatch && filterMatch;
      tile.style.display = match ? '' : 'none';
      if (match) shown++;
    });

    if (count) {
      count.textContent = `Showing ${shown} Games`;
    }
  }

  input.addEventListener('input', updateSearch);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedFilter = btn.dataset.filter || 'all';
      filterButtons.forEach(other => other.classList.remove('active'));
      btn.classList.add('active');

      if (!gameGrid) {
        updateSearch();
        return;
      }

      gameGrid.classList.add('filter-transition');
      setTimeout(() => {
        updateSearch();
        requestAnimationFrame(() => {
          gameGrid.classList.remove('filter-transition');
        });
      }, 90);
    });
  });
  updateSearch();
});

document.addEventListener('DOMContentLoaded', () => {
  const tiles = Array.from(
    document.querySelectorAll('#games .container-3 a.image-link-border, #games .container-3 a.image-link-border1, #games .container-3 a.image-link-border2')
  );
  if (!tiles.length) return;

  const cacheKey = 'gameTitleCacheV1';
  const cache = JSON.parse(sessionStorage.getItem(cacheKey) || '{}');
  const pending = new Map();

  function setTileName(tile, name) {
    if (!name) return;
    tile.dataset.gameTitle = name;
    tile.title = name;
    if (!tile.dataset.title) tile.dataset.title = name;
  }

  function localHtmPath(tile) {
    const href = tile.getAttribute('href');
    if (!href || href.startsWith('http://') || href.startsWith('https://')) return null;
    if (!href.endsWith('.htm')) return null;
    return href;
  }

  async function fetchTitleFromHtm(path) {
    if (pending.has(path)) return pending.get(path);
    const request = fetch(path)
      .then(r => (r.ok ? r.text() : ''))
      .then(html => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return (doc.querySelector('title')?.textContent || '').trim();
      })
      .catch(() => '');
    pending.set(path, request);
    return request;
  }

  tiles.forEach(tile => {
    const path = localHtmPath(tile);
    if (!path) return;
    if (cache[path]) setTileName(tile, cache[path]);
  });

  (async () => {
    for (const tile of tiles) {
      const path = localHtmPath(tile);
      if (!path || cache[path]) continue;
      const title = await fetchTitleFromHtm(path);
      if (!title) continue;
      cache[path] = title;
      setTileName(tile, title);
    }
    sessionStorage.setItem(cacheKey, JSON.stringify(cache));
  })();
});

function closeUpdateOverlay() {
  const overlay = document.getElementById('updateOverlay');
  if (!overlay) return;

  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 350);
}

// Keep card visuals consistent between browser zoom levels (e.g. 100% and 110%).
(() => {
  const baselineDpr = window.devicePixelRatio || 1;
  const baselineInnerWidth = window.innerWidth || 1;

  function applyCardZoomCompensation() {
    const currentDpr = window.devicePixelRatio || baselineDpr;
    const currentInnerWidth = Math.max(1, window.innerWidth || baselineInnerWidth);

    // Some ChromeOS zoom paths don't update DPR reliably; use viewport-width ratio as fallback.
    const dprZoomFactor = currentDpr / baselineDpr;
    const viewportZoomFactor = baselineInnerWidth / currentInnerWidth;
    const dprDelta = Math.abs(dprZoomFactor - 1);
    const viewportDelta = Math.abs(viewportZoomFactor - 1);
    const zoomFactor = viewportDelta > dprDelta ? viewportZoomFactor : dprZoomFactor;

    const compensation = Math.min(2, Math.max(0.5, 1 / zoomFactor));
    document.documentElement.style.setProperty('--card-zoom-comp', compensation.toFixed(4));
  }

  applyCardZoomCompensation();
  window.addEventListener('resize', applyCardZoomCompensation);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyCardZoomCompensation);
  }
})();
