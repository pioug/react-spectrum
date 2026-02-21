import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueButton} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/ToggleButton',
  component: VueButton
} satisfies Meta<typeof VueButton>;

export default meta;

export const ToggleButtonExample: StoryFn<typeof VueButton> = () => ({
  components: {
    VueButton
  },
  setup() {
    let textColor = ref('black');
    let onHoverStart = () => {
      textColor.value = 'red';
    };
    let onHoverEnd = () => {
      textColor.value = 'black';
    };

    return {
      onHoverEnd,
      onHoverStart,
      onKeyUp: action('keyup'),
      onPress: action('press'),
      textColor
    };
  },
  template: `
    <VueButton
      data-testid="toggle-button-example"
      :style="{color: textColor}"
      @keyup="onKeyUp"
      @click="onPress"
      @mouseenter="onHoverStart"
      @mouseleave="onHoverEnd">
      Toggle
    </VueButton>
  `
});
