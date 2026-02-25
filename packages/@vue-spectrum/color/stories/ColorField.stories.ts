import {ColorField} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof ColorField> = {
  title: 'ColorField',
  component: ColorField,
  args: {
    label: 'Primary Color'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    form: {
      control: 'text'
    },
    id: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    name: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderColorField(args: StoryArgs) {
  return {
    components: {ColorField},
    setup() {
      return {args};
    },
    template: '<ColorField v-bind="args" />'
  };
}

function renderControlledColorField(args: StoryArgs) {
  return {
    components: {ColorField},
    setup() {
      let color = ref('#ff00aa');
      return {
        args,
        color
      };
    },
    template: `
      <div style="display: flex; gap: 8px; align-items: flex-end;">
        <ColorField
          v-bind="args"
          :model-value="color"
          @update:model-value="color = $event" />
        <div
          aria-hidden="true"
          :style="{width: '24px', height: '24px', border: '1px solid #444', backgroundColor: color}" />
      </div>
    `
  };
}

function renderAriaLabelledBy(args: StoryArgs) {
  return {
    components: {ColorField},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 4px;">
        <label id="label" for="colorfield">Primary Color</label>
        <ColorField v-bind="args" id="colorfield" aria-labelledby="label" />
      </div>
    `
  };
}

function renderMinWidth(args: StoryArgs) {
  return {
    components: {ColorField},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <ColorField v-bind="{...args, style: 'width: 10px;'}" />
        <div style="width: 10px;">
          <ColorField v-bind="args" />
        </div>
      </div>
    `
  };
}

function renderContextualHelp(args: StoryArgs) {
  return {
    components: {ColorField},
    setup() {
      return {args};
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 420px;">
        <ColorField v-bind="args" />
        <aside style="font-size: 12px; opacity: 0.8;">
          Segments identify who your visitors are, what devices and services they use, where they navigated from, and more.
        </aside>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderColorField(args)
};

export const DefaultValue: Story = {
  ...Default,
  args: {
    modelValue: '#abcdef'
  }
};

export const ControlledValue: Story = {
  render: (args) => renderControlledColorField(args)
};

export const AriaLabelledBy: Story = {
  render: (args) => renderAriaLabelledBy(args),
  name: 'aria-labelledy'
};

export const MinWidth: Story = {
  render: (args) => renderMinWidth(args),
  name: 'custom width, 10px for min-width'
};

export const ContextualHelpStory: Story = {
  render: (args) => renderContextualHelp(args),
  args: {
    description: 'More information about color segments.'
  },
  name: 'contextual help'
};
