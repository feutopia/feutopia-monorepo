import {
  createElement,
  applyStyles,
  appendChildren,
  observeElementResize,
  debounce,
  DebouncedFunction,
} from "../utils";
import { ScrollManager } from "./ScrollManager";

export class CustomScrollbar {
  #parentElement: HTMLElement;
  #scrollbarElement: HTMLElement;
  #observerContainer: HTMLElement;
  #observerContent: HTMLElement;

  #scrollManager: ScrollManager | null = null;
  #cleanupEvents: Array<() => void> = [];
  #debouncedHandleScrollbarChange: DebouncedFunction<
    typeof this.handleScrollbarChange
  >;
  #debouncedHandleNoScrollbarChange: DebouncedFunction<
    typeof this.handleNoScrollbarChange
  >;

  constructor(parentElement: HTMLElement) {
    this.#parentElement = parentElement;
    this.#scrollbarElement = createElement("div", "fe-custom-scrollbar");
    this.#observerContainer = createElement("div", "fe-observer-container");
    this.#observerContent = createElement("div", "fe-observer-content");

    this.#debouncedHandleScrollbarChange = debounce(
      this.handleScrollbarChange.bind(this),
      50
    );
    this.#debouncedHandleNoScrollbarChange = debounce(
      this.handleNoScrollbarChange.bind(this),
      50
    );

    if (!parentElement) return;

    this.#applyStyles();
    this.mount();
  }
  #applyStyles() {
    applyStyles(this.#scrollbarElement, {
      height: "100%",
      position: "relative",
    });
    applyStyles(this.#observerContainer, {
      height: "100%",
      position: "relative",
    });
    applyStyles(this.#observerContent, {
      display: "inline-block",
      position: "relative",
    });
  }
  // Mount
  mount() {
    appendChildren(this.#parentElement.childNodes, this.#observerContent);
    this.#observerContainer.appendChild(this.#observerContent);
    this.#scrollbarElement.appendChild(this.#observerContainer);
    this.#parentElement.appendChild(this.#scrollbarElement);

    const scrollbarStatus = this.#detectScrollbars(this.#observerContainer);
    const hasVerticalScrollbar = scrollbarStatus.hasVerticalScrollbar;
    const hasHorizontalScrollbar = scrollbarStatus.hasHorizontalScrollbar;

    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
      this.#scrollManager = this.#createScrollManager({
        hasVerticalScrollbar,
        hasHorizontalScrollbar,
      });
    }

    this.#attachEvents();
  }
  // Unmount
  public unmount() {
    this.#detachEvents();

    if (this.#scrollManager) {
      this.#scrollManager.unmount();
      this.#scrollManager = null;
      this.#parentElement.innerHTML = "";
      appendChildren(this.#observerContent.childNodes, this.#parentElement);
    }
  }
  // Check if the element has vertical or horizontal scrollbars
  #detectScrollbars(element: HTMLElement) {
    const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
    const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
    return {
      hasVerticalScrollbar,
      hasHorizontalScrollbar,
    };
  }
  // Create an instance of the scroll manager
  #createScrollManager(params: {
    hasVerticalScrollbar: boolean;
    hasHorizontalScrollbar: boolean;
  }) {
    return new ScrollManager({
      ...params,
      parentElement: this.#scrollbarElement,
      observerContainer: this.#observerContainer,
    });
  }
  #attachEvents() {
    const cleanupContainerScroll = this.#observeContainerScroll();
    const cleanupContentScroll = this.#observeContentScroll();
    this.#cleanupEvents = [cleanupContainerScroll, cleanupContentScroll];
  }
  #detachEvents() {
    this.#cleanupEvents.forEach((removeEvent) => {
      removeEvent();
    });
    this.#cleanupEvents = [];
  }
  // Handle scrollbar changes (vertical and horizontal)
  private handleScrollbarChange(
    hasVerticalScrollbar: boolean,
    hasHorizontalScrollbar: boolean
  ) {
    if (!this.#scrollManager) {
      this.#parentElement.appendChild(this.#scrollbarElement);
      this.#scrollManager = this.#createScrollManager({
        hasVerticalScrollbar,
        hasHorizontalScrollbar,
      });
    } else {
      console.log("update");
      this.#scrollManager.sync(hasVerticalScrollbar, hasHorizontalScrollbar);
    }
  }
  // Handle absence of scrollbars
  private handleNoScrollbarChange() {
    if (this.#scrollManager) {
      this.#scrollManager.unmount();
      this.#scrollManager = null;
      this.#parentElement.removeChild(this.#scrollbarElement);
      this.#parentElement.appendChild(this.#observerContainer);
    }
  }

  // Observe changes in the scrollbars
  #observeScrollbarChanges = () => {
    const scrollbarStatus = this.#detectScrollbars(this.#observerContainer);
    const hasVerticalScrollbar = scrollbarStatus.hasVerticalScrollbar;
    const hasHorizontalScrollbar = scrollbarStatus.hasHorizontalScrollbar;

    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
      this.#debouncedHandleScrollbarChange(
        hasVerticalScrollbar,
        hasHorizontalScrollbar
      );
    } else {
      this.#debouncedHandleNoScrollbarChange();
    }
  };
  // Observe scroll events on the container element
  #observeContainerScroll() {
    return observeElementResize(
      this.#observerContainer,
      this.#observeScrollbarChanges
    );
  }
  // Observe scroll events on the content element
  #observeContentScroll() {
    return observeElementResize(
      this.#observerContent,
      this.#observeScrollbarChanges
    );
  }
}
