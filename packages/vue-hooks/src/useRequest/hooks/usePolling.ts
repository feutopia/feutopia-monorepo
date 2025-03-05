import { tryOnScopeDispose } from "@/utils";
import {
  delay,
  cancelDelay,
  DelayPromise,
  isPositiveInteger,
} from "@feutopia/utils";
import { toValue, watch } from "vue";
import { EmitterInstance, RequestFetch, RequestControlOptions } from "../types";

type Params<TData> = RequestFetch & {
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

  // 获取当前的轮询配置状态
  const getPollingState = () => {
    const interval = toValue(params.pollingInterval);
    const ready = toValue(params.ready);
    return {
      interval,
      ready,
      isValid: ready && isPositiveInteger(interval),
    };
  };

  const request = async () => {
    const { interval, isValid } = getPollingState();
    if (!isValid) return;

    delayPromise = delay(interval as number);
    const cancelled = await delayPromise;

    if (cancelled) return;

    const { isValid: stillValid } = getPollingState();
    if (stillValid) {
      params.fetch();
    }
  };

  // 监听轮询间隔变化
  watch(
    () => toValue(params.pollingInterval),
    () => {
      if (delayPromise?.isRunning) {
        cancelDelayTask();
        const { isValid } = getPollingState();
        if (isValid) {
          request();
        }
      }
    }
  );

  // 监听请求完成事件
  params.emitter.on("finally", () => {
    const { isValid } = getPollingState();
    if (isValid) {
      request();
    }
  });

  // 监听取消事件
  params.emitter.on("cancel", cancelDelayTask);

  // 组件销毁时清理
  tryOnScopeDispose(cancelDelayTask);
}
