import {Card} from '../src';
import {h} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type QuietCardStoryArgs = {
  children?: unknown,
  isQuiet?: boolean,
  layout?: 'gallery' | 'grid' | 'waterfall',
  orientation?: 'horizontal' | 'vertical'
};

type QuietCardRenderProps = Omit<QuietCardStoryArgs, 'children'>;

function pickCardProps(args: QuietCardStoryArgs): QuietCardRenderProps {
  let {children: _children, ...cardProps} = args;
  return cardProps;
}

const MESSY_TEXT = 'Rechtsschutzversicherungsgesellschaften Nahrungsmittelunverträglichkeit Unabhängigkeitserklärungen Freundschaftsbeziehungen';
const LONG_TITLE = 'This is a long title about how dinosaurs used to rule the earth before a meteor came and wiped them all out';
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

function renderImagePreview(index: number) {
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

function renderIllustrationPreview(index: number) {
  return () => [
    h('div', {
      'aria-label': `File illustration ${index}`,
      role: 'img',
      style: {
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #dbeafe 100%)',
        borderRadius: '6px',
        color: '#1e3a8a',
        display: 'flex',
        fontSize: '28px',
        height: '100%',
        justifyContent: 'center',
        width: '100%'
      }
    }, 'FILE')
  ];
}

function renderCard(
  args: QuietCardStoryArgs,
  index: number,
  options: {
    description?: string | undefined,
    detail?: string,
    title?: string,
    withPreview?: boolean,
    previewType?: 'image' | 'illustration'
  } = {}
) {
  let title = options.title ?? `Title ${index}`;
  let detail = options.detail ?? 'PNG';
  let description = options.description ?? 'Description';
  let withPreview = options.withPreview ?? true;
  let previewType = options.previewType ?? 'image';
  let cardProps = pickCardProps(args);
  let slots = withPreview
    ? {preview: previewType === 'illustration' ? renderIllustrationPreview(index) : renderImagePreview(index)}
    : undefined;

  return h(Card, {
    ...cardProps,
    description,
    detail,
    isQuiet: true,
    key: `${index}-${getImage(index)}`,
    title
  }, slots);
}

const meta: Meta<typeof Card> = {
  title: 'Card/quiet',
  component: Card,
  args: {
    children: {},
    isQuiet: true
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
    },
    isQuiet: {
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
    isQuiet: true,
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '305px',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index)));
    }
  })
};

export const CardWaterfall: Story = {
  args: {
    isQuiet: true,
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

export const CardGallery: Story = {
  args: {
    isQuiet: true,
    layout: 'gallery'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          height: '339px',
          margin: '10px'
        }
      }, [
        renderCard(args, index)
      ])));
    }
  })
};

export const CardFloat: Story = {
  args: {
    isQuiet: true
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

export const CardGridNoDescription: Story = {
  args: {
    isQuiet: true,
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '274px',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index, {
        description: undefined
      })));
    }
  })
};

export const CardGridIllustrations: Story = {
  args: {
    isQuiet: true,
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '274px',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index, {
        description: undefined,
        previewType: 'illustration'
      })));
    }
  })
};

export const CardGridLongTitle: Story = {
  args: {
    isQuiet: true,
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '305px',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index, {
        title: `${LONG_TITLE} ${index}`
      })));
    }
  })
};

export const CardGridTallRows: Story = {
  args: {
    isQuiet: true,
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '400px',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index)));
    }
  })
};

export const CardGridMessyText: Story = {
  args: {
    isQuiet: true,
    layout: 'grid'
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gap: '20px',
          gridAutoRows: '305px',
          gridTemplateColumns: 'repeat(auto-fit, 208px)',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => renderCard(args, index, {
        description: MESSY_TEXT,
        detail: MESSY_TEXT,
        title: `${index} ${MESSY_TEXT}`
      })));
    }
  })
};

export const CardWaterfallMessyText: Story = {
  args: {
    isQuiet: true,
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

export const CardGalleryMessyText: Story = {
  args: {
    isQuiet: true,
    layout: 'gallery'
  },
  parameters: {
    description: {
      data: 'ignore extra horizontal space, it will not do this in a real gallery layout'
    }
  },
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: '50px',
          width: '100%'
        }
      }, new Array(15).fill(0).map((_, index) => h('div', {
        key: `${index}-${getImage(index)}`,
        style: {
          height: '339px',
          margin: '10px'
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
