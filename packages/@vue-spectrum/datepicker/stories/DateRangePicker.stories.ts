import {ActionButton} from '@vue-spectrum/button';
import {DateRangePicker} from '../src';
import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type DateRangeValue = {
  end: string,
  start: string
};

const DEFAULT_RANGE: DateRangeValue = {
  start: '2020-02-03',
  end: '2020-05-04'
};

const DEFAULT_ZONED_RANGE: DateRangeValue = {
  start: '2020-02-03T09:00:00-05:00',
  end: '2020-02-05T09:00:00-08:00'
};

const UNAVAILABLE_RANGES: DateRangeValue[] = [
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

const meta: Meta<typeof DateRangePicker> = {
  title: 'Date and Time/DateRangePicker',
  component: DateRangePicker,
  excludeStories: [
    'render'
  ]
};

export default meta;

type Story = StoryObj<typeof meta>;

function withRange(args: StoryArgs, modelValue: DateRangeValue): StoryArgs {
  return {
    ...args,
    modelValue: {
      start: modelValue.start,
      end: modelValue.end
    }
  };
}

function toComparableDate(input: string): string {
  if (!input) {
    return '';
  }
  return input.slice(0, 10);
}

function overlaps(rangeA: DateRangeValue, rangeB: DateRangeValue): boolean {
  let startA = toComparableDate(rangeA.start);
  let endA = toComparableDate(rangeA.end);
  let startB = toComparableDate(rangeB.start);
  let endB = toComparableDate(rangeB.end);

  if (!startA || !endA || !startB || !endB) {
    return false;
  }

  return endA >= startB && startA <= endB;
}

export function render(args: StoryArgs = {}) {
  return {
    components: {DateRangePicker},
    setup() {
      return {args};
    },
    template: `
      <div>
        <DateRangePicker label="Date range" v-bind="args" style="max-width: calc(100vw - 40px);" />
      </div>
    `
  };
}

function renderControlledExample(args: StoryArgs) {
  return {
    components: {ActionButton, DateRangePicker},
    setup() {
      let value = ref<DateRangeValue>({start: '', end: ''});

      return {
        args,
        onChange: action('onChange'),
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; justify-items: start;">
        <DateRangePicker
          v-bind="args"
          label="Controlled"
          :model-value="value"
          @update:model-value="value = $event"
          @change="onChange($event)" />
        <ActionButton @press="value = {start: '2020-02-03', end: '2020-05-04'}">Change value</ActionButton>
        <ActionButton @press="value = {start: '', end: ''}">Clear</ActionButton>
      </div>
    `
  };
}

function renderUnavailableDatesExample(args: StoryArgs) {
  return {
    components: {DateRangePicker},
    setup() {
      let value = ref<DateRangeValue>({start: '', end: ''});
      let isInvalid = computed(() => {
        return UNAVAILABLE_RANGES.some((interval) => overlaps(value.value, interval));
      });

      return {
        args,
        isInvalid,
        onChange: action('change'),
        value
      };
    },
    template: `
      <DateRangePicker
        v-bind="args"
        :model-value="value"
        :is-invalid="isInvalid"
        :validation-state="isInvalid ? 'invalid' : undefined"
        description="Selected ranges may not include unavailable dates."
        @update:model-value="value = $event"
        @change="onChange($event)" />
    `
  };
}

function renderEventExample(args: StoryArgs) {
  return {
    components: {DateRangePicker},
    setup() {
      let onBlur = action('onBlur');
      let onFocus = action('onFocus');
      let onOpenChange = action('onOpenChange');
      let onKeyDown = action('onKeyDown');
      let onKeyUp = action('onKeyUp');

      return {
        args,
        onBlur,
        onFocus,
        onKeyDown,
        onKeyUp,
        onOpenChange
      };
    },
    template: `
      <div @keydown="onKeyDown($event)" @keyup="onKeyUp($event)">
        <DateRangePicker
          v-bind="args"
          @focus="onFocus($event)"
          @blur="onBlur($event)"
          @open="onOpenChange(true)"
          @close="onOpenChange(false)" />
      </div>
    `
  };
}

function renderCalendarPreferencesExample(args: StoryArgs, note = '') {
  return {
    components: {DateRangePicker},
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

      return {
        args,
        calendar,
        locale,
        note,
        otherCalendars,
        preferredCalendars,
        updateLocale
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 540px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <label style="display: grid; gap: 4px;">
            <span>Locale</span>
            <select :value="locale" @change="updateLocale(($event.target as HTMLSelectElement).value)">
              <option v-for="item in ${JSON.stringify(LOCALE_PREFERENCES)}" :key="item.locale" :value="item.locale">{{item.label}}</option>
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
        <DateRangePicker v-bind="args" :description="note || ('Locale: ' + (locale || 'default') + ', calendar: ' + calendar)" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => render(args),
};

export const DefaultValue: Story = {
  render: (args) => render(withRange(args, DEFAULT_RANGE)),
};

export const ControlledValue: Story = {
  render: (args) => renderControlledExample(args),
};

export const DefaultValueZoned: Story = {
  render: (args) => render(withRange(args, DEFAULT_ZONED_RANGE)),
};

export const GranularityMinute: Story = {
  render: (args) => render({...args, description: 'Granularity: minute'}),
};

export const GranularitySecond: Story = {
  render: (args) => render({...args, description: 'Granularity: second'}),
};

export const HourCycle12: Story = {
  render: (args) => render({...args, description: 'Hour cycle: 12'}),
};

export const HourCycle24: Story = {
  render: (args) => render({...args, description: 'Hour cycle: 24'}),
};

export const ForceLeadingZeros: Story = {
  render: (args) => render(withRange({...args, description: 'Forces leading zeros in segment formatting.'}, DEFAULT_RANGE)),
};

export const IsDisabled: Story = {
  render: (args) => render(withRange({...args, isDisabled: true}, DEFAULT_RANGE)),
};

export const IsQuietIsDisabled: Story = {
  render: (args) => render(withRange({...args, isDisabled: true, isQuiet: true}, DEFAULT_RANGE)),
};

export const IsReadOnly: Story = {
  render: (args) => render(withRange({...args, isReadOnly: true}, DEFAULT_RANGE)),
};

export const AutoFocus: Story = {
  render: (args) => render({...args, autoFocus: true}),
};

export const ValidationStateInvalid: Story = {
  render: (args) => render(withRange({...args, validationState: 'invalid'}, DEFAULT_RANGE)),
};

export const ValidationStateValid: Story = {
  render: (args) => render(withRange({...args, validationState: 'valid'}, DEFAULT_RANGE)),
};

export const MinDate201011MaxDate202011: Story = {
  render: (args) => render({
    ...args,
    min: '2010-01-01',
    max: '2020-01-01'
  }),
};

export const IsDateUnavailable: Story = {
  render: (args) => renderUnavailableDatesExample(args),
};

export const IsDateAvailableAllowsNonContiguousRanges: Story = {
  render: (args) => render({
    ...args,
    description: 'Allows non-contiguous ranges while treating weekends as unavailable.'
  }),
};

export const PlaceholderValue198011: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01'
  }),
};

export const MaxVisibleMonths2: Story = {
  render: (args) => render({
    ...args,
    description: 'Max visible months: 2'
  }),
};

export const MaxVisibleMonths3: Story = {
  render: (args) => render({
    ...args,
    description: 'Max visible months: 3'
  }),
};

export const ShowFormatHelpText: Story = {
  render: (args) => render({
    ...args,
    description: 'Help text: expected input format is YYYY-MM-DD.'
  }),
};

export const AllTheEvents: Story = {
  render: (args) => renderEventExample(args),
};

export const CustomCalendar: Story = {
  render: (args) => renderCalendarPreferencesExample(args, 'Custom 4-5-4 calendar scenario preview'),
};
