(() => {
  const COUNT_DURATION_MS = 1200;
  const COUNT_STAGGER_MS = 180;

  const isStaticCapture = () => document.documentElement.dataset.captureStatic === "true";

  const formatCountValue = (value, decimals) => (
    Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  const startCount = (target, index = 0) => {
    if (!(target instanceof Element)) return;
    const numberNode = target.matches(".proof-stat-number")
      ? target
      : target.querySelector(".proof-stat-number");
    if (!(numberNode instanceof Element)) return;
    if (numberNode.dataset.countRan === "true") return;

    const targetValue = Number(numberNode.getAttribute("data-count-target"));
    if (!Number.isFinite(targetValue)) {
      numberNode.dataset.countRan = "true";
      return;
    }

    const decimals = Math.max(0, Number.parseInt(numberNode.getAttribute("data-count-decimals") || "0", 10) || 0);
    const listIndex = Math.max(0, Number.parseInt(target.dataset.listIndex || String(index), 10) || 0);
    numberNode.dataset.countRan = "true";

    const runAnimation = () => {
      const startTime = performance.now();
      const frame = (now) => {
        const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = targetValue * eased;
        numberNode.textContent = formatCountValue(progress >= 1 ? targetValue : currentValue, decimals);
        if (progress < 1) window.requestAnimationFrame(frame);
      };

      numberNode.textContent = formatCountValue(0, decimals);
      window.requestAnimationFrame(frame);
    };

    if (isStaticCapture() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      numberNode.textContent = formatCountValue(targetValue, decimals);
      return;
    }

    numberNode.textContent = formatCountValue(0, decimals);
    window.setTimeout(runAnimation, listIndex * COUNT_STAGGER_MS);
  };

  const init = () => {
    const statItems = Array.from(document.querySelectorAll(".proof-stat-item"));
    if (!statItems.length) return;

    if (isStaticCapture() || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      statItems.forEach((target, index) => startCount(target, index));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        startCount(entry.target, statItems.indexOf(entry.target));
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -12% 0px",
    });

    statItems.forEach((target) => observer.observe(target));
  };

  window.InfluencerStats = { init };
})();
