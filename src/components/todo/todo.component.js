class Todo extends Component {
  refs = {
    addTaskButton: '.add-task',
    addTaskModal: '.add-todo',
    addTaskInput: '.add-todo input',
    cleanTasksButton: '.clean-tasks',
    tasks: '.tasks',
    todoCount: '.todo-count',
    doneCount: '.done-count',
    filters: '.counter > button',
    closeTask: '.close-task',
    task: '.tasks task',
    taskList: '.task-list',
    cleanTasks: '.clean-tasks'
  };

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
      this.resources.libs.awoo
    ];
  }

  style() {
    return `
      :host {
          --done: #37eb94;
          --todo: #ff1b91;
          --bg: #0f0f12;
          --task-options-reveal-time: .15s;
          --task-options-done-background: #357d5a;
          --task-options-todo-background: #84355e;
      }

      button {
          outline: 0;
          border: 0;
          background: none;
      }

      .header {
          flex-wrap: wrap;
      }

      .header-title {
          font-weight: 100;
          font-size: 24pt;
          color: rgba(255, 255, 255, .1);
          text-align: center;
          width: 100%;
      }

      .task-actions {
          display: grid;
          grid-template-columns: 30px auto 50px auto 30px;
          width: 100%;
      }

      .counter {
          grid-column: 3;
          color: rgba(255, 255, 255, .1);
          font-size: 14px;
          background: #18181d;
          border-radius: 5px;
      }

      .task-action {
          height: 25px;
          background: #18181d;
          border-radius: 5px;
          box-shadow: 0 0 0 1px #27272a;
      }

      .clean-tasks {
          grid-column: 5;
          cursor: pointer;
          opacity: .5;
          cursor: unset;
      }

      .clean-tasks.active {
          opacity: 1;
          cursor: pointer;
      }

      .task-list + task .clean-tasks {
          display: block;
      }

      .clean-tasks-icon {
          color: #474752;
      }

      .clean-tasks.active:hover .clean-tasks-icon {
          color: #6c6c80;
      }

      .todo-count {
          color: var(--todo);
          font-weight: bold;
          border-radius: 5px 0 0 5px;
      }

      .done-count {
          color: var(--done);
          font-weight: bold;
          letter-spacing: 0;
          border-radius: 0 5px 5px 0;
      }

      .todo-count,
      .done-count {
          width: 100%;
          height: 100%;
          cursor: pointer;
          font-family: 'Roboto', sans-serif;
      }

      .todo-count:hover,
      .done-count:hover {
          background: #212127;
      }

      .todo-count.active {
          background: var(--todo);
          color: #6d244a;
      }

      .done-count.active {
          background: var(--done);
          color: #1f6744;
      }

      .add-task {
          position: absolute;
          top: 25px;
          left: -25px;
          outline: 0;
          border: 0;
          border-radius: 50%;
          background: linear-gradient(to bottom, #fff, #d0d0d0);
          height: 50px;
          width: 50px;
          cursor: pointer;
          z-index: 5;
          box-shadow: 0 0 0 5px rgba(255, 255, 255, .15), 0 0 0 11px rgba(255, 255, 255, .05);
          transition: transform .2s, box-shadow .2s ease-in-out;
      }

      .add-task:hover {
          box-shadow: none;
          transform: scale(1.15);
      }

      .add-task.active {
          transform: rotateZ(45deg);
          background: linear-gradient(to bottom, #fff, #ffcaca);
      }

      .add-task.active:hover {
          transform: scale(1.15) rotateZ(45deg);
      }

      .tasks {
          background: var(--bg);
          padding: 1em;
          box-sizing: border-box;
          grid-template-rows: [header] 140px [todo] auto;
      }

      .tasks task {
          position: relative;
          width: 100%;
          max-height: 100px;
          min-height: 90px;
          box-shadow: 0 1px 0 0 rgba(0, 0, 0, .5),
                      0 4px 0 0 #18181d,
                      0 5px 0 rgba(0, 0, 0, .5),
                      0 8px 0 0 #18181d;
          transition: opacity .5s cubic-bezier(0.4, 0, 1, 1),
                      margin .5s cubic-bezier(0.4, 0, 1, 1),
                      box-shadow .2s;
          z-index: 5;
      }

      task.slide-in {
          animation: slide-in .4s ease-in-out;
      }

      @keyframes slide-in {
          0% {
              opacity: 0;
              transform: translateY(-100%);
          }
          100% {
              opacity: 1;
              transform: translateY(0);
          }
      }

      .tasks task.remove {
          margin: -100% 0 0 0 !important;
          opacity: 0;
      }

      .tasks task[status=todo] { --state: var(--todo); }
      .tasks task[status=done] { --state: var(--done); }

      .tasks task[status=done] .task-title {
          text-decoration: line-through;
          color: #ababab;
      }

      .task-title {
          color: #e8e8e8;
          font: 400 14px 'Roboto', sans-serif;
          max-width: 250px;
          word-wrap: break-word;
          -webkit-user-select: initial;
          font-weight: bold;
      }

      .tasks task {
          margin: 0 0 1.5em 0;
      }

      .tasks task:hover span {
          color: var(--state) !important;
      }

      .tasks task .added-at {
          font-size: 11px;
          letter-spacing: .5px;
          color: #929292;
          font-weight: 400;
      }

      .tasks task .added-at span {
          color: #fff;
          font-weight: 700 !important;
          transition: color .2s;
      }

      .add-todo {
          position: absolute;
          width: 100%;
          height: 100px;
          top: -110px;
          background: #18181d;
          transition: top .5s;
          z-index: 1;
      }

      .add-todo input[type="text"] {
          outline: 0;
          border: 0;
          box-shadow: inset 0 0 0 2px #25252d;
          padding: .5em 1em;
          width: 70%;
          color: #fff;
          font: 400 15px 'Roboto', sans-serif;
          background: #0f0f12;
          border-radius: 40px;
          box-sizing: border-box;
      }

      .add-todo.active {
          top: 0;
      }

      .add-todo input:focus {
          box-shadow: inset 0 0 0 2px #3e3e4a;
      }

      .task-list {
          display: grid;
          transition: all .5s;
          grid-auto-rows: min-content;
      }

      .task-list[filter='show:todo'] > task[status=done] {
          display: none;
      }

      .task-list[filter='show:done'] > task[status=todo] {
          display: none;
      }

      .tasks task rows {
          height: 100%;
          position: relative;
          padding: 1em 0 .5em 1em;
          border-radius: 5px 5px 2px 2px;
          background: #18181d;
          transition: height var(--task-options-reveal-time) ease-in,
                      margin var(--task-options-reveal-time) ease-in,
                      box-shadow var(--task-options-reveal-time) ease-in;
      }

      task[status=todo] rows:hover .task-options {
          background: var(--task-options-todo-background);
      }

      task[status=done] rows:hover .task-options {
          background: var(--task-options-done-background);
      }

      task rows:hover .task-options {
          top: -30px;
      }

      task rows:hover {
          margin-top: 30px;
          height: calc(100% - 30px);
          box-shadow: 0 -5px 8px rgb(0 0 0 / 45%);
      }

      .task-options {
          position: absolute;
          display: grid;
          grid-template-columns: [add-task-link] 24px
                                [move-task-down] 24px auto
                                [close] 20px;
          align-items: center;
          width: 98%;
          height: 30px;
          background: var(--state);
          left: 0;
          top: -3px;
          right: 0;
          margin: 0 auto;
          z-index: -2;
          border-radius: 5px 5px 0 0;
          padding: 5px 10px;
          transition: top var(--task-options-reveal-time) ease-in,
                      background var(--task-options-reveal-time) ease-in;
      }

      .close-task {
          grid-column: close;
      }

      .close-task i {
          font-size: 16px;
      }

      .add-task-link {
          display: none; /* hide temporarily */
          grid-column: add-task-link;
      }

      .task-option {
          position: relative;
          width: 24px;
          height: 24px;
          background: none;
          cursor: pointer;
          color: white;
          opacity: .6;
      }

      .task-option:hover {
          opacity: 1;
          transform: scale(1.2);
      }

      .task-controls {
          display: grid;
          grid-template-rows: 10px [task-move-up] 24px [task-toggle] 25px [task-move-down] 24px 10px;
          height: 100%;
          position: absolute;
          z-index: 3;
          flex-wrap: wrap;
          width: 24px;
          left: -28px;
      }

      .control-arrows {
          opacity: 0;
          transition: opacity .2s, transform .2s, color .2s;
      }

      .task-move-down {
          transform: translateY(-15px) scale(.4);
      }

      .task-move-up {
          transform: translateY(15px) scale(.4);
      }

      .control-arrows:hover {
          color: var(--state);
          transform: scale(1.5) !important;
      }

      .task-control:focus {
          transform: scale(1);
      }

      task:hover .control-arrows {
          opacity: 1;
          transform: translateY(0) scale(1);
      }

      .task-control {
          display: flex;
          justify-content: center;
          color: #7f7f9a;
          cursor: pointer;
      }

      .task-toggle {
          position: relative;
          display: flex;
          grid-row: task-toggle;
      }

      .task-toggle::after {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          height: 50px;
          width: 1px;
          background: var(--state);
          transition: all .5s;
          z-index: -1;
          opacity: .5;
      }

      .task-toggle::before {
          content: '';
          position: relative;
          display: flex;
          grid-row: task-toggle;
          background: var(--bg);
          border-radius: 50%;
          margin: auto;
          width: 12px;
          height: 12px;
          box-shadow: 0 0 0 3px var(--state);
          cursor: pointer;
          transition: transform .2s, background .2s, box-shadow .2s, color .2s;
      }

      .tasks task:hover .task-toggle::before {
          transform: scale(1.4);
      }

      .tasks task[status=done] .task-toggle::before {
          content: '\\E876';
          color: var(--state);
          font-family: 'Material Icons';
          text-align: center;
          font-size: 13px;
          line-height: 0.9;
      }

      .tasks task:hover .task-toggle::after {
          height: 0;
      }

      .task-control.task-move-down {
          grid-row: task-move-down;
      }

      .task-control.task-move-up {
          grid-row: task-move-up;
      }

      task.move-up {
          animation: move-up .5s ease-in-out;
      }

      task.move-down {
          animation: move-down .5s ease-in-out;
      }

      task:first-child .task-move-up {
          display: none;
      }

      task:last-child .task-move-down {
          display: none;
      }

      @keyframes move-up {
          0% {
              top: 0;
          }
          100% {
              top: -100%;
          }
      }

      @keyframes move-down {
          0% {
              top: 0;
          }
          100% {
              top: 100%;
          }
      }
    `;
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
            <div class="+ counter task-action">
              <button class="+ todo-count">0</button>|
              <button class="+ done-count">0</button>
            </div>
            <button class="+ clean-tasks task-action">
              <i class="material-icons clean-tasks-icon">clear_all</i>
            </button>
          </div>
        </div>
        <div class="task-list">
            ${Tasks.getAllTemplates()}
        </div>
      </rows>`;
  }

  setEvents() {
    this.refs.addTaskButton.onclick    = ()  => this.toggleTaskModal();
    this.refs.cleanTasksButton.onclick = ()  => this.cleanTasks();
    this.refs.addTaskInput.onkeydown   = (e) => this.createTask(e);
    this.refs.todoCount.onclick = (e)  => this.addFilter(e, 'show:todo');
    this.refs.doneCount.onclick = (e)  => this.addFilter(e, 'show:done');
  }

  addFilter({ target }, filter) {
    const hasFilterEnabled = this.refs.taskList.getAttribute('filter') === filter;

    this.refs.filters.forEach(filter => filter.classList.remove('active'));

    if (!hasFilterEnabled)
      target.classList.add('active');

    this.refs.taskList.setAttribute('filter', !hasFilterEnabled ? filter : '');
  }

  updateCounter() {
    const tasks = Tasks.getAll();
    const states = tasks.map(f => f.state);

    this.refs.doneCount = states.filter(done => done).length;
    this.refs.todoCount = states.filter(done => !done).length;
  }

  handleTaskActionsVisibility() {
    if (typeof this.refs.task !== 'string')
      this.refs.cleanTasks.classList.add('active');
    else
      this.refs.cleanTasks.classList.remove('active');
  }

  moveToDirection(task, direction, animateOnly = false) {
    const { directions } = Tasks;

    task.classList.remove('slide-in');
    task.classList.add(direction);

    setTimeout(() => {
      const previousIndex = Number(task.getAttribute('index'));
      const currentIndex = Math.max(0, (direction === directions.UP ? previousIndex - 1 : previousIndex + 1));

      task.setAttribute('index', currentIndex);

      if (!animateOnly)
        if (direction === directions.UP)
          this.refs.taskList.insertBefore(task, task?.previousElementSibling || task);
        else
          this.refs.taskList.insertBefore(task.nextElementSibling, task);

      task.classList.remove(direction);
    }, 500);
  }

  move({ id, attributes }) {
    const direction = attributes['move-direction']?.value;
    const { directions } = Tasks;

    if (!direction) return;

    const task = Array.from(this.refs.task).find(f => f.id === id);

    this.moveToDirection(task, direction);

    if (direction === directions.UP)
      this.moveToDirection(task.previousElementSibling, directions.DOWN, true);
    else
      this.moveToDirection(task.nextElementSibling, directions.UP, true);

    task.removeAttribute('move-direction');
  }

  toggleTaskModal() {
    this.refs.addTaskInput.value = '';
    this.refs.addTaskButton.classList.toggle('active');
    this.refs.addTaskModal.classList.toggle('active');

    setTimeout(() => this.refs.addTaskInput.focus(), 10);
  }

  createTask(event) {
    const { target, key } = event;

    if (key === 'Enter') {
      const title = target.value;

      if (!title.trim()) return;

      const task = Tasks.create(title);

      this.refs.taskList.insertAdjacentHTML('beforeend', Tasks.template(task));
      this.updateCounter();

      target.value = '';
    }

    if (key === 'Escape')
      this.toggleTaskModal();
  }

  cleanTasks() {
    if (!Object.values(this.refs.cleanTasks.classList).includes('active')) return;
    Tasks.clean(this.refs.task);
  }

  /**
   * Watch for changes in the task list, trigger events based on state of the task
   * @returns {void}
   */
  setTaskObserver() {
    const mutationTypes = ['attributes', 'childList'];

    const taskObserver = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        if (mut.attributeName === 'move-direction')
          this.move(mut.target);

        if (mutationTypes.includes(mut.type)) {
          this.handleTaskActionsVisibility();
          this.updateCounter();
        }
      });
    });

    taskObserver.observe(this.refs.taskList, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['status', 'move-direction']
    });
  }

  connectedCallback() {
    this.render().then(async () => {
      this.setEvents();
      this.handleTaskActionsVisibility();
      this.setTaskObserver();
      this.updateCounter();
    });
  }
}

customElements.define('todo-list', Todo);
