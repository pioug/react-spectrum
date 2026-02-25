import {action} from '@storybook/addon-actions';
import {ListView, type ListItemRecord} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';

type SelectionStoryArgs = {
  density?: 'compact' | 'regular' | 'spacious',
  disabledBehavior?: 'all' | 'selection',
  disabledKeys?: Array<number | string>,
  disabledType?: 'file' | 'folder',
  isQuiet?: boolean,
  items?: ListItemRecord[],
  onAction?: (key: number | string) => void,
  onSelectionChange?: (value: Array<number | string>) => void,
  overflowMode?: 'truncate' | 'wrap',
  selectionMode?: 'multiple' | 'none' | 'single',
  selectionStyle?: 'checkbox' | 'highlight',
  showActions?: boolean
};

const baseItems: ListItemRecord[] = [
  {key: 'a', name: 'Adobe Photoshop', type: 'file'},
  {key: 'b', name: 'Adobe XD', type: 'file'},
  {
    key: 'c',
    name: 'Documents',
    type: 'folder',
    children: [
      {key: 'c-1', name: 'Sales Pitch', type: 'file'},
      {key: 'c-2', name: 'Demo', type: 'file'},
      {key: 'c-3', name: 'Taxes', type: 'file'}
    ]
  },
  {key: 'd', name: 'Adobe InDesign', type: 'file'},
  {
    key: 'e',
    name: 'Utilities',
    type: 'folder',
    children: [
      {key: 'e-1', name: 'Activity Monitor', type: 'file'}
    ]
  },
  {key: 'f', name: 'Adobe AfterEffects', type: 'file'},
  {key: 'm', name: 'Pictures', type: 'folder', children: [
    {key: 'm-1', name: 'Yosemite', type: 'file'},
    {key: 'm-2', name: 'Jackson Hole', type: 'file'}
  ]}
];

const linkItems: ListItemRecord[] = [
  {key: 'https://adobe.com/', label: 'Adobe'},
  {key: 'https://google.com/', label: 'Google'},
  {key: 'https://apple.com/', label: 'Apple'},
  {key: 'https://nytimes.com/', label: 'New York Times'}
];

