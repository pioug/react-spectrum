import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueColorWheel} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ColorWheel',
  component: VueColorWheel
} satisfies Meta<typeof VueColorWheel>;

export default meta;

export const ColorWheelExample: StoryFn<typeof VueColorWheel> = () => ({
  components: {
    VueColorWheel
  },
  setup() {
    let hue = ref(0);

    return {
      hue
    };
  },
  template: `
    <VueColorWheel
      v-model="hue"
      class="react-aria-ColorWheel"
      data-rac="" />
  `
});
