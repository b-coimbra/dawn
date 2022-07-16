class CryptoExchangeClient {
  constructor() {
    this.baseUrl = 'https://min-api.cryptocompare.com/data';
  }

  async getExchangeRate(from, to) {
    const url = `${this.baseUrl}/price?fsym=${from}&tsyms=${to}`;

    return await fetch(url)
      .then(data => data.json())
      .catch(err => console.error(err));
  }
}
