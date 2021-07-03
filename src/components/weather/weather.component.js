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

    this.stylePath = 'src/components/weather/weather.style.css';

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
