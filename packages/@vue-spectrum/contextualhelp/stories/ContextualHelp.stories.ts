import {ContextualHelp} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ContextualHelp> = {
  title: 'ContextualHelp',
  component: ContextualHelp,
  args: {
    label: 'Example'
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    dismissable: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'boolean'
    },
    placement: {
      control: 'text'
    },
    title: {
      control: 'text'
    },
    variant: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
