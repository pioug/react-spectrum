import {computed, defineComponent, h, ref, watch, type PropType} from 'vue';

let numberFieldId = 0;

function normalizeNumericInput(value: string): number | null {
  let normalized = value.replace(/[^0-9.+-]/g, '');
  if (normalized.trim() === '') {
    return null;
  }

  let parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampValue(value: number, minValue?: number, maxValue?: number): number {
  let min = minValue ?? Number.NEGATIVE_INFINITY;
  let max = maxValue ?? Number.POSITIVE_INFINITY;
  return Math.min(max, Math.max(min, value));
}

export const VueNumberField = defineComponent({
  name: 'VueNumberField',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: Number as PropType<number | null | undefined>,
      default: undefined
    },
    defaultValue: {
      type: Number as PropType<number | null | undefined>,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    max: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    minValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    maxValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions | undefined>,
      default: undefined
    },
    isWheelDisabled: {
      type: Boolean,
      default: false
    },
    validate: {
      type: Function as PropType<(value: number) => string | null>,
      default: undefined
    }
  },
  emits: {
    'update:modelValue': (value: number | null) => value === null || typeof value === 'number',
    change: (value: number | null) => value === null || typeof value === 'number',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-number-field-${++numberFieldId}`;
    let inputId = computed(() => props.id ?? generatedId);
    let isControlled = computed(() => props.modelValue !== undefined);
    let internalValue = ref<number | null>(props.modelValue ?? props.defaultValue ?? null);
    let minValue = computed(() => props.minValue ?? props.min);
    let maxValue = computed(() => props.maxValue ?? props.max);

    watch(() => props.modelValue, (nextValue) => {
      if (nextValue === undefined) {
        return;
      }
      internalValue.value = nextValue;
    });

    let currentValue = computed(() => isControlled.value ? (props.modelValue ?? null) : internalValue.value);
    let formatter = computed(() => {
      let formatOptions = props.formatOptions ?? {};
      return new Intl.NumberFormat('en-US', formatOptions);
    });

    let validationMessage = computed(() => {
      if (props.validate && currentValue.value != null) {
        return props.validate(currentValue.value);
      }
      return null;
    });

    let isInvalid = computed(() => props.invalid || Boolean(validationMessage.value));
    let displayValue = computed(() => {
      if (currentValue.value == null) {
        return '';
      }
      return formatter.value.format(currentValue.value);
    });

    let isDecrementDisabled = computed(() => {
      if (props.disabled) {
        return true;
      }
      if (currentValue.value == null) {
        return false;
      }
      if (minValue.value == null) {
        return false;
      }
      return currentValue.value <= minValue.value;
    });

    let isIncrementDisabled = computed(() => {
      if (props.disabled) {
        return true;
      }
      if (currentValue.value == null) {
        return false;
      }
      if (maxValue.value == null) {
        return false;
      }
      return currentValue.value >= maxValue.value;
    });

    let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);
    let errorId = computed(() => validationMessage.value ? `${inputId.value}-error` : undefined);
    let describedBy = computed(() => [descriptionId.value, errorId.value].filter(Boolean).join(' ') || undefined);

    let emitValue = (nextValue: number | null) => {
      if (!isControlled.value) {
        internalValue.value = nextValue;
      }
      emit('update:modelValue', nextValue);
      emit('change', nextValue);
    };

    let setSteppedValue = (direction: 1 | -1) => {
      if (props.disabled) {
        return;
      }
      let base = currentValue.value ?? minValue.value ?? 0;
      let nextValue = clampValue(base + (direction * props.step), minValue.value, maxValue.value);
      emitValue(nextValue);
    };

    let onInput = (event: Event) => {
      if (props.disabled) {
        return;
      }
      let target = event.currentTarget as HTMLInputElement | null;
      let parsed = normalizeNumericInput(target?.value ?? '');
      if (parsed == null) {
        emitValue(null);
        return;
      }
      emitValue(clampValue(parsed, minValue.value, maxValue.value));
    };

    let onWheel = (event: WheelEvent) => {
      if (props.disabled || props.isWheelDisabled) {
        return;
      }
      event.preventDefault();
      setSteppedValue(event.deltaY > 0 ? -1 : 1);
    };

    return function render() {
      return h('div', {
        ...attrs,
        class: ['react-aria-NumberField', attrs.class],
        'data-rac': '',
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-invalid': isInvalid.value ? 'true' : undefined,
        'data-required': props.required ? 'true' : undefined
      }, [
        props.label ? h('label', {class: 'react-aria-Label', for: inputId.value}, props.label) : null,
        h('div', {
          class: 'react-aria-Group',
          'data-rac': '',
          role: 'group',
          style: {display: 'flex'}
        }, [
          h('button', {
            'aria-label': 'Decrease',
            class: 'react-aria-Button',
            'data-rac': '',
            'data-disabled': isDecrementDisabled.value ? 'true' : undefined,
            'data-react-aria-pressable': 'true',
            disabled: isDecrementDisabled.value,
            tabindex: -1,
            type: 'button',
            onClick: () => setSteppedValue(-1)
          }, '-'),
          h('input', {
            id: inputId.value,
            'aria-roledescription': 'Number field',
            autocomplete: 'off',
            autocorrect: 'off',
            class: 'react-aria-Input',
            'data-rac': '',
            disabled: props.disabled,
            inputmode: 'numeric',
            placeholder: props.placeholder || undefined,
            required: props.required,
            spellcheck: false,
            tabindex: 0,
            type: 'text',
            value: displayValue.value,
            'aria-invalid': isInvalid.value ? 'true' : undefined,
            'aria-describedby': describedBy.value,
            onInput,
            onWheel,
            onFocus: (event: FocusEvent) => emit('focus', event),
            onBlur: (event: FocusEvent) => emit('blur', event)
          }),
          h('button', {
            'aria-label': 'Increase',
            class: 'react-aria-Button',
            'data-rac': '',
            'data-disabled': isIncrementDisabled.value ? 'true' : undefined,
            'data-react-aria-pressable': 'true',
            disabled: isIncrementDisabled.value,
            tabindex: -1,
            type: 'button',
            onClick: () => setSteppedValue(1)
          }, '+')
        ]),
        props.description
          ? h('span', {id: descriptionId.value, class: 'react-aria-Text'}, props.description)
          : null,
        validationMessage.value
          ? h('span', {id: errorId.value, class: 'react-aria-FieldError'}, validationMessage.value)
          : null
      ]);
    };
  }
});
