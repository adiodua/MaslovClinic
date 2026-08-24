// Живая подстановка цен. На каждой странице актуальные на момент публикации
// цены уже вписаны прямо в HTML как запасной вариант (fallback) — так страница
// выглядит корректно, даже если этот скрипт заблокирован, грузится медленно
// или у посетителя отключён JS. При загрузке скрипт подтягивает общий файл
// assets/prices.json и переписывает текст в любом элементе с атрибутом
// data-price / data-price-range на актуальное значение — так изменение цены
// один раз в админке обновляет все её упоминания сразу на всех страницах, во
// всех языках, включая цены внутри обычного текста, без правки HTML.
(function () {
  // Цены в prices.json — это чистые числа в гривне, без формата вывода.
  // На RU/UA страницах их подписывают как "29 400 грн" (пробел, "грн" после
  // числа); на EN — как "UAH 29,400" (запятая, "UAH" перед числом), под тот
  // же вид, что уже вписан в HTML как fallback. Формат выбирается по
  // <html lang>, который на страницах уже верно проставлен (ru/uk/en).
  var isEN = document.documentElement.lang === 'en';

  function fmt(n) {
    // 29400 -> "29 400" (RU/UA) или "29,400" (EN)
    return String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, isEN ? ',' : ' ');
  }

  function withUnit(n) {
    return isEN ? ('UAH ' + fmt(n)) : (fmt(n) + ' грн');
  }

  function applyPrices(data) {
    document.querySelectorAll('[data-price]').forEach(function (el) {
      var key = el.getAttribute('data-price');
      var val = data[key];
      if (val === undefined || val === null) return; // ключ неизвестен: оставляем вписанный в HTML текст
      if (el.hasAttribute('data-price-bare')) {
        // Только число — используется, когда «грн»/«UAH» или другое слово
        // уже есть рядом как статичный текст (например «от X до Y UAH»).
        el.textContent = fmt(val);
        return;
      }
      var prefix = el.getAttribute('data-price-prefix') || '';
      var suffix = el.getAttribute('data-price-suffix') || '';
      el.textContent = prefix + withUnit(val) + suffix;
    });
    document.querySelectorAll('[data-price-range]').forEach(function (el) {
      var keys = el.getAttribute('data-price-range').split(',');
      var min = data[keys[0]];
      var max = data[keys[1]];
      if (min === undefined || max === undefined) return;
      var prefix = el.getAttribute('data-price-prefix') || '';
      var suffix = el.getAttribute('data-price-suffix') || '';
      el.textContent = isEN
        ? prefix + 'UAH ' + fmt(min) + '–' + fmt(max) + suffix
        : prefix + fmt(min) + '–' + fmt(max) + ' грн' + suffix;
    });
  }

  fetch('/assets/prices.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) { if (data) applyPrices(data); })
    .catch(function () { /* нет сети или заблокировано — вписанные в HTML цены остаются как есть */ });
})();
