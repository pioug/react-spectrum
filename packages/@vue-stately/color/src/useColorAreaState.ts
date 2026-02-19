import {type Color, type ColorChannel, getChannelRange, getColorChannels, getColorChannelValue, parseColor, setColorChannelValue} from './Color';
import {computed, type ComputedRef, type Ref, ref} from 'vue';

export interface ColorAreaProps {
  colorSpace?: 'hsb' | 'hsl' | 'rgb',
  defaultValue?: Color,
  onChange?: (value: Color) => void,
  onChangeEnd?: (value: Color) => void,
  value?: Ref<Color>,
  xChannel?: ColorChannel,
  yChannel?: ColorChannel
}

export interface ColorAreaState {
  channels: {xChannel: ColorChannel, yChannel: ColorChannel, zChannel: ColorChannel},
  defaultValue: Color,
  isDragging: Ref<boolean>,
  value: Ref<Color>,
  xChannelPageStep: number,
  xChannelStep: number,
  xValue: ComputedRef<number>,
  yChannelPageStep: number,
  yChannelStep: number,
  yValue: ComputedRef<number>,
  decrementX: (stepSize?: number) => void,
  decrementY: (stepSize?: number) => void,
  getDisplayColor: () => Color,
  getThumbPosition: () => {x: number, y: number},
  incrementX: (stepSize?: number) => void,
  incrementY: (stepSize?: number) => void,
  setColorFromPoint: (x: number, y: number) => void,
  setDragging: (value: boolean) => void,
  setValue: (value: Color) => void,
  setXValue: (value: number) => void,
  setYValue: (value: number) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useColorAreaState(props: ColorAreaProps): ColorAreaState {
  let controlledValue = props.value;
  let internalValue = ref(parseColor(props.defaultValue ?? '#ffffff'));
  let value = controlledValue ?? internalValue;

  let [xChannel, yChannel, zChannel] = getColorChannels(props.colorSpace ?? 'rgb');
  xChannel = props.xChannel ?? xChannel;
  yChannel = props.yChannel ?? yChannel;

  let xRange = getChannelRange(xChannel);
  let yRange = getChannelRange(yChannel);

  let xValue = computed(() => getColorChannelValue(value.value, xChannel));
  let yValue = computed(() => getColorChannelValue(value.value, yChannel));
  let isDragging = ref(false);

  let setValue = (nextValue: Color): void => {
    value.value = parseColor(nextValue);
    props.onChange?.(value.value);
  };

  let setXValue = (nextValue: number): void => {
    setValue(setColorChannelValue(value.value, xChannel, clamp(nextValue, xRange.minValue, xRange.maxValue)));
  };

  let setYValue = (nextValue: number): void => {
    setValue(setColorChannelValue(value.value, yChannel, clamp(nextValue, yRange.minValue, yRange.maxValue)));
  };

  return {
    value,
    defaultValue: parseColor(props.defaultValue ?? value.value),
    channels: {xChannel, yChannel, zChannel},
    xValue,
    yValue,
    xChannelStep: xRange.step,
    yChannelStep: yRange.step,
    xChannelPageStep: xRange.pageSize,
    yChannelPageStep: yRange.pageSize,
    setValue,
    setXValue,
    setYValue,
    setColorFromPoint: (x: number, y: number) => {
      let nextX = xRange.minValue + clamp(x, 0, 1) * (xRange.maxValue - xRange.minValue);
      let nextY = yRange.minValue + (1 - clamp(y, 0, 1)) * (yRange.maxValue - yRange.minValue);
      setXValue(nextX);
      setYValue(nextY);
    },
    getThumbPosition: () => ({
      x: (xValue.value - xRange.minValue) / (xRange.maxValue - xRange.minValue),
      y: 1 - (yValue.value - yRange.minValue) / (yRange.maxValue - yRange.minValue)
    }),
    incrementX: (stepSize = xRange.step) => {
      setXValue(xValue.value + stepSize);
    },
    decrementX: (stepSize = xRange.step) => {
      setXValue(xValue.value - stepSize);
    },
    incrementY: (stepSize = yRange.step) => {
      setYValue(yValue.value + stepSize);
    },
    decrementY: (stepSize = yRange.step) => {
      setYValue(yValue.value - stepSize);
    },
    isDragging,
    setDragging: (nextDragging: boolean) => {
      let wasDragging = isDragging.value;
      isDragging.value = nextDragging;
      if (wasDragging && !nextDragging) {
        props.onChangeEnd?.(value.value);
      }
    },
    getDisplayColor: () => value.value
  };
}
