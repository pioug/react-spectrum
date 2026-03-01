import './styles.css';
import {Checkbox} from '@vue-spectrum/checkbox';
import {ProgressCircle} from '@vue-spectrum/progress';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';

const listStyles: {[key: string]: string} = {};
const DRAG_HOOKS_WARNING = 'Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.';
const DROP_HOOKS_WARNING = 'Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.';

export type ListItemRecord = {
  children?: ListItemRecord[],
  description?: string,
  disabled?: boolean,
  href?: string,
  id?: number | string,
  key?: number | string,
  label?: string,
  name?: string,
  rel?: string,
  target?: string,
  textValue?: string
} & Record<string, unknown>;

type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionStyle = 'checkbox' | 'highlight';
type SelectionValue = number | string | Iterable<number | string>;
type DisabledBehavior = 'all' | 'selection';

type NormalizedListItem = {
  disabled: boolean,
  key: number | string,
  label: string,
  original: ListItemRecord | string
};

const UNIT_RE = /(%|px|em|rem|vw|vh|auto|cm|mm|in|pt|pc|ex|ch|rem|vmin|vmax|fr)$/;
const FUNC_RE = /^\s*\w+\(/;
const SPECTRUM_VARIABLE_RE = /(static-)?size-\d+|single-line-(height|width)/g;

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
  if (typeof value === 'number' || typeof value === 'string') {
    return [value];
  }

  if (value == null || typeof value === 'string') {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>).filter((entry): entry is number | string => typeof entry === 'number' || typeof entry === 'string');
}

