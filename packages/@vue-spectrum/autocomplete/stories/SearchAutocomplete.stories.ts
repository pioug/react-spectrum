import {onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {SearchAutocomplete} from '../src';

type StoryArgs = Record<string, unknown>;
type SearchItem = {
  id: number,
  name: string
};
type RenderOptions = {
  note?: string,
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
    options: BASE_OPTIONS,
    placeholder: 'Search discipline'
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    id: {
      control: 'text'
    },
    invalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    options: {
      table: {
        disable: true
      }
    },
    placeholder: {
      control: 'text'
    },
    validationState: {
      control: 'select',
      options: ['valid', 'invalid']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderStory(args: StoryArgs, renderOptions: RenderOptions = {}) {
  let {
    note,
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
        note,
        options,
        showResult,
        submit,
        submittedValue
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 320px;">
        <div v-if="note">{{note}}</div>
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
  render: (args) => renderStory(args, {note: 'icon: Filter parity scenario'}),
  name: 'icon: Filter'
};

export const iconNull: Story = {
  render: (args) => renderStory(args, {note: 'icon: null parity scenario'}),
  name: 'icon: null'
};

export const WithAvatars: Story = {
  render: (args) => renderStory(args, {
    note: 'With avatars parity scenario',
    options: ['User 1', 'User 2', 'User 3', 'User 4']
  })
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
