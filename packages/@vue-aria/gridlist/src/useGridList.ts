import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {type GridAria, type GridSelectionMode, useGrid} from '@vue-aria/grid';
import {type GridListCollection, type MaybeRef} from './types';

export interface AriaGridListProps {
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  isVirtualized?: MaybeRef<boolean>,
  keyboardNavigationBehavior?: MaybeRef<'arrow' | 'tab'>,
  onAction?: (key: string) => void,
  selectedKeys?: Ref<Set<string>>,
  selectionMode?: MaybeRef<GridSelectionMode>,
  shouldSelectOnPressUp?: MaybeRef<boolean>
}

export interface AriaGridListOptions extends AriaGridListProps {
  collection: MaybeRef<GridListCollection>
}

export interface GridListAria {
  collection: ComputedRef<GridListCollection>,
  grid: GridAria,
  gridProps: GridAria['gridProps'],
  keyboardNavigationBehavior: ComputedRef<'arrow' | 'tab'>,
  rowId: (key: string) => string,
  shouldSelectOnPressUp: ComputedRef<boolean>
}

function normalizeKey(key: string): string {
  return String(key).replace(/\s*/g, '');
}

export function useGridList(options: AriaGridListOptions): GridListAria {
  let collection = computed(() => unref(options.collection));
  let keyboardNavigationBehavior = computed(() => unref(options.keyboardNavigationBehavior) ?? 'arrow');
  let shouldSelectOnPressUp = computed(() => Boolean(unref(options.shouldSelectOnPressUp)));
  let id = computed(() => unref(options.id) ?? 'vue-gridlist');

  let gridCollection = computed(() => ({
    columnCount: 1,
    rows: collection.value.items.map((item) => ({
      key: item.key,
      index: item.index,
      textValue: item.textValue,
      cells: [
        {
          key: `${item.key}-cell`,
          colIndex: 0,
          textValue: item.textValue
        }
      ]
    }))
  }));

  let disabledKeys = computed(() => {
    return collection.value.items.filter((item) => item.isDisabled).map((item) => item.key);
  });

  let grid = useGrid({
    ariaLabel: options.ariaLabel,
    ariaLabelledby: options.ariaLabelledby,
    collection: gridCollection,
    disabledKeys,
    id,
    isVirtualized: options.isVirtualized,
    onRowAction: (key) => {
      options.onAction?.(key);
    },
    selectedKeys: options.selectedKeys,
    selectionMode: options.selectionMode
  });

  let rowId = (key: string) => {
    return `${id.value}-${normalizeKey(key)}`;
  };

  return {
    collection,
    grid,
    gridProps: grid.gridProps,
    keyboardNavigationBehavior,
    rowId,
    shouldSelectOnPressUp
  };
}
