import {Button} from '@vue-spectrum/button';
import {ContextualHelp} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const HELP_BODY = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem.';

const meta: Meta<typeof ContextualHelp> = {
  title: 'ContextualHelp',
  component: ContextualHelp,
  argTypes: {
    onOpenChange: {
      action: 'openChange',
      table: {
        disable: true
      }
    },
    placement: {
      control: 'select',
      options: [
        'bottom',
        'bottom left',
        'bottom right',
        'bottom start',
        'bottom end',
        'top',
        'top left',
        'top right',
        'top start',
        'top end',
        'left',
        'left top',
        'left bottom',
        'start',
        'start top',
        'start bottom',
        'right',
        'right top',
        'right bottom',
        'end',
        'end top',
        'end bottom'
      ]
    },
    variant: {
      control: 'select',
      defaultValue: 'help',
      options: ['help', 'info']
    },
    offset: {
      control: 'number',
      min: -500,
      max: 500
    },
    crossOffset: {
      control: 'number',
      min: -500,
      max: 500
    },
    containerPadding: {
      control: 'number',
      min: -500,
      max: 500
    },
    shouldFlip: {
      control: 'boolean'
    },
    children: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDefault(args: Record<string, unknown>) {
  return {
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <ContextualHelp v-bind="args">
        <h3 style="margin: 0 0 8px 0;">Help title</h3>
        <p style="margin: 0;">${HELP_BODY}</p>
      </ContextualHelp>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDefault(args)
};

export const WithLink: Story = {
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <ContextualHelp v-bind="args">
        <h3 style="margin: 0 0 8px 0;">Help title</h3>
        <p style="margin: 0;">${HELP_BODY}</p>
        <template #footer>
          <a href="https://react-spectrum.adobe.com" target="_blank" rel="noreferrer">Learn more</a>
        </template>
      </ContextualHelp>
    `
  }),
  name: 'with link'
};

export const WithButton: Story = {
  render: (args) => ({
    components: {Button, ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <Button variant="primary" is-disabled>Create</Button>
        <ContextualHelp v-bind="args" class="foo">
          <h3 style="margin: 0 0 8px 0;">Help title</h3>
          <p style="margin: 0;">${HELP_BODY}</p>
        </ContextualHelp>
      </div>
    `
  }),
  name: 'with button',
  parameters: {
    description: {
      data: 'Custom classname foo is on the contextual help button.'
    }
  }
};

export const AriaLabelledyBy: Story = {
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div id="foo">I label the contextual help button</div>
        <ContextualHelp v-bind="args" aria-labelledby="foo">
          <h3 style="margin: 0 0 8px 0;">Help title</h3>
          <p style="margin: 0;">${HELP_BODY}</p>
        </ContextualHelp>
      </div>
    `
  }),
  name: 'aria-labelledyby'
};
