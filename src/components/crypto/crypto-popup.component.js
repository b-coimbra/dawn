class CryptoPopup extends Component {
  refs = {};

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
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
        <select name="coins" class="dropdown coins-option">
          <option value="ETH">ETH</option>
        </select>
        <i class="material-icons exchange-arrow-icon">arrow_forward</i>
        <select name="currencies" class="dropdown currencies-option">
          <option value="USD">USD</option>
        </select>
      </div>
    `;
  }

  async connectedCallback() {
    this.render();
  }
}

customElements.define('crypto-popup', CryptoPopup);
