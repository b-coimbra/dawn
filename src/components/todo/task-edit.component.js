class EditTask extends Component {
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

  static template(task) {
    return `
        <form class="edit-task-panel">
            <div class="edit-task-header heading">
              <h1 class="edit-task-header-title">Edit task</h1>
              <button class="task-option heading-close close-edit-task-panel" type="button" onclick="EditTask.close(this.parentNode.parentNode)">
                <i class="material-icons">close</i>
              </button>
            </div>
            <div class="edit-task-fields">
              <label>
                <input class="edit-task-field edit-task-title" value="${task.title}" onkeyup="EditTask.updateField('title', event)" required></input>
                <p>Title</p>
              </label>
              <label>
                <input class="edit-task-field edit-task-description" value="${task.description}" onkeyup="EditTask.updateField('description', event)" required></input>
                <p>Description</p>
              </label>
              <label>
                <input class="edit-task-field edit-task-url" value="${task.url}" onkeyup="EditTask.updateField('url', event)" required></input>
                <p><i class="material-icons edit-task-url-icon">link</i><span>URL</span></p>
              </label>
              <label>
                <input type="datetime-local" class="edit-task-field edit-task-reminder" value="${task.reminder ?? ''}" name="reminder" onchange="EditTask.updateField('reminder', event)" required></input>
              </label>
              ${TaskPriority.template(parseInt(task.priority))}
            </div>
        </form>
      `;
  }
}
