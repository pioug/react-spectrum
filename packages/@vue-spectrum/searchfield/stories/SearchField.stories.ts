import {action} from '@storybook/addon-actions';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {SearchField} from '../src';
import {computed, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type SearchFieldStoryArgs = {
  ariaLabel?: string,
  autoFocus?: boolean,
  contextualHelp?: unknown,
  description?: string,
  errorMessage?: string,
  icon?: unknown,
  isDisabled?: boolean,
  isQuiet?: boolean,
  isReadOnly?: boolean,
  isRequired?: boolean,
  label?: string,
  labelAlign?: 'end' | 'start',
  labelPosition?: 'side' | 'top',
  modelValue?: string,
  necessityIndicator?: 'icon' | 'label',
  placeholder?: string,
  validationState?: 'invalid' | 'valid' | null
};

const info = 'A containing element with role="search" has been added to define a search landmark region.';

const meta: Meta<typeof SearchField> = {
  title: 'SearchField',
  providerSwitcher: {status: 'positive'},
  component: SearchField,
  args: {
    label: 'Search',
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    necessityIndicator: 'icon',
    labelPosition: 'top',
    labelAlign: 'start',
    validationState: undefined
  },
  argTypes: {
    labelPosition: {
      control: {
        type: 'radio',
        options: ['top', 'side']
      }
    },
    necessityIndicator: {
      control: {
        type: 'radio',
        options: ['icon', 'label']
      }
    },
    labelAlign: {
      control: {
        type: 'radio',
        options: ['start', 'end']
      }
    },
    validationState: {
      control: {
        type: 'radio',
        options: [null, 'valid', 'invalid']
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSearchField(baseArgs: Partial<SearchFieldStoryArgs> = {}, withSearchRole = false, fieldStyle?: string) {
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
    template: withSearchRole
      ? `
      <div role="search">
        <SearchField
          :aria-label="mergedArgs.ariaLabel"
          :auto-focus="mergedArgs.autoFocus"
          :contextual-help="mergedArgs.contextualHelp"
          :description="mergedArgs.description"
          :error-message="mergedArgs.errorMessage"
          :icon="mergedArgs.icon"
          :is-disabled="mergedArgs.isDisabled"
          :is-quiet="mergedArgs.isQuiet"
          :is-read-only="mergedArgs.isReadOnly"
          :is-required="mergedArgs.isRequired"
          :label="mergedArgs.label"
          :label-align="mergedArgs.labelAlign"
          :label-position="mergedArgs.labelPosition"
          :model-value="value"
          :necessity-indicator="mergedArgs.necessityIndicator"
          :placeholder="mergedArgs.placeholder"
          ${fieldStyle ? `style="${fieldStyle}"` : ''}
          :validation-state="mergedArgs.validationState"
          class="custom_classname"
          @change="onChange"
          @clear="onClear"
          @submit="onSubmit"
          @update:model-value="value = $event" />
      </div>
    `
      : `
      <SearchField
        :aria-label="mergedArgs.ariaLabel"
        :auto-focus="mergedArgs.autoFocus"
        :contextual-help="mergedArgs.contextualHelp"
        :description="mergedArgs.description"
        :error-message="mergedArgs.errorMessage"
        :icon="mergedArgs.icon"
        :is-disabled="mergedArgs.isDisabled"
        :is-quiet="mergedArgs.isQuiet"
        :is-read-only="mergedArgs.isReadOnly"
        :is-required="mergedArgs.isRequired"
        :label="mergedArgs.label"
        :label-align="mergedArgs.labelAlign"
        :label-position="mergedArgs.labelPosition"
        :model-value="value"
        :necessity-indicator="mergedArgs.necessityIndicator"
        :placeholder="mergedArgs.placeholder"
        ${fieldStyle ? `style="${fieldStyle}"` : ''}
        :validation-state="mergedArgs.validationState"
        class="custom_classname"
        @change="onChange"
        @clear="onClear"
        @submit="onSubmit"
        @update:model-value="value = $event" />
    `
  });
}

export const Default: Story = {
  render: renderSearchField({}, true),
  parameters: {info}
};

export const DefaultValueUncontrolled: Story = {
  render: renderSearchField({modelValue: 'React'}, true),
  name: 'defaultValue (uncontrolled)',
  parameters: {info}
};

export const ValueControlled: Story = {
  render: renderSearchField({modelValue: 'React'}, true),
  name: 'value (controlled)',
  parameters: {info}
};

export const IconRefresh: Story = {
  render: renderSearchField({modelValue: 'React', icon: 'refresh'}, true),
  name: 'icon: refresh',
  parameters: {info}
};

export const IconNull: Story = {
  render: renderSearchField({modelValue: 'React', icon: null}, true),
  name: 'icon: null',
  parameters: {info}
};

export const OnClear: Story = {
  render: renderSearchField({modelValue: 'React'}, true),
  name: 'onClear',
  parameters: {info}
};

export const AutoFocus: Story = {
  render: renderSearchField({autoFocus: true}, true),
  name: 'autoFocus',
  parameters: {info}
};

export const NoVisibleLabel: Story = {
  render: renderSearchField({label: '', ariaLabel: 'Street address'}),
  name: 'no visible label'
};

export const WithDescription: Story = {
  render: renderSearchField({description: 'Enter a search term.'}),
  name: 'with description'
};

export const WithErrorMessage: Story = {
  render: renderSearchField({errorMessage: 'Remove special characters.', validationState: 'invalid'}),
  name: 'with error message'
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
  }),
  name: 'contextual help'
};

export const CustomWidth: Story = {
  render: renderSearchField({}, false, 'width: 300px;'),
  name: 'custom width'
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
  }),
  name: 'custom width and narrow container'
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
  }),
  name: 'within a popover'
};
