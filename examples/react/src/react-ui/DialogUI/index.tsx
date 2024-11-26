import { useState } from "react";
import { Dialog, type DialogProps } from "@feutopia/react-ui";

export function DialogUI(props: DialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        打开
      </button>
      <Dialog open={open} destroyOnClose onClose={() => setOpen(false)}>
        {props.children}
      </Dialog>
    </>
  );
}
