import {computed, type ComputedRef, unref} from 'vue';
import type {MaybeRef} from './types';

export interface AriaMeterOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  formatOptions?: MaybeRef<Intl.NumberFormatOptions | undefined>,
  id?: MaybeRef<string | undefined>,
  label?: MaybeRef<string | undefined>,
  maxValue?: MaybeRef<number>,
  minValue?: MaybeRef<number>,
  value?: MaybeRef<number>,
  valueLabel?: MaybeRef<string | undefined>
}

export interface MeterAria {
  labelProps: ComputedRef<{
    id?: string
  }>,
  meterProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-valuemax': number,
    'aria-valuemin': number,
    'aria-valuenow': number,
    'aria-valuetext'?: string,
    id: string,
    role: 'meter progressbar'
  }>,
  percentage: ComputedRef<number>,
  value: ComputedRef<number>
}

let meterCounter = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseNumber(value: number | undefined, fallback: number): number {
  if (value == null || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useMeter(options: AriaMeterOptions = {}): MeterAria {
  meterCounter += 1;

  let meterId = computed(() => resolveOptionalString(options.id) ?? `vue-meter-${meterCounter}`);
  let label = computed(() => resolveOptionalString(options.label));
  let labelId = computed(() => `${meterId.value}-label`);

  let minValue = computed(() => parseNumber(unref(options.minValue), 0));
  let maxValue = computed(() => {
    let resolvedMaxValue = parseNumber(unref(options.maxValue), 100);
    return resolvedMaxValue >= minValue.value ? resolvedMaxValue : minValue.value;
  });
  let value = computed(() => {
    let resolvedValue = parseNumber(unref(options.value), minValue.value);
    return clamp(resolvedValue, minValue.value, maxValue.value);
  });

  let percentage = computed(() => {
    let span = maxValue.value - minValue.value;
    if (span === 0) {
      return 0;
    }

    return (value.value - minValue.value) / span;
  });

  let formattedValueLabel = computed(() => {
    let explicitValueLabel = resolveOptionalString(options.valueLabel);
    if (explicitValueLabel) {
      return explicitValueLabel;
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
      ids.add(meterId.value);
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
    meterProps: computed(() => ({
      id: meterId.value,
      role: 'meter progressbar' as const,
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledby.value,
      'aria-valuemin': minValue.value,
      'aria-valuemax': maxValue.value,
      'aria-valuenow': value.value,
      'aria-valuetext': formattedValueLabel.value
    })),
    percentage,
    value
  };
}
