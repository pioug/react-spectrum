import {ActionButton, Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Checkbox} from '@vue-spectrum/checkbox';
import {Dialog} from '@vue-spectrum/dialog';
import {UNSAFE_PortalProvider} from '@vue-aria/overlays';
import {action} from '@storybook/addon-actions';
import {clearToastQueue, ToastContainer, ToastQueue, type SpectrumToastOptions} from '../src';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = {
  placement?: 'bottom' | 'bottom end' | 'top' | 'top end',
  shouldCloseOnAction?: boolean,
  timeout?: number
};

const meta: Meta = {
  title: 'Toast',
  args: {
    shouldCloseOnAction: false,
    timeout: undefined,
    placement: undefined
  },
  argTypes: {
    shouldCloseOnAction: {
      control: 'boolean'
    },
    timeout: {
      control: 'radio',
      options: [undefined, 5000]
    },
    placement: {
      control: 'select',
      options: [undefined, 'top', 'top end', 'bottom', 'bottom end']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function getBaseToastOptions(args: StoryArgs): SpectrumToastOptions {
  return {
    shouldCloseOnAction: Boolean(args.shouldCloseOnAction),
    timeout: typeof args.timeout === 'number' ? args.timeout : undefined
  };
}

function createToastHandlers(args: StoryArgs, overrides: Partial<SpectrumToastOptions> = {}) {
  let createOptions = (): SpectrumToastOptions => ({
    ...getBaseToastOptions(args),
    ...overrides,
    onClose: action('onClose')
  });

  return {
    showNeutralToast: () => ToastQueue.neutral('Toast available', createOptions()),
    showPositiveToast: () => ToastQueue.positive('Toast is done!', createOptions()),
    showNegativeToast: () => ToastQueue.negative('Toast is burned!', createOptions()),
    showInfoToast: () => ToastQueue.info('Toasting…', createOptions())
  };
}

function renderToastContainer(args: StoryArgs, options: {showAction?: boolean, testId?: string} = {}) {
  return {
    components: {Button, ButtonGroup, ToastContainer},
    setup() {
      clearToastQueue();
      onBeforeUnmount(() => {
        clearToastQueue();
      });
      let handlers = createToastHandlers(
        args,
        options.showAction ? {actionLabel: 'Action', onAction: action('onAction') as () => void} : {}
      );
      return {
        placement: args.placement,
        testId: options.testId,
        ...handlers
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <ButtonGroup>
          <Button variant="secondary" @click="showNeutralToast">Show Neutral Toast</Button>
          <Button variant="primary" @click="showPositiveToast">Show Positive Toast</Button>
          <Button variant="negative" @click="showNegativeToast">Show Negative Toast</Button>
          <Button variant="accent" @click="showInfoToast">Show Info Toast</Button>
        </ButtonGroup>
        <ToastContainer :placement="placement" :data-testid="testId" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderToastContainer(args),
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const WithAction: Story = {
  render: (args) => renderToastContainer(args, {showAction: true}),
  name: 'With Action',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const WithTestId: Story = {
  render: (args) => renderToastContainer(args, {showAction: true, testId: 'hello i am a test id'}),
  name: 'With Test Id',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const WithDialog: Story = {
  render: (args) => ({
    components: {ActionButton, Button, ButtonGroup, Dialog, ToastContainer},
    setup() {
      clearToastQueue();
      let isOpen = ref(false);
      onBeforeUnmount(() => {
        clearToastQueue();
      });

      let handlers = createToastHandlers(args);
      return {
        isOpen,
        onDismiss: () => {
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        placement: args.placement,
        ...handlers
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <ActionButton @click="openDialog">Open dialog</ActionButton>
        <Dialog v-if="isOpen" title="Toasty" isDismissable @close="onDismiss">
          <template #heading><h2>Toasty</h2></template>
          <ButtonGroup>
            <Button variant="secondary" @click="showNeutralToast">Show Neutral Toast</Button>
            <Button variant="primary" @click="showPositiveToast">Show Positive Toast</Button>
            <Button variant="negative" @click="showNegativeToast">Show Negative Toast</Button>
            <Button variant="accent" @click="showInfoToast">Show Info Toast</Button>
          </ButtonGroup>
        </Dialog>
        <ToastContainer :placement="placement" />
      </div>
    `
  }),
  name: 'With Dialog',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const MultipleToastContainers: Story = {
  render: (args) => ({
    components: {Button, ButtonGroup, Checkbox, ToastContainer},
    setup() {
      clearToastQueue();
      let firstMounted = ref(true);
      let secondMounted = ref(true);
      let handlers = createToastHandlers(args);

      onBeforeUnmount(() => {
        clearToastQueue();
      });

      return {
        firstMounted,
        secondMounted,
        placement: args.placement,
        ...handlers
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <Checkbox v-model="firstMounted">First mounted</Checkbox>
        <Checkbox v-model="secondMounted">Second mounted</Checkbox>
        <ButtonGroup>
          <Button variant="secondary" @click="showNeutralToast">Show Neutral Toast</Button>
          <Button variant="primary" @click="showPositiveToast">Show Positive Toast</Button>
          <Button variant="negative" @click="showNegativeToast">Show Negative Toast</Button>
          <Button variant="accent" @click="showInfoToast">Show Info Toast</Button>
        </ButtonGroup>
        <ToastContainer v-if="firstMounted" :placement="placement" />
        <ToastContainer v-if="secondMounted" />
      </div>
    `
  }),
  name: 'Multiple Toast Containers',
  parameters: {
    disableToastContainer: true,
    a11y: {
      config: {
        rules: [
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const ProgrammaticallyClosing: Story = {
  render: (args) => ({
    components: {Button, ToastContainer},
    setup() {
      clearToastQueue();
      let close = ref<(() => void) | null>(null);
      let toggleToast = () => {
        if (close.value) {
          close.value();
          close.value = null;
          return;
        }
        close.value = ToastQueue.negative('Unable to save', {
          ...getBaseToastOptions(args),
          onClose: () => {
            close.value = null;
          }
        });
      };

      onBeforeUnmount(() => {
        close.value?.();
        clearToastQueue();
      });

      return {
        close,
        placement: args.placement,
        toggleToast
      };
    },
    template: `
      <div style="display: grid; gap: 10px; justify-items: start;">
        <Button variant="primary" @click="toggleToast">{{close ? 'Hide' : 'Show'}} Toast</Button>
        <ToastContainer :placement="placement" />
      </div>
    `
  }),
  name: 'Programmatically Closing',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const WithIframe: Story = {
  render: () => ({
    setup() {
      return {
        iframeSrc: 'iframe.html?providerSwitcher-express=false&providerSwitcher-toastPosition=bottom&viewMode=story&id=toast--with-dialog'
      };
    },
    template: '<iframe title="iframe" width="500" height="500" :src="iframeSrc" tabindex="-1" />'
  }),
  name: 'With Iframe',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'aria-allowed-role', selector: '*:not(iframe[role="main"])'},
          {id: 'landmark-main-is-top-level', enabled: false},
          {id: 'landmark-no-duplicate-main', enabled: false},
          {id: 'landmark-unique', enabled: false}
        ]
      }
    }
  }
};

export const withFullscreen: Story = {
  render: (args) => ({
    components: {ActionButton, Button, ButtonGroup, ToastContainer, UNSAFE_PortalProvider},
    setup() {
      clearToastQueue();
      let rootRef = ref<HTMLDivElement | null>(null);
      let isFullscreen = ref(false);

      let syncFullscreenState = () => {
        if (typeof document === 'undefined') {
          return;
        }

        isFullscreen.value = document.fullscreenElement === rootRef.value;
      };

      onMounted(() => {
        if (typeof document !== 'undefined') {
          document.addEventListener('fullscreenchange', syncFullscreenState);
        }
      });

      onBeforeUnmount(() => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('fullscreenchange', syncFullscreenState);
        }

        clearToastQueue();
      });

      let enterFullscreen = async () => {
        let element = rootRef.value;
        let requestFullscreen = element?.requestFullscreen;
        if (typeof requestFullscreen === 'function') {
          await requestFullscreen.call(element);
        }
      };

      let handlers = createToastHandlers(args);
      return {
        rootRef,
        isFullscreen,
        enterFullscreen,
        placement: args.placement,
        ...handlers
      };
    },
    template: `
      <div
        ref="rootRef"
        style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: white; padding: 16px; box-sizing: border-box; display: grid; gap: 12px; align-content: start;">
        <UNSAFE_PortalProvider>
          <ButtonGroup>
            <Button variant="secondary" @click="showNeutralToast">Show Neutral Toast</Button>
            <Button variant="primary" @click="showPositiveToast">Show Positive Toast</Button>
            <Button variant="negative" @click="showNegativeToast">Show Negative Toast</Button>
            <Button variant="accent" @click="showInfoToast">Show Info Toast</Button>
          </ButtonGroup>
          <ActionButton @click="enterFullscreen">Enter fullscreen</ActionButton>
          <ToastContainer v-if="isFullscreen" key="miniapp" :placement="placement" />
        </UNSAFE_PortalProvider>
        <ToastContainer v-if="!isFullscreen" key="app" :placement="placement" />
      </div>
    `
  })
};
