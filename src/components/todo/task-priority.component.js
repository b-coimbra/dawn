class TaskPriority extends Component {
  static refs = {
    priorities: '.edit-task-priority input'
  };

  constructor() {
    super();
  }

  static update(priority, idx) {
    const taskElemRef = EditTask.taskElemRef;
    let task = Tasks.getById(taskElemRef.id);

    if (task.priority === idx) {
      idx = -1;

      const priorityRef = taskElemRef
            .querySelector(this.refs.priorities + `.priority-${priority}`);

      taskElemRef.removeAttribute('priority');

      priorityRef.checked = false;
      priorityRef.blur();
    }
    else
      taskElemRef.setAttribute('priority', priority);

    task = { ...task, priority: idx };

    Tasks.update(task, taskElemRef, null);
  }

  static template(priority) {
    const priorities = ['low', 'medium', 'high'];

    return `
      <div class="edit-task-priority">
        ${priorities.map((p, i) => {
          return `
            <input type="radio" class="task-priority priority-${p}" name="priority" value="${i}"
              ${priority === i ? 'checked' : ''}
              onclick="TaskPriority.update('${p}', '${i}')">
          `;
        }).join('')}
      </div>
    `;
  }
}
