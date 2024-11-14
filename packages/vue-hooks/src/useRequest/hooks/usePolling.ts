import { buildCancelableTask } from "@feutopia/utils";
import { FetchState, EmitterInstance, RequestControlOptions } from "../types";
import { toValue, watch } from "vue";
import { tryOnScopeDispose } from "@/utils";

const delay = (ms: number) =>
  new Promise<undefined>((resolve) => setTimeout(resolve, ms));

type Params = Pick<RequestControlOptions, "pollingInterval" | "ready">;

type DelayTask = ReturnType<
  typeof buildCancelableTask<undefined, Parameters<typeof delay>>
>;

export function usePolling<TData>(
  emitter: EmitterInstance<TData>,
  state: FetchState<TData>,
  params: Params
) {
  let delayTask: DelayTask | null = null;

  const cancelTask = () => {
    if (delayTask) {
      delayTask.cancel();
      delayTask = null;
    }
  };

  // 是否在请求中
  const isLoading = () => toValue(state.loading);

  // 获取轮询间隔
  const getPollingInterval = () => toValue(params.pollingInterval);

  // 是否可以轮询
  const canPoll = () => toValue(params.ready) && getPollingInterval() > 0;

  const request = async () => {
    delayTask = buildCancelableTask(delay);
    const { cancelled } = await delayTask.run(getPollingInterval());
    if (cancelled) return;
    if (canPoll()) {
      emitter.emit("run");
    }
  };

  watch(
    () => getPollingInterval(),
    () => {
      if (!isLoading()) {
        cancelTask();
        // 当前没有在发送请求
        if (canPoll()) {
          request();
        }
      }
    }
  );

  emitter.on("finally", (res) => {
    // 如果请求被取消，则不进行轮询
    if (res.cancelled.value) return;
    if (canPoll()) {
      request();
    }
  });

  emitter.on("cancel", () => {
    cancelTask();
  });

  tryOnScopeDispose(() => {
    cancelTask();
  });
}
