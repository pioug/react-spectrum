import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Calendar as VueCalendar} from '@vue-spectrum/calendar';

type OutsideMonthMode = 'dim' | 'hide';

type DateRangeSelection = {
  end: string,
  start: string
};

type CalendarCellData = {
  ariaDisabled?: string,
  ariaLabel: string,
  day: number,
  key: string,
  outsideMonth: boolean,
  selected: boolean,
  style: string,
  tabIndex?: string
};

type CalendarMonthData = {
  ariaLabel: string,
  key: string,
  tableStyle: string,
  weeks: CalendarCellData[][]
};

type CalendarStoryModel = {
  afterButtonText?: string,
  ariaLabel: string,
  beforeButtonStyle?: string,
  beforeButtonText?: string,
  containerStyle?: string,
  hiddenHeadingStyle: string,
  isRange: boolean,
  months: CalendarMonthData[],
  rootClass: 'react-aria-Calendar' | 'react-aria-RangeCalendar',
  visibleHeading: string,
  weekdayLabels: string[],
  width: number
};

type CalendarModelOptions = {
  afterButtonText?: string,
  beforeButtonStyle?: string,
  beforeButtonText?: string,
  containerStyle?: string,
  firstDayIndex: number,
  monthCount: number,
  monthStart: Date,
  outsideMonthMode: OutsideMonthMode,
  rootClass: 'react-aria-Calendar' | 'react-aria-RangeCalendar',
  selectedDate?: string,
  selectedRange?: DateRangeSelection,
  width: number
};

const meta = {
  title: 'React Aria Components/Calendar',
  component: VueCalendar
} satisfies Meta<typeof VueCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

const HIDDEN_HEADING_STYLE = 'border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;';

const CALENDAR_TEMPLATE = `
  <div :style="containerStyle">
    <button
      v-if="beforeButtonText"
      :style="beforeButtonStyle">
      {{ beforeButtonText }}
    </button>
    <div
      :class="rootClass"
      data-rac=""
      :aria-label="ariaLabel"
      role="application"
      :style="'width: ' + width + 'px;'">
      <div :style="hiddenHeadingStyle">
        <h2>{{ ariaLabel }}</h2>
      </div>
      <div style="display: flex; align-items: center;">
        <button
          class="react-aria-Button"
          data-rac=""
          type="button"
          tabindex="0"
          data-react-aria-pressable="true"
          aria-label="Previous"
          slot="previous">&lt;</button>
        <h2 aria-hidden="true" class="react-aria-Heading" style="flex: 1 1 0%; text-align: center;">
          {{ visibleHeading }}
        </h2>
        <button
          class="react-aria-Button"
          data-rac=""
          type="button"
          tabindex="0"
          data-react-aria-pressable="true"
          aria-label="Next"
          slot="next">&gt;</button>
      </div>
      <div v-if="months.length > 1" style="display: flex; gap: 20px;">
        <table
          v-for="month in months"
          :key="month.key"
          :aria-label="month.ariaLabel"
          role="grid"
          :aria-multiselectable="isRange ? 'true' : undefined"
          cellpadding="0"
          class="react-aria-CalendarGrid"
          :style="month.tableStyle">
          <thead aria-hidden="true" class="react-aria-CalendarGridHeader">
            <tr>
              <th
                v-for="(label, index) in weekdayLabels"
                :key="month.key + '-head-' + index"
                class="react-aria-CalendarHeaderCell">
                {{ label }}
              </th>
            </tr>
          </thead>
          <tbody class="react-aria-CalendarGridBody">
            <tr
              v-for="(week, weekIndex) in month.weeks"
              :key="month.key + '-week-' + weekIndex">
              <td
                v-for="cell in week"
                :key="cell.key"
                role="gridcell"
                :aria-disabled="cell.ariaDisabled">
                <div
                  data-react-aria-pressable="true"
                  :tabindex="cell.tabIndex"
                  role="button"
                  :aria-label="cell.ariaLabel"
                  :aria-disabled="cell.ariaDisabled"
                  :data-disabled="cell.outsideMonth ? 'true' : undefined"
                  :data-outside-visible-range="cell.outsideMonth ? 'true' : undefined"
                  :data-outside-month="cell.outsideMonth ? 'true' : undefined"
                  :data-selected="cell.selected ? 'true' : undefined"
                  class="react-aria-CalendarCell"
                  data-rac=""
                  :style="cell.style">
                  {{ cell.day }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <table
        v-else
        :aria-label="months[0].ariaLabel"
        role="grid"
        :aria-multiselectable="isRange ? 'true' : undefined"
        cellpadding="0"
        class="react-aria-CalendarGrid"
        style="width: 100%;">
        <thead aria-hidden="true" class="react-aria-CalendarGridHeader">
          <tr>
            <th
              v-for="(label, index) in weekdayLabels"
              :key="'single-head-' + index"
              class="react-aria-CalendarHeaderCell">
              {{ label }}
            </th>
          </tr>
        </thead>
        <tbody class="react-aria-CalendarGridBody">
          <tr
            v-for="(week, weekIndex) in months[0].weeks"
            :key="'single-week-' + weekIndex">
            <td
              v-for="cell in week"
              :key="cell.key"
              role="gridcell"
              :aria-disabled="cell.ariaDisabled">
              <div
                data-react-aria-pressable="true"
                :tabindex="cell.tabIndex"
                role="button"
                :aria-label="cell.ariaLabel"
                :aria-disabled="cell.ariaDisabled"
                :data-disabled="cell.outsideMonth ? 'true' : undefined"
                :data-outside-visible-range="cell.outsideMonth ? 'true' : undefined"
                :data-outside-month="cell.outsideMonth ? 'true' : undefined"
                :data-selected="cell.selected ? 'true' : undefined"
                class="react-aria-CalendarCell"
                data-rac=""
                :style="cell.style">
                {{ cell.day }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button v-if="afterButtonText">{{ afterButtonText }}</button>
  </div>
`;

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  let next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseIsoDate(value?: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  let [year, month, day] = value.split('-').map((part) => Number(part));
  let parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (
    parsed.getFullYear() !== year
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function formatMonthOnly(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long'
  }).format(date);
}

function formatAriaDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric'
  }).format(date);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
  );
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  let timestamp = date.getTime();
  return timestamp >= start.getTime() && timestamp <= end.getTime();
}

function getWeekdayLabels(firstDayIndex: number): string[] {
  let formatter = new Intl.DateTimeFormat('en-US', {weekday: 'short'});
  let base = new Date(2024, 0, 7);

  return [...new Array(7).keys()].map((offset) => {
    let day = addDays(base, firstDayIndex + offset);
    return formatter.format(day).charAt(0);
  });
}

function buildMonthWeeks(monthStart: Date, firstDayIndex: number): Date[][] {
  let firstOfMonth = startOfMonth(monthStart);
  let firstDay = firstOfMonth.getDay();
  let offset = (firstDay - firstDayIndex + 7) % 7;
  let daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  let weekCount = Math.ceil((offset + daysInMonth) / 7);
  let current = addDays(firstOfMonth, -offset);

  let weeks: Date[][] = [];
  for (let week = 0; week < weekCount; week++) {
    let days: Date[] = [];
    for (let day = 0; day < 7; day++) {
      days.push(current);
      current = addDays(current, 1);
    }
    weeks.push(days);
  }

  return weeks;
}

function buildMonthData(
  monthStart: Date,
  firstDayIndex: number,
  outsideMonthMode: OutsideMonthMode,
  monthCount: number,
  selectedDate?: string,
  selectedRange?: DateRangeSelection
): CalendarMonthData {
  let parsedSelectedDate = parseIsoDate(selectedDate);
  let parsedRangeStart = parseIsoDate(selectedRange?.start);
  let parsedRangeEnd = parseIsoDate(selectedRange?.end);

  let weeks = buildMonthWeeks(monthStart, firstDayIndex).map((week, weekIndex) => (
    week.map((date, dayIndex) => {
      let outsideMonth = date.getMonth() !== monthStart.getMonth() || date.getFullYear() !== monthStart.getFullYear();
      let isSelected = (
        (parsedSelectedDate ? isSameDay(date, parsedSelectedDate) : false)
        || (parsedRangeStart && parsedRangeEnd ? isDateInRange(date, parsedRangeStart, parsedRangeEnd) : false)
      ) && !outsideMonth;

      let styleParts = ['text-align: center', 'cursor: default'];
      if (outsideMonthMode === 'hide' && outsideMonth) {
        styleParts.push('display: none');
      }
      if (outsideMonthMode === 'dim' && outsideMonth) {
        styleParts.push('opacity: 0.5');
      }
      if (isSelected) {
        styleParts.push('background: blue');
      }

      return {
        ariaDisabled: outsideMonth ? 'true' : undefined,
        ariaLabel: formatAriaDate(date),
        day: date.getDate(),
        key: `${monthStart.getFullYear()}-${monthStart.getMonth()}-${weekIndex}-${dayIndex}`,
        outsideMonth,
        selected: isSelected,
        style: `${styleParts.join('; ')};`,
        tabIndex: outsideMonth ? undefined : '-1'
      };
    })
  ));

  return {
    ariaLabel: formatMonthYear(monthStart),
    key: `${monthStart.getFullYear()}-${monthStart.getMonth()}`,
    tableStyle: monthCount > 1 ? 'flex: 1 1 0%;' : 'width: 100%;',
    weeks
  };
}

