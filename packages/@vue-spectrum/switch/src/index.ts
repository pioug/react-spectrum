import '@adobe/spectrum-css-temp/components/toggle/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {filterDOMProps} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


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
    let isHovered = ref(false);
    let isFocusVisible = ref(false);
    let uncontrolledSelected = ref(props.defaultSelected);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isSelected = computed(() => props.isSelected ?? props.modelValue ?? uncontrolledSelected.value);
    let hasVisibleLabel = computed(() => !!slots.default || !!props.label);
    let ariaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });

    let className = computed(() => classNames(
      styles,
      'spectrum-ToggleSwitch',
      {
        'spectrum-ToggleSwitch--quiet': !props.isEmphasized,
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
          readonly: props.isReadOnly || undefined,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          'aria-label': !hasVisibleLabel.value ? ariaLabel.value : undefined,
          'aria-labelledby': hasVisibleLabel.value ? attrs['aria-labelledby'] : undefined,
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            if (!target) {
              return;
            }

            if (isDisabled.value || props.isReadOnly) {
              target.checked = isSelected.value;
              return;
            }

            let checked = target.checked;
            if (props.isSelected === undefined && props.modelValue === undefined) {
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
          ? h('span', {class: classNames(styles, 'spectrum-ToggleSwitch-label')}, slots.default ? slots.default() : props.label)
          : null
      ]);
    };
  }
});

export const VueSwitch = Switch;
export type {SpectrumSwitchProps} from '@vue-types/switch';
