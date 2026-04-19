class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);

    return () => {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    };
  }

  once(event, listener) {
    const wrapper = (data) => {
      listener(data);
      this.events[event] = this.events[event].filter((l) => l !== wrapper);
    };
    this.subscribe(event, wrapper);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  }
}

export const eventBus = new EventBus();
