import { toValue, watch } from "vue";
import { RequestAction, RequestControlOptions } from "../types";

type Params = RequestAction &
  Pick<RequestControlOptions, "ready" | "refreshDeps">;

export function useRefresh(params: Params) {
  watch(params.refreshDeps, () => {
    if (toValue(params.ready)) {
      params.fetch();
    }
  });
}
