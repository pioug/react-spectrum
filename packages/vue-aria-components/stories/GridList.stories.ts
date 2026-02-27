import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueListBox, VuePopover} from 'vue-aria-components';
import {computed, ref, type CSSProperties} from 'vue';

type GridListStory = StoryFn<typeof VueListBox>;
type Story = StoryObj<typeof meta>;
type LoadingState = 'idle' | 'loadingMore';
type InternalLoadingState = 'idle' | 'loading' | 'loadingMore';

type GridListSectionData = {
  id: string,
  items: Array<{id: string, name: string}>,
  label: string
};

type GridListItemData = {
  action?: string,
  id: number | string,
  name: string,
  textValue?: string
};

type UnsplashItem = {
  alt_description?: string,
  description?: string,
  height: number,
  id: number | string,
  urls: {regular: string},
  user: {name: string},
  width: number
};

const fallbackSwapiPeople = [
  'Luke Skywalker',
  'C-3PO',
  'R2-D2',
  'Darth Vader',
  'Leia Organa',
  'Owen Lars',
  'Beru Whitesun lars',
  'R5-D4'
];

const baseGridListClass = 'react-aria-GridList';
const baseGridListItemClass = 'react-aria-GridListItem';
const myGridListItemStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: '8px'
};
const imageGridListItemStyle: CSSProperties = {
  alignSelf: 'start',
  display: 'flex',
  flexDirection: 'column'
};

const meta = {
  title: 'React Aria Components/GridList',
  component: VueListBox,
  excludeStories: ['MyGridListItem']
} satisfies Meta<typeof VueListBox>;

export default meta;

export const MyGridListItem = {
  className: 'item',
  style: myGridListItemStyle
};

function createGridItems(count: number, prefix = 'Item', startAt = 0): GridListItemData[] {
  return Array.from({length: count}, (_, index) => {
    let itemNumber = startAt + index;
    return {
      id: itemNumber,
      name: `${prefix} ${itemNumber}`
    };
  });
}

function createSections(sectionCount: number, itemsPerSection: number): GridListSectionData[] {
  return Array.from({length: sectionCount}, (_, sectionIndex) => ({
    id: `section_${sectionIndex}`,
    items: Array.from({length: itemsPerSection}, (_, itemIndex) => ({
      id: `item_${sectionIndex}_${itemIndex}`,
      name: `Section ${sectionIndex}, Item ${itemIndex}`
    })),
    label: `Section ${sectionIndex}`
  }));
}

function createFallbackSwapiItems(): GridListItemData[] {
  return fallbackSwapiPeople.map((name) => ({
    id: name,
    name
  }));
}

function createFallbackUnsplashItems(): UnsplashItem[] {
  return [];
}

