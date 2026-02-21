import {defineComponent, h, type PropType} from 'vue';

export const VueListBox = defineComponent({
  name: 'VueListBox',
  props: {
    modelValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    selectionMode: {
      type: String as PropType<'none' | 'single' | 'multiple'>,
      default: 'single'
    },
    items: {
      type: Array as () => string[],
      default: () => []
    }
  },
  emits: {
    'update:modelValue': (value: string | string[]) => (
      typeof value === 'string'
      || (Array.isArray(value) && value.every((item) => typeof item === 'string'))
    ),
    select: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let onSelect = (item: string) => {
      emit('select', item);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'multiple') {
        let current = Array.isArray(props.modelValue) ? props.modelValue : [];
        let next = current.includes(item)
          ? current.filter((value) => value !== item)
          : [...current, item];
        emit('update:modelValue', next);
        return;
      }

      emit('update:modelValue', item);
    };

    let isSelected = (item: string) => {
      if (props.selectionMode === 'none') {
        return false;
      }

      if (props.selectionMode === 'multiple') {
        return Array.isArray(props.modelValue) && props.modelValue.includes(item);
      }

      return props.modelValue === item;
    };

    return function render() {
      return h('section', {
        ...attrs,
        class: ['vs-listbox', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('p', {class: 'vs-listbox__label'}, props.label) : null,
        h('div', {
          class: 'vs-listbox__items',
          role: 'listbox',
          'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined
        }, props.items.map((item) => {
          let selected = isSelected(item);
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
