/**
 * Page Transition — Exit fade before navigation.
 * Uses the existing .page--fading class (opacity: 0 in 0.22s).
 * Intercepts same-origin link clicks, fades out, then navigates.
 */
(function () {
  function isSameOriginPage(href) {
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      /* Skip if navigating to the exact same page */
      if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
      return true;
    } catch (e) { return false; }
  }

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (anchor.target === '_blank') return;

    var href = anchor.getAttribute('href');
    if (!isSameOriginPage(href)) return;

    e.preventDefault();

    var page = document.querySelector('.page');
    if (page) page.classList.add('page--fading');

    setTimeout(function () {
      window.location.href = href;
    }, 200);
  });
})();
