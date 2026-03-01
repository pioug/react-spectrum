import {action} from 'storybook/actions';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {AlertDialog, DialogContainer} from '@vue-spectrum/dialog';
import {Avatar} from '@vue-spectrum/avatar';
import {Button} from '@vue-spectrum/button';
import {Label} from '@vue-spectrum/label';
import {ListBox} from '../src';
import {computed, defineComponent, nextTick, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Add from '@spectrum-icons-vue/workflow/Add';
import Alert from '@spectrum-icons-vue/workflow/Alert';
import AlignCenter from '@spectrum-icons-vue/workflow/AlignCenter';
import AlignLeft from '@spectrum-icons-vue/workflow/AlignLeft';
import AlignRight from '@spectrum-icons-vue/workflow/AlignRight';
import Bell from '@spectrum-icons-vue/workflow/Bell';
import Blower from '@spectrum-icons-vue/workflow/Blower';
import Book from '@spectrum-icons-vue/workflow/Book';
import Copy from '@spectrum-icons-vue/workflow/Copy';
import Cut from '@spectrum-icons-vue/workflow/Cut';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Draw from '@spectrum-icons-vue/workflow/Draw';
import Paste from '@spectrum-icons-vue/workflow/Paste';

type SelectionKey = number | string;
type SelectionValue = SelectionKey | Iterable<SelectionKey>;
type ListBoxSelectionMode = 'multiple' | 'none' | 'single';
type ListBoxLeaf = string | {
  ariaLabel?: string,
  description?: string,
  href?: string,
  icon?: string,
  id?: SelectionKey,
  items?: ListBoxLeaf[],
  name?: string,
  textValue?: string,
  title?: string
};
type ListBoxStoryArgs = {
  ariaLabel?: string,
  autoFocus?: 'first' | 'last' | true,
  defaultSelectedKeys?: Iterable<SelectionKey>,
  disabledKeys?: Iterable<SelectionKey>,
  isDisabled?: boolean,
  isLoading?: boolean,
  items?: ListBoxLeaf[],
  label?: string,
  modelValue?: SelectionValue,
  selectedKeys?: Iterable<SelectionKey>,
  selectionMode?: ListBoxSelectionMode,
  shouldFocusWrap?: boolean
};
type StorySelectionValue = SelectionValue;

const iconMap = {
  Add,
  Alert,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bell,
  Blower,
  Book,
  Copy,
  Cut,
  Draw,
  Paste
};

const hardModeProgrammatic = [
  {
    name: 'Section 1',
    children: [
      {name: 'Copy', icon: 'Copy'},
      {name: 'Cut', icon: 'Cut'},
      {name: 'Paste', icon: 'Paste'}
    ]
  },
  {
    name: 'Section 2',
    children: [
      {name: 'Puppy', icon: 'AlignLeft'},
      {name: 'Doggo', icon: 'AlignCenter'},
      {name: 'Floof', icon: 'AlignRight'}
    ]
  }
] as const;

const flatOptions = [
  {name: 'Aardvark'},
  {name: 'Kangaroo'},
  {name: 'Snake'},
  {name: 'Danni'},
  {name: 'Devon'},
  {name: 'Ross'},
  {name: 'Puppy'},
  {name: 'Doggo'},
  {name: 'Floof'}
];

const withSection = [
  {
    name: 'Animals',
    children: [
      {name: 'Aardvark'},
      {name: 'Kangaroo'},
      {name: 'Snake'}
    ]
  },
  {
    name: 'People',
    children: [
      {name: 'Danni'},
      {name: 'Devon'},
      {name: 'Ross'}
    ]
  }
];

const itemsWithFalsyId = [
  {
    id: 0,
    name: 'key=0',
    children: [
      {id: 1, name: 'Aardvark'},
      {id: 2, name: 'Kangaroo'},
      {id: 3, name: 'Snake'}
    ]
  },
  {
    id: '',
    name: 'key=""',
    children: [
      {id: 4, name: 'Danni'},
      {id: 5, name: 'Devon'},
      {id: 6, name: 'Ross'}
    ]
  }
];

let lotsOfSections: {name: string, children: {name: string}[]}[] = [];
for (let i = 0; i < 50; i++) {
  let children: {name: string}[] = [];
  for (let j = 0; j < 50; j++) {
    children.push({name: `Section ${i}, Item ${j}`});
  }

  lotsOfSections.push({name: `Section ${i}`, children});
}

const noTitleSections = [
  {
    ariaLabel: 'Animals',
    children: [
      {name: 'Aardvark'},
      {name: 'Kangaroo'},
      {name: 'Snake'}
    ]
  },
  {
    ariaLabel: 'People',
    children: [
      {name: 'Danni'},
      {name: 'Devon'},
      {name: 'Ross'}
    ]
  }
];

const staticSectionItems = [
  {
    title: 'Section 1',
    children: [
      {id: '1', textValue: 'One'},
      {id: '2', textValue: 'Two'},
      {id: '3', textValue: 'Three'}
    ]
  },
  {
    title: 'Section 2',
    children: [
      {id: '4', textValue: 'Four'},
      {id: '5', textValue: 'Five'},
      {id: '6', textValue: 'Six'},
      {id: '7', textValue: 'Seven'}
    ]
  }
];

const staticSectionItemsNoTitle = [
  {
    ariaLabel: 'Section 1',
    children: [
      {id: '1', textValue: 'One'},
      {id: '2', textValue: 'Two'},
      {id: '3', textValue: 'Three'}
    ]
  },
  {
    ariaLabel: 'Section 2',
    children: [
      {id: '4', textValue: 'Four'},
      {id: '5', textValue: 'Five'},
      {id: '6', textValue: 'Six'},
      {id: '7', textValue: 'Seven'}
    ]
  }
];

const avatarItems = [
  {id: 'person-1', textValue: 'Person 1', avatarSrc: 'https://i.imgur.com/kJOwAdv.png'},
  {id: 'person-2', textValue: 'Person 2', avatarSrc: 'https://i.imgur.com/kJOwAdv.png'},
  {id: 'person-3', textValue: 'Person 3', avatarSrc: 'https://i.imgur.com/kJOwAdv.png'}
];

const treeDataItems = [
  {
    id: 'people',
    title: 'People',
    items: [
      {id: 'David', textValue: 'David'},
      {id: 'Sam', textValue: 'Sam'},
      {id: 'Jane', textValue: 'Jane'}
    ]
  },
  {
    id: 'animals',
    title: 'Animals',
    items: [
      {id: 'Aardvark', textValue: 'Aardvark'},
      {id: 'Kangaroo', textValue: 'Kangaroo'},
      {id: 'Snake', textValue: 'Snake'}
    ]
  }
];

const translationStrings = {
  actions: 'Actions',
  selectAction: 'Select action',
  addReview: 'Add review',
  addSeriesToSubscription: 'Add series to your subscription list and be notified when a new episode airs.',
  addToCurrentWatchQueue: 'Add to current watch queue.',
  addToQueue: 'Add to queue',
  postAReviewForTheEpisode: 'Post a review for the episode.',
  report: 'Report',
  reportAnIssue: 'Report an issue/violation.',
  subscribeToSeries: 'Subscribe to series'
};

const decoratorRootStyle = 'display: flex; flex-direction: column;';
const decoratorBodyStyle = 'display: flex; min-width: 200px; background: var(--spectrum-global-color-gray-50); border: 1px solid lightgray; max-height: 300px;';

function normalizeSelectionSet(value: SelectionValue | undefined): Set<string> {
  if (typeof value === 'number' || typeof value === 'string') {
    let key = String(value);
    return key.length > 0 ? new Set([key]) : new Set();
  }

  if (value == null) {
    return new Set();
  }

  let normalized = new Set<string>();
  for (let entry of value) {
    if (typeof entry === 'number' || typeof entry === 'string') {
      normalized.add(String(entry));
    }
  }

  return normalized;
}

function normalizeSelectionValue(value: SelectionValue | undefined): StorySelectionValue | undefined {
  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return undefined;
  }

  return new Set(normalizeSelectionSet(value));
}

