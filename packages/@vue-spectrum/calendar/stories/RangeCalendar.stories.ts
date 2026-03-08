import {action} from 'storybook/actions';
import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  isWeekend,
  parseZonedDateTime,
  today
} from '@internationalized/date';
import {Custom454Calendar} from '../../../@internationalized/date/tests/customCalendarImpl';
import {ref} from 'vue';
import {Flex} from '@vue-spectrum/layout';
import {Meta, StoryObj} from '@storybook/vue3-vite';
import {RangeCalendar} from '../src';
import {TimeField} from '@vue-spectrum/datepicker';
import type {DateValue} from '@vue-types/calendar';

type DateRangeLike = {
  end?: unknown,
  start?: unknown
};

type RangeCalendarStoryArgs = {
  'aria-label'?: string,
  allowsNonContiguousRanges?: boolean,
  createCalendar?: () => Custom454Calendar,
  defaultValue?: DateRangeLike,
  errorMessage?: string,
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat',
  isDateUnavailable?: (date: DateValue) => boolean,
  isDisabled?: boolean,
  label?: string,
  maxValue?: unknown,
  minValue?: unknown,
  onChange?: (value: {end: DateValue | null, start: DateValue | null} | null) => void,
  value?: DateRangeLike,
  visibleMonths?: number
};

function dateValueWithOffset(days = 0): CalendarDate {
  return today(getLocalTimeZone()).add({days});
}

