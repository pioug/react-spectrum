import {ActionButton, Button} from '@vue-spectrum/button';
import {AlertDialog, DialogTrigger} from '../src';
import {MenuTrigger} from '@vue-spectrum/menu';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import {useLocalizedStringFormatter} from '@vue-aria/i18n';
import {action} from 'storybook/actions';
import {ref} from 'vue';
import intlMessages from '../../../@react-spectrum/dialog/chromatic/intlMessages.json';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
const DIALOG_BODY_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.';
const ALERT_ICON_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';

const meta: Meta<typeof DialogTrigger> = {
  title: 'DialogTrigger',
  component: DialogTrigger,
  providerSwitcher: {status: 'notice'},
  argTypes: {
    crossOffset: {
      control: {
        type: 'number'
      }
    },
    offset: {
      control: {
        type: 'number'
      }
    },
    placement: {
      control: {
        type: 'select'
      },
      defaultValue: 'top',
      options: [
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
      ]
    },
    buttonHeight: {
      control: {
        type: 'number'
      }
    },
    buttonWidth: {
      control: {
        type: 'number'
      }
    },
    shouldFlip: {
      control: {type: 'boolean'}
    },
    isKeyboardDismissDisabled: {
      control: {type: 'boolean'}
    },
    containerPadding: {
      control: {
        type: 'number'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDialog(args: StoryArgs, content = DIALOG_BODY_TEXT) {
  return {
    components: {ActionButton, Button, DialogTrigger},
    setup() {
      let isOpen = ref(false);
      let openDialog = () => {
        isOpen.value = true;
        action('open change')(true);
      };
      let closeDialog = () => {
        isOpen.value = false;
        action('open change')(false);
      };
      let cancel = () => {
        action('cancel')();
        closeDialog();
      };
      let confirm = () => {
        action('confirm')();
        closeDialog();
      };
      return {args, cancel, closeDialog, confirm, content, isOpen, openDialog};
    },
    template: `
      <div style="display: flex; width: auto; margin: 100px 0;">
        <ActionButton
          @click="openDialog"
          :style="{
            height: args.buttonHeight ? args.buttonHeight + 'px' : undefined,
            width: args.buttonWidth ? args.buttonWidth + 'px' : undefined
          }">Trigger</ActionButton>
        <DialogTrigger v-bind="args" :open="isOpen" @close="closeDialog">
          <template #heading><h2>The Heading</h2></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>
          <p>{{content}}</p>
          <template v-if="args.type !== 'popover' && args.type !== 'tray' && !args.isDismissable" #buttonGroup>
            <Button variant="secondary" @click="cancel">Cancel</Button>
            <Button variant="cta" @click="confirm">Confirm</Button>
          </template>
        </DialogTrigger>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDialog(args, DIALOG_BODY_TEXT)
};

export const TypePopover: Story = {
  ...Default,
  args: {
    type: 'popover'
  }
};

export const TypeModal: Story = {
  ...Default,
  args: {
    type: 'modal'
  }
};

export const TypeModalIsDismissable: Story = {
  ...Default,
  args: {
    type: 'modal',
    isDismissable: true
  }
};

export const TypeFullscreen: Story = {
  ...Default,
  args: {
    type: 'fullscreen'
  }
};

export const TypeFullscreenTakeover: Story = {
  ...Default,
  args: {
    type: 'fullscreenTakeover'
  }
};

export const TypeTray: Story = {
  ...Default,
  args: {
    type: 'tray'
  }
};

export const MobileTypeFullscreen: Story = {
  render: (args) => renderDialog(args, DIALOG_BODY_TEXT),
  args: {
    mobileType: 'fullscreen',
    type: 'modal'
  }
};

export const MobileTypeFullscreenTakeover: Story = {
  render: (args) => renderDialog(args, DIALOG_BODY_TEXT),
  args: {
    mobileType: 'fullscreenTakeover',
    type: 'modal'
  }
};

export const PopoverWithMobileTypeModal: Story = {
  render: (args) => renderDialog(args, DIALOG_BODY_TEXT),
  args: {
    mobileType: 'modal',
    type: 'popover'
  }
};

export const PopoverWithMobileTypeTray: Story = {
  render: (args) => renderDialog(args, DIALOG_BODY_TEXT),
  args: {
    mobileType: 'tray',
    type: 'popover'
  }
};

export const NestedModals: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="display: grid; gap: 12px; padding-top: 100px;">
        <input aria-label="test input" />
        <DialogTrigger type="modal" is-dismissable title="Outer dialog">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <input />
          <input />
          <DialogTrigger type="modal" is-dismissable title="Nested dialog">
            <template #trigger="{open}">
              <ActionButton @click="open">Trigger</ActionButton>
            </template>
            <input />
            <input />
          </DialogTrigger>
        </DialogTrigger>
      </div>
    `
  })
};

export const NestedModalsFullscreentakeover: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, DialogTrigger},
    template: `
      <DialogTrigger type="fullscreenTakeover" title="The Heading">
        <template #trigger="{open}">
          <ActionButton @click="open">Trigger</ActionButton>
        </template>
        <template #header><div>The Header</div></template>
        <template #divider><hr /></template>
        <DialogTrigger type="modal" is-dismissable title="Nested dialog">
          <template #trigger="{open}">
            <ActionButton variant="secondary" @click="open">Trigger</ActionButton>
          </template>
          <input />
          <input />
        </DialogTrigger>
        <template #buttonGroup>
          <Button variant="secondary">Cancel</Button>
          <Button variant="cta">Confirm</Button>
        </template>
      </DialogTrigger>
    `
  })
};

