/* Nav pills retract while the reader moves down the page and return on any
   upward move, so each section presents full screen. They are always shown over
   the hero and at the very bottom, so the call to action is never stranded in
   the middle of a very long page.

   This lives in its own file rather than in the document's <helmet>: the
   dc-runtime hoists inline helmet scripts by copying textContent onto a fresh
   <script> and appending it, and this logic did not survive that round trip.
   External scripts are loaded by the browser directly and are unaffected. */
(function () {
  if (window.__omNav) return;
  window.__omNav = true;

  var nav = null;
  var last = 0;
  var ticking = false;

  function apply() {
    ticking = false;
    /* Re-query whenever the cached node has left the document. The dc-runtime
       renders through React and swaps .nav-float on re-render, so a reference
       captured once ends up on a detached node — the class gets set correctly
       and nothing on screen changes. */
    if (!nav || !nav.isConnected) nav = document.querySelector('.nav-float');
    if (!nav) return;

    var y = window.scrollY || window.pageYOffset || 0;
    var vh = window.innerHeight;
    var docEnd = document.documentElement.scrollHeight - vh - 40;
    var away;

    if (y < vh * 0.55 || y >= docEnd) {
      away = false;                                  /* hero, and the very end */
    } else if (y > last + 6) {
      away = true;                                   /* moving down            */
    } else if (y < last - 6) {
      away = false;                                  /* any move up            */
    } else {
      away = nav.classList.contains('is-away');      /* below the threshold    */
    }

    nav.classList.toggle('is-away', away);
    last = y;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  apply();
  /* The dc-runtime mounts the markup after this file runs, so retry once the
     .nav-float element actually exists. */
  setTimeout(apply, 1200);
  setTimeout(apply, 3000);
})();
