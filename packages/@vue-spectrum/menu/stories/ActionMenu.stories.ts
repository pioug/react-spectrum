import {ActionMenu} from '../src';
import {action} from 'storybook/actions';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
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
  items?: MenuItem[]
};

const DEFAULT_ITEMS: MenuItem[] = ['One', 'Two', 'Three'];

const meta: Meta<typeof ActionMenu> = {
  title: 'ActionMenu',
  component: ActionMenu
};

export default meta;

type Story = StoryObj<typeof meta>;

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
      <ActionMenu v-bind="args" :items="items" @action="onAction($event)" />
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
  render: (args) => renderActionMenu(args),
  args: {
    defaultOpen: true,
    onOpenChange: action('openChange')
  }
};

export const ControlledOpen: Story = {
  render: (args) => ({
    components: {ActionMenu},
    setup() {
      let isOpen = ref(false);

      let onOpenChange = (value: boolean) => {
        isOpen.value = value;
      };

      return {
        args,
        isOpen,
        items: [
          {key: 'cut', label: 'Cut'},
          {key: 'copy', label: 'Copy'},
          {key: 'paste', label: 'Paste'}
        ],
        onOpenChange
      };
    },
    template: `
      <ActionMenu
        v-bind="args"
        :is-open="isOpen"
        :items="items"
        @open-change="onOpenChange" />
    `
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
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
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
      <TooltipTrigger :delay="0">
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
