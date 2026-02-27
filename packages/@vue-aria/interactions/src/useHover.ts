import {computed, getCurrentScope, onScopeDispose, type ComputedRef, ref, unref, watch} from 'vue';
import type {MaybeRef, PointerType} from './types';
import {getEventTarget, nodeContains} from './utils';

export interface HoverEvent {
  pointerType: PointerType,
  target: Element,
  type: 'hoverend' | 'hoverstart'
}

export interface HoverProps {
  isDisabled?: MaybeRef<boolean>,
  onHoverChange?: (isHovered: boolean) => void,
  onHoverEnd?: (event: HoverEvent) => void,
  onHoverStart?: (event: HoverEvent) => void
}

export interface HoverDOMProps {
  onMouseEnter?: (event: MouseEvent) => void,
  onMouseLeave?: (event: MouseEvent) => void,
  onPointerEnter?: (event: PointerEvent) => void,
  onPointerLeave?: (event: PointerEvent) => void,
  onTouchStart?: (event: TouchEvent) => void
}

export interface HoverResult {
  hoverProps: ComputedRef<HoverDOMProps>,
  isHovered: ComputedRef<boolean>
}

let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

function normalizePointerType(pointerType: string): PointerType {
  if (pointerType === 'mouse' || pointerType === 'pen' || pointerType === 'touch') {
    return pointerType;
  }

  return 'mouse';
}

function setGlobalIgnoreEmulatedMouseEvents(): void {
  globalIgnoreEmulatedMouseEvents = true;
  setTimeout(() => {
    globalIgnoreEmulatedMouseEvents = false;
  }, 50);
}

function handleGlobalPointerEvent(event: Event): void {
  if (!('pointerType' in event)) {
    return;
  }

  if ((event as PointerEvent).pointerType === 'touch') {
    setGlobalIgnoreEmulatedMouseEvents();
  }
}

function setupGlobalTouchEvents(): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  if (hoverCount === 0) {
    if (typeof PointerEvent !== 'undefined') {
      document.addEventListener('pointerup', handleGlobalPointerEvent as EventListener);
    } else {
      document.addEventListener('touchend', setGlobalIgnoreEmulatedMouseEvents as EventListener);
    }
  }

  hoverCount++;

  return () => {
    if (typeof document === 'undefined') {
      return;
    }

    hoverCount--;
    if (hoverCount > 0) {
      return;
    }

    if (typeof PointerEvent !== 'undefined') {
      document.removeEventListener('pointerup', handleGlobalPointerEvent as EventListener);
    } else {
      document.removeEventListener('touchend', setGlobalIgnoreEmulatedMouseEvents as EventListener);
    }
  };
}

function toElement(target: EventTarget | null): Element | null {
  if (
    target == null ||
    typeof target !== 'object' ||
    !('nodeType' in target) ||
    (target as Node).nodeType !== 1
  ) {
    return null;
  }

  return target as Element;
}

