import '@adobe/spectrum-css-temp/components/toggle/vars.css';
import {useProviderProps} from '@vue-spectrum/provider';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {filterDOMProps} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};
let switchId = 0;


export const Switch = defineComponent({
  name: 'VueSwitch',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    defaultSelected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean as PropType<boolean | undefined>,
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
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));
    let generatedId = `vs-switch-${++switchId}`;
    let isHovered = ref(false);
    let isFocusVisible = ref(false);
    let uncontrolledSelected = ref(resolvedProps.value.defaultSelected);
    let isDisabled = computed(() => resolvedProps.value.isDisabled ?? resolvedProps.value.disabled);
    let isReadOnly = computed(() => resolvedProps.value.isReadOnly);
    let isSelected = computed(() => resolvedProps.value.isSelected ?? resolvedProps.value.modelValue ?? uncontrolledSelected.value);
    let hasVisibleLabel = computed(() => !!slots.default || !!resolvedProps.value.label);
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

    let className = computed(() => classNames(
      styles,
      'spectrum-ToggleSwitch',
      {
        'spectrum-ToggleSwitch--quiet': !resolvedProps.value.isEmphasized,
        'is-disabled': isDisabled.value,
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
        class: [className.value, domClassName, domClass],
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
          class: classNames(styles, 'spectrum-ToggleSwitch-input'),
          type: 'checkbox',
          role: 'switch',
          'data-react-aria-pressable': 'true',
          tabindex: isDisabled.value ? undefined : 0,
          checked: isSelected.value,
          disabled: isDisabled.value,
          readonly: isReadOnly.value || undefined,
          autofocus: resolvedProps.value.autoFocus || attrs.autofocus || undefined,
          'aria-label': ariaLabel.value,
          'aria-labelledby': ariaLabelledBy.value,
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            if (!target) {
              return;
            }

            if (isDisabled.value || isReadOnly.value) {
              target.checked = isSelected.value;
              return;
            }

            let checked = target.checked;
            if (resolvedProps.value.isSelected === undefined && resolvedProps.value.modelValue === undefined) {
              uncontrolledSelected.value = checked;
            }

            emit('update:modelValue', checked);
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
        h('span', {
          class: classNames(styles, 'spectrum-ToggleSwitch-switch')
        }),
        hasVisibleLabel.value
          ? h('span', {id: labelId.value, class: classNames(styles, 'spectrum-ToggleSwitch-label')}, slots.default ? slots.default() : resolvedProps.value.label)
          : null
      ]);
    };
  }
});

export const VueSwitch = Switch;
export type {SpectrumSwitchProps} from '@vue-types/switch';
