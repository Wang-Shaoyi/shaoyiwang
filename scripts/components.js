// ============================================================
// SHARED COMPONENTS — injected on every page
// ============================================================
(function () {

  // ── Open Sans font (self-hosted) ─────────────────────────
  if (!document.querySelector('link[href*="open-sans.css"]')) {
    const explicit2 = document.body.getAttribute('data-root');
    const r = explicit2 !== null ? explicit2 : (window.location.pathname.replace(/\\/g, '/').includes('/pages/') ? '../' : '');
    const font = Object.assign(document.createElement('link'), {
      rel: 'stylesheet',
      href: `${r}assets/lib/fonts/open-sans.css`,
    });
    document.head.append(font);

    // ── Favicon ──────────────────────────────────────────────
    if (!document.querySelector('link[rel~="icon"]')) {
      document.head.append(Object.assign(document.createElement('link'), {
        rel: 'icon', type: 'image/png',
        href: `${r}assets/images/logo.png`,
      }));
    }
  }

  // ── Root path resolution ─────────────────────────────────
  // Pages can set data-root on <body> to override auto-detection.
  // root = ''      → at site root (index.html)
  // root = '../'   → one level deep (pages/*.html)
  // root = '../../'→ two levels deep (pages/projects/*.html)
  const explicit = document.body.getAttribute('data-root');
  const autoRoot = window.location.pathname.replace(/\\/g, '/').includes('/pages/') ? '../' : '';
  const root = explicit !== null ? explicit : autoRoot;

  // ── Nav link definitions ──────────────────────────────────
  const NAV_LINKS = [
    { label: 'About',        href: `${root}pages/about.html` },
    { label: 'Projects',     href: `${root}pages/projects.html` },
    { label: 'Publications', href: `${root}pages/publications.html` },
    { label: 'Notes',        href: `${root}pages/notes.html` },
    { label: 'Gallery',      href: `${root}pages/gallery.html` },
  ];

  // ── Active-link helper (also called after filter changes) ─
  function refreshNavActive() {
    const curPage   = window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html';
    const curFilter = new URLSearchParams(window.location.search).get('filter') || '';
    document.querySelectorAll('.main-nav a').forEach((a) => {
      try {
        const u       = new URL(a.href);
        const aPage   = u.pathname.replace(/\\/g, '/').split('/').pop();
        const aFilter = u.searchParams.get('filter') || '';
        a.classList.toggle('active', aPage === curPage && aFilter === curFilter);
      } catch (_) {
        a.classList.remove('active');
      }
    });
  }

  // Expose so main.js can call it after URL changes
  window._refreshNavActive = refreshNavActive;

  // ── Build header ─────────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (!header) return;

  const linksHTML = NAV_LINKS.map(({ label, href }) =>
    `<li><a href="${href}">${label}</a></li>`
  ).join('');

  header.innerHTML = `
    <div class="header-inner">
      <a class="logo" href="${root}index.html">Shaoyi Wang</a>
      <span class="header-email">shaoyiwang@berkeley.edu</span>
      <nav class="main-nav"><ul>${linksHTML}</ul></nav>
      <button class="nav-toggle" aria-label="Toggle menu">&#9776;</button>
    </div>`;

  header.querySelector('.nav-toggle').addEventListener('click', () => {
    header.querySelector('.main-nav').classList.toggle('open');
  });

  // Set initial active state once DOM links are in place
  refreshNavActive();
})();
