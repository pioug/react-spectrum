import {defineComponent, h} from 'vue';

export const VueListBox = defineComponent({
  name: 'VueListBox',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    items: {
      type: Array as () => string[],
      default: () => []
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    select: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let onSelect = (item: string) => {
      emit('update:modelValue', item);
      emit('select', item);
    };

    return function render() {
      return h('section', {
        ...attrs,
        class: ['vs-listbox', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('p', {class: 'vs-listbox__label'}, props.label) : null,
        h('div', {class: 'vs-listbox__items', role: 'listbox'}, props.items.map((item) => {
          let selected = props.modelValue === item;
          return h('button', {
            key: item,
            class: ['vs-listbox__item', selected ? 'is-selected' : null],
            type: 'button',
            role: 'option',
            'aria-selected': selected ? 'true' : 'false',
            onClick: () => onSelect(item)
          }, item);
        }))
      ]);
    };
  }
});
