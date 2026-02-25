import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';
import {Calendar} from '../src';

type CalendarStoryArgs = {
  'aria-label'?: string,
  defaultFocusedValue?: unknown,
  defaultValue?: unknown,
  errorMessage?: string,
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat',
  focusedValue?: unknown,
  isDateUnavailable?: (date: Date) => boolean,
  isDisabled?: boolean,
  label?: string,
  maxValue?: unknown,
  minValue?: unknown,
  onChange?: (value: string) => void,
  value?: unknown,
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

function dateParts(year: number, month: number, day: number): {day: number, month: number, year: number} {
  return {year, month, day};
}

function dateStringWithOffset(days = 0): string {
  let value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

const meta: Meta<typeof Calendar> = {
  title: 'Date and Time/Calendar',
  component: Calendar,
  excludeStories: ['toDateString'],
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
    defaultFocusedValue: {
      table: {
        disable: true
      }
    },
    isDisabled: {
      control: 'boolean'
    },
    visibleMonths: {
      control: 'number'
    },
    firstDayOfWeek: {
      control: 'select',
      options: [undefined, 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    },
    'aria-label': {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function render(args: CalendarStoryArgs) {
  return {
    components: {Calendar},
    setup() {
      let selected = ref(toDateString(args.value ?? args.defaultValue));
      let focused = ref(toDateString(args.focusedValue ?? args.defaultFocusedValue) || null);
      let minValue = computed(() => toDateString(args.minValue));
      let maxValue = computed(() => toDateString(args.maxValue));

      let handleChange = (value: string) => {
        selected.value = value;
        args.onChange?.(value);
      };

      return {
        args,
        focused,
        handleChange,
        maxValue,
        minValue,
        selected
      };
    },
    template: `
      <Calendar
        :aria-label="args['aria-label']"
        :default-focused-value="args.defaultFocusedValue"
        :default-value="args.defaultValue"
        :error-message="args.errorMessage"
        :first-day-of-week="args.firstDayOfWeek"
        :focused-value="args.focusedValue || focused"
        :is-date-unavailable="args.isDateUnavailable"
        :is-disabled="args.isDisabled"
        :label="args.label"
        :max-value="maxValue"
        :min-value="minValue"
        :value="args.value || selected"
        :visible-months="args.visibleMonths"
        @change="handleChange"
        @focus-change="focused = $event" />
    `
  };
}

export const Default: Story = {
  render
};

export const DefaultValue: Story = {
  ...Default,
  args: {
    defaultValue: dateParts(2019, 6, 5)
  }
};

export const ControlledValue: Story = {
  ...Default,
  args: {
    value: dateParts(2019, 5, 5)
  }
};

export const WithTime: Story = {
  ...Default,
  args: {
    value: '2019-06-05T08:00:00'
  }
};

export const ZonedTime: Story = {
  ...Default,
  args: {
    value: '2021-03-14T00:45-08:00[America/Los_Angeles]'
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
    defaultValue: dateParts(2019, 6, 10),
    minValue: dateParts(2019, 6, 5),
    maxValue: dateParts(2019, 6, 20)
  },
  name: 'defaultValue + minValue + maxValue'
};

export const DateUnavailable: Story = {
  ...Default,
  args: {
    defaultValue: dateStringWithOffset(1),
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

export const MinValueDefaultVal: Story = {
  ...Default,
  args: {
    minValue: dateStringWithOffset(0),
    defaultValue: dateParts(2019, 6, 5)
  },
  name: 'minValue: today, defaultValue'
};

export const DefaultFocusedValue: Story = {
  ...Default,
  args: {
    defaultFocusedValue: dateParts(2019, 6, 5)
  },
  name: 'defaultFocusedValue'
};

export const FocusedValue: Story = {
  render: (args: CalendarStoryArgs) => ({
    components: {Calendar},
    setup() {
      let focused = ref<unknown>(dateParts(2019, 6, 5));
      return {args, focused};
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <button type="button" @click="focused = new Date(2019, 5, 5)">Reset focused date</button>
        <Calendar
          :aria-label="args['aria-label']"
          :focused-value="focused"
          @focus-change="focused = $event" />
      </div>
    `
  }),
  name: 'focusedValue'
};

export const Custom454Example: Story = {
  ...Default,
  args: {
    defaultValue: dateParts(2023, 2, 5),
    firstDayOfWeek: 'mon'
  },
  name: 'Custom calendar'
};
