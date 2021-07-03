class Statusbar extends Component {
  externalRefs = {};

  refs = {
    panels: '#panels > ul',
    tabs: '#tabs ul li',
    indicator: '.indicator'
  };

  constructor() {
    super();

    this.stylePath = 'src/components/statusbar/statusbar.style.css';

    this.setDependencies();
  }

  setDependencies() {
    this.externalRefs = {
      panels: this.parentNode.querySelectorAll(this.refs.panels)
    };
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
      this.resources.libs.awoo,
    ];
  }

  template() {
    return `
        <div id="tabs">
            <cols>
                <ul class="- indicator"></ul>
                <div class="+ widgets col-end">
                    <crypto-rate from="ETH" to="USD" class="+"></crypto-rate>
                    <current-time class="+"></current-time>
                    <weather-forecast class="+ weather"></weather-forecast>
                </div>
            </cols>
        </div>`;
  }

  setEvents() {
    this.refs.tabs.forEach(tab =>
      tab.onclick = ({ target }) =>
        this.activateByKey(Number(target.getAttribute('tab-index'))));

    document.onkeydown = (e) => {
      if (e !== undefined) {
        let { key } = e;

        if (Number.isInteger(parseInt(key)) && key <= this.externalRefs.panels.length)
          this.activateByKey(key - 1);
      }
    }
  }

  activateByKey(key) {
    this.activate(this.refs.tabs, this.refs.tabs[key]);
    this.activate(this.externalRefs.panels, this.externalRefs.panels[key]);
  }

  createTabs() {
    const panelsCount = this.externalRefs.panels.length;

    for (let i = 0; i <= panelsCount; i++)
      this.refs.indicator.innerHTML += `<li tab-index=${i} ${i == 0 ? 'active' : ''}></li>`;
  }

  activate(target, item) {
    target.forEach((i) => i.removeAttribute('active'));
    item.setAttribute('active', '');
  }

  connectedCallback() {
    this.render().then(() => {
      this.createTabs();
      this.setEvents();
    });
  }
}

customElements.define('status-bar', Statusbar);
