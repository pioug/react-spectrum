import {action} from 'storybook/actions';
import {ActionButton} from '@vue-spectrum/button';
import {Calendar} from '../src';
import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  parseZonedDateTime,
  today,
  type ZonedDateTime
} from '@internationalized/date';
import {Custom454Calendar} from '../../../@internationalized/date/tests/customCalendarImpl';
import {computed, ref} from 'vue';
import {Flex} from '@vue-spectrum/layout';
import {Meta, StoryObj} from '@storybook/vue3-vite';
import {Picker} from '@vue-spectrum/picker';
import {Provider} from '@vue-spectrum/provider';
import {TimeField} from '@vue-spectrum/datepicker';
import type {DateValue} from '@vue-types/calendar';

type CalendarStoryArgs = {
  'aria-label'?: string,
  defaultFocusedValue?: unknown,
  defaultValue?: unknown,
  errorMessage?: string,
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat',
  focusedValue?: unknown,
  isDateUnavailable?: (date: DateValue) => boolean,
  isDisabled?: boolean,
  label?: string,
  maxValue?: unknown,
  minValue?: unknown,
  onChange?: (value: DateValue | null) => void,
  onFocusChange?: (value: CalendarDate) => void,
  value?: unknown,
  visibleMonths?: number
};

type LocalePreference = {
  id: string,
  label: string,
  locale: string,
  ordering: string
};

type CalendarOption = {
  id: string,
  label: string
};

const preferences: LocalePreference[] = [
  {id: 'default', label: 'Default', locale: '', ordering: 'gregory'},
  {id: 'ar-DZ', label: 'Arabic (Algeria)', locale: 'ar-DZ', ordering: 'gregory islamic islamic-civil islamic-tbla'},
  {id: 'ar-AE', label: 'Arabic (United Arab Emirates)', locale: 'ar-AE', ordering: 'gregory islamic-umalqura islamic islamic-civil islamic-tbla'},
  {id: 'ar-EG', label: 'Arabic (Egypt)', locale: 'AR-EG', ordering: 'gregory coptic islamic islamic-civil islamic-tbla'},
  {id: 'ar-SA', label: 'Arabic (Saudi Arabia)', locale: 'ar-SA', ordering: 'islamic-umalqura gregory islamic islamic-rgsa'},
  {id: 'fa-AF', label: 'Farsi (Afghanistan)', locale: 'fa-AF', ordering: 'persian gregory islamic islamic-civil islamic-tbla'},
  {id: 'am-ET', label: 'Amharic (Ethiopia)', locale: 'am-ET', ordering: 'gregory ethiopic ethioaa'},
  {id: 'he-IL', label: 'Hebrew (Israel)', locale: 'he-IL', ordering: 'gregory hebrew islamic islamic-civil islamic-tbla'},
  {id: 'hi-IN', label: 'Hindi (India)', locale: 'hi-IN', ordering: 'gregory indian'},
  {id: 'ja-JP', label: 'Japanese (Japan)', locale: 'ja-JP', ordering: 'gregory japanese'},
  {id: 'th-TH', label: 'Thai (Thailand)', locale: 'th-TH', ordering: 'buddhist gregory'},
  {id: 'zh-TW', label: 'Chinese (Taiwan)', locale: 'zh-TW', ordering: 'gregory roc chinese'}
];

const calendars: CalendarOption[] = [
  {id: 'gregory', label: 'Gregorian'},
  {id: 'japanese', label: 'Japanese'},
  {id: 'buddhist', label: 'Buddhist'},
  {id: 'roc', label: 'Taiwan'},
  {id: 'persian', label: 'Persian'},
  {id: 'indian', label: 'Indian'},
  {id: 'islamic-umalqura', label: 'Islamic (Umm al-Qura)'},
  {id: 'islamic-civil', label: 'Islamic Civil'},
  {id: 'islamic-tbla', label: 'Islamic Tabular'},
  {id: 'hebrew', label: 'Hebrew'},
  {id: 'coptic', label: 'Coptic'},
  {id: 'ethiopic', label: 'Ethiopic'},
  {id: 'ethioaa', label: 'Ethiopic (Amete Alem)'}
];

