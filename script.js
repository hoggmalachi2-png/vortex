const installPromptKey = 'pwaInstalled_v2';
const recentStorageKey = 'lastPlayed_v3';
const recentStorageLegacyKey = 'lastPlayed';
const gamesBackgroundColorStorageKey = 'vortexGamesBackgroundColor';
const accentColorStorageKey = 'vortexAccentColor';
const introLoadingSessionKey = 'vtxIntroLoadingShown_v1';
const gamesCatalogPagePath = 'games.html';
const gameTileSelector = 'a.image-link-border, a.image-link-border1, a.image-link-border2';

let gamesSourceLoadPromise = null;

function queryGameTiles(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(gameTileSelector));
}

async function ensureAllGamesSourceLoaded(sourceEl) {
  if (!sourceEl) return [];
  if (gamesSourceLoadPromise) return gamesSourceLoadPromise;

  gamesSourceLoadPromise = (async () => {
    const fallbackTiles = queryGameTiles(sourceEl);

    try {
      const response = await fetch(gamesCatalogPagePath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to load ${gamesCatalogPagePath}`);

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const sourceContainer = doc.querySelector('.container-3');
      const catalogTiles = queryGameTiles(sourceContainer);
      if (!catalogTiles.length) return fallbackTiles;

      const replacement = document.createElement('div');
      replacement.className = 'container-3';
      catalogTiles.forEach(tile => {
        replacement.appendChild(tile.cloneNode(true));
      });

      sourceEl.innerHTML = '';
      sourceEl.appendChild(replacement);
      return queryGameTiles(sourceEl);
    } catch {
      return fallbackTiles;
    }
  })();

  return gamesSourceLoadPromise;
}

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
  const root = document.documentElement;
  const isHexColor = value => /^#[0-9a-f]{6}$/i.test(value || '');

  const hexToRgb = value => {
    const hex = value.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Backward compatibility: if old key exists, use it as games background.
  const savedGamesBg =
    localStorage.getItem(gamesBackgroundColorStorageKey) ||
    localStorage.getItem('vortexBackgroundColor');
  if (isHexColor(savedGamesBg)) {
    root.style.setProperty('--games-bg-color', savedGamesBg);
  }

  const savedAccent = localStorage.getItem(accentColorStorageKey);
  if (isHexColor(savedAccent)) {
    root.style.setProperty('--accent-color', savedAccent);
    root.style.setProperty('--accent-rgb', hexToRgb(savedAccent));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('firstVisitOverlay');
  const loadingTrack = document.getElementById('firstVisitLoadingTrack');
  const loadingFill = document.getElementById('firstVisitLoadingFill');
  const loadingLabel = document.getElementById('firstVisitLoadingLabel');
  if (!overlay || !loadingTrack || !loadingFill || !loadingLabel) return;

  let shouldShowLoading = true;
  try {
    shouldShowLoading = sessionStorage.getItem(introLoadingSessionKey) !== 'true';
  } catch {
    shouldShowLoading = true;
  }

  if (!shouldShowLoading) {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    return;
  }

  try {
    sessionStorage.setItem(introLoadingSessionKey, 'true');
  } catch {
    // Ignore storage failures; loading screen will still function.
  }

  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.remove('loading-complete');
  try {
    overlay.focus({ preventScroll: true });
  } catch {
    overlay.focus();
  }

  let overlayClosed = false;
  let loadingPercent = 0;
  let loadingTargetPercent = 0;
  let rafId = null;
  const loadingStartedAt = Date.now();
  const minimumVisibleMs = 420;
  const hardStopMs = 2800;

  function renderLoadingProgress() {
    loadingFill.style.width = `${loadingPercent.toFixed(2)}%`;
    loadingTrack.setAttribute('aria-valuenow', String(Math.round(loadingPercent)));
    loadingLabel.textContent = `Loading ${Math.round(loadingPercent)}%`;
  }

  function setLoadingTarget(nextPercent) {
    if (!Number.isFinite(nextPercent)) return;
    const clamped = Math.max(0, Math.min(100, nextPercent));
    loadingTargetPercent = Math.max(loadingTargetPercent, clamped);
  }

  function closeOverlay() {
    if (overlayClosed) return;
    overlayClosed = true;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    overlay.classList.add('loading-complete');
    overlay.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => {
      overlay.style.display = 'none';
    }, 260);
  }

  function maybeFinish() {
    if (overlayClosed) return;
    const elapsed = Date.now() - loadingStartedAt;
    if (elapsed < minimumVisibleMs) {
      window.setTimeout(maybeFinish, minimumVisibleMs - elapsed);
      return;
    }
    setLoadingTarget(100);
  }

  function tick() {
    if (overlayClosed) return;

    const elapsed = Date.now() - loadingStartedAt;
    const syntheticTarget = Math.min(94, 8 + elapsed * 0.08);
    setLoadingTarget(syntheticTarget);

    if (elapsed >= hardStopMs) {
      setLoadingTarget(100);
    }

    if (loadingPercent < loadingTargetPercent) {
      const delta = loadingTargetPercent - loadingPercent;
      const step = Math.max(0.45, Math.min(3.5, delta * 0.24));
      loadingPercent = Math.min(loadingTargetPercent, loadingPercent + step);
      renderLoadingProgress();
    }

    if (loadingPercent >= 100) {
      closeOverlay();
      return;
    }

    rafId = window.requestAnimationFrame(tick);
  }

  renderLoadingProgress();
  setLoadingTarget(6);
  rafId = window.requestAnimationFrame(tick);

  if (document.readyState === 'complete') {
    maybeFinish();
  } else {
    window.addEventListener('load', maybeFinish, { once: true });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const input = document.getElementById('gameSearch');
  const count = document.getElementById('gameCount');
  const searchResults = document.getElementById('searchResults');
  const recentRow = document.getElementById('recentlyPlayed');
  const recentPrev = document.getElementById('recentPrev');
  const recentNext = document.getElementById('recentNext');
  const allGamesSource = document.getElementById('allGamesSource');

  if (!input || !allGamesSource || !searchResults) return;
  if (count) count.textContent = 'Loading games...';

  const allTiles = await ensureAllGamesSourceLoaded(allGamesSource);
  if (!allTiles.length) {
    if (count) count.textContent = 'No games found';
    return;
  }

  function tileId(tile) {
    return (tile.dataset.id || tile.getAttribute('href') || '').toLowerCase();
  }

  function getSearchHaystack(tile) {
    return [
      tile.dataset.search,
      tile.dataset.title,
      tile.dataset.gameTitle,
      tile.dataset.id,
      tile.textContent
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  let activeResultIndex = -1;
  const recentPageSize = 5;
  let recentPageIndex = 0;
  let recentOrderedIds = [];
  let recentPageCount = 1;

  function setSearchOpen(isOpen) {
    document.body.classList.toggle('search-open', isOpen);
  }

  function getTileLabel(tile) {
    return tile.dataset.gameTitle || tile.dataset.title || tile.dataset.id || tile.getAttribute('href') || 'Game';
  }

  function scoreTile(tile, query) {
    if (!query) return 1;
    const hay = getSearchHaystack(tile);
    const label = getTileLabel(tile).toLowerCase();
    if (label.startsWith(query)) return 3;
    if (label.includes(query)) return 2;
    if (hay.includes(query)) return 1;
    return 0;
  }

  function hideSearchResults() {
    activeResultIndex = -1;
    searchResults.classList.remove('open');
    searchResults.innerHTML = '';
    setSearchOpen(false);
  }

  function renderSearchResults() {
    const query = input.value.trim().toLowerCase();
    const ranked = allTiles
      .map(tile => ({ tile, score: scoreTile(tile, query) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const topMatches = ranked.slice(0, 5).map(item => item.tile);
    searchResults.innerHTML = '';
    activeResultIndex = -1;

    if (!topMatches.length) {
      if (count) count.textContent = 'No games found';
      hideSearchResults();
      return;
    }

    topMatches.forEach((tile, index) => {
      const card = tile.cloneNode(true);
      card.classList.add('search-card-link');
      card.dataset.resultIndex = String(index);
      searchResults.appendChild(card);
    });

    searchResults.classList.add('open');
    setSearchOpen(true);
    if (count) count.textContent = `Found ${topMatches.length} Games/Apps`;
  }

  function readRecent() {
    const parseList = key => {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const primary = parseList(recentStorageKey);
    const legacy = parseList(recentStorageLegacyKey);

    // Merge while preserving order and removing duplicates.
    const merged = [];
    [...legacy, ...primary].forEach(id => {
      if (!id || merged.includes(id)) return;
      merged.push(id);
    });

    return merged;
  }

  function writeRecent(list) {
    const trimmed = list.slice(-10);
    localStorage.setItem(recentStorageKey, JSON.stringify(trimmed));
    localStorage.setItem(recentStorageLegacyKey, JSON.stringify(trimmed));
  }

  function pushRecent(id) {
    if (!id) return;
    const current = readRecent().filter(item => item !== id);
    current.push(id);
    writeRecent(current);
  }

  function pushRecentFromTile(tile) {
    if (!tile) return;
    pushRecent(tileId(tile));
    renderRecent();
  }

  function cloneRecentTile(sourceTile) {
    const clone = sourceTile.cloneNode(true);
    clone.removeAttribute('id');
    return clone;
  }

  function renderRecentPage() {
    if (!recentRow) return;

    if (recentPageIndex > recentPageCount - 1) recentPageIndex = recentPageCount - 1;
    if (recentPageIndex < 0) recentPageIndex = 0;
    recentRow.style.transform = `translateX(-${recentPageIndex * 100}%)`;
    if (recentPrev) recentPrev.disabled = recentPageIndex === 0 || recentPageCount <= 1;
    if (recentNext) recentNext.disabled = recentPageIndex >= recentPageCount - 1 || recentPageCount <= 1;
  }

  function renderRecent() {
    if (!recentRow) return;
    const sourceIds = allTiles.map(tile => tileId(tile)).filter(Boolean);
    const recentSet = [];

    readRecent().forEach(id => {
      if (id && !recentSet.includes(id) && sourceIds.includes(id)) recentSet.push(id);
    });

    for (const id of sourceIds) {
      if (recentSet.length >= 10) break;
      if (!recentSet.includes(id)) recentSet.push(id);
    }

    recentOrderedIds = recentSet.slice(-10).reverse();
    writeRecent(recentSet);
    recentRow.innerHTML = '';

    recentPageCount = Math.max(1, Math.ceil(recentOrderedIds.length / recentPageSize));
    for (let page = 0; page < recentPageCount; page++) {
      const pageEl = document.createElement('div');
      pageEl.className = 'recent-page';
      const start = page * recentPageSize;
      const pageIds = recentOrderedIds.slice(start, start + recentPageSize);

      pageIds.forEach(id => {
        const tile = allTiles.find(item => tileId(item) === id);
        if (tile) pageEl.appendChild(cloneRecentTile(tile));
      });

      recentRow.appendChild(pageEl);
    }

    renderRecentPage();
  }

  document.addEventListener('click', e => {
    const tile = e.target.closest('#recentlyPlayed a.image-link-border, #recentlyPlayed a.image-link-border1, #recentlyPlayed a.image-link-border2');
    if (!tile) return;
    pushRecent(tileId(tile));
  });

  input.addEventListener('focus', renderSearchResults);
  input.addEventListener('input', renderSearchResults);
  input.addEventListener('keydown', e => {
    const items = Array.from(searchResults.querySelectorAll('.search-card-link'));
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeResultIndex = Math.min(items.length - 1, activeResultIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeResultIndex = Math.max(0, activeResultIndex - 1);
    } else if (e.key === 'Enter') {
      if (activeResultIndex >= 0 && items[activeResultIndex]) {
        e.preventDefault();
        pushRecentFromTile(items[activeResultIndex]);
        window.location.href = items[activeResultIndex].getAttribute('href') || '#';
      } else if (items[0]) {
        e.preventDefault();
        pushRecentFromTile(items[0]);
        window.location.href = items[0].getAttribute('href') || '#';
      }
      return;
    } else if (e.key === 'Escape') {
      hideSearchResults();
      input.blur();
      return;
    } else {
      return;
    }

    items.forEach(item => item.classList.remove('active'));
    if (items[activeResultIndex]) {
      items[activeResultIndex].classList.add('active');
      items[activeResultIndex].scrollIntoView({ block: 'nearest' });
    }
  });

  searchResults.addEventListener('pointerdown', e => {
    const tile = e.target.closest('.search-card-link');
    if (!tile) return;
    pushRecent(tileId(tile));
  });

  document.addEventListener('pointerdown', e => {
    const insideSearch = e.target.closest('.search-container');
    if (!insideSearch) hideSearchResults();
  });

  if (recentPrev) {
    recentPrev.addEventListener('click', () => {
      recentPageIndex -= 1;
      renderRecentPage();
    });
  }

  if (recentNext) {
    recentNext.addEventListener('click', () => {
      recentPageIndex += 1;
      renderRecentPage();
    });
  }

  renderRecent();
  if (count) count.textContent = 'Press / or click search to find games';
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const allGamesSource = document.getElementById('allGamesSource');
  if (!allGamesSource) return;

  await ensureAllGamesSourceLoaded(allGamesSource);
  const tiles = queryGameTiles(allGamesSource);
  if (!tiles.length) return;

  const cacheKey = 'gameTitleCacheV1';
  const cache = JSON.parse(sessionStorage.getItem(cacheKey) || '{}');
  const pending = new Map();

  function setTileName(tile, name) {
    if (!name) return;
    tile.dataset.title = name;
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

(() => {
  // Keep card scale stable across devices/browsers.
  document.documentElement.style.setProperty('--card-zoom-comp', '1');
})();

// Lock the UI to a single design canvas and scale it uniformly across devices.
(() => {
  function applyFixedCanvasScale() {
    const root = document.documentElement;
    const appWidth = parseFloat(getComputedStyle(root).getPropertyValue('--app-width')) || 1440;
    const appHeight = parseFloat(getComputedStyle(root).getPropertyValue('--app-height')) || 900;
    const scale = Math.min(window.innerWidth / appWidth, window.innerHeight / appHeight);
    root.style.setProperty('--app-scale', Math.max(0.1, scale).toFixed(4));
  }

  applyFixedCanvasScale();
  window.addEventListener('resize', applyFixedCanvasScale);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyFixedCanvasScale);
  }
})();
