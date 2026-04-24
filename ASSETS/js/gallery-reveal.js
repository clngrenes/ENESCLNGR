/**
 * After preloader finishes (siteRevealed), stagger blur-fade in for .gallery__item.
 */
(function () {
  function reveal() {
    var grid = document.querySelector('.gallery__grid');
    if (!grid) return;
    /* Double rAF: run after preloader has unpainted and layout settled */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        grid.classList.add('gallery__grid--reveal');
      });
    });
  }

  window.addEventListener('siteRevealed', reveal, { once: true });

  /* Preloader can dispatch before this script is parsed */
  if (document.body && document.body.classList.contains('is-revealing')) {
    reveal();
  }
})();
