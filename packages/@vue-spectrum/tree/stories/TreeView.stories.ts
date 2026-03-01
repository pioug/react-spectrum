import {action} from 'storybook/actions';
import {ActionButton} from '@vue-spectrum/button';
import {Content} from '@vue-spectrum/view';
import {Heading} from '@vue-spectrum/text';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {Link} from '@vue-spectrum/link';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Edit from '@spectrum-icons-vue/workflow/Edit';
import FileTxt from '@spectrum-icons-vue/workflow/FileTxt';
import Folder from '@spectrum-icons-vue/workflow/Folder';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, h, ref, watch} from 'vue';
import {TreeView} from '../src';

type TreeNodeId = string | number;
type TreeNodeIcon = 'file' | 'folder';

type TreeNode = {
  children?: TreeNode[],
  href?: string,
  icon?: TreeNodeIcon,
  id: TreeNodeId,
  label: string
};

type StoryArgs = {
  childrenKey?: string,
  defaultExpanded?: boolean,
  disabledBehavior?: 'all' | 'selection',
  disallowEmptySelection?: boolean,
  hidden?: boolean,
  idKey?: string,
  items?: TreeNode[],
  labelKey?: string,
  modelValue?: TreeNodeId,
  onAction?: ((key: TreeNodeId) => void) | undefined,
  renderEmptyState?: (() => unknown) | undefined,
  selectionMode?: 'none' | 'single' | 'multiple',
  selectionStyle?: 'checkbox' | 'highlight'
};

type RenderTreeOptions = {
  ariaLabel: string,
  disabledKeys?: TreeNodeId[],
  showActions?: boolean
};

const TREE_SELECTION_ARGS = {
  selectionMode: 'none',
  selectionStyle: 'checkbox',
  disabledBehavior: 'selection'
} as const;

const TREE_SELECTION_ARG_TYPES = {
  selectionMode: {
    control: 'radio',
    options: ['none', 'single', 'multiple']
  },
  selectionStyle: {
    control: 'radio',
    options: ['checkbox', 'highlight']
  },
  disabledBehavior: {
    control: 'radio',
    options: ['selection', 'all']
  },
  disallowEmptySelection: {
    control: {
      type: 'boolean'
    }
  }
};

const STATIC_ITEMS: TreeNode[] = [
  {
    id: 'Photos',
    icon: 'folder',
    label: 'Photos'
  },
  {
    id: 'projects',
    label: 'Projects',
    children: [
      {
        id: 'projects-1',
        label: 'Projects-1',
        children: [
          {
            id: 'projects-1A',
            label: 'Projects-1A'
          }
        ]
      },
      {
        id: 'projects-2',
        label: 'Projects-2'
      },
      {
        id: 'projects-3',
        label: 'Projects-3'
      }
    ]
  }
];

