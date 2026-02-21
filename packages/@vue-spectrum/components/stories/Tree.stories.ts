import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueTree} from '@vue-spectrum/components';
import {ref} from 'vue';

type StyleMap = Record<string, number | string>;
type StoryArgs = Record<string, unknown>;

interface TreeNode {
  children?: TreeNode[],
  id: number | string,
  label: string
}

const staticTreeItems: TreeNode[] = [
  {id: 'Photos', label: 'Photos'},
  {
    id: 'projects',
    label: 'Projects',
    children: [
      {
        id: 'projects-1',
        label: 'Projects-1',
        children: [{id: 'projects-1A', label: 'Projects-1A'}]
      },
      {id: 'projects-2', label: 'Projects-2'},
      {id: 'projects-3', label: 'Projects-3'}
    ]
  },
  {id: 'reports', label: 'Reports'},
  {id: 'Tests', label: 'Tests'}
];

const sectionTreeItems: TreeNode[] = [
  {
    id: 'photo-header',
    label: 'Photo Header',
    children: [
      {id: 'Photos', label: 'Photos'},
      {id: 'edited-photos', label: 'Edited Photos'}
    ]
  },
  {
    id: 'project-header',
    label: 'Project Header',
    children: [
      {id: 'projects', label: 'Projects'},
      {id: 'projects-4', label: 'Project-4'}
    ]
  },
  {id: 'Tests', label: 'Tests'}
];

const meta = {
  title: 'React Aria Components/Tree',
  component: VueTree
} satisfies Meta<typeof VueTree>;

export default meta;

type TreeStory = StoryFn<typeof VueTree>;
type Story = StoryObj<typeof meta>;

interface TreeStoryOptions {
  actionName?: string,
  containerStyle?: StyleMap,
  defaultExpanded?: boolean,
  items: TreeNode[],
  showSelection?: boolean
}

function createTreeStory(args: StoryArgs = {}, options: TreeStoryOptions) {
  return {
    components: {
      VueTree
    },
    setup() {
      let selected = ref<string | number>();
      return {
        args,
        containerStyle: options.containerStyle ?? {},
        defaultExpanded: options.defaultExpanded ?? true,
        items: options.items,
        onItemAction: action(options.actionName ?? 'onItemAction'),
        selected,
        showSelection: options.showSelection ?? true
      };
    },
    template: `
      <div :style="containerStyle">
        <VueTree
          v-bind="args"
          v-model="selected"
          :defaultExpanded="defaultExpanded"
          :items="items"
          @itemAction="onItemAction" />
        <p v-if="showSelection" style="margin-top: 8px;">Selected node: {{ selected ?? 'none' }}</p>
      </div>
    `
  };
}

function makeNestedTreeItems(sectionCount: number, itemsPerSection: number): TreeNode[] {
  return Array.from({length: sectionCount}, (_, sectionIndex) => ({
    id: `section-${sectionIndex + 1}`,
    label: `Section ${sectionIndex + 1}`,
    children: Array.from({length: itemsPerSection}, (_, itemIndex) => ({
      id: `section-${sectionIndex + 1}-item-${itemIndex + 1}`,
      label: `Section ${sectionIndex + 1}, Item ${itemIndex + 1}`
    }))
  }));
}

export const TreeExampleStatic: Story = {
  render: (args) => createTreeStory(args, {
    items: staticTreeItems
  }),
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle',
    disabledBehavior: 'selection'
  },
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'radio',
      options: ['toggle', 'replace']
    },
    disabledBehavior: {
      control: 'radio',
      options: ['selection', 'all']
    }
  },
  parameters: {
    description: {
      data: 'Static tree parity fixture with nested project nodes and base keyboard selection controls.'
    }
  }
};

export const TreeExampleSection: Story = {
  render: (args) => createTreeStory(args, {
    items: sectionTreeItems
  })
};

export const TreeExampleStaticNoActions: Story = {
  render: (args) => createTreeStory(args, {
    actionName: 'noop',
    items: staticTreeItems
  })
};

