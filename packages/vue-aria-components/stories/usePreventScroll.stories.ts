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
        window.setTimeout(() => {
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
        <button type="button" @click="startPreventScroll">Click me and then scroll</button>
        <p>isPreventingScroll: {{String(preventScrollAria.isPreventingScroll)}}</p>
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
