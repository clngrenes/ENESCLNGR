/**
 * Final Designs: swap left preview on feature-card hover.
 */
(function () {
  var screen = document.getElementById('pulse-final-screen');
  if (!screen) return;
  var cards = document.querySelectorAll('.pulse__feature-card');
  if (!cards.length) return;

  function setActive(card) {
    var src = card.getAttribute('data-screen');
    if (!src) return;
    var alt = card.getAttribute('data-screen-alt') || screen.getAttribute('alt') || '';
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('is-active');
    }
    card.classList.add('is-active');

    if (screen.getAttribute('src') === src) {
      return;
    }

    screen.classList.add('is-swapping');
    var pre = new Image();
    pre.onload = function () {
      screen.setAttribute('src', src);
      screen.setAttribute('alt', alt);
      requestAnimationFrame(function () {
        screen.classList.remove('is-swapping');
      });
    };
    pre.onerror = function () {
      screen.setAttribute('src', src);
      screen.setAttribute('alt', alt);
      screen.classList.remove('is-swapping');
    };
    pre.src = src;
  }

  for (var j = 0; j < cards.length; j++) {
    (function (card) {
      card.addEventListener('mouseenter', function () {
        setActive(card);
      });
      card.addEventListener('focusin', function () {
        setActive(card);
      });
    })(cards[j]);
  }
})();
