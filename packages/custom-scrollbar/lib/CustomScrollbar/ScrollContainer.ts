import { ScrollContainerOptions, ScrollContainerState } from "../types";
import {
  createElement,
  applyStyles,
  clampValue,
  requestAnimationFrame,
  cancelAnimationFrame,
} from "../utils";

// ScrollContainer class
export class ScrollContainer {
  private observerContainer: ScrollContainerOptions["observerContainer"];
  private parentElement: ScrollContainerOptions["parentElement"];
  private onVerticalScroll: ScrollContainerOptions["onVerticalScroll"];
  private onHorizontalScroll: ScrollContainerOptions["onHorizontalScroll"];

  private state: ScrollContainerState;
  private scrollContainerElement: HTMLElement;
  private cleanupEvents: Array<() => void> = [];

  constructor(options: ScrollContainerOptions) {
    this.observerContainer = options.observerContainer;
    this.parentElement = options.parentElement;
    this.onVerticalScroll = options.onVerticalScroll; // Vertical scroll event callback
    this.onHorizontalScroll = options.onHorizontalScroll; // Horizontal scroll event callback

    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
      clientWidth: 0,
      clientHeight: 0,
      scrollWidth: 0,
      scrollHeight: 0,
      verticalScrollAnimationId: null,
      horizontalScrollAnimationId: null,
    };
    this.scrollContainerElement = createElement("div", "fe-scroll-container"); // Scroll container element
    this.applyStyles();
    this.mount();
  }
  private applyStyles() {
    applyStyles(this.scrollContainerElement, {
      overflow: "hidden",
      height: "100%",
    });
  }
  // Mount
  private mount() {
    this.parentElement.appendChild(this.scrollContainerElement);
    this.scrollContainerElement.appendChild(this.observerContainer);
    this.updateSize();
    this.attachEvents();
  }
  // Unmount
  public unmount() {
    this.clearAnimations("vertical", "horizontal");
    this.detachEvents();
    this.scrollContainerElement.removeChild(this.observerContainer);
    this.parentElement.removeChild(this.scrollContainerElement);
  }
  public get scrollTop() {
    return this.state.scrollTop;
  }
  public get scrollLeft() {
    return this.state.scrollLeft;
  }
  public get maxScrollWidth() {
    return this.state.scrollWidth - this.state.clientWidth;
  }
  public get maxScrollHeight() {
    return this.state.scrollHeight - this.state.clientHeight;
  }
  // Vertical scroll ratio (visible area / total scrollable area)
  public get verticalScrollRatio() {
    return this.state.clientHeight / this.state.scrollHeight;
  }
  // Horizontal scroll ratio (visible area / total scrollable area)
  public get horizontalScrollRatio() {
    return this.state.clientWidth / this.state.scrollWidth;
  }
  // Update the scroll container's size and scroll positions
  public updateSize() {
    const scrollMetrics = [
      "scrollTop",
      "scrollLeft",
      "clientWidth",
      "clientHeight",
      "scrollWidth",
      "scrollHeight",
    ] as const;
    for (const key of scrollMetrics) {
      this.state[key as keyof ScrollContainerState] =
        this.scrollContainerElement[key];
    }
  }
  private attachEvents() {
    const cleanupWheelEvent = this.attachWheelEvent();
    const cleanupBeforeunloadEvent = this.attachBeforeunloadEvent();
    this.cleanupEvents = [cleanupWheelEvent, cleanupBeforeunloadEvent];
  }
  private detachEvents() {
    this.cleanupEvents.forEach((removeEvent) => {
      removeEvent();
    });
    this.cleanupEvents = [];
  }
  // Clear ongoing animations
  private clearAnimations(...directions: ("vertical" | "horizontal")[]) {
    for (const direction of directions) {
      if (direction === "vertical") {
        if (this.state.verticalScrollAnimationId) {
          cancelAnimationFrame(this.state.verticalScrollAnimationId);
          this.state.verticalScrollAnimationId = null;
        }
      }

      if (direction === "horizontal") {
        if (this.state.horizontalScrollAnimationId) {
          cancelAnimationFrame(this.state.horizontalScrollAnimationId);
          this.state.horizontalScrollAnimationId = null;
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

    this.state.scrollTop = scrollTop;
    this.scrollContainerElement.scrollTop = scrollTop;

    callback?.(scrollTop);
  };
  // Set the horizontal scroll position
  public setScrollLeft = (
    scrollLeft: number,
    callback?: (scrollLeft: number) => void
  ) => {
    scrollLeft = clampValue(scrollLeft, this.maxScrollWidth);

    this.state.scrollLeft = scrollLeft;
    this.scrollContainerElement.scrollLeft = scrollLeft;

    callback?.(scrollLeft);
  };
  // Handle vertical scroll offset
  private handleVerticalScroll = (offset: number) => {
    this.onVerticalScroll(offset);
  };
  // Handle horizontal scroll offset
  private handleHorizontalScroll = (offset: number) => {
    this.onHorizontalScroll(offset);
  };
  // Utility function to limit scroll delta for better IE11 compatibility
  private limitScrollDelta(delta: number, maxScroll = 34) {
    return clampValue(delta, maxScroll, -maxScroll);
  }
  // Attach the beforeunload event handler
  private attachBeforeunloadEvent() {
    // IE11 reset scroll position on beforeunload
    const onBeforeunload = () => {
      this.setScrollTop(0);
      this.setScrollLeft(0);
    };
    window.addEventListener("beforeunload", onBeforeunload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeunload);
    };
  }
  // Attach the wheel event handler
  private attachWheelEvent() {
    const inertia = 0.2; // Inertia for smooth scrolling
    const velocity = { x: 0, y: 0 };

    const handleScroll = (axis: "x" | "y") => {
      const distance =
        axis === "y" ? this.state.scrollTop : this.state.scrollLeft;
      const setScrollPosition =
        axis === "y" ? this.setScrollTop : this.setScrollLeft;
      const handleScrollOffset =
        axis === "y" ? this.handleVerticalScroll : this.handleHorizontalScroll;

      const setAnimationId = (value: number) => {
        if (axis === "y") {
          this.state.verticalScrollAnimationId = value;
        } else {
          this.state.horizontalScrollAnimationId = value;
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

    this.scrollContainerElement.addEventListener("wheel", onWheel);
    return () => {
      this.scrollContainerElement.removeEventListener("wheel", onWheel);
    };
  }
}
