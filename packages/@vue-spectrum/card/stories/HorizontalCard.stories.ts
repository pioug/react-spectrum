import {Card} from '../src';
import {h} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type HorizontalCardStoryArgs = {
  layout?: 'gallery' | 'grid' | 'waterfall',
  orientation?: 'horizontal' | 'vertical'
};

const images = [
  {src: 'https://i.imgur.com/Z7AzH2c.jpg'},
  {src: 'https://i.imgur.com/DhygPot.jpg'},
  {src: 'https://i.imgur.com/L7RTlvI.png'},
  {src: 'https://i.imgur.com/1nScMIH.jpg'},
  {src: 'https://i.imgur.com/zzwWogn.jpg'}
];

function getImage(index: number): string {
  return images[index % images.length].src;
}

function renderPreview(index: number) {
  return () => [
    h('img', {
      alt: '',
      src: getImage(index),
      style: {
        display: 'block',
        height: '100%',
        objectFit: 'cover',
        width: '100%'
      }
    })
  ];
}

function renderCard(args: HorizontalCardStoryArgs, index: number) {
  return h(Card, {
    ...args,
    description: 'Description',
    detail: 'PNG',
    key: `${index}-${getImage(index)}`,
    title: `Title ${index}`
  }, {
    preview: renderPreview(index)
  });
}

const meta: Meta<typeof Card> = {
  title: 'Card/horizontal',
  component: Card,
  args: {
    orientation: 'horizontal'
  },
  argTypes: {
    children: {
      table: {
        disable: true
      }
    },
    layout: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CardGrid: Story = {
  args: {
    layout: 'grid',
    orientation: 'horizontal'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '104px',
          gridTemplateColumns: 'repeat(auto-fit, 360px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index)));
    }
  })
};

export const CardFloat: Story = {
  args: {
    orientation: 'horizontal'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          float: 'left',
          margin: '10px'
        }
      }, [
        renderCard(args, index)
      ])));
    }
  })
};

export const CardGridTall: Story = {
  args: {
    layout: 'grid',
    orientation: 'horizontal'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '150px',
          gridTemplateColumns: 'repeat(auto-fit, 360px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index)));
    }
  })
};
