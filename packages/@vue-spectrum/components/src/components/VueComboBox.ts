import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

let comboBoxId = 0;

export const VueComboBox = defineComponent({
  name: 'VueComboBox',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array as () => string[],
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-combobox-${++comboBoxId}`;
    let listId = `${generatedId}-list`;

    let classes = computed(() => ([
      'vs-combobox__input',
      context.value.scale === 'large' ? 'vs-combobox__input--large' : 'vs-combobox__input--medium'
    ]));

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let value = target?.value ?? '';
      emit('update:modelValue', value);
      emit('change', value);
    };

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-combobox', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-combobox__label'}, props.label) : null,
        h('input', {
          class: classes.value,
          type: 'text',
          list: listId,
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: props.disabled,
          onInput
        }),
        h('datalist', {id: listId}, props.options.map(option => h('option', {value: option}, option)))
      ]);
    };
  }
});
