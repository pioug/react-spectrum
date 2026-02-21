import {computed, defineComponent, h, ref, type VNode, watch} from 'vue';

type TreeNode = Record<string, unknown>;
type TreeNodeId = string | number;

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
      default: true
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
    }
  },
  emits: {
    itemAction: (node: TreeNode) => typeof node === 'object' && node !== null,
    'update:modelValue': (value: TreeNodeId) => typeof value === 'string' || typeof value === 'number'
  },
  setup(props, {emit, attrs}) {
    let expandedKeys = ref<Set<TreeNodeId>>(new Set());

    let classes = computed(() => (['vs-tree']));

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

    watch(() => props.items, () => {
      if (!props.defaultExpanded) {
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
    };

    let renderList = (nodes: TreeNode[], prefix: string): VNode => h('ul', {class: 'vs-tree__list'}, nodes.map((node, index) => {
      let id = getNodeId(node, index, prefix);
      let label = getNodeLabel(node, index);
      let children = getNodeChildren(node);
      let hasChildren = children.length > 0;
      let isExpanded = hasChildren ? expandedKeys.value.has(id) : false;
      let isSelected = props.modelValue === id;

      return h('li', {class: 'vs-tree__node', key: String(id)}, [
        h('div', {class: ['vs-tree__row', isSelected ? 'is-selected' : null]}, [
          hasChildren
            ? h('button', {
              class: ['vs-tree__toggle', isExpanded ? 'is-expanded' : null],
              type: 'button',
              'aria-label': isExpanded ? 'Collapse' : 'Expand',
              onClick: (event: Event) => {
                event.preventDefault();
                toggleExpanded(id);
              }
            }, isExpanded ? '▾' : '▸')
            : h('span', {class: 'vs-tree__spacer', 'aria-hidden': 'true'}),
          h('button', {
            class: 'vs-tree__item',
            type: 'button',
            onClick: () => {
              emit('update:modelValue', id);
              emit('itemAction', node);
            }
          }, label)
        ]),
        hasChildren && isExpanded ? renderList(children, String(id)) : null
      ]);
    }));

    return () => h('nav', {
      ...attrs,
      class: [classes.value, attrs.class],
      hidden: props.hidden || undefined,
      'aria-hidden': props.hidden ? 'true' : undefined,
      'data-vac': ''
    }, [
      renderList(props.items, 'root'),
      h('div', {
        hidden: true,
        'aria-hidden': 'true',
        class: 'vs-tree__hidden-marker'
      })
    ]);
  }
});

export const TreeView = Tree;
export const TreeViewItem = Tree;
export const TreeViewItemContent = Tree;
export const Collection = Tree;
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
