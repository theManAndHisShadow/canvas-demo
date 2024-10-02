export default class SyntheticEventTarget {
    constructor() {
        this.events = {};
    }

    addEventListener(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }

        this.events[eventType].push(callback);
    }

    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(data));
        }
    }
}
