import {computed, type ComputedRef, unref} from 'vue';
import type {MaybeRef} from './types';

export interface AriaProgressBarOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  formatOptions?: MaybeRef<Intl.NumberFormatOptions | undefined>,
  id?: MaybeRef<string | undefined>,
  isIndeterminate?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  maxValue?: MaybeRef<number>,
  minValue?: MaybeRef<number>,
  value?: MaybeRef<number>,
  valueLabel?: MaybeRef<string | undefined>
}

export interface ProgressBarAria {
  labelProps: ComputedRef<{
    id?: string
  }>,
  percentage: ComputedRef<number>,
  progressBarProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-valuemax': number,
    'aria-valuemin': number,
    'aria-valuenow'?: number,
    'aria-valuetext'?: string,
    id: string,
    role: 'progressbar'
  }>,
  value: ComputedRef<number>
}

let progressBarCounter = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function resolveNumericValue(value: number | undefined, fallback: number): number {
  if (value == null || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
}

export function useProgressBar(options: AriaProgressBarOptions = {}): ProgressBarAria {
  progressBarCounter += 1;

  let progressBarId = computed(() => resolveOptionalString(options.id) ?? `vue-progress-bar-${progressBarCounter}`);
  let label = computed(() => resolveOptionalString(options.label));
  let labelId = computed(() => `${progressBarId.value}-label`);

  let minValue = computed(() => resolveNumericValue(unref(options.minValue), 0));
  let maxValue = computed(() => {
    let resolvedMaxValue = resolveNumericValue(unref(options.maxValue), 100);
    return resolvedMaxValue >= minValue.value ? resolvedMaxValue : minValue.value;
  });
  let value = computed(() => {
    let resolvedValue = resolveNumericValue(unref(options.value), minValue.value);
    return clamp(resolvedValue, minValue.value, maxValue.value);
  });
  let isIndeterminate = computed(() => Boolean(unref(options.isIndeterminate)));

  let percentage = computed(() => {
    let span = maxValue.value - minValue.value;
    if (span === 0) {
      return 0;
    }

    return (value.value - minValue.value) / span;
  });

  let valueLabel = computed(() => {
    let explicitValueLabel = resolveOptionalString(options.valueLabel);
    if (explicitValueLabel) {
      return explicitValueLabel;
    }

    if (isIndeterminate.value) {
      return undefined;
    }

    let formatOptions = unref(options.formatOptions) ?? {style: 'percent'};
    let valueToFormat = formatOptions.style === 'percent' ? percentage.value : value.value;
    return new Intl.NumberFormat(undefined, formatOptions).format(valueToFormat);
  });

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabelledby = computed(() => {
    let ids = new Set<string>();
    if (label.value) {
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
      ids.add(progressBarId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });

  return {
    labelProps: computed(() => {
      if (!label.value) {
        return {};
      }

      return {
        id: labelId.value
      };
    }),
    percentage,
    progressBarProps: computed(() => ({
      id: progressBarId.value,
      role: 'progressbar' as const,
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledby.value,
      'aria-valuemin': minValue.value,
      'aria-valuemax': maxValue.value,
      'aria-valuenow': isIndeterminate.value ? undefined : value.value,
      'aria-valuetext': isIndeterminate.value ? undefined : valueLabel.value
    })),
    value
  };
}
