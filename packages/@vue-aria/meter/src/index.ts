import {useMeter as useMeterInternal, type AriaMeterOptions, type MeterAria} from './useMeter';
import type {AriaMeterProps} from '@react-types/meter';

export type {AriaMeterOptions, MeterAria};
export type {MaybeRef} from './types';
export type {AriaMeterProps} from '@react-types/meter';

export function useMeter(props: AriaMeterProps): MeterAria;
export function useMeter(options: AriaMeterOptions = {}): MeterAria {
  return useMeterInternal(options);
}
