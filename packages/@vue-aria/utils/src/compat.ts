import {defineComponent, getCurrentScope, onMounted, onScopeDispose, onUnmounted, ref, watch} from 'vue';

type GenericFunction = (...args: unknown[]) => unknown;
type Orientation = 'horizontal' | 'vertical';
type Href = string;
type RouterOptions = Record<string, unknown>;
type FocusableElement = Element;
type DOMAttributes<T extends HTMLElement = HTMLElement> = Record<string, unknown>;
type HTMLAttributes<T extends HTMLElement = HTMLElement> = Record<string, unknown>;
type LinkDOMProps = {
  href?: Href,
  target?: string,
  rel?: string,
  download?: string,
  ping?: string,
  referrerPolicy?: string,
  [key: string]: unknown
};
type AriaLabelingProps = {
  'aria-describedby'?: string,
  'aria-label'?: string,
  'aria-labelledby'?: string
};
type Modifiers = {
  metaKey?: boolean,
  ctrlKey?: boolean,
  altKey?: boolean,
  shiftKey?: boolean
};
type RefObject<T> = {current: T};
type MutableRefObject<T> = {current: T};
type EffectCallback = () => void | (() => void);
type Ref<T> = ((instance: T | null) => void | (() => void)) | MutableRefObject<T | null> | null;
type ContextValue<T> = {
  ref?: MutableRefObject<T | null>
};
type ViewportSize = {
  width: number,
  height: number
};
type SetValueAction<S> = (prev: S) => Generator<S, void, unknown>;
type Dispatch<T> = (value: T) => void;
type ScrollIntoViewOpts = {
  block?: ScrollLogicalPosition,
  inline?: ScrollLogicalPosition
};
type ScrollIntoViewportOpts = {
  containingElement?: Element | null
};
type ReactMouseEvent = MouseEvent & {
  currentTarget: EventTarget & Element,
  isDefaultPrevented?: () => boolean
};

declare namespace React {
  type EffectCallback = () => void | (() => void);
  type DependencyList = readonly unknown[];
}

interface Router {
  isNative: boolean,
  open: (target: Element, modifiers: Modifiers, href: Href, routerOptions: RouterOptions | undefined) => void,
  useHref: (href: Href) => string
}

interface UseDrag1DProps {
  containerRef: MutableRefObject<HTMLElement>,
  reverse?: boolean,
  orientation?: Orientation,
  onHover?: (hovered: boolean) => void,
  onDrag?: (dragging: boolean) => void,
  onPositionChange?: (position: number) => void,
  onIncrement?: () => void,
  onDecrement?: () => void,
  onIncrementToMax?: () => void,
  onDecrementToMin?: () => void,
  onCollapseToggle?: () => void
}

interface GlobalListeners {
  addGlobalListener: (target: EventTarget | null, type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) => void,
  removeAllGlobalListeners: () => void
}

type useResizeObserverOptionsType<T extends Element> = {
  ref: RefObject<T | undefined | null> | undefined,
  box?: ResizeObserverBoxOptions,
  onResize: () => void
};

interface LoadMoreProps {
  isLoading?: boolean,
  onLoadMore?: () => void,
  scrollOffset?: number,
  items?: unknown
}

export type LoadMoreSentinelProps = LoadMoreProps & {
  collection?: unknown
};

type KeyEvent = {
  altKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean
};

let descriptionId = 0;
const descriptionNodes = new Map<string, {refCount: number, element: HTMLDivElement}>();

function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function normalizeElement(target: Element | null | undefined): Element | null {
  return target instanceof Element ? target : null;
}

export const CLEAR_FOCUS_EVENT = 'vue-aria-clear-focus';
export const FOCUS_EVENT = 'vue-aria-focus';
export function inertValue(value?: boolean): string | boolean | undefined {
  return value ? 'true' : undefined;
}

export class ShadowTreeWalker {
  currentNode: Node | null;
  root: Node | null;

  constructor(root: Node | null = null) {
    this.root = root;
    this.currentNode = root;
  }

  nextNode(): Node | null {
    return null;
  }

  previousNode(): Node | null {
    return null;
  }
}

export function createShadowTreeWalker(
  documentObject: Document,
  root: Node,
  whatToShow?: number,
  filter?: NodeFilter | null
): TreeWalker;
export function createShadowTreeWalker(root: Node | null): ShadowTreeWalker;
export function createShadowTreeWalker(
  rootOrDocument: Document | Node | null = null,
  root?: Node,
  whatToShow: number = NodeFilter.SHOW_ALL,
  filter: NodeFilter | null = null
): TreeWalker | ShadowTreeWalker {
  if (rootOrDocument instanceof Document && root) {
    return rootOrDocument.createTreeWalker(root, whatToShow, filter);
  }

  return new ShadowTreeWalker((rootOrDocument as Node | null) ?? null);
}

