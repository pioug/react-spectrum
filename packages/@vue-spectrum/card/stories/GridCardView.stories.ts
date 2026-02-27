import {action} from '@storybook/addon-actions';
import {CardView} from '../src';
import {h, onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type GridCardItem = {
  description?: string,
  height: number,
  id?: number | string,
  src: string,
  title: string,
  width: number
};

let items: GridCardItem[] = [
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Bob 1', id: 'Bob 1'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', title: 'Joe 1 really really really really really really really really really really really really long', id: 'Joe 1 really really really really really really really really really really really really long'},
  {width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Jane 1', id: 'Jane 1'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Bob 2', id: 'Bob 2'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', title: 'Joe 2', id: 'Joe 2'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Jane 2', id: 'Jane 2'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Bob 3', id: 'Bob 3'},
  {width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Joe 3', id: 'Joe 3'},
  {width: 1215, height: 121, src: 'https://i.imgur.com/zzwWogn.jpg', title: 'Jane 3', id: 'Jane 3'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Bob 4', id: 'Bob 4'},
  {width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Joe 4', id: 'Joe 4'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Jane 4', id: 'Jane 4'},
  {width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Bob 5', id: 'Bob 5'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Joe 5', id: 'Joe 5'},
  {width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Jane 5', id: 'Jane 5'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Bob 6', id: 'Bob 6'},
  {width: 1215, height: 121, src: 'https://i.imgur.com/zzwWogn.jpg', title: 'Joe 6', id: 'Joe 6'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', title: 'Jane 6', id: 'Jane 6'},
  {width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Bob 7', id: 'Bob 7'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Joe 7', id: 'Joe 7'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Jane 7', id: 'Jane 7'},
  {width: 1215, height: 121, src: 'https://i.imgur.com/zzwWogn.jpg', title: 'Bob 8', id: 'Bob 8'}
];

let falsyItems = [
  {id: 0, width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Bob 1'},
  {id: 1, width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', title: 'Joe 1 really really really really really really really really really really really really long'},
  {id: 2, width: 182, height: 1009, src: 'https://i.imgur.com/L7RTlvI.png', title: 'Jane 1'}
];

type StorySelectionValue = 'all' | Set<number | string>;

function normalizeStorySelectionValue(value: unknown): StorySelectionValue {
  if (value === 'all') {
    return 'all';
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return new Set([value]);
  }

  if (value == null) {
    return new Set();
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return new Set();
  }

  let normalized = new Set<number | string>();
  for (let entry of value as Iterable<unknown>) {
    if (typeof entry === 'number' || typeof entry === 'string') {
      normalized.add(entry);
    }
  }

  return normalized;
}

function GridLayout() {
  return {layoutType: 'grid'};
}

function actionHandlers() {
  return {
    onAction: action('action'),
    onSelectionChange: (keys: unknown) => {
      action('onSelectionChange')(normalizeStorySelectionValue(keys));
    }
  };
}

function renderEmptyState() {
  return h('div', [
    h('h3', {style: {marginBottom: '8px'}}, 'No results'),
    h('p', 'No results found, press here for more info.')
  ]);
}

function removeNthItem(value: string, sourceItems: GridCardItem[]) {
  let index = Number.parseInt(value, 10);
  if (Number.isNaN(index) || index < 0 || index >= sourceItems.length) {
    return sourceItems;
  }

  return sourceItems.slice(0, index).concat(sourceItems.slice(index + 1));
}

const meta = {
  title: 'CardView/Grid layout',
  component: CardView,
  args: {
    'aria-label': 'Test CardView'
  },
  argTypes: {
    layout: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'radio',
      defaultValue: 'multiple',
      options: ['none', 'single', 'multiple']
    }
  }
} satisfies Meta<typeof CardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DynamicCards: Story = {
  render: (args) => ({
    setup() {
      let removeIndex = ref('');
      let dynamicItems = ref(items.slice());
      let onRemove = () => {
        dynamicItems.value = removeNthItem(removeIndex.value, dynamicItems.value);
      };

      return {
        args,
        dynamicItems,
        onRemove,
        removeIndex
      };
    },
    render() {
      return h('div', {
        style: {
          height: '90vh',
          overflow: 'auto',
          resize: 'both',
          width: '800px'
        }
      }, [
        h('div', {
          style: {
            alignItems: 'flex-end',
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            maxWidth: '500px'
          }
        }, [
          h('label', [
            h('span', {
              style: {
                display: 'block',
                fontSize: '12px',
                marginBottom: '4px'
              }
            }, 'Nth item to remove'),
            h('input', {
              onInput: (event: Event) => {
                let target = event.target as HTMLInputElement;
                this.removeIndex = target.value;
              },
              style: {padding: '6px 8px', width: '180px'},
              value: this.removeIndex
            })
          ]),
          h('button', {
            onClick: this.onRemove,
            style: {height: '32px', padding: '0 10px'},
            type: 'button'
          }, 'Remove')
        ]),
        h(CardView, {
          ...this.args,
          ...actionHandlers(),
          items: this.dynamicItems,
          style: {height: '100%', width: '100%'}
        })
      ]);
    }
  }),
  args: {
    items
  },
  name: 'default Grid layout with initialized layout'
};

export const StaticCards: Story = {
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          height: '90vh',
          overflow: 'auto',
          resize: 'both',
          width: '800px'
        }
      }, [
        h(CardView, {
          ...args,
          ...actionHandlers(),
          items: items.slice(0, 5),
          style: {height: '100%', width: '100%'}
        })
      ]);
    }
  }),
  name: 'static card'
};

export const DefaultGridConstructor: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layout: GridLayout
  },
  name: 'default Grid layout w/ layout constructor'
};

