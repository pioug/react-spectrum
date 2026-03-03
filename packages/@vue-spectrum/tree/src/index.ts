import '@adobe/spectrum-css-temp/components/treeview/vars.css';
import './tree.css';
import {Collection} from '@vue-stately/collections';
import {computed, defineComponent, h, nextTick, ref, type PropType, type VNode, watch} from 'vue';

type TreeNode = Record<string, unknown>;
type TreeNodeId = string | number;
type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionStyle = 'checkbox' | 'highlight';
type DisabledBehavior = 'all' | 'selection';
type TreeRenderEmptyState = () => unknown;
type TreeRenderContext = {
  hasChildren: boolean,
  hasChildItems: boolean,
  isDisabled: boolean,
  isExpanded: boolean,
  isSelected: boolean,
  level: number
};
type TreeRenderItem = (node: TreeNode, context: TreeRenderContext) => unknown;

type FlattenedTreeRow = {
  href?: string,
  id: TreeNodeId,
  isDisabled: boolean,
  isExpanded: boolean,
  isSelected: boolean,
  isSelectionDisabled: boolean,
  label: string,
  level: number,
  node: TreeNode,
  posInSet: number,
  rowDomId: string,
  setSize: number,
  toggleDomId: string,
  hasChildren: boolean,
  hasChildItems: boolean
};

const CHEVRON_RIGHT_MEDIUM_PATH = 'M5.99 5a.997.997 0 0 0-.293-.707L1.717.303A1 1 0 1 0 .303 1.717L3.586 5 .303 8.283a1 1 0 1 0 1.414 1.414l3.98-3.99A.997.997 0 0 0 5.99 5z';
const ROW_ID_PREFIX = 'vs-tree-row';
const TOGGLE_ID_PREFIX = 'vs-tree-toggle';

function isTreeNode(value: unknown): value is TreeNode {
  return typeof value === 'object' && value !== null;
}

function normalizeAttrKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function toDomIdSegment(value: TreeNodeId | string): string {
  return String(value)
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-');
}

