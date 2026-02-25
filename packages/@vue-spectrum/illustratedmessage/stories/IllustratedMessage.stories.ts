import {IllustratedMessage} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof IllustratedMessage> = {
  title: 'IllustratedMessage',
  component: IllustratedMessage
};

export default meta;

type Story = StoryObj<typeof meta>;

export const _NotFound: Story = {
  render: (args) => ({
    components: {IllustratedMessage},
    setup() {
      return {args};
    },
    template: `
      <IllustratedMessage v-bind="args">
        <template #illustration>
          <svg
            aria-label="No Results"
            viewBox="0 0 72 72"
            width="72"
            height="72"
            role="img">
            <circle cx="36" cy="36" r="32" fill="var(--spectrum-global-color-gray-200)" />
            <path d="M22 36h28M36 22v28" stroke="var(--spectrum-global-color-gray-700)" stroke-width="4" stroke-linecap="round" />
          </svg>
        </template>
        <template #heading>Error 404: Page not found</template>
        This page isn’t available. Try checking the URL or visit a different page.
      </IllustratedMessage>
    `
  }),
  name: 'Not Found'
};

export const NoHeadingOrDescription: Story = {
  render: (args) => ({
    components: {IllustratedMessage},
    setup() {
      return {args};
    },
    template: `
      <IllustratedMessage v-bind="args">
        <template #illustration>
          <svg
            aria-label="No Results"
            viewBox="0 0 72 72"
            width="72"
            height="72"
            role="img">
            <circle cx="36" cy="36" r="32" fill="var(--spectrum-global-color-gray-200)" />
            <path d="M22 36h28M36 22v28" stroke="var(--spectrum-global-color-gray-700)" stroke-width="4" stroke-linecap="round" />
          </svg>
        </template>
      </IllustratedMessage>
    `
  })
};
