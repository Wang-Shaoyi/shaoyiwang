// ============================================================
// MAIN — runs on every page
// ============================================================

// ----- Mobile nav toggle -----
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// ----- Active nav link -----
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a").forEach((link) => {
  const href = link.getAttribute("href").split("/").pop();
  if (href === currentPath) link.classList.add("active");
});

// ============================================================
// MODAL
// ============================================================
function createModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-img"><img src="" alt="" /></div>
      <div class="modal-content">
        <div class="modal-meta">
          <span class="modal-category"></span>
        </div>
        <h2 class="modal-title"></h2>
        <p class="modal-desc"></p>
        <div class="modal-tags card-tags"></div>
        <div class="modal-actions"></div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  return overlay;
}

let modalOverlay = null;

function openModal(project) {
  if (!modalOverlay) modalOverlay = createModal();

  const imgPath = window.location.pathname.includes("/pages/")
    ? "../" + project.image
    : project.image;

  modalOverlay.querySelector(".modal-img img").src = imgPath;
  modalOverlay.querySelector(".modal-img img").alt = project.title;
  modalOverlay.querySelector(".modal-category").textContent = project.category;
  modalOverlay.querySelector(".modal-title").textContent = project.title;
  modalOverlay.querySelector(".modal-desc").textContent = project.description;

  const tagsEl = modalOverlay.querySelector(".modal-tags");
  tagsEl.innerHTML = project.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const actionsEl = modalOverlay.querySelector(".modal-actions");
  actionsEl.innerHTML = project.link && project.link !== "#"
    ? `<a class="btn" href="${project.link}" target="_blank" rel="noopener">View Project</a>`
    : `<span class="btn btn-outline" style="opacity:0.5;cursor:default;">Coming Soon</span>`;

  requestAnimationFrame(() => modalOverlay.classList.add("open"));
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ============================================================
// CARD RENDERER
// ============================================================
function renderCards(projects, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted)">No projects yet — check back soon!</p>`;
    return;
  }

  grid.innerHTML = projects
    .map(
      (p) => `
    <article class="card" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
      <div class="card-thumb">
        <img src="${resolveImagePath(p.image)}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-tags">
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    </article>`
    )
    .join("");

  grid.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    const project = PROJECTS.find((p) => p.id === id);
    card.addEventListener("click", () => openModal(project));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(project);
    });
  });
}

function resolveImagePath(imgPath) {
  return window.location.pathname.includes("/pages/")
    ? "../" + imgPath
    : imgPath;
}

// ============================================================
// HOME — featured projects
// ============================================================
if (document.getElementById("project-grid")) {
  const featured = PROJECTS.filter((p) => p.featured);
  renderCards(featured, "project-grid");
}

// ============================================================
// CATEGORY PAGES — filter by slug from <body data-category>
// ============================================================
const categorySlug = document.body.dataset.category;
if (categorySlug && document.getElementById("category-grid")) {
  const filtered = PROJECTS.filter((p) => p.categorySlug === categorySlug);
  renderCards(filtered, "category-grid");
}
