import './styles.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';

const listStyles: {[key: string]: string} = {};

export type ListItemRecord = {
  children?: ListItemRecord[],
  description?: string,
  disabled?: boolean,
  id?: number | string,
  key?: number | string,
  label?: string,
  name?: string,
  textValue?: string
} & Record<string, unknown>;

type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionStyle = 'checkbox' | 'highlight';
type SelectionValue = number | string | Array<number | string>;
type DisabledBehavior = 'all' | 'selection';

type NormalizedListItem = {
  disabled: boolean,
  key: number | string,
  label: string,
  original: ListItemRecord | string
};

function normalizeItem(item: ListItemRecord | string, index: number): NormalizedListItem {
  if (typeof item === 'string') {
    return {
      key: item,
      label: item,
      disabled: false,
      original: item
    };
  }

  let key = item.key ?? item.id ?? index;
  let itemName = typeof item.name === 'string' ? item.name : undefined;
  let label = item.label ?? item.textValue ?? itemName ?? String(key);

  return {
    key,
    label,
    disabled: !!item.disabled,
    original: item
  };
}

function normalizeSelection(value: SelectionValue | undefined): Array<number | string> {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is number | string => typeof entry === 'number' || typeof entry === 'string');
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return [value];
  }

  return [];
}

function hasKey(collection: Array<number | string>, key: number | string): boolean {
  return collection.some((entry) => entry === key);
}

function toBooleanString(value: boolean): 'false' | 'true' {
  return value ? 'true' : 'false';
}