export const WithMenuTrigger: Story = {
  render: () => ({
    components: {ActionButton, DialogTrigger, MenuTrigger},
    setup() {
      return {
        menuItems: [
          {key: 'one', label: 'Item 1'},
          {key: 'two', label: 'Item 2'},
          {key: 'three', label: 'Item 3'}
        ]
      };
    },
    template: `
      <div style="display: flex; margin: 100px 0;">
        <DialogTrigger type="popover">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <template #heading><h2>The Heading</h2></template>
          <MenuTrigger :items="menuItems">
            <template #trigger="{toggle}">
              <ActionButton variant="secondary" @click="toggle">Test</ActionButton>
            </template>
          </MenuTrigger>
        </DialogTrigger>
      </div>
    `
  })
};

export const NestedPopovers: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="padding-top: 100px;">
        <DialogTrigger type="popover" title="Outer popover">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <input />
          <input />
          <DialogTrigger type="popover" title="Inner popover">
            <template #trigger="{open}">
              <ActionButton @click="open">Trigger</ActionButton>
            </template>
            <p>Hi!</p>
          </DialogTrigger>
        </DialogTrigger>
      </div>
    `
  })
};

export const PopoverInsideScrollView: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="height: 100px; display: flex;">
        <div style="padding-top: 100px; height: 100px; overflow: auto;">
          <div style="height: 200px;">
            <DialogTrigger type="popover" title="Popover in scroll container">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <input />
              <input />
            </DialogTrigger>
          </div>
        </div>
        <div style="padding-top: 100px; height: 100px; overflow: auto; flex: 1;">
          <div style="height: 200px;">other</div>
        </div>
      </div>
    `
  }),
  parameters: {
    a11y: {
      config: {
        rules: [{id: 'scrollable-region-focusable', enabled: false}]
      }
    }
  }
};

