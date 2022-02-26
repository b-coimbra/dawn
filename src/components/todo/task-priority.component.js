class TaskPriority extends Component {
  constructor() {
    super();
  }

  static update(priority, idx) {
    const taskElemRef = EditTask.taskElemRef;
    let task = Tasks.getById(taskElemRef.id);

    task = { ...task, priority: idx };

    taskElemRef.setAttribute('priority', priority);

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
              onchange="TaskPriority.update('${p}', '${i}')">
          `;
        }).join('')}
      </div>
    `;
  }
}
