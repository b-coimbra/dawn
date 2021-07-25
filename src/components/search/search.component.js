class Search extends Component {
  refs = {
    search: '#search',
    input: '#search input[type="text"]',
    engines: '.search-engines',
    close: '.close'
  };

  constructor() {
    super();

    this.stylePath = 'src/components/search/search.style.css';
    this.engines = GLOBAL_CONFIG.search.engines;
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material
    ];
  }

  template() {
    return `
        <div id="search">
          <div>
            <input type="text" spellcheck="false" placeholder="search">
            <button class="close"><i class="material-icons">&#xE5CD;</i></button>
            <ul class="search-engines"></ul>
          </div>
        </div>
    `;
  }

  loadEngines() {
    for (var key in this.engines)
      this.refs.engines.innerHTML += `<li><p title="${this.engines[key][1]}">!${key}</p></li>`;
  }

  activate() {
    this.refs.search.classList.add('active');
    this.refs.input.focus();
    this.refs.input.scrollIntoView();
  }

  deactivate() {
    this.refs.search.classList.remove('active');
  }

  handleSearch(event) {
    const { target, key } = event;

    let args = target.value.split(' ');
    let prefix = args[0];
    let defaultEngine = this.engines['g'][0];
    let engine = defaultEngine;

    this.refs.engines.childNodes.forEach(engine => {
      if (prefix === engine.firstChild.innerHTML)
        engine.classList.add('active');
      else
        engine.classList.remove('active');
    });

    if (key === 'Enter') {
      if (prefix.indexOf('!') === 0) {
        engine = this.engines[prefix.substr(1)][0];
        args = args.slice(1);
      }

      window.location = engine + encodeURI(args.join(' '));
    }

    if (key === 'Escape')
      this.deactivate();
  }

  setEvents() {
    this.refs.search.onkeyup = (e) => this.handleSearch(e);
    this.refs.close.onclick = () => this.deactivate();
  }

  connectedCallback() {
    this.render().then(() => {
      this.loadEngines();
      this.setEvents();
    });
  }
}

customElements.define('search-bar', Search);
