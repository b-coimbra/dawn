const { parse, stringify } = JSON;

/**
 * Handler for document.querySelector(All)
 * @returns {HTMLElement | Array<HTMLElement>}
 */
const $ = (e, options) => {
  const elems = document.querySelectorAll(e);

  if (options?.includeAll || elems.length > 1) return elems;

  return elems[0];
};

/**
 * Return all children of a parent node.
 * @returns {Array<HTMLElement>}
 */
Element.prototype.nodes = function() {
  return Array.prototype.slice.call(this.children);
};
