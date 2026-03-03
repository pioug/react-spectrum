import {computed, defineComponent, ref} from 'vue';
import {mergeProps} from '@vue-aria/utils';
import {useButton} from '@vue-aria/button';
import {useHover} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useHover'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const HoverButton = defineComponent({
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['press'],
  setup(props, {emit}) {
    let button = useButton({
      isDisabled: computed(() => props.isDisabled),
      onPress: () => {
        emit('press');
      }
    });
    let hover = useHover({
      isDisabled: computed(() => props.isDisabled)
    });

    return {
      isHovered: hover.isHovered,
      mergedProps: computed(() => mergeProps(button.buttonProps.value, hover.hoverProps.value))
    };
  },
  template: `
    <button
      v-bind="mergedProps"
      :class="{isHovered}"
      :data-hover="isHovered || null">
      <slot />
    </button>
  `
});

export const HoverDisabling: Story = {
  render: () => ({
    components: {
      HoverButton
    },
    setup() {
      let isDisabled = ref(false);

      return {
        isDisabled
      };
    },
    template: `
      <style>
        .isHovered {
          background-color: purple;
        }
      </style>
      <HoverButton :isDisabled="isDisabled" @press="isDisabled = true">
        Hover & Press
      </HoverButton>
      <button @click="isDisabled = false">Reset</button>
    `
  }),
  name: 'hover disabling'
};
