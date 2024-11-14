import { toValue, watch } from "vue";
import {
  EmitterInstance,
  FetchStateRef,
  RequestControlOptions,
} from "../types";

type Para = Pick<RequestControlOptions, "ready" | "manual">;

type Emitter<T> = EmitterInstance<FetchStateRef<T>>;

export function useReady<TData>(emitter: Emitter<TData>, para: Para) {
  watch(
    () => toValue(para.ready),
    (ready) => {
      const manual = toValue(para.manual);
      if (ready && !manual) {
        emitter.emit("run");
      }
    }
  );
}
