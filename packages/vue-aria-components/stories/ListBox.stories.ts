import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueListBox} from 'vue-aria-components';
import {ref} from 'vue';
import '../../react-aria-components/stories/styles.css';

const basicItems = ['Foo', 'Bar', 'Baz', 'Google'];
const sectionItems = [
  'Section 1: Foo',
  'Section 1: Bar',
  'Section 1: Baz',
  'Section 2: Foo',
  'Section 2: Bar',
  'Section 2: Baz'
];
const albumItems = [
  'Euphoric Echoes - Luna Solstice',
  'Neon Dreamscape - Electra Skyline',
  "Cosmic Serenade - Orion's Symphony",
  'Melancholy Melodies - Violet Mistral',
  'Rhythmic Illusions - Mirage Beats'
];
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
const asyncListBoxItems = [
  'Luke Skywalker',
  'C-3PO',
  'R2-D2',
  'Darth Vader',
  'Leia Organa',
  'Owen Lars',
  'Beru Whitesun lars',
  'R5-D4'
];
const asyncListBoxVirtualizedVisibleItems = [
  'Luke Skywalker',
  'C-3PO',
  'R2-D2',
  'Darth Vader',
  'Leia Organa',
  'Owen Lars',
  'Beru Whitesun lars',
  'R5-D4',
  'Biggs Darklighter',
  'Obi-Wan Kenobi',
  'Anakin Skywalker'
];
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

export function MyListBoxLoaderIndicator(props: {isLoading?: boolean, orientation?: 'horizontal' | 'vertical'} = {}) {
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
}

interface ListBoxStoryOptions {
  actionName?: string,
  containerStyle?: StyleMap,
  initialValue?: string,
  items: string[],
  label: string,
  listStyle?: StyleMap,
  showSelection?: boolean
}

function makeItems(count: number, prefix = 'Item'): string[] {
  return Array.from({length: count}, (_, index) => `${prefix} ${index + 1}`);
}

