// Utility function: Create DOM element
export function createElement(tagName, className) {
  var element = document.createElement(tagName);
  element.className = className || "";
  return element;
}
