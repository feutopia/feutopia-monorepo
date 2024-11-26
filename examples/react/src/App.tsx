import { useState } from "react";
import { Dialog } from "@feutopia/react-ui";

function App() {
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
        <div>123</div>
      </Dialog>
    </>
  );
}

export default App;
