import {action} from 'storybook/actions';
import {computed, ref} from 'vue';
import {TooltipTrigger} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TooltipTriggerStoryArgs = {
  children?: unknown[],
  closeDelay?: number,
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

const DEFAULT_CHILDREN = [{
  type: {},
  key: null,
  ref: null,
  props: {
    'aria-label': 'Edit Name',
    children: {
      key: null,
      ref: null,
      props: {}
    }
  }
}, {
  type: {},
  key: null,
  ref: null,
  props: {
    children: 'Change Name'
  }
}];

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
    'DEFAULT_CHILDREN',
    'multipleTooltipItems',
    'renderTrigger',
    'renderMultipleTooltips',
    'renderControlledMultipleTooltips'
  ],
  args: {
    children: [...DEFAULT_CHILDREN],
    onOpenChange: action('openChange'),
    shouldCloseOnPress: true
  },
  argTypes: {
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
    delay: {
      control: 'number',
      min: 0,
      max: 50000,
      step: 500
    },
    closeDelay: {
      control: 'number',
      min: 0,
      max: 50000,
      step: 500
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
    isDisabled: {
      control: 'boolean'
    },
    shouldFlip: {
      control: 'boolean'
    },
    trigger: {
      control: 'radio',
      options: [undefined, 'focus']
    },
    children: {
      control: {
        disable: true
      }
    },
    shouldCloseOnPress: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function getTriggerLabel(children: unknown[] | undefined): string {
  let firstChild = Array.isArray(children) ? children[0] : undefined;

  if (typeof firstChild === 'string') {
    return firstChild;
  }

  if (firstChild && typeof firstChild === 'object' && 'props' in firstChild) {
    let props = firstChild.props;
    if (props && typeof props === 'object' && 'aria-label' in props && typeof props['aria-label'] === 'string') {
      return props['aria-label'];
    }
  }

  return 'Hover or focus me';
}

function getTooltipText(children: unknown[] | undefined): string {
  let secondChild = Array.isArray(children) ? children[1] : undefined;

  if (typeof secondChild === 'string') {
    return secondChild;
  }

  if (secondChild && typeof secondChild === 'object' && 'props' in secondChild) {
    let props = secondChild.props;
    if (props && typeof props === 'object' && 'children' in props && typeof props.children === 'string') {
      return props.children;
    }
  }

  return 'Change Name';
}

function renderTrigger(
  triggerTemplate = "{{ isOpen ? 'Tooltip open' : triggerText }}",
  tooltipTemplate = '{{ tooltipText }}',
  baseArgs: Partial<TooltipTriggerStoryArgs> = {}
) {
  return (args: TooltipTriggerStoryArgs) => ({
    components: {TooltipTrigger},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let triggerText = computed(() => getTriggerLabel(mergedArgs.value.children));
      let tooltipText = computed(() => getTooltipText(mergedArgs.value.children));

      return {args: mergedArgs, tooltipText, triggerText};
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
