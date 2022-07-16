class Crypto extends Component {
  refs = {
    exchangeValue: '.exchange-value',
    cryptoDiff: 'crypto-diff',
    cryptoPopup: 'crypto-popup',
    cryptoCoin: '.crypto-coin',
    cryptoIcon: 'i.crypto-icon',
    currencySymbol: '.currency-symbol'
  };

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

  defaults = {
    currency: 'USD',
    coin: 'BTC',
    currencySymbol: this.currencies[this.currency],
    refreshInterval: 10
  };

  exchangeClient = null;
  refreshInterval = this.defaults.refreshInterval;
  currency = this.defaults.currency;

  constructor() {
    super();

    this.exchangeClient = new CryptoExchangeClient();
    this.refreshInterval = CONFIG.crypto?.refreshIn;
  }

  setAttributes() {
    this.coin = CONFIG.crypto.coin.toUpperCase();
    this.currency = CONFIG.crypto.currency.toUpperCase();
    this.refs.currencySymbol = this.currencies.getSymbol(this.currency);
  }

  imports() {
    return [
      this.resources.icons.cryptofont,
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  setEvents() {
    this.onclick = ({ currentTarget }) => {
      if (currentTarget === this) this.activatePopup();
    };
  }

  setCryptoIcon() {
    const cryptoFontPrefix = 'cf-';
    const cryptoFontMatcher = new RegExp(`${cryptoFontPrefix}\\w+`, 'i');

    const icon = this.refs.cryptoIcon;
    const iconClassName = cryptoFontPrefix + this.coin.toLowerCase();

    icon.className = icon
        .className
        .replace(cryptoFontMatcher, iconClassName);
  }

  /**
   * @param {number} value
   */
  set coin(value) {
    this.refs.cryptoCoin = value;
    this.setCryptoIcon();
  }

  get coin() { return this.refs.cryptoCoin.innerText; }

  /**
   * @param {number} value
   */
  set exchangeValue(value) {
    this.refs.exchangeValue = Number(value).toLocaleString();
    localStorage.exchangeValue = value;
  }

  get exchangeValue() {
    return localStorage.exchangeValue || 0;
  }

  /**
   * @param {number} percentage
   */
  set exchangeDiff(percentage) {
    this.refs.cryptoDiff.setAttribute('exchange-diff', percentage.toFixed(2));
  }

  setExchangeValue({ current }) {
    this.exchangeValue = current;
  }

  setExchangeDiff(exchange) {
    let previous = Number(exchange.previous);
    let current = Number(exchange.current);

    if (!previous) previous = current;

    const diff = current - previous;
    const diffPercent = (diff / previous) * 100;

    this.exchangeDiff = diffPercent;
  }

  async getCurrentPrice() {
    const exchangeRate =
      await this.exchangeClient.getExchangeRate(this.coin, this.currency);

    const price = parseFloat(exchangeRate[this.currency]).toFixed(2);

    return price;
  }

  async setExchangeRate() {
    const price = await this.getCurrentPrice();

    const exchange = {
      previous: this.exchangeValue,
      current: price
    };

    this.setExchangeValue(exchange);
    this.setExchangeDiff(exchange);
  }

  activatePopup() {
    RenderedComponents['crypto-popup'].activate();
  }

  async connectedCallback() {
    const REFRESH_IN_SECS = 1000 * this.refreshInterval;

    await this.render();

    this.setAttributes();
    this.setEvents();
    this.setExchangeRate();

    setInterval(async () =>
      this.setExchangeRate(),
      REFRESH_IN_SECS);
  }

  async refresh() {
    this.setAttributes();
    this.setExchangeRate();
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
      .crypto-coin {
          color: var(--main-accent);
      }

      .crypto-coin {
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
    return `
        <crypto-popup></crypto-popup>
        <i class="cf cf-${this.defaults.coin.toLowerCase()} crypto-icon"></i>
        <div class="crypto-value crypto-icon">
            <span class="crypto-coin">${this.coin}</span>
            <span class="crypto-price">
                <span class="currency-symbol">${this.defaults.currencySymbol}</span>
                <span class="exchange-value">0</span>
            </span>
            <crypto-diff></crypto-diff>
        </div>`;
  }
}
