class CryptoDiff extends Component {
  refs = {
    diff: '.crypto-diff',
    diffIcon: '.crypto-change-indicator-icon',
    diffValue: '.crypto-change-value'
  };

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material
    ];
  }

  style() {
    return `
        :host {
            --exchange-increase: #6fd468;
            --exchange-decrease: #ff7b95;
        }

        .crypto-diff.exchange-increase {
            color: var(--exchange-increase);
        }

        .crypto-diff.exchange-decrease {
            color: var(--exchange-decrease);
        }

        .crypto-change-indicator-icon {
            vertical-align: bottom;
            height: 14px;
            font-size: 13pt;
        }
    `;
  }

  template() {
    return `
      <p class="crypto-diff exchange-increase">
        <span class="material-icons crypto-change-indicator-icon">arrow_drop_up</span>
        <span class="crypto-change-percent">
          <span class="crypto-change-value">0.00</span> %
        </span>
      </p>`;
  }

  /**
   * @param {number} diffPercent
   */
  set diff(diffPercent) {
    this.refs.diff.classList.remove('exchange-decrease', 'exchange-increase');
    this.refs.diff.classList.add(`exchange-${(diffPercent < 0) ? 'decrease' : 'increase'}`);
  }

  /**
   * @param {number} diffPercent
   */
  set diffValue(diffPercent) {
    this.refs.diffValue.innerText = Math.abs(diffPercent).toFixed(2);
  }

  /**
   * @param {number} diffPercent
   */
  set diffIcon(diffPercent) {
    this.refs.diffIcon.innerText = (diffPercent < 0) ? 'arrow_drop_down' : 'arrow_drop_up';
  }

  refresh() {
    const exchangeDiff = this.getAttribute('exchange-diff');

    this.diff = exchangeDiff;
    this.diffIcon = exchangeDiff;
    this.diffValue = exchangeDiff;
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'exchange-diff') this.refresh();
  }

  static get observedAttributes() {
    return ['exchange-diff'];
  }

  connectedCallback() {
    this.render().then(() => this.refresh());
  }
}
