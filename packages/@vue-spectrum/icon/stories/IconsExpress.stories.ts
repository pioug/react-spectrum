import {Icon} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

type StoryConfig = {
  ariaLabel: string,
  color?: 'informative' | 'negative' | 'notice' | 'positive',
  iconName: 'add' | 'alert' | 'bell'
};

const meta = {
  title: 'Icons/Express'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderIconWithSizes(config: StoryConfig) {
  return {
    components: {
      Icon
    },
    setup() {
      return {
        ariaLabel: config.ariaLabel,
        color: config.color,
        iconName: config.iconName,
        sizes
      };
    },
    template: `
      <div>
        <Icon
          v-for="size in sizes"
          :key="size"
          :size="size"
          :aria-label="ariaLabel"
          :color="color"
          style="margin: 15px;">
          <svg v-if="iconName === 'add'" viewBox="0 0 18 18">
            <path d="M4 10h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4V4a1 1 0 1 0-2 0v4H4a1 1 0 1 0 0 2" />
          </svg>
          <svg v-else-if="iconName === 'bell'" viewBox="0 0 18 18">
            <path d="M16.504 10.11C15.573 8.98 15.1 7.95 15.1 7.047c0-2.566-1.164-4.321-3.466-5.22C11.187.725 10.154 0 9 0 7.845 0 6.812.726 6.368 1.827c-2.3.898-3.466 2.653-3.466 5.22 0 .903-.474 1.933-1.406 3.061a2.95 2.95 0 0 0-.395 3.163A2.98 2.98 0 0 0 3.821 15H6v.4C6 16.834 7.346 18 9 18s3-1.166 3-2.6V15h2.179a2.98 2.98 0 0 0 2.72-1.728 2.95 2.95 0 0 0-.395-3.163ZM10 15.4c0 .284-.428.6-1 .6s-1-.316-1-.6V15h2zm5.09-2.98a1 1 0 0 1-.911.58H3.82a1 1 0 0 1-.91-.581.95.95 0 0 1 .127-1.036C4.29 9.865 4.9 8.447 4.902 7.048 4.902 4.8 6.06 4.07 7.19 3.653c.474-.173.86-.558 1.005-1.007C8.301 2.326 8.59 2 9 2s.7.326.808.652c.147.446.532.83 1 1 1.133.418 2.292 1.15 2.292 3.396 0 1.4.61 2.82 1.863 4.335a.95.95 0 0 1 .126 1.037Z" />
          </svg>
          <svg v-else viewBox="0 0 18 18">
            <path d="M9 10.5a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v4.5a1 1 0 0 1-1 1m0 1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5m8.497 3.589a3.49 3.49 0 0 0 .079-3.474L12 1.815C11.394.68 10.273 0 9 0 7.732 0 6.613.676 6.007 1.808L.416 11.88a3.49 3.49 0 0 0 .089 3.459A3.38 3.38 0 0 0 3.416 17h11.169a3.38 3.38 0 0 0 2.912-1.661M10.244 2.77l5.575 10.05a1.5 1.5 0 0 1-.037 1.489c-.264.438-.7.69-1.197.69H3.416c-.498 0-.933-.252-1.197-.69a1.49 1.49 0 0 1-.046-1.474l5.593-10.08C8.018 2.284 8.48 2 9.001 2s.982.283 1.243.771Z" />
          </svg>
        </Icon>
      </div>
    `
  };
}

export const IconAddWithSizes: Story = {
  render: () => renderIconWithSizes({iconName: 'add', ariaLabel: 'Add'}),
  name: 'icon: Add with sizes'
};

export const IconBellWithSizes: Story = {
  render: () => renderIconWithSizes({iconName: 'bell', ariaLabel: 'Bell'}),
  name: 'icon: Bell with sizes'
};

export const IconAlertNegative: Story = {
  render: () => renderIconWithSizes({iconName: 'alert', ariaLabel: 'Alert', color: 'negative'}),
  name: 'icon: Alert negative'
};

export const IconAlertInformative: Story = {
  render: () => renderIconWithSizes({iconName: 'alert', ariaLabel: 'Alert', color: 'informative'}),
  name: 'icon: Alert informative'
};

export const IconAlertPositive: Story = {
  render: () => renderIconWithSizes({iconName: 'alert', ariaLabel: 'Alert', color: 'positive'}),
  name: 'icon: Alert positive'
};

export const IconAlertNotice: Story = {
  render: () => renderIconWithSizes({iconName: 'alert', ariaLabel: 'Alert', color: 'notice'}),
  name: 'icon: Alert notice'
};
