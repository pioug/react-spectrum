import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueComboBox, VueListBox, VuePicker, VuePopover, VueSearchField, VueTable} from '@vue-spectrum/components';
import {computed, ref} from 'vue';

type StoryArgs = Record<string, unknown>;

const baseItems = ['Foo', 'Bar', 'Baz', 'Google', 'Option', 'Option with a space'];

const meta = {
  title: 'React Aria Components/Autocomplete',
  component: VueComboBox,
  args: {
    selectionMode: 'multiple',
    escapeKeyBehavior: 'clearSelection',
    disableVirtualFocus: false
  },
  argTypes: {
    onAction: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    escapeKeyBehavior: {
      control: 'radio',
      options: ['clearSelection', 'none']
    }
  }
} satisfies Meta<typeof VueComboBox>;

export default meta;

type AutocompleteStory = StoryObj<typeof meta>;

interface AutocompleteRenderOptions {
  caseSensitive?: boolean,
  defaultValue?: string,
  disabledKeys?: string[],
  includeButtons?: boolean,
  includeListBox?: boolean,
  items?: string[],
  listHeight?: string,
  useSearchField?: boolean
}

function filterOptions(items: string[], value: string, caseSensitive: boolean): string[] {
  if (!value) {
    return items;
  }

  if (caseSensitive) {
    return items.filter((item) => item.includes(value));
  }

  let needle = value.toLowerCase();
  return items.filter((item) => item.toLowerCase().includes(needle));
}

function createAutocompleteStory(args: StoryArgs = {}, options: AutocompleteRenderOptions = {}) {
  return {
    components: {
      VueComboBox,
      VueListBox,
      VueSearchField
    },
    setup() {
      let value = ref(options.defaultValue ?? '');
      let selected = ref('');
      let allItems = ref(options.items ?? baseItems);
      let disabledKeys = options.disabledKeys ?? [];

      let filtered = computed(() => filterOptions(allItems.value, value.value, Boolean(options.caseSensitive)));
      let listItems = computed(() => filtered.value.map((item) => (disabledKeys.includes(item) ? `${item} (disabled)` : item)));

      let onSelect = (item: string) => {
        let normalized = item.replace(/ \(disabled\)$/, '');
        if (disabledKeys.includes(normalized)) {
          action('onSelectionChange')(`${normalized} is disabled`);
          return;
        }
        selected.value = normalized;
        value.value = normalized;
        action('onAction')(normalized);
      };

      return {
        args,
        includeButtons: Boolean(options.includeButtons),
        includeListBox: options.includeListBox !== false,
        listHeight: options.listHeight ?? '180px',
        listItems,
        onSelect,
        selected,
        useSearchField: Boolean(options.useSearchField),
        value
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 420px;">
        <div v-if="includeButtons" style="display: flex; gap: 8px;">
          <button type="button">Back</button>
          <button type="button">Forward</button>
        </div>
        <VueSearchField
          v-if="useSearchField"
          v-model="value"
          label="Test"
          description="Please select an option below." />
        <VueComboBox
          v-else
          v-model="value"
          :options="listItems"
          label="Test"
          placeholder="Type to filter" />
        <VueListBox
          v-if="includeListBox"
          v-model="selected"
          :items="listItems"
          label="Suggestions"
          :style="{height: listHeight, overflow: 'auto'}"
          @select="onSelect" />
      </div>
    `
  };
}

export const AutocompleteExample: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args),
  name: 'Autocomplete complex static with textfield'
};

export const AutocompleteSearchfield: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {defaultValue: 'Ba', useSearchField: true}),
  name: 'Autocomplete complex static with searchfield',
  parameters: {
    description: {
      data: 'Searchfield variant parity fixture.'
    }
  }
};

export const AutocompleteMenuDynamic: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    items: [
      'Command Palette',
      'Open View',
      'Appearance / Move Primary Side Bar Right',
      'Appearance / Activity Bar Position / Default',
      'Appearance / Activity Bar Position / Top',
      'Editor Layout / Split up',
      'Editor Layout / Split down'
    ],
    useSearchField: true
  })
};

export const AutocompleteOnActionOnMenuItems: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    items: ['Copy', 'Cut', 'Paste', 'Undo', 'Redo']
  })
};

export const AutocompleteDisabledKeys: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    disabledKeys: ['Bar', 'Baz']
  })
};

function AsyncExample() {
  return {
    components: {
      VueComboBox,
      VueListBox
    },
    setup() {
      let value = ref('');
      let selected = ref('');
      let loading = ref(true);
      let items = ref<string[]>([]);

      setTimeout(() => {
        items.value = ['Anakin Skywalker', 'Leia Organa', 'Luke Skywalker', 'Han Solo', 'Chewbacca'];
        loading.value = false;
      }, 300);

      let filtered = computed(() => filterOptions(items.value, value.value, false));

      let onSelect = (item: string) => {
        selected.value = item;
        value.value = item;
        action('onAction')(item);
      };

      return {
        filtered,
        loading,
        onSelect,
        selected,
        value
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 420px;">
        <VueComboBox
          v-model="value"
          :options="filtered"
          label="Test"
          placeholder="Type to filter" />
        <p v-if="loading" style="margin: 0;">Loading async options...</p>
        <VueListBox
          v-else
          v-model="selected"
          :items="filtered"
          label="Async list"
          style="height: 180px; overflow: auto;"
          @select="onSelect" />
      </div>
    `
  };
}

export const AutocompleteAsyncLoadingExample: AutocompleteStory = {
  render: () => AsyncExample()
};

export const AutocompleteCaseSensitive: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    caseSensitive: true
  })
};

