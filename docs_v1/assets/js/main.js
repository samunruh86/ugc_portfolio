(() => {
  const init = async () => {
    const portfolio = await window.PortfolioCore.fetchPortfolio();
    window.PortfolioRender.renderAll(portfolio);
    window.PortfolioHeader.init();
    window.PortfolioReveal.init();
  };

  init().catch((error) => {
    console.error(error);
    document.body.insertAdjacentHTML("afterbegin", '<p class="load-error">Portfolio content could not load.</p>');
  });
})();
