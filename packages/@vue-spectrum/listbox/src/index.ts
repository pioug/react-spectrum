import '@adobe/spectrum-css-temp/components/menu/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};


type SelectionMode = 'multiple' | 'none' | 'single';

export const ListBox = defineComponent({
  name: 'VueListBox',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: ''
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    }
  },
  emits: {
    select: (value: string | string[]) => typeof value === 'string' || Array.isArray(value),
    'update:modelValue': (value: string | string[]) => typeof value === 'string' || Array.isArray(value)
  },
  setup(props, {emit, attrs}) {
    let hoveredItem = ref<string | null>(null);
    let focusedItem = ref<string | null>(null);

    let selectedSet = computed(() => {
      if (Array.isArray(props.modelValue)) {
        return new Set(props.modelValue);
      }

      return new Set(typeof props.modelValue === 'string' && props.modelValue !== '' ? [props.modelValue] : []);
    });

    let isSelectable = computed(() => props.selectionMode !== 'none');

    let onSelect = (item: string) => {
      if (props.isDisabled) {
        return;
      }

      if (props.selectionMode === 'none') {
        emit('select', item);
        return;
      }

      if (props.selectionMode === 'single') {
        emit('update:modelValue', item);
        emit('select', item);
        return;
      }

      let next = new Set(selectedSet.value);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }

      let values = Array.from(next);
      emit('update:modelValue', values);
      emit('select', values);
    };

    return () => h('section', {
      ...attrs,
      class: ['vs-listbox', attrs.class],
      'data-vac': ''
    }, [
      props.label ? h('p', {class: 'vs-listbox__label'}, props.label) : null,
      h('div', {
        class: [classNames(styles, 'spectrum-Menu'), 'vs-listbox__items'],
        role: 'listbox',
        'aria-label': props.ariaLabel || attrs['aria-label']
      }, props.items.map((item) => {
        let isSelected = selectedSet.value.has(item);
        let isFocused = focusedItem.value === item;
        let isHovered = hoveredItem.value === item && !props.isDisabled;
        let isFocusVisible = isFocused;

        return h('button', {
          key: item,
          class: [classNames(
            styles,
            'spectrum-Menu-item',
            {
              'is-disabled': props.isDisabled,
              'is-focused': isFocused,
              'is-hovered': isHovered,
              'is-selectable': isSelectable.value,
              'is-selected': isSelected,
              'focus-ring': isFocusVisible
            }
          ), 'vs-listbox__item'],
          type: 'button',
          role: 'option',
          disabled: props.isDisabled,
          'aria-label': item,
          'aria-selected': isSelected ? 'true' : 'false',
          onMouseenter: () => {
            hoveredItem.value = item;
          },
          onMouseleave: () => {
            if (hoveredItem.value === item) {
              hoveredItem.value = null;
            }
          },
          onFocus: () => {
            focusedItem.value = item;
          },
          onBlur: () => {
            if (focusedItem.value === item) {
              focusedItem.value = null;
            }
          },
          onClick: () => onSelect(item)
        }, item);
      }))
    ]);
  }
});

export const VueListBox = ListBox;
export const ListBoxBase = ListBox;
export const Item = ListBox;
export const Section = ListBox;

export type SpectrumListBoxProps<T = unknown> = Record<string, unknown> & {
  item?: T
};

export type ListBoxLayout<T = unknown> = {
  layout: 'stack',
  _itemType?: T
};

export function useListBoxLayout<T>(): ListBoxLayout<T> {
  return {
    layout: 'stack'
  } as ListBoxLayout<T>;
}
