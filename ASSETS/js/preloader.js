(function () {
  var preloader = document.getElementById('preloader');
  var progressCircle = document.getElementById('preloader-progress');

  // No preloader in DOM → reveal immediately (e.g. no-JS fallback pages)
  if (!preloader || !progressCircle) {
    if (document.body) {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-revealing');
    }
    window.dispatchEvent(new CustomEvent('siteRevealed'));
    return;
  }

  // ── Background cache-fill (fire and forget — never blocks reveal) ─────────
  var page = (document.body && document.body.getAttribute('data-page')) || '';
  var toCache = page === 'home' ? [
    'ASSETS/COVERS/pulse-cover.jpg?v=8',
    'ASSETS/images/PULSE/screens.jpg',
    'ASSETS/COVERS/aidea-cover.jpg?v=2',
    'ASSETS/images/AIDEA/realtime.jpg',
    'ASSETS/COVERS/mykorrizha-cover.jpg?v=2',
    'ASSETS/images/MYKORRIZHA/1.jpg',
    'ASSETS/COVERS/reps-cover.jpg?v=5',
    'ASSETS/COVERS/reps-hover.jpg?v=1',
    'ASSETS/COVERS/orientation-cover.jpg?v=3',
    'ASSETS/images/ORIENTATION/Necklace%20Form.jpeg'
  ] : [];

  for (var i = 0; i < document.images.length; i++) {
    var cacheSrc = document.images[i].src;
    if (cacheSrc) { try { var ci = new Image(); ci.src = cacheSrc; } catch (e) {} }
  }
  for (var j = 0; j < toCache.length; j++) {
    try { var ci2 = new Image(); ci2.src = toCache[j]; } catch (e) {}
  }

  // ── Ring animation + reveal ───────────────────────────────────────────────
  var CIRCUMFERENCE = 301.59;
  var RING_DURATION = 900; // ms to fill ring
  var startTime = null;
  var revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    try { progressCircle.style.strokeDashoffset = '0px'; } catch (e) {}
    setTimeout(function () {
      preloader.classList.add('is-hidden');
      if (document.body) {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-revealing');
      }
      window.dispatchEvent(new CustomEvent('siteRevealed'));
      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 1000);
    }, 200);
  }

  function animateRing(timestamp) {
    if (revealed) return;
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var t = Math.min(elapsed / RING_DURATION, 1);
    var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    try {
      progressCircle.style.strokeDashoffset = (CIRCUMFERENCE * (1 - eased)) + 'px';
    } catch (e) {}
    if (t < 1) {
      requestAnimationFrame(animateRing);
    } else {
      reveal();
    }
  }

  requestAnimationFrame(animateRing);

  // Absolute hard safety: if rAF is suspended (background tab, etc.), force reveal
  setTimeout(reveal, 2000);
})();
