import { tryOnScopeDispose } from "@/utils";
import mitt from "@feutopia/mitt";
import { EmitterEvents, RequestOptions, Service } from "../types";
import { toValue } from "vue";
import { usePolling, useReady, useRefresh } from "../hooks";
import { Fetch } from "./Fetch";
import { DeepUnwrapRef } from "@feutopia/utils";

export function useRequest<TData, TParams extends any[]>(
  service: Service<TData, DeepUnwrapRef<TParams>>,
  initOptions?: RequestOptions<TData, TParams>
) {
  const defaultOptions = {
    params: [],
    ready: true,
    manual: false,
    refreshDeps: [],
    pollingInterval: 0,
  } satisfies typeof initOptions;
  const options = { ...defaultOptions, ...initOptions };

  const emitter = mitt<EmitterEvents<TData>>();
  const fetchInstance = new Fetch<TData, TParams>(service, options, emitter);

  useReady(emitter, { ready: options.ready, manual: options.manual });
  useRefresh(emitter, {
    ready: options.ready,
    refreshDeps: options.refreshDeps,
  });
  usePolling(emitter, fetchInstance.state, {
    ready: options.ready,
    pollingInterval: options.pollingInterval,
  });

  // 初始化
  const init = () => {
    const canExecute = toValue(options.ready) && !toValue(options.manual);
    if (canExecute) {
      fetchInstance.run(...options.params);
    }
  };
  init();
  // 卸载
  tryOnScopeDispose(() => {
    fetchInstance.unmount();
    emitter.all.clear();
  });

  return {
    ...fetchInstance.state,
    // 手动调用 run 方法, 只需判断是否 ready
    run: (...params: Parameters<typeof fetchInstance.run>) => {
      if (toValue(options.ready)) {
        return fetchInstance.run(...params);
      }
    },
    // 手动调用 refresh 方法, 只需判断是否 ready
    refresh: () => {
      if (toValue(options.ready)) {
        return fetchInstance.refresh();
      }
    },
    cancel: fetchInstance.cancel.bind(fetchInstance),
  };
}
