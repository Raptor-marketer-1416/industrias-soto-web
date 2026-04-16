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

  const modal = document.querySelector('.modal-llamada');
  const modalCerrar = document.querySelectorAll('[data-cerrar-modal]');
  const triggersLlamada = document.querySelectorAll('[data-abrir-llamada]');

  function abrirModal() {
    if (!modal) return;
    modal.classList.add('activo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('main, header, footer').forEach(function (el) { el.inert = true; });
  }
  function cerrarModal() {
    if (!modal) return;
    modal.classList.remove('activo');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelectorAll('main, header, footer').forEach(function (el) { el.inert = false; });
  }

  triggersLlamada.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      abrirModal();
    });
  });
  modalCerrar.forEach(function (btn) {
    btn.addEventListener('click', cerrarModal);
  });
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) cerrarModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('activo')) cerrarModal();
    });
  }

  const anioEl = document.querySelector('[data-anio]');
  if (anioEl) {
    anioEl.textContent = String(new Date().getFullYear());
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
