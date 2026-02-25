import {ActionButton} from '@vue-spectrum/button';
import {action} from '@storybook/addon-actions';
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
  onClick?: (event: MouseEvent) => void,
  rel?: string,
  staticColor?: 'black' | 'white',
  target?: string,
  type?: 'button' | 'reset' | 'submit'
};

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
  return h('div', {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, [
    h(ActionButton, {...args}, {
      default: () => defaultChildren
    }),
    h(ActionButton, {...args, isDisabled: true}, {
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
    onClick: action('click')
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
      return wrapInProvider(h('div', {
        style: {
          display: 'flex',
          gap: '8px'
        }
      }, [
        h(ActionButton, {
          ...args,
          'aria-label': 'Add button'
        }, {
          default: () => [renderAddIcon()]
        }),
        h(ActionButton, {
          ...args,
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
