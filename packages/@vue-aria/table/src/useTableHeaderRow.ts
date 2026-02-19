import {computed, type ComputedRef, unref} from 'vue';
import type {GridRowNode, MaybeRef} from '@vue-aria/grid';

export interface AriaTableHeaderRowProps {
  isVirtualized?: MaybeRef<boolean>,
  row: MaybeRef<GridRowNode>
}

export interface TableHeaderRowAria {
  rowProps: ComputedRef<{
    'aria-rowindex'?: number,
    role: 'row'
  }>
}

export function useTableHeaderRow(props: AriaTableHeaderRowProps): TableHeaderRowAria {
  let row = computed(() => unref(props.row));
  let isVirtualized = computed(() => Boolean(unref(props.isVirtualized)));

  return {
    rowProps: computed(() => ({
      role: 'row' as const,
      'aria-rowindex': isVirtualized.value ? row.value.index + 1 : undefined
    }))
  };
}
