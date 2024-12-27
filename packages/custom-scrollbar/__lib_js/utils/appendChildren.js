// Utility function: Append HTMLCollection to element
export function appendChildren(children, parent) {
  let childrenArray = Array.prototype.slice.call(children);
  let length = childrenArray.length;
  var fragment = document.createDocumentFragment();
  for (let i = 0; i < length; i++) {
    fragment.appendChild(childrenArray[i]);
  }
  parent.appendChild(fragment);
}
