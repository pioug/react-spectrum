import {type SeparatorAria, type SeparatorOptions, useSeparator as useSeparatorInternal} from './useSeparator';

export type SeparatorProps = SeparatorOptions;
export type {SeparatorAria, SeparatorOptions};

export function useSeparator(props: SeparatorProps): SeparatorAria;
export function useSeparator(options: SeparatorOptions = {}): SeparatorAria {
  return useSeparatorInternal(options);
}
