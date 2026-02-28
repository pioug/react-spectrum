import {isFocusVisible as isGlobalFocusVisible, useFocus, useFocusVisibleListener, useFocusWithin} from '@vue-aria/interactions';
import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaFocusRingProps {
  autoFocus?: MaybeRef<boolean>,
  isTextInput?: MaybeRef<boolean>,
  within?: MaybeRef<boolean>
}

export interface FocusRingProps {
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void,
  onFocusin?: (event: FocusEvent) => void,
  onFocusout?: (event: FocusEvent) => void
}

export interface FocusRingAria {
  focusProps: ComputedRef<FocusRingProps>,
  isFocused: Ref<boolean>,
  isFocusVisible: Ref<boolean>
}

export function useFocusRing(props: AriaFocusRingProps = {}): FocusRingAria {
  let autoFocus = computed(() => Boolean(unref(props.autoFocus)));
  let isTextInput = computed(() => Boolean(unref(props.isTextInput)));
  let within = computed(() => Boolean(unref(props.within)));

  let state = {
    isFocused: false,
    isFocusVisible: Boolean(autoFocus.value || isGlobalFocusVisible())
  };
  let isFocused = ref(false);
  let isFocusVisible = ref(Boolean(state.isFocused && state.isFocusVisible));

  let updateState = () => {
    isFocusVisible.value = state.isFocused && state.isFocusVisible;
  };

  let onFocusChange = (nextFocused: boolean) => {
    state.isFocused = nextFocused;
    state.isFocusVisible = isGlobalFocusVisible();
    isFocused.value = nextFocused;
    updateState();
  };

  useFocusVisibleListener(
    (nextFocusVisible) => {
      state.isFocusVisible = nextFocusVisible;
      updateState();
    },
    [],
    {
      enabled: isFocused,
      isTextInput
    }
  );

  let {focusProps: directFocusProps} = useFocus({
    isDisabled: within,
    onFocusChange
  });
  let {focusWithinProps} = useFocusWithin({
    isDisabled: computed(() => !within.value),
    onFocusWithinChange: onFocusChange
  });

  let focusProps = computed<FocusRingProps>(() => {
    return within.value ? focusWithinProps.value : directFocusProps.value;
  });

  return {
    focusProps,
    isFocused,
    isFocusVisible
  };
}
