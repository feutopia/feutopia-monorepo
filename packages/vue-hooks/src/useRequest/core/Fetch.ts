import { MaybeRefOrGetter, shallowRef, toValue } from "vue";
import { buildCancelableTask } from "@feutopia/utils";
import {
  FetchStateRef,
  EmitterInstance,
  Service,
  RequestCallbackOptions,
  Noop,
  FetchState,
  UnwrapMaybeRefGetterArray,
} from "../types";
import { isNonRefObject } from "../utils";

type Emitter<T> = EmitterInstance<FetchStateRef<T>>;

export class Fetch<TData, TParams extends any[]> {
  private service: Service<TData, TParams>;
  private emitter: Emitter<TData>;
  private serviceTask: ReturnType<
    typeof buildCancelableTask<TData, TParams>
  > | null;
  private params: TParams;
  private count = 0;
  private options: RequestCallbackOptions<TData, TParams>;
  private cleanupFns: Noop[];
  state: FetchStateRef<TData> = {
    loading: shallowRef(false),
    data: shallowRef<TData | undefined>(undefined),
    error: shallowRef<Error | undefined>(undefined),
    cancelled: shallowRef(false),
  };
  constructor(
    service: Service<TData, TParams>,
    emitter: Emitter<TData>,
    options: RequestCallbackOptions<TData, TParams>
  ) {
    this.service = service;
    this.serviceTask = null;
    this.emitter = emitter;
    this.options = options;
    this.params = (options.params || []) as TParams;
    this.cleanupFns = [];
    this.subscribe();
  }
  private subscribe() {
    const cleanupRun = this.emitter.on("run", () => {
      this.run(...this.params);
    });
    this.cleanupFns.push(cleanupRun);
  }
  private setState(obj: Partial<FetchState<TData>>) {
    for (const [key, value] of Object.entries(obj)) {
      const item = this.state[key as keyof typeof this.state];
      if (item) {
        item.value = value;
      }
    }
  }
  private resolveObj(param: Record<string, MaybeRefOrGetter<any>>) {
    const obj: Partial<typeof param> = {};
    for (const [key, value] of Object.entries(param)) {
      obj[key] = isNonRefObject(value)
        ? this.resolveObj(value)
        : toValue(value);
    }
    return obj;
  }
  private resolveParams(args: TParams) {
    return args.map((param) =>
      isNonRefObject(param) ? this.resolveObj(param) : toValue(param)
    ) as UnwrapMaybeRefGetterArray<TParams>;
  }
  private cancelTask() {
    if (this.serviceTask) {
      this.serviceTask.cancel();
      this.serviceTask = null;
    }
  }
  private async send(...args: TParams) {
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
          cancelled: true,
          error: undefined,
        });
        this.emitter.emit("cancelled");
      }
    } else if (error) {
      // 失败
      this.setState({
        error,
        loading: false,
        cancelled: false,
      });
      this.options.onError?.(error);
      this.emitter.emit("error", error);
    } else {
      // 成功
      this.setState({
        data,
        loading: false,
        cancelled: false,
        error: undefined,
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
  run(...args: TParams) {
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
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    this.cancelTask();
  }
}
