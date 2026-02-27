import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {VueTimeField} from 'vue-aria-components';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

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
      data-testid="time-field-example"
      v-model="value"
      label="Time" />
  `
});