const AsyncLoadingExample = defineComponent({
  name: 'AsyncLoadingExample',
  components: {ListBox},
  props: {
    resizable: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    let items = ref<{name: string}[]>([]);
    let isLoading = ref(true);

    let loadInitial = () => {
      isLoading.value = true;
      window.setTimeout(() => {
        items.value = [
          {name: 'bulbasaur'},
          {name: 'ivysaur'},
          {name: 'venusaur'},
          {name: 'charmander'},
          {name: 'charmeleon'}
        ];
        isLoading.value = false;
      }, 40);
    };

    let loadMore = () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;
      window.setTimeout(() => {
        let nextIndex = items.value.length + 1;
        items.value = [
          ...items.value,
          {name: `pokemon-${nextIndex}`},
          {name: `pokemon-${nextIndex + 1}`}
        ];
        isLoading.value = false;
      }, 120);
    };

    loadInitial();

    return {
      isLoading,
      items,
      loadMore,
      onAction: action('onAction')
    };
  },
  template: `
    <div :style="resizable ? 'display: flex; height: 200px; flex-grow: 1; min-width: 200px; padding: 10px; resize: both; overflow: auto;' : ''">
      <div style="display: grid; gap: 8px; width: 100%;">
        <ListBox
          aria-labelledby="label"
          :items="items"
          style="flex-grow: 1;"
          :is-loading="isLoading"
          @action="onAction" />
        <button type="button" @click="loadMore">Load more</button>
      </div>
    </div>
  `
});

