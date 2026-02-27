import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref} from 'vue';

interface RadioGroupContextValue {
  disabled: ComputedRef<boolean>,
  invalid: ComputedRef<boolean>,
  modelValue: ComputedRef<string>,
  name: ComputedRef<string>,
  onBlur: (event: FocusEvent) => void,
  onFocus: (event: FocusEvent) => void,
  setValue: (value: string) => void
}

const radioGroupContextKey: InjectionKey<RadioGroupContextValue> = Symbol('vue-spectrum-radio-group-context');
let radioGroupId = 0;
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

export const VueRadioGroup = defineComponent({
  name: 'VueRadioGroup',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical'
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, slots, attrs}) {
    let generatedName = `vs-radio-group-${++radioGroupId}`;
    let descriptionId = `${generatedName}-description`;
    let groupName = computed(() => props.name ?? generatedName);

    provide(radioGroupContextKey, {
      name: groupName,
      modelValue: computed(() => props.modelValue),
      disabled: computed(() => props.disabled),
      invalid: computed(() => props.invalid),
      onFocus: (event: FocusEvent) => emit('focus', event),
      onBlur: (event: FocusEvent) => emit('blur', event),
      setValue: (value: string) => emit('update:modelValue', value)
    });

    return function render() {
      return h('div', {
        ...attrs,
        class: [
          'react-aria-RadioGroup',
          attrs.class
        ],
        'data-rac': '',
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-invalid': props.invalid ? 'true' : undefined,
        'data-required': props.required ? 'true' : undefined,
        role: 'radiogroup',
        'aria-orientation': props.orientation,
        'aria-disabled': props.disabled ? 'true' : undefined,
        'aria-invalid': props.invalid ? 'true' : undefined,
        'aria-required': props.required ? 'true' : undefined,
        'aria-describedby': props.description ? descriptionId : undefined
      }, [
        props.label ? h('span', {class: 'react-aria-Label'}, props.label) : null,
        ...(slots.default ? slots.default() : []),
        props.description ? h('span', {id: descriptionId, class: 'react-aria-Text'}, props.description) : null
      ]);
    };
  }
});

export const VueRadio = defineComponent({
  name: 'VueRadio',
  props: {
    value: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, slots, attrs}) {
    let group = inject(radioGroupContextKey, null);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isKeyboardModality = ref(false);
    let isPressed = ref(false);

    let isDisabled = computed(() => props.disabled || (group ? group.disabled.value : false));
    let isInvalid = computed(() => group ? group.invalid.value : false);
    let isChecked = computed(() => {
      let value = group ? group.modelValue.value : props.modelValue;
      return value === props.value;
    });
    let name = computed(() => group ? group.name.value : props.name);

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      if (!target?.checked) {
        return;
      }

      emit('update:modelValue', props.value);
      emit('change', props.value);
      if (group) {
        group.setValue(props.value);
      }
    };

    return function render() {
      return h('label', {
        ...attrs,
        class: ['react-aria-Radio', attrs.class],
        'data-rac': '',
        'data-react-aria-pressable': 'true',
        'data-selected': isChecked.value ? 'true' : undefined,
        'data-disabled': isDisabled.value ? 'true' : undefined,
        'data-invalid': isInvalid.value ? 'true' : undefined,
        'data-focused': isFocused.value ? 'true' : undefined,
        'data-focus-visible': isFocusVisible.value ? 'true' : undefined,
        'data-pressed': isPressed.value ? 'true' : undefined,
        onMouseleave: () => {
          isPressed.value = false;
        }
      }, [
        h('span', {style: HIDDEN_INPUT_STYLE}, [
          h('input', {
            type: 'radio',
            name: name.value,
            value: props.value,
            checked: isChecked.value,
            disabled: isDisabled.value,
            onChange,
            onFocus: (event: FocusEvent) => {
              isFocused.value = true;
              let target = event.currentTarget as HTMLElement | null;
              isFocusVisible.value = Boolean(target?.matches(':focus-visible')) || isKeyboardModality.value;
              emit('focus', event);
              group?.onFocus(event);
            },
            onBlur: (event: FocusEvent) => {
              isFocused.value = false;
              isFocusVisible.value = false;
              isPressed.value = false;
              emit('blur', event);
              group?.onBlur(event);
            },
            onKeydown: (event: KeyboardEvent) => {
              isKeyboardModality.value = true;
              if (event.key === ' ' || event.key === 'Enter') {
                isPressed.value = true;
              }
            },
            onKeyup: () => {
              isPressed.value = false;
            },
            onPointerdown: () => {
              if (isDisabled.value) {
                return;
              }
              isKeyboardModality.value = false;
              isPressed.value = true;
            },
            onPointerup: () => {
              isPressed.value = false;
            },
            onPointercancel: () => {
              isPressed.value = false;
            }
          })
        ]),
        h('span', {class: 'react-aria-RadioLabel'}, slots.default ? slots.default() : (props.label || props.value))
      ]);
    };
  }
});
