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
      this.resources.icons.material,
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
        <div class="+ header">
          <h1 class="+ header-title">todo</h1>
          <div class="task-actions">
            <p class="+ counter task-action">
              <span class="todo-count">0</span>|
              <span class="done-count">0</span>
            </p>
            <button class="+ clean-tasks task-action">
              <i class="material-icons clean-tasks-icon">delete</i>
            </button>
          </div>
        </div>
        <div class="task-list">
            ${Tasks.getAllTemplates()}
        </div>
      </rows>`;
  }

  setEvents() {
    this.refs.addTaskButton.onclick  = ()      => this.toggleTaskModal();
    this.refs.addTaskInput.onkeydown = (event) => this.createTask(event);
  }

  /**
   * Update task status counter
   * @returns {void}
   */
  updateCounter() {
    const tasks = Tasks.getAll();
    const states = tasks.map(f => f.state);

    this.refs.doneCount = states.filter(done => done).length;
    this.refs.todoCount = states.filter(done => !done).length;
  }

  /**
   * Watch for changes in the task list, trigger counter update
   * when a task added, deleted or the status is toggled
   * @returns {void}
   */
  setCounterObserver() {
    const mutationTypes = ['attributes', 'childList'];

    const taskObserver = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        if (mutationTypes.includes(mut.type))
          this.updateCounter();
      });
    });

    taskObserver.observe(this.refs.taskList, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['status']
    });
  }

  /**
   * Toggle modal for creating a new task
   * @returns {void}
   */
  toggleTaskModal() {
    this.refs.addTaskInput.value = '';
    this.refs.addTaskButton.classList.toggle('active');
    this.refs.addTaskModal.classList.toggle('active');

    setTimeout(() => this.refs.addTaskInput.focus(), 10);
  }

  /**
   * Create a new task
   * @returns {void}
   */
  createTask(event) {
    const { target, key } = event;

    if (key === 'Enter') {
      const title = target.value;
      const task = Tasks.create(title);

      this.refs.taskList.insertAdjacentHTML('beforeend', Tasks.template(task));
      this.updateCounter();

      target.value = '';
    }

    if (key === 'Escape')
      this.toggleTaskModal();
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
