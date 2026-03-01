import '@adobe/spectrum-css-temp/components/fieldgroup/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import '@adobe/spectrum-css-temp/components/radio/vars.css';
import {useProviderProps} from '@vue-spectrum/provider';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, inject, type InjectionKey, onBeforeUnmount, type PropType, provide, ref, type Ref, watch} from 'vue';
import {filterDOMProps, getEventTarget} from '@vue-aria/utils';
import type {SpectrumRadioGroupProps, SpectrumRadioProps} from '@vue-types/radio';

const fieldGroupStyles: {[key: string]: string} = {};
const radioStyles: {[key: string]: string} = {};

type ValidationState = 'invalid' | 'valid';
type LabelAlign = 'end' | 'start';
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label';

interface RadioGroupContextValue {
  disabled: Ref<boolean>,
  getFirstEnabledValue: () => string | undefined,
  getLastFocusedValue: () => string | undefined,
  isEmphasized: Ref<boolean>,
  isInvalid: Ref<boolean>,
  isReadOnly: Ref<boolean>,
  isRequired: Ref<boolean>,
  modelValue: Ref<string>,
  name: Ref<string | undefined>,
  registerOption: (value: string, isDisabled: boolean) => void,
  setLastFocusedValue: (value: string) => void,
  setOptionDisabled: (value: string, isDisabled: boolean) => void,
  setValue: (value: string) => void
  unregisterOption: (value: string) => void
}

const radioGroupContextKey: InjectionKey<RadioGroupContextValue> = Symbol('vue-spectrum-radio-group-context');
let radioId = 0;
let radioGroupId = 0;