const RestoreFocusExampleStory = defineComponent({
  name: 'RestoreFocusExampleStory',
  components: {ActionGroup, AlertDialog, Delete, DialogContainer, Label, ListBox},
  setup() {
    let items = ref([
      {
        name: 'Animals',
        children: [
          {name: 'Aardvark'},
          {name: 'Kangaroo'},
          {name: 'Snake'}
        ]
      },
      {
        name: 'People',
        children: [
          {name: 'Danni'},
          {name: 'Devon'},
          {name: 'Ross'}
        ]
      }
    ]);
    let selectedKeys = ref<Set<string>>(new Set());
    let dialogAction = ref<string | null>(null);

    let itemNames = computed(() => {
      return items.value.flatMap((section) => section.children.map((item) => item.name));
    });

    let handleSelectionChange = (value: StorySelectionValue) => {
      selectedKeys.value = normalizeSelectionSet(value);
      action('onSelectionChange')(Array.from(selectedKeys.value));
    };

    let handleActionGroup = (key: SelectionKey) => {
      if (key === 'bulk-delete') {
        dialogAction.value = 'bulk-delete';
      }
    };

    let dismissDialog = () => {
      dialogAction.value = null;
    };

    let confirmDelete = async () => {
      let selected = new Set(selectedKeys.value);
      items.value = items.value.map((section) => ({
        ...section,
        children: section.children.filter((item) => !selected.has(item.name))
      }));
      selectedKeys.value = new Set();
      dialogAction.value = null;
      await nextTick();
    };

    return {
      dialogAction,
      dismissDialog,
      handleActionGroup,
      handleSelectionChange,
      itemNames,
      items,
      selectedKeys,
      confirmDelete
    };
  },
  template: `
    <div style="display: grid; gap: 12px;">
      <ActionGroup
        aria-label="Bulk actions"
        :items="selectedKeys.size > 0 ? [{name: 'bulk-delete', label: 'Delete selected items'}] : []"
        @action="handleActionGroup">
        <template #item="{item}">
          <Delete />
          <span>{{ item.label }}</span>
        </template>
      </ActionGroup>

      <div style="display: flex; flex-direction: column;">
        <Label id="label">Choose items</Label>
        <div style="display: flex; min-width: 200px; background: var(--spectrum-global-color-gray-50); border: 1px solid lightgray; max-height: 300px;">
          <ListBox
            aria-labelledby="label"
            style="flex-grow: 1;"
            :items="items"
            selection-mode="multiple"
            :model-value="selectedKeys"
            @update:model-value="handleSelectionChange" />
        </div>
      </div>

      <DialogContainer :is-open="dialogAction === 'bulk-delete'" @close="dismissDialog">
        <AlertDialog
          title="Delete"
          variant="destructive"
          primary-action-label="Delete"
          @primary-action="confirmDelete"
          @close="dismissDialog">
          Are you sure you want to delete {{selectedKeys.size === 1 ? '1 item' : selectedKeys.size + ' items'}}?
        </AlertDialog>
      </DialogContainer>
    </div>
  `
});

