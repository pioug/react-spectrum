import {computed, ref} from 'vue';
import {useHover} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useHover'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverDisabling: Story = {
  render: () => ({
    setup() {
      let isDisabled = ref(false);
      let {hoverProps, isHovered} = useHover({
        isDisabled: computed(() => isDisabled.value)
      });

      return {
        hoverProps,
        isDisabled,
        isHovered
      };
    },
    template: `
      <div>
        <style>
          .use-hover-hovered { background-color: purple; color: white; }
        </style>
        <button
          v-bind="hoverProps"
          :class="isHovered ? 'use-hover-hovered' : ''"
          :data-hover="isHovered || null"
          :disabled="isDisabled"
          @click="isDisabled = true">
          Hover & Press
        </button>
        <button type="button" @click="isDisabled = false">Reset</button>
      </div>
    `
  }),
  name: 'hover disabling'
};