const meta: Meta<typeof RangeCalendar> = {
  title: 'Date and Time/RangeCalendar',
  component: RangeCalendar,
  args: {
    onChange: action('onChange')
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    defaultValue: {
      table: {
        disable: true
      }
    },
    minValue: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    },
    maxValue: {
      table: {
        disable: true
      }
    },
    isDisabled: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    allowsNonContiguousRanges: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    visibleMonths: {
      control: 'number'
    },
    pageBehavior: {
      control: 'select',
      options: [null, 'single', 'visible']
    },
    firstDayOfWeek: {
      control: 'select',
      options: [undefined, 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    isInvalid: {
      control: 'boolean'
    },
    errorMessage: {
      control: 'text'
    },
    selectionAlignment: {
      control: 'select',
      options: ['start', 'center', 'end']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderRangeCalendar(args: RangeCalendarStoryArgs) {
  return {
    components: {RangeCalendar},
    setup() {
      let range = ref<{end: DateValue | null, start: DateValue | null} | null>(
        (args.value ?? args.defaultValue ?? null) as {end: DateValue | null, start: DateValue | null} | null
      );

      let handleChange = (value: {end: DateValue | null, start: DateValue | null} | null) => {
        range.value = value;
        args.onChange?.(value);
      };

      return {
        args,
        handleChange,
        range
      };
    },
    template: `
      <div style="max-width: 100vw; overflow: auto;">
        <RangeCalendar
          :aria-label="args['aria-label']"
          :allows-non-contiguous-ranges="args.allowsNonContiguousRanges"
          :create-calendar="args.createCalendar"
          :default-value="args.defaultValue"
          :error-message="args.errorMessage"
          :first-day-of-week="args.firstDayOfWeek"
          :is-date-unavailable="args.isDateUnavailable"
          :is-disabled="args.isDisabled"
          :label="args.label"
          :max-value="args.maxValue"
          :min-value="args.minValue"
          :value="args.value ?? range"
          :visible-months="args.visibleMonths"
          @change="handleChange" />
      </div>
    `
  };
}

function renderRangeCalendarWithTime(
  args: RangeCalendarStoryArgs,
  initialRange: {end: DateValue, start: DateValue},
  initialTimes: {end: string, start: string}
) {
  return {
    components: {Flex, RangeCalendar, TimeField},
    setup() {
      let range = ref<{end: DateValue, start: DateValue}>((args.value ?? initialRange) as {end: DateValue, start: DateValue});
      let startTime = ref(initialTimes.start);
      let endTime = ref(initialTimes.end);

      let handleChange = (value: {end: DateValue | null, start: DateValue | null} | null) => {
        if (value?.start && value.end) {
          range.value = value as {end: DateValue, start: DateValue};
        }
        args.onChange?.(value);
      };

      return {
        args,
        endTime,
        handleChange,
        range,
        startTime
      };
    },
    template: `
      <Flex direction="column">
        <RangeCalendar
          :aria-label="args['aria-label']"
          :allows-non-contiguous-ranges="args.allowsNonContiguousRanges"
          :create-calendar="args.createCalendar"
          :error-message="args.errorMessage"
          :first-day-of-week="args.firstDayOfWeek"
          :is-date-unavailable="args.isDateUnavailable"
          :is-disabled="args.isDisabled"
          :label="args.label"
          :max-value="args.maxValue"
          :min-value="args.minValue"
          :value="range"
          :visible-months="args.visibleMonths"
          @change="handleChange" />
        <Flex gap="size-100">
          <TimeField
            label="Start time"
            :model-value="startTime"
            @update:model-value="startTime = $event" />
          <TimeField
            label="End time"
            :model-value="endTime"
            @update:model-value="endTime = $event" />
        </Flex>
      </Flex>
    `
  };
}

export const Default: Story = {
  render: renderRangeCalendar
};

export const DefaultValue: Story = {
  ...Default,
  args: {
    defaultValue: {
      start: new CalendarDate(2019, 6, 5),
      end: new CalendarDate(2019, 6, 10)
    }
  }
};

export const ControlledValue: Story = {
  ...Default,
  args: {
    value: {
      start: new CalendarDate(2019, 6, 5),
      end: new CalendarDate(2019, 6, 10)
    }
  }
};

export const WithTime: Story = {
  render: (args) => renderRangeCalendarWithTime(args, {
    start: new CalendarDateTime(2019, 6, 5, 8),
    end: new CalendarDateTime(2019, 6, 10, 12)
  }, {
    start: '8:00 AM',
    end: '12:00 PM'
  })
};

export const ZonedTime: Story = {
  render: (args) => renderRangeCalendarWithTime(args, {
    start: parseZonedDateTime('2021-03-10T00:45-05:00[America/New_York]'),
    end: parseZonedDateTime('2021-03-26T18:05-07:00[America/Los_Angeles]')
  }, {
    start: '12:45 AM',
    end: '6:05 PM'
  }),
  name: 'with zoned time'
};

export const OneWeek: Story = {
  ...Default,
  args: {
    minValue: dateValueWithOffset(0),
    maxValue: today(getLocalTimeZone()).add({weeks: 1})
  },
  name: 'minValue: today, maxValue: 1 week from now'
};

export const DefaultMinMax: Story = {
  ...Default,
  args: {
    defaultValue: {
      start: new CalendarDate(2019, 6, 10),
      end: new CalendarDate(2019, 6, 12)
    },
    minValue: new CalendarDate(2019, 6, 5),
    maxValue: new CalendarDate(2019, 6, 20)
  },
  name: 'defaultValue + minValue + maxValue'
};

export const DateUnavailable: Story = {
  ...Default,
  args: {
    isDateUnavailable: (date: DateValue) => {
      let disabledIntervals = [
        [dateValueWithOffset(0).toString(), dateValueWithOffset(7).toString()],
        [dateValueWithOffset(14).toString(), dateValueWithOffset(21).toString()]
      ];
      let value = date.toString();
      return disabledIntervals.some(([start, end]) => value > start && value < end);
    }
  },
  name: 'isDateUnavailable'
};

export const MinValue: Story = {
  ...Default,
  args: {
    minValue: dateValueWithOffset(0)
  },
  name: 'minValue: today'
};

export const DefaultValVisibleMonths: Story = {
  ...Default,
  args: {
    visibleMonths: 3,
    defaultValue: {
      start: new CalendarDate(2021, 10, 5),
      end: new CalendarDate(2021, 12, 10)
    }
  },
  name: 'defaultValue, visibleMonths: 3'
};

export const DateUnavailableInvalid: Story = {
  ...Default,
  args: {
    allowsNonContiguousRanges: true,
    defaultValue: {
      start: new CalendarDate(2021, 10, 3),
      end: new CalendarDate(2021, 10, 16)
    },
    isDateUnavailable: (date: DateValue) => isWeekend(date, Intl.DateTimeFormat().resolvedOptions().locale || 'en-US')
  },
  name: 'isDateUnavailable, invalid'
};

export const Custom454Story: Story = {
  render: (args) => renderRangeCalendar({
    ...args,
    createCalendar: () => new Custom454Calendar(),
    visibleMonths: 3,
    defaultValue: {
      start: new CalendarDate(2023, 8, 6),
      end: new CalendarDate(2023, 10, 7)
    }
  }),
  name: 'Custom calendar'
};
