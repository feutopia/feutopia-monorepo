import { BaseEventType, IEventEmitter, EventListener } from "../types/";

export class EventEmitter<Events extends Record<BaseEventType, any[]>>
  implements IEventEmitter<Events>
{
  private listeners = new Map<keyof Events, Set<Function>>();
  on<E extends keyof Events>(event: E, listener: EventListener<Events[E]>) {
    const listeners = this.listeners.get(event) || new Set();
    listeners.add(listener);
    this.listeners.set(event, listeners);
    return () => {
      this.off(event, listener);
    };
  }
  off<E extends keyof Events>(event: E, listener: EventListener<Events[E]>) {
    this.listeners.get(event)?.delete(listener);
  }
  emit<E extends keyof Events>(event: E, ...args: Events[E]) {
    this.listeners.get(event)?.forEach((listener) => listener(...args));
  }
  offAll() {
    this.listeners.clear();
  }
}
