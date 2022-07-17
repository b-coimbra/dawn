class Statusbar extends Component {
  externalRefs = {};

  refs = {
    categories: '.categories ul',
    tabs: '#tabs ul li',
    indicator: '.indicator',
    addTab: '.add-tab'
  };

  modal;
  currentTabIndex = 0;

  constructor() {
    super();

    this.setDependencies();
  }

  setDependencies() {
    this.externalRefs = {
      categories: this.parentNode.querySelectorAll(this.refs.categories)
    };
  }

  setAttributes() {
    this.modal = RenderedComponents['modal-popup'];
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
      this.resources.libs.awoo,
    ];
  }

  style() {
    return `
      *:not(:defined) { display: none; }

      #tabs,
      #tabs .widgets,
      #tabs ul li:last-child {
          position: absolute;
      }

      #tabs {
          width: 100%;
          height: 100%;
      }

      #tabs ul {
          counter-reset: tabs;
          height: 100%;
          position: relative;
          list-style: none;
          margin-left: 1em;
      }

      #tabs ul li:not(:last-child)::after {
          content: counter(tabs, cjk-ideographic);
          counter-increment: tabs;
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          align-items: center;
          text-align: center;
          justify-content: center;
      }

      #tabs ul li:not(:last-child) {
          width: 35px;
          text-align: center;
          font: 100 13px 'Roboto', serif;
          color: #bbb;
          padding: 6px 0;
          transition: all .1s;
          cursor: pointer;
          line-height: 0;
          height: 100%;
      }

      #tabs ul li:not(:last-child):hover {
          background: #34343e;
      }

      #tabs ul li:last-child {
          --flavour: var(--accent);
          width: 35px;
          height: 3px;
          background: var(--flavour);
          bottom: 0;
          transition: all .3s;
      }

      #tabs ul li[active]:not(:last-child) {
          font-weight: 700;
          color: #fff;
          font-size: 16px;
          padding: 6px 0;
      }

      #tabs ul li[active]:nth-child(2) ~ li:last-child { margin: 0 0 0 35px; }
      #tabs ul li[active]:nth-child(3) ~ li:last-child { margin: 0 0 0 70px; }
      #tabs ul li[active]:nth-child(4) ~ li:last-child { margin: 0 0 0 105px; }
      #tabs ul li[active]:nth-child(5) ~ li:last-child { margin: 0 0 0 140px; }

      #tabs ul li[active]:nth-child(2) ~ li:last-child {
          --flavour: #16a2a2;
      }

      #tabs ul li[active]:nth-child(3) ~ li:last-child {
          --flavour: #5b52e4;
      }

      .widgets {
          right: 0;
          margin: auto;
          height: 32px;
          color: #fff;
          font-size: 12px;
          background: #1d1d21;
      }

      .widgets:hover .edit {
          margin: 0;
      }

      .widget {
          position: relative;
          height: 100%;
          padding: 0 1em;
      }

      .widget:first-child {
          padding-left: 2em;
      }

      .widget:last-child {
          padding-right: 2em;
      }

      .widget:hover {
          cursor: pointer;
          background: rgba(255, 255, 255, .05);
      }

      #tabs > cols {
          position: relative;
          grid-template-columns: [add-tab] 35px [tabs] auto [widgets] auto;
      }

      #tabs .time span {
          font-weight: 400;
      }

      #tabs i {
          font-size: 14pt !important;
      }

      .widget:not(:first-child)::before {
          content: '';
          position: absolute;
          display: block;
          left: 0;
          height: calc(100% - 15px);
          width: 1px;
          background: rgb(255 255 255 / 10%);
      }

      .add-tab {
          border: 0;
          background: #282830;
          color: #9898a5;
          cursor: pointer;
          border-radius: 5px 15px 15px 5px;
      }

      .add-tab:hover {
          filter: brightness(1.2);
      }

      .add-tab-icon {
          font-size: 12pt;
          font-weight: bold;
      }
    `;
  }

  template() {
    return `
        <div id="tabs">
            <cols>
                <button class="+ add-tab">
                  <span class="material-icons add-tab-icon">add</span>
                </button>
                <ul class="- indicator"></ul>
                <div class="+ widgets col-end">
                    <crypto-rate class="+ widget"></crypto-rate>
                    <current-time class="+ widget"></current-time>
                    <weather-forecast class="+ widget weather"></weather-forecast>
                </div>
            </cols>
        </div>`;
  }

  setEvents() {
    // this.refs.addTab.onclick = () => this.addNewTab();

    this.refs.tabs.forEach(tab =>
      tab.onclick = ({ target }) => this.handleTabChange(target));

    document.onkeydown = (e) => this.handleKeyPress(e);

    if (CONFIG.openLastVisitedTab)
      window.onbeforeunload = () => this.saveCurrentTab();
  }

  saveCurrentTab() {
    localStorage.lastVisitedTab = this.currentTabIndex;
  }

  openLastVisitedTab() {
    if (!CONFIG.openLastVisitedTab) return;
    this.activateByKey(localStorage.lastVisitedTab);
  }

  handleTabChange(tab) {
    this.activateByKey(Number(tab.getAttribute('tab-index')));
  }

  handleKeyPress(event) {
    if (!event) return;

    let { key } = event;

    if (Number.isInteger(parseInt(key)) && key <= this.externalRefs.categories.length)
      this.activateByKey(key - 1);
  }

  activateByKey(key) {
    this.currentTabIndex = key;

    this.activate(this.refs.tabs, this.refs.tabs[key]);
    this.activate(this.externalRefs.categories, this.externalRefs.categories[key]);
  }

  setupModal() {
    this.modal
      .setTitle('Create New Tab')
      .setContent(`
        <p>WIP</p>
    `);
  }

  addNewTab() {
    this.setupModal();
    this.modal.activate();
  }

  createTabs() {
    const categoriesCount = this.externalRefs.categories.length;

    for (let i = 0; i <= categoriesCount; i++)
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
      this.setAttributes();
      this.openLastVisitedTab();
    });
  }
}
