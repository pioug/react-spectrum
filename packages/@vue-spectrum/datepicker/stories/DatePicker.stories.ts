import {ActionButton} from '@vue-spectrum/button';
import {DatePicker} from '../src';
import {action} from 'storybook/actions';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const UNAVAILABLE_INTERVALS = [
  {start: '2026-03-01', end: '2026-03-08'},
  {start: '2026-03-15', end: '2026-03-22'}
];

const CALENDARS = [
  {key: 'gregory', name: 'Gregorian'},
  {key: 'japanese', name: 'Japanese'},
  {key: 'buddhist', name: 'Buddhist'},
  {key: 'roc', name: 'Taiwan'},
  {key: 'persian', name: 'Persian'},
  {key: 'indian', name: 'Indian'},
  {key: 'islamic-umalqura', name: 'Islamic (Umm al-Qura)'},
  {key: 'islamic-civil', name: 'Islamic Civil'},
  {key: 'islamic-tbla', name: 'Islamic Tabular'},
  {key: 'hebrew', name: 'Hebrew'},
  {key: 'coptic', name: 'Coptic'},
  {key: 'ethiopic', name: 'Ethiopic'}
];

const LOCALE_PREFERENCES = [
  {locale: '', label: 'Default', ordering: 'gregory'},
  {locale: 'ar-DZ', label: 'Arabic (Algeria)', ordering: 'gregory islamic islamic-civil islamic-tbla'},
  {locale: 'ar-AE', label: 'Arabic (United Arab Emirates)', ordering: 'gregory islamic-umalqura islamic islamic-civil islamic-tbla'},
  {locale: 'ar-EG', label: 'Arabic (Egypt)', ordering: 'gregory coptic islamic islamic-civil islamic-tbla'},
  {locale: 'ar-SA', label: 'Arabic (Saudi Arabia)', ordering: 'islamic-umalqura gregory islamic islamic-tbla'},
  {locale: 'fa-AF', label: 'Farsi (Afghanistan)', ordering: 'persian gregory islamic islamic-civil islamic-tbla'},
  {locale: 'am-ET', label: 'Amharic (Ethiopia)', ordering: 'gregory ethiopic'},
  {locale: 'he-IL', label: 'Hebrew (Israel)', ordering: 'gregory hebrew islamic islamic-civil islamic-tbla'},
  {locale: 'hi-IN', label: 'Hindi (India)', ordering: 'gregory indian'},
  {locale: 'bn-IN', label: 'Bengali (India)', ordering: 'gregory indian'},
  {locale: 'ja-JP', label: 'Japanese (Japan)', ordering: 'gregory japanese'},
  {locale: 'th-TH', label: 'Thai (Thailand)', ordering: 'buddhist gregory'},
  {locale: 'zh-TW', label: 'Chinese (Taiwan)', ordering: 'gregory roc'}
];

