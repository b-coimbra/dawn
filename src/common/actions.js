class Actions {
  static activate(componentName) {
    return RenderedComponents[componentName].activate();
  }
}
