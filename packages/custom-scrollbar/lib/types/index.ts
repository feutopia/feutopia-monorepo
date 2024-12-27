export type AnyFunction = (...args: any[]) => any;

// CustomScrollbar
export interface CustomScrollbarElements {
  parent: HTMLElement;
  customScrollbar: HTMLElement;
  observerContainer: HTMLElement;
  observerContent: HTMLElement;
}

// ScrollManager
export interface ScrollManagerOptions {
  parentElement: HTMLElement;
  observerContainer: HTMLElement;
  hasVerticalScrollbar: boolean;
  hasHorizontalScrollbar: boolean;
}

// ScrollContainer
export interface ScrollContainerOptions {
  observerContainer: HTMLElement;
  parentElement: HTMLElement;
  onVerticalScroll: (scrollValue: number) => void;
  onHorizontalScroll: (scrollValue: number) => void;
}

export interface ScrollContainerState {
  scrollTop: number;
  scrollLeft: number; // Scroll left position
  clientWidth: number; // Container width
  clientHeight: number; // Container height
  scrollWidth: number; // Scrollable width of the container
  scrollHeight: number; // Scrollable height of the container
  verticalScrollAnimationId: number | null; // Vertical scroll animation ID
  horizontalScrollAnimationId: number | null; // Horizontal scroll animation ID
}

//Scrollbar
export interface ScrollbarState {
  isDragging: boolean;
  scrollAnimationId: number | null;
  scrollOffset: number;
  maxScrollDistance: number;
  scrollInterval: number | null;
}

export interface ScrollbarElements {
  scrollbar: HTMLElement;
  track: HTMLElement;
  thumb: HTMLElement;
  buttonPre: HTMLElement;
  buttonNext: HTMLElement;
}

export interface ScrollbarOptions {
  parentElement: HTMLElement;
  className?: string;
  direction: "vertical" | "horizontal";
  onScroll: (offset: number) => void;
}
