import {action} from '@storybook/addon-actions';
import {computed, defineComponent, ref} from 'vue';
import {useMove, type MoveEndEvent, type MoveStartEvent} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type Position = {
  x: number,
  y: number
};

type ClampedMoveOptions = {
  getCurrentState: () => Position,
  onMoveEnd?: (event: MoveEndEvent) => void,
  onMoveStart?: (event: MoveStartEvent) => void,
  onMoveTo: (value: Position & {pointerType: string}) => void,
  reverseX?: boolean,
  reverseY?: boolean
};

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function useClampedMove(options: ClampedMoveOptions) {
  let currentPosition = ref<Position | null>(null);

  let {moveProps} = useMove({
    onMoveStart: (event) => {
      currentPosition.value = null;
      options.onMoveStart?.(event);
    },
    onMove: ({deltaX, deltaY, pointerType}) => {
      if (!currentPosition.value) {
        currentPosition.value = options.getCurrentState();
      }

      currentPosition.value.x += options.reverseX ? -deltaX : deltaX;
      currentPosition.value.y += options.reverseY ? -deltaY : deltaY;
      options.onMoveTo({
        pointerType,
        x: currentPosition.value.x,
        y: currentPosition.value.y
      });
    },
    onMoveEnd: options.onMoveEnd
  });

  return moveProps;
}

const Ball1D = defineComponent({
  setup() {
    let state = ref({x: 0, color: 'black'});
    let moveProps = useClampedMove({
      reverseY: true,
      onMoveStart: () => {
        state.value = {...state.value, color: 'red'};
      },
      onMoveTo: ({x}) => {
        state.value = {
          ...state.value,
          x: clamp(x, 0, 200 - 30)
        };
      },
      getCurrentState: () => ({x: state.value.x, y: 0}),
      onMoveEnd: () => {
        state.value = {...state.value, color: 'black'};
      }
    });

    let ballStyle = computed(() => ({
      width: '30px',
      height: '30px',
      borderRadius: '100%',
      position: 'absolute',
      left: `${state.value.x}px`,
      background: state.value.color
    }));

    return {
      ballStyle,
      moveProps
    };
  },
  template: `
    <div style="width: 200px; height: 30px; background: white; border: 1px solid black; position: relative; touch-action: none;">
      <div tabindex="0" v-bind="moveProps" :style="ballStyle" />
    </div>
  `
});

const Ball2DStory = defineComponent({
  setup() {
    let state = ref({x: 0, y: 0, color: 'black'});
    let moveProps = useClampedMove({
      onMoveStart: () => {
        state.value = {...state.value, color: 'red'};
      },
      onMoveTo: ({x, y}) => {
        state.value = {
          ...state.value,
          x: clamp(x, 0, 200 - 30),
          y: clamp(y, 0, 200 - 30)
        };
      },
      getCurrentState: () => ({x: state.value.x, y: state.value.y}),
      onMoveEnd: () => {
        state.value = {...state.value, color: 'black'};
      }
    });

    let ballStyle = computed(() => ({
      width: '30px',
      height: '30px',
      borderRadius: '100%',
      position: 'absolute',
      left: `${state.value.x}px`,
      top: `${state.value.y}px`,
      background: state.value.color
    }));

    return {
      ballStyle,
      moveProps
    };
  },
  template: `
    <div style="width: 200px; height: 200px; background: white; border: 1px solid black; position: relative; touch-action: none;">
      <div tabindex="0" v-bind="moveProps" :style="ballStyle" />
    </div>
  `
});

const BallNestedStory = defineComponent({
  setup() {
    let ballState = ref({x: 0, y: 0, color: 'black'});
    let boxState = ref({x: 100, y: 100, color: 'grey'});
    let ball = useMove({
      onMoveStart: () => {
        ballState.value = {...ballState.value, color: 'red'};
      },
      onMove: ({deltaX, deltaY}) => {
        ballState.value = {
          ...ballState.value,
          x: ballState.value.x + deltaX,
          y: ballState.value.y + deltaY
        };
      },
      onMoveEnd: () => {
        ballState.value = {...ballState.value, color: 'black'};
      }
    });
    let box = useMove({
      onMoveStart: () => {
        boxState.value = {...boxState.value, color: 'orange'};
      },
      onMove: ({deltaX, deltaY}) => {
        boxState.value = {
          ...boxState.value,
          x: boxState.value.x + deltaX,
          y: boxState.value.y + deltaY
        };
      },
      onMoveEnd: () => {
        boxState.value = {...boxState.value, color: 'grey'};
      }
    });

    let boxStyle = computed(() => ({
      width: '100px',
      height: '100px',
      touchAction: 'none',
      position: 'absolute',
      left: `${boxState.value.x}px`,
      top: `${boxState.value.y}px`,
      background: boxState.value.color
    }));

    let ballStyle = computed(() => ({
      width: '30px',
      height: '30px',
      borderRadius: '100%',
      position: 'absolute',
      left: `${ballState.value.x}px`,
      top: `${ballState.value.y}px`,
      background: ballState.value.color
    }));

    return {
      ballMoveProps: ball.moveProps,
      ballStyle,
      boxMoveProps: box.moveProps,
      boxStyle
    };
  },
  template: `
    <div tabindex="0" v-bind="boxMoveProps" :style="boxStyle">
      <div tabindex="0" v-bind="ballMoveProps" :style="ballStyle" />
    </div>
  `
});

const meta = {
  title: 'useMove'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Log: Story = {
  render: () => ({
    setup() {
      let {moveProps} = useMove({
        onMoveStart: (event) => {
          action('onMoveStart')(JSON.stringify(event));
        },
        onMove: (event) => {
          action('onMove')(JSON.stringify(event));
        },
        onMoveEnd: (event) => {
          action('onMoveEnd')(JSON.stringify(event));
        }
      });

      return {
        moveProps
      };
    },
    template: `
      <div
        v-bind="moveProps"
        tabindex="0"
        style="width: 200px; height: 200px; background: white; border: 1px solid black; touch-action: none;" />
    `
  }),
  name: 'Log'
};

export const _Ball1D: Story = {
  render: () => ({
    components: {Ball1D},
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px;">
        <Ball1D />
        <Ball1D />
      </div>
    `
  }),
  name: 'Ball 1D'
};

export const Ball2D: Story = {
  render: () => ({
    components: {Ball2DStory},
    template: '<Ball2DStory />'
  }),
  name: 'Ball 2D'
};

export const BallNested: Story = {
  render: () => ({
    components: {BallNestedStory},
    template: '<BallNestedStory />'
  }),
  name: 'Ball nested'
};
