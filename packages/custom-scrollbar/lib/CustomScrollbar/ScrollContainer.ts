import {
  createElement,
  applyStyles,
  clampValue,
  requestAnimationFrame,
  cancelAnimationFrame,
} from "../utils";

type Options = {
  observerContainer: HTMLElement;
  parentElement: HTMLElement;
  onVerticalScroll: (scrollValue: number) => void;
  onHorizontalScroll: (scrollValue: number) => void;
};

// ScrollContainer class
export class ScrollContainer {
  private observerContainer: Options["observerContainer"];
  private parentElement: Options["parentElement"];
  private onVerticalScroll: Options["onVerticalScroll"];
  private onHorizontalScroll: Options["onHorizontalScroll"];

  // Internal variables
  public scrollTop = 0; // Scroll top position
  public scrollLeft = 0; // Scroll left position
  private clientWidth = 0; // Container width
  private clientHeight = 0; // Container height
  private scrollWidth = 0; // Scrollable width of the container
  private scrollHeight = 0; // Scrollable height of the container
  public maxScrollWidth = 0; // Maximum horizontal scroll distance
  public maxScrollHeight = 0; // Maximum vertical scroll distance
  private cleanupEvents: Array<() => void> = []; // Event handlers to be cleaned up
  private verticalScrollAnimationId: number | null = null; // Vertical scroll animation ID
  private horizontalScrollAnimationId: number | null = null; // Horizontal scroll animation ID

  // init elements
  private element: HTMLElement;

  constructor(options: Options) {
    this.observerContainer = options.observerContainer;
    this.parentElement = options.parentElement;
    this.onVerticalScroll = options.onVerticalScroll; // Vertical scroll event callback
    this.onHorizontalScroll = options.onHorizontalScroll; // Horizontal scroll event callback

    this.element = createElement("div", "fe-scroll-container"); // Scroll container element
    this.applyStyles();
    this.mount();
  }
  applyStyles() {
    applyStyles(this.element, {
      overflow: "hidden",
      height: "100%",
    });
  }
  // Mount
  public mount() {
    this.parentElement.appendChild(this.element);
    this.element.appendChild(this.observerContainer);
    this.updateSize();
    this.attachEvents();

    // Reset scroll position to 0
    requestAnimationFrame(() => {
      this.setScrollTop(0);
      this.setScrollLeft(0);
    });
  }
  // Unmount
  public unmount() {
    this.clearAnimations("vertical", "horizontal");
    this.detachEvents();
    this.element.removeChild(this.observerContainer);
    this.parentElement.removeChild(this.element);
  }
  // Vertical scroll ratio (visible area / total scrollable area)
  get verticalScrollRatio() {
    return this.clientHeight / this.scrollHeight;
  }
  // Horizontal scroll ratio (visible area / total scrollable area)
  get horizontalScrollRatio() {
    return this.clientWidth / this.scrollWidth;
  }
  // Update the scroll container's size and scroll positions
  public updateSize() {
    this.scrollTop = this.element.scrollTop;
    this.scrollLeft = this.element.scrollLeft;
    this.clientWidth = this.element.clientWidth;
    this.clientHeight = this.element.clientHeight;
    this.scrollWidth = this.element.scrollWidth;
    this.scrollHeight = this.element.scrollHeight;
    this.maxScrollWidth = this.scrollWidth - this.clientWidth;
    this.maxScrollHeight = this.scrollHeight - this.clientHeight;
  }
  attachEvents() {
    const wheelEvents = this.attachWheelEventHandler();
    this.cleanupEvents = [wheelEvents];
  }
  detachEvents() {
    this.cleanupEvents.forEach((removeEvent) => {
      removeEvent();
    });
    this.cleanupEvents = [];
  }
  // Clear ongoing animations
  clearAnimations(...directions: ("vertical" | "horizontal")[]) {
    for (const direction of directions) {
      if (direction === "vertical") {
        if (this.verticalScrollAnimationId) {
          cancelAnimationFrame(this.verticalScrollAnimationId);
          this.verticalScrollAnimationId = null;
        }
      }

      if (direction === "horizontal") {
        if (this.horizontalScrollAnimationId) {
          cancelAnimationFrame(this.horizontalScrollAnimationId);
          this.horizontalScrollAnimationId = null;
        }
      }
    }
  }
  // Set the vertical scroll position
  public setScrollTop = (
    scrollTop: number,
    callback?: (scrollTop: number) => void
  ) => {
    scrollTop = clampValue(scrollTop, this.maxScrollHeight);

    this.scrollTop = scrollTop;
    this.element.scrollTop = scrollTop;

    callback?.(scrollTop);
  };
  // Set the horizontal scroll position
  public setScrollLeft = (
    scrollLeft: number,
    callback?: (scrollLeft: number) => void
  ) => {
    scrollLeft = clampValue(scrollLeft, this.maxScrollWidth);

    this.scrollLeft = scrollLeft;
    this.element.scrollLeft = scrollLeft;

    callback?.(scrollLeft);
  };
  // Handle vertical scroll offset
  handleVerticalScroll = (offset: number) => {
    this.onVerticalScroll(offset);
  };
  // Handle horizontal scroll offset
  handleHorizontalScroll = (offset: number) => {
    this.onHorizontalScroll(offset);
  };
  // Utility function to limit scroll delta for better IE11 compatibility
  limitScrollDelta(delta: number, maxScroll = 34) {
    return clampValue(delta, maxScroll, -maxScroll);
  }
  // Attach the wheel event handler
  attachWheelEventHandler() {
    const inertia = 0.2; // Inertia for smooth scrolling
    const velocity = { x: 0, y: 0 };

    const handleScroll = (axis: "x" | "y") => {
      const distance = axis === "y" ? this.scrollTop : this.scrollLeft;
      const setScrollPosition =
        axis === "y" ? this.setScrollTop : this.setScrollLeft;
      const handleScrollOffset =
        axis === "y" ? this.handleVerticalScroll : this.handleHorizontalScroll;

      const setAnimationId = (value: number) => {
        if (axis === "y") {
          this.verticalScrollAnimationId = value;
        } else {
          this.horizontalScrollAnimationId = value;
        }
      };

      // If velocity is greater than a threshold, continue the scroll animation
      if (Math.abs(velocity[axis]) > 0.1) {
        setScrollPosition(distance + velocity[axis], handleScrollOffset);
        velocity[axis] *= inertia;
        setAnimationId(
          requestAnimationFrame(() => {
            handleScroll(axis);
          })
        );
      } else {
        velocity[axis] = 0; // Stop the scroll animation
      }
    };

    // Wheel event handler
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let deltaY = e.deltaY;
      let deltaX = e.deltaX;

      // Control the maximum scroll amount per scroll event for better IE11 compatibility
      deltaY = this.limitScrollDelta(e.deltaY); // IE11 scrolls too much, limit max scroll value
      deltaX = this.limitScrollDelta(e.deltaX); // Same for horizontal scroll

      velocity.y += deltaY || 0;
      velocity.x += deltaX || 0;
      if (velocity.y !== 0) {
        this.clearAnimations("vertical");
        handleScroll("y");
      }
      if (velocity.x !== 0) {
        this.clearAnimations("horizontal");
        handleScroll("x");
      }
    };

    this.element.addEventListener("wheel", onWheel);
    return () => {
      this.element.removeEventListener("wheel", onWheel);
    };
  }
}
