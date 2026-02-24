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
    <button
      data-testid="toggle-button-example"
      class="v7C2Sq_toggleButtonExample"
      data-rac=""
      type="button"
      tabindex="0"
      data-react-aria-pressable="true"
      aria-pressed="false"
      :style="{color: textColor}"
      @keyup="onKeyUp"
      @click="onPress"
      @mouseenter="onHoverStart"
      @mouseleave="onHoverEnd">
      Toggle
    </button>
  `
});
