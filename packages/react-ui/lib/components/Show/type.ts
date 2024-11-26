import React from "react";

export interface ShowProps {
  if?: boolean; // like vue v-if
  show?: boolean; // like vue v-show
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ref?: React.RefObject<HTMLDivElement>;
  as?: React.ElementType; // 允许自定义渲染的元素类型
  "data-testid"?: string; // 测试id, 给测试用例使用
}
