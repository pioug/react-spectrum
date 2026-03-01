import {action} from 'storybook/actions';
import {ActionMenu} from '@vue-spectrum/menu';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {ListView, type ListItemRecord} from '../src';
import {items as listItems} from './ListView.stories';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';
import {Text} from '@vue-spectrum/text';
import Folder from '@spectrum-icons-vue/workflow/Folder';

type SelectionStoryArgs = {
  ariaLabel?: string,
  density?: 'compact' | 'regular' | 'spacious',
  disabledBehavior?: 'all' | 'selection',
  disabledKeys?: Iterable<number | string>,
  disabledType?: 'file' | 'folder',
  isQuiet?: boolean,
  items?: ListItemRecord[],
  overflowMode?: 'truncate' | 'wrap',
  selectionMode?: 'multiple' | 'none' | 'single',
  selectionStyle?: 'checkbox' | 'highlight',
  showActions?: boolean
};

type StorySelectionValue = Iterable<number | string> | number | string;

function normalizeStorySelectionValue(value: unknown): Set<number | string> {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Set([value]);
  }

  if (value == null) {
    return new Set();
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return new Set();
  }

  let normalized = new Set<number | string>();
  for (let entry of value as Iterable<unknown>) {
    if (typeof entry === 'number' || typeof entry === 'string') {
      normalized.add(entry);
    }
  }

  return normalized;
}

const linkItems: ListItemRecord[] = [
  {key: 'https://adobe.com/', label: 'Adobe', href: 'https://adobe.com/'},
  {key: 'https://google.com/', label: 'Google', href: 'https://google.com/'},
  {key: 'https://apple.com/', label: 'Apple', href: 'https://apple.com/'},
  {key: 'https://nytimes.com/', label: 'New York Times', href: 'https://nytimes.com/'}
];

const meta: Meta<typeof ListView> = {
  title: 'ListView/Selection',
  component: ListView,
  args: {
    density: 'regular',
    disabledBehavior: 'selection',
    isQuiet: false,
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
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSelectionStory(baseArgs: Partial<SelectionStoryArgs> = {}) {
  return (args: SelectionStoryArgs) => ({
    components: {ActionMenu, Folder, ListView, Text},
    setup() {
      let selectedKeys = ref<Set<number | string>>(new Set());
      let onAction = action('onAction');
      let onSelectionChange = action('onSelectionChange');
      let onActionMenuAction = action('actionMenuAction');
      let merged = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let resolvedItems = computed(() => merged.value.items ?? listItems);

      let handleSelectionChange = (value: StorySelectionValue) => {
        let values = normalizeStorySelectionValue(value);
        selectedKeys.value = values;
        onSelectionChange(Array.from(values));
      };

      let handleAction = (key: number | string) => {
        onAction(key);
      };

      return {
        handleAction,
        handleSelectionChange,
        items: resolvedItems,
        merged,
        onActionMenuAction,
        selectedKeys
      };
    },
    template: `
        <ListView
          :aria-label="merged.ariaLabel || 'default selection ListView'"
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
          @action="handleAction">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.name || item.label }}</Text>
            <div v-if="merged.showActions" class="react-spectrum-ListViewItem-actionmenu">
              <ActionMenu
                :items="[{key: 'add', label: 'Add'}, {key: 'delete', label: 'Delete'}]"
                @action="onActionMenuAction" />
            </div>
          </template>
        </ListView>
    `
  });
}

function renderNavigationStory(baseArgs: Partial<SelectionStoryArgs> = {}) {
  return (args: SelectionStoryArgs) => ({
    components: {ActionMenu, Breadcrumbs, Folder, ListView, Text},
    setup() {
      let merged = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let onAction = action('onAction');
      let onSelectionChange = action('onSelectionChange');
      let onActionMenuAction = action('actionMenuAction');
      let selectedKeys = ref<Set<number | string>>(new Set());
      let breadcrumbs = ref<Array<ListItemRecord>>([{
        key: 'root',
        name: 'Root',
        type: 'folder',
        children: listItems
      }]);
      let current = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1]);
      let currentItems = computed(() => (current.value.children as ListItemRecord[]) ?? []);
      let breadcrumbItems = computed(() => breadcrumbs.value.map((crumb) => ({
        key: crumb.key as number | string,
        label: String(crumb.name ?? crumb.label ?? crumb.key ?? '')
      })));
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
        onAction(key);
        if (item?.type === 'folder' && Array.isArray(item.children)) {
          breadcrumbs.value = [...breadcrumbs.value, item];
          selectedKeys.value = new Set();
        }
      };

      let handleSelectionChange = (value: StorySelectionValue) => {
        let values = normalizeStorySelectionValue(value);
        selectedKeys.value = values;
        onSelectionChange(Array.from(values));
      };

      let onBreadcrumbAction = (key: number | string) => {
        let index = breadcrumbs.value.findIndex((item) => item.key === key);
        if (index >= 0) {
          breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
          selectedKeys.value = new Set();
        }
      };

      return {
        breadcrumbs,
        breadcrumbItems,
        current,
        currentItems,
        disabledKeys,
        handleAction,
        handleSelectionChange,
        merged,
        onBreadcrumbAction,
        onActionMenuAction,
        selectedKeys
      };
    },
    template: `
      <div>
        <Breadcrumbs
          :items="breadcrumbItems"
          @action="onBreadcrumbAction" />
        <div style="display: none;">
          <button
            v-for="crumb in breadcrumbs"
            :key="'crumb-button-' + String(crumb.key)"
            type="button"
            @click="onBreadcrumbAction(crumb.key)">
            {{ crumb.name || crumb.label }}
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
          @action="handleAction">
          <template #item="{item}">
            <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
            <Text class="react-spectrum-ListViewItem-content">{{ item.name || item.label }}</Text>
            <div v-if="merged.showActions" class="react-spectrum-ListViewItem-actionmenu">
              <ActionMenu
                :items="[{key: 'add', label: 'Add'}, {key: 'delete', label: 'Delete'}]"
                @action="onActionMenuAction" />
            </div>
          </template>
        </ListView>
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
    ariaLabel: 'disabled folders ListView',
    disabledKeys: ['c', 'e', 'm']
  }),
  name: 'disable folders'
};

export const DisableFolderSelection: Story = {
  render: renderSelectionStory({
    ariaLabel: 'disabled folder selection ListView',
    disabledBehavior: 'selection',
    disabledKeys: ['c', 'e', 'm'],
    showActions: true
  }),
  name: 'disable folders selection'
};

export const Links: Story = {
  render: renderSelectionStory({
    ariaLabel: 'ListView with links',
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
