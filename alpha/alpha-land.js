// Phones: the game is played sideways. When the phone is held upright a card asks to turn it,
// and the first touch on the game goes full screen and locks it sideways where the phone allows (Android).
// On iPhone the browser cannot lock it, so the card stays until the phone is turned.
(function () {
  // a phone or tablet: by name, or (when the browser is set to "desktop site") by a touch screen that is not big
  var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var phone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform)) ||
    (coarse && navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) < 1000);
  if (!phone) return;
  var css = document.createElement('style');
  css.textContent =
    '#alpha-turn{position:fixed;inset:0;z-index:50;display:none;flex-direction:column;align-items:center;justify-content:center;gap:22px;' +
    'background:#0b2a3c;color:#fff;font-family:system-ui,sans-serif;text-align:center;direction:rtl;padding:24px}' +
    '#alpha-turn .ph{width:70px;height:120px;border:5px solid #fff;border-radius:14px;animation:alphaTurn 2s ease-in-out infinite}' +
    '#alpha-turn b{font-size:26px}#alpha-turn span{font-size:17px;opacity:.85;max-width:320px;line-height:1.5}' +
    '#alpha-turn button{font-size:20px;padding:14px 26px;border:0;border-radius:14px;background:#ff9f2e;color:#fff;font-weight:bold}' +
    '@keyframes alphaTurn{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}' +
    '@media (orientation:portrait){#alpha-turn{display:flex}}';
  document.head.appendChild(css);
  function goWide() {
    var el = document.documentElement;
    var fs = el.requestFullscreen || el.webkitRequestFullscreen;
    var p = fs ? fs.call(el) : null;
    var lock = function () { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); };
    if (p && p.then) p.then(lock).catch(function () {}); else lock();
  }
  function build() {
    var d = document.createElement('div');
    d.id = 'alpha-turn';
    var canLock = !!(document.documentElement.requestFullscreen && screen.orientation && screen.orientation.lock);
    d.innerHTML = '<div class="ph"></div><b>סובב את הטלפון לרוחב</b>' +
      (canLock ? '<button type="button">לשחק במסך מלא לרוחב</button>' : '<span>אם המסך לא מסתובב: תבטל את נעילת הסיבוב בטלפון</span>');
    document.body.appendChild(d);
    var b = d.querySelector('button');
    if (b) b.addEventListener('click', goWide);
    // the first touch in the game itself also goes full screen and sideways
    var once = function () { if (!document.fullscreenElement && !document.webkitFullscreenElement) goWide(); document.removeEventListener('touchend', once); };
    document.addEventListener('touchend', once);
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
