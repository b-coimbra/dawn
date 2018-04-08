const $ = {
  qS: e => document.querySelector(e),
  qA: e => document.querySelectorAll(e)
};

const { parse, stringify } = JSON;

const nodes = (elem) =>
      Array.prototype.slice.call($.qS(elem).children);

var place = localStorage.place || 'new york';

(function () {
  if (localStorage.getItem("todo") === null)
    localStorage.todo = '[]';
})();

new Todo().display;
new Weather(place).getWeather;
new Powerline().on;
