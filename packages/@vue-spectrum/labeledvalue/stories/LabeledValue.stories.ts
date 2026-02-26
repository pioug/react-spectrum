/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {CalendarDate, CalendarDateTime, Time, ZonedDateTime} from '@internationalized/date';
import {Content} from '@vue-spectrum/view';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Heading} from '@vue-spectrum/text';
import {LabeledValue} from '../src';
import {Link} from '@vue-spectrum/link';
import {h} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof LabeledValue> = {
  title: 'LabeledValue',
  component: LabeledValue,
  argTypes: {
    labelAlign: {
      control: {
        type: 'radio',
        options: ['start', 'end']
      }
    },
    labelPosition: {
      control: {
        type: 'radio',
        options: [null, 'top', 'side']
      }
    },
    width: {
      control: {
        type: 'radio',
        options: [null, '300px', '600px']
      }
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
  args: {label: 'Test', value: 'foo '.repeat(20)},
  name: 'String'
};

export const StringArray: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: ['wow', 'cool', 'awesome']},
  name: 'String array'
};

export const CalendarDateType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: new CalendarDate(2019, 6, 5)},
  name: 'CalendarDate'
};

export const CalendarDateTimeType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: new CalendarDateTime(2020, 2, 3, 12, 23, 24, 120)},
  name: 'CalendarDateTime'
};

export const CalendarDateTimeTypeFormatOptions: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: new CalendarDateTime(2020, 2, 3, 12, 23, 24, 120),
    formatOptions: {dateStyle: 'short', timeStyle: 'short'}
  },
  name: 'CalendarDateTime with formatOptions'
};

export const ZonedDateTimeType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: new ZonedDateTime(2020, 2, 3, 'America/Los_Angeles', -28800000)},
  name: 'ZonedDateTime'
};

export const DateType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: new Date(2000, 5, 5)},
  name: 'Date'
};

export const TimeType: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: new Time(9, 45)},
  name: 'Time'
};

export const CalendarDateRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: {start: new CalendarDate(2019, 6, 5), end: new CalendarDate(2019, 7, 5)}},
  name: 'RangeValue<CalendarDate>'
};

export const CalendarDateTimeRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: {start: new CalendarDateTime(2020, 2, 3, 12, 23, 24, 120), end: new CalendarDateTime(2020, 3, 3, 12, 23, 24, 120)}},
  name: 'RangeValue<CalendarDateTime>'
};

export const ZonedDateTimeRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: {start: new ZonedDateTime(2020, 2, 3, 'America/Los_Angeles', -28800000), end: new ZonedDateTime(2020, 3, 3, 'America/Los_Angeles', -28800000)}},
  name: 'RangeValue<ZonedDateTime>'
};

export const DateRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: {start: new Date(2019, 6, 5), end: new Date(2019, 6, 10)}},
  name: 'RangeValue<Date>'
};

export const TimeRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: {start: new Time(9, 45), end: new Time(10, 50)}},
  name: 'RangeValue<Time>'
};

export const Number: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: 10},
  name: 'Number'
};

export const NumberRange: Story = {
  render: (args) => renderLabeledValue(args),
  args: {label: 'Test', value: {start: 10, end: 20}},
  name: 'RangeValue<Number>'
};

export const CustomComponent: Story = {
  render: (args) => renderLabeledValue(args),
  args: {
    label: 'Test',
    value: h(Link, {href: 'https://www.adobe.com'}, () => 'Adobe')
  },
  name: 'Custom component'
};

export const WithContextualHelp: Story = {
  render: (args) => ({
    components: {
      Content,
      ContextualHelp,
      Heading,
      LabeledValue
    },
    setup() {
      return {args};
    },
    template: `
      <LabeledValue v-bind="args">
        <template #contextualHelp>
          <ContextualHelp>
            <Heading element-type="h3">What is a segment?</Heading>
            <Content>Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.</Content>
          </ContextualHelp>
        </template>
      </LabeledValue>
    `
  }),
  args: {
    label: 'Test',
    value: 25
  },
  name: 'contextual help'
};
