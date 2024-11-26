import React from "react";
export interface DialogProps {
  // 类名
  className?: string;
  // 样式
  style?: React.CSSProperties;
  // 内容
  children?: React.ReactNode;
  // 是否显示
  open?: boolean;
  // 关闭时是否销毁
  destroyOnClose?: boolean;
  // 打开回调
  onOpen?: () => void;
  // 打开后回调
  afterOpen?: () => void;
  // 关闭回调
  onClose?: () => void;
  // 关闭后回调
  afterClose?: () => void;
  // 是否显示遮罩
  mask?: boolean;
  // 是否点击遮罩关闭
  maskClosable?: boolean;
  // 遮罩样式
  maskStyle?: React.CSSProperties;
  // 遮罩类
  maskClass?: string;
  // 内容样式
  contentStyle?: React.CSSProperties;
  // 内容类
  contentClass?: string;
  // 测试id, 给测试用例使用
  "data-test-id"?: string;
  // 测试遮罩id, 给测试用例使用
  "data-test-mask-id"?: string;
  // 测试内容id, 给测试用例使用
  "data-test-content-id"?: string;
}
