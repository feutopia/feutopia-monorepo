// hack for IE9
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0);
  };
}
// hack for IE9
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}
