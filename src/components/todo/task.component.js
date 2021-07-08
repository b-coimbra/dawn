class Tasks extends Component {
  constructor() {
    super();
  }

  static create(title) {
    const task = {
      id: this.id,
      title: title,
      createdAt: this.getCreationDate(),
      state: 0
    };

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

  static get id() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static save(task) {
    const tasks = this.getAll();

    tasks.push(task);

    localStorage.tasks = stringify(tasks);
  }

  static getById(id) {
    return this.getAll.find(task => task.id === id);
  }

  static toggle(elem) {
    const tasks = this.getAll();

    let task = tasks.find(x => x.id === elem.id);

    if (!task) return;

    task.state = !task.state;
    localStorage.tasks = JSON.stringify(tasks);

    elem.setAttribute('status', this.getStatus(task.state));
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

  static getAll() {
    if (!localStorage.tasks) return [];
    return parse(localStorage.tasks);
  }

  static getAllTemplates() {
    return this
      .getAll()
      .map(task => this.template(task))
      .join('');
  }

  static template(task) {
    return `
        <task status="${this.getStatus(task.state)}" id="${task.id}" onclick="Tasks.toggle(this)">
            <rows>
                <p class="task-title">${task.title}</p>
                <p class="row-end added-at">${task.createdAt.date} - <span>${task.createdAt.time}</span></p>
                <div class="task-options">
                  <button class="close-task" onclick="Tasks.remove(this.parentNode.parentNode.parentNode)"></button>
                </div>
            </rows>
        </task>`;
  }
}
