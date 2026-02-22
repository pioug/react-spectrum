import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueListBox, VuePopover} from '@vue-spectrum/components';
import {computed, ref} from 'vue';

type StoryArgs = Record<string, unknown>;
type StyleMap = Record<string, number | string>;

const meta = {
  title: 'React Aria Components/GridList',
  component: VueListBox
} satisfies Meta<typeof VueListBox>;

export default meta;

type GridListStory = StoryFn<typeof VueListBox>;
type Story = StoryObj<typeof meta>;

function createGridItems(count: number, prefix = 'Item'): string[] {
  return Array.from({length: count}, (_, index) => `${prefix} ${index + 1}`);
}

function createGridListStory(args: StoryArgs = {}, options: {
  containerStyle?: StyleMap,
  items: string[],
  label: string,
  listStyle?: StyleMap
}) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let onSelect = (value: string) => {
        selected.value = value;
        action('onAction')(value);
      };

      return {
        args,
        containerStyle: options.containerStyle ?? {},
        items: options.items,
        label: options.label,
        listStyle: options.listStyle ?? {},
        onSelect,
        selected
      };
    },
    template: `
      <div :style="containerStyle">
        <VueListBox
          v-bind="args"
          v-model="selected"
          :items="items"
          :label="label"
          :style="listStyle"
          @select="onSelect" />
      </div>
    `
  };
}

export const GridListExample: GridListStory = (args) => createGridListStory(args, {
  items: ['1,1', '1,2', '1,3', '2,1', '2,2', '2,3', '3,1', '3,2', '3,3'],
  label: 'test gridlist',
  listStyle: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    height: '300px',
    width: '300px'
  }
});

GridListExample.args = {
  layout: 'stack',
  escapeKeyBehavior: 'clearSelection',
  shouldSelectOnPressUp: false,
  disallowTypeAhead: false
};

GridListExample.argTypes = {
  layout: {
    control: 'radio',
    options: ['stack', 'grid']
  },
  keyboardNavigationBehavior: {
    control: 'radio',
    options: ['arrow', 'tab']
  },
  selectionMode: {
    control: 'radio',
    options: ['none', 'single', 'multiple']
  },
  selectionBehavior: {
    control: 'radio',
    options: ['toggle', 'replace']
  },
  escapeKeyBehavior: {
    control: 'radio',
    options: ['clearSelection', 'none']
  }
};

export const GridListSectionExample: GridListStory = (args) => createGridListStory(args, {
  items: [
    'Section 1 / 1,1',
    'Section 1 / 1,2',
    'Section 1 / 1,3',
    'Section 2 / 2,1',
    'Section 2 / 2,2',
    'Section 2 / 2,3',
    'Section 3 / 3,1',
    'Section 3 / 3,2',
    'Section 3 / 3,3'
  ],
  label: 'test gridlist',
  listStyle: {
    height: '400px',
    width: '400px'
  }
});

GridListSectionExample.args = {
  layout: 'stack',
  escapeKeyBehavior: 'clearSelection',
  shouldSelectOnPressUp: false
};

GridListSectionExample.argTypes = GridListExample.argTypes;

export function VirtualizedGridListSection() {
  return createGridListStory({}, {
    items: Array.from({length: 30}, (_, index) => `Section ${Math.floor(index / 3) + 1}, Item ${(index % 3) + 1}`),
    label: 'virtualized with grid section',
    listStyle: {
      height: '400px',
      overflow: 'auto'
    }
  });
}

export const VirtualizedGridList: Story = {
  render: (args) => createGridListStory(args, {
    items: createGridItems(1000),
    label: 'virtualized gridlist',
    listStyle: {
      height: '400px',
      overflow: 'auto'
    }
  }),
  args: {
    isLoading: false
  }
};

interface VirtualizedGridListGridProps {
  maxColumns?: number,
  maxHorizontalSpace?: number,
  maxItemSizeWidth?: number,
  minHorizontalSpace?: number,
  minItemSizeWidth?: number
}

export let VirtualizedGridListGrid: StoryFn<VirtualizedGridListGridProps> = (args) => createGridListStory(args, {
  items: createGridItems(500),
  label: 'virtualized gridlist grid',
  listStyle: {
    display: 'grid',
    gap: `${args.minHorizontalSpace ?? 8}px`,
    gridTemplateColumns: `repeat(${args.maxColumns ?? 4}, minmax(${args.minItemSizeWidth ?? 40}px, ${args.maxItemSizeWidth ?? 65}px))`,
    height: '400px',
    overflow: 'auto'
  }
});

VirtualizedGridListGrid.story = {
  args: {
    minItemSizeWidth: 40,
    maxItemSizeWidth: 65,
    maxColumns: 4,
    minHorizontalSpace: 8,
    maxHorizontalSpace: 16
  }
};

