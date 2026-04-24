/**
 * YouTube on work cards: start at data-yt-start (default 10s), 2x, muted.
 * - IFrame API loads when `siteRevealed` fires.
 * - On ready: loadVideoById + one muted play→pause to decode the first frame (avoids black “tap to play” on hover).
 * - mouseenter / pointerenter / touchstart: play. mouseleave / pointerleave / touch outside: pause.
 */
(function () {
  var YT_START_SECONDS = 10;
  var scriptRequested = false;
  var playersBuilt = false;
  var ST_PLAYING = 1;
  var ST_ENDED = 0;
  var ST_BUFFERING = 3;

  function getStartSeconds(card) {
    var raw = card.getAttribute('data-yt-start');
    if (raw == null || raw === '') return YT_START_SECONDS;
    var n = parseInt(raw, 10);
    return isNaN(n) ? YT_START_SECONDS : n;
  }

  function loadAtStart(p, ytId, startSec) {
    var opt = { videoId: ytId, startSeconds: startSec, suggestedQuality: 'default' };
    try {
      if (p.loadVideoById) {
        try {
          p.loadVideoById(opt);
        } catch (e) {
          p.loadVideoById(ytId, startSec, 'default');
        }
        return;
      }
    } catch (e) {
      /* no-op */
    }
    try {
      if (p.cueVideoById) {
        p.cueVideoById({ videoId: ytId, startSeconds: startSec, suggestedQuality: 'default' });
      }
    } catch (e2) {
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
      if (window.YT && window.YT.Player) {
        initPlayers();
      }
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
    var priming = false;
    var origin =
      window.location && window.location.origin && window.location.protocol !== 'file:';
    origin = origin ? window.location.origin : undefined;

    var playerVars = {
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
      iv_load_policy: 3,
      enablejsapi: 1
    };
    if (origin) {
      playerVars.origin = origin;
    }

    // eslint-disable-next-line no-undef, no-new
    new YT.Player(ytPlayerDiv.id, {
      videoId: ytId,
      playerVars: playerVars,
      events: {
        onReady: function (event) {
          player = event.target;
          player.mute();
          playAllowed = false;
          priming = true;
          loadAtStart(player, ytId, startSec);

          setTimeout(function () {
            if (!player) return;
            try {
              playAllowed = false;
              priming = true;
              player.mute();
              player.playVideo();
            } catch (e) {
              /* no-op */
            }
          }, 280);

          function onEnter() {
            if (!player) return;
            priming = false;
            mouseInside = true;
            playAllowed = true;
            try {
              player.mute();
              player.seekTo(startSec, true);
              player.setPlaybackRate(2);
              player.playVideo();
            } catch (e) {
              /* no-op */
            }
          }

          function onLeave() {
            priming = false;
            mouseInside = false;
            playAllowed = false;
            if (!player) return;
            try {
              player.pauseVideo();
            } catch (e) {
              /* no-op */
            }
          }

          var evIn = ['mouseenter', 'pointerenter'];
          var evOut = ['mouseleave', 'pointerleave'];
          var a;
          for (a = 0; a < evIn.length; a++) {
            card.addEventListener(evIn[a], onEnter);
          }
          for (a = 0; a < evOut.length; a++) {
            card.addEventListener(evOut[a], onLeave);
          }
          card.addEventListener(
            'touchstart',
            function () {
              onEnter();
            },
            { passive: true }
          );

          function onDocTouch(e) {
            if (!player || !playAllowed) return;
            if (card.contains(e.target)) return;
            onLeave();
          }
          document.addEventListener('touchstart', onDocTouch, { capture: true, passive: true });
        },
        onStateChange: function (event) {
          if (!player) return;
          if (event.data === ST_BUFFERING) {
            return;
          }
          if (event.data === ST_PLAYING) {
            if (!playAllowed) {
              try {
                player.pauseVideo();
                player.seekTo(startSec, true);
                if (priming) {
                  priming = false;
                }
              } catch (e) {
                /* no-op */
              }
            } else {
              try {
                player.setPlaybackRate(2);
              } catch (e) {
                /* no-op */
              }
            }
            return;
          }
          if (event.data === ST_ENDED) {
            try {
              player.seekTo(getStartSeconds(card), true);
              if (mouseInside) {
                playAllowed = true;
                player.playVideo();
              }
            } catch (e) {
              /* no-op */
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

  if (document.body && document.body.classList.contains('is-revealing')) {
    onSiteRevealed();
  }

  if (window.YT && window.YT.Player) {
    initPlayers();
  }

  window.addEventListener('load', function () {
    if (window.YT && window.YT.Player) {
      initPlayers();
    }
  });

  var yTry = 0;
  var yPoll = setInterval(function () {
    yTry += 1;
    if (window.YT && window.YT.Player) {
      if (!playersBuilt) {
        initPlayers();
      }
      clearInterval(yPoll);
    } else if (yTry > 40) {
      clearInterval(yPoll);
    }
  }, 150);
})();
