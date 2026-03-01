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

function renderIconWithSizes(config: {ariaLabel: string, color?: 'informative' | 'negative' | 'notice' | 'positive', component: unknown}) {
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
      <div>
        <component
          :is="iconComponent"
          v-for="size in sizes"
          :key="size"
          :size="size"
          :aria-label="ariaLabel"
          :color="color"
          style="margin: 15px;" />
      </div>
    `
  };
}

export const IconAddWithSizes: Story = {
  render: () => renderIconWithSizes({component: Add, ariaLabel: 'Add'}),
  name: 'icon: Add with sizes'
};

export const IconBellWithSizes: Story = {
  render: () => renderIconWithSizes({component: Bell, ariaLabel: 'Bell'}),
  name: 'icon: Bell with sizes'
};

export const Icon3DMaterialsWithSizes: Story = {
  render: () => renderIconWithSizes({component: Icon3DMaterials, ariaLabel: '3D Materials'}),
  name: 'icon: _3DMaterials with sizes'
};

export const IconAlertNegative: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: 'negative'}),
  name: 'icon: Alert negative'
};

export const IconAlertInformative: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: 'informative'}),
  name: 'icon: Alert informative'
};

export const IconAlertPositive: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: 'positive'}),
  name: 'icon: Alert positive'
};

export const IconAlertNotice: Story = {
  render: () => renderIconWithSizes({component: Alert, ariaLabel: 'Alert', color: 'notice'}),
  name: 'icon: Alert notice'
};
