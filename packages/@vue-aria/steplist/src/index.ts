import {
  type AriaStepListItemOptions,
  type StepListItemAria,
  type StepListState as VueStepListAriaState
} from './types';
import {useStepList as useStepListInternal, type AriaStepListOptions as VueAriaStepListOptions, type StepListAria} from './useStepList';
import {useStepListItem as useStepListItemInternal} from './useStepListItem';
import type {StepListState as StatelyStepListState} from '@vue-stately/steplist';

type RefObject<T> = {
  current: T
};

export type {
  AriaStepListItemOptions,
  StepListItemAria,
  VueStepListAriaState as StepListState
};
export type {AriaStepListItemOptions as AriaStepListItemProps};
export type AriaStepListOptions<T = unknown> = VueAriaStepListOptions;
export type AriaStepListProps<T = unknown> = AriaStepListOptions<T>;
export type {StepListAria};

function isStatelyStepListState<T>(value: unknown): value is StatelyStepListState<T> {
  return typeof value === 'object' && value != null && 'selectionManager' in value;
}

export function useStepList<T>(
  props: AriaStepListProps<T>,
  state: StatelyStepListState<T>,
  ref: RefObject<HTMLOListElement | null>
): StepListAria;
export function useStepList(state: VueStepListAriaState, options?: VueAriaStepListOptions): StepListAria;
export function useStepList(
  stateOrProps: VueStepListAriaState | VueAriaStepListOptions,
  optionsOrState?: VueAriaStepListOptions | StatelyStepListState<unknown>
): StepListAria {
  if (isStatelyStepListState(optionsOrState)) {
    return useStepListInternal(optionsOrState as unknown as VueStepListAriaState, stateOrProps as VueAriaStepListOptions);
  }

  return useStepListInternal(stateOrProps as VueStepListAriaState, optionsOrState as VueAriaStepListOptions);
}

export function useStepListItem<T>(
  props: AriaStepListItemOptions,
  state: StatelyStepListState<T>,
  ref: RefObject<HTMLElement | null>
): StepListItemAria;
export function useStepListItem(options: AriaStepListItemOptions, state: VueStepListAriaState): StepListItemAria;
export function useStepListItem(options: AriaStepListItemOptions, state: VueStepListAriaState): StepListItemAria {
  return useStepListItemInternal(options, state);
}
