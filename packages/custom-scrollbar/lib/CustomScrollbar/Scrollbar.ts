import {
  createElement,
  isIE9,
  appendChildren,
  applyStyles,
  clampValue,
  requestAnimationFrame,
  cancelAnimationFrame,
} from "../utils";

type Options = {
  parentElement: HTMLElement;
  className: string;
  direction: "vertical" | "horizontal";
  onScroll: (scrollValue: number) => void;
};

export class Scrollbar {
  private parentElement: Options["parentElement"];
  private className: Options["className"];
  private isVertical: boolean;
  private onScroll: Options["onScroll"];

  // init variables
  private isDragging = false; // Whether the scrollbar is being dragged
  private scrollAnimationId: number | null = null; // Animation frame ID for smooth scrolling
  private scrollOffset = 0; // Current scroll position
  public maxScrollDistance = 0; // Maximum scrollable distance
  private scrollInterval: number | null = null; // Timer ID for interval-based scrolling
  private cleanupEvents: Array<() => void> = []; // Array to store event removal callbacks

  // init elements
  public element: HTMLElement;
  private trackElement: HTMLElement;
  private scrollbarElement: HTMLElement;
  private prevArrow: HTMLElement;
  private nextArrow: HTMLElement;
  constructor(options: Options) {
    this.parentElement = options.parentElement;
    this.className = options.className ?? "";
    this.isVertical = options.direction === "vertical";
    this.onScroll = options.onScroll;

    this.element = createElement("div", this.className);
    this.trackElement = createElement("div", "fe-scrolltrack");
    this.scrollbarElement = createElement("div", "fe-scrollbar");
    this.prevArrow = createElement("div", "fe-scroll-arrow fe-arrow-prev");
    this.nextArrow = createElement("div", "fe-scroll-arrow fe-arrow-next");

    this.appendElements();
    this.mount();
  }
  // Append elements to the parent element
  appendElements() {
    this.trackElement.appendChild(this.scrollbarElement);
    appendChildren(
      [this.trackElement, this.prevArrow, this.nextArrow],
      this.element
    );
  }
  // Mount
  public mount() {
    this.parentElement.appendChild(this.element);
    this.attachEvents();
  }
  // Unmount
  public unmount() {
    this.clearScrollTimer();
    this.detachEvents();
    this.parentElement.removeChild(this.element);
  }
  // Attach events
  attachEvents() {
    const cleanupDragEvents = this.attachDragEvents();
    const cleanupArrowEvents = this.attachArrowEvents();
    this.cleanupEvents = [cleanupDragEvents, cleanupArrowEvents];
  }
  // Detach events
  detachEvents() {
    this.cleanupEvents.forEach((removeEvent) => {
      removeEvent();
    });
    this.cleanupEvents = [];
  }
  // Update the scrollbar size based on scroll ratio
  public updateSize(scrollRatio: number) {
    const size = this.calculateSize(scrollRatio);
    this.maxScrollDistance = size.trackSize - size.barSize;
    applyStyles(this.scrollbarElement, {
      [this.isVertical ? "height" : "width"]: size.barSize + "px",
    });
  }
  // Calculate track and scrollbar sizes based on the scroll ratio
  calculateSize(scrollRatio: number) {
    const trackStyle = window.getComputedStyle(this.trackElement);
    const padding =
      parseFloat(trackStyle.paddingTop) + parseFloat(trackStyle.paddingBottom);
    const trackSizeKey = this.isVertical ? "clientHeight" : "clientWidth";
    const trackSize = this.trackElement[trackSizeKey] - padding;
    return { trackSize, barSize: trackSize * scrollRatio };
  }
  // Set the scrollbar's offset (position) and call the onScroll callback
  public setScrollbarOffset(
    offset: number,
    callback?: (offset: number) => void
  ) {
    offset = clampValue(offset, this.maxScrollDistance);
    this.scrollOffset = offset;

    // For IE9, use marginTop or marginLeft, otherwise use transform
    if (isIE9) {
      // Use marginTop (or marginLeft) for vertical/horizontal scroll
      applyStyles(this.scrollbarElement, {
        [this.isVertical ? "marginTop" : "marginLeft"]: offset + "px",
      });
    } else {
      // Use transform for modern browsers
      const translateKey = this.isVertical ? "translateY" : "translateX";
      applyStyles(this.scrollbarElement, {
        transform: `${translateKey}(${offset}px)`,
      });
    }

    callback?.(offset);
  }
  // Clear any ongoing scroll timer
  clearScrollTimer() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
    if (this.scrollAnimationId) {
      cancelAnimationFrame(this.scrollAnimationId);
      this.scrollAnimationId = null;
    }
  }
  // Toggle dragging state (add/remove "dragging" class)
  toggleDraggingState(isDragging: boolean) {
    const action = isDragging ? "add" : "remove";
    // IE11 doesn't support classList add/remove
    this.scrollbarElement.classList?.[action]("dragging");
  }
  // Handle scroll event callback
  onScrollEvent = (offset: number) => {
    this.onScroll(offset);
  };
  // Attach events for dragging the scrollbar
  attachDragEvents() {
    let startPagePosition: number;
    let startScrollOffset: number;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!this.isDragging) return;
      const delta = this.isVertical
        ? e.pageY - startPagePosition
        : e.pageX - startPagePosition;
      const newOffset = startScrollOffset + delta;
      this.setScrollbarOffset(newOffset, this.onScrollEvent);
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      this.isDragging = false;
      this.toggleDraggingState(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      this.isDragging = true;
      startPagePosition = this.isVertical ? e.pageY : e.pageX;
      startScrollOffset = this.scrollOffset;
      this.toggleDraggingState(true);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseUp);
    };

    this.scrollbarElement.addEventListener("mousedown", onMouseDown);
    return () => {
      this.scrollbarElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
    };
  }
  // Attach events for the arrows
  attachArrowEvents() {
    const inertia = 0.9; // Inertia factor for smooth scrolling
    const scrollSpeed = 10; // Scroll speed
    const initialVelocity = 4; // Initial velocity for smooth scroll

    const smoothScroll = (direction: number) => {
      let velocity = initialVelocity;
      const step = () => {
        if (Math.abs(velocity) > 0.1) {
          velocity *= inertia;
          this.toggleDraggingState(true);
          this.setScrollbarOffset(
            this.scrollOffset + direction * velocity,
            this.onScrollEvent
          );
          this.scrollAnimationId = requestAnimationFrame(step);
        } else {
          this.toggleDraggingState(false);
        }
      };
      step();
    };

    const startScrolling = (direction: number) => {
      if (this.scrollInterval) return;
      this.scrollInterval = setInterval(() => {
        this.toggleDraggingState(true);
        this.setScrollbarOffset(
          this.scrollOffset + direction * scrollSpeed,
          this.onScrollEvent
        );
      }, 50);
    };

    // Stop scrolling
    const stopScrolling = () => {
      this.clearScrollTimer();
      this.toggleDraggingState(false);
    };

    const handleMouseDown = (direction: number) => {
      startScrolling(direction);
    };
    const handleMouseUp = (direction: number) => {
      stopScrolling();
      smoothScroll(direction);
    };

    const onArrowPrevMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseDown(-1);
    };
    const onArrowPrevMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseUp(-1);
    };
    const onArrowNextMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseDown(1);
    };
    const onArrowNextMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      handleMouseUp(1);
    };
    this.prevArrow.addEventListener("mousedown", onArrowPrevMouseDown);
    this.prevArrow.addEventListener("mouseup", onArrowPrevMouseUp);
    this.nextArrow.addEventListener("mousedown", onArrowNextMouseDown);
    this.nextArrow.addEventListener("mouseup", onArrowNextMouseUp);
    return () => {
      this.prevArrow.removeEventListener("mousedown", onArrowPrevMouseDown);
      this.prevArrow.removeEventListener("mouseup", onArrowPrevMouseUp);
      this.nextArrow.removeEventListener("mousedown", onArrowNextMouseDown);
      this.nextArrow.removeEventListener("mouseup", onArrowNextMouseUp);
    };
  }
}