export const TreeExampleDynamic: Story = {
  render: (args) => ({
    components: {
      VueTree
    },
    setup() {
      let selected = ref<string | number>();
      let items = ref<TreeNode[]>([
        {id: 'Documents', label: 'Documents'},
        {
          id: 'Projects',
          label: 'Projects',
          children: [
            {id: 'Project A', label: 'Project A'},
            {id: 'Project B', label: 'Project B'}
          ]
        }
      ]);

      let addItem = () => {
        items.value = [
          ...items.value,
          {
            id: `dynamic-${items.value.length + 1}`,
            label: `Dynamic item ${items.value.length + 1}`
          }
        ];
      };

      return {
        args,
        addItem,
        items,
        onItemAction: action('onItemAction'),
        selected
      };
    },
    template: `
      <div>
        <button type="button" style="margin-bottom: 8px;" @click="addItem">Add item</button>
        <VueTree
          v-bind="args"
          v-model="selected"
          :items="items"
          @itemAction="onItemAction" />
      </div>
    `
  })
};

export const TreeSectionDynamic: Story = {
  render: (args) => createTreeStory(args, {
    items: makeNestedTreeItems(3, 4)
  })
};

export const WithActions: Story = {
  render: (args) => createTreeStory(args, {
    actionName: 'treeAction',
    items: staticTreeItems
  })
};

export const WithLinks: Story = {
  render: (args) => createTreeStory(args, {
    items: [
      {id: 'home', label: 'https://example.com/home'},
      {id: 'docs', label: 'https://example.com/docs'},
      {id: 'api', label: 'https://example.com/api'}
    ]
  })
};

export const EmptyTreeStaticStory: Story = {
  render: (args) => createTreeStory(args, {
    items: [],
    showSelection: false
  })
};

export const LoadingStoryDepOnCollectionStory: Story = {
  render: () => ({
    components: {
      VueTree
    },
    setup() {
      let items = ref<TreeNode[]>([]);
      let loading = ref(true);

      setTimeout(() => {
        items.value = makeNestedTreeItems(2, 3);
        loading.value = false;
      }, 300);

      return {
        items,
        loading,
        onItemAction: action('onItemAction'),
        selected: ref<string | number>()
      };
    },
    template: `
      <div>
        <p style="margin-bottom: 8px;">{{ loading ? 'Loading collection...' : 'Collection loaded' }}</p>
        <VueTree
          v-model="selected"
          :items="items"
          @itemAction="onItemAction" />
      </div>
    `
  })
};

export const LoadingStoryDepOnTopStory: Story = {
  render: () => ({
    components: {
      VueTree
    },
    setup() {
      let items = ref<TreeNode[]>([]);
      let loading = ref(true);

      setTimeout(() => {
        items.value = makeNestedTreeItems(3, 2);
        loading.value = false;
      }, 300);

      return {
        items,
        loading,
        onItemAction: action('onItemAction'),
        selected: ref<string | number>()
      };
    },
    template: `
      <div>
        <p style="margin-bottom: 8px;">{{ loading ? 'Loading top-level tree state...' : 'Top-level state loaded' }}</p>
        <VueTree
          v-model="selected"
          :items="items"
          @itemAction="onItemAction" />
      </div>
    `
  })
};

export const ButtonLoadingIndicatorStory: Story = {
  render: () => ({
    components: {
      VueTree
    },
    setup() {
      let loading = ref(false);
      let items = ref<TreeNode[]>(makeNestedTreeItems(2, 3));
      let selected = ref<string | number>();

      let refresh = () => {
        loading.value = true;
        setTimeout(() => {
          items.value = makeNestedTreeItems(2, 3);
          loading.value = false;
        }, 400);
      };

      return {
        items,
        loading,
        onItemAction: action('onItemAction'),
        refresh,
        selected
      };
    },
    template: `
      <div>
        <button type="button" style="margin-bottom: 8px;" :disabled="loading" @click="refresh">
          {{ loading ? 'Refreshing...' : 'Refresh tree' }}
        </button>
        <VueTree
          v-model="selected"
          :items="items"
          @itemAction="onItemAction" />
      </div>
    `
  })
};

export const VirtualizedTree: Story = {
  render: (args) => createTreeStory(args, {
    containerStyle: {
      border: '1px solid #d9d9d9',
      height: '420px',
      overflow: 'auto',
      width: '400px'
    },
    items: makeNestedTreeItems(20, 20)
  })
};

