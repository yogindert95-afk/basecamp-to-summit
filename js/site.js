/* ============ Base Camp to Summit — shared behaviour ============ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- mobile nav toggle ----
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-burger');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // ---- scroll progress bar + nav shadow ----
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  var onScrollChrome = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScrollChrome, { passive: true });
  onScrollChrome();

  // ---- snowfall on any .snowfield element ----
  document.querySelectorAll('.snowfield').forEach(function (snow) {
    if (reduce) return;
    for (var i = 0; i < 14; i++) {
      var f = document.createElement('div');
      var size = 2 + Math.random() * 2;
      f.style.cssText = 'position:absolute;top:-10px;border-radius:50%;background:' +
        (i % 2 ? '#c9d4d2' : '#eef2ee') + ';opacity:' + (0.35 + Math.random() * 0.5) +
        ';width:' + size + 'px;height:' + size + 'px;left:' + (Math.random() * 100) + '%';
      var dur = 8 + Math.random() * 7;
      f.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(' + (snow.offsetHeight + 40) + 'px)' }],
        { duration: dur * 1000, delay: -Math.random() * dur * 1000, iterations: Infinity, easing: 'linear' }
      );
      snow.appendChild(f);
    }
  });

  if (reduce || !('IntersectionObserver' in window)) return;

  // ---- scroll reveal ----
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  items.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .6s ease ' + ((i % 3) * 0.05) + 's, transform .6s ease ' + ((i % 3) * 0.05) + 's';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });

  // ---- curriculum trail connectors draw down ----
  var conns = Array.prototype.slice.call(document.querySelectorAll('.leg-conn'));
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.style.transform = 'scaleY(1)'; cio.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  conns.forEach(function (el) { cio.observe(el); });

  // ---- altimeter count-up ----
  var stats = Array.prototype.slice.call(document.querySelectorAll('.stat-num[data-to]'));
  var fmt = function (n) { return n >= 1000 ? n.toLocaleString('en-US') : String(n); };
  var sio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; sio.unobserve(el);
      var to = parseInt(el.getAttribute('data-to'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1200; var start = performance.now();
      var step = function (t) {
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(to * eased)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  stats.forEach(function (el) { sio.observe(el); });
})();
