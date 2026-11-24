/* Homepage tools section.
   Desktop ("pinned" mode): the tab bar and one product stay fixed under the nav while the
   page scrolls; every stretch of scrolling moves on to the next product, and clicking a tab
   scrolls to that product's stretch (Figma "Tab Scroll animation").
   Small screens, short windows and reduced motion: the products stack and the active tab
   follows the scroll position, as before. */
(function () {
  var section = document.querySelector('.tools-section');
  if (!section) return;
  var stage = section.querySelector('.tools-stage');
  var bar = section.querySelector('.tools-tabs-bar');
  var tabs = Array.prototype.slice.call(section.querySelectorAll('.tools-tab'));
  var panels = Array.prototype.slice.call(section.querySelectorAll('.tool-panel'));
  if (!stage || !panels.length || tabs.length !== panels.length) return;

  var NAV = 75.2;          // fixed nav height (matches the CSS)
  var STEP_VH = 0.8;       // scroll distance per product, as a share of the window height
  var mqWide = window.matchMedia('(min-width: 961px) and (min-height: 640px)');
  var mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pinned = false;
  var current = -1;
  var step = 0;

  function setActive(index) {
    if (index === current) return;
    current = index;
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p, i) { p.classList.toggle('active', i === index); });
  }

  function sectionTop() {
    return section.getBoundingClientRect().top + window.scrollY;
  }

  // Scroll position at which product i is shown.
  function positionFor(i) {
    return sectionTop() - NAV + i * step;
  }

  function onScroll() {
    if (!pinned) return;
    var scrolled = window.scrollY + NAV - sectionTop();
    var max = (panels.length - 1) * step;
    var index = Math.round(Math.min(Math.max(scrolled, 0), max) / step);
    setActive(index);
  }

  function layout() {
    var want = mqWide.matches && !mqMotion.matches;
    if (want) {
      // Only pin if every product fits in the window below the tabs.
      section.classList.add('tools-pinned');
      var room = stage.clientHeight - bar.offsetHeight;
      var fits = panels.every(function (p) { return p.scrollHeight <= room; });
      if (!fits) want = false;
    }
    pinned = want;
    section.classList.toggle('tools-pinned', pinned);
    if (pinned) {
      step = window.innerHeight * STEP_VH;
      section.style.height = (stage.offsetHeight + (panels.length - 1) * step) + 'px';
      current = -1;
      onScroll();
    } else {
      section.style.height = '';
    }
  }

  // Stacked mode: the active tab follows whichever product is in view.
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (pinned) return;
      var best = null;
      entries.forEach(function (e) {
        if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
      });
      if (best) setActive(parseInt(best.target.getAttribute('data-index'), 10));
    }, { rootMargin: '-150px 0px -40% 0px', threshold: [0.25, 0.5, 0.75, 1] });
    panels.forEach(function (p) { observer.observe(p); });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      if (pinned) window.scrollTo({ top: positionFor(i), behavior: 'smooth' });
      else panels[i].scrollIntoView({ behavior: mqMotion.matches ? 'auto' : 'smooth', block: 'start' });
      setActive(i);
    });
  });

  window.addEventListener('scroll', function () { window.requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', layout);
  if (mqWide.addEventListener) {
    mqWide.addEventListener('change', layout);
    mqMotion.addEventListener('change', layout);
  }
  // A link straight to a tool (e.g. /#tool-quicklock) opens on that product. The browser's
  // own jump to the anchor lands inside the pinned stage, so move to the product's stretch.
  function openFromHash() {
    panels.forEach(function (p, i) {
      if (location.hash === '#' + p.id) {
        if (pinned) window.scrollTo({ top: positionFor(i), behavior: 'auto' });
        setActive(i);
      }
    });
  }

  layout();
  // Screenshots load lazily; re-check that products fit once they have.
  window.addEventListener('load', function () {
    layout();
    window.requestAnimationFrame(openFromHash);
  });
  if (document.readyState === 'complete') openFromHash();
})();
