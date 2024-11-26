import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Dialog, type DialogProps } from "../";

const mockTransitionEvent = () => {
  const originalAddEventListener =
    window.HTMLElement.prototype.addEventListener;
  const originalRemoveEventListener =
    window.HTMLElement.prototype.removeEventListener;

  beforeEach(() => {
    (window.HTMLElement as any).prototype.addEventListener = function (
      event: string,
      callback: EventListenerOrEventListenerObject,
      options: AddEventListenerOptions
    ) {
      if (event === "transitionend") {
        // Immediately trigger the transition callback
        if (typeof callback === "function") {
          setTimeout(() => {
            callback(new TransitionEvent("transitionend"));
          }, 0);
        }
      }
      return originalAddEventListener.call(this, event, callback, options);
    };

    return () => {
      window.HTMLElement.prototype.addEventListener = originalAddEventListener;
      window.HTMLElement.prototype.removeEventListener =
        originalRemoveEventListener;
    };
  });
};

describe("Dialog", () => {
  mockTransitionEvent();

  it("should render dialog when open is true", () => {
    const props: DialogProps = {
      open: true,
      "data-test-id": "dialog",
    };

    render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("should not render dialog when open is false", () => {
    const props: DialogProps = {
      open: false,
      "data-test-id": "dialog",
    };

    render(<Dialog {...props} />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("should render children content correctly", () => {
    const props: DialogProps = {
      open: true,
      children: <div data-testid="dialog-children">Test Content</div>,
    };

    render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog-children")).toHaveTextContent(
      "Test Content"
    );
  });

  it("should apply custom classes correctly", () => {
    const props: DialogProps = {
      open: true,
      className: "custom-dialog",
      maskClass: "custom-mask",
      contentClass: "custom-content",
      "data-test-id": "dialog",
      "data-test-mask-id": "dialog-mask",
      "data-test-content-id": "dialog-content",
    };

    render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog")).toHaveClass("custom-dialog");
    expect(screen.getByTestId("dialog-mask")).toHaveClass("custom-mask");
    expect(screen.getByTestId("dialog-content")).toHaveClass("custom-content");
  });

  it("should apply custom styles correctly", () => {
    const style = { width: "300px", height: "300px" };
    const maskStyle = { backgroundColor: "rgba(0,0,0,0.8)" };
    const contentStyle = { padding: "20px" };
    const props: DialogProps = {
      open: true,
      style,
      maskStyle,
      contentStyle,
      "data-test-id": "dialog",
      "data-test-mask-id": "dialog-mask",
      "data-test-content-id": "dialog-content",
    };

    render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog")).toHaveStyle(style);
    expect(screen.getByTestId("dialog-mask")).toHaveStyle(maskStyle);
    expect(screen.getByTestId("dialog-content")).toHaveStyle(contentStyle);
  });

  it("should handle mask visibility and click events correctly", () => {
    const onClose = vi.fn();
    const props: DialogProps = {
      open: true,
      mask: true,
      maskClosable: true,
      onClose,
      "data-test-mask-id": "dialog-mask",
      "data-test-content-id": "dialog-content",
    };

    const { rerender } = render(<Dialog {...props} />);
    const mask = screen.getByTestId("dialog-mask");
    fireEvent.click(mask);
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();

    rerender(<Dialog {...props} maskClosable={false} />);
    fireEvent.click(mask);
    expect(onClose).not.toHaveBeenCalled();

    onClose.mockClear();
    rerender(<Dialog {...props} mask={false} />);
    expect(screen.queryByTestId("dialog-mask")).not.toBeInTheDocument();
  });

  it("should handle lifecycle callbacks correctly", async () => {
    const callbacks = {
      onOpen: vi.fn(),
      afterOpen: vi.fn(),
      onClose: vi.fn(),
      afterClose: vi.fn(),
    };

    const props: DialogProps = {
      open: true,
      ...callbacks,
      "data-test-id": "dialog",
      "data-test-content-id": "dialog-content",
    };

    // Test open, afterOpen
    const { rerender } = render(<Dialog {...props} />);
    expect(callbacks.onOpen).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(callbacks.afterOpen).toHaveBeenCalledTimes(1);
    });

    // Test close, afterClose
    rerender(<Dialog {...props} open={false} />);
    expect(callbacks.onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(callbacks.afterClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle destroyOnClose correctly", async () => {
    const props: DialogProps = {
      open: true,
      destroyOnClose: true,
      children: <div data-testid="dialog-children">Test Content</div>,
      "data-test-id": "dialog",
    };

    const { rerender } = render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog-children")).toBeInTheDocument();

    //Close the dialog
    rerender(<Dialog {...props} open={false} />);

    await waitFor(() => {
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });
  });

  it("should handle multiple rapid open/close transitions correctly", async () => {
    const props: DialogProps = {
      open: true,
      destroyOnClose: true,
      "data-test-id": "dialog",
    };

    const { rerender } = render(<Dialog {...props} />);

    // Rapidly toggle the dialog
    rerender(<Dialog {...props} open={false} />);
    rerender(<Dialog {...props} open={true} />);
    rerender(<Dialog {...props} open={false} />);

    // Verify final state
    await waitFor(() => {
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });
  });

  it("should handle content updates while dialog is open", () => {
    const props: DialogProps = {
      open: true,
      children: <div data-testid="dialog-children">Initial Content</div>,
    };

    const { rerender } = render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog-children")).toHaveTextContent(
      "Initial Content"
    );

    // Update content
    rerender(
      <Dialog
        {...props}
        children={<div data-testid="dialog-children">Updated Content</div>}
      />
    );
    expect(screen.getByTestId("dialog-children")).toHaveTextContent(
      "Updated Content"
    );
  });

  it("should maintain dialog state when props other than 'open' change", () => {
    const props: DialogProps = {
      open: true,
      "data-test-id": "dialog",
      style: { width: "200px" },
    };

    const { rerender } = render(<Dialog {...props} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    // Update style without changing open state
    rerender(<Dialog {...props} style={{ width: "300px" }} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog")).toHaveStyle({ width: "300px" });
  });
});
