import {computed, type ComputedRef, ref, unref} from 'vue';
import {disableTextSelection, restoreTextSelection} from './textSelection';
import {getEventTarget, nodeContains} from './utils';
import type {MaybeRef, PointerType} from './types';

export type PressEventType = 'press' | 'pressend' | 'pressstart' | 'pressup';

export interface PressEvent {
  altKey: boolean,
  continuePropagation: () => void,
  ctrlKey: boolean,
  key?: string,
  metaKey: boolean,
  pointerType: PointerType,
  readonly shouldStopPropagation: boolean,
  shiftKey: boolean,
  target: Element,
  type: PressEventType,
  x: number,
  y: number
}

export interface PressProps {
  allowTextSelectionOnPress?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  isPressed?: MaybeRef<boolean>,
  onClick?: (event: MouseEvent) => void,
  onPress?: (event: PressEvent) => void,
  onPressChange?: (isPressed: boolean) => void,
  onPressEnd?: (event: PressEvent) => void,
  onPressStart?: (event: PressEvent) => void,
  onPressUp?: (event: PressEvent) => void,
  preventFocusOnPress?: MaybeRef<boolean>,
  shouldCancelOnPointerExit?: MaybeRef<boolean>
}

export interface PressHookProps extends PressProps {
  ref?: MaybeRef<Element | null>
}

export interface PressDOMProps {
  onBlur?: (event: FocusEvent) => void,
  onClick?: (event: MouseEvent) => void,
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void,
  onPointerDown?: (event: PointerEvent) => void,
  onPointerLeave?: (event: PointerEvent) => void
}

export interface PressResult {
  isPressed: ComputedRef<boolean>,
  pressProps: ComputedRef<PressDOMProps>
}

class PressEventImpl implements PressEvent {
  #shouldStopPropagation = true;

  altKey: boolean;
  ctrlKey: boolean;
  key?: string;
  metaKey: boolean;
  pointerType: PointerType;
  shiftKey: boolean;
  target: Element;
  type: PressEventType;
  x: number;
  y: number;

  constructor(type: PressEventType, pointerType: PointerType, target: Element, originalEvent: Event) {
    let rect = target.getBoundingClientRect();
    let clientX = rect.left + (rect.width / 2);
    let clientY = rect.top + (rect.height / 2);
    let supportsPointerEvents = typeof PointerEvent !== 'undefined';
    let isPointerEvent = supportsPointerEvents && originalEvent instanceof PointerEvent;

    if (isPointerEvent || originalEvent instanceof MouseEvent) {
      let pointerOrMouseEvent = originalEvent as PointerEvent | MouseEvent;
      clientX = pointerOrMouseEvent.clientX;
      clientY = pointerOrMouseEvent.clientY;
    }

    this.altKey = 'altKey' in originalEvent ? Boolean(originalEvent.altKey) : false;
    this.ctrlKey = 'ctrlKey' in originalEvent ? Boolean(originalEvent.ctrlKey) : false;
    this.key = originalEvent instanceof KeyboardEvent ? originalEvent.key : undefined;
    this.metaKey = 'metaKey' in originalEvent ? Boolean(originalEvent.metaKey) : false;
    this.pointerType = pointerType;
    this.shiftKey = 'shiftKey' in originalEvent ? Boolean(originalEvent.shiftKey) : false;
    this.target = target;
    this.type = type;
    this.x = clientX - rect.left;
    this.y = clientY - rect.top;
  }

  continuePropagation(): void {
    this.#shouldStopPropagation = false;
  }

  get shouldStopPropagation(): boolean {
    return this.#shouldStopPropagation;
  }
}

function normalizePointerType(event: PointerEvent): PointerType {
  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    return event.pointerType;
  }

  return 'mouse';
}

function getTargetFromEvent(event: Event, fallbackTarget: Element | null): Element | null {
  if (event.currentTarget instanceof Element) {
    return event.currentTarget;
  }

  if (fallbackTarget) {
    return fallbackTarget;
  }

  let eventTarget = getEventTarget(event);
  return eventTarget instanceof Element ? eventTarget : null;
}

function isKeyboardPressKey(key: string): boolean {
  return key === 'Enter' || key === ' ' || key === 'Spacebar';
}