export function getOwnerDocument(target: Element | null | undefined): Document {
  if (target && target.ownerDocument) {
    return target.ownerDocument;
  }

  return canUseDOM() ? document : ({} as Document);
}

export function getOwnerWindow(target: (Window & typeof globalThis) | Element | null | undefined): Window & typeof globalThis {
  if (target && 'window' in target && target.window === target) {
    return target;
  }

  let ownerDocument = getOwnerDocument(target as Element | null | undefined);
  return (ownerDocument.defaultView ?? (canUseDOM() ? window : undefined)) as Window & typeof globalThis;
}

export function isShadowRoot(node: Node | null): node is ShadowRoot {
  return typeof ShadowRoot !== 'undefined' && node instanceof ShadowRoot;
}

export function focusWithoutScrolling(target: FocusableElement): void {
  let element = normalizeElement(target as Element | null | undefined);
  if (!element) {
    return;
  }

  if ('focus' in element && typeof element.focus === 'function') {
    try {
      element.focus({preventScroll: true});
      return;
    } catch {
      element.focus();
    }
  }
}

export function getOffset(element: HTMLElement, reverse?: boolean, orientation: Orientation = 'horizontal'): number {
  let rect = element.getBoundingClientRect();
  if (reverse) {
    return orientation === 'horizontal' ? rect.right : rect.bottom;
  }

  return orientation === 'horizontal' ? rect.left : rect.top;
}

export function getSyntheticLinkProps(props: LinkDOMProps): DOMAttributes<HTMLElement> {
  return {
    'data-href': props.href,
    'data-target': props.target,
    'data-rel': props.rel,
    'data-download': props.download,
    'data-ping': props.ping,
    'data-referrer-policy': props.referrerPolicy
  };
}

export function shouldClientNavigate(link: HTMLAnchorElement, modifiers: Modifiers): boolean {
  let target = link.getAttribute('target');
  return (
    (!target || target === '_self')
    && link.origin === location.origin
    && !link.hasAttribute('download')
    && !modifiers.metaKey
    && !modifiers.ctrlKey
    && !modifiers.altKey
    && !modifiers.shiftKey
  );
}

export function openLink(target: HTMLAnchorElement, modifiers: Modifiers, setOpening?: boolean): void;
export function openLink(href: string | URL | null | undefined, target?: string): void;
export function openLink(
  targetOrHref: HTMLAnchorElement | string | URL | null | undefined,
  modifiersOrTarget: Modifiers | string = '_self',
  _setOpening: boolean = true
): void {
  if (!canUseDOM() || targetOrHref == null) {
    return;
  }

  if (targetOrHref instanceof HTMLAnchorElement) {
    let href = targetOrHref.href;
    let target = targetOrHref.getAttribute('target') ?? '_self';
    let modifiers = typeof modifiersOrTarget === 'object' ? modifiersOrTarget : {};
    if (!shouldClientNavigate(targetOrHref, modifiers)) {
      return;
    }
    openLink(href, target);
    return;
  }

  let target = typeof modifiersOrTarget === 'string' ? modifiersOrTarget : '_self';
  let hrefValue = typeof targetOrHref === 'string' ? targetOrHref : targetOrHref.toString();
  if (target === '_self') {
    window.location.assign(hrefValue);
    return;
  }

  window.open(hrefValue, target);
}

export function handleLinkClick(
  event: ReactMouseEvent,
  router: Router,
  href: Href | undefined,
  routerOptions: RouterOptions | undefined
): void {
  if (!(event.currentTarget instanceof HTMLAnchorElement) || !href) {
    return;
  }

  if (event.isDefaultPrevented?.()) {
    return;
  }

  let modifiers: Modifiers = {
    metaKey: event.metaKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    shiftKey: event.shiftKey
  };

  if (!shouldClientNavigate(event.currentTarget, modifiers)) {
    return;
  }

  event.preventDefault();
  router.open(event.currentTarget, modifiers, href, routerOptions);
}

export function useSyntheticLinkProps(props: LinkDOMProps): DOMAttributes<HTMLElement> {
  let router = useRouter();
  let href = router.useHref(props.href ?? '');
  return getSyntheticLinkProps({
    ...props,
    href: props.href ? href : undefined
  });
}

