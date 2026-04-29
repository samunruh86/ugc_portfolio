const DATA_PATH = "assets/data/portfolio.json";

const state = {
  portfolio: null,
  activeFilter: "All",
  showAll: false
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
let ixObserver = null;

async function init() {
  const response = await fetch(DATA_PATH);
  state.portfolio = await response.json();
  hydrateCreator();
  renderHeroReels();
  renderFilters();
  renderWork();
  renderBrands();
  renderServices();
  renderProcess();
  bindModal();
  bindHeader();
  bindInteractions();
}

function hydrateCreator() {
  const { creator } = state.portfolio;
  document.title = `${creator.name} | UGC Portfolio`;
  $$(".brand__text, [data-creator-name]").forEach((el) => {
    el.textContent = creator.name;
  });
  $("[data-hero-lead]").textContent = creator.lead;
  $("[data-contact-copy]").textContent = creator.contactCopy;
  const form = $("[data-contact-form]");
  if (form) form.action = `mailto:${creator.email}`;
  $$("[data-email-link]").forEach((link) => {
    link.href = `mailto:${creator.email}`;
    if (link.textContent.includes("@")) link.textContent = creator.email;
  });
  const instagram = $("[data-instagram-link]");
  instagram.href = creator.instagram;
}

function renderHeroReels() {
  const target = $("[data-hero-reels]");
  const featured = state.portfolio.videos.slice(0, 3);
  target.innerHTML = `
    <p class="hero-reels__label">Selected clips</p>
    <button class="rail-arrow" type="button" aria-label="Previous featured video">⌃</button>
    ${featured.map((item, index) => `
      <button class="mini-reel mini-reel--${index + 1}" type="button" data-video-index="${index}" aria-label="Play ${escapeHtml(item.title)}">
        <img src="${item.poster}" alt="" loading="lazy">
        <span class="reel-play" aria-hidden="true"></span>
      </button>
    `).join("")}
    <button class="rail-arrow" type="button" aria-label="Next featured video">⌄</button>
  `;
}

function renderFilters() {
  const categories = [...new Set(state.portfolio.videos.map((item) => item.category))];
  const filters = ["All Work", ...categories];
  const target = $("[data-filters]");
  target.innerHTML = filters.map((filter) => `
    <button class="filter ${filter === state.activeFilter || (filter === "All Work" && state.activeFilter === "All") ? "is-active" : ""}" type="button" data-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>
  `).join("");
  target.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.activeFilter = button.dataset.filter === "All Work" ? "All" : button.dataset.filter;
    state.showAll = false;
    renderFilters();
    renderWork();
  }, { once: true });
}

function renderWork() {
  const filtered = state.activeFilter === "All"
    ? state.portfolio.videos
    : state.portfolio.videos.filter((item) => item.category === state.activeFilter);
  const videos = state.showAll ? filtered : filtered.slice(0, 6);

  $("[data-work-grid]").innerHTML = videos.map((item) => {
    const index = state.portfolio.videos.indexOf(item);
    return `
      <article class="work-card" data-ix="scale-in">
        <button class="phone-frame" type="button" data-video-index="${index}" aria-label="Play ${escapeHtml(item.title)}">
          <img src="${item.poster}" alt="${escapeHtml(item.title)} video poster" loading="lazy">
          <span class="play-dot" aria-hidden="true"></span>
        </button>
        <div class="work-card__body">
          <p class="work-card__meta">${escapeHtml(item.brand)} / ${escapeHtml(item.category)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">Source portfolio</a>
        </div>
      </article>
    `;
  }).join("");
  if (ixObserver || !("IntersectionObserver" in window)) {
    observeIxTargets($("[data-work-grid]"));
  }
  const more = $("[data-view-more]");
  if (more) {
    more.hidden = filtered.length <= 6;
    more.textContent = state.showAll ? "Show Less" : "View More Work";
    more.onclick = () => {
      state.showAll = !state.showAll;
      renderWork();
    };
  }
}

function renderBrands() {
  $("[data-brand-strip]").innerHTML = state.portfolio.brands.map((brand) => `
    <span class="brand-pill" data-ix="fade-in">${escapeHtml(brand)}</span>
  `).join("");
}

function renderServices() {
  $("[data-services]").innerHTML = state.portfolio.services.map((service, index) => `
    <article class="service-card" data-ix="scale-in">
      ${serviceIcon(index)}
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.body)}</p>
    </article>
  `).join("");
}

function renderProcess() {
  $("[data-process]").innerHTML = state.portfolio.process.map((step, index) => `
    <li data-ix="fade-up-soft">
      <span>${index + 1}</span>
      ${processIcon(index)}
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.body)}</p>
    </li>
  `).join("");
}

