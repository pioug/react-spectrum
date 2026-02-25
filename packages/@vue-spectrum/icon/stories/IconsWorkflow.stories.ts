import Icon3DMaterials from '@spectrum-icons-vue/workflow/3DMaterials';
import Add from '@spectrum-icons-vue/workflow/Add';
import Alert from '@spectrum-icons-vue/workflow/Alert';
import Bell from '@spectrum-icons-vue/workflow/Bell';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const meta = {
  title: 'Icons/Workflow'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderIconWithSizes(config: {ariaLabel: string, color?: string, component: unknown}) {
  return {
    components: {
      Add,
      Alert,
      Bell,
      Icon3DMaterials
    },
    setup() {
      return {
        ariaLabel: config.ariaLabel,
        color: config.color,
        iconComponent: config.component,
        sizes
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <component
          :is="iconComponent"
          v-for="size in sizes"
          :key="size"
          :size="size"
          :aria-label="ariaLabel"
          :style="{color: color || undefined}" />
      </div>
    `
  };
}

export const Icon3DMaterialsWithSizes: Story = {
  render: () => renderIconWithSizes({component: Icon3DMaterials, ariaLabel: '3D Materials'}),
  name: 'Icon 3 D Materials With Sizes'
};

export const IconAddWithSizes: Story = {
  render: () => renderIconWithSizes({component: Add, ariaLabel: 'Add'}),
  name: 'Icon Add With Sizes'
};

export const IconBellWithSizes: Story = {
  render: () => renderIconWithSizes({component: Bell, ariaLabel: 'Bell'}),
  name: 'Icon Bell With Sizes'
};

export const IconAlertNegative: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: '#d31510'}),
  name: 'Icon Alert Negative'
};

export const IconAlertInformative: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: '#0265dc'}),
  name: 'Icon Alert Informative'
};

export const IconAlertPositive: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: '#12805c'}),
  name: 'Icon Alert Positive'
};

export const IconAlertNotice: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: '#b44c00'}),
  name: 'Icon Alert Notice'
};
