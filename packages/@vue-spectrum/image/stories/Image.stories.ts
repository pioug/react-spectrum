import {Image} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Image',
  component: Image
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Image},
    setup() {
      return {args};
    },
    template: '<Image v-bind="args" width="500px" height="500px" src="https://i.imgur.com/Z7AzH2c.png" alt="Sky and roof" />'
  }),
  parameters: {
    description: {
      data: 'You should see a 500x500 image of the sky and a roof.'
    }
  }
};

export const ImageOnError: Story = {
  render: (args) => ({
    components: {Image},
    setup() {
      let isImageMissing = ref(false);
      let DEFAULT_IMAGE = 'https://i.imgur.com/DhygPot.jpg';
      let BROKEN_IMAGE = 'https://i.imgur.com/Z7AzH2332c.png';
      let onErrorHandler = () => {
        isImageMissing.value = true;
      };

      return {
        args,
        BROKEN_IMAGE,
        DEFAULT_IMAGE,
        isImageMissing,
        onErrorHandler
      };
    },
    template: '<Image v-bind="args" width="500px" height="500px" :src="isImageMissing ? DEFAULT_IMAGE : BROKEN_IMAGE" alt="starry sky" :on-error="onErrorHandler" />'
  }),
  parameters: {
    description: {
      data: 'You should see a picture of a starry night sky, that is the fallback image.'
    }
  }
};
