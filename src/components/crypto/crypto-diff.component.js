class CryptoDiff extends Component {
  exchangeDiff;

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
    const exchangeDiff = this.getAttribute('exchange-diff');

    return `
        <p class="crypto-diff exchange-${ (exchangeDiff < 0) ? 'decrease' : 'increase' }">
            <span class="material-icons crypto-change-indicator-icon">
                ${ (exchangeDiff < 0) ? 'arrow_drop_down' : 'arrow_drop_up' }
            </span>
            <span class="crypto-change-value">
                <span class="crypto-change-value">${Math.abs(exchangeDiff).toFixed(2)} %</span>
            </span>
        </p>`;
  }

  attributeChangedCallback(attrName, oldDiff, newDiff) {
    if (attrName === 'exchange-diff') {
      this.render();
    }
  }

  static get observedAttributes() {
    return ['exchange-diff'];
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define('crypto-diff', CryptoDiff);
