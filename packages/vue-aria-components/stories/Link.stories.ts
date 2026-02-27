import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueLink} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Link',
  component: VueLink
} satisfies Meta<typeof VueLink>;

export default meta;

export const LinkExample: StoryFn<typeof VueLink> = () => ({
  components: {
    VueLink
  },
  setup() {
    let href = ref('https://www.imdb.com/title/tt6348138/');
    let label = ref('The missing link');

    return {
      href,
      label
    };
  },
  template: `
    <VueLink
      data-testid="link-example"
      class="react-aria-Link"
      data-rac=""
      :href="href"
      target="_blank"
      tabindex="0"
      data-react-aria-pressable="true">
      {{ label }}
    </VueLink>
  `
});
