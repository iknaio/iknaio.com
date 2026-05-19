(function () {
  'use strict';

  var PLAUSIBLE_DOMAIN = 'iknaio.com';
  var PLAUSIBLE_SRC = 'https://plausible.io/js/script.js';
  var GA_ID = 'G-TPJK719TS4';
  var DOTLOTTIE_SRC = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';

  function loadPlausible() {
    if (document.querySelector('script[data-domain="' + PLAUSIBLE_DOMAIN + '"]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    s.src = PLAUSIBLE_SRC;
    document.head.appendChild(s);
  }

  function loadGoogleAnalytics() {
    if (document.querySelector('script[data-iknaio-ga]')) return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.setAttribute('data-iknaio-ga', '');
    document.head.appendChild(s);
  }

  function loadLottiePlayer() {
    if (!document.querySelector('dotlottie-player')) return;
    if (document.querySelector('script[data-iknaio-lottie]')) return;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = DOTLOTTIE_SRC;
    s.setAttribute('data-iknaio-lottie', '');
    document.head.appendChild(s);
  }

  loadPlausible();
  loadGoogleAnalytics();
  loadLottiePlayer();
})();
