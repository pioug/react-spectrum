import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Date and Time/useDatePicker'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgrammaticSetValueExample: Story = {
  render: () => ({
    setup() {
      let value = ref('2026-02-25');
      let setToday = () => {
        value.value = '2026-02-25';
      };
      let setFuture = () => {
        value.value = '2026-12-31';
      };

      return {
        setFuture,
        setToday,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 280px;">
        <label for="date-picker-programmatic">Event date</label>
        <input id="date-picker-programmatic" v-model="value" type="date" />
        <div style="display: flex; gap: 8px;">
          <button type="button" @click="setToday">Set today</button>
          <button type="button" @click="setFuture">Set Dec 31</button>
        </div>
        <output>Current: {{value}}</output>
      </div>
    `
  }),
  name: 'Programmatic Set Value Example'
};
