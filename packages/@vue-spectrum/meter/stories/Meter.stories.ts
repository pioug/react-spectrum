import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Meter} from '../src';

const formatOptions = {
  style: 'currency',
  currency: 'JPY'
} as Intl.NumberFormatOptions;

const meta: Meta<typeof Meter> = {
  title: 'Meter',
  component: Meter,
  args: {
    variant: 'informative'
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['informative', 'positive', 'warning', 'critical']
      }
    },
    size: {
      control: {
        type: 'radio',
        options: ['S', 'L']
      }
    },
    showValueLabel: {
      control: 'boolean'
    },
    labelPosition: {
      control: 'radio',
      options: ['top', 'side']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Meter},
    setup() {
      return {args};
    },
    template: '<Meter v-bind="args" />'
  }),
  args: {
    label: 'Meter',
    value: 50
  },
  name: 'value: 50',
  parameters: {
    a11y: {
      config: {
        rules: [{id: 'aria-allowed-attr', selector: '*:not([role="meter progressbar"])'}]
      }
    }
  }
};

export const ValueLabel1Of4: Story = {
  ...Default,
  args: {
    ...Default.args,
    value: 25,
    valueLabel: '1 of 4'
  },
  name: 'valueLabel: 1 of 4'
};

export const UsingNumberFormatOptionsWithCurrencyStyle: Story = {
  ...Default,
  args: {
    ...Default.args,
    showValueLabel: true,
    formatOptions
  },
  name: 'Using number formatOptions with currency style'
};

export const NoVisibleLabel: Story = {
  ...Default,
  args: {
    ...Default.args,
    label: null,
    'aria-label': 'Meter'
  },
  name: 'no visible label'
};

export const ParentWidth100: Story = {
  render: (args) => ({
    components: {Meter},
    setup() {
      return {args};
    },
    template: '<span style="width: 100%;"><Meter v-bind="args" /></span>'
  }),
  args: {
    ...Default.args,
    value: 32
  },
  name: 'parent width 100%'
};

export const ParentWidth100Px: Story = {
  render: (args) => ({
    components: {Meter},
    setup() {
      return {args};
    },
    template: '<span style="width: 100px;"><Meter v-bind="args" /></span>'
  }),
  args: {
    ...Default.args,
    value: 32
  },
  name: 'parent width 100px'
};

export const Width300Px: Story = {
  ...Default,
  args: {
    ...Default.args,
    value: 32,
    width: '300px'
  },
  name: 'width: 300px'
};

export const Width30Px: Story = {
  ...Default,
  args: {
    ...Default.args,
    value: 32,
    width: '30px'
  },
  name: 'width: 30px'
};

export const UsingRawValuesForMinValueMaxValueAndValue: Story = {
  ...Default,
  args: {
    ...Default.args,
    labelPosition: 'top',
    maxValue: 2147483648,
    showValueLabel: true,
    value: 715827883
  },
  name: 'Using raw values for minValue, maxValue, and value'
};

export const UsingRawValuesWithNumberFormatter: Story = {
  ...Default,
  args: {
    ...Default.args,
    labelPosition: 'top',
    maxValue: 2147483648,
    showValueLabel: true,
    value: 715827883,
    formatOptions
  },
  name: 'Using raw values with number formatter'
};
