import {ActionMenu} from '../src';
import {action} from '@storybook/addon-actions';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type MenuItem = string | {
  children?: MenuItem[],
  disabled?: boolean,
  key?: number | string,
  label?: string
};
type RenderOptions = {
  items?: MenuItem[],
  note?: string
};

const DEFAULT_ITEMS: MenuItem[] = ['One', 'Two', 'Three'];
const NESTED_ITEMS: MenuItem[] = [
  {
    key: 'view',
    label: 'View',
    children: [
      {
        key: 'grid',
        label: 'Grid view'
      },
      {
        key: 'list',
        label: 'List view'
      }
    ]
  },
  'Help'
];

const meta: Meta<typeof ActionMenu> = {
  title: 'ActionMenu',
  component: ActionMenu
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderActionMenu(args: StoryArgs = {}, options: RenderOptions = {}) {
  let {
    items = DEFAULT_ITEMS,
    note
  } = options;
  return {
    components: {ActionMenu},
    setup() {
      let onAction = action('action');
      return {
        args,
        items,
        note,
        onAction
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 280px;">
        <div v-if="note">{{note}}</div>
        <ActionMenu v-bind="args" :items="items" @action="onAction($event)"></ActionMenu>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderActionMenu(args)
};

export const AriaLabel: Story = {
  render: (args) => renderActionMenu(args),
  args: {
    'aria-label': 'Some more actions'
  }
};

export const DOMId: Story = {
  render: (args) => renderActionMenu(args),
  args: {
    id: 'my-action-menu'
  }
};

export const Quiet: Story = {
  render: (args) => renderActionMenu(args, {note: 'Quiet parity scenario'}),
  args: {
    isQuiet: true
  }
};

export const Disabled: Story = {
  render: (args) => renderActionMenu(args),
  args: {
    isDisabled: true
  }
};

export const DisabledKeys: Story = {
  render: (args) => renderActionMenu(args, {
    items: [
      {key: 'one', label: 'One'},
      {key: 'two', label: 'Two', disabled: true},
      {key: 'three', label: 'Three'}
    ]
  }),
  args: {
    disabledKeys: ['two']
  }
};

export const AutoFocus: Story = {
  render: (args) => renderActionMenu(args, {note: 'Auto focus parity scenario'}),
  args: {
    autoFocus: true
  }
};

export const DefaultOpen: Story = {
  render: (args) => renderActionMenu({...args, items: NESTED_ITEMS, openKeys: ['view']}),
  args: {
    defaultOpen: true,
    onOpenChange: action('onOpenChange')
  }
};

export const ControlledOpen: Story = {
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      let openKeys = ref<Array<number | string>>([]);

      let onOpenChange = (keys: Array<number | string>) => {
        openKeys.value = keys;
      };

      return {
        args,
        items: [
          {key: 'cut', label: 'Cut'},
          {key: 'copy', label: 'Copy'},
          {key: 'paste', label: 'Paste'}
        ],
        onOpenChange,
        openKeys
      };
    },
    template: '<ActionMenu v-bind="args" :items="items" :open-keys="openKeys" @open-change="onOpenChange" />'
  })
};

export const DirectionAlignFlip: Story = {
  render: (args) => renderActionMenu(args, {note: 'Direction/align/flip parity scenario'})
};

export const WithTooltip: Story = {
  render: (args) => renderActionMenu(args, {note: 'With tooltip parity scenario'})
};

export const Dynamic: Story = {
  render: (args) => renderActionMenu(args, {
    items: [
      {key: 'cut', label: 'Cut'},
      {key: 'copy', label: 'Copy'},
      {key: 'paste', label: 'Paste'}
    ]
  })
};
