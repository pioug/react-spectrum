import {action} from 'storybook/actions';
import {CalendarDate, getLocalTimeZone, today} from '@internationalized/date';
import {computed, ref} from 'vue';
import {Flex} from '@vue-spectrum/layout';
import {Meta, StoryObj} from '@storybook/vue3-vite';
import {RangeCalendar} from '../src';
import {TimeField} from '@vue-spectrum/datepicker';

type DateRangeLike = {
  end?: unknown,
  start?: unknown
};

type RangeCalendarStoryArgs = {
  'aria-label'?: string,
  allowsNonContiguousRanges?: boolean,
  defaultValue?: DateRangeLike,
  errorMessage?: string,
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat',
  isDateUnavailable?: (date: Date) => boolean,
  isDisabled?: boolean,
  label?: string,
  maxValue?: unknown,
  minValue?: unknown,
  onChange?: (value: {end: string, start: string}) => void,
  value?: DateRangeLike,
  visibleMonths?: number
};

function toDateString(value: unknown): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    let match = value.match(/\d{4}-\d{2}-\d{2}/);
    return match?.[0] ?? '';
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return '';
    }
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'object') {
    let candidate = value as {day?: number, month?: number, toString?: () => string, year?: number};
    if (
      typeof candidate.year === 'number'
      && typeof candidate.month === 'number'
      && typeof candidate.day === 'number'
    ) {
      return `${candidate.year}-${String(candidate.month).padStart(2, '0')}-${String(candidate.day).padStart(2, '0')}`;
    }

    if (typeof candidate.toString === 'function') {
      let match = candidate.toString().match(/\d{4}-\d{2}-\d{2}/);
      return match?.[0] ?? '';
    }
  }

  return '';
}

function normalizeRange(value: DateRangeLike | undefined): {end: string, start: string} {
  return {
    start: toDateString(value?.start),
    end: toDateString(value?.end)
  };
}

function dateParts(year: number, month: number, day: number): {day: number, month: number, year: number} {
  return {year, month, day};
}

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
      let range = ref(normalizeRange(args.value ?? args.defaultValue));
      let minValue = computed(() => toDateString(args.minValue));
      let maxValue = computed(() => toDateString(args.maxValue));

      let handleChange = (value: {end: string, start: string}) => {
        range.value = value;
        args.onChange?.(value);
      };

      return {
        args,
        handleChange,
        maxValue,
        minValue,
        range
      };
    },
    template: `
      <div style="max-width: 100vw; overflow: auto;">
        <RangeCalendar
          :aria-label="args['aria-label']"
          :allows-non-contiguous-ranges="args.allowsNonContiguousRanges"
          :default-value="args.defaultValue"
          :error-message="args.errorMessage"
          :first-day-of-week="args.firstDayOfWeek"
          :is-date-unavailable="args.isDateUnavailable"
          :is-disabled="args.isDisabled"
          :label="args.label"
          :max-value="maxValue"
          :min-value="minValue"
          :value="args.value || range"
          :visible-months="args.visibleMonths"
          @change="handleChange" />
      </div>
    `
  };
}

function renderRangeCalendarWithTime(args: RangeCalendarStoryArgs, initialRange: {end: string, start: string}, initialTimes: {end: string, start: string}) {
  return {
    components: {Flex, RangeCalendar, TimeField},
    setup() {
      let range = ref(normalizeRange(args.value ?? initialRange));
      let minValue = computed(() => toDateString(args.minValue));
      let maxValue = computed(() => toDateString(args.maxValue));
      let startTime = ref(initialTimes.start);
      let endTime = ref(initialTimes.end);

      let handleChange = (value: {end: string, start: string}) => {
        range.value = value;
        args.onChange?.(value);
      };

      return {
        args,
        endTime,
        handleChange,
        maxValue,
        minValue,
        range,
        startTime
      };
    },
    template: `
      <Flex direction="column">
        <RangeCalendar
          :aria-label="args['aria-label']"
          :allows-non-contiguous-ranges="args.allowsNonContiguousRanges"
          :error-message="args.errorMessage"
          :first-day-of-week="args.firstDayOfWeek"
          :is-date-unavailable="args.isDateUnavailable"
          :is-disabled="args.isDisabled"
          :label="args.label"
          :max-value="maxValue"
          :min-value="minValue"
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
    start: '2019-06-05',
    end: '2019-06-10'
  }, {
    start: '8:00 AM',
    end: '12:00 PM'
  })
};

export const ZonedTime: Story = {
  render: (args) => renderRangeCalendarWithTime(args, {
    start: '2021-03-10',
    end: '2021-03-26'
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
    isDateUnavailable: (date: Date) => {
      let value = date.toISOString().slice(0, 10);
      let disabledIntervals = [
        [dateValueWithOffset(0).toString(), dateValueWithOffset(7).toString()],
        [dateValueWithOffset(14).toString(), dateValueWithOffset(21).toString()]
      ];
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
      start: dateParts(2021, 10, 3),
      end: dateParts(2021, 10, 16)
    },
    isDateUnavailable: (date: Date) => date.getDay() === 0 || date.getDay() === 6
  },
  name: 'isDateUnavailable, invalid'
};

export const Custom454Story: Story = {
  ...Default,
  args: {
    visibleMonths: 3,
    defaultValue: {
      start: dateParts(2023, 8, 6),
      end: dateParts(2023, 10, 7)
    }
  },
  name: 'Custom calendar'
};
