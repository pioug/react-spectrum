import type {StorybookConfig} from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/@{vue-aria,vue-stately}/*/stories/*.stories.{js,jsx,ts,tsx}',
    '../../../packages/@vue-spectrum/*/stories/*.stories.{js,jsx,ts,tsx}'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
