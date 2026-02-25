import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Calendar as SpectrumCalendar} from '@vue-spectrum/calendar';
import {
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useRangeCalendar,
  type CalendarAria,
  type DateRange,
  type RangeCalendarAria
} from '@vue-aria/calendar';
import {computed, defineComponent, ref, type PropType, watch} from 'vue';

type OutsideMonthMode = 'dim' | 'hide';
type SelectionAlignment = 'start' | 'center' | 'end';
type StoryCalendar = CalendarAria | RangeCalendarAria;
type StoryMode = 'calendar' | 'range';

type DateRangeSelection = {
  end?: string,
  start?: string
};

type CalendarStoryOptions = {
  afterButtonText?: string,
  beforeButtonStyle?: string,
  beforeButtonText?: string,
  containerStyle?: string,
  deriveFirstDayFromLocale?: boolean,
  firstDayIndex?: number,
  mode: StoryMode,
  monthCount: number,
  monthStart?: Date,
  outsideMonthMode: OutsideMonthMode,
  selectedDate?: string,
  selectedRange?: DateRangeSelection,
  width: number
};

const HIDDEN_HEADING_STYLE = 'border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;';

const meta = {
  title: 'React Aria Components/Calendar',
  component: SpectrumCalendar
} satisfies Meta<typeof SpectrumCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

function cloneDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseIsoDate(value?: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  let [year, month, day] = value.split('-').map((segment) => Number(segment));
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

function formatMonthYear(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function formatMonthOnly(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long'
  }).format(date);
}

function normalizeSelectionAlignment(value: unknown): SelectionAlignment {
  if (value === 'center' || value === 'end') {
    return value;
  }

  return 'start';
}

function alignmentOffset(monthCount: number, selectionAlignment: SelectionAlignment): number {
  if (monthCount <= 1) {
    return 0;
  }

  if (selectionAlignment === 'center') {
    return Math.floor((monthCount - 1) / 2);
  }

  if (selectionAlignment === 'end') {
    return monthCount - 1;
  }

  return 0;
}

function alignVisibleDate(anchorDate: Date, monthCount: number, selectionAlignment: SelectionAlignment): Date {
  let offset = alignmentOffset(monthCount, selectionAlignment);
  return addMonths(startOfMonth(anchorDate), -offset);
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

const CalendarCellView = defineComponent({
  name: 'StoryCalendarCellView',
  props: {
    calendar: {
      type: Object as PropType<StoryCalendar>,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    locale: {
      type: String,
      required: true
    },
    monthDate: {
      type: Date,
      required: true
    },
    outsideMonthMode: {
      type: String as PropType<OutsideMonthMode>,
      required: true
    }
  },
  setup(props) {
    let dateLabelFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
      year: 'numeric'
    }));
    let cell = useCalendarCell({
      calendar: props.calendar,
      date: computed(() => props.date),
      visibleDate: computed(() => props.monthDate)
    });
    let isOutsideMonth = computed(() => cell.isOutsideVisibleRange.value);
    let cellStyle = computed<Record<string, string>>(() => {
      let style: Record<string, string> = {
        cursor: 'default',
        textAlign: 'center'
      };

      if (props.outsideMonthMode === 'hide' && isOutsideMonth.value) {
        style.display = 'none';
      }

      if (props.outsideMonthMode === 'dim' && isOutsideMonth.value) {
        style.opacity = '0.5';
      }

      if (cell.isSelected.value) {
        style.background = 'blue';
      }

      return style;
    });
    let dateAriaLabel = computed(() => dateLabelFormatter.value.format(props.date));

    return {
      cell,
      cellStyle,
      dateAriaLabel,
      isOutsideMonth,
      onPress: () => {
        cell.press();
      }
    };
  },
  template: `
    <td role="gridcell" :aria-disabled="cell.cellProps.value['aria-disabled'] ? 'true' : undefined">
      <div
        data-react-aria-pressable="true"
        class="react-aria-CalendarCell"
        data-rac=""
        role="button"
        :aria-label="dateAriaLabel"
        :aria-disabled="cell.cellProps.value['aria-disabled'] ? 'true' : undefined"
        :data-disabled="isOutsideMonth ? 'true' : undefined"
        :data-outside-visible-range="isOutsideMonth ? 'true' : undefined"
        :data-outside-month="isOutsideMonth ? 'true' : undefined"
        :data-selected="cell.isSelected.value ? 'true' : undefined"
        :tabindex="cell.buttonProps.value.tabindex"
        :style="cellStyle"
        @click="onPress">
        {{ cell.formattedDate.value }}
      </div>
    </td>
  `
});

