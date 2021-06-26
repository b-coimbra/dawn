class WeatherForecast {
  constructor(location) {
    this.appId = '50a34e070dd5c09a99554b57ab7ea7e2';
    this.url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${this.appId}`;
  }

  async getWeather() {
    return await fetch(this.url)
      .then(res  => res.json())
      .then(json => JSON.stringify(json))
      .then(json => JSON.parse(json))
      .then(data => {
        const temperature = Math.round(data.main.temp);
        const condition = data.weather[0].main.toLowerCase();

        return {
          temperature,
          condition
        };
      })
      .catch(err => console.warn('Weather API returned an error:', err));
  }
}

class Weather extends Component {
  refs = {
    temperature: '.weather-temperature-value',
    condition: '.weather-condition-icon',
    scale: '.weather-temperature-scale'
  };

  forecasts = [
    {
      conditions: ['clouds', 'mist', 'haze', 'smoke'],
      icon: 'cloud_queue',
      color: 'cloudy'
    },
    {
      conditions: ['drizzle', 'snow', 'rain'],
      icon: 'opacity',
      color: 'cloudy'
    },
    {
      conditions: ['clear'],
      icon: 'wb_sunny',
      color: 'sunny'
    }
  ];

  constructor() {
    super();

    this.setDependencies();
    this.setEvents();
  }

  setEvents() {
    this.onclick = this.swapScale;
  }

  setDependencies() {
    this.weatherForecast = new WeatherForecast(GLOBAL_CONFIG.temperature.location);
    this.temperatureScale = GLOBAL_CONFIG.temperature.scale;
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  style() {
    return `
        .weather-icon {
            margin-left: 1em;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .weather-temperature {
            font: 300 9pt 'Roboto', sans-serif;
            color: #c1c1c1;
            white-space: nowrap;
        }

        .weather-temperature-value {
            font-weight: bold;
            color: white;
        }

        .weather-condition-icon {
            font-size: 14pt;
        }

        .weather-condition-icon.sunny {
            color: #fd6697;
        }

        .weather-condition-icon.cloudy {
            color: #88d8d8;
        }
    `;
  }

  async template() {
    return `
        <p class="weather-icon" class="+">
            <i class="material-icons weather-condition-icon sunny">wb_sunny</i>
        </p>
        <p class="weather-temperature">
            <span class="weather-temperature-value">1</span>
            º<span class="weather-temperature-scale">${this.temperatureScale}</span>
        </p>`;
  }

  toC(f) { return Math.round((f - 32) * 5 / 9); }

  toF(c) { return Math.round(c * 9 / 5 + 32); }

  swapScale() {
    this.temperatureScale = this.temperatureScale === 'C' ? 'F' : 'C';

    GLOBAL_CONFIG.temperature = {
      ...GLOBAL_CONFIG.temperature,
      scale: this.temperatureScale
    };

    this.setTemperature();
  }

  convertScale(temperature) {
    if (this.temperatureScale === 'F')
      return this.toF(temperature);

    return temperature;
  }

  async setWeather() {
    this.weather = await this.weatherForecast.getWeather();
    this.setTemperature();
  }

  setTemperature() {
    const { temperature, condition } = this.weather;
    const { icon, color } = this.getForecast(condition);

    this.refs.temperature = this.convertScale(temperature);
    this.refs.condition = icon;
    this.refs.scale = this.temperatureScale;
    this.refs.condition.classList.add(color);
  }

  getForecast(condition) {
    for (const forecast of this.forecasts)
      if (forecast.conditions.includes(condition))
        return forecast;
  }

  async connectedCallback() {
    this.render();

    await this.setWeather();
  }
}

customElements.define('weather-forecast', Weather);
