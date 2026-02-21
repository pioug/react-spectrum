import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSwitch} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Switch',
  component: VueSwitch
} satisfies Meta<typeof VueSwitch>;

export default meta;

export const SwitchExample: StoryFn<typeof VueSwitch> = () => ({
  components: {
    VueSwitch
  },
  setup() {
    let value = ref(false);
    return {
      value
    };
  },
  template: `
    <VueSwitch
      v-model="value"
      data-testid="switch-example">
      <div class="switchExample-indicator" />
      Switch me
    </VueSwitch>
  `
});