export const ShouldFlipWithWidth: Story = {
  render: (args) => ({
    components: {ActionButton, DialogTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; width: calc(100vh - 100px); margin: 100px 0;">
        <DialogTrigger v-bind="args" type="popover" title="Popover width constrained">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <p>${DIALOG_BODY_TEXT}</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const CloseFunctionWithButtonPopover: Story = {
  render: () => ({
    components: {ActionButton, Button, DialogTrigger},
    setup() {
      let open = ref(false);
      return {
        open
      };
    },
    template: `
      <div style="display: grid; gap: 12px; margin: 40px 0; justify-items: start;">
        <ActionButton @click="open = true">Trigger</ActionButton>
        <DialogTrigger
          type="popover"
          title="The Heading"
          :open="open"
          @close="open = false">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.</p>
          <Button variant="secondary" @click="open = false">Cancel</Button>
        </DialogTrigger>
      </div>
    `
  })
};

export const TargetRef: Story = {
  render: (args) => ({
    components: {ActionButton, DialogTrigger},
    setup() {
      let targetRef = ref<HTMLElement | null>(null);
      return {args, targetRef};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <DialogTrigger v-bind="args" type="popover" title="TargetRef" :target-ref="targetRef">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <p>${DIALOG_BODY_TEXT}</p>
        </DialogTrigger>
        <span ref="targetRef" style="margin-inline-start: 200px;">Popover appears over here</span>
      </div>
    `
  })
};

export const _AlertDialog: Story = {
  render: () => ({
    components: {ActionButton, AlertDialog},
    setup() {
      let isOpen = ref(false);
      let closeDialog = () => {
        isOpen.value = false;
      };
      return {
        closeDialog,
        isOpen,
        onCancel: () => {
          action('cancel')();
          closeDialog();
        },
        onPrimary: () => {
          action('primary')();
          closeDialog();
        },
        onSecondary: () => {
          action('secondary')();
          closeDialog();
        }
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 100px 0;">
        <ActionButton @click="isOpen = true">Trigger</ActionButton>
        <AlertDialog
          title="Alert! Danger!"
          variant="error"
          :is-open="isOpen"
          primary-action-label="Accept"
          secondary-action-label="Whoa"
          cancel-label="Cancel"
          @close="closeDialog"
          @cancel="onCancel"
          @primary-action="onPrimary"
          @secondary-action="onSecondary">
          <p>${DIALOG_BODY_TEXT}</p>
        </AlertDialog>
      </div>
    `
  })
};

export const CrossoffsetExamples: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="display: grid; gap: 8px; align-items: flex-start;">
          <span>Left Top</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>-50</span>
            <DialogTrigger type="popover" placement="left top" :cross-offset="-50">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>0</span>
            <DialogTrigger type="popover" placement="left top">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>50</span>
            <DialogTrigger type="popover" placement="left top" :cross-offset="50">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
        </div>
        <div style="display: grid; gap: 8px; align-items: flex-start;">
          <span>Left</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>-50</span>
            <DialogTrigger type="popover" placement="left" :cross-offset="-50">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>0</span>
            <DialogTrigger type="popover" placement="left">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>50</span>
            <DialogTrigger type="popover" placement="left" :cross-offset="50">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
        </div>
        <div style="display: grid; gap: 8px; align-items: flex-start;">
          <span>Left Bottom</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>-50</span>
            <DialogTrigger type="popover" placement="left bottom" :cross-offset="-50">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>0</span>
            <DialogTrigger type="popover" placement="left bottom">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>50</span>
            <DialogTrigger type="popover" placement="left bottom" :cross-offset="50">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>${DIALOG_BODY_TEXT}</p>
            </DialogTrigger>
          </div>
        </div>
      </div>
    `
  })
};

export const TriggerVisibleThroughUnderlay: Story = {
  render: (args) => ({
    components: {ActionButton, DialogTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="position: absolute; top: 100px; left: 100px; display: grid; gap: 8px;">
        <div>
          action button shouldn't get any events if the underlay is up and you try to click it through the underlay
        </div>
        <DialogTrigger v-bind="args" is-dismissable title="Underlay visibility">
          <template #trigger="{open}">
            <ActionButton variant="primary" @click="open">Trigger</ActionButton>
          </template>
          <p>${DIALOG_BODY_TEXT}</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const _2Popovers: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="display: flex; gap: 16px;">
        <DialogTrigger type="popover" title="Popover one">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <p>${DIALOG_BODY_TEXT}</p>
        </DialogTrigger>
        <DialogTrigger type="popover" title="Popover two">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <p>Hi!</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const _AdjustableDialog: Story = {
  render: () => ({
    components: {ActionButton, Button, DialogTrigger},
    setup() {
      let showHero = ref(false);
      let showHeader = ref(false);
      let showTypeIcon = ref(false);
      let isDismissable = ref(false);
      let isOpen = ref(false);
      let showFooter = ref(false);
      let longTitle = ref(false);
      let longButtonLabels = ref(false);

      return {
        isDismissable,
        isOpen,
        longButtonLabels,
        longTitle,
        onCancel: () => {
          action('cancel')();
          isOpen.value = false;
        },
        onConfirm: () => {
          action('confirm')();
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        showHero,
        showFooter,
        showHeader,
        showTypeIcon
      };
    },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="display: grid; gap: 8px; width: 220px;">
          <label><input v-model="showHero" type="checkbox"> Show hero</label>
          <label><input v-model="longTitle" type="checkbox"> Toggle heading values</label>
          <label><input v-model="showHeader" type="checkbox"> Show header</label>
          <label><input v-model="showTypeIcon" type="checkbox"> Show type icon</label>
          <label><input v-model="isDismissable" type="checkbox"> Show dismissable</label>
          <label><input v-model="showFooter" type="checkbox"> Show footer</label>
          <label><input v-model="longButtonLabels" type="checkbox"> Show long button labels</label>
        </div>
        <DialogTrigger
          :open="isOpen"
          :is-dismissable="isDismissable"
          @open-change="isOpen = $event"
          :title="longTitle ? 'The Heading of Maximum Truth That is Really Long to Go On and On a a a a a Again and Wraps' : 'The Heading'">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template v-if="showHero" #hero>
            <img src="https://i.imgur.com/Z7AzH2c.png" alt="" style="width: 100%; object-fit: cover;" />
          </template>
          <template v-if="showHeader" #header>
            <div>This is a long header</div>
          </template>
          <template v-if="showTypeIcon" #typeIcon>
            <svg aria-label="Alert" class="spectrum-Icon spectrum-UIIcon-AlertMedium" viewBox="0 0 18 18">
              <path d="${ALERT_ICON_PATH}" />
            </svg>
          </template>
          <template #divider><hr /></template>
          <p>${DIALOG_BODY_TEXT}</p>
          <template v-if="showFooter" #footer>
            <label><input type="checkbox"> I have read and accept the terms of use and privacy policy</label>
          </template>
          <template #buttonGroup>
            <Button variant="secondary" @click="onCancel">Cancel {{longButtonLabels ? 'and close this dialog' : ''}}</Button>
            <Button variant="cta" @click="onConfirm">Confirm {{longButtonLabels ? 'and close this dialog' : ''}}</Button>
          </template>
        </DialogTrigger>
      </div>
    `
  })
};

export const WithTooltip: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, Button, DialogTrigger, TooltipTrigger},
    template: `
      <div style="display: flex; width: auto; margin: 100px 0;">
        <DialogTrigger is-dismissable title="Has tooltip">
          <template #trigger="{open}">
            <ActionButton @click="open">Trigger</ActionButton>
          </template>
          <template #divider><hr /></template>
          <p>Pressing escape when Tooltip is open closes Tooltip and not Dialog too.</p>
          <TooltipTrigger>
            <Button variant="cta">Has tooltip</Button>
            <template #tooltip>
              Press escape
            </template>
          </TooltipTrigger>
        </DialogTrigger>
      </div>
    `
  })
};

