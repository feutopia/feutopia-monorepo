import { MaybeRefOrGetter, shallowRef, toValue } from "vue";
import { buildCancelableTask, DeepUnwrapRef, Noop } from "@feutopia/utils";
import {
  Service,
  RequestCallbackOptions,
  EmitterInstance,
  FetchState,
  FetchStateData,
  ValueOrEmptyArray,
} from "../types";
import { isNotRefObject } from "../utils";

export class Fetch<TData, TParams extends any[]> {
  private params: ValueOrEmptyArray<TParams>;
  private count = 0;
  private unsubscribes: Noop[] = [];
  private serviceTask: ReturnType<
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
    private options: RequestCallbackOptions<TData, TParams>,
    private emitter: EmitterInstance<TData>
  ) {
    this.service = service;
    this.options = options;
    this.emitter = emitter;
    this.params = this.options.params ?? [];
    this.subscribe();
  }
  private subscribe() {
    const stop = this.emitter.on("run", () => {
      this.run(...this.params);
    });
    this.unsubscribes.push(stop);
  }
  private setState(state: Partial<FetchStateData<TData>>) {
    for (const [key, value] of Object.entries(state)) {
      const item = this.state[key as keyof typeof state];
      item.value = value;
    }
  }
  private resolveObj(params: Record<string, MaybeRefOrGetter<any>>) {
    const obj: Partial<typeof params> = {};
    for (const [key, value] of Object.entries(params)) {
      obj[key] = isNotRefObject(value)
        ? this.resolveObj(value)
        : toValue(value);
    }
    return obj;
  }
  private resolveParams(params: ValueOrEmptyArray<TParams>) {
    return params.map((param) =>
      isNotRefObject(param) ? this.resolveObj(param) : toValue(param)
    ) as DeepUnwrapRef<TParams>;
  }
  private cancelTask() {
    if (this.serviceTask) {
      this.serviceTask.cancel();
      this.serviceTask = null;
    }
  }
  private async send(...args: ValueOrEmptyArray<TParams>) {
    const params = this.resolveParams(args);
    const currentCount = ++this.count;
    this.cancelTask();
    this.setState({
      loading: true,
      cancelled: false,
    });
    this.emitter.emit("loading");
    this.options.onBefore?.();
    this.emitter.emit("before");
    this.serviceTask = buildCancelableTask(this.service);
    const { data, cancelled, error } = await this.serviceTask.run(...params);
    if (cancelled) {
      // 取消
      if (currentCount === this.count) {
        // 确保是当前的请求
        this.setState({
          loading: false,
          error: undefined,
          cancelled: true,
        });
        this.emitter.emit("cancelled");
      }
    } else if (error) {
      // 失败
      this.setState({
        loading: false,
        error,
        cancelled: false,
      });
      this.options.onError?.(error);
      this.emitter.emit("error", error);
    } else {
      // 成功
      this.setState({
        loading: false,
        data,
        error: undefined,
        cancelled: false,
      });
      this.options.onSuccess?.(this.state.data.value, params);
      this.emitter.emit("success", this.state);
    }
    if (currentCount === this.count) {
      this.options.onFinally?.();
      this.emitter.emit("finally", this.state);
    }
    return this.state;
  }
  run(...args: ValueOrEmptyArray<TParams>) {
    return this.send(...args);
  }
  cancel() {
    this.emitter.emit("cancel");
    this.cancelTask();
  }
  refresh() {
    return this.send(...this.params);
  }
  public unmount() {
    this.unsubscribes.forEach((fn) => fn());
    this.unsubscribes = [];
    this.cancelTask();
  }
}
