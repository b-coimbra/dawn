class Todo extends Component {
  refs = {
    addTaskButton: '.add-task',
    addTaskModal: '.add-todo',
    addTaskInput: '.add-todo input',
    tasks: '.tasks',
    todoCount: '.todo-count',
    doneCount: '.done-count',
    closeTask: '.close-task',
    task: '.tasks task',
    taskList: '.task-list'
  };

  constructor() {
    super();

    this.stylePath = "src/components/todo/todo.style.css";
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.libs.awoo
    ];
  }

  template() {
    return `
      <button class="+ add-task"><img src="src/img/add.png"></button>
      <div class="+ add-todo">
        <input type="text" value="" placeholder="stuff to do ..." spellcheck="false">
      </div>
      <rows class="tasks">
        <div class="header">
          <h1 class="+ header-title">todo</h1>
          <p class="+ counter">
            <span class="todo-count">0</span>|
            <span class="done-count">0</span>
          </p>
        </div>
        <div class="task-list">
            ${this.getTasksTemplate()}
        </div>
      </rows>`;
  }

  updateCounter() {
    const tasks = parse(localStorage.tasks);
    const states = tasks.map(f => f.state)

    const todoCount = states.filter(f => f == 0).length;
    const doneCount = states.filter(f => f == 1).length;

    this.refs.todoCount = todoCount;
    this.refs.doneCount = doneCount;
  }

  setCounterObserver() {
    const mutationTypes = ['attributes', 'childList']

    const taskObserver = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        if (mutationTypes.includes(mut.type))
          this.updateCounter();
      })
    });

    taskObserver.observe(this.refs.taskList, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['status']
    });
  }

  getTasksTemplate() {
    return Tasks.getAll()
      .map(task => Tasks.template(task))
      .join('');
  }

  toggleTaskModal() {
    this.refs.addTaskButton.classList.toggle('active');
    this.refs.addTaskModal.classList.toggle('active');
  }

  createTask(event) {
    const { target, key } = event;

    if (key == 'Enter') {
      const title = target.value;
      const task = Tasks.create(title);

      this.refs.taskList.insertAdjacentHTML('beforeend', Tasks.template(task));
      this.updateCounter();

      target.value = '';
    }
  }

  setEvents() {
    this.refs.addTaskButton.onclick  = ()      => this.toggleTaskModal();
    this.refs.addTaskInput.onkeydown = (event) => this.createTask(event);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
      this.setCounterObserver();
      this.updateCounter();
    });
  }
}

customElements.define('todo-list', Todo);