const TranslateListBoxStory = defineComponent({
  name: 'TranslateListBoxStory',
  components: {Add, Alert, Bell, Draw, Label, ListBox},
  setup() {
    let translationItems = [
      {
        title: translationStrings.actions,
        children: [
          {
            id: 'queue',
            textValue: translationStrings.addToQueue,
            description: translationStrings.addToCurrentWatchQueue,
            icon: 'Add'
          },
          {
            id: 'review',
            textValue: translationStrings.addReview,
            description: translationStrings.postAReviewForTheEpisode,
            icon: 'Draw'
          },
          {
            id: 'subscribe',
            textValue: translationStrings.subscribeToSeries,
            description: translationStrings.addSeriesToSubscription,
            icon: 'Bell'
          },
          {
            id: 'report',
            textValue: translationStrings.report,
            description: translationStrings.reportAnIssue,
            icon: 'Alert'
          }
        ]
      }
    ];

    return {
      iconMap,
      onSelectionChange: action('onSelectionChange'),
      translationItems
    };
  },
  template: `
    <div style="display: flex; flex-direction: column;">
      <Label id="label">{{translationStrings.selectAction}}</Label>
      <div style="display: flex; min-width: 200px; background: var(--spectrum-global-color-gray-50); border: 1px solid lightgray; max-height: 100%;">
        <ListBox
          aria-labelledby="label"
          style="flex-grow: 1;"
          auto-focus
          selection-mode="multiple"
          :model-value="new Set(['queue', 'subscribe'])"
          :disabled-keys="['report']"
          :items="translationItems"
          @selection-change="onSelectionChange">
          <template #item="{item}">
            <component
              :is="iconMap[item.icon]"
              v-if="item.icon"
              size="S"
              class="spectrum-Menu-icon" />
            <span class="spectrum-Menu-itemLabel">{{ item.textValue }}</span>
            <span v-if="item.description" class="spectrum-Menu-description">{{ item.description }}</span>
          </template>
        </ListBox>
      </div>
    </div>
  `,
  computed: {
    translationStrings() {
      return translationStrings;
    }
  }
});

const ListboxContainersApp = defineComponent({
  name: 'ListboxContainersApp',
  components: {Button, ListBox},
  setup() {
    let size = ref('700px');
    let itemsForDemo = Array.from(new Array(100)).map((_val, index) => ({
      index,
      textValue: String(index)
    }));

    let configs = [
      {id: 'label1', label: 'Max-Height: 300px', style: 'max-height: 300px;'},
      {id: 'label2', label: 'None', style: ''},
      {id: 'label3', label: 'Max-Height: 700px', style: 'max-height: 700px;'},
      {id: 'label4', label: 'MaxHeight: 100%', style: 'max-height: 100%;'},
      {id: 'label5', label: 'MaxHeight: 50%', style: 'max-height: 50%;'},
      {id: 'label6', label: 'Height: 700px', style: 'height: 700px;'},
      {id: 'label7', label: 'Height: 100%', style: 'height: 100%;'}
    ];

    let toggleSize = () => {
      size.value = size.value === '700px' ? '300px' : '700px';
    };

    return {
      baseColumnStyle: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
        height: '100%',
        overflow: 'hidden'
      },
      configs,
      itemsForDemo,
      size,
      toggleSize
    };
  },
  template: `
    <div>
      <Button variant="primary" @click="toggleSize">Toggle Size</Button>
      <div :style="{display: 'flex', height: size, overflow: 'hidden'}">
        <div
          v-for="config in configs"
          :key="config.id"
          :style="[baseColumnStyle, config.style]">
          <span :id="config.id">{{ config.label }}</span>
          <ListBox style="width: 150px; height: 100%; overflow: auto;" :items="itemsForDemo" :aria-labelledby="config.id">
            <template #item="{item}">
              <span>IDX: {{ item.index }}</span>
            </template>
          </ListBox>
        </div>
      </div>
    </div>
  `
});

