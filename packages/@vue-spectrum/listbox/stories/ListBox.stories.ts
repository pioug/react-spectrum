import {action} from '@storybook/addon-actions';
import {Avatar} from '@vue-spectrum/avatar';
import {ListBox} from '../src';
import {computed, defineComponent, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ListBoxStoryArgs = {
  ariaLabel?: string,
  disabledKeys?: Iterable<string>,
  isDisabled?: boolean,
  items?: Array<string | {
    [key: string]: unknown,
    ariaLabel?: string,
    children?: Array<Record<string, unknown>>,
    href?: string,
    id?: string | number,
    items?: Array<Record<string, unknown>>,
    textValue?: string
  }>,
  label?: string,
  modelValue?: string | Iterable<string>,
  selectionMode?: 'multiple' | 'none' | 'single'
};

const defaultItems = [
  'Aardvark',
  'Kangaroo',
  'Snake',
  'Danni',
  'Devon',
  'Ross',
  'Puppy',
  'Doggo',
  'Floof'
];
const sectionItems = [
  {
    id: 'animals',
    title: 'Animals',
    items: [
      {id: 'Aardvark', textValue: 'Aardvark'},
      {id: 'Kangaroo', textValue: 'Kangaroo'},
      {id: 'Snake', textValue: 'Snake'}
    ]
  },
  {
    id: 'people',
    title: 'People',
    items: [
      {id: 'Danni', textValue: 'Danni'},
      {id: 'Devon', textValue: 'Devon'},
      {id: 'Ross', textValue: 'Ross'}
    ]
  }
];
const manySectionItems = Array.from({length: 50}, (_section, sectionIndex) => ({
  id: `section-${sectionIndex}`,
  title: `Section ${sectionIndex}`,
  items: Array.from({length: 50}, (_item, itemIndex) => ({
    id: `section-${sectionIndex}-item-${itemIndex}`,
    textValue: `Section ${sectionIndex}, Item ${itemIndex}`
  }))
}));
const staticSectionItems = [
  {
    id: 'section-1',
    title: 'Section 1',
    items: [
      {id: '1', textValue: 'One'},
      {id: '2', textValue: 'Two'},
      {id: '3', textValue: 'Three'}
    ]
  },
  {
    id: 'section-2',
    title: 'Section 2',
    items: [
      {id: '4', textValue: 'Four'},
      {id: '5', textValue: 'Five'},
      {id: '6', textValue: 'Six'},
      {id: '7', textValue: 'Seven'}
    ]
  }
];
const staticSectionItemsNoTitle = [
  {
    id: 'section-1',
    ariaLabel: 'Section 1',
    items: [
      {id: '1', textValue: 'One'},
      {id: '2', textValue: 'Two'},
      {id: '3', textValue: 'Three'}
    ]
  },
  {
    id: 'section-2',
    ariaLabel: 'Section 2',
    items: [
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

function normalizeSelectionSet(value: string | Iterable<string>): Set<string> {
  if (typeof value === 'string') {
    return value.length > 0 ? new Set([value]) : new Set();
  }

  let normalized = new Set<string>();
  for (let entry of value) {
    normalized.add(entry);
  }

  return normalized;
}

const AsyncLoadingListBox = defineComponent({
  name: 'AsyncLoadingListBoxStory',
  components: {ListBox},
  props: {
    resizable: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    let items = ref(['Result 1', 'Result 2']);
    let isLoading = ref(false);

    let loadMore = () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;
      window.setTimeout(() => {
        let nextIndex = items.value.length + 1;
        items.value = [
          ...items.value,
          `Result ${nextIndex}`,
          `Result ${nextIndex + 1}`
        ];
        isLoading.value = false;
      }, 300);
    };

    return {
      items,
      isLoading,
      loadMore,
      onSelect: action('select')
    };
  },
  template: `
    <div :style="resizable ? 'resize: horizontal; overflow: auto; min-width: 220px; max-width: 520px; border: 1px solid var(--spectrum-global-color-gray-300); padding: 8px;' : ''">
      <ListBox
        aria-label="Async loading listbox"
        label="Async items"
        :items="items"
        @select="onSelect" />
      <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
        <button type="button" :disabled="isLoading" @click="loadMore">{{isLoading ? 'Loading...' : 'Load more'}}</button>
        <span v-if="isLoading">Fetching data...</span>
      </div>
    </div>
  `
});

const RestoreFocusPreview = defineComponent({
  name: 'RestoreFocusPreviewStory',
  components: {ListBox},
  setup() {
    let containerRef = ref<HTMLElement | null>(null);

    let focusFirstItem = () => {
      let firstItem = containerRef.value?.querySelector('button[role="option"]') as HTMLButtonElement | null;
      firstItem?.focus();
    };

    return {
      containerRef,
      focusFirstItem,
      onSelect: action('select')
    };
  },
  template: `
    <div style="display: grid; gap: 8px; max-width: 320px;">
      <button type="button" @click="focusFirstItem">Restore focus</button>
      <div ref="containerRef">
        <ListBox
          aria-label="Restore focus listbox"
          label="Focusable listbox"
          :items="['Alpha', 'Beta', 'Gamma']"
          @select="onSelect" />
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

function renderListBox(baseArgs: Partial<ListBoxStoryArgs> = {}, wrapperStyle?: string) {
  return (args: ListBoxStoryArgs) => ({
    components: {ListBox},
    setup() {
      let mergedArgs = computed<ListBoxStoryArgs>(() => ({
        ariaLabel: 'Listbox example',
        items: [...defaultItems],
        label: 'Example',
        selectionMode: 'single',
        ...baseArgs,
        ...args
      }));
      let selectedValue = ref<string | Iterable<string>>('');

      watch(mergedArgs, (nextArgs) => {
        if (typeof nextArgs.modelValue === 'string' || nextArgs.modelValue == null) {
          selectedValue.value = nextArgs.modelValue ?? '';
          return;
        }

        selectedValue.value = Array.from(nextArgs.modelValue);
      }, {deep: true, immediate: true});

      let handleUpdate = (value: string | Iterable<string>) => {
        selectedValue.value = value;
        action('update:modelValue')(value);
      };

      return {
        mergedArgs,
        selectedValue,
        handleUpdate,
        onSelect: action('select')
      };
    },
    template: `
      <div ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <ListBox
          :aria-label="mergedArgs.ariaLabel"
          :disabled-keys="mergedArgs.disabledKeys"
          :is-disabled="mergedArgs.isDisabled"
          :items="mergedArgs.items"
          :label="mergedArgs.label"
          :model-value="selectedValue"
          :selection-mode="mergedArgs.selectionMode"
          @select="onSelect"
          @update:model-value="handleUpdate" />
      </div>
    `
  });
}

export function FocusExample(_args: ListBoxStoryArgs = {}) {
  return {
    components: {RestoreFocusPreview},
    setup() {
      return {};
    },
    template: '<RestoreFocusPreview />'
  };
}

export const DefaultListBox: Story = {
  render: renderListBox(),
  name: 'Default ListBox'
};

export const ListBoxWSections: Story = {
  render: renderListBox({items: [...sectionItems]}),
  name: 'ListBox w/ sections'
};

export const ListBoxWManySectionsAndSelection: Story = {
  render: renderListBox({items: [...manySectionItems], selectionMode: 'multiple'}),
  name: 'ListBox w/ many sections and selection'
};

export const ListBoxWSectionsAndFalsyIds: Story = {
  render: renderListBox({
    items: [
      {
        id: 0,
        title: 'key=0',
        items: [
          {id: '1', textValue: 'Aardvark'},
          {id: '2', textValue: 'Kangaroo'},
          {id: '3', textValue: 'Snake'}
        ]
      },
      {
        id: '',
        title: 'key=""',
        items: [
          {id: '4', textValue: 'Danni'},
          {id: '5', textValue: 'Devon'},
          {id: '6', textValue: 'Ross'}
        ]
      }
    ],
    selectionMode: 'multiple'
  }),
  name: 'ListBox w/ sections and falsy ids'
};

export const ListBoxWSectionsAndNoTitle: Story = {
  render: renderListBox({
    items: [
      {
        id: 'animals-no-title',
        ariaLabel: 'Animals',
        items: [
          {id: 'Aardvark', textValue: 'Aardvark'},
          {id: 'Kangaroo', textValue: 'Kangaroo'},
          {id: 'Snake', textValue: 'Snake'}
        ]
      },
      {
        id: 'people-no-title',
        ariaLabel: 'People',
        items: [
          {id: 'Danni', textValue: 'Danni'},
          {id: 'Devon', textValue: 'Devon'},
          {id: 'Ross', textValue: 'Ross'}
        ]
      }
    ]
  }),
  name: 'ListBox w/ sections and no title'
};

export const Static: Story = {
  render: renderListBox({label: 'Static listbox', items: ['One', 'Two', 'Three']})
};

export const StaticWithSectionsAndSelection: Story = {
  render: renderListBox({
    label: 'Static with sections',
    items: [...staticSectionItems],
    selectionMode: 'multiple'
  }),
  name: 'Static with sections and selection'
};

export const StaticWithSectionsAndNoTitle: Story = {
  render: renderListBox({
    label: '',
    items: [...staticSectionItemsNoTitle]
  }),
  name: 'Static with sections and no title'
};

export const WithDefaultSelectedOption: Story = {
  render: renderListBox({
    items: [...sectionItems],
    selectionMode: 'multiple',
    modelValue: new Set(['Kangaroo'])
  }),
  name: 'with default selected option'
};

export const SingleSelectionWithDefaultSelectedOption: Story = {
  render: renderListBox({selectionMode: 'single', modelValue: 'Kangaroo'}),
  name: 'single selection with default selected option'
};

export const StaticWithDefaultSelectedOptions: Story = {
  render: renderListBox({
    selectionMode: 'multiple',
    items: [...staticSectionItems],
    modelValue: new Set(['2', '3'])
  }),
  name: 'static with default selected options'
};

export const WithSelectedOptionsControlled: Story = {
  render: renderListBox({
    items: [...sectionItems],
    selectionMode: 'multiple',
    modelValue: new Set(['Kangaroo'])
  }),
  name: 'with selected options (controlled)'
};

export const StaticWithSelectedOptionsControlled: Story = {
  render: renderListBox({
    items: [...staticSectionItems],
    selectionMode: 'multiple',
    modelValue: new Set(['2'])
  }),
  name: 'static with selected options (controlled)'
};

export const WithDisabledOptions: Story = {
  render: renderListBox({
    items: [...sectionItems],
    disabledKeys: ['Kangaroo', 'Ross']
  }),
  name: 'with disabled options'
};

export const StaticWithDisabledOptions: Story = {
  render: renderListBox({
    label: 'Static with disabled options',
    items: [...staticSectionItems],
    disabledKeys: ['3', '5']
  }),
  name: 'static with disabled options'
};

export const MultipleSelection: Story = {
  render: renderListBox({
    selectionMode: 'multiple',
    modelValue: new Set(['Aardvark', 'Snake']),
    items: [...sectionItems],
    disabledKeys: ['Kangaroo', 'Ross']
  }),
  name: 'Multiple selection'
};

export const MultipleSelectionStatic: Story = {
  render: renderListBox({
    selectionMode: 'multiple',
    label: 'Multiple selection static',
    modelValue: new Set(['2', '5']),
    items: [...staticSectionItems],
    disabledKeys: ['1', '3']
  }),
  name: 'Multiple selection, static'
};

export const NoSelectionAllowed: Story = {
  render: renderListBox({
    selectionMode: 'none',
    items: [...sectionItems]
  }),
  name: 'No selection allowed'
};

export const NoSelectionAllowedStatic: Story = {
  render: renderListBox({
    selectionMode: 'none',
    label: 'No selection allowed static',
    items: [...staticSectionItems]
  }),
  name: 'No selection allowed, static'
};

export const ListBoxWithAutoFocusTrue: Story = {
  render: renderListBox({
    items: [...sectionItems]
  }),
  name: 'ListBox with autoFocus=true'
};

export const ListBoxWithAutoFocusComplex: Story = {
  render: renderListBox({
    items: [...sectionItems],
    modelValue: 'Snake'
  }),
  name: 'ListBox with autoFocus=true, selectionMode=single, default selected key (uncontrolled)'
};

export const ListBoxWithAutoFocusFirst: Story = {
  render: renderListBox({
    items: [...sectionItems],
    selectionMode: 'multiple'
  }),
  name: 'ListBox with autoFocus="first"'
};

export const ListBoxWithAutoFocusLast: Story = {
  render: renderListBox({
    items: [...sectionItems],
    selectionMode: 'multiple'
  }),
  name: 'ListBox with autoFocus="last"'
};

export const ListBoxWithKeyboardSelectionWrapping: Story = {
  render: renderListBox({
    items: [...sectionItems],
    selectionMode: 'multiple'
  }),
  name: 'ListBox with keyboard selection wrapping'
};

export const WithSemanticElementsStatic: Story = {
  render: renderListBox({
    items: ['Article', 'Section', 'Heading', 'Paragraph'],
    label: 'Semantic elements'
  }),
  name: 'with semantic elements (static)'
};

export const WithSemanticElementsGenerativeMultipleSelection: Story = {
  render: renderListBox({
    items: ['Article', 'Section', 'Heading', 'Paragraph'],
    selectionMode: 'multiple',
    modelValue: new Set(['Article', 'Paragraph']),
    label: 'Semantic elements (multiple)'
  }),
  name: 'with semantic elements (generative), multiple selection'
};

export const IsLoading: Story = {
  render: renderListBox({
    items: [],
    label: 'Loading listbox',
    ariaLabel: 'Loading listbox'
  }, 'max-width: 280px;'),
  name: 'isLoading'
};

export const IsLoadingMore: Story = {
  render: renderListBox({
    items: ['Loaded item 1', 'Loaded item 2'],
    label: 'Loading more...'
  }),
  name: 'isLoading more'
};

export const AsyncLoading: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {AsyncLoadingListBox},
    template: '<AsyncLoadingListBox />'
  }),
  name: 'async loading'
};

export const AsyncLoadingResizable: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {AsyncLoadingListBox},
    template: '<AsyncLoadingListBox :resizable="true" />'
  }),
  name: 'async loading, resizable'
};

export const ListboxContainers: Story = {
  render: () => ({
    components: {ListBox},
    setup() {
      return {
        leftItems: ['Left 1', 'Left 2', 'Left 3'],
        rightItems: ['Right 1', 'Right 2', 'Right 3']
      };
    },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 640px;">
        <ListBox aria-label="Left container" label="Left" :items="leftItems" />
        <ListBox aria-label="Right container" label="Right" :items="rightItems" />
      </div>
    `
  }),
  name: 'listbox containers'
};

export const RestoreFocusExample: Story = {
  render: (args) => FocusExample(args),
  name: 'restore focus after deleting selected items'
};

export const WithTranslations: Story = {
  render: renderListBox({
    items: ['English', 'Espanol', 'Deutsch', 'Francais', 'Italiano'],
    label: 'Translations'
  }),
  name: 'with translations'
};

export const Links: Story = {
  render: renderListBox({
    items: [
      {id: 'https://adobe.com/', href: 'https://adobe.com/', textValue: 'Adobe'},
      {id: 'https://google.com/', href: 'https://google.com/', textValue: 'Google'},
      {id: 'https://apple.com/', href: 'https://apple.com/', textValue: 'Apple'},
      {id: 'https://nytimes.com/', href: 'https://nytimes.com/', textValue: 'New York Times'},
      {id: 'non-link', textValue: 'Non link'}
    ],
    label: 'Links'
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
  render: (args) => ({
    components: {Avatar, ListBox},
    setup() {
      return {
        args,
        avatarItems
      };
    },
    template: `
      <ListBox
        v-bind="args"
        aria-label="Listbox with avatars"
        :items="avatarItems"
        label="With avatars">
        <template #item="{item}">
          <span>{{ item.textValue }}</span>
          <Avatar alt="default Adobe avatar" :src="item.avatarSrc" />
        </template>
      </ListBox>
    `
  })
};

export const WithTreeData: Story = {
  render: () => ({
    components: {ListBox},
    setup() {
      let selectedKeys = ref<Set<string>>(new Set(['Sam', 'Kangaroo']));
      let handleSelectionChange = (value: string | Iterable<string>) => {
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
      <ListBox
        aria-label="List organisms"
        label="With tree data"
        :items="treeDataItems"
        selection-mode="multiple"
        :model-value="selectedKeys"
        @update:model-value="handleSelectionChange" />
    `
  })
};
