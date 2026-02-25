import Calendar from '@spectrum-icons-vue/workflow/Calendar';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const meta = {
  title: 'Icons/Color'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorIconWithSizes: Story = {
  render: () => ({
    components: {
      Calendar
    },
    setup() {
      return {
        sizes
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <div v-for="size in sizes" :key="size" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <Calendar :size="size" aria-label="Adobe Analytics Color" style="color: #0070f3;" />
        </div>
      </div>
    `
  }),
  name: 'Color Icon With Sizes'
};
