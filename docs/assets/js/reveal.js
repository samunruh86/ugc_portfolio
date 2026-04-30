(() => {
  const { $$ } = window.PortfolioCore;
  let observer = null;

  const applyVariant = (target) => {
    const variants = String(target.dataset.ix || "").split(/\s+/);
    if (variants.includes("fade-up-soft")) target.classList.add("reveal-soft");
    if (variants.includes("fade-in")) target.classList.add("reveal-fade");
    if (variants.includes("scale-in")) target.classList.add("reveal-card");
  };

  const assignDelay = (target, delay) => {
    if (!Number.isFinite(delay) || delay <= 0) return;
    target.style.transitionDelay = `${delay}ms`;
    target.dataset.revealDelay = String(delay);
  };

  const revealNow = (target) => {
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
  };

  const applyStaggerDelays = (scope = document) => {
    $$("[data-ix-stagger]", scope).forEach((container) => {
      const children = $$("[data-ix]", container);
      const step = parseInt(container.dataset.ixStaggerStep || "60", 10);

      children.forEach((child, index) => {
        const baseDelay = parseInt(child.dataset.ixDelay || "0", 10);
        assignDelay(child, baseDelay + Math.min(index * step, 420));
      });
    });
  };

  const observe = (scope = document) => {
    const targets = $$("[data-ix]", scope).filter((target) => target.dataset.ixBound !== "1");
    if (!targets.length) return;

    applyStaggerDelays(scope);

    targets.forEach((target) => {
      target.dataset.ixBound = "1";
      applyVariant(target);

      const baseDelay = parseInt(target.dataset.ixDelay || "0", 10);
      if (baseDelay > 0) assignDelay(target, baseDelay);

      target.classList.add("reveal-ready");

      if (target.hasAttribute("data-ix-load") || !("IntersectionObserver" in window) || !observer) {
        revealNow(target);
        return;
      }

      observer.observe(target);
    });
  };

  const init = () => {
    if (!("IntersectionObserver" in window)) {
      observe();
      return;
    }

    observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealNow(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -12% 0px" });

    observe();
  };

  window.PortfolioReveal = { init, observe };
})();
