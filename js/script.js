const $ = {
  qS: e => document.querySelector(e),
  qA: e => document.querySelectorAll(e)
};

function engines () {
  return {
    g: ['https://google.com/search?q=', 'Google'],
    i: ['https://ixquick.com/do/search?q=', 'Ixquick'],
    d: ['https://duckduckgo.com/html?q=', 'DuckDuckGo'],
    y: ['https://youtube.com/results?search_query=', 'Youtube'],
    w: ['https://en.wikipedia.org/w/index.php?search=', 'Wikipedia']
  };
}

const { parse, stringify } = JSON;

const nodes = (elem) =>
      Array.prototype.slice.call($.qS(elem).children);

var place = localStorage.place || 'new york';

$.qS('.weather .edit').onclick = () =>
  $.qS('.weather-config').classList.add('show');

$.qS('.weather-config input').onkeyup = (e) => {
  if (e.key == 'Enter') {
    localStorage.place = e.target.value;
    window.location.reload();
  }
  else if (e.keyCode == 27)
    e.target.parentNode.classList.remove('show');
};

(function () {
  if (localStorage.getItem("todo") === null)
    localStorage.todo = '[]';
})();

new Todo().display;
new Weather(place).getWeather;
new Powerline().on;
