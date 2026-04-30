const DATA_PATH = "assets/data/portfolio.json";

const state = {
  portfolio: null,
  showAll: false
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const compactWorkQuery = window.matchMedia("(max-width: 560px)");
let ixObserver = null;

async function init() {
  const response = await fetch(DATA_PATH, { cache: "no-cache" });
  state.portfolio = await response.json();
  hydrateCreator();
  renderHeroFeature();
  renderHeroContact();
  renderWork();
  renderServices();
  renderProcess();
  bindHeader();
  bindInteractions();
  bindResponsiveWork();
}

function hydrateCreator() {
  const { creator } = state.portfolio;
  document.title = `${creator.name} | UGC Creator`;
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
  if (instagram) instagram.href = creator.instagram;
  const tiktok = $("[data-tiktok-link]");
  if (tiktok) tiktok.href = creator.tiktok || creator.instagram;
}

function renderHeroContact() {
  const target = $("[data-hero-contact]");
  if (!target) return;
  const { creator } = state.portfolio;
  const links = [
    {
      label: "Email",
      value: creator.email,
      href: `mailto:${creator.email}`,
      icon: "email-brix",
      external: false
    },
    {
      label: "TikTok",
      value: creator.tiktokHandle || "@heyhillandhazel",
      href: creator.tiktok || "https://www.tiktok.com/@heyhillandhazel",
      icon: "tiktok-brix",
      external: true
    },
    {
      label: "Instagram",
      value: creator.instagramHandle || instagramHandleFromUrl(creator.instagram),
      href: creator.instagram,
      icon: "instagram-brix",
      external: true
    }
  ];

  target.innerHTML = links.map((item) => `
    <a class="hero-contact-row" href="${escapeHtml(item.href)}"${item.external ? ' target="_blank" rel="noopener"' : ""}>
      ${iconMarkup(item.icon, "hero-contact-icon")}
      <span>
        <span class="hero-contact-row__label">${escapeHtml(item.label)}</span>
        <span class="hero-contact-row__value">${escapeHtml(item.value)}</span>
      </span>
    </a>
  `).join("");
}

function renderHeroFeature() {
  const target = $("[data-hero-feature]");
  if (!target) return;
  const heroImage = "assets/images/hero.jpeg";

  target.innerHTML = `
    <figure class="hero-feature hero-feature--photo" aria-label="Creator photo in phone frame">
      <img src="${escapeHtml(heroImage)}" alt="" loading="eager">
    </figure>
  `;
}

function renderWork() {
  const initialCount = getInitialWorkCount();
  const videos = state.showAll ? state.portfolio.videos : state.portfolio.videos.slice(0, initialCount);

  $("[data-work-grid]").innerHTML = videos.map((item) => {
    return `
      <article class="work-card" data-ix="scale-in">
        <button class="phone-frame" type="button" aria-label="Play ${escapeHtml(item.title)}" aria-pressed="false">
          <video src="${escapeHtml(item.video)}" poster="${escapeHtml(item.poster)}" preload="metadata" playsinline loop muted></video>
          <span class="play-dot" aria-hidden="true"></span>
        </button>
        <div class="work-card__body">
          <p class="work-card__meta">${escapeHtml(item.brand)}</p>
          <h3>${escapeHtml(item.category)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${item.sourceUrl ? `<a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">Source portfolio</a>` : ""}
        </div>
      </article>
    `;
  }).join("");
  if (ixObserver || !("IntersectionObserver" in window)) {
    observeIxTargets($("[data-work-grid]"));
  }
  bindWorkVideoInteractions();
  const more = $("[data-view-more]");
  if (more) {
    more.hidden = state.portfolio.videos.length <= initialCount;
    more.textContent = state.showAll ? "Show Less" : "See More Work";
    more.onclick = () => {
      state.showAll = !state.showAll;
      renderWork();
    };
  }
}

function getInitialWorkCount() {
  return compactWorkQuery.matches ? 3 : 6;
}

function bindResponsiveWork() {
  const refresh = () => {
    if (!state.portfolio || state.showAll) return;
    renderWork();
  };

  if (typeof compactWorkQuery.addEventListener === "function") {
    compactWorkQuery.addEventListener("change", refresh);
    return;
  }

  compactWorkQuery.addListener(refresh);
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

function bindWorkVideoInteractions() {
  const frames = $$("[data-work-grid] .phone-frame");

  frames.forEach((frame) => {
    const video = $("video", frame);
    if (!video) return;

    frame.addEventListener("mouseenter", () => {
      if (frame.classList.contains("is-playing")) return;
      video.muted = true;
      frame.classList.add("is-previewing");
      video.play().catch(() => {
        frame.classList.remove("is-previewing");
      });
    });

    frame.addEventListener("mouseleave", () => {
      if (frame.classList.contains("is-playing")) return;
      stopInlineVideo(frame, { reset: true });
    });

    frame.addEventListener("click", () => {
      if (frame.classList.contains("is-playing")) {
        stopInlineVideo(frame, { reset: true });
        return;
      }

      frames.forEach((otherFrame) => {
        if (otherFrame !== frame) stopInlineVideo(otherFrame, { reset: true });
      });

      video.muted = false;
      video.volume = 1;
      frame.classList.remove("is-previewing");
      frame.classList.add("is-playing");
      frame.setAttribute("aria-pressed", "true");
      video.play().catch(() => {
        video.muted = true;
        frame.classList.add("is-previewing");
      });
    });
  });
}

function stopInlineVideo(frame, options = {}) {
  const video = $("video", frame);
  if (!video) return;
  video.pause();
  video.muted = true;
  if (options.reset) video.currentTime = 0;
  frame.classList.remove("is-previewing", "is-playing");
  frame.setAttribute("aria-pressed", "false");
}

function renderProcess() {
  $("[data-process]").innerHTML = state.portfolio.process.map((step, index) => `
    <li data-ix="fade-up-soft">
      ${processIcon(index, index + 1)}
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
  const icons = ["smartphone", "package-open", "leaf", "mic", "message-circle-heart"];
  return iconMarkup(icons[index % icons.length], "service-icon");
}

function processIcon(index, number) {
  const icons = ["mail", "messages-square", "camera", "send"];
  return iconMarkup(icons[index % icons.length], "process-icon", {
    badge: String(number).padStart(2, "0")
  });
}

function iconMarkup(name, className, options = {}) {
  return `
    <div class="${className}" aria-hidden="true">
      ${options.badge ? `<span class="process-number">${escapeHtml(options.badge)}</span>` : ""}
      <svg class="portfolio-icon" viewBox="0 0 24 24">
        <use href="assets/icons/portfolio-icons.svg#icon-${name}"></use>
      </svg>
    </div>
  `;
}

function instagramHandleFromUrl(url) {
  try {
    const path = new URL(url).pathname.replaceAll("/", "");
    return path ? `@${path}` : "@heyhillandhazel";
  } catch {
    return "@heyhillandhazel";
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
