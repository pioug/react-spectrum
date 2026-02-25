import {action} from '@storybook/addon-actions';
import {ListBox} from '../src';
import {computed, defineComponent, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ListBoxStoryArgs = {
  ariaLabel?: string,
  isDisabled?: boolean,
  items?: string[],
  label?: string,
  modelValue?: string | string[],
  selectionMode?: 'multiple' | 'none' | 'single'
};

const defaultItems = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
const sectionItems = [
  'Section 1 / Option 1',
  'Section 1 / Option 2',
  'Section 2 / Option 1',
  'Section 2 / Option 2'
];
const manySectionItems = [
  'Section 1 / Option 1',
  'Section 1 / Option 2',
  'Section 1 / Option 3',
  'Section 2 / Option 1',
  'Section 2 / Option 2',
  'Section 2 / Option 3',
  'Section 3 / Option 1',
  'Section 3 / Option 2',
  'Section 3 / Option 3'
];

const ControlledSelectionListBox = defineComponent({
  name: 'ControlledSelectionListBoxStory',
  components: {ListBox},
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let selectedValue = ref<string | string[]>(props.multiple ? ['Option 2', 'Option 4'] : 'Option 2');

    let selectFirst = () => {
      selectedValue.value = props.multiple ? ['Option 1'] : 'Option 1';
    };

    let clear = () => {
      selectedValue.value = props.multiple ? [] : '';
    };

    let handleUpdate = (value: string | string[]) => {
      selectedValue.value = value;
      action('update:modelValue')(value);
    };

    return {
      selectedValue,
      selectFirst,
      clear,
      handleUpdate,
      items: [...defaultItems]
    };
  },
  template: `
    <div style="display: grid; gap: 10px; max-width: 320px;">
      <ListBox
        aria-label="Controlled listbox"
        label="Controlled"
        :items="items"
        :selection-mode="multiple ? 'multiple' : 'single'"
        :model-value="selectedValue"
        @update:model-value="handleUpdate" />
      <div style="display: flex; gap: 8px;">
        <button type="button" @click="selectFirst">Select first</button>
        <button type="button" @click="clear">Clear</button>
      </div>
    </div>
  `
});

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
  excludeStories: ['FocusExample'],
  args: {
    ariaLabel: 'Listbox example',
    items: [...defaultItems],
    label: 'Example',
    selectionMode: 'single'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'none']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderListBox(baseArgs: Partial<ListBoxStoryArgs> = {}, wrapperStyle?: string) {
  return (args: ListBoxStoryArgs) => ({
    components: {ListBox},
    setup() {
      let mergedArgs = computed<ListBoxStoryArgs>(() => ({...args, ...baseArgs}));
      let selectedValue = ref<string | string[]>('');

      watch(mergedArgs, (nextArgs) => {
        if (Array.isArray(nextArgs.modelValue)) {
          selectedValue.value = [...nextArgs.modelValue];
          return;
        }

        selectedValue.value = nextArgs.modelValue ?? '';
      }, {deep: true, immediate: true});

      let handleUpdate = (value: string | string[]) => {
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
    template: '<RestoreFocusPreview />'
  };
}

export const DefaultListBox: Story = {
  render: renderListBox()
};

export const ListBoxWSections: Story = {
  render: renderListBox({items: [...sectionItems]})
};

export const ListBoxWManySectionsAndSelection: Story = {
  render: renderListBox({items: [...manySectionItems], modelValue: 'Section 2 / Option 3'})
};

export const ListBoxWSectionsAndFalsyIds: Story = {
  render: renderListBox({items: ['', '0', 'Section / Option 2', 'Section / Option 3']})
};

export const ListBoxWSectionsAndNoTitle: Story = {
  render: renderListBox({items: ['Option 1', 'Option 2', 'Option 3', 'Option 4']})
};

export const Static: Story = {
  render: renderListBox({label: 'Static listbox', items: [...defaultItems]})
};

export const StaticWithSectionsAndSelection: Story = {
  render: renderListBox({
    label: 'Static with sections',
    items: [...sectionItems],
    modelValue: 'Section 2 / Option 2'
  })
};

export const StaticWithSectionsAndNoTitle: Story = {
  render: renderListBox({label: '', items: [...sectionItems]})
};

export const WithDefaultSelectedOption: Story = {
  render: renderListBox({modelValue: 'Option 2'})
};

export const SingleSelectionWithDefaultSelectedOption: Story = {
  render: renderListBox({selectionMode: 'single', modelValue: 'Option 2'})
};

export const StaticWithDefaultSelectedOptions: Story = {
  render: renderListBox({
    selectionMode: 'multiple',
    modelValue: ['Option 2', 'Option 4']
  })
};

export const WithSelectedOptionsControlled: Story = {
  render: () => ({
    components: {ControlledSelectionListBox},
    template: '<ControlledSelectionListBox />'
  })
};

export const StaticWithSelectedOptionsControlled: Story = {
  render: () => ({
    components: {ControlledSelectionListBox},
    template: '<ControlledSelectionListBox :multiple="true" />'
  })
};

export const WithDisabledOptions: Story = {
  render: renderListBox({
    items: ['Option 1 (enabled)', 'Option 2 (disabled in React)', 'Option 3 (enabled)']
  })
};

export const StaticWithDisabledOptions: Story = {
  render: renderListBox({
    label: 'Static with disabled options',
    items: ['Option 1 (enabled)', 'Option 2 (disabled in React)', 'Option 3 (enabled)']
  })
};

export const MultipleSelection: Story = {
  render: renderListBox({selectionMode: 'multiple'})
};

export const MultipleSelectionStatic: Story = {
  render: renderListBox({
    selectionMode: 'multiple',
    label: 'Multiple selection static',
    modelValue: ['Option 1', 'Option 3']
  })
};

export const NoSelectionAllowed: Story = {
  render: renderListBox({selectionMode: 'none'})
};

export const NoSelectionAllowedStatic: Story = {
  render: renderListBox({
    selectionMode: 'none',
    label: 'No selection allowed static'
  })
};

export const ListBoxWithAutoFocusTrue: Story = {
  render: renderListBox({
    items: ['Auto focus 1', 'Auto focus 2', 'Auto focus 3'],
    modelValue: 'Auto focus 1'
  })
};

export const ListBoxWithAutoFocusComplex: Story = {
  render: renderListBox({
    items: ['Complex 1', 'Complex 2', 'Complex 3', 'Complex 4', 'Complex 5'],
    modelValue: 'Complex 3'
  })
};

export const ListBoxWithAutoFocusFirst: Story = {
  render: renderListBox({modelValue: 'Option 1'})
};

export const ListBoxWithAutoFocusLast: Story = {
  render: renderListBox({modelValue: 'Option 5'})
};

export const ListBoxWithKeyboardSelectionWrapping: Story = {
  render: renderListBox({
    items: ['Wrap 1', 'Wrap 2', 'Wrap 3', 'Wrap 4'],
    modelValue: 'Wrap 2'
  })
};

export const WithSemanticElementsStatic: Story = {
  render: renderListBox({
    items: ['Article', 'Section', 'Heading', 'Paragraph'],
    label: 'Semantic elements'
  })
};

export const WithSemanticElementsGenerativeMultipleSelection: Story = {
  render: renderListBox({
    items: ['Article', 'Section', 'Heading', 'Paragraph'],
    selectionMode: 'multiple',
    modelValue: ['Article', 'Paragraph'],
    label: 'Semantic elements (multiple)'
  })
};

export const IsLoading: Story = {
  render: renderListBox({
    items: [],
    label: 'Loading listbox',
    ariaLabel: 'Loading listbox'
  }, 'max-width: 280px;')
};

export const IsLoadingMore: Story = {
  render: renderListBox({
    items: ['Loaded item 1', 'Loaded item 2'],
    label: 'Loading more...'
  })
};

export const AsyncLoading: Story = {
  render: () => ({
    components: {AsyncLoadingListBox},
    template: '<AsyncLoadingListBox />'
  })
};

export const AsyncLoadingResizable: Story = {
  render: () => ({
    components: {AsyncLoadingListBox},
    template: '<AsyncLoadingListBox :resizable="true" />'
  })
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
  })
};

export const RestoreFocusExample: Story = {
  render: (args) => FocusExample(args)
};

export const WithTranslations: Story = {
  render: renderListBox({
    items: ['English', 'Espanol', 'Deutsch', 'Francais', 'Italiano'],
    label: 'Translations'
  })
};

export const Links: Story = {
  render: renderListBox({
    items: ['https://adobe.com', 'https://react-spectrum.adobe.com', 'https://vuejs.org'],
    label: 'Links'
  })
};

export const WithAvatars: Story = {
  render: renderListBox({
    items: ['Avery (avatar)', 'Kai (avatar)', 'Lena (avatar)', 'Rina (avatar)'],
    label: 'With avatars'
  })
};

export const WithTreeData: Story = {
  render: renderListBox({
    items: [
      'Documents / Projects / Proposal.md',
      'Documents / Projects / Design.sketch',
      'Documents / Notes / Ideas.txt',
      'Media / Images / Launch.png',
      'Media / Videos / Demo.mp4'
    ],
    label: 'With tree data'
  })
};
