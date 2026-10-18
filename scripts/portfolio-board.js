// Board homepage. The previous card-based homepage is retained in index-classic.html.
(function buildPortfolioBoard() {
  const grid = document.getElementById('board-grid');
  if (!grid) return;

  const projects = [
    ...(typeof RESEARCH_PROJECTS !== 'undefined' ? RESEARCH_PROJECTS : []),
    ...(typeof DESIGN_PROJECTS !== 'undefined' ? DESIGN_PROJECTS : []),
    ...(typeof MAKING_PROJECTS !== 'undefined' ? MAKING_PROJECTS : []),
    ...(typeof APP_GAME_PROJECTS !== 'undefined' ? APP_GAME_PROJECTS : []),
  ];
  const projectById = Object.fromEntries(projects.map((project) => [project.id, project]));

  // Position 0 is the lower-right corner; numbering continues clockwise.
  // Project keys follow the shorthand used in the user's layout sketch.
  const spaces = [
    { label: 'START EXPLORE', href: 'pages/about.html', kind: 'start' },
    { label: 'About', href: 'pages/about.html', kind: 'about', image: 'assets/images/photo.jpg' },
    { label: 'ARCH 150', href: 'pages/teaching/arch150.html', image: 'assets/images/teaching/arch150/final-review.jpg', kind: 'teaching', group: 'teaching' },
    { label: 'ARCH 250', href: 'pages/teaching/arch250.html', image: 'assets/images/teaching/arch250/student-work-spring2024-model.png', kind: 'teaching', group: 'teaching' },
    { label: 'Gallery', href: 'pages/gallery.html', kind: 'link', group: 'teaching', preview: 'gallery' },
    { project: 'des-6', group: 'making' },
    { project: 'mak-1', group: 'making' },
    { project: 'mak-2', group: 'making' },
    { label: 'My Notes', href: 'pages/notes.html', kind: 'list', accent: 'brand' },

    { project: 'des-7', group: 'architectural-design' },
    { project: 'des-3', group: 'architectural-design' },
    { project: 'des-2', group: 'architectural-design' },
    { label: 'LinkedIn', displayLabel: '', href: 'https://www.linkedin.com/in/shaoyi-wang-8757b6292/', kind: 'link', group: 'architectural-design', external: true },
    { project: 'des-5', group: 'structural-design' },
    { project: 'des-4', group: 'structural-design' },
    { project: 'des-1', group: 'structural-design' },
    { label: 'See all projects', href: 'pages/projects.html', kind: 'list', accent: 'brand' },

    { project: 'res-2', group: 'structure-research' },
    { project: 'res-1', group: 'structure-research' },
    { project: 'res-3', group: 'structure-research' },
    { label: 'Spatial Systems Lab', displayLabel: 'Our Lab', href: 'https://spatial-systems.io/', kind: 'link', group: 'structure-research', external: true },
    { project: 'res-4', group: 'buildings-research', future: true, estimate: 'est. 2026/11' },
    { label: 'Urban', note: 'Future project', group: 'buildings-research', future: true },
    { label: 'Retrofit', note: 'Future project', group: 'buildings-research', future: true },
    { label: 'See all Publications', href: 'pages/publications.html', kind: 'list', accent: 'brand' },

    { project: 'app-2', group: 'app' },
    { project: 'app-1', group: 'app' },
    { label: 'Floorplan Editor', note: 'Future project', group: 'app', future: true },
    { label: 'GitHub', displayLabel: '', href: 'https://github.com/Wang-Shaoyi', kind: 'link', group: 'app', external: true },
    { label: '', group: 'game', empty: true },
    { label: 'Monopoly', href: 'https://monopoly.shaoyiw.com/', kind: 'external-project', group: 'game', external: true },
    { label: 'Home Renovation Game', note: 'Future project', group: 'game', future: true, estimate: 'est. 2029/6' },
  ];

  const districtNames = {
    teaching: 'Teaching',
    making: 'Making',
    'architectural-design': 'Architectural Design',
    'structural-design': 'Structural Design',
    'structure-research': 'Structure Research',
    'buildings-research': 'Buildings Research',
    app: 'App',
    game: 'Game',
  };

  const sectorTabs = [
    ['structure-research', 'Structure'],
    ['buildings-research', 'Building'],
    ['structural-design', 'Structure'],
    ['architectural-design', 'Architecture'],
    ['app', 'App'],
    ['game', 'Game'],
    ['making', 'Making'],
    ['teaching', 'Teaching'],
  ];

  const shortProjectTitles = {
    'res-1': 'Conformal 3D Printing',
    'res-2': 'BarkBeetle',
    'res-3': 'Mechanics-Guided Grouping',
    'res-4': 'Inverse Design',
    'des-1': 'Palm Onto-Intelligence',
    'des-2': 'Cable-net Vertiport',
    'des-3': 'Commercial Plaza',
    'des-4': 'Silk Tapestry Pavilion',
    'des-5': 'Weaving Structure',
    'des-6': 'Bamboo Garden',
    'des-7': 'White-Noise Apartment',
    'mak-1': 'Fiber-Winding Monohull',
    'mak-2': 'Self-Glowing Lamp',
    'app-1': 'Pseudorandom',
    'app-2': 'Inno-Render',
  };

  function cellOf(id) {
    if (id <= 8) return { column: 9 - id, row: 9 };
    if (id <= 16) return { column: 1, row: 17 - id };
    if (id <= 24) return { column: id - 15, row: 1 };
    return { column: 9, row: id - 23 };
  }

  function sideOf(id) {
    if (id <= 8) return 'bottom';
    if (id <= 16) return 'left';
    if (id <= 24) return 'top';
    return 'right';
  }

  function tileMarkup(space, id) {
    const project = space.project ? projectById[space.project] : null;
    const title = project ? shortProjectTitles[project.id] : (space.displayLabel ?? space.label ?? '');
    const href = space.future || space.empty ? null : (project ? `${project.page}?from=home&board=1&project=${project.id}` : space.href);
    const side = sideOf(id);
    const cell = cellOf(id);
    const classes = [
      'board-tile',
      `board-tile--${side}`,
      id % 8 === 0 ? 'board-tile--corner' : '',
      space.group ? `board-tile--${space.group}` : '',
      space.future ? 'board-tile--future' : '',
      space.estimate ? 'board-tile--scheduled' : '',
      space.empty ? 'board-tile--empty' : '',
      project || space.future || space.kind === 'external-project' || space.kind === 'teaching' ? 'board-tile--project' : '',
      project?.featured ? 'board-tile--featured' : '',
      space.kind === 'link' ? 'board-tile--link' : '',
      space.kind === 'list' ? 'board-tile--list' : '',
      space.kind === 'start' ? 'board-tile--start' : '',
      space.kind === 'about' ? 'board-tile--about' : '',
      space.label === 'Monopoly' ? 'board-tile--monopoly' : '',
      space.preview === 'gallery' ? 'board-tile--gallery' : '',
    ].filter(Boolean).join(' ');
    const showBand = space.group && space.kind !== 'link';
    const previewType = space.preview || '';
    const contents = `
      ${showBand ? `<span class="board-tile-band" aria-hidden="true"></span>` : ''}
      <span class="board-tile-content">
        ${space.label === 'Spatial Systems Lab' ? '<img class="board-lab-logo" src="assets/images/spatial-systems-logo.jpg" alt="" />' : socialLogo(space.label)}
        ${project && !space.future || space.kind === 'teaching' ? `<img class="board-tile-image" src="${project?.image || space.image}" alt="" aria-hidden="true" />` : ''}
        ${space.label === 'Monopoly' ? `<span class="board-monopoly-portraits" aria-hidden="true">${['shibagy', 'ada', 'erchai', 'orangie'].map((name) => `<img src="assets/images/monopoly-avatars/${name}.png" alt="" />`).join('')}</span>` : ''}
        ${space.kind === 'about' ? `<img class="board-about-image" src="${space.image}" alt="Shaoyi Wang" />` : ''}
        <span class="board-tile-title">${space.kind === 'start' ? 'START<br>EXPLORE' : (space.kind === 'list' ? title.replace(/^See all /, 'See all<br>').replace('My Notes', 'My<br>Notes') : title)}</span>
        ${space.estimate ? `<span class="board-estimate">${space.estimate}</span>` : ''}
        ${(space.future || space.empty) && !space.estimate ? '<span class="board-placeholder-message">Coming Soon!</span>' : ''}
      </span>`;
    const style = `grid-column:${cell.column};grid-row:${cell.row}`;
    const aria = space.empty ? 'Empty portfolio space' : (space.estimate ? `${title}, ${space.estimate}, Coming soon` : (space.external && space.kind === 'link' ? `${title}, ${space.label}` : title));
    const district = space.group ? districtNames[space.group] : '';
    const spaceKey = project?.id || space.label || `empty-${id}`;

    if (href) {
      const external = space.external ? ' target="_blank" rel="noopener"' : '';
      return `<a class="${classes}" style="${style}" href="${href}" aria-label="${aria}${district ? `, ${district}` : ''}" data-space-key="${spaceKey}" data-project-id="${project?.id || ''}"${previewType ? ` data-preview="${previewType}"` : ''}${external}>${contents}</a>`;
    }
    return `<div class="${classes}" style="${style}" tabindex="0" role="button" data-space-key="${spaceKey}"${previewType ? ` data-preview="${previewType}"` : ''} aria-label="${aria}${district ? `, ${district}` : ''}">${contents}</div>`;
  }

  const recentProjects = projects
    .filter((project) => project.published !== false && (project.id === 'res-3' || Number(project.year) === 2025))
    .sort((a, b) => Number(b.year) - Number(a.year));
  grid.innerHTML = spaces.map(tileMarkup).join('') + `
    <section class="board-center" aria-labelledby="board-recents-heading">
      <div class="board-recents-panel">
        <h1 id="board-recents-heading">Recents</h1>
        <div class="board-recents-scroll" tabindex="0" role="region" aria-label="Recent projects">
          ${recentProjects.map((project) => `<a class="board-recent-item" data-group="${spaces.find((space) => space.project === project.id)?.group || ''}" href="${project.page}?from=home&board=1&project=${project.id}" data-project-id="${project.id}">
            <img src="${project.image}" alt="" loading="lazy" />
            <span><small>${project.category}</small><strong>${shortProjectTitles[project.id]}</strong><span class="board-recent-description">${project.description}</span></span>
          </a>`).join('')}
        </div>
      </div>
      <section class="board-content-panel" hidden aria-label="Page content">
        <div class="board-content-toolbar"><button type="button" class="board-content-back">BACK</button><span class="board-content-title" hidden></span></div>
        <iframe class="board-content-frame" title="Selected page" src="about:blank"></iframe>
      </section>
      <div class="board-center-veil" aria-hidden="true"></div>
    </section>
    ${sectorTabs.map(([slug, name]) => `<div class="board-sector-tab board-sector-tab--${slug}">${name}</div>`).join('')}`;

  const recentsPanel = grid.querySelector('.board-recents-panel');
  const contentPanel = grid.querySelector('.board-content-panel');
  const contentFrame = grid.querySelector('.board-content-frame');
  const contentTitle = grid.querySelector('.board-content-title');
  const contentBack = grid.querySelector('.board-content-back');
  const centerVeil = grid.querySelector('.board-center-veil');
  let panelSequence = 0;
  let loadingPanelSequence = 0;
  const whiteTransitionDelay = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
  const afterPaint = (callback) => requestAnimationFrame(() => requestAnimationFrame(callback));
  async function navigateInBoard(href, title) {
    const sequence = ++panelSequence;
    const destination = new URL(href, location.href);
    destination.searchParams.set('embed', 'board');
    centerVeil.classList.add('is-visible');
    await new Promise((resolve) => setTimeout(resolve, whiteTransitionDelay()));
    if (sequence !== panelSequence) return;
    recentsPanel.hidden = true;
    contentPanel.hidden = false;
    contentTitle.textContent = title || 'Page';
    contentFrame.title = contentTitle.textContent;
    loadingPanelSequence = sequence;
    contentFrame.src = destination.href;
    contentBack.focus({ preventScroll: true });
  }
  function openInBoard(link) {
    navigateInBoard(link.href, link.getAttribute('aria-label') || link.textContent.trim());
  }
  contentFrame.addEventListener('load', () => {
    if (!loadingPanelSequence || contentPanel.hidden) return;
    const sequence = loadingPanelSequence;
    loadingPanelSequence = 0;
    afterPaint(() => {
      if (sequence === panelSequence) centerVeil.classList.remove('is-visible');
    });
  });
  async function showRecents() {
    const sequence = ++panelSequence;
    loadingPanelSequence = 0;
    centerVeil.classList.add('is-visible');
    await new Promise((resolve) => setTimeout(resolve, whiteTransitionDelay()));
    if (sequence !== panelSequence) return;
    contentPanel.hidden = true;
    recentsPanel.hidden = false;
    contentFrame.src = 'about:blank';
    grid.querySelector('.board-recents-scroll').focus({ preventScroll: true });
    afterPaint(() => {
      if (sequence === panelSequence) centerVeil.classList.remove('is-visible');
    });
  }
  contentBack.addEventListener('click', showRecents);
  let fullscreenViewer;
  function openFullscreenImages(payload) {
    if (!Array.isArray(payload.images)) return;
    const images = payload.images.filter((image) => {
      if (typeof image?.src !== 'string') return false;
      try { return ['http:', 'https:', 'file:'].includes(new URL(image.src).protocol); } catch (_) { return false; }
    });
    if (!images.length) return;
    if (!fullscreenViewer) {
      const overlay = document.createElement('div');
      overlay.className = 'lb-overlay board-fullscreen-lightbox';
      overlay.hidden = true;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Image preview');
      overlay.innerHTML = '<div class="lb-box"><img class="lb-img" alt=""><div class="lb-caption"></div></div><button class="lb-close" aria-label="Close image preview">×</button><button class="lb-nav lb-prev" aria-label="Previous image">‹</button><button class="lb-nav lb-next" aria-label="Next image">›</button>';
      document.body.append(overlay);
      let album = [];
      let index = 0;
      let closeTimer;
      let previousOverflow = '';
      const image = overlay.querySelector('.lb-img');
      const caption = overlay.querySelector('.lb-caption');
      const closeButton = overlay.querySelector('.lb-close');
      const previousButton = overlay.querySelector('.lb-prev');
      const nextButton = overlay.querySelector('.lb-next');
      function render() {
        image.src = album[index].src;
        image.alt = album[index].alt || '';
        caption.textContent = album[index].caption || '';
        caption.hidden = !caption.textContent;
        previousButton.hidden = nextButton.hidden = album.length < 2;
      }
      function close() {
        overlay.classList.remove('lb-visible');
        document.body.style.overflow = previousOverflow;
        contentFrame.focus({ preventScroll: true });
        closeTimer = setTimeout(() => { overlay.hidden = true; image.removeAttribute('src'); }, 200);
      }
      function step(direction) {
        index = (index + direction + album.length) % album.length;
        render();
      }
      closeButton.addEventListener('click', close);
      previousButton.addEventListener('click', () => step(-1));
      nextButton.addEventListener('click', () => step(1));
      overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
      document.addEventListener('keydown', (event) => {
        if (overlay.hidden || !overlay.classList.contains('lb-visible')) return;
        if (event.key === 'Escape') { event.preventDefault(); close(); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
        if (event.key === 'Tab') {
          const buttons = [...overlay.querySelectorAll('button')].filter((button) => !button.hidden);
          const position = buttons.indexOf(document.activeElement);
          event.preventDefault();
          buttons[(position + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
        }
      });
      fullscreenViewer = {
        open(items, first) {
          clearTimeout(closeTimer);
          album = items;
          index = Number.isInteger(first) && first >= 0 && first < items.length ? first : 0;
          if (overlay.hidden) previousOverflow = document.body.style.overflow;
          render();
          overlay.hidden = false;
          document.body.style.overflow = 'hidden';
          requestAnimationFrame(() => overlay.classList.add('lb-visible'));
          closeButton.focus({ preventScroll: true });
        },
      };
    }
    fullscreenViewer.open(images, payload.index);
  }
  window.addEventListener('message', (event) => {
    if (event.source !== contentFrame.contentWindow) return;
    if (event.data?.type === 'portfolio-board-lightbox') openFullscreenImages(event.data);
    if (event.data?.type === 'portfolio-board-back') showRecents();
    if (event.data?.type === 'portfolio-board-navigate' && typeof event.data.href === 'string') {
      const destination = new URL(event.data.href, location.href);
      if (destination.origin === location.origin && destination.pathname.startsWith(new URL('./', location.href).pathname)) {
        hidePreview();
        navigateInBoard(destination.href, event.data.title);
      }
    }
    if (event.data?.type === 'portfolio-board-page-ready' && typeof event.data.title === 'string') {
      contentTitle.textContent = event.data.title.replace(/\s+Shaoyi Wang$/, '');
      contentFrame.title = contentTitle.textContent;
    }
  });

  const positionStorageKey = 'shaoyi-portfolio-board-position';
  const boardTiles = [...grid.querySelectorAll('.board-tile')];
  const exploreStorageKey = 'shaoyi-portfolio-board-core-route-v2';
  const exploreTile = boardTiles[0];
  const exploreRoute = ['About', 'mak-1', 'des-7', 'des-4', 'des-1', 'res-3', 'app-1'];
  let exploreStep = 0;
  let hasExploreState = false;
  try {
    const savedValue = sessionStorage.getItem(exploreStorageKey);
    const savedStep = Number(savedValue);
    if (savedValue !== null && Number.isInteger(savedStep) && savedStep >= 0 && savedStep <= exploreRoute.length) {
      exploreStep = savedStep;
      hasExploreState = true;
    }
  } catch (_) { /* Use in-memory state. */ }
  function nextExploreTile() {
    if (exploreStep >= exploreRoute.length) return exploreTile;
    const key = exploreRoute[exploreStep];
    return boardTiles.find((tile) => tile.dataset.projectId === key || tile.dataset.spaceKey === key) || exploreTile;
  }
  function updateExploreTile() {
    exploreTile.querySelector('.board-tile-title').innerHTML = exploreStep ? 'CONTINUE<br>EXPLORE' : 'START<br>EXPLORE';
    exploreTile.setAttribute('aria-label', exploreStep ? 'CONTINUE EXPLORE' : 'START EXPLORE');
    const next = nextExploreTile();
    exploreTile.href = next === exploreTile ? '#board-recents-heading' : next.href;
  }
  const piece = document.createElement('span');
  piece.className = 'board-piece';
  piece.setAttribute('aria-hidden', 'true');
  let lastPosition = 'START EXPLORE';
  let opening = false;
  let openingTimer;
  let landingAnimation;
  let moveSequence = 0;
  function placePiece(tile, remember = true) {
    boardTiles.forEach((space) => space.classList.remove('has-piece'));
    tile.classList.add('has-piece');
    tile.append(piece);
    lastPosition = tile.dataset.spaceKey;
    updateExploreTile();
    if (remember) {
      try { sessionStorage.setItem(positionStorageKey, lastPosition); } catch (_) { /* Keep the position in memory if storage is unavailable. */ }
    }
  }
  function restorePiece() {
    clearTimeout(openingTimer);
    moveSequence += 1;
    landingAnimation?.cancel();
    opening = false;
    boardTiles.forEach((tile) => tile.classList.remove('is-opening', 'is-landing'));
    try { lastPosition = sessionStorage.getItem(positionStorageKey) || lastPosition; } catch (_) { /* Use the in-memory position. */ }
    // An older, unguided position must not hide the initial piece on another tile.
    if (!hasExploreState) {
      lastPosition = exploreTile.dataset.spaceKey;
      hasExploreState = true;
      try {
        sessionStorage.setItem(exploreStorageKey, String(exploreStep));
        sessionStorage.setItem(positionStorageKey, lastPosition);
      } catch (_) { /* Use in-memory state. */ }
    }
    placePiece(boardTiles.find((tile) => tile.dataset.spaceKey === lastPosition) || boardTiles[0], false);
  }
  restorePiece();
  window.addEventListener('pageshow', restorePiece);

  grid.addEventListener('click', (event) => {
    if (event.button !== 0) return;
    const recent = event.target.closest('a.board-recent-item');
    const clickedTile = event.target.closest('.board-tile');
    const tile = (clickedTile?.classList.contains('board-tile--start')
      ? nextExploreTile()
      : clickedTile) ||
      (recent && boardTiles.find((space) => space.dataset.projectId === recent.dataset.projectId));
    if (!tile) return;
    if (tile.matches('.board-tile--future, .board-tile--empty')) {
      event.preventDefault();
      return;
    }
    if (opening) { event.preventDefault(); return; }
    if (clickedTile === exploreTile) {
      exploreStep = tile === exploreTile ? 0 : exploreStep + 1;
      try { sessionStorage.setItem(exploreStorageKey, String(exploreStep)); } catch (_) { /* Use in-memory state. */ }
    }
    placePiece(tile);
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = recent || (tile !== exploreTile && tile.matches('a') ? tile : null);
    event.preventDefault();
    hidePreview();
    opening = true;
    const sequence = ++moveSequence;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      if (sequence !== moveSequence) return;
      if (tile === exploreTile) showRecents();
      if (link) {
        if (link.target === '_blank') {
          const newTab = window.open(link.href, '_blank');
          if (newTab) newTab.opener = null;
          else window.location.assign(link.href);
        } else {
          openInBoard(link);
        }
      }
      tile.classList.remove('is-opening', 'is-landing');
      opening = false;
    };
    if (reduceMotion) {
      openingTimer = setTimeout(finish, 0);
      return;
    }
    tile.classList.add('is-landing');
    landingAnimation = piece.animate([
      { offset: 0, opacity: 0, transform: 'translateY(-48px) scale(.8)' },
      { offset: .12, opacity: 1, transform: 'translateY(-34px) scale(1)' },
      { offset: .36, opacity: 1, transform: 'translateY(0) scale(1.22,.78)' },
      { offset: .54, opacity: 1, transform: 'translateY(-17px) scale(.94,1.06)' },
      { offset: .68, opacity: 1, transform: 'translateY(0) scale(1.1,.9)' },
      { offset: .81, opacity: 1, transform: 'translateY(-6px) scale(.98,1.02)' },
      { offset: .92, opacity: 1, transform: 'translateY(0) scale(1.04,.96)' },
      { offset: 1, opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration: 900, easing: 'linear', fill: 'none' });
    landingAnimation.finished.then(() => {
      if (sequence !== moveSequence) return;
      // Open the central page once the piece has landed and settled.
      openingTimer = setTimeout(finish, 120);
    }).catch(() => { /* Restoring the board cancels an unfinished drop. */ });
  });
  grid.addEventListener('keydown', (event) => {
    const tile = event.target.closest('.board-tile[role="button"]');
    if (tile && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      tile.click();
    }
  });


  // Show titles in the tiles, keeping board and Recents highlights in sync.
  let hoveredProject = '';
  let focusedProject = '';
  const projectLinks = [...grid.querySelectorAll('[data-project-id]')]
    .filter((link) => link.dataset.projectId);
  function updateHighlight() {
    projectLinks.forEach((link) => link.classList.toggle('is-highlighted',
      link.dataset.projectId === (hoveredProject || focusedProject)));
  }
  function hidePreview() {
    hoveredProject = '';
    focusedProject = '';
    updateHighlight();
  }
  projectLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => { hoveredProject = link.dataset.projectId; updateHighlight(); });
    link.addEventListener('pointerleave', () => { hoveredProject = ''; updateHighlight(); });
    link.addEventListener('focus', () => { focusedProject = link.dataset.projectId; updateHighlight(); });
    link.addEventListener('blur', () => { focusedProject = ''; updateHighlight(); });
  });

  function socialLogo(label) {
    const paths = {
      LinkedIn: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
      GitHub: 'M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z',
    };
    return paths[label] ? `<svg class="board-social-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${paths[label]}" /></svg>` : '';
  }
})();
