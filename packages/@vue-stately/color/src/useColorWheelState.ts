import {type Color, getColorChannelValue, parseColor, setColorChannelValue} from './Color';
import {computed, type ComputedRef, ref, type Ref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

export interface ColorWheelStateOptions {
  defaultValue?: Color,
  onChange?: (value: Color) => void,
  onChangeEnd?: (value: Color) => void,
  value?: Ref<Color>
}

export interface ColorWheelState {
  defaultValue: Color,
  hue: ComputedRef<number>,
  isDragging: Ref<boolean>,
  saturation: ComputedRef<number>,
  value: Ref<Color>,
  decrementHue: (stepSize?: number) => void,
  decrementSaturation: (stepSize?: number) => void,
  getThumbPosition: () => {x: number, y: number},
  incrementHue: (stepSize?: number) => void,
  incrementSaturation: (stepSize?: number) => void,
  setDragging: (value: boolean) => void,
  setHue: (value: number) => void,
  setSaturation: (value: number) => void,
  setValue: (value: Color) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useColorWheelState(props: ColorWheelStateOptions): ColorWheelState {
  let [value, setValueInternal] = useControlledState(
    props.value,
    parseColor(props.defaultValue ?? '#ffffff'),
    props.onChange
  );
  let isDragging = ref(false);
  let hue = computed(() => getColorChannelValue(value.value, 'hue'));
  let saturation = computed(() => getColorChannelValue(value.value, 'saturation'));

  let setValue = (nextValue: Color): void => {
    let parsedValue = parseColor(nextValue);
    setValueInternal(parsedValue);
  };

  let setHue = (nextHue: number): void => {
    setValue(setColorChannelValue(value.value, 'hue', clamp(nextHue, 0, 360)));
  };

  let setSaturation = (nextSaturation: number): void => {
    setValue(setColorChannelValue(value.value, 'saturation', clamp(nextSaturation, 0, 100)));
  };

  return {
    value,
    defaultValue: parseColor(props.defaultValue ?? value.value),
    hue,
    saturation,
    setValue,
    setHue,
    setSaturation,
    incrementHue: (stepSize = 1) => {
      setHue(hue.value + stepSize);
    },
    decrementHue: (stepSize = 1) => {
      setHue(hue.value - stepSize);
    },
    incrementSaturation: (stepSize = 1) => {
      setSaturation(saturation.value + stepSize);
    },
    decrementSaturation: (stepSize = 1) => {
      setSaturation(saturation.value - stepSize);
    },
    getThumbPosition: () => ({
      x: saturation.value / 100,
      y: 1 - saturation.value / 100
    }),
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
