import { fireEvent, render, screen } from "@testing-library/react";
import { Show } from "../";

describe("Show Component", () => {
  // 测试默认渲染
  it("should render children when if prop is true", () => {
    render(
      <Show data-testid="show-component">
        <div>Test Content</div>
      </Show>
    );
    expect(screen.getByTestId("show-component")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  // 测试 if 属性
  it("should not render when if prop is false", () => {
    render(
      <Show if={false} data-testid="show-component">
        <div>Test Content</div>
      </Show>
    );
    expect(screen.queryByTestId("show-component")).not.toBeInTheDocument();
  });

  // 测试 show 属性
  it("should handle show prop correctly", () => {
    render(
      <Show show={false} data-testid="show-component">
        <div>Test Content</div>
      </Show>
    );
    const element = screen.getByTestId("show-component");
    expect(element).toHaveStyle({ display: "none" });
  });

  // 测试自定义元素类型
  it("should render with custom element type", () => {
    render(
      <Show as="section" data-testid="show-component">
        <div>Test Content</div>
      </Show>
    );
    const element = screen.getByTestId("show-component");
    expect(element.tagName.toLowerCase()).toBe("section");
  });

  // 测试点击事件
  it("should handle onClick event", () => {
    const handleClick = vi.fn();
    render(
      <Show onClick={handleClick} data-testid="show-component">
        <div>Test Content</div>
      </Show>
    );
    fireEvent.click(screen.getByTestId("show-component"));
    expect(handleClick).toHaveBeenCalled();
  });

  // 测试样式和类名
  it("should apply custom styles and className", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <Show
        style={customStyle}
        className="custom-class"
        data-testid="show-component"
      >
        <div>Test Content</div>
      </Show>
    );
    const element = screen.getByTestId("show-component");
    expect(element).toHaveStyle(customStyle);
    expect(element).toHaveClass("custom-class");
  });
});
