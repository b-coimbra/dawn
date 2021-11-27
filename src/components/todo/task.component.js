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
      state: 0,
      alert: false
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

    if (updatedField)
      elemRef.querySelector(`.task-${updatedField}`).innerText = task[updatedField];

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
            ${EditTaskPanel.template(task)}
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
                  <p class="added-at">${task.createdAt.date} - <span>${task.createdAt.time}</span></p>
                  <div class="+ priority">
                  </div>
                </div>
                <div class="task-options">
                  <button class="task-option edit-task" onclick="EditTaskPanel.open(this.parentNode.parentNode.parentNode)">
                    <i class="material-icons">edit</i>
                  </button>
                  <button class="task-option add-task-link ${!task.url ? 'disabled' : ''}" onclick="Tasks.followUrl('${task.id}')">
                    <i class="material-icons">link</i>
                  </button>
                  <button class="task-option add-task-alert" onclick="Tasks.toggleAlert(this, '${task.id}', ${task.alert})">
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

class EditTaskPanel extends Component {
  static refs = {
    editTaskPanel: '.edit-task-panel'
  };

  static taskElemRef;

  constructor() {
    super();
  }

  static close(panel) {
    this.taskElemRef.classList.remove('expand');
    panel.classList.remove('active');
  }

  static open(task) {
    this.taskElemRef = task;

    const panel = task.querySelector(this.refs.editTaskPanel);

    task.classList.add('expand');
    panel.classList.add('active');
  }

  static updateField(fieldName, event) {
    const { target, key } = event;

    if (key === 'Escape' || key === 'Enter') {
      this.close(target.parentNode.parentNode.parentNode);
      return;
    }

    let task = Tasks.getById(this.taskElemRef.id);
    task = { ...task, [fieldName]: target.value };

    target.setAttribute('value', target.value);

    if (fieldName === 'url') {
      this.taskElemRef.setAttribute('has-url', Boolean(target.value));
      Tasks.update(task, this.taskElemRef, null);
    }
    else
      Tasks.update(task, this.taskElemRef, fieldName);
  }

  static updatePriority(priority, idx) {
    let task = Tasks.getById(this.taskElemRef.id);
    task = { ...task, priority: idx };

    this.taskElemRef.setAttribute('priority', priority);

    Tasks.update(task, this.taskElemRef, null);
  }

  static prioritiesTemplate(priority) {
    const priorities = ['low', 'medium', 'high'];

    return `
      <div class="edit-task-priority">
        ${priorities.map((p, i) => {
          return `
            <input type="radio" class="task-priority priority-${p}" name="priority" value="${i}"
              ${priority === i ? 'checked' : ''}
              onchange="EditTaskPanel.updatePriority('${p}', '${i}')">
          `;
        }).join('')}
      </div>
    `;
  }

  static template(task) {
    return `
        <form class="edit-task-panel">
            <div class="edit-task-header heading">
              <h1 class="edit-task-header-title">Edit task</h1>
              <button class="task-option heading-close close-edit-task-panel" type="button" onclick="EditTaskPanel.close(this.parentNode.parentNode)">
                <i class="material-icons">close</i>
              </button>
            </div>
            <div class="edit-task-fields">
              <label>
                <input class="edit-task-field edit-task-title" value="${task.title}" onkeyup="EditTaskPanel.updateField('title', event)" required></input>
                <p>Title</p>
              </label>
              <label>
                <input class="edit-task-field edit-task-description" value="${task.description}" onkeyup="EditTaskPanel.updateField('description', event)" required></input>
                <p>Description</p>
              </label>
              <label>
                <input class="edit-task-field edit-task-url" value="${task.url}" onkeyup="EditTaskPanel.updateField('url', event)" required></input>
                <p><i class="material-icons edit-task-url-icon">link</i><span>URL</span></p>
              </label>
              ${EditTaskPanel.prioritiesTemplate(parseInt(task.priority))}
            </div>
        </form>
      `;
  }
}
