(() => {
  const init = () => {
    const triggers = document.querySelectorAll("[data-dropdown-trigger]");

    const closeAll = (except) => {
      document.querySelectorAll("[data-dropdown].is-open").forEach((dropdown) => {
        if (dropdown !== except) dropdown.classList.remove("is-open");
      });
    };

    triggers.forEach((trigger) => {
      const dropdown = trigger.parentElement?.querySelector("[data-dropdown]");
      if (!dropdown) return;

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        closeAll(dropdown);
        dropdown.classList.toggle("is-open");
      });
    });

    document.addEventListener("click", () => closeAll());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAll();
    });
  };

  window.InfluencerDropdown = { init };
})();
