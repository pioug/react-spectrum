import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueProgressBar} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ProgressBar',
  component: VueProgressBar,
  args: {
    value: 50
  },
  argTypes: {
    value: {control: 'number'},
    minValue: {control: 'number'},
    maxValue: {control: 'number'}
  }
} satisfies Meta<typeof VueProgressBar>;

export default meta;

export const ProgressBarExample: StoryFn<typeof VueProgressBar> = (args: {value?: number, minValue?: number, maxValue?: number}) => ({
  components: {
    VueProgressBar
  },
  setup() {
    return {
      args
    };
  },
  template: `
    <VueProgressBar
      label="Storage space"
      :value="args.value ?? 50"
      :min="args.minValue ?? 0"
      :max="args.maxValue ?? 100" />
  `
});
