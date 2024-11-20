import { useEffect, useState } from "react";
import { useEvent } from "./hooks/useEvent";

export default () => {
  const [count, setCount] = useState(0);

  const onLeave = useEvent(() => {
    console.log("onleave:", count);
  });

  const onEnter = useEvent(() => {
    console.log("onenter:", count);
  });

  const onClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    onEnter();

    return () => {
      onLeave();
    };
  });

  return (
    <>
      <button type="button" onClick={onClick}>
        useEvent {count}
      </button>
    </>
  );
};
