// Utility function: Append HTMLCollection to element
export function appendChildren(
  children: NodeListOf<ChildNode> | HTMLElement[],
  parent: HTMLElement
) {
  const childrenArray = Array.prototype.slice.call(children);
  const length = childrenArray.length;
  var fragment = document.createDocumentFragment();
  for (let i = 0; i < length; i++) {
    fragment.appendChild(childrenArray[i]);
  }
  parent.appendChild(fragment);
}
