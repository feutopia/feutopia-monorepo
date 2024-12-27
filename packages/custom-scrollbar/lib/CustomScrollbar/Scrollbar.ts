import { ScrollbarElements, ScrollbarOptions, ScrollbarState } from "../types";
import {
  createElement,
  isIE9,
  appendChildren,
  applyStyles,
  clampValue,
  requestAnimationFrame,
  cancelAnimationFrame,
} from "../utils";

export class Scrollbar {
  private parentElement: ScrollbarOptions["parentElement"];
  private className: ScrollbarOptions["className"];
  private isVertical: boolean;
  private onScroll: ScrollbarOptions["onScroll"];

  private state: ScrollbarState;
  private elements: ScrollbarElements;
  private cleanupEvents: Array<() => void> = [];

  constructor(options: ScrollbarOptions) {
    this.parentElement = options.parentElement;
    this.className = options.className ?? "";
    this.isVertical = options.direction === "vertical";
    this.onScroll = options.onScroll;

    this.state = {
      isDragging: false, // Whether the scrollbar is being dragged
      scrollAnimationId: null, // Animation frame ID for smooth scrolling
      scrollOffset: 0, // Current scroll position
      maxScrollDistance: 0, // Maximum scrollable distance
      scrollInterval: null, // Timer ID for interval-based scrolling
    };

    // init elements
    this.elements = {
      scrollbar: createElement("div", this.className),
      track: createElement("div", "fe-scrollbar-track"),
      thumb: createElement("div", "fe-scrollbar-thumb"),
      buttonPre: createElement(
        "div",
        "fe-scrollbar-button fe-scrollbar-button-prev"
      ),
      buttonNext: createElement(
        "div",
        "fe-scrollbar-button fe-scrollbar-button-next"
      ),
    };

    this.appendElements();
    this.mount();
  }
  // Append elements to the parent element
  private appendElements() {
    this.elements.track.appendChild(this.elements.thumb);
    appendChildren(
      [this.elements.track, this.elements.buttonPre, this.elements.buttonNext],
      this.elements.scrollbar
    );
  }
  // Mount
  private mount() {
    this.parentElement.appendChild(this.elements.scrollbar);
    this.attachEvents();
  }
  // Unmount
  public unmount() {
    this.clearScrollTimer();
    this.detachEvents();
    this.parentElement.removeChild(this.elements.scrollbar);
  }
  public get maxScrollDistance() {
    return this.state.maxScrollDistance;
  }
  public get scrollbarElement() {
    return this.elements.scrollbar;
  }
  // Attach events
  private attachEvents() {
    const cleanupDragEvents = this.attachDragEvents();
    const cleanupArrowEvents = this.attachArrowEvents();
    this.cleanupEvents = [cleanupDragEvents, cleanupArrowEvents];
  }
  // Detach events
  private detachEvents() {
    this.cleanupEvents.forEach((removeEvent) => {
      removeEvent();
    });
    this.cleanupEvents = [];
  }
  // Update the scrollbar thumb size based on scroll ratio
  public updateThumbSize(scrollRatio: number) {
    const { trackSize, thumbSize } = this.calculateSize(scrollRatio);
    this.state.maxScrollDistance = trackSize - thumbSize;
    applyStyles(this.elements.thumb, {
      [this.isVertical ? "height" : "width"]: `${thumbSize}px`,
    });
  }
  // Calculate track and scrollbar sizes based on the scroll ratio
  private calculateSize(scrollRatio: number) {
    const trackStyle = window.getComputedStyle(this.elements.track);
    const padding =
      parseFloat(trackStyle.paddingTop) + parseFloat(trackStyle.paddingBottom);
    const trackSizeKey = this.isVertical ? "clientHeight" : "clientWidth";
    const trackSize = this.elements.track[trackSizeKey] - padding;
    return { trackSize, thumbSize: trackSize * scrollRatio };
  }
  // Set the scrollbar's offset (position) and call the onScroll callback
  public setScrollbarOffset(
    offset: number,
    callback?: (offset: number) => void
  ) {
    offset = clampValue(offset, this.state.maxScrollDistance);
    this.state.scrollOffset = offset;

    // For IE9, use marginTop or marginLeft, otherwise use transform
    if (isIE9) {
      // Use marginTop (or marginLeft) for vertical/horizontal scroll
      applyStyles(this.elements.thumb, {
        [this.isVertical ? "marginTop" : "marginLeft"]: `${offset}px`,
      });
    } else {
      // Use transform for modern browsers
      const translateKey = this.isVertical ? "translateY" : "translateX";
      applyStyles(this.elements.thumb, {
        transform: `${translateKey}(${offset}px)`,
      });
    }

    callback?.(offset);
  }
  // Clear any ongoing scroll timer
  private clearScrollTimer() {
    if (this.state.scrollInterval) {
      clearInterval(this.state.scrollInterval);
      this.state.scrollInterval = null;
    }
    if (this.state.scrollAnimationId) {
      cancelAnimationFrame(this.state.scrollAnimationId);
      this.state.scrollAnimationId = null;
    }
  }
  // Toggle dragging state (add/remove "dragging" class)
  private toggleDraggingState(isDragging: boolean) {
    const action = isDragging ? "add" : "remove";
    // IE11 doesn't support classList add/remove
    this.elements.thumb.classList?.[action]("dragging");
  }
  // Handle scroll event callback
  private onScrollEvent = (offset: number) => {
    this.onScroll(offset);
  };
  // Attach events for dragging the scrollbar
  private attachDragEvents() {
    let startPagePosition: number;
    let startScrollOffset: number;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!this.state.isDragging) return;
      const delta = this.isVertical
        ? e.pageY - startPagePosition
        : e.pageX - startPagePosition;
      const newOffset = startScrollOffset + delta;
      this.setScrollbarOffset(newOffset, this.onScrollEvent);
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      this.state.isDragging = false;
      this.toggleDraggingState(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      this.state.isDragging = true;
      startPagePosition = this.isVertical ? e.pageY : e.pageX;
      startScrollOffset = this.state.scrollOffset;
      this.toggleDraggingState(true);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseUp);
    };

    this.elements.thumb.addEventListener("mousedown", onMouseDown);
    return () => {
      this.elements.thumb.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
    };
  }
  // Attach events for the arrows
  private attachArrowEvents() {
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
            this.state.scrollOffset + direction * velocity,
            this.onScrollEvent
          );
          this.state.scrollAnimationId = requestAnimationFrame(step);
        } else {
          this.toggleDraggingState(false);
        }
      };
      step();
    };

    const startScrolling = (direction: number) => {
      if (this.state.scrollInterval) return;
      this.state.scrollInterval = setInterval(() => {
        this.toggleDraggingState(true);
        this.setScrollbarOffset(
          this.state.scrollOffset + direction * scrollSpeed,
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
    this.elements.buttonPre.addEventListener("mousedown", onArrowPrevMouseDown);
    this.elements.buttonPre.addEventListener("mouseup", onArrowPrevMouseUp);
    this.elements.buttonNext.addEventListener(
      "mousedown",
      onArrowNextMouseDown
    );
    this.elements.buttonNext.addEventListener("mouseup", onArrowNextMouseUp);
    return () => {
      this.elements.buttonPre.removeEventListener(
        "mousedown",
        onArrowPrevMouseDown
      );
      this.elements.buttonPre.removeEventListener(
        "mouseup",
        onArrowPrevMouseUp
      );
      this.elements.buttonNext.removeEventListener(
        "mousedown",
        onArrowNextMouseDown
      );
      this.elements.buttonNext.removeEventListener(
        "mouseup",
        onArrowNextMouseUp
      );
    };
  }
}
