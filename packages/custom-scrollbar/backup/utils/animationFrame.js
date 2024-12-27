// hack for IE9: requestAnimationFrame
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  ((callback) => {
    return setTimeout(() => {
      callback(Date.now());
    }, 1000 / 60); // 60fps
  });

// hack for IE9: cancelAnimationFrame
export const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
