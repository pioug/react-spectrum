import {onMounted, ref} from 'vue';
import {OverlayContainer, OverlayProvider, useModal} from '@vue-aria/overlays';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useModal'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderAppStory(useAlternateContainer = false) {
  return {
    components: {
      OverlayContainer,
      OverlayProvider
    },
    setup() {
      let showModal = ref(false);
      let modal = useModal();
      let alternateContainer = ref<HTMLElement | null>(null);

      onMounted(() => {
        alternateContainer.value = document.getElementById('alternateContainer');
      });

      let toggle = () => {
        showModal.value = !showModal.value;
      };

      return {
        modalProps: modal.modalProps,
        alternateContainer,
        showModal,
        toggle,
        useAlternateContainer
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <button type="button" @click="toggle">Toggle</button>
        <div id="alternateContainer" data-testid="alternate-container" style="border: 1px dashed #aaa; padding: 8px;">
          <OverlayProvider data-testid="root-provider">
            This is the root provider.
            <OverlayContainer
              v-if="showModal"
              :portal-container="useAlternateContainer ? alternateContainer : undefined"
              data-testid="modal-provider">
              <div data-testid="modal" v-bind="modalProps">The Modal</div>
            </OverlayContainer>
          </OverlayProvider>
        </div>
      </div>
    `
  };
}

function renderBadContainerStory() {
  return {
    components: {
      OverlayContainer,
      OverlayProvider
    },
    setup() {
      let showOuter = ref(false);
      let showInner = ref(false);
      let innerModal = useModal();
      let nestedContainer = ref<HTMLElement | null>(null);

      onMounted(() => {
        nestedContainer.value = document.getElementById('nestedContainer');
      });

      let toggleOuter = () => {
        showOuter.value = !showOuter.value;
      };

      let toggleInner = () => {
        showInner.value = !showInner.value;
      };

      return {
        innerModalProps: innerModal.modalProps,
        nestedContainer,
        showInner,
        showOuter,
        toggleInner,
        toggleOuter
      };
    },
    template: `
      <div id="alternateContainer" data-testid="alternate-container" style="display: grid; gap: 8px;">
        <button type="button" @click="toggleOuter">Toggle 1</button>
        <OverlayProvider v-if="showOuter" data-testid="root-provider">
          <div style="display: grid; gap: 8px;">
            This is the root provider.
            <div id="nestedContainer"></div>
            <button type="button" @click="toggleInner">Toggle 2</button>
            <OverlayContainer
              v-if="showInner"
              :portal-container="nestedContainer"
              data-testid="inner-modal-provider">
              <div data-testid="inner-modal" v-bind="innerModalProps">Inner</div>
            </OverlayContainer>
          </div>
        </OverlayProvider>
      </div>
    `
  };
}

export const DefaultContainer: Story = {
  render: () => renderAppStory(false),
  name: 'default container'
};

export const DifferentContainer: Story = {
  render: () => renderAppStory(true),
  name: 'different container'
};

export const BadContainer: Story = {
  render: () => renderBadContainerStory(),
  name: 'bad container',
  parameters: {
    description: {
      data: 'this story should crash'
    }
  }
};