export function useLinkProps(props?: LinkDOMProps): LinkDOMProps {
  let router = useRouter();
  let href = router.useHref(props?.href ?? '');
  return {
    ...props,
    href: props?.href ? href : undefined
  };
}

export function useRouter(): Router {
  return {
    isNative: false,
    open: (target, modifiers) => openLink(target as HTMLAnchorElement, modifiers),
    useHref: (href) => href
  };
}

export const RouterProvider = defineComponent({
  name: 'VueAriaRouterProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export function runAfterTransition(callback: () => void): void {
  requestAnimationFrame(() => callback());
}

const USE_DRAG_1D_DEPRECATION_WARNING = 'useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html';

export function useDrag1D(props: UseDrag1DProps): HTMLAttributes<HTMLElement> {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(USE_DRAG_1D_DEPRECATION_WARNING);
  }

  let {containerRef, reverse, orientation = 'horizontal', onDrag, onHover, onPositionChange} = props;
  let dragging = ref(false);

  let getPosition = (event: MouseEvent) => orientation === 'horizontal' ? event.clientX : event.clientY;
  let getNextOffset = (event: MouseEvent) => {
    let containerOffset = getOffset(containerRef.current, reverse, orientation);
    let mouseOffset = getPosition(event);
    return reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
  };

  let onMouseDragged = (event: MouseEvent) => {
    event.preventDefault();
    let nextOffset = getNextOffset(event);
    if (!dragging.value) {
      dragging.value = true;
      onDrag?.(true);
    }
    onPositionChange?.(nextOffset);
  };

  let onMouseUp = () => {
    if (dragging.value) {
      dragging.value = false;
      onDrag?.(false);
    }
    window.removeEventListener('mouseup', onMouseUp, false);
    window.removeEventListener('mousemove', onMouseDragged, false);
  };

  let onMouseDown = () => {
    window.addEventListener('mousemove', onMouseDragged, false);
    window.addEventListener('mouseup', onMouseUp, false);
  };

  return {
    onMouseDown,
    onMouseEnter: () => onHover?.(true),
    onMouseOut: () => onHover?.(false)
  };
}

export function useGlobalListeners(): GlobalListeners {
  let listeners: Array<() => void> = [];

  let addGlobalListener = (target: EventTarget | null, type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) => {
    if (!target?.addEventListener) {
      return;
    }

    target.addEventListener(type, listener, options);
    listeners.push(() => target.removeEventListener(type, listener, options));
  };

  let removeAllGlobalListeners = () => {
    for (let removeListener of listeners.splice(0)) {
      removeListener();
    }
  };

  onUnmounted(removeAllGlobalListeners);

  return {
    addGlobalListener,
    removeAllGlobalListeners
  };
}

export function useObjectRef<T>(
  value?: ((instance: T | null) => (() => void) | void) | MutableRefObject<T | null> | null
): MutableRefObject<T | null> {
  if (value && typeof value === 'object' && 'current' in value) {
    return value as MutableRefObject<T | null>;
  }

  let objectRef = {current: null as T | null};
  if (typeof value === 'function') {
    value(objectRef.current);
  }

  return objectRef;
}

export function mergeRefs<T>(...refs: Array<Ref<T> | MutableRefObject<T> | null | undefined>): Ref<T> {
  return (value: T | null) => {
    for (let reference of refs) {
      if (!reference) {
        continue;
      }

      if (typeof reference === 'function') {
        reference(value);
        continue;
      }

      reference.current = value;
    }
  };
}

function createDeferredEffect(callback: GenericFunction): void {
  let initialized = false;
  watch(() => undefined, () => {
    if (initialized) {
      callback();
      return;
    }

    initialized = true;
  }, {immediate: true});
}

export function useUpdateEffect(effect: EffectCallback, _dependencies: any[]): void {
  createDeferredEffect(() => {
    effect();
  });
}

export function useUpdateLayoutEffect(effect: EffectCallback, _dependencies: any[]): void {
  createDeferredEffect(() => {
    effect();
  });
}

export function useLayoutEffect(callback: React.EffectCallback, _dependencies: React.DependencyList): void {
  onMounted(() => {
    callback();
  });
}

