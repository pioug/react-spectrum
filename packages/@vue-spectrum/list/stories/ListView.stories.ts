import {ActionBar, ActionBarContainer} from '@vue-spectrum/actionbar';
import {ActionButton, Button} from '@vue-spectrum/button';
import {Content} from '@vue-spectrum/view';
import {Dialog, DialogTrigger} from '@vue-spectrum/dialog';
import {Divider} from '@vue-spectrum/divider';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {Heading, Text} from '@vue-spectrum/text';
import {Image} from '@vue-spectrum/image';
import {Link} from '@vue-spectrum/link';
import {ListView} from '../src';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Edit from '@spectrum-icons-vue/workflow/Edit';
import FileData from '@spectrum-icons-vue/workflow/FileData';
import Folder from '@spectrum-icons-vue/workflow/Folder';
import {action} from 'storybook/actions';
import {computed, h, onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ListItem = {
  children?: Array<{key: number | string, name: string}>,
  description?: string,
  key: number | string,
  name: string,
  type?: string,
  url?: string
};

type StoryArgs = Record<string, unknown>;
type StorySelectionValue = Iterable<number | string> | number | string;

export const items: ListItem[] = [
  {key: 'a', name: 'Adobe Photoshop', type: 'file'},
  {key: 'b', name: 'Adobe XD', type: 'file'},
  {key: 'c', name: 'Documents', type: 'folder', children: [
    {key: 1, name: 'Sales Pitch'},
    {key: 2, name: 'Demo'},
    {key: 3, name: 'Taxes'}
  ]},
  {key: 'd', name: 'Adobe InDesign', type: 'file'},
  {key: 'e', name: 'Utilities', type: 'folder', children: [
    {key: 1, name: 'Activity Monitor'}
  ]},
  {key: 'f', name: 'Adobe AfterEffects', type: 'file'},
  {key: 'g', name: 'Adobe Illustrator', type: 'file'},
  {key: 'h', name: 'Adobe Lightroom', type: 'file'},
  {key: 'i', name: 'Adobe Premiere Pro', type: 'file'},
  {key: 'j', name: 'Adobe Fresco', type: 'file'},
  {key: 'k', name: 'Adobe Dreamweaver', type: 'file'},
  {key: 'l', name: 'Adobe Connect', type: 'file'},
  {key: 'm', name: 'Pictures', type: 'folder', children: [
    {key: 1, name: 'Yosemite'},
    {key: 2, name: 'Jackson Hole'},
    {key: 3, name: 'Crater Lake'}
  ]},
  {key: 'n', name: 'Adobe Acrobat', type: 'file'}
];

const BASE_ITEMS: ListItem[] = items;

const THUMBNAIL_ITEMS: ListItem[] = [
  {key: '0', name: 'folder of good bois', type: 'folder'},
  {key: '1', name: 'swimmer', description: 'JPG', url: 'https://random.dog/b2fe2172-cf11-43f4-9c7f-29bd19601712.jpg'},
  {key: '2', name: 'chocolate', description: 'JPG', url: 'https://random.dog/2032518a-eec8-4102-9d48-3dca5a26eb23.png'},
  {key: '3', name: 'good boi', description: 'JPG', url: 'https://random.dog/191091b2-7d69-47af-9f52-6605063f1a47.jpg'},
  {key: '4', name: 'polar bear', description: 'JPG', url: 'https://random.dog/c22c077e-a009-486f-834c-a19edcc36a17.jpg'},
  {key: '5', name: 'cold boi', description: 'JPG', url: 'https://random.dog/093a41da-e2c0-4535-a366-9ef3f2013f73.jpg'},
  {key: '6', name: 'pilot', description: 'JPG', url: 'https://random.dog/09f8ecf4-c22b-49f4-af24-29fb5c8dbb2d.jpg'},
  {key: '7', name: 'nerd', description: 'JPG', url: 'https://random.dog/1a0535a6-ca89-4059-9b3a-04a554c0587b.jpg'},
  {key: '8', name: 'audiophile', description: 'JPG', url: 'https://random.dog/32367-2062-4347.jpg'},
  {key: '9', name: 'file of great boi', type: 'file'}
];

const MANY_ITEMS: ListItem[] = Array.from({length: 500}, (_, index) => ({
  key: `item-${index + 1}`,
  name: `Item ${index + 1}`
}));

const meta: Meta<typeof ListView> = {
  title: 'ListView',
  component: ListView,
  decorators: [
    (story, context) => {
      let omittedStories = ['draggable rows', 'dynamic items + renderEmptyState'];
      if (typeof window !== 'undefined' && (window.screen.width <= 700 || omittedStories.some((name) => context.name.includes(name)))) {
        return story();
      }

      return {
        components: {Story: story()},
        template: `
          <div style="display: flex; align-items: center;">
            <span style="padding-inline: 10px;">
              <label for="focus-before">Focus before</label>
              <input id="focus-before" />
            </span>
            <Story />
            <span style="padding-inline: 10px;">
              <label for="focus-after">Focus after</label>
              <input id="focus-after" />
            </span>
          </div>
        `
      };
    }
  ],
  excludeStories: [
    'items',
    'renderEmptyState'
  ],
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
          @update:modelValue="onSelectionChange" />
      </div>
    `
  });
}

export const Default: Story = {
  render: (args) => ({
    components: {ListView, Text},
    setup() {
      let selectedKeys = ref<Set<number | string>>(new Set());
      let keyAliases = new Map<number | string, number | string>([
        ['a', '1'],
        ['b', '3']
      ]);
      let onSelectionChange = (value: StorySelectionValue) => {
        let normalized = normalizeStorySelectionValue(value);
        let remapped = new Set<number | string>();
        for (let key of normalized) {
          remapped.add(keyAliases.get(key) ?? key);
        }
        selectedKeys.value = remapped;
        action('onSelectionChange')(Array.from(remapped));
      };
      return {
        args,
        onSelectionChange,
        selectedKeys
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="default ListView"
        width="250px"
        :model-value="selectedKeys"
        :disabled-keys="['3']"
        @update:modelValue="onSelectionChange"
        :items="[
          {key: '1', name: 'Adobe Photoshop'},
          {key: '2', name: 'Adobe Illustrator'},
          {key: '3', name: 'Adobe XD'}
        ]">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
        </template>
      </ListView>
    `
  }),
  name: 'default'
};