const meta: Meta<typeof ListBox> = {
  title: 'ListBox',
  component: ListBox,
  excludeStories: ['FocusExample']
};

export default meta;

type Story = StoryObj<typeof meta>;

type DecoratedRenderOptions = {
  components?: Record<string, unknown>,
  containerStyle?: string,
  itemTemplate?: string,
  setup?: () => Record<string, unknown>
};

function renderListBox(baseArgs: Partial<ListBoxStoryArgs> = {}, options: DecoratedRenderOptions = {}) {
  return (args: ListBoxStoryArgs) => ({
    components: {
      Label,
      ListBox,
      ...options.components
    },
    setup() {
      let mergedArgs = computed<ListBoxStoryArgs>(() => ({
        ...baseArgs,
        ...args
      }));
      let selectedValue = ref<StorySelectionValue | undefined>(undefined);

      watch(mergedArgs, (nextArgs) => {
        if (nextArgs.selectedKeys != null) {
          selectedValue.value = undefined;
          return;
        }

        if (nextArgs.modelValue != null) {
          selectedValue.value = normalizeSelectionValue(nextArgs.modelValue);
          return;
        }

        if (nextArgs.defaultSelectedKeys != null) {
          selectedValue.value = new Set(normalizeSelectionSet(nextArgs.defaultSelectedKeys));
          return;
        }

        selectedValue.value = undefined;
      }, {deep: true, immediate: true});

      let handleSelectionChange = (value: StorySelectionValue) => {
        if (mergedArgs.value.selectedKeys == null) {
          selectedValue.value = value;
        }

        action('onSelectionChange')(value);
      };

      return {
        ...options.setup?.(),
        handleSelectionChange,
        mergedArgs,
        onAction: action('onAction'),
        onSelect: action('onSelect'),
        selectedValue
      };
    },
    template: `
      <div style="${decoratorRootStyle}">
        <Label id="label">Choose an item</Label>
        <div style="${options.containerStyle ?? decoratorBodyStyle}">
          <ListBox
            style="flex-grow: 1;"
            aria-labelledby="label"
            :aria-label="mergedArgs.ariaLabel"
            :auto-focus="mergedArgs.autoFocus"
            :default-selected-keys="mergedArgs.defaultSelectedKeys"
            :disabled-keys="mergedArgs.disabledKeys"
            :is-disabled="mergedArgs.isDisabled"
            :is-loading="mergedArgs.isLoading"
            :items="mergedArgs.items"
            :label="mergedArgs.label"
            :model-value="selectedValue"
            :selected-keys="mergedArgs.selectedKeys"
            :selection-mode="mergedArgs.selectionMode"
            :should-focus-wrap="mergedArgs.shouldFocusWrap"
            @action="onAction"
            @select="onSelect"
            @selection-change="handleSelectionChange"
            @update:model-value="handleSelectionChange">
            ${options.itemTemplate ?? ''}
          </ListBox>
        </div>
      </div>
    `
  });
}

export function FocusExample(_args: ListBoxStoryArgs = {}) {
  return {
    components: {RestoreFocusExampleStory},
    setup() {
      return {};
    },
    template: '<RestoreFocusExampleStory />'
  };
}

