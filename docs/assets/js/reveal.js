(() => {
  const init = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staticCapture = document.documentElement.dataset.captureStatic === "true";
    const explicitTargets = Array.from(document.querySelectorAll("[data-ix]"));
    const staggerTargets = Array.from(document.querySelectorAll("[data-ix-stagger] > *"));
    const targets = Array.from(new Set([...explicitTargets, ...staggerTargets]));
    if (!targets.length) return;

    const variantMap = {
      "fade-up": "reveal-soft",
      "fade-up-soft": "reveal-soft",
      "fade-in": "reveal-fade",
      "scale-in": "reveal-card",
    };

    const applyVariant = (node) => {
      const tokens = String(node.dataset.ix || "fade-up").trim().split(/\s+/);
      const variant = tokens.map((token) => variantMap[token]).find(Boolean) || "reveal-soft";
      node.classList.add(variant);
    };

    const assignDelay = (node, delayMs) => {
      if (!Number.isFinite(delayMs) || delayMs <= 0) return;
      node.style.transitionDelay = `${delayMs}ms`;
      node.dataset.revealDelay = String(delayMs);
    };

    const revealed = new WeakSet();

    const revealNow = (node) => {
      if (revealed.has(node)) return;
      revealed.add(node);
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          node.classList.add("reveal-in");
          node.classList.remove("reveal-ready");
          const delay = parseInt(node.dataset.revealDelay || "0", 10);
          if (delay > 0) {
            window.setTimeout(() => {
              node.style.transitionDelay = "";
              delete node.dataset.revealDelay;
            }, delay + 100);
          }
        }, 16);
      });
    };

    targets.forEach((node) => {
      applyVariant(node);
      node.classList.add("reveal-ready");
      const baseDelay = parseInt(node.dataset.ixDelay || "0", 10);
      assignDelay(node, baseDelay);
    });

    document.querySelectorAll("[data-ix-stagger]").forEach((container) => {
      const children = Array.from(container.children).filter((node) => targets.includes(node));
      const step = parseInt(container.dataset.ixStaggerStep || "70", 10) || 70;
      children.forEach((node, index) => {
        const baseDelay = parseInt(node.dataset.ixDelay || "0", 10);
        assignDelay(node, baseDelay + Math.min(index * step, 520));
      });
    });

    if (reduceMotion || staticCapture) {
      targets.forEach((node) => revealNow(node));
      return;
    }

    const loadTargets = targets.filter((node) => node.hasAttribute("data-ix-load"));
    loadTargets.forEach((node) => revealNow(node));

    const observedTargets = targets.filter((node) => !node.hasAttribute("data-ix-load"));
    if (!("IntersectionObserver" in window)) {
      observedTargets.forEach((node) => revealNow(node));
      return;
    }

    window.setTimeout(() => {
      observedTargets.forEach((node) => revealNow(node));
    }, 900);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealNow(entry.target);
            obs.unobserve(entry.target);
          });
        }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

        observedTargets.forEach((node) => observer.observe(node));
      });
    });
  };

  window.InfluencerReveal = { init };
})();
