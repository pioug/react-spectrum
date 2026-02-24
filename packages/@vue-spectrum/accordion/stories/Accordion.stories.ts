import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle, type SpectrumAccordionProps} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<SpectrumAccordionProps> = {
  title: 'Accordion',
  component: Accordion,
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
type AccordionStory = StoryObj<typeof Accordion>;

export const Default: AccordionStory = {
  render: (args) => ({
    components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
    setup() {
      return {args};
    },
    template: `
      <Accordion v-bind="args">
        <Disclosure id="files">
          <DisclosureTitle>
            Files
          </DisclosureTitle>
          <DisclosurePanel>
            Files content
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="people">
          <DisclosureTitle>
            People
          </DisclosureTitle>
          <DisclosurePanel>
            People content
          </DisclosurePanel>
        </Disclosure>
      </Accordion>
    `
  })
};

export const WithExpandedKeys: AccordionStory = {
  ...Default,
  args: {defaultExpandedKeys: ['files']}
};

export const WithDisabledDisclosure: AccordionStory = {
  render: (args) => ({
    components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
    setup() {
      return {args};
    },
    template: `
      <Accordion v-bind="args">
        <Disclosure id="files">
          <DisclosureTitle>
            Your files
          </DisclosureTitle>
          <DisclosurePanel>
            files
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="shared">
          <DisclosureTitle>
            Shared with you
          </DisclosureTitle>
          <DisclosurePanel>
            shared
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="last" is-disabled>
          <DisclosureTitle>
            Last item
          </DisclosureTitle>
          <DisclosurePanel>
            last
          </DisclosurePanel>
        </Disclosure>
      </Accordion>
    `
  })
};

export const WithWrappingTitle: AccordionStory = {
  render: (args) => ({
    components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
    setup() {
      return {args};
    },
    template: `
      <Accordion v-bind="args" style="max-width: var(--spectrum-global-dimension-size-3000);">
        <Disclosure id="files">
          <DisclosureTitle>
            Long long long long long long long long long long long long long long long long wrapping title
          </DisclosureTitle>
          <DisclosurePanel>
            Files content
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="people">
          <DisclosureTitle>
            People
          </DisclosureTitle>
          <DisclosurePanel>
            People content
          </DisclosurePanel>
        </Disclosure>
      </Accordion>
    `
  })
};
