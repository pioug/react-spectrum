import {computed, type ComputedRef, unref} from 'vue';
import type {MaybeRef, StepListState} from './types';

export interface AriaStepListOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>
}

export interface StepListAria {
  listProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    role: 'list'
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useStepList(_state: StepListState, options: AriaStepListOptions = {}): StepListAria {
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']) ?? 'Step list');
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));

  return {
    listProps: computed(() => ({
      role: 'list' as const,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value
    }))
  };
}
