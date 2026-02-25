import {action} from '@storybook/addon-actions';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {SearchField} from '../src';
import {computed, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type SearchFieldStoryArgs = {
  ariaLabel?: string,
  autoFocus?: boolean,
  description?: string,
  isDisabled?: boolean,
  isQuiet?: boolean,
  isReadOnly?: boolean,
  label?: string,
  modelValue?: string,
  placeholder?: string,
  required?: boolean,
  validationState?: 'invalid' | 'valid'
};

const info = 'A containing element with role="search" has been added to define a search landmark region.';

const meta: Meta<typeof SearchField> = {
  title: 'SearchField',
  component: SearchField,
  args: {
    label: 'Search',
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
    required: false,
    validationState: undefined
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
    },
    description: {
      control: 'text'
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
    placeholder: {
      control: 'text'
    },
    required: {
      control: 'boolean'
    },
    validationState: {
      control: {
        type: 'radio'
      },
      options: [undefined, 'valid', 'invalid']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSearchField(baseArgs: Partial<SearchFieldStoryArgs> = {}, withSearchRole = false, wrapperStyle?: string) {
  return (args: SearchFieldStoryArgs) => ({
    components: {SearchField},
    setup() {
      let mergedArgs = computed<SearchFieldStoryArgs>(() => ({...args, ...baseArgs}));
      let value = ref('');

      watch(mergedArgs, (nextArgs) => {
        value.value = nextArgs.modelValue ?? '';
      }, {deep: true, immediate: true});

      let onChange = (nextValue: string) => {
        value.value = nextValue;
        action('change')(nextValue);
      };

      let onSubmit = () => action('submit')(value.value);

      return {
        mergedArgs,
        value,
        onChange,
        onSubmit,
        onClear: action('clear')
      };
    },
    template: `
      <div ${wrapperStyle ? `style="${wrapperStyle}"` : ''} ${withSearchRole ? 'role="search"' : ''}>
        <SearchField
          :aria-label="mergedArgs.ariaLabel"
          :auto-focus="mergedArgs.autoFocus"
          :description="mergedArgs.description"
          :is-disabled="mergedArgs.isDisabled"
          :is-quiet="mergedArgs.isQuiet"
          :is-read-only="mergedArgs.isReadOnly"
          :label="mergedArgs.label"
          :model-value="value"
          :placeholder="mergedArgs.placeholder"
          :required="mergedArgs.required"
          :validation-state="mergedArgs.validationState"
          class="custom_classname"
          @change="onChange"
          @clear="onClear"
          @keydown.enter="onSubmit"
          @update:model-value="value = $event" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderSearchField({}, true),
  parameters: {info}
};

export const DefaultValueUncontrolled: Story = {
  render: renderSearchField({modelValue: 'React'}, true),
  parameters: {info}
};

export const ValueControlled: Story = {
  render: renderSearchField({modelValue: 'React'}, true),
  parameters: {info}
};

export const IconRefresh: Story = {
  render: renderSearchField({modelValue: 'React', description: 'Icon variant: refresh'}, true),
  parameters: {info}
};

export const IconNull: Story = {
  render: renderSearchField({modelValue: 'React', description: 'Icon variant: null'}, true),
  parameters: {info}
};

export const OnClear: Story = {
  render: renderSearchField({modelValue: 'React'}, true),
  parameters: {info}
};

export const AutoFocus: Story = {
  render: renderSearchField({autoFocus: true}, true),
  parameters: {info}
};

export const NoVisibleLabel: Story = {
  render: renderSearchField({label: '', ariaLabel: 'Street address'})
};

export const WithDescription: Story = {
  render: renderSearchField({description: 'Enter a search term.'})
};

export const WithErrorMessage: Story = {
  render: renderSearchField({description: 'Remove special characters.', validationState: 'invalid'})
};

export const _ContextualHelp: Story = {
  render: (args: SearchFieldStoryArgs) => ({
    components: {ContextualHelp, SearchField},
    setup() {
      let value = ref(args.modelValue ?? '');

      return {
        args,
        value,
        onChange: action('change'),
        onSubmit: action('submit'),
        onClear: action('clear')
      };
    },
    template: `
      <div style="display: flex; align-items: end; gap: 8px; max-width: 460px;">
        <SearchField
          v-bind="args"
          label="Search"
          :model-value="value"
          class="custom_classname"
          @change="onChange"
          @clear="onClear"
          @keydown.enter="onSubmit"
          @update:model-value="value = $event" />
        <ContextualHelp title="What is a segment?">
          Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.
        </ContextualHelp>
      </div>
    `
  })
};

export const CustomWidth: Story = {
  render: renderSearchField({}, false, 'width: 300px;')
};

export const CustomWidthAndNarrowContainer: Story = {
  render: () => ({
    components: {SearchField},
    setup() {
      return {
        onChange: action('change'),
        onSubmit: action('submit'),
        valueA: ref('React'),
        valueB: ref('React'),
        valueC: ref('React')
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; width: 30px; gap: 8px;">
        <SearchField
          label="Search"
          class="custom_classname"
          :model-value="valueA"
          validation-state="valid"
          @change="onChange"
          @keydown.enter="onSubmit"
          @update:model-value="valueA = $event" />
        <SearchField
          label="Search"
          class="custom_classname"
          :model-value="valueB"
          style="width: 30px;"
          @change="onChange"
          @keydown.enter="onSubmit"
          @update:model-value="valueB = $event" />
        <SearchField
          label="Search"
          class="custom_classname"
          :model-value="valueC"
          style="width: 30px;"
          validation-state="valid"
          @change="onChange"
          @keydown.enter="onSubmit"
          @update:model-value="valueC = $event" />
      </div>
    `
  })
};

export const WithinAPopover: Story = {
  render: () => ({
    components: {SearchField},
    setup() {
      let open = ref(false);
      let value = ref('');

      return {
        open,
        value,
        onChange: action('change'),
        onSubmit: action('submit')
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 420px;">
        <button type="button" @click="open = !open">Trigger</button>
        <div v-if="open" style="border: 1px solid var(--spectrum-global-color-gray-300); border-radius: 8px; padding: 12px; background: white;">
          <h3 style="margin: 0 0 8px;">The Heading</h3>
          <SearchField
            label="Search"
            :model-value="value"
            class="custom_classname"
            @change="onChange"
            @keydown.enter="onSubmit"
            @update:model-value="value = $event" />
        </div>
      </div>
    `
  })
};
