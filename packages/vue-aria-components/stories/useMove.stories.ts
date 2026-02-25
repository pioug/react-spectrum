import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import {useMove} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useMove'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type BallState = {
  color: string,
  x: number,
  y: number
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

function useClampedBallState(maxX: number, maxY: number) {
  let state = ref<BallState>({x: 0, y: 0, color: 'black'});
  let aria = useMove({
    onMoveStart: () => {
      state.value = {...state.value, color: 'red'};
    },
    onMove: ({deltaX, deltaY}) => {
      state.value = {
        ...state.value,
        x: clamp(state.value.x + deltaX, 0, maxX),
        y: clamp(state.value.y + deltaY, 0, maxY)
      };
    },
    onMoveEnd: () => {
      state.value = {...state.value, color: 'black'};
    }
  });

  return {
    moveProps: aria.moveProps,
    style: computed(() => ({
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      position: 'absolute',
      left: `${state.value.x}px`,
      top: `${state.value.y}px`,
      background: state.value.color
    }))
  };
}

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

export const Ball1D: Story = {
  render: () => ({
    setup() {
      let firstBall = useClampedBallState(170, 0);
      let secondBall = useClampedBallState(170, 0);

      return {
        firstBall,
        secondBall
      };
    },
    template: `
      <div style="display: grid; gap: 24px;">
        <div style="width: 200px; height: 30px; border: 1px solid black; position: relative; touch-action: none;">
          <div v-bind="firstBall.moveProps" tabindex="0" :style="firstBall.style" />
        </div>
        <div style="width: 200px; height: 30px; border: 1px solid black; position: relative; touch-action: none;">
          <div v-bind="secondBall.moveProps" tabindex="0" :style="secondBall.style" />
        </div>
      </div>
    `
  }),
  name: 'Ball 1D'
};

export const Ball2D: Story = {
  render: () => ({
    setup() {
      let ball = useClampedBallState(170, 170);
      return {
        ball
      };
    },
    template: `
      <div style="width: 200px; height: 200px; border: 1px solid black; position: relative; touch-action: none;">
        <div v-bind="ball.moveProps" tabindex="0" :style="ball.style" />
      </div>
    `
  }),
  name: 'Ball 2D'
};

export const BallNested: Story = {
  render: () => ({
    setup() {
      let boxState = ref<BallState>({x: 100, y: 100, color: 'grey'});
      let innerState = ref<BallState>({x: 0, y: 0, color: 'black'});

      let boxMove = useMove({
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

      let innerMove = useMove({
        onMoveStart: () => {
          innerState.value = {...innerState.value, color: 'red'};
        },
        onMove: ({deltaX, deltaY}) => {
          innerState.value = {
            ...innerState.value,
            x: clamp(innerState.value.x + deltaX, 0, 70),
            y: clamp(innerState.value.y + deltaY, 0, 70)
          };
        },
        onMoveEnd: () => {
          innerState.value = {...innerState.value, color: 'black'};
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

      let innerStyle = computed(() => ({
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        position: 'absolute',
        left: `${innerState.value.x}px`,
        top: `${innerState.value.y}px`,
        background: innerState.value.color
      }));

      return {
        boxMove: boxMove.moveProps,
        boxStyle,
        innerMove: innerMove.moveProps,
        innerStyle
      };
    },
    template: `
      <div style="position: relative; width: 360px; height: 260px; border: 1px dashed #bbb;">
        <div v-bind="boxMove" tabindex="0" :style="boxStyle">
          <div v-bind="innerMove" tabindex="0" :style="innerStyle" />
        </div>
      </div>
    `
  }),
  name: 'Ball nested'
};