export const RadioGroup = defineComponent({
  name: 'VueRadioGroup',
  inheritAttrs: false,
  props: {
    contextualHelp: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    defaultValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
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
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
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
    label: {
      type: String,
      default: ''
    },
    labelAlign: {
      type: String as PropType<LabelAlign | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<LabelPosition | undefined>,
      default: undefined
    },
    modelValue: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    name: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    necessityIndicator: {
      type: String as PropType<NecessityIndicator | undefined>,
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
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: string) => typeof value === 'string',
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, slots, attrs}) {
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));
    let generatedName = `vs-radio-group-${++radioGroupId}`;
    let uncontrolledValue = ref(resolvedProps.value.defaultValue ?? '');

    watch(() => [resolvedProps.value.value, resolvedProps.value.modelValue], ([value, modelValue]) => {
      if (typeof value === 'string') {
        uncontrolledValue.value = value;
        return;
      }

      if (typeof modelValue === 'string') {
        uncontrolledValue.value = modelValue;
      }
    }, {immediate: true});

    let groupName = computed(() => resolvedProps.value.name ?? generatedName);
    let selectedValue = computed(() => resolvedProps.value.value ?? resolvedProps.value.modelValue ?? uncontrolledValue.value);
    let lastFocusedValue = ref<string | null>(null);
    let optionOrder = ref<string[]>([]);
    let optionDisabledMap = ref(new Map<string, boolean>());
    let isDisabled = computed(() => resolvedProps.value.isDisabled ?? resolvedProps.value.disabled);
    let isInvalid = computed(() => (resolvedProps.value.isInvalid || resolvedProps.value.invalid || resolvedProps.value.validationState === 'invalid') && !isDisabled.value);
    let necessityIndicator = computed<NecessityIndicator | undefined>(() => {
      if (resolvedProps.value.necessityIndicator) {
        return resolvedProps.value.necessityIndicator;
      }

      return resolvedProps.value.isRequired ? 'icon' : undefined;
    });
    let showErrorMessage = computed(() => isInvalid.value && !!resolvedProps.value.errorMessage);
    let helpText = computed(() => showErrorMessage.value ? resolvedProps.value.errorMessage : resolvedProps.value.description);
    let labelId = computed(() => resolvedProps.value.label ? `${groupName.value}-label` : undefined);
    let helpTextId = computed(() => {
      if (!helpText.value) {
        return undefined;
      }

      return `${groupName.value}-${showErrorMessage.value ? 'error' : 'description'}`;
    });
    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
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

    provide(radioGroupContextKey, {
      disabled: isDisabled,
      getFirstEnabledValue: () => {
        for (let value of optionOrder.value) {
          if (!optionDisabledMap.value.get(value)) {
            return value;
          }
        }

        return undefined;
      },
      getLastFocusedValue: () => {
        return lastFocusedValue.value ?? undefined;
      },
      isEmphasized: computed(() => resolvedProps.value.isEmphasized),
      isInvalid,
      isReadOnly: computed(() => resolvedProps.value.isReadOnly),
      isRequired: computed(() => resolvedProps.value.isRequired),
      modelValue: computed(() => selectedValue.value),
      name: computed(() => groupName.value),
      registerOption: (value: string, optionIsDisabled: boolean) => {
        if (!optionOrder.value.includes(value)) {
          optionOrder.value = [...optionOrder.value, value];
        }

        let nextMap = new Map(optionDisabledMap.value);
        nextMap.set(value, optionIsDisabled);
        optionDisabledMap.value = nextMap;
      },
      setLastFocusedValue: (value: string) => {
        lastFocusedValue.value = value;
      },
      setOptionDisabled: (value: string, optionIsDisabled: boolean) => {
        if (!optionDisabledMap.value.has(value)) {
          return;
        }

        let nextMap = new Map(optionDisabledMap.value);
        nextMap.set(value, optionIsDisabled);
        optionDisabledMap.value = nextMap;
      },
      setValue: (value: string) => {
        if (isDisabled.value || resolvedProps.value.isReadOnly) {
          return;
        }

        if (resolvedProps.value.value === undefined && resolvedProps.value.modelValue === undefined) {
          uncontrolledValue.value = value;
        }

        emit('update:modelValue', value);
        emit('change', value);
      },
      unregisterOption: (value: string) => {
        optionOrder.value = optionOrder.value.filter((optionValue) => optionValue !== value);
        if (optionDisabledMap.value.has(value)) {
          let nextMap = new Map(optionDisabledMap.value);
          nextMap.delete(value);
          optionDisabledMap.value = nextMap;
        }

        if (lastFocusedValue.value === value) {
          lastFocusedValue.value = null;
        }
      }
    });

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

      return h('div', {
        ...otherDomProps,
        class: [
          classNames(
            fieldGroupStyles,
              'spectrum-Field',
              'spectrum-FieldGroup',
              {
              'spectrum-Field--positionTop': (resolvedProps.value.labelPosition ?? 'top') !== 'side',
              'spectrum-Field--positionSide': resolvedProps.value.labelPosition === 'side',
              'spectrum-Field--alignEnd': resolvedProps.value.labelAlign === 'end',
              'spectrum-Field--hasContextualHelp': !!resolvedProps.value.contextualHelp
              }
            ),
          domClassName,
          domClass
        ],
        style: domStyle
      }, [
        resolvedProps.value.label
          ? h('span', {
            id: labelId.value,
            class: classNames(
              fieldGroupStyles,
              'spectrum-FieldLabel',
              {
                'spectrum-FieldLabel--positionSide': resolvedProps.value.labelPosition === 'side',
                'spectrum-FieldLabel--alignEnd': resolvedProps.value.labelAlign === 'end'
              }
            )
          }, [
            resolvedProps.value.label,
            (necessityIndicator.value === 'label' || necessityIndicator.value === 'icon') && resolvedProps.value.isRequired ? ' \u200b' : null,
            necessityIndicator.value === 'label' && resolvedProps.value.isRequired
              ? h('span', {'aria-hidden': 'true'}, '(required)')
              : null,
            necessityIndicator.value === 'icon' && resolvedProps.value.isRequired
              ? h('span', {
                class: classNames(fieldGroupStyles, 'spectrum-FieldLabel-requiredIcon'),
                'aria-hidden': 'true'
              }, '*')
              : null
          ])
          : null,
        resolvedProps.value.label && resolvedProps.value.contextualHelp
          ? h('span', {
            class: classNames(fieldGroupStyles, 'spectrum-Field-contextualHelp')
          }, resolvedProps.value.contextualHelp as never)
          : null,
        h('div', {
          role: 'radiogroup',
          class: classNames(
            fieldGroupStyles,
            'spectrum-FieldGroup-group',
            'spectrum-Field-field',
            {
              'spectrum-FieldGroup-group--horizontal': resolvedProps.value.orientation === 'horizontal'
            }
          ),
          'aria-labelledby': ariaLabelledBy.value,
          'aria-label': ariaLabel.value,
          'aria-describedby': helpTextId.value,
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-disabled': isDisabled.value ? 'true' : undefined,
          'aria-readonly': resolvedProps.value.isReadOnly ? 'true' : undefined,
          'aria-required': resolvedProps.value.isRequired ? 'true' : undefined
        }, slots.default ? slots.default() : []),
        helpText.value
          ? h('div', {
            class: classNames(
              fieldGroupStyles,
              'spectrum-HelpText',
              `spectrum-HelpText--${showErrorMessage.value ? 'negative' : 'neutral'}`,
              {'is-disabled': isDisabled.value}
            )
          }, [
            showErrorMessage.value && resolvedProps.value.showErrorIcon
              ? h('span', {
                class: classNames(fieldGroupStyles, 'spectrum-HelpText-validationIcon'),
                'aria-hidden': 'true'
              }, '!')
              : null,
            h('div', {
              id: helpTextId.value,
              class: classNames(fieldGroupStyles, 'spectrum-HelpText-text')
            }, helpText.value)
          ])
          : null
      ]);
    };
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
    isReadOnly: {
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
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));
    let generatedId = `vs-radio-${++radioId}`;
    let group = inject(radioGroupContextKey, null);

    let isDisabled = computed(() => (resolvedProps.value.isDisabled ?? resolvedProps.value.disabled) || (group ? group.disabled.value : false));
    let isReadOnly = computed(() => resolvedProps.value.isReadOnly || (group ? group.isReadOnly.value : false));
    let isInvalid = computed(() => (resolvedProps.value.isInvalid || resolvedProps.value.invalid || (group ? group.isInvalid.value : false)) && !isDisabled.value);
    let isEmphasized = computed(() => {
      if (resolvedProps.value.isEmphasized !== undefined) {
        return resolvedProps.value.isEmphasized;
      }

      return group ? group.isEmphasized.value : false;
    });
    let isChecked = computed(() => {
      let value = group ? group.modelValue.value : props.modelValue;
      return value === props.value;
    });
    let inputName = computed(() => group ? group.name.value : props.name);
    let hasVisibleLabel = computed(() => !!slots.default || !!props.label);
    let labelId = computed(() => hasVisibleLabel.value ? `${generatedId}-label` : undefined);
    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
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
    let hasAriaLabel = computed(() => Boolean(ariaLabel.value || ariaLabelledBy.value));

    if (!hasVisibleLabel.value && !hasAriaLabel.value && process.env.NODE_ENV !== 'production') {
      console.warn('If you do not provide children, you must specify an aria-label for accessibility');
    }

    let isHovered = ref(false);
    let isFocusVisible = ref(false);
    let stopOptionWatch: (() => void) | undefined;

    if (group) {
      stopOptionWatch = watch(
        [() => props.value, isDisabled],
        ([nextValue, nextIsDisabled], previousValues) => {
          let previousValue = previousValues?.[0];
          if (previousValue !== undefined && previousValue !== nextValue) {
            group.unregisterOption(previousValue);
          }
          group.registerOption(nextValue, nextIsDisabled);
          group.setOptionDisabled(nextValue, nextIsDisabled);
        },
        {
          immediate: true
        }
      );
    }

    onBeforeUnmount(() => {
      stopOptionWatch?.();
      group?.unregisterOption(props.value);
    });

    let tabIndex = computed(() => {
      if (isDisabled.value) {
        return undefined;
      }

      if (!group) {
        return 0;
      }

      let selected = group.modelValue.value;
      if (selected !== undefined && selected !== null && selected !== '') {
        return selected === props.value ? 0 : -1;
      }

      let lastFocused = group.getLastFocusedValue();
      if (lastFocused !== undefined) {
        return lastFocused === props.value ? 0 : -1;
      }

      return group.getFirstEnabledValue() === props.value ? 0 : -1;
    });

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
          if (!isDisabled.value) {
            isHovered.value = true;
          }
        },
        onMouseleave: () => {
          isHovered.value = false;
        }
      }, [
        h('input', {
          class: classNames(radioStyles, 'spectrum-Radio-input'),
          type: 'radio',
          name: inputName.value,
          value: props.value,
          checked: isChecked.value,
          disabled: isDisabled.value || undefined,
          tabindex: tabIndex.value,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          'aria-label': ariaLabel.value,
          'aria-labelledby': ariaLabelledBy.value,
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            if (!target?.checked) {
              return;
            }

            if (isDisabled.value || isReadOnly.value) {
              target.checked = isChecked.value;
              return;
            }

            if (group) {
              group.setValue(props.value);
            } else {
              emit('update:modelValue', props.value);
              emit('change', props.value);
            }
          },
          onFocus: (event: FocusEvent) => {
            let target = getEventTarget(event);
            isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
            group?.setLastFocusedValue(props.value);
            emit('focus', event);
          },
          onBlur: (event: FocusEvent) => {
            isFocusVisible.value = false;
            emit('blur', event);
          }
        }),
        h('span', {class: classNames(radioStyles, 'spectrum-Radio-button')}),
        hasVisibleLabel.value
          ? h('span', {id: labelId.value, class: classNames(radioStyles, 'spectrum-Radio-label')}, slots.default ? slots.default() : props.label)
          : null
      ]);
    };
  }
});

export const VueRadio = Radio;
export const VueRadioGroup = RadioGroup;
export type {SpectrumRadioGroupProps, SpectrumRadioProps};
