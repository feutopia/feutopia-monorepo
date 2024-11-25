import React, { MouseEvent } from "react";

export interface ShowProps {
  if?: boolean; // like vue v-if behavior
  show?: boolean; // like vue v-show behavior
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  ref?: React.RefObject<HTMLDivElement>;
  as?: React.ElementType; // 允许自定义渲染的元素类型
}
