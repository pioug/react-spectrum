import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {mergeProps} from '@vue-aria/utils';
import {useFocusWithin} from '@vue-aria/interactions';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface HiddenStyle {
  [key: string]: number | string
}

export interface AriaVisuallyHiddenOptions {
  isFocusable?: MaybeRef<boolean>,
  style?: MaybeRef<HiddenStyle | undefined>
}

export interface VisuallyHiddenAria {
  isFocused: Ref<boolean>,
  visuallyHiddenProps: ComputedRef<{
    onFocusin?: (event: FocusEvent) => void,
    onFocusout?: (event: FocusEvent) => void,
    style?: HiddenStyle
  }>
}

export const VISUALLY_HIDDEN_STYLES: HiddenStyle = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px'
};

export function useVisuallyHidden(options: AriaVisuallyHiddenOptions = {}): VisuallyHiddenAria {
  let isFocused = ref(false);
  let style = computed(() => unref(options.style));

  let {focusWithinProps} = useFocusWithin({
    isDisabled: computed(() => !unref(options.isFocusable)),
    onFocusWithinChange: (focused) => {
      isFocused.value = focused;
    }
  });

  let combinedStyle = computed<HiddenStyle | undefined>(() => {
    if (isFocused.value) {
      return style.value;
    }

    if (style.value) {
      return {
        ...VISUALLY_HIDDEN_STYLES,
        ...style.value
      };
    }

    return VISUALLY_HIDDEN_STYLES;
  });

  return {
    isFocused,
    visuallyHiddenProps: computed(() => {
      return mergeProps(focusWithinProps.value as Record<string, unknown>, {
        style: combinedStyle.value
      }) as {
        onFocusin?: (event: FocusEvent) => void,
        onFocusout?: (event: FocusEvent) => void,
        style?: HiddenStyle
      };
    })
  };
}
