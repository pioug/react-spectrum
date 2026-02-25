import {action} from '@storybook/addon-actions';
import {ref} from 'vue';
import {useInteractOutside} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useInteractOutside'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OutsideBody: Story = {
  render: () => ({
    setup() {
      let targetRef = ref<HTMLElement | null>(null);
      useInteractOutside({
        ref: targetRef,
        onInteractOutside: action('outside')
      });

      return {
        targetRef
      };
    },
    template: `
      <div ref="targetRef" style="margin-inline-start: 50px; margin-block-start: 50px;">
        Click anywhere but this text
      </div>
    `
  })
};

export const ClickingButtonShouldFireOnInteractOutside: Story = {
  render: () => ({
    setup() {
      let orangeRef = ref<HTMLElement | null>(null);
      useInteractOutside({
        ref: orangeRef,
        onInteractOutside: action('clicked outside of orange div')
      });

      return {
        orangeRef
      };
    },
    template: `
      <div class="App">
        <div>Clicking 'My Button' should fire onInteractOutside</div>
        <div
          ref="orangeRef"
          style="width: 100px; height: 100px; background: orange;" />
        <button type="button">My Button</button>
      </div>
    `
  })
};
