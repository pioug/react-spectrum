import {action} from '@storybook/addon-actions';
import {onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {SearchAutocomplete} from '../src';

type StoryArgs = Record<string, unknown>;
type SearchItem = {
  id: number,
  name: string
};
type RenderOptions = {
  options?: string[],
  showResult?: boolean
};

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

function renderStory(args: StoryArgs, renderOptions: RenderOptions = {}) {
  let {
    options = BASE_OPTIONS,
    showResult = false
  } = renderOptions;
  return {
    components: {SearchAutocomplete},
    setup() {
      let modelValue = ref('');
      let submittedValue = ref('');
      let submit = () => {
        submittedValue.value = modelValue.value;
      };

      return {
        args,
        modelValue,
        options,
        showResult,
        submit,
        submittedValue
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 320px;">
        <SearchAutocomplete v-bind="args" v-model="modelValue" :options="options" />
        <button v-if="showResult" type="button" @click="submit">Submit search</button>
        <div v-if="showResult">Search results for: {{submittedValue}}</div>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderStory(args),
  name: 'static items'
};

export const Dynamic: Story = {
  render: (args) => renderStory(args, {options: BASE_OPTIONS}),
  name: 'dynamic items'
};

export const NoItems: Story = {
  render: (args) => renderStory(args, {options: []}),
  name: 'no items'
};

export const MappedItems: Story = {
  render: (args) => renderStory(args, {options: items.map((item) => item.name)}),
  name: 'with mapped items'
};

export const noVisibleLabel: Story = {
  render: (args) => ({
    components: {SearchAutocomplete},
    setup() {
      let modelValue = ref('');
      let options = [...BASE_OPTIONS];
      return {
        args,
        modelValue,
        options
      };
    },
    template: `
      <SearchAutocomplete
        v-bind="args"
        v-model="modelValue"
        :label="''"
        aria-label="Search Autocomplete"
        :options="options" />
    `
  }),
  name: 'No visible label'
};

export const customOnSubmit: Story = {
  render: (args) => renderStory(args, {showResult: true}),
  name: 'custom onSubmit'
};

export const iconFilter: Story = {
  render: (args) => renderStory({...args, icon: 'filter'}),
  name: 'icon: Filter'
};

export const iconNull: Story = {
  render: (args) => renderStory({...args, icon: null}),
  name: 'icon: null'
};

export const WithAvatars: Story = {
  render: (args) => renderStory(args, {
    options: ['👤 User 1', '👤 User 2', '👤 User 3', '👤 User 4']
  }),
  args: {
    label: 'Search users'
  }
};

export const AsyncList: Story = {
  render: (args) => ({
    components: {SearchAutocomplete},
    setup() {
      let modelValue = ref('');
      let options = ref<string[]>([]);
      let loading = ref(true);

      onMounted(() => {
        setTimeout(() => {
          options.value = BASE_OPTIONS;
          loading.value = false;
        }, 250);
      });

      return {
        args,
        loading,
        modelValue,
        options
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 320px;">
        <div v-if="loading">Loading options...</div>
        <SearchAutocomplete
          v-bind="args"
          v-model="modelValue"
          :options="options"
          :placeholder="loading ? 'Loading...' : args.placeholder" />
      </div>
    `
  })
};
