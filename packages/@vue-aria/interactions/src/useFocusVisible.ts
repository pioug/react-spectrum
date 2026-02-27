import {getActiveElement} from './utils';
import type {MaybeRef, PointerType} from './types';
import {getCurrentScope, onScopeDispose, ref, type Ref, unref} from 'vue';

export type Modality = 'keyboard' | 'pointer' | 'virtual';
type FocusVisibleEvent = FocusEvent | KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | null;
type Handler = (modality: Modality, event: FocusVisibleEvent) => void;

export type FocusVisibleHandler = (isFocusVisible: boolean) => void;

export interface FocusVisibleProps {
  autoFocus?: MaybeRef<boolean>,
  isTextInput?: MaybeRef<boolean>
}

export interface FocusVisibleResult {
  isFocusVisible: Ref<boolean>
}

interface ListenerData {
  document: Document,
  onBeforeUnload: () => void,
  onBlur: () => void,
  onClick: (event: MouseEvent) => void,
  onFocus: (event: FocusEvent) => void,
  onKeyDown: (event: KeyboardEvent) => void,
  onKeyUp: (event: KeyboardEvent) => void,
  onMouseDown: (event: MouseEvent) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseUp: (event: MouseEvent) => void,
  onPointerDown: (event: PointerEvent) => void,
  onPointerMove: (event: PointerEvent) => void,
  onPointerUp: (event: PointerEvent) => void,
  originalFocus: typeof HTMLElement.prototype.focus,
  onTouchStart: (event: TouchEvent) => void,
  window: Window
}

let currentModality: Modality | null = null;
let currentPointerType: PointerType = 'keyboard';
let hasEventBeforeFocus = false;
let hasBlurredWindowRecently = false;

const nonTextInputTypes = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
]);

const FOCUS_VISIBLE_INPUT_KEYS = new Set(['Tab', 'Escape']);

export const changeHandlers = new Set<Handler>();
export const hasSetupGlobalListeners = new Map<Window, ListenerData>();

function triggerChangeHandlers(modality: Modality, event: FocusVisibleEvent): void {
  for (let handler of changeHandlers) {
    handler(modality, event);
  }
}

function isVirtualClick(event: MouseEvent): boolean {
  return event.detail === 0;
}

function isValidKey(event: KeyboardEvent): boolean {
  return !(event.metaKey || event.ctrlKey || event.altKey || event.key === 'Control' || event.key === 'Shift' || event.key === 'Meta');
}

function setKeyboardModality(event: KeyboardEvent): void {
  hasEventBeforeFocus = true;
  if (!isValidKey(event)) {
    return;
  }

  currentModality = 'keyboard';
  currentPointerType = 'keyboard';
  triggerChangeHandlers('keyboard', event);
}

function setPointerModality(pointerType: PointerType, event: FocusVisibleEvent): void {
  hasEventBeforeFocus = true;
  currentModality = 'pointer';
  currentPointerType = pointerType;
  triggerChangeHandlers('pointer', event);
}

function updatePointerModality(pointerType: PointerType): void {
  currentModality = 'pointer';
  currentPointerType = pointerType;
}

function isTextInputElement(element: Element | null): boolean {
  if (!element) {
    return false;
  }

  if (element instanceof HTMLTextAreaElement) {
    return true;
  }

  if (element instanceof HTMLInputElement) {
    return !nonTextInputTypes.has(element.type);
  }

  return element instanceof HTMLElement && element.isContentEditable;
}

function isKeyboardFocusEvent(isTextInput: boolean, modality: Modality, event: FocusVisibleEvent): boolean {
  if (typeof document === 'undefined') {
    return true;
  }

  let activeElement = getActiveElement(document);
  let resolvedIsTextInput = isTextInput || isTextInputElement(activeElement);
  if (!resolvedIsTextInput || modality !== 'keyboard' || !(event instanceof KeyboardEvent)) {
    return true;
  }

  return FOCUS_VISIBLE_INPUT_KEYS.has(event.key);
}

