/* Section headings fold into place as they arrive.

   This is the React Bits FoldText effect rebuilt without GSAP: the library form
   pulls GSAP + ScrollTrigger (~60KB gzipped) to drive a transform and an opacity,
   which is a CSS transition with a delay.

   It folds each heading as a single panel rather than per word, and that is not
   a shortcut — it is the only version that survives this runtime. Splitting into
   word spans means replacing the heading's children, which removes the text node
   React is holding a reference to. On a language switch React writes the new
   string into that now-detached node: no error, no visible change, and the
   heading is left stranded in the previous language while the rest of the page
   switches. Per-word splitting and a React-rendered bilingual heading cannot
   both be had.

   External file, not inline in <helmet>: inline helmet scripts are hoisted by
   copying textContent onto a fresh <script>, which has already mangled one
   script in this project. */
(function () {
  if (window.__omFold) return;
  window.__omFold = true;

  var SEL = 'h2[data-fold]';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function start() {
    var els = document.querySelectorAll(SEL);
    if (!els.length) return;

    if (reduce || !window.IntersectionObserver) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-unfolded'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-unfolded');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(els, function (el) {
      /* Anything already on screen unfolds now; a folded heading is an
         invisible heading, so nothing is left waiting on an event. */
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-unfolded');
      else io.observe(el);
    });
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
  setTimeout(start, 1200);
  setTimeout(start, 3000);
})();