function AsyncGridListRender(props: {delay: number}) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let items = ref<string[]>([]);
      let loading = ref(true);

      setTimeout(() => {
        items.value = createGridItems(30, 'Async item');
        loading.value = false;
      }, props.delay ?? 50);

      return {
        items,
        loading,
        selected
      };
    },
    template: `
      <div>
        <p v-if="loading" style="margin: 0 0 8px 0;">Loading async grid list...</p>
        <VueListBox
          v-model="selected"
          :items="items"
          label="async grid list"
          style="height: 300px; overflow: auto;" />
      </div>
    `
  };
}

export let AsyncGridList: Story = {
  render: (args: {delay: number}) => AsyncGridListRender(args),
  args: {
    delay: 50
  }
};

function AsyncGridListVirtualizedRender(props: {delay: number}) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let items = ref<string[]>([]);
      let loading = ref(true);

      setTimeout(() => {
        items.value = createGridItems(200, 'Async virtualized item');
        loading.value = false;
      }, props.delay ?? 50);

      return {
        items,
        loading,
        selected
      };
    },
    template: `
      <div>
        <p v-if="loading" style="margin: 0 0 8px 0;">Loading async virtualized grid list...</p>
        <VueListBox
          v-model="selected"
          :items="items"
          label="async virtualized grid list"
          style="height: 320px; overflow: auto;" />
      </div>
    `
  };
}

export let AsyncGridListVirtualized: Story = {
  render: (args: {delay: number}) => AsyncGridListVirtualizedRender(args),
  args: {
    delay: 50
  }
};

export let TagGroupInsideGridList: GridListStory = () => ({
  components: {
    VueListBox
  },
  setup() {
    let selected = ref('');
    let tagsByItem: Record<string, string[]> = {
      'File 1': ['Design', 'UX'],
      'File 2': ['Engineering'],
      'File 3': ['Research', 'QA']
    };
    let items = Object.keys(tagsByItem);
    let selectedTags = computed(() => tagsByItem[selected.value] ?? []);

    return {
      items,
      selected,
      selectedTags
    };
  },
  template: `
    <div style="display: grid; gap: 8px; max-width: 360px;">
      <VueListBox
        v-model="selected"
        :items="items"
        label="tag group inside grid list"
        style="height: 220px; overflow: auto;" />
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        <span
          v-for="tag in selectedTags"
          :key="tag"
          style="padding: 2px 8px; border: 1px solid #d9d9d9; border-radius: 999px;">
          {{ tag }}
        </span>
      </div>
    </div>
  `
});

function GridListDropdown() {
  return {
    components: {
      VueListBox,
      VuePopover
    },
    setup() {
      let isOpen = ref(false);
      let selected = ref('');
      let items = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

      let handleSelection = (value: string) => {
        selected.value = value;
        isOpen.value = false;
      };

      return {
        handleSelection,
        isOpen,
        items,
        selected
      };
    },
    template: `
      <div>
        <button type="button" style="display: block; width: 100%;" @click="isOpen = true">Open GridList Options</button>
        <VuePopover :open="isOpen" placement="bottom" @close="isOpen = false">
          <div>
            <VueListBox
              v-model="selected"
              :items="items"
              label="Favorite pokemon"
              selection-mode="single"
              @select="handleSelection" />
          </div>
        </VuePopover>
      </div>
    `
  };
}

function GridListInModalPickerRender() {
  let GridListDropdownComponent = GridListDropdown();
  return {
    components: {
      GridListDropdown: GridListDropdownComponent,
      VueButton
    },
    setup() {
      let mainModalOpen = ref(true);
      return {
        mainModalOpen
      };
    },
    template: `
      <div>
        <VueButton @click="mainModalOpen = true">Open Modal</VueButton>
        <div
          v-if="mainModalOpen"
          style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
          "
          @click.self="mainModalOpen = false">
          <div
            style="
              display: flex;
              flex-direction: column;
              padding: 8px;
              background: #ccc;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              width: max-content;
              height: max-content;
            ">
            <h2 style="margin: 0 0 8px 0;">Open the GridList Picker</h2>
            <GridListDropdown />
          </div>
        </div>
      </div>
    `
  };
}

export let GridListInModalPicker: Story = {
  render: () => GridListInModalPickerRender()
};

interface AsyncGridListGridVirtualizedRenderProps {
  delay: number
}

function AsyncGridListGridVirtualizedRender(props: AsyncGridListGridVirtualizedRenderProps) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let items = ref<string[]>([]);
      let loading = ref(true);

      setTimeout(() => {
        items.value = createGridItems(300, 'Async grid item');
        loading.value = false;
      }, props.delay ?? 50);

      return {
        items,
        loading,
        selected
      };
    },
    template: `
      <div>
        <p v-if="loading" style="margin: 0 0 8px 0;">Loading async grid-list grid virtualized...</p>
        <VueListBox
          v-model="selected"
          :items="items"
          label="async grid list grid virtualized"
          style="height: 320px; overflow: auto; display: grid;" />
      </div>
    `
  };
}

export const AsyncGridListGridVirtualized: Story = {
  render: (args: AsyncGridListGridVirtualizedRenderProps) => AsyncGridListGridVirtualizedRender(args),
  args: {
    delay: 50
  }
};
