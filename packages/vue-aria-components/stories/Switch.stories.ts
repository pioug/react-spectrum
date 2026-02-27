import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {VueSwitch} from 'vue-aria-components';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

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
    let isSelected = ref(false);

    return {
      isSelected
    };
  },
  template: `
    <VueSwitch
      v-model="isSelected"
      class="switchExample"
      data-testid="switch-example">
      <div class="switchExample-indicator" />
      Switch me
    </VueSwitch>
  `
});
