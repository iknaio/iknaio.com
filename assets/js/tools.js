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
  if (!panels.length) return;
  // Pinned mode needs the stage, the tab bar and one tab per product; without them the
  // products stay stacked, but tab clicks and the active tab still work.
  var canPin = !!(stage && bar && tabs.length === panels.length);

  var NAV = 75.2;          // fixed nav height (matches the CSS)
  var STEP_VH = 0.8;       // scroll distance per product, as a share of the window height
  var mqWide = window.matchMedia('(min-width: 961px) and (min-height: 640px)');
  var mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pinned = false;
  var current = -1;
  var step = 0;
  var observer = null;
  // While a tab click scrolls to its product, keep that tab active instead of flipping
  // through the products in between.
  var target = null;       // { index }
  var targetTimer = 0;
  var ticking = false;

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

  // Scroll position at which product i is shown: the start of its stretch. Each product has
  // a stretch of the same length, the last one ending where the stage unpins.
  function positionFor(i) {
    return Math.ceil(sectionTop() - NAV + i * step);
  }

  function clearTarget() {
    target = null;
    window.clearTimeout(targetTimer);
  }

  function onScroll() {
    ticking = false;
    if (!pinned) return;
    var scrolled = window.scrollY + NAV - sectionTop();
    // +1 absorbs sub-pixel scroll positions at the very start of a stretch.
    var index = Math.min(Math.max(Math.floor((scrolled + 1) / step), 0), panels.length - 1);
    if (target) {
      if (index !== target.index) return;
      clearTarget();
    }
    setActive(index);
  }

  // Stacked mode: re-observe the panels so the observer reports which one is in view now.
  function resyncStacked() {
    if (!observer) return;
    panels.forEach(function (p) { observer.unobserve(p); observer.observe(p); });
  }

  function layout() {
    var wasPinned = pinned;
    var want = canPin && mqWide.matches && !mqMotion.matches;
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
      section.style.height = (stage.offsetHeight + panels.length * step) + 'px';
      if (!target) {
        current = -1;
        onScroll();
      }
    } else {
      section.style.height = '';
      clearTarget();
      if (wasPinned) resyncStacked();
    }
  }

  // Stacked mode: the active tab follows whichever product is in view.
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
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
    if (!panels[i]) return;
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      if (pinned) {
        var top = positionFor(i);
        clearTarget();
        if (Math.abs(window.scrollY - top) > 2) {
          target = { index: i };
          // Fallback for browsers without 'scrollend', or a scroll cut short by the user.
          targetTimer = window.setTimeout(function () { clearTarget(); onScroll(); }, 1500);
        }
        window.scrollTo({ top: top, behavior: 'smooth' });
      } else {
        panels[i].scrollIntoView({ behavior: mqMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }
      setActive(i);
    });
  });

  window.addEventListener('scroll', function () {
    if (!pinned || ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener('scrollend', function () {
    if (!target) return;
    clearTarget();
    onScroll();
  });
  // A wheel, touch or key scroll during a tab-click scroll hands control back to the scroll.
  ['wheel', 'touchstart', 'keydown'].forEach(function (type) {
    window.addEventListener(type, function () { if (target) clearTarget(); }, { passive: true });
  });
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
        // 'instant', not 'auto': 'auto' follows html { scroll-behavior: smooth }.
        if (pinned) {
          clearTarget();
          window.scrollTo({ top: positionFor(i), behavior: 'instant' });
        }
        setActive(i);
      }
    });
  }

  layout();
  // Screenshots load lazily, often after the window's 'load' event, and only then get their
  // real height: re-check that every product still fits whenever one arrives.
  var relayoutQueued = false;
  function queueLayout() {
    if (relayoutQueued) return;
    relayoutQueued = true;
    window.requestAnimationFrame(function () { relayoutQueued = false; layout(); });
  }
  section.querySelectorAll('.tool-screenshot').forEach(function (img) {
    if (!img.complete) img.addEventListener('load', queueLayout);
  });
  window.addEventListener('load', function () {
    layout();
    window.requestAnimationFrame(openFromHash);
  });
  // Later jumps to a tool (back/forward, an edited URL, in-page links) too.
  window.addEventListener('hashchange', function () { window.requestAnimationFrame(openFromHash); });
  if (document.readyState === 'complete') openFromHash();
})();
