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

  // Content pages use a single return link to the portfolio board.
  document.querySelectorAll('.site-header').forEach((header) => header.remove());
  if (!document.querySelector('.project-back')) {
    const container = document.querySelector('main .container') || document.querySelector('main');
    if (container) {
      const back = document.createElement('div');
      back.className = 'project-back';
      const link = document.createElement('a');
      link.href = root + 'index.html';
      link.textContent = 'BACK';
      back.append(link);
      container.prepend(back);
    }
  }
})();
