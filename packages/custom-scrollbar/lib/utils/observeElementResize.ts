import { applyStyles } from "./applyStyles";
import { AnyFunction } from "../types";

// Utility function: Observe element's resize
export function observeElementResize(
  element: HTMLElement,
  callback: AnyFunction
) {
  const iframe = document.createElement("iframe");
  applyStyles(iframe, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "-1",
    pointerEvents: "none",
    border: "none",
  });

  const onResize = () => {
    callback();
  };

  const onLoad = () => {
    if (iframe.contentWindow) {
      iframe.contentWindow.addEventListener("resize", onResize);
    }
  };

  iframe.addEventListener("load", onLoad);
  element.appendChild(iframe);

  return () => {
    iframe.addEventListener("load", onLoad);
    element.removeChild(iframe);
  };
}
