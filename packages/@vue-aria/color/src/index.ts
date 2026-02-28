import {
  type AriaColorAreaOptions,
  type ColorAreaAria,
  useColorArea as useColorAreaInternal
} from './useColorArea';
import {
  type AriaColorChannelFieldOptions,
  type ColorChannelFieldAria,
  useColorChannelField as useColorChannelFieldInternal
} from './useColorChannelField';
import {
  type AriaColorFieldOptions,
  type ColorFieldAria,
  useColorField as useColorFieldInternal
} from './useColorField';
import {
  type AriaColorSliderOptions,
  type ColorSliderAria,
  useColorSlider as useColorSliderInternal
} from './useColorSlider';
import {
  type AriaColorSwatchOptions,
  type ColorSwatchAria,
  useColorSwatch as useColorSwatchInternal
} from './useColorSwatch';
import {
  type AriaColorWheelOptions,
  type ColorWheelAria,
  useColorWheel as useColorWheelInternal
} from './useColorWheel';
import type {
  AriaColorAreaProps as ReactAriaColorAreaProps,
  AriaColorChannelFieldProps as ReactAriaColorChannelFieldProps,
  AriaColorFieldProps as ReactAriaColorFieldProps,
  AriaColorSliderProps as ReactAriaColorSliderProps,
  AriaColorSwatchProps as ReactAriaColorSwatchProps
} from '@vue-types/color';
import {computed, type Ref} from 'vue';

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type ColorAreaState = AnyRecord;
type ColorSliderState = AnyRecord;
type ColorWheelState = AnyRecord;
type ColorFieldState = AnyRecord;
type ColorChannelFieldState = AnyRecord;

