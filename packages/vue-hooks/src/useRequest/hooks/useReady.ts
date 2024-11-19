import { toValue, watch } from "vue";
import { RequestControlOptions } from "../types";
import { RequestFetch } from "../types";

type Params = RequestFetch & Pick<RequestControlOptions, "ready" | "manual">;

/**
 * ready 从 false 变为 true 时，会立即触发请求。但是从 true 变为 false 时，如果当前正在请求, 则不会cancel, 它只是会阻止下一次请求。
 */
export function useReady(params: Params) {
  watch(
    () => toValue(params.ready),
    (ready) => {
      const manual = toValue(params.manual);
      if (ready && !manual) {
        params.fetch();
      }
    }
  );
}
