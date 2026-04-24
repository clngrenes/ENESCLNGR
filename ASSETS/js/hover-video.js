/**
 * YouTube hover videos on work cards: starts at 10s, 2x speed, muted.
 * Loads the IFrame API only after preloader (siteRevealed) to avoid main-thread lag.
 */
(function () {
  var YT_START_SECONDS = 10;
  var inited = false;

  function getStartSeconds(card) {
    var raw = card.getAttribute('data-yt-start');
    if (raw == null || raw === '') return YT_START_SECONDS;
    var n = parseInt(raw, 10);
    return isNaN(n) ? YT_START_SECONDS : n;
  }

  function loadYouTubeAPI() {
    if (inited) return;
    if (window.YT && window.YT.Player) {
      inited = true;
      initPlayers();
      return;
    }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      return;
    }
    inited = true;
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(tag, first);
  }

  var playersBuilt = false;
  function initPlayers() {
    if (playersBuilt) return;
    var cards = document.querySelectorAll('.work-card[data-yt-id]');
    if (!cards.length) return;
    playersBuilt = true;

    var schedule =
      window.requestIdleCallback ||
      function (cb) {
        setTimeout(cb, 120);
      };

    cards.forEach(function (card) {
      schedule(function () {
        setupCardPlayer(card);
      });
    });
  }

  function setupCardPlayer(card) {
    var ytId = card.getAttribute('data-yt-id');
    if (!ytId) return;
    var startSec = getStartSeconds(card);

    var mediaContainer = card.querySelector('.work-card__media');
    if (!mediaContainer) return;

    var ytWrapper = document.createElement('div');
    ytWrapper.className = 'work-card__yt-wrapper';

    var ytPlayerDiv = document.createElement('div');
    ytPlayerDiv.id = 'yt-' + Math.random().toString(36).slice(2, 12);
    ytPlayerDiv.className = 'work-card__yt-iframe';
    ytWrapper.appendChild(ytPlayerDiv);
    mediaContainer.appendChild(ytWrapper);

    // eslint-disable-next-line no-undef
    new YT.Player(ytPlayerDiv.id, {
      videoId: ytId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        start: startSec,
        loop: 1,
        playlist: ytId,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        mute: 1
      },
      events: {
        onReady: function (event) {
          event.target.mute();

          card.addEventListener('mouseenter', function () {
            event.target.setPlaybackRate(2);
            event.target.seekTo(startSec, true);
            event.target.playVideo();
            ytWrapper.classList.add('is-playing');
          });

          card.addEventListener('mouseleave', function () {
            event.target.pauseVideo();
            ytWrapper.classList.remove('is-playing');
          });
        },
        onStateChange: function (event) {
          if (event.data === 1) {
            // playing
            event.target.setPlaybackRate(2);
          }
          if (event.data === 0) {
            // ended — loop from start offset
            event.target.seekTo(startSec, true);
            event.target.playVideo();
          }
        }
      }
    });
  }

  window.onYouTubeIframeAPIReady = function () {
    initPlayers();
  };

  var scheduleStarted = false;
  function onSiteRevealed() {
    if (scheduleStarted) return;
    scheduleStarted = true;
    var schedule =
      window.requestIdleCallback ||
      function (cb) {
        setTimeout(cb, 200);
      };
    schedule(function () {
      loadYouTubeAPI();
    });
  }

  window.addEventListener('siteRevealed', onSiteRevealed, { once: true });
})();
