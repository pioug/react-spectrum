import {action} from 'storybook/actions';
import {Button} from '@vue-spectrum/button';
import Bell from '@spectrum-icons-vue/workflow/Bell';
import {Form} from '@vue-spectrum/form';
import {h, ref} from 'vue';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ButtonStoryArgs = {
  autoFocus?: boolean,
  elementType?: 'a' | 'button' | 'div' | 'span',
  href?: string,
  isDisabled?: boolean,
  isPending?: boolean,
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void,
  onPress?: (event: MouseEvent | KeyboardEvent) => void,
  onPressChange?: (isPressed: boolean) => void,
  onPressEnd?: (event: MouseEvent | KeyboardEvent) => void,
  onPressStart?: (event: MouseEvent | KeyboardEvent) => void,
  onPressUp?: (event: MouseEvent | KeyboardEvent) => void,
  rel?: string,
  staticColor?: 'black' | 'white',
  style?: 'fill' | 'outline',
  target?: string,
  type?: 'button' | 'reset' | 'submit',
  variant?: 'accent' | 'cta' | 'negative' | 'overBackground' | 'primary' | 'secondary'
};

type ButtonRenderProps = Omit<
  ButtonStoryArgs,
  'onBlur' | 'onFocus' | 'onKeyUp' | 'onPress' | 'onPressChange' | 'onPressEnd' | 'onPressStart' | 'onPressUp'
>;

const PENDING_TIMEOUT = 5000;

function pickButtonProps(args: ButtonStoryArgs): ButtonRenderProps {
  let {
    onBlur: _onBlur,
    onFocus: _onFocus,
    onKeyUp: _onKeyUp,
    onPress: _onPress,
    onPressChange: _onPressChange,
    onPressEnd: _onPressEnd,
    onPressStart: _onPressStart,
    onPressUp: _onPressUp,
    ...buttonProps
  } = args;

  return buttonProps;
}

function createPressActionHandlers(args: ButtonStoryArgs) {
  let isPressed = false;

  let setPressed = (nextPressed: boolean) => {
    if (isPressed === nextPressed) {
      return;
    }

    isPressed = nextPressed;
    args.onPressChange?.(nextPressed);
  };

  return {
    onBlur: (event: FocusEvent) => {
      args.onBlur?.(event);
      if (isPressed) {
        args.onPressEnd?.(event as unknown as KeyboardEvent);
        setPressed(false);
      }
    },
    onClick: (event: MouseEvent) => {
      args.onPress?.(event);
    },
    onFocus: (event: FocusEvent) => {
      args.onFocus?.(event);
    },
    onKeydown: (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
        return;
      }

      args.onPressStart?.(event);
      setPressed(true);
    },
    onKeyup: (event: KeyboardEvent) => {
      args.onKeyUp?.(event);
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
        return;
      }

      if (isPressed) {
        args.onPressEnd?.(event);
        args.onPressUp?.(event);
        setPressed(false);
      }
    },
    onPointercancel: () => {
      if (isPressed) {
        setPressed(false);
      }
    },
    onPointerdown: (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      args.onPressStart?.(event as unknown as MouseEvent);
      setPressed(true);
    },
    onPointerleave: () => {
      if (isPressed) {
        setPressed(false);
      }
    },
    onPointerup: (event: PointerEvent) => {
      if (event.button !== 0 || !isPressed) {
        return;
      }

      args.onPressEnd?.(event as unknown as MouseEvent);
      args.onPressUp?.(event as unknown as MouseEvent);
      setPressed(false);
    }
  };
}

function renderBellIcon(ariaLabel?: string) {
  return h(Bell, ariaLabel ? {'aria-label': ariaLabel} : {'aria-hidden': 'true'});
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
  let buttonProps = pickButtonProps(args);
  let defaultHandlers = createPressActionHandlers(args);

  return h('div', {
    style: {
      display: 'flex',
      gap: '16px'
    }
  }, [
    h(Button, {...buttonProps, ...defaultHandlers}, {
      default: () => defaultChildren
    }),
    h(Button, {...buttonProps, isDisabled: true}, {
      default: () => disabledChildren
    })
  ]);
}

function makePairRenderer(
  defaultChildren: unknown[],
  disabledChildren: unknown[],
  defaultProps: Partial<ButtonStoryArgs> = {}
) {
  return (args: ButtonStoryArgs) => ({
    render() {
      let mergedArgs = {
        ...defaultProps,
        ...args
      };
      return wrapInProvider(mergedArgs, renderButtonPair(mergedArgs, defaultChildren, disabledChildren));
    }
  });
}

function renderPendingButtonContainer(args: ButtonStoryArgs, content: ReturnType<typeof h>) {
  let backgroundColor: string | undefined;
  if (args.variant === 'overBackground' || args.staticColor === 'white') {
    backgroundColor = 'rgb(9, 90, 186)';
  } else if (args.staticColor === 'black') {
    backgroundColor = 'var(--spectrum-global-color-static-yellow-200)';
  }

  return h('div', {
    style: {
      backgroundColor,
      display: 'inline-block',
      padding: '16px'
    }
  }, [content]);
}

