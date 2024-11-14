import { toValue, watch } from "vue";
import {
  EmitterInstance,
  FetchStateRef,
  RequestControlOptions,
} from "../types";

type Para = Pick<RequestControlOptions, "ready" | "refreshDeps">;

type Emitter<T> = EmitterInstance<FetchStateRef<T>>;

export function useRefresh<TData>(emitter: Emitter<TData>, para: Para) {
  watch(para.refreshDeps, () => {
    if (toValue(para.ready)) {
      emitter.emit("run");
    }
  });
}