function bindInteractions() {
  if (!("IntersectionObserver" in window)) {
    observeIxTargets();
    return;
  }

  ixObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealNow(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -12% 0px" });

  observeIxTargets();
}

function observeIxTargets(scope = document) {
  const targets = $$("[data-ix]", scope).filter((target) => !target.dataset.ixBound);
  if (!targets.length) return;

  applyStaggerDelays(scope);

  targets.forEach((target) => {
    target.dataset.ixBound = "true";
    applyIxVariant(target);

    const baseDelay = parseInt(target.dataset.ixDelay || "0", 10);
    if (baseDelay > 0) assignDelay(target, baseDelay);

    target.classList.add("reveal-ready");

    if (target.hasAttribute("data-ix-load") || !("IntersectionObserver" in window) || !ixObserver) {
      revealNow(target);
      return;
    }

    ixObserver.observe(target);
  });
}

function applyStaggerDelays(scope = document) {
  $$("[data-ix-stagger]", scope).forEach((container) => {
    const children = $$("[data-ix]", container);
    const step = parseInt(container.dataset.ixStaggerStep || "60", 10);

    children.forEach((child, index) => {
      const baseDelay = parseInt(child.dataset.ixDelay || "0", 10);
      assignDelay(child, baseDelay + Math.min(index * step, 420));
    });
  });
}

function applyIxVariant(target) {
  const variants = String(target.dataset.ix || "").split(/\s+/);
  if (variants.includes("fade-up-soft")) target.classList.add("reveal-soft");
  if (variants.includes("fade-in")) target.classList.add("reveal-fade");
  if (variants.includes("scale-in")) target.classList.add("reveal-card");
}

function assignDelay(target, delay) {
  if (!Number.isFinite(delay) || delay <= 0) return;
  target.style.transitionDelay = `${delay}ms`;
  target.dataset.revealDelay = String(delay);
}

function revealNow(target) {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      target.classList.add("reveal-in");
      target.classList.remove("reveal-ready");
      const delay = parseInt(target.dataset.revealDelay || "0", 10);
      if (delay > 0) {
        window.setTimeout(() => {
          target.style.transitionDelay = "";
          delete target.dataset.revealDelay;
        }, delay + 100);
      }
    }, 16);
  });
}

function serviceIcon(index) {
  const icons = [
    '<svg viewBox="0 0 24 24"><path d="M6.5 7.5h11l1.5 12h-14l1.5-12Z"/><path d="M9 7.5v-1a3 3 0 0 1 6 0v1"/><path d="M9 12h6"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M8 4h8v16H8z"/><path d="M11 8h2"/><path d="m5 10-3 2 3 2"/><path d="m19 10 3 2-3 2"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 14h11a4 4 0 0 0 0-8H4v8Z"/><path d="M6 14c1 4 10 4 11 0"/><path d="M8 4c1-2 5-2 6 0"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M8 9v6"/><path d="M16 9v6"/><path d="M5 11v2"/><path d="M19 11v2"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v8Z" transform="translate(1 0) scale(.9)"/></svg>'
  ];
  return `<div class="service-icon" aria-hidden="true">${icons[index % icons.length]}</div>`;
}

function processIcon(index) {
  const icons = [
    '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 12a8 7 0 0 1 8-7 8 7 0 0 1 8 7 8 7 0 0 1-8 7c-1.4 0-2.7-.2-3.8-.8L4 20l1.5-4A6 6 0 0 1 4 12Z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 8h16v12H4z"/><path d="m8 8 2-4h4l2 4"/><circle cx="12" cy="14" r="3"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M7 18H6a4 4 0 0 1 0-8 6 6 0 0 1 11.7-1 4.5 4.5 0 0 1-.7 9h-1"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 21S4 16 4 9.5C4 5 9.5 4 12 8c2.5-4 8-3 8 1.5C20 16 12 21 12 21Z"/></svg>'
  ];
  return `<div class="process-icon" aria-hidden="true">${icons[index % icons.length]}</div>`;
}

function bindModal() {
  const modal = $("[data-modal]");
  const video = $("[data-modal-video]");
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-video-index]");
    if (!trigger) return;
    const item = state.portfolio.videos[Number(trigger.dataset.videoIndex)];
    video.src = item.video;
    video.poster = item.poster;
    modal.hidden = false;
    document.body.classList.add("has-modal");
    video.play().catch(() => {});
  });
  $("[data-modal-close]").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  function closeModal() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    modal.hidden = true;
    document.body.classList.remove("has-modal");
  }
}

function bindHeader() {
  const header = $("[data-header]");
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", `<p class="load-error">Portfolio content could not load.</p>`);
});
