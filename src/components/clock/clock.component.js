class Clock extends Component {
  refs = {
    clock: '.clock-time'
  };

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  style() {
    return `
        .clock-time {
            white-space: nowrap;
            font: 300 9pt 'Roboto', sans-serif;
            color: #c1c1c1;
            letter-spacing: .5px;
        }

        .clock-icon {
            color: #ff7b95;
            font-size: 10pt;
            margin-right: 10px;
            margin-bottom: 1px;
        }
    `;
  }

  template() {
    return `
        <span class="material-icons clock-icon">schedule</span>
        <p class="clock-time"></p>
    `;
  }

  setTime() {
    const date = new Date();

    this.refs.clock = date.strftime(GLOBAL_CONFIG.clock);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();

      setInterval(() => this.setTime(), 1000);
    });
  }
}
