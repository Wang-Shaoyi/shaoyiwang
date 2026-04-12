// ============================================================
// MAIN — runs on every page after components.js + data files
// ============================================================

// Root path — explicit data-root on <body> takes precedence
const _inPages = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
const _root = (document.body.getAttribute('data-root') !== null)
  ? document.body.getAttribute('data-root')
  : (_inPages ? '../' : '');

// ← Back button: always set a real href (fixes hover), intercept only when history exists
document.querySelectorAll('.project-back a').forEach((a) => {
  a.href = _root + 'index.html';          // real URL → browser activates :hover immediately
  if (document.referrer) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.back();
    });
  }
});

// Sticky back bar — appears when .project-back scrolls out of view
(function initStickyBack() {
  const backEl = document.querySelector('.project-back');
  if (!backEl) return;
  const srcLink = backEl.querySelector('a');
  if (!srcLink) return;

  const bar = document.createElement('div');
  bar.className = 'sticky-back';
  const barLink = document.createElement('a');
  barLink.textContent = srcLink.textContent;
  barLink.href = srcLink.href;
  barLink.addEventListener('click', (e) => {
    if (document.referrer) { e.preventDefault(); window.history.back(); }
  });
  bar.appendChild(barLink);
  document.body.appendChild(bar);

  const obs = new IntersectionObserver(([entry]) => {
    bar.classList.toggle('sticky-back--visible', !entry.isIntersecting);
  }, { threshold: 0 });
  obs.observe(backEl);
})();

// ============================================================
// Merge project arrays from whichever _index.js files were loaded
// ============================================================
const PROJECTS = [
  ...(typeof RESEARCH_PROJECTS !== 'undefined'  ? RESEARCH_PROJECTS  : []),
  ...(typeof DESIGN_PROJECTS   !== 'undefined'  ? DESIGN_PROJECTS    : []),
  ...(typeof MAKING_PROJECTS   !== 'undefined'  ? MAKING_PROJECTS    : []),
  ...(typeof APP_GAME_PROJECTS !== 'undefined'  ? APP_GAME_PROJECTS  : []),
].sort((a, b) => (b.year || 0) - (a.year || 0));

