import {VueCheckbox} from '@vue-spectrum/components';
import {defineComponent, h, type PropType} from 'vue';
import type {SpectrumCheckboxGroupProps, SpectrumCheckboxProps} from '@react-types/checkbox';

export const Checkbox = VueCheckbox;
export {VueCheckbox};

export const CheckboxGroup = defineComponent({
  name: 'VueCheckboxGroup',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Array as PropType<Array<string | number>>,
      default: () => []
    }
  },
  emits: {
    'update:modelValue': (value: Array<string | number>) => Array.isArray(value),
    change: (value: Array<string | number>) => Array.isArray(value)
  },
  setup(props, {attrs, slots}) {
    return () => {
      let descriptionId = props.description ? 'vs-checkbox-group-description' : undefined;
      return h('fieldset', {
        ...attrs,
        class: ['vs-checkbox-group', attrs.class],
        'data-vac': '',
        disabled: props.isDisabled || undefined,
        'aria-describedby': descriptionId
      }, [
        props.label ? h('legend', {class: 'vs-checkbox-group__label'}, props.label) : null,
        h('div', {class: 'vs-checkbox-group__content'}, slots.default ? slots.default() : []),
        props.description
          ? h('div', {id: descriptionId, class: 'vs-checkbox-group__description'}, props.description)
          : null
      ]);
    };
  }
});

export type {SpectrumCheckboxGroupProps, SpectrumCheckboxProps};
