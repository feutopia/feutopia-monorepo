import { tryOnScopeDispose } from "@/utils";
import { buildCancelableTask } from "@feutopia/utils";
import { toValue, watch } from "vue";
import {
  EmitterInstance,
  RequestAction,
  RequestControlOptions,
} from "../types";

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

type DelayTask = ReturnType<
  typeof buildCancelableTask<void, Parameters<typeof delay>>
>;

type Params<TData> = RequestAction & {
  emitter: EmitterInstance<TData>;
} & Pick<RequestControlOptions, "pollingInterval" | "ready">;

export function usePolling<TData>(params: Params<TData>) {
  let delayTask: DelayTask | null = null;

  const cancelDelayTask = () => {
    if (delayTask) {
      delayTask.cancel();
      delayTask = null;
    }
  };

  // 获取轮询间隔
  const getInterval = () => toValue(params.pollingInterval);

  // 是否可以轮询
  const canPoll = () => toValue(params.ready) && getInterval() > 0;

  const request = async () => {
    delayTask = buildCancelableTask(delay);
    const { cancelled } = await delayTask.run(getInterval());
    if (cancelled) return;
    if (canPoll()) {
      params.fetch();
    }
  };

  watch(getInterval, () => {
    if (delayTask?.isRunning()) {
      cancelDelayTask();
      // 当前没有在发送请求
      if (canPoll()) {
        request();
      }
    }
  });

  params.emitter.on("finally", () => {
    if (canPoll()) {
      request();
    }
  });

  params.emitter.on("cancel", () => {
    cancelDelayTask();
  });

  tryOnScopeDispose(() => {
    cancelDelayTask();
  });
}