export function useHover(props: HoverProps = {}): HoverResult {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let isHovered = ref(false);
  let state = {
    ignoreEmulatedMouseEvents: false,
    isHovered: false,
    pointerType: '' as PointerType | '',
    target: null as Element | null
  };
  let removeGlobalPointerOverListener: null | (() => void) = null;
  let clearGlobalPointerOverListener = () => {
    if (!removeGlobalPointerOverListener) {
      return;
    }

    removeGlobalPointerOverListener();
    removeGlobalPointerOverListener = null;
  };

  let removeGlobalTouchEvents = setupGlobalTouchEvents();
  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearGlobalPointerOverListener();
      removeGlobalTouchEvents();
    });
  }

  let containsCurrentTarget = (event: Event): boolean => {
    let currentTarget = event.currentTarget;
    if (!currentTarget) {
      return false;
    }

    let eventTarget = getEventTarget(event) ?? currentTarget;
    return nodeContains(currentTarget, eventTarget);
  };

  let triggerHoverStart = (event: Event, pointerType: PointerType) => {
    state.pointerType = pointerType;
    let target = toElement(event.currentTarget);
    if (isDisabled.value || pointerType === 'touch' || state.isHovered || !target || !containsCurrentTarget(event)) {
      return;
    }

    state.isHovered = true;
    state.target = target;

    let hoverEvent: HoverEvent = {
      pointerType,
      target,
      type: 'hoverstart'
    };

    let ownerDocument = target.ownerDocument;
    if (ownerDocument) {
      let onPointerOver = (overEvent: Event) => {
        if (!state.isHovered || !state.target || nodeContains(state.target, getEventTarget(overEvent))) {
          return;
        }

        let nextPointerType = 'pointerType' in overEvent
          ? normalizePointerType((overEvent as PointerEvent).pointerType)
          : 'mouse';
        triggerHoverEnd(overEvent, nextPointerType);
      };

      ownerDocument.addEventListener('pointerover', onPointerOver, true);
      removeGlobalPointerOverListener = () => {
        ownerDocument.removeEventListener('pointerover', onPointerOver, true);
      };
    }

    props.onHoverStart?.(hoverEvent);
    props.onHoverChange?.(true);
    isHovered.value = true;
  };

  let triggerHoverEnd = (_event: Event, pointerType: PointerType) => {
    let target = state.target;
    state.pointerType = '';
    state.target = null;

    if (pointerType === 'touch' || !state.isHovered || !target) {
      return;
    }

    state.isHovered = false;
    clearGlobalPointerOverListener();

    let hoverEvent: HoverEvent = {
      pointerType,
      target,
      type: 'hoverend'
    };

    props.onHoverEnd?.(hoverEvent);
    props.onHoverChange?.(false);
    isHovered.value = false;
  };

  watch(
    isDisabled,
    (nextIsDisabled) => {
      if (nextIsDisabled) {
        triggerHoverEnd({currentTarget: state.target} as unknown as Event, state.pointerType || 'mouse');
      }
    },
    {flush: 'sync'}
  );

  let onPointerEnter = (event: PointerEvent) => {
    if (globalIgnoreEmulatedMouseEvents && event.pointerType === 'mouse') {
      return;
    }

    triggerHoverStart(event, normalizePointerType(event.pointerType));
  };

  let onPointerLeave = (event: PointerEvent) => {
    if (!isDisabled.value && containsCurrentTarget(event)) {
      triggerHoverEnd(event, normalizePointerType(event.pointerType));
    }
  };

  let onMouseEnter = (event: MouseEvent) => {
    if (typeof PointerEvent !== 'undefined') {
      return;
    }

    if (!state.ignoreEmulatedMouseEvents && !globalIgnoreEmulatedMouseEvents) {
      triggerHoverStart(event, 'mouse');
    }

    state.ignoreEmulatedMouseEvents = false;
  };

  let onMouseLeave = (event: MouseEvent) => {
    if (typeof PointerEvent !== 'undefined') {
      return;
    }

    if (!isDisabled.value && containsCurrentTarget(event)) {
      triggerHoverEnd(event, 'mouse');
    }
  };

  let onTouchStart = () => {
    if (typeof PointerEvent !== 'undefined') {
      return;
    }

    state.ignoreEmulatedMouseEvents = true;
  };

  return {
    hoverProps: computed<HoverDOMProps>(() => {
      if (isDisabled.value) {
        return {};
      }

      let hoverHandlers: HoverDOMProps = {
        onPointerEnter,
        onPointerLeave
      };

      if (typeof PointerEvent === 'undefined') {
        hoverHandlers.onMouseEnter = onMouseEnter;
        hoverHandlers.onMouseLeave = onMouseLeave;
        hoverHandlers.onTouchStart = onTouchStart;
      }

      return hoverHandlers;
    }),
    isHovered: computed(() => isHovered.value)
  };
}
