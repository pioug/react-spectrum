import {Grid} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Grid> = {
  title: 'Grid',
  component: Grid,
  args: {
    columns: 'repeat(3, minmax(0, 120px))',
    gap: 'size-100',
    autoFlow: 'row',
    alignItems: 'stretch',
    justifyItems: 'stretch'
  },
  argTypes: {
    alignItems: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'stretch',
        'baseline'
      ]
    },
    areas: {
      control: 'text'
    },
    autoFlow: {
      control: 'select',
      options: [
        'row',
        'column',
        'dense',
        'row dense',
        'column dense'
      ]
    },
    columnGap: {
      control: 'text'
    },
    columns: {
      control: 'text'
    },
    elementType: {
      control: 'text'
    },
    gap: {
      control: 'text'
    },
    justifyItems: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'stretch'
      ]
    },
    rowGap: {
      control: 'text'
    },
    rows: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Grid},
    setup() {
      return {args};
    },
    template: `<Grid v-bind="args">
  <div style="padding: 10px; border: 1px solid var(--spectrum-global-color-gray-300);">A</div>
  <div style="padding: 10px; border: 1px solid var(--spectrum-global-color-gray-300);">B</div>
  <div style="padding: 10px; border: 1px solid var(--spectrum-global-color-gray-300);">C</div>
  <div style="padding: 10px; border: 1px solid var(--spectrum-global-color-gray-300);">D</div>
  <div style="padding: 10px; border: 1px solid var(--spectrum-global-color-gray-300);">E</div>
  <div style="padding: 10px; border: 1px solid var(--spectrum-global-color-gray-300);">F</div>
</Grid>`
  })
};

export const TwoColumns: Story = {
  ...Default,
  args: {
    columns: 'repeat(2, minmax(0, 160px))'
  }
};

export const DenseFlow: Story = {
  ...Default,
  args: {
    autoFlow: 'row dense'
  }
};

export const LargeRowGap: Story = {
  ...Default,
  args: {
    rowGap: 'size-200'
  }
};
