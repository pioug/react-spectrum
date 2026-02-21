import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePopover} from '@vue-spectrum/components';
import {computed, ref} from 'vue';

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
];

const meta = {
  title: 'React Aria Components/Tooltip',
  component: VuePopover,
  args: {
    placement: 'top',
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

export type TooltipStory = StoryFn<typeof VuePopover>;
export type TooltipStoryObj = StoryObj<typeof meta>;

function normalizePlacement(raw: unknown): 'top' | 'right' | 'bottom' | 'left' {
  let value = String(raw ?? 'top').toLowerCase();
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

export const TooltipExample: TooltipStory = (args) => ({
  components: {
    VuePopover
  },
  setup() {
    let open = ref(false);
    return {
      args,
      normalizedPlacement: computed(() => normalizePlacement(args.placement)),
      open
    };
  },
  template: `
    <div>
      <button type="button" @mouseenter="open = true" @mouseleave="open = false">Tooltip trigger</button>
      <VuePopover
        :open="open"
        :placement="normalizedPlacement"
        :dismissable="false">
        <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 5px; border-radius: 4px;">
          <div v-if="!args.hideArrow">▲</div>
          I am a tooltip
        </div>
      </VuePopover>
    </div>
  `
});

interface TooltipArrowBoundaryOffsetArgs {
  topLeft: number,
  topRight: number,
  leftTop: number,
  leftBottom: number,
  rightTop: number,
  rightBottom: number,
  bottomLeft: number,
  bottomRight: number
}

export const TooltipArrowBoundaryOffsetExample: TooltipStoryObj = {
  render: (args: TooltipArrowBoundaryOffsetArgs) => ({
    components: {
      VuePopover
    },
    setup() {
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
      return {
        args,
        cards
      };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <div v-for="card in cards" :key="card.key" style="padding: 12px;">
          <button type="button" style="width: 200px; height: 100px;">{{ card.label }}</button>
          <VuePopover
            open
            :dismissable="false"
            :placement="card.placement">
            <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px;">
              {{ card.label }} (offset: {{ args[card.key] }})
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

export const TooltipContainerPaddingExample: TooltipStoryObj = {
  render: () => ({
    components: {
      VuePopover
    },
    setup() {
      let open = ref(true);
      return {
        open
      };
    },
    template: `
      <div style="padding: 32px; border: 1px dashed #d9d9d9; width: fit-content;">
        <button type="button" @mouseenter="open = true" @mouseleave="open = false">Trigger with container padding</button>
        <VuePopover
          :open="open"
          placement="top"
          :dismissable="false">
          <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 5px; border-radius: 4px;">
            Tooltip with container padding.
          </div>
        </VuePopover>
      </div>
    `
  })
};
