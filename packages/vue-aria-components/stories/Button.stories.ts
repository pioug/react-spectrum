import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Button} from '@vue-spectrum/button';
import {VueTooltipTrigger} from '@vue-spectrum/tooltip';
import {h, ref} from 'vue';
import '../../react-aria-components/stories/button-pending.css';
import '../../react-aria-components/stories/button-ripple.css';

const meta = {
  title: 'React Aria Components/Button',
  component: Button
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ButtonExample: Story = {
  render: () => ({
    components: {
      Button
    },
    template: `
      <Button data-testid="button-example">
        Press me
      </Button>
    `
  })
};

export const PendingButton: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let isPending = ref(false);
      let renderPendingButton = (props: Record<string, unknown>, children: unknown) => {
        let {disabled: _disabled, ...rest} = props;
        return h('button', rest, children);
      };

      let onPress = () => {
        if (isPending.value) {
          return;
        }

        isPending.value = true;
        setTimeout(() => {
          isPending.value = false;
        }, 5000);
      };

      return {
        isPending,
        onPress,
        renderPendingButton
      };
    },
    template: `
      <Button
        :is-disabled="isPending"
        :render="renderPendingButton"
        class="button"
        @click="onPress">
        <span :class="{pending: isPending}">
          Press me
        </span>
        <span :class="['spinner', {'spinner-pending': isPending}]">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-label="loading">
            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
            <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
              <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
            </path>
          </svg>
        </span>
      </Button>
    `
  })
};

export const PendingButtonTooltip: Story = {
  render: () => ({
    components: {
      Button,
      VueTooltipTrigger
    },
    setup() {
      let isPending = ref(false);
      let tooltipOpen = ref(false);
      let onPress = () => {
        if (isPending.value) {
          return;
        }

        tooltipOpen.value = false;
        isPending.value = true;
        setTimeout(() => {
          isPending.value = false;
        }, 5000);
      };

      return {
        isPending,
        tooltipOpen,
        onPress
      };
    },
    template: `
      <VueTooltipTrigger
        v-model="tooltipOpen"
        :is-disabled="isPending"
        content="Tooltip should appear on hover"
        placement="top">
        <Button
          :is-disabled="isPending"
          class="button"
          @click="onPress">
          <span :class="{pending: isPending}">
            Press me, then hover again to see tooltip
          </span>
          <span :class="['spinner', {'spinner-pending': isPending}]">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-label="loading">
              <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
              <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
              </path>
            </svg>
          </span>
        </Button>
      </VueTooltipTrigger>
    `
  })
};

export const RippleButtonExample: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let isRippling = ref(false);
      let rippleX = ref(-1);
      let rippleY = ref(-1);

      let onPress = (event: MouseEvent) => {
        let target = event.currentTarget as HTMLElement | null;
        if (!target) {
          return;
        }

        let rect = target.getBoundingClientRect();
        rippleX.value = event.clientX - rect.left;
        rippleY.value = event.clientY - rect.top;
        isRippling.value = true;
        setTimeout(() => {
          isRippling.value = false;
        }, 300);
      };

      return {
        isRippling,
        onPress,
        rippleX,
        rippleY
      };
    },
    template: `
      <Button data-testid="button-example" class="ripple-button" @click="onPress">
        <span
          v-if="isRippling"
          class="ripple"
          :style="{left: rippleX + 'px', top: rippleY + 'px'}" />
        <span class="content">Press me</span>
      </Button>
    `
  })
};

export const ButtonPerformance: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let count = ref(0);
      let showButtons = ref(false);

      let handlePress = () => {
        if (!showButtons.value) {
          showButtons.value = true;
        } else {
          count.value += 1;
        }
      };

      return {
        count,
        showButtons,
        handlePress
      };
    },
    template: `
      <div>
        <Button style="margin-top: 24px; margin-bottom: 16px;" @click="handlePress">
          {{ showButtons ? 'Re-render' : 'Render' }}
        </Button>
        <div v-if="showButtons" style="display: flex; gap: 2px; flex-wrap: wrap;" :key="count">
          <Button v-for="item in 20000" :key="item">Press me</Button>
        </div>
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'When usePress is used on the page, there should be a <style> tag placed in the head of the document that applies touch-action: pan-x pan-y pinch-zoom to the [data-react-aria-pressable] elements.'
    }
  }
};

export const ButtonRender: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let renderButton = (props: Record<string, unknown>, children: unknown) => h('button', {
        ...props,
        style: 'background: red;'
      }, children);

      return {
        renderButton
      };
    },
    template: `
      <Button :render="renderButton">
        Testing
      </Button>
    `
  })
};
