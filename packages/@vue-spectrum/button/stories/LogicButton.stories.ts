import {LogicButton} from '@vue-spectrum/button';
import {action} from '@storybook/addon-actions';
import {h} from 'vue';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type LogicButtonStoryArgs = {
  autoFocus?: boolean,
  isDisabled?: boolean,
  onClick?: (event: MouseEvent) => void,
  variant?: 'and' | 'or'
};

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
  return h('div', [
    h(LogicButton, {...args}, {
      default: () => ['Default']
    }),
    h(LogicButton, {
      ...args,
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
    onClick: action('click')
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
      options: ['and', 'or']
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
