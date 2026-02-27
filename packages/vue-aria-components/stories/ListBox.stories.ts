import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueListBox} from 'vue-aria-components';
import {ref} from 'vue';
import '../../react-aria-components/stories/styles.css';

const basicItems = ['Foo', 'Bar', 'Baz', 'Google'];
const dropOntoRootAlbums = [
  {
    artist: 'Luna Solstice',
    image: 'https://images.unsplash.com/photo-1593958812614-2db6a598c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlzY298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Euphoric Echoes'
  },
  {
    artist: 'Electra Skyline',
    image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmVvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Neon Dreamscape'
  },
  {
    artist: "Orion's Symphony",
    image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNwYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60',
    title: 'Cosmic Serenade'
  },
  {
    artist: 'Violet Mistral',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Melancholy Melodies'
  },
  {
    artist: 'Mirage Beats',
    image: 'https://images.unsplash.com/photo-1608433319511-dfe8ea4cbd3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJlYXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60',
    title: 'Rhythmic Illusions'
  }
];
const gridItems = ['1,1', '1,2', '1,3', '2,1', '2,2', '2,3', '3,1', '3,2', '3,3'];
const listBoxScrollMarginItems = Array.from({length: 100}, (_, id) => ({
  description: `Description ${id}`,
  id,
  name: `Item ${id}`
}));
const listBoxSmoothScrollItems = Array.from({length: 100}, (_, id) => `Item ${id}`);
const virtualizedListBoxVisibleItems = Array.from({length: 22}, (_, id) => `Section 0, Item ${id}`);
const virtualizedListBoxGridVisibleItems = Array.from({length: 48}, (_, id) => `Item ${id}`);
const virtualizedListBoxWaterfallVisibleItems = [
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing',
  'Lorem ipsum dolor',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet,',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet,',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet,',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet,',
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit',
  'Lorem ipsum dolor sit',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur',
  'Lorem ipsum dolor',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing',
  'Lorem ipsum dolor sit amet, consectetur adipiscing'
];

const meta = {
  title: 'React Aria Components/ListBox',
  component: VueListBox,
  excludeStories: ['MyListBoxLoaderIndicator']
} satisfies Meta<typeof VueListBox>;

export default meta;

type ListBoxStory = StoryFn<typeof VueListBox>;
type Story = StoryObj<typeof meta>;
type ListBoxStoryArgs = Record<string, unknown>;
type StyleMap = Record<string, string | number>;

export const MyListBoxLoaderIndicator = (props: {isLoading?: boolean, orientation?: 'horizontal' | 'vertical'} = {}) => {
  let orientation = props.orientation ?? 'vertical';
  return {
    label: props.isLoading ? 'Loading...' : 'Load more',
    style: {
      alignItems: 'center',
      display: 'flex',
      flexShrink: 0,
      height: orientation === 'horizontal' ? '100px' : '30px',
      justifyContent: 'center',
      marginTop: '8px',
      width: orientation === 'horizontal' ? '30px' : '100%'
    } as StyleMap
  };
};

interface AsyncListBoxArgs {
  delay?: number,
  orientation?: 'horizontal' | 'vertical'
}

