import {type Color, parseColor} from './Color';
import {computed, type ComputedRef, type Ref, ref} from 'vue';
import {useColor} from './useColor';

export interface ColorFieldStateOptions {
  defaultValue?: Color,
  onChange?: (value: Color | null) => void,
  value?: Ref<Color | null>
}

export interface ColorFieldState {
  colorValue: Ref<Color | null>,
  defaultColorValue: Color | null,
  inputValue: Ref<string>,
  isInvalid: ComputedRef<boolean>,
  validationState: ComputedRef<'invalid' | null>,
  commit: () => void,
  decrement: () => void,
  decrementToMin: () => void,
  increment: () => void,
  incrementToMax: () => void,
  setColorValue: (value: Color | null) => void,
  setInputValue: (value: string) => void,
  validate: (value: string) => boolean
}

const MIN_COLOR = '#000000';
const MAX_COLOR = '#ffffff';

function addColorValue(color: Color | null, amount: number): Color {
  let parsed = parseInt((color ?? MIN_COLOR).slice(1), 16);
  let nextInt = Math.min(Math.max(parsed + amount, 0x000000), 0xffffff);
  return `#${nextInt.toString(16).padStart(6, '0')}`;
}

export function useColorFieldState(props: ColorFieldStateOptions = {}): ColorFieldState {
  let controlledColor = props.value;
  let internalColorValue = ref<Color | null>(useColor(props.defaultValue));
  let colorValue = controlledColor ?? internalColorValue;
  let inputValue = ref(colorValue.value ?? '');

  let setColorValue = (nextColor: Color | null): void => {
    let parsedColor = nextColor ? parseColor(nextColor) : null;
    if (parsedColor === colorValue.value) {
      return;
    }

    colorValue.value = parsedColor;
    props.onChange?.(colorValue.value);
  };

  let validate = (nextValue: string): boolean => {
    return nextValue === '' || /^#?[0-9a-f]{0,6}$/i.test(nextValue);
  };

  return {
    colorValue,
    defaultColorValue: useColor(props.defaultValue),
    inputValue,
    setColorValue,
    setInputValue: (nextValue: string) => {
      inputValue.value = nextValue;
    },
    commit: () => {
      if (!inputValue.value.length) {
        setColorValue(null);
        return;
      }

      if (!validate(inputValue.value)) {
        inputValue.value = colorValue.value ?? '';
        return;
      }

      let candidate = inputValue.value.startsWith('#') ? inputValue.value : `#${inputValue.value}`;
      let nextColor = parseColor(candidate);
      setColorValue(nextColor);
      inputValue.value = nextColor;
    },
    increment: () => {
      let nextColor = addColorValue(colorValue.value, 1);
      setColorValue(nextColor);
      inputValue.value = nextColor;
    },
    decrement: () => {
      let nextColor = addColorValue(colorValue.value, -1);
      setColorValue(nextColor);
      inputValue.value = nextColor;
    },
    incrementToMax: () => {
      setColorValue(MAX_COLOR);
      inputValue.value = MAX_COLOR;
    },
    decrementToMin: () => {
      setColorValue(MIN_COLOR);
      inputValue.value = MIN_COLOR;
    },
    validate,
    isInvalid: computed(() => colorValue.value == null && inputValue.value.length > 0),
    validationState: computed(() => (colorValue.value == null && inputValue.value.length > 0 ? 'invalid' : null))
  };
}