export const AutocompleteWithListbox: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    items: ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Margaret Hamilton'],
    useSearchField: true
  })
};

export const AutocompleteWithVirtualizedListbox: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    items: Array.from({length: 400}, (_, index) => `Virtualized option ${index + 1}`),
    listHeight: '260px'
  })
};

export const AutocompleteInPopover: AutocompleteStory = {
  render: () => ({
    components: {
      VueComboBox,
      VueListBox,
      VuePopover
    },
    setup() {
      let open = ref(false);
      let value = ref('');
      let selected = ref('');
      let filtered = computed(() => filterOptions(baseItems, value.value, false));
      let onSelect = (item: string) => {
        selected.value = item;
        value.value = item;
        action('onAction')(item);
      };

      return {
        filtered,
        onSelect,
        open,
        selected,
        value
      };
    },
    template: `
      <div>
        <button type="button" @click="open = !open">Open popover</button>
        <VuePopover :open="open" placement="bottom" @close="open = false">
          <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 12px; width: 320px;">
            <VueComboBox v-model="value" :options="filtered" label="Test" />
            <VueListBox
              v-model="selected"
              :items="filtered"
              label="Suggestions"
              style="height: 160px; overflow: auto;"
              @select="onSelect" />
          </div>
        </VuePopover>
      </div>
    `
  })
};

export const AutocompleteInPopoverDialogTrigger: AutocompleteStory = {
  render: () => ({
    components: {
      VueComboBox,
      VueListBox,
      VuePopover
    },
    setup() {
      let open = ref(false);
      let value = ref('');
      let selected = ref('');
      let filtered = computed(() => filterOptions(baseItems, value.value, false));
      let onSelect = (item: string) => {
        selected.value = item;
        value.value = item;
      };

      return {
        filtered,
        onSelect,
        open,
        selected,
        value
      };
    },
    template: `
      <div>
        <button type="button" @click="open = !open">Open dialog trigger</button>
        <VuePopover :open="open" placement="bottom" @close="open = false">
          <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 12px; width: 320px;">
            <h4 style="margin: 0 0 8px 0;">Popover dialog trigger</h4>
            <VueComboBox v-model="value" :options="filtered" label="Test" />
            <VueListBox
              v-model="selected"
              :items="filtered"
              label="Suggestions"
              style="height: 160px; overflow: auto;"
              @select="onSelect" />
          </div>
        </VuePopover>
      </div>
    `
  })
};

export const AutocompleteMenuInPopoverDialogTrigger: AutocompleteStory = {
  render: () => createAutocompleteStory({}, {
    includeButtons: true,
    items: ['Menu Foo', 'Menu Bar', 'Menu Baz', 'Menu Google']
  })
};