function createAsyncListBoxStory(args: AsyncListBoxArgs = {}, opts: {virtualized?: boolean} = {}) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      let items = ref<string[]>([]);
      let page = ref(0);
      let loading = ref(false);
      let chunkSize = opts.virtualized ? 60 : 20;
      let orientation = args.orientation ?? 'horizontal';

      let loadMore = () => {
        if (loading.value) {
          return;
        }

        loading.value = true;
        setTimeout(() => {
          let start = page.value * chunkSize;
          let next = Array.from({length: chunkSize}, (_, index) => `Character ${start + index + 1}`);
          items.value = [...items.value, ...next];
          page.value += 1;
          loading.value = false;
        }, args.delay ?? 50);
      };

      loadMore();

      return {
        args,
        listStyle: {
          border: '1px solid #d9d9d9',
          height: opts.virtualized ? '320px' : orientation === 'horizontal' ? 'fit-content' : '400px',
          overflow: 'auto',
          width: orientation === 'horizontal' ? '400px' : opts.virtualized ? '120px' : '220px'
        } as StyleMap,
        loading,
        loadMore,
        loaderIndicator: MyListBoxLoaderIndicator({isLoading: loading.value, orientation}),
        onSelect: action('onAction'),
        selected,
        items
      };
    },
    template: `
      <div>
        <VueListBox
          v-bind="args"
          v-model="selected"
          :items="items"
          label="async listbox"
          :style="listStyle"
          @select="onSelect" />
        <button type="button" :style="loaderIndicator.style" :disabled="loading" @click="loadMore">
          {{ loading ? 'Loading...' : loaderIndicator.label }}
        </button>
      </div>
    `
  };
}

function createAlbumCardListBoxStory(label: string, args: ListBoxStoryArgs = {}, options: {orientation?: 'horizontal' | 'vertical'} = {}) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref<string[]>([]);
      return {
        args,
        albumListStyle: {
          display: 'flex',
          flexDirection: options.orientation === 'vertical' ? 'column' : 'row',
          maxWidth: '100%',
          outline: 'none',
          overflow: 'auto',
          padding: '4px',
          width: 'fit-content'
        } as StyleMap,
        albumItemStyle: {
          borderRadius: '6px',
          cursor: 'default',
          display: 'flex',
          flexDirection: 'column',
          margin: '0px',
          outline: 'none',
          padding: '4px',
          position: 'relative'
        } as StyleMap,
        onSelect: action('onAction'),
        selected,
        dropOntoRootAlbums
      };
    },
    template: `
      <VueListBox
        v-bind="args"
        v-model="selected"
        aria-label="${label}"
        collection-class="react-aria-ListBox"
        item-base-class="react-aria-ListBoxItem"
        item-class="react-aria-ListBoxItem"
        :items="dropOntoRootAlbums"
        selection-mode="multiple"
        data-orientation="${options.orientation ?? 'horizontal'}"
        :item-style="albumItemStyle"
        :style="albumListStyle"
        @select="onSelect">
        <template #default="{item, value}">
          <div draggable="true" data-allows-dragging="true">
            <img alt="" :src="item.image" style="object-fit: cover; width: 150px; height: 150px; margin-bottom: 4px; border-radius: 4px; transition: box-shadow 200ms;" />
            <span class="react-aria-Text" :id="'list-box-album-title-' + value" slot="label" style="font-weight: bold;">{{ item.title }}</span>
            <span class="react-aria-Text" :id="'list-box-album-artist-' + value" slot="description" style="font-size: small;">{{ item.artist }}</span>
          </div>
        </template>
      </VueListBox>
    `
  };
}

export const ListBoxExample: Story = {
  render: (args) => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      return {
        args,
        itemStyle: {
          color: '#000',
          cursor: 'default',
          display: 'grid',
          overflow: 'hidden',
          padding: '2px 5px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word'
        } as StyleMap,
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          marginTop: '4px',
          maxWidth: '100%',
          width: '150px'
        } as StyleMap,
        onSelect: action('onAction'),
        selected,
        items: basicItems
      };
    },
    template: `
      <VueListBox
        v-bind="args"
        v-model="selected"
        aria-label="test listbox"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        :items="items"
        :item-style="itemStyle"
        :style="listStyle"
        @select="onSelect">
        <template #default="{label}">
          <a v-if="label === 'Google'" href="http://google.com">{{ label }}</a>
          <span v-else>{{ label }}</span>
        </template>
      </VueListBox>
    `
  })
};

ListBoxExample.args = {
  selectionMode: 'none',
  selectionBehavior: 'toggle',
  shouldFocusOnHover: false,
  escapeKeyBehavior: 'clearSelection'
};

