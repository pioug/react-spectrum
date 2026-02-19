import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = ComputedRef<T> | Ref<T> | T;
export type SpinButtonPointerType = 'keyboard' | 'mouse' | 'pen' | 'touch';
export type SpinButtonKeyboardEvent = KeyboardEvent;

export interface SpinButtonPressEvent {
  pointerType?: SpinButtonPointerType,
  preventDefault?: () => void
}
