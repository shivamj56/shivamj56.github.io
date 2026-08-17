/* The hisaab panel: a real trade resolving itself as the section arrives.

   This replaces a decorative "10×". The section's claim is that the maths is
   finished before the call ends, so the panel performs that claim instead of
   asserting it — the spoken sauda at the top, then rate, weight, value and due
   date landing in order, with the figures counting up rather than appearing.

   The arithmetic is real and matches the app screenshots elsewhere on the page:
   25 ton is 250 quintal, 250 × ₹5,809 = ₹14,52,250, and 15 days from 23 August
   is 7 September. A demo that does not add up is worse than no demo.

   External file, not inline in <helmet>: inline helmet scripts are hoisted by
   copying textContent onto a fresh <script>, which has already mangled one
   script in this project. */
(function () {
  if (window.__omHisaab) return;
  window.__omHisaab = true;

  /* Indian grouping — 14,52,250, not 1,452,250. Getting this wrong is the kind
     of detail the audience for this page notices immediately. */
  function groupIN(n) {
    var s = String(Math.round(n));
    if (s.length <= 3) return s;
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  function countUp(el, to, dur) {
    var pre = el.getAttribute('data-pre') || '';
    var suf = el.getAttribute('data-suf') || '';
    var grouped = el.getAttribute('data-group') === 'in';
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      /* Ease out so the figure settles rather than stopping dead. */
      var v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + (grouped ? groupIN(v) : Math.round(v)) + suf;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function run(panel) {
    if (panel.dataset.ran === '1') return;
    panel.dataset.ran = '1';
    panel.classList.add('is-on');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(panel.querySelectorAll('[data-to]'), function (el, i) {
      var to = parseFloat(el.getAttribute('data-to'));
      if (reduce) {
        var pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
        el.textContent = pre + (el.getAttribute('data-group') === 'in' ? groupIN(to) : to) + suf;
        return;
      }
      setTimeout(function () { countUp(el, to, 760); }, 260 + i * 190);
    });
  }

  function start() {
    var panels = document.querySelectorAll('[data-hisaab]');
    if (!panels.length) return;
    if (!window.IntersectionObserver) {
      Array.prototype.forEach.call(panels, run);
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    Array.prototype.forEach.call(panels, function (p) { io.observe(p); });
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
  setTimeout(start, 1400);
  setTimeout(start, 3200);
})();