ListBoxExample.argTypes = {
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

ListBoxExample.parameters = {
  description: {
    data: 'Hover and focus styling behavior mirrored from the React story.'
  }
};

export const ListBoxSections: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref<string[]>([]);
      return {
        selected,
        sections: [
          {
            title: 'Section 1',
            items: ['Foo', 'Bar', 'Baz']
          },
          {
            title: 'Section 2',
            items: ['Foo', 'Bar', 'Baz']
          }
        ],
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          marginTop: '4px',
          maxWidth: '100%',
          width: '150px'
        } as StyleMap,
        itemStyle: {
          color: '#000',
          display: 'grid',
          overflow: 'hidden',
          padding: '2px 5px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word'
        } as StyleMap
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="test listbox with section"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        header-class="react-aria-Header"
        selection-mode="multiple"
        :sections="sections"
        :item-style="itemStyle"
        :style="listStyle" />
    `
  })
};

export const ListBoxComplex: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref<string[]>([]);
      return {
        selected,
        items: [
          {label: 'Item 1', description: 'Description'},
          {label: 'Item 2', description: 'Description'},
          {label: 'Item 3', description: 'Description'}
        ],
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          marginTop: '4px',
          maxWidth: '100%',
          width: '150px'
        } as StyleMap,
        itemStyle: {
          color: '#000',
          cursor: 'default',
          display: 'grid',
          overflow: 'hidden',
          padding: '2px 5px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word'
        } as StyleMap
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="listbox complex"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        selection-mode="multiple"
        :items="items"
        :item-style="itemStyle"
        :style="listStyle">
        <template #default="{item}">
          <span class="react-aria-Text" slot="label">{{ item.label }}</span>
          <span class="react-aria-Text" slot="description" style="font-size: 13px;">{{ item.description }}</span>
        </template>
      </VueListBox>
    `
  })
};

export const ListBoxDnd: Story = {
  render: (args) => createAlbumCardListBoxStory('Albums', args as ListBoxStoryArgs)
};

ListBoxDnd.args = {
  layout: 'stack',
  orientation: 'horizontal'
};

ListBoxDnd.argTypes = {
  layout: {
    control: 'radio',
    options: ['stack', 'grid']
  },
  orientation: {
    control: 'radio',
    options: ['horizontal', 'vertical']
  }
};

export const ListBoxPreviewOffset: Story = {
  render: (args) => createAlbumCardListBoxStory('Albums with preview offset', args as ListBoxStoryArgs),
  args: {
    layout: 'stack',
    orientation: 'horizontal',
    mode: 'default',
    offsetX: 20,
    offsetY: 20
  },
  argTypes: {
    layout: {
      control: 'radio',
      options: ['stack', 'grid']
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    mode: {
      control: 'select',
      options: ['default', 'custom']
    },
    offsetX: {
      control: 'number'
    },
    offsetY: {
      control: 'number'
    }
  }
};

export const ListBoxHover: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      return {
        selected,
        itemStyle: {
          color: '#000',
          cursor: 'default',
          display: 'grid',
          overflow: 'hidden',
          padding: '2px 5px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word'
        } as StyleMap,
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          marginTop: '4px',
          maxWidth: '100%',
          width: '150px'
        } as StyleMap,
        onSelect: action('onAction'),
        items: ['Hover', 'Bar', 'Baz', 'Google']
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="test listbox"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        :items="items"
        :item-style="itemStyle"
        :style="listStyle"
        @select="onSelect">
        <template #default="{label}">
          <a v-if="label === 'Google'" href="http://google.com">{{ label }}</a>
          <span v-else>{{ label }}</span>
        </template>
      </VueListBox>
    `
  })
};

export const ListBoxGrid: Story = {
  render: (args) => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref<string[]>([]);
      return {
        args,
        gridItems,
        selected,
        itemStyle: {
          alignItems: 'center',
          color: '#000',
          display: 'flex',
          justifyContent: 'center',
          padding: '2px 5px',
          wordBreak: 'break-word'
        } as StyleMap,
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          display: 'grid',
          gridAutoFlow: (args as {orientation?: 'horizontal' | 'vertical'}).orientation === 'horizontal' ? 'column' : 'row',
          gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
          height: '300px',
          marginTop: '4px',
          width: '300px'
        } as StyleMap
      };
    },
    template: `
      <VueListBox
        v-bind="args"
        v-model="selected"
        aria-label="test listbox"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        layout="grid"
        :items="gridItems"
        :item-style="itemStyle"
        :style="listStyle" />
    `
  })
};

ListBoxGrid.args = {
  layout: 'grid',
  orientation: 'vertical'
};

ListBoxGrid.argTypes = {
  orientation: {
    control: {
      type: 'radio'
    },
    options: ['vertical', 'horizontal']
  }
};

export const VirtualizedListBox: Story = {
  render: () => ({
    setup() {
      let selected = ref('');
      let sections = [
        {
          title: 'Section 0',
          items: virtualizedListBoxVisibleItems
        }
      ];

      return {
        sections,
        selected
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="virtualized listbox"
        class="v7C2Sq_menu"
        collection-class="v7C2Sq_menu"
        header-class="react-aria-Header"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        :item-style="{wordBreak: 'break-word', display: 'grid', padding: '2px 5px', overflow: 'hidden', whiteSpace: 'nowrap', color: '#000', textOverflow: 'ellipsis'}"
        :sections="sections"
        style="margin-top: 4px; width: 150px; max-width: 100%; height: 400px; border: 1px solid gray; background: lightgray; overflow: auto;" />
    `
  }),
  args: {
    variableHeight: false,
    isLoading: false
  }
};

