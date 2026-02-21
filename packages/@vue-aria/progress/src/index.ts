import {type AriaProgressBarOptions, type ProgressBarAria, useProgressBar as useProgressBarInternal} from './useProgressBar';
import type {AriaProgressBarProps} from '@vue-types/progress';

export type {AriaProgressBarOptions, ProgressBarAria};
export type {MaybeRef} from './types';
export type {AriaProgressBarProps} from '@vue-types/progress';

export function useProgressBar(props: AriaProgressBarProps): ProgressBarAria;
export function useProgressBar(options: AriaProgressBarOptions = {}): ProgressBarAria {
  return useProgressBarInternal(options);
}
