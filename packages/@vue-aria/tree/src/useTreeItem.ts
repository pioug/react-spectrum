import {type AriaGridListItemOptions, type GridListItemAria, type GridListItemNode, type MaybeRef, useGridListItem} from '@vue-aria/gridlist';
import {computed, type ComputedRef, type Ref, unref} from 'vue';
import type {TreeAria} from './useTree';
import {useLocalizedStringFormatter} from '@vue-aria/i18n';
import {useLabels} from '@vue-aria/utils';

const TREE_MESSAGES = {
  'en-US': {
    collapse: 'Collapse',
    expand: 'Expand'
  }
};

export interface TreeItemNode extends GridListItemNode {
  isExpanded?: boolean
}

export interface AriaTreeItemOptions extends Omit<AriaGridListItemOptions, 'gridList' | 'item'> {
  expandedKeys?: Ref<Set<string>>,
  item: MaybeRef<TreeItemNode>,
  onExpandedChange?: (expandedKeys: Set<string>) => void,
  tree: TreeAria
}

export interface TreeItemAria extends GridListItemAria {
  expandButtonProps: ComputedRef<{
    id?: string,
    'aria-label': string,
    'aria-labelledby'?: string,
    'data-expanded'?: true,
    'data-has-child-items'?: true,
    disabled: boolean,
    onPress: () => void
  }>,
  isExpanded: ComputedRef<boolean>
}

export function useTreeItem(options: AriaTreeItemOptions): TreeItemAria {
  let item = computed(() => unref(options.item));
  let gridListItem = useGridListItem({
    ...options,
    gridList: options.tree,
    item
  });

  let formatter = useLocalizedStringFormatter(TREE_MESSAGES, '@vue-aria/tree');
  let hasChildItems = computed(() => Boolean(item.value.hasChildItems));
  let isExpanded = computed(() => {
    if (options.expandedKeys) {
      return options.expandedKeys.value.has(item.value.key);
    }

    return Boolean(item.value.isExpanded);
  });
  let isDisabled = computed(() => gridListItem.isDisabled.value || !hasChildItems.value);
  let expandButtonLabels = computed(() => {
    return useLabels({
      id: `${gridListItem.rowProps.value.id}-expander`,
      'aria-label': isExpanded.value ? formatter.format('collapse') : formatter.format('expand'),
      'aria-labelledby': gridListItem.rowProps.value.id
    });
  });

  let toggleExpanded = () => {
    if (isDisabled.value || !options.expandedKeys) {
      return;
    }

    let nextExpandedKeys = new Set(options.expandedKeys.value);
    if (nextExpandedKeys.has(item.value.key)) {
      nextExpandedKeys.delete(item.value.key);
    } else {
      nextExpandedKeys.add(item.value.key);
    }

    options.expandedKeys.value = nextExpandedKeys;
    options.onExpandedChange?.(nextExpandedKeys);
  };

  return {
    ...gridListItem,
    expandButtonProps: computed(() => ({
      id: expandButtonLabels.value.id as string | undefined,
      'aria-label': expandButtonLabels.value['aria-label'] as string,
      'aria-labelledby': expandButtonLabels.value['aria-labelledby'],
      'data-expanded': isExpanded.value ? true : undefined,
      'data-has-child-items': hasChildItems.value ? true : undefined,
      disabled: isDisabled.value,
      onPress: toggleExpanded
    })),
    isExpanded
  };
}
