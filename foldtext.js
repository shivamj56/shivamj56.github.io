/* Section headings unfold into place, one word at a time, as they arrive.

   This is the React Bits FoldText effect rebuilt without GSAP. The library
   version pulls GSAP + ScrollTrigger (~60KB gzipped) to drive a transform and an
   opacity on a stagger — which is a CSS transition with a delay. On a page
   already carrying React, Babel and ogl that dependency does not earn its place.

   Two deliberate differences from the library defaults:

   - Split by WORD, not character. This site is bilingual and Hindi is
     Devanagari, where conjuncts are formed from multiple code points
     (क् + ष = क्ष). Splitting per character tears those apart and renders
     Hindi headings as broken glyphs. At heading size the cascade reads the same.

   - Re-splits on mutation. The dc-runtime renders through React, so switching
     language replaces the heading's children and would wipe the split. A
     MutationObserver puts it back.

   Lives in its own file, not inline in <helmet>: inline helmet scripts are
   hoisted by copying textContent onto a fresh <script>, and that round trip has
   already mangled one script in this project. */
(function () {
  if (window.__omFold) return;
  window.__omFold = true;

  /* h2 only. The hero h1 carries the shine, which paints a gradient clipped to
     its own text — that cannot reach through the inline-block word spans the
     split introduces, so combining the two blanks the headline entirely. One
     effect per element. */
  var SEL = 'h2[data-fold]';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;

  function split(el) {
    var text = el.textContent;
    if (!text || !text.trim()) return false;
    /* Keep the whitespace runs as their own nodes so wrapping is unaffected. */
    var parts = text.split(/(\s+)/);
    var frag = document.createDocumentFragment();
    var i = 0;
    parts.forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      var outer = document.createElement('span');
      outer.className = 'fold-w';
      var inner = document.createElement('span');
      inner.className = 'fold-i';
      inner.style.transitionDelay = (i * 52) + 'ms';
      inner.textContent = part;
      outer.appendChild(inner);
      frag.appendChild(outer);
      i++;
    });
    if (!i) return false;
    /* The un-split text stays available to assistive tech and to selection. */
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.appendChild(frag);
    el.dataset.foldReady = '1';
    return true;
  }

  function arm(el) {
    if (el.dataset.foldReady === '1') return;
    if (!split(el)) return;
    /* Anything that cannot be observed must be shown, not left folded. A
       heading stuck at rotateX(-88deg) is an invisible heading. */
    if (reduce || !io) { el.classList.add('is-unfolded'); return; }
    io.observe(el);
  }

  function scan() {
    var root = document.querySelector('.hero-wrap') ? document.body : document.body;
    Array.prototype.forEach.call(root.querySelectorAll(SEL), arm);
  }

  function start() {
    if (!io && window.IntersectionObserver) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-unfolded');
          io.unobserve(e.target);
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    }
    scan();

    /* React replaces heading children when the language changes, which drops the
       split. Re-arm anything that has lost it. */
    if (!window.__omFoldMo) {
      window.__omFoldMo = new MutationObserver(function () {
        Array.prototype.forEach.call(document.querySelectorAll(SEL), function (el) {
          if (!el.querySelector('.fold-i')) {
            delete el.dataset.foldReady;
            el.classList.remove('is-unfolded');
            arm(el);
            /* Already on screen when it was swapped — unfold immediately. */
            var r = el.getBoundingClientRect();
            if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-unfolded');
          }
        });
      });
      window.__omFoldMo.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
  setTimeout(start, 1200);
  setTimeout(start, 3000);
})();
