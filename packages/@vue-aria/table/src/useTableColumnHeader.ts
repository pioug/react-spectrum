import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import type {GridAria, GridKey, MaybeRef} from '@vue-aria/grid';

export type TableSortDirection = 'ascending' | 'descending';

export interface AriaTableColumnHeaderProps {
  allowsSorting?: MaybeRef<boolean>,
  colSpan?: MaybeRef<number | undefined>,
  columnKey: MaybeRef<GridKey>,
  onSort?: (columnKey: GridKey) => void,
  sortDirection?: MaybeRef<TableSortDirection | undefined>,
  table: GridAria
}

export interface TableColumnHeaderAria {
  columnHeaderProps: ComputedRef<{
    'aria-colspan'?: number,
    'aria-sort'?: 'ascending' | 'descending' | 'none',
    onClick: () => void,
    role: 'columnheader',
    tabindex: -1 | 0
  }>,
  isPressed: Ref<boolean>,
  press: () => void
}

export function useTableColumnHeader(props: AriaTableColumnHeaderProps): TableColumnHeaderAria {
  let isPressed = ref(false);
  let columnKey = computed(() => unref(props.columnKey));
  let allowsSorting = computed(() => Boolean(unref(props.allowsSorting)));
  let colSpan = computed(() => unref(props.colSpan));
  let sortDirection = computed(() => unref(props.sortDirection));

  let press = () => {
    if (!allowsSorting.value) {
      return;
    }

    isPressed.value = true;
    props.onSort?.(columnKey.value);
    props.table.setFocused(true);
    props.table.setFocusedKey(columnKey.value);
    isPressed.value = false;
  };

  let ariaSort = computed(() => {
    if (!allowsSorting.value) {
      return undefined;
    }

    return sortDirection.value ?? 'none';
  });

  return {
    columnHeaderProps: computed(() => ({
      role: 'columnheader' as const,
      tabindex: props.table.focusedKey.value === columnKey.value ? 0 : -1,
      'aria-colspan': colSpan.value && colSpan.value > 1 ? colSpan.value : undefined,
      'aria-sort': ariaSort.value,
      onClick: press
    })),
    isPressed,
    press
  };
}
