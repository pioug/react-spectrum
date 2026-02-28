import {
  clamp,
  eventHasModifiers,
  getEventPoint,
  getSliderThumbId,
  resolveBoolean,
  resolveOptionalString,
  resolveTrackElement,
  sliderData,
  type SliderPoint,
  type SliderTrackRef
} from './utils';
import {computed, type ComputedRef, getCurrentScope, onScopeDispose, ref, unref, watchEffect} from 'vue';
import type {MaybeRef, SliderDirection, SliderOrientation, SliderState} from './types';

export interface AriaSliderOptions {
  'aria-describedby'?: MaybeRef<string | undefined>,
  'aria-details'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaDescribedby?: MaybeRef<string | undefined>,
  ariaDetails?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  direction?: MaybeRef<SliderDirection>,
  id?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  orientation?: MaybeRef<SliderOrientation>
}

export interface SliderAria {
  groupProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-details'?: string,
    'aria-disabled'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    role: 'group'
  }>,
  labelProps: ComputedRef<{
    id?: string,
    onClick?: () => void
  }>,
  outputProps: ComputedRef<{
    'aria-live': 'off',
    htmlFor: string
  }>,
  trackProps: ComputedRef<{
    onMouseDown: (event: MouseEvent) => void,
    onMouseMove: (event: MouseEvent) => void,
    onMouseUp: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    onPointerMove: (event: PointerEvent) => void,
    onPointerUp: (event: PointerEvent) => void,
    onTouchEnd: (event: TouchEvent) => void,
    onTouchMove: (event: TouchEvent) => void,
    onTouchStart: (event: TouchEvent) => void,
    style: {
      position: 'relative',
      touchAction: 'none'
    }
  }>
}

interface TrackMetrics {
  size: number,
  start: number
}

let sliderCounter = 0;

function getClosestThumbIndex(values: number[], targetValue: number): number {
  if (values.length === 0) {
    return -1;
  }

  let split = values.findIndex((value) => targetValue - value < 0);
  if (split === 0) {
    return 0;
  }

  if (split === -1) {
    return values.length - 1;
  }

  let leftValue = values[split - 1] ?? values[0];
  let rightValue = values[split] ?? values[values.length - 1];
  return Math.abs(leftValue - targetValue) < Math.abs(rightValue - targetValue) ? split - 1 : split;
}

