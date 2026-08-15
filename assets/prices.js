// Live price injection. Every page ships with the current prices baked
// into the HTML as a fallback (so it looks correct even if this script is
// blocked, slow, or the visitor has JS disabled). On load, this fetches the
// single shared assets/prices.json and overwrites any element carrying a
// data-price / data-price-range attribute with the live value — so changing
// a price once in the admin panel updates every mention of it across every
// page, in both languages, including inline prose, without editing HTML.
(function () {
  function fmt(n) {
    // 29400 -> "29 400" (matches the site's existing thousands-separator style)
    return String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function applyPrices(data) {
    document.querySelectorAll('[data-price]').forEach(function (el) {
      var key = el.getAttribute('data-price');
      var val = data[key];
      if (val === undefined || val === null) return; // unknown key: keep baked-in fallback text
      if (el.hasAttribute('data-price-bare')) {
        // Just the number — used when "грн" or other wording already
        // lives as static text next to the span (e.g. "от X до Y грн").
        el.textContent = fmt(val);
        return;
      }
      var prefix = el.getAttribute('data-price-prefix') || '';
      var suffix = el.getAttribute('data-price-suffix') || '';
      el.textContent = prefix + fmt(val) + ' грн' + suffix;
    });
    document.querySelectorAll('[data-price-range]').forEach(function (el) {
      var keys = el.getAttribute('data-price-range').split(',');
      var min = data[keys[0]];
      var max = data[keys[1]];
      if (min === undefined || max === undefined) return;
      var prefix = el.getAttribute('data-price-prefix') || '';
      var suffix = el.getAttribute('data-price-suffix') || '';
      el.textContent = prefix + fmt(min) + '–' + fmt(max) + ' грн' + suffix;
    });
  }

  fetch('/assets/prices.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) { if (data) applyPrices(data); })
    .catch(function () { /* offline or blocked — baked-in prices stay as-is */ });
})();
