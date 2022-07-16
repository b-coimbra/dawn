class Modal extends Component {
  name;
  height;
  width;

  refs = {
    modal: '.modal',
    close: '.modal-close',
    content: '.modal-content',
    title: '.modal-header-title'
  };

  constructor(name, width = 350, height = 350) {
    super();

    this.name = name ?? '';
    this.width = width;
    this.height = height;
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
      this.resources.libs.awoo
    ];
  }

  setEvents() {
    this.refs.close.onclick = () => this.close();
  }

  activate() {
    this.refs.modal.classList.add('active');
  }

  close() {
    this.refs.modal.classList.remove('active');
  }

  setContent(content) {
    this.refs.content.innerHTML = content ?? '';
    return this;
  }

  setTitle(title) {
    this.refs.title.innerText = title;
    return this;
  }

  style() {
    return `
      .modal {
          position: absolute;
          height: ${this.height}px;
          width: ${this.width}px;
          z-index: 9;
          margin: auto;
          top: calc(-100% - ${this.height}px);
          bottom: 0;
          right: 0; left: 0;
          background: #18181d;
          padding: 1em 1.5em;
          box-sizing: border-box;
          transition: top .5s cubic-bezier(0.06, -0.05, 0, 1);
          box-shadow: 0 0 10px rgb(0 0 0 / 30%);
      }

      .modal-content {
          margin-top: 1em;
      }

      .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 30px;
          border-bottom: 1px solid white;
          padding-bottom: 0.5em;
      }

      .modal-close,
      .modal-header-title {
          color: white;
      }

      .modal-close i {
          font-size: 14pt;
      }

      .modal-close {
          background: none;
          outline: 0;
          border: 0;
          height: 24px;
          width: 24px;
      }

      .modal-header-title {
          font: 600 10pt 'Roboto', sans-serif;
          text-transform: uppercase;
      }

      .modal.active {
          top: 0;
      }
    `;
  }

  template() {
    return `
      <div class="modal">
        <div class="modal-header">
          <h1 class="modal-header-title">${this.name ?? ''}</h1>
          <button class="+ modal-close">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="modal-content">${this.content ?? ''}</div>
      </div>
    `;
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
    });
  }
}
