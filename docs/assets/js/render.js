(() => {
  const { $, $$, escapeHtml, initialWorkCount } = window.PortfolioCore;

  const state = {
    portfolio: null,
    showAll: false
  };

  const hydrateCreator = () => {
    const { creator } = state.portfolio;
    document.title = `${creator.name} | UGC Creator`;

    $$(".brand__text, [data-creator-name]").forEach((node) => {
      node.textContent = creator.name;
    });

    const heroLead = $('[data-render="hero-lead"]');
    if (heroLead) heroLead.textContent = creator.lead;

    const contactCopy = $('[data-render="contact-copy"]');
    if (contactCopy) contactCopy.textContent = creator.contactCopy;

    const form = $('[data-contact-form]');
    if (form) form.action = `mailto:${creator.email}`;

    $$("[data-email-link]").forEach((link) => {
      link.href = `mailto:${creator.email}`;
      if (link.textContent.includes("@")) link.textContent = creator.email;
    });

    const instagram = $("[data-instagram-link]");
    if (instagram) instagram.href = creator.instagram;

    const tiktok = $("[data-tiktok-link]");
    if (tiktok) tiktok.href = creator.tiktok || creator.instagram;
  };

  const renderHeroContact = () => {
    const target = $('[data-render="hero-contact"]');
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
      <a class="contact-link" href="${escapeHtml(item.href)}"${item.external ? ' target="_blank" rel="noopener"' : ""}>
        ${iconMarkup(item.icon, "contact-link__icon")}
        <span>
          <span class="contact-link__label">${escapeHtml(item.label)}</span>
          <span class="contact-link__value">${escapeHtml(item.value)}</span>
        </span>
      </a>
    `).join("");
  };

  const renderHeroFeature = () => {
    const target = $('[data-render="hero-feature"]');
    if (!target) return;

    target.innerHTML = `
      <figure class="hero-feature" aria-label="Creator photo in phone frame">
        <img src="assets/images/hero.jpeg" alt="" loading="eager">
      </figure>
    `;
  };

  const renderWork = () => {
    const target = $('[data-render="work-grid"]');
    if (!target) return;

    const count = initialWorkCount();
    const videos = state.showAll ? state.portfolio.videos : state.portfolio.videos.slice(0, count);

    target.innerHTML = videos.map((item) => `
      <article class="video-card" data-ix="scale-in">
        <button class="phone-frame" type="button" aria-label="Play ${escapeHtml(item.title)}" aria-pressed="false" data-video-card>
          <video src="${escapeHtml(item.video)}" poster="${escapeHtml(item.poster)}" preload="metadata" playsinline loop muted></video>
          <span class="video-card__play" aria-hidden="true"></span>
        </button>
        <div class="video-card__body">
          <p class="video-card__eyebrow">${escapeHtml(item.brand)}</p>
          <h3>${escapeHtml(item.category)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${item.sourceUrl ? `<a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">Source portfolio</a>` : ""}
        </div>
      </article>
    `).join("");

    window.PortfolioReveal?.observe(target);
    window.PortfolioVideo?.bind(target);

    const more = $('[data-action="toggle-work"]');
    if (!more) return;

    more.hidden = state.portfolio.videos.length <= count;
    more.textContent = state.showAll ? "Show Less" : "See More Work";
    more.onclick = () => {
      state.showAll = !state.showAll;
      renderWork();
    };
  };

  const renderServices = () => {
    const target = $('[data-render="services"]');
    if (!target) return;

    target.innerHTML = state.portfolio.services.map((service, index) => `
      <article class="icon-card" data-ix="scale-in">
        ${iconMarkup(serviceIconName(index), "icon-card__icon")}
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.body)}</p>
      </article>
    `).join("");
  };

  const renderProcess = () => {
    const target = $('[data-render="process"]');
    if (!target) return;

    target.innerHTML = state.portfolio.process.map((step, index) => `
      <li class="process-step" data-ix="fade-up-soft">
        ${iconMarkup(processIconName(index), "process-step__icon", {
          badge: String(index + 1).padStart(2, "0")
        })}
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.body)}</p>
      </li>
    `).join("");
  };

  const bindResponsiveWork = () => {
    const refresh = () => {
      if (!state.portfolio || state.showAll) return;
      renderWork();
    };

    if (typeof window.PortfolioCore.compactWorkQuery.addEventListener === "function") {
      window.PortfolioCore.compactWorkQuery.addEventListener("change", refresh);
      return;
    }

    window.PortfolioCore.compactWorkQuery.addListener(refresh);
  };

  const renderAll = (portfolio) => {
    state.portfolio = portfolio;
    hydrateCreator();
    renderHeroFeature();
    renderHeroContact();
    renderWork();
    renderServices();
    renderProcess();
    bindResponsiveWork();
  };

  const iconMarkup = (name, className, options = {}) => `
    <span class="${className}" aria-hidden="true">
      ${options.badge ? `<span class="process-step__number">${escapeHtml(options.badge)}</span>` : ""}
      <svg class="portfolio-icon" viewBox="0 0 24 24">
        <use href="assets/icons/portfolio-icons.svg#icon-${name}"></use>
      </svg>
    </span>
  `;

  const serviceIconName = (index) => (
    ["smartphone", "package-open", "leaf", "mic", "message-circle-heart"][index % 5]
  );

  const processIconName = (index) => (
    ["mail", "messages-square", "camera", "send"][index % 4]
  );

  const instagramHandleFromUrl = (url) => {
    try {
      const path = new URL(url).pathname.replaceAll("/", "");
      return path ? `@${path}` : "@heyhillandhazel";
    } catch {
      return "@heyhillandhazel";
    }
  };

  window.PortfolioRender = {
    renderAll,
    renderWork
  };
})();
