import { CustomScrollbarElements } from "../types";
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
  private elements: CustomScrollbarElements;

  private scrollManager: ScrollManager | null = null;
  private cleanupEvents: Array<() => void> = [];

  private debouncedHandleScrollbarChange: DebouncedFunction<
    typeof this.handleScrollbarChange
  >;
  private debouncedHandleNoScrollbarChange: DebouncedFunction<
    typeof this.handleNoScrollbarChange
  >;
  static create(parentElement: HTMLElement | null) {
    if (!parentElement) return null;
    return new CustomScrollbar(parentElement);
  }
  constructor(parentElement: HTMLElement) {
    this.elements = {
      parent: parentElement,
      customScrollbar: createElement("div", "fe-custom-scrollbar"),
      observerContainer: createElement("div", "fe-observer-container"),
      observerContent: createElement("div", "fe-observer-content"),
    };

    this.debouncedHandleScrollbarChange = debounce(
      this.handleScrollbarChange.bind(this),
      50
    );
    this.debouncedHandleNoScrollbarChange = debounce(
      this.handleNoScrollbarChange.bind(this),
      50
    );

    this.applyStyles();
    this.mount();
  }
  private applyStyles() {
    applyStyles(this.elements.customScrollbar, {
      height: "100%",
      position: "relative",
    });
    applyStyles(this.elements.observerContainer, {
      height: "100%",
      position: "relative",
    });
    applyStyles(this.elements.observerContent, {
      display: "inline-block",
      position: "relative",
    });
  }
  // Mount
  public mount() {
    appendChildren(
      this.elements.parent.childNodes,
      this.elements.observerContent
    );
    this.elements.observerContainer.appendChild(this.elements.observerContent);
    this.elements.customScrollbar.appendChild(this.elements.observerContainer);
    this.elements.parent.appendChild(this.elements.customScrollbar);

    const scrollbarStatus = this.detectScrollbars(
      this.elements.observerContainer
    );
    const hasVerticalScrollbar = scrollbarStatus.hasVerticalScrollbar;
    const hasHorizontalScrollbar = scrollbarStatus.hasHorizontalScrollbar;

    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
      this.scrollManager = this.createScrollManager({
        hasVerticalScrollbar,
        hasHorizontalScrollbar,
      });
    }

    this.attachEvents();
  }
  // Unmount
  public unmount() {
    this.detachEvents();

    if (this.scrollManager) {
      this.scrollManager.unmount();
      this.scrollManager = null;
      this.elements.parent.innerHTML = "";
      appendChildren(
        this.elements.observerContent.childNodes,
        this.elements.parent
      );
    }
  }
  // Check if the element has vertical or horizontal scrollbars
  private detectScrollbars(element: HTMLElement) {
    const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
    const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
    return {
      hasVerticalScrollbar,
      hasHorizontalScrollbar,
    };
  }
  // Create an instance of the scroll manager
  private createScrollManager(params: {
    hasVerticalScrollbar: boolean;
    hasHorizontalScrollbar: boolean;
  }) {
    return new ScrollManager({
      ...params,
      parentElement: this.elements.customScrollbar,
      observerContainer: this.elements.observerContainer,
    });
  }
  private attachEvents() {
    const cleanupContainerScroll = this.observeContainerScroll();
    const cleanupContentScroll = this.observeContentScroll();
    this.cleanupEvents = [cleanupContainerScroll, cleanupContentScroll];
  }
  private detachEvents() {
    this.cleanupEvents.forEach((removeEvent) => {
      removeEvent();
    });
    this.cleanupEvents = [];
  }
  // Handle scrollbar changes (vertical and horizontal)
  private handleScrollbarChange(
    hasVerticalScrollbar: boolean,
    hasHorizontalScrollbar: boolean
  ) {
    if (!this.scrollManager) {
      this.elements.parent.appendChild(this.elements.customScrollbar);
      this.scrollManager = this.createScrollManager({
        hasVerticalScrollbar,
        hasHorizontalScrollbar,
      });
    } else {
      this.scrollManager.sync(hasVerticalScrollbar, hasHorizontalScrollbar);
    }
  }
  // Handle absence of scrollbars
  private handleNoScrollbarChange() {
    if (this.scrollManager) {
      this.scrollManager.unmount();
      this.scrollManager = null;
      this.elements.parent.removeChild(this.elements.customScrollbar);
      this.elements.parent.appendChild(this.elements.observerContainer);
    }
  }

  // Observe changes in the scrollbars
  private observeScrollbarChanges = () => {
    const scrollbarStatus = this.detectScrollbars(
      this.elements.observerContainer
    );
    const hasVerticalScrollbar = scrollbarStatus.hasVerticalScrollbar;
    const hasHorizontalScrollbar = scrollbarStatus.hasHorizontalScrollbar;

    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
      this.debouncedHandleScrollbarChange(
        hasVerticalScrollbar,
        hasHorizontalScrollbar
      );
    } else {
      this.debouncedHandleNoScrollbarChange();
    }
  };
  // Observe scroll events on the container element
  private observeContainerScroll() {
    return observeElementResize(
      this.elements.observerContainer,
      this.observeScrollbarChanges
    );
  }
  // Observe scroll events on the content element
  private observeContentScroll() {
    return observeElementResize(
      this.elements.observerContent,
      this.observeScrollbarChanges
    );
  }
}
