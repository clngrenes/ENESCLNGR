/**
 * YouTube on work cards: start at data-yt-start (default 10s), 2x, muted.
 * - IFrame API loads when `siteRevealed` fires.
 * - Cue at 10s (lightweight); avoid heavy loadVideo pre-buffer to reduce lag; play on hover.
 * - Muted: PLAYING from cue is paused unless pointer is on the card.
 */
(function () {
  var YT_START_SECONDS = 10;
  var scriptRequested = false;
  var playersBuilt = false;
  var ST_PLAYING = 1;
  var ST_ENDED = 0;

  function getStartSeconds(card) {
    var raw = card.getAttribute('data-yt-start');
    if (raw == null || raw === '') return YT_START_SECONDS;
    var n = parseInt(raw, 10);
    return isNaN(n) ? YT_START_SECONDS : n;
  }

  function cueAtStart(p, ytId, startSec) {
    var opt = { videoId: ytId, startSeconds: startSec, suggestedQuality: 'default' };
    try {
      if (p.cueVideoById) {
        try {
          p.cueVideoById(opt);
        } catch (e) {
          p.cueVideoById(ytId, startSec, 'default');
        }
        return;
      }
    } catch (e) {
      /* no-op */
    }
    try {
      if (p.loadVideoById) {
        try {
          p.loadVideoById(opt);
        } catch (e2) {
          p.loadVideoById(ytId, startSec, 'default');
        }
      }
    } catch (e3) {
      /* no-op */
    }
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
          cueAtStart(player, ytId, startSec);
          setTimeout(function () {
            try {
              player.seekTo(startSec, true);
              player.pauseVideo();
            } catch (e) {
              /* no-op */
            }
          }, 0);

          function onEnter() {
            if (!player) return;
            mouseInside = true;
            playAllowed = true;
            player.mute();
            player.seekTo(startSec, true);
            player.setPlaybackRate(2);
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
            try {
              player.setPlaybackRate(2);
            } catch (e) {
              /* no-op */
            }
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

  // Preloader can dispatch `siteRevealed` in the same turn as the first script (e.g. missing ring,
  // or readyState not "loading") before this file runs — listener would miss the event.
  if (document.body && document.body.classList.contains('is-revealing')) {
    onSiteRevealed();
  }

  if (window.YT && window.YT.Player) {
    initPlayers();
  }
})();