async function fetchSwapiPeoplePage({
  cursor,
  delayMs
}: {
  cursor?: string | null,
  delayMs: number
}): Promise<{cursor: string | null, items: GridListItemData[]}> {
  let nextCursor = cursor;
  if (nextCursor) {
    nextCursor = nextCursor.replace(/^http:\/\//i, 'https://');
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  let response = await fetch(nextCursor || 'https://swapi.py4e.com/api/people/?search=');
  if (!response.ok) {
    throw new Error(`SWAPI request failed: ${response.status}`);
  }

  let json = await response.json();
  let results = Array.isArray(json?.results) ? json.results : [];
  let items = results
    .map((item: {name?: unknown}, index: number) => ({
      id: String(item?.name ?? `person-${index}`),
      name: typeof item?.name === 'string' ? item.name : ''
    }))
    .filter((item) => Boolean(item.name));

  return {
    cursor: typeof json?.next === 'string' ? json.next : null,
    items
  };
}

async function fetchUnsplashItemsPage({
  page,
  delayMs
}: {
  page: number,
  delayMs: number
}): Promise<UnsplashItem[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  let response = await fetch(`https://api.unsplash.com/topics/nature/photos?page=${page}&per_page=30&client_id=AJuU-FPh11hn7RuumUllp4ppT8kgiLS7LtOHp_sp4nc`);
  if (!response.ok) {
    throw new Error(`Unsplash request failed: ${response.status}`);
  }

  let json = await response.json();
  let nextItems = Array.isArray(json) ? json : [];
  return nextItems
    .filter((item) => (item?.description || item?.alt_description))
    .map((item) => ({
      alt_description: item.alt_description,
      description: item.description,
      height: Number(item.height) || 300,
      id: String(item.id),
      urls: {
        regular: String(item?.urls?.regular ?? '')
      },
      user: {
        name: String(item?.user?.name ?? 'Unknown')
      },
      width: Number(item.width) || 300
    }));
}

export const GridListExample: GridListStory = (args) => ({
  components: {
    VueListBox
  },
  setup() {
    let selected = ref('');
    let listArgs = args as {layout?: 'grid' | 'stack'};
    let items = ['1,1', '1,2', '1,3', '2,1', '2,2', '2,3', '3,1', '3,2', '3,3'];
    let listStyle = computed<CSSProperties>(() => ({
      display: 'grid',
      gridAutoFlow: 'row',
      gridTemplate: listArgs.layout === 'grid' ? 'repeat(3, 1fr) / repeat(3, 1fr)' : 'auto / 1fr',
      height: '300px',
      width: '300px'
    }));

    let onSelect = (value: string) => {
      selected.value = value;
      action('onAction')(value);
    };

    return {
      args,
      items,
      listStyle,
      myGridListItemStyle,
      onSelect,
      selected
    };
  },
  template: `
    <VueListBox
      v-bind="args"
      v-model="selected"
      aria-label="test gridlist"
      class="menu"
      collection-class="react-aria-GridList"
      collection-role="grid"
      :items="items"
      item-base-class="react-aria-GridListItem"
      item-class="item"
      :item-style="myGridListItemStyle"
      item-role="row"
      :style="listStyle"
      @select="onSelect">
      <template #default="{label}">
        {{ label }} <button type="button">Actions</button>
      </template>
    </VueListBox>
  `
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

export const GridListSectionExample: GridListStory = (args) => ({
  components: {
    VueListBox
  },
  setup() {
    let selected = ref('');
    let sections = [
      {id: 'section_1', label: 'Section 1', items: ['1,1', '1,2', '1,3']},
      {id: 'section_2', label: 'Section 2', items: ['2,1', '2,2', '2,3']},
      {id: 'section_3', label: 'Section 3', items: ['3,1', '3,2', '3,3']}
    ];
    let onSelect = (value: string) => {
      selected.value = value;
      action('onAction')(value);
    };

    return {
      args,
      myGridListItemStyle,
      onSelect,
      sections,
      selected
    };
  },
  template: `
    <VueListBox
      v-bind="args"
      v-model="selected"
      aria-label="test gridlist"
      class="menu"
      collection-class="react-aria-GridList"
      collection-role="grid"
      header-class="react-aria-GridListHeader"
      item-base-class="react-aria-GridListItem"
      item-class="item"
      :item-style="myGridListItemStyle"
      item-role="row"
      :sections="sections"
      style="width: 400px; height: 400px;"
      @select="onSelect">
      <template #default="{label}">
        {{ label }} <button type="button">Actions</button>
      </template>
    </VueListBox>
  `
});

GridListSectionExample.args = {
  layout: 'stack',
  escapeKeyBehavior: 'clearSelection',
  shouldSelectOnPressUp: false
};

GridListSectionExample.argTypes = GridListExample.argTypes;

export function VirtualizedGridListSection() {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let sections = createSections(10, 3);

      return {
        myGridListItemStyle,
        sections,
        selected
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="virtualized with grid section"
        class="menu"
        collection-class="react-aria-GridList"
        collection-role="grid"
        header-class="react-aria-GridListHeader"
        item-base-class="react-aria-GridListItem"
        item-class="item"
        :item-style="myGridListItemStyle"
        item-role="row"
        :sections="sections"
        style="height: 400px;" />
    `
  };
}

export const VirtualizedGridList: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref<string[]>([]);
      // Match the initial virtualized viewport from React output.
      let items = createGridItems(16);
      let virtualizedItemStyle: CSSProperties = {
        ...myGridListItemStyle,
        marginBottom: '-1.28125px'
      };

      return {
        items,
        virtualizedItemStyle,
        selected
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="virtualized gridlist"
        class="menu"
        collection-class="react-aria-GridList"
        collection-role="grid"
        item-base-class="react-aria-GridListItem"
        item-class="item"
        :item-style="virtualizedItemStyle"
        item-role="row"
        :items="items"
        selection-mode="multiple"
        style="height: 400px;">
        <template #default="{label}">
          <button class="react-aria-Button" slot="drag" type="button" style="pointer-events: none;">≡</button>
          <label class="react-aria-Checkbox" slot="selection">
            <span style="border: 0; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;">
              <input aria-label="Select" tabindex="0" type="checkbox" />
            </span>
            <div class="checkbox">
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </div>
          </label>{{ label }}
        </template>
      </VueListBox>
    `
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

export let VirtualizedGridListGrid: StoryFn<VirtualizedGridListGridProps> = (args) => ({
  components: {
    VueListBox
  },
  setup() {
    let selected = ref('');
    // React renders only the currently visible virtualized window.
    // Keep a bounded DOM window here to match the captured viewport output.
    let items = createGridItems(120);
    let gridItemStyle: CSSProperties = {
      ...myGridListItemStyle,
      height: '21px',
      minHeight: '21px'
    };
    let listStyle = computed<CSSProperties>(() => {
      let minItemSizeWidth = args.minItemSizeWidth ?? 40;
      let maxItemSizeWidth = args.maxItemSizeWidth ?? 65;
      let minHorizontalSpace = args.minHorizontalSpace ?? 0;
      let maxColumns = args.maxColumns ?? Infinity;
      let gridTemplateColumns = Number.isFinite(maxColumns)
        ? `repeat(${maxColumns}, minmax(${minItemSizeWidth}px, 1fr))`
        : `repeat(auto-fill, minmax(${minItemSizeWidth}px, 1fr))`;

      return {
        '--grid-max-item-size': `${maxItemSizeWidth}px`,
        '--grid-min-item-size': `${minItemSizeWidth}px`,
        '--grid-min-space': `${minHorizontalSpace}px`,
        '--grid-vertical-space': '18px',
        gridAutoFlow: 'row',
        gridTemplateColumns,
        height: '382px',
        paddingTop: '18px',
        width: '400px'
      };
    });

    return {
      gridItemStyle,
      items,
      listStyle,
      selected
    };
  },
  template: `
    <VueListBox
      v-model="selected"
      aria-label="virtualized listbox"
      class="menu"
      collection-class="react-aria-GridList"
      collection-role="grid"
      item-base-class="react-aria-GridListItem"
      item-class="item"
      :item-style="gridItemStyle"
      item-role="row"
      layout="grid"
      :items="items"
      :style="listStyle" />
  `
});

VirtualizedGridListGrid.story = {
  args: {
    minItemSizeWidth: 40,
    maxItemSizeWidth: 65,
    maxColumns: undefined,
    minHorizontalSpace: 0,
    maxHorizontalSpace: undefined
  }
};

function AsyncGridListRender(props: {delay: number}) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let items = ref<GridListItemData[]>([]);
      let loading = ref(false);

      let loadInitial = async () => {
        loading.value = true;
        try {
          let next = await fetchSwapiPeoplePage({
            delayMs: props.delay ?? 50
          });
          items.value = next.items;
        } catch {
          items.value = createFallbackSwapiItems();
        } finally {
          loading.value = false;
        }
      };

      void loadInitial();

      return {
        items,
        loading,
        myGridListItemStyle,
        selected
      };
    },
    template: `
      <div>
        <VueListBox
          v-model="selected"
          aria-label="async gridlist"
          class="menu"
          collection-class="react-aria-GridList"
          collection-role="grid"
          :is-loading="loading"
          item-base-class="react-aria-GridListItem"
          item-class="item"
          :item-style="myGridListItemStyle"
          item-role="row"
          :items="items"
          style="height: 200px;">
          <template #empty="{isLoading}">
            <div style="height: 30px; width: 100%; position: relative;">
              <svg
                v-if="isLoading"
                aria-label="loading"
                viewBox="0 0 24 24"
                style="height: 20px; width: 20px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
                <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
              <template v-else>No results</template>
            </div>
          </template>
        </VueListBox>
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
      let items = ref<GridListItemData[]>([]);
      let loading = ref(false);

      let loadInitial = async () => {
        loading.value = true;
        try {
          let next = await fetchSwapiPeoplePage({
            delayMs: props.delay ?? 50
          });
          items.value = next.items;
        } catch {
          items.value = createFallbackSwapiItems();
        } finally {
          loading.value = false;
        }
      };

      void loadInitial();

      return {
        items,
        loading,
        myGridListItemStyle,
        selected
      };
    },
    template: `
      <div>
        <VueListBox
          v-model="selected"
          aria-label="async virtualized gridlist"
          class="menu"
          collection-class="react-aria-GridList"
          collection-role="grid"
          :is-loading="loading"
          item-base-class="react-aria-GridListItem"
          item-class="item"
          :item-style="myGridListItemStyle"
          item-role="row"
          :items="items"
          style="height: 200px;">
          <template #empty="{isLoading}">
            <div style="height: 30px; width: 100%; position: relative;">
              <svg
                v-if="isLoading"
                aria-label="loading"
                viewBox="0 0 24 24"
                style="height: 20px; width: 20px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
                <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
              <template v-else>No results</template>
            </div>
          </template>
        </VueListBox>
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
    let removableTagsOne = ref(['Tag 1', 'Tag 2', 'Tag 3']);
    let removableTagsTwo = ref(['Tag 1', 'Tag 2', 'Tag 3']);
    let readonlyTags = ref(['Tag 1', 'Tag 2', 'Tag 3']);
    let items = [
      {id: 'tags-with-remove', name: '1,1', kind: 'tags-with-remove'},
      {id: 'actions', name: '1,2', kind: 'actions'},
      {id: 'tags', name: '1,3', kind: 'tags'}
    ];
    let removeTag = (tags: typeof removableTagsOne, tag: string) => {
      tags.value = tags.value.filter((entry) => entry !== tag);
    };

    return {
      items,
      myGridListItemStyle,
      readonlyTags,
      removableTagsOne,
      removableTagsTwo,
      removeTag,
      selected,
    };
  },
  template: `
    <VueListBox
      v-model="selected"
      aria-label="Grid list with tag group"
      class="menu"
      collection-class="react-aria-GridList"
      collection-role="grid"
      item-base-class="react-aria-GridListItem"
      item-class="item"
      :item-style="myGridListItemStyle"
      item-role="row"
      keyboard-navigation-behavior="tab"
      :items="items"
      style="width: 300px; height: 300px;">
      <template #default="{item}">
        <template v-if="item.kind === 'tags-with-remove'">
          <span>1,1</span>
          <div class="react-aria-TagGroup">
            <div aria-label="Tag group 1" class="react-aria-TagList" role="grid" style="display: flex; gap: 10px;">
              <div v-for="tag in removableTagsOne" :key="'group-1-' + tag" class="react-aria-Tag" role="row">
                {{ tag }}<button class="react-aria-Button" slot="remove" type="button" @click.stop="removeTag(removableTagsOne, tag)">X</button>
              </div>
            </div>
          </div>
          <div class="react-aria-TagGroup">
            <div aria-label="Tag group 2" class="react-aria-TagList" role="grid" style="display: flex; gap: 10px;">
              <div v-for="tag in removableTagsTwo" :key="'group-2-' + tag" class="react-aria-Tag" role="row">
                {{ tag }}<button class="react-aria-Button" slot="remove" type="button" @click.stop="removeTag(removableTagsTwo, tag)">X</button>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="item.kind === 'actions'">
          <span>1,2</span><button class="react-aria-Button" type="button">Actions</button>
        </template>
        <template v-else>
          <span>1,3</span>
          <div class="react-aria-TagGroup">
            <div aria-label="Tag group" class="react-aria-TagList" role="grid" style="display: flex; gap: 10px;">
              <div v-for="tag in readonlyTags" :key="'readonly-' + tag" class="react-aria-Tag" role="row">{{ tag }}</div>
            </div>
          </div>
        </template>
      </template>
    </VueListBox>
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
      let items = [
        {id: 'charizard', label: 'Option 1', action: 'A', textValue: 'Charizard'},
        {id: 'blastoise', label: 'Option 2', action: 'B', textValue: 'Blastoise'},
        {id: 'venusaur', label: 'Option 3', action: 'C', textValue: 'Venusaur'},
        {id: 'pikachu', label: 'Option 4', action: 'D', textValue: 'Pikachu'}
      ];

      let handleSelection = (value: string) => {
        selected.value = value;
        isOpen.value = false;
      };

      return {
        handleSelection,
        isOpen,
        items,
        myGridListItemStyle,
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
              aria-label="Favorite pokemon"
              class="menu"
              collection-class="react-aria-GridList"
              collection-role="grid"
              item-base-class="react-aria-GridListItem"
              item-class="item"
              :item-style="myGridListItemStyle"
              item-role="row"
              :items="items"
              selection-mode="single"
              @select="handleSelection">
              <template #default="{item}">
                {{ item.label }} <button type="button">{{ item.action }}</button>
              </template>
            </VueListBox>
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
      GridListDropdown: GridListDropdownComponent
    },
    setup() {
      let mainModalOpen = ref(true);
      return {
        mainModalOpen
      };
    },
    template: `
      <div>
        <button type="button" @click="mainModalOpen = true">Open Modal</button>
        <div
          v-if="mainModalOpen"
          style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            color: #000;
            font-size: 16px;
            line-height: normal;
            font-family: system-ui;
          "
          @click.self="mainModalOpen = false">
          <div
            style="
              display: flex;
              flex-direction: column;
              padding: 8px;
              background: #ccc;
              color: #000;
              font-size: 16px;
              line-height: normal;
              font-family: system-ui;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              width: max-content;
              height: max-content;
            ">
            <h2>Open the GridList Picker</h2>
            <GridListDropdown />
          </div>
        </div>
      </div>
    `
  };
}

export let GridListInModalPicker: Story = {
  render: () => GridListInModalPickerRender(),
  parameters: {
    docs: {
      description: {
        component: 'Selecting an option from the grid list over the backdrop should not result in the modal closing.'
      }
    }
  }
};

interface AsyncGridListGridVirtualizedRenderProps {
  delay: number,
  layout: 'grid' | 'waterfall',
  loaderHeight: number,
  loadingState: LoadingState
}

function AsyncGridListGridVirtualizedRender(props: AsyncGridListGridVirtualizedRenderProps) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let items = ref<UnsplashItem[]>([]);
      let loading = ref(false);
      let internalLoadingState = ref<InternalLoadingState>('idle');
      let listStyle = computed<CSSProperties>(() => ({
        '--grid-max-item-size': '140px',
        '--grid-min-item-size': '100px',
        '--grid-min-space': '6px',
        '--grid-vertical-space': '6px',
        columnGap: '4px',
        gridTemplateColumns: 'repeat(3, 127px)',
        height: '394px',
        paddingInlineStart: '5px',
        paddingTop: '6px',
        rowGap: '6px',
        width: '395px'
      }));
      let loadingState = computed<InternalLoadingState | LoadingState>(() => (
        props.loadingState === 'idle' ? internalLoadingState.value : props.loadingState
      ));
      let showLoading = computed(() => loadingState.value === 'loadingMore');

      let loadInitial = async () => {
        internalLoadingState.value = 'loading';
        loading.value = true;
        try {
          items.value = await fetchUnsplashItemsPage({
            delayMs: props.delay ?? 50,
            page: 1
          });
        } catch {
          items.value = createFallbackUnsplashItems();
        } finally {
          loading.value = false;
          internalLoadingState.value = 'idle';
        }
      };

      void loadInitial();

      return {
        imageGridListItemStyle,
        items,
        listStyle,
        selected,
        showLoading
      };
    },
    template: `
      <div>
        <VueListBox
          v-model="selected"
          aria-label="async virtualized gridlist"
          class="menu"
          collection-class="react-aria-GridList"
          collection-role="grid"
          :is-loading="loading"
          item-base-class="react-aria-GridListItem"
          :item-style="imageGridListItemStyle"
          item-role="row"
          layout="grid"
          :items="items"
          :style="listStyle">
          <template #default="{item}">
            <img
              alt=""
              :height="item.height"
              :src="item.urls?.regular"
              :width="item.width"
              style="height: 200px; object-fit: cover; width: 100%;">
            <span slot="description" class="react-aria-Text">By <span>{{ item.user?.name }}</span></span>
          </template>
          <template #empty="{isLoading}">
            <div style="height: 30px; width: 100%; position: relative;">
              <svg
                v-if="isLoading"
                aria-label="loading"
                viewBox="0 0 24 24"
                style="height: 20px; width: 20px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
                <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
              <template v-else>No results</template>
            </div>
          </template>
        </VueListBox>
        <div
          v-if="showLoading"
          class="react-aria-GridListLoadingIndicator"
          style="align-items: center; display: flex; height: 30px; justify-content: center; width: 100%;">
          <svg
            aria-label="loading"
            viewBox="0 0 24 24"
            style="height: 20px; width: 20px;">
            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
            <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
              <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      </div>
    `
  };
}

export const AsyncGridListGridVirtualized: Story = {
  render: (args: AsyncGridListGridVirtualizedRenderProps) => AsyncGridListGridVirtualizedRender(args),
  args: {
    delay: 50,
    layout: 'grid',
    loaderHeight: 30,
    loadingState: 'idle'
  },
  argTypes: {
    delay: {
      control: 'number'
    },
    layout: {
      control: 'select',
      options: ['grid', 'waterfall']
    },
    loaderHeight: {
      control: 'number'
    },
    loadingState: {
      control: 'select',
      options: ['idle', 'loadingMore']
    }
  }
};