function isRefLike<T>(value: unknown): value is {value: T} {
  return Boolean(value) && typeof value === 'object' && 'value' in (value as AnyRecord);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function readNumber(value: unknown): number | null {
  let resolvedValue = isRefLike<unknown>(value) ? value.value : value;
  if (typeof resolvedValue !== 'number' || Number.isNaN(resolvedValue)) {
    return null;
  }

  return resolvedValue;
}

function readString(value: unknown): string | null {
  let resolvedValue = isRefLike<unknown>(value) ? value.value : value;
  if (typeof resolvedValue !== 'string') {
    return null;
  }

  return resolvedValue;
}

function setRecordValue(record: AnyRecord, key: string, value: unknown): void {
  let currentValue = record[key];
  if (isRefLike<unknown>(currentValue)) {
    currentValue.value = value;
    return;
  }

  record[key] = value;
}

function createColorAreaAxisRef(stateRecord: AnyRecord, axis: 'x' | 'y'): Ref<number> {
  let axisKey = axis === 'x' ? 'xValue' : 'yValue';
  let setterName = axis === 'x' ? 'setXValue' : 'setYValue';
  let fallback = axis === 'x' ? 0 : 1;

  let getPosition = (): {x: number, y: number} | null => {
    let getThumbPosition = stateRecord.getThumbPosition;
    if (typeof getThumbPosition !== 'function') {
      return null;
    }

    let position = getThumbPosition();
    if (!position || typeof position !== 'object') {
      return null;
    }

    let x = readNumber((position as AnyRecord).x);
    let y = readNumber((position as AnyRecord).y);
    if (x == null || y == null) {
      return null;
    }

    return {
      x: clamp(x, 0, 1),
      y: clamp(y, 0, 1)
    };
  };

  return computed<number>({
    get: () => {
      let position = getPosition();
      if (position) {
        return axis === 'x' ? position.x : position.y;
      }

      let value = readNumber(stateRecord[axisKey]);
      if (value == null) {
        return fallback;
      }

      return clamp(value, 0, 1);
    },
    set: (value) => {
      let nextValue = clamp(value, 0, 1);
      let setColorFromPoint = stateRecord.setColorFromPoint;
      if (typeof setColorFromPoint === 'function') {
        let position = getPosition() ?? {x: 0, y: 1};
        if (axis === 'x') {
          setColorFromPoint(nextValue, position.y);
        } else {
          setColorFromPoint(position.x, nextValue);
        }
        return;
      }

      let setAxisValue = stateRecord[setterName];
      if (typeof setAxisValue === 'function') {
        setAxisValue(nextValue);
        return;
      }

      setRecordValue(stateRecord, axisKey, nextValue);
    }
  }) as unknown as Ref<number>;
}

function createSliderValueRef(stateRecord: AnyRecord): Ref<number> {
  return computed<number>({
    get: () => {
      let channelValue = readNumber(stateRecord.channelValue);
      if (channelValue != null) {
        return channelValue;
      }

      let value = readNumber(stateRecord.value);
      if (value != null) {
        return value;
      }

      let getThumbValue = stateRecord.getThumbValue;
      if (typeof getThumbValue === 'function') {
        let thumbValue = readNumber(getThumbValue(0));
        if (thumbValue != null) {
          return thumbValue;
        }
      }

      return 0;
    },
    set: (value) => {
      let nextValue = Number(value);
      if (!Number.isFinite(nextValue)) {
        return;
      }

      let setChannelValue = stateRecord.setChannelValue;
      if (typeof setChannelValue === 'function') {
        setChannelValue(nextValue);
        return;
      }

      let setThumbValue = stateRecord.setThumbValue;
      if (typeof setThumbValue === 'function') {
        setThumbValue(0, nextValue);
        return;
      }

      let currentValue = readNumber(stateRecord.channelValue) ?? readNumber(stateRecord.value);
      if (currentValue != null) {
        let delta = nextValue - currentValue;
        if (delta > 0) {
          let increment = stateRecord.increment;
          if (typeof increment === 'function') {
            increment(delta);
            return;
          }
        } else if (delta < 0) {
          let decrement = stateRecord.decrement;
          if (typeof decrement === 'function') {
            decrement(-delta);
            return;
          }
        } else {
          return;
        }
      }

      let stateValue = stateRecord.value;
      if (typeof stateRecord.setValue === 'function' && (typeof stateValue === 'number' || (isRefLike<unknown>(stateValue) && typeof stateValue.value === 'number'))) {
        stateRecord.setValue(nextValue);
        return;
      }

      setRecordValue(stateRecord, 'channelValue', nextValue);
    }
  }) as unknown as Ref<number>;
}

function createColorWheelAngleRef(stateRecord: AnyRecord): Ref<number> {
  return computed<number>({
    get: () => {
      let hue = readNumber(stateRecord.hue);
      if (hue != null) {
        return ((hue % 360) + 360) % 360;
      }

      return readNumber(stateRecord.angle) ?? 0;
    },
    set: (value) => {
      let nextValue = Number(value);
      if (!Number.isFinite(nextValue)) {
        return;
      }

      let normalizedValue = ((nextValue % 360) + 360) % 360;
      let setHue = stateRecord.setHue;
      if (typeof setHue === 'function') {
        setHue(normalizedValue);
        return;
      }

      setRecordValue(stateRecord, 'hue', normalizedValue);
    }
  }) as unknown as Ref<number>;
}

function createColorWheelRadiusRef(stateRecord: AnyRecord): Ref<number> {
  return computed<number>({
    get: () => {
      let saturation = readNumber(stateRecord.saturation);
      if (saturation != null) {
        let normalizedSaturation = saturation > 1 ? saturation / 100 : saturation;
        return clamp(normalizedSaturation, 0, 1);
      }

      return clamp(readNumber(stateRecord.radius) ?? 0, 0, 1);
    },
    set: (value) => {
      let nextValue = clamp(Number(value), 0, 1);
      if (!Number.isFinite(nextValue)) {
        return;
      }

      let setSaturation = stateRecord.setSaturation;
      if (typeof setSaturation === 'function') {
        setSaturation(nextValue * 100);
        return;
      }

      setRecordValue(stateRecord, 'saturation', nextValue);
    }
  }) as unknown as Ref<number>;
}

function createColorFieldValueRef(stateRecord: AnyRecord): Ref<string> {
  return computed<string>({
    get: () => {
      return readString(stateRecord.inputValue)
        ?? readString(stateRecord.value)
        ?? readString(stateRecord.colorValue)
        ?? '';
    },
    set: (value) => {
      let nextValue = String(value);
      let setInputValue = stateRecord.setInputValue;
      if (typeof setInputValue === 'function') {
        setInputValue(nextValue);
        return;
      }

      setRecordValue(stateRecord, 'inputValue', nextValue);
    }
  }) as unknown as Ref<string>;
}

function createColorChannelFieldValueRef(stateRecord: AnyRecord): Ref<number> {
  return computed<number>({
    get: () => {
      let numberValue = readNumber(stateRecord.numberValue);
      if (numberValue != null) {
        return numberValue;
      }

      let inputValue = readString(stateRecord.inputValue);
      if (inputValue != null) {
        let parsedValue = Number(inputValue);
        if (!Number.isNaN(parsedValue)) {
          return parsedValue;
        }
      }

      return readNumber(stateRecord.value) ?? 0;
    },
    set: (value) => {
      let nextValue = Number(value);
      if (!Number.isFinite(nextValue)) {
        return;
      }

      let setInputValue = stateRecord.setInputValue;
      if (typeof setInputValue === 'function') {
        setInputValue(String(nextValue));
        return;
      }

      let setValue = stateRecord.setValue;
      if (typeof setValue === 'function') {
        setValue(nextValue);
        return;
      }

      setRecordValue(stateRecord, 'numberValue', nextValue);
    }
  }) as unknown as Ref<number>;
}

export type {AriaColorAreaOptions, ColorAreaAria};
export type {AriaColorChannelFieldOptions, ColorChannelFieldAria};
export type {AriaColorFieldOptions, ColorFieldAria};
export type {AriaColorSliderOptions, ColorSliderAria};
export type {AriaColorSwatchOptions, ColorSwatchAria};
export type {AriaColorWheelOptions, ColorWheelAria};

export type AriaColorAreaProps = ReactAriaColorAreaProps;
export type AriaColorChannelFieldProps = ReactAriaColorChannelFieldProps;
export type AriaColorFieldProps = ReactAriaColorFieldProps;
export type AriaColorSliderProps = ReactAriaColorSliderProps;
export type AriaColorSwatchProps = ReactAriaColorSwatchProps;

export function useColorArea(options: AriaColorAreaOptions, state: ColorAreaState): ColorAreaAria;
export function useColorArea(options: AriaColorAreaOptions): ColorAreaAria;
export function useColorArea(options: AriaColorAreaOptions, state?: ColorAreaState): ColorAreaAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    return useColorAreaInternal({
      ...options,
      x: createColorAreaAxisRef(stateRecord, 'x'),
      y: createColorAreaAxisRef(stateRecord, 'y')
    });
  }

  return useColorAreaInternal(options);
}