const CalendarGridView = defineComponent({
  name: 'StoryCalendarGridView',
  components: {
    CalendarCellView
  },
  props: {
    calendar: {
      type: Object as PropType<StoryCalendar>,
      required: true
    },
    firstDayIndex: {
      type: Number,
      required: true
    },
    isRange: {
      type: Boolean,
      required: true
    },
    locale: {
      type: String,
      required: true
    },
    monthCount: {
      type: Number,
      required: true
    },
    monthOffset: {
      type: Number,
      required: true
    },
    outsideMonthMode: {
      type: String as PropType<OutsideMonthMode>,
      required: true
    }
  },
  setup(props) {
    let monthDate = computed(() => addMonths(startOfMonth(props.calendar.visibleDate.value), props.monthOffset));
    let monthLabel = computed(() => formatMonthYear(monthDate.value, props.locale));
    let tableStyle = computed(() => (props.monthCount > 1 ? 'flex: 1 1 0%;' : 'width: 100%;'));
    let grid = useCalendarGrid({
      firstDayOfWeek: computed(() => props.firstDayIndex),
      locale: computed(() => props.locale),
      visibleDate: monthDate
    });
    let weekdayLabels = computed(() => grid.weekDays.value.map((label) => label.charAt(0)));

    return {
      grid,
      monthDate,
      monthLabel,
      tableStyle,
      weekdayLabels
    };
  },
  template: `
    <table
      :aria-label="monthLabel"
      role="grid"
      :aria-multiselectable="isRange ? 'true' : undefined"
      cellpadding="0"
      class="react-aria-CalendarGrid"
      :style="tableStyle">
      <thead aria-hidden="true" class="react-aria-CalendarGridHeader">
        <tr>
          <th
            v-for="(label, index) in weekdayLabels"
            :key="'head-' + index"
            class="react-aria-CalendarHeaderCell">
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody class="react-aria-CalendarGridBody">
        <tr
          v-for="(week, weekIndex) in grid.weeks.value"
          :key="'week-' + weekIndex">
          <CalendarCellView
            v-for="date in week"
            :key="date.toISOString()"
            :calendar="calendar"
            :date="date"
            :locale="locale"
            :month-date="monthDate"
            :outside-month-mode="outsideMonthMode" />
        </tr>
      </tbody>
    </table>
  `
});

