import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import type {MaybeRef} from '@vue-aria/grid';

export interface AriaTableColumnResizeProps {
  'aria-label'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  maxWidth?: MaybeRef<number | undefined>,
  minWidth?: MaybeRef<number | undefined>,
  onResize?: (nextWidth: number) => void,
  width: Ref<number>
}

export interface TableColumnResizeAria {
  inputProps: ComputedRef<{
    'aria-label'?: string,
    disabled: boolean,
    max: number,
    min: number,
    onChange: (valueOrEvent: Event | number | string) => void,
    type: 'range',
    value: number
  }>,
  isResizing: Ref<boolean>,
  resizerProps: ComputedRef<{
    onMouseDown: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    onPointerUp: (event?: PointerEvent) => void,
    style: {
      touchAction: 'none'
    }
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function parseNumber(valueOrEvent: Event | number | string): number | null {
  if (typeof valueOrEvent === 'number') {
    return Number.isFinite(valueOrEvent) ? valueOrEvent : null;
  }

  if (typeof valueOrEvent === 'string') {
    let parsed = Number.parseFloat(valueOrEvent);
    return Number.isFinite(parsed) ? parsed : null;
  }

  let target = valueOrEvent.target;
  if (!target || typeof target !== 'object' || !('value' in target)) {
    return null;
  }

  let parsed = Number.parseFloat(String(target.value));
  return Number.isFinite(parsed) ? parsed : null;
}

export function useTableColumnResize(props: AriaTableColumnResizeProps): TableColumnResizeAria {
  let isResizing = ref(false);
  let min = computed(() => unref(props.minWidth) ?? 40);
  let max = computed(() => unref(props.maxWidth) ?? 1000);
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let ariaLabel = computed(() => resolveOptionalString(props.ariaLabel) ?? resolveOptionalString(props['aria-label']));

  let onChange = (valueOrEvent: Event | number | string) => {
    let parsedValue = parseNumber(valueOrEvent);
    if (parsedValue == null) {
      return;
    }

    let clampedValue = Math.min(Math.max(parsedValue, min.value), max.value);
    props.width.value = clampedValue;
    props.onResize?.(clampedValue);
  };

  return {
    inputProps: computed(() => ({
      type: 'range' as const,
      min: min.value,
      max: max.value,
      value: props.width.value,
      disabled: isDisabled.value,
      'aria-label': ariaLabel.value,
      onChange
    })),
    isResizing,
    resizerProps: computed(() => ({
      onMouseDown: (event: MouseEvent) => {
        if (isDisabled.value) {
          return;
        }

        event.preventDefault();
        isResizing.value = true;
      },
      onPointerDown: (event: PointerEvent) => {
        if (isDisabled.value) {
          return;
        }

        event.preventDefault();
        isResizing.value = true;
      },
      onPointerUp: () => {
        isResizing.value = false;
      },
      style: {
        touchAction: 'none' as const
      }
    }))
  };
}
