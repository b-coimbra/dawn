class Component extends HTMLElement {
  refs = {};

  resources = {
    fonts: {
      roboto: '<link href="https://fonts.googleapis.com/css?family=Roboto:100,400,700" rel="stylesheet">',
      nunito: '<link href="https://fonts.googleapis.com/css?family=Nunito:200" rel="stylesheet">'
    },
    icons: {
      material: '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
    }
  };

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static style() { }
  static template() { }
  static imports() { }

  async render() {
    const html = `
        ${this.imports().join("\n")}
        <style>${this.style()}</style>
        ${await this.template()}`;

    this.shadow.innerHTML = html;

    this.refs = this.createRef();
  }

  createRef() {
    return new Proxy(this.refs, {
      get: (target, prop) => {
        return this.shadow.querySelector(target[prop]);
      },
      set: (target, prop, value) => {
        return this.shadow.querySelector(target[prop]).innerHTML = value;
      }
    });
  }
}
