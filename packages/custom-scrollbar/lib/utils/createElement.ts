// Utility function: Create DOM element
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className = ""
) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}
