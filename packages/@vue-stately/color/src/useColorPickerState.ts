import {type Color, parseColor} from './Color';
import {ref, type Ref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

export interface ColorPickerProps {
  defaultValue?: Color,
  onChange?: (value: Color) => void,
  value?: Ref<Color | undefined>
}

export interface ColorPickerState {
  colorValue: Ref<Color>,
  isOpen: Ref<boolean>,
  close: () => void,
  open: () => void,
  setColorValue: (value: Color) => void,
  toggle: () => void
}

const DEFAULT_COLOR = '#000000';

export function useColorPickerState(props: ColorPickerProps = {}): ColorPickerState {
  let [colorValue, setColorValueInternal] = useControlledState(
    props.value,
    parseColor(props.defaultValue ?? DEFAULT_COLOR),
    props.onChange
  );
  let isOpen = ref(false);

  let setColorValue = (nextValue: Color): void => {
    let nextColor = parseColor(nextValue);
    setColorValueInternal(nextColor);
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
