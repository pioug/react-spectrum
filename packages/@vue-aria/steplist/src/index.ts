import {
  type AriaStepListItemOptions,
  type StepListItemAria,
  type StepListState as VueStepListAriaState
} from './types';
import {type StepListAria, useStepList as useStepListInternal, type AriaStepListOptions as VueAriaStepListOptions} from './useStepList';
import {useStepListItem as useStepListItemInternal} from './useStepListItem';

type RefObject<T> = {
  current: T
};
type StepListState<T = unknown> = VueStepListAriaState;
type AriaStepListItemProps = AriaStepListItemOptions;

export type {
  AriaStepListItemOptions,
  StepListItemAria
};
export type {AriaStepListItemProps, StepListState};
export type AriaStepListOptions<T = unknown> = VueAriaStepListOptions;
export type AriaStepListProps<T = unknown> = AriaStepListOptions<T>;
export type {StepListAria};

function isStepListState<T>(value: unknown): value is StepListState<T> {
  return typeof value === 'object' && value != null && 'selectionManager' in value;
}

export function useStepList<T>(
  props: AriaStepListProps<T>,
  state: StepListState<T>,
  ref: RefObject<HTMLOListElement | null>
): StepListAria;
export function useStepList(state: VueStepListAriaState, options?: VueAriaStepListOptions): StepListAria;
export function useStepList(
  stateOrProps: VueStepListAriaState | VueAriaStepListOptions,
  optionsOrState?: VueAriaStepListOptions | StepListState<unknown>
): StepListAria {
  if (isStepListState(optionsOrState)) {
    return useStepListInternal(optionsOrState as unknown as VueStepListAriaState, stateOrProps as VueAriaStepListOptions);
  }

  return useStepListInternal(stateOrProps as VueStepListAriaState, optionsOrState as VueAriaStepListOptions);
}

export function useStepListItem<T>(
  props: AriaStepListItemProps,
  state: StepListState<T>,
  ref: RefObject<HTMLElement | null>
): StepListItemAria;
export function useStepListItem(options: AriaStepListItemOptions, state: VueStepListAriaState): StepListItemAria;
export function useStepListItem(options: AriaStepListItemOptions, state: VueStepListAriaState): StepListItemAria {
  return useStepListItemInternal(options, state);
}
