import { Emitter } from "@feutopia/mitt";
import { FetchState } from ".";

type EmitterType<T> = {
  // 状态事件
  loading: void;
  before: void;
  success: T;
  error: Error;
  finally: T;
  cancelled: void;
  // 动作事件
  run: void;
  cancel: void;
};

// mitt 事件
export type EmitterEvents<T> = EmitterType<FetchState<T>>;

// mitt 实例
export type EmitterInstance<T> = Emitter<EmitterEvents<T>>;
