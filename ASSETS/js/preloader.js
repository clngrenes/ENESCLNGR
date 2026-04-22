(function () {
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

    // Critical images to preload globally so navigation feels instant
    var globalImagesToPreload = [
      'ASSETS/COVERS/pulse-cover.jpg?v=8',
      'ASSETS/images/PULSE/screens.jpg',
      'ASSETS/COVERS/mykorrizha-cover.jpg?v=2',
      'ASSETS/images/MYKORRIZHA/teacher-view.jpg',
      'ASSETS/images/PULSE/appicon.jpg',
      'ASSETS/images/PULSE/124.jpg'
    ];

    var totalImages = 0;
    var loadedImages = 0;
    var circumference = 301.59;
    var imagesToTrack = [];

    // 1. Gather all DOM images and load them via JS Image objects to bypass lazy-load blocking
    for (var i = 0; i < document.images.length; i++) {
      var src = document.images[i].src;
      if (src) {
        var img = new Image();
        img.src = src;
        imagesToTrack.push(img);
      }
    }

    // 2. Add global ones
    for (var j = 0; j < globalImagesToPreload.length; j++) {
      var globalImg = new Image();
      globalImg.src = globalImagesToPreload[j];
      imagesToTrack.push(globalImg);
    }

    totalImages = imagesToTrack.length;

    // Fallback: If it takes longer than 6 seconds, just force open
    var fallbackTimeout = setTimeout(finishLoading, 4000);
    var isFinished = false;

    // We use a target offset and smoothly animate towards it via rAF
    var currentOffset = circumference;
    var targetOffset = circumference;

    function updateVisualProgress() {
      if (isFinished) return;
      
      // Smooth lerp towards the target offset
      currentOffset += (targetOffset - currentOffset) * 0.15;
      progressCircle.style.strokeDashoffset = currentOffset + 'px';

      // Keep animating until finished
      requestAnimationFrame(updateVisualProgress);
    }

    function setTargetProgress(percent) {
      targetOffset = circumference - (percent * circumference);
    }

    function onImageLoaded() {
      loadedImages++;
      var percent = totalImages > 0 ? (loadedImages / totalImages) : 1;
      
      // Ensure we never go backwards and always progress
      setTargetProgress(percent);
      
      if (loadedImages >= totalImages) {
        // All loaded! Wait a tiny bit for the smooth bar to catch up
        setTimeout(finishLoading, 300);
      }
    }

    function finishLoading() {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(fallbackTimeout);
      
      // Force ring to full
      progressCircle.style.strokeDashoffset = '0px';
      
      setTimeout(function() {
        preloader.classList.add('is-hidden');
        if (document.body) {
          document.body.classList.remove('is-loading');
          document.body.classList.add('is-revealing');
        }
        
        setTimeout(function() {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 1000);
      }, 200);
    }

    if (totalImages === 0) {
      finishLoading();
    } else {
      // Start the visual lerp loop
      requestAnimationFrame(updateVisualProgress);

      for (var k = 0; k < totalImages; k++) {
        var trackImg = imagesToTrack[k];
        if (trackImg.complete) {
          onImageLoaded();
        } else {
          trackImg.addEventListener('load', onImageLoaded, false);
          trackImg.addEventListener('error', onImageLoaded, false);
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();