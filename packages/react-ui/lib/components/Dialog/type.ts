import { CSSProperties } from "react";

export interface DialogProps {
  // 类名
  className?: string;
  // 点击事件
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  // 内容
  children?: React.ReactNode;
  // 是否显示
  open?: boolean;
  // 关闭时是否销毁
  destroyOnClose?: boolean;
  // 打开后回调
  afterOpen?: () => void;
  // 关闭后回调
  afterClose?: () => void;
  // 打开回调
  onOpen?: () => void;
  // 关闭回调
  onClose?: () => void;
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
