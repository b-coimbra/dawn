class Component extends HTMLElement {
  refs = {};

  resources = {
    fonts: {
      roboto: '<link href="https://fonts.googleapis.com/css?family=Roboto:100,400,700" rel="stylesheet">',
      nunito: '<link href="https://fonts.googleapis.com/css?family=Nunito:200" rel="stylesheet">'
    },
    icons: {
      material: '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
    },
    libs: {
      awoo: '<link rel="stylesheet" type="text/css" href="src/css/awoo.min.css">'
    }
  };

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
  }

  style()    { return null; }
  template() { return null; }
  imports()  { return []; }

  set stylePath(path) {
    this.resources.style = `<link rel="stylesheet" type="text/css" href="${path}">`;
  }

  get all_imports() {
    const imports = this.imports();

    if (this.resources?.style)
      imports.push(this.resources.style);

    return imports;
  }

  async buildHTML() {
    let html = `
        ${this.all_imports.join("\n")}
        ${await this.template()}`;

    if (this.style())
      html += `<style>${this.style()}</style>`;

    return html;
  }

  nodes(elem) {
    return Array.prototype.slice.call(elem.children);
  }

  async render() {
    this.shadow.innerHTML = await this.buildHTML();
    this.refs = this.createRef();
  }

  createRef() {
    return new Proxy(this.refs, {
      get: (target, prop) => {
        const elems = this.shadow.querySelectorAll(target[prop]);

        if (elems.length > 1) return elems;

        return elems[0];
      },
      set: (target, prop, value) => {
        this.shadow.querySelector(target[prop]).innerHTML = value;
        return true;
      }
    });
  }
}
