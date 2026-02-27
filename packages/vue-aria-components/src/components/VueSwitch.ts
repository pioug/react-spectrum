import {computed, defineComponent, h, ref, watch, type PropType} from 'vue';

const HIDDEN_INPUT_STYLE = {
  border: '0px',
  clip: 'rect(0px, 0px, 0px, 0px)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0px',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px'
} as const;

function isActivationKey(key: string): boolean {
  return key === ' ' || key === 'Enter' || key === 'Spacebar';
}

export const VueSwitch = defineComponent({
  name: 'VueSwitch',
  props: {
    modelValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    defaultSelected: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
    change: (value: boolean) => typeof value === 'boolean',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, slots, attrs}) {
    let isSelected = ref(props.modelValue ?? props.defaultSelected);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isHovered = ref(false);
    let isPressed = ref(false);
    let isKeyboardModality = ref(false);

    let isControlled = computed(() => props.modelValue !== undefined);
    let currentSelected = computed(() => isControlled.value ? Boolean(props.modelValue) : isSelected.value);
    let isInteractionDisabled = computed(() => props.disabled || props.readOnly);

    watch(() => props.modelValue, (nextValue) => {
      if (nextValue !== undefined) {
        isSelected.value = nextValue;
      }
    });

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let checked = target?.checked ?? false;
      if (isInteractionDisabled.value) {
        if (target) {
          target.checked = currentSelected.value;
        }
        return;
      }

      if (!isControlled.value) {
        isSelected.value = checked;
      }

      emit('update:modelValue', checked);
      emit('change', checked);
    };

    let onKeydown = (event: KeyboardEvent) => {
      if (isInteractionDisabled.value) {
        return;
      }

      isKeyboardModality.value = true;
      if (isFocused.value) {
        isFocusVisible.value = true;
      }
      if (isActivationKey(event.key)) {
        isPressed.value = true;
      }
    };

    let onKeyup = () => {
      isPressed.value = false;
    };

    let onPointerdown = () => {
      if (isInteractionDisabled.value) {
        return;
      }

      isKeyboardModality.value = false;
      isPressed.value = true;
    };

    let onPointerup = () => {
      isPressed.value = false;
    };

    let onPointercancel = () => {
      isPressed.value = false;
    };

    let onPointerleave = () => {
      isPressed.value = false;
    };

    let onMouseenter = () => {
      if (isInteractionDisabled.value) {
        return;
      }

      isHovered.value = true;
    };

    let onMouseleave = () => {
      isHovered.value = false;
    };

    let onFocus = (event: FocusEvent) => {
      isFocused.value = true;
      let target = event.currentTarget as HTMLElement | null;
      isFocusVisible.value = Boolean(target?.matches(':focus-visible')) || isKeyboardModality.value;
      emit('focus', event);
    };

    let onBlur = (event: FocusEvent) => {
      isFocused.value = false;
      isFocusVisible.value = false;
      isPressed.value = false;
      emit('blur', event);
    };

    return function render() {
      let rootAttrs = {...attrs} as Record<string, unknown>;
      let ariaLabel = typeof rootAttrs['aria-label'] === 'string'
        ? rootAttrs['aria-label']
        : undefined;
      let ariaLabelledby = typeof rootAttrs['aria-labelledby'] === 'string'
        ? rootAttrs['aria-labelledby']
        : undefined;
      delete rootAttrs['aria-label'];
      delete rootAttrs['aria-labelledby'];

      return h('label', {
        ...rootAttrs,
        class: ['react-aria-Switch', rootAttrs.class],
        'data-rac': '',
        'data-react-aria-pressable': 'true',
        'data-selected': currentSelected.value ? 'true' : undefined,
        'data-pressed': isPressed.value ? 'true' : undefined,
        'data-hovered': isHovered.value ? 'true' : undefined,
        'data-focused': isFocused.value ? 'true' : undefined,
        'data-focus-visible': isFocusVisible.value ? 'true' : undefined,
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-readonly': props.readOnly ? 'true' : undefined,
        onMouseenter,
        onMouseleave
      }, [
        h('span', {style: HIDDEN_INPUT_STYLE}, [
          h('input', {
            'data-react-aria-pressable': 'true',
            tabindex: props.disabled ? undefined : 0,
            type: 'checkbox',
            role: 'switch',
            checked: currentSelected.value,
            disabled: props.disabled,
            readonly: props.readOnly || undefined,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledby,
            onChange,
            onBlur,
            onFocus,
            onKeydown,
            onKeyup,
            onPointercancel,
            onPointerdown,
            onPointerleave,
            onPointerup
          })
        ]),
        ...(slots.default
          ? slots.default()
          : [props.label])
      ]);
    };
  }
});
