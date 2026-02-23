import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueListBox} from '@vue-spectrum/components';
import {ref} from 'vue';
import '../../../react-aria-components/stories/styles.css';

const basicItems = ['Foo', 'Bar', 'Baz', 'Google'];
const sectionItems = [
  'Section 1: Foo',
  'Section 1: Bar',
  'Section 1: Baz',
  'Section 2: Foo',
  'Section 2: Bar',
  'Section 2: Baz'
];
const complexItems = [
  'Item 1 - Description',
  'Item 2 - Description',
  'Item 3 - Description'
];
const albumItems = [
  'Euphoric Echoes - Luna Solstice',
  'Neon Dreamscape - Electra Skyline',
  "Cosmic Serenade - Orion's Symphony",
  'Melancholy Melodies - Violet Mistral',
  'Rhythmic Illusions - Mirage Beats'
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

const meta = {
  title: 'React Aria Components/ListBox',
  component: VueListBox
} satisfies Meta<typeof VueListBox>;

export default meta;

type ListBoxStory = StoryFn<typeof VueListBox>;
type Story = StoryObj<typeof meta>;
type ListBoxStoryArgs = Record<string, unknown>;
type StyleMap = Record<string, string | number>;

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
        <button type="button" style="margin-top: 8px;" :disabled="loading" @click="loadMore">
          {{ loading ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    `
  };
}

export const ListBoxExample: ListBoxStory = (args) => createListBoxStory(args, {
  items: basicItems,
  label: 'test listbox'
});

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

export const ListBoxSections: ListBoxStory = () => createListBoxStory({}, {
  items: sectionItems,
  label: 'test listbox with section'
});

export const ListBoxComplex: ListBoxStory = () => createListBoxStory({}, {
  items: complexItems,
  label: 'listbox complex'
});

export const ListBoxDnd: ListBoxStory = (args) => createListBoxStory(args, {
  items: albumItems,
  label: 'Albums'
});

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
  render: (args) => createListBoxStory(args, {
    items: albumItems,
    label: 'Albums with preview offset'
  }),
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

export const ListBoxHover: ListBoxStory = () => createListBoxStory({}, {
  actionName: 'onHoverChange',
  items: ['Hover', 'Bar', 'Baz', 'Google'],
  label: 'test listbox'
});

export const ListBoxGrid: ListBoxStory = (args) => createListBoxStory(args, {
  containerStyle: {
    width: '300px'
  },
  items: gridItems,
  label: 'test listbox',
  listStyle: {
    display: 'grid',
    gap: '4px',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
  }
});

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
  render: (args) => createListBoxStory(args, {
    containerStyle: {
      height: '420px',
      overflow: 'auto'
    },
    items: makeItems(1000, 'Section item'),
    label: 'virtualized listbox',
    listStyle: {
      height: '400px',
      overflow: 'auto'
    }
  }),
  args: {
    variableHeight: false,
    isLoading: false
  }
};

export const VirtualizedListBoxEmpty: ListBoxStory = () => createListBoxStory({}, {
  items: [],
  label: 'virtualized listbox',
  showSelection: false
});

export const VirtualizedListBoxDnd: ListBoxStory = () => createListBoxStory({}, {
  containerStyle: {
    height: '420px',
    overflow: 'auto',
    width: '400px'
  },
  items: makeItems(1000),
  label: 'virtualized listbox'
});

export const VirtualizedListBoxGrid: Story = {
  render: (args) => createListBoxStory(args, {
    containerStyle: {
      height: '420px',
      overflow: 'auto',
      width: '420px'
    },
    items: makeItems(500, 'Grid item'),
    label: 'virtualized listbox',
    listStyle: {
      display: 'grid',
      gap: '8px',
      gridTemplateColumns: 'repeat(4, minmax(80px, 1fr))',
      height: '400px',
      overflow: 'auto'
    }
  }),
  args: {
    minSize: 80,
    maxSize: 100,
    preserveAspectRatio: false
  }
};

export const VirtualizedListBoxWaterfall: Story = {
  render: (args) => createListBoxStory(args, {
    containerStyle: {
      height: '420px',
      overflow: 'auto',
      width: '420px'
    },
    items: makeItems(1000, 'Waterfall item'),
    label: 'virtualized listbox waterfall',
    listStyle: {
      columns: 4,
      height: '400px',
      overflow: 'auto'
    }
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

export const ListBoxScrollMargin: ListBoxStory = (args) => createListBoxStory(args, {
  items: makeItems(100),
  label: 'test listbox',
  listStyle: {
    height: '200px',
    overflow: 'scroll',
    width: '200px'
  }
});

export const ListBoxSmoothScroll: ListBoxStory = (args) => createListBoxStory(args, {
  items: makeItems(100),
  label: 'test listbox',
  listStyle: {
    display: 'grid',
    gap: '4px',
    gridTemplateColumns: 'repeat(4, 1fr)',
    height: '200px',
    overflow: 'scroll',
    scrollBehavior: 'smooth',
    width: '260px'
  }
});

export const VirtualizedListBoxDndOnAction: ListBoxStory = () => createListBoxStory({}, {
  actionName: 'onAction',
  containerStyle: {
    height: '420px',
    overflow: 'auto',
    width: '320px'
  },
  items: makeItems(100),
  label: 'Virtualized listbox with drag and drop and onAction'
});

export const DropOntoRoot: Story = {
  render: () => ({
    components: {
      VueListBox
    },
    setup() {
      let leftItems = ref([...albumItems]);
      let rightItems = ref<string[]>([]);
      let leftSelected = ref('');
      let rightSelected = ref('');
      let onLeftSelect = action('onLeftSelect');
      let onRightSelect = action('onRightSelect');

      let moveToRight = () => {
        if (!leftSelected.value) {
          return;
        }

        rightItems.value = [...rightItems.value, leftSelected.value];
        leftItems.value = leftItems.value.filter((item) => item !== leftSelected.value);
        leftSelected.value = '';
      };

      let moveToLeft = () => {
        if (!rightSelected.value) {
          return;
        }

        leftItems.value = [...leftItems.value, rightSelected.value];
        rightItems.value = rightItems.value.filter((item) => item !== rightSelected.value);
        rightSelected.value = '';
      };

      return {
        leftItems,
        leftSelected,
        moveToLeft,
        moveToRight,
        onLeftSelect,
        onRightSelect,
        rightItems,
        rightSelected
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; width: 100%;">
        <VueListBox
          v-model="leftSelected"
          :items="leftItems"
          label="Albums"
          @select="onLeftSelect" />
        <div style="display: flex; flex-direction: column; gap: 8px; justify-content: center;">
          <button type="button" @click="moveToRight">Move right</button>
          <button type="button" @click="moveToLeft">Move left</button>
        </div>
        <VueListBox
          v-model="rightSelected"
          :items="rightItems"
          label="Drop items here"
          @select="onRightSelect" />
      </div>
    `
  })
};
