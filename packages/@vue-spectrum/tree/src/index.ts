import '@adobe/spectrum-css-temp/components/treeview/vars.css';
import './tree.css';
import {Collection} from '@vue-stately/collections';
import {computed, defineComponent, h, ref, type VNode, watch} from 'vue';

type TreeNode = Record<string, unknown>;
type TreeNodeId = string | number;
type TreeRenderEmptyState = () => unknown;
type TreeRenderContext = {
  hasChildren: boolean,
  isExpanded: boolean,
  isSelected: boolean,
  level: number
};
type TreeRenderItem = (node: TreeNode, context: TreeRenderContext) => unknown;
const CHEVRON_RIGHT_MEDIUM_PATH = 'M5.99 5a.997.997 0 0 0-.293-.707L1.717.303A1 1 0 1 0 .303 1.717L3.586 5 .303 8.283a1 1 0 1 0 1.414 1.414l3.98-3.99A.997.997 0 0 0 5.99 5z';

export const Tree = defineComponent({
  name: 'VueTree',
  inheritAttrs: false,
  props: {
    childrenKey: {
      type: String,
      default: 'children'
    },
    defaultExpanded: {
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
      type: Array as () => TreeNode[],
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
    renderEmptyState: {
      type: Function,
      default: undefined
    },
    renderItem: {
      type: Function,
      default: undefined
    },
    renderItemActions: {
      type: Function,
      default: undefined
    }
  },
  emits: {
    expandedChange: (value: Set<TreeNodeId>) => value instanceof Set,
    itemAction: (node: TreeNode) => typeof node === 'object' && node !== null,
    'update:modelValue': (value: TreeNodeId) => typeof value === 'string' || typeof value === 'number'
  },
  setup(props, {emit, attrs}) {
    let expandedKeys = ref<Set<TreeNodeId>>(new Set());

    let classes = computed(() => (['vs-tree']));

    let getRootAriaLabel = (): string | undefined => {
      let ariaLabel = attrs['aria-label'];
      return typeof ariaLabel === 'string' && ariaLabel.length > 0 ? ariaLabel : undefined;
    };

    let sanitizeRootAttrs = () => {
      let filteredAttrs: Record<string, unknown> = {};
      let blocked = new Set([
        'selectionmode',
        'selectionstyle',
        'disabledbehavior',
        'disabledkeys',
        'disallowemptyselection',
        'onaction'
      ]);

      for (let [key, value] of Object.entries(attrs)) {
        if (!blocked.has(key.toLowerCase())) {
          filteredAttrs[key] = value;
        }
      }

      return filteredAttrs;
    };

    let toIndentClassName = (level: number): string => {
      let clampedLevel = Math.max(1, Math.min(10, level));
      return `spectrum-TreeView-item--indent${clampedLevel}`;
    };

    let getNodeChildren = (node: TreeNode): TreeNode[] => {
      let children = node[props.childrenKey];
      return Array.isArray(children) ? children.filter((item): item is TreeNode => typeof item === 'object' && item !== null) : [];
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

    let collectExpandedKeys = (nodes: TreeNode[], prefix: string, output: Set<TreeNodeId>) => {
      nodes.forEach((node, index) => {
        let id = getNodeId(node, index, prefix);
        let children = getNodeChildren(node);
        if (children.length > 0) {
          output.add(id);
          collectExpandedKeys(children, String(id), output);
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

    let renderList = (nodes: TreeNode[], prefix: string, level: number, isRoot = false): VNode => h('ul', {
      class: [
        'spectrum-TreeView',
        'vs-tree__list',
        isRoot ? 'vs-tree__list--root' : null
      ],
      role: 'rowgroup'
    }, nodes.map((node, index) => {
      let id = getNodeId(node, index, prefix);
      let label = getNodeLabel(node, index);
      let children = getNodeChildren(node);
      let hasChildren = children.length > 0;
      let isExpanded = hasChildren ? expandedKeys.value.has(id) : false;
      let isSelected = props.modelValue === id;
      let href = getNodeHref(node);
      let renderContext: TreeRenderContext = {
        hasChildren,
        isExpanded,
        isSelected,
        level
      };
      let itemContent = typeof props.renderItem === 'function'
        ? (props.renderItem as TreeRenderItem)(node, renderContext)
        : label;
      let itemActions = typeof props.renderItemActions === 'function'
        ? (props.renderItemActions as TreeRenderItem)(node, renderContext)
        : null;
      let onItemAction = () => {
        emit('update:modelValue', id);
        emit('itemAction', node);
      };

      return h('li', {
        class: [
          'spectrum-TreeView-item',
          'vs-tree__node',
          hasChildren && isExpanded ? 'is-open' : null
        ],
        key: String(id),
        role: 'row',
        'aria-label': label,
        'aria-level': String(level),
        'aria-posinset': String(index + 1),
        'aria-setsize': String(nodes.length),
        'aria-expanded': hasChildren ? String(isExpanded) : undefined,
        'aria-selected': isSelected ? 'true' : undefined
      }, [
        h('div', {
          role: 'gridcell',
          'aria-colindex': '1',
          style: 'display: contents;'
        }, [
          h('div', {class: ['vs-tree__row', isSelected ? 'is-selected' : null]}, [
            hasChildren
              ? h('button', {
                class: [
                  'vs-tree__toggle',
                  isExpanded ? 'is-expanded' : null
                ],
                type: 'button',
                'aria-label': isExpanded ? 'Collapse' : 'Expand',
                onClick: (event: Event) => {
                  event.preventDefault();
                  toggleExpanded(id);
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
              : h('span', {class: 'vs-tree__spacer', 'aria-hidden': 'true'}),
            href
              ? h('a', {
                class: [
                  'spectrum-TreeView-itemLink',
                  'vs-tree__item',
                  isSelected ? 'is-selected' : null,
                  toIndentClassName(level)
                ],
                href,
                onClick: onItemAction
              }, [h('span', {class: 'vs-tree__item-content'}, itemContent as any)])
              : h('button', {
                class: [
                  'spectrum-TreeView-itemLink',
                  'vs-tree__item',
                  isSelected ? 'is-selected' : null,
                  toIndentClassName(level)
                ],
                type: 'button',
                onClick: onItemAction
              }, [h('span', {class: 'vs-tree__item-content'}, itemContent as any)]),
            itemActions != null
              ? h('span', {class: 'vs-tree__actions'}, itemActions as any)
              : null
          ])
        ]),
        hasChildren && isExpanded ? renderList(children, String(id), level + 1) : null
      ]);
    }));

    let renderEmpty = (): VNode | null => {
      if (props.items.length > 0 || typeof props.renderEmptyState !== 'function') {
        return null;
      }

      let content = (props.renderEmptyState as TreeRenderEmptyState)();
      if (content == null) {
        return null;
      }

      return h('div', {class: 'vs-tree__empty'}, content as any);
    };

    return () => h('nav', {
      ...sanitizeRootAttrs(),
      class: ['react-spectrum-TreeView', classes.value, attrs.class],
      role: 'treegrid',
      tabindex: props.hidden ? undefined : 0,
      'aria-label': getRootAriaLabel(),
      hidden: props.hidden || undefined,
      'aria-hidden': props.hidden ? 'true' : undefined,
      'data-vac': ''
    }, [
      props.items.length > 0 ? renderList(props.items, 'root', 1, true) : renderEmpty(),
      h('div', {
        hidden: true,
        'aria-hidden': 'true',
        class: 'vs-tree__hidden-marker'
      })
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
