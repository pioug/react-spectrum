import {IllustratedMessage} from '../src';
import {h} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type SvgProps = Record<string, string>;

function renderNotFoundIllustration(extraProps: SvgProps = {}) {
  return h('svg', {
    width: '135.321',
    height: '87',
    focusable: 'false',
    ...extraProps
  }, [
    h('g', {
      fill: 'none',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-miterlimit': '10'
    }, [
      h('path', {
        d: 'M11.821 60.5v23a2.006 2.006 0 002 2h118a2.006 2.006 0 002-2v-80a2.006 2.006 0 00-2-2h-118a2.006 2.006 0 00-2 2v27',
        'stroke-width': '3'
      }),
      h('path', {
        d: 'M133.721 14h-122M29.721 8h-10',
        'stroke-width': '2'
      }),
      h('path', {
        d: 'M2.121 55.1l19.3-19.2M21.421 55.1l-19.3-19.2',
        'stroke-width': '3'
      })
    ])
  ]);
}

const meta: Meta<typeof IllustratedMessage> = {
  title: 'IllustratedMessage',
  component: IllustratedMessage
};

export default meta;

type Story = StoryObj<typeof meta>;

export const _NotFound: Story = {
  render: () => ({
    setup() {
      return () => h(IllustratedMessage, null, {
        default: () => [
          renderNotFoundIllustration(),
          h('h3', {class: 'spectrum-IllustratedMessage-heading'}, 'Error 404: Page not found'),
          h('section', {class: 'spectrum-IllustratedMessage-description'}, 'This page isn’t available. Try checking the URL or visit a different page.')
        ]
      });
    }
  }),
  name: 'Not Found'
};

export const NoHeadingOrDescription: Story = {
  render: () => ({
    setup() {
      return () => h(IllustratedMessage, null, {
        default: () => [
          renderNotFoundIllustration({
            'aria-label': 'No Results',
            role: 'img'
          })
        ]
      });
    }
  })
};
