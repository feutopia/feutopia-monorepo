import { ScrollManagerOptions } from "../types";
import { applyStyles } from "../utils";
import { ScrollContainer } from "./ScrollContainer";
import { Scrollbar } from "./Scrollbar";

// ScrollManager class
export class ScrollManager {
  private parentElement: ScrollManagerOptions["parentElement"];
  private observerContainer: ScrollManagerOptions["observerContainer"];
  private hasVerticalScrollbar: ScrollManagerOptions["hasVerticalScrollbar"];
  private hasHorizontalScrollbar: ScrollManagerOptions["hasHorizontalScrollbar"];

  private scrollContainer: ScrollContainer | null = null;
  private verticalScrollbar: Scrollbar | null = null;
  private horizontalScrollbar: Scrollbar | null = null;

  constructor(options: ScrollManagerOptions) {
    this.parentElement = options.parentElement;
    this.observerContainer = options.observerContainer;
    this.hasVerticalScrollbar = options.hasVerticalScrollbar;
    this.hasHorizontalScrollbar = options.hasHorizontalScrollbar;

    this.mount();
  }
  // Mount
  private mount() {
    // Step 1: Create scrollbars
    this.createScrollbars();

    // Step 2: Update parent element styles based on scrollbar presence
    this.updateParentStyles();

    // Step 3: Create the scrollContainer
    this.scrollContainer = this.createScrollContainer();

    // Step 4: Update scrollbars size
    this.updateScrollbarSizes();
  }
  // Unmount
  public unmount() {
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
  }
  // Create scrollbars if necessary
  private createScrollbars() {
    if (this.hasVerticalScrollbar) {
      this.verticalScrollbar = this.createVerticalScrollbar();
    }
    if (this.hasHorizontalScrollbar) {
      this.horizontalScrollbar = this.createHorizontalScrollbar();
    }
  }
  // Update parent element styles (padding) based on scrollbar sizes
  private updateParentStyles() {
    const { width, height } = this.getScrollbarSize();
    applyStyles(this.parentElement, {
      paddingRight: `${width}px`,
      paddingBottom: `${height}px`,
    });
  }
  // Synchronize the scrollbars and parent element styles
  public sync(hasVerticalScrollbar: boolean, hasHorizontalScrollbar: boolean) {
    this.hasVerticalScrollbar = hasVerticalScrollbar;
    this.hasHorizontalScrollbar = hasHorizontalScrollbar;

    // Step 1: Synchronize scrollbar instances
    this.syncScrollbars();

    // Step 2: Update parent element styles based on scrollbar presence
    this.updateParentStyles();

    // Step 3: Update scroll container size
    this.scrollContainer?.updateSize();

    // Step 4: Update scrollbars size
    this.updateScrollbarSizes();

    // Step 5: Update scrollbars offset
    this.updateScrollbarOffsets();
  }
  // Get the current size of the scrollbars (width and height)
  private getScrollbarSize() {
    const width = this.verticalScrollbar?.scrollbarElement.clientWidth ?? 0;
    const height = this.horizontalScrollbar?.scrollbarElement.clientHeight ?? 0;
    return {
      width,
      height,
    };
  }
  // Synchronize scrollbar instances (create or remove them)
  private syncScrollbars() {
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
  }
  // Update the sizes of the scrollbars based on the scroll container
  private updateScrollbarSizes() {
    const scrollRatios = this.getScrollContainerRatios();

    if (this.verticalScrollbar) {
      this.verticalScrollbar.updateThumbSize(scrollRatios.vertical);
    }
    if (this.horizontalScrollbar) {
      this.horizontalScrollbar.updateThumbSize(scrollRatios.horizontal);
    }
  }
  // Update the offsets of the scrollbars based on the scroll container's scroll position
  private updateScrollbarOffsets() {
    if (this.verticalScrollbar) {
      const offset = this.convertToVerticalScrollbarOffset(
        this.scrollContainer?.scrollTop ?? 0
      );
      this.verticalScrollbar.setScrollbarOffset(offset);
    }
    if (this.horizontalScrollbar) {
      const offset = this.convertToHorizontalScrollbarOffset(
        this.scrollContainer?.scrollLeft ?? 0
      );
      this.horizontalScrollbar.setScrollbarOffset(offset);
    }
  }
  // Get the scroll container's ratio for vertical and horizontal scrolling
  private getScrollContainerRatios() {
    return {
      vertical: this.scrollContainer?.verticalScrollRatio ?? 0,
      horizontal: this.scrollContainer?.horizontalScrollRatio ?? 0,
    };
  }
  // Convert scroll container's scroll top value to the corresponding vertical scrollbar offset
  private convertToVerticalScrollbarOffset(top: number) {
    return (
      (top / (this.scrollContainer?.maxScrollHeight ?? 0)) *
      (this.verticalScrollbar?.maxScrollDistance ?? 0)
    );
  }
  // Convert scroll container's scroll left value to the corresponding horizontal scrollbar offset
  private convertToHorizontalScrollbarOffset(left: number) {
    return (
      (left / (this.scrollContainer?.maxScrollWidth ?? 0)) *
      (this.horizontalScrollbar?.maxScrollDistance ?? 0)
    );
  }
  // Convert a vertical scrollbar offset to the corresponding scroll container's scroll top
  private convertToScrollContainerTop(offset: number) {
    return (
      (offset / (this.verticalScrollbar?.maxScrollDistance ?? 0)) *
      (this.scrollContainer?.maxScrollHeight ?? 0)
    );
  }
  // Convert a horizontal scrollbar offset to the corresponding scroll container's scroll left
  private convertToScrollContainerLeft(offset: number) {
    return (
      (offset / (this.horizontalScrollbar?.maxScrollDistance ?? 0)) *
      (this.scrollContainer?.maxScrollWidth ?? 0)
    );
  }
  // Create the scroll container that handles the actual scrolling logic
  private createScrollContainer() {
    return new ScrollContainer({
      parentElement: this.parentElement,
      observerContainer: this.observerContainer,

      // Vertical scroll callback
      onVerticalScroll: (top) => {
        this.verticalScrollbar?.setScrollbarOffset(
          this.convertToVerticalScrollbarOffset(top)
        );
      },

      // Horizontal scroll callback
      onHorizontalScroll: (left) => {
        this.horizontalScrollbar?.setScrollbarOffset(
          this.convertToHorizontalScrollbarOffset(left)
        );
      },
    });
  }
  // Create vertical scrollbar
  private createVerticalScrollbar() {
    return new Scrollbar({
      parentElement: this.parentElement,
      className: "fe-vertical-scrollbar",
      direction: "vertical",
      onScroll: (offset) => {
        this.scrollContainer?.setScrollTop(
          this.convertToScrollContainerTop(offset)
        );
      },
    });
  }
  // Create horizontal scrollbar
  private createHorizontalScrollbar() {
    return new Scrollbar({
      parentElement: this.parentElement,
      className: "fe-horizontal-scrollbar",
      direction: "horizontal",
      onScroll: (offset) => {
        this.scrollContainer?.setScrollLeft(
          this.convertToScrollContainerLeft(offset)
        );
      },
    });
  }
}
