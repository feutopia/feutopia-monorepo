import { forwardRef } from "react";
import { type ShowProps } from "./type";

export const Show = forwardRef<HTMLDivElement, ShowProps>(
  (defaultProps, ref) => {
    const props = {
      show: true,
      if: true,
      as: "div",
      ...defaultProps,
    };
    const { show, if: ifProps, as: Component, ...restProps } = props;
    if (!ifProps) return null;
    return (
      <Component
        style={{ display: show ? "" : "none" }}
        ref={ref}
        {...restProps}
      >
        {props.children}
      </Component>
    );
  }
);
