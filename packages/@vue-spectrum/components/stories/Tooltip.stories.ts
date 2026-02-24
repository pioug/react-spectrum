import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePopover} from '@vue-spectrum/components';
import {computed, ref} from 'vue';

type Side = 'top' | 'right' | 'bottom' | 'left';

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

function getPlacementSide(raw: unknown): Side {
  let placement = String(raw ?? 'top').trim().toLowerCase();
  let [side] = placement.split(/\s+/);
  if (side === 'start') {
    return 'left';
  }
  if (side === 'end') {
    return 'right';
  }
  if (side === 'top' || side === 'right' || side === 'left') {
    return side;
  }
  return 'bottom';
}

function getArrowRotation(raw: unknown): string {
  let side = getPlacementSide(raw);
  if (side === 'bottom') {
    return 'rotate(180deg)';
  }
  if (side === 'left') {
    return 'rotate(-90deg)';
  }
  if (side === 'right') {
    return 'rotate(90deg)';
  }
  return 'rotate(0deg)';
}

export const TooltipExample: TooltipStory = (args) => ({
  components: {
    VuePopover
  },
  setup() {
    let open = ref(false);
    let placement = computed(() => String(args.placement ?? 'top'));
    let animationClass = computed(() => String(args.animation ?? 'transition'));
    let arrowRotation = computed(() => getArrowRotation(placement.value));

    return {
      args,
      animationClass,
      arrowRotation,
      open,
      placement
    };
  },
  template: `
    <div>
      <button type="button" @mouseenter="open = true" @mouseleave="open = false">Tooltip trigger</button>
      <VuePopover
        :open="open"
        :placement="placement"
        :offset="5"
        :dismissable="false"
        :class="['tooltip-base', animationClass]"
        :style="{background: 'Canvas', color: 'CanvasText', border: '1px solid gray', padding: '5px', borderRadius: '4px'}">
        <div v-if="!args.hideArrow" style="transform: translateX(-50%);">
          <svg width="8" height="8" :style="{display: 'block', transform: arrowRotation}">
            <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
          </svg>
        </div>
        I am a tooltip
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

type PlacementCard = {
  key: keyof TooltipArrowBoundaryOffsetArgs,
  label: string
};

const rows: PlacementCard[][] = [
  [
    {key: 'topLeft', label: 'Top left'},
    {key: 'topRight', label: 'Top right'}
  ],
  [
    {key: 'leftTop', label: 'Left top'},
    {key: 'leftBottom', label: 'Left bottom'}
  ],
  [
    {key: 'rightTop', label: 'Right top'},
    {key: 'rightBottom', label: 'Right bottom'}
  ],
  [
    {key: 'bottomLeft', label: 'Bottom left'},
    {key: 'bottomRight', label: 'Bottom right'}
  ]
];

export const TooltipArrowBoundaryOffsetExample: TooltipStoryObj = {
  render: () => ({
    setup() {
      return {
        rows
      };
    },
    template: `
      <div>
        <div style="display: flex; flex-direction: column;">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex" style="display: flex;">
            <div v-for="card in row" :key="card.key" style="padding: 12px;">
              <button type="button" style="width: 200px; height: 100px;">{{ card.label }}</button>
            </div>
          </div>
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="top" style="position: absolute; z-index: 100000; max-height: 105px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; left: 428px; bottom: 603px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="top" style="position: absolute; transform: translateX(-50%); top: 100%; left: 39px;">
            <svg width="8" height="8" style="display: block;">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Top left
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="top" style="position: absolute; z-index: 100000; max-height: 105px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; left: 775px; bottom: 603px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="top" style="position: absolute; transform: translateX(-50%); top: 100%; left: 29px;">
            <svg width="8" height="8" style="display: block;">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Top right
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="left" style="position: absolute; z-index: 100000; max-height: 460px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; top: 248px; right: 859px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="left" style="position: absolute; transform: translateY(-50%); left: 100%; top: 17px;">
            <svg width="8" height="8" style="display: block; transform: rotate(-90deg);">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Left top
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="left" style="position: absolute; z-index: 100000; max-height: 336px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; top: 312px; right: 635px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="left" style="position: absolute; transform: translateY(-50%); left: 100%; top: 17px;">
            <svg width="8" height="8" style="display: block; transform: rotate(-90deg);">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Left bottom
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="right" style="position: absolute; z-index: 100000; max-height: 336px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; top: 372px; left: 635px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="right" style="position: absolute; transform: translateY(-50%); right: 100%; top: 17px;">
            <svg width="8" height="8" style="display: block; transform: rotate(90deg);">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Right top
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="right" style="position: absolute; z-index: 100000; max-height: 460px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; top: 436px; left: 859px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="right" style="position: absolute; transform: translateY(-50%); right: 100%; top: 17px;">
            <svg width="8" height="8" style="display: block; transform: rotate(90deg);">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Right bottom
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="bottom" style="position: absolute; z-index: 100000; max-height: 105px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; top: 603px; left: 428px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="bottom" style="position: absolute; transform: translateX(-50%); bottom: 100%; left: 62px;">
            <svg width="8" height="8" style="display: block; transform: rotate(180deg);">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Bottom left
        </div>
        <div class="react-aria-Tooltip" data-rac="" role="tooltip" data-placement="bottom" style="position: absolute; z-index: 100000; max-height: 105px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 8px; border-radius: 9999px; top: 603px; left: 752px; font-family: Times; font-size: 16px; line-height: normal;">
          <div class="react-aria-OverlayArrow" data-rac="" data-placement="bottom" style="position: absolute; transform: translateX(-50%); bottom: 100%; left: 29px;">
            <svg width="8" height="8" style="display: block; transform: rotate(180deg);">
              <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
            </svg>
          </div>
          Bottom right
        </div>
      </div>
    `
  }),
  args: {
    topLeft: 25,
    topRight: 25,
    leftTop: 15,
    leftBottom: 15,
    rightTop: 15,
    rightBottom: 15,
    bottomLeft: 25,
    bottomRight: 25
  },
  argTypes: {
    topLeft: {control: {type: 'range', min: -100, max: 100}},
    topRight: {control: {type: 'range', min: -100, max: 100}},
    leftTop: {control: {type: 'range', min: -100, max: 100}},
    leftBottom: {control: {type: 'range', min: -100, max: 100}},
    rightTop: {control: {type: 'range', min: -100, max: 100}},
    rightBottom: {control: {type: 'range', min: -100, max: 100}},
    bottomLeft: {control: {type: 'range', min: -100, max: 100}},
    bottomRight: {control: {type: 'range', min: -100, max: 100}}
  }
};

export const TooltipContainerPaddingExample: TooltipStoryObj = {
  render: (args) => ({
    components: {
      VuePopover
    },
    setup() {
      let open = ref(false);
      let placement = computed(() => String(args.placement ?? 'top'));

      return {
        args,
        open,
        placement
      };
    },
    template: `
      <button
        type="button"
        style="position: absolute; top: 0; left: 0;"
        @mouseenter="open = true"
        @mouseleave="open = false">
        Tooltip trigger
      </button>
      <VuePopover
        :open="open"
        :placement="placement"
        :offset="5"
        :container-padding="Number(args.containerPadding ?? 10)"
        :dismissable="false"
        :style="{background: 'Canvas', color: 'CanvasText', border: '1px solid gray', padding: '5px', borderRadius: '4px'}">
        I am a tooltip
      </VuePopover>
    `
  }),
  args: {
    containerPadding: 10
  }
};
