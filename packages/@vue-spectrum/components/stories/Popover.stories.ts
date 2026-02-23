import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePopover} from '@vue-spectrum/components';
import {computed, onUnmounted, ref, type CSSProperties} from 'vue';

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

function getPlacementSide(raw: unknown): Side {
  let placement = String(raw ?? 'bottom').trim().toLowerCase();
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

const popoverSurfaceStyle: CSSProperties = {
  background: 'Canvas',
  color: 'CanvasText',
  border: '1px solid gray',
  padding: '30px',
  zIndex: 5
};

export const PopoverExample: PopoverStory = (args) => ({
  components: {
    VuePopover
  },
  setup() {
    let isOpen = ref(false);
    let placement = computed(() => String(args.placement ?? 'bottom start'));
    let animationClass = computed(() => String(args.animation ?? 'transition'));
    let arrowRotation = computed(() => getArrowRotation(placement.value));

    return {
      args,
      animationClass,
      arrowRotation,
      isOpen,
      placement,
      popoverSurfaceStyle
    };
  },
  template: `
    <div>
      <button type="button" @click="isOpen = !isOpen">Open popover</button>
      <VuePopover
        :open="isOpen"
        :placement="placement"
        :class="['popover-base', animationClass]"
        :style="popoverSurfaceStyle"
        @close="isOpen = false">
        <div v-if="!args.hideArrow" style="display: flex;">
          <svg width="12" height="12" viewBox="0 0 12 12" :style="{display: 'block', transform: arrowRotation}">
            <path d="M0 0L6 6L12 0" fill="white" stroke-width="1" stroke="gray" />
          </svg>
        </div>
        <form style="display: flex; flex-direction: column; outline: 2px solid #1473e6; outline-offset: -2px;">
          <h2 style="margin: 0 0 8px 0;">Sign up</h2>
          <label>
            First Name: <input placeholder="John">
          </label>
          <label>
            Last Name: <input placeholder="Smith">
          </label>
          <button type="button" style="margin-top: 10px;" @click="isOpen = false">Submit</button>
        </form>
      </VuePopover>
    </div>
  `
});

const COUNTDOWN = 5000;

export const PopoverTriggerObserverExample: Story = {
  render: () => ({
    setup() {
      let countdown = ref(COUNTDOWN);
      let triggerStyle = ref<CSSProperties>({});

      let intervalId = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value -= 1000;
        }
      }, 1000);

      let timeoutId = setTimeout(() => {
        triggerStyle.value = {
          width: '200px',
          height: '50px'
        };
      }, COUNTDOWN + 1000);

      onUnmounted(() => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      });

      return {
        countdown,
        triggerStyle
      };
    },
    template: `
      <div style="margin-bottom: 100px; display: flex; flex-direction: column; align-items: center;">
        <div>
          <p>The trigger button below will change size in <strong>{{ Math.floor(countdown / 1000) }}s</strong></p>
        </div>
        <button
          aria-expanded="true"
          class="react-aria-Button"
          data-pressed="true"
          data-rac=""
          type="button"
          :style="triggerStyle">Open popover</button>
      </div>
      <div data-testid="underlay" style="position: fixed; inset: 0px;"></div>
      <div style="display: contents;">
        <div
          aria-labelledby="popover-trigger-observer-button"
          class="react-aria-Popover"
          data-placement="bottom"
          data-rac=""
          data-trigger="DialogTrigger"
          style="position: absolute; z-index: 5; max-height: 355px; background: Canvas; color: CanvasText; border: 1px solid gray; padding: 30px; left: 589.75px; top: 353px; --trigger-width: 100px; --trigger-anchor-point: 0px 0px;">
          <section class="react-aria-Dialog" role="dialog" tabindex="-1" style="outline: rgb(0, 95, 204) auto 1px;">
            <form style="display: flex; flex-direction: column; width: 233px; font-family: Times; font-size: 16px; line-height: normal;">
              <h2 class="react-aria-Heading" slot="title">Sign up</h2>
              <label>First Name: <input placeholder="John"></label>
              <label>Last Name: <input placeholder="Smith"></label>
              <button class="react-aria-Button" data-rac="" type="button" style="margin-top: 10px;">Submit</button>
            </form>
          </section>
        </div>
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

type PlacementCard = {
  key: keyof ArrowBoundaryOffsetArgs,
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

export const PopoverArrowBoundaryOffsetExample: Story = {
  render: (_args: ArrowBoundaryOffsetArgs) => ({
    components: {
      VuePopover
    },
    setup() {
      let active = ref<string>('');

      let toggle = (key: string) => {
        active.value = active.value === key ? '' : key;
      };

      return {
        active,
        rows,
        toggle
      };
    },
    template: `
      <div style="display: flex; flex-direction: column;">
        <div v-for="(row, rowIndex) in rows" :key="rowIndex" style="display: flex;">
          <div v-for="card in row" :key="card.key" style="padding: 12px;">
            <button type="button" style="width: 200px; height: 100px;" @click="toggle(card.key)">
              {{ card.label }}
            </button>
            <VuePopover
              :open="active === card.key"
              :placement="card.placement"
              :style="{
                background: 'Canvas',
                color: 'CanvasText',
                border: '1px solid gray',
                padding: '8px',
                zIndex: 5,
                borderRadius: '30px'
              }"
              @close="active = ''">
              <div style="display: flex;">
                <svg width="12" height="12" viewBox="0 0 12 12" :style="{display: 'block', transform: card.arrowRotation}">
                  <path d="M0 0L6 6L12 0" fill="white" stroke-width="1" stroke="gray" />
                </svg>
              </div>
              <div>{{ card.label }}</div>
            </VuePopover>
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

export const PopoverTriggerWidthExample: PopoverStory = () => ({
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
    <div>
      <button type="button" @click="isOpen = !isOpen">Open popover</button>
      <VuePopover
        :open="isOpen"
        placement="bottom start"
        :style="{
          background: 'Canvas',
          color: 'CanvasText',
          border: '1px solid gray',
          zIndex: 5,
          width: 'var(--trigger-width)'
        }"
        @close="isOpen = false">
        Should match the width of the trigger button
      </VuePopover>
    </div>
  `
});

export const ScrollingBoundaryContainer: Story = {
  render: (args) => ({
    components: {
      VuePopover
    },
    setup() {
      let isOpen = ref(false);

      return {
        args,
        isOpen
      };
    },
    template: `
      <div style="height: 300px; width: 300px; overflow: auto; border: 1px solid black;">
        <div style="width: 600px; height: 600px; display: flex; align-items: center; justify-content: center;">
          <div>
            <button type="button" style="width: 200px; height: 200px;" @click="isOpen = !isOpen">Open popover</button>
            <VuePopover
              :open="isOpen"
              :placement="String(args.placement ?? 'bottom')"
              :container-padding="Number(args.containerPadding ?? 0)"
              :style="{background: 'Canvas', color: 'CanvasText', border: '1px solid gray', zIndex: 5}"
              @close="isOpen = false">
              This is some dummy content for the popover
            </VuePopover>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    containerPadding: 0,
    placement: 'bottom'
  },
  argTypes: {
    containerPadding: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    },
    hideArrow: {
      table: {
        disable: true
      }
    },
    animation: {
      table: {
        disable: true
      }
    }
  }
};
