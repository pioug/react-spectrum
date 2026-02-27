import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TagGroup} from '@vue-spectrum/tag';
import {VueListBox, VueSearchField, VueTextField} from 'vue-aria-components';
import {computed, ref, watch} from 'vue';

type StoryArgs = Record<string, unknown>;

const meta = {
  title: 'React Aria Components/Autocomplete',
  component: VueListBox,
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
} satisfies Meta<typeof VueListBox>;

export default meta;

type AutocompleteStory = StoryObj<typeof meta>;

function createAutocompleteFieldTemplate({
  idPrefix,
  includeDescription = true,
  useSearchField = false,
  useTextarea = false
}: {
  idPrefix: string,
  includeDescription?: boolean,
  useSearchField?: boolean,
  useTextarea?: boolean
}) {
  let description = includeDescription ? 'Please select an option below.' : '';
  if (useSearchField) {
    return `
      <VueSearchField
        v-model="value"
        label="Test"
        description="${description}" />
    `;
  }

  if (!useTextarea) {
    return `
      <VueTextField
        id="${idPrefix}-input"
        v-model="value"
        label="Test"
        description="${description}"
        type="text" />
    `;
  }

  return `
    <div class="react-aria-TextField" data-rac="">
      <label id="${idPrefix}-label" class="react-aria-Label" for="${idPrefix}-input" style="display: block;">Test</label>
      <textarea
        id="${idPrefix}-input"
        class="react-aria-Input"
        aria-labelledby="${idPrefix}-label"
        ${includeDescription ? `aria-describedby="${idPrefix}-description"` : ''}
        aria-autocomplete="list"
        aria-controls="${idPrefix}-listbox"
        data-rac=""
        style="resize: both;"
        v-model="value"></textarea>
      ${includeDescription ? `<span id="${idPrefix}-description" class="react-aria-Text" slot="description" style="display: block;">Please select an option below.</span>` : ''}
    </div>
  `;
}

function createAutocompletePopoverShellStory(
  args: StoryArgs = {},
  options: {
    defaultValue?: string,
    idPrefix: string,
    listItems: string[],
    listStyle?: Record<string, string>,
    selectionMode?: 'none' | 'single' | 'multiple'
  }
) {
  return {
    components: {
      VueListBox,
      VueSearchField,
      VueTextField
    },
    setup() {
      let storyArgs = args as {
        escapeKeyBehavior?: 'clearSelection' | 'none',
        selectionMode?: 'none' | 'single' | 'multiple'
      } & StoryArgs;
      let selected = ref<string[]>([]);
      let value = ref(options.defaultValue ?? '');
      let listArgs = computed(() => ({
        selectionMode: storyArgs.selectionMode ?? options.selectionMode ?? 'single',
        escapeKeyBehavior: storyArgs.escapeKeyBehavior
      }));
      let listStyle = options.listStyle ?? {
        height: '170px',
        overflow: 'auto'
      };
      let onSelect = (item: string) => {
        selected.value = [item];
        value.value = item;
        action('onAction')(item);
      };

      return {
        listArgs,
        listItems: options.listItems,
        listStyle,
        onSelect,
        selected,
        value
      };
    },
    template: `
      <div>
        <button type="button">Open popover</button>
        <div
          class="react-aria-Popover"
          data-rac=""
          style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 20px; height: 250px; width: 320px;">
          ${createAutocompleteFieldTemplate({
            idPrefix: options.idPrefix,
            includeDescription: true,
            useSearchField: true
          })}
          <VueListBox
            v-bind="listArgs"
            class="menu"
            v-model="selected"
            id="${options.idPrefix}-listbox"
            aria-label="Suggestions"
            collection-class="react-aria-ListBox"
            data-orientation="vertical"
            item-class="item"
            :item-style="{wordBreak: 'break-word'}"
            :items="listItems"
            :style="listStyle"
            @select="onSelect" />
        </div>
      </div>
    `
  };
}

