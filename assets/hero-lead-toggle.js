// Mobile hero: tapping the heading expands/collapses the lead paragraph
// as a centered overlay card (see .hero h1 / .hero p.lead in base.css —
// the overlay state only exists inside the mobile media query, so this
// runs harmlessly everywhere; the mobile-only guard below also stops the
// typing animation from ever touching the always-visible desktop lead).
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function isMobile(){
    return window.matchMedia && window.matchMedia('(max-width:860px)').matches;
  }
  document.querySelectorAll('.hero h1').forEach(function (h1) {
    // Doctor bio pages (.doc-hero-grid) opted out of this toggle — their
    // lead text is always visible in the redesigned mobile card, and this
    // page also carries a second, visually-hidden copy of the same text
    // for older layouts, which the typing animation would touch and read
    // as text appearing "in two places" at once.
    if (h1.closest('.doc-hero-grid')) return;
    // Usually a direct sibling; on pages where the heading is grouped
    // with extra markup (e.g. the patient case-tag list) it's one level
    // further up, so fall back to the grandparent.
    var scope = h1.parentElement;
    var lead = scope && scope.querySelector('p.lead');
    if (!lead && scope) lead = scope.parentElement && scope.parentElement.querySelector('p.lead');
    if (!lead) return;

    var fullText = lead.textContent;
    var typeTimer = null;

    function typeIn() {
      clearInterval(typeTimer);
      if (reduceMotion) { lead.textContent = fullText; return; }
      // The card's height is auto, unanimated — with the full text typed
      // in character by character, every time a new line wraps in the box
      // suddenly jumps taller instead of growing smoothly, which is what
      // read as "jerky". Locking min-height to the card's own final size
      // (read now, while fullText is still in it, before clearing it below)
      // keeps the box that size throughout, so only the text changes.
      // clientHeight (not scrollHeight) so a card whose full text exceeds
      // max-height locks at the capped height, not the overflowing one.
      lead.style.minHeight = lead.clientHeight + 'px';
      lead.textContent = '';
      var i = 0;
      var step = Math.max(1, Math.round(fullText.length / 55));
      typeTimer = setInterval(function () {
        i += step;
        if (i >= fullText.length) {
          lead.textContent = fullText;
          lead.style.minHeight = '';
          clearInterval(typeTimer);
        } else {
          lead.textContent = fullText.slice(0, i);
        }
      }, 14);
    }

    h1.addEventListener('click', function () {
      if (!isMobile()) return;
      var open = lead.classList.toggle('lead-open');
      h1.classList.toggle('lead-open', open);
      if (open) {
        typeIn();
      } else {
        clearInterval(typeTimer);
        lead.style.minHeight = '';
        lead.textContent = fullText;
      }
    });
  });
})();
