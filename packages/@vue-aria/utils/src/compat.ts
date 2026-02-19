import {computed, defineComponent, onMounted, onUnmounted, ref, type Ref, watch} from 'vue';

type GenericFunction = (...args: unknown[]) => unknown;

type DOMRectLike = {
  top: number,
  left: number,
  width: number,
  height: number
};

const noop = (): void => {};

function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function normalizeElement(target: Element | null | undefined): Element | null {
  return target instanceof Element ? target : null;
}

export const CLEAR_FOCUS_EVENT = 'vue-aria-clear-focus';
export const FOCUS_EVENT = 'vue-aria-focus';
export const inertValue = 'inert';

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

export function createShadowTreeWalker(root: Node | null = null): ShadowTreeWalker {
  return new ShadowTreeWalker(root);
}

export function getOwnerDocument(target?: Node | null): Document | null {
  if (target && target.ownerDocument) {
    return target.ownerDocument;
  }

  return canUseDOM() ? document : null;
}

export function getOwnerWindow(target?: Node | null): Window | null {
  let ownerDocument = getOwnerDocument(target);
  return ownerDocument?.defaultView ?? (canUseDOM() ? window : null);
}

export function isShadowRoot(target: unknown): target is ShadowRoot {
  return typeof ShadowRoot !== 'undefined' && target instanceof ShadowRoot;
}

