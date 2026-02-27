import {computed, ref} from 'vue';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePopover} from 'vue-aria-components';

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
      <button
        type="button"
        @mouseenter="open = true"
        @mouseleave="open = false"
        @focus="open = true"
        @blur="open = false">Tooltip trigger</button>
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
  label: string,
  placement: string,
  arrowRotation: string
};

const rows: PlacementCard[][] = [
  [
    {key: 'topLeft', label: 'Top left', placement: 'top left', arrowRotation: 'rotate(0deg)'},
    {key: 'topRight', label: 'Top right', placement: 'top right', arrowRotation: 'rotate(0deg)'}
  ],
  [
    {key: 'leftTop', label: 'Left top', placement: 'left top', arrowRotation: 'rotate(-90deg)'},
    {key: 'leftBottom', label: 'Left bottom', placement: 'left bottom', arrowRotation: 'rotate(-90deg)'}
  ],
  [
    {key: 'rightTop', label: 'Right top', placement: 'right top', arrowRotation: 'rotate(90deg)'},
    {key: 'rightBottom', label: 'Right bottom', placement: 'right bottom', arrowRotation: 'rotate(90deg)'}
  ],
  [
    {key: 'bottomLeft', label: 'Bottom left', placement: 'bottom left', arrowRotation: 'rotate(180deg)'},
    {key: 'bottomRight', label: 'Bottom right', placement: 'bottom right', arrowRotation: 'rotate(180deg)'}
  ]
];

export const TooltipArrowBoundaryOffsetExample: TooltipStoryObj = {
  render: (args: TooltipArrowBoundaryOffsetArgs) => ({
    components: {
      VuePopover
    },
    setup() {
      let active = ref<string>('');

      let show = (key: string) => {
        active.value = key;
      };

      let hide = (key: string) => {
        if (active.value === key) {
          active.value = '';
        }
      };

      let arrowOffsetStyle = (card: PlacementCard) => {
        let offset = Number(args[card.key] ?? 0);
        if (card.placement.startsWith('left') || card.placement.startsWith('right')) {
          return {
            transform: 'translateY(-50%)',
            marginTop: `${offset}px`
          };
        }

        return {
          transform: 'translateX(-50%)',
          marginLeft: `${offset}px`
        };
      };

      return {
        active,
        arrowOffsetStyle,
        hide,
        rows,
        show
      };
    },
    template: `
      <div>
        <div style="display: flex; flex-direction: column;">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex" style="display: flex;">
            <div v-for="card in row" :key="card.key" style="padding: 12px;">
              <button
                type="button"
                style="width: 200px; height: 100px;"
                @mouseenter="show(card.key)"
                @mouseleave="hide(card.key)"
                @focus="show(card.key)"
                @blur="hide(card.key)">
                {{ card.label }}
              </button>
              <VuePopover
                :open="active === card.key"
                :placement="card.placement"
                :dismissable="false"
                class="react-aria-Tooltip"
                :style="{
                  background: 'Canvas',
                  color: 'CanvasText',
                  border: '1px solid gray',
                  padding: '8px',
                  borderRadius: '9999px',
                  zIndex: 100000
                }">
                <div class="react-aria-OverlayArrow" :data-placement="card.placement" :style="arrowOffsetStyle(card)">
                  <svg width="8" height="8" :style="{display: 'block', transform: card.arrowRotation}">
                    <path d="M0 0L4 4L8 0" fill="white" stroke-width="1" stroke="gray" />
                  </svg>
                </div>
                {{ card.label }}
              </VuePopover>
            </div>
          </div>
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
