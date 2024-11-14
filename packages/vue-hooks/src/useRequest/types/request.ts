import { DeepUnwrapRef, Noop } from "@feutopia/utils";
import { MaybeRefOrGetter, WatchSource } from "vue";
import { ValueOrEmptyArray } from "./utils";

export type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>;

export type RequestControlOptions = Readonly<{
  ready: MaybeRefOrGetter<Boolean>;
  manual: MaybeRefOrGetter<Boolean>;
  refreshDeps: WatchSource<any>[];
  pollingInterval: MaybeRefOrGetter<number>;
}>;

export type RequestCallbackOptions<TData, TParams extends any[]> = {
  params?: ValueOrEmptyArray<TParams>;
  onBefore?: Noop;
  onSuccess?: (data: TData | undefined, params: DeepUnwrapRef<TParams>) => void;
  onError?: (e: Error) => void;
  onFinally?: Noop;
};

export type RequestOptions<
  TData,
  TParams extends any[],
> = RequestCallbackOptions<TData, TParams> & Partial<RequestControlOptions>;