function createAutocompleteListShellStory(
  args: StoryArgs = {},
  options: {
    idPrefix: string,
    items?: Array<Record<string, unknown> | string>,
    sections?: Array<{
      items: Array<Record<string, unknown> | string>,
      title?: string
    }>,
    selectionMode?: 'none' | 'single' | 'multiple',
    useSearchField?: boolean,
    useTextarea?: boolean
  }
) {
  return {
    components: {
      VueListBox,
      VueSearchField,
      VueTextField
    },
    setup() {
      let storyArgs = args as {
        escapeKeyBehavior?: 'clearSelection' | 'none',
        selectionMode?: 'none' | 'single' | 'multiple'
      } & StoryArgs;
      let selectionMode = storyArgs.selectionMode ?? options.selectionMode ?? 'multiple';
      let selected = ref<string | string[]>(selectionMode === 'single' ? '' : []);
      let value = ref('');
      let listArgs = computed(() => ({
        selectionMode,
        escapeKeyBehavior: storyArgs.escapeKeyBehavior
      }));

      return {
        items: options.items ?? [],
        listArgs,
        sections: options.sections ?? [],
        selected,
        value,
        onSelect(item: string) {
          value.value = item;
          action('onAction')(item);
        }
      };
    },
    template: `
      <div>
        ${createAutocompleteFieldTemplate({
          idPrefix: options.idPrefix,
          includeDescription: true,
          useSearchField: options.useSearchField ?? true,
          useTextarea: options.useTextarea ?? false
        })}
        <VueListBox
          v-bind="listArgs"
          class="menu"
          v-model="selected"
          id="${options.idPrefix}-listbox"
          aria-label="Suggestions"
          collection-class="menu"
          data-orientation="vertical"
          item-class="item"
          :item-style="{wordBreak: 'break-word'}"
          :items="items"
          :sections="sections"
          @select="onSelect" />
      </div>
    `
  };
}

function AsyncExample(args: StoryArgs = {}) {
  let asyncItems = ['Foo', 'Bar', 'Baz'];
  let toAsyncResults = (filterText: string): string[] => {
    if (!filterText) {
      return asyncItems;
    }

    return asyncItems.filter((item) => {
      let name = item.toLowerCase();
      for (let filterChar of filterText.toLowerCase()) {
        if (!name.includes(filterChar)) {
          return false;
        }
        name = name.replace(filterChar, '');
      }
      return true;
    });
  };

  return {
    components: {
      VueListBox,
      VueSearchField,
      VueTextField
    },
    setup() {
      let storyArgs = args as {includeLoadState?: boolean, selectionMode?: 'none' | 'single' | 'multiple'} & StoryArgs;
      let includeLoadState = storyArgs.includeLoadState !== false;
      let value = ref('');
      let selected = ref<string[]>([]);
      let loading = ref(false);
      let filtered = ref<string[]>([]);
      let loadId = 0;
      let listArgs = computed(() => {
        let selectionMode = storyArgs.selectionMode;
        return selectionMode ? {selectionMode} : {};
      });
      let listItems = computed(() => (includeLoadState && loading.value ? [] : filtered.value));

      let load = (filterText: string) => {
        let currentLoad = ++loadId;
        loading.value = true;

        setTimeout(() => {
          if (currentLoad !== loadId) {
            return;
          }
          filtered.value = toAsyncResults(filterText);
          loading.value = false;
        }, 300);
      };

      watch(value, (nextValue) => {
        load(nextValue);
      }, {immediate: true});

      let onSelect = (item: string) => {
        selected.value = [item];
        value.value = item;
        action('onAction')(item);
      };

      return {
        includeLoadState,
        listArgs,
        listItems,
        loading,
        onSelect,
        selected,
        value
      };
    },
    template: `
      <div>
        ${createAutocompleteFieldTemplate({idPrefix: 'autocomplete-async', includeDescription: true, useSearchField: true})}
        <VueListBox
          v-bind="listArgs"
          class="menu"
          v-model="selected"
          id="autocomplete-async-listbox"
          aria-label="Suggestions"
          collection-class="react-aria-ListBox"
          data-orientation="vertical"
          item-class="item"
          :item-style="{wordBreak: 'break-word'}"
          :is-loading="loading"
          :items="listItems"
          @select="onSelect">
          <template #empty="{isLoading}">
            {{ includeLoadState && isLoading ? 'Loading' : 'No results found.' }}
          </template>
        </VueListBox>
      </div>
    `
  };
}

export const AutocompleteExample: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-example',
    sections: [
      {
        title: 'Section 1',
        items: ['Foo', 'Bar', 'Baz', 'Google', 'With subdialog', 'Option', 'Option with a space']
      },
      {
        title: 'Section 2',
        items: [
          {label: 'Copy', description: 'Description'},
          {label: 'Cut', description: 'Description'},
          {label: 'Paste', description: 'Description'}
        ]
      }
    ],
    useSearchField: false
  }),
  name: 'Autocomplete complex static with textfield'
};

export const AutocompleteSearchfield: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-searchfield',
    sections: [
      {
        title: 'Section 1',
        items: ['Foo', 'Bar', 'Baz', 'Google', 'With subdialog', 'Option', 'Option with a space']
      },
      {
        title: 'Section 2',
        items: [
          {label: 'Copy', description: 'Description'},
          {label: 'Cut', description: 'Description'},
          {label: 'Paste', description: 'Description'}
        ]
      }
    ],
    useSearchField: true
  }),
  name: 'Autocomplete complex static with searchfield',
  parameters: {
    description: {
      data: 'Searchfield variant with the same static menu structure.'
    }
  }
};

