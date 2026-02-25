import {LabeledValue} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof LabeledValue> = {
  title: 'LabeledValue',
  component: LabeledValue,
  args: {
    label: 'Test',
    value: 'foo '.repeat(20),
    orientation: 'vertical'
  },
  argTypes: {
    elementType: {
      control: 'text'
    },
    emptyValue: {
      control: 'text'
    },
    formatOptions: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    locale: {
      control: 'text'
    },
    labelAlign: {
      control: 'select',
      options: ['start', 'end']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    orientation: {
      control: 'select',
      options: [
        'vertical',
        'horizontal'
      ]
    },
    width: {
      control: 'select',
      options: ['', '300px', '600px']
    },
    value: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderLabeledValue(args: Record<string, unknown>) {
  return {
    components: {LabeledValue},
    setup() {
      return {args};
    },
    template: '<LabeledValue v-bind="args" />'
  };
}

export const Default: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: 'foo '.repeat(20)
  },
  name: 'String'
};

export const StringArray: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: ['wow', 'cool', 'awesome'].join(', ')
  },
  name: 'String array'
};

export const CalendarDateType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2019-06-05'
  },
  name: 'CalendarDate'
};

export const CalendarDateTimeType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2020-02-03T12:23:24.120'
  },
  name: 'CalendarDateTime'
};

export const CalendarDateTimeTypeFormatOptions: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2020-02-03T12:23:24.120',
    formatOptions: {
      dateStyle: 'short',
      timeStyle: 'short'
    }
  },
  name: 'CalendarDateTime with formatOptions'
};

export const ZonedDateTimeType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2020-02-03T00:00:00-08:00[America/Los_Angeles]'
  },
  name: 'ZonedDateTime'
};

export const DateType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2000-06-05'
  },
  name: 'Date'
};

export const TimeType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '09:45'
  },
  name: 'Time'
};

export const CalendarDateRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2019-06-05 to 2019-07-05'
  },
  name: 'RangeValue<CalendarDate>'
};

export const CalendarDateTimeRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2020-02-03T12:23:24.120 to 2020-03-03T12:23:24.120'
  },
  name: 'RangeValue<CalendarDateTime>'
};

export const ZonedDateTimeRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2020-02-03T00:00:00-08:00[America/Los_Angeles] to 2020-03-03T00:00:00-08:00[America/Los_Angeles]'
  },
  name: 'RangeValue<ZonedDateTime>'
};

export const DateRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '2019-07-05 to 2019-07-10'
  },
  name: 'RangeValue<Date>'
};

export const TimeRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '09:45 to 10:50'
  },
  name: 'RangeValue<Time>'
};

export const Number: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: 10
  },
  name: 'Number'
};

export const NumberRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: '10 to 20'
  },
  name: 'RangeValue<Number>'
};

export const CustomComponent: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: 'Adobe (https://www.adobe.com)'
  },
  name: 'Custom component'
};

export const WithContextualHelp: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: 25,
    contextualHelp: 'Segments identify who your visitors are and where they navigated from.'
  },
  name: 'contextual help'
};
