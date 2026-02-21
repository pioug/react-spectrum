import {type AriaMeterOptions, type MeterAria, useMeter as useMeterInternal} from './useMeter';
import type {AriaMeterProps} from '@vue-types/meter';

export type {AriaMeterOptions, MeterAria};
export type {MaybeRef} from './types';
export type {AriaMeterProps} from '@vue-types/meter';

export function useMeter(props: AriaMeterProps): MeterAria;
export function useMeter(options: AriaMeterOptions = {}): MeterAria {
  return useMeterInternal(options);
}
