import {HelpText} from '../src';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof HelpText> = {
  title: 'HelpText',
  component: HelpText,
  args: {
    description: 'Password must be at least 8 characters.'
  },
  argTypes: {
    description: {
      control: 'text'
    },
    validationState: {
      control: 'select',
      options: ['valid', 'invalid']
    },
    isInvalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {HelpText},
    setup() {
      return {args};
    },
    template: '<HelpText v-bind="args" />'
  })
};

export const WithState: Story = {
  render: (args) => ({
    components: {HelpText},
    setup() {
      let value = ref('');
      let valid = ref('');
      let validationState = computed<'invalid' | 'valid' | undefined>(() => {
        if (value.value.length > 0) {
          return 'invalid';
        }
        if (valid.value === 'valid') {
          return 'valid';
        }
        return undefined;
      });
      return {
        args,
        valid,
        validationState,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <input v-model="value" placeholder="Type to invalidate" />
        <label style="display: flex; gap: 6px; align-items: center;">
          <input v-model="valid" type="radio" value="valid" />
          Valid
        </label>
        <label style="display: flex; gap: 6px; align-items: center;">
          <input v-model="valid" type="radio" value="" />
          undefined
        </label>
        <HelpText
          v-bind="args"
          :description="'This input is only valid when it\\'s empty.'"
          :error-message="'Remove input.'"
          :validation-state="validationState" />
      </div>
    `
  })
};

export const AriaLabel: Story = {
  render: (args) => ({
    components: {HelpText},
    setup() {
      return {args};
    },
    template: '<HelpText v-bind="args" aria-label="Password" />'
  }),
  args: {
    description: 'Password must be at least 8 characters.'
  }
};

export const DescriptionAndCustomDescription: Story = {
  render: (args) => ({
    components: {HelpText},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <HelpText v-bind="args" aria-describedby="custom-description" />
        <p id="custom-description">Custom description.</p>
      </div>
    `
  })
};

export const AriaLabelWithDynamicHelpText: Story = {
  render: (args) => ({
    components: {HelpText},
    setup() {
      let value = ref('');
      return {
        args,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <input v-model="value" aria-label="Password" />
        <HelpText
          v-bind="args"
          :description="undefined"
          :validation-state="value.length ? 'invalid' : undefined"
          :error-message="'Invalid length.'" />
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'For the case when there is no label and help text is added or removed dynamically.'
    }
  }
};
