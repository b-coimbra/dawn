class Config {
  defaults = {
    crypto: {
      currency: 'USD',
      coin: 'ETH',
      disabled: true,
    },
    temperature: {
      location: 'New York',
      scale: 'C'
    },
    clock: 'h:i p',
    search: {
      engines: {
        g: ['https://google.com/search?q=', 'Google'],
        y: ['https://youtube.com/results?search_query=', 'Youtube'],
      }
    },
    keybindings: {
      "t": Actions.activate('todo-list'),
      "s": Actions.activate('search-bar')
    }
  };

  constructor (config) {
    this.autoConfig(config);
    this.setKeybindings();
    this.save();

    return new Proxy(this, {
      ...this,
      __proto__: this.__proto__,
      set(target, prop, value) {
        return this.settingUpdatedCallback(target, prop, value);
      }
    });
  }

  settingUpdatedCallback(target, prop, val) {
    if (!(prop in target)) return false;

    Reflect.set(target, prop, val);
    Object.assign(this, target);

    this.save();

    return true;
  }

  /**
   * Set default config values if not stored in the local storage
   * @returns {void}
   */
  autoConfig(config) {
    Object.keys(this.defaults).forEach(setting => {
      if (setting in config)
        this[setting] = config[setting];
      else
        if (this.inStorage(setting))
          this[setting] = this.getStorageValue(setting);
        else
          this[setting] = this.defaults[setting];
    });
  }

  toJSON() {
    return { ...this, defaults: undefined };
  }

  /**
   Trigger keybinding actions
   * @returns {void}
   */
  setKeybindings() {
    document.onkeypress = ({ key }) => {
      if (document.activeElement !== document.body) return;

      if (Object.keys(this.defaults.keybindings).includes(key)) {
        this.defaults.keybindings[key]();
      }
    };
  }

  // TODO: move to storage.js
  getStorageValue(prop) {
    return parse(localStorage.config)[prop] || this.defaults[prop];
  }

  // TODO: move to storage.js
  inStorage(value) {
    if (!localStorage?.config) return false;
    return value in parse(localStorage.config);
  }

  // TODO: move to storage.js
  save() {
    localStorage.config = stringify(this);
  }

  exportSettings() {
    const anchor = document.createElement('a');
    const filename = 'dawn.config.json';
    const mimeType = 'data:text/plain;charset=utf-8,';

    anchor.href = mimeType + encodeURIComponent(stringify(this, null, 2));
    anchor.download = filename;

    anchor.click();
  }
}
