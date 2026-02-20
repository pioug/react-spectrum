import {useDisclosure as useDisclosureInternal, type AriaDisclosureOptions, type DisclosureAria} from './useDisclosure';
import type {DisclosureState} from '@vue-stately/disclosure';

type RefObject<T> = {
  current: T
};

export type AriaDisclosureProps = AriaDisclosureOptions;
export type {AriaDisclosureOptions, DisclosureAria};

export function useDisclosure(
  props: AriaDisclosureProps,
  state: DisclosureState,
  ref: RefObject<HTMLElement | null>
): DisclosureAria;
export function useDisclosure(
  options: AriaDisclosureOptions = {},
  state?: DisclosureState,
  refObject?: RefObject<HTMLElement | null>
): DisclosureAria {
  void state;
  void refObject;
  return useDisclosureInternal(options);
}
