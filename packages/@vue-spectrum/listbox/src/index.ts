import '@adobe/spectrum-css-temp/components/menu/vars.css';
import {Item, Section} from '@vue-stately/collections';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onMounted, ref, type PropType, type VNodeChild} from 'vue';
import {ProgressCircle} from '@vue-spectrum/progress';
const styles: {[key: string]: string} = {};


type AutoFocusMode = 'first' | 'last' | true;
type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionKey = number | string;
type SelectionValue = SelectionKey | Iterable<SelectionKey>;
type ListBoxKey = SelectionKey;
type ListBoxLeafItem = string | {
  description?: string,
  disabled?: boolean,
  href?: string,
  icon?: string,
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

let listBoxId = 0;

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

function normalizeSelection(value: unknown): string[] {
  if (typeof value === 'number' || typeof value === 'string') {
    let key = String(value);
    return key === '' ? [] : [key];
  }

  if (value == null) {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  let normalized: string[] = [];
  for (let entry of value as Iterable<unknown>) {
    if (typeof entry === 'number' || typeof entry === 'string') {
      normalized.push(String(entry));
    }
  }

  return normalized;
}

function isSelectionValue(value: unknown): value is SelectionValue {
  if (typeof value === 'number' || typeof value === 'string') {
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
    if (typeof entry !== 'number' && typeof entry !== 'string') {
      return false;
    }
  }

  return true;
}

function toBooleanString(value: boolean): 'false' | 'true' {
  return value ? 'true' : 'false';
}

export const ListBox = defineComponent({
  name: 'VueListBox',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaLabelledby: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: [Boolean, String] as PropType<AutoFocusMode | false | undefined>,
      default: undefined
    },
    defaultSelectedKeys: {
      type: [Array, Set] as PropType<Iterable<SelectionKey>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<SelectionKey>>,
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
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    selectedKeys: {
      type: [Array, Set] as PropType<Iterable<SelectionKey> | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    shouldFocusWrap: {
      type: Boolean,
      default: false
    },
    showLoadingSpinner: {
      type: Boolean,
      default: undefined
    }
  },
  emits: {
    action: (key: SelectionKey) => typeof key === 'number' || typeof key === 'string',
    select: (value: SelectionValue) => isSelectionValue(value),
    selectionChange: (value: SelectionValue) => isSelectionValue(value),
    'update:modelValue': (value: SelectionValue) => isSelectionValue(value),
    'update:selectedKeys': (value: Iterable<SelectionKey>) => {
      return isSelectionValue(value);
    }
  },
  setup(props, {attrs, emit, slots}) {
    let hoveredItem = ref<string | null>(null);
    let focusedItem = ref<string | null>(null);
    let optionElements = new Map<string, HTMLElement>();

    let generatedLabelId = `vs-listbox-label-${++listBoxId}`;
    let controlledSelection = computed(() => {
      if (props.selectedKeys !== undefined) {
        return normalizeSelection(props.selectedKeys);
      }

      if (props.modelValue !== undefined) {
        return normalizeSelection(props.modelValue);
      }

      return null;
    });

    let internalSelection = ref(new Set(normalizeSelection(props.defaultSelectedKeys)));

    let selectedSet = computed(() => {
      if (controlledSelection.value != null) {
        return new Set(controlledSelection.value);
      }

      return new Set(internalSelection.value);
    });

    let isSelectable = computed(() => props.selectionMode !== 'none');
    let disabledKeySet = computed(() => new Set(normalizeSelection(props.disabledKeys)));
    let resolvedAriaLabelledby = computed(() => {
      let attrLabelledBy = attrs['aria-labelledby'];
      let fromAttrs = typeof attrLabelledBy === 'string' && attrLabelledBy.length > 0 ? attrLabelledBy : undefined;
      let parts = [
        props.label ? generatedLabelId : undefined,
        props.ariaLabelledby || undefined,
        fromAttrs
      ].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });
    let resolvedAriaLabel = computed(() => {
      if (resolvedAriaLabelledby.value) {
        return undefined;
      }

      let attrLabel = attrs['aria-label'];
      let fromAttrs = typeof attrLabel === 'string' && attrLabel.length > 0 ? attrLabel : undefined;
      return props.ariaLabel || fromAttrs;
    });

    let setOptionRef = (key: string, element: Element | null) => {
      if (!(element instanceof HTMLElement)) {
        optionElements.delete(key);
        return;
      }

      optionElements.set(key, element);
    };

    let getEnabledOptionElements = () => {
      return Array.from(optionElements.values()).filter((element) => element.getAttribute('aria-disabled') !== 'true');
    };

    let focusOptionElement = (element: HTMLElement | null | undefined) => {
      if (!element) {
        return;
      }

      element.focus();
      let dataKey = element.getAttribute('data-key');
      focusedItem.value = dataKey;
    };

    let focusByOffset = (offset: number) => {
      let options = getEnabledOptionElements();
      if (options.length === 0) {
        return;
      }

      let currentIndex = options.findIndex((element) => element.getAttribute('data-key') === focusedItem.value);
      if (currentIndex < 0) {
        focusOptionElement(offset > 0 ? options[0] : options[options.length - 1]);
        return;
      }

      let nextIndex = currentIndex + offset;
      if (props.shouldFocusWrap) {
        nextIndex = (nextIndex + options.length) % options.length;
      } else {
        nextIndex = Math.max(0, Math.min(options.length - 1, nextIndex));
      }
      focusOptionElement(options[nextIndex]);
    };

    let focusAuto = () => {
      if (!props.autoFocus) {
        return;
      }

      let options = getEnabledOptionElements();
      if (options.length === 0) {
        return;
      }

      if (props.autoFocus === 'last') {
        focusOptionElement(options[options.length - 1]);
        return;
      }

      focusOptionElement(options[0]);
    };

    onMounted(() => {
      nextTick(() => {
        focusAuto();
      });
    });

    let emitSelection = (nextSelection: Set<string>) => {
      let nextValue: SelectionValue;
      if (props.selectionMode === 'single') {
        nextValue = Array.from(nextSelection)[0] ?? '';
      } else {
        nextValue = new Set(nextSelection);
      }

      emit('update:modelValue', nextValue);
      emit('update:selectedKeys', new Set(nextSelection));
      emit('select', nextValue);
      emit('selectionChange', nextValue);
    };

    let onSelect = (itemKey: string) => {
      if (props.isDisabled || disabledKeySet.value.has(itemKey)) {
        return;
      }

      emit('action', itemKey);

      if (props.selectionMode === 'none') {
        emit('select', itemKey);
        return;
      }

      if (props.selectionMode === 'single') {
        let nextSelection = new Set<string>([itemKey]);
        if (controlledSelection.value == null) {
          internalSelection.value = nextSelection;
        }
        emitSelection(nextSelection);
        return;
      }

      let next = new Set(selectedSet.value);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }

      if (controlledSelection.value == null) {
        internalSelection.value = next;
      }
      emitSelection(next);
    };

    let renderItem = (item: ListBoxLeafItem, index: number, keyScope?: string) => {
      let itemKey = getItemKey(item, index);
      let itemLabel = getItemLabel(item);
      let renderKey = keyScope ? `${keyScope}:${itemKey}` : itemKey;
      let itemHref = typeof item === 'string' ? undefined : item.href;
      let itemTarget = typeof item === 'string' ? undefined : item.target;
      let itemRel = typeof item === 'string' ? undefined : item.rel;
      let itemDescription = typeof item === 'string' ? undefined : item.description;
      let isItemDisabled = props.isDisabled
        || disabledKeySet.value.has(itemKey)
        || (typeof item !== 'string' && !!(item.disabled || item.isDisabled));
      let isSelected = selectedSet.value.has(itemKey);
      let isFocused = focusedItem.value === itemKey;
      let isHovered = hoveredItem.value === itemKey && !isItemDisabled;

      let slotChildren = slots.item ? slots.item({item, selected: isSelected}) : null;
      let itemChildren: VNodeChild[];
      if (slotChildren && slotChildren.length > 0) {
        itemChildren = slotChildren;
      } else {
        itemChildren = [
          h('span', {class: classNames(styles, 'spectrum-Menu-itemLabel')}, itemLabel),
          itemDescription
            ? h('span', {class: classNames(styles, 'spectrum-Menu-description')}, itemDescription)
            : null
        ];
      }

      let commonAttrs: Record<string, unknown> = {
        key: renderKey,
        ref: (element: Element | null) => {
          setOptionRef(itemKey, element);
        },
        class: [
          classNames(
            styles,
            'spectrum-Menu-item',
            {
              'is-disabled': isItemDisabled,
              'is-focused': isFocused,
              'is-hovered': isHovered,
              'is-selectable': isSelectable.value,
              'is-selected': isSelected,
              'focus-ring': isFocused
            }
          ),
          'vs-listbox__item'
        ],
        role: 'option',
        tabindex: isItemDisabled ? -1 : 0,
        'data-key': itemKey,
        'aria-disabled': isItemDisabled ? 'true' : undefined,
        'aria-label': itemLabel,
        'aria-selected': isSelectable.value ? toBooleanString(isSelected) : undefined,
        style: {
          appearance: 'none',
          background: 'none',
          border: 0,
          color: 'inherit',
          font: 'inherit',
          margin: 0,
          outline: 'none',
          padding: 0,
          textAlign: 'start',
          textDecoration: 'none',
          width: '100%'
        },
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
        },
        onKeydown: (event: KeyboardEvent) => {
          if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
            return;
          }

          event.preventDefault();
          onSelect(itemKey);
        },
        onClick: (event: MouseEvent) => {
          if (itemHref && props.selectionMode !== 'none') {
            event.preventDefault();
          }

          if (isItemDisabled) {
            event.preventDefault();
            return;
          }

          onSelect(itemKey);
        }
      };

      let checkmark = isSelectable.value && isSelected
        ? h('span', {
          class: [
            classNames(styles, 'spectrum-Menu-checkmark'),
            'spectrum-Icon',
            'spectrum-UIIcon-CheckmarkMedium'
          ],
          'aria-hidden': 'true'
        })
        : null;

      let content = h('div', {
        class: classNames(styles, 'spectrum-Menu-itemGrid')
      }, [
        ...itemChildren,
        checkmark
      ]);

      if (itemHref) {
        return h('a', {
          ...commonAttrs,
          href: itemHref,
          target: itemTarget,
          rel: itemRel
        }, content);
      }

      return h('button', {
        ...commonAttrs,
        type: 'button',
        disabled: isItemDisabled
      }, content);
    };

    let onListBoxKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusByOffset(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusByOffset(-1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusOptionElement(getEnabledOptionElements()[0]);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        let enabled = getEnabledOptionElements();
        focusOptionElement(enabled[enabled.length - 1]);
      }
    };

    return () => h('section', {
      class: ['vs-listbox', attrs.class],
      style: attrs.style,
      'data-vac': ''
    }, [
      props.label ? h('p', {id: generatedLabelId, class: 'vs-listbox__label'}, props.label) : null,
      h('div', {
        class: [classNames(styles, 'spectrum-Menu'), 'vs-listbox__items'],
        role: 'listbox',
        'aria-label': resolvedAriaLabel.value,
        'aria-labelledby': resolvedAriaLabelledby.value,
        'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined,
        onKeydown: onListBoxKeydown
      }, [
        ...props.items.map((item, index) => {
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
              index > 0
                ? h('div', {
                  role: 'presentation',
                  class: classNames(styles, 'spectrum-Menu-divider')
                })
                : null,
              sectionHeading
                ? h('div', {
                  class: [classNames(styles, 'spectrum-Menu-sectionHeading'), 'vs-listbox__section-heading']
                }, sectionHeading)
                : null,
              ...sectionChildren.map((sectionItem, sectionIndex) => renderItem(sectionItem, sectionIndex, `section:${sectionKey}`))
            ]);
          }

          return renderItem(item, index);
        }),
        props.isLoading && (props.showLoadingSpinner ?? true)
          ? h('div', {
            role: 'option',
            class: 'vs-listbox__loader',
            style: {
              alignItems: 'center',
              display: 'flex',
              height: '40px',
              justifyContent: 'center'
            }
          }, [
            h(ProgressCircle, {
              isIndeterminate: true,
              size: 'S',
              'aria-label': props.items.length > 0 ? 'Loading more' : 'Loading',
              UNSAFE_className: classNames(styles, 'spectrum-Dropdown-progressCircle')
            })
          ])
          : null,
        props.items.length === 0 && !props.isLoading && slots.empty
          ? h('div', {
            role: 'option',
            class: 'vs-listbox__empty-state'
          }, slots.empty())
          : null
      ])
    ]);
  }
});

export const VueListBox = ListBox;
export const ListBoxBase = defineComponent({
  name: 'VueListBoxBase',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(ListBox, {
      ...attrs
    }, slots);
  }
});
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
