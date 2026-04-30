(() => {
  const { $, $$ } = window.PortfolioCore;

  const stop = (frame, options = {}) => {
    const video = $("video", frame);
    if (!video) return;

    video.pause();
    video.muted = true;
    if (options.reset) video.currentTime = 0;
    frame.classList.remove("is-previewing", "is-playing");
    frame.setAttribute("aria-pressed", "false");
  };

  const bind = (scope = document) => {
    const frames = $$("[data-video-card]", scope);

    frames.forEach((frame) => {
      const video = $("video", frame);
      if (!video || frame.dataset.videoBound === "1") return;
      frame.dataset.videoBound = "1";

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
        stop(frame, { reset: true });
      });

      frame.addEventListener("click", () => {
        if (frame.classList.contains("is-playing")) {
          stop(frame, { reset: true });
          return;
        }

        $$("[data-video-card]").forEach((otherFrame) => {
          if (otherFrame !== frame) stop(otherFrame, { reset: true });
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
  };

  window.PortfolioVideo = { bind, stop };
})();
