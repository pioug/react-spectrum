import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {TreeView} from '../src';

type TreeNode = {
  children?: TreeNode[],
  id: string,
  label: string
};

const STATIC_ITEMS: TreeNode[] = [
  {
    id: 'photos',
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
    id: 'reports',
    label: 'Reports',
    children: [
      {
        id: 'reports-1',
        label: 'Reports 1'
      },
      {
        id: 'reports-2',
        label: 'Reports 2'
      }
    ]
  },
  {
    id: 'assets',
    label: 'Assets',
    children: [
      {
        id: 'assets-1',
        label: 'Assets 1'
      },
      {
        id: 'assets-2',
        label: 'Assets 2'
      }
    ]
  }
];

const meta: Meta<typeof TreeView> = {
  title: 'TreeView',
  component: TreeView,
  excludeStories: [
    'renderTree',
    'renderEmptyState'
  ],
  args: {
    items: STATIC_ITEMS
  },
  argTypes: {
    childrenKey: {
      control: 'text'
    },
    defaultExpanded: {
      control: 'boolean'
    },
    hidden: {
      control: 'boolean'
    },
    idKey: {
      control: 'text'
    },
    items: {
      table: {
        disable: true
      }
    },
    renderEmptyState: {
      table: {
        disable: true
      }
    },
    labelKey: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export function renderEmptyState() {
  return 'No files selected.';
}

function renderTree(withMenu = false, emptyState = false) {
  return (args: Record<string, unknown>) => ({
    components: {TreeView},
    setup() {
      let lastAction = ref('');
      let onItemAction = (node: {label?: string}) => {
        let label = typeof node?.label === 'string' ? node.label : '';
        lastAction.value = label;
        action('onItemAction')(label);
      };
      return {
        args,
        emptyState,
        lastAction,
        onItemAction,
        renderEmptyState,
        withMenu
      };
    },
    template: `
      <div style="display: grid; gap: 10px; max-width: 320px;">
        <TreeView
          v-bind="args"
          :items="emptyState ? [] : args.items"
          @item-action="onItemAction" />
        <div v-if="emptyState">{{ renderEmptyState() }}</div>
        <div v-if="lastAction">Last action: {{lastAction}}</div>
        <div v-if="withMenu" style="display: flex; gap: 8px;">
          <button type="button">Edit</button>
          <button type="button">Delete</button>
        </div>
      </div>
    `
  });
}

export const TreeExampleStatic: Story = {
  render: renderTree()
};

export const TreeExampleStaticNoActions: Story = {
  render: renderTree()
};

export const ExampleNoActions: Story = {
  render: renderTree()
};

export const TreeExampleDynamic: Story = {
  render: renderTree(),
  args: {
    items: DYNAMIC_ITEMS
  }
};

export const WithActions: Story = {
  render: renderTree(),
  args: {
    items: DYNAMIC_ITEMS
  },
  name: 'Tree with actions'
};

export const WithLinks: Story = {
  render: renderTree(),
  args: {
    items: DYNAMIC_ITEMS.map((section) => ({
      ...section,
      children: section.children?.map((node) => ({
        ...node,
        label: `${node.label} (https://adobe.com/)`
      }))
    }))
  },
  name: 'With Links',
  parameters: {
    description: {
      data: 'every tree item should link to adobe.com'
    }
  }
};

export const EmptyTree: Story = {
  render: renderTree(false, true),
  args: {
    items: []
  },
  name: 'Empty Tree'
};

export const WithActionMenu: Story = {
  render: renderTree(true),
  args: {
    items: DYNAMIC_ITEMS
  }
};
