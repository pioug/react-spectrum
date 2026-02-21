import '@adobe/spectrum-css-temp/components/toggle/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


export const Switch = defineComponent({
  name: 'VueSwitch',
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
    isDisabled: {
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
      type: Boolean,
      default: false
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
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);

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

    return () => h('label', {
      ...attrs,
      class: [className.value, 'vs-switch', attrs.class],
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
        class: [classNames(styles, 'spectrum-ToggleSwitch-input'), 'vs-switch__input'],
        type: 'checkbox',
        role: 'switch',
        checked: props.modelValue,
        disabled: isDisabled.value,
        autofocus: props.autoFocus || attrs.autofocus || undefined,
        onChange: (event: Event) => {
          let target = event.currentTarget as HTMLInputElement | null;
          let checked = target?.checked ?? false;
          emit('update:modelValue', checked);
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
      h('span', {class: [classNames(styles, 'spectrum-ToggleSwitch-switch'), 'vs-switch__track'], 'aria-hidden': 'true'}, [
        h('span', {class: 'vs-switch__thumb'})
      ]),
      h('span', {class: [classNames(styles, 'spectrum-ToggleSwitch-label'), 'vs-switch__label']}, slots.default ? slots.default() : props.label)
    ]);
  }
});

export const VueSwitch = Switch;
export type {SpectrumSwitchProps} from '@vue-types/switch';
