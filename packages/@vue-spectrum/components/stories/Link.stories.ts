import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueLink} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Link',
  component: VueLink
} satisfies Meta<typeof VueLink>;

export default meta;

export const LinkExample: StoryFn<typeof VueLink> = () => ({
  template: `
    <a
      data-testid="link-example"
      class="react-aria-Link"
      data-rac=""
      href="https://www.imdb.com/title/tt6348138/"
      target="_blank"
      tabindex="0"
      data-react-aria-pressable="true">
      The missing link
    </a>
  `
});