export function useResizeObserver<T extends Element>(options: useResizeObserverOptionsType<T>): void {
  let {ref: target, box, onResize} = options;
  if (!canUseDOM() || typeof ResizeObserver === 'undefined') {
    return;
  }

  let observer: ResizeObserver | null = null;

  onMounted(() => {
    observer = new ResizeObserver(() => onResize());

    let element = normalizeElement(target?.current ?? null);
    if (element) {
      observer.observe(element, {box});
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
}

export function useSyncRef<T>(context?: ContextValue<T> | null, value?: RefObject<T | null>): void {
  if (!context?.ref || !value) {
    return;
  }

  context.ref.current = value.current;
}

export function isScrollable(target: Element | null, checkForOverflow?: boolean): boolean {
  let element = normalizeElement(target);
  if (!element) {
    return false;
  }

  let style = getComputedStyle(element);
  let scrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
  if (scrollable && checkForOverflow) {
    scrollable = element.scrollHeight !== element.clientHeight || element.scrollWidth !== element.clientWidth;
  }
  return scrollable;
}

export function getScrollParent(target: Element, checkForOverflow?: boolean): Element {
  let element = normalizeElement(target);
  if (!element) {
    return document.scrollingElement as Element ?? document.documentElement;
  }

  let parent = element.parentElement;
  while (parent) {
    if (isScrollable(parent, checkForOverflow)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return (document.scrollingElement as Element ?? document.documentElement);
}

export function getScrollParents(target: Element, checkForOverflow?: boolean): Element[] {
  let parents: Element[] = [];
  let parent = getScrollParent(target);

  while (parent) {
    parents.push(parent);
    if (parent.parentElement) {
      parent = getScrollParent(parent.parentElement, checkForOverflow);
    } else {
      break;
    }
  }

  return parents;
}

export function useViewportSize(): ViewportSize {
  let viewportSize = ref({
    width: canUseDOM() ? window.innerWidth : 0,
    height: canUseDOM() ? window.innerHeight : 0
  });

  if (!canUseDOM()) {
    return viewportSize.value;
  }

  let updateViewport = () => {
    viewportSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };

  onMounted(() => {
    window.addEventListener('resize', updateViewport);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewport);
  });

  return viewportSize.value;
}

export function useDescription(description: string = ''): AriaLabelingProps {
  if (!description || !canUseDOM()) {
    return {
      'aria-describedby': undefined
    };
  }

  let node = descriptionNodes.get(description);
  if (!node) {
    let id = `vs-description-${descriptionId++}`;
    let element = document.createElement('div');
    element.id = id;
    element.style.display = 'none';
    element.textContent = description;
    document.body.appendChild(element);
    node = {
      refCount: 0,
      element
    };
    descriptionNodes.set(description, node);
  }

  node.refCount++;
  if (getCurrentScope()) {
    onScopeDispose(() => {
      let existing = descriptionNodes.get(description);
      if (!existing) {
        return;
      }

      existing.refCount--;
      if (existing.refCount <= 0) {
        existing.element.remove();
        descriptionNodes.delete(description);
      }
    });
  }

  return {
    'aria-describedby': node.element.id
  };
}

function userAgent(): string {
  if (!canUseDOM()) {
    return '';
  }

  return navigator.userAgent || '';
}

const isMacValue = /mac os/i.test(userAgent());
const isIPhoneValue = /iphone/i.test(userAgent());
const isIPadValue = /ipad/i.test(userAgent());
const isIOSValue = isIPhoneValue || isIPadValue;
const isAppleDeviceValue = isMacValue || isIOSValue;
const isWebKitValue = /applewebkit/i.test(userAgent());
const isChromeValue = /chrome|chromium/i.test(userAgent());
const isAndroidValue = /android/i.test(userAgent());
const isFirefoxValue = /firefox/i.test(userAgent());

export function isMac(): boolean {
  return isMacValue;
}

export function isIPhone(): boolean {
  return isIPhoneValue;
}

export function isIPad(): boolean {
  return isIPadValue;
}

export function isIOS(): boolean {
  return isIOSValue;
}

export function isAppleDevice(): boolean {
  return isAppleDeviceValue;
}

export function isWebKit(): boolean {
  return isWebKitValue;
}

export function isChrome(): boolean {
  return isChromeValue;
}

export function isAndroid(): boolean {
  return isAndroidValue;
}

export function isFirefox(): boolean {
  return isFirefoxValue;
}

export function useEvent<K extends keyof GlobalEventHandlersEventMap>(
  targetRef: RefObject<EventTarget | null>,
  eventName: K | (string & {}),
  handler?: (this: Document, event: GlobalEventHandlersEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  if (!targetRef.current || !handler) {
    return;
  }

  let typedHandler = handler as EventListener;
  targetRef.current.addEventListener(eventName, typedHandler, options);
  onUnmounted(() => {
    targetRef.current?.removeEventListener(eventName, typedHandler, options);
  });
}

export function useValueEffect<S>(defaultValue: S | (() => S)): [S, Dispatch<SetValueAction<S>>] {
  let currentValue = typeof defaultValue === 'function'
    ? (defaultValue as () => S)()
    : defaultValue;

  let queue: Dispatch<SetValueAction<S>> = (generatorFactory) => {
    let generator = generatorFactory(currentValue);
    let next = generator.next();
    while (!next.done) {
      currentValue = next.value;
      next = generator.next();
    }
  };

  return [currentValue, queue];
}

export function scrollIntoView(scrollView: HTMLElement, element: HTMLElement, opts: ScrollIntoViewOpts = {}): void {
  if (scrollView === element) {
    return;
  }

  element.scrollIntoView({
    block: opts.block ?? 'nearest',
    inline: opts.inline ?? 'nearest'
  });
}

export function scrollIntoViewport(target: Element | null, opts: ScrollIntoViewportOpts = {}): void {
  if (!target) {
    return;
  }

  opts.containingElement?.scrollIntoView?.({block: 'center', inline: 'center'});
  target.scrollIntoView({block: 'nearest', inline: 'nearest'});
}

export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  return event.detail === 0;
}

export function isVirtualPointerEvent(event: PointerEvent): boolean {
  return event.pointerType === '';
}

export function useEffectEvent<T extends Function>(handler?: T): T {
  let currentHandler = handler ?? (() => undefined) as unknown as T;

  let handlerRef = ref(handler);
  watch(() => handler, (nextHandler) => {
    handlerRef.value = nextHandler ?? currentHandler;
  }, {immediate: true});

  return ((...args: unknown[]) => handlerRef.value?.(...args)) as T;
}

export function useDeepMemo<T>(value: T, _isEqual: (a: T, b: T) => boolean): T {
  return value;
}

export function useFormReset<T>(
  target: RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null> | undefined,
  initialValue: T,
  onReset: (value: T) => void
): void {
  let listener = () => onReset(initialValue);

  onMounted(() => {
    target?.current?.form?.addEventListener('reset', listener);
  });

  onUnmounted(() => {
    target?.current?.form?.removeEventListener('reset', listener);
  });
}

export function useLoadMore(props: LoadMoreProps, target: RefObject<HTMLElement | null>): void {
  if (!target.current || !props.onLoadMore) {
    return;
  }

  let offset = props.scrollOffset ?? 1;
  let onScroll = () => {
    if (props.isLoading || !target.current) {
      return;
    }

    let shouldLoad = target.current.scrollHeight - target.current.scrollTop - target.current.clientHeight < target.current.clientHeight * offset;
    if (shouldLoad) {
      props.onLoadMore?.();
    }
  };

  target.current.addEventListener('scroll', onScroll);
  onUnmounted(() => {
    target.current?.removeEventListener('scroll', onScroll);
  });
}

export function useLoadMoreSentinel(props: LoadMoreSentinelProps, target: RefObject<HTMLElement | null>): void {
  if (!target.current || !props.onLoadMore || typeof IntersectionObserver === 'undefined') {
    return;
  }

  let observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        props.onLoadMore?.();
      }
    }
  }, {root: getScrollParent(target.current, true) as HTMLElement});

  observer.observe(target.current);
  onUnmounted(() => observer.disconnect());
}

