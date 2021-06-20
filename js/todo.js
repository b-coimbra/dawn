class Todo {
  constructor() { }

  get display() {
    $('.add').onclick = () => {
      $('.add').classList.toggle('active');
      $('.addTodo').classList.toggle('active');
    };

    $('.addTodo input').onkeydown = (e) => {
      if (e.key == 'Enter') {
        let todos = [],
            temp  = localStorage.todo;

        todos = parse(temp);
        todos.push({[strftime('h:i')]: ['undone', e.target.value, strftime('e b')]});

        localStorage.todo = stringify(todos);

        e.target.value = '';

        this.updateCounter();
        this.show(true);
        this.stateHandler();
      }
    };

    this.show();
    this.updateCounter();
    this.stateHandler();
  }

  updateCounter() {
    const todos = parse(localStorage.todo);
    const states = todos.map(f => Object.values(f)[0][0]);

    const todoCount = states.filter(f => f == 'undone').length;
    const doneCount = states.filter(f => f == 'done').length;

    $('.todo-count').innerHTML = todoCount;
    $('.done-count').innerHTML = doneCount;
  }

  show(current = false) {
    let todos = parse(localStorage.todo);

    if (current)
      todos = todos.slice(-1);

    for (let key of todos) {
      for (let item in key) {
        $('.items').insertAdjacentHTML('beforeend',
          `<item ${key[item][0]}>
            <rows>
                <p class="todo-title">${key[item][1]}</p>
                <button class="!> close-task"></button>
                <p class="row-end added-at">${key[item][2].toLowerCase()} - <span>${item}</span></p>
            </rows>
          </item>`);
      }
    }
  }

  removeState(elem) {
    let state = elem.hasAttribute('done') ? 'done' : 'undone';

    elem.removeAttribute(state);
    elem.setAttribute((state == 'done' ? 'undone' : 'done'), '');
  };

  stateHandler() {
    $$('.close-task').forEach((elem) => {
      elem.onclick = (e) => {
        let parent = e.target.parentNode.parentNode,
            index  = nodes('.items').indexOf(parent) - 1,
            todos  = parse(localStorage.todo);

        todos.splice(index, 1);
        localStorage.todo = stringify(todos);

        parent.classList.add('remove');

        setTimeout(() => {
          $('.items').removeChild(parent);
        }, 350);

        this.updateCounter();
      };
    });

    $$('.items item').forEach((elem) => {
      elem.onclick = (e) => {
        let todos = parse(localStorage.todo),
            index = nodes('.items').indexOf(elem) - 1,
            state = elem.hasAttribute('done') ? 'undone' : 'done',
            temp  = todos[index],
            obj   = {};

        for (let key in temp)
          obj = {[key]: [state, temp[key][1], temp[key][2]]};

        todos.splice(index, 1, obj);
        localStorage.todo = stringify(todos.filter((el) => {
          return typeof el != "object" || Array.isArray(el) || Object.keys(el).length > 0;
        }));;

        this.updateCounter();
        this.removeState(elem);
      };
    });
  }
}
