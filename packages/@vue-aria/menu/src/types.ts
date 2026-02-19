import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
export type MenuKey = string | number;
export type SelectionMode = 'multiple' | 'none' | 'single';
