/* Interactive case figure: a Pathfinder graph, followed step by step.
 *
 * Markup (in the post):
 *   <figure class="pl-story" data-src="case.json"
 *           data-svg-light="graph-light.svg" data-svg-dark="graph-dark.svg"
 *           data-min-width="760">                  (optional: the closest zoom)
 *     <img class="pl-story-fallback" ...>          (shown without JavaScript)
 *     <ol class="pl-story-steps"><li data-label="Split">Caption ...</li> ...</ol>
 *     <figcaption>...</figcaption>
 *   </figure>
 *
 * The SVGs are Pathfinder's own drawing of the case, exported from the app in
 * its light and dark mode, with every address tagged data-node="<id>" and
 * every transaction, edge and link tagged data-edge="<id>". The JSON holds
 * the addresses and the nodes and edges each step adds. Each step zooms to
 * its part of the graph, fades what came before and hides what comes later.
 * The graph stays in view while the page scrolls past it, and the scroll
 * position selects the step. The step buttons scroll to their step.
 */
(function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";
  var PATHFINDER = "https://app.iknaio.com/pathfinder/";
  var MIN_WIDTH = 760; // graph units: the closest zoom, unless the figure sets data-min-width
  var PAD = 70;
  var ZOOM_MS = 700;
  var STEP_SCROLL = 0.5; // scroll distance of one step, in viewport heights
  var NAV_HEIGHT = 76; // the fixed site navigation

  var STYLE = [
    ".pl-story{margin:2rem 0;}",
    ".pl-story-stage{position:sticky;background:var(--color-white,#FFF);padding-bottom:4px;}",
    ".pl-story-canvas{position:relative;aspect-ratio:2.1/1;border-radius:var(--radius-md,8px);overflow:hidden;background:#F9FBFC;border:1px solid var(--color-gray,#D9D9D9);}",
    "[data-theme=dark] .pl-story-canvas{background:#2D353D;}",
    ".pl-story-canvas svg{display:block;width:100%;height:100%;}",
    ".pl-story [data-node],.pl-story [data-edge]{transition:opacity .4s;}",
    ".pl-story .pl-past{opacity:.3;}",
    ".pl-story .pl-future{opacity:.06;}",
    // stronger than the site's article link rule (.content a:not(.btn)...), which underlines
    ".content .pl-story svg a.pl-link:not(.btn),.pl-story svg a.pl-link{cursor:pointer;text-decoration:none;}",
    ".pl-story-controls{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}",
    ".pl-story-controls button{font:inherit;font-size:.8rem;padding:3px 9px;border-radius:var(--radius-sm,4px);border:1px solid var(--color-gray,#D9D9D9);background:var(--color-white,#FFF);color:var(--color-dark,#2A2A2A);cursor:pointer;}",
    ".pl-story-controls button[aria-pressed=true]{background:var(--color-primary,#2BDD96);border-color:var(--color-primary,#2BDD96);color:#1A1A1A;}",
    ".pl-story-controls button:disabled{opacity:.4;cursor:default;}",
    ".pl-story-caption{min-height:3.2em;margin:10px 0 0;}",
    ".pl-story.ready .pl-story-steps,.pl-story.ready .pl-story-fallback{display:none;}",
    "@media (prefers-reduced-motion:reduce){.pl-story [data-node],.pl-story [data-edge]{transition:none;}}",
  ].join("\n");

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function dark() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function fetchText(url) {
    return fetch(url).then(function (response) { return response.text(); });
  }

  function parseBox(svg) {
    var v = svg.getAttribute("viewBox").split(/[\s,]+/).map(Number);
    return { x: v[0], y: v[1], w: v[2], h: v[3] };
  }

  /* The box of an element in the coordinates of the whole drawing. */
  function boxIn(svg, element) {
    var b = element.getBBox();
    var m = svg.getScreenCTM().inverse().multiply(element.getScreenCTM());
    var xs = [];
    var ys = [];
    [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].forEach(function (c) {
      xs.push(m.a * c[0] + m.c * c[1] + m.e);
      ys.push(m.b * c[0] + m.d * c[1] + m.f);
    });
    return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
  }

  function render(figure, data, sources) {
    var items = Array.prototype.slice.call(figure.querySelectorAll(".pl-story-steps > li"));
    var nodes = {};
    data.nodes.forEach(function (n) { nodes[n.id] = n; });
    var minWidth = Number(figure.getAttribute("data-min-width")) || MIN_WIDTH;
    var edges = {};
    data.edges.forEach(function (e) { edges[e.id] = e; });

    var canvas = document.createElement("div");
    canvas.className = "pl-story-canvas";
    var controls = document.createElement("div");
    controls.className = "pl-story-controls";
    var caption = document.createElement("p");
    caption.className = "pl-story-caption";
    caption.setAttribute("aria-live", "polite");

    var svg = null;
    var full = null;
    var view = null;
    var state = 0; // 0: the whole case; 1..n: up to that step
    var animation = 0;

    function setView(box) {
      view = box;
      svg.setAttribute("viewBox", [box.x, box.y, box.w, box.h].join(" "));
    }

    function zoomTo(target) {
      window.cancelAnimationFrame(animation);
      if (!view || reducedMotion()) {
        setView(target);
        return;
      }
      var start = view;
      var t0 = null;
      function frame(now) {
        if (t0 === null) t0 = now;
        var t = Math.min(1, (now - t0) / ZOOM_MS);
        var k = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setView({
          x: start.x + (target.x - start.x) * k,
          y: start.y + (target.y - start.y) * k,
          w: start.w + (target.w - start.w) * k,
          h: start.h + (target.h - start.h) * k,
        });
        if (t < 1) animation = window.requestAnimationFrame(frame);
      }
      animation = window.requestAnimationFrame(frame);
    }

    /* The view of one step: the addresses it frames (step.view), its
     * transactions and links (the parts of an edge that carry a label, not
     * the lines to other addresses), shaped like the canvas and never closer
     * than minWidth. */
    function stepView(step) {
      var parts = [];
      (step.view || step.nodes).forEach(function (id) { parts = parts.concat(Array.prototype.slice.call(svg.querySelectorAll('[data-node="' + id + '"]'))); });
      step.edges.forEach(function (id) {
        Array.prototype.forEach.call(svg.querySelectorAll('[data-edge="' + id + '"]'), function (element) {
          if (element.querySelector("text")) parts.push(element);
        });
      });
      var box = null;
      parts.forEach(function (part) {
        var b = boxIn(svg, part);
        box = box ? { x0: Math.min(box.x0, b.x0), y0: Math.min(box.y0, b.y0), x1: Math.max(box.x1, b.x1), y1: Math.max(box.y1, b.y1) } : b;
      });
      var ratio = canvas.clientWidth / canvas.clientHeight || 2.1;
      var w = Math.max(minWidth, box.x1 - box.x0 + 2 * PAD);
      var h = Math.max(box.y1 - box.y0 + 2 * PAD, w / ratio);
      w = Math.max(w, h * ratio);
      var cx = (box.x0 + box.x1) / 2;
      var cy = (box.y0 + box.y1) / 2;
      return { x: cx - w / 2, y: cy - h / 2, w: w, h: h };
    }

    function apply(animate) {
      var seen = {};
      var current = {};
      data.steps.forEach(function (step, i) {
        if (state !== 0 && i + 1 > state) return;
        step.nodes.concat(step.edges).forEach(function (id) {
          seen[id] = true;
          if (i + 1 === state) current[id] = true;
        });
      });
      Array.prototype.forEach.call(svg.querySelectorAll("[data-node],[data-edge]"), function (element) {
        var id = element.getAttribute("data-node") || element.getAttribute("data-edge");
        element.classList.toggle("pl-future", !seen[id]);
        element.classList.toggle("pl-past", state !== 0 && !!seen[id] && !current[id]);
      });
      var target = state === 0 ? full : stepView(data.steps[state - 1]);
      if (animate) zoomTo(target);
      else setView(target);
    }

    function show(target) {
      state = Math.max(0, Math.min(data.steps.length, target));
      apply(true);
      overview.setAttribute("aria-pressed", String(state === 0));
      stepButtons.forEach(function (b, i) { b.setAttribute("aria-pressed", String(state === i + 1)); });
      prev.disabled = state === 0;
      next.disabled = state === data.steps.length;
      if (state === 0) {
        caption.textContent = figure.getAttribute("data-overview") || "";
      } else {
        caption.replaceChildren.apply(caption, Array.prototype.slice.call(items[state - 1].cloneNode(true).childNodes));
      }
    }

    /* Put in the drawing of the current site theme; the theme switch swaps it. */
    function mount() {
      var doc = new DOMParser().parseFromString(dark() ? sources.dark : sources.light, "image/svg+xml");
      var fresh = document.importNode(doc.documentElement, true);
      fresh.setAttribute("role", "img");
      fresh.setAttribute("aria-label", figure.getAttribute("data-label") || "Case graph");
      fresh.setAttribute("preserveAspectRatio", "xMidYMid meet");
      Array.prototype.forEach.call(fresh.querySelectorAll("[data-node]"), function (group) {
        var node = nodes[group.getAttribute("data-node")];
        if (!node) return;
        var link = document.createElementNS(SVG, "a");
        link.setAttribute("href", PATHFINDER + node.network + "/address/" + node.address);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener");
        link.setAttribute("class", "pl-link");
        var title = document.createElementNS(SVG, "title");
        title.textContent = node.label + ", " + node.network_name + ": " + node.address + " (opens in Pathfinder)";
        group.parentNode.insertBefore(link, group);
        link.appendChild(title);
        link.appendChild(group);
      });
      if (svg) canvas.replaceChild(fresh, svg);
      else canvas.appendChild(fresh);
      svg = fresh;
      full = parseBox(svg);
      view = null;
      apply(false);
    }

    function button(text) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      controls.appendChild(b);
      return b;
    }

    var prev = button("‹");
    prev.setAttribute("aria-label", "Previous step");
    var overview = button("Whole case");
    var stepButtons = data.steps.map(function (_, i) {
      var label = (items[i] && items[i].getAttribute("data-label")) || "Step";
      return button(i + 1 + " " + label);
    });
    var next = button("›");
    next.setAttribute("aria-label", "Next step");

    var track = document.createElement("div");
    track.className = "pl-story-track";
    var stage = document.createElement("div");
    stage.className = "pl-story-stage";
    stage.appendChild(canvas);
    stage.appendChild(controls);
    stage.appendChild(caption);
    track.appendChild(stage);
    var list = figure.querySelector(".pl-story-steps");
    figure.insertBefore(track, list);
    figure.classList.add("ready");
    mount();
    show(0);

    /* The track is taller than the stage by one scroll distance per step.
     * While the stage sticks, the scrolled part of that extra height picks
     * the step: the whole case first, then each step in turn. */
    function stepHeight() {
      return window.innerHeight * STEP_SCROLL;
    }

    /* The stage sticks centred in the viewport below the navigation. */
    var stickyTop = NAV_HEIGHT;
    function layout() {
      stickyTop = Math.max(NAV_HEIGHT + 16, Math.round((window.innerHeight + NAV_HEIGHT - stage.offsetHeight) / 2));
      stage.style.top = stickyTop + "px";
      track.style.height = stage.offsetHeight + data.steps.length * stepHeight() + "px";
    }

    function stateFromScroll() {
      var scrolled = stickyTop - track.getBoundingClientRect().top;
      return Math.max(0, Math.min(data.steps.length, Math.floor(scrolled / stepHeight() + 0.5)));
    }

    var pending = false;
    function onScroll() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        var target = stateFromScroll();
        if (target !== state) show(target);
      });
    }

    function scrollToStep(target) {
      target = Math.max(0, Math.min(data.steps.length, target));
      var top = window.scrollY + track.getBoundingClientRect().top - stickyTop + target * stepHeight();
      window.scrollTo({ top: top, behavior: reducedMotion() ? "auto" : "smooth" });
      show(target);
    }

    prev.onclick = function () { scrollToStep(state - 1); };
    next.onclick = function () { scrollToStep(state + 1); };
    overview.onclick = function () { scrollToStep(0); };
    stepButtons.forEach(function (b, i) { b.onclick = function () { scrollToStep(i + 1); }; });

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", onScroll, { passive: true });

    new MutationObserver(mount).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  function init() {
    var figures = document.querySelectorAll("figure.pl-story[data-src]");
    if (!figures.length) return;
    var style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);
    Array.prototype.forEach.call(figures, function (figure) {
      Promise.all([
        fetch(figure.getAttribute("data-src")).then(function (response) { return response.json(); }),
        fetchText(figure.getAttribute("data-svg-light")),
        fetchText(figure.getAttribute("data-svg-dark")),
      ]).then(function (loaded) {
        render(figure, loaded[0], { light: loaded[1], dark: loaded[2] });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
