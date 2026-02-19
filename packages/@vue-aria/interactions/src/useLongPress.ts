import {computed, type ComputedRef, ref, unref} from 'vue';
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
  let timeoutId = ref<number | null>(null);
  let didLongPress = ref(false);

  let clearTimeoutId = () => {
    if (timeoutId.value == null) {
      return;
    }

    window.clearTimeout(timeoutId.value);
    timeoutId.value = null;
  };

  let {pressProps} = usePress({
    isDisabled: props.isDisabled,
    onPressStart: (event) => {
      if (typeof window === 'undefined' || !isLongPressPointerType(event.pointerType)) {
        return;
      }

      didLongPress.value = false;

      props.onLongPressStart?.({
        ...event,
        type: 'longpressstart'
      });

      timeoutId.value = window.setTimeout(() => {
        didLongPress.value = true;
        props.onLongPress?.({
          ...event,
          type: 'longpress'
        });
        timeoutId.value = null;
      }, Math.max(0, unref(props.threshold) ?? DEFAULT_THRESHOLD));
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
