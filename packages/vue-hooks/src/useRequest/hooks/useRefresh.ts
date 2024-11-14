import { toValue, watch } from "vue";
import { EmitterInstance, RequestControlOptions } from "../types";

type Params = Pick<RequestControlOptions, "ready" | "refreshDeps">;

export function useRefresh<TData>(
  emitter: EmitterInstance<TData>,
  params: Params
) {
  watch(params.refreshDeps, () => {
    if (toValue(params.ready)) {
      emitter.emit("run");
    }
  });
}
