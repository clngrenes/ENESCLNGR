(function () {
  function initPulseFinalDesigns() {
    var screen = document.getElementById('pulse-final-screen');
    var cards = Array.prototype.slice.call(
      document.querySelectorAll('.pulse__feature-card[data-screen]')
    );
    if (!screen || cards.length === 0) return;

    function activateCard(card) {
      var src = card.getAttribute('data-screen');
      var alt = card.getAttribute('data-screen-alt') || 'Pulse UI screen';
      if (!src || screen.getAttribute('src') === src) {
        cards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        return;
      }

      screen.classList.add('is-swapping');
      window.setTimeout(function () {
        screen.setAttribute('src', src);
        screen.setAttribute('alt', alt);
        cards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        window.setTimeout(function () {
          screen.classList.remove('is-swapping');
        }, 20);
      }, 120);
    }

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () { activateCard(card); });
      card.addEventListener('focusin', function () { activateCard(card); });
      card.addEventListener('touchstart', function () { activateCard(card); }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPulseFinalDesigns);
  } else {
    initPulseFinalDesigns();
  }
})();
