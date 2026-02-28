import {
  type AriaGridSelectionCheckboxProps,
  type GridAria,
  type GridKey,
  type GridSelectionMode,
  type MaybeRef,
  useGridSelectionCheckbox
} from '@vue-aria/grid';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

export interface AriaTableSelectionCheckboxOptions extends AriaGridSelectionCheckboxProps {
  rowLabelledBy?: MaybeRef<string | undefined>
}

export interface TableSelectionCheckboxAria {
  checkboxProps: ComputedRef<{
    'aria-label': string,
    'aria-labelledby'?: string,
    checked: boolean,
    disabled: boolean,
    id: string,
    onChange: () => void
  }>,
  toggleSelection: () => void
}

export interface AriaTableSelectAllCheckboxOptions {
  ariaLabel?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  keys: MaybeRef<Iterable<GridKey>>,
  selectedKeys: Ref<Set<GridKey>>,
  selectionMode?: MaybeRef<GridSelectionMode>,
  table?: GridAria
}

export interface TableSelectAllCheckboxAria {
  checkboxProps: ComputedRef<{
    'aria-label': string,
    checked: boolean,
    disabled: boolean,
    indeterminate: boolean,
    onChange: () => void
  }>,
  toggleSelectAll: () => void
}

export function useTableSelectionCheckbox(options: AriaTableSelectionCheckboxOptions): TableSelectionCheckboxAria {
  let checkbox = useGridSelectionCheckbox(options);
  let rowLabelledBy = computed(() => {
    if (options.rowLabelledBy === undefined) {
      return undefined;
    }

    return unref(options.rowLabelledBy);
  });

  return {
    checkboxProps: computed(() => ({
      ...checkbox.checkboxProps.value,
      'aria-labelledby': rowLabelledBy.value
        ? `${checkbox.checkboxProps.value.id} ${rowLabelledBy.value}`.trim()
        : undefined
    })),
    toggleSelection: checkbox.toggleSelection
  };
}

export function useTableSelectAllCheckbox(options: AriaTableSelectAllCheckboxOptions): TableSelectAllCheckboxAria {
  let selectionMode = computed(() => unref(options.selectionMode) ?? 'multiple');
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let allKeys = computed(() => Array.from(unref(options.keys), (key) => String(key)));

  let checked = computed(() => {
    if (allKeys.value.length === 0) {
      return false;
    }

    return allKeys.value.every((key) => options.selectedKeys.value.has(key));
  });

  let indeterminate = computed(() => {
    if (allKeys.value.length === 0 || checked.value) {
      return false;
    }

    return allKeys.value.some((key) => options.selectedKeys.value.has(key));
  });

  let toggleSelectAll = () => {
    if (selectionMode.value !== 'multiple' || isDisabled.value) {
      return;
    }

    if (checked.value) {
      options.selectedKeys.value = new Set();
      return;
    }

    options.selectedKeys.value = new Set(allKeys.value);
  };

  return {
    checkboxProps: computed(() => ({
      'aria-label': unref(options.ariaLabel) ?? (selectionMode.value === 'single' ? 'Select row' : 'Select all rows'),
      checked: checked.value,
      indeterminate: indeterminate.value,
      disabled: isDisabled.value || selectionMode.value !== 'multiple' || allKeys.value.length === 0,
      onChange: toggleSelectAll
    })),
    toggleSelectAll
  };
}
