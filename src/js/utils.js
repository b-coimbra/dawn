const { parse, stringify } = JSON;

const $ = (e, includeAll = false) => {
  const elems = document.querySelectorAll(e);

  if (includeAll || elems.length > 1) return elems;

  return elems[0];
};

const nodes = (elem) =>
  Array.prototype.slice.call($(elem).children);