const meta: Meta<typeof ListView> = {
  title: 'ListView/Selection',
  component: ListView,
  excludeStories: ['baseItems', 'linkItems', 'renderNavigationStory', 'renderSelectionStory'],
  args: {
    density: 'regular',
    disabledBehavior: 'selection',
    isQuiet: false,
    onAction: action('onAction'),
    onSelectionChange: action('onSelectionChange'),
    overflowMode: 'truncate',
    selectionMode: 'multiple',
    selectionStyle: 'checkbox'
  },
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionStyle: {
      control: 'radio',
      options: ['checkbox', 'highlight']
    },
    isQuiet: {
      control: 'boolean'
    },
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    overflowMode: {
      control: 'radio',
      options: ['truncate', 'wrap']
    },
    disabledBehavior: {
      control: 'radio',
      options: ['selection', 'all']
    },
    items: {
      table: {
        disable: true
      }
    },
    onAction: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSelectionStory(baseArgs: Partial<SelectionStoryArgs> = {}) {
  return (args: SelectionStoryArgs) => ({
    components: {ListView},
    setup() {
      let selectedKeys = ref<Array<number | string>>([]);
      let merged = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let resolvedItems = computed(() => merged.value.items ?? baseItems);

      let handleSelectionChange = (value: number | string | Array<number | string>) => {
        let values = Array.isArray(value) ? value : [value];
        selectedKeys.value = values;
        merged.value.onSelectionChange?.(values);
      };

      let handleAction = (key: number | string) => {
        merged.value.onAction?.(key);
      };

      return {
        handleAction,
        handleSelectionChange,
        items: resolvedItems,
        merged,
        selectedKeys
      };
    },
    template: `
      <ListView
        aria-label="ListView selection"
        style="width: 250px; height: 400px;"
        :density="merged.density"
        :disabled-behavior="merged.disabledBehavior"
        :disabled-keys="merged.disabledKeys || []"
        :is-quiet="merged.isQuiet"
        :items="items"
        :overflow-mode="merged.overflowMode"
        :selected-keys="selectedKeys"
        :selection-mode="merged.selectionMode"
        :selection-style="merged.selectionStyle"
        @selection-change="handleSelectionChange"
        @action="handleAction" />
    `
  });
}

function renderNavigationStory(baseArgs: Partial<SelectionStoryArgs> = {}) {
  return (args: SelectionStoryArgs) => ({
    components: {ListView},
    setup() {
      let merged = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let selectedKeys = ref<Array<number | string>>([]);
      let breadcrumbs = ref<Array<ListItemRecord>>([{
        key: 'root',
        name: 'Root',
        type: 'folder',
        children: baseItems
      }]);
      let current = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1]);
      let currentItems = computed(() => (current.value.children as ListItemRecord[]) ?? []);
      let disabledKeys = computed(() => {
        let disabledType = merged.value.disabledType;
        if (!disabledType) {
          return [];
        }

        return currentItems.value
          .filter((item) => item.type === disabledType)
          .map((item) => item.key as number | string);
      });

      let handleAction = (key: number | string) => {
        let item = currentItems.value.find((entry) => entry.key === key);
        merged.value.onAction?.(key);
        if (item?.type === 'folder' && Array.isArray(item.children)) {
          breadcrumbs.value = [...breadcrumbs.value, item];
          selectedKeys.value = [];
        }
      };

      let handleSelectionChange = (value: number | string | Array<number | string>) => {
        let values = Array.isArray(value) ? value : [value];
        selectedKeys.value = values;
        merged.value.onSelectionChange?.(values);
      };

      let onBreadcrumbAction = (key: number | string) => {
        let index = breadcrumbs.value.findIndex((item) => item.key === key);
        if (index >= 0) {
          breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
          selectedKeys.value = [];
        }
      };

      return {
        breadcrumbs,
        current,
        currentItems,
        disabledKeys,
        handleAction,
        handleSelectionChange,
        merged,
        onBreadcrumbAction,
        selectedKeys
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <button
            v-for="crumb in breadcrumbs"
            :key="String(crumb.key)"
            type="button"
            @click="onBreadcrumbAction(crumb.key as number | string)">
            {{ crumb.name }}
          </button>
        </div>
        <ListView
          :aria-label="String(current.name || 'ListView')"
          style="width: 250px; height: 400px;"
          :density="merged.density"
          :disabled-behavior="merged.disabledBehavior"
          :disabled-keys="disabledKeys"
          :is-quiet="merged.isQuiet"
          :items="currentItems"
          :overflow-mode="merged.overflowMode"
          :selected-keys="selectedKeys"
          selection-mode="multiple"
          selection-style="checkbox"
          @selection-change="handleSelectionChange"
          @action="handleAction" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderSelectionStory(),
  name: 'default'
};

export const DisableFolders: Story = {
  render: renderSelectionStory({
    disabledKeys: ['c', 'e', 'm']
  }),
  name: 'disable folders'
};

export const DisableFolderSelection: Story = {
  render: renderSelectionStory({
    disabledBehavior: 'selection',
    disabledKeys: ['c', 'e', 'm']
  }),
  name: 'disable folders selection'
};

export const Links: Story = {
  render: renderSelectionStory({
    items: linkItems
  })
};

export const OnAction: Story = {
  render: renderNavigationStory(),
  name: 'onAction'
};

export const OnActionDisableFolders: Story = {
  render: renderNavigationStory({
    disabledBehavior: 'selection',
    disabledType: 'folder'
  }),
  name: 'onAction, disable folder selection'
};

export const onActionDisableFoldersRowActions: Story = {
  render: renderNavigationStory({
    disabledBehavior: 'selection',
    disabledType: 'folder',
    showActions: true
  }),
  name: 'onAction, disable folder selection, with row action'
};

export const onActionDisableFiles: Story = {
  render: renderNavigationStory({
    disabledType: 'file'
  }),
  name: 'onAction, disable files'
};

export const onActionDisableFilesRowActions: Story = {
  render: renderNavigationStory({
    disabledType: 'file',
    showActions: true
  }),
  name: 'onAction, disable files, with row actions'
};
