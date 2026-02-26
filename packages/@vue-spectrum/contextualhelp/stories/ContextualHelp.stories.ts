import {ContextualHelp} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const DEFAULT_HELP_TITLE = 'Help title';
const DEFAULT_HELP_BODY = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem.';
const DEFAULT_CHILDREN = {
  key: null,
  ref: null,
  props: {
    children: [{
      type: {},
      key: null,
      ref: null,
      props: {
        children: DEFAULT_HELP_TITLE
      }
    }, {
      type: {},
      key: null,
      ref: null,
      props: {
        children: {
          type: {},
          key: null,
          ref: null,
          props: {
            children: DEFAULT_HELP_BODY
          }
        }
      }
    }]
  }
};

function getDefaultTitle(children: unknown): string {
  if (
    children &&
    typeof children === 'object' &&
    'props' in children &&
    children.props &&
    typeof children.props === 'object' &&
    'children' in children.props &&
    Array.isArray(children.props.children) &&
    children.props.children[0] &&
    typeof children.props.children[0] === 'object' &&
    'props' in children.props.children[0] &&
    children.props.children[0].props &&
    typeof children.props.children[0].props === 'object' &&
    'children' in children.props.children[0].props &&
    typeof children.props.children[0].props.children === 'string'
  ) {
    return children.props.children[0].props.children;
  }

  return DEFAULT_HELP_TITLE;
}

function getDefaultBody(children: unknown): string {
  if (
    children &&
    typeof children === 'object' &&
    'props' in children &&
    children.props &&
    typeof children.props === 'object' &&
    'children' in children.props &&
    Array.isArray(children.props.children) &&
    children.props.children[1] &&
    typeof children.props.children[1] === 'object' &&
    'props' in children.props.children[1] &&
    children.props.children[1].props &&
    typeof children.props.children[1].props === 'object' &&
    'children' in children.props.children[1].props &&
    children.props.children[1].props.children &&
    typeof children.props.children[1].props.children === 'object' &&
    'props' in children.props.children[1].props.children &&
    children.props.children[1].props.children.props &&
    typeof children.props.children[1].props.children.props === 'object' &&
    'children' in children.props.children[1].props.children.props &&
    typeof children.props.children[1].props.children.props.children === 'string'
  ) {
    return children.props.children[1].props.children.props.children;
  }

  return DEFAULT_HELP_BODY;
}

const meta: Meta<typeof ContextualHelp> = {
  title: 'ContextualHelp',
  component: ContextualHelp,
  argTypes: {
    onOpenChange: {
      action: 'openChange',
      table: {
        disable: true
      }
    },
    placement: {
      control: 'select',
      options: [
        'bottom',
        'bottom left',
        'bottom right',
        'bottom start',
        'bottom end',
        'top',
        'top left',
        'top right',
        'top start',
        'top end',
        'left',
        'left top',
        'left bottom',
        'start',
        'start top',
        'start bottom',
        'right',
        'right top',
        'right bottom',
        'end',
        'end top',
        'end bottom'
      ]
    },
    variant: {
      control: 'select',
      defaultValue: 'help',
      options: ['help', 'info']
    },
    offset: {
      control: 'number',
      min: -500,
      max: 500
    },
    crossOffset: {
      control: 'number',
      min: -500,
      max: 500
    },
    containerPadding: {
      control: 'number',
      min: -500,
      max: 500
    },
    shouldFlip: {
      control: 'boolean'
    },
    children: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: DEFAULT_CHILDREN
  },
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {
        args,
        defaultBody: getDefaultBody(args.children),
        defaultTitle: getDefaultTitle(args.children)
      };
    },
    template: `
      <ContextualHelp v-bind="args">
        <h3 style="margin: 0 0 8px 0;">{{ defaultTitle }}</h3>
        <p style="margin: 0;">{{ defaultBody }}</p>
      </ContextualHelp>
    `
  })
};

export const WithLink: Story = {
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <ContextualHelp v-bind="args">
        <h3 style="margin: 0 0 8px 0;">Help title</h3>
        <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
        <template #footer>
          <a href="https://react-spectrum.adobe.com" target="_blank" rel="noreferrer">Learn more</a>
        </template>
      </ContextualHelp>
    `
  }),
  name: 'with link'
};

export const WithButton: Story = {
  args: {
    variant: 'help'
  },
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" disabled>Create</button>
        <ContextualHelp v-bind="args" class="foo">
          <h3 style="margin: 0 0 8px 0;">Help title</h3>
          <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
        </ContextualHelp>
      </div>
    `
  }),
  name: 'with button'
};

export const AriaLabelledyBy: Story = {
  render: (args) => ({
    components: {ContextualHelp},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div id="foo">I label the contextual help button</div>
        <ContextualHelp v-bind="args" aria-labelledby="foo">
          <h3 style="margin: 0 0 8px 0;">Help title</h3>
          <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
        </ContextualHelp>
      </div>
    `
  }),
  name: 'aria-labelledyby'
};
