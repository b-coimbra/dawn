// +--------+
// | SEARCH |
// +--------+
var search  = $.qS('#search'),
    input   = $.qS('#search input[type="text"]'),
    engines = engines();

for (var key in engines)
  $.qS('.search-engines').innerHTML += `<li><p title="${engines[key][1]}">!${key}</p></li>`;

$.qS('#search .close').onclick = () =>
  search.classList.remove('active');

document.onkeypress = (e) => {
  if (document.activeElement !== $.qS('.addTodo input') && document.activeElement !== $.qS('.weather-config input')) {
    if (e.key == 's')
      search.classList.add('active');

    input.focus();
    input.scrollIntoView();

    $.qS('#search .close').onclick = () =>
      search.classList.remove('active');

    search.onkeyup = (e) => {
      let args   = e.target.value.split(' '),
          prefix = args[0],
          engine = engines['g'][0], // default engine
          str    = 0;

      $.qA('.search-engines li p').forEach((eng) => {
        let current = eng.parentNode;

        (prefix == eng.innerHTML)
          ? current.classList.add('active')
          : current.classList.remove('active');
      });

      if (e.key == 'Enter') {
        if (prefix.indexOf('!') == 0)
          (engine = engines[prefix.substr(1)][0], str = 3);

        window.location = engine + args.join(' ').substr(str).toString().replace(/\s+/m, '%20');
      } else if (e.keyCode == 27)
        search.classList.remove('active');
    };
  }
};
