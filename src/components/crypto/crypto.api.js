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