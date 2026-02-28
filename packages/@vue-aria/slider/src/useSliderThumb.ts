import {
  clamp,
  eventHasModifiers,
  getEventPoint,
  getInputNumberValue,
  getSliderThumbId,
  resolveBoolean,
  resolveMaybeRef,
  resolveOptionalString,
  resolveTrackElement,
  sliderData,
  type SliderTrackRef
} from './utils';
import {computed, type ComputedRef, type Ref, ref, unref, watchEffect} from 'vue';
import type {MaybeRef, SliderDirection, SliderOrientation, SliderState} from './types';

export interface AriaSliderThumbOptions {
  'aria-describedby'?: MaybeRef<string | undefined>,
  'aria-details'?: MaybeRef<string | undefined>,
  'aria-errormessage'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  direction?: MaybeRef<SliderDirection>,
  form?: MaybeRef<string | undefined>,
  index?: number,
  inputRef?: Ref<HTMLInputElement | null>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  name?: MaybeRef<string | undefined>,
  orientation?: MaybeRef<SliderOrientation>,
  trackRef: SliderTrackRef,
  validationState?: MaybeRef<'invalid' | 'valid' | undefined>
}

export interface SliderThumbAria {
  inputProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-details'?: string,
    'aria-errormessage'?: string,
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-orientation': SliderOrientation,
    'aria-required'?: true,
    'aria-valuetext': string,
    disabled?: true,
    form?: string,
    id: string,
    max: number,
    min: number,
    name?: string,
    onBlur: () => void,
    onChange: (valueOrEvent: Event | number | string) => void,
    onFocus: () => void,
    onKeyDown: (event: KeyboardEvent) => void,
    step: number,
    tabIndex?: number,
    type: 'range',
    value: number
  }>,
  isDisabled: ComputedRef<boolean>,
  isDragging: ComputedRef<boolean>,
  isFocused: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    id?: string
  }>,
  thumbProps: ComputedRef<{
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
      left?: string,
      position: 'absolute',
      top?: string,
      touchAction: 'none',
      transform: 'translate(-50%, -50%)'
    }
  }>
}

let sliderThumbCounter = 0;

