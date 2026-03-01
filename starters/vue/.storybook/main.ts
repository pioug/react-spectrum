import type {StorybookConfig} from '@storybook/vue3-vite';
import {resolve} from 'node:path';

const internationalizedDateSource = resolve(process.cwd(), '../../packages/@internationalized/date/src/index.ts');

// Keep Vue Storybook aligned with top-level Spectrum + React Aria Component parity navigation.
export const VUE_STORYBOOK_STORY_GLOBS = [
  '../../../packages/@vue-spectrum/*/stories/*.stories.{js,jsx,ts,tsx}',
  '../../../packages/vue-aria-components/stories/*.stories.{js,jsx,ts,tsx}'
];

const config: StorybookConfig = {
  stories: VUE_STORYBOOK_STORY_GLOBS,
  addons: [
    'storybook/actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    './custom-addons/provider/register.js'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  viteFinal: async (config) => {
    config.resolve ??= {};

    if (!config.resolve.alias) {
      config.resolve.alias = {'@internationalized/date': internationalizedDateSource};
      return config;
    }

    if (Array.isArray(config.resolve.alias)) {
      config.resolve.alias.push({
        find: '@internationalized/date',
        replacement: internationalizedDateSource
      });
    } else {
      config.resolve.alias['@internationalized/date'] = internationalizedDateSource;
    }

    return config;
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
