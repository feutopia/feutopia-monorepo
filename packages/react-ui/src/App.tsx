import { useState } from "react";
import { Dialog } from "@/components/Dialog";

function App() {
  const [open, setOpen] = useState(false);
  const [destroy, setDestroy] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        打开
      </button>
      <button onClick={() => setDestroy(true)}>销毁</button>
      {!destroy && (
        <Dialog open={open} destroyOnClose onClose={() => setOpen(false)}>
          <div>123</div>
        </Dialog>
      )}
    </>
  );
}

export default App;
