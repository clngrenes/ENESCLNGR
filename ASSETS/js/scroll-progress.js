/* ============================================
   Scroll Progress — Project Pages
   Updates #scroll-fill width and #scroll-label
   text as the user scrolls, bi-directional.
   ============================================ */

function initScrollProgress() {
  var fill  = document.getElementById('scroll-fill');
  var label = document.getElementById('scroll-label');
  if (!fill || !label) return;

  function update() {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var raw        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    var pct        = Math.round(Math.min(100, Math.max(0, raw)));
    fill.style.width   = pct + '%';
    label.textContent  = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); /* run once on load */
}

document.addEventListener('DOMContentLoaded', initScrollProgress);
