import '@adobe/spectrum-css-temp/components/menu/vars.css';
import {Item, Section} from '@vue-stately/collections';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};


type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionValue = string | Iterable<string>;
type ListBoxKey = string | number;
type ListBoxLeafItem = string | {
  disabled?: boolean,
  href?: string,
  id?: ListBoxKey,
  isDisabled?: boolean,
  key?: ListBoxKey,
  label?: string,
  name?: string,
  rel?: string,
  target?: string,
  textValue?: string
};
type ListBoxSectionItem = {
  ariaLabel?: string,
  children?: ListBoxLeafItem[],
  id?: ListBoxKey,
  items?: ListBoxLeafItem[],
  key?: ListBoxKey,
  label?: string,
  name?: string,
  textValue?: string,
  title?: string
};
type ListBoxItem = ListBoxLeafItem | ListBoxSectionItem;

function isSectionItem(item: ListBoxItem): item is ListBoxSectionItem {
  if (typeof item === 'string') {
    return false;
  }

  return Array.isArray(item.items) || Array.isArray(item.children);
}

function getSectionChildren(item: ListBoxSectionItem): ListBoxLeafItem[] {
  if (Array.isArray(item.items)) {
    return item.items;
  }

  if (Array.isArray(item.children)) {
    return item.children;
  }

  return [];
}

function getSectionLabel(item: ListBoxSectionItem, index: number): string {
  return item.title ?? item.label ?? item.textValue ?? item.name ?? item.ariaLabel ?? String(item.id ?? item.key ?? `Section ${index + 1}`);
}

function getSectionHeading(item: ListBoxSectionItem): string | undefined {
  return item.title ?? item.label ?? item.textValue ?? item.name;
}

function getItemKey(item: ListBoxLeafItem, index: number): string {
  if (typeof item === 'string') {
    return item;
  }

  let rawKey = item.id ?? item.key ?? item.name ?? item.textValue ?? item.label ?? index;
  return String(rawKey);
}

function getItemLabel(item: ListBoxLeafItem): string {
  if (typeof item === 'string') {
    return item;
  }

  return item.textValue ?? item.label ?? item.name ?? String(item.id ?? item.key ?? '');
}

function normalizeSelection(value: SelectionValue): string[] {
  if (typeof value === 'string') {
    return value === '' ? [] : [value];
  }

  if (value == null) {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>).filter((entry): entry is string => typeof entry === 'string');
}

function isSelectionValue(value: SelectionValue): boolean {
  if (typeof value === 'string') {
    return true;
  }

  if (value == null) {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'string') {
      return false;
    }
  }

  return true;
}

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
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<string>>,
      default: () => []
    },
    items: {
      type: Array as PropType<ListBoxItem[]>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Array, Set] as PropType<SelectionValue>,
      default: ''
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    }
  },
  emits: {
    select: (value: SelectionValue) => isSelectionValue(value),
    'update:modelValue': (value: SelectionValue) => isSelectionValue(value)
  },
  setup(props, {attrs, emit, slots}) {
    let hoveredItem = ref<string | null>(null);
    let focusedItem = ref<string | null>(null);

    let selectedSet = computed(() => new Set(normalizeSelection(props.modelValue)));

    let isSelectable = computed(() => props.selectionMode !== 'none');
    let disabledKeySet = computed(() => new Set(Array.from(props.disabledKeys)));

    let onSelect = (itemKey: string) => {
      if (props.isDisabled || disabledKeySet.value.has(itemKey)) {
        return;
      }

      if (props.selectionMode === 'none') {
        emit('select', itemKey);
        return;
      }

      if (props.selectionMode === 'single') {
        emit('update:modelValue', itemKey);
        emit('select', itemKey);
        return;
      }

      let next = new Set(selectedSet.value);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }

      emit('update:modelValue', new Set(next));
      emit('select', new Set(next));
    };

    let renderItem = (item: ListBoxLeafItem, index: number, keyScope?: string) => {
      let itemKey = getItemKey(item, index);
      let itemLabel = getItemLabel(item);
      let renderKey = keyScope ? `${keyScope}:${itemKey}` : itemKey;
      let itemHref = typeof item === 'string' ? undefined : item.href;
      let itemTarget = typeof item === 'string' ? undefined : item.target;
      let itemRel = typeof item === 'string' ? undefined : item.rel;
      let isItemDisabled = props.isDisabled
        || disabledKeySet.value.has(itemKey)
        || (typeof item !== 'string' && !!(item.disabled || item.isDisabled));
      let isSelected = selectedSet.value.has(itemKey);
      let isFocused = focusedItem.value === itemKey;
      let isHovered = hoveredItem.value === itemKey && !isItemDisabled;
      let isFocusVisible = isFocused;
      let commonAttrs = {
        key: renderKey,
        class: [classNames(
          styles,
          'spectrum-Menu-item',
          {
            'is-disabled': isItemDisabled,
            'is-focused': isFocused,
            'is-hovered': isHovered,
            'is-selectable': isSelectable.value,
            'is-selected': isSelected,
            'focus-ring': isFocusVisible
          }
        ), 'vs-listbox__item'],
        role: 'option',
        'data-key': itemKey,
        'aria-disabled': isItemDisabled ? 'true' : undefined,
        'aria-label': itemLabel,
        'aria-selected': isSelected ? 'true' : 'false',
        onMouseenter: () => {
          if (isItemDisabled) {
            return;
          }
          hoveredItem.value = itemKey;
        },
        onMouseleave: () => {
          if (hoveredItem.value === itemKey) {
            hoveredItem.value = null;
          }
        },
        onFocus: () => {
          focusedItem.value = itemKey;
        },
        onBlur: () => {
          if (focusedItem.value === itemKey) {
            focusedItem.value = null;
          }
        }
      };

      let itemChildren = slots.item ? slots.item({item, selected: isSelected}) : itemLabel;

      if (itemHref) {
        return h('a', {
          ...commonAttrs,
          href: itemHref,
          target: itemTarget,
          rel: itemRel,
          onClick: (event: MouseEvent) => {
            if (isItemDisabled) {
              event.preventDefault();
              return;
            }
            if (props.selectionMode !== 'none') {
              event.preventDefault();
            }
            onSelect(itemKey);
          }
        }, itemChildren);
      }

      return h('button', {
        ...commonAttrs,
        type: 'button',
        disabled: isItemDisabled,
        onClick: () => onSelect(itemKey)
      }, itemChildren);
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
      }, props.items.map((item, index) => {
        if (isSectionItem(item)) {
          let sectionLabel = getSectionLabel(item, index);
          let sectionHeading = getSectionHeading(item);
          let sectionKey = getItemKey({
            id: item.id,
            key: item.key,
            label: sectionLabel,
            name: item.name,
            textValue: item.textValue
          }, index);
          let sectionChildren = getSectionChildren(item);

          return h('div', {
            key: `section:${sectionKey}:${index}`,
            class: [classNames(styles, 'spectrum-Menu-section'), 'vs-listbox__section'],
            role: 'group',
            'data-key': sectionKey,
            'aria-label': sectionLabel
          }, [
            sectionHeading
              ? h('div', {
                class: [classNames(styles, 'spectrum-Menu-sectionHeading'), 'vs-listbox__section-heading']
              }, sectionHeading)
              : null,
            ...sectionChildren.map((sectionItem, sectionIndex) => renderItem(sectionItem, sectionIndex, `section:${sectionKey}`))
          ]);
        }

        return renderItem(item, index);
      }))
    ]);
  }
});

export const VueListBox = ListBox;
export const ListBoxBase = ListBox;
export {Item, Section};

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
