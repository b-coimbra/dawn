const components = {
  'search-bar': Search,
  'todo-list': Todo,
  'status-bar': Statusbar,
  'crypto-rate': Crypto,
  'current-time': Clock,
  'weather-forecast': Weather
};

Object.keys(components).forEach(componentName => {
  if (!GLOBAL_CONFIG.disabled.includes(componentName))
    customElements.define(componentName, components[componentName]);
});