export const HorizontalGrid: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    cardOrientation: 'horizontal'
  },
  name: 'Grid layout with horizontal cards, initialized layout'
};

export const HorizontalGridConstructor: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    cardOrientation: 'horizontal',
    layout: GridLayout
  },
  name: 'Grid layout with horizontal cards, layout constructor'
};

export const FalsyIds: Story = {
  render: (args) => ({
    render() {
      return h('div', {
        style: {
          height: '90vh',
          overflow: 'auto',
          resize: 'both',
          width: '800px'
        }
      }, [
        h(CardView, {
          ...args,
          ...actionHandlers(),
          items: falsyItems,
          style: {height: '100%', width: '100%'}
        })
      ]);
    }
  }),
  args: {
    items: falsyItems
  },
  name: 'falsy ids'
};

export const DisabledKeys: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    disabledKeys: ['Joe 2', 'Bob 4']
  },
  name: 'disabled keys, Joe2, Bob 4'
};

export const ControlledCards: Story = {
  render: (args) => ({
    setup() {
      let removeIndex = ref('');
      let controlledItems = ref(items.slice());
      let selectedKeys = ref<StorySelectionValue>('all');
      let onRemove = () => {
        controlledItems.value = removeNthItem(removeIndex.value, controlledItems.value);
      };

      return {
        args,
        controlledItems,
        onRemove,
        removeIndex,
        selectedKeys
      };
    },
    render() {
      return h('div', {
        style: {
          height: '90vh',
          overflow: 'auto',
          resize: 'both',
          width: '800px'
        }
      }, [
        h('div', {
          style: {
            alignItems: 'flex-end',
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            maxWidth: '500px'
          }
        }, [
          h('label', [
            h('span', {
              style: {
                display: 'block',
                fontSize: '12px',
                marginBottom: '4px'
              }
            }, 'Nth item to remove'),
            h('input', {
              onInput: (event: Event) => {
                let target = event.target as HTMLInputElement;
                this.removeIndex = target.value;
              },
              style: {padding: '6px 8px', width: '180px'},
              value: this.removeIndex
            })
          ]),
          h('button', {
            onClick: this.onRemove,
            style: {height: '32px', padding: '0 10px'},
            type: 'button'
          }, 'Remove')
        ]),
        h(CardView, {
          ...this.args,
          ...actionHandlers(),
          items: this.controlledItems,
          selectedKeys: this.selectedKeys,
          style: {height: '100%', width: '100%'},
          onSelectionChange: (keys: unknown) => {
            let nextSelection = normalizeStorySelectionValue(keys);
            this.selectedKeys = nextSelection;
            action('onSelectionChange')(nextSelection);
          }
        })
      ]);
    }
  }),
  args: {
    items
  },
  name: 'selected keys, controlled'
};

const NoCards: Story = {
  render: (args) => ({
    setup() {
      let show = ref(false);

      return {
        args,
        show
      };
    },
    render() {
      return h('div', [
        h('button', {
          onClick: () => {
            this.show = !this.show;
          },
          style: {marginBottom: '8px'},
          type: 'button'
        }, 'Toggle items'),
        h(CardView, {
          ...this.args,
          ...actionHandlers(),
          items: this.show ? items : [],
          style: {
            background: 'var(--spectrum-global-color-gray-300)',
            height: '600px',
            width: '800px'
          }
        })
      ]);
    }
  })
};

export const ResizeObserverCrash: Story = NoCards;

export const IsLoadingHeightGrid: Story = {
  ...NoCards,
  args: {
    ...NoCards.args,
    loadingState: 'loading'
  },
  name: 'loadingState = loading, set height'
};

export const LoadingMoreGrid: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    loadingState: 'loadingMore'
  },
  name: 'loadingState = loadingMore'
};

export const FilteringGrid: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    loadingState: 'filtering'
  },
  name: 'loadingState = filtering'
};

export const EmptyWithHeightGrid: Story = {
  ...NoCards,
  args: {
    ...NoCards.args,
    renderEmptyState
  },
  name: 'empty, set height'
};

export const AsyncLoading: Story = {
  render: (args) => ({
    setup() {
      let asyncItems = ref<GridCardItem[]>([]);
      let loadingState = ref<'idle' | 'loading' | 'loadingMore'>('loading');

      onMounted(() => {
        setTimeout(() => {
          asyncItems.value = items.slice(0, 8);
          loadingState.value = 'idle';
        }, 1200);
      });

      let loadMore = () => {
        if (loadingState.value !== 'idle') {
          return;
        }

        loadingState.value = 'loadingMore';
        setTimeout(() => {
          let nextLength = Math.min(asyncItems.value.length + 5, items.length);
          asyncItems.value = items.slice(0, nextLength);
          loadingState.value = 'idle';
        }, 1000);
      };

      return {
        args,
        asyncItems,
        loadMore,
        loadingState
      };
    },
    render() {
      return h('div', {
        style: {
          height: '90vh',
          overflow: 'auto',
          resize: 'both',
          width: '800px'
        }
      }, [
        h('button', {
          disabled: this.loadingState !== 'idle' || this.asyncItems.length >= items.length,
          onClick: this.loadMore,
          style: {marginBottom: '8px'},
          type: 'button'
        }, 'Load more'),
        h(CardView, {
          ...this.args,
          ...actionHandlers(),
          items: this.asyncItems,
          loadingState: this.loadingState,
          style: {height: '100%', width: '100%'}
        })
      ]);
    }
  }),
  args: {
    items
  },
  name: 'Async loading'
};

export const CustomLayoutOptions: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layoutOptions: {maxColumns: 2, margin: 150, minSpace: {height: 10, width: 10}, itemPadding: 400}
  },
  name: 'Custom layout options'
};
