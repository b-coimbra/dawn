const components = {
  'search-bar': Search,
  'todo-list': Todo,
  'status-bar': Statusbar,
  'crypto-rate': Crypto,
  'crypto-popup': CryptoPopup,
  'crypto-diff': CryptoDiff,
  'current-time': Clock,
  'weather-forecast': Weather,
  'tabs-list': Tabs,
  'modal-popup': Modal
};

Object.keys(components).forEach(componentName => {
  if (!CONFIG.disabled.includes(componentName))
    customElements.define(componentName, components[componentName]);
});
