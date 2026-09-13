// Mobile hero: tapping the heading expands/collapses the lead paragraph
// below it (see .hero h1 / .hero p.lead in base.css / uslugi.css — the
// collapsed state only exists inside the mobile media query, so this runs
// harmlessly everywhere and simply has no visible effect on desktop).
(function () {
  document.querySelectorAll('.hero h1').forEach(function (h1) {
    // Usually a direct sibling; on pages where the heading is grouped
    // with extra markup (e.g. the patient case-tag list) it's one level
    // further up, so fall back to the grandparent.
    var scope = h1.parentElement;
    var lead = scope && scope.querySelector('p.lead');
    if (!lead && scope) lead = scope.parentElement && scope.parentElement.querySelector('p.lead');
    if (!lead) return;
    h1.addEventListener('click', function () {
      var open = lead.classList.toggle('lead-open');
      h1.classList.toggle('lead-open', open);
    });
  });
})();
