(function () {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('activo');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-abierto', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (mainNav.classList.contains('activo')) {
          mainNav.classList.remove('activo');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-abierto');
        }
      });
    });
  }

  /* ======= DROPDOWN PRODUCTOS (toggle en móvil) ======= */
  document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.closest('.has-dropdown');
      if (!parent) return;
      var isOpen = parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  if (header) {
    let lastScroll = 0;
    const onScroll = function () {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = header ? header.offsetHeight + 20 : 0;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ======= BOTONES DE CONVERSIÓN (WhatsApp + Llamada) ======= */
  var CONVERSION_CONFIG = {
    phone: '+529514582985',
    whatsapp: '529514582985',
    companyName: 'Lácteo Industria Soto'
  };

  // WhatsApp
  var waModal = document.getElementById('wa-modal');
  var waForm = document.getElementById('wa-form');
  var openWaBtns = document.querySelectorAll('.open-wa-modal, a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com/send"]');
  var waCloseBtn = document.querySelector('.wa-modal-close');

  function openWaModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!waModal) return;
    waModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeWaModal() {
    if (!waModal) return;
    waModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openWaBtns.forEach(function (btn) {
    btn.addEventListener('click', openWaModal);
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWaModal(e); }
    });
  });
  if (waCloseBtn) waCloseBtn.addEventListener('click', closeWaModal);
  if (waModal) waModal.addEventListener('click', function (e) { if (e.target === waModal) closeWaModal(); });

  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('wa-name').value.trim();
      var service = document.getElementById('wa-service').value;
      if (!name || !service) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'event': 'whatsapp_lead', 'lead_name': name, 'lead_service': service });
      window.dataLayer.push({ 'event': 'user_data_capture', 'user_data': { 'address': { 'first_name': name } } });

      var message = 'Hola, soy ' + name + '. Me interesa: ' + service + '.';
      window.open('https://wa.me/' + CONVERSION_CONFIG.whatsapp + '?text=' + encodeURIComponent(message), '_blank');
      closeWaModal();
      waForm.reset();
    });
  }

  // Llamada
  var callModal = document.getElementById('call-modal');
  var confirmCallBtn = document.getElementById('confirm-call-btn');
  var cancelCallBtn = document.getElementById('cancel-call-btn');
  var callTriggers = document.querySelectorAll('.floating-call-btn, a[href^="tel:"]');

  function openCallModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!callModal) return;
    callModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCallModal() {
    if (!callModal) return;
    callModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  callTriggers.forEach(function (t) {
    t.addEventListener('click', openCallModal);
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCallModal(e); }
    });
  });
  if (cancelCallBtn) cancelCallBtn.addEventListener('click', closeCallModal);
  if (callModal) callModal.addEventListener('click', function (e) { if (e.target === callModal) closeCallModal(); });

  if (confirmCallBtn) {
    confirmCallBtn.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'event': 'call_confirmed', 'destination_number': CONVERSION_CONFIG.phone });
      window.location.href = 'tel:' + CONVERSION_CONFIG.phone;
      closeCallModal();
    });
  }

  // Escape cierra ambos modales
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (waModal && waModal.classList.contains('active')) closeWaModal();
    if (callModal && callModal.classList.contains('active')) closeCallModal();
  });

  const anioEl = document.querySelector('[data-anio]');
  if (anioEl) {
    anioEl.textContent = String(new Date().getFullYear());
  }

  /* ======= HERO VIDEO — CARGA DIFERIDA (no bloquea LCP) ======= */
  if (!RM) {
    var heroVideo = document.querySelector('.hero-video-bg .hero-video');
    if (heroVideo) {
      var startHeroVideo = function () {
        heroVideo.querySelectorAll('source[data-src]').forEach(function (s) {
          s.src = s.dataset.src;
          s.removeAttribute('data-src');
        });
        heroVideo.load();
        var playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(function () {
            heroVideo.classList.add('is-ready');
          }).catch(function () {});
        } else {
          heroVideo.classList.add('is-ready');
        }
      };
      var fire = function () { setTimeout(startHeroVideo, 1200); };
      if (document.readyState === 'complete') {
        fire();
      } else {
        window.addEventListener('load', fire, { once: true });
      }
    }
  }

  /* ======= RAPTOR LIB 02 — COUNTERS ======= */
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window && !RM) {
    var animateCount = function (el) {
      var end = parseInt(el.dataset.countTo, 10);
      var suffix = el.dataset.countSuffix || '';
      var duration = 1400;
      var start = performance.now();
      el.textContent = '0' + suffix;
      var tick = function (now) {
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          countIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { countIO.observe(c); });
  }

  /* ======= RAPTOR LIB 01 — REVEAL ON SCROLL (IO fallback) ======= */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window && !RM) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealIO.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }


  /* ======= RAPTOR LIB 05 — 3D TILT (desktop hover only) ======= */
  if (!RM && window.matchMedia('(hover: hover)').matches) {
    var MAX_TILT = 6;
    document.querySelectorAll('.producto-card').forEach(function (card) {
      card.addEventListener('pointermove', function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'translateY(-6px) rotateX(' + (-y * MAX_TILT) + 'deg) rotateY(' + (x * MAX_TILT) + 'deg)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });

    /* ======= RAPTOR LIB 04 — MAGNETIC BUTTONS ======= */
    document.querySelectorAll('.hero-buttons .btn, .cta-final .btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (ev) {
        var r = btn.getBoundingClientRect();
        var x = ev.clientX - (r.left + r.width / 2);
        var y = ev.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
      });
    });
  }

})();
