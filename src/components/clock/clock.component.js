
class Clock extends Component {
  refs = {
    hours: '.clock-hours',
    minutes: '.clock-minutes'
  };

  constructor() {
    super();

    this.stylePath = 'src/components/clock/clock.style.css';
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
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

    this.refs.hours = date.strftime('h');
    this.refs.minutes = date.strftime('i');
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();

      setInterval(() => this.setTime(), 1000);
    });
  }
}

customElements.define('current-time', Clock);
