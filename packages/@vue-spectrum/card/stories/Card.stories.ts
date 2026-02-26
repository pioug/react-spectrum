import {Card} from '../src';
import {h, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type CardStoryArgs = {
  children?: unknown,
  isQuiet?: boolean,
  layout?: 'gallery' | 'grid' | 'waterfall',
  orientation?: 'horizontal' | 'vertical'
};

type CardRenderProps = Omit<CardStoryArgs, 'children'>;

function pickCardProps(args: CardStoryArgs): CardRenderProps {
  let {children: _children, ...cardProps} = args;
  return cardProps;
}

const MESSY_TEXT = 'Rechtsschutzversicherungsgesellschaften Nahrungsmittelunverträglichkeit Unabhängigkeitserklärungen Freundschaftsbeziehungen';
const images = [
  {src: 'https://i.imgur.com/Z7AzH2c.jpg'},
  {src: 'https://i.imgur.com/DhygPot.jpg'},
  {src: 'https://i.imgur.com/L7RTlvI.png'},
  {src: 'https://i.imgur.com/1nScMIH.jpg'},
  {src: 'https://i.imgur.com/zzwWogn.jpg'}
];
const descriptions = [
  'Description',
  'Description that is a medium length',
  'This is the description that never ends, it goes on and on my friends. Someone started typing without knowing what it was',
  MESSY_TEXT
];

function getImage(index: number): string {
  return images[index % images.length].src;
}

function getDescription(index: number): string {
  return descriptions[index % descriptions.length];
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

function renderCard(
  args: CardStoryArgs,
  index: number,
  options: {
    description?: string,
    detail?: string,
    title?: string,
    withPreview?: boolean
  } = {}
) {
  let title = options.title ?? `Title ${index}`;
  let detail = options.detail ?? 'PNG';
  let description = options.description ?? 'Description';
  let withPreview = options.withPreview ?? true;
  let cardProps = pickCardProps(args);

  return h(Card, {
    ...cardProps,
    description,
    detail,
    title
  }, withPreview ? {preview: renderPreview(index)} : undefined);
}

const meta: Meta<typeof Card> = {
  title: 'Card/default',
  component: Card,
  args: {
    children: {}
  },
  argTypes: {
    children: {
      control: 'object',
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

export const Default: Story = {
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          width: '208px'
        }
      }, [
        renderCard(args, 0, {
          description: 'Description',
          detail: 'PNG',
          title: 'Title'
        })
      ]);
    }
  })
};

export const CardGrid: Story = {
  args: {
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          alignItems: 'start',
          display: 'grid',
          gap: '20px',
          gridAutoRows: 'auto',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          justifyContent: 'center',
          justifyItems: 'center',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          height: '293px',
          width: '208px'
        }
      }, [
        renderCard(args, index)
      ])));
    }
  })
};

export const CardWaterfall: Story = {
  args: {
    layout: 'waterfall'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          alignItems: 'start',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          height: '150vh',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          margin: '10px',
          width: '208px'
        }
      }, [
        renderCard(args, index, {
          description: getDescription(index)
        })
      ])));
    }
  })
};

export const CardFloat: Story = {
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

export const CardGridMessyText: Story = {
  args: {
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          alignItems: 'start',
          display: 'grid',
          gap: '20px',
          gridAutoRows: 'auto',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          justifyContent: 'center',
          justifyItems: 'center',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          height: '293px',
          width: '208px'
        }
      }, [
        renderCard(args, index, {
          description: MESSY_TEXT,
          detail: MESSY_TEXT,
          title: `${index} ${MESSY_TEXT}`
        })
      ])));
    }
  })
};

export const CardWaterfallMessyText: Story = {
  args: {
    layout: 'waterfall'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          alignItems: 'start',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          height: '150vh',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          margin: '10px',
          width: '208px'
        }
      }, [
        renderCard(args, index, {
          description: MESSY_TEXT,
          detail: MESSY_TEXT,
          title: `${index} ${MESSY_TEXT}`
        })
      ])));
    }
  })
};

export const CardGridNoPreview: Story = {
  args: {
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          alignItems: 'start',
          display: 'grid',
          gap: '20px',
          gridAutoRows: 'auto',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          justifyContent: 'center',
          justifyItems: 'center',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          height: '160px',
          width: '208px'
        }
      }, [
        renderCard(args, index, {
          withPreview: false
        })
      ])));
    }
  })
};

export const CardWaterfallNoPreview: Story = {
  args: {
    layout: 'waterfall'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          alignItems: 'start',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          height: '150vh',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          margin: '10px',
          width: '208px'
        }
      }, [
        renderCard(args, index, {
          description: getDescription(index),
          withPreview: false
        })
      ])));
    }
  })
};

export const Selected: Story = {
  render: (args) => ({
    setup() {
      let selected = ref(true);
      let toggleSelected = () => {
        selected.value = !selected.value;
      };

      return {
        args,
        selected,
        toggleSelected
      };
    },
    render() {
      return h('div', {
        style: {
          width: '208px'
        }
      }, [
        h(Card, {
          ...this.args,
          description: 'Description',
          detail: 'PNG',
          isSelected: this.selected,
          onPress: this.toggleSelected,
          title: 'Title'
        }, {
          preview: renderPreview(0)
        })
      ]);
    }
  })
};