function setupGlobalFocusEvents(windowObject: Window, documentObject: Document): void {
  if (hasSetupGlobalListeners.has(windowObject)) {
    return;
  }

  let originalFocus = windowObject.HTMLElement.prototype.focus;
  windowObject.HTMLElement.prototype.focus = function (...args: Parameters<typeof originalFocus>) {
    hasEventBeforeFocus = true;
    return originalFocus.apply(this, args);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    setKeyboardModality(event);
  };

  let onKeyUp = (event: KeyboardEvent) => {
    setKeyboardModality(event);
  };

  let onClick = (event: MouseEvent) => {
    if (!isVirtualClick(event)) {
      return;
    }

    hasEventBeforeFocus = true;
    currentModality = 'virtual';
    currentPointerType = 'virtual';
    triggerChangeHandlers('virtual', event);
  };

  let onFocus = (event: FocusEvent) => {
    let target = event.target;
    if (target === windowObject || target === documentObject || event.isTrusted === false) {
      return;
    }

    if (!hasEventBeforeFocus && !hasBlurredWindowRecently) {
      currentModality = 'virtual';
      currentPointerType = 'virtual';
      triggerChangeHandlers('virtual', event);
    }

    hasEventBeforeFocus = false;
    hasBlurredWindowRecently = false;
  };

  let onBlur = () => {
    hasEventBeforeFocus = false;
    hasBlurredWindowRecently = true;
  };

  let onPointerDown = (event: PointerEvent) => {
    let pointerType = event.pointerType;
    if (pointerType !== 'pen' && pointerType !== 'touch') {
      setPointerModality('mouse', event);
      return;
    }

    setPointerModality(pointerType, event);
  };

  let onPointerMove = (event: PointerEvent) => {
    let pointerType = event.pointerType;
    if (pointerType !== 'pen' && pointerType !== 'touch') {
      updatePointerModality('mouse');
      return;
    }

    updatePointerModality(pointerType);
  };

  let onPointerUp = (event: PointerEvent) => {
    let pointerType = event.pointerType;
    if (pointerType !== 'pen' && pointerType !== 'touch') {
      updatePointerModality('mouse');
      return;
    }

    updatePointerModality(pointerType);
  };

  let onMouseDown = (event: MouseEvent) => {
    setPointerModality('mouse', event);
  };

  let onMouseMove = () => {
    updatePointerModality('mouse');
  };

  let onMouseUp = () => {
    updatePointerModality('mouse');
  };

  let onTouchStart = (event: TouchEvent) => {
    setPointerModality('touch', event);
  };

  let onBeforeUnload = () => {
    tearDownWindowFocusTracking(windowObject);
  };

  documentObject.addEventListener('keydown', onKeyDown, true);
  documentObject.addEventListener('keyup', onKeyUp, true);
  documentObject.addEventListener('click', onClick, true);
  windowObject.addEventListener('focus', onFocus, true);
  windowObject.addEventListener('blur', onBlur, false);

  if ('PointerEvent' in windowObject) {
    documentObject.addEventListener('pointerdown', onPointerDown, true);
    documentObject.addEventListener('pointermove', onPointerMove, true);
    documentObject.addEventListener('pointerup', onPointerUp, true);
  } else {
    documentObject.addEventListener('mousedown', onMouseDown, true);
    documentObject.addEventListener('mousemove', onMouseMove, true);
    documentObject.addEventListener('mouseup', onMouseUp, true);
    documentObject.addEventListener('touchstart', onTouchStart, true);
  }

  windowObject.addEventListener('beforeunload', onBeforeUnload, {once: true});

  hasSetupGlobalListeners.set(windowObject, {
    document: documentObject,
    onBeforeUnload,
    onBlur,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    originalFocus,
    onTouchStart,
    window: windowObject
  });
}

