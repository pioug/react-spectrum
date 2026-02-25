import {ref} from 'vue';
import {useModal} from '@vue-aria/overlays';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useModal'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderModalStory(args: {containerId?: string, disabled?: boolean, showNestedWarning?: boolean}) {
  return {
    setup() {
      let open = ref(false);
      let modal = useModal({
        isDisabled: args.disabled
      });

      let toggle = () => {
        open.value = !open.value;
      };

      return {
        containerId: args.containerId ?? 'default',
        modalProps: modal.modalProps,
        open,
        showNestedWarning: Boolean(args.showNestedWarning),
        toggle
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 520px;">
        <button type="button" @click="toggle">Toggle</button>
        <div :id="containerId" style="border: 1px dashed #aaa; padding: 8px;">
          Container: {{containerId}}
          <div
            v-if="open"
            v-bind="modalProps"
            style="margin-top: 8px; border: 1px solid #999; background: #fff; padding: 12px;">
            The Modal
          </div>
        </div>
        <p v-if="showNestedWarning" style="margin: 0; color: #b54708;">
          This story intentionally models a bad nested container configuration.
        </p>
      </div>
    `
  };
}

export const DefaultContainer: Story = {
  render: () => renderModalStory({containerId: 'default'}),
  name: 'default container'
};

export const DifferentContainer: Story = {
  render: () => renderModalStory({containerId: 'alternateContainer'}),
  name: 'different container'
};

export const BadContainer: Story = {
  render: () => renderModalStory({containerId: 'nestedContainer', showNestedWarning: true}),
  name: 'bad container',
  parameters: {
    description: {
      data: 'This story models the nested container configuration that should crash in React.'
    }
  }
};
