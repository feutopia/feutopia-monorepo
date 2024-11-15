import { tryOnScopeDispose } from "@/utils";
import { delay, cancelDelay, DelayPromise } from "@feutopia/utils";
import { toValue, watch } from "vue";
import {
  EmitterInstance,
  RequestAction,
  RequestControlOptions,
} from "../types";

type Params<TData> = RequestAction & {
  emitter: EmitterInstance<TData>;
} & Pick<RequestControlOptions, "pollingInterval" | "ready">;

export function usePolling<TData>(params: Params<TData>) {
  let delayPromise: DelayPromise | null = null;

  const cancelDelayTask = () => {
    if (delayPromise) {
      cancelDelay(delayPromise);
      delayPromise = null;
    }
  };

  // 获取轮询间隔
  const getInterval = () => toValue(params.pollingInterval);

  // 是否可以轮询
  const canPoll = () => toValue(params.ready) && getInterval() > 0;

  const request = async () => {
    delayPromise = delay(getInterval());
    const { cancelled } = await delayPromise;
    if (cancelled) return;
    if (canPoll()) {
      params.fetch();
    }
  };

  watch(getInterval, () => {
    if (delayPromise?.isRunning()) {
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