const meta: Meta<typeof DatePicker> = {
  title: 'Date and Time/DatePicker',
  component: DatePicker,
  parameters: {
    actions: {
      argTypesRegex: '^$'
    }
  },
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
    value: {
      table: {
        disable: true
      }
    },
    minValue: {
      table: {
        disable: true
      }
    },
    maxValue: {
      table: {
        disable: true
      }
    },
    placeholderValue: {
      table: {
        disable: true
      }
    },
    onBlur: {
      table: {
        disable: true
      }
    },
    onFocus: {
      table: {
        disable: true
      }
    },
    onFocusChange: {
      table: {
        disable: true
      }
    },
    onKeyDown: {
      table: {
        disable: true
      }
    },
    onKeyUp: {
      table: {
        disable: true
      }
    },
    onOpenChange: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    isDateUnavailable: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second']
    },
    hourCycle: {
      control: 'select',
      options: [12, 24]
    },
    hideTimeZone: {
      control: 'boolean'
    },
    shouldForceLeadingZeros: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    validationState: {
      control: 'select',
      options: [null, 'valid', 'invalid']
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    labelAlign: {
      control: 'select',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    autoFocus: {
      control: 'boolean'
    },
    showFormatHelpText: {
      control: 'boolean'
    },
    'aria-label': {
      control: 'text'
    },
    width: {
      control: 'text'
    },
    maxVisibleMonths: {
      control: 'number'
    },
    shouldFlip: {
      control: 'boolean'
    },
    defaultOpen: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    firstDayOfWeek: {
      control: 'select',
      options: [undefined, 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function toComparableDate(input: string): string {
  if (!input) {
    return '';
  }
  return input.slice(0, 10);
}

function inUnavailableInterval(value: string) {
  let date = toComparableDate(value);
  if (!date) {
    return false;
  }
  return UNAVAILABLE_INTERVALS.some((interval) => date > interval.start && date < interval.end);
}

function render(args: StoryArgs = {}) {
  return {
    components: {DatePicker},
    setup() {
      return {args};
    },
    template: '<DatePicker label="Date" v-bind="args" style="max-width: calc(100vw - 40px);" />'
  };
}

function renderControlledExample(args: StoryArgs) {
  return {
    components: {ActionButton, DatePicker},
    setup() {
      let value = ref(typeof args.modelValue === 'string' ? args.modelValue : '2020-02-03');
      return {
        args,
        onChange: action('onChange'),
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; justify-items: start;">
        <DatePicker
          v-bind="args"
          label="Controlled"
          :model-value="value"
          @update:model-value="value = $event"
          @change="onChange($event)" />
        <ActionButton @press="value = '2020-02-03'">Change value</ActionButton>
        <ActionButton @press="value = ''">Clear</ActionButton>
      </div>
    `
  };
}

function renderDateUnavailableExample(args: StoryArgs) {
  return {
    components: {DatePicker},
    setup() {
      let value = ref('');
      let isInvalid = computed(() => inUnavailableInterval(value.value));
      return {
        args,
        isInvalid,
        value
      };
    },
    template: `
      <DatePicker
        v-bind="args"
        :model-value="value"
        :is-invalid="isInvalid"
        :validation-state="isInvalid ? 'invalid' : undefined"
        description="Selected date may not be in unavailable intervals."
        @update:model-value="value = $event" />
    `
  };
}

function renderEventsExample(args: StoryArgs) {
  return {
    components: {DatePicker},
    setup() {
      let onBlur = action('onBlur');
      let onFocus = action('onFocus');
      let onFocusChange = action('onFocusChange');
      let onKeyDown = action('onKeyDown');
      let onKeyUp = action('onKeyUp');
      let onOpenChange = action('onOpenChange');

      return {
        args,
        onBlur,
        onFocus,
        onFocusChange,
        onKeyDown,
        onKeyUp,
        onOpenChange
      };
    },
    template: `
      <div @keydown="onKeyDown($event)" @keyup="onKeyUp($event)">
        <DatePicker
          v-bind="args"
          @focus="onFocus($event); onFocusChange(true)"
          @blur="onBlur($event); onFocusChange(false)"
          @open="onOpenChange(true)"
          @close="onOpenChange(false)" />
      </div>
    `
  };
}

function renderCalendarPreferenceExample(args: StoryArgs) {
  return {
    components: {DatePicker},
    setup() {
      let locale = ref(LOCALE_PREFERENCES[0].locale);
      let calendar = ref(CALENDARS[0].key);

      let preferredCalendars = computed(() => {
        let pref = LOCALE_PREFERENCES.find((entry) => entry.locale === locale.value);
        if (!pref) {
          return [CALENDARS[0]];
        }
        return pref.ordering
          .split(' ')
          .map((key) => CALENDARS.find((calendarItem) => calendarItem.key === key))
          .filter((calendarItem): calendarItem is {key: string, name: string} => Boolean(calendarItem));
      });

      let otherCalendars = computed(() => CALENDARS.filter((calendarItem) => !preferredCalendars.value.some((preferred) => preferred.key === calendarItem.key)));

      let updateLocale = (nextLocale: string) => {
        locale.value = nextLocale;
        let pref = LOCALE_PREFERENCES.find((entry) => entry.locale === nextLocale);
        if (!pref) {
          calendar.value = CALENDARS[0].key;
          return;
        }
        calendar.value = pref.ordering.split(' ')[0];
      };
      let readLocaleValue = (event: Event) => {
        let target = event.target;
        return target instanceof HTMLSelectElement ? target.value : LOCALE_PREFERENCES[0].locale;
      };

      return {
        args,
        calendar,
        locale,
        localePreferences: LOCALE_PREFERENCES,
        otherCalendars,
        preferredCalendars,
        readLocaleValue,
        updateLocale
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 540px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <label style="display: grid; gap: 4px;">
            <span>Locale</span>
            <select :value="locale" @change="updateLocale(readLocaleValue($event))">
              <option v-for="item in localePreferences" :key="item.locale" :value="item.locale">{{item.label}}</option>
            </select>
          </label>
          <label style="display: grid; gap: 4px;">
            <span>Calendar</span>
            <select v-model="calendar">
              <optgroup label="Preferred">
                <option v-for="item in preferredCalendars" :key="item.key" :value="item.key">{{item.name}}</option>
              </optgroup>
              <optgroup label="Other">
                <option v-for="item in otherCalendars" :key="item.key" :value="item.key">{{item.name}}</option>
              </optgroup>
            </select>
          </label>
        </div>
        <DatePicker
          v-bind="args"
          label="Custom 4-5-4 calendar"
          :description="'Locale: ' + (locale || 'default') + ', calendar: ' + calendar" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => render(args)
};

export const DefaultValue: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2020-02-03'
  })
};

export const ControlledValue: Story = {
  render: (args) => renderControlledExample({
    ...args,
    modelValue: '2020-02-03'
  })
};

export const DefaultValueZoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2020-02-03T00:00:00-08:00',
    description: 'default value date, zoned'
  }),
  name: 'defaultValue date, zoned'
};

export const DateTimeValue: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-03-14T08:45'
  })
};

export const DateTimeValueZoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-11-07T00:45-07:00[America/Los_Angeles]'
  })
};

export const DateTimeValueAbsolute: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-11-07T07:45:00Z'
  })
};

export const DateTimeValueAbsoluteZoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-11-07T07:45:00Z America/New_York'
  })
};

export const MinMaxValue: Story = {
  render: (args) => render({
    ...args,
    min: '2010-01-01',
    max: '2020-01-01'
  }),
  name: 'minValue: 2010/1/1, maxValue: 2020/1/1'
};

export const PlaceholderVal: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01'
  }),
  name: 'placeholder value: 1980/1/1'
};

export const PlaceholderValTime: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01T08:00'
  }),
  name: 'placeholder value: 1980/1/1 8AM'
};

export const PlaceholderValTimeZoned: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01 America/Los_Angeles'
  }),
  name: 'placeholder value: 1980/1/1 zoned'
};

export const DateUnavailable: Story = {
  render: (args) => renderDateUnavailableExample(args),
  name: 'isDateUnavailable'
};

export const AllEvents: Story = {
  render: (args) => renderEventsExample(args),
  name: 'all the events'
};

export const ContextualHelpStory: Story = {
  render: (args) => render({
    ...args,
    description: 'Contextual help: Segments identify who your visitors are.'
  }),
  name: 'contextual help'
};

export const CustomCalendar: Story = {
  render: (args) => renderCalendarPreferenceExample({
    ...args,
    modelValue: '2024-02-13'
  })
};
