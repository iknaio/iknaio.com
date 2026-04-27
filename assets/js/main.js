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
})();
