import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueColorWheel} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorWheel',
  component: VueColorWheel
} satisfies Meta<typeof VueColorWheel>;

export default meta;

export const ColorWheelExample: StoryFn<typeof VueColorWheel> = (args: {isDisabled?: boolean}) => ({
  components: {
    VueColorWheel
  },
  setup() {
    let value = ref(220);
    return {
      args,
      value
    };
  },
  template: `
    <VueColorWheel
      v-model="value"
      label="Color wheel"
      :disabled="args.isDisabled ?? false" />
  `
});
