import { toValue, watch } from "vue";
import { EmitterInstance, RequestControlOptions } from "../types";

type Params = Pick<RequestControlOptions, "ready" | "manual">;

/**
 * ready 从 false 变为 true 时，会立即触发请求。但是从 true 变为 false 时，如果当前正在请求, 则不会cancel, 它只是会阻止下一次请求。
 * @param emitter 请求的 emitter 实例
 * @param params 请求的参数
 */
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
