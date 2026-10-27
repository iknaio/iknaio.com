(function () {
  var section = document.querySelector('.tools-section');
  if (!section) return;
  var tabs = document.querySelectorAll('.tools-section .tools-tab');
  var panels = document.querySelectorAll('.tools-section .tool-panel');
  if (!panels.length) return;

  function setActive(index) {
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p, i) {
      p.classList.toggle('active', i === index);
    });
  }

  // Tabs jump directly to a panel.
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      panels[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(i);
    });
  });

  // Active tab follows native scroll position.
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (e) {
        if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
      });
      if (best) {
        var idx = parseInt(best.target.getAttribute('data-index'), 10);
        setActive(idx);
      }
    }, { rootMargin: '-150px 0px -40% 0px', threshold: [0.25, 0.5, 0.75, 1] });
    panels.forEach(function (p) { observer.observe(p); });
  }
})();
