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
  ).map(function (section) {
    var dataLabel = section.getAttribute('data-section-label');
    var text;
    if (dataLabel) {
      text = dataLabel;
    } else {
      var heading = section.querySelector('h2, h1');
      text = heading ? heading.textContent.trim().split(' ')[0] : 'Section';
    }
    return { el: section, label: text, top: 0 };
  });

  /* Cache section offsets — recalculate on resize, not on every scroll */
  function cacheSectionTops() {
    for (var i = 0; i < sectionEntries.length; i++) {
      sectionEntries[i].top = sectionEntries[i].el.getBoundingClientRect().top + window.scrollY;
    }
  }

  function updateCurrentSection(scrollY) {
    if (!sectionLabel || sectionEntries.length === 0) return;
    var focusY = scrollY + window.innerHeight * 0.35;
    var current = sectionEntries[0];
    for (var i = 0; i < sectionEntries.length; i++) {
      if (focusY >= sectionEntries[i].top) current = sectionEntries[i];
    }
    if (sectionLabel.textContent !== current.label) {
      sectionLabel.textContent = current.label;
      if (sectionBox) {
        sectionBox.classList.remove('is-changing');
        window.requestAnimationFrame(function () {
          sectionBox.classList.add('is-changing');
          window.setTimeout(function () { sectionBox.classList.remove('is-changing'); }, 240);
        });
      }
    }
  }

  /* rAF-throttled scroll handler */
  var rafPending = false;
  var hasScrolled = false;

  function onScroll() {
    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(function () {
        rafPending = false;
        if (!hasScrolled) hasScrolled = true;
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? Math.round(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))) : 0;
        fill.style.width  = pct + '%';
        label.textContent = pct + '%';
        updateCurrentSection(scrollTop);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', function () {
    cacheSectionTops();
  }, { passive: true });

  /* Initialize after layout is stable */
  window.addEventListener('DOMContentLoaded', function () {
    cacheSectionTops();
  });

  cacheSectionTops();

  /* Set initial state correctly — don't show 0% if already scrolled (e.g. back-navigation) */
  var initScroll = window.scrollY || document.documentElement.scrollTop;
  var initDocH   = document.documentElement.scrollHeight - window.innerHeight;
  var initPct    = initDocH > 0 ? Math.round((initScroll / initDocH) * 100) : 0;
  fill.style.width  = initPct + '%';
  label.textContent = initPct + '%';
  if (sectionEntries.length > 0) updateCurrentSection(initScroll);
}

document.addEventListener('DOMContentLoaded', initScrollProgress);
