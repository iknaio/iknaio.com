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
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

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

  // ---------------------------------------------------------------------------
  // Lightbox / Image Overlay
  // ---------------------------------------------------------------------------

  // Create lightbox overlay element
  var lightboxOverlay = null;
  var lightboxImage = null;
  var lightboxClose = null;
  var lightboxNavPrev = null;
  var lightboxNavNext = null;
  var currentImageIndex = -1;
  var allImages = [];

  function createLightbox() {
    if (lightboxOverlay) return;

    lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    lightboxOverlay.setAttribute('role', 'dialog');

    var lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';

    lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    lightboxImage.alt = '';
    lightboxContent.appendChild(lightboxImage);

    // Close button
    lightboxClose = document.createElement('button');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.setAttribute('aria-label', 'Close image');
    lightboxClose.innerHTML = '&times;';
    lightboxContent.appendChild(lightboxClose);

    // Navigation buttons
    lightboxNavPrev = document.createElement('button');
    lightboxNavPrev.className = 'lightbox-nav lightbox-nav--prev lightbox-nav--hidden';
    lightboxNavPrev.setAttribute('aria-label', 'Previous image');
    lightboxNavPrev.innerHTML = '&larr;';
    lightboxContent.appendChild(lightboxNavPrev);

    lightboxNavNext = document.createElement('button');
    lightboxNavNext.className = 'lightbox-nav lightbox-nav--next lightbox-nav--hidden';
    lightboxNavNext.setAttribute('aria-label', 'Next image');
    lightboxNavNext.innerHTML = '&rarr;';
    lightboxContent.appendChild(lightboxNavNext);

    lightboxOverlay.appendChild(lightboxContent);
    document.body.appendChild(lightboxOverlay);

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNavPrev.addEventListener('click', navigateLightbox);
    lightboxNavNext.addEventListener('click', navigateLightbox);
    lightboxOverlay.addEventListener('click', function (e) {
      if (e.target === lightboxOverlay) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightboxOverlay.classList.contains('lightbox-overlay--open')) return;
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox({ currentTarget: lightboxNavPrev });
          break;
        case 'ArrowRight':
          navigateLightbox({ currentTarget: lightboxNavNext });
          break;
      }
    });
  }

  function collectImages(context) {
    // Collect all images from article content
    var selectors = ['.article-cover img', '.content img', '.insights-hero-image', '.post-card-image img'];
    
    allImages = [];
    selectors.forEach(function (selector) {
      var images = context.querySelectorAll(selector);
      images.forEach(function (img) {
        // Use data-src if available (for lazy loading), otherwise src
        var src = img.getAttribute('data-src') || img.src || img.getAttribute('src');
        // Resolve relative URLs to absolute
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
          src = '/' + src;
        }
        allImages.push({
          src: src,
          alt: img.alt || '',
          element: img
        });
      });
    });
  }

  function openLightbox(index, e) {
    if (e) e.preventDefault();
    if (!lightboxOverlay) createLightbox();
    
    currentImageIndex = index;
    updateLightboxImage();
    lightboxOverlay.classList.add('lightbox-overlay--open');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateNavVisibility();
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('lightbox-overlay--open');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentImageIndex = -1;
  }

  function updateLightboxImage() {
    if (currentImageIndex < 0 || currentImageIndex >= allImages.length) return;
    var imgData = allImages[currentImageIndex];
    lightboxImage.src = imgData.src;
    lightboxImage.alt = imgData.alt;
  }

  function updateNavVisibility() {
    if (!lightboxNavPrev || !lightboxNavNext) return;
    
    if (allImages.length <= 1) {
      lightboxNavPrev.classList.add('lightbox-nav--hidden');
      lightboxNavNext.classList.add('lightbox-nav--hidden');
    } else {
      lightboxNavPrev.classList.toggle('lightbox-nav--hidden', currentImageIndex <= 0);
      lightboxNavNext.classList.toggle('lightbox-nav--hidden', currentImageIndex >= allImages.length - 1);
    }
  }

  function navigateLightbox(e) {
    e.preventDefault();
    var direction = e.currentTarget === lightboxNavPrev ? -1 : 1;
    var newIndex = currentImageIndex + direction;
    
    if (newIndex >= 0 && newIndex < allImages.length) {
      currentImageIndex = newIndex;
      updateLightboxImage();
      updateNavVisibility();
    }
  }

  // Initialize lightbox on article/insights pages
  function initLightbox() {
    // Only initialize on pages with article content
    var article = document.querySelector('.section-article');
    var insightsList = document.querySelector('.section-insights-list');
    var insightsHero = document.querySelector('.platform-hero');
    
    if (article) {
      collectImages(article);
      if (allImages.length > 0) {
        createLightbox();
        // Add click handlers to all images in article
        article.querySelectorAll('.article-cover img, .content img').forEach(function (img, index) {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', function (e) {
            // Find the index of this image in allImages
            var imgSrc = img.getAttribute('data-src') || img.src;
            var foundIndex = allImages.findIndex(function (item) {
              return item.src === imgSrc;
            });
            if (foundIndex >= 0) {
              openLightbox(foundIndex, e);
            }
          });
        });
      }
    }
    
    if (insightsList) {
      collectImages(insightsList);
      if (allImages.length > 0) {
        if (!lightboxOverlay) createLightbox();
        insightsList.querySelectorAll('.insights-hero-image, .post-card-image img').forEach(function (img, index) {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', function (e) {
            var imgSrc = img.getAttribute('data-src') || img.src;
            var foundIndex = allImages.findIndex(function (item) {
              return item.src === imgSrc;
            });
            if (foundIndex >= 0) {
              openLightbox(foundIndex, e);
            }
          });
        });
      }
    }
    
    if (insightsHero) {
      collectImages(insightsHero);
      if (allImages.length > 0) {
        if (!lightboxOverlay) createLightbox();
        insightsHero.querySelectorAll('.insights-hero-image').forEach(function (img, index) {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', function (e) {
            var imgSrc = img.getAttribute('data-src') || img.src;
            var foundIndex = allImages.findIndex(function (item) {
              return item.src === imgSrc;
            });
            if (foundIndex >= 0) {
              openLightbox(foundIndex, e);
            }
          });
        });
      }
    }
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }

  // Also initialize when navigating with Turbo/SPA if present
  document.addEventListener('turbo:load', initLightbox);
  document.addEventListener('page:change', initLightbox);
})();
