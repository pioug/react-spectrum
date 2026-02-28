import '@adobe/spectrum-css-temp/components/checkbox/vars.css';
import '@adobe/spectrum-css-temp/components/fieldgroup/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
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
  descriptionId: Ref<string | undefined>,
  errorMessageId: Ref<string | undefined>,
  isEmphasized: Ref<boolean>,
  isReadOnly: Ref<boolean>,
  invalid: Ref<boolean>,
  modelValue: Ref<CheckboxValue[]>,
  name: Ref<string | undefined>,
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
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isRequired: {
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
    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let externalAriaDescribedBy = computed(() => {
      let value = attrs['aria-describedby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let ariaLabelledBy = computed(() => externalAriaLabelledBy.value);
    let ariaDescribedBy = computed(() => {
      let parts: string[] = [];
      if (externalAriaDescribedBy.value) {
        parts.push(externalAriaDescribedBy.value);
      }

      if (group) {
        if (group.invalid.value && group.errorMessageId.value) {
          parts.push(group.errorMessageId.value);
        }

        if (group.descriptionId.value) {
          parts.push(group.descriptionId.value);
        }
      }

      return parts.length > 0 ? parts.join(' ') : undefined;
    });
    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });

    let isDisabled = computed(() => (props.isDisabled ?? props.disabled) || (group ? group.disabled.value : false));
    let isReadOnly = computed(() => props.isReadOnly || (group ? group.isReadOnly.value : false));
    let isEmphasized = computed(() => props.isEmphasized ?? (group ? group.isEmphasized.value : false));
    let inputName = computed(() => {
      if (group) {
        return group.name.value;
      }

      let value = attrs.name;
      return typeof value === 'string' ? value : undefined;
    });
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
    let excludeFromTabOrder = computed(() => {
      let value = attrs.excludeFromTabOrder;
      return value === '' || value === true || value === 'true';
    });
    let tabIndex = computed(() => {
      if (isDisabled.value) {
        return undefined;
      }

      return excludeFromTabOrder.value ? -1 : 0;
    });

    let rootClassName = computed(() => classNames(
      checkboxStyles,
      'spectrum-Checkbox',
      {
        'is-checked': isChecked.value,
        'is-indeterminate': props.isIndeterminate,
        'spectrum-Checkbox--quiet': !isEmphasized.value,
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
        ...inputDomProps
      } = domProps;
      delete inputDomProps['aria-label'];
      delete inputDomProps['aria-labelledby'];
      delete inputDomProps['aria-describedby'];
      delete inputDomProps.class;
      delete inputDomProps.className;
      delete inputDomProps.style;

      return h('label', {
        class: [rootClassName.value, attrs.class, domClassName, domClass],
        style: attrs.style ?? domStyle,
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
          ...inputDomProps,
          class: classNames(checkboxStyles, 'spectrum-Checkbox-input'),
          type: 'checkbox',
          name: inputName.value,
          value: props.value,
          checked: isChecked.value,
          disabled: isDisabled.value,
          tabindex: tabIndex.value,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          'data-react-aria-pressable': 'true',
          'aria-label': ariaLabel.value,
          'aria-labelledby': ariaLabelledBy.value,
          'aria-describedby': ariaDescribedBy.value,
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-readonly': isReadOnly.value ? 'true' : undefined,
          'aria-required': props.isRequired ? 'true' : undefined,
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            if (!target) {
              return;
            }

            if (isDisabled.value || isReadOnly.value) {
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
    contextualHelp: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    defaultValue: {
      type: Array as PropType<CheckboxValue[] | undefined>,
      default: undefined
    },
    description: {
      type: String,
      default: ''
    },
    errorMessage: {
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
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    labelAlign: {
      type: String as PropType<'start' | 'end' | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<'top' | 'side' | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    modelValue: {
      type: Array as PropType<CheckboxValue[] | undefined>,
      default: undefined
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical'
    },
    showErrorIcon: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array as PropType<CheckboxValue[] | undefined>,
      default: undefined
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
    let uncontrolledValue = ref<CheckboxValue[]>(props.defaultValue ? [...props.defaultValue] : []);
    let selectedValues = computed(() => props.value ?? props.modelValue ?? uncontrolledValue.value);
    let labelId = computed(() => props.label ? `${groupId}-label` : undefined);
    let descriptionId = computed(() => props.description ? `${groupId}-description` : undefined);
    let errorMessageId = computed(() => props.errorMessage ? `${groupId}-error-message` : undefined);
    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let externalAriaDescribedBy = computed(() => {
      let value = attrs['aria-describedby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });
    let ariaLabelledBy = computed(() => {
      let parts = [labelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });
    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });
    let groupName = computed(() => props.name);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !props.isDisabled);
    let showErrorMessage = computed(() => isInvalid.value && !!props.errorMessage);
    let helpText = computed(() => showErrorMessage.value ? props.errorMessage : props.description);
    let activeHelpTextId = computed(() => showErrorMessage.value ? errorMessageId.value : descriptionId.value);
    let ariaDescribedBy = computed(() => {
      let parts = [externalAriaDescribedBy.value, activeHelpTextId.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });

    provide(checkboxGroupContextKey, {
      disabled: computed(() => props.isDisabled),
      descriptionId,
      errorMessageId,
      isEmphasized: computed(() => props.isEmphasized),
      isReadOnly: computed(() => props.isReadOnly),
      invalid: isInvalid,
      modelValue: computed(() => selectedValues.value),
      name: groupName,
      setChecked: (value: CheckboxValue, checked: boolean) => {
        if (props.isDisabled || props.isReadOnly) {
          return;
        }

        let values = new Set(selectedValues.value ?? []);
        if (checked) {
          values.add(value);
        } else {
          values.delete(value);
        }
        let next = Array.from(values);
        if (props.value === undefined && props.modelValue === undefined) {
          uncontrolledValue.value = next;
        }
        emit('update:modelValue', next);
        emit('change', next);
      }
    });

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...groupDomProps
      } = domProps;
      delete groupDomProps['aria-label'];
      delete groupDomProps['aria-labelledby'];
      delete groupDomProps['aria-describedby'];

      return h('div', {
        class: [
          classNames(
            fieldgroupStyles,
            'spectrum-Field',
            'spectrum-FieldGroup',
            {
              'spectrum-Field--positionTop': (props.labelPosition ?? 'top') !== 'side',
              'spectrum-Field--positionSide': props.labelPosition === 'side',
              'spectrum-Field--alignEnd': props.labelAlign === 'end',
              'spectrum-Field--hasContextualHelp': !!props.contextualHelp
            }
          ),
          attrs.class,
          domClassName,
          domClass
        ],
        style: attrs.style ?? domStyle
      }, [
        props.label
          ? h('span', {
            id: labelId.value,
            class: classNames(fieldgroupStyles, 'spectrum-FieldLabel')
          }, props.label)
          : null,
        props.contextualHelp
          ? h('span', {class: classNames(fieldgroupStyles, 'spectrum-Field-contextualHelp')}, props.contextualHelp as never)
          : null,
        h('div', {
          ...groupDomProps,
          id: typeof groupDomProps.id === 'string' ? groupDomProps.id : groupId,
          role: 'group',
          class: classNames(
            fieldgroupStyles,
            'spectrum-FieldGroup-group',
            'spectrum-Field-field',
            {
              'spectrum-FieldGroup-group--horizontal': props.orientation === 'horizontal'
            }
          ),
          'aria-labelledby': ariaLabelledBy.value,
          'aria-label': ariaLabel.value,
          'aria-describedby': ariaDescribedBy.value,
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-disabled': props.isDisabled ? 'true' : undefined,
          'aria-required': props.isRequired ? 'true' : undefined
        }, slots.default ? slots.default() : []),
        helpText.value
          ? h('div', {
            id: activeHelpTextId.value,
            class: classNames(
              fieldgroupStyles,
              'spectrum-HelpText',
              `spectrum-HelpText--${showErrorMessage.value ? 'negative' : 'neutral'}`,
              {'is-disabled': props.isDisabled}
            )
          }, [
            showErrorMessage.value && props.showErrorIcon
              ? h('span', {
                class: classNames(fieldgroupStyles, 'spectrum-HelpText-validationIcon'),
                'aria-hidden': 'true'
              }, '!')
              : null,
            h('div', {class: classNames(fieldgroupStyles, 'spectrum-HelpText-text')}, helpText.value)
          ])
          : null
      ]);
    };
  }
});

export const VueCheckbox = Checkbox;
export type {SpectrumCheckboxGroupProps, SpectrumCheckboxProps};
