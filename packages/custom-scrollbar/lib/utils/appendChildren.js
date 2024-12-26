// Utility function: Append HTMLCollection to element
export function appendChildren(children, parent) {
  let childrenArray = Array.prototype.slice.call(children);
  let length = childrenArray.length;
  for (let i = 0; i < length; i++) {
    parent.appendChild(childrenArray[i]);
  }
}