export const UNSTABLE_useLoadMoreSentinel = useLoadMoreSentinel;

export function isCtrlKeyPressed(event: Event): boolean {
  let keyboardOrMouseEvent = event as unknown as KeyEvent;
  return Boolean(keyboardOrMouseEvent.ctrlKey || keyboardOrMouseEvent.metaKey);
}

export function willOpenKeyboard(target: Element): boolean {
  let nonTextInputTypes = new Set([
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'button',
    'submit',
    'reset'
  ]);

  return (
    (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type))
    || target instanceof HTMLTextAreaElement
    || (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function useEnterAnimation(_ref: RefObject<HTMLElement | null>, isReady: boolean = true): boolean {
  return isReady;
}

export function useExitAnimation(_ref: RefObject<HTMLElement | null>, isOpen: boolean): boolean {
  return !isOpen;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapValueToStep(value: number, min: number | undefined, max: number | undefined, step: number): number {
  let minValue = min ?? Number.NEGATIVE_INFINITY;
  let maxValue = max ?? Number.POSITIVE_INFINITY;
  if (step <= 0) {
    return clamp(value, minValue, maxValue);
  }

  let snapped = Math.round((value - minValue) / step) * step + minValue;
  return clamp(Number(snapped.toFixed(8)), minValue, maxValue);
}
