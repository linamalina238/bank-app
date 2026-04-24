class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(event, listener) {
    !this.events[event] && (this.events[event] = []);
    this.events[event].push(listener);
  }

  unsubscribe(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  once(event, listener) {
    const wrapper = (data) => {
      listener(data);
      this.events[event] = this.events[event].filter((l) => l !== wrapper);
    };
    this.subscribe(event, wrapper);
  }

  emit(event, data) {
    const listeners = this.events[event];

    if (!listeners) return;
    listeners.forEach((listener) => listener.call(null, data));
  }
}

export const eventBus = new EventBus();
