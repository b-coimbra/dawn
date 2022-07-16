class Tasks extends Component {
  constructor() {
    super();
  }

  static directions = {
    UP: 'move-up',
    DOWN: 'move-down',
    isUp: function(dir) {
      return this.UP === dir;
    },
    isDown: function(dir) {
      return this.DOWN === dir;
    }
  };

  static create(data) {
    const task = {
      id: this.id,
      title: data.title,
      description: data?.description ?? '',
      url: data?.url ?? '',
      createdAt: this.getCreationDate(),
      priority: data?.priority ?? -1,
      reminder: data?.reminder,
      state: 0
    };

    this.setReminder(task);
    this.save(task);

    return task;
  }

  static getCreationDate() {
    const date = new Date();

    return {
      date: date.strftime('e b'),
      time: date.strftime('h:i')
    };
  }

  static async setReminder(task) {
    if (!task.reminder) return;

    await Notify.create({
      title: task.title,
      body: task.description,
      timestamp: task.reminder
    }, () => this.followUrl(task));
  }

  static get id() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static getIds() {
    return this.getAll().map(task => task.id);
  }

  static save(task) {
    let tasks = this.getAll();

    tasks.push(task);

    localStorage.tasks = stringify(tasks);
  }

  static update(task, elemRef, updatedField) {
    if (!this.getIds().includes(task.id)) return;

    let tasks = this.getAll();
    let index = tasks.findIndex(x => x.id === task.id);

    tasks[index] = { ...tasks[index], ...task };

    if (updatedField) {
      const field = elemRef.querySelector(`.task-${updatedField}`);
      if (field) field.innerText = task[updatedField];
    }

    localStorage.tasks = stringify(tasks);
  }

  static getById(id) {
    return this.getAll().find(task => task.id === id);
  }

  static toggle(elem) {
    const tasks = this.getAll();

    let task = tasks.find(x => x.id === elem.id);

    if (!task) return;

    task.state = !task.state;
    localStorage.tasks = JSON.stringify(tasks);

    elem.setAttribute('status', this.getStatus(task.state));
  }

  static clean(tasks) {
    if (!tasks.length) return Tasks.remove(tasks);
    return tasks.forEach(task => Tasks.remove(task));
  }

  static remove(task) {
    let tasks = this.getAll();

    tasks = tasks.filter(x => x.id !== task.id);
    localStorage.tasks = stringify(tasks);

    task.classList.add('remove');

    setTimeout(() => task.remove(), 350);
  }

  static getStatus(state) {
    return ['todo', 'done'][state | 0];
  }

  static getPriority(priority) {
    if (priority < 0) return 'none';
    return ['low', 'medium', 'high'][priority | 0];
  }

  static getAll() {
    if (!localStorage.tasks) return [];
    return parse(localStorage.tasks);
  }

  static getAllTemplates() {
    return this
      .getAll()
      .map((task, i) => this.template(task, i))
      .join('');
  }

  static move(elem, direction) {
    elem.setAttribute('move-direction', direction);

    let tasks = this.getAll();

    const index = tasks.findIndex(f => f.id === elem.id);
    const currentTask = tasks[index];
    let lookup = index + 1;

    if (direction === this.directions.UP) lookup = index - 1;

    tasks[index] = tasks[lookup];
    tasks[lookup] = currentTask;

    localStorage.tasks = JSON.stringify(tasks);
  }

  static getTaskIndex(id) {
    return this.getAll().findIndex(task => task.id === id);
  }

  static isLast(idx) {
    return (this.getAll().length - 1) === idx;
  }

  static toggleAlert(target, taskId, hasAlert) {
    const icon = target.firstElementChild;
    const tasks = this.getAll();

    const task = tasks.find(x => x.id === taskId);

    task.alert = !hasAlert;
    icon.innerText = hasAlert ? 'notifications_none' : 'notifications';

    localStorage.tasks = JSON.stringify(tasks);
  }

  static followUrl(taskId) {
    const url = this.getById(taskId)?.url;
    if (url) window.open(url, '_blank').focus();
  }

  static template(task, index = -1) {
    return `
        <task index="${index}"
              status="${this.getStatus(task.state)}"
              priority="${this.getPriority(task.priority)}"
              id="${task.id}"
              has-url="${Boolean(task.url)}"
              class="slide-in">
            ${EditTask.template(task)}
            <div class="task-controls">
              <button class='task-control task-move-up control-arrows' onclick="Tasks.move(this.parentNode.parentNode, Tasks.directions.UP)">
                <i class="material-icons">keyboard_arrow_up</i>
              </button>
              <button class="task-toggle" onclick="Tasks.toggle(this.parentNode.parentNode)"></button>
              <button class='task-control task-move-down control-arrows' onclick="Tasks.move(this.parentNode.parentNode, Tasks.directions.DOWN)">
                <i class="material-icons">keyboard_arrow_down</i>
              </button>
            </div>
            <rows>
                <p class="task-title">${task.title}</p>
                <p class="task-description">${task.description}</p>
                <div class="row-end task-footer">
                  <p class="added-at">
                    ${task.createdAt.date} - <span>${task.createdAt.time}</span>
                  </p>
                  <div class="+ priority"></div>
                </div>
                <div class="task-options">
                  <button class="task-option edit-task" onclick="EditTask.open(this.parentNode.parentNode.parentNode)" title="Edit Task">
                    <i class="material-icons">edit</i>
                  </button>
                  <button class="task-option add-task-link ${!task.url ? 'disabled' : ''}" onclick="Tasks.followUrl('${task.id}')" title="Follow link">
                    <i class="material-icons">link</i>
                  </button>
                  <button class="task-option add-task-alert ${!task.reminder ? 'disabled' : ''}" onclick="Tasks.toggleAlert(this, '${task.id}', ${task.alert})" title="Toggle reminder">
                    <i class="material-icons">${task.alert ? 'notifications' : 'notifications_none'}</i>
                  </button>
                  <button class="task-option close-task" onclick="Tasks.remove(this.parentNode.parentNode.parentNode)">
                    <i class="material-icons">close</i>
                  </button>
                </div>
            </rows>
        </task>`;
  }
}
