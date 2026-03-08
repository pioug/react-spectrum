import {action} from 'storybook/actions';
import {ActionButton} from '@vue-spectrum/button';
import {Card, CardView} from '../src';
import {Content, View} from '@vue-spectrum/view';
import {Flex} from '@vue-spectrum/layout';
import {Heading, Text} from '@vue-spectrum/text';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {Image} from '@vue-spectrum/image';
import {Link} from '@vue-spectrum/link';
import {TextField} from '@vue-spectrum/textfield';
import {Fragment, computed, h, onBeforeUnmount, onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type GridCardItem = {
  description?: string,
  detail?: string,
  height: number,
  id?: number | string,
  src: string,
  title: string,
  width: number
};

type ResizeObserverShot = {
  alt: string,
  id: number,
  label: string,
  src: string
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

const DEFAULT_DESCRIPTION = 'Very very very very very very very very very very very very very long description';

const staticItems: GridCardItem[] = [
  {...items[0], description: DEFAULT_DESCRIPTION, detail: 'PNG', title: 'Bob 1', id: 'Bob 1'},
  {...items[1], detail: 'PNG', title: 'Joe 1', id: 'Joe 1'},
  {...items[2], description: 'Description', detail: 'PNG', title: 'Jane 1', id: 'Jane 1'},
  {...items[3], description: DEFAULT_DESCRIPTION, detail: 'PNG', title: 'Bob 2', id: 'Bob 2'},
  {...items[4], description: 'Description', detail: 'PNG', title: 'Joe 2', id: 'Joe 2'}
];

const resizeObserverShots: ResizeObserverShot[] = [
  {id: 1, src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: 'foo', label: 'foo'},
  {id: 2, src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: 'bar', label: 'bar'},
  {id: 3, src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: 'baz', label: 'baz'},
  {id: 4, src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: 'qux', label: 'qux'},
  {id: 5, src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: 'foobar', label: 'foobar'},
  {id: 6, src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: 'foobaz', label: 'foobaz'}
];

export let falsyItems = [
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

function getImageFullData(index: number) {
  let image = items[index % items.length];
  return {
    height: image.height,
    src: image.src,
    width: image.width
  };
}

function splitCardViewArgs(args: Record<string, unknown>, baseStyle: Record<string, string> = {}) {
  let {
    height,
    style,
    width,
    ...cardViewArgs
  } = args;

  let cardViewStyle: Record<string, string> = {...baseStyle};
  if (typeof width === 'number' || typeof width === 'string') {
    cardViewStyle.width = String(width);
  }

  if (typeof height === 'number' || typeof height === 'string') {
    cardViewStyle.height = String(height);
  }

  if (style && typeof style === 'object' && !Array.isArray(style)) {
    Object.assign(cardViewStyle, style as Record<string, string>);
  }

  return {cardViewArgs, cardViewStyle};
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
  return h(IllustratedMessage, null, [
    h('svg', {
      height: '103',
      viewBox: '0 0 150 103',
      width: '150'
    }, [
      h('path', {
        d: 'M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z M32.6,16.5c0,0.6-0.4,1-1,1h-10c-0.6,0-1-0.4-1-1s0.4-1,1-1h10C32.2,15.5,32.6,15.9,32.6,16.5z M13.6,56.1l-8.6,8.5C4.8,65,4.4,65.1,4,65.1c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l8.6-8.5l-8.6-8.5c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l8.6,8.5l8.6-8.5c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L15.8,54l8.6,8.5c0.6,0.6,0.6,1.5,0,2.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4L13.6,56.1z'
      })
    ]),
    h(Heading, null, () => 'No results'),
    h(Content, null, () => [
      'No results found, press ',
      h(Link, {onPress: action('linkPress')}, () => 'here'),
      ' for more info.'
    ])
  ]);
}

function renderStandardCard(item: Partial<GridCardItem> & Pick<GridCardItem, 'src' | 'title'>) {
  return h(Card, {
    key: item.id ?? item.title
  }, {
    default: () => [
      h(Image, {src: item.src, alt: ''}),
      h(Heading, null, () => item.title),
      h(Text, {slot: 'detail'}, () => item.detail ?? 'PNG'),
      item.description != null ? h(Content, null, () => item.description) : null
    ].filter(Boolean)
  });
}

function renderStandardCardViewSlots() {
  return {
    default: ({item}: {item: GridCardItem}) => [
      renderStandardCard({
        ...item,
        description: item.description ?? DEFAULT_DESCRIPTION,
        detail: item.detail ?? 'PNG'
      })
    ]
  };
}

function renderResizeObserverCrashCard(shot: ResizeObserverShot) {
  return h(Card, {
    key: shot.id
  }, {
    default: () => [
      h(Flex, {
        UNSAFE_style: {
          position: 'absolute'
        },
        alignItems: 'center',
        direction: 'column',
        gap: 'size-150',
        height: 'calc(100% - 78px)',
        justifyContent: 'center',
        width: '100%'
      }, {
        default: () => [
          h(Image, {
            alt: shot.alt,
            height: '200px',
            src: shot.src,
            width: '200px'
          })
        ]
      }),
      h(Flex, {
        alignItems: 'start',
        direction: 'column',
        marginTop: 'size-100'
      }, {
        default: () => [
          h(Heading, {
            level: 4,
            style: {
              alignSelf: 'auto',
              fontWeight: 500
            }
          }, () => shot.label)
        ]
      })
    ]
  });
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
  excludeStories: ['NoCards', 'CustomLayout', 'falsyItems'],
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
      let splitArgs = computed(() => splitCardViewArgs(args as Record<string, unknown>, {
        height: '100%',
        width: '100%'
      }));
      let onRemove = () => {
        dynamicItems.value = removeNthItem(removeIndex.value, dynamicItems.value);
      };

      return {
        actionProps: actionHandlers(),
        cardViewArgs: computed(() => splitArgs.value.cardViewArgs),
        cardViewStyle: computed(() => splitArgs.value.cardViewStyle),
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
        h(Flex, {
          direction: 'column',
          height: '100%',
          width: '100%'
        }, {
          default: () => [
            h(Flex, {
              alignItems: 'end',
              direction: 'row',
              style: {maxWidth: '500px'}
            }, {
              default: () => [
                h(TextField, {
                  label: 'Nth item to remove',
                  modelValue: this.removeIndex,
                  'onUpdate:modelValue': (value: string) => {
                    this.removeIndex = value;
                  }
                }),
                h(ActionButton, {
                  onPress: this.onRemove
                }, {
                  default: () => 'Remove'
                })
              ]
            }),
            h(CardView, {
              ...this.cardViewArgs,
              ...this.actionProps,
              items: this.dynamicItems,
              style: this.cardViewStyle
            }, renderStandardCardViewSlots())
          ]
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
    setup() {
      let splitArgs = computed(() => splitCardViewArgs(args as Record<string, unknown>, {
        height: '100%',
        width: '100%'
      }));

      return {
        actionProps: actionHandlers(),
        cardViewArgs: computed(() => splitArgs.value.cardViewArgs),
        cardViewStyle: computed(() => splitArgs.value.cardViewStyle)
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
        h(CardView, {
          ...this.cardViewArgs,
          ...this.actionProps,
          items: staticItems,
          style: this.cardViewStyle
        }, renderStandardCardViewSlots())
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
    setup() {
      let splitArgs = computed(() => splitCardViewArgs(args as Record<string, unknown>, {
        height: '100%',
        width: '100%'
      }));

      return {
        actionProps: actionHandlers(),
        cardViewArgs: computed(() => splitArgs.value.cardViewArgs),
        cardViewStyle: computed(() => splitArgs.value.cardViewStyle)
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
        h(CardView, {
          ...this.cardViewArgs,
          ...this.actionProps,
          items: falsyItems,
          style: this.cardViewStyle
        }, renderStandardCardViewSlots())
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
      let splitArgs = computed(() => splitCardViewArgs(args as Record<string, unknown>, {
        height: '100%',
        width: '100%'
      }));
      let onRemove = () => {
        controlledItems.value = removeNthItem(removeIndex.value, controlledItems.value);
      };

      return {
        actionProps: actionHandlers(),
        cardViewArgs: computed(() => splitArgs.value.cardViewArgs),
        cardViewStyle: computed(() => splitArgs.value.cardViewStyle),
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
        h(Flex, {
          direction: 'column',
          height: '100%',
          width: '100%'
        }, {
          default: () => [
            h(Flex, {
              alignItems: 'end',
              direction: 'row',
              style: {maxWidth: '500px'}
            }, {
              default: () => [
                h(TextField, {
                  label: 'Nth item to remove',
                  modelValue: this.removeIndex,
                  'onUpdate:modelValue': (value: string) => {
                    this.removeIndex = value;
                  }
                }),
                h(ActionButton, {
                  onPress: this.onRemove
                }, {
                  default: () => 'Remove'
                })
              ]
            }),
            h(CardView, {
              ...this.cardViewArgs,
              ...this.actionProps,
              items: this.controlledItems,
              selectedKeys: this.selectedKeys,
              style: this.cardViewStyle,
              onSelectionChange: (keys: unknown) => {
                let nextSelection = normalizeStorySelectionValue(keys);
                this.selectedKeys = nextSelection;
                action('onSelectionChange')(nextSelection);
              }
            }, renderStandardCardViewSlots())
          ]
        })
      ]);
    }
  }),
  args: {
    items
  },
  name: 'selected keys, controlled'
};

export const NoCards: Story = {
  render: (args) => ({
    setup() {
      let show = ref(false);
      let splitArgs = computed(() => splitCardViewArgs(args as Record<string, unknown>, {
        background: 'var(--spectrum-global-color-gray-300)'
      }));

      return {
        actionProps: actionHandlers(),
        cardViewArgs: computed(() => splitArgs.value.cardViewArgs),
        cardViewStyle: computed(() => splitArgs.value.cardViewStyle),
        show
      };
    },
    render() {
      return h(Fragment, null, [
        h(ActionButton, {
          onPress: () => {
            this.show = !this.show;
          }
        }, {
          default: () => 'Toggle items'
        }),
        h(CardView, {
          ...this.cardViewArgs,
          ...this.actionProps,
          items: this.show ? items : [],
          style: this.cardViewStyle
        }, renderStandardCardViewSlots())
      ]);
    }
  })
};

export const ResizeObserverCrash: Story = {
  render: () => ({
    render() {
      return h(View, {
        backgroundColor: 'gray-75',
        height: '100vh',
        width: '100vw'
      }, {
        default: () => [
          h('div', {
            style: {
              height: '100%',
              position: 'relative',
              width: '100%'
            }
          }, [
            h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }
            }, [
              h(Flex, {
                alignItems: 'center',
                gap: 'size-200',
                margin: 'size-350'
              }, {
                default: () => [
                  h(Heading, {
                    level: 3,
                    style: {
                      margin: 0
                    }
                  }, () => 'My Demo Asset')
                ]
              }),
              h(CardView, {
                items: resizeObserverShots,
                layout: GridLayout,
                position: 'relative',
                selectionMode: 'none',
                width: '100%',
                flex: true
              }, {
                default: ({item}: {item: ResizeObserverShot}) => [renderResizeObserverCrashCard(item)]
              })
            ])
          ])
        ]
      });
    }
  })
};

export const IsLoadingHeightGrid: Story = {
  ...NoCards,
  args: {
    ...NoCards.args,
    height: '800px',
    loadingState: 'loading',
    width: '800px'
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
    height: '800px',
    renderEmptyState,
    width: '800px'
  },
  name: 'empty, set height'
};

export const AsyncLoading: Story = {
  render: (args) => ({
    setup() {
      let asyncItems = ref<GridCardItem[]>([]);
      let loadingState = ref<'idle' | 'loading'>('loading');
      let splitArgs = computed(() => splitCardViewArgs(args as Record<string, unknown>, {
        height: '100%',
        width: '100%'
      }));
      let abortController = new AbortController();
      let timeoutId: number | undefined;

      onMounted(() => {
        timeoutId = window.setTimeout(async () => {
          try {
            let response = await fetch('https://swapi.py4e.com/api/people/?search', {
              signal: abortController.signal
            });
            let json = await response.json() as {results?: Array<{name?: string}>};
            asyncItems.value = (json.results ?? []).map((element, index) => ({
              ...getImageFullData(index),
              id: element.name ?? `person-${index}`,
              title: element.name ?? `Person ${index + 1}`
            }));
          } finally {
            loadingState.value = 'idle';
          }
        }, 1500);
      });

      onBeforeUnmount(() => {
        abortController.abort();
        if (timeoutId != null) {
          window.clearTimeout(timeoutId);
        }
      });

      return {
        actionProps: actionHandlers(),
        asyncItems,
        cardViewArgs: computed(() => splitArgs.value.cardViewArgs),
        cardViewStyle: computed(() => splitArgs.value.cardViewStyle),
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
        h(CardView, {
          ...this.cardViewArgs,
          ...this.actionProps,
          items: this.asyncItems,
          loadingState: this.loadingState,
          style: this.cardViewStyle
        }, renderStandardCardViewSlots())
      ]);
    }
  }),
  args: {
    items
  },
  name: 'Async loading'
};

export function CustomLayout(props: Record<string, unknown>) {
  let renderDynamicCards = DynamicCards.render as Exclude<typeof DynamicCards.render, undefined>;
  return renderDynamicCards(props);
}

export const CustomLayoutOptions: Story = {
  ...DynamicCards,
  render: (args) => CustomLayout(args),
  args: {
    ...DynamicCards.args,
    layoutOptions: {maxColumns: 2, margin: 150, minSpace: {height: 10, width: 10}, itemPadding: 400}
  },
  name: 'Custom layout options'
};