export const DefaultListBox: Story = {
  render: renderListBox({items: flatOptions as unknown as ListBoxLeaf[]} ),
  name: 'Default ListBox'
};

export const ListBoxWSections: Story = {
  render: renderListBox({items: withSection as unknown as ListBoxLeaf[]}),
  name: 'ListBox w/ sections'
};

export const ListBoxWManySectionsAndSelection: Story = {
  render: renderListBox({items: lotsOfSections as unknown as ListBoxLeaf[], selectionMode: 'multiple'}),
  name: 'ListBox w/ many sections and selection'
};

export const ListBoxWSectionsAndFalsyIds: Story = {
  render: renderListBox({
    items: itemsWithFalsyId as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }),
  name: 'ListBox w/ sections and falsy ids'
};

export const ListBoxWSectionsAndNoTitle: Story = {
  render: renderListBox({items: noTitleSections as unknown as ListBoxLeaf[]}),
  name: 'ListBox w/ sections and no title'
};

export const Static: Story = {
  render: renderListBox({items: ['One', 'Two', 'Three'] as unknown as ListBoxLeaf[]})
};

export const StaticWithSectionsAndSelection: Story = {
  render: renderListBox({
    items: staticSectionItems as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }),
  name: 'Static with sections and selection'
};

export const StaticWithSectionsAndNoTitle: Story = {
  render: renderListBox({items: staticSectionItemsNoTitle as unknown as ListBoxLeaf[]}),
  name: 'Static with sections and no title'
};

export const WithDefaultSelectedOption: Story = {
  render: renderListBox({
    defaultSelectedKeys: new Set(['Kangaroo']),
    items: withSection as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }),
  name: 'with default selected option'
};

export const SingleSelectionWithDefaultSelectedOption: Story = {
  render: renderListBox({
    defaultSelectedKeys: new Set(['Kangaroo']),
    items: flatOptions as unknown as ListBoxLeaf[],
    selectionMode: 'single'
  }),
  name: 'single selection with default selected option'
};

export const StaticWithDefaultSelectedOptions: Story = {
  render: renderListBox({
    defaultSelectedKeys: new Set(['2', '3']),
    items: staticSectionItems as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }),
  name: 'static with default selected options'
};

export const WithSelectedOptionsControlled: Story = {
  render: renderListBox({
    items: withSection as unknown as ListBoxLeaf[],
    selectedKeys: new Set(['Kangaroo']),
    selectionMode: 'multiple'
  }),
  name: 'with selected options (controlled)'
};

export const StaticWithSelectedOptionsControlled: Story = {
  render: renderListBox({
    items: staticSectionItems as unknown as ListBoxLeaf[],
    selectedKeys: new Set(['2']),
    selectionMode: 'multiple'
  }),
  name: 'static with selected options (controlled)'
};

export const WithDisabledOptions: Story = {
  render: renderListBox({
    disabledKeys: ['Kangaroo', 'Ross'],
    items: withSection as unknown as ListBoxLeaf[]
  }),
  name: 'with disabled options'
};

export const StaticWithDisabledOptions: Story = {
  render: renderListBox({
    disabledKeys: ['3', '5'],
    items: staticSectionItems as unknown as ListBoxLeaf[]
  }),
  name: 'static with disabled options'
};

export const MultipleSelection: Story = {
  render: renderListBox({
    defaultSelectedKeys: new Set(['Aardvark', 'Snake']),
    disabledKeys: ['Kangaroo', 'Ross'],
    items: withSection as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }),
  name: 'Multiple selection'
};

export const MultipleSelectionStatic: Story = {
  render: renderListBox({
    defaultSelectedKeys: new Set(['2', '5']),
    disabledKeys: ['1', '3'],
    items: staticSectionItems as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }),
  name: 'Multiple selection, static'
};

export const NoSelectionAllowed: Story = {
  render: renderListBox({items: withSection as unknown as ListBoxLeaf[], selectionMode: 'none'}),
  name: 'No selection allowed'
};

