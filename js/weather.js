// +---------+
// | WEATHER |
// +---------+
class Weather {
  constructor(location) {
    this.location = location;
  }

  get getWeather() {
    return this.fetchWeather(this.handleWeather);
  }

  handleWeather(response) {
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

    $.qS('.weather p[weather]').innerHTML = `<i class="material-icons" ${color}>${icon}</i>`;
    $.qS('.weather p[temperature]').innerHTML = `${currentTemp}ºC`;
  }

  fetchWeather(callback) {
    let request = new XMLHttpRequest(),
        url = `https://api.openweathermap.org/data/2.5/weather?q=${this.location}&units=metric&appid=50a34e070dd5c09a99554b57ab7ea7e2`;

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
}