const meta = {
  title: 'Button',
  component: Button,
  args: {
    onPress: action('press'),
    onPressStart: action('pressstart'),
    onPressEnd: action('pressend'),
    onPressChange: action('presschange'),
    onPressUp: action('pressup'),
    onFocus: action('focus'),
    onBlur: action('blur'),
    onKeyUp: action('keyup'),
    variant: 'accent'
  },
  argTypes: {
    onPress: {
      table: {
        disable: true
      }
    },
    onPressStart: {
      table: {
        disable: true
      }
    },
    onPressEnd: {
      table: {
        disable: true
      }
    },
    onPressUp: {
      table: {
        disable: true
      }
    },
    onPressChange: {},
    onFocus: {},
    onBlur: {},
    onKeyUp: {},
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
        h(TooltipTrigger, {
          content: 'Notifications',
          offset: 2
        }, {
          default: () => h(Button, {
            ...args,
            'aria-label': 'Notifications'
          }, {
            default: () => [renderBellIcon()]
          })
        }),
        h(TooltipTrigger, {
          content: 'Notifications',
          offset: 2
        }, {
          default: () => h(Button, {
            ...args,
            isDisabled: true,
            'aria-label': 'Notifications (disabled)'
          }, {
            default: () => [renderBellIcon()]
          })
        })
      ]));
    }
  })
};

export const AnchorElement: Story = {
  render: makePairRenderer(['Default'], ['Disabled'], {
    elementType: 'a'
  }),
  name: 'element: a'
};

export const AnchorElementWithSelf: Story = {
  render: makePairRenderer(['Default'], ['Disabled'], {
    elementType: 'a',
    href: '//example.com',
    target: '_self'
  }),
  name: 'element: a, href: \'//example.com\', target: \'_self\''
};

export const AnchorElementNoRefferer: Story = {
  render: makePairRenderer(['Default'], ['Disabled'], {
    elementType: 'a',
    href: '//example.com',
    rel: 'noopener noreferrer'
  }),
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
          UNSAFE_style: this.firstReady ? undefined : {background: 'red', userSelect: 'text'},
          onPointerdown: this.activateFirst
        }, {
          default: () => ['Press and hold (overwrite)']
        }),
        h(Button, {
          variant: 'cta',
          UNSAFE_style: this.secondReady ? undefined : {background: 'red'},
          onPointerdown: this.activateSecond
        }, {
          default: () => ['Press and hold (no overwrite)']
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
      let pendingOnClick = ref(false);
      let pendingAriaLabel = ref(false);
      let pendingIconAriaLabel = ref(false);
      let pendingNoAriaLabel = ref(false);
      let pendingTooltip = ref(false);
      let pendingForm = ref(false);

      let startPending = (state: {value: boolean}) => {
        state.value = true;
        setTimeout(() => {
          state.value = false;
        }, PENDING_TIMEOUT);
      };

      let handleFormSubmit = (event: Event) => {
        event.preventDefault();
        if (!pendingForm.value) {
          startPending(pendingForm);
        }
      };

      let buttonProps = pickButtonProps(args);
      let iconOnly = [renderBellIcon()];

      return () => wrapInProvider(args, h('div', {
        style: {
          display: 'grid',
          rowGap: '8px'
        }
      }, [
        h('div', {
          style: {
            display: 'flex',
            flexWrap: 'wrap'
          }
        }, [
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isPending: pendingDefault.value,
            onClick: (event: MouseEvent) => {
              action('press')(event);
              startPending(pendingDefault);
            }
          }, {
            default: () => ['click me!']
          })),
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isPending: pendingIcon.value,
            onClick: (event: MouseEvent) => {
              action('press')(event);
              startPending(pendingIcon);
            }
          }, {
            default: () => [renderBellIcon(), h('span', {class: 'spectrum-Button-label'}, 'I have an icon')]
          })),
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isPending: pendingOnClick.value,
            onClick: (event: MouseEvent) => {
              action('click')(event);
              startPending(pendingOnClick);
            }
          }, {
            default: () => [h('span', {class: 'spectrum-Button-label'}, 'with onClick')]
          })),
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isDisabled: true
          }, {
            default: () => ['disabled']
          }))
        ]),
        h('div', {
          style: {
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap'
          }
        }, [
          h('span', 'Aria-label "Button label" on button'),
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            'aria-label': 'Button label',
            isPending: pendingAriaLabel.value,
            onClick: (event: MouseEvent) => {
              action('press')(event);
              startPending(pendingAriaLabel);
            }
          }, {
            default: () => iconOnly
          })),
          h('span', 'Aria-label "icon label" on icon'),
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isPending: pendingIconAriaLabel.value,
            onClick: (event: MouseEvent) => {
              action('press')(event);
              startPending(pendingIconAriaLabel);
            }
          }, {
            default: () => [renderBellIcon('icon label')]
          })),
          h('span', 'No aria-labels--bad implementation'),
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isPending: pendingNoAriaLabel.value,
            onClick: (event: MouseEvent) => {
              action('press')(event);
              startPending(pendingNoAriaLabel);
            }
          }, {
            default: () => iconOnly
          })),
          h('span', 'Tooltip and aria-label "Notifications" on button'),
          renderPendingButtonContainer(buttonProps, h(TooltipTrigger, {
            content: 'Click here to view',
            offset: 2
          }, {
            default: () => h(Button, {
              ...buttonProps,
              'aria-label': 'Notifications',
              isPending: pendingTooltip.value,
              onClick: (event: MouseEvent) => {
                action('press')(event);
                startPending(pendingTooltip);
              }
            }, {
              default: () => iconOnly
            })
          }))
        ]),
        h('div', {
          style: {
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap'
          }
        }, [
          renderPendingButtonContainer(buttonProps, h(Button, {
            ...buttonProps,
            isPending: args.isPending,
            onClick: () => {
              action('press')('controlled');
            }
          }, {
            default: () => [h('span', {class: 'spectrum-Button-label'}, 'Controlled')]
          }))
        ]),
        h('div', {
          style: {
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap'
          }
        }, [
          renderPendingButtonContainer(buttonProps, h(Form, {
            onSubmit: handleFormSubmit
          }, {
            default: () => [
              h(Button, {
                ...buttonProps,
                isPending: pendingForm.value,
                type: 'submit'
              }, {
                default: () => ['Form submit']
              })
            ]
          }))
        ])
      ]));
    }
  })
};
