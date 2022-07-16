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
    },
    {
      conditions: ['thunderstorm'],
      icon: 'bolt',
      color: 'cloudy'
    }
  ];

  location;

  constructor() {
    super();

    this.setDependencies();
    this.setEvents();
  }

  setEvents() {
    this.onclick = this.swapScale;
  }

  setDependencies() {
    this.location = CONFIG.temperature.location;
    this.temperatureScale = CONFIG.temperature.scale;
    this.weatherForecast = new WeatherForecastClient(this.location);
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
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      .weather-temperature {
          font: 300 9pt 'Roboto', sans-serif;
          color: #c1c1c1;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
      }

      .weather-temperature:hover .weather-temperature-location {
          display: inline-block;
      }

      .weather-temperature-location {
          display: none;
          margin-right: 10px;
      }

      .weather-temperature-location {
          font-weight: 500;
      }

      .weather-temperature-value
      {
          font-weight: bold;
      }

      .weather-condition-icon {
          font-size: 14pt;
          line-height: 0;
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
        <p class="+ weather-temperature">
            <span class="weather-icon" class="+"><i class="material-icons weather-condition-icon sunny">wb_sunny</i></span>
            <span class="weather-temperature-location">${this.location}</span>
            <span class="weather-temperature-value">1</span>
            º<span class="weather-temperature-scale">${this.temperatureScale}</span>
        </p>`;
  }

  toC(f) { return Math.round((f - 32) * 5 / 9); }

  toF(c) { return Math.round(c * 9 / 5 + 32); }

  swapScale() {
    this.temperatureScale = this.temperatureScale === 'C' ? 'F' : 'C';

    CONFIG.temperature = {
      ...CONFIG.temperature,
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

    return this.forecasts[0];
  }

  async connectedCallback() {
    await this.render();
    await this.setWeather();
  }
}
