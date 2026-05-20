(function () {
  'use strict';

  var PLAUSIBLE_SRC = 'https://plausible.io/js/pa-zxMJ8B15OK7TSChEp97LX.js';
  var DOTLOTTIE_SRC = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';

  function loadPlausible() {
    if (document.querySelector('script[data-iknaio-plausible]')) return;
    window.plausible = window.plausible || function () { (plausible.q = plausible.q || []).push(arguments); };
    plausible.init = plausible.init || function (i) { plausible.o = i || {}; };
    plausible.init();
    var s = document.createElement('script');
    s.async = true;
    s.src = PLAUSIBLE_SRC;
    s.setAttribute('data-iknaio-plausible', '');
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
  loadLottiePlayer();
})();
