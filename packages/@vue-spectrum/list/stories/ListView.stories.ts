import {ActionBar, ActionBarContainer} from '@vue-spectrum/actionbar';
import {ListView} from '../src';
import {action} from '@storybook/addon-actions';
import {computed, onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ListItem = {
  description?: string,
  key: number | string,
  name: string
};

type StoryArgs = Record<string, unknown>;
type StorySelectionValue = Iterable<number | string> | number | string;

const BASE_ITEMS: ListItem[] = [
  {key: 'a', name: 'Adobe Photoshop'},
  {key: 'b', name: 'Adobe XD'},
  {key: 'c', name: 'Documents'},
  {key: 'd', name: 'Adobe InDesign'},
  {key: 'e', name: 'Utilities'},
  {key: 'f', name: 'Adobe AfterEffects'}
];

const THUMBNAIL_ITEMS: ListItem[] = [
  {key: '1', name: 'folder of good bois'},
  {key: '2', name: 'swimmer'},
  {key: '3', name: 'chocolate'},
  {key: '4', name: 'good boi'},
  {key: '5', name: 'polar bear'}
];

const MANY_ITEMS: ListItem[] = Array.from({length: 40}, (_, index) => ({
  key: `item-${index + 1}`,
  name: `Item ${index + 1}`
}));

const meta: Meta<typeof ListView> = {
  title: 'ListView',
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
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    isQuiet: {
      control: 'boolean'
    },
    overflowMode: {
      control: 'radio',
      options: ['truncate', 'wrap']
    },
    disabledBehavior: {
      control: 'radio',
      options: ['selection', 'all']
    },
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionStyle: {
      control: 'radio',
      options: ['checkbox', 'highlight']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

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

function renderList(items: ListItem[], baseArgs: StoryArgs = {}, wrapperStyle = 'max-width: 320px;') {
  return (args: StoryArgs) => ({
    components: {ListView},
    setup() {
      let selectedKeys = ref<Set<number | string>>(new Set());
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      return {
        items,
        mergedArgs,
        selectedKeys,
        onAction: action('onAction'),
        onSelectionChange: (value: StorySelectionValue) => {
          let normalized = normalizeStorySelectionValue(value);
          selectedKeys.value = normalized;
          action('onSelectionChange')(Array.from(normalized));
        }
      };
    },
    template: `
      <div style="${wrapperStyle}">
        <ListView
          v-bind="mergedArgs"
          :items="items"
          :model-value="selectedKeys"
          @action="onAction"
          @update:model-value="onSelectionChange" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderList(BASE_ITEMS.slice(0, 3), {
    ariaLabel: 'default ListView',
    selectionMode: 'multiple'
  }, 'max-width: 250px;'),
  name: 'default'
};

export const DynamicItems: Story = {
  render: renderList(BASE_ITEMS, {
    ariaLabel: 'Dynamic items',
    selectionMode: 'multiple'
  }),
  name: 'dynamic items'
};

export const DynamicItemsSmallView: Story = {
  render: renderList(BASE_ITEMS, {
    ariaLabel: 'small view port listview'
  }, 'max-width: 100px;'),
  name: 'dynamic items - small viewport'
};

export const Falsy: Story = {
  render: renderList([
    {key: 1, name: 'key=1'},
    {key: 0, name: 'key=0'}
  ], {
    ariaLabel: 'falsy id ListView',
    selectionMode: 'multiple'
  }, 'max-width: 250px;'),
  name: 'falsy ids as keys'
};

export const EmptyList: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      return {args};
    },
    template: `
      <div style="max-width: 300px;">
        <ListView v-bind="args" aria-label="empty ListView" :items="[]">
          <div>No results found, press here for more info.</div>
        </ListView>
      </div>
    `
  }),
  name: 'empty list'
};

export const Loading: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      return {args};
    },
    template: `
      <div style="max-width: 300px;">
        <ListView v-bind="args" aria-label="loading ListView" :items="[]" loading-state="loading" />
      </div>
    `
  }),
  name: 'loading'
};

export const LoadingMore: Story = {
  render: renderList(BASE_ITEMS.slice(0, 3), {
    ariaLabel: 'loading more ListView',
    loadingState: 'loadingMore'
  }),
  name: 'loadingMore'
};

export const AsyncLoading: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      let listItems = ref<ListItem[]>([]);
      let loadingState = ref<'idle' | 'loading' | 'loadingMore'>('loading');

      onMounted(() => {
        window.setTimeout(() => {
          listItems.value = BASE_ITEMS.slice(0, 4);
          loadingState.value = 'idle';
        }, 700);
      });

      let loadMore = () => {
        if (loadingState.value !== 'idle') {
          return;
        }

        loadingState.value = 'loadingMore';
        window.setTimeout(() => {
          let currentLength = listItems.value.length;
          let nextItems = BASE_ITEMS.concat([
            {key: `async-${currentLength + 1}`, name: `Async item ${currentLength + 1}`},
            {key: `async-${currentLength + 2}`, name: `Async item ${currentLength + 2}`}
          ]);
          listItems.value = nextItems.slice(0, currentLength + 2);
          loadingState.value = 'idle';
        }, 600);
      };

      return {
        args,
        listItems,
        loadingState,
        loadMore
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <button type="button" @click="loadMore">Load more</button>
        <ListView v-bind="args" aria-label="example async loading list" :items="listItems" :loading-state="loadingState" />
      </div>
    `
  }),
  name: 'async listview loading'
};

export const AsyncLoadingAction: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      let listItems = ref<ListItem[]>([]);
      let loadingState = ref<'idle' | 'loading' | 'loadingMore'>('loading');

      onMounted(() => {
        window.setTimeout(() => {
          listItems.value = BASE_ITEMS.slice(0, 4);
          loadingState.value = 'idle';
        }, 700);
      });

      let loadMore = () => {
        if (loadingState.value !== 'idle') {
          return;
        }

        loadingState.value = 'loadingMore';
        window.setTimeout(() => {
          let currentLength = listItems.value.length;
          listItems.value = BASE_ITEMS.concat([
            {key: `action-${currentLength + 1}`, name: `Action item ${currentLength + 1}`}
          ]).slice(0, currentLength + 1);
          loadingState.value = 'idle';
        }, 600);
      };

      return {
        args,
        listItems,
        loadingState,
        loadMore,
        onAction: action('onAction')
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <button type="button" @click="loadMore">Load more</button>
        <ListView
          v-bind="args"
          aria-label="example async loading list"
          :items="listItems"
          :loading-state="loadingState"
          @action="onAction" />
      </div>
    `
  }),
  name: 'async listview loading with actions'
};

export const EmptyDynamic: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      let listItems = ref<ListItem[]>([]);
      return {
        args,
        listItems,
        addItems: () => {
          listItems.value = MANY_ITEMS.slice(0, 6);
        }
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <button type="button" @click="addItems">Load items</button>
        <ListView v-bind="args" aria-label="empty dynamic listview" :items="listItems">
          <div>No items</div>
        </ListView>
      </div>
    `
  }),
  name: 'dynamic items + renderEmptyState'
};

export const WithActionBar: Story = {
  render: (args) => ({
    components: {ActionBar, ActionBarContainer, ListView},
    setup() {
      let listItems = ref(BASE_ITEMS.slice(0, 3));
      let selected = ref<Set<number | string>>(new Set(['a']));
      let selectedCount = computed(() => selected.value.size);
      let updateSelection = (value: StorySelectionValue) => {
        selected.value = normalizeStorySelectionValue(value);
      };

      return {
        args,
        listItems,
        selected,
        selectedCount,
        updateSelection,
        clearSelection: () => {
          selected.value = new Set();
        },
        onAction: action('actionbarAction')
      };
    },
    template: `
      <ActionBarContainer style="max-width: 320px; min-height: 220px; display: grid; gap: 8px;">
        <ListView
          v-bind="args"
          aria-label="Action Bar ListView"
          selection-mode="multiple"
          :items="listItems"
          :model-value="selected"
          @update:model-value="updateSelection" />
        <ActionBar
          :selected-item-count="selectedCount"
          :items="['Edit', 'Copy', 'Delete']"
          @action="onAction"
          @clear-selection="clearSelection" />
      </ActionBarContainer>
    `
  }),
  name: 'with ActionBar'
};

export const WithActionBarEmphasized: Story = {
  render: (args) => ({
    components: {ActionBar, ActionBarContainer, ListView},
    setup() {
      let listItems = ref(BASE_ITEMS.slice(0, 3));
      let selected = ref<Set<number | string>>(new Set(['a']));
      let selectedCount = computed(() => selected.value.size);
      let updateSelection = (value: StorySelectionValue) => {
        selected.value = normalizeStorySelectionValue(value);
      };

      return {
        args,
        listItems,
        selected,
        selectedCount,
        updateSelection,
        clearSelection: () => {
          selected.value = new Set();
        },
        onAction: action('actionbarAction')
      };
    },
    template: `
      <ActionBarContainer style="max-width: 320px; min-height: 220px; display: grid; gap: 8px;">
        <ListView
          v-bind="args"
          aria-label="Action Bar ListView"
          selection-mode="multiple"
          :items="listItems"
          :model-value="selected"
          @update:model-value="updateSelection" />
        <ActionBar
          is-emphasized
          :selected-item-count="selectedCount"
          :items="['Edit', 'Copy', 'Delete']"
          @action="onAction"
          @clear-selection="clearSelection" />
      </ActionBarContainer>
    `
  }),
  name: 'with emphasized ActionBar'
};

export const Thumbnails: Story = {
  render: renderList(THUMBNAIL_ITEMS, {
    ariaLabel: 'ListView with thumbnails'
  }, 'max-width: 250px;'),
  name: 'thumbnails'
};

export const LongText: Story = {
  render: renderList([
    {key: 'a', name: 'Homeward Bound: The Incredible Journey'},
    {key: 'b', name: 'Monsters University - As a first grader, Mike Wazowski begins to dream of becoming a Scarer'}
  ], {}, 'max-width: 250px;'),
  name: 'long text'
};

export const RemoveListItems: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      let listItems = ref<ListItem[]>(BASE_ITEMS.slice(0, 6));
      let removeLast = () => {
        listItems.value = listItems.value.slice(0, Math.max(0, listItems.value.length - 1));
      };

      return {
        args,
        listItems,
        removeLast
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <button type="button" @click="removeLast">Remove last item</button>
        <ListView v-bind="args" aria-label="remove list items" :items="listItems" />
      </div>
    `
  }),
  name: 'Remove List Items'
};

export const DisplayNone: Story = {
  render: (args) => ({
    components: {ListView},
    setup() {
      let hidden = ref(false);
      let manyItems = MANY_ITEMS;
      return {
        args,
        hidden,
        manyItems
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <button type="button" @click="hidden = !hidden">Toggle display</button>
        <div :style="{display: hidden ? 'none' : 'block', maxWidth: '320px'}">
          <ListView v-bind="args" aria-label="display none listview" :items="manyItems" />
        </div>
      </div>
    `
  }),
  name: 'display: none with many items'
};
