import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePopover} from '@vue-spectrum/components';
import {computed, onUnmounted, ref} from 'vue';

type StoryArgs = Record<string, unknown>;
type StyleMap = Record<string, number | string>;

const placementOptions = [
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
] as const;

const meta = {
  title: 'React Aria Components/Popover',
  component: VuePopover,
  args: {
    placement: 'bottom start',
    hideArrow: false
  },
  argTypes: {
    placement: {
      control: 'select',
      options: placementOptions
    },
    animation: {
      control: 'radio',
      options: ['transition', 'animation', 'animation-delayed']
    }
  }
} satisfies Meta<typeof VuePopover>;

export default meta;

type PopoverStory = StoryFn<typeof VuePopover>;
type Story = StoryObj<typeof meta>;

function normalizePlacement(raw: unknown): 'top' | 'right' | 'bottom' | 'left' {
  let value = String(raw ?? 'bottom').toLowerCase();
  if (value.includes('top')) {
    return 'top';
  }
  if (value.includes('right') || value.includes('end')) {
    return 'right';
  }
  if (value.includes('left') || value.includes('start')) {
    return 'left';
  }
  return 'bottom';
}

function createPopoverStory(args: StoryArgs = {}, opts: {
  contentText?: string,
  contentTitle: string,
  triggerLabel: string,
  triggerStyle?: StyleMap,
  wrapperStyle?: StyleMap
}) {
  return {
    components: {
      VuePopover
    },
    setup() {
      let isOpen = ref(false);
      let close = () => {
        isOpen.value = false;
      };

      return {
        args,
        close,
        isOpen,
        normalizedPlacement: computed(() => normalizePlacement(args.placement)),
        opts,
        toggle: () => {
          isOpen.value = !isOpen.value;
        }
      };
    },
    template: `
      <div :style="opts.wrapperStyle ?? {minHeight: '240px'}">
        <button type="button" :style="opts.triggerStyle" @click="toggle">{{ opts.triggerLabel }}</button>
        <VuePopover
          :open="isOpen"
          :placement="normalizedPlacement"
          @close="close">
          <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 16px; z-index: 5; min-width: 240px;">
            <div v-if="!args.hideArrow" style="margin-bottom: 8px;">▼</div>
            <h4 style="margin: 0 0 8px 0;">{{ opts.contentTitle }}</h4>
            <p style="margin: 0 0 12px 0;">{{ opts.contentText ?? 'Popover content parity fixture.' }}</p>
            <button type="button" @click="close">Submit</button>
          </div>
        </VuePopover>
      </div>
    `
  };
}

export const PopoverExample: PopoverStory = (args) => createPopoverStory(args, {
  triggerLabel: 'Open popover',
  contentTitle: 'Sign up',
  contentText: 'First Name: John / Last Name: Smith'
});

const COUNTDOWN = 5000;

export const PopoverTriggerObserverExample: Story = {
  render: () => ({
    components: {
      VuePopover
    },
    setup() {
      let countdown = ref(COUNTDOWN);
      let isOpen = ref(true);
      let triggerStyle = ref<StyleMap>({});

      let intervalId = setInterval(() => {
        countdown.value = Math.max(0, countdown.value - 1000);
      }, 1000);

      let timeoutId = setTimeout(() => {
        triggerStyle.value = {width: '200px', height: '50px'};
      }, COUNTDOWN + 1000);

      onUnmounted(() => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      });

      return {
        countdown,
        isOpen,
        triggerStyle
      };
    },
    template: `
      <div style="margin-bottom: 100px; display: flex; flex-direction: column; align-items: center;">
        <p>The trigger button below will change size in <strong>{{ Math.floor(countdown / 1000) }}s</strong></p>
        <button type="button" :style="triggerStyle" @click="isOpen = !isOpen">Open popover</button>
        <VuePopover
          :open="isOpen"
          placement="bottom"
          @close="isOpen = false">
          <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 16px; min-width: 240px;">
            <h4 style="margin: 0 0 8px 0;">Sign up</h4>
            <p style="margin: 0 0 12px 0;">Trigger observer parity fixture.</p>
            <button type="button" @click="isOpen = false">Submit</button>
          </div>
        </VuePopover>
      </div>
    `
  })
};

interface ArrowBoundaryOffsetArgs {
  topLeft: number,
  topRight: number,
  leftTop: number,
  leftBottom: number,
  rightTop: number,
  rightBottom: number,
  bottomLeft: number,
  bottomRight: number
}

export const PopoverArrowBoundaryOffsetExample: Story = {
  render: (args: ArrowBoundaryOffsetArgs) => ({
    components: {
      VuePopover
    },
    setup() {
      let active = ref<string>('');
      let cards = [
        {key: 'topLeft', label: 'Top left', placement: 'top'},
        {key: 'topRight', label: 'Top right', placement: 'top'},
        {key: 'leftTop', label: 'Left top', placement: 'left'},
        {key: 'leftBottom', label: 'Left bottom', placement: 'left'},
        {key: 'rightTop', label: 'Right top', placement: 'right'},
        {key: 'rightBottom', label: 'Right bottom', placement: 'right'},
        {key: 'bottomLeft', label: 'Bottom left', placement: 'bottom'},
        {key: 'bottomRight', label: 'Bottom right', placement: 'bottom'}
      ] as const;

      let toggle = (key: string) => {
        active.value = active.value === key ? '' : key;
      };

      return {
        active,
        args,
        cards,
        toggle
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <div v-for="card in cards" :key="card.key" style="padding: 12px; border: 1px solid #d9d9d9; border-radius: 8px;">
          <button type="button" style="width: 180px; height: 90px;" @click="toggle(card.key)">
            {{ card.label }}
          </button>
          <VuePopover
            :open="active === card.key"
            :placement="card.placement"
            dismissable
            @close="active = ''">
            <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 12px;">
              <strong>{{ card.label }}</strong>
              <p style="margin: 6px 0 0 0;">Offset: {{ args[card.key] }}</p>
            </div>
          </VuePopover>
        </div>
      </div>
    `
  }),
  args: {
    topLeft: 0,
    topRight: 0,
    leftTop: 0,
    leftBottom: 0,
    rightTop: 0,
    rightBottom: 0,
    bottomLeft: 0,
    bottomRight: 0
  }
};

export const PopoverTriggerWidthExample: PopoverStory = () => createPopoverStory({}, {
  triggerLabel: 'Open popover',
  contentTitle: 'Trigger width parity fixture',
  triggerStyle: {
    width: '260px'
  },
  wrapperStyle: {
    minHeight: '220px',
    width: '280px'
  }
});

export const ScrollingBoundaryContainer: Story = {
  render: () => ({
    components: {
      VuePopover
    },
    setup() {
      let isOpen = ref(false);
      return {
        isOpen
      };
    },
    template: `
      <div style="height: 300px; width: 360px; overflow: auto; border: 1px solid #d9d9d9; padding: 12px;">
        <div style="height: 700px; padding-top: 260px;">
          <button type="button" @click="isOpen = !isOpen">Open popover</button>
          <VuePopover
            :open="isOpen"
            placement="bottom"
            @close="isOpen = false">
            <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 12px;">
              Scrolling boundary container fixture.
            </div>
          </VuePopover>
        </div>
      </div>
    `
  })
};
