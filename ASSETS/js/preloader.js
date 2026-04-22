(function () {
  function getSessionStorage(key) {
    try {
      return sessionStorage.getItem(key);
    } catch(e) {
      return null;
    }
  }

  function setSessionStorage(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch(e) {}
  }

  function removePreloaderInstant() {
    var preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
    if (document.body) document.body.classList.remove('is-loading');
  }

  // Prevent running again if already finished
  if (getSessionStorage('site_preloaded') && !window.location.search.includes('force_preload')) {
    // Already preloaded this session -> hide immediately and trigger reveal
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        removePreloaderInstant();
        document.body.classList.add('is-revealing-instant');
      });
    } else {
      removePreloaderInstant();
      document.body.classList.add('is-revealing-instant');
    }
    return;
  }

  function initPreloader() {
    var preloader = document.getElementById('preloader');
    var progressCircle = document.getElementById('preloader-progress');
    
    if (!preloader || !progressCircle) {
      if (document.body) {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-revealing');
      }
      return;
    }

    var circumference = 301.59;
    var duration = 900; // 0.9s smooth fill animation
    var startTime = null;

    function animateProgress(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var percent = Math.min(elapsed / duration, 1);
      
      // Ease out quartic for a snappier start
      var easePercent = 1 - Math.pow(1 - percent, 4);
      var offset = circumference - (easePercent * circumference);
      
      progressCircle.style.strokeDashoffset = offset + 'px';

      if (percent < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        finishLoading();
      }
    }

    function finishLoading() {
      // Small pause at 100% before sliding up
      setTimeout(function() {
        preloader.classList.add('is-hidden');
        if (document.body) {
          document.body.classList.remove('is-loading');
          document.body.classList.add('is-revealing');
        }
        setSessionStorage('site_preloaded', 'true');
        
        // Remove DOM element after CSS transition (0.9s) finishes
        setTimeout(function() {
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 1000);
      }, 300);
    }

    // Give the browser a moment to paint the empty ring before animating
    requestAnimationFrame(function(timestamp) {
      startTime = timestamp;
      requestAnimationFrame(animateProgress);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();