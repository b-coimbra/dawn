class Actions {
  static activate(componentName) {
    return {
      'todo-list': () => {
        $('todo-list').shadowRoot
          .querySelector('.add-task')
          .click();
      },
      'search-bar': () => {
        $('search-bar').shadowRoot
          .querySelector('#search')
          .classList.add('active');
      }
    }[componentName];
  }
}
