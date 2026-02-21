import '@adobe/spectrum-css-temp/components/checkbox/vars.css';
import '@adobe/spectrum-css-temp/components/fieldgroup/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, type Ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
import type {SpectrumCheckboxGroupProps, SpectrumCheckboxProps} from '@vue-types/checkbox';
const checkboxStyles: {[key: string]: string} = {};
const fieldgroupStyles: {[key: string]: string} = {};


type ValidationState = 'invalid' | 'valid';
type CheckboxValue = string | number;

interface CheckboxGroupContextValue {
  disabled: Ref<boolean>,
  invalid: Ref<boolean>,
  modelValue: Ref<CheckboxValue[]>,
  setChecked: (value: CheckboxValue, checked: boolean) => void
}

const checkboxGroupContextKey: InjectionKey<CheckboxGroupContextValue> = Symbol('vue-spectrum-checkbox-group-context');
let checkboxGroupId = 0;

export const Checkbox = defineComponent({
  name: 'VueCheckbox',
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
      type: Boolean,
      default: false
    },
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number] as PropType<CheckboxValue | undefined>,
      default: undefined
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: boolean) => typeof value === 'boolean',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: boolean) => typeof value === 'boolean'
  },
  setup(props, {emit, slots, attrs}) {
    let group = inject(checkboxGroupContextKey, null);
    let isHovered = ref(false);
    let isFocusVisible = ref(false);

    let isDisabled = computed(() => (props.isDisabled ?? props.disabled) || (group ? group.disabled.value : false));
    let isInvalid = computed(() => {
      let ownInvalid = props.isInvalid || props.invalid || props.validationState === 'invalid';
      let groupInvalid = group ? group.invalid.value : false;
      return (ownInvalid || groupInvalid) && !isDisabled.value;
    });
    let isChecked = computed(() => {
      if (group && props.value !== undefined) {
        return group.modelValue.value.includes(props.value);
      }

      return props.isSelected || props.modelValue;
    });

    let rootClassName = computed(() => classNames(
      checkboxStyles,
      'spectrum-Checkbox',
      {
        'is-checked': isChecked.value,
        'is-indeterminate': props.isIndeterminate,
        'spectrum-Checkbox--quiet': !props.isEmphasized,
        'is-invalid': isInvalid.value,
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => h('label', {
      ...attrs,
      'data-vac': '',
      class: [rootClassName.value, 'vs-checkbox', attrs.class],
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
        class: [classNames(checkboxStyles, 'spectrum-Checkbox-input'), 'vs-checkbox__input'],
        type: 'checkbox',
        value: props.value,
        checked: isChecked.value,
        disabled: isDisabled.value,
        autofocus: props.autoFocus || attrs.autofocus || undefined,
        onChange: (event: Event) => {
          let target = event.currentTarget as HTMLInputElement | null;
          let checked = target?.checked ?? false;
          if (group && props.value !== undefined) {
            group.setChecked(props.value, checked);
          } else {
            emit('update:modelValue', checked);
          }
          emit('change', checked);
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
      h('span', {class: classNames(checkboxStyles, 'spectrum-Checkbox-box')}, [
        props.isIndeterminate
          ? h('span', {class: classNames(checkboxStyles, 'spectrum-Checkbox-partialCheckmark'), 'aria-hidden': 'true'}, '\u2212')
          : h('span', {class: classNames(checkboxStyles, 'spectrum-Checkbox-checkmark'), 'aria-hidden': 'true'}, '\u2713')
      ]),
      h('span', {class: [classNames(checkboxStyles, 'spectrum-Checkbox-label'), 'vs-checkbox__label']}, slots.default ? slots.default() : props.label)
    ]);
  }
});

export const CheckboxGroup = defineComponent({
  name: 'VueCheckboxGroup',
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: ''
    },
    invalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
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
      type: Array as PropType<CheckboxValue[]>,
      default: () => []
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    'update:modelValue': (value: CheckboxValue[]) => Array.isArray(value),
    change: (value: CheckboxValue[]) => Array.isArray(value)
  },
  setup(props, {attrs, slots, emit}) {
    let groupId = `vs-checkbox-group-${++checkboxGroupId}`;
    let descriptionId = computed(() => props.description ? `${groupId}-description` : undefined);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !props.isDisabled);

    provide(checkboxGroupContextKey, {
      disabled: computed(() => props.isDisabled),
      invalid: isInvalid,
      modelValue: computed(() => props.modelValue),
      setChecked: (value: CheckboxValue, checked: boolean) => {
        let values = new Set(props.modelValue);
        if (checked) {
          values.add(value);
        } else {
          values.delete(value);
        }
        let next = Array.from(values);
        emit('update:modelValue', next);
        emit('change', next);
      }
    });

    return () => h('fieldset', {
      ...attrs,
      class: [
        classNames(fieldgroupStyles, 'spectrum-FieldGroup'),
        'vs-checkbox-group',
        attrs.class
      ],
      'data-vac': '',
      disabled: props.isDisabled || undefined,
      'aria-invalid': isInvalid.value ? 'true' : undefined,
      'aria-describedby': descriptionId.value
    }, [
      props.label ? h('legend', {class: 'vs-checkbox-group__label'}, props.label) : null,
      h('div', {
        class: [classNames(fieldgroupStyles, 'spectrum-FieldGroup-group'), 'vs-checkbox-group__content']
      }, slots.default ? slots.default() : []),
      props.description
        ? h('div', {id: descriptionId.value, class: 'vs-checkbox-group__description'}, props.description)
        : null
    ]);
  }
});

export const VueCheckbox = Checkbox;
export type {SpectrumCheckboxGroupProps, SpectrumCheckboxProps};
