// Phones: the game fits itself to the phone held upright or sideways. The first touch on the game
// goes full screen (Android), so the browser's address bar does not take part of the screen.
(function () {
  var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var phone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform)) ||
    (coarse && navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) < 1000);
  if (!phone) return;
  function full() {
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    var el = document.documentElement;
    var fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (fs) { var p = fs.call(el); if (p && p.catch) p.catch(function () {}); }
  }
  document.addEventListener('touchend', full);
})();
