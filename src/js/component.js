class Component extends HTMLElement {
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

  render() {
    const html = `
        ${this.imports().join("\n")}
        ${this.style()}
        ${this.template()}`;

    this.shadow.innerHTML = html;
  }
}
