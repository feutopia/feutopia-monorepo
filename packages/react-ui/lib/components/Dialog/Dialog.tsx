import { Show } from "@/main";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";
import { type DialogProps } from "./type";

function DialogContent(defaultProps: DialogProps) {
  const props = {
    mask: true,
    maskClosable: true,
    open: false,
    ...defaultProps,
  };

  const emit = (event: "onOpen" | "afterOpen" | "onClose" | "afterClose") => {
    props[event]?.();
  };

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const dialogElement = useRef<HTMLDivElement>(null);

  const addTransitionEndListener = (
    dialog: HTMLElement,
    action: "open" | "close",
    callback: () => void
  ) => {
    const isOpening = action === "open";
    dialog.classList.toggle(styles["visible"], isOpening);
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
    emit("onOpen");
    dialog.offsetHeight; // 强制重绘
    dialog.classList.add(styles["visible"]);
    return addTransitionEndListener(dialog, "open", () => {
      emit("afterOpen");
    });
  };

  // 关闭对话框
  const closeDialog = (dialog: HTMLElement) => {
    emit("onClose");
    dialog.classList.remove(styles["visible"]);
    return addTransitionEndListener(dialog, "close", () => {
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
    const transitionCleanup = isShow ? openDialog(dialog) : closeDialog(dialog);
    return () => transitionCleanup();
  }, [isShow]);

  // 监听 open 变化
  useEffect(() => {
    if (props.open) {
      setShouldRender(true);
      setIsVisible(true);
      setIsShow(true);
    } else {
      setIsShow(false);
      // 如果这个时候 dialog 不存在，则直接销毁
      if (!dialogElement.current) {
        setShouldRender(false);
        setIsVisible(false);
      }
    }
  }, [props.open]);

  return (
    <Show
      data-testid={props["data-test-id"]}
      ref={dialogElement}
      if={shouldRender}
      show={isVisible}
      className={clsx(styles["fe-dialog"], props.className)}
      style={props.style}
    >
      <Show
        data-testid={props["data-test-mask-id"]}
        if={props.mask}
        className={clsx(styles["fe-dialog-mask"], props.maskClass)}
        style={props.maskStyle}
        onClick={() => {
          if (props.maskClosable) {
            emit("onClose");
          }
        }}
      ></Show>
      <div className={styles["fe-dialog-content"]}>
        <div
          data-testid={props["data-test-content-id"]}
          className={clsx(styles["fe-dialog-body"], props.contentClass)}
          style={props.contentStyle}
        >
          {props.children}
        </div>
      </div>
    </Show>
  );
}

export function Dialog(props: DialogProps) {
  return createPortal(<DialogContent {...props} />, document.body);
}
