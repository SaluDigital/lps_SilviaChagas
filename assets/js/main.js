/* Dra. Silvia Chagas — interações (vanilla, sem dependências) */
(function () {
  var d = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Rastreamento: cada CTA possui data-event e data-cta-origin (GTM / GA4 / Ads / Meta) */
  window.dataLayer = window.dataLayer || [];
  d.addEventListener('click', function (e) {
    var el = e.target.closest('[data-event]');
    if (!el) return;
    var payload = {
      event: el.getAttribute('data-event'),
      cta_origin: el.getAttribute('data-cta-origin') || '',
      cta_intent: el.getAttribute('data-intent') || '',
      link_url: el.href || ''
    };
    window.dataLayer.push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', payload.event, payload);
    if (typeof window.fbq === 'function' && el.hasAttribute('data-wa')) window.fbq('track', 'Contact', { content_name: payload.cta_origin });
  });

  /* Reveal */
  var rev = d.querySelectorAll('[data-reveal]');
  if (!hasIO || reduce) {
    rev.forEach(function (n) { n.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    rev.forEach(function (n) { io.observe(n); });
  }

  /* Contadores (+40) */
  d.querySelectorAll('[data-count]').forEach(function (n) {
    var end = +n.getAttribute('data-count');
    if (!hasIO || reduce) return;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), dur = 1400;
      (function step(t) {
        var p = Math.min(1, (t - t0) / dur);
        n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: 0.6 });
    o.observe(n);
  });

  /* FAQ accordion */
  d.querySelectorAll('.faq__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.faq__item');
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* Antes e depois */
  d.querySelectorAll('.ba').forEach(function (ba) {
    var r = ba.querySelector('input');
    var f = function () { ba.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', f); f();
  });

  /* Tons do clareamento: leve movimento ao entrar na tela (só transform, sem relayout) */
  var sh = d.querySelector('.shades');
  if (sh) {
    sh.querySelectorAll('span').forEach(function (s, k) { s.style.transitionDelay = (k * 70) + 'ms'; });
    if (!hasIO || reduce) sh.classList.add('is-in');
    else {
      var so = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        so.disconnect(); sh.classList.add('is-in');
      }, { threshold: 0.4 });
      so.observe(sh);
    }
  }
})();
