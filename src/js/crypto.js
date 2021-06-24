class CryptoExchange {
  constructor(from, to) {
    this.url = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
  }

  async get() {
    return await fetch(this.url)
      .then(data => data.json())
      .catch(err => console.error(err));
  }
}

class Crypto extends Component {
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
    return [this.resources.icons.material];
  }

  style() {
    return `
        <style>
            :host {
                --exchange-increase: #6fd468;
                --exchange-decrease: #ff7b95;
            }

            .crypto-value {
                display: flex;
                align-items: center;
            }

            .crypto-icon {
                margin-right: 10px;
                font-size: 12pt;
            }

            .crypto-price {
                white-space: pre;
            }

            .crypto-icon,
            .crypto-type {
                color: var(--exchange-increase);
            }

            .crypto-type {
                font-weight: bold;
                margin-right: 10px;
                font-size: 7pt;
            }

            .crypto-value {
                font-weight: 400;
                font-size: 9pt;
                color: #b0b0c3;
                white-space: nowrap;
            }

            .crypto-diff {
                margin-left: 1em;
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
        </style>
    `;
  }

  getCurrencySymbol(currency) {
    return this.currency_symbols[currency] || '¤';
  }

  exchangeDiffTemplate(exchangeChange) {
    let exchangeStatus = 'exchange-increase';
    let exchangeIndicator = 'arrow_drop_up';

    if (exchangeChange < 0) {
      exchangeStatus = 'exchange-decrease';
      exchangeIndicator = 'arrow_drop_down';
    }

    return `
        <p class="crypto-diff ${exchangeStatus}">
            <span class="material-icons crypto-change-indicator-icon">${exchangeIndicator}</span>
            <span class="crypto-change-value">${Math.abs(this.exchangeChange).toFixed(2)} %</span>
        </p>`;
  }

  template() {
    const currencySymbol = this.getCurrencySymbol(this.to);
    const exchangeValue = this.getAttribute('exchange-value');

    return `
        <span class="material-icons crypto-icon">show_chart</span>
        <div class="crypto-value">
            <span class="crypto-type">${this.from}</span>
            <span class="crypto-price">${currencySymbol} ${exchangeValue}</span>
            ${this.exchangeDiffTemplate(this.exchangeChange)}
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
  }

  attributeChangedCallback(name, oldExchange, newExchange) {
    if (name === 'exchange-value')
      this.handleExchangeUpdate(oldExchange, newExchange);
  }

  static get observedAttributes() {
    return ['exchange-value'];
  }

  async setExchangeValue() {
    const exchange = await this.exchange.get();
    const exchangeValue = parseFloat(exchange[this.to]).toFixed(2);

    this.setAttribute('exchange-value', exchangeValue);
    localStorage.exchangeValue = exchangeValue;
  }

  async connectedCallback() {
    const REFRESH_IN_SECS = 1000 * this.refreshInterval;

    const callbackActions = async () => {
      await this.setExchangeValue();
      this.render();
    };

    await callbackActions();

    setInterval(async () =>
      await callbackActions(),
      REFRESH_IN_SECS);
  }
}

customElements.define('crypto-rate', Crypto);
