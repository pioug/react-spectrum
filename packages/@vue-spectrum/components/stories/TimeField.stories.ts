import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueTimeField} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/TimeField',
  component: VueTimeField
} satisfies Meta<typeof VueTimeField>;

export default meta;

export const TimeFieldExample: StoryFn<typeof VueTimeField> = () => ({
  components: {
    VueTimeField
  },
  setup() {
    let value = ref('');
    return {
      value
    };
  },
  template: `
    <VueTimeField
      v-model="value"
      data-testid="time-field-example"
      label="Time" />
  `
});