function createListBoxStory(args: ListBoxStoryArgs = {}, options: ListBoxStoryOptions) {
  return {
    components: {
      VueListBox
    },
    setup() {
      let selected = ref(options.initialValue ?? '');
      return {
        args,
        containerStyle: options.containerStyle ?? {},
        items: options.items,
        label: options.label,
        listStyle: options.listStyle ?? {},
        onSelect: action(options.actionName ?? 'onAction'),
        selected,
        showSelection: options.showSelection ?? true
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
        <p v-if="showSelection" style="margin-top: 8px;">Selected: {{ selected || 'none' }}</p>
      </div>
    `
  };
}

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

function createAlbumCardListBoxStory(label: string) {
  return {
    setup() {
      return {
        dropOntoRootAlbums
      };
    },
    template: `
      <div
        class="react-aria-ListBox"
        data-rac=""
        aria-label="${label}"
        aria-multiselectable="true"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="horizontal"
        style="display: flex; flex-direction: row; width: fit-content; max-width: 100%; padding: 4px; overflow: auto; outline: none;">
        <div
          v-for="(album, index) in dropOntoRootAlbums"
          :key="album.title"
          class="react-aria-ListBoxItem"
          data-rac=""
          role="option"
          aria-selected="false"
          tabindex="-1"
          draggable="true"
          data-allows-dragging="true"
          data-selection-mode="multiple"
          style="position: relative; margin: 0px; padding: 4px; border-radius: 6px; outline: none; cursor: default; display: flex; flex-direction: column;">
          <img alt="" :src="album.image" style="object-fit: cover; width: 150px; height: 150px; margin-bottom: 4px; border-radius: 4px; transition: box-shadow 200ms;" />
          <span class="react-aria-Text" :id="'list-box-album-title-' + index" slot="label" style="font-weight: bold;">{{ album.title }}</span>
          <span class="react-aria-Text" :id="'list-box-album-artist-' + index" slot="description" style="font-size: small;">{{ album.artist }}</span>
        </div>
      </div>
    `
  };
}

export const ListBoxExample: Story = {
  render: () => ({
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="test listbox"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="vertical"
        style="margin-top: 4px; width: 150px; max-width: 100%; border: 1px solid gray; background: lightgray;">
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">Foo</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">Bar</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">Baz</div>
        <a class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" href="http://google.com" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Google</a>
      </div>
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
    data: 'Hover and focus styling parity fixture mirrored from the React story.'
  }
};

export const ListBoxSections: Story = {
  render: () => ({
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="test listbox with section"
        aria-multiselectable="true"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="vertical"
        style="margin-top: 4px; width: 150px; max-width: 100%; border: 1px solid gray; background: lightgray;">
        <section class="v7C2Sq_group" data-rac="" role="group">
          <header class="react-aria-Header" role="presentation" style="font-size: 1.2em;">Section 1</header>
          <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Foo</div>
          <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Bar</div>
          <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Baz</div>
        </section>
        <div role="separator" class="react-aria-Separator" style="border-top: 1px solid gray; margin: 2px 5px;"></div>
        <section class="v7C2Sq_group" data-rac="" role="group" aria-label="Section 2">
          <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Foo</div>
          <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Bar</div>
          <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Baz</div>
        </section>
      </div>
    `
  })
};

export const ListBoxComplex: Story = {
  render: () => ({
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="listbox complex"
        aria-multiselectable="true"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="vertical"
        style="margin-top: 4px; width: 150px; max-width: 100%; border: 1px solid gray; background: lightgray;">
        <div
          class="v7C2Sq_item"
          data-rac=""
          role="option"
          aria-selected="false"
          tabindex="-1"
          data-selection-mode="multiple"
          style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">
          <span class="react-aria-Text" slot="label">Item 1</span>
          <span class="react-aria-Text" slot="description" style="font-size: 13px;">Description</span>
        </div>
        <div
          class="v7C2Sq_item"
          data-rac=""
          role="option"
          aria-selected="false"
          tabindex="-1"
          data-selection-mode="multiple"
          style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">
          <span class="react-aria-Text" slot="label">Item 2</span>
          <span class="react-aria-Text" slot="description" style="font-size: 13px;">Description</span>
        </div>
        <div
          class="v7C2Sq_item"
          data-rac=""
          role="option"
          aria-selected="false"
          tabindex="-1"
          data-selection-mode="multiple"
          style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">
          <span class="react-aria-Text" slot="label">Item 3</span>
          <span class="react-aria-Text" slot="description" style="font-size: 13px;">Description</span>
        </div>
      </div>
    `
  })
};

export const ListBoxDnd: Story = {
  render: () => createAlbumCardListBoxStory('Albums')
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
  render: () => createAlbumCardListBoxStory('Albums with preview offset'),
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
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="test listbox"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="vertical"
        style="margin-top: 4px; width: 150px; max-width: 100%; border: 1px solid gray; background: lightgray;">
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">Hover</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">Bar</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">Baz</div>
        <a class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" href="http://google.com" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">Google</a>
      </div>
    `
  })
};

export const ListBoxGrid: Story = {
  render: () => ({
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="test listbox"
        role="listbox"
        tabindex="0"
        data-layout="grid"
        data-orientation="vertical"
        style="margin-top: 4px; width: 300px; height: 300px; border: 1px solid gray; background: lightgray; display: grid; grid-template: repeat(3, 1fr) / repeat(3, 1fr); grid-auto-flow: row;">
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">1,1</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">1,2</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">1,3</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">2,1</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">2,2</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">2,3</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">3,1</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">3,2</div>
        <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: flex; align-items: center; justify-content: center; padding: 2px 5px; color: #000;">3,3</div>
      </div>
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
      return {
        virtualizedListBoxVisibleItems
      };
    },
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="virtualized listbox"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="vertical"
        style="margin-top: 4px; width: 150px; max-width: 100%; height: 400px; border: 1px solid gray; background: lightgray; overflow: auto;">
        <div role="presentation" style="width: 150px; height: 25259px; pointer-events: auto; position: relative;">
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0px; left: 0px; width: 150px; height: 2525px;">
            <section class="v7C2Sq_group" data-rac="" role="group">
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0px; left: 0px; width: 150px; height: 25px;">
                <header class="react-aria-Header" role="presentation" style="font-size: 1.2em;">Section 0</header>
              </div>
              <div
                v-for="(item, index) in virtualizedListBoxVisibleItems"
                :key="item"
                role="presentation"
                :style="{position: 'absolute', overflow: 'visible', opacity: '1', zIndex: '0', contain: 'size layout style', top: (25 + (index * 25)) + 'px', left: '0px', width: '150px', height: '25px'}">
                <div class="v7C2Sq_item" data-rac="" role="option" tabindex="-1" style="word-break: break-word; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">{{ item }}</div>
              </div>
            </section>
          </div>
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 25259px; left: 0px; width: 150px; height: 0px;">
            <div inert="" style="position: relative; width: 0px; height: 0px;">
              <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    variableHeight: false,
    isLoading: false
  }
};


export const VirtualizedListBoxGrid: Story = {
  render: () => ({
    setup() {
      return {
        virtualizedListBoxGridVisibleItems
      };
    },
    template: `
      <div style="height: 400px; width: 400px; resize: both; padding: 40px; overflow: hidden;">
        <div
          class="v7C2Sq_menu"
          data-rac=""
          aria-label="virtualized listbox"
          aria-multiselectable="true"
          role="listbox"
          tabindex="0"
          data-layout="grid"
          data-orientation="vertical"
          style="margin-top: 4px; width: 100%; height: 100%; border: 1px solid gray; background: lightgray; overflow: auto;">
          <div role="presentation" style="width: 400px; height: 244382px; pointer-events: auto; position: relative;">
            <div
              v-for="(item, index) in virtualizedListBoxGridVisibleItems"
              :key="item"
              role="presentation"
              :style="{position: 'absolute', overflow: 'visible', opacity: '1', zIndex: '0', contain: 'size layout style', top: (18 + (Math.floor(index / 4) * 45)) + 'px', left: (15 + ((index % 4) * 96)) + 'px', width: '82px', height: '27px'}">
              <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" draggable="true" data-allows-dragging="true" data-selection-mode="multiple" style="word-break: break-word; height: 100%; border: 1px solid; box-sizing: border-box; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">{{ item }}</div>
            </div>
          </div>
        </div>
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
      return {
        virtualizedListBoxWaterfallVisibleItems
      };
    },
    template: `
      <div style="height: 400px; width: 400px; resize: both; padding: 40px; overflow: hidden;">
        <div
          class="v7C2Sq_menu"
          data-rac=""
          aria-label="virtualized listbox"
          aria-multiselectable="true"
          role="listbox"
          tabindex="0"
          data-layout="grid"
          data-orientation="vertical"
          style="margin-top: 4px; width: 100%; height: 100%; border: 1px solid gray; background: lightgray; overflow: auto;">
          <div role="presentation" style="width: 400px; height: 5662px; pointer-events: auto; position: relative;">
            <div
              v-for="(item, index) in virtualizedListBoxWaterfallVisibleItems"
              :key="'waterfall-' + index"
              role="presentation"
              :style="{position: 'absolute', overflow: 'visible', opacity: '1', zIndex: '0', contain: 'size layout style', top: (18 + (Math.floor(index / 10) * 45)) + 'px', left: ((index % 10) * 40) + 'px', width: '40px', height: '27px'}">
              <div class="v7C2Sq_item" data-rac="" role="option" aria-selected="false" tabindex="-1" data-selection-mode="multiple" style="word-break: break-word; height: 100%; border: 1px solid; box-sizing: border-box; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">{{ item }}</div>
            </div>
          </div>
        </div>
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
  render: () => ({
    setup() {
      return {
        asyncListBoxItems
      };
    },
    template: `
      <div
        class="react-aria-ListBox"
        data-rac=""
        aria-label="async listbox"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="horizontal"
        style="height: fit-content; width: 404px; max-width: 100%; overflow: hidden; display: flex; flex-direction: row; padding: 4px 0 4px 4px; outline: none;">
        <div
          v-for="item in asyncListBoxItems"
          :key="item"
          class="v7C2Sq_item"
          data-rac=""
          role="option"
          tabindex="-1"
          style="word-break: break-word; min-height: 100px; min-width: 50px; background-color: lightgrey; border: 1px solid black; box-sizing: border-box; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">{{ item }}</div>
        <div aria-hidden="true" style="min-width: 4px; width: 4px; background: rgb(248, 248, 248);"></div>
        <div inert="" style="position: relative; width: 0px; height: 0px;">
          <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
        </div>
      </div>
    `
  }),
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

export const AsyncListBoxVirtualized: ListBoxStory = () => ({
  setup() {
    return {
      asyncListBoxVirtualizedVisibleItems
    };
  },
  template: `
    <div
      class="react-aria-ListBox"
      data-rac=""
      aria-label="async virtualized listbox"
      role="listbox"
      tabindex="0"
      data-layout="stack"
      data-orientation="vertical"
      style="height: 400px; width: 100px; max-width: 100%; border: 1px solid gray; background: lightgray; overflow: auto; padding: unset; display: flex; flex-direction: column;">
      <div role="presentation" style="width: 100px; height: 1008px; pointer-events: auto; position: relative;">
        <div
          v-for="(item, index) in asyncListBoxVirtualizedVisibleItems"
          :key="item"
          role="presentation"
          :style="{position: 'absolute', overflow: 'visible', opacity: '1', zIndex: '0', contain: 'size layout style', top: (4 + (index * 50)) + 'px', left: '4px', width: '92px', height: '50px'}">
          <div
            class="v7C2Sq_item"
            data-rac=""
            role="option"
            tabindex="-1"
            style="word-break: break-word; background-color: lightgrey; border: 1px solid black; box-sizing: border-box; height: 100%; width: 100%; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; cursor: default; text-overflow: ellipsis;">{{ item }}</div>
        </div>
        <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 1004px; left: 4px; height: 0px; width: 92px;">
          <div inert="" style="position: relative; width: 0px; height: 0px;">
            <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

AsyncListBoxVirtualized.args = {
  delay: 50
};

export const ListBoxScrollMargin: Story = {
  render: () => ({
    setup() {
      return {
        listBoxScrollMarginItems
      };
    },
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="test listbox"
        role="listbox"
        tabindex="0"
        data-layout="stack"
        data-orientation="vertical"
        style="margin-top: 4px; width: 150px; min-width: 150px; max-width: 100%; height: 200px; border: 1px solid gray; background: lightgray; overflow: scroll;">
        <div
          v-for="item in listBoxScrollMarginItems"
          :key="item.id"
          class="v7C2Sq_item"
          data-rac=""
          role="option"
          tabindex="-1"
          style="word-break: break-word; scroll-margin: 10px; width: 150px; display: flex; padding: 2px 20px; justify-content: space-between; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">
          <span>{{ item.name }}</span>
          <span>{{ item.description }}</span>
        </div>
      </div>
    `
  })
};

export const ListBoxSmoothScroll: Story = {
  render: () => ({
    setup() {
      return {
        listBoxSmoothScrollItems
      };
    },
    template: `
      <div
        class="v7C2Sq_menu"
        data-rac=""
        aria-label="test listbox"
        role="listbox"
        tabindex="0"
        data-layout="grid"
        data-orientation="vertical"
        style="margin-top: 4px; width: 200px; min-width: 150px; max-width: 100%; height: 200px; border: 1px solid gray; background: lightgray; overflow: scroll; display: grid; grid-template-columns: repeat(4, 80px); scroll-behavior: smooth;">
        <div
          v-for="item in listBoxSmoothScrollItems"
          :key="item"
          class="v7C2Sq_item"
          data-rac=""
          role="option"
          tabindex="-1"
          style="word-break: break-word; min-height: 32px; display: grid; padding: 2px 5px; overflow: hidden; white-space: nowrap; color: #000; text-overflow: ellipsis;">{{ item }}</div>
      </div>
    `
  })
};

export const DropOntoRoot: Story = {
  render: () => ({
    setup() {
      return {
        dropOntoRootAlbums
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; width: 100%;">
        <div
          class="react-aria-ListBox"
          data-rac=""
          aria-label="Albums"
          aria-multiselectable="true"
          role="listbox"
          tabindex="0"
          data-layout="stack"
          data-orientation="vertical"
          style="display: flex; flex-direction: column; width: fit-content; max-width: 100%; padding: 4px; overflow: auto; outline: none;">
          <div
            v-for="(album, index) in dropOntoRootAlbums"
            :key="album.title"
            class="react-aria-ListBoxItem"
            data-rac=""
            role="option"
            aria-selected="false"
            tabindex="-1"
            draggable="true"
            data-allows-dragging="true"
            data-selection-mode="multiple"
            style="position: relative; margin: 0px; padding: 4px; border-radius: 6px; outline: none; cursor: default; display: flex; flex-direction: column;">
            <img alt="" :src="album.image" style="object-fit: cover; width: 150px; height: 150px; margin-bottom: 4px; border-radius: 4px; transition: box-shadow 200ms;" />
            <span class="react-aria-Text" :id="'drop-onto-root-title-' + index" slot="label" style="font-weight: bold;">{{ album.title }}</span>
            <span class="react-aria-Text" :id="'drop-onto-root-artist-' + index" slot="description" style="font-size: small;">{{ album.artist }}</span>
          </div>
          <div inert="" style="position: relative; width: 0px; height: 0px;">
            <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
          </div>
        </div>
        <div
          class="react-aria-ListBox"
          data-rac=""
          aria-label="Albums"
          aria-multiselectable="true"
          role="listbox"
          tabindex="0"
          data-empty="true"
          data-layout="stack"
          data-orientation="vertical"
          style="display: flex; flex-direction: column; width: fit-content; max-width: 100%; padding: 4px; overflow: auto; outline: none;">
          <div inert="" style="position: relative; width: 0px; height: 0px;">
            <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
          </div>
          <div role="option" style="display: contents;">Drop items here</div>
        </div>
      </div>
    `
  })
};
