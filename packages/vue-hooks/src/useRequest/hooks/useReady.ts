import { toValue, watch } from "vue";
import { EmitterInstance, RequestControlOptions } from "../types";

type Params = Pick<RequestControlOptions, "ready" | "manual">;

export function useReady<TData>(
  emitter: EmitterInstance<TData>,
  params: Params
) {
  watch(
    () => toValue(params.ready),
    (ready) => {
      const manual = toValue(params.manual);
      if (ready && !manual) {
        emitter.emit("run");
      }
    }
  );
}