export const AutocompleteMenuDynamic: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-menu-dynamic',
    sections: [
      {
        title: 'Section 1',
        items: ['Command Palette', 'Open View']
      },
      {
        title: 'Section 2',
        items: ['Appearance', 'Editor Layout']
      }
    ],
    selectionMode: 'single',
    useSearchField: true
  }),
  name: 'Autocomplete, dynamic menu'
};

export const AutocompleteOnActionOnMenuItems: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-on-action',
    items: ['Foo', 'Bar', 'Baz'],
    useSearchField: true
  }),
  name: 'Autocomplete, onAction on menu items'
};

export const AutocompleteDisabledKeys: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-disabled-keys',
    items: ['Foo', {label: 'Bar', disabled: true}, 'Baz'],
    useSearchField: true
  }),
  name: 'Autocomplete, disabled key'
};

export const AutocompleteAsyncLoadingExample: AutocompleteStory = {
  render: (args) => AsyncExample(args as StoryArgs),
  name: 'Autocomplete, useAsync level filtering with load state'
};

export const AutocompleteCaseSensitive: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-case-sensitive',
    items: ['Foo', 'Bar', 'Baz'],
    useSearchField: true
  }),
  name: 'Autocomplete, case sensitive filter'
};

export const AutocompleteWithListbox: AutocompleteStory = {
  render: (args) => createAutocompletePopoverShellStory(args as StoryArgs, {
    defaultValue: 'Ba',
    idPrefix: 'autocomplete-listbox-popover',
    listItems: ['Foo', 'Bar', 'Baz', 'Google', 'Copy', 'Paste', 'Cut']
  }),
  name: 'Autocomplete with ListBox + Popover'
};

export const AutocompleteWithVirtualizedListbox: AutocompleteStory = {
  render: (args) => createAutocompletePopoverShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-virtualized-popover',
    listItems: Array.from({length: 200}, (_entry, index) => `Item ${index}`),
    listStyle: {
      height: '200px',
      overflow: 'auto'
    }
  }),
  name: 'Autocomplete with ListBox + Popover, virtualized'
};

export const AutocompleteInPopover: AutocompleteStory = {
  render: (args) => createAutocompletePopoverShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-menu-trigger-shell',
    listItems: ['Section 0, Item 0', 'Section 0, Item 1', 'Section 1, Item 0', 'Section 1, Item 1'],
    selectionMode: 'single'
  }),
  name: 'Autocomplete in popover (menu trigger), shell example'
};

export const AutocompleteInPopoverDialogTrigger: AutocompleteStory = {
  render: (args) => createAutocompletePopoverShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-dialog-trigger-shell',
    listItems: ['Section 0, Item 0', 'Section 0, Item 1', 'Section 1, Item 0', 'Section 1, Item 1'],
    selectionMode: 'single'
  }),
  name: 'Autocomplete in popover (dialog trigger), shell example'
};

export const AutocompleteMenuInPopoverDialogTrigger: AutocompleteStory = {
  render: (args) => createAutocompletePopoverShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-dialog-trigger-dynamic-shell',
    listItems: ['Command Palette', 'Open View', 'Appearance', 'Editor Layout'],
    selectionMode: 'single'
  }),
  name: 'Autocomplete in popover (dialog trigger), rendering dynamic autocomplete menu'
};

export const AutocompleteSelect = () => ({
  components: {
    VueListBox
  },
  setup() {
    let isOpen = ref(false);
    let options = ['Foo', 'Bar', 'Baz'];
    let selected = ref('');

    return {
      isOpen,
      options,
      selected,
      toggle() {
        isOpen.value = !isOpen.value;
      }
    };
  },
  template: `
    <div class="react-aria-Select" data-rac="" style="margin-bottom: 40px;">
      <span class="react-aria-Label" style="display: block;">Test</span>
      <button class="react-aria-Button" data-rac="" type="button" aria-haspopup="listbox" :aria-expanded="String(isOpen)" @click="toggle">
        <span class="react-aria-SelectValue" data-rac="" :data-placeholder="selected ? undefined : 'true'">{{ selected || 'Select an item' }}</span>
        <span aria-hidden="true" style="padding-left: 5px;">▼</span>
      </button>
      <VueListBox
        v-if="isOpen"
        v-model="selected"
        class="menu"
        aria-label="Suggestions"
        collection-class="menu"
        item-class="item"
        selection-mode="single"
        :items="options"
        @select="toggle" />
    </div>
  `
});

export const AutocompleteWithAsyncListBox = (args: StoryArgs = {}) => AsyncExample({
  ...args,
  includeLoadState: true
});

