import {useButton} from '@vue-aria/button';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useButton'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputTypeButton: Story = {
  render: () => ({
    setup() {
      let {buttonProps, isPressed, press, pressEnd, pressStart} = useButton({
        elementType: 'input'
      });

      return {
        buttonProps,
        isPressed,
        press,
        pressEnd,
        pressStart
      };
    },
    template: `
      <input
        v-bind="buttonProps"
        value="Test"
        :style="{background: isPressed ? 'darkred' : 'red', color: 'white'}"
        @pointerdown="pressStart"
        @pointerup="pressEnd"
        @pointerleave="pressEnd"
        @click="press" />
    `
  }),
  name: 'input type button'
};
