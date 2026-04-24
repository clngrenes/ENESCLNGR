/**
 * Handles YouTube video playback on hover for work cards.
 * Plays videos at 2x speed.
 */

// 1. Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. Global array to store player instances
var ytPlayers = [];

// 3. Callback when API is ready
function onYouTubeIframeAPIReady() {
  const cards = document.querySelectorAll('.work-card[data-yt-id]');
  
  cards.forEach((card, index) => {
    const ytId = card.getAttribute('data-yt-id');
    if (!ytId) return;

    // Create container for the iframe
    const mediaContainer = card.querySelector('.work-card__media');
    if (!mediaContainer) return;

    const ytWrapper = document.createElement('div');
    ytWrapper.className = 'work-card__yt-wrapper';
    
    const ytPlayerDiv = document.createElement('div');
    ytPlayerDiv.id = `yt-player-${Math.random().toString(36).substr(2, 9)}`;
    ytPlayerDiv.className = 'work-card__yt-iframe';
    ytWrapper.appendChild(ytPlayerDiv);
    
    mediaContainer.appendChild(ytWrapper);

    // Initialize player
    const player = new YT.Player(ytPlayerDiv.id, {
      videoId: ytId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: ytId, // Required for loop
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        mute: 1
      },
      events: {
        onReady: (event) => {
          // Mute immediately to allow programmatic autoplay
          event.target.mute();
          
          // Set up hover listeners on the card
          card.addEventListener('mouseenter', () => {
            event.target.setPlaybackRate(2.0);
            event.target.playVideo();
            ytWrapper.classList.add('is-playing');
          });

          card.addEventListener('mouseleave', () => {
            event.target.pauseVideo();
            ytWrapper.classList.remove('is-playing');
          });
        },
        onStateChange: (event) => {
          // Ensure 2x speed is maintained when playing
          if (event.data === YT.PlayerState.PLAYING) {
            event.target.setPlaybackRate(2.0);
          }
        }
      }
    });

    ytPlayers.push(player);
  });
}
