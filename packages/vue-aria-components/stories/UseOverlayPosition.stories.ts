import {computed, ref} from 'vue';
import {useOverlayPosition, useOverlayTrigger} from '@vue-aria/overlays';
import type {OverlayPlacement} from '@vue-aria/overlays';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TriggerArgs = {
  buttonWidth?: number,
  maxHeight?: number,
  placement: OverlayPlacement,
  withPortal?: boolean
};

const meta = {
  title: 'UseOverlayPosition'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderTrigger(args: TriggerArgs) {
  return {
    setup() {
      let targetRef = ref<HTMLElement | null>(null);
      let overlayRef = ref<HTMLElement | null>(null);
      let overlayTrigger = useOverlayTrigger({
        type: 'menu'
      });
      let position = useOverlayPosition({
        isOpen: overlayTrigger.isOpen,
        offset: 10,
        overlayRef,
        placement: args.placement,
        targetRef
      });

      let items = computed(() => {
        let count = args.maxHeight ? 20 : 5;
        return Array.from({length: count}, (_, index) => `Hello ${index}`);
      });

      let overlayStyle = computed(() => ({
        ...position.overlayProps.value.style,
        backgroundColor: 'white',
        border: '1px solid #c8c8c8',
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)',
        overflow: 'auto',
        maxHeight: args.maxHeight ? `${args.maxHeight}px` : undefined,
        zIndex: 1
      }));

      return {
        buttonWidth: args.buttonWidth,
        isOpen: overlayTrigger.isOpen,
        items,
        overlayRef,
        overlayProps: overlayTrigger.overlayProps,
        overlayStyle,
        portalLabel: args.withPortal ? 'document.body' : 'positioned',
        targetRef,
        triggerProps: overlayTrigger.triggerProps
      };
    },
    template: `
      <div style="position: relative; margin: 0 auto; min-height: 240px; display: flex; align-items: flex-start; justify-content: center;">
        <div>
          <button
            ref="targetRef"
            v-bind="triggerProps"
            type="button"
            :style="{width: buttonWidth ? buttonWidth + 'px' : undefined}">
            Trigger (open: {{String(isOpen)}})
          </button>
          <div v-if="isOpen" ref="overlayRef" v-bind="overlayProps" :style="overlayStyle">
            <div style="font-size: 12px; color: #666; padding: 8px 10px 0;">Container: {{portalLabel}}</div>
            <ul style="padding: 10px; margin: 0; list-style: none;">
              <li v-for="item in items" :key="item">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    `
  };
}

export const DocumentBodyContainerBottom: Story = {
  render: () => renderTrigger({withPortal: true, placement: 'bottom'}),
  name: 'Document Body Container Bottom'
};

export const DocumentBodyContainerTop: Story = {
  render: () => renderTrigger({withPortal: true, placement: 'top'}),
  name: 'Document Body Container Top'
};

export const PositionedContainerBottom: Story = {
  render: () => renderTrigger({withPortal: false, placement: 'bottom'}),
  name: 'Positioned Container Bottom'
};

export const PositionedContainerTop: Story = {
  render: () => renderTrigger({withPortal: false, placement: 'top'}),
  name: 'Positioned Container Top'
};

export const ButtonWidth500DocumentBodyBottomStart: Story = {
  render: () => renderTrigger({withPortal: true, buttonWidth: 500, placement: 'bottom start'}),
  name: 'Button Width 500 Document Body Bottom Start'
};

export const MaxHeight200ContainerBottom: Story = {
  render: () => renderTrigger({withPortal: true, maxHeight: 200, placement: 'bottom'}),
  name: 'Max Height 200 Container Bottom'
};

export const MaxHeight200ContainerTop: Story = {
  render: () => renderTrigger({withPortal: true, maxHeight: 200, placement: 'top'}),
  name: 'Max Height 200 Container Top'
};
