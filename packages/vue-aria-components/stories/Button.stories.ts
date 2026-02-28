import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Button} from '@vue-spectrum/button';
import {VueTooltipTrigger} from '@vue-spectrum/tooltip';
import {h, onBeforeUnmount, ref} from 'vue';
import '../../react-aria-components/stories/button-pending.css';
import '../../react-aria-components/stories/button-ripple.css';

const meta = {
  title: 'React Aria Components/Button',
  component: Button
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;
type ButtonStoryArgs = {
  children?: string
};
const PENDING_TIMEOUT_MS = 5000;
type ButtonRendererOptions = {
  className?: string,
  isPending?: boolean | (() => boolean),
  style?: string
};

function renderAsReactAriaButton(props: Record<string, unknown>, children: unknown, options: ButtonRendererOptions = {}) {
  let {
    class: _className,
    'data-static-color': _dataStaticColor,
    'data-style': _dataStyle,
    'data-variant': _dataVariant,
    ...rest
  } = props;

  let resolvedClassName = options.className ?? 'react-aria-Button';

  let isPending = typeof options.isPending === 'function' ? options.isPending() : options.isPending;
  let hasDisabledAttr = rest.disabled === '' || rest.disabled === true || rest.disabled === 'true';

  let normalizedProps: Record<string, unknown> = {
    ...rest,
    class: resolvedClassName,
    'data-rac': '',
    'data-react-aria-pressable': 'true',
    tabindex: rest.tabindex ?? (isPending || !hasDisabledAttr ? 0 : undefined)
  };

  if (normalizedProps['data-pressed'] === 'true') {
    normalizedProps['data-focus-visible'] = undefined;
  }

  if (isPending) {
    normalizedProps['aria-disabled'] = 'true';
    normalizedProps['data-disabled'] = undefined;
    normalizedProps['data-hovered'] = undefined;
    normalizedProps['data-pending'] = 'true';
    normalizedProps.disabled = undefined;
  }

  if (options.style) {
    normalizedProps.style = options.style;
  }

  return h('button', normalizedProps, children);
}

function createReactAriaButtonRenderer(options: ButtonRendererOptions = {}) {
  return (props: Record<string, unknown>, children: unknown) => renderAsReactAriaButton(props, children, options);
}

export const ButtonExample: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let onPress = action('onPress');
      let onClick = action('onClick');
      let renderButton = createReactAriaButtonRenderer();

      let onButtonClick = (event: MouseEvent) => {
        onPress(event);
        onClick(event);
      };

      return {
        onButtonClick,
        renderButton
      };
    },
    template: `
      <Button :render="renderButton" data-testid="button-example" @click="onButtonClick">
        Press me
      </Button>
    `
  })
};

export const PendingButton: Story = {
  render: (args: ButtonStoryArgs) => ({
    components: {
      Button
    },
    setup() {
      let isPending = ref(false);
      let pendingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
      let renderPendingButton = createReactAriaButtonRenderer({
        className: 'button',
        isPending: () => isPending.value
      });

      let onPress = (event: MouseEvent) => {
        action('pressed')(event);
        if (isPending.value) {
          return;
        }

        isPending.value = true;
        pendingTimeout.value = setTimeout(() => {
          isPending.value = false;
          pendingTimeout.value = null;
        }, PENDING_TIMEOUT_MS);
      };

      onBeforeUnmount(() => {
        if (pendingTimeout.value) {
          clearTimeout(pendingTimeout.value);
        }
      });

      return {
        args,
        isPending,
        onPress,
        renderPendingButton
      };
    },
    template: `
      <Button
        :is-disabled="isPending"
        :render="renderPendingButton"
        @click="onPress">
        <span :class="{pending: isPending}">
          {{ args.children }}
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
PendingButton.args = {
  children: 'Press me'
};

export const PendingButtonTooltip: Story = {
  render: (args: ButtonStoryArgs) => ({
    components: {
      Button,
      VueTooltipTrigger
    },
    setup() {
      let isPending = ref(false);
      let pendingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
      let tooltipOpen = ref(false);
      let renderPendingButton = createReactAriaButtonRenderer({
        className: 'button',
        isPending: () => isPending.value
      });
      let onPress = (event: MouseEvent) => {
        action('pressed')(event);
        if (isPending.value) {
          return;
        }

        tooltipOpen.value = false;
        isPending.value = true;
        pendingTimeout.value = setTimeout(() => {
          isPending.value = false;
          pendingTimeout.value = null;
        }, PENDING_TIMEOUT_MS);
      };

      onBeforeUnmount(() => {
        if (pendingTimeout.value) {
          clearTimeout(pendingTimeout.value);
        }
      });

      return {
        args,
        isPending,
        tooltipOpen,
        onPress,
        renderPendingButton
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
          :render="renderPendingButton"
          @click="onPress">
          <span :class="{pending: isPending}">
            {{ args.children }}
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
PendingButtonTooltip.args = {
  children: 'Press me, then hover again to see tooltip'
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
      let renderRippleButton = createReactAriaButtonRenderer({
        className: 'ripple-button'
      });

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
        renderRippleButton,
        rippleX,
        rippleY
      };
    },
    template: `
      <Button :render="renderRippleButton" data-testid="button-example" @click="onPress">
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
      let renderButton = createReactAriaButtonRenderer();

      let handlePress = () => {
        if (!showButtons.value) {
          showButtons.value = true;
        } else {
          count.value += 1;
        }
      };

      return {
        count,
        renderButton,
        showButtons,
        handlePress
      };
    },
    template: `
      <div>
        <div style="margin-top: 24px; margin-bottom: 16px;">
          <Button :render="renderButton" @click="handlePress">
            {{ showButtons ? 'Re-render' : 'Render' }}
          </Button>
        </div>
        <div v-if="showButtons" style="display: flex; gap: 2px; flex-wrap: wrap;" :key="count">
          <Button v-for="item in 20000" :key="item" :render="renderButton">Press me</Button>
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
      let renderButton = createReactAriaButtonRenderer({
        style: 'background: red;'
      });

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
