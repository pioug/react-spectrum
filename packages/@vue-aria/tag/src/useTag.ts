import {computed, type ComputedRef, type Ref, unref} from 'vue';
import type {TagGroupAria, TagGroupItemNode} from './useTagGroup';
import {useGridListItem} from '@vue-aria/gridlist';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaTagOptions {
  'aria-errormessage'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  item: MaybeRef<TagGroupItemNode>,
  tagGroup: TagGroupAria
}

export interface TagAria {
  allowsRemoving: ComputedRef<boolean>,
  gridCellProps: ComputedRef<{
    'aria-colindex'?: number,
    'aria-errormessage'?: string,
    'aria-label'?: string,
    role: 'gridcell'
  }>,
  isDisabled: ComputedRef<boolean>,
  isPressed: ReturnType<typeof useGridListItem>['isPressed'],
  isSelected: ReturnType<typeof useGridListItem>['isSelected'],
  removeButtonProps: ComputedRef<{
    'aria-label': string,
    'aria-labelledby': string,
    id: string,
    isDisabled: boolean,
    onPress: () => void
  }>,
  rowProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-disabled'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-rowindex'?: number,
    'aria-selected'?: boolean,
    id: string,
    onKeyDown?: (event: KeyboardEvent) => void,
    role: 'row',
    tabIndex: -1 | 0
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function normalizeKey(key: string): string {
  return key.replace(/\s*/g, '');
}

export function useTag(options: AriaTagOptions): TagAria {
  let item = computed(() => unref(options.item));
  let gridListItem = useGridListItem({
    gridList: options.tagGroup.grid,
    item
  });

  let isDisabled = computed(() => Boolean(gridListItem.isDisabled.value));
  let allowsRemoving = computed(() => Boolean(options.tagGroup.onRemove));

  let remove = () => {
    if (isDisabled.value || !allowsRemoving.value) {
      return;
    }

    options.tagGroup.remove([item.value.key]);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Delete' && event.key !== 'Backspace') {
      return;
    }

    event.preventDefault();

    if (!allowsRemoving.value || isDisabled.value) {
      return;
    }

    if (gridListItem.isSelected.value) {
      options.tagGroup.remove(options.tagGroup.selectedKeys.value);
      return;
    }

    remove();
  };

  let isItemFocused = computed(() => options.tagGroup.grid.grid.focusedKey.value === item.value.key);
  let hasFocusedItem = computed(() => options.tagGroup.grid.grid.focusedKey.value != null);

  let rowProps = computed(() => {
    let tabIndex: -1 | 0 = !isDisabled.value && (isItemFocused.value || !hasFocusedItem.value) ? 0 : -1;

    return {
      ...gridListItem.rowProps.value,
      tabIndex,
      onKeyDown: allowsRemoving.value ? onKeyDown : undefined
    };
  });

  let gridCellProps = computed(() => ({
    ...gridListItem.gridCellProps.value,
    'aria-label': resolveOptionalString(options['aria-label']),
    'aria-errormessage': resolveOptionalString(options['aria-errormessage'])
  }));

  let removeButtonId = computed(() => `vue-tag-remove-${normalizeKey(item.value.key)}`);

  let removeButtonProps = computed(() => ({
    id: removeButtonId.value,
    isDisabled: isDisabled.value,
    'aria-label': 'Remove tag',
    'aria-labelledby': `${removeButtonId.value} ${rowProps.value.id}`,
    onPress: remove
  }));

  return {
    allowsRemoving,
    gridCellProps,
    isDisabled,
    isPressed: gridListItem.isPressed,
    isSelected: gridListItem.isSelected,
    removeButtonProps,
    rowProps
  };
}
