// Utility function: Debounce
export function debounce(fn, delay) {
  var timer;
  return function () {
    var args = arguments;
    var context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
