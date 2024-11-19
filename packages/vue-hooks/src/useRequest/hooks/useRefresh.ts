import { toValue, watch } from "vue";
import { RequestFetch, RequestControlOptions } from "../types";
import { isArray } from "@feutopia/utils";

type Params = RequestFetch &
  Pick<RequestControlOptions, "ready" | "refreshDeps">;

export function useRefresh(params: Params) {
  const refreshDeps = toValue(params.refreshDeps);
  watch(isArray(refreshDeps) ? refreshDeps : [], () => {
    if (toValue(params.ready)) {
      params.fetch();
    }
  });
}
