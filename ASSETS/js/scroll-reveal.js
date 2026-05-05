/**
 * Scroll Reveal — triggers .reveal elements as they enter the viewport.
 * Works with IntersectionObserver; gracefully no-ops if not supported.
 * Elements: add class="reveal" (or "reveal reveal--up" for translate variant).
 * CSS handles the actual animation (in base.css).
 */
(function () {
  if (!window.IntersectionObserver) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  function init() {
    var els = document.querySelectorAll('.reveal');
    for (var i = 0; i < els.length; i++) {
      observer.observe(els[i]);
    }
  }

  /* Run after site is revealed (preloader done) */
  window.addEventListener('siteRevealed', init, { once: true });

  /* Fallback: preloader already done when this script runs */
  if (document.body && (
    document.body.classList.contains('is-revealing') ||
    !document.body.classList.contains('is-loading')
  )) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
