import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {Switch} from '../src';

function resolveLabel(children: unknown): string {
  if (typeof children === 'string') {
    return children;
  }

  if (
    children &&
    typeof children === 'object' &&
    'props' in children &&
    children.props &&
    typeof children.props === 'object' &&
    'children' in children.props &&
    typeof children.props.children === 'string'
  ) {
    return children.props.children;
  }

  return 'Switch Label';
}

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  args: {
    isEmphasized: false
  },
  argTypes: {
    onChange: {
      action: 'change'
    },
    onFocus: {
      action: 'focus'
    },
    onBlur: {
      action: 'blur'
    },
    children: {
      control: 'object'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Switch},
    setup() {
      return {args, resolveLabel};
    },
    template: '<Switch v-bind="args">{{ resolveLabel(args.children) }}</Switch>'
  }),
  args: {
    children: {
      key: null,
      ref: null,
      props: {
        children: 'Switch Label'
      }
    }
  }
};

export const DefaultSelectedTrue: Story = {
  ...Default,
  args: {
    ...Default.args,
    defaultSelected: true
  },
  name: 'defaultSelected: true'
};

export const IsSelectedTrue: Story = {
  ...Default,
  args: {
    ...Default.args,
    isSelected: true
  },
  name: 'isSelected: true'
};

export const IsSelectedFalse: Story = {
  ...Default,
  args: {
    ...Default.args,
    isSelected: false
  },
  name: 'isSelected: false'
};

export const IsDisabledTrue: Story = {
  ...Default,
  args: {
    ...Default.args,
    isDisabled: true
  },
  name: 'isDisabled: true'
};

export const IsReadOnlyTrueIsSelectedTrue: Story = {
  ...Default,
  args: {
    ...Default.args,
    isReadOnly: true,
    isSelected: true
  },
  name: 'isReadOnly: true, isSelected: true'
};

export const AutoFocus: Story = {
  ...Default,
  args: {
    ...Default.args,
    autoFocus: true
  },
  name: 'autoFocus'
};

export const CustomLabel: Story = {
  ...Default,
  render: (args) => ({
    components: {Switch},
    setup() {
      return {args};
    },
    template: '<Switch v-bind="args"><span><i>Italicized</i> Switch Label</span></Switch>'
  }),
  name: 'custom label'
};

export const LongLabel: Story = {
  ...Default,
  render: (args) => ({
    components: {Switch},
    setup() {
      return {args};
    },
    template: '<Switch v-bind="args">Super long checkbox label. Sample text. Arma virumque cano, Troiae qui primus ab oris. Italiam, fato profugus, Laviniaque venit.</Switch>'
  }),
  name: 'long label'
};

export const NoLabel: Story = {
  render: (args) => ({
    components: {Switch},
    setup() {
      return {args};
    },
    template: '<Switch v-bind="args" />'
  }),
  args: {
    'aria-label': 'This switch has no visible label'
  },
  name: 'no label',
  parameters: {
    description: {data: 'Try me with a screen reader.'}
  }
};

export const ControlledImplementation: Story = {
  ...Default,
  render: (args) => ({
    components: {Switch},
    setup() {
      let checked = ref(false);
      let onChange = (value: boolean) => {
        checked.value = value;
      };

      return {args, checked, onChange, resolveLabel};
    },
    template: '<Switch v-bind="args" :is-selected="checked" @change="onChange">{{ resolveLabel(args.children) }}</Switch>'
  })
};

export const WHCMTest: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Switch},
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px;">
          <Switch>Option</Switch>
          <Switch is-disabled>Option</Switch>
        </div>
        <div style="display: flex; gap: 16px;">
          <Switch is-selected is-emphasized>Option</Switch>
          <Switch is-selected is-emphasized is-disabled>Option</Switch>
        </div>
        <div style="display: flex; gap: 16px;">
          <Switch is-selected>Option</Switch>
          <Switch is-selected is-disabled>Option</Switch>
        </div>
      </div>
    `
  }),
  name: 'WHCM test'
};
