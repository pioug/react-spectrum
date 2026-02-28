import {ColorField} from '../src';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {action} from 'storybook/actions';
import {h, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof ColorField> = {
  title: 'ColorField',
  component: ColorField,
  args: {
    onChange: action('onChange'),
    label: 'Primary Color'
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
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
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    isDisabled: {
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
    isInvalid: {
      control: 'boolean'
    },
    isWheelDisabled: {
      control: 'boolean'
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    width: {
      control: 'text'
    },
    colorSpace: {
      control: 'select',
      options: ['rgb', 'hsl', 'hsb']
    },
    channel: {
      control: 'select',
      options: [null, 'red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness']
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
      let contextualHelp = h(
        ContextualHelp,
        {title: 'What is a segment?'},
        () => 'Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.'
      );

      return {args, contextualHelp};
    },
    template: '<ColorField v-bind="args" :contextual-help="contextualHelp" />'
  };
}

export const Default: Story = {
  render: (args) => renderColorField(args)
};

export const DefaultValue: Story = {
  ...Default,
  args: {
    defaultValue: '#abcdef'
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
  name: 'contextual help'
};
