class Component extends HTMLElement {
  refs = {};

  resources = {
    fonts: {
      roboto: '<link href="https://fonts.googleapis.com/css?family=Roboto:100,400,700" rel="stylesheet">',
      nunito: '<link href="https://fonts.googleapis.com/css?family=Nunito:200" rel="stylesheet">'
    },
    icons: {
      material: '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">',
      bitonics: '<link href="https://bitonics.net/vendor/bitonics/bitonics.min.css" rel="stylesheet" type="text/css">'
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

  /**
   * Reference an external css file
   * OBS: External style loading not yet fully supported with web components, causes flickering.
   * @param {string} path
   * @returns {void}
   */
  set stylePath(path) {
    this.resources.style = `<link rel="preload" as="style" href="${path}" onload="this.rel='stylesheet'">`;
  }

  /**
   * Return all the imports that a component requested.
   * @returns {Array<string>} imports
   */
  get getResources() {
    const imports = this.imports();

    if (this.resources?.style)
      imports.push(this.resources.style);

    return imports;
  }

  /**
   * Return inline style tag.
   * @returns {string}
   */
  async loadStyles() {
    let html = this.getResources.join("\n");

    if (this.style())
      html += `<style>${this.style()}</style>`;

    return html;
  }

  /**
   * Build the component's HTML body.
   * @returns {string} html
   */
  async buildHTML() {
    return await this.loadStyles() +
           await this.template();
  }

  /**
   * Create a reference for manipulating DOM elements.
   * @returns {Proxy<HTMLElement | boolean>}
   */
  createRef() {
    return new Proxy(this.refs, {
      get: (target, prop) => {
        const elems = this.shadow.querySelectorAll(target[prop]);

        if (elems.length > 1) return elems;

        const element = elems[0];

        if (!element) return target[prop];

        return element;
      },
      set: (target, prop, value) => {
        this.shadow.querySelector(target[prop]).innerHTML = value;
        return true;
      }
    });
  }

  async render() {
    this.shadow.innerHTML = await this.buildHTML();
    this.refs = this.createRef();
  }
}
