
class Clock extends Component {
  refs = {
    hours: '.clock-hours',
    minutes: '.clock-minutes'
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
            word-spacing: -2px;
        }

        .clock-hours {
            font-weight: bold;
            color: white;
        }

        .clock-icon {
            color: #ff7b95;
            font-size: 10pt;
            margin-right: 10px;
            margin-left: 1em;
            margin-bottom: 1px;
        }
    `;
  }

  template() {
    return `
        <span class="material-icons clock-icon">schedule</span>
        <p class="clock-time">
            <span class="clock-hours">00</span>
            <span>:</span>
            <span class="clock-minutes">00</span>
        </p>
    `;
  }

  setTime() {
    const date = new Date();
    const [hours, minutes] = [date.getHours(), date.getMinutes()];

    this.refs.hours = hours;
    this.refs.minutes = minutes;
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();

      setInterval(() => this.setTime(), 1000);
    });
  }
}

customElements.define('current-time', Clock);
