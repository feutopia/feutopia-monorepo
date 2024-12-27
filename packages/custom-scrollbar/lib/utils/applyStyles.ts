type Styles = Partial<CSSStyleDeclaration>;

// Utility function: Apply styles
export function applyStyles(element: HTMLElement, styles: Styles) {
  if (!element) return;
  for (const key in styles) {
    element.style[key] = styles[key] as string;
  }
}
