import { applyStyles } from ".";

// Utility function: Observe element's resize
export function observeElementResize(element, callback) {
  var iframe = document.createElement("iframe");
  applyStyles(iframe, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none",
    border: "none",
  });

  var onResize = function () {
    callback();
  };

  var onLoad = function () {
    if (iframe.contentWindow) {
      iframe.contentWindow.addEventListener("resize", onResize);
    }
  };

  iframe.addEventListener("load", onLoad);
  element.appendChild(iframe);

  return function () {
    if (iframe.contentWindow) {
      iframe.contentWindow.removeEventListener("resize", onResize);
    }
    iframe.addEventListener("load", onLoad);
    element.removeChild(iframe);
  };
}