function createModel(options: CalendarModelOptions): CalendarStoryModel {
  let months = [...new Array(options.monthCount).keys()].map((offset) => {
    let monthStart = addMonths(options.monthStart, offset);
    return buildMonthData(
      monthStart,
      options.firstDayIndex,
      options.outsideMonthMode,
      options.monthCount,
      options.selectedDate,
      options.selectedRange
    );
  });

  let endMonth = addMonths(options.monthStart, options.monthCount - 1);
  let visibleHeading = options.monthCount === 1
    ? formatMonthYear(options.monthStart)
    : `${formatMonthOnly(options.monthStart)}\u2009\u2013\u2009${formatMonthYear(endMonth)}`;
  let ariaLabel = options.monthCount === 1
    ? formatMonthYear(options.monthStart)
    : `${formatMonthOnly(options.monthStart)} to ${formatMonthYear(endMonth)}`;

  return {
    afterButtonText: options.afterButtonText,
    ariaLabel,
    beforeButtonStyle: options.beforeButtonStyle,
    beforeButtonText: options.beforeButtonText,
    containerStyle: options.containerStyle,
    hiddenHeadingStyle: HIDDEN_HEADING_STYLE,
    isRange: options.rootClass === 'react-aria-RangeCalendar',
    months,
    rootClass: options.rootClass,
    visibleHeading,
    weekdayLabels: getWeekdayLabels(options.firstDayIndex),
    width: options.width
  };
}

function firstDayIndexFromLocale(locale?: string): number {
  let match = locale?.match(/-fw-(sun|mon|tue|wed|thu|fri|sat)(?:-|$)/i);
  let code = match?.[1]?.toLowerCase();

  switch (code) {
    case 'mon':
      return 1;
    case 'tue':
      return 2;
    case 'wed':
      return 3;
    case 'thu':
      return 4;
    case 'fri':
      return 5;
    case 'sat':
      return 6;
    default:
      return 0;
  }
}

function createCalendarStory(modelOptions: Omit<CalendarModelOptions, 'firstDayIndex' | 'monthStart'> & {firstDayIndex?: number, monthStart?: Date}): Story {
  return {
    render: () => ({
      setup() {
        let model = createModel({
          ...modelOptions,
          firstDayIndex: modelOptions.firstDayIndex ?? 0,
          monthStart: modelOptions.monthStart ?? startOfMonth(new Date())
        });
        return model;
      },
      template: CALENDAR_TEMPLATE
    })
  };
}

export const CalendarExample: Story = createCalendarStory({
  monthCount: 1,
  outsideMonthMode: 'hide',
  rootClass: 'react-aria-Calendar',
  width: 220
});

export const CalendarResetValue: Story = createCalendarStory({
  afterButtonText: 'Reset value',
  monthCount: 1,
  outsideMonthMode: 'hide',
  rootClass: 'react-aria-Calendar',
  width: 220
});

export const CalendarMultiMonth: Story = createCalendarStory({
  beforeButtonStyle: 'margin-bottom: 20px;',
  beforeButtonText: 'Reset focused date',
  containerStyle: 'display: contents;',
  firstDayIndex: 0,
  monthCount: 3,
  monthStart: new Date(2021, 5, 1),
  outsideMonthMode: 'dim',
  rootClass: 'react-aria-Calendar',
  selectedDate: '2021-07-01',
  width: 500
});

export const CalendarFirstDayOfWeekExample: Story = {
  render: (args: {locale?: string}) => ({
    setup() {
      return createModel({
        firstDayIndex: firstDayIndexFromLocale(args.locale),
        monthCount: 1,
        monthStart: startOfMonth(new Date()),
        outsideMonthMode: 'hide',
        rootClass: 'react-aria-Calendar',
        width: 220
      });
    },
    template: CALENDAR_TEMPLATE
  }),
  args: {
    locale: 'en-US-u-ca-iso8601-fw-tue'
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en-US-u-ca-iso8601-fw-tue', 'en-US-u-ca-iso8601', 'en-US', 'fr-FR-u-ca-iso8601-fw-tue', 'fr-FR-u-ca-iso8601', 'fr-FR', 'en-US-u-ca-iso8601-fw-tue-nu-thai']
    }
  }
};

export const RangeCalendarExample: Story = createCalendarStory({
  monthCount: 1,
  outsideMonthMode: 'hide',
  rootClass: 'react-aria-RangeCalendar',
  width: 220
});

export const RangeCalendarMultiMonthExample: Story = createCalendarStory({
  firstDayIndex: 0,
  monthCount: 3,
  monthStart: new Date(2025, 6, 1),
  outsideMonthMode: 'hide',
  rootClass: 'react-aria-RangeCalendar',
  selectedRange: {
    start: '2025-08-04',
    end: '2025-08-10'
  },
  width: 500
});
