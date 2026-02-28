import {ActionButton} from '@vue-spectrum/button';
import {action} from 'storybook/actions';
import {h} from 'vue';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ActionButtonStoryArgs = {
  autoFocus?: boolean,
  elementType?: 'a' | 'button' | 'div' | 'span',
  href?: string,
  isDisabled?: boolean,
  isQuiet?: boolean,
  onPress?: (event: MouseEvent | KeyboardEvent) => void,
  onPressEnd?: (event: MouseEvent | KeyboardEvent) => void,
  onPressStart?: (event: MouseEvent | KeyboardEvent) => void,
  rel?: string,
  staticColor?: 'black' | 'white',
  target?: string,
  type?: 'button' | 'reset' | 'submit'
};

type ActionButtonRenderProps = Omit<ActionButtonStoryArgs, 'onPress' | 'onPressEnd' | 'onPressStart'>;

function pickActionButtonProps(args: ActionButtonStoryArgs): ActionButtonRenderProps {
  let {
    onPress: _onPress,
    onPressEnd: _onPressEnd,
    onPressStart: _onPressStart,
    ...buttonProps
  } = args;

  return buttonProps;
}

function createPressActionHandlers(args: ActionButtonStoryArgs) {
  let isPressed = false;

  return {
    onBlur: (event: FocusEvent) => {
      if (isPressed) {
        args.onPressEnd?.(event as unknown as KeyboardEvent);
        isPressed = false;
      }
    },
    onClick: (event: MouseEvent) => {
      args.onPress?.(event);
    },
    onKeydown: (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
        return;
      }

      args.onPressStart?.(event);
      isPressed = true;
    },
    onKeyup: (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
        return;
      }

      if (isPressed) {
        args.onPressEnd?.(event);
        isPressed = false;
      }
    },
    onPointercancel: () => {
      isPressed = false;
    },
    onPointerdown: (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      args.onPressStart?.(event as unknown as MouseEvent);
      isPressed = true;
    },
    onPointerleave: () => {
      isPressed = false;
    },
    onPointerup: (event: PointerEvent) => {
      if (event.button !== 0 || !isPressed) {
        return;
      }

      args.onPressEnd?.(event as unknown as MouseEvent);
      isPressed = false;
    }
  };
}

function renderAddIcon() {
  return h('svg', {
    'aria-hidden': 'true',
    class: 'spectrum-Icon',
    viewBox: '0 0 24 24',
    width: '18',
    height: '18'
  }, [
    h('path', {
      d: 'M12 5c.41 0 .75.34.75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5c0-.41.34-.75.75-.75z',
      fill: 'currentColor'
    })
  ]);
}

function wrapInProvider(content: ReturnType<typeof h>) {
  return h(Provider, {
    theme: defaultTheme,
    colorScheme: 'light',
    scale: 'medium'
  }, {
    default: () => [content]
  });
}

function renderActionPair(args: ActionButtonStoryArgs, defaultChildren: unknown[], disabledChildren: unknown[]) {
  let buttonProps = pickActionButtonProps(args);
  let pressHandlers = createPressActionHandlers(args);

  return h('div', {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, [
    h(ActionButton, {...buttonProps, ...pressHandlers}, {
      default: () => defaultChildren
    }),
    h(ActionButton, {...buttonProps, isDisabled: true}, {
      default: () => disabledChildren
    })
  ]);
}

function renderWithBackground(backgroundColor: string, content: ReturnType<typeof h>) {
  return h('div', {
    style: {
      backgroundColor,
      display: 'inline-block',
      padding: '24px'
    }
  }, [content]);
}

function makeRenderer(defaultChildren: unknown[], disabledChildren: unknown[]) {
  return (args: ActionButtonStoryArgs) => ({
    render() {
      return wrapInProvider(renderActionPair(args, defaultChildren, disabledChildren));
    }
  });
}

const meta = {
  title: 'Button/ActionButton',
  component: ActionButton,
  args: {
    onPress: action('press'),
    onPressStart: action('pressstart'),
    onPressEnd: action('pressend')
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
    staticColor: {
      table: {
        disable: true
      }
    },
    isQuiet: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: makeRenderer(['Default'], ['Disabled'])
};

export const WithIcon: Story = {
  render: makeRenderer(
    [renderAddIcon(), h('span', {class: 'spectrum-ActionButton-label'}, 'Default')],
    [h('span', {class: 'spectrum-ActionButton-label'}, 'Disabled'), renderAddIcon()]
  )
};

export const IconOnly: Story = {
  render: (args: ActionButtonStoryArgs) => ({
    render() {
      let buttonProps = pickActionButtonProps(args);
      let pressHandlers = createPressActionHandlers(args);

      return wrapInProvider(h('div', {
        style: {
          display: 'flex',
          gap: '8px'
        }
      }, [
        h(ActionButton, {
          ...buttonProps,
          ...pressHandlers,
          'aria-label': 'Add button'
        }, {
          default: () => [renderAddIcon()]
        }),
        h(ActionButton, {
          ...buttonProps,
          isDisabled: true,
          'aria-label': 'Disabled add button'
        }, {
          default: () => [renderAddIcon()]
        })
      ]));
    }
  })
};

export const StaticWhite: Story = {
  args: {
    staticColor: 'white'
  },
  argTypes: {
    staticColor: {
      control: 'text',
      table: {
        disable: true
      }
    }
  },
  render: (args: ActionButtonStoryArgs) => ({
    render() {
      return wrapInProvider(renderWithBackground('rgb(9, 90, 186)', renderActionPair(
        args,
        [renderAddIcon(), h('span', {class: 'spectrum-ActionButton-label'}, 'Default')],
        [h('span', {class: 'spectrum-ActionButton-label'}, 'Disabled'), renderAddIcon()]
      )));
    }
  }),
  name: 'staticColor: white'
};

export const StaticBlack: Story = {
  args: {
    staticColor: 'black'
  },
  argTypes: {
    staticColor: {
      control: 'text',
      table: {
        disable: true
      }
    }
  },
  render: (args: ActionButtonStoryArgs) => ({
    render() {
      return wrapInProvider(renderWithBackground('rgb(255, 216, 64)', renderActionPair(
        args,
        [renderAddIcon(), h('span', {class: 'spectrum-ActionButton-label'}, 'Default')],
        [h('span', {class: 'spectrum-ActionButton-label'}, 'Disabled'), renderAddIcon()]
      )));
    }
  }),
  name: 'staticColor: black'
};
