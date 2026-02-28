import {LogicButton} from '@vue-spectrum/button';
import {action} from 'storybook/actions';
import {h} from 'vue';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type LogicButtonStoryArgs = {
  autoFocus?: boolean,
  isDisabled?: boolean,
  onPress?: (event: MouseEvent | KeyboardEvent) => void,
  onPressEnd?: (event: MouseEvent | KeyboardEvent) => void,
  onPressStart?: (event: MouseEvent | KeyboardEvent) => void,
  variant?: 'and' | 'or' | undefined
};

type LogicButtonRenderProps = Omit<LogicButtonStoryArgs, 'onPress' | 'onPressEnd' | 'onPressStart'>;

function pickLogicButtonProps(args: LogicButtonStoryArgs): LogicButtonRenderProps {
  let {
    onPress: _onPress,
    onPressEnd: _onPressEnd,
    onPressStart: _onPressStart,
    ...buttonProps
  } = args;

  return buttonProps;
}

function createPressActionHandlers(args: LogicButtonStoryArgs) {
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

function wrapInProvider(content: ReturnType<typeof h>) {
  return h(Provider, {
    theme: defaultTheme,
    colorScheme: 'light',
    scale: 'medium'
  }, {
    default: () => [content]
  });
}

function renderLogicButtons(args: LogicButtonStoryArgs) {
  let buttonProps = pickLogicButtonProps(args);
  let pressHandlers = createPressActionHandlers(args);

  return h('div', [
    h(LogicButton, {...buttonProps, ...pressHandlers}, {
      default: () => ['Default']
    }),
    h(LogicButton, {
      ...buttonProps,
      isDisabled: true,
      style: {marginInlineStart: '10px'}
    }, {
      default: () => ['Disabled']
    })
  ]);
}

const meta = {
  title: 'Button/LogicButton',
  component: LogicButton,
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
    autoFocus: {
      control: 'boolean'
    },
    variant: {
      control: 'select',
      options: ['and', 'or'],
      defaultValue: 'and'
    }
  }
} satisfies Meta<typeof LogicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: LogicButtonStoryArgs) => ({
    render() {
      return wrapInProvider(renderLogicButtons(args));
    }
  })
};
