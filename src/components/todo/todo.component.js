class Todo extends Component {
  refs = {
    openTaskPanelButton: '.add-task',
    addTaskButton: '.add-task-button',
    addTaskModal: '.add-todo-panel',
    closeTaskModal: '.close-create-task-panel',
    cleanTasksButton: '.clean-tasks',
    tasks: '.tasks',
    todoCount: '.todo-count',
    doneCount: '.done-count',
    filters: '.counter > button',
    closeTask: '.close-task',
    task: '.tasks task',
    taskList: '.task-list',
    cleanTasks: '.clean-tasks',
    editTaskButton: '.task-option.edit-task',
    editTaskPanel: '.edit-task-panel',
    createTaskTitleField: '.create-task-title',
    createTaskForm: '.create-task-form',
    createTaskFields: '.create-task-field'
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

  setEvents() {
    this.refs.openTaskPanelButton.onclick = ()  => this.activate();
    this.refs.closeTaskModal.onclick      = ()  => this.activate();
    this.refs.cleanTasksButton.onclick    = ()  => this.cleanTasks();
    this.refs.todoCount.onclick           = (e) => this.addFilter(e, 'show:todo');
    this.refs.doneCount.onclick           = (e) => this.addFilter(e, 'show:done');
    this.refs.addTaskButton.onclick       = (e) => this.handleAddTask(e);

    this.handleTaskInputEvents();
  }

  handleAddTask(event) {
    event.preventDefault();
    const formData = new FormData(this.refs.createTaskForm);
    this.createTask(formData);
  }

  handleTaskInputEvents() {
    const fields = Array.from(this.refs.createTaskFields);

    fields.forEach(field => {
      field.onkeydown = ({ key }) => {
        if (key === 'Escape')
          this.activate();
      };
    });
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
      const currentIndex = Math.max(0, (directions.isUp(direction) ? previousIndex - 1 : previousIndex + 1));

      task.setAttribute('index', currentIndex);

      if (!animateOnly)
        if (directions.isUp(direction))
          this.refs.taskList.insertBefore(task, task?.previousElementSibling || task);
        else
          this.refs.taskList.insertBefore(task.nextElementSibling, task);

      task.classList.remove(direction);
    }, 490);
  }

  /**
   * Calculates the height difference (offset) of the current task with the next/previous one.
   * @param {Task} task Current task being moved.
   * @param {string} direction
   */
  setHeightOffset(task, direction) {
    const applyOffset = (element) => {
      const offset = element?.clientHeight - task.clientHeight;

      task.setAttribute('style', `--offset-height: ${offset}px`);
      element?.setAttribute('style', `--offset-height: ${offset - (offset * 2)}px`);
    };

    applyOffset(Tasks.directions.isUp(direction)
      ? task?.previousElementSibling
      : task?.nextElementSibling);
  }

  move({ id, attributes }) {
    const direction = attributes['move-direction']?.value;
    const { directions } = Tasks;

    if (!direction) return;

    const task = this.getTaskById(id);

    this.moveToDirection(task, direction);
    this.setHeightOffset(task, direction);

    if (directions.isUp(direction))
      this.moveToDirection(task.previousElementSibling, directions.DOWN, true);
    else
      this.moveToDirection(task.nextElementSibling, directions.UP, true);

    task.removeAttribute('move-direction');
  }

  activate() {
    this.refs.createTaskForm.reset();
    this.refs.addTaskModal.classList.toggle('active');
    this.refs.taskList.classList.toggle('dim');

    setTimeout(() => this.refs.createTaskTitleField.focus(), 10);
  }

  getTaskById(id) {
    return Array.from(this.refs.task).find(task => task.id === id);
  }

  createTask(fields) {
    let data = {};

    fields.forEach((value, key) => data[key] = value);

    if (data.title === '') return;

    const task = Tasks.create(data);

    this.refs.taskList.insertAdjacentHTML('beforeend', Tasks.template(task));
    this.updateCounter();
    this.activate();
    this.refs.createTaskForm.reset();
  }

  cleanTasks() {
    if (!confirm(`Clean all your tasks?`))
      return;

    if (!Object.values(this.refs.cleanTasks.classList).includes('active'))
      return;

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
          position: relative;
          grid-template-columns: 30px auto 50px auto 30px;
          width: 100%;
          padding: 8px;
          border-radius: 10px;
          box-shadow: inset 0 0 0 2px #18181d;
      }

      .counter {
          grid-column: 3;
          color: rgba(255, 255, 255, .1);
          font-size: 14px;
          background: #18181d;
          border-radius: 5px;
      }

      .task-action {
          cursor: pointer;
          height: 25px;
          min-width: 30px;
          background: #18181d;
          border-radius: 5px;
          box-shadow: 0 0 0 1px #27272a, 0 5px 5px rgb(0 0 0 / 20%);
      }

      .clean-tasks {
          grid-column: 5;
          opacity: .5;
          cursor: unset;
          background: #81395e;
          box-shadow: 0 0 0 1px #c975a0, 0 5px 5px rgb(0 0 0 / 20%);
      }

      .clean-tasks.active {
          opacity: 1;
          cursor: pointer;
      }

      .task-list + task .clean-tasks {
          display: block;
      }

      .clean-tasks-icon {
          color: #c975a0;
      }

      .add-task:hover .add-task-icon {
          color: #c8ffe5;
      }

      .clean-tasks.active:hover .clean-tasks-icon {
          color: #efb2d1;
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
          top: 0;
          grid-column: 1;
          grid-row: 1;
          transition: top .3s;
          background: #306554;
          box-shadow: 0 0 0 1px #5ea991, 0 5px 5px rgb(0 0 0 / 20%);
      }

      :is(.add-task,
          .add-task-button,
          .clean-tasks,
          .heading > .heading-close,
          .task-option):focus
      {
          transform: scale(.85);
      }

      .add-task .add-task-icon {
          transition: transform .3s;
          color: #79bf9e;
      }

      .tasks {
          background: var(--bg);
          padding: 1em 1em 0;
          box-sizing: border-box;
          grid-template-rows: [header] 140px [todo] auto;
      }

      .tasks task {
          --offset-height: 0px;
          position: relative;
          width: 100%;
          min-height: 70px;
          box-shadow: 0 1px 0 0 rgba(0, 0, 0, .5),
                      0 4px 0 0 #18181d,
                      0 5px 0 rgba(0, 0, 0, .5),
                      0 8px 0 0 #18181d;
          transition: opacity .5s cubic-bezier(0.4, 0, 1, 1),
                      margin .5s cubic-bezier(0.4, 0, 1, 1),
                      box-shadow .2s,
                      min-height .3s;
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

      task.expand {
          min-height: 300px;
      }

      .tasks task[status=todo] { --state: var(--todo); }
      .tasks task[status=done] { --state: var(--done); }

      .tasks task[status=done] .task-title {
          color: #ababab;
      }

      .tasks task[status=done] .task-title,
      .tasks task[status=done] .task-description {
          text-decoration: line-through;
      }

      .task-title {
          margin-bottom: .5em;
      }

      .create-task-header {
          padding-left: 0;
      }

      .add-task-button {
          background: #2e2e38;
          padding: .5em 1em;
          border-radius: 5px;
          color: #8c8ca0;
          margin-top: 1em;
          margin-left: auto;
          box-shadow: inset 0 0 0 1px #3e3e4a;
          cursor: pointer;
          font-weight: bold;
          font-family: 'Roboto', sans-serif;
      }

      .add-task-button:hover { color: #cbcbdc; }
      .add-task-button:focus { background: #202027; }

      .task-title,
      .task-description,
      .edit-task-header-title,
      .create-task-header-title {
          color: #e8e8e8;
          font: 400 14px 'Roboto', sans-serif;
          max-width: 250px;
          word-wrap: break-word;
          -webkit-user-select: initial;
          font-weight: bold;
      }

      .task-description {
          font-weight: 400;
          font-size: 12px;
          color: #9a9a9a;
          margin-bottom: 15px;
      }

      .task-description:empty { display: none; }

      .tasks task {
          margin: 0 0 1.5em 0;
      }

      .tasks task:hover .added-at span {
          color: var(--state) !important;
      }

      .tasks task .added-at {
          grid-column: added-at;
          font-size: 11px;
          letter-spacing: .5px;
          color: #929292;
          font-weight: 400;
          margin-right: 15px;
          text-transform: uppercase;
      }

      .tasks task .added-at span {
          color: #c1c1c1;
          font-weight: 700 !important;
          transition: color .2s;
      }

      .add-todo-panel {
          position: absolute;
          flex-wrap: wrap;
          width: calc(100% - 1px);
          top: -335px;
          background: #18181d;
          transition: top .5s;
          padding: 0 1.5em 1em;
          z-index: 9;
      }

      .add-todo-panel input[type="text"],
      .edit-task-field,
      .create-task-field {
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
          transition: box-shadow .1s;
      }

      .add-todo-panel.active {
          top: 0;
      }

      .add-todo-panel input:focus,
      .edit-task-panel input:focus {
          box-shadow: inset 0 0 0 2px #3e3e4a;
      }

      .task-list {
          display: grid;
          transition: all .5s;
          grid-auto-rows: min-content;
          overflow-x: hidden;
          overflow-y: scroll;
          width: calc(100% + 45px);
          padding: 5px 10px 0 30px;
          margin-left: -30px;
          height: 100%;
          scrollbar-width: thin;
          scrollbar-color: #313138 transparent;
      }

      .task-list.dim {
          filter: opacity(.15);
      }

      .task-list::-webkit-scrollbar {
          width: 5px;
          background: transparent;
      }

      .task-list::-webkit-scrollbar-thumb {
          background: #313138;
          border-radius: 5px;
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
          padding: 1em 1em .5em;
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

      .edit-task-panel {
          flex-wrap: wrap;
          width: 100%;
          height: 100%;
          position: absolute;
          background: #18181d;
          z-index: 1;
          top: 100%;
          opacity: 0;
          visibility: hidden;
          padding: 0 1em;
          transition: all .3s;
      }

      .edit-task-panel.active {
          visibility: visible;
          opacity: 1;
          top: 0;
      }

      .heading {
          display: flex;
          align-items: center;
          width: 100%;
          height: 20px;
          padding-left: .5em;
          margin: 1em 0 1.5em;
      }

      .heading > .heading-close {
          margin-left: auto;
      }

      .add-task-button,
      .edit-task-header-title,
      .create-task-header-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
      }

      .edit-task-field,
      .create-task-field {
          width: 100%;
          height: 35px;
          border-radius: 8px;
          font-size: 12px;
      }

      .edit-task-fields label,
      .create-task-form label {
          position: relative;
          display: block;
      }

      .edit-task-fields label p,
      .create-task-form label p {
            position: absolute;
            top: -100%;
            font-size: 9px;
            font-family: 'Roboto', sans-serif;
            text-transform: uppercase;
            color: #b5b5b5;
            letter-spacing: 1px;
            transition: top .1s;
            background: #181818;
            white-space: nowrap;
            bottom: 0;
            margin: auto 1.5em;
            height: 10px;
            display: flex;
            align-items: center;
      }

      .create-task-priority,
      .edit-task-priority {
        text-align: right;
      }

      .task-priority {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          appearance: none;
          filter: opacity(.4);
          margin-left: 5px;
          border: 0;
          cursor: pointer;
          transition: box-shadow .1s;
      }

      .task-priority:hover {
        filter: opacity(1);
      }

      .task-priority.priority-low { background: #6fd468; }
      .task-priority.priority-medium { background: #debc59; }
      .task-priority.priority-high { background: #d45959; }

      .task-priority:checked,
      .task-priority:focus {
          filter: opacity(1);
          box-shadow: 0 0 0 2px #fff !important;
      }

      .create-task-title:not(:focus):required:invalid {
          box-shadow: inset 0 0 0 2px #ff1b91;
      }

      .edit-task-field:required:invalid + p,
      .create-task-field:required:invalid + p {
          background: transparent;
          height: 10px;
          top: 0;
      }

      .create-task-field:required:invalid + .required-field-label::before {
          content: '*';
          font-size: 17px;
          float: left;
          margin: 5px 5px 0 0;
          position: relative;
          color: #ff1b91;
      }

      .edit-task-panel label:not(:last-child),
      .create-task-form label:not(:last-child) {
          margin-bottom: 1em;
      }

      .tasks task rows,
      .edit-task-panel,
      .create-task-panel {
          border-radius: 5px 5px 2px 2px;
      }

      .create-task-url-icon,
      .edit-task-url-icon {
          font-size: 17px;
          margin-right: 5px;
      }

      .create-task-reminder,
      .edit-task-reminder {
          padding-left: 35px;
          color: #b5b5b5;
      }

      .create-task-reminder::-webkit-calendar-picker-indicator,
      .edit-task-reminder::-webkit-calendar-picker-indicator{
          color: transparent;
          background: none;
          width: 100%;
          position: absolute;
          left: 0;
      }

      .create-task-reminder::after,
      .edit-task-reminder::after {
          content: '\\e935';
          font-family: 'Material Icons', sans-serif;
          position: absolute;
          left: 15px;
          color: #b5b5b5;
          top: 11px;
      }

      .add-task-link { display: none; }

      task[has-url=true] .add-task-link {
          display: block;
      }

      .task-options {
          position: absolute;
          display: grid;
          grid-template-columns: [edit-task] 24px
                                 [open-task-url] 24px
                                 [move-task-down] 24px auto
                                 [close] 20px;
          gap: 3px;
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

      .heading-close,
      .close-task {
          grid-column: close;
      }

      .edit-task {
          grid-column: edit-task;
      }

      .open-task-url {
          grid-column: add-task-link;
      }

      .close-task i,
      .heading-close i,
      .edit-task i {
          font-size: 16px;
      }

      .open-task-url i { font-size: 22px; }
      .add-task-alert i { font-size: 19px; }

      .task-option {
          position: relative;
          width: 24px;
          height: 24px;
          background: none;
          cursor: pointer;
          color: white;
          opacity: .6;
      }

      .task-option.disabled {
          display: none;
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
          transition: opacity .1s, transform .1s, color .1s;
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

      .task-footer {
          border-top: 1px solid #292929;
          display: grid;
          grid-template-columns: [added-at] 100px auto [priority] 8px;
          align-items: center;
          padding-top: 10px;
      }

      .priority {
          grid-column: priority;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          justify-content: space-evenly;
      }

      .priority-level {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #424242;
      }

      .tasks task[priority=none] .priority {
        display: none;
      }

      .tasks task[priority=low] .priority    { background: #6fd468; }
      .tasks task[priority=medium] .priority { background: #debc59; }
      .tasks task[priority=high] .priority   { background: #d45959; }

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
              top: calc(-100% - var(--offset-height));
          }
      }

      @keyframes move-down {
          0% {
              top: 0;
          }
          100% {
              top: calc(100% + var(--offset-height));
          }
      }
    `;
  }

  template() {
    return `
      <div class="add-todo-panel">
        <div class="create-task-header heading">
          <h1 class="create-task-header-title">Create task</h1>
          <button class="+ task-option heading-close close-create-task-panel">
            <i class="material-icons">close</i>
          </button>
        </div>
        <form class="create-task-form">
          <label>
            <input class="create-task-field create-task-title" name="title" id="task-name" value="" required></input>
            <p class="required-field-label">Title</p>
          </label>
          <label>
            <input class="create-task-field create-task-description" name="description" required></input>
            <p>Description</p>
          </label>
          <label>
            <input class="create-task-field create-task-url" name="url" required></input>
            <p><i class="material-icons create-task-url-icon">link</i><span>URL</span></p>
          </label>
          <label>
            <input type="datetime-local" class="create-task-field create-task-reminder" name="reminder" required></input>
          </label>
          <div class="create-task-priority">
            <input type="radio" class="task-priority priority-low" name="priority" value="0">
            <input type="radio" class="task-priority priority-medium" name="priority" value="1">
            <input type="radio" class="task-priority priority-high" name="priority" value="2">
          </div>
        <button class="add-task-button" type="submit" value="submit">Done</button>
        </form>
      </div>
      <rows class="tasks">
        <div class="+ header">
          <p class="+ header-title">todo</p>
          <div class="task-actions">
            <button class="+ add-task task-action" title="Add new task">
              <i class="material-icons add-task-icon">add</i>
            </button>
            <div class="+ counter task-action">
              <button class="+ todo-count">0</button>|
              <button class="+ done-count">0</button>
            </div>
            <button class="+ clean-tasks task-action" title="Clear all tasks">
              <i class="material-icons clean-tasks-icon">clear_all</i>
            </button>
          </div>
        </div>
        <div class="task-list">
            ${Tasks.getAllTemplates()}
        </div>
      </rows>`;
  }
}
