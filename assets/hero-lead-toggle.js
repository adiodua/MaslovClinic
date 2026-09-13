// Mobile hero: tapping the heading expands/collapses the lead paragraph
// below it (see .hero h1 / .hero p.lead in base.css / uslugi.css — the
// collapsed state only exists inside the mobile media query, so this runs
// harmlessly everywhere and simply has no visible effect on desktop).
(function () {
  document.querySelectorAll('.hero h1').forEach(function (h1) {
    var lead = h1.parentElement.querySelector('p.lead');
    if (!lead) return;
    h1.addEventListener('click', function () {
      var open = lead.classList.toggle('lead-open');
      h1.classList.toggle('lead-open', open);
    });
  });
})();
