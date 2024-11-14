import { ShallowRefObject } from ".";

export type FetchStateData<T> = {
  loading: boolean;
  cancelled: boolean;
  data: T | undefined;
  error: Error | undefined;
};

export type FetchState<T> = ShallowRefObject<FetchStateData<T>>;
