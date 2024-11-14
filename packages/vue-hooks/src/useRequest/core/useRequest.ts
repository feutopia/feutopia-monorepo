import { tryOnScopeDispose } from "@/utils";
import {
  Service,
  RequestOptions,
  EmitterType,
  FetchStateRef,
  RequestCallbackOptions,
} from "../types";
import { EventEmitter } from "../utils";
import { Fetch } from "./Fetch";
import { toValue } from "vue";
import { usePolling, useReady, useRefresh } from "../hooks";

export function useRequest<TData, TParams extends any[]>(
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

  const emitter = new EventEmitter<EmitterType<FetchStateRef<TData>>>();
  const fetchInstance = new Fetch<TData, TParams>(
    service,
    emitter,
    params as RequestCallbackOptions<TData, TParams>
  );

  useReady(emitter, { ready, manual });
  useRefresh(emitter, { ready, refreshDeps });
  usePolling(emitter, fetchInstance.state, {
    ready,
    pollingInterval,
  });

  tryOnScopeDispose(() => {
    fetchInstance.unmount();
    emitter.offAll();
  });

  const init = () => {
    const canExcute = toValue(ready) && !toValue(manual);
    if (canExcute) {
      fetchInstance.run(...(params as TParams));
    }
  };
  init();

  return {
    ...fetchInstance.state,
    run: fetchInstance.run.bind(fetchInstance),
    cancel: fetchInstance.cancel.bind(fetchInstance),
    refresh: fetchInstance.refresh.bind(fetchInstance),
  };
}