export function useSliderThumb(opts: AriaSliderThumbOptions, state: SliderState): SliderThumbAria {
  sliderThumbCounter += 1;

  let index = opts.index ?? 0;
  let inputRef = opts.inputRef ?? ref<HTMLInputElement | null>(null);
  let orientation = computed<SliderOrientation>(() => {
    let explicitOrientation = resolveMaybeRef(opts.orientation, undefined);
    if (explicitOrientation) {
      return explicitOrientation;
    }

    return resolveMaybeRef(state.orientation, 'horizontal');
  });
  let direction = computed<SliderDirection>(() => resolveMaybeRef(opts.direction, 'ltr'));
  let isVertical = computed(() => orientation.value === 'vertical');
  let isDisabled = computed(() => resolveBoolean(opts.isDisabled) || resolveBoolean(state.isDisabled));
  let isInvalid = computed(() => {
    if (resolveBoolean(opts.isInvalid)) {
      return true;
    }

    return resolveMaybeRef(opts.validationState, undefined) === 'invalid';
  });
  let isRequired = computed(() => resolveBoolean(opts.isRequired));
  let thumbValue = computed(() => unref(state.values)[index] ?? state.getThumbMinValue(index));
  let thumbData = computed(() => sliderData.get(state));

  let thumbId = computed(() => {
    if (thumbData.value) {
      return getSliderThumbId(state, index);
    }

    return `vue-slider-thumb-${sliderThumbCounter}-${index}`;
  });
  let thumbLabelId = computed(() => resolveOptionalString(opts['aria-label']) ? `${thumbId.value}-label` : undefined);
  let ariaLabel = computed(() => resolveOptionalString(opts['aria-label']));
  let describedBy = computed(() => [thumbData.value?.['aria-describedby'], resolveOptionalString(opts['aria-describedby'])].filter(Boolean).join(' ') || undefined);
  let details = computed(() => [thumbData.value?.['aria-details'], resolveOptionalString(opts['aria-details'])].filter(Boolean).join(' ') || undefined);
  let labelledBy = computed(() => {
    let ids = new Set<string>();
    if (thumbData.value?.id) {
      ids.add(thumbData.value.id);
    }

    let externalLabelledBy = resolveOptionalString(opts['aria-labelledby']);
    if (externalLabelledBy) {
      for (let id of externalLabelledBy.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(thumbId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });

  watchEffect(() => {
    state.setThumbEditable(index, !isDisabled.value);
  });

  let focusInput = (): void => {
    inputRef.value?.focus();
  };

  let focusedThumb = computed(() => resolveMaybeRef(state.focusedThumb, undefined));
  let isFocused = computed(() => focusedThumb.value === index);
  let isDragging = computed(() => state.isThumbDragging(index));

  let activePointerId = ref<number | null>(null);

  let updateThumbPosition = (clientX: number, clientY: number): void => {
    let track = resolveTrackElement(opts.trackRef);
    if (!track) {
      return;
    }

    let rect = track.getBoundingClientRect();
    let size = isVertical.value ? rect.height : rect.width;
    if (size <= 0) {
      return;
    }

    let trackStart = isVertical.value ? rect.top : rect.left;
    let clientPosition = isVertical.value ? clientY : clientX;
    let percent = clamp((clientPosition - trackStart) / size, 0, 1);
    if (isVertical.value || direction.value === 'rtl') {
      percent = 1 - percent;
    }

    state.setThumbPercent(index, percent);
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

    activePointerId.value = point.pointerId ?? null;
    focusInput();
    state.setFocusedThumb(index);
    state.setThumbDragging(index, true);
    updateThumbPosition(point.clientX, point.clientY);
  };

  let handleMove = (event: MouseEvent | PointerEvent | TouchEvent): void => {
    if (!state.isThumbDragging(index)) {
      return;
    }

    let point = getEventPoint(event);
    if (!point) {
      return;
    }

    if (activePointerId.value != null && point.pointerId != null && point.pointerId !== activePointerId.value) {
      return;
    }

    updateThumbPosition(point.clientX, point.clientY);
  };

  let handleEnd = (event: MouseEvent | PointerEvent | TouchEvent): void => {
    if (!state.isThumbDragging(index)) {
      return;
    }

    let point = getEventPoint(event);
    if (activePointerId.value != null && point?.pointerId != null && point.pointerId !== activePointerId.value) {
      return;
    }

    activePointerId.value = null;
    state.setThumbDragging(index, false);
  };

  let onKeyDown = (event: KeyboardEvent): void => {
    if (isDisabled.value) {
      return;
    }

    let pageSize = resolveMaybeRef(state.pageSize, 10);
    let step = resolveMaybeRef(state.step, 1);
    let incrementAmount = event.shiftKey ? pageSize : step;

    if (event.key === 'Home') {
      event.preventDefault();
      state.setThumbDragging(index, true);
      state.setThumbValue(index, state.getThumbMinValue(index));
      state.setThumbDragging(index, false);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      state.setThumbDragging(index, true);
      state.setThumbValue(index, state.getThumbMaxValue(index));
      state.setThumbDragging(index, false);
      return;
    }

    if (event.key === 'PageUp') {
      event.preventDefault();
      state.setThumbDragging(index, true);
      if (state.incrementThumb) {
        state.incrementThumb(index, pageSize);
      } else {
        state.setThumbValue(index, clamp(thumbValue.value + pageSize, state.getThumbMinValue(index), state.getThumbMaxValue(index)));
      }
      state.setThumbDragging(index, false);
      return;
    }

    if (event.key === 'PageDown') {
      event.preventDefault();
      state.setThumbDragging(index, true);
      if (state.decrementThumb) {
        state.decrementThumb(index, pageSize);
      } else {
        state.setThumbValue(index, clamp(thumbValue.value - pageSize, state.getThumbMinValue(index), state.getThumbMaxValue(index)));
      }
      state.setThumbDragging(index, false);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      state.setThumbDragging(index, true);

      let shouldIncrement = event.key === 'ArrowUp' || event.key === 'ArrowRight';
      if (!isVertical.value && direction.value === 'rtl' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        shouldIncrement = !shouldIncrement;
      }

      if (shouldIncrement) {
        if (state.incrementThumb) {
          state.incrementThumb(index, incrementAmount);
        } else {
          state.setThumbValue(index, clamp(thumbValue.value + incrementAmount, state.getThumbMinValue(index), state.getThumbMaxValue(index)));
        }
      } else if (state.decrementThumb) {
        state.decrementThumb(index, incrementAmount);
      } else {
        state.setThumbValue(index, clamp(thumbValue.value - incrementAmount, state.getThumbMinValue(index), state.getThumbMaxValue(index)));
      }

      state.setThumbDragging(index, false);
    }
  };

  let thumbPercent = computed(() => {
    let percent = state.getThumbPercent(index);
    if (isVertical.value || direction.value === 'rtl') {
      return 1 - percent;
    }

    return percent;
  });

  return {
    inputProps: computed(() => ({
      id: thumbId.value,
      type: 'range' as const,
      tabIndex: isDisabled.value ? undefined : 0,
      min: state.getThumbMinValue(index),
      max: state.getThumbMaxValue(index),
      step: resolveMaybeRef(state.step, 1),
      value: thumbValue.value,
      name: resolveOptionalString(opts.name),
      form: resolveOptionalString(opts.form),
      disabled: isDisabled.value ? true : undefined,
      'aria-label': ariaLabel.value,
      'aria-labelledby': labelledBy.value,
      'aria-orientation': orientation.value,
      'aria-valuetext': state.getThumbValueLabel(index),
      'aria-required': isRequired.value ? true : undefined,
      'aria-invalid': isInvalid.value ? true : undefined,
      'aria-errormessage': resolveOptionalString(opts['aria-errormessage']),
      'aria-describedby': describedBy.value,
      'aria-details': details.value,
      onFocus: () => {
        state.setFocusedThumb(index);
      },
      onBlur: () => {
        if (resolveMaybeRef(state.focusedThumb, undefined) === index) {
          state.setFocusedThumb(undefined);
        }
      },
      onKeyDown,
      onChange: (valueOrEvent) => {
        let parsedValue = getInputNumberValue(valueOrEvent);
        if (parsedValue == null) {
          return;
        }

        state.setThumbValue(index, parsedValue);
      }
    })),
    isDisabled,
    isDragging,
    isFocused,
    labelProps: computed(() => ({
      id: thumbLabelId.value
    })),
    thumbProps: computed(() => ({
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
        position: 'absolute' as const,
        left: isVertical.value ? undefined : `${thumbPercent.value * 100}%`,
        top: isVertical.value ? `${thumbPercent.value * 100}%` : undefined,
        transform: 'translate(-50%, -50%)' as const,
        touchAction: 'none' as const
      }
    }))
  };
}