export function focusWithoutScrolling(target: Element | null | undefined): void {
  let element = normalizeElement(target);
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

export function getOffset(target: Element | null | undefined): DOMRectLike {
  let element = normalizeElement(target);
  if (!element) {
    return {top: 0, left: 0, width: 0, height: 0};
  }

  let rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

export function getSyntheticLinkProps(): Record<string, unknown> {
  return {};
}

export function shouldClientNavigate(event?: Event): boolean {
  return !event?.defaultPrevented;
}

export function openLink(href: string | URL | null | undefined, target: string = '_self'): void {
  if (!canUseDOM() || href == null) {
    return;
  }

  let hrefValue = typeof href === 'string' ? href : href.toString();
  if (target === '_self') {
    window.location.assign(hrefValue);
    return;
  }

  window.open(hrefValue, target);
}

export function handleLinkClick(event: Event, href: string | URL | null | undefined, target?: string): void {
  if (!shouldClientNavigate(event)) {
    return;
  }

  openLink(href, target);
}

export function useSyntheticLinkProps(props: Record<string, unknown> = {}): Ref<Record<string, unknown>> {
  return computed(() => ({...props, ...getSyntheticLinkProps()}));
}

export function useLinkProps(props: Record<string, unknown> = {}): Ref<Record<string, unknown>> {
  return computed(() => props);
}

export function useRouter() {
  return {
    open: openLink,
    push: openLink,
    replace: openLink,
    isNative: false
  };
}

export const RouterProvider = defineComponent({
  name: 'VueAriaRouterProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export function runAfterTransition(target: Element | null | undefined, callback: GenericFunction): () => void {
  if (!normalizeElement(target)) {
    callback();
    return noop;
  }

  let timeoutId = setTimeout(() => callback(), 0);
  return () => clearTimeout(timeoutId);
}

export function useDrag1D() {
  let dragging = ref(false);
  return {
    isDragging: dragging,
    dragProps: {},
    cancel() {
      dragging.value = false;
    }
  };
}

export function useGlobalListeners() {
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

export function useObjectRef<T>(value: Ref<T> | T): Ref<T> {
  return value && typeof value === 'object' && 'value' in (value as Record<string, unknown>)
    ? value as Ref<T>
    : ref(value as T);
}

export function mergeRefs<T>(...refs: Array<Ref<T | null> | ((value: T | null) => void) | null | undefined>) {
  return (value: T | null) => {
    for (let reference of refs) {
      if (!reference) {
        continue;
      }

      if (typeof reference === 'function') {
        reference(value);
        continue;
      }

      reference.value = value;
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

export function useUpdateEffect(callback: GenericFunction): void {
  createDeferredEffect(callback);
}

export function useUpdateLayoutEffect(callback: GenericFunction): void {
  createDeferredEffect(callback);
}

export function useLayoutEffect(callback: GenericFunction): void {
  onMounted(() => {
    callback();
  });
}

export function useResizeObserver(target: Ref<Element | null | undefined>, callback: (entry: ResizeObserverEntry) => void): void {
  if (!canUseDOM() || typeof ResizeObserver === 'undefined') {
    return;
  }

  let observer: ResizeObserver | null = null;

  onMounted(() => {
    observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        callback(entry);
      }
    });

    let element = normalizeElement(target.value ?? null);
    if (element) {
      observer.observe(element);
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
}

export function useSyncRef<T>(target: Ref<T>, value: Ref<T>): void {
  watch(value, (nextValue) => {
    target.value = nextValue;
  }, {immediate: true});
}

export function isScrollable(target: Element | null | undefined): boolean {
  let element = normalizeElement(target);
  if (!element) {
    return false;
  }

  let style = getComputedStyle(element);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}

export function getScrollParent(target: Element | null | undefined): Element | null {
  let element = normalizeElement(target);
  if (!element) {
    return null;
  }

  let parent = element.parentElement;
  while (parent) {
    if (isScrollable(parent)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return canUseDOM() ? document.scrollingElement as Element | null : null;
}

export function getScrollParents(target: Element | null | undefined): Element[] {
  let parents: Element[] = [];
  let parent = getScrollParent(target);

  while (parent) {
    parents.push(parent);
    parent = getScrollParent(parent.parentElement);
  }

  return parents;
}

export function useViewportSize(): Ref<{width: number, height: number}> {
  let viewportSize = ref({
    width: canUseDOM() ? window.innerWidth : 0,
    height: canUseDOM() ? window.innerHeight : 0
  });

  if (!canUseDOM()) {
    return viewportSize;
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

  return viewportSize;
}

export function useDescription(description: string = '') {
  let id = `vs-description-${Math.random().toString(36).slice(2)}`;
  return {
    descriptionProps: {
      id,
      children: description
    }
  };
}

function userAgent(): string {
  if (!canUseDOM()) {
    return '';
  }

  return navigator.userAgent || '';
}

export const isMac = /mac os/i.test(userAgent());
export const isIPhone = /iphone/i.test(userAgent());
export const isIPad = /ipad/i.test(userAgent());
export const isIOS = isIPhone || isIPad;
export const isAppleDevice = isMac || isIOS;
export const isWebKit = /applewebkit/i.test(userAgent());
export const isChrome = /chrome|chromium/i.test(userAgent());
export const isAndroid = /android/i.test(userAgent());
export const isFirefox = /firefox/i.test(userAgent());

export function useEvent<T extends GenericFunction>(handler: T): T {
  return ((...args: unknown[]) => handler(...args)) as T;
}

export function useValueEffect<T>(initialValue: T) {
  let value = ref(initialValue);
  return {
    value,
    setValue(nextValue: T) {
      value.value = nextValue;
    }
  };
}

export function scrollIntoView(target: Element | null | undefined): void {
  let element = normalizeElement(target);
  if (!element) {
    return;
  }

  element.scrollIntoView({block: 'nearest', inline: 'nearest'});
}

export function scrollIntoViewport(target: Element | null | undefined): void {
  scrollIntoView(target);
}

export function isVirtualClick(event: MouseEvent): boolean {
  return event.detail === 0;
}

export function isVirtualPointerEvent(event: PointerEvent): boolean {
  return event.pointerType === '';
}

export function useEffectEvent<T extends GenericFunction>(handler: T): T {
  let handlerRef = ref(handler);
  watch(() => handler, (nextHandler) => {
    handlerRef.value = nextHandler;
  }, {immediate: true});

  return ((...args: unknown[]) => handlerRef.value(...args)) as T;
}

export function useDeepMemo<T>(factory: () => T): Ref<T> {
  return computed(() => factory());
}

export function useFormReset(target: Ref<HTMLFormElement | null | undefined>, onReset: GenericFunction): void {
  let listener = () => onReset();

  onMounted(() => {
    target.value?.addEventListener('reset', listener);
  });

  onUnmounted(() => {
    target.value?.removeEventListener('reset', listener);
  });
}

export type LoadMoreSentinelProps = Record<string, unknown>;

export function useLoadMore(onLoadMore: GenericFunction = noop) {
  let isLoading = ref(false);
  let loadMore = async () => {
    isLoading.value = true;
    try {
      await onLoadMore();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    loadMore
  };
}

export function useLoadMoreSentinel(onLoadMore: GenericFunction = noop) {
  let state = useLoadMore(onLoadMore);
  return {
    ...state,
    sentinelProps: {}
  };
}

export const UNSTABLE_useLoadMoreSentinel = useLoadMoreSentinel;

export function isCtrlKeyPressed(event: KeyboardEvent | MouseEvent): boolean {
  return Boolean(event.ctrlKey || event.metaKey);
}

export function willOpenKeyboard(event: KeyboardEvent): boolean {
  return event.key.length === 1;
}

export function useEnterAnimation() {
  return {
    isEntering: ref(false)
  };
}

export function useExitAnimation() {
  return {
    isExiting: ref(false)
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapValueToStep(value: number, min: number, max: number, step: number): number {
  if (step <= 0) {
    return clamp(value, min, max);
  }

  let snapped = Math.round((value - min) / step) * step + min;
  return clamp(Number(snapped.toFixed(8)), min, max);
}
