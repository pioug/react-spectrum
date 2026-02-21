import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueLink} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Link',
  component: VueLink
} satisfies Meta<typeof VueLink>;

export default meta;

export const LinkExample: StoryFn<typeof VueLink> = () => ({
  components: {
    VueLink
  },
  template: `
    <VueLink data-testid="link-example" href="https://www.imdb.com/title/tt6348138/" target="_blank" rel="noreferrer">
      The missing link
    </VueLink>
  `
});
