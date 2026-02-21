import '@adobe/spectrum-css-temp/components/fieldgroup/vars.css';
import '@adobe/spectrum-css-temp/components/radio/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, type Ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const fieldGroupStyles: {[key: string]: string} = {};
const radioStyles: {[key: string]: string} = {};


interface RadioGroupContextValue {
  disabled: Ref<boolean>,
  isEmphasized: Ref<boolean>,
  isInvalid: Ref<boolean>,
  modelValue: Ref<string>,
  name: Ref<string>,
  setValue: (value: string) => void
}

type ValidationState = 'invalid' | 'valid';

const radioGroupContextKey: InjectionKey<RadioGroupContextValue> = Symbol('vue-spectrum-radio-group-context');
let radioGroupId = 0;

export const RadioGroup = defineComponent({
  name: 'VueRadioGroup',
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean,
      default: true
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical'
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, slots, attrs}) {
    let generatedName = `vs-radio-group-${++radioGroupId}`;
    let groupName = computed(() => props.name ?? generatedName);
    let descriptionId = computed(() => props.description ? `${groupName.value}-description` : undefined);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);

    provide(radioGroupContextKey, {
      disabled: isDisabled,
      isEmphasized: computed(() => props.isEmphasized),
      isInvalid,
      modelValue: computed(() => props.modelValue),
      name: groupName,
      setValue: (value: string) => emit('update:modelValue', value)
    });

    return () => h('div', {
      ...attrs,
      class: [
        classNames(fieldGroupStyles, 'spectrum-FieldGroup'),
        'vs-radio-group',
        attrs.class
      ],
      'data-vac': ''
    }, [
      props.label ? h('span', {class: 'vs-radio-group__label'}, props.label) : null,
      h('div', {
        class: classNames(
          fieldGroupStyles,
          'spectrum-FieldGroup-group',
          {
            'spectrum-FieldGroup-group--horizontal': props.orientation === 'horizontal'
          },
          props.orientation === 'horizontal' ? 'vs-radio-group--horizontal' : 'vs-radio-group--vertical',
          'vs-radio-group__options'
        ),
        role: 'radiogroup',
        'aria-disabled': isDisabled.value ? 'true' : undefined,
        'aria-invalid': isInvalid.value ? 'true' : undefined,
        'aria-describedby': descriptionId.value
      }, slots.default ? slots.default() : []),
      props.description
        ? h('span', {
          id: descriptionId.value,
          class: 'vs-radio-group__description'
        }, props.description)
        : null
    ]);
  }
});

export const Radio = defineComponent({
  name: 'VueRadio',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      required: true
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let group = inject(radioGroupContextKey, null);

    let isDisabled = computed(() => (props.isDisabled ?? props.disabled) || (group ? group.disabled.value : false));
    let isInvalid = computed(() => (props.isInvalid || props.invalid || (group ? group.isInvalid.value : false)) && !isDisabled.value);
    let isEmphasized = computed(() => {
      if (props.isEmphasized !== undefined) {
        return props.isEmphasized;
      }

      return group ? group.isEmphasized.value : true;
    });
    let isChecked = computed(() => {
      let value = group ? group.modelValue.value : props.modelValue;
      return value === props.value;
    });
    let name = computed(() => group ? group.name.value : props.name);

    let isHovered = ref(false);
    let isFocusVisible = ref(false);

    let rootClassName = computed(() => classNames(
      radioStyles,
      'spectrum-Radio',
      {
        'spectrum-Radio--quiet': !isEmphasized.value,
        'is-disabled': isDisabled.value,
        'is-invalid': isInvalid.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => h('label', {
      ...attrs,
      class: [rootClassName.value, 'vs-radio', attrs.class],
      'data-vac': '',
      onMouseenter: () => {
        if (isDisabled.value) {
          return;
        }

        isHovered.value = true;
      },
      onMouseleave: () => {
        isHovered.value = false;
      }
    }, [
      h('input', {
        class: [classNames(radioStyles, 'spectrum-Radio-input'), 'vs-radio__input'],
        type: 'radio',
        name: name.value,
        value: props.value,
        checked: isChecked.value,
        disabled: isDisabled.value,
        autofocus: props.autoFocus || attrs.autofocus || undefined,
        onChange: (event: Event) => {
          let target = event.currentTarget as HTMLInputElement | null;
          if (!target?.checked) {
            return;
          }

          emit('update:modelValue', props.value);
          emit('change', props.value);
          if (group) {
            group.setValue(props.value);
          }
        },
        onFocus: (event: FocusEvent) => {
          let target = getEventTarget(event);
          if (target instanceof HTMLElement && target.matches(':focus-visible')) {
            isFocusVisible.value = true;
          } else {
            isFocusVisible.value = true;
          }

          emit('focus', event);
        },
        onBlur: (event: FocusEvent) => {
          isFocusVisible.value = false;
          emit('blur', event);
        }
      }),
      h('span', {class: classNames(radioStyles, 'spectrum-Radio-button')}),
      h('span', {class: [classNames(radioStyles, 'spectrum-Radio-label'), 'vs-radio__label']}, slots.default ? slots.default() : (props.label || props.value))
    ]);
  }
});

export const VueRadio = Radio;
export const VueRadioGroup = RadioGroup;
export type {SpectrumRadioGroupProps, SpectrumRadioProps} from '@vue-types/radio';
