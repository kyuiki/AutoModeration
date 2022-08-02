class Event {
  events: any;
  constructor() {
    this.events = {};
  }

  on(eventName: any, fn: any) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  off(eventName: any, fn: any) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  emit(eventName: string, data: any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn: any) {
        fn(data);
      });
    }
  }
}

export default new Event();
