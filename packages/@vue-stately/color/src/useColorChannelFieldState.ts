import {type Color, type ColorChannel, getChannelRange, getColorChannelValue, parseColor, setColorChannelValue} from './Color';
import {computed, type ComputedRef, ref, type Ref} from 'vue';

export interface ColorChannelFieldStateOptions {
  channel: ColorChannel,
  defaultValue?: Color,
  onChange?: (value: Color) => void,
  value?: Ref<Color>
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
  let controlledValue = options.value;
  let internalValue = ref(parseColor(options.defaultValue ?? '#ffffff'));
  let colorValue = controlledValue ?? internalValue;
  let range = getChannelRange(options.channel);

  let numberValue = computed(() => getColorChannelValue(colorValue.value, options.channel));
  let inputValue = ref(String(numberValue.value));

  let setChannelValue = (nextValue: number): void => {
    let nextColor = setColorChannelValue(colorValue.value, options.channel, clamp(nextValue, range.minValue, range.maxValue));
    colorValue.value = nextColor;
    inputValue.value = String(getColorChannelValue(nextColor, options.channel));
    options.onChange?.(nextColor);
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
