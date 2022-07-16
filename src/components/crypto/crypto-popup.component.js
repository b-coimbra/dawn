class CryptoPopup extends Component {
  refs = {
    coins: '.coins-option',
    currencies: '.currencies-option'
  };

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  setEvents() {
    this.refs.coins.onchange = (e) => this.onSelectChange(e);
    this.refs.currencies.onchange = (e) => this.onSelectChange(e);
    this.onclick = (e) => {
      if (e.currentTarget === this) this.deactivate();
    };
  }

  setSelectedValues() {
    this.refs.coins.value = CONFIG.crypto.coin;
    this.refs.currencies.value = CONFIG.crypto.currency;
  }

  onSelectChange({ target }) {
    const { name, value } = target;
    CONFIG.crypto = { ...CONFIG.crypto, [name]: value };
    this.refresh();
  }

  activate() {
    this.classList.toggle('active');
  };

  deactivate() {
    this.classList.remove('active');
  }

  refresh() {
    RenderedComponents['crypto-rate'].refresh();
  }

  style() {
    return `
      .dropdown {
          background: #202025;
          color: #bfbfbf;
          outline: 0;
          border: 0;
          box-shadow: 0 0 0 2px #45454a;
          border-radius: 5px;
          font-size: 9pt;
          padding: 5px;
          cursor: pointer;
          font-family: 'Roboto', sans-serif;
          font-weight: 600;
      }

      .dropdown:hover {
          color: #e0e0e0;
          box-shadow: 0 0 0 2px #5e5e63;
      }

      .crypto-options {
          width: 100%;
          display: flex;
          justify-content: space-evenly;
      }

      .exchange-arrow-icon {
          color: grey;
      }
    `;
  }

  template() {
    return `
      <div class="crypto-options">
        <select name="coin" class="dropdown coins-option">
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
          <option value="BNB">BNB</option>
          <option value="XRP">XRP</option>
          <option value="ADA">ADA</option>
          <option value="SOL">SOL</option>
          <option value="DOGE">DOGE</option>
        </select>
        <i class="material-icons exchange-arrow-icon">arrow_forward</i>
        <select name="currency" class="dropdown currencies-option">
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="JPY">YEN ¥</option>
          <option value="BRL">BRL R$</option>
        </select>
      </div>
    `;
  }

  async connectedCallback() {
    this.render().then(() =>{
      this.setEvents();
      this.setSelectedValues();
    });
  }
}
