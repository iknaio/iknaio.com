// Lazy-load Brevo (sibforms) only after the visitor interacts with the form
// — avoids any third-party request before user intent (GDPR-friendly).
(function () {
  var form = document.getElementById('sib-form');
  if (!form) return;
  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
    window.LOCALE = 'en';
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = 'The information provided is invalid. Please review the field format and try again.';
    window.REQUIRED_ERROR_MESSAGE = 'This field cannot be left blank. ';
    window.GENERIC_INVALID_MESSAGE = 'The information provided is invalid. Please review the field format and try again.';
    window.translation = { common: {
      selectedList: '{quantity} list selected',
      selectedLists: '{quantity} lists selected',
      selectedOption: '{quantity} selected',
      selectedOptions: '{quantity} selected'
    }};
    window.AUTOHIDE = false;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://sibforms.com/forms/end-form/build/sib-styles.css';
    document.head.appendChild(l);
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://sibforms.com/forms/end-form/build/main.js';
    document.body.appendChild(s);
  }
  var input = document.getElementById('EMAIL');
  if (input) {
    input.addEventListener('focus', load, { once: true });
    input.addEventListener('pointerdown', load, { once: true });
  }
  form.addEventListener('submit', load, { once: true });
})();