// ============================================================
// CARD RENDERER  — clicking navigates to the project page
// ============================================================
function renderCards(projects, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  if (!projects.length) {
    grid.innerHTML = `<p style="color:var(--text-muted);padding:8px 0">No projects yet — check back soon!</p>`;
    return;
  }
  grid.innerHTML = projects.map((p) => `
    <article class="card" data-id="${p.id}" tabindex="0" role="link" aria-label="${p.title}">
      <div class="card-thumb">
        <img src="${_root + p.image}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.card').forEach((card) => {
    const project = PROJECTS.find((p) => p.id === card.dataset.id);
    const go = () => { window.location.href = _root + project.page; };
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') go(); });
  });
}

// ============================================================
// LIST RENDERER  (shared by Notes tabs)
// ============================================================
function renderList(containerId, data, filterTag) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const filtered = filterTag
    ? data.filter((c) => c.tags && c.tags.includes(filterTag))
    : data;
  if (!filtered.length) {
    el.innerHTML = `<p style="color:var(--text-muted);padding:8px 0">${filterTag ? 'No entries match this tag.' : 'Nothing here yet.'}</p>`;
    return;
  }
  el.innerHTML = filtered.map((c) => {
    const hasPage = c.page && c.page !== '#';
    const tagsHtml = c.tags && c.tags.length
      ? `<div class="card-tags" style="flex-basis:100%;margin-top:4px">${c.tags.map((t) => `<button class="tag${t === filterTag ? ' tag--active' : ''}" data-tag="${t}">${t}</button>`).join('')}</div>`
      : '';
    const linksHtml = `<div class="code-links">${(c.links || []).map((l) =>
      `<a class="pub-link${l.style === 'orange' ? ' orange' : ''}" href="${l.url}"${/^https?:\/\//.test(l.url) ? ' target="_blank" rel="noopener"' : ''}>${l.label}</a>`
    ).join('')}</div>`;
    const rowEl = hasPage
      ? `<a class="code-item--link" href="${_root + c.page}"><span class="code-title">${c.title}</span><span class="code-dash">—</span><span class="code-desc">${c.description}</span></a>`
      : `<div class="code-item--static"><span class="code-title">${c.title}</span><span class="code-dash">—</span><span class="code-desc">${c.description}</span></div>`;
    return `<div class="code-item">${rowEl}${tagsHtml}${linksHtml}</div>`;
  }).join('');
}

// ============================================================
// DEV LOG RENDERER
// ============================================================
function renderDevLog(containerId, data, filterTag) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const filtered = filterTag
    ? data.filter((e) => e.tags && e.tags.includes(filterTag))
    : data;
  if (!filtered.length) {
    el.innerHTML = `<p style="color:var(--text-muted);padding:8px 0">${filterTag ? 'No entries match this tag.' : 'No entries yet.'}</p>`;
    return;
  }
  el.innerHTML = filtered.map((entry) => {
    const d = new Date(entry.date);
    const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const hasPage = entry.page && entry.page !== '#';
    return `
    <div class="devlog-item">
      <div class="devlog-date">${dateStr}</div>
      <div class="devlog-body">
        <div class="devlog-title">${hasPage
          ? `<a href="${_root + entry.page}">${entry.title}</a>`
          : entry.title
        }</div>
        <p class="devlog-desc">${entry.description}</p>
        <div class="card-tags">${(entry.tags || []).map((t) => `<button class="tag${t === filterTag ? ' tag--active' : ''}" data-tag="${t}">${t}</button>`).join('')}</div>
      </div>
    </div>`;
  }).join('');
}

// ============================================================
// PUBLICATION LIST RENDERER
// ============================================================
function renderPublications(containerId) {
  if (typeof PUBLICATIONS === 'undefined') return;
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = PUBLICATIONS.map((p) => `
    <div class="pub-item">
      <div class="pub-year">${p.year}</div>
      <div>
        <div class="pub-title">${p.title}</div>
        <div class="pub-meta">${p.authors} — ${p.venue}</div>
        <div class="pub-links">
          ${p.links.map((l) =>
            `<a class="pub-link${l.style === 'orange' ? ' orange' : ''}" href="${l.url}"${/^https?:\/\//.test(l.url) ? ' target="_blank" rel="noopener"' : ''}>${l.label}</a>`
          ).join('')}
        </div>
      </div>
    </div>`).join('');
}

// ============================================================
// GALLERY RENDERER
// ============================================================
function renderGallery(containerId, filterCat) {
  if (typeof GALLERY === 'undefined') return;
  const el = document.getElementById(containerId);
  if (!el) return;
  const items = (filterCat && filterCat !== 'all')
    ? GALLERY.filter((g) => g.category === filterCat)
    : GALLERY;
  el.innerHTML = items.map((g) => `
    <div class="gallery-item">
      <img src="${_root + g.image}" alt="${g.title}" loading="lazy" />
    </div>`).join('');
}

// ============================================================
// TABS (Notes page)
// ============================================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  // Read tab from URL hash so links to a specific tab work
  const hashTab = window.location.hash.replace('#tab-', '');

  tabBtns.forEach((btn) => {
    if (hashTab && btn.dataset.tab === hashTab) {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById('tab-' + btn.dataset.tab);
      if (pane) pane.classList.add('active');
    }
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById('tab-' + btn.dataset.tab);
      if (pane) pane.classList.add('active');
      window.location.hash = 'tab-' + btn.dataset.tab;
    });
  });
}

// ============================================================
// HOME PAGE — featured projects only
// ============================================================
if (document.getElementById('home-grid')) {
  renderCards(PROJECTS.filter((p) => p.featured), 'home-grid');
}

// ============================================================
// PROJECTS PAGE — all card projects with filter bar
// ============================================================
if (document.getElementById('projects-grid')) {
  const bar = document.getElementById('projects-filter');

  function applyProjectFilter(slug) {
    if (bar) bar.querySelectorAll('.filter-btn').forEach((b) =>
      b.classList.toggle('active', b.dataset.filter === slug)
    );
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('filter');
    else url.searchParams.set('filter', slug);
    window.history.replaceState({}, '', url.toString());
    renderCards(
      slug === 'all' ? PROJECTS : PROJECTS.filter((p) => p.categorySlug === slug),
      'projects-grid'
    );
  }

  applyProjectFilter(new URLSearchParams(window.location.search).get('filter') || 'all');

  if (bar) bar.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyProjectFilter(btn.dataset.filter));
  });
}

// ============================================================
// NOTES PAGE — render all tabs then init tab switching + tag filter
// ============================================================
if (document.getElementById('tab-coding')) {
  const _NOTES_DATA = {
    coding:      () => typeof CODING_NOTES    !== 'undefined' ? CODING_NOTES    : [],
    math:        () => typeof MATH_NOTES      !== 'undefined' ? MATH_NOTES      : [],
    resources:   () => typeof RESOURCES_NOTES !== 'undefined' ? RESOURCES_NOTES : [],
    game_develop:() => typeof GAME_DEV_LOG    !== 'undefined' ? GAME_DEV_LOG    : [],
  };
  const _notesFilter = { coding: null, math: null, resources: null, game_develop: null };

  function _renderNotesTab(tabId) {
    const tag = _notesFilter[tabId];
    if (tabId === 'game_develop') renderDevLog('notes-devlog', _NOTES_DATA.game_develop(), tag);
    else renderList('notes-' + tabId, _NOTES_DATA[tabId](), tag);

    const bar = document.getElementById('notes-filter-bar-' + tabId);
    const lbl = document.getElementById('notes-filter-label-' + tabId);
    if (bar && lbl) {
      if (tag) { lbl.textContent = tag; bar.style.display = 'flex'; }
      else { bar.style.display = 'none'; }
    }
  }

  // Initial render
  Object.keys(_NOTES_DATA).forEach(_renderNotesTab);
  initTabs();

  // Tag click → filter
  document.querySelector('.tabs')?.closest('section').addEventListener('click', (e) => {
    const btn = e.target.closest('button.tag[data-tag]');
    if (!btn) return;
    const tabPane = btn.closest('.tab-content');
    if (!tabPane) return;
    const tabId = tabPane.id.replace('tab-', '');
    _notesFilter[tabId] = btn.dataset.tag;
    _renderNotesTab(tabId);
  });

  // Clear filter button
  document.querySelectorAll('.notes-filter-clear').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      _notesFilter[tabId] = null;
      _renderNotesTab(tabId);
    });
  });
}

// ============================================================
// PUBLICATIONS PAGE
// ============================================================
if (document.getElementById('pub-list')) renderPublications('pub-list');

// ============================================================
// GALLERY PAGE
// ============================================================
if (document.getElementById('gallery-grid')) {
  const galleryBar = document.getElementById('gallery-filter');

  function applyGalleryFilter(cat) {
    if (galleryBar) galleryBar.querySelectorAll('.filter-btn').forEach((b) =>
      b.classList.toggle('active', b.dataset.filter === cat)
    );
    renderGallery('gallery-grid', cat);
  }

  applyGalleryFilter(new URLSearchParams(window.location.search).get('cat') || 'all');

  if (galleryBar) galleryBar.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyGalleryFilter(btn.dataset.filter));
  });
}

// ============================================================
// LIGHTBOX — project page images
// ============================================================
(function initLightbox() {
  // Collect navigable images: all .project-figure img (grid, masonry, wide, standalone)
  const navImgs = Array.from(document.querySelectorAll('.project-figure img'));
  // Hero image is also clickable but navigated separately (index -1)
  const heroImg = document.querySelector('.project-hero-img img');

  if (!navImgs.length && !heroImg) return;

  // Build overlay DOM
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div class="lb-box">
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption"></div>
    </div>
    <button class="lb-close" aria-label="Close">\u2715</button>
    <button class="lb-nav lb-prev" aria-label="Previous">\u2039</button>
    <button class="lb-nav lb-next" aria-label="Next">\u203a</button>`;
  document.body.appendChild(overlay);

  const lbImg     = overlay.querySelector('.lb-img');
  const lbCaption = overlay.querySelector('.lb-caption');
  const lbClose   = overlay.querySelector('.lb-close');
  const lbPrev    = overlay.querySelector('.lb-prev');
  const lbNext    = overlay.querySelector('.lb-next');

  let currentIdx = 0;   // index into navImgs; -1 = hero
  let isHero     = false;

  function setImage(img) {
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    const fig = img.closest('figure');
    const cap = fig ? fig.querySelector('figcaption') : null;
    lbCaption.textContent = cap ? cap.textContent.trim() : '';
    lbCaption.style.display = lbCaption.textContent ? '' : 'none';
  }

  function open(idx, hero) {
    isHero     = !!hero;
    currentIdx = isHero ? 0 : idx;
    setImage(isHero ? heroImg : navImgs[currentIdx]);
    // Show nav only when multiple navigable images exist
    const showNav = !isHero && navImgs.length > 1;
    lbPrev.style.display = showNav ? '' : 'none';
    lbNext.style.display = showNav ? '' : 'none';
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('lb-visible'));
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('lb-visible');
    setTimeout(() => { overlay.style.display = 'none'; lbImg.src = ''; }, 200);
    document.body.style.overflow = '';
  }

  function nav(dir) {
    if (isHero) return;
    currentIdx = (currentIdx + dir + navImgs.length) % navImgs.length;
    setImage(navImgs[currentIdx]);
  }

  // Wire up images
  navImgs.forEach((img, i) => {
    img.addEventListener('click', (e) => { e.stopPropagation(); open(i, false); });
  });
  if (heroImg) {
    heroImg.addEventListener('click', (e) => { e.stopPropagation(); open(0, true); });
  }

  // Controls
  lbClose.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  lbPrev.addEventListener('click',  (e) => { e.stopPropagation(); nav(-1); });
  lbNext.addEventListener('click',  (e) => { e.stopPropagation(); nav(1); });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('lb-visible')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
})();
