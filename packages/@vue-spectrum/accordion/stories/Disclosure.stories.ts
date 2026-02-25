import {Disclosure, DisclosurePanel, DisclosureTitle, type SpectrumDisclosureProps} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<SpectrumDisclosureProps> = {
  title: 'Disclosure',
  component: Disclosure,
  argTypes: {
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    }
  }
};

export default meta;
type DisclosureStory = StoryObj<typeof Disclosure>;

export const Default: DisclosureStory = {
  render: (args) => ({
    components: {Disclosure, DisclosurePanel, DisclosureTitle},
    setup() {
      return {args};
    },
    template: `
      <Disclosure v-bind="args">
        <DisclosureTitle>
          Files
        </DisclosureTitle>
        <DisclosurePanel>
          Files content
        </DisclosurePanel>
      </Disclosure>
    `
  })
};

export const WrappingTitle: DisclosureStory = {
  render: (args) => ({
    components: {Disclosure, DisclosurePanel, DisclosureTitle},
    setup() {
      return {args};
    },
    template: `
      <Disclosure v-bind="args" style="max-width: var(--spectrum-global-dimension-size-3000);">
        <DisclosureTitle>
          Long long long long long long long long long long long long long long long long wrapping title
        </DisclosureTitle>
        <DisclosurePanel>
          Files content
        </DisclosurePanel>
      </Disclosure>
    `
  })
};

export const Disabled: DisclosureStory = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Quiet: DisclosureStory = {
  ...Default,
  args: {
    isQuiet: true
  }
};
