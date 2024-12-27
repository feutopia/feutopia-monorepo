import {
  createElement,
  applyStyles,
  appendChildren,
  observeElementResize,
  debounce,
} from "../utils";
import { ScrollManager } from "./ScrollManager";

// CustomScrollbar class
export function CustomScrollbar(parentElement) {
  if (!parentElement) return;
  this.parentElement = parentElement;
  this.initVars();
  this.createElements();
  this.mount();
}
CustomScrollbar.prototype = {
  initVars: function () {
    this.scrollbarElement = null;
    this.scrollManager = null;
    this.cleanupEvents = [];
    this.debouncedHandleScrollbarChange = debounce(
      this.handleScrollbarChange.bind(this),
      100
    );
    this.debouncedHandleNoScrollbarChange = debounce(
      this.handleNoScrollbarChange.bind(this),
      100
    );
  },
  createElements: function () {
    this.scrollbarElement = createElement("div", "fe-custom-scrollbar");
    this.observerContainer = createElement("div", "fe-observer-container");
    this.observerContent = createElement("div", "fe-observer-content");

    applyStyles(this.scrollbarElement, {
      height: "100%",
      position: "relative",
    });
    applyStyles(this.observerContainer, {
      height: "100%",
      position: "relative",
    });
    applyStyles(this.observerContent, {
      display: "inline-block",
      position: "relative",
    });
  },
  // Mount
  mount: function () {
    appendChildren(this.parentElement.children, this.observerContent);
    this.observerContainer.appendChild(this.observerContent);
    this.scrollbarElement.appendChild(this.observerContainer);
    this.parentElement.appendChild(this.scrollbarElement);

    var scrollbarStatus = this.detectScrollbars(this.observerContainer);
    var hasVerticalScrollbar = scrollbarStatus.hasVerticalScrollbar;
    var hasHorizontalScrollbar = scrollbarStatus.hasHorizontalScrollbar;

    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
      this.scrollManager = this.createScrollManager({
        hasVerticalScrollbar: hasVerticalScrollbar,
        hasHorizontalScrollbar: hasHorizontalScrollbar,
      });
    }

    this.attachEvents();
  },
  // Unmount
  unmount: function () {
    this.detachEvents();
    if (this.scrollManager) {
      this.scrollManager.unmount();
      this.scrollManager = null;
      this.parentElement.innerHTML = "";
      appendChildren(this.observerContent.children, this.parentElement);
    }
  },
  // Check if the element has vertical or horizontal scrollbars
  detectScrollbars: function (element) {
    var hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
    var hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
    return {
      hasVerticalScrollbar: hasVerticalScrollbar,
      hasHorizontalScrollbar: hasHorizontalScrollbar,
    };
  },
  // Create an instance of the scroll manager
  createScrollManager: function (params) {
    return new ScrollManager({
      parentElement: this.scrollbarElement,
      observerContainer: this.observerContainer,
      hasVerticalScrollbar: params.hasVerticalScrollbar,
      hasHorizontalScrollbar: params.hasHorizontalScrollbar,
    });
  },
  attachEvents: function () {
    var cleanupContainerScroll = this.observeContainerScroll();
    var cleanupContentScroll = this.observeContentScroll();
    this.cleanupEvents = [cleanupContainerScroll, cleanupContentScroll];
  },
  detachEvents: function () {
    this.cleanupEvents.forEach(function (removeEvent) {
      removeEvent();
    });
    this.cleanupEvents = [];
  },
  // Handle scrollbar changes (vertical and horizontal)
  handleScrollbarChange: function (
    hasVerticalScrollbar,
    hasHorizontalScrollbar
  ) {
    if (!this.scrollManager) {
      this.parentElement.appendChild(this.scrollbarElement);
      this.scrollManager = this.createScrollManager({
        hasVerticalScrollbar: hasVerticalScrollbar,
        hasHorizontalScrollbar: hasHorizontalScrollbar,
      });
    } else {
      this.scrollManager.sync(hasVerticalScrollbar, hasHorizontalScrollbar);
    }
  },
  // Handle absence of scrollbars
  handleNoScrollbarChange: function () {
    if (this.scrollManager) {
      this.scrollManager.unmount();
      this.scrollManager = null;
      this.parentElement.removeChild(this.scrollbarElement);
      this.parentElement.appendChild(this.observerContainer);
    }
  },

  // Observe changes in the scrollbars
  observeScrollbarChanges: function () {
    var scrollbarStatus = this.detectScrollbars(this.observerContainer);
    var hasVerticalScrollbar = scrollbarStatus.hasVerticalScrollbar;
    var hasHorizontalScrollbar = scrollbarStatus.hasHorizontalScrollbar;

    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
      this.debouncedHandleScrollbarChange(
        hasVerticalScrollbar,
        hasHorizontalScrollbar
      );
    } else {
      this.debouncedHandleNoScrollbarChange();
    }
  },
  // Observe scroll events on the container element
  observeContainerScroll: function () {
    return observeElementResize(
      this.observerContainer,
      this.observeScrollbarChanges.bind(this)
    );
  },
  // Observe scroll events on the content element
  observeContentScroll: function () {
    return observeElementResize(
      this.observerContent,
      this.observeScrollbarChanges.bind(this)
    );
  },
};