function isSelectionValue(value: SelectionValue): boolean {
  if (typeof value === 'number' || typeof value === 'string') {
    return true;
  }

  if (value == null || typeof value === 'string') {
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

function hasKey(collection: Iterable<number | string>, key: number | string): boolean {
  for (let entry of collection) {
    if (entry === key) {
      return true;
    }
  }

  return false;
}

function toBooleanString(value: boolean): 'false' | 'true' {
  return value ? 'true' : 'false';
}

function toDimensionValue(value: string | number | null | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (!value) {
    return undefined;
  }

  if (UNIT_RE.test(value)) {
    return value;
  }

  if (FUNC_RE.test(value)) {
    return value.replace(SPECTRUM_VARIABLE_RE, 'var(--spectrum-global-dimension-$&, var(--spectrum-alias-$&))');
  }

  return `var(--spectrum-global-dimension-${value}, var(--spectrum-alias-${value}))`;
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
    dragAndDropHooks: {
      type: Object as PropType<{
        useDraggableCollectionState?: unknown,
        useDroppableCollectionState?: unknown
      } | undefined>,
      default: undefined
    },
    disabledBehavior: {
      type: String as PropType<DisabledBehavior>,
      default: 'selection'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
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
    renderEmptyState: {
      type: Function as PropType<(() => unknown) | undefined>,
      default: undefined
    },
    modelValue: {
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
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
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    },
    selectionStyle: {
      type: String as PropType<SelectionStyle>,
      default: 'highlight'
    },
    width: {
      type: [String, Number] as PropType<number | string | undefined>,
      default: undefined
    },
    height: {
      type: [String, Number] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  emits: {
    action: (key: number | string) => typeof key === 'number' || typeof key === 'string',
    select: (value: SelectionValue) => {
      return isSelectionValue(value);
    },
    selectionChange: (value: SelectionValue) => {
      return isSelectionValue(value);
    },
    'update:selectedKeys': (value: SelectionValue) => {
      return isSelectionValue(value);
    },
    'update:modelValue': (value: SelectionValue) => {
      return isSelectionValue(value);
    }
  },
  setup(props, {emit, attrs, slots}) {
    let hoveredKey = ref<number | string | null>(null);
    let focusedKey = ref<number | string | null>(null);
    let activeKey = ref<number | string | null>(null);
    let isListDraggable = computed(() => Boolean(props.dragAndDropHooks?.useDraggableCollectionState));
    let isListDroppable = computed(() => Boolean(props.dragAndDropHooks?.useDroppableCollectionState));
    let dragHooksProvided = ref(isListDraggable.value);
    let dropHooksProvided = ref(isListDroppable.value);

    watch([isListDraggable, isListDroppable], ([nextIsListDraggable, nextIsListDroppable]) => {
      if (process.env.NODE_ENV !== 'production') {
        if (dragHooksProvided.value !== nextIsListDraggable) {
          console.warn(DRAG_HOOKS_WARNING);
        }

        if (dropHooksProvided.value !== nextIsListDroppable) {
          console.warn(DROP_HOOKS_WARNING);
        }
      }

      dragHooksProvided.value = nextIsListDraggable;
      dropHooksProvided.value = nextIsListDroppable;
    });

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

      emitSelection(new Set(next));
    };

    return () => {
      let items = normalizedItems.value;
      let renderedItems = items;
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

      let emptyStateContent = props.renderEmptyState
        ? props.renderEmptyState()
        : (slots.empty ? slots.empty() : 'No items');

      let rootStyle = {
        width: toDimensionValue(props.width),
        height: toDimensionValue(props.height)
      };

      return h('div', {
        ...attrs,
        class: [rootClassName, 'vs-list-view', 'vs-listbox', attrs.class],
        style: [rootStyle, attrs.style],
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
              h('div', {role: 'gridcell'}, props.loadingState === 'loading'
                ? h(ProgressCircle, {isIndeterminate: true, 'aria-label': 'Loading'})
                : emptyStateContent)
            ])
            : renderedItems.map((item, index) => {
              let itemRecord = typeof item.original === 'string' ? undefined : item.original;
              let isItemDisabled = props.isDisabled || item.disabled || hasKey(props.disabledKeys, item.key);
              let isTotallyDisabled = props.isDisabled || (isItemDisabled && props.disabledBehavior === 'all');
              let isSelected = selectedKeys.value.has(item.key);
              let isFocused = focusedKey.value === item.key && !isTotallyDisabled;
              let isHovered = hoveredKey.value === item.key && !isTotallyDisabled;
              let isActive = activeKey.value === item.key && !isTotallyDisabled;
              let prevSelected = index > 0 ? selectedKeys.value.has(renderedItems[index - 1].key) : false;
              let nextSelected = index + 1 < renderedItems.length ? selectedKeys.value.has(renderedItems[index + 1].key) : false;
              let itemDescription = itemRecord?.description;
              let showCheckbox = props.selectionMode !== 'none' && props.selectionStyle === 'checkbox';
              let previousKey = index > 0 ? renderedItems[index - 1].key : null;
              let nextKey = index + 1 < renderedItems.length ? renderedItems[index + 1].key : null;
              let roundTops = !prevSelected && focusedKey.value !== previousKey;
              let roundBottoms = !nextSelected && focusedKey.value !== nextKey;
              let roundForHover = isHovered && !isSelected && focusedKey.value !== item.key;

              let rowClassName = classNames(listStyles, 'react-spectrum-ListView-row', {
                'focus-ring': isFocused,
                'round-bottoms': roundBottoms || roundForHover,
                'round-tops': roundTops || roundForHover
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
                'react-spectrum-ListViewItem--hasDescription': Boolean(itemDescription),
                'react-spectrum-ListViewItem--isFlushBottom': index === renderedItems.length - 1,
                'react-spectrum-ListViewItem--lastRow': index === renderedItems.length - 1,
                'has-checkbox': showCheckbox
              });

              let itemContent = slots.item
                ? slots.item({
                  index,
                  isDisabled: isItemDisabled,
                  isSelected,
                  item: itemRecord ?? item.original
                })
                : [
                  h('div', {class: classNames(listStyles, 'react-spectrum-ListViewItem-content')}, item.label),
                  itemDescription
                    ? h('div', {class: classNames(listStyles, 'react-spectrum-ListViewItem-description')}, itemDescription)
                    : null
                ];
              let itemHref = itemRecord?.href;

              let itemProps: Record<string, unknown> = {
                class: [itemClassName, 'vs-list-view__item', 'vs-listbox__item'],
                role: 'option',
                'aria-disabled': isTotallyDisabled ? 'true' : undefined,
                'aria-selected': props.selectionMode === 'none' ? undefined : toBooleanString(isSelected),
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
                onFocus: () => {
                  focusedKey.value = item.key;
                },
                onBlur: () => {
                  if (focusedKey.value === item.key) {
                    focusedKey.value = null;
                  }
                },
                onClick: (event: MouseEvent) => {
                  if (itemHref && props.selectionMode !== 'none') {
                    event.preventDefault();
                  }
                  activeKey.value = null;
                  onSelectItem(item, {
                    isSelectionDisabled: isItemDisabled,
                    isTotallyDisabled
                  });
                }
              };

              if (itemHref && !isTotallyDisabled) {
                itemProps.href = itemHref;
                itemProps.target = itemRecord?.target;
                itemProps.rel = itemRecord?.rel;
              } else {
                itemProps.type = 'button';
                itemProps.disabled = isTotallyDisabled;
              }

              let checkboxNode = showCheckbox
                ? h('div', {class: classNames(listStyles, 'react-spectrum-ListViewItem-checkboxWrapper')}, [
                  h(Checkbox, {
                    class: classNames(listStyles, 'react-spectrum-ListViewItem-checkbox'),
                    'aria-label': 'Select',
                    excludeFromTabOrder: true,
                    isDisabled: isItemDisabled,
                    isSelected
                  })
                ])
                : null;
              let itemGridChildren = Array.isArray(itemContent)
                ? [checkboxNode, ...itemContent]
                : [checkboxNode, itemContent];

              return h('div', {
                key: String(item.key),
                role: 'row',
                class: [rowClassName, 'vs-list-view__row'],
                'data-href': itemHref ? '' : undefined,
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
                  h(itemHref && !isTotallyDisabled ? 'a' : 'button', itemProps, [
                    h('div', {class: classNames(listStyles, 'react-spectrum-ListViewItem-grid')}, itemGridChildren)
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
            }),
          props.loadingState === 'loadingMore' && items.length > 0
            ? h('div', {
              role: 'row',
              class: classNames(
                listStyles,
                'react-spectrum-ListView-centeredWrapper',
                'react-spectrum-ListView-centeredWrapper--loadingMore'
              )
            }, [
              h('div', {role: 'gridcell'}, [
                h(ProgressCircle, {isIndeterminate: true, 'aria-label': 'Loading more'})
              ])
            ])
            : null
        ])
      ]);
    };
  }
});

export const VueListView = ListView;
export {Item} from '@vue-stately/collections';
export type SpectrumListViewProps = InstanceType<typeof ListView>['$props'];