function createCalendarStory(options: CalendarStoryOptions): Story {
  return {
    render: (args: {locale?: string, selectionAlignment?: SelectionAlignment}) => ({
      components: {
        CalendarGridView
      },
      setup() {
        let locale = computed(() => args.locale ?? 'en-US');
        let monthStart = startOfMonth(options.monthStart ?? new Date());
        let selectedDate = ref<Date | null>(parseIsoDate(options.selectedDate));
        let selectedRange = ref<DateRange>({
          start: parseIsoDate(options.selectedRange?.start),
          end: parseIsoDate(options.selectedRange?.end)
        });
        let selectionAlignment = computed(() => normalizeSelectionAlignment(args.selectionAlignment));
        let alignmentAnchorDate = computed(() => {
          if (options.mode === 'range') {
            return selectedRange.value.start ?? monthStart;
          }

          return selectedDate.value ?? monthStart;
        });
        let alignedDefaultVisibleDate = computed(() => {
          if (options.monthCount <= 1) {
            return cloneDate(monthStart);
          }

          return alignVisibleDate(
            alignmentAnchorDate.value,
            options.monthCount,
            selectionAlignment.value
          );
        });
        let defaultVisibleDate = ref(cloneDate(alignedDefaultVisibleDate.value));
        let visibleDate = ref(cloneDate(defaultVisibleDate.value));
        let calendar = options.mode === 'range'
          ? useRangeCalendar({
            locale,
            value: selectedRange,
            visibleDate
          })
          : useCalendar({
            locale,
            value: selectedDate,
            visibleDate
          });

        watch(selectionAlignment, () => {
          if (options.monthCount <= 1) {
            return;
          }

          let alignedVisibleDate = alignVisibleDate(
            alignmentAnchorDate.value,
            options.monthCount,
            selectionAlignment.value
          );
          visibleDate.value = cloneDate(alignedVisibleDate);
          defaultVisibleDate.value = cloneDate(alignedVisibleDate);
        });

        let firstDayIndex = computed(() => {
          if (options.deriveFirstDayFromLocale) {
            return firstDayIndexFromLocale(locale.value);
          }

          return options.firstDayIndex ?? 0;
        });
        let isRange = options.mode === 'range';
        let rootClass = isRange ? 'react-aria-RangeCalendar' : 'react-aria-Calendar';
        let monthOffsets = computed(() => Array.from({length: options.monthCount}, (_entry, index) => index));
        let endMonthDate = computed(() => addMonths(visibleDate.value, Math.max(options.monthCount - 1, 0)));
        let visibleHeading = computed(() => (
          options.monthCount === 1
            ? formatMonthYear(visibleDate.value, locale.value)
            : `${formatMonthOnly(visibleDate.value, locale.value)} - ${formatMonthYear(endMonthDate.value, locale.value)}`
        ));
        let ariaLabel = computed(() => (
          options.monthCount === 1
            ? formatMonthYear(visibleDate.value, locale.value)
            : `${formatMonthOnly(visibleDate.value, locale.value)} to ${formatMonthYear(endMonthDate.value, locale.value)}`
        ));
        let resetFocusedDate = () => {
          visibleDate.value = cloneDate(defaultVisibleDate.value);
        };
        let resetValue = () => {
          if (isRange) {
            selectedRange.value = {
              start: null,
              end: null
            };
            return;
          }

          selectedDate.value = null;
        };

        return {
          afterButtonText: options.afterButtonText,
          ariaLabel,
          beforeButtonStyle: options.beforeButtonStyle,
          beforeButtonText: options.beforeButtonText,
          calendar,
          containerStyle: options.containerStyle,
          firstDayIndex,
          hiddenHeadingStyle: HIDDEN_HEADING_STYLE,
          isRange,
          locale,
          monthOffsets,
          outsideMonthMode: options.outsideMonthMode,
          resetFocusedDate,
          resetValue,
          rootClass,
          visibleHeading,
          width: options.width
        };
      },
      template: `
        <div :style="containerStyle">
          <button
            v-if="beforeButtonText"
            :style="beforeButtonStyle"
            @click="resetFocusedDate">
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
                slot="previous"
                @click="calendar.prevPage()">&lt;</button>
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
                slot="next"
                @click="calendar.nextPage()">&gt;</button>
            </div>
            <div v-if="monthOffsets.length > 1" style="display: flex; gap: 20px;">
              <CalendarGridView
                v-for="monthOffset in monthOffsets"
                :key="monthOffset"
                :calendar="calendar"
                :first-day-index="firstDayIndex"
                :is-range="isRange"
                :locale="locale"
                :month-count="monthOffsets.length"
                :month-offset="monthOffset"
                :outside-month-mode="outsideMonthMode" />
            </div>
            <CalendarGridView
              v-else
              :calendar="calendar"
              :first-day-index="firstDayIndex"
              :is-range="isRange"
              :locale="locale"
              :month-count="1"
              :month-offset="0"
              :outside-month-mode="outsideMonthMode" />
          </div>
          <button v-if="afterButtonText" @click="resetValue">{{ afterButtonText }}</button>
        </div>
      `
    })
  };
}

export const CalendarExample: Story = createCalendarStory({
  mode: 'calendar',
  monthCount: 1,
  outsideMonthMode: 'hide',
  width: 220
});

export const CalendarResetValue: Story = createCalendarStory({
  afterButtonText: 'Reset value',
  mode: 'calendar',
  monthCount: 1,
  outsideMonthMode: 'hide',
  width: 220
});

export const CalendarMultiMonth: Story = {
  ...createCalendarStory({
    beforeButtonStyle: 'margin-bottom: 20px;',
    beforeButtonText: 'Reset focused date',
    containerStyle: 'display: contents;',
    mode: 'calendar',
    monthCount: 3,
    monthStart: new Date(2021, 5, 1),
    outsideMonthMode: 'dim',
    selectedDate: '2021-07-01',
    width: 500
  }),
  args: {
    selectionAlignment: 'center'
  },
  argTypes: {
    selectionAlignment: {
      control: 'select',
      options: ['start', 'center', 'end']
    }
  }
};

export const CalendarFirstDayOfWeekExample: Story = {
  ...createCalendarStory({
    deriveFirstDayFromLocale: true,
    mode: 'calendar',
    monthCount: 1,
    outsideMonthMode: 'hide',
    width: 220
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
  mode: 'range',
  monthCount: 1,
  outsideMonthMode: 'hide',
  width: 220
});

export const RangeCalendarMultiMonthExample: Story = {
  ...createCalendarStory({
    mode: 'range',
    monthCount: 3,
    monthStart: new Date(2025, 6, 1),
    outsideMonthMode: 'hide',
    selectedRange: {
      start: '2025-08-04',
      end: '2025-08-10'
    },
    width: 500
  }),
  args: {
    selectionAlignment: 'center'
  },
  argTypes: {
    selectionAlignment: {
      control: 'select',
      options: ['start', 'center', 'end']
    }
  }
};
