class Notify {
  constructor({ title, body, timestamp }, clickEvt) {
    this.title = title;
    this.body = body;
    this.timestamp = timestamp;
    this.clickEvt = clickEvt;
  }

  static async create(task, clickEvt) {
    const notifier = new Notify(task, clickEvt);

    if (await notifier.getPermission())
      notifier.triggerAt(task.timestamp);
  }

  async getPermission() {
    if (Notification.permission === 'granted')
      return true;

    if (Notification.permission !== 'denied') {
      let permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  show() {
    const notification = new Notification(this.title, {
      body: this.body,
      timestamp: this.timestamp
    });

    notification.onclick = this.clickEvt;

    setTimeout(() => notification.close(), 10 * 1000);
  }

  triggerAt(date) {
    const reminderDate = new Date(date).getTime();
    const now = new Date().getTime();
    const offsetMillis = reminderDate - now;

    setTimeout(() => this.show(), offsetMillis);
  }
}
