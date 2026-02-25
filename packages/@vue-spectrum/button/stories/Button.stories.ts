import {action} from '@storybook/addon-actions';
import {Button} from '@vue-spectrum/button';
import {h, ref} from 'vue';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ButtonStoryArgs = {
  autoFocus?: boolean,
  elementType?: 'a' | 'button' | 'div' | 'span',
  href?: string,
  isDisabled?: boolean,
  isPending?: boolean,
  onClick?: (event: MouseEvent) => void,
  rel?: string,
  staticColor?: 'black' | 'white',
  style?: 'fill' | 'outline',
  target?: string,
  type?: 'button' | 'reset' | 'submit',
  variant?: 'accent' | 'cta' | 'negative' | 'overBackground' | 'primary' | 'secondary'
};

function renderBellIcon() {
  return h('svg', {
    'aria-hidden': 'true',
    class: 'spectrum-Icon',
    viewBox: '0 0 24 24',
    width: '18',
    height: '18'
  }, [
    h('circle', {
      cx: '12',
      cy: '12',
      r: '7',
      fill: 'currentColor'
    })
  ]);
}

function wrapInProvider(args: ButtonStoryArgs, content: ReturnType<typeof h>) {
  let wrappedContent = content;
  if (args.variant === 'overBackground' || args.staticColor === 'white') {
    wrappedContent = h('div', {
      style: {
        backgroundColor: 'rgb(9, 90, 186)',
        display: 'inline-block',
        padding: '15px 20px'
      }
    }, [content]);
  } else if (args.staticColor === 'black') {
    wrappedContent = h('div', {
      style: {
        backgroundColor: 'rgb(206, 247, 243)',
        color: 'rgb(15, 121, 125)',
        display: 'inline-block',
        padding: '15px 20px'
      }
    }, [content]);
  }

  return h(Provider, {
    theme: defaultTheme,
    colorScheme: 'light',
    scale: 'medium'
  }, {
    default: () => [wrappedContent]
  });
}

function renderButtonPair(args: ButtonStoryArgs, defaultChildren: unknown[], disabledChildren: unknown[]) {
  return h('div', {
    style: {
      display: 'flex',
      gap: '16px'
    }
  }, [
    h(Button, {...args}, {
      default: () => defaultChildren
    }),
    h(Button, {...args, isDisabled: true}, {
      default: () => disabledChildren
    })
  ]);
}

function makePairRenderer(defaultChildren: unknown[], disabledChildren: unknown[]) {
  return (args: ButtonStoryArgs) => ({
    render() {
      return wrapInProvider(args, renderButtonPair(args, defaultChildren, disabledChildren));
    }
  });
}

