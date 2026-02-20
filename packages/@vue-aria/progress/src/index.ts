import {useProgressBar as useProgressBarInternal, type AriaProgressBarOptions, type ProgressBarAria} from './useProgressBar';
import type {AriaProgressBarProps} from '@react-types/progress';

export type {AriaProgressBarOptions, ProgressBarAria};
export type {MaybeRef} from './types';
export type {AriaProgressBarProps} from '@react-types/progress';

export function useProgressBar(props: AriaProgressBarProps): ProgressBarAria;
export function useProgressBar(options: AriaProgressBarOptions = {}): ProgressBarAria {
  return useProgressBarInternal(options);
}