export function useColorSlider(options: AriaColorSliderOptions, state: ColorSliderState): ColorSliderAria;
export function useColorSlider(options: AriaColorSliderOptions): ColorSliderAria;
export function useColorSlider(options: AriaColorSliderOptions, state?: ColorSliderState): ColorSliderAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let slider = useColorSliderInternal({
      ...options,
      step: options.step ?? readNumber(stateRecord.step) ?? undefined,
      value: createSliderValueRef(stateRecord)
    });

    return {
      ...slider,
      increment: () => {
        let increment = stateRecord.increment;
        if (typeof increment === 'function') {
          increment();
          return;
        }

        let incrementThumb = stateRecord.incrementThumb;
        if (typeof incrementThumb === 'function') {
          incrementThumb(0);
          return;
        }

        slider.increment();
      },
      decrement: () => {
        let decrement = stateRecord.decrement;
        if (typeof decrement === 'function') {
          decrement();
          return;
        }

        let decrementThumb = stateRecord.decrementThumb;
        if (typeof decrementThumb === 'function') {
          decrementThumb(0);
          return;
        }

        slider.decrement();
      }
    };
  }

  return useColorSliderInternal(options);
}

export function useColorWheel(
  options: AriaColorWheelOptions,
  state: ColorWheelState,
  ref: RefObject<HTMLInputElement | null>
): ColorWheelAria;
export function useColorWheel(options: AriaColorWheelOptions): ColorWheelAria;
export function useColorWheel(options: AriaColorWheelOptions, state?: ColorWheelState): ColorWheelAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    return useColorWheelInternal({
      ...options,
      angle: createColorWheelAngleRef(stateRecord),
      radius: createColorWheelRadiusRef(stateRecord)
    });
  }

  return useColorWheelInternal(options);
}

export function useColorField(
  props: AriaColorFieldProps,
  state: ColorFieldState,
  ref: RefObject<HTMLInputElement | null>
): ColorFieldAria;
export function useColorField(options: AriaColorFieldOptions): ColorFieldAria;
export function useColorField(options: AriaColorFieldOptions, state?: ColorFieldState): ColorFieldAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let colorField = useColorFieldInternal({
      ...options,
      isInvalid: options.isInvalid ?? Boolean(stateRecord.isInvalid),
      value: createColorFieldValueRef(stateRecord)
    });

    return {
      ...colorField,
      setValue: (value: string) => {
        colorField.setValue(value);
        let commit = stateRecord.commit;
        if (typeof commit === 'function') {
          commit();
        }
      }
    };
  }

  return useColorFieldInternal(options);
}

export function useColorSwatch(props: AriaColorSwatchProps): ColorSwatchAria;
export function useColorSwatch(options: AriaColorSwatchOptions): ColorSwatchAria;
export function useColorSwatch(options: AriaColorSwatchOptions): ColorSwatchAria {
  return useColorSwatchInternal(options);
}

export function useColorChannelField(
  props: AriaColorChannelFieldProps,
  state: ColorChannelFieldState,
  ref: RefObject<HTMLInputElement | null>
): ColorChannelFieldAria;
export function useColorChannelField(options: AriaColorChannelFieldOptions): ColorChannelFieldAria;
export function useColorChannelField(
  options: AriaColorChannelFieldOptions,
  state?: ColorChannelFieldState
): ColorChannelFieldAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let colorChannelField = useColorChannelFieldInternal({
      ...options,
      step: options.step ?? readNumber(stateRecord.step) ?? undefined,
      value: createColorChannelFieldValueRef(stateRecord)
    });

    return {
      ...colorChannelField,
      increment: () => {
        let increment = stateRecord.increment;
        if (typeof increment === 'function') {
          increment();
          return;
        }

        colorChannelField.increment();
      },
      decrement: () => {
        let decrement = stateRecord.decrement;
        if (typeof decrement === 'function') {
          decrement();
          return;
        }

        colorChannelField.decrement();
      }
    };
  }

  return useColorChannelFieldInternal(options);
}