export const WithTooltipTrigger: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {ActionButton, Button, DialogTrigger, TooltipTrigger},
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <DialogTrigger title="DialogTrigger only">
          <template #trigger="{open}">
            <ActionButton @click="open">DialogTrigger only</ActionButton>
          </template>
          <p>Dialog content</p>
          <Button variant="cta">Close</Button>
        </DialogTrigger>

        <TooltipTrigger>
          <ActionButton>TooltipTrigger only</ActionButton>
          <template #tooltip>This is a tooltip</template>
        </TooltipTrigger>

        <TooltipTrigger>
          <ActionButton :is-disabled="true">TooltipTrigger only</ActionButton>
          <template #tooltip>This is a tooltip</template>
        </TooltipTrigger>

        <DialogTrigger title="DialogTrigger + TooltipTrigger">
          <template #trigger="{open}">
            <span @click="open">
              <TooltipTrigger>
                <ActionButton>DialogTrigger + TooltipTrigger</ActionButton>
                <template #tooltip>This is a tooltip</template>
              </TooltipTrigger>
            </span>
          </template>
          <p>Dialog content</p>
          <Button variant="cta">Close</Button>
        </DialogTrigger>

        <DialogTrigger title="DialogTrigger + TooltipTrigger">
          <template #trigger="{open}">
            <span @click="open">
              <TooltipTrigger>
                <ActionButton :is-disabled="true">DialogTrigger + TooltipTrigger</ActionButton>
                <template #tooltip>This is a tooltip</template>
              </TooltipTrigger>
            </span>
          </template>
          <p>Dialog content</p>
          <Button variant="cta">Close</Button>
        </DialogTrigger>

      </div>
    `
  })
};

export const WithTranslations: Story = {
  render: () => ({
    components: {ActionButton, Button, DialogTrigger},
    setup() {
      let isOpen = ref(false);
      let strings = useLocalizedStringFormatter(intlMessages as Record<string, Record<string, string>>);
      return {
        isOpen,
        onCancel: () => {
          action('cancel')();
          isOpen.value = false;
        },
        onConfirm: () => {
          action('confirm')();
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        strings
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 100px 0;">
        <DialogTrigger :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">{{strings.format('koji')}}</ActionButton>
          </template>
          <template #heading><h2>{{strings.format('kojiFoods')}}</h2></template>
          <template #header><div>{{strings.format('foodsMakeWithKoji')}}</div></template>
          <template #divider><hr /></template>
          <p>{{strings.format('soySauce')}}: {{strings.format('soySauceDescription')}}</p>
          <p>{{strings.format('miso')}}: {{strings.format('misoDescription')}}</p>
          <p>{{strings.format('amazake')}}: {{strings.format('amazakeDescription')}}</p>
          <template #buttonGroup>
            <Button variant="secondary" @click="onCancel">{{strings.format('cancel')}}</Button>
            <Button variant="cta" @click="onConfirm">{{strings.format('confirm')}}</Button>
          </template>
        </DialogTrigger>
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'Translations included for: Arabic, English, Hebrew, Japanese, Korean, Simplified Chinese, and Traditional Chinese.'
    }
  }
};

export const TriggersOnEdges: Story = {
  render: () => ({
    components: {ActionButton, DialogTrigger},
    setup() {
      return {
        bottomItems: [
          {content: 'Placement End', placement: 'end'},
          {content: 'Placement End Bottom', placement: 'end bottom'},
          {content: 'Placement End Top', placement: 'end top'},
          {content: 'Placement Start', placement: 'start'},
          {content: 'Placement Start Bottom', placement: 'start bottom'},
          {content: 'Placement Start top', placement: 'start top'},
          {content: 'Placement top', placement: 'top'},
          {content: 'No Placement (default is bottom)'}
        ],
        endItems: [
          {content: 'Placement Top', placement: 'top', triggerLabel: 'T'},
          {content: 'Placement Top End', placement: 'top end', triggerLabel: 'T'},
          {content: 'Placement Top Start', placement: 'top start', triggerLabel: 'T'},
          {content: 'Placement Bottom', placement: 'bottom', triggerLabel: 'T'},
          {content: 'Placement Bottom End', placement: 'bottom end', triggerLabel: 'T'},
          {content: 'Placement Bottom Start', placement: 'bottom start', triggerLabel: 'T'},
          {content: 'Placement Start', placement: 'start', triggerLabel: 'T'},
          {content: 'No Placement (default is bottom)', triggerLabel: 'Trigger'}
        ],
        startItems: [
          {content: 'Placement Top', placement: 'top', triggerLabel: 'T'},
          {content: 'Placement Top Start', placement: 'top start', triggerLabel: 'T'},
          {content: 'Placement Top End', placement: 'top end', triggerLabel: 'T'},
          {content: 'Placement Bottom', placement: 'bottom', triggerLabel: 'T'},
          {content: 'Placement Bottom Start', placement: 'bottom start', triggerLabel: 'T'},
          {content: 'Placement Bottom End', placement: 'bottom end', triggerLabel: 'T'},
          {content: 'Placement End', placement: 'end', triggerLabel: 'T'},
          {content: 'No Placement (default is bottom)', triggerLabel: 'Trigger'}
        ],
        topItems: [
          {content: 'Placement Start', placement: 'end'},
          {content: 'Placement End Top', placement: 'end top'},
          {content: 'Placement End Bottom', placement: 'end bottom'},
          {content: 'Placement End', placement: 'start'},
          {content: 'Placement Start Top', placement: 'start top'},
          {content: 'Placement Start Bottom', placement: 'start bottom'},
          {content: 'Placement Bottom', placement: 'bottom'},
          {content: 'No Placement (default is bottom)'}
        ]
      };
    },
    template: `
      <div style="width: 100%; overflow: auto;">
        <div style="display: grid; grid-template-areas: 'top top' 'start end' 'bottom bottom'; grid-template-columns: auto auto; grid-template-rows: 72px auto 72px; min-height: 1600px; width: calc(100vw + 100px); margin: 20px 0; gap: 8px;">
          <div style="grid-area: top; justify-self: center;">
            <DialogTrigger
              v-for="(item, index) in topItems"
              :key="'top-' + index"
              type="popover"
              :placement="item.placement"
              :should-flip="false"
              title="Placement">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>{{item.content}}</p>
            </DialogTrigger>
          </div>

          <div style="grid-area: start; justify-self: start; align-self: center; padding-inline-start: 20px;">
            <template v-for="(item, index) in startItems" :key="'start-' + index">
              <DialogTrigger
                type="popover"
                :placement="item.placement"
                :should-flip="false"
                title="Placement">
                <template #trigger="{open}">
                  <ActionButton @click="open">{{item.triggerLabel}}</ActionButton>
                </template>
                <p>{{item.content}}</p>
              </DialogTrigger>
              <br />
            </template>
          </div>

          <div style="grid-area: end; justify-self: end; align-self: center; padding-inline-end: 20px;">
            <template v-for="(item, index) in endItems" :key="'end-' + index">
              <DialogTrigger
                type="popover"
                :placement="item.placement"
                :should-flip="false"
                title="Placement">
                <template #trigger="{open}">
                  <ActionButton @click="open">{{item.triggerLabel}}</ActionButton>
                </template>
                <p>{{item.content}}</p>
              </DialogTrigger>
              <br />
            </template>
          </div>

          <div style="grid-area: bottom; justify-self: center;">
            <DialogTrigger
              v-for="(item, index) in bottomItems"
              :key="'bottom-' + index"
              type="popover"
              :placement="item.placement"
              :should-flip="false"
              title="Placement">
              <template #trigger="{open}">
                <ActionButton @click="open">Trigger</ActionButton>
              </template>
              <p>{{item.content}}</p>
            </DialogTrigger>
          </div>
        </div>
      </div>
    `
  })
};
