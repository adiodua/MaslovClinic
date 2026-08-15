// Живая подстановка цен. На каждой странице актуальные на момент публикации
// цены уже вписаны прямо в HTML как запасной вариант (fallback) — так страница
// выглядит корректно, даже если этот скрипт заблокирован, грузится медленно
// или у посетителя отключён JS. При загрузке скрипт подтягивает общий файл
// assets/prices.json и переписывает текст в любом элементе с атрибутом
// data-price / data-price-range на актуальное значение — так изменение цены
// один раз в админке обновляет все её упоминания сразу на всех страницах, в
// обоих языках, включая цены внутри обычного текста, без правки HTML.
(function () {
  function fmt(n) {
    // 29400 -> "29 400" (тот же формат разделителя тысяч, что уже на сайте)
    return String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function applyPrices(data) {
    document.querySelectorAll('[data-price]').forEach(function (el) {
      var key = el.getAttribute('data-price');
      var val = data[key];
      if (val === undefined || val === null) return; // ключ неизвестен: оставляем вписанный в HTML текст
      if (el.hasAttribute('data-price-bare')) {
        // Только число — используется, когда «грн» или другое слово уже
        // есть рядом как статичный текст (например «от X до Y грн»).
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
    .catch(function () { /* нет сети или заблокировано — вписанные в HTML цены остаются как есть */ });
})();
