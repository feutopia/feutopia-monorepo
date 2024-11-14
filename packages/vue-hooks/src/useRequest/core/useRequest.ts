import { tryOnScopeDispose } from "@/utils";
import mitt from "@feutopia/mitt";
import {
  EmitterEvents,
  RequestCallbackOptions,
  RequestOptions,
  Service,
} from "../types";
import { toValue } from "vue";
import { usePolling, useReady, useRefresh } from "../hooks";
import { Fetch } from "./Fetch";

export function useRequest<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  initOptions: RequestOptions<TData, TParams>
) {
  const defaultOptions = {
    params: [],
    ready: true,
    manual: false,
    refreshDeps: [],
    pollingInterval: 0,
  } satisfies typeof initOptions | { params: [] };
  const options = { ...defaultOptions, ...initOptions };
  const { params, ready, manual, refreshDeps, pollingInterval } = options;

  const emitter = mitt<EmitterEvents<TData>>();
  const fetchInstance = new Fetch<TData, TParams>(
    service,
    params as RequestCallbackOptions<TData, TParams>,
    emitter
  );
  useReady(emitter, { ready, manual });
  useRefresh(emitter, { ready, refreshDeps });
  usePolling(emitter, fetchInstance.state, {
    ready,
    pollingInterval,
  });

  const init = () => {
    const canExecute = toValue(ready) && !toValue(manual);
    if (canExecute) {
      fetchInstance.run(...(params as TParams));
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
    run: fetchInstance.run.bind(fetchInstance),
    cancel: fetchInstance.cancel.bind(fetchInstance),
    refresh: fetchInstance.refresh.bind(fetchInstance),
  };
}
