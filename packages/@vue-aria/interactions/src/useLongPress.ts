import {computed, getCurrentScope, onScopeDispose, type ComputedRef, ref, unref} from 'vue';
import type {MaybeRef, PointerType} from './types';
import {type PressEvent, usePress} from './usePress';

const DEFAULT_THRESHOLD = 500;

export type LongPressEvent = Omit<PressEvent, 'type'> & {
  type: 'longpress' | 'longpressend' | 'longpressstart'
};

export interface LongPressProps {
  accessibilityDescription?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  onLongPress?: (event: LongPressEvent) => void,
  onLongPressEnd?: (event: LongPressEvent) => void,
  onLongPressStart?: (event: LongPressEvent) => void,
  threshold?: MaybeRef<number>
}

export interface LongPressDOMProps {
  'aria-description'?: string,
  onBlur?: (event: FocusEvent) => void,
  onClick?: (event: MouseEvent) => void,
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void,
  onPointerDown?: (event: PointerEvent) => void,
  onPointerLeave?: (event: PointerEvent) => void
}

export interface LongPressResult {
  longPressProps: ComputedRef<LongPressDOMProps>
}

function isLongPressPointerType(pointerType: PointerType): boolean {
  return pointerType === 'mouse' || pointerType === 'touch';
}

export function useLongPress(props: LongPressProps = {}): LongPressResult {
  let timeoutId = ref<ReturnType<typeof setTimeout> | null>(null);
  let removeTouchContextMenu = ref<(() => void) | null>(null);

  let clearTouchContextMenu = () => {
    if (!removeTouchContextMenu.value) {
      return;
    }

    removeTouchContextMenu.value();
    removeTouchContextMenu.value = null;
  };

  let clearTimeoutId = () => {
    if (timeoutId.value == null) {
      return;
    }

    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  };

  let {pressProps} = usePress({
    isDisabled: props.isDisabled,
    onPressStart: (event) => {
      event.continuePropagation();
      if (!isLongPressPointerType(event.pointerType)) {
        return;
      }

      props.onLongPressStart?.({
        ...event,
        type: 'longpressstart'
      });

      timeoutId.value = setTimeout(() => {
        let ownerDocument = event.target.ownerDocument;
        let ownerWindow = ownerDocument?.defaultView;
        if (ownerWindow && typeof ownerWindow.PointerEvent !== 'undefined') {
          event.target.dispatchEvent(new ownerWindow.PointerEvent('pointercancel', {bubbles: true}));
        } else {
          event.target.dispatchEvent(new Event('pointercancel', {bubbles: true}));
        }

        if (ownerDocument?.activeElement !== event.target && typeof (event.target as {focus?: unknown}).focus === 'function') {
          (event.target as HTMLElement).focus({preventScroll: true});
        }

        props.onLongPress?.({
          ...event,
          type: 'longpress'
        });
        timeoutId.value = null;
      }, Math.max(0, unref(props.threshold) ?? DEFAULT_THRESHOLD));

      if (event.pointerType === 'touch') {
        clearTouchContextMenu();
        let onContextMenu = (contextMenuEvent: Event) => {
          contextMenuEvent.preventDefault();
        };
        event.target.addEventListener('contextmenu', onContextMenu, {once: true});
        removeTouchContextMenu.value = () => {
          event.target.removeEventListener('contextmenu', onContextMenu);
        };

        let ownerWindow = event.target.ownerDocument?.defaultView;
        ownerWindow?.addEventListener('pointerup', () => {
          setTimeout(() => {
            clearTouchContextMenu();
          }, 30);
        }, {once: true});
      }
    },
    onPressEnd: (event) => {
      if (!isLongPressPointerType(event.pointerType)) {
        return;
      }

      clearTimeoutId();

      props.onLongPressEnd?.({
        ...event,
        type: 'longpressend'
      });
    },
    shouldCancelOnPointerExit: true
  });
  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearTimeoutId();
      clearTouchContextMenu();
    });
  }

  return {
    longPressProps: computed<LongPressDOMProps>(() => {
      let accessibilityDescription = unref(props.accessibilityDescription);
      let isDisabled = Boolean(unref(props.isDisabled));

      return {
        ...pressProps.value,
        'aria-description': !isDisabled && props.onLongPress ? accessibilityDescription : undefined
      };
    })
  };
}
