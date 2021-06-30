const { parse, stringify } = JSON;

const $ = (e, options) => {
  const elems = document.querySelectorAll(e);

  if (options?.includeAll || elems.length > 1) return elems;

  return elems[0];
};