export const AutocompleteSelect = () => ({
  components: {
    VuePicker
  },
  setup() {
    let value = ref('');
    return {
      value
    };
  },
  template: `
    <VuePicker
      v-model="value"
      label="Select"
      :items="[
        {id: 'foo', label: 'Foo'},
        {id: 'bar', label: 'Bar'},
        {id: 'baz', label: 'Baz'},
        {id: 'google', label: 'Google'}
      ]" />
  `
});

export const AutocompleteWithAsyncListBox = () => AsyncExample();

export const AutocompleteWithGridList = () => ({
  setup() {
    let value = ref('');
    let items = ref(baseItems);
    let filtered = computed(() => filterOptions(items.value, value.value, false));
    return {
      filtered,
      value
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 420px;">
      <input v-model="value" type="text" placeholder="Type to filter">
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
        <button v-for="item in filtered" :key="item" type="button">{{ item }}</button>
      </div>
    </div>
  `
});

export const AutocompleteWithTable = () => ({
  components: {
    VueTable
  },
  setup() {
    let value = ref('');
    let rows = ref([
      {id: 1, name: 'Ada Lovelace', team: 'Analytics'},
      {id: 2, name: 'Grace Hopper', team: 'Compiler'},
      {id: 3, name: 'Alan Turing', team: 'Cryptography'},
      {id: 4, name: 'Katherine Johnson', team: 'Navigation'}
    ]);
    let filteredRows = computed(() => rows.value.filter((row) => row.name.toLowerCase().includes(value.value.toLowerCase())));

    return {
      filteredRows,
      value
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 460px;">
      <input v-model="value" type="text" placeholder="Type to filter">
      <VueTable
        :columns="[
          {key: 'name', label: 'Name'},
          {key: 'team', label: 'Team'}
        ]"
        :rows="filteredRows"
        caption="Autocomplete with table" />
    </div>
  `
});

export const AutocompleteWithTagGroup = () => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    let tags = ref<string[]>([]);

    let addTag = () => {
      if (!value.value.trim()) {
        return;
      }
      if (!tags.value.includes(value.value.trim())) {
        tags.value = [...tags.value, value.value.trim()];
      }
      value.value = '';
    };

    return {
      addTag,
      tags,
      value
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 420px;">
      <VueComboBox
        v-model="value"
        :options="['Engineering', 'Design', 'Product', 'Research']"
        label="Tags" />
      <button type="button" @click="addTag">Add tag</button>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        <span
          v-for="tag in tags"
          :key="tag"
          style="padding: 2px 8px; border: 1px solid #d9d9d9; border-radius: 999px;">
          {{ tag }}
        </span>
      </div>
    </div>
  `
});

export const AutocompletePreserveFirstSectionStory: AutocompleteStory = {
  render: (args) => createAutocompleteStory(args, {
    items: ['First section / Always visible', 'Second section / Foo', 'Second section / Bar', 'Second section / Baz'],
    useSearchField: true
  })
};

export const AutocompleteUserCustomFiltering: AutocompleteStory = {
  render: () => ({
    components: {
      VueComboBox,
      VueListBox
    },
    setup() {
      let value = ref('');
      let selected = ref('');
      let names = ['@john', '@jane', '@jen', '@jack', '@jules'];
      let filtered = computed(() => {
        let atIndex = value.value.lastIndexOf('@');
        if (atIndex < 0) {
          return names;
        }
        let query = value.value.slice(atIndex).toLowerCase();
        return names.filter((name) => name.startsWith(query));
      });

      let onSelect = (item: string) => {
        selected.value = item;
        value.value = item;
      };

      return {
        filtered,
        onSelect,
        selected,
        value
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 420px;">
        <VueComboBox
          v-model="value"
          :options="filtered"
          label="Mentions"
          placeholder="Type @ to filter mentions" />
        <VueListBox
          v-model="selected"
          :items="filtered"
          label="Mentions"
          style="height: 180px; overflow: auto;"
          @select="onSelect" />
      </div>
    `
  }),
  name: 'Autocomplete, user custom filterText (mentions)',
  parameters: {
    description: {
      data: 'Only filters when typing @, using text after @ as filter.'
    }
  }
};

export function AutocompleteWithExtraButtons() {
  return createAutocompleteStory({}, {
    includeButtons: true
  });
}
