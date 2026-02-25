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

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
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
      cell,
      onPress: () => {
        cell.press();
      }
    };
  },
  template: `
    <div v-bind="cell.cellProps" style="display: inline-block;">
      <button
        v-bind="cell.buttonProps"
        type="button"
        style="display: block; width: 42px; height: 42px;"
        :style="{background: cell.isSelected ? 'blue' : '', color: cell.isSelected ? 'white' : ''}"
        @click="onPress">
        {{cell.formattedDate}}
      </button>
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
      return addMonths(startOfMonth(props.calendar.visibleDate.value), props.offset);
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

      return monthDate.value;
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
      let selectedDate = ref<Date | null>(config.defaultValueToday ? new Date() : null);
      let calendar = useCalendar({
        value: selectedDate,
        visibleDuration: config.visibleDuration,
        pageBehavior: config.pageBehavior
      });
      let gridCount = computed(() => Math.max(config.visibleDuration.months ?? 1, 1));
      let monthOffsets = computed(() => Array.from({length: gridCount.value}, (_, index) => index));
      let monthLabel = (offset: number) => {
        return formatMonthLabel(addMonths(startOfMonth(calendar.visibleDate.value), offset));
      };

      return {
        calendar,
        monthLabel,
        monthOffsets,
        visibleDuration: config.visibleDuration
      };
    },
    template: `
      <div v-bind="calendar.calendarProps">
        <div style="text-align: center;" data-testid="range">
          {{calendar.calendarProps['aria-label']}}
        </div>
        <div :style="{display: 'grid', gridTemplateColumns: 'repeat(' + monthOffsets.length + ', 1fr)', gap: '1em'}">
          <div v-for="offset in monthOffsets" :key="offset">
            <div style="font-size: 12px; margin-bottom: 6px; text-align: center;">
              {{monthLabel(offset)}}
            </div>
            <CalendarGridView :calendar="calendar" :offset="offset" :visibleDuration="visibleDuration" />
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button type="button" @click="calendar.prevPage()">prev</button>
          <button type="button" @click="calendar.nextPage()">next</button>
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
