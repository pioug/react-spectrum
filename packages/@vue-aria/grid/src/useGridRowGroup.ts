import {computed, type ComputedRef} from 'vue';

export interface GridRowGroupAria {
  rowGroupProps: ComputedRef<{
    role: 'rowgroup'
  }>
}

export function useGridRowGroup(): GridRowGroupAria {
  let rowGroupProps = computed(() => ({
    role: 'rowgroup' as const
  }));

  return {
    rowGroupProps
  };
}
