import {computed} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type CalendarArgs = {
  days: number,
  months: number,
  pageBehavior?: 'single',
  weeks: number
};

const meta = {
  title: 'Date and Time/useCalendar'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderCalendar(args: CalendarArgs) {
  return {
    setup() {
      let rows = computed(() => Array.from({length: args.weeks}, (_, weekIndex) => {
        return Array.from({length: args.days}, (_, dayIndex) => {
          return weekIndex * args.days + dayIndex + 1;
        });
      }));
      let monthLabels = computed(() => Array.from({length: args.months}, (_, monthIndex) => `Month ${monthIndex + 1}`));

      return {
        args,
        monthLabels,
        rows
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div style="font-size: 12px; color: #666;">
          days={{args.days}}, weeks={{args.weeks}}, months={{args.months}}, pageBehavior={{args.pageBehavior || 'default'}}
        </div>
        <div v-for="month in monthLabels" :key="month" style="border: 1px solid #ccc; padding: 8px;">
          <div style="font-weight: 600; margin-bottom: 8px;">{{month}}</div>
          <table style="border-collapse: collapse;">
            <tbody>
              <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                <td
                  v-for="value in row"
                  :key="value"
                  style="border: 1px solid #eee; width: 28px; height: 28px; text-align: center;">
                  {{value}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  };
}

export const Days3: Story = {
  render: () => renderCalendar({days: 3, weeks: 3, months: 1}),
  name: 'days: 3'
};

export const Days7PageBehaviorSingleDefaultValueToday: Story = {
  render: () => renderCalendar({days: 7, weeks: 3, months: 1, pageBehavior: 'single'}),
  name: 'days: 7, pageBehavior: single, defaultValue: today'
};

export const Months1: Story = {
  render: () => renderCalendar({days: 7, weeks: 4, months: 1}),
  name: 'months: 1'
};

export const Months2: Story = {
  render: () => renderCalendar({days: 7, weeks: 4, months: 2}),
  name: 'months: 2'
};

export const Months2PageBehaviorSingle: Story = {
  render: () => renderCalendar({days: 7, weeks: 4, months: 2, pageBehavior: 'single'}),
  name: 'months: 2, pageBehavior: single'
};

export const Weeks1: Story = {
  render: () => renderCalendar({days: 7, weeks: 1, months: 1}),
  name: 'weeks: 1'
};

export const Weeks2: Story = {
  render: () => renderCalendar({days: 7, weeks: 2, months: 1}),
  name: 'weeks: 2'
};

export const Weeks5PageBehaviorSingleDefaultValueToday: Story = {
  render: () => renderCalendar({days: 7, weeks: 5, months: 1, pageBehavior: 'single'}),
  name: 'weeks: 5, pageBehavior: single, defaultValue: today'
};