export const NoSelectionAllowedStatic: Story = {
  render: renderListBox({items: staticSectionItems as unknown as ListBoxLeaf[], selectionMode: 'none'}),
  name: 'No selection allowed, static'
};

export const ListBoxWithAutoFocusTrue: Story = {
  render: renderListBox({autoFocus: true, items: withSection as unknown as ListBoxLeaf[]}),
  name: 'ListBox with autoFocus=true'
};

export const ListBoxWithAutoFocusComplex: Story = {
  render: renderListBox({
    autoFocus: true,
    defaultSelectedKeys: new Set(['Snake']),
    items: withSection as unknown as ListBoxLeaf[],
    selectionMode: 'single'
  }),
  name: 'ListBox with autoFocus=true, selectionMode=single, default selected key (uncontrolled)'
};

export const ListBoxWithAutoFocusFirst: Story = {
  render: renderListBox({autoFocus: 'first', items: withSection as unknown as ListBoxLeaf[], selectionMode: 'multiple'}),
  name: 'ListBox with autoFocus="first"'
};

export const ListBoxWithAutoFocusLast: Story = {
  render: renderListBox({autoFocus: 'last', items: withSection as unknown as ListBoxLeaf[], selectionMode: 'multiple'}),
  name: 'ListBox with autoFocus="last"'
};

export const ListBoxWithKeyboardSelectionWrapping: Story = {
  render: renderListBox({
    items: withSection as unknown as ListBoxLeaf[],
    selectionMode: 'multiple',
    shouldFocusWrap: true
  }),
  name: 'ListBox with keyboard selection wrapping'
};

export const WithSemanticElementsStatic: Story = {
  render: renderListBox({
    disabledKeys: ['paste', 'floof'],
    items: [
      {
        title: 'Section 1',
        children: [
          {id: 'copy', icon: 'Copy', textValue: 'Copy'},
          {id: 'cut', icon: 'Cut', textValue: 'Cut'},
          {id: 'paste', icon: 'Paste', textValue: 'Paste'}
        ]
      },
      {
        title: 'Section 2',
        children: [
          {id: 'puppy', icon: 'AlignLeft', textValue: 'Puppy', description: 'Puppy description super long as well geez'},
          {id: 'floof', icon: 'AlignRight', textValue: 'Floof', description: 'Floof medium description'},
          {id: 'doggo', icon: 'AlignCenter', textValue: 'Doggo with really really really long long long text'},
          {id: 'basic', textValue: 'Basic Item'}
        ]
      }
    ] as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }, {
    setup: () => ({
      iconMap
    }),
    itemTemplate: `
      <template #item="{item}">
        <component :is="iconMap[item.icon]" v-if="item.icon" size="S" class="spectrum-Menu-icon" />
        <span class="spectrum-Menu-itemLabel">{{ item.textValue || item.name }}</span>
        <span v-if="item.description" class="spectrum-Menu-description">{{ item.description }}</span>
      </template>
    `
  }),
  name: 'with semantic elements (static)'
};

export const WithSemanticElementsGenerativeMultipleSelection: Story = {
  render: renderListBox({
    items: hardModeProgrammatic as unknown as ListBoxLeaf[],
    selectionMode: 'multiple'
  }, {
    setup: () => ({
      iconMap
    }),
    itemTemplate: `
      <template #item="{item}">
        <component :is="iconMap[item.icon]" v-if="item.icon" size="S" class="spectrum-Menu-icon" />
        <span class="spectrum-Menu-itemLabel">{{ item.name }}</span>
      </template>
    `
  }),
  name: 'with semantic elements (generative), multiple selection'
};

export const IsLoading: Story = {
  render: renderListBox({
    isLoading: true,
    items: []
  }),
  name: 'isLoading'
};

export const IsLoadingMore: Story = {
  render: renderListBox({
    isLoading: true,
    items: flatOptions as unknown as ListBoxLeaf[]
  }),
  name: 'isLoading more'
};