export const VirtualizedTreeMultiLoaderMockAsync: Story = {
  render: () => ({
    components: {
      VueTree
    },
    setup() {
      let selected = ref<string | number>();
      let items = ref<TreeNode[]>([]);
      let loading = ref(false);
      let page = ref(0);

      let loadChunk = () => {
        if (loading.value) {
          return;
        }
        loading.value = true;
        setTimeout(() => {
          let nextSection = page.value + 1;
          items.value = [...items.value, ...makeNestedTreeItems(1, 12).map((section) => ({
            ...section,
            id: `async-section-${nextSection}-${section.id}`,
            label: `Async Section ${nextSection}`
          }))];
          page.value += 1;
          loading.value = false;
        }, 250);
      };

      loadChunk();

      return {
        items,
        loadChunk,
        loading,
        onItemAction: action('onItemAction'),
        selected
      };
    },
    template: `
      <div style="height: 420px; width: 400px; overflow: auto; border: 1px solid #d9d9d9;">
        <VueTree
          v-model="selected"
          :items="items"
          @itemAction="onItemAction" />
        <button type="button" style="margin-top: 8px;" :disabled="loading" @click="loadChunk">
          {{ loading ? 'Loading...' : 'Load section' }}
        </button>
      </div>
    `
  })
};

export const VirtualizedTreeMultiLoaderUseAsyncList: Story = {
  render: (args) => createTreeStory(args, {
    containerStyle: {
      border: '1px solid #d9d9d9',
      height: '420px',
      overflow: 'auto',
      width: '400px'
    },
    items: makeNestedTreeItems(10, 15)
  })
};

export const TreeWithDragAndDrop: Story = {
  render: () => ({
    components: {
      VueTree
    },
    setup() {
      let leftItems = ref<TreeNode[]>(makeNestedTreeItems(2, 4));
      let rightItems = ref<TreeNode[]>([]);
      let leftSelected = ref<string | number>();
      let rightSelected = ref<string | number>();

      let moveRight = () => {
        if (leftSelected.value == null) {
          return;
        }
        let next = leftItems.value.filter((item) => item.id !== leftSelected.value);
        let moved = leftItems.value.find((item) => item.id === leftSelected.value);
        leftItems.value = next;
        if (moved) {
          rightItems.value = [...rightItems.value, moved];
        }
      };

      let moveLeft = () => {
        if (rightSelected.value == null) {
          return;
        }
        let next = rightItems.value.filter((item) => item.id !== rightSelected.value);
        let moved = rightItems.value.find((item) => item.id === rightSelected.value);
        rightItems.value = next;
        if (moved) {
          leftItems.value = [...leftItems.value, moved];
        }
      };

      return {
        leftItems,
        leftSelected,
        moveLeft,
        moveRight,
        onItemAction: action('onItemAction'),
        rightItems,
        rightSelected
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <VueTree
          v-model="leftSelected"
          :items="leftItems"
          @itemAction="onItemAction" />
        <div style="display: flex; flex-direction: column; gap: 8px; justify-content: center;">
          <button type="button" @click="moveRight">Move right</button>
          <button type="button" @click="moveLeft">Move left</button>
        </div>
        <VueTree
          v-model="rightSelected"
          :items="rightItems"
          @itemAction="onItemAction" />
      </div>
    `
  })
};

export const TreeWithDragAndDropVirtualized: Story = {
  render: (args) => createTreeStory(args, {
    containerStyle: {
      border: '1px solid #d9d9d9',
      height: '420px',
      overflow: 'auto',
      width: '400px'
    },
    items: makeNestedTreeItems(8, 12)
  })
};

export const VirtualizedTreeSectionRender: Story = {
  render: (args) => createTreeStory(args, {
    containerStyle: {
      border: '1px solid #d9d9d9',
      height: '420px',
      overflow: 'auto',
      width: '400px'
    },
    items: [
      {
        id: 'Section Alpha',
        label: 'Section Alpha',
        children: makeNestedTreeItems(3, 8)
      },
      {
        id: 'Section Beta',
        label: 'Section Beta',
        children: makeNestedTreeItems(3, 8)
      }
    ]
  })
};

export const HugeVirtualizedTree: Story = {
  render: (args) => createTreeStory(args, {
    containerStyle: {
      border: '1px solid #d9d9d9',
      height: '420px',
      overflow: 'auto',
      width: '400px'
    },
    items: makeNestedTreeItems(40, 50)
  })
};
