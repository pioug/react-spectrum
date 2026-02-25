import type {StorybookConfig} from '@storybook/vue3-vite';

// Keep Vue Storybook scoped to parity stories only.
export const VUE_STORYBOOK_STORY_GLOBS = [
  '../../../packages/vue-aria-components/stories/*.stories.{js,jsx,ts,tsx}'
];

const config: StorybookConfig = {
  stories: VUE_STORYBOOK_STORY_GLOBS,
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