export const VirtualizedListBoxEmpty: Story = {
  render: () => ({
    setup() {
      let selected = ref('');

      return {
        selected
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="virtualized listbox"
        class="v7C2Sq_menu"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        :items="[]"
        style="margin-top: 4px; width: 150px; max-width: 100%; height: 400px; border: 1px solid gray; background: lightgray; overflow: auto;">
        <template #empty>Empty</template>
      </VueListBox>
    `
  })
};

export const VirtualizedListBoxDnd: Story = {
  render: () => ({
    setup() {
      let selected = ref<string[]>([]);
      return {
        selected,
        virtualizedListBoxGridVisibleItems
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="virtualized listbox dnd"
        class="v7C2Sq_menu"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        layout="grid"
        selection-mode="multiple"
        :items="virtualizedListBoxGridVisibleItems"
        :item-style="{wordBreak: 'break-word', border: '1px solid', boxSizing: 'border-box', display: 'grid', padding: '2px 5px', overflow: 'hidden', whiteSpace: 'nowrap', color: '#000', textOverflow: 'ellipsis'}"
        style="margin-top: 4px; width: 400px; max-width: 100%; height: 400px; border: 1px solid gray; background: lightgray; overflow: auto;">
        <template #default="{label}">
          <div draggable="true" data-allows-dragging="true">{{ label }}</div>
        </template>
      </VueListBox>
    `
  })
};

export const VirtualizedListBoxDndOnAction: Story = {
  render: () => ({
    setup() {
      let selected = ref<string[]>([]);

      return {
        selected,
        virtualizedListBoxGridVisibleItems
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="virtualized listbox dnd on action"
        class="v7C2Sq_menu"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        layout="grid"
        selection-mode="multiple"
        :items="virtualizedListBoxGridVisibleItems"
        :item-style="{wordBreak: 'break-word', border: '1px solid', boxSizing: 'border-box', display: 'grid', padding: '2px 5px', overflow: 'hidden', whiteSpace: 'nowrap', color: '#000', textOverflow: 'ellipsis'}"
        style="margin-top: 4px; width: 400px; max-width: 100%; height: 400px; border: 1px solid gray; background: lightgray; overflow: auto;"
        @select="(value) => action('onAction')(value)">
        <template #default="{label}">
          <div draggable="true" data-allows-dragging="true">{{ label }}</div>
        </template>
      </VueListBox>
    `
  })
};


export const VirtualizedListBoxGrid: Story = {
  render: () => ({
    setup() {
      let selected = ref<string[]>([]);
      return {
        selected,
        virtualizedListBoxGridVisibleItems
      };
    },
    template: `
      <div style="height: 400px; width: 400px; resize: both; padding: 40px; overflow: hidden;">
        <VueListBox
          v-model="selected"
          aria-label="virtualized listbox"
          class="v7C2Sq_menu"
          collection-class="v7C2Sq_menu"
          item-base-class="v7C2Sq_item"
          item-class="v7C2Sq_item"
          layout="grid"
          selection-mode="multiple"
          :items="virtualizedListBoxGridVisibleItems"
          :item-style="{wordBreak: 'break-word', border: '1px solid', boxSizing: 'border-box', display: 'grid', padding: '2px 5px', overflow: 'hidden', whiteSpace: 'nowrap', color: '#000', textOverflow: 'ellipsis'}"
          style="margin-top: 4px; width: 100%; height: 100%; border: 1px solid gray; background: lightgray; overflow: auto;">
          <template #default="{label}">
            <div draggable="true" data-allows-dragging="true">{{ label }}</div>
          </template>
        </VueListBox>
      </div>
    `
  }),
  args: {
    minSize: 80,
    maxSize: 100,
    preserveAspectRatio: false
  }
};

export const VirtualizedListBoxWaterfall: Story = {
  render: () => ({
    setup() {
      let selected = ref<string[]>([]);
      return {
        selected,
        virtualizedListBoxWaterfallVisibleItems
      };
    },
    template: `
      <div style="height: 400px; width: 400px; resize: both; padding: 40px; overflow: hidden;">
        <VueListBox
          v-model="selected"
          aria-label="virtualized listbox"
          class="v7C2Sq_menu"
          collection-class="v7C2Sq_menu"
          item-base-class="v7C2Sq_item"
          item-class="v7C2Sq_item"
          layout="grid"
          selection-mode="multiple"
          :items="virtualizedListBoxWaterfallVisibleItems"
          :item-style="{wordBreak: 'break-word', border: '1px solid', boxSizing: 'border-box', display: 'grid', padding: '2px 5px', overflow: 'hidden', whiteSpace: 'nowrap', color: '#000', textOverflow: 'ellipsis'}"
          style="margin-top: 4px; width: 100%; height: 100%; border: 1px solid gray; background: lightgray; overflow: auto;" />
      </div>
    `
  }),
  args: {
    minSize: 40,
    maxSize: 65,
    maxColumns: undefined,
    minSpace: undefined,
    maxSpace: undefined
  },
  argTypes: {
    minSize: {
      control: 'number',
      description: 'The minimum width of each item in the grid list',
      defaultValue: 40
    },
    maxSize: {
      control: 'number',
      description: 'Maximum width of each item in the grid list.',
      defaultValue: 65
    },
    maxColumns: {
      control: 'number',
      description: 'Maximum number of columns in the grid list.',
      defaultValue: undefined
    },
    minSpace: {
      control: 'number',
      description: 'Minimum horizontal space between grid items.',
      defaultValue: undefined
    },
    maxSpace: {
      control: 'number',
      description: 'Maximum horizontal space between grid items.',
      defaultValue: undefined
    }
  }
};

export const AsyncListBox: Story = {
  render: (args) => createAsyncListBoxStory(args as AsyncListBoxArgs),
  args: {
    orientation: 'horizontal',
    delay: 50
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    }
  }
};

export const AsyncListBoxVirtualized: ListBoxStory = (args) => createAsyncListBoxStory(args as AsyncListBoxArgs, {virtualized: true});

AsyncListBoxVirtualized.args = {
  delay: 50
};

export const ListBoxScrollMargin: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref('');
      return {
        listBoxScrollMarginItems,
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          height: '200px',
          marginTop: '4px',
          maxWidth: '100%',
          minWidth: '150px',
          overflow: 'scroll',
          width: '150px'
        } as StyleMap,
        selected,
        itemStyle: {
          color: '#000',
          display: 'flex',
          justifyContent: 'space-between',
          overflow: 'hidden',
          padding: '2px 20px',
          scrollMargin: '10px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '150px',
          wordBreak: 'break-word'
        } as StyleMap
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="test listbox"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        :items="listBoxScrollMarginItems"
        :item-style="itemStyle"
        :style="listStyle">
        <template #default="{item}">
          <span>{{ item.name }}</span>
          <span>{{ item.description }}</span>
        </template>
      </VueListBox>
    `
  })
};

export const ListBoxSmoothScroll: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let selected = ref<string[]>([]);
      return {
        listBoxSmoothScrollItems,
        selected,
        listStyle: {
          background: 'lightgray',
          border: '1px solid gray',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 80px)',
          height: '200px',
          marginTop: '4px',
          maxWidth: '100%',
          minWidth: '150px',
          overflow: 'scroll',
          scrollBehavior: 'smooth',
          width: '200px'
        } as StyleMap,
        itemStyle: {
          color: '#000',
          display: 'grid',
          minHeight: '32px',
          overflow: 'hidden',
          padding: '2px 5px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word'
        } as StyleMap
      };
    },
    template: `
      <VueListBox
        v-model="selected"
        aria-label="test listbox"
        collection-class="v7C2Sq_menu"
        item-base-class="v7C2Sq_item"
        item-class="v7C2Sq_item"
        layout="grid"
        :items="listBoxSmoothScrollItems"
        :item-style="itemStyle"
        :style="listStyle" />
    `
  })
};

