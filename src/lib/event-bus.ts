import { CallbackFunction } from 'types/common';

interface IEventBus {
  on(eventName: string, callback: CallbackFunction): void;
  emit(eventName: string, data: any): void;
  off(eventName: string, callback: CallbackFunction): void;
  readonly listeners: { [eventName: string]: CallbackFunction[] };
}
export class EventBus implements IEventBus {
  readonly listeners: IEventBus['listeners'];
  constructor() {
    this.listeners = {};
  }
  on(eventName: string, callback: CallbackFunction) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }
  emit(eventName: string, data?: any) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(function (callback) {
        if (data) {
          callback(data);
        } else {
          callback();
        }
      });
    }
  }
  off(eventName: string, callback: CallbackFunction) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(function (listener) {
        return listener !== callback;
      });
    }
  }
}
