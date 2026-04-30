(() => {
  const SELECTOR = "[data-reel]";

  const pauseCard = (card, reset = false) => {
    const video = card.querySelector("video");
    if (!video) return;

    video.pause();
    video.muted = true;
    card.classList.remove("is-previewing", "is-playing");

    if (reset) {
      try {
        video.currentTime = 0;
      } catch (error) {
        // Some browsers can reject currentTime changes before metadata is ready.
      }
    }
  };

  const pauseSiblings = (cards, activeCard) => {
    cards.forEach((card) => {
      if (card !== activeCard) pauseCard(card, true);
    });
  };

  const playVideo = async (card, muted, cards) => {
    const video = card.querySelector("video");
    if (!video) return;

    pauseSiblings(cards, card);
    video.muted = muted;

    try {
      await video.play();
      card.classList.toggle("is-previewing", muted);
      card.classList.toggle("is-playing", !muted);
    } catch (error) {
      card.classList.remove("is-previewing", "is-playing");
    }
  };

  const init = () => {
    const cards = Array.from(document.querySelectorAll(SELECTOR));
    if (!cards.length) return;

    cards.forEach((card) => {
      const button = card.querySelector(".reel-phone");
      const video = card.querySelector("video");
      if (!button || !video) return;

      button.addEventListener("mouseenter", () => {
        if (!card.classList.contains("is-playing")) playVideo(card, true, cards);
      });

      button.addEventListener("mouseleave", () => {
        if (!card.classList.contains("is-playing")) pauseCard(card, true);
      });

      button.addEventListener("focus", () => {
        if (!card.classList.contains("is-playing")) playVideo(card, true, cards);
      });

      button.addEventListener("blur", () => {
        if (!card.classList.contains("is-playing")) pauseCard(card, true);
      });

      button.addEventListener("click", () => {
        if (card.classList.contains("is-playing")) {
          pauseCard(card);
          return;
        }

        playVideo(card, false, cards);
      });
    });
  };

  window.InfluencerReels = { init };
})();
