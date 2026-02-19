import {type Color, type ColorChannel, getChannelRange, getColorChannelValue, parseColor, setColorChannelValue} from './Color';
import {computed, type ComputedRef, type Ref, ref} from 'vue';

export interface ColorSliderStateOptions {
  channel: ColorChannel,
  defaultValue?: Color,
  locale?: string,
  onChange?: (value: Color) => void,
  onChangeEnd?: (value: Color) => void,
  value?: Ref<Color>
}

export interface ColorSliderState {
  channelValue: ComputedRef<number>,
  defaultValue: Color,
  isDragging: Ref<boolean>,
  pageSize: number,
  step: number,
  value: Ref<Color>,
  decrement: (stepSize?: number) => void,
  getDisplayColor: () => Color,
  getThumbValueLabel: () => string,
  increment: (stepSize?: number) => void,
  setDragging: (value: boolean) => void,
  setValue: (value: Color) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useColorSliderState(props: ColorSliderStateOptions): ColorSliderState {
  let controlledValue = props.value;
  let internalValue = ref(parseColor(props.defaultValue ?? '#ffffff'));
  let value = controlledValue ?? internalValue;
  let range = getChannelRange(props.channel);
  let isDragging = ref(false);
  let channelValue = computed(() => getColorChannelValue(value.value, props.channel));

  let setValue = (nextValue: Color): void => {
    value.value = parseColor(nextValue);
    props.onChange?.(value.value);
  };

  let setChannelValue = (nextValue: number): void => {
    setValue(setColorChannelValue(value.value, props.channel, clamp(nextValue, range.minValue, range.maxValue)));
  };

  return {
    value,
    defaultValue: parseColor(props.defaultValue ?? value.value),
    channelValue,
    step: range.step,
    pageSize: range.pageSize,
    increment: (stepSize = range.step) => {
      setChannelValue(channelValue.value + stepSize);
    },
    decrement: (stepSize = range.step) => {
      setChannelValue(channelValue.value - stepSize);
    },
    getDisplayColor: () => value.value,
    setValue,
    getThumbValueLabel: () => channelValue.value.toLocaleString(props.locale),
    isDragging,
    setDragging: (nextDragging: boolean) => {
      let wasDragging = isDragging.value;
      isDragging.value = nextDragging;
      if (wasDragging && !nextDragging) {
        props.onChangeEnd?.(value.value);
      }
    }
  };
}
