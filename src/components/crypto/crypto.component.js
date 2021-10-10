class Crypto extends Component {
  refs = {
    exchangeValue: '.exchange-value',
    cryptoDiff: 'crypto-diff',
    cryptoPopup: 'crypto-popup'
  };

  from;
  to;
  exchange;
  refreshInterval = 10;
  currencies = {
    'USD': '$',
    'JPY': '¥',
    'GBP': '£',
    'EUR': '€',
    'BRL': 'R$',
    getSymbol(currency) {
      return this[currency] || '¤';
    }
  };

  constructor() {
    super();

    this.refreshInterval = GLOBAL_CONFIG.crypto?.refreshIn || 10;
    this.setAttributes();
    this.setDependencies();
    this.setEvents();
  }

  setAttributes() {
    this.from = GLOBAL_CONFIG.crypto.coin.toUpperCase();
    this.to = GLOBAL_CONFIG.crypto.currency.toUpperCase();
    this.setAttribute('exchange-value', '0');
  }

  setEvents() {
    this.onclick = () => this.togglePopup();
  }

  setDependencies() {
    this.exchange = new CryptoExchange(this.from, this.to);
  }

  imports() {
    return [
      this.resources.icons.bitonics,
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  style() {
    return `
      :host {
          --main-accent: #6fd468;
      }

      * {
          font-family: 'Roboto', sans-serif;
      }

      .crypto-value {
          display: flex;
          align-items: center;
      }

      .crypto-icon {
          margin-right: 5px;
          font-size: 9pt;
      }

      .crypto-price {
          white-space: nowrap;
      }

      .crypto-icon,
      .crypto-type {
          color: var(--main-accent);
      }

      .crypto-type {
          font-weight: bold;
          margin-right: 10px;
          font-size: 7pt;
      }

      .crypto-value {
          font-weight: 400;
          font-size: 9pt;
          color: #c1c1c1;
          white-space: nowrap;
      }

      .currency-symbol {
          color: #848484;
      }

      crypto-diff {
          margin-left: 5px;
      }

      crypto-popup {
          position: absolute;
          width: 100%;
          height: 50px;
          bottom: 32px;
          right: 0px;
          z-index: 2;
          background: rgb(41 41 44);
          box-shadow: 0 -5px 20px rgb(0 0 0 / 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          border-radius: 5px 5px 0 0;
          display: none;
          visibility: hidden;
          animation: open-popup .5s forwards;
      }

      crypto-popup.active {
          display: flex;
          visibility: visible;
      }

      @keyframes open-popup {
          from {
              opacity: 0;
              bottom: 0;
          }
          to {
              opacity: 1;
              bottom: 32px;
          }
      }
    `;
  }

  async template() {
    const currencySymbol = this.currencies.getSymbol(this.to);

    return `
        <!-- <crypto-popup></crypto-popup> -->
        <i class="bt bt-${this.from.toLowerCase()} crypto-icon"></i>
        <div class="crypto-value crypto-icon">
            <span class="crypto-type">${this.from}</span>
            <span class="crypto-price">
                <span class="currency-symbol">${currencySymbol}</span>
                <span class="exchange-value">0</span>
            </span>
            <crypto-diff></crypto-diff>
        </div>`;
  }

  /**
   * Calculate new exchange diff percentage when the exchange value is updated
   * @returns {void}
   */
  handleExchangeUpdate(oldExchange, newExchange) {
    oldExchange = Number(oldExchange);
    newExchange = Number(newExchange);

    if (oldExchange == 0) {
      const lastExchangeValue = localStorage.exchangeValue;
      oldExchange = !lastExchangeValue ? newExchange : lastExchangeValue;
    }

    const exchangeDiff = newExchange - oldExchange;
    const exchangeDiffPercent = (exchangeDiff / oldExchange) * 100;

    this.refs.cryptoDiff.setAttribute('exchange-diff', exchangeDiffPercent.toFixed(2));
  }

  /**
   * GET current exchange rate value based on the currency and coin specified
   * @async
   * @ returns {void}
   */
  async setExchangeRate() {
    this.exchangeRate = await this.exchange.get();

    const exchangeRate = await this.exchangeRate;
    const exchangeValue = parseFloat(exchangeRate[this.to]).toFixed(2);

    this.refs.exchangeValue = Number(exchangeValue).toLocaleString();
    this.setAttribute('exchange-value', exchangeValue);

    localStorage.exchangeValue = exchangeValue;
  }

  togglePopup() {
    this.refs.cryptoPopup.classList.toggle('active');
  }

  attributeChangedCallback(name, oldExchange, newExchange) {
    if (name === 'exchange-value')
      this.handleExchangeUpdate(oldExchange, newExchange);
  }

  static get observedAttributes() {
    return ['exchange-value'];
  }

  async connectedCallback() {
    const REFRESH_IN_SECS = 1000 * this.refreshInterval;

    this.render();

    await this.setExchangeRate();

    setInterval(async () =>
      await this.setExchangeRate(),
      REFRESH_IN_SECS);
  }
}
