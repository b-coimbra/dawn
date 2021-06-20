const { parse, stringify } = JSON;

const $ = (e) => {
  const elems = document.querySelectorAll(e);

  if (elems.length > 1) return elems;

  return elems[0];
};

const nodes = (elem) =>
  Array.prototype.slice.call($(elem).children);
