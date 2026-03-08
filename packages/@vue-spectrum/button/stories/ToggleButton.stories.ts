import {ToggleButton} from '@vue-spectrum/button';
import {action} from 'storybook/actions';
import {h, ref} from 'vue';
import Add from '@spectrum-icons-vue/workflow/Add';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ToggleButtonStoryArgs = {
  autoFocus?: boolean,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isQuiet?: boolean,
  onPress?: (event: MouseEvent | KeyboardEvent) => void,
  onPressEnd?: (event: MouseEvent | KeyboardEvent) => void,
  onPressStart?: (event: MouseEvent | KeyboardEvent) => void,
  staticColor?: 'black' | 'white',
  variant?: 'accent' | 'cta' | 'negative' | 'overBackground' | 'primary' | 'secondary'
};

type RowProps = Omit<ToggleButtonStoryArgs, 'onPress' | 'onPressEnd' | 'onPressStart'>;

type ToggleButtonRenderProps = Omit<ToggleButtonStoryArgs, 'onPress' | 'onPressEnd' | 'onPressStart'>;

function pickToggleButtonProps(args: ToggleButtonStoryArgs): ToggleButtonRenderProps {
  let {
    onPress: _onPress,
    onPressEnd: _onPressEnd,
    onPressStart: _onPressStart,
    ...buttonProps
  } = args;

  return buttonProps;
}

function createPressActionHandlers(args: ToggleButtonStoryArgs) {
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
  return h(Add, {
    'aria-hidden': 'true'
  });
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

function renderBackground(backgroundColor: string, content: ReturnType<typeof h>) {
  return h('div', {
    style: {
      backgroundColor,
      display: 'inline-block',
      padding: '80px'
    }
  }, [content]);
}

function renderToggleContent(label: string) {
  return [renderAddIcon(), h('span', {class: 'spectrum-ActionButton-label'}, label)];
}

function makePairRenderer(rowVariants: RowProps[], backgroundColor?: string) {
  return (args: ToggleButtonStoryArgs) => ({
    setup() {
      let rows = rowVariants.map(() => ({
        firstSelected: ref(false),
        secondSelected: ref(true)
      }));
      let onChange = action('change');

      return () => {
        let buttonProps = pickToggleButtonProps(args);
        let renderedRows = h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: '12px'
          }
        }, rowVariants.map((rowProps, index) => {
          let firstPressHandlers = createPressActionHandlers(args);
          let secondPressHandlers = createPressActionHandlers(args);

          return h('div', {
            style: {
              display: 'flex',
              gap: '8px'
            }
          }, [
            h(ToggleButton, {
              ...buttonProps,
              ...rowProps,
              ...firstPressHandlers,
              modelValue: rows[index].firstSelected.value,
              'onUpdate:modelValue': (value: boolean) => {
                rows[index].firstSelected.value = value;
                onChange(value);
              }
            }, {
              default: () => renderToggleContent('Default')
            }),
            h(ToggleButton, {
              ...buttonProps,
              ...rowProps,
              ...secondPressHandlers,
              modelValue: rows[index].secondSelected.value,
              'onUpdate:modelValue': (value: boolean) => {
                rows[index].secondSelected.value = value;
                onChange(value);
              }
            }, {
              default: () => renderToggleContent('Selected')
            })
          ]);
        }));

        let content = backgroundColor ? renderBackground(backgroundColor, renderedRows) : renderedRows;
        return wrapInProvider(content);
      };
    }
  });
}

const meta = {
  title: 'Button/ToggleButton',
  component: ToggleButton,
  args: {
    onPress: action('press'),
    onPressStart: action('pressstart'),
    onPressEnd: action('pressend'),
    variant: 'cta'
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
    isEmphasized: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: makePairRenderer([{}])
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
  render: makePairRenderer([{}], 'rgb(0, 87, 190)'),
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
  render: makePairRenderer([{}], 'rgb(238, 205, 0)'),
  name: 'staticColor: black'
};

export const WHCM: Story = {
  render: () => makePairRenderer(
    [
      {},
      {isEmphasized: true},
      {isQuiet: true},
      {isEmphasized: true, isQuiet: true}
    ],
    'rgb(238, 205, 0)'
  )({}),
  name: 'styles to check WHCM support'
};

export const Controlled: Story = {
  render: () => ({
    setup() {
      let selected = ref(false);
      let onChange = (value: boolean) => {
        selected.value = value;
      };

      return () => wrapInProvider(h('div', [
        h(ToggleButton, {
          modelValue: selected.value,
          'onUpdate:modelValue': onChange
        }, {
          default: () => ['Press Me']
        }),
        h('br'),
        selected.value ? 'true' : 'false'
      ]));
    }
  }),
  name: 'controlled state'
};
