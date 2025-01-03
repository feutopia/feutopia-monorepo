import { buildCancelableTask, DeepUnwrapRef } from "@feutopia/utils";
import { MaybeRefOrGetter, shallowRef, toValue } from "vue";
import {
  EmitterInstance,
  FetchState,
  FetchStateData,
  RequestCallbackOptions,
  Service,
  ValueOrEmptyArray,
} from "../types";
import { isNotRefObject } from "../utils";

export class Fetch<TData, TParams extends any[]> {
  #params: ValueOrEmptyArray<TParams>;
  #count = 0;
  #serviceTask: ReturnType<
    typeof buildCancelableTask<TData, DeepUnwrapRef<TParams>>
  > | null = null;
  state: FetchState<TData> = {
    loading: shallowRef(false),
    data: shallowRef<TData>(),
    error: shallowRef<Error>(),
    cancelled: shallowRef(false),
  };
  constructor(
    private service: Service<TData, DeepUnwrapRef<TParams>>,
    private readonly options: RequestCallbackOptions<TData, TParams>,
    private readonly emitter: EmitterInstance<TData>
  ) {
    this.#params = this.options.params ?? [];
  }
  #setState(state: Partial<FetchStateData<TData>>) {
    for (const [key, value] of Object.entries(state)) {
      const item = this.state[key as keyof typeof state];
      item.value = value;
    }
  }
  #resolveObj(params: Record<string, MaybeRefOrGetter<any>>) {
    const obj: Partial<typeof params> = {};
    for (const [key, value] of Object.entries(params)) {
      obj[key] = isNotRefObject(value)
        ? this.#resolveObj(value)
        : toValue(value);
    }
    return obj;
  }
  #resolveParams(params: ValueOrEmptyArray<TParams>) {
    return params.map((param) =>
      isNotRefObject(param) ? this.#resolveObj(param) : toValue(param)
    ) as DeepUnwrapRef<TParams>;
  }
  #cancelTask() {
    if (this.#serviceTask) {
      this.#serviceTask.cancel();
      this.#serviceTask = null;
    }
  }
  async #send(...args: ValueOrEmptyArray<TParams>) {
    const params = this.#resolveParams(args);
    const currentCount = ++this.#count;
    this.#cancelTask();
    this.options.onBefore?.();
    this.emitter.emit("before");
    this.#setState({
      loading: true,
      cancelled: false,
    });
    this.#serviceTask = buildCancelableTask(this.service);
    const { data, cancelled, error } = await this.#serviceTask.run(...params);
    if (currentCount !== this.#count) return this.state; // 如果不是当前的请求，直接返回
    if (cancelled) {
      // 取消
      this.#setState({
        loading: false,
        error: undefined,
        cancelled: true,
      });
      this.emitter.emit("cancelled");
    } else if (error) {
      // 失败
      this.#setState({
        loading: false,
        error,
        cancelled: false,
      });
      this.options.onError?.(error);
      this.emitter.emit("error", error);
    } else {
      // 成功
      this.#setState({
        loading: false,
        data,
        error: undefined,
        cancelled: false,
      });
      this.options.onSuccess?.(this.state.data.value, params);
      this.emitter.emit("success", this.state);
    }
    this.options.onFinally?.();
    this.emitter.emit("finally");
    return this.state;
  }
  getService() {
    return this.service;
  }
  setService(value: Service<TData, DeepUnwrapRef<TParams>>) {
    this.service = value;
  }
  run(...args: ValueOrEmptyArray<TParams>) {
    return this.#send(...args);
  }
  cancel() {
    this.emitter.emit("cancel");
    this.#cancelTask();
  }
  refresh() {
    return this.#send(...this.#params);
  }
  unmount() {
    this.#cancelTask();
  }
}
