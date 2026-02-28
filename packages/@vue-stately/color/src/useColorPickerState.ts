import {type Color, parseColor} from './Color';
import {computed, ref, type Ref, watch} from 'vue';

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

export function useColorPickerState(props: ColorPickerProps = {}): ColorPickerState {
  let internalValue = ref(parseColor(props.defaultValue ?? '#ffffff'));
  let isControlled = computed(() => props.value !== undefined && props.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let colorValue = computed<Color>({
    get: () => {
      if (isControlled.value && props.value) {
        return props.value.value;
      }

      return internalValue.value;
    },
    set: (nextValue) => {
      if (isControlled.value && props.value) {
        props.value.value = nextValue;
      } else {
        internalValue.value = nextValue;
      }
    }
  }) as Ref<Color>;
  let isOpen = ref(false);

  let setColorValue = (nextValue: Color): void => {
    let nextColor = parseColor(nextValue);
    if (nextColor === colorValue.value) {
      return;
    }

    colorValue.value = nextColor;
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
