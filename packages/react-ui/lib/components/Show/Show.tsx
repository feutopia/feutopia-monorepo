import { forwardRef } from "react";
import { type ShowProps } from "./type";

export const Show = forwardRef<HTMLDivElement, ShowProps>(
  (defaultProps, ref) => {
    const props = {
      show: true,
      if: true,
      ...defaultProps,
    };
    const Component = props.as || "div";
    if (!props.if) return null;
    return (
      <Component
        style={{ display: props.show ? "" : "none" }}
        className={props.className}
        onClick={props.onClick}
        ref={ref}
      >
        {props.children}
      </Component>
    );
  }
);