const meta = {
  title: 'Button',
  component: Button,
  args: {
    onClick: action('click'),
    variant: 'accent'
  },
  argTypes: {
    onClick: {
      table: {
        disable: true
      }
    },
    autoFocus: {
      control: 'boolean'
    },
    variant: {
      control: 'select',
      options: ['accent', 'primary', 'secondary', 'negative', 'cta', 'overBackground']
    },
    style: {
      control: 'select',
      options: [undefined, 'fill', 'outline']
    },
    staticColor: {
      control: 'select',
      options: [undefined, 'white', 'black']
    },
    isPending: {
      control: 'boolean',
      defaultValue: false
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: makePairRenderer(['Default'], ['Disabled'])
};

export const WithIcon: Story = {
  render: makePairRenderer(
    [renderBellIcon(), h('span', {class: 'spectrum-Button-label'}, 'Default')],
    [renderBellIcon(), h('span', {class: 'spectrum-Button-label'}, 'Disabled')]
  )
};

export const IconOnly: Story = {
  render: (args: ButtonStoryArgs) => ({
    render() {
      return wrapInProvider(args, h('div', {
        style: {
          display: 'flex',
          gap: '16px'
        }
      }, [
        h(Button, {
          ...args,
          'aria-label': 'Notifications'
        }, {
          default: () => [renderBellIcon()]
        }),
        h(Button, {
          ...args,
          isDisabled: true,
          'aria-label': 'Notifications (disabled)'
        }, {
          default: () => [renderBellIcon()]
        })
      ]));
    }
  })
};

export const AnchorElement: Story = {
  render: makePairRenderer(['Default'], ['Disabled']),
  args: {
    elementType: 'a'
  },
  name: 'element: a'
};

export const AnchorElementWithSelf: Story = {
  render: makePairRenderer(['Default'], ['Disabled']),
  args: {
    elementType: 'a',
    href: '//example.com',
    target: '_self'
  },
  name: 'element: a, href: \'//example.com\', target: \'_self\''
};

export const AnchorElementNoRefferer: Story = {
  render: makePairRenderer(['Default'], ['Disabled']),
  args: {
    elementType: 'a',
    href: '//example.com',
    rel: 'noopener noreferrer'
  },
  name: 'element: a, rel: \'noopener noreferrer\''
};

export const UserSelect: Story = {
  render: () => ({
    setup() {
      let firstReady = ref(false);
      let secondReady = ref(false);

      let activateFirst = () => {
        setTimeout(() => {
          firstReady.value = true;
        }, 3000);
      };

      let activateSecond = () => {
        setTimeout(() => {
          secondReady.value = true;
        }, 3000);
      };

      return {
        activateFirst,
        activateSecond,
        firstReady,
        secondReady
      };
    },
    render() {
      return wrapInProvider({variant: 'cta'}, h('div', {
        style: {
          display: 'flex',
          gap: '16px'
        }
      }, [
        h(Button, {
          variant: 'cta',
          style: 'fill',
          onPointerdown: this.activateFirst
        }, {
          default: () => [
            h('span', {
              style: this.firstReady ? undefined : {background: 'red', userSelect: 'text'}
            }, 'Press and hold (overwrite)')
          ]
        }),
        h(Button, {
          variant: 'cta',
          style: 'fill',
          onPointerdown: this.activateSecond
        }, {
          default: () => [
            h('span', {
              style: this.secondReady ? undefined : {background: 'red'}
            }, 'Press and hold (no overwrite)')
          ]
        })
      ]));
    }
  }),
  parameters: {
    description: {
      data: 'Pressing and holding on either buttons should not trigger text selection on the labels.'
    }
  }
};

export const PendingSpinner: Story = {
  render: (args: ButtonStoryArgs) => ({
    setup() {
      let pendingDefault = ref(false);
      let pendingIcon = ref(false);

      let triggerPending = (target: 'default' | 'icon') => {
        if (target === 'default') {
          pendingDefault.value = true;
          setTimeout(() => {
            pendingDefault.value = false;
          }, 5000);
          return;
        }

        pendingIcon.value = true;
        setTimeout(() => {
          pendingIcon.value = false;
        }, 5000);
      };

      return {
        pendingDefault,
        pendingIcon,
        triggerPending
      };
    },
    render() {
      return wrapInProvider(args, h('div', {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px'
        }
      }, [
        h(Button, {
          ...args,
          isPending: this.pendingDefault,
          onClick: (event: MouseEvent) => {
            action('press')(event);
            this.triggerPending('default');
          }
        }, {
          default: () => ['click me!']
        }),
        h(Button, {
          ...args,
          isPending: this.pendingIcon,
          onClick: (event: MouseEvent) => {
            action('press')(event);
            this.triggerPending('icon');
          }
        }, {
          default: () => [renderBellIcon(), h('span', {class: 'spectrum-Button-label'}, 'I have an icon')]
        }),
        h(Button, {
          ...args,
          isPending: args.isPending
        }, {
          default: () => [h('span', {class: 'spectrum-Button-label'}, 'Controlled')]
        })
      ]));
    }
  })
};
