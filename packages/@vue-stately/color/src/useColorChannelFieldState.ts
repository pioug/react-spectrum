import {type Color, type ColorChannel, getChannelRange, getColorChannelValue, parseColor, setColorChannelValue} from './Color';
import {computed, type ComputedRef, ref, type Ref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

export interface ColorChannelFieldStateOptions {
  channel: ColorChannel,
  defaultValue?: Color,
  onChange?: (value: Color) => void,
  value?: Ref<Color | undefined>
}

export interface ColorChannelFieldState {
  colorValue: Ref<Color>,
  inputValue: Ref<string>,
  numberValue: ComputedRef<number>,
  decrement: (stepSize?: number) => void,
  increment: (stepSize?: number) => void,
  setInputValue: (value: string) => void,
  validate: (value: string) => boolean
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useColorChannelFieldState(options: ColorChannelFieldStateOptions): ColorChannelFieldState {
  let [colorValue, setColorValueInternal] = useControlledState(
    options.value,
    parseColor(options.defaultValue ?? '#000000'),
    options.onChange
  );
  let range = getChannelRange(options.channel);

  let numberValue = computed(() => getColorChannelValue(colorValue.value, options.channel));
  let inputValue = ref(String(numberValue.value));

  let setChannelValue = (nextValue: number): void => {
    let nextColor = setColorChannelValue(colorValue.value, options.channel, clamp(nextValue, range.minValue, range.maxValue));
    if (nextColor === colorValue.value) {
      inputValue.value = String(getColorChannelValue(nextColor, options.channel));
      return;
    }

    setColorValueInternal(nextColor);
    inputValue.value = String(getColorChannelValue(nextColor, options.channel));
  };

  let validate = (nextValue: string): boolean => {
    if (!nextValue.length) {
      return true;
    }

    return /^-?\d+(\.\d+)?$/.test(nextValue);
  };

  return {
    colorValue,
    inputValue,
    numberValue,
    setInputValue: (nextValue: string) => {
      inputValue.value = nextValue;
      if (!validate(nextValue)) {
        return;
      }

      let numericValue = Number(nextValue);
      if (!Number.isNaN(numericValue)) {
        setChannelValue(numericValue);
      }
    },
    increment: (stepSize = range.step) => {
      setChannelValue(numberValue.value + stepSize);
    },
    decrement: (stepSize = range.step) => {
      setChannelValue(numberValue.value - stepSize);
    },
    validate
  };
}

export interface ColorChannelFieldProps extends ColorChannelFieldStateOptions {}
