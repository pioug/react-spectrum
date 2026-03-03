import {computed, defineComponent, ref, type PropType} from 'vue';
import {useCalendar, useCalendarCell, useCalendarGrid, type CalendarAria} from '@vue-aria/calendar';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type CalendarVisibleDuration = {
  days?: number,
  months?: number,
  weeks?: number
};

type CalendarStoryConfig = {
  defaultValueToday?: boolean,
  pageBehavior?: 'single',
  visibleDuration: CalendarVisibleDuration
};

function resolveVisibleDate(calendar: CalendarAria): Date {
  let candidate = (calendar as unknown as {visibleDate?: Date | {value?: Date}}).visibleDate;
  if (candidate && typeof candidate === 'object' && 'value' in candidate && candidate.value instanceof Date) {
    return candidate.value;
  }

  if (candidate instanceof Date) {
    return candidate;
  }

  return startOfMonth(new Date());
}

function resolveVisibleRangeStart(calendar: CalendarAria): Date | null {
  let visibleRange = (calendar as unknown as {visibleRange?: {start?: Date} | {value?: {start?: Date}}}).visibleRange;
  if (visibleRange && typeof visibleRange === 'object' && 'value' in visibleRange) {
    return visibleRange.value?.start ?? null;
  }

  return visibleRange?.start ?? null;
}

function cloneDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, days: number): Date {
  let nextDate = cloneDate(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMonths(date: Date, months: number): Date {
  let nextDate = cloneDate(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function todayUTC(): Date {
  let now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function startOfWeek(date: Date): Date {
  let nextDate = cloneDate(date);
  nextDate.setDate(nextDate.getDate() - nextDate.getDay());
  return nextDate;
}

function getWeeksInMonth(date: Date): number {
  let firstVisibleDate = startOfWeek(startOfMonth(date));
  let lastDate = endOfMonth(date);
  let dayCount = Math.floor((lastDate.getTime() - firstVisibleDate.getTime()) / 86_400_000) + 1;
  return Math.ceil(dayCount / 7);
}

const CalendarCellItem = defineComponent({
  props: {
    calendar: {
      type: Object as PropType<CalendarAria>,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  setup(props) {
    let cell = useCalendarCell({
      calendar: props.calendar,
      date: computed(() => props.date)
    });

    return {
      ...cell,
      onPress: () => {
        cell.press();
      }
    };
  },
  template: `
    <div v-bind="cellProps" style="display: inline-block;">
      <span
        v-bind="buttonProps"
        role="button"
        style="display: block; width: 42px; height: 42px;"
        :style="{background: isSelected ? 'blue' : '', color: isSelected ? 'white' : ''}"
        @click="onPress">
        {{formattedDate}}
      </span>
    </div>
  `
});

const CalendarGridView = defineComponent({
  components: {
    CalendarCellItem
  },
  props: {
    calendar: {
      type: Object as PropType<CalendarAria>,
      required: true
    },
    offset: {
      type: Number,
      required: true
    },
    visibleDuration: {
      type: Object as PropType<CalendarVisibleDuration>,
      required: true
    }
  },
  setup(props) {
    let monthDate = computed(() => {
      return addMonths(startOfMonth(resolveVisibleDate(props.calendar)), props.offset);
    });
    let grid = useCalendarGrid({
      visibleDate: monthDate
    });
    let weekCount = computed(() => {
      if (props.visibleDuration.months) {
        return getWeeksInMonth(monthDate.value);
      }

      return Math.max(props.visibleDuration.weeks ?? 1, 1);
    });
    let dayCount = computed(() => Math.max(props.visibleDuration.days ?? 7, 1));
    let startDate = computed(() => {
      if (props.visibleDuration.months) {
        return startOfWeek(monthDate.value);
      }

      return resolveVisibleRangeStart(props.calendar) ?? monthDate.value;
    });
    let rows = computed(() => {
      return Array.from({length: weekCount.value}, (_week, weekIndex) => {
        return Array.from({length: dayCount.value}, (_day, dayIndex) => {
          return addDays(startDate.value, (weekIndex * dayCount.value) + dayIndex);
        });
      });
    });

    return {
      gridProps: grid.gridProps,
      rows
    };
  },
  template: `
    <div v-bind="gridProps">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" role="row">
        <CalendarCellItem
          v-for="date in row"
          :key="date.toISOString()"
          :calendar="calendar"
          :date="date" />
      </div>
    </div>
  `
});

const meta = {
  title: 'Date and Time/useCalendar'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderCalendar(config: CalendarStoryConfig) {
  return {
    components: {
      CalendarGridView
    },
    setup() {
      let selectedDate = ref<Date | null>(config.defaultValueToday ? todayUTC() : null);
      let calendar = useCalendar({
        value: selectedDate,
        visibleDuration: config.visibleDuration,
        pageBehavior: config.pageBehavior
      });
      let gridCount = computed(() => Math.max(config.visibleDuration.months ?? 1, 1));
      let monthOffsets = computed(() => Array.from({length: gridCount.value}, (_, index) => index));

      return {
        calendar,
        ...calendar,
        monthOffsets,
        visibleDuration: config.visibleDuration
      };
    },
    template: `
      <div v-bind="calendarProps">
        <div style="text-align: center;" data-testid="range">
          {{calendarProps['aria-label']}}
        </div>
        <div :style="{display: 'grid', gridTemplateColumns: 'repeat(' + monthOffsets.length + ', 1fr)', gap: '1em'}">
          <CalendarGridView
            v-for="offset in monthOffsets"
            :key="offset"
            :calendar="calendar"
            :offset="offset"
            :visibleDuration="visibleDuration" />
        </div>
        <div>
          <button type="button" style="position: relative; display: inline-flex; align-items: center; background: transparent; border: 2px solid rgb(213, 213, 213);" @click="prevPage()">
            <span role="none" style="color: rgb(34, 34, 34);">prev</span>
          </button>
          <button type="button" style="position: relative; display: inline-flex; align-items: center; background: transparent; border: 2px solid rgb(213, 213, 213);" @click="nextPage()">
            <span role="none" style="color: rgb(34, 34, 34);">next</span>
          </button>
        </div>
      </div>
    `
  };
}

export const Days3: Story = {
  render: () => renderCalendar({visibleDuration: {days: 3}}),
  name: 'days: 3'
};

export const Weeks1: Story = {
  render: () => renderCalendar({visibleDuration: {weeks: 1}}),
  name: 'weeks: 1'
};

export const Weeks2: Story = {
  render: () => renderCalendar({visibleDuration: {weeks: 2}}),
  name: 'weeks: 2'
};

export const Months1: Story = {
  render: () => renderCalendar({visibleDuration: {months: 1}}),
  name: 'months: 1'
};

export const Months2: Story = {
  render: () => renderCalendar({visibleDuration: {months: 2}}),
  name: 'months: 2'
};

export const Days7SingleToday: Story = {
  render: () => renderCalendar({
    defaultValueToday: true,
    pageBehavior: 'single',
    visibleDuration: {days: 7}
  }),
  name: 'days: 7, pageBehavior: single, defaultValue: today'
};

export const Weeks5SingleToday: Story = {
  render: () => renderCalendar({
    defaultValueToday: true,
    pageBehavior: 'single',
    visibleDuration: {weeks: 5}
  }),
  name: 'weeks: 5, pageBehavior: single, defaultValue: today'
};

export const Months2PageBehaviorSingle: Story = {
  render: () => renderCalendar({
    pageBehavior: 'single',
    visibleDuration: {months: 2}
  }),
  name: 'months: 2, pageBehavior: single'
};
