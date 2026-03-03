import {computed, ref} from 'vue';
import {usePreventScroll} from '@vue-aria/overlays';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'usePreventScroll'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    setup() {
      let preventScroll = ref(false);
      let preventScrollAria = usePreventScroll({
        isDisabled: computed(() => !preventScroll.value)
      });

      let startPreventScroll = () => {
        window.setInterval(() => {
          preventScroll.value = true;
        }, 1000);
      };

      return {
        preventScrollAria,
        startPreventScroll
      };
    },
    template: `
      <div style="height: 300vh;">
        <button
          type="button"
          @click="startPreventScroll"
          style="position: relative; display: inline-flex; align-items: center; border: 1px solid rgb(144, 144, 144); background: rgb(253, 253, 253); margin: 20px;">
          <span role="none" style="color: rgb(34, 34, 34);">Click Me in safari and then scroll</span>
        </button>
        <p>Should be able to scroll the range input on iOS Safari</p>
        <input type="range" />
      </div>
    `
  }),
  name: 'default',
  parameters: {
    description: {
      data: 'Visit this story on a touch device. Click the button, then scroll while prevention activates.'
    }
  }
};
