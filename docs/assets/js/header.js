(() => {
  const init = () => {
    const header = document.querySelector("[data-header]");
    const menu = document.querySelector("[data-nav-menu]");
    if (!header) return;

    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    menu?.addEventListener("click", (event) => {
      if (event.target.closest("a")) update();
    });
  };

  window.InfluencerHeader = { init };
})();
