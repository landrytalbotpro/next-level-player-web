(function () {
  'use strict';
  var btn = document.getElementById('burgerBtn');
  var nav = document.getElementById('mainNav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open'); btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  var rev = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10), start = null, dur = 1200;
    var suffix = el.getAttribute('data-suffix') || '';
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }
  var CX = 120, CY = 120, R = 78;
  function pt(i, v) {
    var a = -Math.PI / 2 + i * (Math.PI / 3);
    return [CX + R * (v / 99) * Math.cos(a), CY + R * (v / 99) * Math.sin(a)];
  }
  function poly(vals) { return vals.map(function (v, i) { return pt(i, v).map(function (n) { return n.toFixed(1); }).join(','); }).join(' '); }
  function updateRadar(svg, vals) {
    var shape = svg.querySelector('.shape'); if (shape) shape.setAttribute('points', poly(vals));
    svg.querySelectorAll('.dot').forEach(function (d, i) {
      var p = pt(i, vals[i]); d.setAttribute('cx', p[0].toFixed(1)); d.setAttribute('cy', p[1].toFixed(1));
    });
  }
  var live = document.getElementById('liveCard');
  if (live) {
    var sliders = document.querySelectorAll('.sl input[type=range]');
    var svg = live.querySelector('.radar');
    var rating = live.querySelector('[data-rating]');
    var nameEl = live.querySelector('[data-name]');
    var posEl = live.querySelector('[data-pos]');
    var metaEl = live.querySelector('[data-meta]');
    var f = document.getElementById('formPlayer');
    function vals() { return Array.prototype.map.call(sliders, function (s) { return parseInt(s.value, 10); }); }
    function refresh() {
      var v = vals();
      updateRadar(svg, v);
      sliders.forEach(function (s) { var o = s.parentNode.querySelector('output'); if (o) o.textContent = s.value; });
      if (rating) rating.textContent = Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length);
    }
    sliders.forEach(function (s) { s.addEventListener('input', refresh); });
    refresh();
    if (f) {
      var nm = f.elements['nombre'] || f.elements['nom'];
      var ps = f.elements['posicion'] || f.elements['poste'];
      var ht = f.elements['altura'] || f.elements['taille'];
      var ft = f.elements['pie'] || f.elements['pied'];
      function meta() {
        if (nameEl) nameEl.textContent = (nm && nm.value.trim()) || nameEl.getAttribute('data-default');
        if (posEl) posEl.textContent = (ps && ps.value) || posEl.getAttribute('data-default');
        var parts = [];
        if (ht && ht.value) parts.push(ht.value + ' cm');
        if (ft && ft.value) parts.push(ft.value);
        if (metaEl) metaEl.textContent = parts.join(' · ') || metaEl.getAttribute('data-default');
      }
      [nm, ps, ht, ft].forEach(function (el) { if (el) { el.addEventListener('input', meta); el.addEventListener('change', meta); } });
      meta();
    }
  }
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== t.getAttribute('data-tab'); });
      try { history.replaceState(null, '', '#' + t.getAttribute('data-tab')); } catch (e) {}
    });
  });
  if (tabs.length && location.hash === '#recruiter') {
    var rt = document.querySelector('.tab[data-tab="recruiter"]'); if (rt) rt.click();
  }
  var age = document.getElementById('age');
  var parent = document.getElementById('parentBlock');
  if (age && parent) {
    function chk() {
      var a = parseInt(age.value, 10);
      var minor = !isNaN(a) && a >= 16 && a < 18;
      parent.hidden = !minor;
      parent.querySelectorAll('input').forEach(function (i) { i.required = minor; });
    }
    age.addEventListener('input', chk); chk();
  }
  document.querySelectorAll('form[data-endpoint]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      var submit = form.querySelector('button[type=submit]');
      if (form.elements['_gotcha'] && form.elements['_gotcha'].value) return;
      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = form.getAttribute('data-sending');
      msg.className = 'form-msg'; msg.textContent = '';
      fetch(form.getAttribute('data-endpoint'), {
        method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (r.ok) { window.location.href = form.getAttribute('data-thanks'); }
        else { throw new Error('bad'); }
      }).catch(function () {
        submit.disabled = false; submit.textContent = original;
        msg.className = 'form-msg err'; msg.textContent = form.getAttribute('data-error');
      });
    });
  });
  var chooser = document.getElementById('langChooser');
  if (chooser && location.search.indexOf('choose') === -1) {
    var l = (navigator.language || 'es').toLowerCase();
    setTimeout(function () { location.replace(l.indexOf('fr') === 0 ? 'fr/' : 'es/'); }, 1400);
  }
})();
