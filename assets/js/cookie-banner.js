(function () {
  'use strict';

  var STORAGE_KEY = 'iknaio-cookie-consent';
  var PLAUSIBLE_DOMAIN = 'iknaio.com';
  var PLAUSIBLE_SRC = 'https://plausible.io/js/script.js';
  var DOTLOTTIE_SRC = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';

  function loadAnalytics() {
    if (document.querySelector('script[data-domain="' + PLAUSIBLE_DOMAIN + '"]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    s.src = PLAUSIBLE_SRC;
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

  function loadConsented() {
    loadAnalytics();
    loadLottiePlayer();
  }

  function saveConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function showBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.removeAttribute('hidden');
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.setAttribute('hidden', '');
  }

  var consent = getConsent();
  if (consent === 'accepted') {
    loadConsented();
  } else if (consent === null) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.matches('[data-cookie-action="accept"]')) {
      saveConsent('accepted');
      loadConsented();
      hideBanner();
    } else if (t.matches('[data-cookie-action="reject"]')) {
      saveConsent('rejected');
      hideBanner();
    } else if (t.matches('[data-cookie-action="settings"]')) {
      e.preventDefault();
      showBanner();
    }
  });
})();
