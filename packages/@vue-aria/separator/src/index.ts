import {useSeparator as useSeparatorInternal, type SeparatorAria, type SeparatorOptions} from './useSeparator';

export type SeparatorProps = SeparatorOptions;
export type {SeparatorAria, SeparatorOptions};

export function useSeparator(props: SeparatorProps): SeparatorAria;
export function useSeparator(options: SeparatorOptions = {}): SeparatorAria {
  return useSeparatorInternal(options);
}
