import {type AriaHiddenSelectOptions, useHiddenSelect} from './useHiddenSelect';
import {defineComponent, h, type PropType, ref, watch} from 'vue';
import type {SelectKey, SelectOption} from './useSelect';

export interface AriaHiddenSelectProps extends AriaHiddenSelectOptions {}
export interface HiddenSelectProps extends AriaHiddenSelectOptions {}

export const HiddenSelect = defineComponent({
  name: 'VueAriaHiddenSelect',
  props: {
    form: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      default: () => []
    },
    selectedKey: {
      type: [String, Number] as PropType<SelectKey | null>,
      default: null
    }
  },
  emits: {
    'update:selectedKey': (key: SelectKey | null) => key == null || typeof key === 'string' || typeof key === 'number',
    change: (key: SelectKey | null) => key == null || typeof key === 'string' || typeof key === 'number'
  },
  setup(props, {emit}) {
    let selectedKey = ref<SelectKey | null>(props.selectedKey ?? null);

    watch(() => props.selectedKey, (nextSelectedKey) => {
      selectedKey.value = nextSelectedKey ?? null;
    });

    let hiddenSelect = useHiddenSelect({
      form: () => props.form,
      isDisabled: () => props.isDisabled,
      name: () => props.name,
      options: () => props.options,
      selectedKey,
      onSelectionChange: (key) => {
        emit('update:selectedKey', key);
        emit('change', key);
      }
    });

    return () => h('div', hiddenSelect.containerProps.value, [
      h('input', hiddenSelect.inputProps.value),
      h('select', {
        ...hiddenSelect.selectProps.value,
        'aria-hidden': 'true'
      }, hiddenSelect.selectProps.value.options.map((option) => h('option', {
        key: option.key,
        value: String(option.key),
        disabled: option.disabled
      }, option.textValue)))
    ]);
  }
});