export const ListView = defineComponent({
  name: 'VueListView',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    density: {
      type: String as PropType<'compact' | 'regular' | 'spacious'>,
      default: 'regular'
    },
    disabledBehavior: {
      type: String as PropType<DisabledBehavior>,
      default: 'selection'
    },
    disabledKeys: {
      type: Array as PropType<Array<number | string>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<Array<ListItemRecord | string>>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    loadingState: {
      type: String as PropType<'idle' | 'loading' | 'loadingMore'>,
      default: 'idle'
    },
    modelValue: {
      type: [String, Number, Array] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    onAction: {
      type: Function as PropType<(key: number | string) => void>,
      default: undefined
    },
    onSelectionChange: {
      type: Function as PropType<(value: SelectionValue) => void>,
      default: undefined
    },
    overflowMode: {
      type: String as PropType<'truncate' | 'wrap'>,
      default: 'truncate'
    },
    selectedKeys: {
      type: [String, Number, Array] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    },
    selectionStyle: {
      type: String as PropType<SelectionStyle>,
      default: 'highlight'
    }
  },
  emits: {
    action: (key: number | string) => typeof key === 'number' || typeof key === 'string',
    select: (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    },
    selectionChange: (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    },
    'update:selectedKeys': (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    },
    'update:modelValue': (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    }
  },
  setup(props, {emit, attrs, slots}) {
    let hoveredKey = ref<number | string | null>(null);
    let focusedKey = ref<number | string | null>(null);
    let activeKey = ref<number | string | null>(null);

    let normalizedItems = computed(() => props.items.map((item, index) => normalizeItem(item, index)));
    let isControlledSelection = computed(() => props.selectedKeys !== undefined || props.modelValue !== undefined);
    let controlledSelection = computed(() => normalizeSelection(props.selectedKeys ?? props.modelValue));
    let uncontrolledSelection = ref<Array<number | string>>(normalizeSelection(props.modelValue));
    let selectedKeys = computed(() => new Set(isControlledSelection.value ? controlledSelection.value : uncontrolledSelection.value));

    let emitSelection = (value: SelectionValue) => {
      if (!isControlledSelection.value) {
        uncontrolledSelection.value = normalizeSelection(value);
      }

      emit('update:modelValue', value);
      emit('update:selectedKeys', value);
      emit('selectionChange', value);
      emit('select', value);
    };

    let onSelectItem = (item: NormalizedListItem, options: {isSelectionDisabled: boolean, isTotallyDisabled: boolean}) => {
      if (options.isTotallyDisabled) {
        return;
      }

      emit('action', item.key);

      if (props.selectionMode === 'none' || options.isSelectionDisabled) {
        emit('select', item.key);
        return;
      }

      if (props.selectionMode === 'single') {
        emitSelection(item.key);
        return;
      }

      let next = new Set(selectedKeys.value);
      if (next.has(item.key)) {
        next.delete(item.key);
      } else {
        next.add(item.key);
      }

      let values = Array.from(next);
      emitSelection(values);
    };

    return () => {
      let items = normalizedItems.value;
      let hasAnyChildren = items.some((item) => {
        if (typeof item.original === 'string') {
          return false;
        }
        return Array.isArray(item.original.children) && item.original.children.length > 0;
      });

      let rootClassName = classNames(
        listStyles,
        'react-spectrum-ListView',
        `react-spectrum-ListView--${props.density}`,
        'react-spectrum-ListView--emphasized',
        {
          'react-spectrum-ListView--dropTarget': false,
          'react-spectrum-ListView--draggable': false,
          'react-spectrum-ListView--hasAnyChildren': hasAnyChildren,
          'react-spectrum-ListView--isHorizontalScrollbarVisible': false,
          'react-spectrum-ListView--isVerticalScrollbarVisible': false,
          'react-spectrum-ListView--loadingMore': props.loadingState === 'loadingMore',
          'react-spectrum-ListView--quiet': props.isQuiet,
          'react-spectrum-ListView--wrap': props.overflowMode === 'wrap',
          'focus-ring': focusedKey.value !== null
        }
      );

      return h('div', {
        ...attrs,
        class: [rootClassName, 'vs-list-view', 'vs-listbox', attrs.class],
        role: 'grid',
        'aria-label': props.ariaLabel || attrs['aria-label'],
        'data-vac': ''
      }, [
        props.label ? h('p', {class: 'vs-listbox__label'}, props.label) : null,
        h('div', {class: ['vs-listbox__items', 'vs-list-view__items']}, [
          h('div', {
            role: 'row',
            hidden: true,
            'aria-hidden': 'true',
            style: {
              visibility: 'hidden'
            }
          }, [
            h('div', {
              role: 'gridcell',
              'aria-selected': 'false'
            }, [
              h('div', {
                class: classNames(listStyles, 'react-spectrum-ListViewInsertionIndicator')
              })
            ])
          ]),
          items.length === 0
            ? h('div', {
              role: 'row',
              'aria-rowindex': 1,
              class: classNames(
                listStyles,
                'react-spectrum-ListView-centeredWrapper',
                {
                  'react-spectrum-ListView-centeredWrapper--loadingMore': false
                }
              )
            }, [
              h('div', {role: 'gridcell'}, slots.default ? slots.default() : 'No items')
            ])
            : items.map((item, index) => {
              let isItemDisabled = props.isDisabled || item.disabled || hasKey(props.disabledKeys, item.key);
              let isTotallyDisabled = props.isDisabled || (isItemDisabled && props.disabledBehavior === 'all');
              let isSelected = selectedKeys.value.has(item.key);
              let isFocused = focusedKey.value === item.key && !isTotallyDisabled;
              let isHovered = hoveredKey.value === item.key && !isTotallyDisabled;
              let isActive = activeKey.value === item.key && !isTotallyDisabled;
              let prevSelected = index > 0 ? selectedKeys.value.has(items[index - 1].key) : false;
              let nextSelected = index + 1 < items.length ? selectedKeys.value.has(items[index + 1].key) : false;

              let rowClassName = classNames(listStyles, 'react-spectrum-ListView-row', {
                'focus-ring': isFocused,
                'round-bottoms': true,
                'round-tops': true
              });

              let itemClassName = classNames(listStyles, 'react-spectrum-ListViewItem', {
                'focus-ring': isFocused,
                'is-active': isActive,
                'is-disabled': isItemDisabled,
                'is-focused': isFocused,
                'is-hovered': isHovered,
                'is-next-selected': nextSelected,
                'is-prev-selected': prevSelected,
                'is-selected': isSelected,
                'react-spectrum-ListViewItem--dropTarget': false,
                'react-spectrum-ListViewItem--firstRow': index === 0,
                'react-spectrum-ListViewItem--hasDescription': false,
                'react-spectrum-ListViewItem--isFlushBottom': index === items.length - 1,
                'react-spectrum-ListViewItem--lastRow': index === items.length - 1
              });

              return h('div', {
                key: String(item.key),
                role: 'row',
                class: [rowClassName, 'vs-list-view__row'],
                tabindex: isTotallyDisabled ? -1 : 0,
                'aria-rowindex': index + 1,
                onMouseenter: () => {
                  hoveredKey.value = item.key;
                },
                onMouseleave: () => {
                  if (hoveredKey.value === item.key) {
                    hoveredKey.value = null;
                  }
                  if (activeKey.value === item.key) {
                    activeKey.value = null;
                  }
                },
                onMousedown: () => {
                  if (!isTotallyDisabled) {
                    activeKey.value = item.key;
                  }
                },
                onMouseup: () => {
                  if (activeKey.value === item.key) {
                    activeKey.value = null;
                  }
                }
              }, [
                h('div', {
                  role: 'gridcell',
                  class: 'vs-list-view__cell'
                }, [
                  h('button', {
                    type: 'button',
                    class: [itemClassName, 'vs-list-view__item', 'vs-listbox__item'],
                    disabled: isTotallyDisabled,
                    role: 'option',
                    'aria-selected': props.selectionMode === 'none' ? undefined : toBooleanString(isSelected),
                    onFocus: () => {
                      focusedKey.value = item.key;
                    },
                    onBlur: () => {
                      if (focusedKey.value === item.key) {
                        focusedKey.value = null;
                      }
                    },
                    onClick: () => {
                      activeKey.value = null;
                      onSelectItem(item, {
                        isSelectionDisabled: isItemDisabled,
                        isTotallyDisabled
                      });
                    }
                  }, [
                    h('div', {class: classNames(listStyles, 'react-spectrum-ListViewItem-grid')}, [
                      h('span', {class: 'vs-list-view__item-label'}, item.label)
                    ])
                  ])
                ]),
                h('div', {
                  role: 'row',
                  hidden: true,
                  'aria-hidden': 'true',
                  style: {
                    visibility: 'hidden'
                  }
                }, [
                  h('div', {
                    role: 'gridcell',
                    'aria-selected': 'false',
                    class: classNames(listStyles, 'react-spectrum-ListViewInsertionIndicator')
                  })
                ])
              ]);
            })
        ])
      ]);
    };
  }
});

export const VueListView = ListView;
export {Item} from '@vue-stately/collections';
export type SpectrumListViewProps = InstanceType<typeof ListView>['$props'];
