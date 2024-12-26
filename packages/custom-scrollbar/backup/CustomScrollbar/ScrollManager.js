import { ScrollContainer } from "./ScrollContainer";
import { Scrollbar } from "./Scrollbar";
import { applyStyles } from "../utils";

// ScrollManager class
export function ScrollManager(options) {
  this.parentElement = options.parentElement;
  this.observerContainer = options.observerContainer;
  this.hasVerticalScrollbar = options.hasVerticalScrollbar;
  this.hasHorizontalScrollbar = options.hasHorizontalScrollbar;

  this.initVars();
  this.mount();
}

ScrollManager.prototype = {
  initVars: function () {
    this.verticalScrollbar = null;
    this.horizontalScrollbar = null;
    this.scrollContainer = null;
  },
  // Mount
  mount: function () {
    // Step 1: Create scrollbars
    this.createScrollbars();

    // Step 2: Update parent element styles based on scrollbar presence
    this.updateParentStyles();

    // Step 3: Create the scrollContainer
    this.scrollContainer = this.createScrollContainer();

    // Step 4: Update scrollbars size
    this.updateScrollbarSizes();
  },
  // Unmount
  unmount: function () {
    if (this.verticalScrollbar) {
      this.verticalScrollbar.unmount();
      this.verticalScrollbar = null;
    }
    if (this.horizontalScrollbar) {
      this.horizontalScrollbar.unmount();
      this.horizontalScrollbar = null;
    }
    if (this.scrollContainer) {
      this.scrollContainer.unmount();
      this.scrollContainer = null;
    }
  },
  // Create scrollbars if necessary
  createScrollbars: function () {
    if (this.hasVerticalScrollbar) {
      this.verticalScrollbar = this.createVerticalScrollbar();
    }
    if (this.hasHorizontalScrollbar) {
      this.horizontalScrollbar = this.createHorizontalScrollbar();
    }
  },
  // Update parent element styles (padding) based on scrollbar sizes
  updateParentStyles: function () {
    var scrollbarSize = this.getScrollbarSize();
    applyStyles(this.parentElement, {
      paddingRight: scrollbarSize.width + "px",
      paddingBottom: scrollbarSize.height + "px",
    });
  },
  // Synchronize the scrollbars and parent element styles
  sync: function (hasVerticalScrollbar, hasHorizontalScrollbar) {
    this.hasVerticalScrollbar = hasVerticalScrollbar;
    this.hasHorizontalScrollbar = hasHorizontalScrollbar;

    // Step 1: Synchronize scrollbar instances
    this.syncScrollbars();

    // Step 2: Update parent element styles based on scrollbar presence
    this.updateParentStyles();

    // Step 3: Update scroll container size
    this.scrollContainer.updateSize();

    // Step 4: Update scrollbars size
    this.updateScrollbarSizes();

    // Step 5: Update scrollbars offset
    this.updateScrollbarOffsets();
  },
  // Get the current size of the scrollbars (width and height)
  getScrollbarSize: function () {
    var width = this.verticalScrollbar
      ? this.verticalScrollbar.element.clientWidth
      : 0;
    var height = this.horizontalScrollbar
      ? this.horizontalScrollbar.element.clientHeight
      : 0;
    return {
      width: width,
      height: height,
    };
  },
  // Synchronize scrollbar instances (create or remove them)
  syncScrollbars: function () {
    if (this.hasVerticalScrollbar) {
      if (!this.verticalScrollbar) {
        this.verticalScrollbar = this.createVerticalScrollbar();
      }
    } else {
      if (this.verticalScrollbar) {
        this.verticalScrollbar.unmount();
        this.verticalScrollbar = null;
      }
    }

    if (this.hasHorizontalScrollbar) {
      if (!this.horizontalScrollbar) {
        this.horizontalScrollbar = this.createHorizontalScrollbar();
      }
    } else {
      if (this.horizontalScrollbar) {
        this.horizontalScrollbar.unmount();
        this.horizontalScrollbar = null;
      }
    }
  },
  // Update the sizes of the scrollbars based on the scroll container
  updateScrollbarSizes: function () {
    var scrollRatios = this.getScrollContainerRatios();

    if (this.verticalScrollbar) {
      this.verticalScrollbar.updateSize(scrollRatios.vertical);
    }
    if (this.horizontalScrollbar) {
      this.horizontalScrollbar.updateSize(scrollRatios.horizontal);
    }
  },
  // Update the offsets of the scrollbars based on the scroll container's scroll position
  updateScrollbarOffsets: function () {
    if (this.verticalScrollbar) {
      var offset = this.convertToVerticalScrollbarOffset(
        this.scrollContainer.scrollTop
      );
      this.verticalScrollbar.setScrollbarOffset(offset);
    }
    if (this.horizontalScrollbar) {
      var offset = this.convertToHorizontalScrollbarOffset(
        this.scrollContainer.scrollLeft
      );
      this.horizontalScrollbar.setScrollbarOffset(offset);
    }
  },
  // Get the scroll container's ratio for vertical and horizontal scrolling
  getScrollContainerRatios: function () {
    return {
      vertical: this.scrollContainer.verticalScrollRatio,
      horizontal: this.scrollContainer.horizontalScrollRatio,
    };
  },
  // Convert scroll container's scroll top value to the corresponding vertical scrollbar offset
  convertToVerticalScrollbarOffset: function (top) {
    return (
      (top / this.scrollContainer.maxScrollHeight) *
      this.verticalScrollbar.maxScrollDistance
    );
  },
  // Convert scroll container's scroll left value to the corresponding horizontal scrollbar offset
  convertToHorizontalScrollbarOffset: function (left) {
    return (
      (left / this.scrollContainer.maxScrollWidth) *
      this.horizontalScrollbar.maxScrollDistance
    );
  },
  // Convert a vertical scrollbar offset to the corresponding scroll container's scroll top
  convertToScrollContainerTop: function (offset) {
    return (
      (offset / this.verticalScrollbar.maxScrollDistance) *
      this.scrollContainer.maxScrollHeight
    );
  },
  // Convert a horizontal scrollbar offset to the corresponding scroll container's scroll left
  convertToScrollContainerLeft: function (offset) {
    return (
      (offset / this.horizontalScrollbar.maxScrollDistance) *
      this.scrollContainer.maxScrollWidth
    );
  },
  // Create the scroll container that handles the actual scrolling logic
  createScrollContainer: function () {
    return new ScrollContainer({
      parentElement: this.parentElement,
      observerContainer: this.observerContainer,

      // Vertical scroll callback
      onVerticalScroll: function (top) {
        if (this.verticalScrollbar) {
          this.verticalScrollbar.setScrollbarOffset(
            this.convertToVerticalScrollbarOffset(top)
          );
        }
      }.bind(this),

      // Horizontal scroll callback
      onHorizontalScroll: function (left) {
        if (this.horizontalScrollbar) {
          this.horizontalScrollbar.setScrollbarOffset(
            this.convertToHorizontalScrollbarOffset(left)
          );
        }
      }.bind(this),
    });
  },
  // Create vertical scrollbar
  createVerticalScrollbar: function () {
    return new Scrollbar({
      parentElement: this.parentElement,
      className: "fe-vertical-scrollbar",
      direction: "vertical",
      onScroll: function (offset) {
        if (this.scrollContainer) {
          this.scrollContainer.setScrollTop(
            this.convertToScrollContainerTop(offset)
          );
        }
      }.bind(this),
    });
  },
  // Create horizontal scrollbar
  createHorizontalScrollbar: function () {
    return new Scrollbar({
      parentElement: this.parentElement,
      className: "fe-horizontal-scrollbar",
      direction: "horizontal",
      onScroll: function (offset) {
        if (this.scrollContainer) {
          this.scrollContainer.setScrollLeft(
            this.convertToScrollContainerLeft(offset)
          );
        }
      }.bind(this),
    });
  },
};
