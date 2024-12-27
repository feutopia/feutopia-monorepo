// Utility function: Apply styles
export function applyStyles(element, styles) {
  if (!element) return;
  for (var key in styles) {
    element.style[key] = styles[key];
  }
}
