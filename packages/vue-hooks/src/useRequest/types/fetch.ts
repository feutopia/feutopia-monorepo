import { ShallowRefObject } from ".";
import { Fetch } from "../core/Fetch";

export type FetchStateData<T> = {
  loading: boolean;
  cancelled: boolean;
  data: T | undefined;
  error: Error | undefined;
};

export type FetchState<T> = ShallowRefObject<FetchStateData<T>>;

export type FetchInstance<TData, TParams extends any[]> = InstanceType<
  typeof Fetch<TData, TParams>
>;