export const Tree = defineComponent({
  name: 'VueTree',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    defaultExpanded: {
      type: Boolean,
      default: false
    },
    disabledBehavior: {
      type: String as PropType<DisabledBehavior>,
      default: 'selection'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<TreeNodeId>>,
      default: () => []
    },
    disallowEmptySelection: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    idKey: {
      type: String,
      default: 'id'
    },
    items: {
      type: Array as PropType<TreeNode[]>,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    modelValue: {
      type: [String, Number],
      default: undefined
    },
    onAction: {
      type: Function as PropType<((key: TreeNodeId) => void) | undefined>,
      default: undefined
    },
    renderEmptyState: {
      type: Function as PropType<TreeRenderEmptyState | undefined>,
      default: undefined
    },
    renderItem: {
      type: Function as PropType<TreeRenderItem | undefined>,
      default: undefined
    },
    renderItemActions: {
      type: Function as PropType<TreeRenderItem | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    selectionStyle: {
      type: String as PropType<SelectionStyle>,
      default: 'checkbox'
    }
  },
  emits: {
    expandedChange: (value: Set<TreeNodeId>) => value instanceof Set,
    itemAction: (node: TreeNode) => typeof node === 'object' && node !== null,
    'update:modelValue': (value: TreeNodeId) => typeof value === 'string' || typeof value === 'number'
  },
  setup(props, {emit, attrs}) {
    let expandedKeys = ref<Set<TreeNodeId>>(new Set());
    let focusedRowKey = ref<TreeNodeId | null>(null);
    let rowElements = new Map<TreeNodeId, HTMLElement>();

    let classes = computed(() => (['vs-tree']));

    let disabledKeySet = computed(() => {
      let next = new Set<TreeNodeId>();
      for (let value of props.disabledKeys) {
        if (typeof value === 'string' || typeof value === 'number') {
          next.add(value);
        }
      }
      return next;
    });

    let blockedRootAttrs = new Set([
      'childrenkey',
      'defaultexpanded',
      'disabledbehavior',
      'disabledkeys',
      'disallowemptyselection',
      'hidden',
      'idkey',
      'items',
      'labelkey',
      'modelvalue',
      'onaction',
      'renderemptystate',
      'renderitem',
      'renderitemactions',
      'selectionmode',
      'selectionstyle'
    ]);

    let getRootAriaLabel = (): string | undefined => {
      if (props.ariaLabel) {
        return props.ariaLabel;
      }

      let ariaLabel = attrs['aria-label'];
      return typeof ariaLabel === 'string' && ariaLabel.length > 0 ? ariaLabel : undefined;
    };

    let sanitizeRootAttrs = () => {
      let filteredAttrs: Record<string, unknown> = {};

      for (let [key, value] of Object.entries(attrs)) {
        if (blockedRootAttrs.has(normalizeAttrKey(key))) {
          continue;
        }
        filteredAttrs[key] = value;
      }

      return filteredAttrs;
    };

    let getNodeChildren = (node: TreeNode): TreeNode[] => {
      let children = node[props.childrenKey];
      return Array.isArray(children) ? children.filter((item): item is TreeNode => isTreeNode(item)) : [];
    };

    let getNodeId = (node: TreeNode, index: number, prefix: string): TreeNodeId => {
      let id = node[props.idKey];
      if (typeof id === 'string' || typeof id === 'number') {
        return id;
      }

      return `${prefix}-${index}`;
    };

    let getNodeLabel = (node: TreeNode, index: number): string => {
      let label = node[props.labelKey];
      if (typeof label === 'string' || typeof label === 'number') {
        return String(label);
      }

      return `Item ${index + 1}`;
    };

    let getNodeHref = (node: TreeNode): string | undefined => {
      let href = node.href;
      return typeof href === 'string' ? href : undefined;
    };

    let getNodeHasChildItems = (node: TreeNode, children: TreeNode[]): boolean => {
      if (typeof node.hasChildItems === 'boolean') {
        return node.hasChildItems;
      }

      return children.length > 0;
    };

    let collectExpandedKeys = (nodes: TreeNode[], prefix: string, output: Set<TreeNodeId>) => {
      nodes.forEach((node, index) => {
        let id = getNodeId(node, index, prefix);
        let children = getNodeChildren(node);
        if (children.length > 0) {
          output.add(id);
          collectExpandedKeys(children, `${prefix}-${index}`, output);
        }
      });
    };

    watch([() => props.items, () => props.defaultExpanded], () => {
      if (!props.defaultExpanded) {
        expandedKeys.value = new Set<TreeNodeId>();
        return;
      }

      let next = new Set<TreeNodeId>();
      collectExpandedKeys(props.items, 'root', next);
      expandedKeys.value = next;
    }, {immediate: true, deep: true});

    let toggleExpanded = (id: TreeNodeId) => {
      let next = new Set(expandedKeys.value);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      expandedKeys.value = next;
      emit('expandedChange', next);
    };

    let flattenNodes = (nodes: TreeNode[], prefix: string, level: number): FlattenedTreeRow[] => {
      let rows: FlattenedTreeRow[] = [];

      nodes.forEach((node, index) => {
        let id = getNodeId(node, index, prefix);
        let children = getNodeChildren(node);
        let hasChildren = children.length > 0;
        let hasChildItems = getNodeHasChildItems(node, children);
        let isExpanded = hasChildren ? expandedKeys.value.has(id) : false;
        let isSelectionDisabled = disabledKeySet.value.has(id);
        let isDisabled = isSelectionDisabled && props.disabledBehavior === 'all';
        let idSegment = `${toDomIdSegment(prefix)}-${toDomIdSegment(id)}-${index}`;

        rows.push({
          href: getNodeHref(node),
          id,
          isDisabled,
          isExpanded,
          isSelected: props.modelValue === id,
          isSelectionDisabled,
          label: getNodeLabel(node, index),
          level,
          node,
          posInSet: index + 1,
          rowDomId: `${ROW_ID_PREFIX}-${idSegment}`,
          setSize: nodes.length,
          toggleDomId: `${TOGGLE_ID_PREFIX}-${idSegment}`,
          hasChildren,
          hasChildItems
        });

        if (hasChildren && isExpanded) {
          rows.push(...flattenNodes(children, `${prefix}-${index}`, level + 1));
        }
      });

      return rows;
    };

    let visibleRows = computed(() => flattenNodes(props.items, 'root', 1));

    watch(visibleRows, (rows) => {
      if (rows.length === 0) {
        focusedRowKey.value = null;
        return;
      }

      if (focusedRowKey.value != null && !rows.some((row) => row.id === focusedRowKey.value)) {
        focusedRowKey.value = null;
      }
    }, {immediate: true});

    let setRowElement = (id: TreeNodeId, element: Element | null) => {
      if (element instanceof HTMLElement) {
        rowElements.set(id, element);
      } else {
        rowElements.delete(id);
      }
    };

    let focusRowAtIndex = (index: number) => {
      let row = visibleRows.value[index];
      if (!row) {
        return;
      }

      focusedRowKey.value = row.id;
      nextTick(() => {
        rowElements.get(row.id)?.focus();
      });
    };

    let focusParentRow = (childIndex: number, childLevel: number) => {
      for (let index = childIndex - 1; index >= 0; index -= 1) {
        let parent = visibleRows.value[index];
        if (parent.level < childLevel) {
          focusRowAtIndex(index);
          return;
        }
      }
    };

    let renderEmpty = (): VNode | null => {
      if (props.items.length > 0 || typeof props.renderEmptyState !== 'function') {
        return null;
      }

      let content = props.renderEmptyState();
      if (content == null) {
        return null;
      }

      return h('div', {class: 'vs-tree__empty'}, content as any);
    };

    let onRowAction = (row: FlattenedTreeRow) => {
      if (row.isDisabled) {
        return;
      }

      focusedRowKey.value = row.id;
      let shouldToggleExpanded = row.hasChildren
        && props.selectionMode === 'none'
        && row.href == null
        && typeof props.onAction !== 'function';
      if (shouldToggleExpanded) {
        toggleExpanded(row.id);
        return;
      }

      if (!row.isSelectionDisabled && props.selectionMode !== 'none') {
        emit('update:modelValue', row.id);
      }
      emit('itemAction', row.node);
    };

    let renderRow = (row: FlattenedTreeRow, index: number): VNode => {
      let renderContext: TreeRenderContext = {
        hasChildren: row.hasChildren,
        hasChildItems: row.hasChildItems,
        isDisabled: row.isDisabled,
        isExpanded: row.isExpanded,
        isSelected: row.isSelected,
        level: row.level
      };

      let itemContent = typeof props.renderItem === 'function'
        ? props.renderItem(row.node, renderContext)
        : row.label;
      let itemActions = typeof props.renderItemActions === 'function'
        ? props.renderItemActions(row.node, renderContext)
        : null;
      let contentNodes = Array.isArray(itemContent) ? itemContent : [itemContent];
      let primaryContent = contentNodes.length > 0 ? contentNodes[0] : null;
      let iconNodes = contentNodes.length > 1 ? contentNodes.slice(1) : [];

      return h('div', {
        key: String(row.id),
        id: row.rowDomId,
        class: [
          'vs-tree__row',
          row.isSelected ? 'is-selected' : null,
          row.isDisabled ? 'is-disabled' : null,
          row.href ? 'is-link' : null,
          row.hasChildren && row.isExpanded ? 'is-open' : null
        ],
        ref: (element: Element | null) => {
          setRowElement(row.id, element);
        },
        role: 'row',
        tabindex: focusedRowKey.value === row.id ? 0 : -1,
        'aria-label': row.label,
        'aria-level': String(row.level),
        'aria-posinset': String(row.posInSet),
        'aria-setsize': String(row.setSize),
        'aria-expanded': row.hasChildren ? String(row.isExpanded) : undefined,
        'aria-selected': props.selectionMode === 'none' ? undefined : row.isSelected ? 'true' : 'false',
        'data-disabled': row.isDisabled ? 'true' : undefined,
        'data-expanded': row.hasChildren && row.isExpanded ? 'true' : undefined,
        'data-has-child-items': row.hasChildItems ? 'true' : undefined,
        'data-href': row.href,
        'data-level': String(row.level),
        'data-rac': '',
        'data-selected': row.isSelected ? 'true' : undefined,
        'data-selection-mode': props.selectionMode === 'none' ? undefined : props.selectionMode,
        style: {
          '--tree-item-level': String(row.level)
        },
        onFocus: () => {
          focusedRowKey.value = row.id;
        },
        onClick: (event: MouseEvent) => {
          let target = event.target;
          if (target instanceof Element && (target.closest('.vs-tree__toggle') || target.closest('[role="toolbar"]'))) {
            return;
          }
          onRowAction(row);
        },
        onKeydown: (event: KeyboardEvent) => {
          let key = event.key;

          if (key === 'ArrowDown') {
            event.preventDefault();
            focusRowAtIndex(Math.min(index + 1, visibleRows.value.length - 1));
            return;
          }

          if (key === 'ArrowUp') {
            event.preventDefault();
            focusRowAtIndex(Math.max(index - 1, 0));
            return;
          }

          if (key === 'Home') {
            event.preventDefault();
            focusRowAtIndex(0);
            return;
          }

          if (key === 'End') {
            event.preventDefault();
            focusRowAtIndex(visibleRows.value.length - 1);
            return;
          }

          if (key === 'ArrowRight' && row.hasChildren && !row.isExpanded) {
            event.preventDefault();
            toggleExpanded(row.id);
            return;
          }

          if (key === 'ArrowLeft') {
            if (row.hasChildren && row.isExpanded) {
              event.preventDefault();
              toggleExpanded(row.id);
              return;
            }

            if (row.level > 1) {
              event.preventDefault();
              focusParentRow(index, row.level);
            }
            return;
          }

          if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
            event.preventDefault();
            onRowAction(row);
          }
        }
      }, [
        h('div', {
          role: 'gridcell',
          'aria-colindex': '1',
          style: 'display: contents;'
        }, [
          h('div', {class: 'vs-tree__cell-grid'}, [
            h('div', {
              class: 'vs-tree__level-padding',
              style: {
                gridArea: 'level-padding',
                marginInlineEnd: `calc(${Math.max(0, row.level - 1)} * var(--spectrum-global-dimension-size-200))`
              }
            }),
            row.hasChildItems
              ? h('span', {
                id: row.toggleDomId,
                class: ['vs-tree__toggle', row.isExpanded ? 'is-expanded' : null],
                role: 'button',
                'aria-disabled': row.isDisabled ? 'true' : undefined,
                'aria-label': row.isExpanded ? 'Collapse' : 'Expand',
                'aria-labelledby': `${row.toggleDomId} ${row.rowDomId}`,
                onMousedown: (event: MouseEvent) => {
                  event.preventDefault();
                },
                onClick: (event: MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!row.hasChildren || row.isDisabled) {
                    return;
                  }
                  toggleExpanded(row.id);
                }
              }, [
                h('svg', {
                  class: [
                    'spectrum-Icon',
                    'spectrum-UIIcon-ChevronRightMedium',
                    'vs-tree__toggle-icon'
                  ],
                  focusable: 'false',
                  'aria-hidden': 'true',
                  role: 'img',
                  viewBox: '0 0 6 10',
                  width: '6',
                  height: '10'
                }, [
                  h('path', {
                    d: CHEVRON_RIGHT_MEDIUM_PATH
                  })
                ])
              ])
              : h('span', {
                class: 'vs-tree__spacer',
                'aria-hidden': 'true'
              }),
            iconNodes.length > 0
              ? h('span', {
                class: 'vs-tree__item-icon'
              }, iconNodes as any)
              : null,
            h('span', {
              class: 'vs-tree__item-content',
              role: 'none'
            }, primaryContent as any),
            itemActions != null
              ? h('div', {
                class: 'vs-tree__actions',
                onMousedown: (event: MouseEvent) => {
                  event.stopPropagation();
                },
                onClick: (event: MouseEvent) => {
                  event.stopPropagation();
                }
              }, [
                h('div', {
                  class: 'vs-tree__actions-toolbar',
                  role: 'toolbar',
                  'aria-orientation': 'horizontal',
                  'aria-disabled': row.isDisabled ? 'true' : 'false'
                }, itemActions as any)
              ])
              : null
          ])
        ])
      ]);
    };

    return () => h('div', {
      ...sanitizeRootAttrs(),
      class: ['react-spectrum-TreeView', classes.value, attrs.class],
      role: 'treegrid',
      tabindex: props.hidden ? undefined : 0,
      'aria-label': getRootAriaLabel(),
      hidden: props.hidden || undefined,
      'aria-hidden': props.hidden ? 'true' : undefined,
      'data-rac': '',
      onKeydown: (event: KeyboardEvent) => {
        if (event.target !== event.currentTarget || visibleRows.value.length === 0) {
          return;
        }

        if (event.key === 'ArrowDown' || event.key === 'Home') {
          event.preventDefault();
          focusRowAtIndex(0);
          return;
        }

        if (event.key === 'ArrowUp' || event.key === 'End') {
          event.preventDefault();
          focusRowAtIndex(visibleRows.value.length - 1);
        }
      }
    }, [
      visibleRows.value.length > 0
        ? visibleRows.value.map((row, index) => renderRow(row, index))
        : renderEmpty()
    ]);
  }
});

export const TreeView = defineComponent({
  name: 'VueTreeView',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(Tree, {
      ...attrs
    }, slots);
  }
});

export const TreeViewItem = defineComponent({
  name: 'VueTreeViewItem',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(Tree, {
      ...attrs
    }, slots);
  }
});

export const TreeViewItemContent = defineComponent({
  name: 'VueTreeViewItemContent',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(Tree, {
      ...attrs
    }, slots);
  }
});

export {Collection};
export {Tree as VueTree};

export type SpectrumTreeViewProps<T = unknown> = {
  items?: T[]
} & Record<string, unknown>;
export type SpectrumTreeViewItemProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;
export type SpectrumTreeViewItemContentProps<T = unknown> = {
  item?: T
} & Record<string, unknown>;
