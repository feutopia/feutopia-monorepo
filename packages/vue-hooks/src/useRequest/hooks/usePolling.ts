import { buildCancelableTask } from "@feutopia/utils";
import {
  FetchStateRef,
  EmitterInstance,
  RequestControlOptions,
} from "../types";
import { toValue, watch } from "vue";
import { tryOnScopeDispose } from "@/utils";

type Emitter<T> = EmitterInstance<FetchStateRef<T>>;

const delay = (ms: number) =>
  new Promise<undefined>((resolve) => setTimeout(resolve, ms));

type Para = Pick<RequestControlOptions, "pollingInterval" | "ready">;

export function usePolling<TData>(
  emitter: Emitter<TData>,
  state: FetchStateRef<TData>,
  para: Para
) {
  let delayTask: ReturnType<
    typeof buildCancelableTask<undefined, Parameters<typeof delay>>
  > | null = null;

  const cancelDelayTaskRun = () => {
    if (delayTask) {
      delayTask.cancel();
      delayTask = null;
    }
  };

  // 是否可以轮询
  const canPolling = () =>
    toValue(para.ready) && toValue(para.pollingInterval) > 0;

  const request = async () => {
    delayTask = buildCancelableTask(delay);
    const { cancelled } = await delayTask.run(toValue(para.pollingInterval));
    if (cancelled) return;
    if (canPolling()) {
      emitter.emit("run");
    }
  };

  // 监听自身的值发生变化
  watch(
    () => toValue(para.pollingInterval),
    () => {
      const isRequesting = toValue(state.loading);
      if (!isRequesting) {
        cancelDelayTaskRun();
        // 当前没有在发送请求
        if (canPolling()) {
          request();
        }
      }
    }
  );

  emitter.on("finally", (res) => {
    // 如果请求被取消，则不进行轮询
    if (res.cancelled.value) return;
    if (canPolling()) {
      request();
    }
  });

  emitter.on("cancel", cancelDelayTaskRun);

  tryOnScopeDispose(cancelDelayTaskRun);
}