export const DropOntoRoot: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let sourceSelected = ref<string[]>([]);
      let targetSelected = ref<string[]>([]);
      return {
        sourceSelected,
        targetItems: ref<typeof dropOntoRootAlbums>([]),
        targetSelected,
        sourceListStyle: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          outline: 'none',
          overflow: 'auto',
          padding: '4px',
          width: 'fit-content'
        } as StyleMap,
        targetListStyle: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          outline: 'none',
          overflow: 'auto',
          padding: '4px',
          width: 'fit-content'
        } as StyleMap,
        albumItemStyle: {
          borderRadius: '6px',
          cursor: 'default',
          display: 'flex',
          flexDirection: 'column',
          margin: '0px',
          outline: 'none',
          padding: '4px',
          position: 'relative'
        } as StyleMap,
        dropOntoRootAlbums
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; width: 100%;">
        <VueListBox
          v-model="sourceSelected"
          aria-label="Albums"
          collection-class="react-aria-ListBox"
          item-base-class="react-aria-ListBoxItem"
          item-class="react-aria-ListBoxItem"
          selection-mode="multiple"
          :items="dropOntoRootAlbums"
          :item-style="albumItemStyle"
          :style="sourceListStyle">
          <template #default="{item, value}">
            <div draggable="true" data-allows-dragging="true">
              <img alt="" :src="item.image" style="object-fit: cover; width: 150px; height: 150px; margin-bottom: 4px; border-radius: 4px; transition: box-shadow 200ms;" />
              <span class="react-aria-Text" :id="'drop-onto-root-title-' + value" slot="label" style="font-weight: bold;">{{ item.title }}</span>
              <span class="react-aria-Text" :id="'drop-onto-root-artist-' + value" slot="description" style="font-size: small;">{{ item.artist }}</span>
            </div>
          </template>
        </VueListBox>
        <VueListBox
          v-model="targetSelected"
          aria-label="Albums"
          collection-class="react-aria-ListBox"
          item-base-class="react-aria-ListBoxItem"
          item-class="react-aria-ListBoxItem"
          selection-mode="multiple"
          :items="targetItems"
          :item-style="albumItemStyle"
          :style="targetListStyle">
          <template #empty>Drop items here</template>
        </VueListBox>
      </div>
    `
  })
};
