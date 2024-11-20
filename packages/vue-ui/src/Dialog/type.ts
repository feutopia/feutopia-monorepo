import { CSSProperties } from "vue";
import type Dialog from "./index.vue";

export type DialogInstance = InstanceType<typeof Dialog>;

export interface DialogProps {
  // 是否显示
  modelValue?: boolean;
  // 关闭时是否销毁
  destroyOnClose?: boolean;
  // 打开后回调
  afterOpen?: () => void;
  // 关闭后回调
  afterClose?: () => void;
  // 是否显示遮罩
  mask?: boolean;
  // 是否点击遮罩关闭
  maskClosable?: boolean;
  // 遮罩样式
  maskStyle?: CSSProperties;
  // 遮罩类
  maskClass?: string;
  // 内容样式
  bodyStyle?: CSSProperties;
  // 内容类
  bodyClass?: string;
}
