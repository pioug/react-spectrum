import {type Color, parseColor} from './Color';
import {ref, type Ref} from 'vue';

export interface ColorPickerProps {
  defaultValue?: Color,
  onChange?: (value: Color) => void,
  value?: Ref<Color>
}

export interface ColorPickerState {
  colorValue: Ref<Color>,
  isOpen: Ref<boolean>,
  close: () => void,
  open: () => void,
  setColorValue: (value: Color) => void,
  toggle: () => void
}

export function useColorPickerState(props: ColorPickerProps = {}): ColorPickerState {
  let controlledValue = props.value;
  let internalValue = ref(parseColor(props.defaultValue ?? '#ffffff'));
  let colorValue = controlledValue ?? internalValue;
  let isOpen = ref(false);

  let setColorValue = (nextValue: Color): void => {
    colorValue.value = parseColor(nextValue);
    props.onChange?.(colorValue.value);
  };

  return {
    colorValue,
    isOpen,
    setColorValue,
    open: () => {
      isOpen.value = true;
    },
    close: () => {
      isOpen.value = false;
    },
    toggle: () => {
      isOpen.value = !isOpen.value;
    }
  };
}
