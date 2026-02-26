import {ContextualHelp} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

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

export const Default: Story = {
  args: {
    children: {
      title: 'Help title',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.'
    }
  },
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <ContextualHelp v-bind="args">
        <h3 style="margin: 0 0 8px 0;">Help title</h3>
        <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
      </ContextualHelp>
    `
  })
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
        <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
        <template #footer>
          <a href="https://react-spectrum.adobe.com" target="_blank" rel="noreferrer">Learn more</a>
        </template>
      </ContextualHelp>
    `
  }),
  name: 'with link'
};

export const WithButton: Story = {
  args: {
    variant: 'help'
  },
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" disabled>Create</button>
        <ContextualHelp v-bind="args" class="foo">
          <h3 style="margin: 0 0 8px 0;">Help title</h3>
          <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
        </ContextualHelp>
      </div>
    `
  }),
  name: 'with button'
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
          <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
        </ContextualHelp>
      </div>
    `
  }),
  name: 'aria-labelledyby'
};
