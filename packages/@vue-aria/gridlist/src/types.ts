import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface GridListItemNode {
  description?: string,
  hasChildItems?: boolean,
  index: number,
  isDisabled?: boolean,
  key: string,
  textValue?: string
}

export interface GridListCollection {
  items: GridListItemNode[]
}