export const DynamicItems: Story = {
  render: (args) => ({
    components: {ActionButton, Delete, Edit, ListView, Text},
    setup() {
      return {
        args,
        items: BASE_ITEMS,
        onRowActionPress: action('actionPress')
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="Dynamic items"
        :items="items"
        width="300px"
        height="250px">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
          <div class="react-spectrum-ListViewItem-actions" style="display: inline-flex; gap: 2px;">
            <ActionButton aria-label="Edit" is-quiet @press="onRowActionPress">
              <Edit />
            </ActionButton>
            <ActionButton aria-label="Delete" is-quiet @press="onRowActionPress">
              <Delete />
            </ActionButton>
          </div>
        </template>
      </ListView>
    `
  }),
  name: 'dynamic items'
};

export const DynamicItemsSmallView: Story = {
  render: (args) => ({
    components: {ActionButton, Delete, Edit, ListView},
    setup() {
      return {
        args,
        items: BASE_ITEMS,
        onRowActionPress: action('actionPress')
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="small view port listview"
        :items="items"
        width="100px"
        height="250px">
        <template #item="{item}">
          <div class="react-spectrum-ListViewItem-actions" style="display: inline-flex; flex-direction: column; gap: 2px;">
            <ActionButton aria-label="Edit" is-quiet @press="onRowActionPress">
              <Edit />
            </ActionButton>
            <ActionButton aria-label="Delete" is-quiet @press="onRowActionPress">
              <Delete />
            </ActionButton>
          </div>
        </template>
      </ListView>
    `
  }),
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
      return {args, renderEmptyState};
    },
    template: `
      <div style="max-width: 300px;">
        <ListView
          v-bind="args"
          aria-label="empty ListView"
          :items="[]"
          :render-empty-state="renderEmptyState" />
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
    components: {ListView, Text},
    setup() {
      let listItems = ref<ListItem[]>([]);
      let loadingState = ref<'idle' | 'loading' | 'loadingMore'>('loading');

      onMounted(() => {
        window.setTimeout(() => {
          listItems.value = BASE_ITEMS.slice(0, 12);
          loadingState.value = 'idle';
        }, 4000);
      });

      return {
        args,
        listItems,
        loadingState
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="example async loading list"
        width="size-6000"
        height="size-3000"
        selection-mode="multiple"
        :items="listItems"
        :loading-state="loadingState">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
        </template>
      </ListView>
    `
  }),
  name: 'async listview loading'
};

