import {action} from 'storybook/actions';
import Bell from '@spectrum-icons-vue/workflow/Bell';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '../src';
import {h, ref} from 'vue';
import {Meta, StoryObj} from '@storybook/vue3-vite';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';

type ButtonGroupStoryArgs = {
  align?: 'start' | 'end' | 'center',
  isDisabled?: boolean,
  orientation?: 'horizontal' | 'vertical'
};

function renderButtonGroup(args: ButtonGroupStoryArgs, showExtraText: boolean, toggleExtraText: () => void) {
  return h(ButtonGroup, {
    ...args,
    style: {
      maxWidth: '100vw'
    }
  }, {
    default: () => [
      h(Button, {
        variant: 'primary',
        onClick: action('press')
      }, {
        default: () => 'Button 1'
      }),
      h(Button, {
        variant: 'negative',
        onClick: action('press')
      }, {
        default: () => 'Button long long long name'
      }),
      h(Button, {
        isDisabled: true,
        variant: 'primary',
        onClick: action('press')
      }, {
        default: () => 'Disabled button'
      }),
      h(Button, {
        variant: 'secondary',
        onClick: () => toggleExtraText()
      }, {
        default: () => [
          h(Bell, {'aria-hidden': 'true'}),
          h('span', {class: 'spectrum-Button-label'}, 'Click me to make Button larger'),
          showExtraText ? h('span', {class: 'spectrum-Button-label'}, 'to test overflow resizing :D') : null
        ]
      })
    ]
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

const meta = {
  title: 'ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'end', 'center']
    },
    isDisabled: {
      control: 'boolean'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical']
    }
  }
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    setup() {
      let showExtraText = ref(false);
      let toggleExtraText = () => {
        showExtraText.value = !showExtraText.value;
      };

      return {
        args,
        showExtraText,
        toggleExtraText
      };
    },
    render() {
      return wrapInProvider(h('div', {
        style: {
          backgroundColor: 'var(--spectrum-global-color-gray-50)',
          minWidth: '100px',
          overflow: 'auto',
          padding: '10px',
          resize: 'horizontal'
        }
      }, [
        renderButtonGroup(this.args, this.showExtraText, this.toggleExtraText)
      ]));
    }
  })
};

export const ConstantContainer: Story = {
  render: (args) => ({
    setup() {
      let isExpanded = ref(false);
      let showExtraText = ref(false);
      let toggleExpanded = () => {
        isExpanded.value = !isExpanded.value;
      };
      let toggleExtraText = () => {
        showExtraText.value = !showExtraText.value;
      };

      return {
        args,
        isExpanded,
        showExtraText,
        toggleExpanded,
        toggleExtraText
      };
    },
    render() {
      return wrapInProvider(h('div', {
        style: {
          backgroundColor: 'var(--spectrum-global-color-gray-50)',
          display: 'flex',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          padding: '10px',
          width: '800px'
        }
      }, [
        h('div', {
          style: {
            paddingRight: this.isExpanded ? '200px' : '10px'
          }
        }, [
          h(Button, {
            variant: 'secondary',
            onClick: this.toggleExpanded
          }, {
            default: () => this.isExpanded ? 'Shrink' : 'Expand'
          })
        ]),
        renderButtonGroup(this.args, this.showExtraText, this.toggleExtraText)
      ]));
    }
  }),
  name: 'constant container, changing siblings'
};
