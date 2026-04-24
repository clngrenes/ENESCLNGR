/**
 * YouTube on work cards: start ~10s, 2x, muted.
 * - IFrame API loads only after `siteRevealed` (after page preloader).
 * - Cover images are hidden in CSS on hover; iframe layer is shown immediately
 *   (YouTube may still show a short internal buffer — not the site preloader).
 * - cue at ready; play on enter, pause on leave.
 */
(function () {
  var YT_START_SECONDS = 10;
  var scriptRequested = false;
  var playersBuilt = false;

  function getStartSeconds(card) {
    var raw = card.getAttribute('data-yt-start');
    if (raw == null || raw === '') return YT_START_SECONDS;
    var n = parseInt(raw, 10);
    return isNaN(n) ? YT_START_SECONDS : n;
  }

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initPlayers();
      return;
    }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      return;
    }
    if (scriptRequested) return;
    scriptRequested = true;
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(tag, first);
  }

  function initPlayers() {
    if (playersBuilt) return;
    if (!window.YT || !window.YT.Player) return;
    var cards = document.querySelectorAll('.work-card[data-yt-id]');
    if (!cards.length) return;
    playersBuilt = true;

    var schedule =
      window.requestIdleCallback ||
      function (cb) {
        setTimeout(cb, 16);
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

    var player;
    var mouseInside = false;

    // eslint-disable-next-line no-undef, no-new
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
        mute: 1,
        cc_load_policy: 0,
        iv_load_policy: 3
      },
      events: {
        onReady: function (event) {
          player = event.target;
          player.mute();
          if (player.cueVideoById) {
            try {
              player.cueVideoById(ytId, startSec, 'default');
            } catch (e) {
              /* no-op */
            }
          }

          function onEnter() {
            if (!player) return;
            mouseInside = true;
            player.mute();
            player.setPlaybackRate(2);
            player.seekTo(startSec, true);
            player.playVideo();
          }

          function onLeave() {
            mouseInside = false;
            if (!player) return;
            player.pauseVideo();
          }

          card.addEventListener('mouseenter', onEnter);
          card.addEventListener('mouseleave', onLeave);
        },
        onStateChange: function (event) {
          if (event.data === 1 && player) {
            player.setPlaybackRate(2);
            return;
          }
          if (event.data === 0 && player) {
            player.seekTo(getStartSeconds(card), true);
            if (mouseInside) player.playVideo();
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

  if (window.YT && window.YT.Player) {
    initPlayers();
  }
})();
