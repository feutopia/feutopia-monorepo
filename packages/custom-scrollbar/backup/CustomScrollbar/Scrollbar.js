import {
  createElement,
  isIE9,
  appendChildren,
  applyStyles,
  clampValue,
} from "../utils";

// Scrollbar class
export function Scrollbar(options) {
  this.parentElement = options.parentElement;
  this.className = options.className || "";
  this.isVertical = options.direction === "vertical";
  this.onScroll = options.onScroll;

  this.initVars();
  this.createElements();
  this.mount();
}

Scrollbar.prototype = {
  // Initialize internal state variables
  initVars: function () {
    this.isDragging = false; // Whether the scrollbar is being dragged
    this.scrollOffset = 0; // Current scroll position
    this.maxScrollDistance = 0; // Maximum scrollable distance
    this.scrollInterval = null; // Timer ID for interval-based scrolling
    this.eventCleanup = []; // Array to store event removal callbacks
  },
  // 创建元素
  createElements: function () {
    this.element = createElement("div", this.className);
    this.trackElement = createElement("div", "fe-scrolltrack");
    this.scrollbarElement = createElement("div", "fe-scrollbar");
    this.prevArrow = createElement("div", "fe-scroll-arrow fe-arrow-prev");
    this.nextArrow = createElement("div", "fe-scroll-arrow fe-arrow-next");

    this.trackElement.appendChild(this.scrollbarElement);
    appendChildren(
      [this.trackElement, this.prevArrow, this.nextArrow],
      this.element
    );
  },
  // Mount
  mount: function () {
    this.parentElement.appendChild(this.element);
    this.attachEvents();
  },
  // Unmount
  unmount: function () {
    this.clearScrollTimer();
    this.detachEvents();
    this.parentElement.removeChild(this.element);
  },
  // Attach events
  attachEvents: function () {
    var cleanupDragEvents = this.attachDragEvents();
    var cleanupArrowEvents = this.attachArrowEvents();
    this.eventCleanup = [cleanupDragEvents, cleanupArrowEvents];
  },
  // Detach events
  detachEvents: function () {
    this.eventCleanup.forEach(function (removeEvent) {
      removeEvent();
    });
    this.eventCleanup = [];
  },
  // Update the scrollbar size based on scroll ratio
  updateSize: function (scrollRatio) {
    var size = this.calculateSize(scrollRatio);
    this.maxScrollDistance = size.trackSize - size.barSize;

    var barStyle = {};
    var barDimension = this.isVertical ? "height" : "width";
    barStyle[barDimension] = size.barSize + "px";
    applyStyles(this.scrollbarElement, barStyle);
  },
  // Calculate track and scrollbar sizes based on the scroll ratio
  calculateSize: function (scrollRatio) {
    var trackStyle = window.getComputedStyle(this.trackElement);
    var padding =
      parseFloat(trackStyle.paddingTop || 0) +
      parseFloat(trackStyle.paddingBottom || 0);
    var trackSizeKey = this.isVertical ? "clientHeight" : "clientWidth";
    var trackSize = this.trackElement[trackSizeKey] - padding;
    var barSize = trackSize * scrollRatio;
    return { trackSize: trackSize, barSize: barSize };
  },
  // Set the scrollbar's offset (position) and call the onScroll callback
  setScrollbarOffset: function (offset, callback) {
    offset = clampValue(offset, this.maxScrollDistance);
    this.scrollOffset = offset;

    // For IE9, use marginTop or marginLeft, otherwise use transform
    if (isIE9) {
      // Use marginTop (or marginLeft) for vertical/horizontal scroll
      var marginKey = this.isVertical ? "marginTop" : "marginLeft";
      var styles = {};
      styles[marginKey] = offset + "px";
      applyStyles(this.scrollbarElement, styles);
    } else {
      // Use transform for modern browsers
      var translateKey = this.isVertical ? "translateY" : "translateX";
      var transformValue = translateKey + "(" + offset + "px)";
      applyStyles(this.scrollbarElement, {
        transform: transformValue,
      });
    }

    if (callback) {
      callback(offset);
    }
  },
  // Clear any ongoing scroll timer
  clearScrollTimer: function () {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  },
  // Toggle dragging state (add/remove "dragging" class)
  toggleDraggingState: function (isDragging) {
    var action = isDragging ? "add" : "remove";
    // IE11 doesn't support classList add/remove
    if (this.scrollbarElement.classList) {
      this.scrollbarElement.classList[action]("dragging");
    }
  },
  // Handle scroll event callback
  onScrollEvent: function (offset) {
    this.onScroll(offset);
  },
  // Attach events for dragging the scrollbar
  attachDragEvents: function () {
    var startPagePosition, startScrollOffset;

    var onMouseMove = function (e) {
      e.preventDefault();
      if (!this.isDragging) return;
      var delta = this.isVertical
        ? e.pageY - startPagePosition
        : e.pageX - startPagePosition;
      var newOffset = startScrollOffset + delta;
      this.setScrollbarOffset(newOffset, this.onScroll.bind(this));
    }.bind(this);

    var onMouseUp = function (e) {
      e.preventDefault();
      this.isDragging = false;
      this.toggleDraggingState(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }.bind(this);

    var onMouseDown = function (e) {
      e.preventDefault();
      this.isDragging = true;
      startPagePosition = this.isVertical ? e.pageY : e.pageX;
      startScrollOffset = this.scrollOffset;
      this.toggleDraggingState(true);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseUp);
    }.bind(this);

    this.scrollbarElement.addEventListener("mousedown", onMouseDown);
    return function () {
      this.scrollbarElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
    }.bind(this);
  },
  // Attach events for the arrows
  attachArrowEvents: function () {
    var inertia = 0.9; // Inertia factor for smooth scrolling
    var scrollSpeed = 10; // Scroll speed
    var initialVelocity = 4; // Initial velocity for smooth scroll

    var smoothScroll = function (direction) {
      var velocity = initialVelocity;
      var step = function () {
        if (Math.abs(velocity) > 0.1) {
          velocity *= inertia;
          this.toggleDraggingState(true);
          this.setScrollbarOffset(
            this.scrollOffset + direction * velocity,
            this.onScrollEvent.bind(this)
          );
          requestAnimationFrame(step);
        } else {
          this.toggleDraggingState(false);
        }
      }.bind(this);
      step();
    }.bind(this);

    var startScrolling = function (direction) {
      if (this.scrollInterval) return;
      this.scrollInterval = setInterval(
        function () {
          this.toggleDraggingState(true);
          this.setScrollbarOffset(
            this.scrollOffset + direction * scrollSpeed,
            this.onScrollEvent.bind(this)
          );
        }.bind(this),
        50
      );
    }.bind(this);

    // Stop scrolling
    var stopScrolling = function () {
      this.clearScrollTimer();
      this.toggleDraggingState(false);
    }.bind(this);

    var handleMouseDown = function (direction) {
      startScrolling(direction);
    };

    var handleMouseUp = function (direction) {
      stopScrolling();
      smoothScroll(direction);
    };

    var onArrowPrevMouseDown = function (e) {
      e.preventDefault();
      handleMouseDown(-1);
    };
    var onArrowPrevMouseUp = function (e) {
      e.preventDefault();
      handleMouseUp(-1);
    };
    var onArrowNextMouseDown = function (e) {
      e.preventDefault();
      handleMouseDown(1);
    };
    var onArrowNextMouseUp = function (e) {
      e.preventDefault();
      handleMouseUp(1);
    };
    this.prevArrow.addEventListener("mousedown", onArrowPrevMouseDown);
    this.prevArrow.addEventListener("mouseup", onArrowPrevMouseUp);
    this.nextArrow.addEventListener("mousedown", onArrowNextMouseDown);
    this.nextArrow.addEventListener("mouseup", onArrowNextMouseUp);
    return function () {
      this.prevArrow.removeEventListener("mousedown", onArrowPrevMouseDown);
      this.prevArrow.removeEventListener("mouseup", onArrowPrevMouseUp);
      this.nextArrow.removeEventListener("mousedown", onArrowNextMouseDown);
      this.nextArrow.removeEventListener("mouseup", onArrowNextMouseUp);
    }.bind(this);
  },
};
