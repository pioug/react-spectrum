import {computed, ref} from 'vue';
import {useDatePicker} from '@vue-aria/datepicker';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Date and Time/useDatePicker'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgrammaticSetValueExample: Story = {
  render: () => ({
    setup() {
      let value = ref<string | null>(null);
      let datePicker = useDatePicker({
        value
      });
      let segments = computed(() => {
        if (!value.value) {
          return ['mm', '/', 'dd', '/', 'yyyy'];
        }

        let [year = '', month = '', day = ''] = value.value.split('-');
        return [month, '/', day, '/', year];
      });
      let setValue = () => {
        datePicker.setValue('2020-01-01');
      };

      return {
        groupProps: datePicker.groupProps,
        segments,
        setValue
      };
    },
    template: `
      <div>
        <div v-bind="groupProps" data-testid="field">
          <span v-for="(segment, index) in segments" :key="index">{{segment}}</span>
        </div>
        <button data-testid="set" @click="setValue">Set</button>
      </div>
    `
  }),
  name: 'Programmatic Set Value Example'
};
