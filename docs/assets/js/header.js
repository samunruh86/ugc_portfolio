(() => {
  const init = () => {
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");
    if (!header) return;

    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    const close = () => {
      header.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    toggle?.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu?.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
  };

  window.InfluencerHeader = { init };
})();
