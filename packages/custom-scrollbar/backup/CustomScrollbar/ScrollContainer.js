import {
  createElement,
  applyStyles,
  clampValue,
  requestAnimationFrame,
  cancelAnimationFrame,
} from "../utils";

// ScrollContainer class
export function ScrollContainer(options) {
  this.observerContainer = options.observerContainer;
  this.parentElement = options.parentElement;
  this.onVerticalScroll = options.onVerticalScroll; // Vertical scroll event callback
  this.onHorizontalScroll = options.onHorizontalScroll; // Horizontal scroll event callback

  this.initVars();
  this.createElements();
  this.mount();
}
ScrollContainer.prototype = {
  // Initialize internal variables
  initVars: function () {
    this.scrollTop = 0; // Scroll top position
    this.scrollLeft = 0; // Scroll left position
    this.clientWidth = 0; // Container width
    this.clientHeight = 0; // Container height
    this.scrollWidth = 0; // Scrollable width of the container
    this.scrollHeight = 0; // Scrollable height of the container
    this.maxScrollWidth = 0; // Maximum horizontal scroll distance
    this.maxScrollHeight = 0; // Maximum vertical scroll distance
    this.eventCleanup = []; // Event handlers to be cleaned up
    this.verticalScrollAnimationId = null; // Vertical scroll animation ID
    this.horizontalScrollAnimationId = null; // Horizontal scroll animation ID
  },
  createElements: function () {
    this.element = createElement("div", "fe-scroll-container"); // Scroll container element
    applyStyles(this.element, {
      overflow: "hidden",
      height: "100%",
    });
  },
  // Mount
  mount: function () {
    this.parentElement.appendChild(this.element);
    this.element.appendChild(this.observerContainer);
    this.updateSize();
    this.attachEvents();

    // Reset scroll position to 0
    requestAnimationFrame(
      function () {
        this.setScrollLeft(0);
        this.setScrollTop(0);
      }.bind(this)
    );
  },
  // Unmount
  unmount: function () {
    this.clearAnimations(["vertical", "horizontal"]);
    this.detachEvents();
    this.element.removeChild(this.observerContainer);
    this.parentElement.removeChild(this.element);
  },
  // Update the scroll container's size and scroll positions
  updateSize: function () {
    this.scrollTop = this.element.scrollTop;
    this.scrollLeft = this.element.scrollLeft;
    this.clientWidth = this.element.clientWidth;
    this.clientHeight = this.element.clientHeight;
    this.scrollWidth = this.element.scrollWidth;
    this.scrollHeight = this.element.scrollHeight;
    this.maxScrollWidth = this.scrollWidth - this.clientWidth;
    this.maxScrollHeight = this.scrollHeight - this.clientHeight;
  },
  attachEvents: function () {
    var wheelEvents = this.attachWheelEventHandler();
    this.eventCleanup = [wheelEvents];
  },
  detachEvents: function () {
    this.eventCleanup.forEach(function (removeEvent) {
      removeEvent();
    });
    this.eventCleanup = [];
  },
  // Clear ongoing animations
  clearAnimations: function (directions) {
    if (!Array.isArray(directions)) {
      directions = [directions];
    }
    for (var i = 0; i < directions.length; i++) {
      var animationId =
        directions[i] === "vertical"
          ? "verticalScrollAnimationId"
          : "horizontalScrollAnimationId";
      cancelAnimationFrame(this[animationId]);
      this[animationId] = null;
    }
  },
  // Set the vertical scroll position
  setScrollTop: function (scrollTop, callback) {
    var scrollTop = clampValue(scrollTop, this.maxScrollHeight);

    this.scrollTop = scrollTop;
    this.element.scrollTop = scrollTop;

    if (callback) {
      callback(scrollTop);
    }
  },
  // Set the horizontal scroll position
  setScrollLeft: function (scrollLeft, callback) {
    var scrollLeft = clampValue(scrollLeft, this.maxScrollWidth);

    this.scrollLeft = scrollLeft;
    this.element.scrollLeft = scrollLeft;

    if (callback) {
      callback(scrollLeft);
    }
  },
  // Handle vertical scroll offset
  handleVerticalScroll: function (offset) {
    this.onVerticalScroll(offset);
  },
  // Handle horizontal scroll offset
  handleHorizontalScroll: function (offset) {
    this.onHorizontalScroll(offset);
  },
  // Utility function to limit scroll delta for better IE11 compatibility
  limitScrollDelta: function (delta, maxScroll) {
    maxScroll = maxScroll || 34;
    return Math.max(Math.min(delta, maxScroll), -maxScroll);
  },
  // Attach the wheel event handler
  attachWheelEventHandler: function () {
    var inertia = 0.2; // Inertia for smooth scrolling
    var velocity = { x: 0, y: 0 };

    var handleScroll = function (axis) {
      var animationId =
        axis === "y"
          ? "verticalScrollAnimationId"
          : "horizontalScrollAnimationId";
      var distance = axis === "y" ? "scrollTop" : "scrollLeft";
      var setScrollPosition =
        axis === "y"
          ? this.setScrollTop.bind(this)
          : this.setScrollLeft.bind(this);
      var handleScrollOffset =
        axis === "y"
          ? this.handleVerticalScroll.bind(this)
          : this.handleHorizontalScroll.bind(this);

      // If velocity is greater than a threshold, continue the scroll animation
      if (Math.abs(velocity[axis]) > 0.1) {
        setScrollPosition(this[distance] + velocity[axis], handleScrollOffset);
        velocity[axis] *= inertia;
        this[animationId] = requestAnimationFrame(function () {
          handleScroll(axis);
        });
      } else {
        velocity[axis] = 0; // Stop the scroll animation
      }
    }.bind(this);

    // Wheel event handler
    var onWheel = function (e) {
      e.preventDefault();
      var deltaY = e.deltaY;
      var deltaX = e.deltaX;

      // Control the maximum scroll amount per scroll event for better IE11 compatibility
      var deltaY = this.limitScrollDelta(e.deltaY); // IE11 scrolls too much, limit max scroll value
      var deltaX = this.limitScrollDelta(e.deltaX); // Same for horizontal scroll

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
    }.bind(this);

    this.element.addEventListener("wheel", onWheel);
    return function cleanup() {
      this.element.removeEventListener("wheel", onWheel);
    }.bind(this);
  },
};

Object.defineProperties(ScrollContainer.prototype, {
  // Vertical scroll ratio (visible area / total scrollable area)
  verticalScrollRatio: {
    get: function () {
      return this.clientHeight / this.scrollHeight;
    },
  },
  // Horizontal scroll ratio (visible area / total scrollable area)
  horizontalScrollRatio: {
    get: function () {
      return this.clientWidth / this.scrollWidth;
    },
  },
});
