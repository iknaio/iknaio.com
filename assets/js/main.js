(function () {
  'use strict';

  // Theme toggle (init happens inline in <head> to avoid FOUC)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (err) {}
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  // Mobile nav toggle
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.nav-toggle');
    if (toggle) {
      var nav = document.querySelector('.nav-menu');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav-menu--open');
    }
  });

  // Dropdown toggle
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.nav-dropdown-toggle');
    if (trigger) {
      e.preventDefault();
      var dropdown = trigger.closest('.nav-dropdown');
      var isOpen = dropdown.classList.toggle('nav-dropdown--open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown--open').forEach(function (el) {
        el.classList.remove('nav-dropdown--open');
      });
    }
  });

  // Scroll reveal animation — only for sections below the fold
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    var viewportHeight = window.innerHeight;
    document.querySelectorAll('.section').forEach(function (section) {
      var rect = section.getBoundingClientRect();
      // Only add reveal to sections that start below the viewport
      if (rect.top > viewportHeight * 0.8) {
        section.classList.add('reveal');
        revealObserver.observe(section);
      }
    });
  }

  // Nav background on scroll
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  // Platform scroll-spy: highlight the tab matching the section currently in view.
  // The trigger band sits just below the sticky tab strip and covers the upper
  // ~40% of the viewport, so a section becomes "active" as its heading scrolls
  // into the area where the user is reading.
  var tabs = document.querySelectorAll('.platform-tab');
  var tools = document.querySelectorAll('.platform-tool');
  if (tabs.length && tools.length && 'IntersectionObserver' in window) {
    var visible = new Set();
    function setActive(slug) {
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t.getAttribute('href') === '#' + slug);
      });
    }
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      });
      if (visible.size === 0) return;
      var top = null;
      visible.forEach(function (el) {
        if (!top || el.getBoundingClientRect().top < top.getBoundingClientRect().top) top = el;
      });
      if (top) setActive(top.id);
    }, { rootMargin: '-130px 0px -60% 0px', threshold: 0 });
    tools.forEach(function (t) { spy.observe(t); });
  }

  // Copy-to-clipboard buttons on article code blocks.
  // Scoped to .content so nav/footer/inline snippets are left alone.
  document.querySelectorAll('.content pre').forEach(function (pre) {
    if (pre.querySelector('.code-copy')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.textContent = 'Copy';
    pre.appendChild(btn);
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.code-copy');
    if (!btn) return;
    var pre = btn.closest('pre');
    if (!pre) return;
    var code = pre.querySelector('code') || pre;
    // Hugo's chroma highlighter wraps each line in `<span style="display:flex">…\n</span>`.
    // innerText then doubles up newlines (one from the literal `\n` inside the span,
    // one from the block-level flex wrapper), which breaks `\`-continued shell commands.
    // Read text per line from those wrappers instead.
    var lineSpans = code.querySelectorAll(':scope > span');
    var text = lineSpans.length
      ? Array.from(lineSpans).map(function (l) { return l.textContent.replace(/\n+$/, ''); }).join('\n')
      : code.textContent;
    text = text.replace(/\nCopy$/, '');
    var done = function () {
      var original = 'Copy';
      btn.textContent = 'Copied';
      btn.classList.add('code-copy--done');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('code-copy--done');
      }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    } else {
      // Fallback for very old browsers / non-secure contexts
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(ta);
    }
  });
})();
