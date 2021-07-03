class Crypto extends Component {
  refs = {
    exchangeValue: '.exchange-value',
    exchangeDiff: '.exchange-diff'
  };

  from;
  to;
  exchange;
  refreshInterval = 10;
  exchangeChange = 0;
  currency_symbols = {
    'USD': '$',
    'JPY': '¥',
    'GBP': '£',
    'EUR': '€',
    'BRL': 'R$'
  };

  constructor() {
    super();

    this.stylePath = "src/components/crypto/crypto.style.css";

    this.setAttributes();
    this.setDependencies();
  }

  setAttributes() {
    this.from = this.getAttribute('from').toUpperCase();
    this.to = this.getAttribute('to').toUpperCase();
    this.setAttribute('exchange-value', '0');
  }

  setDependencies() {
    this.exchange = new CryptoExchange(this.from, this.to);
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  getCurrencySymbol(currency) {
    return this.currency_symbols[currency] || '¤';
  }

  exchangeDiffTemplate(exchangeChange) {
    return `
        <p class="crypto-diff exchange-${ (exchangeChange < 0) ? 'decrease' : 'increase' }">
            <span class="material-icons crypto-change-indicator-icon">
                ${ (exchangeChange < 0) ? 'arrow_drop_down' : 'arrow_drop_up' }
            </span>
            <span class="crypto-change-value">
                <span class="crypto-change-value">${Math.abs(this.exchangeChange).toFixed(2)} %</span>
            </span>
        </p>`;
  }

  async template() {
    const currencySymbol = this.getCurrencySymbol(this.to);

    return `
        <span class="material-icons crypto-icon">show_chart</span>
        <div class="crypto-value">
            <span class="crypto-type">${this.from}</span>
            <span class="crypto-price">${currencySymbol}
                <span class="exchange-value">0</span>
            </span>
            <div class="exchange-diff">
                ${this.exchangeDiffTemplate(this.exchangeChange)}
            </div>
        </div`;
  }

  handleExchangeUpdate(oldExchange, newExchange) {
    oldExchange = Number(oldExchange);
    newExchange = Number(newExchange);

    if (oldExchange == 0) {
      const lastExchangeValue = localStorage.exchangeValue;

      if (lastExchangeValue === undefined)
        oldExchange = newExchange;
      else
        oldExchange = lastExchangeValue;
    }

    const exchangeDiff = newExchange - oldExchange;
    const exchangeChangePercent = (exchangeDiff / oldExchange) * 100;

    this.exchangeChange = exchangeChangePercent.toFixed(2);
    this.refs.exchangeDiff = this.exchangeDiffTemplate(this.exchangeChange);
  }

  attributeChangedCallback(name, oldExchange, newExchange) {
    if (name === 'exchange-value')
      this.handleExchangeUpdate(oldExchange, newExchange);
  }

  static get observedAttributes() {
    return ['exchange-value'];
  }

  async setExchangeRate() {
    this.exchangeRate = await this.exchange.get();

    const exchangeRate = await this.exchangeRate;
    const exchangeValue = parseFloat(exchangeRate[this.to]).toFixed(2);

    this.refs.exchangeValue = exchangeValue;
    this.setAttribute('exchange-value', exchangeValue);

    localStorage.exchangeValue = exchangeValue;
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
