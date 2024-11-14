export type BaseEventType = string | symbol;

export type EventListener<T extends any[]> = T extends []
  ? () => void
  : (...args: T) => void;

export interface IEventEmitter<Events extends Record<BaseEventType, any[]>> {
  on<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>
  ): () => void;
  off<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>
  ): void;
  emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
}

export type EmitterType<T> = {
  loading: [];
  before: [];
  cancelled: [];
  error: [Error];
  success: [T];
  finally: [T];
  run: [];
  cancel: [];
};

export type EmitterInstance<T> = IEventEmitter<EmitterType<T>>;
