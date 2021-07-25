class Crypto extends Component {
  refs = {
    exchangeValue: '.exchange-value',
    cryptoDiff: 'crypto-diff'
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

    this.stylePath = "src/components/crypto/crypto.style.css";

    this.setAttributes();
    this.setDependencies();
  }

  setAttributes() {
    this.from = GLOBAL_CONFIG.crypto.coin.toUpperCase();
    this.to = GLOBAL_CONFIG.crypto.currency.toUpperCase();
    this.setAttribute('exchange-value', '0');
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

  async template() {
    const currencySymbol = this.currencies.getSymbol(this.to);

    return `
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

customElements.define('crypto-rate', Crypto);
