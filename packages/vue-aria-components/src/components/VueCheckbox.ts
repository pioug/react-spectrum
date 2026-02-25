import {defineComponent, h, ref, watch} from 'vue';

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

export const VueCheckbox = defineComponent({
  name: 'VueCheckbox',
  props: {
    modelValue: {
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
    }
  },
  emits: {
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
    change: (value: boolean) => typeof value === 'boolean',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, slots, attrs}) {
    let isSelected = ref(props.modelValue);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isHovered = ref(false);
    let isPressed = ref(false);
    let isKeyboardModality = ref(false);

    watch(() => props.modelValue, (nextValue) => {
      isSelected.value = nextValue;
    });

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let checked = target?.checked ?? false;
      isSelected.value = checked;
      emit('update:modelValue', checked);
      emit('change', checked);
    };

    let onKeydown = (event: KeyboardEvent) => {
      if (props.disabled) {
        return;
      }

      isKeyboardModality.value = true;
      if (isFocused.value) {
        isFocusVisible.value = true;
      }
      if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') {
        isPressed.value = true;
      }
    };

    let onKeyup = () => {
      isPressed.value = false;
    };

    let onPointerdown = () => {
      if (props.disabled) {
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
      if (props.disabled) {
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
      return h('label', {
        ...attrs,
        class: ['react-aria-Checkbox', attrs.class],
        'data-rac': '',
        'data-react-aria-pressable': 'true',
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-focused': isFocused.value ? 'true' : undefined,
        'data-focus-visible': isFocusVisible.value ? 'true' : undefined,
        'data-hovered': isHovered.value ? 'true' : undefined,
        'data-pressed': isPressed.value ? 'true' : undefined,
        'data-selected': isSelected.value ? 'true' : undefined,
        onMouseenter,
        onMouseleave
      }, [
        h('span', {
          style: HIDDEN_INPUT_STYLE
        }, [
          h('input', {
            'data-react-aria-pressable': 'true',
            tabindex: props.disabled ? undefined : 0,
            type: 'checkbox',
            title: '',
            checked: isSelected.value,
            disabled: props.disabled,
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
