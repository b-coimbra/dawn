function engines () {
  return {
    g: ['https://google.com/search?q=', 'Google'],
    i: ['https://ixquick.com/do/search?q=', 'Ixquick'],
    d: ['https://duckduckgo.com/html?q=', 'DuckDuckGo'],
    y: ['https://youtube.com/results?search_query=', 'Youtube'],
    w: ['https://en.wikipedia.org/w/index.php?search=', 'Wikipedia']
  };
}

const GLOBAL_CONFIG = new Config({
  crypto: {
    coin: 'BTC',
    currency: 'USD'
  }
});
