import {type Color, type ColorChannel, getChannelRange, getColorChannels, getColorChannelValue, parseColor, setColorChannelValue} from './Color';
import {computed, type ComputedRef, type Ref, ref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

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
  let [value, setValueInternal] = useControlledState(
    props.value,
    parseColor(props.defaultValue ?? '#ffffff'),
    props.onChange
  );

  let [xChannel, yChannel, zChannel] = getColorChannels(props.colorSpace ?? 'rgb');
  xChannel = props.xChannel ?? xChannel;
  yChannel = props.yChannel ?? yChannel;

  let xRange = getChannelRange(xChannel);
  let yRange = getChannelRange(yChannel);

  let xValue = computed(() => getColorChannelValue(value.value, xChannel));
  let yValue = computed(() => getColorChannelValue(value.value, yChannel));
  let isDragging = ref(false);

  let setValue = (nextValue: Color): void => {
    let parsedValue = parseColor(nextValue);
    setValueInternal(parsedValue);
  };

  let setXValue = (nextValue: number): void => {
    let clampedValue = clamp(nextValue, xRange.minValue, xRange.maxValue);
    if (clampedValue === xValue.value) {
      return;
    }

    setValue(setColorChannelValue(value.value, xChannel, clampedValue));
  };

  let setYValue = (nextValue: number): void => {
    let clampedValue = clamp(nextValue, yRange.minValue, yRange.maxValue);
    if (clampedValue === yValue.value) {
      return;
    }

    setValue(setColorChannelValue(value.value, yChannel, clampedValue));
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
      let nextColor: Color | null = null;
      let clampedX = clamp(nextX, xRange.minValue, xRange.maxValue);
      let clampedY = clamp(nextY, yRange.minValue, yRange.maxValue);

      if (clampedX !== xValue.value) {
        nextColor = setColorChannelValue(value.value, xChannel, clampedX);
      }

      if (clampedY !== yValue.value) {
        nextColor = setColorChannelValue(nextColor ?? value.value, yChannel, clampedY);
      }

      if (nextColor != null) {
        setValue(nextColor);
      }
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
