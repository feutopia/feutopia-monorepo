import { createPortal } from "react-dom";
import styles from "./styles.module.scss";
import { DialogProps } from "./type";
import { clsx } from "clsx";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { Show } from "@/main";

function Modal(defaultProps: DialogProps) {
  const props = {
    mask: true,
    maskClosable: true,
    open: false,
    ...defaultProps,
  };

  const emit = (
    ...args: ("onOpen" | "afterOpen" | "onClose" | "afterClose")[]
  ) => {
    args.forEach((event) => {
      props[event]?.();
    });
  };

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const dialogElement = useRef<HTMLDivElement>(null);
  const contentElement = useRef<HTMLDivElement>(null);

  const addTransitionEndListener = (
    dialog: HTMLElement,
    callback: () => void
  ) => {
    const transitionController = new AbortController();
    dialog.addEventListener(
      "transitionend",
      () => {
        callback();
      },
      { once: true, signal: transitionController.signal }
    );
    return () => {
      transitionController.abort();
    };
  };

  // 打开对话框
  const openDialog = (dialog: HTMLElement) => {
    console.log("openDialog");
    emit("onOpen");
    dialog.offsetHeight; // 强制重绘
    dialog.classList.add(styles["visible"]);
    return addTransitionEndListener(dialog, () => {
      emit("afterOpen");
    });
  };

  // 关闭对话框
  const closeDialog = (dialog: HTMLElement) => {
    console.log("closeDialog");
    dialog.classList.remove(styles["visible"]);
    return addTransitionEndListener(dialog, () => {
      if (props.destroyOnClose) {
        setShouldRender(false);
      }
      setIsVisible(false);
      emit("afterClose");
    });
  };

  // 监听 isShow 变化
  useEffect(() => {
    const dialog = dialogElement.current;
    if (!dialog) return;
    if (isShow) {
      return openDialog(dialog);
    } else {
      return closeDialog(dialog);
    }
  }, [isShow]);

  // 监听 open 变化
  useEffect(() => {
    if (props.open) {
      setShouldRender(true);
      setIsVisible(true);
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [props.open]);

  return (
    <Show
      if={shouldRender}
      show={isVisible}
      ref={dialogElement}
      className={clsx(props.className, styles["fe-dialog"])}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        const dialog = dialogElement.current;
        if (
          props.maskClosable &&
          dialog &&
          e.target === contentElement.current
        ) {
          emit("onClose");
        }
      }}
    >
      <Show
        show={props.mask}
        className={clsx(styles["fe-dialog-mask"], props.maskClass)}
        style={props.maskStyle}
      ></Show>
      <div className={styles["fe-dialog-content"]} ref={contentElement}>
        <div
          className={clsx(styles["fe-dialog-body"], props.bodyClass)}
          style={props.bodyStyle}
        >
          {props.children}
        </div>
      </div>
    </Show>
  );
}

export function Dialog(props: DialogProps) {
  return createPortal(<Modal {...props} />, document.body);
}