const DYNAMIC_ITEMS: TreeNode[] = [
  {
    id: 'projects',
    label: 'Projects',
    children: [
      {
        id: 'project-1',
        label: 'Project 1'
      },
      {
        id: 'project-2',
        label: 'Project 2',
        children: [
          {
            id: 'project-2A',
            label: 'Project 2A'
          },
          {
            id: 'project-2B',
            label: 'Project 2B'
          },
          {
            id: 'project-2C',
            label: 'Project 2C'
          }
        ]
      },
      {
        id: 'project-3',
        label: 'Project 3'
      },
      {
        id: 'project-4',
        label: 'Project 4'
      },
      {
        id: 'project-5',
        label: 'Project 5',
        children: [
          {
            id: 'project-5A',
            label: 'Project 5A'
          },
          {
            id: 'project-5B',
            label: 'Project 5B'
          },
          {
            id: 'project-5C',
            label: 'Project 5C'
          }
        ]
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    children: [
      {
        id: 'reports-1',
        label: 'Reports 1',
        children: [
          {
            id: 'reports-1A',
            label: 'Reports 1A',
            children: [
              {
                id: 'reports-1AB',
                label: 'Reports 1AB',
                children: [
                  {
                    id: 'reports-1ABC',
                    label: 'Reports 1ABC'
                  }
                ]
              }
            ]
          },
          {
            id: 'reports-1B',
            label: 'Reports 1B'
          },
          {
            id: 'reports-1C',
            label: 'Reports 1C'
          }
        ]
      },
      {
        id: 'reports-2',
        label: 'Reports 2'
      }
    ]
  }
];

const DYNAMIC_ITEMS_WITH_LINKS = mapNodesWithHref(DYNAMIC_ITEMS, 'https://adobe.com/');

const meta: Meta<StoryArgs> = {
  title: 'TreeView',
  excludeStories: [
    'renderEmptyState'
  ],
  argTypes: {
    items: {
      table: {
        disable: true
      }
    },
    renderEmptyState: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function mapNodesWithHref(nodes: TreeNode[], href: string): TreeNode[] {
  return nodes.map((node) => ({
    ...node,
    href,
    children: node.children ? mapNodesWithHref(node.children, href) : undefined
  }));
}

function normalizeNodeId(value: unknown): TreeNodeId | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

function normalizeItems(value: unknown, fallback: TreeNode[]): TreeNode[] {
  return Array.isArray(value) ? value as TreeNode[] : fallback;
}

function resolveActionKey(node: unknown, idKey?: string): TreeNodeId | undefined {
  if (node == null || typeof node !== 'object') {
    return undefined;
  }

  let key = typeof idKey === 'string' && idKey.length > 0 ? idKey : 'id';
  return normalizeNodeId((node as Record<string, unknown>)[key]);
}

export function renderEmptyState() {
  return h(IllustratedMessage, null, [
    h('svg', {
      width: '150',
      height: '103',
      viewBox: '0 0 150 103'
    }, [
      h('path', {
        d: 'M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z M32.6,16.5c0,0.6-0.4,1-1,1h-10c-0.6,0-1-0.4-1-1s0.4-1,1-1h10C32.2,15.5,32.6,15.9,32.6,16.5z M13.6,56.1l-8.6,8.5C4.8,65,4.4,65.1,4,65.1c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l8.6-8.5l-8.6-8.5c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l8.6,8.5l8.6-8.5c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L15.8,54l8.6,8.5c0.6,0.6,0.6,1.5,0,2.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4L13.6,56.1z'
      })
    ]),
    h(Heading, null, () => 'No results'),
    h(Content, null, () => [
      'No results found, press ',
      h(Link, {onPress: action('linkPress')}, () => 'here'),
      ' for more info.'
    ])
  ]);
}

function nodeIcon(node: TreeNode) {
  let icon = node.icon ?? (node.children && node.children.length > 0 ? 'folder' : 'file');

  return icon === 'folder'
    ? h(Folder, {'aria-hidden': 'true', size: 'S'})
    : h(FileTxt, {'aria-hidden': 'true', size: 'S'});
}

function renderTree(defaultItems: TreeNode[] = STATIC_ITEMS, options: RenderTreeOptions) {
  return (args: StoryArgs) => ({
    components: {TreeView},
    setup() {
      let selectedKey = ref<TreeNodeId | undefined>(normalizeNodeId(args.modelValue));
      let items = computed(() => normalizeItems(args.items, defaultItems));
      let ariaLabel = options.ariaLabel;
      let disabledKeys = options.disabledKeys ?? [];
      let showActions = options.showActions ?? true;

      watch(() => args.modelValue, (value) => {
        selectedKey.value = normalizeNodeId(value);
      });

      let onSelectionChange = (value: TreeNodeId) => {
        selectedKey.value = value;
        action('onSelectionChange')(value);
      };
      let onExpandedChange = (value: Set<TreeNodeId>) => {
        action('onExpandedChange')(Array.from(value));
      };
      let onItemAction = (node: unknown) => {
        let key = resolveActionKey(node, args.idKey);
        if (key == null) {
          return;
        }

        let onAction = args.onAction;
        if (typeof onAction === 'function') {
          onAction(key);
        }
      };
      let onActionGroupAction = action('onActionGroup action');
      let renderItem = (node: TreeNode) => [
        nodeIcon(node),
        h('span', {class: 'vs-tree-story__label'}, node.label)
      ];
      let renderItemActions = showActions
        ? () => [
          h(ActionButton, {
            isQuiet: true,
            'aria-label': 'Edit',
            onClick: () => onActionGroupAction('edit')
          }, () => h(Edit, {'aria-hidden': 'true', size: 'S'})),
          h(ActionButton, {
            isQuiet: true,
            'aria-label': 'Delete',
            onClick: () => onActionGroupAction('delete')
          }, () => h(Delete, {'aria-hidden': 'true', size: 'S'}))
        ]
        : undefined;

      return {
        ariaLabel,
        args,
        disabledKeys,
        items,
        onExpandedChange,
        onItemAction,
        onSelectionChange,
        renderItem,
        renderItemActions,
        selectedKey
      };
    },
    template: `
      <div style="width: 300px; resize: both; height: 90vh; overflow: auto;">
        <TreeView
          v-bind="args"
          :aria-label="ariaLabel"
          :disabled-keys="disabledKeys"
          :items="items"
          :model-value="selectedKey"
          :render-item="renderItem"
          :render-item-actions="renderItemActions"
          @expanded-change="onExpandedChange"
          @item-action="onItemAction"
          @update:modelValue="onSelectionChange" />
      </div>
    `
  });
}

export const TreeExampleStatic: Story = {
  render: renderTree(STATIC_ITEMS, {
    ariaLabel: 'test static tree',
    disabledKeys: ['projects-1'],
    showActions: true
  }),
  args: {
    ...TREE_SELECTION_ARGS
  },
  argTypes: TREE_SELECTION_ARG_TYPES
};

export const TreeExampleStaticNoActions: Story = {
  render: renderTree(STATIC_ITEMS, {
    ariaLabel: 'test static tree',
    disabledKeys: ['projects-1'],
    showActions: false
  }),
  args: {
    ...TREE_SELECTION_ARGS
  },
  argTypes: TREE_SELECTION_ARG_TYPES
};

export const ExampleNoActions: Story = {
  render: renderTree(STATIC_ITEMS, {
    ariaLabel: 'test static tree',
    disabledKeys: ['projects-1'],
    showActions: false
  }),
  args: {
    ...TREE_SELECTION_ARGS
  },
  argTypes: TREE_SELECTION_ARG_TYPES
};

export const TreeExampleDynamic: Story = {
  render: renderTree(DYNAMIC_ITEMS, {
    ariaLabel: 'test dynamic tree',
    disabledKeys: ['reports-1AB'],
    showActions: true
  }),
  args: {
    ...TREE_SELECTION_ARGS
  },
  argTypes: TREE_SELECTION_ARG_TYPES
};

export const WithActions: Story = {
  render: renderTree(DYNAMIC_ITEMS, {
    ariaLabel: 'test dynamic tree',
    disabledKeys: ['reports-1AB'],
    showActions: true
  }),
  args: {
    ...TREE_SELECTION_ARGS,
    onAction: action('onAction')
  },
  argTypes: TREE_SELECTION_ARG_TYPES,
  name: 'Tree with actions'
};

export const WithLinks: Story = {
  render: renderTree(DYNAMIC_ITEMS_WITH_LINKS, {
    ariaLabel: 'test dynamic tree',
    disabledKeys: ['reports-1AB'],
    showActions: true
  }),
  args: {
    ...TREE_SELECTION_ARGS
  },
  argTypes: TREE_SELECTION_ARG_TYPES,
  name: 'With Links',
  parameters: {
    description: {
      data: 'every tree item should link to adobe.com'
    }
  }
};

export const EmptyTree: Story = {
  render: renderTree([], {
    ariaLabel: 'test dynamic tree',
    disabledKeys: ['reports-1AB'],
    showActions: true
  }),
  args: {
    ...TREE_SELECTION_ARGS,
    items: [],
    renderEmptyState
  },
  argTypes: TREE_SELECTION_ARG_TYPES,
  name: 'Empty Tree'
};

export const WithActionMenu: Story = {
  render: renderTree(DYNAMIC_ITEMS, {
    ariaLabel: 'test dynamic tree',
    disabledKeys: ['reports-1AB'],
    showActions: true
  }),
  args: {
    ...TREE_SELECTION_ARGS
  },
  argTypes: TREE_SELECTION_ARG_TYPES
};
