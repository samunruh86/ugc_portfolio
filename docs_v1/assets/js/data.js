(() => {
  const DATA_PATH = "assets/data/portfolio.json";
  const compactWorkQuery = window.matchMedia("(max-width: 560px)");

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const fetchPortfolio = async () => {
    const response = await fetch(DATA_PATH, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Portfolio data failed to load: ${response.status}`);
    return response.json();
  };

  const initialWorkCount = () => (compactWorkQuery.matches ? 3 : 6);

  window.PortfolioCore = {
    $,
    $$,
    compactWorkQuery,
    escapeHtml,
    fetchPortfolio,
    initialWorkCount
  };
})();
