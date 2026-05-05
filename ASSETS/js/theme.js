/* ============================================
   Theme Toggle — Dark / Light
   Uses CSS class (.page--fading) for a smooth
   opacity fade instead of janky inline blur.
   Icons: moon (→ dark) / sun (→ light).
   ============================================ */

/* Early init — runs before paint to prevent FOUC.
   Checks localStorage first, falls back to system preference. */
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) { /* localStorage unavailable (e.g. private browsing) */ }
})();

/* SVG icon strings */
var ICON_MOON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>';
var ICON_SUN  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

function initThemeToggle() {
  var btn  = document.getElementById('theme-toggle');
  var page = document.querySelector('.page');
  if (!btn || !page) return;

  var isToggling = false;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function updateBtn() {
    btn.innerHTML = isDark() ? ICON_SUN : ICON_MOON;
    btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  }

  btn.addEventListener('click', function () {
    if (isToggling) return;
    isToggling = true;

    page.classList.add('page--fading');

    setTimeout(function () {
      var nextDark = !isDark();
      if (nextDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      try { localStorage.setItem('theme', nextDark ? 'dark' : 'light'); } catch (e) {}
      updateBtn();

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          page.classList.remove('page--fading');
          isToggling = false;
        });
      });
    }, 220);
  });

  updateBtn();
}

document.addEventListener('DOMContentLoaded', initThemeToggle);
