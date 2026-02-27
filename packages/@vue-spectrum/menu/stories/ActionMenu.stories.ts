import {ActionMenu} from '../src';
import {action} from '@storybook/addon-actions';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type StoryOpenKeyValue = Iterable<number | string> | number | string;
type MenuItem = string | {
  children?: MenuItem[],
  disabled?: boolean,
  key?: number | string,
  label?: string
};
type RenderOptions = {
  items?: MenuItem[]
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

function normalizeStoryOpenKeys(value: unknown): Set<number | string> {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Set([value]);
  }

  if (value == null) {
    return new Set();
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return new Set();
  }

  let normalized = new Set<number | string>();
  for (let entry of value as Iterable<unknown>) {
    if (typeof entry === 'number' || typeof entry === 'string') {
      normalized.add(entry);
    }
  }

  return normalized;
}

function renderActionMenu(args: StoryArgs = {}, options: RenderOptions = {}) {
  let {items = DEFAULT_ITEMS} = options;
  return {
    components: {ActionMenu},
    setup() {
      let onAction = action('action');
      return {
        args,
        items,
        onAction
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 280px;">
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
  render: (args) => renderActionMenu(args),
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
  render: (args) => renderActionMenu(args),
  args: {
    autoFocus: true
  }
};

export const DefaultOpen: Story = {
  render: (args) => renderActionMenu({...args, items: NESTED_ITEMS, openKeys: new Set(['view'])}),
  args: {
    defaultOpen: true,
    onOpenChange: action('onOpenChange')
  }
};

export const ControlledOpen: Story = {
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      let openKeys = ref<Set<number | string>>(new Set());

      let onOpenChange = (keys: StoryOpenKeyValue) => {
        openKeys.value = normalizeStoryOpenKeys(keys);
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
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      let align = ref<'start' | 'end'>('start');
      let direction = ref<'bottom' | 'top' | 'left' | 'right' | 'start' | 'end'>('bottom');
      let shouldFlip = ref(true);
      let onAction = action('action');
      return {
        align,
        args,
        direction,
        onAction,
        shouldFlip
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 360px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <label>
            Align
            <select v-model="align">
              <option value="start">start</option>
              <option value="end">end</option>
            </select>
          </label>
          <label>
            Direction
            <select v-model="direction">
              <option value="bottom">bottom</option>
              <option value="top">top</option>
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="start">start</option>
              <option value="end">end</option>
            </select>
          </label>
          <label>
            <input v-model="shouldFlip" type="checkbox" />
            shouldFlip
          </label>
        </div>
        <ActionMenu
          v-bind="args"
          :align="align"
          :direction="direction"
          :items="[
            {key: 'one', label: 'One'},
            {key: 'two', label: 'Two'},
            {key: 'three', label: 'Three'}
          ]"
          :should-flip="shouldFlip"
          @action="onAction($event)" />
      </div>
    `
  })
};

export const WithTooltip: Story = {
  render: (args) => ({
    components: {ActionMenu, TooltipTrigger},
    setup() {
      let onAction = action('action');
      return {args, onAction};
    },
    template: `
      <TooltipTrigger>
        <ActionMenu
          v-bind="args"
          :items="[
            {key: 'cut', label: 'Cut'},
            {key: 'copy', label: 'Copy'},
            {key: 'paste', label: 'Paste'}
          ]"
          @action="onAction($event)" />
        <template #tooltip>
          Actions
        </template>
      </TooltipTrigger>
    `
  })
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
