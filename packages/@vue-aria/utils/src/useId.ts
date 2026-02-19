import {useSSRSafeId} from '@vue-aria/ssr';

export function useId(defaultId?: string): string {
  return useSSRSafeId(defaultId);
}

export function useSlotId(depArray?: ReadonlyArray<any>): string;
export function useSlotId(defaultId?: string): string;
export function useSlotId(depArrayOrDefaultId?: ReadonlyArray<unknown> | string): string {
  if (typeof depArrayOrDefaultId === 'string') {
    return useSSRSafeId(depArrayOrDefaultId);
  }

  return useSSRSafeId();
}

export function mergeIds(idA: string, idB: string): string;
export function mergeIds(idA?: string, idB?: string): string | undefined;
export function mergeIds(idA?: string, idB?: string): string | undefined {
  if (idA && idB && idA !== idB) {
    return `${idA} ${idB}`;
  }

  return idA ?? idB;
}