export function useSlider(
  options: AriaSliderOptions = {},
  state: SliderState,
  trackRef: SliderTrackRef
): SliderAria {
  sliderCounter += 1;

  let sliderId = computed(() => resolveOptionalString(options.id) ?? `vue-slider-${sliderCounter}`);
  let label = computed(() => resolveOptionalString(options.label));
  let labelId = computed(() => (label.value ? `${sliderId.value}-label` : undefined));
  let direction = computed<SliderDirection>(() => resolveMaybeDirection(options.direction));
  let orientation = computed<SliderOrientation>(() => {
    let explicitOrientation = resolveOptionalOrientation(options.orientation);
    if (explicitOrientation) {
      return explicitOrientation;
    }

    return resolveOptionalOrientation(state.orientation) ?? 'horizontal';
  });
  let isDisabled = computed(() => resolveBoolean(options.isDisabled) || resolveBoolean(state.isDisabled));
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabelledBy = computed(() => {
    let ids = new Set<string>();
    if (labelId.value) {
      ids.add(labelId.value);
    }

    let labelledBy = ariaLabelledby.value;
    if (labelledBy) {
      for (let id of labelledBy.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(sliderId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });
  let ariaDescribedby = computed(() => resolveOptionalString(options.ariaDescribedby) ?? resolveOptionalString(options['aria-describedby']));
  let ariaDetails = computed(() => resolveOptionalString(options.ariaDetails) ?? resolveOptionalString(options['aria-details']));

  watchEffect(() => {
    sliderData.set(state, {
      id: labelId.value ?? sliderId.value,
      'aria-describedby': ariaDescribedby.value,
      'aria-details': ariaDetails.value
    });
  });

  let activeThumbIndex = ref<number | null>(null);
  let activePointerId = ref<number | null>(null);
  let hasGlobalListeners = false;

  let resolveTrackMetrics = (): TrackMetrics | null => {
    let track = resolveTrackElement(trackRef);
    if (!track) {
      return null;
    }

    let rect = track.getBoundingClientRect();
    let size = orientation.value === 'vertical' ? rect.height : rect.width;
    if (!Number.isFinite(size) || size <= 0) {
      return null;
    }

    return {
      size,
      start: orientation.value === 'vertical' ? rect.top : rect.left
    };
  };

  let getPercentFromPoint = (point: SliderPoint, metrics: TrackMetrics): number => {
    let trackPosition = orientation.value === 'vertical' ? point.clientY : point.clientX;
    let offset = trackPosition - metrics.start;
    let percent = clamp(offset / metrics.size, 0, 1);
    if (orientation.value === 'vertical' || direction.value === 'rtl') {
      percent = 1 - percent;
    }
    return percent;
  };

  let startDraggingFromPoint = (point: SliderPoint): void => {
    let metrics = resolveTrackMetrics();
    if (!metrics) {
      return;
    }

    let values = unref(state.values);
    if (values.every((_, index) => !state.isThumbDragging(index)) === false) {
      return;
    }

    let value = state.getPercentValue(getPercentFromPoint(point, metrics));
    let closestThumbIndex = getClosestThumbIndex(values, value);
    if (closestThumbIndex < 0 || !state.isThumbEditable(closestThumbIndex)) {
      return;
    }

    activeThumbIndex.value = closestThumbIndex;
    activePointerId.value = point.pointerId ?? null;

    state.setFocusedThumb(closestThumbIndex);
    state.setThumbDragging(closestThumbIndex, true);
    state.setThumbValue(closestThumbIndex, value);
  };

  let moveDraggingThumb = (point: SliderPoint): void => {
    if (activeThumbIndex.value == null) {
      return;
    }

    if (activePointerId.value != null && point.pointerId != null && point.pointerId !== activePointerId.value) {
      return;
    }

    let metrics = resolveTrackMetrics();
    if (!metrics) {
      return;
    }

    state.setThumbPercent(activeThumbIndex.value, getPercentFromPoint(point, metrics));
  };

  let stopDraggingThumb = (pointerId?: number): void => {
    if (activeThumbIndex.value == null) {
      return;
    }

    if (activePointerId.value != null && pointerId != null && pointerId !== activePointerId.value) {
      return;
    }

    state.setThumbDragging(activeThumbIndex.value, false);
    activeThumbIndex.value = null;
    activePointerId.value = null;
    removeGlobalListeners();
  };

  let globalMoveListener = (event: Event): void => {
    handleMove(event as MouseEvent | PointerEvent | TouchEvent);
  };

  let globalEndListener = (event: Event): void => {
    handleEnd(event as MouseEvent | PointerEvent | TouchEvent);
  };

  let addGlobalListeners = (): void => {
    if (hasGlobalListeners || typeof window === 'undefined') {
      return;
    }

    window.addEventListener('mousemove', globalMoveListener);
    window.addEventListener('pointermove', globalMoveListener);
    window.addEventListener('touchmove', globalMoveListener);
    window.addEventListener('mouseup', globalEndListener);
    window.addEventListener('pointerup', globalEndListener);
    window.addEventListener('touchend', globalEndListener);
    hasGlobalListeners = true;
  };

  let removeGlobalListeners = (): void => {
    if (!hasGlobalListeners || typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('mousemove', globalMoveListener);
    window.removeEventListener('pointermove', globalMoveListener);
    window.removeEventListener('touchmove', globalMoveListener);
    window.removeEventListener('mouseup', globalEndListener);
    window.removeEventListener('pointerup', globalEndListener);
    window.removeEventListener('touchend', globalEndListener);
    hasGlobalListeners = false;
  };

  let handleStart = (event: MouseEvent | PointerEvent | TouchEvent): void => {
    if (isDisabled.value) {
      return;
    }

    if ('button' in event && typeof event.button === 'number' && eventHasModifiers(event)) {
      return;
    }

    let point = getEventPoint(event);
    if (!point) {
      return;
    }

    event.preventDefault();
    let previousActiveThumbIndex = activeThumbIndex.value;
    startDraggingFromPoint(point);
    if (previousActiveThumbIndex == null && activeThumbIndex.value != null) {
      addGlobalListeners();
    }
  };

  let handleMove = (event: MouseEvent | PointerEvent | TouchEvent): void => {
    let point = getEventPoint(event);
    if (!point) {
      return;
    }

    moveDraggingThumb(point);
  };

  let handleEnd = (event: MouseEvent | PointerEvent | TouchEvent): void => {
    let point = getEventPoint(event);
    stopDraggingThumb(point?.pointerId);
  };

  let focusFirstThumb = (): void => {
    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById(getSliderThumbId(state, 0))?.focus();
  };

  if (getCurrentScope()) {
    onScopeDispose(() => {
      removeGlobalListeners();
    });
  }

  return {
    groupProps: computed(() => ({
      role: 'group' as const,
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledBy.value,
      'aria-describedby': ariaDescribedby.value,
      'aria-details': ariaDetails.value,
      'aria-disabled': isDisabled.value ? true : undefined
    })),
    labelProps: computed(() => {
      if (!label.value) {
        return {};
      }

      return {
        id: labelId.value,
        onClick: focusFirstThumb
      };
    }),
    outputProps: computed(() => ({
      htmlFor: unref(state.values).map((_, index) => getSliderThumbId(state, index)).join(' '),
      'aria-live': 'off' as const
    })),
    trackProps: computed(() => ({
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
      onPointerDown: handleStart,
      onPointerMove: handleMove,
      onPointerUp: handleEnd,
      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
      style: {
        position: 'relative' as const,
        touchAction: 'none' as const
      }
    }))
  };
}

function resolveMaybeDirection(direction: MaybeRef<SliderDirection> | undefined): SliderDirection {
  let resolvedDirection = direction ? unref(direction) : undefined;
  return resolvedDirection === 'rtl' ? 'rtl' : 'ltr';
}

function resolveMaybeRef<T>(value: MaybeRef<T> | undefined): T | undefined {
  return value == null ? undefined : unref(value);
}

function resolveOptionalOrientation(orientation: MaybeRef<SliderOrientation> | undefined): SliderOrientation | undefined {
  let resolvedOrientation = resolveMaybeRef(orientation);
  if (resolvedOrientation === 'vertical' || resolvedOrientation === 'horizontal') {
    return resolvedOrientation;
  }

  return undefined;
}
