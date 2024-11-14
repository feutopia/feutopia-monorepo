import { ShallowRefRecord } from ".";

export type FetchState<T> = {
  loading: boolean;
  cancelled: boolean;
  data: T | undefined;
  error: Error | undefined;
};

export type FetchStateRef<T> = ShallowRefRecord<FetchState<T>>;
