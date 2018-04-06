const $ = (e) => document.querySelector(e);
const $A = (e) => document.querySelectorAll(e);
const { parse, stringify } = JSON;

var place = localStorage.place || 'new york';

const nodes = (elem) =>
  Array.prototype.slice.call($(elem).children);

(function () {
  if (localStorage.getItem("todo") === null)
    localStorage.todo = '[]';

  show();
  stateHandler();
  fetchWeather(handleWeather);
})();

// +-----------+
// | TODO LIST |
// +-----------+
function show(current = false) {
  let todos = parse(localStorage.todo);

  if (current)
    todos = todos.slice(-1);

  for (let key of todos) {
    for (let item in key) {
      $('.items').innerHTML +=
        `<item ${key[item][0]}>
            <rows>
                <p>${key[item][1]}</p>
                <button class="!> close"></button>
                <p class="row-end added-at">${key[item][2].toLowerCase()} - <span>${item}</span></p>
            </rows>
          </item>`;
    }
  }
}

$('.add').onclick = () => {
  $('.add').classList.toggle('active');
  $('.addTodo').classList.toggle('active');
};

$('.addTodo input').onkeydown = (e) => {
  if (e.key == 'Enter') {
    let todos = [],
        temp  = localStorage.todo;

    todos = parse(temp);
    todos.push({[strftime('H:i')]: ['undone', e.target.value, strftime('e b')]});

    localStorage.todo = stringify(todos);

    e.target.value = '';

    show(true);
    stateHandler();
  }
};

let removeState = (elem) => {
  let state = elem.hasAttribute('done') ? 'done' : 'undone';

  elem.removeAttribute(state);
  elem.setAttribute((state == 'done' ? 'undone' : 'done'), '');
};

function stateHandler() {
  $A('.items .close').forEach((elem) => {
    elem.onclick = (e) => {
      let parent = e.target.parentNode.parentNode,
          index  = nodes('.items').indexOf(parent) - 1,
          todos  = parse(localStorage.todo);

      todos.splice(index, 1);
      localStorage.todo = stringify(todos);

      parent.classList.add('remove');

      setTimeout(() => {
        $('.items').removeChild(parent);
      }, 250);
    };
  });

  $A('.items item').forEach((elem) => {
    elem.onclick = (e) => {
      let todos = parse(localStorage.todo),
          index = nodes('.items').indexOf(elem) - 1,
          state = elem.hasAttribute('done') ? 'undone' : 'done',
          temp  = todos[index],
          obj   = {};

      for (let key in temp)
        obj = {[key]: [state, temp[key][1], temp[key][2]]};

      todos.splice(index, 1, obj);
      localStorage.todo = stringify(todos.filter((el) => {
        return typeof el != "object" || Array.isArray(el) || Object.keys(el).length > 0;
      }));;

      removeState(elem);
    };
  });
}

// +-----------+
// | POWERLINE |
// +-----------+
let tabs = {
  1: 'tech',
  2: 'music',
  3: 'bookmarks'
};

let activate = (obj, item) => {
  $A(obj).forEach((i) => i.classList.remove('active'));
  $(item).classList.add('active');
};

document.onkeydown = (e) => {
  if (e.altKey && e != undefined) {
    if (Number.isInteger(parseInt(e.key))) {
      activate('#tabs ul li', `#tabs ul li:nth-child(${e.key})`);
      activate('#panels ul', `.${tabs[e.key]}`);
    }
  }
};

$('.time').innerHTML = `${strftime('H')}<span>:${strftime('i')}</span>`;

// +---------+
// | WEATHER |
// +---------+
function handleWeather(response) {
  let temperature    = response.main.temp.toString(),
      currentTemp    = (temperature.indexOf('-') != 0 && temperature.indexOf('.') != 2 && temperature.length != 2) ? temperature.substr(0, 1)  : temperature.substr(0, 2),
      currentWeather = response.weather[0].main,
      icon           = 'wb_sunny',
      color          = 'sunny';

  [
    ['cloud_queue', 'cloudy', 'Clouds', 'Mist', 'Haze'],
    ['opacity', 'cloudy', 'Drizzle', 'Snow', 'Rain'],
    ['wb_sunny', 'sunny', 'Clear']
  ].forEach((key) => {
    key.slice(2).forEach((elem) => {
      if (currentWeather == elem) {
        icon  = key[0];
        color = key[1];
      }
    });
  });

  $('.weather p[weather]').innerHTML = `<i class="material-icons" ${color}>${icon}</i>`;
  $('.weather p[temperature]').innerHTML = `${currentTemp}ºC`;
}

function fetchWeather(callback) {
  let request = new XMLHttpRequest(),
      url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=50a34e070dd5c09a99554b57ab7ea7e2`;

  request.open('GET', url, true);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400)
      callback(JSON.parse(this.response));
    else {
      console.log("Weather API returned an error: " + this.response);
      callback(null);
    }
  };

  request.onerror = () => {
    console.log("Request to weather API failed.");
    callback(null);
  };

  request.send();
}
