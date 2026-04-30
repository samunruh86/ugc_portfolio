const PORTFOLIO_THEMES = [
  {
    id: "1",
    slug: "beauty-atelier",
    label: "Beauty Atelier"
  },
  {
    id: "2",
    slug: "wellness-sage",
    label: "Wellness Sage"
  },
  {
    id: "3",
    slug: "influencer-pop",
    label: "Influencer Pop"
  },
  {
    id: "4",
    slug: "mono-studio",
    label: "Mono Studio"
  }
];

function applyThemeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("theme");
  const root = document.documentElement;

  if (requested === "0" || requested === "base") {
    delete root.dataset.theme;
    delete root.dataset.themeName;
    return;
  }

  const selected = requested || "3";
  const theme = PORTFOLIO_THEMES.find((item) => (
    item.id === selected || item.slug === selected
  ));

  if (!theme) {
    delete root.dataset.theme;
    delete root.dataset.themeName;
    return;
  }

  root.dataset.theme = theme.id;
  root.dataset.themeName = theme.slug;
}

window.PortfolioThemes = Object.freeze({
  all: PORTFOLIO_THEMES,
  applyFromUrl: applyThemeFromUrl
});

applyThemeFromUrl();