export const AutocompleteWithGridList = () => ({
  components: {
    VueListBox,
    VueSearchField,
    VueTextField
  },
  setup() {
    let selected = ref<string[]>([]);
    let value = ref('');
    let sections = [
      {title: 'Section 1', items: ['Foo', 'Bar', 'Baz']},
      {title: 'Section 2', items: ['Charizard', 'Blastoise', 'Pikachu', 'Venusaur']},
      {title: 'Section 3', items: ['textValue is text value check', 'Blah']}
    ];

    return {
      sections,
      selected,
      value
    };
  },
  template: `
    <div>
      ${createAutocompleteFieldTemplate({idPrefix: 'autocomplete-grid-list', includeDescription: false})}
      <VueListBox
        v-model="selected"
        class="menu"
        aria-label="test gridlist"
        collection-class="menu"
        collection-role="grid"
        item-role="row"
        item-class="item"
        :sections="sections">
        <template #default="{label}">
          <div style="display: flex; align-items: center; gap: 8px;">
            {{ label }}
            <button class="react-aria-Button" data-rac="" type="button">Actions</button>
          </div>
        </template>
      </VueListBox>
    </div>
  `
});

export const AutocompleteWithTable = () => ({
  components: {
    VueListBox,
    VueSearchField,
    VueTextField
  },
  setup() {
    let selected = ref<string[]>([]);
    let value = ref('');
    let rows = [
      {label: 'Games', description: 'File folder · 6/7/2020'},
      {label: 'Program Files', description: 'File folder · 4/7/2021'},
      {label: 'bootmgr', description: 'System file · 11/20/2010'},
      {label: 'log.txt', description: 'Text document · 1/18/2016'}
    ];

    return {
      rows,
      selected,
      value
    };
  },
  template: `
    <div>
      ${createAutocompleteFieldTemplate({idPrefix: 'autocomplete-with-table', includeDescription: false})}
      <VueListBox
        v-model="selected"
        class="react-aria-Table"
        data-rac=""
        aria-label="Files"
        collection-class="react-aria-Table"
        collection-role="grid"
        item-base-class="react-aria-Row"
        item-role="row"
        item-class="react-aria-Cell"
        :items="rows" />
    </div>
  `
});

export const AutocompleteWithTagGroup = () => ({
  components: {
    TagGroup,
    VueSearchField,
    VueTextField
  },
  setup() {
    let tags = ref(['News', 'Travel', 'Gaming', 'Shopping']);
    let value = ref('');
    let tagItems = computed(() => tags.value.map((tag) => ({
      key: tag.toLowerCase(),
      label: tag
    })));
    let removeTags = (keys: string[]) => {
      let removed = new Set(keys);
      tags.value = tags.value.filter((tag) => !removed.has(tag.toLowerCase()));
    };

    return {
      removeTags,
      tagItems,
      tags,
      value
    };
  },
  template: `
    <div>
      ${createAutocompleteFieldTemplate({idPrefix: 'autocomplete-tag-group', includeDescription: false})}
      <TagGroup
        aria-label="Suggestions"
        label="Categories"
        :allows-removing="true"
        :items="tagItems"
        @remove="removeTags" />
    </div>
  `
});

export const AutocompletePreserveFirstSectionStory: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-preserve-first-section',
    sections: [
      {
        title: 'Section 1',
        items: ['Command Palette', 'Open View']
      },
      {
        title: 'Section 2',
        items: ['Appearance', 'Editor Layout']
      }
    ],
    selectionMode: 'single',
    useSearchField: true
  }),
  name: 'Autocomplete, per node filtering'
};

export const AutocompleteUserCustomFiltering: AutocompleteStory = {
  render: (args) => createAutocompleteListShellStory(args as StoryArgs, {
    idPrefix: 'autocomplete-user-custom-filtering',
    items: ['David', 'Sam', 'Julia'],
    useSearchField: false,
    useTextarea: true
  }),
  name: 'Autocomplete, user custom filterText (mentions)',
  parameters: {
    description: {
      data: 'Only filters when typing @, using text after @ as filter.'
    }
  }
};

export function AutocompleteWithExtraButtons() {
  return {
    components: {
      VueSearchField
    },
    setup() {
      let firstValue = ref('');
      let secondValue = ref('');
      let appendMenuHint = (field: 'first' | 'second') => {
        if (field === 'first') {
          firstValue.value = `${firstValue.value} menu`.trim();
          return;
        }

        secondValue.value = `${secondValue.value} menu`.trim();
      };

      return {
        appendMenuHint,
        firstValue,
        secondValue
      };
    },
    template: `
      <div>
        <VueSearchField
          v-model="firstValue"
          aria-label="Primary input"
          label="Primary input" />
        <div style="display: flex; gap: 200px;">
          <button type="button" aria-label="Menu" @click="appendMenuHint('first')">☰</button>
          <button type="button" aria-label="Menu" @click="appendMenuHint('second')">☰</button>
        </div>
        <VueSearchField
          v-model="secondValue"
          aria-label="Secondary input"
          label="Secondary input" />
      </div>
    `
  };
}
