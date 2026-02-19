import {type AriaGridListOptions, type GridListAria, useGridList} from '@vue-aria/gridlist';
import {computed, type ComputedRef} from 'vue';

export interface AriaTreeOptions extends AriaGridListOptions {}

export interface TreeAria extends GridListAria {}

export function useTree(options: AriaTreeOptions): TreeAria {
  let gridList = useGridList(options);
  let gridProps = computed(() => ({
    ...gridList.gridProps.value,
    role: 'treegrid' as const
  })) as unknown as ComputedRef<GridListAria['gridProps']['value']>;

  return {
    ...gridList,
    gridProps
  };
}
