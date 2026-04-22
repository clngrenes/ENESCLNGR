/* ============================================
   Scroll Progress — Project Pages
   Updates #scroll-fill width and #scroll-label
   text as the user scrolls, bi-directional.
   ============================================ */

function initScrollProgress() {
  var fill  = document.getElementById('scroll-fill');
  var label = document.getElementById('scroll-label');
  var sectionBox = document.getElementById('scroll-section');
  var sectionLabel = document.querySelector('#scroll-section .nav__progress-section-label');
  if (!fill || !label) return;

  var sectionEntries = Array.prototype.slice.call(
    document.querySelectorAll('main > section')
  ).map(function (section, index) {
    var heading = section.querySelector('h2, h1');
    var text = heading ? heading.textContent.trim() : '';
    if (!text) text = 'Section ' + (index + 1);
    return {
      el: section,
      label: text
    };
  });

  function updateCurrentSection() {
    if (!sectionLabel || sectionEntries.length === 0) return;
    var focusY = window.scrollY + window.innerHeight * 0.35;
    var current = sectionEntries[0];

    for (var i = 0; i < sectionEntries.length; i++) {
      var rect = sectionEntries[i].el.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      if (focusY >= top) current = sectionEntries[i];
    }

    if (sectionLabel.textContent !== current.label) {
      sectionLabel.textContent = current.label;
      if (sectionBox) {
        sectionBox.classList.remove('is-changing');
        window.requestAnimationFrame(function () {
          sectionBox.classList.add('is-changing');
          window.setTimeout(function () {
            sectionBox.classList.remove('is-changing');
          }, 240);
        });
      }
    }
  }

  function update() {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var raw        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    var pct        = Math.round(Math.min(100, Math.max(0, raw)));
    fill.style.width   = pct + '%';
    label.textContent  = pct + '%';
    updateCurrentSection();
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); /* run once on load */
}

document.addEventListener('DOMContentLoaded', initScrollProgress);
