import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';
import {RangeCalendar} from '../src';

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

function dateStringWithOffset(days = 0): string {
  let value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

const meta: Meta<typeof RangeCalendar> = {
  title: 'Date and Time/RangeCalendar',
  component: RangeCalendar,
  excludeStories: ['normalizeRange', 'toDateString'],
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
    allowsNonContiguousRanges: {
      control: 'boolean'
    },
    visibleMonths: {
      control: 'number'
    },
    firstDayOfWeek: {
      control: 'select',
      options: [undefined, 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    errorMessage: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function render(args: RangeCalendarStoryArgs) {
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
    `
  };
}

export const Default: Story = {
  render
};

export const DefaultValue: Story = {
  ...Default,
  args: {
    defaultValue: {
      start: dateParts(2019, 6, 5),
      end: dateParts(2019, 6, 10)
    }
  }
};

export const ControlledValue: Story = {
  ...Default,
  args: {
    value: {
      start: dateParts(2019, 6, 5),
      end: dateParts(2019, 6, 10)
    }
  }
};

export const WithTime: Story = {
  ...Default,
  args: {
    value: {
      start: '2019-06-05T08:00:00',
      end: '2019-06-10T12:00:00'
    }
  }
};

export const ZonedTime: Story = {
  ...Default,
  args: {
    value: {
      start: '2021-03-10T00:45-05:00[America/New_York]',
      end: '2021-03-26T18:05-07:00[America/Los_Angeles]'
    }
  },
  name: 'with zoned time'
};

export const OneWeek: Story = {
  ...Default,
  args: {
    minValue: dateStringWithOffset(0),
    maxValue: dateStringWithOffset(7)
  },
  name: 'minValue: today, maxValue: 1 week from now'
};

export const DefaultMinMax: Story = {
  ...Default,
  args: {
    defaultValue: {
      start: dateParts(2019, 6, 10),
      end: dateParts(2019, 6, 12)
    },
    minValue: dateParts(2019, 6, 5),
    maxValue: dateParts(2019, 6, 20)
  },
  name: 'defaultValue + minValue + maxValue'
};

export const DateUnavailable: Story = {
  ...Default,
  args: {
    isDateUnavailable: (date: Date) => {
      let start = dateStringWithOffset(2);
      let end = dateStringWithOffset(6);
      let value = date.toISOString().slice(0, 10);
      return value > start && value < end;
    }
  },
  name: 'isDateUnavailable'
};

export const MinValue: Story = {
  ...Default,
  args: {
    minValue: dateStringWithOffset(0)
  },
  name: 'minValue: today'
};

export const DefaultValVisibleMonths: Story = {
  ...Default,
  args: {
    visibleMonths: 3,
    defaultValue: {
      start: dateParts(2021, 10, 5),
      end: dateParts(2021, 12, 10)
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
