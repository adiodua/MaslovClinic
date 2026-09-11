// Живая подстановка отзывов с Google. В HTML уже вписан запасной вариант —
// несколько реальных отзывов и актуальный на момент публикации рейтинг —
// так секция выглядит корректно, даже если этот скрипт заблокирован,
// грузится медленно или у посетителя отключён JS. При загрузке скрипт
// подтягивает общий файл assets/reviews.json (его раз в неделю обновляет
// GitHub Action из Google Places API, см. .github/workflows/update-reviews.yml)
// и подменяет сводку рейтинга и карточки отзывов на свежие данные для
// текущего языка страницы.
(function () {
  var wall = document.getElementById('reviewsWall');
  var summary = document.getElementById('reviewsSummary');
  if (!wall && !summary) return;

  var LANG_KEY = { ru: 'ru', uk: 'uk', en: 'en' }[document.documentElement.lang] || 'ru';

  var AVATAR_COLORS = ['#588CB4', '#7A8FA6', '#B48A58', '#6B9080', '#9B6B9E', '#4A7C59', '#C77B5B', '#5C7AAA'];

  var G_LOGO_SVG =
    '<svg width="13" height="13" viewBox="0 0 48 48" aria-hidden="true">' +
    '<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>' +
    '<path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>' +
    '<path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>' +
    '<path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>' +
    '</svg>';

  function esc(s) {
    var div = document.createElement('div');
    div.textContent = s == null ? '' : String(s);
    return div.innerHTML;
  }

  function stars(n) {
    n = Math.max(0, Math.min(5, Math.round(n)));
    return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);
  }

  function initial(name) {
    var s = (name || '?').trim();
    return s.charAt(0).toUpperCase();
  }

  function avatarColor(name) {
    var sum = 0;
    for (var i = 0; i < (name || '').length; i++) sum += name.charCodeAt(i);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }

  function renderSummary(data) {
    if (!summary) return;
    var score = summary.querySelector('.reviews-summary-score');
    var starsEl = summary.querySelector('.reviews-summary-stars');
    var countEl = summary.querySelector('.reviews-summary-count-num');
    if (score) score.textContent = (Math.round(data.rating * 10) / 10).toFixed(1);
    if (starsEl) starsEl.textContent = stars(data.rating);
    if (countEl) countEl.textContent = data.userRatingsTotal;
  }

  function renderCards(reviews) {
    if (!wall || !reviews || !reviews.length) return; // пусто/ошибка — оставляем вписанные в HTML отзывы как есть
    var html = reviews.map(function (r) {
      return (
        '<div class="review-card">' +
        '<div class="review-head">' +
        '<div class="review-avatar" style="background:' + avatarColor(r.name) + ';">' + esc(initial(r.name)) + '</div>' +
        '<div class="review-head-text">' +
        '<div class="name">' + esc(r.name) + ' ' + G_LOGO_SVG + '</div>' +
        '<div class="date">' + esc(r.relativeTime) + '</div>' +
        '</div></div>' +
        '<div class="stars">' + stars(r.rating) + '</div>' +
        '<p>' + esc(r.text) + '</p>' +
        '</div>'
      );
    }).join('');
    wall.innerHTML = html;
  }

  fetch('/assets/reviews.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      renderSummary(data);
      renderCards(data.reviews && data.reviews[LANG_KEY]);
    })
    .catch(function () { /* нет сети или заблокировано — вписанные в HTML отзывы и цифры остаются как есть */ });
})();
