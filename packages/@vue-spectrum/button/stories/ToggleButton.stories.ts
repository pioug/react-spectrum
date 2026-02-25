import {ToggleButton} from '@vue-spectrum/button';
import {action} from '@storybook/addon-actions';
import {h, ref} from 'vue';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ToggleButtonStoryArgs = {
  autoFocus?: boolean,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isQuiet?: boolean,
  onClick?: (event: MouseEvent) => void,
  staticColor?: 'black' | 'white'
};

type RowProps = Omit<ToggleButtonStoryArgs, 'onClick'>;

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

function renderBackground(backgroundColor: string, content: ReturnType<typeof h>) {
  return h('div', {
    style: {
      backgroundColor,
      display: 'inline-block',
      padding: '24px'
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
        let renderedRows = h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: '12px'
          }
        }, rowVariants.map((rowProps, index) => h('div', {
          style: {
            display: 'flex',
            gap: '8px'
          }
        }, [
          h(ToggleButton, {
            ...args,
            ...rowProps,
            modelValue: rows[index].firstSelected.value,
            'onUpdate:modelValue': (value: boolean) => {
              rows[index].firstSelected.value = value;
              onChange(value);
            }
          }, {
            default: () => renderToggleContent('Default')
          }),
          h(ToggleButton, {
            ...args,
            ...rowProps,
            modelValue: rows[index].secondSelected.value,
            'onUpdate:modelValue': (value: boolean) => {
              rows[index].secondSelected.value = value;
              onChange(value);
            }
          }, {
            default: () => renderToggleContent('Selected')
          })
        ])));

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
    onClick: action('press')
  },
  argTypes: {
    onClick: {
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
  render: makePairRenderer([{}], 'rgb(9, 90, 186)'),
  name: 'staticColor: white'
};

export const StaticBlack: Story = {
  args: {
    staticColor: 'black'
  },
  render: makePairRenderer([{}], 'rgb(255, 216, 64)'),
  name: 'staticColor: black'
};

export const WHCM: Story = {
  render: makePairRenderer(
    [
      {},
      {isEmphasized: true},
      {isQuiet: true},
      {isEmphasized: true, isQuiet: true}
    ],
    'rgb(255, 216, 64)'
  ),
  name: 'styles to check WHCM support'
};

export const Controlled: Story = {
  render: (args: ToggleButtonStoryArgs) => ({
    setup() {
      let selected = ref(false);
      let onChange = action('change');

      return () => wrapInProvider(h('div', [
        h(ToggleButton, {
          ...args,
          modelValue: selected.value,
          'onUpdate:modelValue': (value: boolean) => {
            selected.value = value;
            onChange(value);
          }
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
