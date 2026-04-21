(function () {
  function initCopyMailButtons() {
    var buttons = document.querySelectorAll('.js-copy-mail');
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      var resetTimer = null;

      function resetLabel() {
        button.removeAttribute('data-copy-state');
      }

      /* Keep width stable while copy-feedback animates */
      button.style.minInlineSize = button.offsetWidth + 'px';

      button.addEventListener('click', function () {
        var copyText = button.getAttribute('data-copy-text');
        if (!copyText || button.getAttribute('data-copy-state') === 'busy') return;

        button.setAttribute('data-copy-state', 'busy');

        navigator.clipboard.writeText(copyText).then(function () {
          if (resetTimer) window.clearTimeout(resetTimer);
          button.setAttribute('data-copy-state', 'done');
          resetTimer = window.setTimeout(resetLabel, 1400);
        }).catch(function () {
          if (resetTimer) window.clearTimeout(resetTimer);
          button.setAttribute('data-copy-state', 'error');
          resetTimer = window.setTimeout(resetLabel, 1600);
        });
      });
    });
  }

  function start() {
    initCopyMailButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