export function usePress(props: PressHookProps = {}): PressResult {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let isPressedInternal = ref(false);

  let activePointerId = ref<number | null>(null);
  let activePointerType = ref<PointerType>('mouse');
  let activeTarget = ref<Element | null>(null);
  let didFirePressStart = ref(false);
  let ignoreNextClick = ref(false);
  let removeGlobalListeners = () => {};

  let triggerPressStart = (event: Event, pointerType: PointerType): boolean => {
    if (isDisabled.value || didFirePressStart.value) {
      return false;
    }

    let eventTarget = getTargetFromEvent(event, activeTarget.value ?? unref(props.ref) ?? null);
    if (!eventTarget) {
      return false;
    }

    activeTarget.value = eventTarget;
    didFirePressStart.value = true;
    isPressedInternal.value = true;

    let shouldStopPropagation = true;

    if (props.onPressStart) {
      let pressEvent = new PressEventImpl('pressstart', pointerType, eventTarget, event);
      props.onPressStart(pressEvent);
      shouldStopPropagation = pressEvent.shouldStopPropagation;
    }

    props.onPressChange?.(true);
    return shouldStopPropagation;
  };

  let triggerPressUp = (event: Event, pointerType: PointerType): boolean => {
    let eventTarget = getTargetFromEvent(event, activeTarget.value ?? unref(props.ref) ?? null);
    if (!eventTarget || !props.onPressUp) {
      return true;
    }

    let pressEvent = new PressEventImpl('pressup', pointerType, eventTarget, event);
    props.onPressUp(pressEvent);
    return pressEvent.shouldStopPropagation;
  };

  let triggerPressEnd = (event: Event, pointerType: PointerType, shouldTriggerPress: boolean): boolean => {
    if (!didFirePressStart.value) {
      return false;
    }

    let eventTarget = getTargetFromEvent(event, activeTarget.value ?? unref(props.ref) ?? null);
    if (!eventTarget) {
      return false;
    }

    didFirePressStart.value = false;
    isPressedInternal.value = false;

    let shouldStopPropagation = true;

    if (props.onPressEnd) {
      let pressEndEvent = new PressEventImpl('pressend', pointerType, eventTarget, event);
      props.onPressEnd(pressEndEvent);
      shouldStopPropagation = pressEndEvent.shouldStopPropagation;
    }

    props.onPressChange?.(false);

    if (shouldTriggerPress && !isDisabled.value && props.onPress) {
      let pressEvent = new PressEventImpl('press', pointerType, eventTarget, event);
      props.onPress(pressEvent);
      shouldStopPropagation = shouldStopPropagation && pressEvent.shouldStopPropagation;
    }

    return shouldStopPropagation;
  };

  let cleanupPress = (restoreSelectionTarget: Element | null = activeTarget.value) => {
    restoreTextSelection(restoreSelectionTarget);
    activePointerId.value = null;
    activeTarget.value = null;
    removeGlobalListeners();
  };

  let onPointerDown = (event: PointerEvent) => {
    if (isDisabled.value || event.button !== 0 || activePointerId.value != null || typeof window === 'undefined') {
      return;
    }

    activePointerId.value = event.pointerId;
    activePointerType.value = normalizePointerType(event);
    activeTarget.value = getTargetFromEvent(event, unref(props.ref) ?? null);

    if (!unref(props.allowTextSelectionOnPress)) {
      disableTextSelection(activeTarget.value);
    }

    if (!unref(props.preventFocusOnPress) && activeTarget.value instanceof HTMLElement) {
      activeTarget.value.focus({preventScroll: true});
    }

    triggerPressStart(event, activePointerType.value);

    let onPointerUp = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== activePointerId.value) {
        return;
      }

      triggerPressUp(upEvent, activePointerType.value);

      let shouldTriggerPress = false;
      if (activeTarget.value) {
        if (upEvent.composedPath().includes(activeTarget.value)) {
          shouldTriggerPress = true;
        } else if (getEventTarget(upEvent) instanceof Node) {
          shouldTriggerPress = nodeContains(activeTarget.value, getEventTarget(upEvent));
        }
      }

      triggerPressEnd(upEvent, activePointerType.value, shouldTriggerPress);
      ignoreNextClick.value = true;
      cleanupPress();
    };

    let onPointerCancel = (cancelEvent: PointerEvent) => {
      if (cancelEvent.pointerId !== activePointerId.value) {
        return;
      }

      triggerPressEnd(cancelEvent, activePointerType.value, false);
      cleanupPress();
    };

    window.addEventListener('pointerup', onPointerUp, false);
    window.addEventListener('pointercancel', onPointerCancel, false);

    removeGlobalListeners = () => {
      window.removeEventListener('pointerup', onPointerUp, false);
      window.removeEventListener('pointercancel', onPointerCancel, false);
      removeGlobalListeners = () => {};
    };
  };

  let onPointerLeave = (event: PointerEvent) => {
    if (!unref(props.shouldCancelOnPointerExit) || !didFirePressStart.value) {
      return;
    }

    triggerPressEnd(event, activePointerType.value, false);
    cleanupPress();
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value || event.repeat || !isKeyboardPressKey(event.key)) {
      return;
    }

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }

    activePointerType.value = 'keyboard';
    activeTarget.value = getTargetFromEvent(event, unref(props.ref) ?? null);
    triggerPressStart(event, 'keyboard');
  };

  let onKeyUp = (event: KeyboardEvent) => {
    if (isDisabled.value || !didFirePressStart.value || !isKeyboardPressKey(event.key)) {
      return;
    }

    triggerPressUp(event, 'keyboard');
    triggerPressEnd(event, 'keyboard', true);
    ignoreNextClick.value = true;
  };

  let onBlur = (event: FocusEvent) => {
    if (!didFirePressStart.value || activePointerType.value !== 'keyboard') {
      return;
    }

    triggerPressEnd(event, 'keyboard', false);
  };

  let onClick = (event: MouseEvent) => {
    props.onClick?.(event);

    if (isDisabled.value) {
      event.preventDefault();
      return;
    }

    if (ignoreNextClick.value) {
      ignoreNextClick.value = false;
      return;
    }

    let target = getTargetFromEvent(event, unref(props.ref) ?? null);
    if (!target) {
      return;
    }

    activeTarget.value = target;
    triggerPressStart(event, 'virtual');
    triggerPressUp(event, 'virtual');
    triggerPressEnd(event, 'virtual', true);
  };

  return {
    isPressed: computed(() => {
      let controlledIsPressed = unref(props.isPressed);
      if (controlledIsPressed === undefined) {
        return isPressedInternal.value;
      }

      return Boolean(controlledIsPressed);
    }),
    pressProps: computed<PressDOMProps>(() => {
      if (isDisabled.value) {
        return {
          onClick
        };
      }

      return {
        onBlur,
        onClick,
        onKeyDown,
        onKeyUp,
        onPointerDown,
        onPointerLeave
      };
    })
  };
}
