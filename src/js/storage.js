class Storage {
  key;

  constructor(key) {
    this.key = key;
  }

  get(prop) {
    return parse(localStorage[this.key])[prop];
  }

  save(value) {
    localStorage[this.key] = value;
  }

  hasValue(value) {
    if (!localStorage[this.key]) return false;
    return value in parse(localStorage[this.key]);
  }
}
