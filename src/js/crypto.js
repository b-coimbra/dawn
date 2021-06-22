
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

class Crypto extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
    this.from = this.getAttribute('from');
    this.to = this.getAttribute('to');
    this.exchange = new CryptoExchange(this.from, this.to);
  }

  imports() {
    return `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`;
  }

  style() {
    return `
        <style>
            .crypto-value {
                display: flex;
                align-items: center;
            }

            .crypto-icon {
                margin-right: 10px;
                font-size: 12pt;
            }

            .crypto-icon,
            .crypto-type {
                color: #6fd468;
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
            }
        </style>
    `;
  }

  build() {
    const template = `
        ${this.imports()}
        ${this.style()}
        <span class="material-icons crypto-icon">show_chart</span>
        <p class="crypto-value">
            <span class="crypto-type">${this.from}</span>
            <span class="crypto-price">${this.exchangeValue}</span>
        </p>`;

    this.shadow.innerHTML = template;
  }

  async setExchangeValue() {
    const exchange = await this.exchange.get();
    this.exchangeValue = parseFloat(exchange[this.to]);
  }

  async connectedCallback() {
    await this.setExchangeValue();
    this.build();
  }
}

customElements.define('crypto-rate', Crypto);
