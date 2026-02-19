import type {ComputedRef, Ref} from 'vue';

export type MaybeRef<T> = ComputedRef<T> | Ref<T> | T;
export type SliderDirection = 'ltr' | 'rtl';
export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderState {
  defaultValues?: MaybeRef<number[]>,
  decrementThumb?: (index: number, amount: number) => void,
  focusedThumb?: MaybeRef<number | undefined>,
  getPercentValue: (percent: number) => number,
  getThumbMaxValue: (index: number) => number,
  getThumbMinValue: (index: number) => number,
  getThumbPercent: (index: number) => number,
  getThumbValueLabel: (index: number) => string,
  incrementThumb?: (index: number, amount: number) => void,
  isDisabled?: MaybeRef<boolean>,
  isThumbDragging: (index: number) => boolean,
  isThumbEditable: (index: number) => boolean,
  orientation?: MaybeRef<SliderOrientation>,
  pageSize?: MaybeRef<number>,
  setFocusedThumb: (index: number | undefined) => void,
  setThumbDragging: (index: number, isDragging: boolean) => void,
  setThumbEditable: (index: number, isEditable: boolean) => void,
  setThumbPercent: (index: number, percent: number) => void,
  setThumbValue: (index: number, value: number) => void,
  step?: MaybeRef<number>,
  values: MaybeRef<number[]>
}
