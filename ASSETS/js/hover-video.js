/**
 * YouTube on work cards: start ~10s, 2x, muted.
 * - IFrame API loads right when `siteRevealed` fires (preloader / logo pass done).
 * - Players are built immediately (no requestIdleCallback stagger) and preloaded with
 *   loadVideoById + pause so the first hover starts faster.
 * - Muted: accidental PLAYING from preload is stopped unless the pointer is on the card.
 */
(function () {
  var YT_START_SECONDS = 10;
  var scriptRequested = false;
  var playersBuilt = false;
  // YT.PlayerState
  var ST_PLAYING = 1;
  var ST_ENDED = 0;

  function getStartSeconds(card) {
    var raw = card.getAttribute('data-yt-start');
    if (raw == null || raw === '') return YT_START_SECONDS;
    var n = parseInt(raw, 10);
    return isNaN(n) ? YT_START_SECONDS : n;
  }

  function ensurePreconnect() {
    if (document.querySelector('link[rel="preconnect"][href="https://www.youtube.com"]')) return;
    var link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://www.youtube.com';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
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
    ensurePreconnect();
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

    for (var i = 0; i < cards.length; i++) {
      setupCardPlayer(cards[i]);
    }
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
    /** Only allow PLAYING when the user is hovering (blocks preload/autoplay) */
    var playAllowed = false;

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
          playAllowed = false;
          function preload() {
            try {
              if (player.loadVideoById) {
                player.loadVideoById(ytId, startSec, 'default');
              } else if (player.cueVideoById) {
                player.cueVideoById(ytId, startSec, 'default');
              }
            } catch (e) {
              /* no-op */
            }
            try {
              player.pauseVideo();
            } catch (e) {
              /* no-op */
            }
            setTimeout(function () {
              try {
                player.pauseVideo();
                player.seekTo(startSec, true);
              } catch (e) {
                /* no-op */
              }
            }, 0);
            setTimeout(function () {
              try {
                player.pauseVideo();
              } catch (e) {
                /* no-op */
              }
            }, 120);
          }
          preload();

          function onEnter() {
            if (!player) return;
            mouseInside = true;
            playAllowed = true;
            player.mute();
            player.setPlaybackRate(2);
            player.seekTo(startSec, true);
            player.playVideo();
          }

          function onLeave() {
            mouseInside = false;
            playAllowed = false;
            if (!player) return;
            player.pauseVideo();
          }

          card.addEventListener('mouseenter', onEnter);
          card.addEventListener('mouseleave', onLeave);
        },
        onStateChange: function (event) {
          if (!player) return;
          if (event.data === ST_PLAYING) {
            if (!playAllowed) {
              try {
                player.pauseVideo();
              } catch (e) {
                /* no-op */
              }
              return;
            }
            player.setPlaybackRate(2);
            return;
          }
          if (event.data === ST_ENDED) {
            player.seekTo(getStartSeconds(card), true);
            if (mouseInside) {
              playAllowed = true;
              player.playVideo();
            }
          }
        }
      }
    });
  }

  window.onYouTubeIframeAPIReady = function () {
    initPlayers();
  };

  var siteRevealedCalled = false;
  function onSiteRevealed() {
    if (siteRevealedCalled) return;
    siteRevealedCalled = true;
    loadYouTubeAPI();
  }

  window.addEventListener('siteRevealed', onSiteRevealed, { once: true });

  if (window.YT && window.YT.Player) {
    initPlayers();
  }
})();
