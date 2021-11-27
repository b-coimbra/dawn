class Actions {
  static activate(componentName) {
    return {
      'todo-list': () => {
        $('todo-list').shadowRoot
          .querySelector('.add-task')
          .click();
      },
      'search-bar': () => {
        const search = $('search-bar').shadowRoot.querySelector('#search');

        search.classList.add('active');
        setTimeout(() => search.querySelector('input').focus(), 100);
      }
    }[componentName];
  }
}
