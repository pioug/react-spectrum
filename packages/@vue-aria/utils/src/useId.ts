import {useSSRSafeId} from '@vue-aria/ssr';

export function useId(defaultId?: string): string {
  return useSSRSafeId(defaultId);
}

export function useSlotId(defaultId?: string): string {
  return useSSRSafeId(defaultId);
}

export function mergeIds(idA?: string, idB?: string): string | undefined {
  if (idA && idB && idA !== idB) {
    return `${idA} ${idB}`;
  }

  return idA ?? idB;
}