function dateValueWithOffset(days = 0): CalendarDate {
  return today(getLocalTimeZone()).add({days});
}

const meta: Meta<typeof Calendar> = {
  title: 'Date and Time/Calendar',
  component: Calendar,
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
    isReadOnly: {
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
    'aria-label': {
      control: 'text'
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

function renderCalendarExample(args: CalendarStoryArgs) {
  return {
    components: {Calendar, Flex, Picker, Provider},
    setup() {
      let selected = ref<DateValue | null>((args.value ?? args.defaultValue ?? null) as DateValue | null);
      let focused = ref<CalendarDate | null>((args.focusedValue ?? args.defaultFocusedValue ?? null) as CalendarDate | null);
      let locale = ref(preferences[0].id);
      let calendar = ref(calendars[0].id);
      let defaultLocale = ref(Intl.DateTimeFormat().resolvedOptions().locale || 'en-US');

      let localeItems = computed(() => preferences.map((item) => ({
        id: item.id,
        label: item.label
      })));

      let preferredCalendars = computed(() => {
        let preference = preferences.find((item) => item.id === locale.value) ?? preferences[0];
        let preferredIds = preference.ordering.split(' ');
        return preferredIds
          .map((id) => calendars.find((calendarOption) => calendarOption.id === id))
          .filter((calendarOption): calendarOption is CalendarOption => Boolean(calendarOption));
      });

      let calendarItems = computed(() => {
        let preferredIds = new Set(preferredCalendars.value.map((item) => item.id));
        let preferred = preferredCalendars.value.map((item) => ({id: item.id, label: item.label}));
        let others = calendars
          .filter((item) => !preferredIds.has(item.id))
          .map((item) => ({id: item.id, label: item.label}));
        return [...preferred, ...others];
      });

      let providerLocale = computed(() => {
        let preference = preferences.find((item) => item.id === locale.value) ?? preferences[0];
        let baseLocale = preference.locale || defaultLocale.value;
        let preferredDefault = preferredCalendars.value[0]?.id;
        if (calendar.value && preferredDefault && calendar.value !== preferredDefault) {
          return `${baseLocale}-u-ca-${calendar.value}`;
        }

        return baseLocale;
      });

      let updateLocale = (nextLocale: string) => {
        locale.value = nextLocale;
        let preference = preferences.find((item) => item.id === nextLocale) ?? preferences[0];
        calendar.value = preference.ordering.split(' ')[0];
      };

      let handleChange = (value: DateValue | null) => {
        selected.value = value;
        args.onChange?.(value);
      };

      let handleFocusChange = (value: CalendarDate) => {
        focused.value = value;
        args.onFocusChange?.(value);
      };

      return {
        args,
        calendar,
        calendarItems,
        focused,
        handleChange,
        handleFocusChange,
        locale,
        localeItems,
        providerLocale,
        selected,
        updateLocale
      };
    },
    template: `
      <Flex direction="column" gap="size-600" align-items="center">
        <Flex direction="column" gap="size-150" style="width: 156px;">
          <Picker
            label="Locale"
            :items="localeItems"
            :model-value="locale"
            @update:model-value="updateLocale" />
          <Picker
            label="Calendar"
            :items="calendarItems"
            :model-value="calendar"
            @update:model-value="calendar = $event" />
        </Flex>
        <Provider :locale="providerLocale">
          <div style="max-width: 100vw; overflow: auto; padding: 10px;">
            <Calendar
              :aria-label="args['aria-label']"
              :default-focused-value="args.defaultFocusedValue"
              :default-value="args.defaultValue"
              :error-message="args.errorMessage"
              :first-day-of-week="args.firstDayOfWeek"
              :focused-value="args.focusedValue ?? focused"
              :is-date-unavailable="args.isDateUnavailable"
              :is-disabled="args.isDisabled"
              :label="args.label"
              :max-value="args.maxValue"
              :min-value="args.minValue"
              :value="args.value ?? selected"
              :visible-months="args.visibleMonths"
              @change="handleChange"
              @focus-change="handleFocusChange" />
          </div>
        </Provider>
      </Flex>
    `
  };
}

function renderCalendarWithTime(args: CalendarStoryArgs, initialValue: DateValue, initialTime: string) {
  return {
    components: {Calendar, Flex, TimeField},
    setup() {
      let selected = ref<DateValue | null>((args.value ?? initialValue) as DateValue | null);
      let timeValue = ref(initialTime);

      let handleChange = (value: DateValue | null) => {
        selected.value = value;
        args.onChange?.(value);
      };

      return {
        args,
        handleChange,
        selected,
        timeValue
      };
    },
    template: `
      <Flex direction="column">
        <Calendar
          :aria-label="args['aria-label']"
          :default-focused-value="args.defaultFocusedValue"
          :default-value="args.defaultValue"
          :error-message="args.errorMessage"
          :first-day-of-week="args.firstDayOfWeek"
          :is-date-unavailable="args.isDateUnavailable"
          :is-disabled="args.isDisabled"
          :label="args.label"
          :max-value="args.maxValue"
          :min-value="args.minValue"
          :value="selected"
          :visible-months="args.visibleMonths"
          @change="handleChange" />
        <TimeField
          label="Time"
          :model-value="timeValue"
          @update:model-value="timeValue = $event" />
      </Flex>
    `
  };
}

function renderControlledFocus(
  args: CalendarStoryArgs,
  initialFocusedDate: CalendarDate,
  createCalendarFactory?: () => Custom454Calendar
) {
  return {
    components: {ActionButton, Calendar, Flex},
    setup() {
      let focused = ref<CalendarDate>(initialFocusedDate.copy());

      let resetFocusedDate = () => {
        focused.value = initialFocusedDate.copy();
      };

      return {
        args,
        createCalendarFactory,
        focused,
        resetFocusedDate
      };
    },
    template: `
      <Flex direction="column" align-items="start" gap="size-200">
        <ActionButton @click="resetFocusedDate">Reset focused date</ActionButton>
        <Calendar
          :aria-label="args['aria-label']"
          :create-calendar="createCalendarFactory"
          :error-message="args.errorMessage"
          :first-day-of-week="args.firstDayOfWeek"
          :focused-value="focused"
          :is-date-unavailable="args.isDateUnavailable"
          :is-disabled="args.isDisabled"
          :label="args.label"
          :visible-months="args.visibleMonths"
          @focus-change="focused = $event" />
      </Flex>
    `
  };
}

export const Default: Story = {
  render: renderCalendarExample
};

export const DefaultValue: Story = {
  ...Default,
  args: {
    defaultValue: new CalendarDate(2019, 6, 5)
  }
};

export const ControlledValue: Story = {
  ...Default,
  args: {
    value: new CalendarDate(2019, 5, 5)
  }
};

export const WithTime: Story = {
  render: (args) => renderCalendarWithTime(args, new CalendarDateTime(2019, 6, 5, 8), '8:00 AM')
};

export const ZonedTime: Story = {
  render: (args) => renderCalendarWithTime(args, parseZonedDateTime('2021-03-14T00:45-08:00[America/Los_Angeles]') as ZonedDateTime, '12:45 AM'),
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
    defaultValue: new CalendarDate(2019, 6, 10),
    minValue: new CalendarDate(2019, 6, 5),
    maxValue: new CalendarDate(2019, 6, 20)
  },
  name: 'defaultValue + minValue + maxValue'
};

export const DateUnavailable: Story = {
  ...Default,
  args: {
    defaultValue: dateValueWithOffset(1),
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

export const MinValueDefaultVal: Story = {
  ...Default,
  args: {
    minValue: dateValueWithOffset(0),
    defaultValue: new CalendarDate(2019, 6, 5)
  },
  name: 'minValue: today, defaultValue'
};

export const DefaultFocusedValue: Story = {
  ...Default,
  args: {
    defaultFocusedValue: new CalendarDate(2019, 6, 5)
  },
  name: 'defaultFocusedValue'
};

export const FocusedValue: Story = {
  render: (args) => renderControlledFocus(args, new CalendarDate(2019, 6, 5)),
  name: 'focusedValue'
};

export const Custom454Example: Story = {
  render: (args) => renderControlledFocus(args, new CalendarDate(2023, 2, 5), () => new Custom454Calendar()),
  name: 'Custom calendar'
};
