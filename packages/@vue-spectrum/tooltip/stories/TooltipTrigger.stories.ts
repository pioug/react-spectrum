import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import {TooltipTrigger} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TooltipTriggerStoryArgs = {
  closeDelay?: number,
  content?: string,
  defaultOpen?: boolean,
  delay?: number,
  isDisabled?: boolean,
  isOpen?: boolean,
  modelValue?: boolean,
  onOpenChange?: (isOpen: boolean) => void,
  placement?: 'top' | 'right' | 'bottom' | 'left',
  shouldCloseOnPress?: boolean,
  showIcon?: boolean,
  trigger?: 'focus' | 'focus hover',
  variant?: 'neutral' | 'positive' | 'negative' | 'info'
};

const multipleTooltipItems = [{
  id: 'neutral',
  label: 'neutral Tooltip',
  variant: 'neutral' as const
}, {
  id: 'positive',
  label: 'positive Tooltip',
  variant: 'positive' as const
}, {
  id: 'negative',
  label: 'negative Tooltip',
  variant: 'negative' as const
}, {
  id: 'info',
  label: 'info Tooltip',
  variant: 'info' as const
}];

const meta: Meta<typeof TooltipTrigger> = {
  title: 'TooltipTrigger',
  component: TooltipTrigger,
  excludeStories: [
    'multipleTooltipItems',
    'renderTrigger',
    'renderMultipleTooltips',
    'renderControlledMultipleTooltips'
  ],
  args: {
    content: 'Change Name',
    onOpenChange: action('openChange'),
    placement: 'top',
    shouldCloseOnPress: true
  },
  argTypes: {
    closeDelay: {
      control: 'number',
      min: 0,
      max: 50000,
      step: 500
    },
    content: {
      control: 'text'
    },
    defaultOpen: {
      control: 'boolean'
    },
    delay: {
      control: 'number',
      min: 0,
      max: 50000,
      step: 500
    },
    isDisabled: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    onOpenChange: {
      table: {
        disable: true
      }
    },
    placement: {
      control: 'select',
      options: ['bottom', 'left', 'right', 'top']
    },
    shouldCloseOnPress: {
      control: 'boolean'
    },
    showIcon: {
      control: 'boolean'
    },
    trigger: {
      control: 'radio',
      options: [undefined, 'focus']
    },
    variant: {
      control: 'select',
      options: ['neutral', 'positive', 'negative', 'info']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderTrigger(
  triggerTemplate = "{{ isOpen ? 'Tooltip open' : 'Hover or focus me' }}",
  tooltipTemplate = '{{ args.content }}',
  baseArgs: Partial<TooltipTriggerStoryArgs> = {}
) {
  return (args: TooltipTriggerStoryArgs) => ({
    components: {TooltipTrigger},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      return {args: mergedArgs};
    },
    template: `
      <TooltipTrigger v-bind="args">
        <template #default="{isOpen}">
          <button type="button">${triggerTemplate}</button>
        </template>
        <template #tooltip>${tooltipTemplate}</template>
      </TooltipTrigger>
    `
  });
}

function renderMultipleTooltips(args: TooltipTriggerStoryArgs) {
  return {
    components: {TooltipTrigger},
    setup() {
      return {args, items: multipleTooltipItems};
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-100);">
        <TooltipTrigger
          v-for="item in items"
          :key="item.id"
          :content="\`\${item.variant} message.\`"
          :on-open-change="args.onOpenChange"
          :placement="args.placement || 'left'"
          :should-close-on-press="args.shouldCloseOnPress"
          :show-icon="true"
          :variant="item.variant">
          <template #default="{isOpen}">
            <button type="button">{{ isOpen ? \`\${item.label} open\` : item.label }}</button>
          </template>
        </TooltipTrigger>
      </div>
    `
  };
}

function renderControlledMultipleTooltips(args: TooltipTriggerStoryArgs) {
  return {
    components: {TooltipTrigger},
    setup() {
      let openMap = ref<Record<string, boolean>>({
        neutral: false,
        positive: false,
        negative: false,
        info: false
      });
      let setOpen = (id: string, isOpen: boolean) => {
        openMap.value = {
          ...openMap.value,
          [id]: isOpen
        };
        args.onOpenChange?.(isOpen);
      };

      return {args, items: multipleTooltipItems, openMap, setOpen};
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-100);">
        <TooltipTrigger
          v-for="item in items"
          :key="item.id"
          :content="\`\${item.variant} message.\`"
          :is-open="openMap[item.id]"
          :placement="args.placement || 'left'"
          :should-close-on-press="args.shouldCloseOnPress"
          :show-icon="true"
          :variant="item.variant"
          @update:is-open="setOpen(item.id, $event)">
          <template #default="{isOpen}">
            <button type="button">{{ isOpen ? \`\${item.label} open\` : item.label }}</button>
          </template>
        </TooltipTrigger>
      </div>
    `
  };
}

export const Default: Story = {
  render: renderTrigger()
};

export const DefaultOpen: Story = {
  render: renderTrigger(),
  args: {
    defaultOpen: true
  },
  name: 'defaultOpen: true'
};

export const IsOpen: Story = {
  render: renderTrigger(),
  args: {
    isOpen: true
  },
  name: 'isOpen: true'
};

export const TriggerDisabled: Story = {
  render: renderTrigger(),
  args: {
    isDisabled: true
  },
  name: 'Trigger Disabled'
};

export const TooltipOnLink: Story = {
  render: renderTrigger(
    "'Why did dinosaurs have feathers?'",
    'Dinosaurs had feathers, find out more.'
  ),
  args: {
    shouldCloseOnPress: false
  },
  name: 'Tooltip On Link'
};

export const TooltripTriggerInsideActionGroup: Story = {
  render: (args: TooltipTriggerStoryArgs) => ({
    components: {TooltipTrigger},
    setup() {
      let mergedArgs = computed(() => ({...args, delay: 0}));
      let items = [
        {id: 'edit', label: 'Edit'},
        {id: 'save', label: 'Save'},
        {id: 'delete', label: 'Delete'}
      ];
      return {args: mergedArgs, items};
    },
    template: `
      <div style="display: flex; gap: var(--spectrum-global-dimension-size-100);">
        <TooltipTrigger
          v-for="item in items"
          :key="item.id"
          :content="item.label"
          :delay="args.delay"
          :on-open-change="args.onOpenChange"
          :placement="args.placement"
          :should-close-on-press="args.shouldCloseOnPress">
          <template #default>
            <button type="button">{{ item.label }}</button>
          </template>
        </TooltipTrigger>
      </div>
    `
  }),
  name: 'Tooltrip Trigger Inside Action Group'
};

export const ArrowPositioningAtEdge: Story = {
  render: (args: TooltipTriggerStoryArgs) => ({
    components: {TooltipTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="width: 100%;">
        <TooltipTrigger v-bind="args" content="Long tooltip message that just goes on and on.">
          <template #default>
            <button type="button">Trigger Tooltip</button>
          </template>
        </TooltipTrigger>
      </div>
    `
  }),
  name: 'Arrow Positioning At Edge'
};

export const TooltipWithOtherHoverables: Story = {
  render: (args: TooltipTriggerStoryArgs) => ({
    components: {TooltipTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; gap: var(--spectrum-global-dimension-size-100);">
        <TooltipTrigger v-bind="args" content="Long tooltip message that just goes on and on.">
          <template #default>
            <button type="button">Trigger Tooltip</button>
          </template>
        </TooltipTrigger>
        <button type="button">No Tooltip</button>
      </div>
    `
  }),
  name: 'Tooltip With Other Hoverables'
};

export const MultipleTooltips: Story = {
  render: renderMultipleTooltips,
  args: {
    placement: 'left'
  },
  name: 'Multiple Tooltips'
};

export const ControlledMultipleTooltips: Story = {
  render: renderControlledMultipleTooltips,
  args: {
    placement: 'left'
  },
  name: 'Controlled Multiple Tooltips'
};

export const CrossoffsetExamples: Story = {
  render: () => ({
    components: {TooltipTrigger},
    setup() {
      let offsets = [10, 0, -10];
      return {offsets};
    },
    template: `
      <div style="display: flex; gap: var(--spectrum-global-dimension-size-300);">
        <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-100); align-items: start;">
          <span>Left Top</span>
          <TooltipTrigger
            v-for="offset in offsets"
            :key="\`left-top-\${offset}\`"
            content="Tooltip message."
            placement="left">
            <template #default>
              <button type="button" :style="{marginLeft: \`\${Math.max(offset, 0)}px\`}">Tooltip Trigger {{ offset }}</button>
            </template>
          </TooltipTrigger>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-100); align-items: start;">
          <span>Left</span>
          <TooltipTrigger
            v-for="offset in offsets"
            :key="\`left-\${offset}\`"
            content="Tooltip message."
            placement="left">
            <template #default>
              <button type="button" :style="{marginLeft: \`\${Math.max(offset, 0)}px\`}">Tooltip Trigger {{ offset }}</button>
            </template>
          </TooltipTrigger>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-100); align-items: start;">
          <span>Left Bottom</span>
          <TooltipTrigger
            v-for="offset in offsets"
            :key="\`left-bottom-\${offset}\`"
            content="Tooltip message."
            placement="left">
            <template #default>
              <button type="button" :style="{marginLeft: \`\${Math.max(offset, 0)}px\`}">Tooltip Trigger {{ offset }}</button>
            </template>
          </TooltipTrigger>
        </div>
      </div>
    `
  }),
  name: 'Crossoffset Examples'
};
