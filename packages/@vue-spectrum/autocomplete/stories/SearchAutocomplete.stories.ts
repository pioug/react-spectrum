import {action} from 'storybook/actions';
import {ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {SearchAutocomplete} from '../src';

type StoryArgs = Record<string, unknown>;
type SearchItem = {
  avatarSrc?: string,
  id: number | string,
  name: string
};

const AVATAR_SRC = 'https://i.imgur.com/kJOwAdv.png';

let items: SearchItem[] = [
  {id: 1, name: 'Aerospace'},
  {id: 2, name: 'Mechanical'},
  {id: 3, name: 'Civil'},
  {id: 4, name: 'Biomedical'},
  {id: 5, name: 'Nuclear'},
  {id: 6, name: 'Industrial'},
  {id: 7, name: 'Chemical'},
  {id: 8, name: 'Agricultural'},
  {id: 9, name: 'Electrical'}
];

let avatarItems: SearchItem[] = [
  {id: 1, name: 'User 1', avatarSrc: AVATAR_SRC},
  {id: 2, name: 'User 2', avatarSrc: AVATAR_SRC},
  {id: 3, name: 'User 3', avatarSrc: AVATAR_SRC},
  {id: 4, name: 'User 4', avatarSrc: AVATAR_SRC}
];

let starWarsCharacters = [
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
  'Luminara Unduli'
];

const BASE_OPTIONS = items.map((item) => item.name);

const meta: Meta<typeof SearchAutocomplete> = {
  title: 'SearchAutocomplete',
  component: SearchAutocomplete,
  args: {
    label: 'Search with Autocomplete',
    onOpenChange: action('onOpenChange'),
    onInputChange: action('onInputChange'),
    onSelectionChange: action('onSelectionChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
    onSubmit: action('onSubmit'),
    onClear: action('onClear')
  },
  argTypes: {
    defaultItems: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    onOpenChange: {
      table: {
        disable: true
      }
    },
    disabledKeys: {
      table: {
        disable: true
      }
    },
    inputValue: {
      table: {
        disable: true
      }
    },
    defaultInputValue: {
      table: {
        disable: true
      }
    },
    defaultSelectedKey: {
      table: {
        disable: true
      }
    },
    selectedKey: {
      table: {
        disable: true
      }
    },
    onInputChange: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    onBlur: {
      table: {
        disable: true
      }
    },
    onFocus: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    'aria-label': {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    labelAlign: {
      control: 'select',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    loadingState: {
      control: 'select',
      options: ['idle', 'loading', 'loadingMore', 'filtering']
    },
    validationState: {
      control: 'select',
      options: [null, 'valid', 'invalid']
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    menuTrigger: {
      control: 'select',
      options: ['focus', 'manual']
    },
    direction: {
      control: 'radio',
      options: ['top', 'bottom']
    },
    align: {
      control: 'radio',
      options: ['start', 'end']
    },
    width: {
      control: {
        type: 'radio',
        options: [null, '100px', '480px', 'size-4600']
      }
    },
    menuWidth: {
      control: {
        type: 'radio',
        options: [null, '100px', '480px', 'size-4600']
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSearchAutocompleteStory(
  args: StoryArgs,
  storyItems: SearchItem[] | string[],
  itemProp: 'default-items' | 'items' = 'default-items',
  label?: string
) {
  return {
    components: {SearchAutocomplete},
    setup() {
      let modelValue = ref('');

      return {
        args,
        itemProp,
        items: storyItems,
        label,
        modelValue
      };
    },
    template: `
      <SearchAutocomplete
        v-bind="args"
        v-model="modelValue"
        :label="label ?? args.label"
        v-bind:[itemProp]="items" />
    `
  };
}

export const Default: Story = {
  render: (args) => renderSearchAutocompleteStory(args, BASE_OPTIONS),
  name: 'static items'
};

export const Dynamic: Story = {
  render: (args) => renderSearchAutocompleteStory(args, items),
  name: 'dynamic items'
};

export const NoItems: Story = {
  render: (args) => renderSearchAutocompleteStory(args, []),
  name: 'no items'
};

export const MappedItems: Story = {
  render: (args) => renderSearchAutocompleteStory(args, items.map((item) => ({id: item.id, name: item.name}))),
  name: 'with mapped items'
};

export const noVisibleLabel: Story = {
  render: (args) => ({
    components: {SearchAutocomplete},
    setup() {
      let modelValue = ref('');

      return {
        args,
        items: [...BASE_OPTIONS],
        modelValue
      };
    },
    template: `
      <SearchAutocomplete
        v-bind="args"
        v-model="modelValue"
        :label="''"
        aria-label="Search Autocomplete"
        :default-items="items" />
    `
  }),
  name: 'No visible label'
};

export const customOnSubmit: Story = {
  render: (args) => ({
    components: {SearchAutocomplete},
    setup() {
      let modelValue = ref('');
      let searchTerm = ref('');
      let onSubmit = (value: string | null, key: number | string | null) => {
        if (value) {
          searchTerm.value = value;
          return;
        }

        if (key != null) {
          searchTerm.value = items.find((item) => item.id === key)?.name ?? '';
          return;
        }

        searchTerm.value = '';
      };

      return {
        args,
        items,
        modelValue,
        onSubmit,
        searchTerm
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <SearchAutocomplete
          v-bind="args"
          v-model="modelValue"
          :default-items="items"
          @submit="onSubmit" />
        <div>
          Search results for: {{searchTerm}}
        </div>
      </div>
    `
  }),
  name: 'custom onSubmit'
};

export const iconFilter: Story = {
  render: (args) => renderSearchAutocompleteStory({...args, icon: 'filter'}, BASE_OPTIONS),
  name: 'icon: Filter'
};

export const iconNull: Story = {
  render: (args) => renderSearchAutocompleteStory({...args, icon: null}, BASE_OPTIONS),
  name: 'icon: null'
};

export const WithAvatars: Story = {
  render: (args) => renderSearchAutocompleteStory(args, avatarItems, 'default-items', 'Search users'),
  args: {
    label: 'Search users'
  }
};

export const AsyncList: Story = {
  render: (args) => ({
    components: {SearchAutocomplete},
    setup() {
      let inputValue = ref('');
      let asyncItems = ref<SearchItem[]>([]);
      let loadingState = ref<'loading' | undefined>(undefined);
      let requestId = 0;

      watch(inputValue, (value) => {
        requestId += 1;
        let currentRequestId = requestId;

        if (value === '') {
          loadingState.value = undefined;
          asyncItems.value = [];
          return;
        }

        loadingState.value = 'loading';
        window.setTimeout(() => {
          if (currentRequestId !== requestId) {
            return;
          }

          let query = value.trim().toLocaleLowerCase();
          asyncItems.value = starWarsCharacters
            .filter((name) => name.toLocaleLowerCase().includes(query))
            .map((name) => ({id: name, name}));
          loadingState.value = undefined;
        }, 250);
      }, {immediate: true});

      return {
        args,
        asyncItems,
        inputValue,
        loadingState
      };
    },
    template: `
      <SearchAutocomplete
        v-bind="args"
        v-model="inputValue"
        label="Star Wars Character Lookup"
        :items="asyncItems"
        :loading-state="loadingState" />
    `
  })
};