function tearDownWindowFocusTracking(windowObject: Window): void {
  let listenerData = hasSetupGlobalListeners.get(windowObject);
  if (!listenerData) {
    return;
  }

  let {document: documentObject} = listenerData;
  documentObject.removeEventListener('keydown', listenerData.onKeyDown, true);
  documentObject.removeEventListener('keyup', listenerData.onKeyUp, true);
  documentObject.removeEventListener('click', listenerData.onClick, true);
  windowObject.removeEventListener('focus', listenerData.onFocus, true);
  windowObject.removeEventListener('blur', listenerData.onBlur, false);
  windowObject.removeEventListener('beforeunload', listenerData.onBeforeUnload);
  windowObject.HTMLElement.prototype.focus = listenerData.originalFocus;

  if ('PointerEvent' in windowObject) {
    documentObject.removeEventListener('pointerdown', listenerData.onPointerDown, true);
    documentObject.removeEventListener('pointermove', listenerData.onPointerMove, true);
    documentObject.removeEventListener('pointerup', listenerData.onPointerUp, true);
  } else {
    documentObject.removeEventListener('mousedown', listenerData.onMouseDown, true);
    documentObject.removeEventListener('mousemove', listenerData.onMouseMove, true);
    documentObject.removeEventListener('mouseup', listenerData.onMouseUp, true);
    documentObject.removeEventListener('touchstart', listenerData.onTouchStart, true);
  }

  hasSetupGlobalListeners.delete(windowObject);
}

export function addWindowFocusTracking(element?: HTMLElement | null): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  let ownerWindow = element?.ownerDocument?.defaultView ?? window;
  let ownerDocument = element?.ownerDocument ?? document;
  setupGlobalFocusEvents(ownerWindow, ownerDocument);

  return () => {
    tearDownWindowFocusTracking(ownerWindow);
  };
}

if (typeof document !== 'undefined') {
  addWindowFocusTracking();
}

export function isFocusVisible(): boolean {
  return currentModality !== 'pointer';
}

export function getInteractionModality(): Modality | null {
  return currentModality;
}

export function setInteractionModality(modality: Modality): void {
  currentModality = modality;
  currentPointerType = modality === 'pointer' ? 'mouse' : modality;
  triggerChangeHandlers(modality, null);
}

export function getPointerType(): PointerType {
  return currentPointerType;
}

export function useInteractionModality(): Modality | null;
export function useInteractionModality(options: {reactive: true}): Ref<Modality | null>;
export function useInteractionModality(options?: {reactive?: boolean}): Modality | null | Ref<Modality | null> {
  addWindowFocusTracking();

  if (!options?.reactive) {
    return currentModality;
  }

  let modality = ref<Modality | null>(currentModality);
  let handler: Handler = (nextModality) => {
    modality.value = nextModality;
  };

  changeHandlers.add(handler);
  if (getCurrentScope()) {
    onScopeDispose(() => {
      changeHandlers.delete(handler);
    });
  }
  return modality;
}

export function useFocusVisible(props: FocusVisibleProps = {}): FocusVisibleResult {
  let isFocusVisibleState = ref(Boolean(unref(props.autoFocus)) || isFocusVisible());
  useFocusVisibleListener(
    (nextFocusVisible) => {
      isFocusVisibleState.value = nextFocusVisible;
    },
    [],
    {
      isTextInput: props.isTextInput
    }
  );

  return {
    isFocusVisible: isFocusVisibleState
  };
}

export function useFocusVisibleListener(
  fn: FocusVisibleHandler,
  deps?: ReadonlyArray<any>,
  opts?: {enabled?: boolean, isTextInput?: boolean}
): void;
export function useFocusVisibleListener(
  fn: FocusVisibleHandler,
  deps: ReadonlyArray<unknown> = [],
  opts?: {enabled?: MaybeRef<boolean>, isTextInput?: MaybeRef<boolean>}
): () => void {
  void deps;

  addWindowFocusTracking();

  let enabled = opts?.enabled === undefined ? true : Boolean(unref(opts.enabled));
  if (!enabled) {
    return () => {};
  }

  let handler: Handler = (modality, event) => {
    if (!isKeyboardFocusEvent(Boolean(unref(opts?.isTextInput)), modality, event)) {
      return;
    }

    fn(isFocusVisible());
  };

  changeHandlers.add(handler);
  if (getCurrentScope()) {
    onScopeDispose(() => {
      changeHandlers.delete(handler);
    });
  }
  return () => {
    changeHandlers.delete(handler);
  };
}