export const AsyncLoadingAction: Story = {
  render: (args) => ({
    components: {ActionButton, Edit, ListView, Text},
    setup() {
      let listItems = ref<ListItem[]>([]);
      let loadingState = ref<'idle' | 'loading' | 'loadingMore'>('loading');

      onMounted(() => {
        window.setTimeout(() => {
          listItems.value = BASE_ITEMS.slice(0, 12);
          loadingState.value = 'idle';
        }, 4000);
      });

      return {
        args,
        listItems,
        loadingState,
        onAction: action('onAction')
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="example async loading list"
        width="size-6000"
        height="size-3000"
        selection-mode="multiple"
        :items="listItems"
        :loading-state="loadingState"
        @action="onAction">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
          <ActionButton class="react-spectrum-ListViewItem-actions" aria-label="Edit">
            <Edit />
          </ActionButton>
        </template>
      </ListView>
    `
  }),
  name: 'async listview loading with actions'
};

export const EmptyDynamic: Story = {
  render: (args) => ({
    components: {ActionButton, ListView},
    setup() {
      let listItems = ref<ListItem[]>([]);
      let wrapperProps = ref<Record<string, unknown>>({});
      let nextKey = ref(0);

      onMounted(() => {
        listItems.value = MANY_ITEMS.slice(0, 20);
        nextKey.value = listItems.value.length;
      });

      let useFlexWrapper = () => {
        wrapperProps.value = {
          style: {
            display: 'flex',
            flexGrow: 1,
            minWidth: '200px',
            maxHeight: '500px'
          }
        };
      };

      return {
        args,
        listItems,
        nextKey,
        renderEmptyState,
        wrapperProps,
        clearItems: () => {
          listItems.value = [];
        },
        addOne: () => {
          nextKey.value += 1;
          listItems.value = [...listItems.value, {key: `added-${nextKey.value}`, name: `Item ${nextKey.value}`}];
        },
        sliceItems: () => {
          listItems.value = listItems.value.slice(0, 4);
        },
        useFlexWrapper
      };
    },
    template: `
      <div>
        <div style="display: flex; align-items: flex-start;">
          <div v-bind="wrapperProps">
            <ListView
              v-bind="args"
              aria-label="render empty state ListView"
              width="250px"
              :height="Object.keys(wrapperProps).length > 0 ? undefined : '500px'"
              :items="listItems"
              :render-empty-state="renderEmptyState" />
          </div>
          <div style="padding-left: 10px;">
            <ActionButton :is-disabled="Object.keys(wrapperProps).length > 0" @press="useFlexWrapper">
              Use flex div wrapper (no set height)
            </ActionButton>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <ActionButton @press="clearItems">Clear All</ActionButton>
              <ActionButton @press="addOne">Add 1</ActionButton>
              <ActionButton @press="sliceItems">Slice (0, 4)</ActionButton>
            </div>
          </div>
        </div>
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
          @update:modelValue="updateSelection" />
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
          @update:modelValue="updateSelection" />
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
  render: (args) => ({
    components: {FileData, Folder, Image, ListView, Text},
    setup() {
      return {
        args,
        items: THUMBNAIL_ITEMS
      };
    },
    template: `
      <ListView v-bind="args" width="250px" aria-label="ListView with thumbnails" :items="items">
        <template #item="{item}">
          <Image v-if="item.url" :UNSAFE_className="'react-spectrum-ListViewItem-thumbnail'" :src="item.url" alt="" />
          <Folder v-else-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
          <FileData v-else class="react-spectrum-ListViewItem-thumbnail" />
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
          <Text v-if="item.description" class="react-spectrum-ListViewItem-description">{{ item.description }}</Text>
        </template>
      </ListView>
    `
  }),
  name: 'thumbnails'
};

export const LongText: Story = {
  render: (args) => ({
    components: {ListView, Text},
    setup() {
      return {args};
    },
    template: `
      <ListView v-bind="args" width="250px" :items="[
        {key: 'a', name: 'Homeward Bound: The Incredible Journey'},
        {key: 'b', name: 'Monsters University', description: 'As a first grader, Mike Wazowski begins to dream of becoming a Scarer'}
      ]">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
          <Text v-if="item.description" class="react-spectrum-ListViewItem-description">{{ item.description }}</Text>
        </template>
      </ListView>
    `
  }),
  name: 'long text'
};

export const RemoveListItems: Story = {
  render: (args) => ({
    components: {ActionButton, Button, Content, Dialog, DialogTrigger, Divider, Heading, ListView, Text},
    setup() {
      let listItems = ref<ListItem[]>([
        {key: 1, name: 'utilities'}
      ]);
      let onDelete = (key: number | string) => {
        listItems.value = listItems.value.filter((item) => item.key !== key);
      };

      return {
        args,
        listItems,
        onDelete
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="ListView example with complex items"
        width="250px"
        height="300px"
        selection-mode="multiple"
          :items="listItems">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
          <div class="react-spectrum-ListViewItem-actions">
            <DialogTrigger type="popover">
              <template #trigger="{open}">
                <ActionButton is-quiet @press="open">Delete</ActionButton>
              </template>
              <Dialog>
                <Heading>Warning, cannot undo</Heading>
                <Divider />
                <Content>
                  <Text>Are you sure?</Text>
                  <Button variant="accent" @press="onDelete(item.key)">Delete</Button>
                </Content>
              </Dialog>
            </DialogTrigger>
          </div>
        </template>
      </ListView>
    `
  }),
  name: 'Remove List Items'
};

export const DisplayNone: Story = {
  render: (args) => ({
    components: {Button, ListView, Text},
    setup() {
      let isDisplay = ref(false);
      let manyItems = MANY_ITEMS;
      return {
        args,
        isDisplay,
        manyItems
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <Button variant="primary" @press="isDisplay = !isDisplay">Toggle ListView display</Button>
        <div :style="!isDisplay ? {display: 'none'} : undefined">
          <ListView
            v-bind="args"
            aria-label="Many items"
            width="300px"
            height="200px"
            :items="manyItems">
            <template #item="{item}">
              <Text class="react-spectrum-ListViewItem-content">{{ item.name }}</Text>
            </template>
          </ListView>
        </div>
      </div>
    `
  }),
  name: 'display: none with many items'
};
