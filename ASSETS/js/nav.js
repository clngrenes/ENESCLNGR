(function () {
  var LOGO_SVG = '' +
    '<svg width="53" height="49" viewBox="0 0 53 49" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M40.1755 44.5455H26.961C21.951 44.5455 19.4423 38.488 22.9852 34.9458C24.3745 33.5568 23.3906 31.1818 21.4258 31.1818C20.8409 31.1818 20.28 31.4141 19.8664 31.8276L8.54563 43.146C6.38489 45.3062 7.91521 49 10.971 49H45.6788C49.4675 49 52.5387 45.9294 52.5387 42.1416V32.4678C52.5387 31.7576 51.9629 31.1818 51.2525 31.1818H44.8917C44.1813 31.1818 43.6055 31.7576 43.6055 32.4678V41.1162C43.6055 43.0101 42.0698 44.5455 40.1755 44.5455Z" fill="currentColor"/>' +
      '<path d="M22.9415 14.0542C19.3985 10.512 21.9072 4.45454 26.9172 4.45454H40.1755C42.0698 4.45454 43.6055 5.98985 43.6055 7.88376L43.6055 16.5322C43.6055 17.2424 44.1813 17.8182 44.8917 17.8182H51.2525C51.9629 17.8182 52.5388 17.2424 52.5388 16.5322V6.85843C52.5388 3.07063 49.4675 0 45.6789 0H10.9272C7.87144 0 6.34111 3.69375 8.50186 5.85403L19.8226 17.1724C20.2362 17.5859 20.7971 17.8182 21.382 17.8182C23.3468 17.8182 24.3308 15.4432 22.9415 14.0542Z" fill="currentColor"/>' +
      '<path d="M9.00192 33.5009C11.2918 33.5009 13.3821 32.6461 14.9707 31.2381C17.3429 29.1358 19.9552 26.7009 23.1249 26.7009H50.3112C51.5262 26.7009 52.5112 25.7159 52.5112 24.5009C52.5112 23.2859 51.5262 22.3009 50.3112 22.3009H23.1249C19.9552 22.3009 17.3429 19.866 14.9707 17.7637C13.3821 16.3558 11.2918 15.5009 9.00192 15.5009C4.0303 15.5009 0 19.5304 0 24.5009C0 29.4715 4.0303 33.5009 9.00192 33.5009ZM12.9292 26.7009C12.1584 28.0735 10.6885 29.0009 9.00192 29.0009C6.51611 29.0009 4.50096 26.9862 4.50096 24.5009C4.50096 22.0156 6.51611 20.0009 9.00192 20.0009C10.6885 20.0009 12.1584 20.9283 12.9292 22.3009C13.2946 22.9514 13.5029 23.7018 13.5029 24.5009C13.5029 25.3 13.2946 26.0504 12.9292 26.7009Z" fill="currentColor"/>' +
    '</svg>';

  function getNavMarkup(page, withProgress) {
    var isAbout = page === 'about';
    var isGallery = page === 'gallery';

    return '' +
      '<div class="nav__left">' +
        '<a href="index.html" class="nav__logo" aria-label="Home">' + LOGO_SVG + '</a>' +
        '<a href="about.html" class="btn ' + (isAbout ? 'btn--active' : 'btn--inactive') + '">About</a>' +
        '<a href="gallery.html" class="btn ' + (isGallery ? 'btn--active' : 'btn--inactive') + '">Gallery</a>' +
      '</div>' +
      (withProgress
        ? '<div class="nav__progress" aria-hidden="true"><div class="nav__progress-track"><div class="nav__progress-fill" id="scroll-fill"></div></div><span class="nav__progress-label" id="scroll-label">0%</span><span class="nav__progress-section" id="scroll-section"><span class="nav__progress-dot" aria-hidden="true"></span><span class="nav__progress-section-label">Hero</span></span></div>'
        : '') +
      '<div class="nav__right">' +
        '<button id="theme-toggle" class="btn btn--icon" aria-label="Switch to dark mode"></button>' +
        '<a href="https://www.linkedin.com/in/enes-cilingir/" target="_blank" rel="noopener" class="btn btn--inactive nav__linkedin">Find me on LinkedIn</a>' +
        '<button class="btn btn--active btn--copy js-copy-mail" data-copy-text="contact@cilingir.studio" aria-label="Copy email address">' +
          '<span class="btn__copy-label">Copy Mail</span>' +
          '<span class="btn__copy-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
              '<circle cx="12" cy="12" r="11"></circle>' +
              '<path d="M7.2 12.3 10.5 15.6 16.8 9.4"></path>' +
            '</svg>' +
          '</span>' +
        '</button>' +
      '</div>';
  }

  function initNav() {
    var nav = document.querySelector('nav.nav[data-nav-page]');
    if (!nav) return;

    var page = nav.getAttribute('data-nav-page') || 'home';
    var withProgress = nav.getAttribute('data-nav-progress') === 'true';
    nav.innerHTML = getNavMarkup(page, withProgress);
  }

  function start() {
    initNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