export const AsyncLoading: Story = {
  render: () => ({
    components: {AsyncLoadingExample, Label},
    setup() {
      return {};
    },
    template: `
      <div style="${decoratorRootStyle}">
        <Label id="label">Choose an item</Label>
        <div style="${decoratorBodyStyle}">
          <AsyncLoadingExample />
        </div>
      </div>
    `
  }),
  name: 'async loading'
};

export const AsyncLoadingResizable: Story = {
  render: () => ({
    components: {AsyncLoadingExample, Label},
    setup() {
      return {};
    },
    template: `
      <div style="display: flex; flex-direction: column;">
        <Label id="label">Choose an item</Label>
        <div style="display: flex; min-width: 200px; background: var(--spectrum-global-color-gray-50); border: 1px solid lightgray;">
          <AsyncLoadingExample :resizable="true" />
        </div>
      </div>
    `
  }),
  name: 'async loading, resizable'
};

export const ListboxContainers: Story = {
  render: () => ({
    components: {ListboxContainersApp},
    setup() {
      return {};
    },
    template: '<ListboxContainersApp />'
  }),
  name: 'listbox containers'
};

export const RestoreFocusExample: Story = {
  render: (args) => FocusExample(args),
  name: 'restore focus after deleting selected items'
};

export const WithTranslations: Story = {
  render: () => ({
    components: {TranslateListBoxStory},
    setup() {
      return {};
    },
    template: '<TranslateListBoxStory />'
  }),
  name: 'with translations',
  parameters: {
    description: {
      data: 'Translations included for: Arabic, English, Hebrew, Japanese, Korean, Simplified Chinese, and Traditional Chinese.'
    }
  }
};

export const Links: Story = {
  render: renderListBox({
    items: [
      {id: 'https://adobe.com/', href: 'https://adobe.com/', textValue: 'Adobe'},
      {id: 'https://google.com/', href: 'https://google.com/', textValue: 'Google'},
      {id: 'https://apple.com/', href: 'https://apple.com/', textValue: 'Apple'},
      {id: 'https://nytimes.com/', href: 'https://nytimes.com/', textValue: 'New York Times'},
      {id: 'non-link', textValue: 'Non link'}
    ]
  }, {
    containerStyle: 'display: flex; min-width: 200px; background: var(--spectrum-global-color-gray-50); border: 1px solid lightgray; max-height: 300px;',
    setup: () => ({})
  }),
  args: {
    selectionMode: 'none'
  },
  argTypes: {
    selectionMode: {
      control: {
        type: 'radio',
        options: ['none', 'single', 'multiple']
      }
    }
  }
};

export const WithAvatars: Story = {
  render: renderListBox({
    ariaLabel: 'Listbox with avatars',
    items: avatarItems as unknown as ListBoxLeaf[]
  }, {
    components: {Avatar},
    itemTemplate: `
      <template #item="{item}">
        <span class="spectrum-Menu-itemLabel">{{ item.textValue }}</span>
        <Avatar src="https://i.imgur.com/kJOwAdv.png" alt="default Adobe avatar" />
      </template>
    `
  })
};

export const WithTreeData: Story = {
  render: () => ({
    components: {Label, ListBox},
    setup() {
      let selectedKeys = ref<Set<string>>(new Set(['Sam', 'Kangaroo']));

      let handleSelectionChange = (value: StorySelectionValue) => {
        selectedKeys.value = normalizeSelectionSet(value);
        action('onSelectionChange')(Array.from(selectedKeys.value));
      };

      return {
        handleSelectionChange,
        selectedKeys,
        treeDataItems
      };
    },
    template: `
      <div style="${decoratorRootStyle}">
        <Label id="label">Choose an item</Label>
        <div style="${decoratorBodyStyle}">
          <ListBox
            style="flex-grow: 1;"
            aria-labelledby="label"
            :items="treeDataItems"
            selection-mode="multiple"
            :model-value="selectedKeys"
            @update:model-value="handleSelectionChange" />
        </div>
      </div>
    `
  })
};
