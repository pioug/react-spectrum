import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

export type FocusableElement = HTMLElement | SVGElement;
