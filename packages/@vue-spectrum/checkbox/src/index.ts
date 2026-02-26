import '@adobe/spectrum-css-temp/components/checkbox/vars.css';
import '@adobe/spectrum-css-temp/components/fieldgroup/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, type Ref} from 'vue';
import {filterDOMProps} from '@vue-aria/utils';
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
    defaultSelected: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
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
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
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
    let uncontrolledSelected = ref(props.defaultSelected ?? false);
    let hasVisibleLabel = computed(() => !!slots.default || !!props.label);
    let ariaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });

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

      return props.isSelected ?? props.modelValue ?? uncontrolledSelected.value;
    });

    let rootClassName = computed(() => classNames(
      checkboxStyles,
      'spectrum-Checkbox',
      {
        'is-checked': isChecked.value,
        'is-indeterminate': props.isIndeterminate,
        'spectrum-Checkbox--quiet': !(props.isEmphasized ?? false),
        'is-invalid': isInvalid.value,
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    if (group && process.env.NODE_ENV !== 'production') {
      for (let key of ['isSelected', 'defaultSelected', 'isEmphasized'] as const) {
        if (props[key] != null) {
          console.warn(`${key} is unsupported on individual <Checkbox> elements within a <CheckboxGroup>. Please apply these props to the group instead.`);
        }
      }

      if (props.value == null) {
        console.warn('A <Checkbox> element within a <CheckboxGroup> requires a `value` property.');
      }
    }

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      delete otherDomProps['aria-label'];
      delete otherDomProps['aria-labelledby'];

      return h('label', {
        ...otherDomProps,
        class: [rootClassName.value, domClassName, domClass],
        style: domStyle,
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
          class: classNames(checkboxStyles, 'spectrum-Checkbox-input'),
          type: 'checkbox',
          value: props.value,
          checked: isChecked.value,
          disabled: isDisabled.value,
          tabindex: isDisabled.value ? undefined : 0,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          'data-react-aria-pressable': 'true',
          'aria-label': !hasVisibleLabel.value ? ariaLabel.value : undefined,
          'aria-labelledby': hasVisibleLabel.value ? attrs['aria-labelledby'] : undefined,
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            if (!target) {
              return;
            }

            if (isDisabled.value) {
              target.checked = isChecked.value;
              return;
            }

            let checked = target.checked;
            if (group && props.value !== undefined) {
              group.setChecked(props.value, checked);
            } else {
              if (props.isSelected === undefined && props.modelValue === undefined) {
                uncontrolledSelected.value = checked;
              }
              emit('update:modelValue', checked);
            }

            emit('change', checked);
          },
          onFocus: (event: FocusEvent) => {
            let target = event.currentTarget as HTMLElement | null;
            isFocusVisible.value = Boolean(target?.matches(':focus-visible'));
            emit('focus', event);
          },
          onBlur: (event: FocusEvent) => {
            isFocusVisible.value = false;
            emit('blur', event);
          }
        }),
        h('span', {class: classNames(checkboxStyles, 'spectrum-Checkbox-box')}, [
          props.isIndeterminate
            ? h('svg', {
              class: classNames(checkboxStyles, 'spectrum-Icon', 'spectrum-UIIcon-DashSmall', 'spectrum-Checkbox-partialCheckmark'),
              focusable: 'false',
              'aria-hidden': 'true',
              role: 'img'
            }, [
              h('path', {d: 'M8 4H2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2z'})
            ])
            : h('svg', {
              class: classNames(checkboxStyles, 'spectrum-Icon', 'spectrum-UIIcon-CheckmarkSmall', 'spectrum-Checkbox-checkmark'),
              focusable: 'false',
              'aria-hidden': 'true',
              role: 'img'
            }, [
              h('path', {d: 'M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z'})
            ])
        ]),
        hasVisibleLabel.value
          ? h('span', {class: classNames(checkboxStyles, 'spectrum-Checkbox-label')}, slots.default ? slots.default() : props.label)
          : null
      ]);
    };
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
