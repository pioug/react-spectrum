import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueMeter} from 'vue-aria-components';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/Meter',
  component: VueMeter,
  args: {
    value: 50
  },
  argTypes: {
    value: {control: 'number'},
    minValue: {control: 'number'},
    maxValue: {control: 'number'}
  }
} satisfies Meta<typeof VueMeter>;

export default meta;

export const MeterExample: StoryFn<typeof VueMeter> = (args: {value?: number, minValue?: number, maxValue?: number}) => ({
  components: {
    VueMeter
  },
  setup() {
    return {
      args
    };
  },
  template: `
    <VueMeter v-bind="args" label="Storage space" />
  `
});
