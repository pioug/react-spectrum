import {ActionButton, Button} from '@vue-spectrum/button';
import {AlertDialog, DialogTrigger} from '../src';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof DialogTrigger> = {
  title: 'DialogTrigger',
  component: DialogTrigger,
  args: {
    title: 'Example dialog',
    type: 'modal'
  },
  argTypes: {
    dismissable: {
      control: 'boolean'
    },
    isDismissable: {
      control: 'boolean'
    },
    isHidden: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    onDismiss: {
      table: {
        disable: true
      }
    },
    open: {
      control: 'boolean'
    },
    role: {
      control: 'text'
    },
    size: {
      control: 'select',
      options: [
        'S',
        'M',
        'L',
        'fullscreen',
        'fullscreenTakeover'
      ]
    },
    title: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: [
        'modal',
        'popover',
        'tray',
        'fullscreen',
        'fullscreenTakeover'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDialog(args: StoryArgs, content = 'Dialog content') {
  return {
    components: {DialogTrigger},
    setup() {
      return {args, content};
    },
    template: `
      <DialogTrigger v-bind="args">
        <p>{{content}}</p>
      </DialogTrigger>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDialog(args, 'Dialog content')
};

export const TypePopover: Story = {
  ...Default,
  args: {
    type: 'popover',
    size: 'S'
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
  render: (args) => renderDialog(args, 'mobileType="fullscreen" parity scenario'),
  args: {
    type: 'modal'
  }
};

export const MobileTypeFullscreenTakeover: Story = {
  render: (args) => renderDialog(args, 'mobileType="fullscreenTakeover" parity scenario'),
  args: {
    type: 'modal'
  }
};

export const PopoverWithMobileTypeModal: Story = {
  render: (args) => renderDialog(args, 'popover with mobileType="modal" parity scenario'),
  args: {
    type: 'popover'
  }
};

export const PopoverWithMobileTypeTray: Story = {
  render: (args) => renderDialog(args, 'popover with mobileType="tray" parity scenario'),
  args: {
    type: 'popover'
  }
};

export const NestedModals: Story = {
  render: () => ({
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="display: grid; gap: 12px; padding-top: 40px;">
        <input aria-label="test input" />
        <DialogTrigger type="modal" is-dismissable title="Outer dialog">
          <p>Outer dialog content</p>
          <ActionButton variant="secondary">Trigger nested dialog</ActionButton>
          <DialogTrigger type="modal" is-dismissable title="Nested dialog">
            <p>Nested dialog content</p>
          </DialogTrigger>
        </DialogTrigger>
      </div>
    `
  })
};

export const NestedModalsFullscreentakeover: Story = {
  render: () => ({
    components: {ActionButton, DialogTrigger},
    template: `
      <DialogTrigger type="fullscreenTakeover" title="The Heading">
        <p>Fullscreen takeover content</p>
        <ActionButton variant="secondary">Trigger nested dialog</ActionButton>
        <DialogTrigger type="modal" is-dismissable title="Nested dialog">
          <p>Nested dialog in fullscreen takeover.</p>
        </DialogTrigger>
      </DialogTrigger>
    `
  })
};

export const WithMenuTrigger: Story = {
  render: () => ({
    components: {DialogTrigger},
    template: `
      <DialogTrigger type="popover" title="The Heading">
        <p>Menu trigger content</p>
        <ul style="margin: 0; padding-left: 18px;">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </DialogTrigger>
    `
  })
};

export const NestedPopovers: Story = {
  render: () => ({
    components: {ActionButton, DialogTrigger},
    template: `
      <div style="padding-top: 40px;">
        <DialogTrigger type="popover" title="Outer popover">
          <p>Outer popover content</p>
          <ActionButton variant="secondary">Trigger nested popover</ActionButton>
          <DialogTrigger type="popover" title="Inner popover">
            <p>Hi!</p>
          </DialogTrigger>
        </DialogTrigger>
      </div>
    `
  })
};

export const PopoverInsideScrollView: Story = {
  render: () => ({
    components: {DialogTrigger},
    template: `
      <div style="height: 140px; display: flex; gap: 16px;">
        <div style="padding-top: 80px; height: 140px; overflow: auto;">
          <div style="height: 220px;">
            <DialogTrigger type="popover" title="Popover in scroll container">
              <p>Scrollable dialog content</p>
            </DialogTrigger>
          </div>
        </div>
        <div style="padding-top: 80px; height: 140px; overflow: auto; flex: 1;">
          <div style="height: 220px;">other</div>
        </div>
      </div>
    `
  })
};

export const ShouldFlipWithWidth: Story = {
  render: (args) => ({
    components: {DialogTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; width: calc(100vh - 100px); margin: 40px 0;">
        <DialogTrigger v-bind="args" type="popover" title="Popover width scenario">
          <p>shouldFlip with width parity scenario</p>
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
          <p>Close function with button parity scenario.</p>
          <Button variant="secondary" @click="open = false">Cancel</Button>
        </DialogTrigger>
      </div>
    `
  })
};

export const TargetRef: Story = {
  render: (args) => ({
    components: {DialogTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <DialogTrigger v-bind="args" type="popover" title="TargetRef parity">
          <p>Popover target parity scenario.</p>
        </DialogTrigger>
        <span style="margin-inline-start: 200px;">Popover appears over here</span>
      </div>
    `
  })
};

export const _AlertDialog: Story = {
  render: () => ({
    components: {AlertDialog},
    template: `
      <AlertDialog
        title="Alert! Danger!"
        variant="error"
        primary-action-label="Accept"
        secondary-action-label="Whoa"
        cancel-label="Cancel">
        Fine! No, absolutely fine. It's not like this place is about to explode.
      </AlertDialog>
    `
  })
};

export const CrossoffsetExamples: Story = {
  render: () => ({
    components: {DialogTrigger},
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="display: grid; gap: 8px;">
          <span>Left Top</span>
          <DialogTrigger type="popover" title="crossOffset -50"><p>-50</p></DialogTrigger>
          <DialogTrigger type="popover" title="crossOffset 0"><p>0</p></DialogTrigger>
          <DialogTrigger type="popover" title="crossOffset 50"><p>50</p></DialogTrigger>
        </div>
        <div style="display: grid; gap: 8px;">
          <span>Left</span>
          <DialogTrigger type="popover" title="crossOffset -50"><p>-50</p></DialogTrigger>
          <DialogTrigger type="popover" title="crossOffset 0"><p>0</p></DialogTrigger>
          <DialogTrigger type="popover" title="crossOffset 50"><p>50</p></DialogTrigger>
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
          action button should not get events through underlay.
        </div>
        <ActionButton variant="primary">Trigger</ActionButton>
        <DialogTrigger v-bind="args" is-dismissable title="Underlay scenario">
          <p>trigger visible through underlay parity scenario</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const _2Popovers: Story = {
  render: () => ({
    components: {DialogTrigger},
    template: `
      <div style="display: flex; gap: 16px;">
        <DialogTrigger type="popover" title="Popover one">
          <p>Popover one content</p>
        </DialogTrigger>
        <DialogTrigger type="popover" title="Popover two">
          <p>Hi!</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const _AdjustableDialog: Story = {
  render: () => ({
    components: {DialogTrigger},
    setup() {
      let showHeader = ref(false);
      let showTypeIcon = ref(false);
      let isDismissable = ref(false);
      let showFooter = ref(false);
      let longTitle = ref(false);

      return {
        isDismissable,
        longTitle,
        showFooter,
        showHeader,
        showTypeIcon
      };
    },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="display: grid; gap: 8px; width: 220px;">
          <label><input v-model="longTitle" type="checkbox"> Toggle heading values</label>
          <label><input v-model="showHeader" type="checkbox"> Show header</label>
          <label><input v-model="showTypeIcon" type="checkbox"> Show type icon</label>
          <label><input v-model="isDismissable" type="checkbox"> Show dismissable</label>
          <label><input v-model="showFooter" type="checkbox"> Show footer</label>
        </div>
        <DialogTrigger
          :is-dismissable="isDismissable"
          :title="longTitle ? 'The Heading of Maximum Truth That is Really Long to Go On and On' : 'The Heading'">
          <template v-if="showHeader" #header>
            <div>This is a long header</div>
          </template>
          <template v-if="showTypeIcon" #typeIcon>
            <span aria-label="Alert">!</span>
          </template>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <template v-if="showFooter" #footer>
            <label><input type="checkbox"> I have read and accept the terms.</label>
          </template>
        </DialogTrigger>
      </div>
    `
  })
};

export const WithTooltip: Story = {
  render: () => ({
    components: {Button, DialogTrigger, TooltipTrigger},
    template: `
      <div style="display: flex; width: auto; margin: 40px 0;">
        <DialogTrigger is-dismissable title="Has tooltip">
          <p>Pressing escape when tooltip is open should close tooltip first.</p>
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
    components: {ActionButton, Button, DialogTrigger, TooltipTrigger},
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <DialogTrigger title="DialogTrigger only">
          <p>Dialog content</p>
          <Button variant="cta">Close</Button>
        </DialogTrigger>

        <TooltipTrigger>
          <ActionButton>TooltipTrigger only</ActionButton>
          <template #tooltip>This is a tooltip</template>
        </TooltipTrigger>

        <DialogTrigger title="DialogTrigger + TooltipTrigger">
          <TooltipTrigger>
            <ActionButton>DialogTrigger + TooltipTrigger</ActionButton>
            <template #tooltip>This is a tooltip</template>
          </TooltipTrigger>
          <p>Dialog content</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const WithTranslations: Story = {
  render: () => ({
    components: {DialogTrigger},
    setup() {
      return {
        locales: [
          {label: 'English', text: 'Confirm'},
          {label: 'Arabic', text: 'تأكيد'},
          {label: 'Hebrew', text: 'אישור'},
          {label: 'Japanese', text: '確認'},
          {label: 'Korean', text: '확인'},
          {label: 'Simplified Chinese', text: '确认'},
          {label: 'Traditional Chinese', text: '確認'}
        ]
      };
    },
    template: `
      <div style="display: grid; gap: 10px;">
        <DialogTrigger
          v-for="locale in locales"
          :key="locale.label"
          title="Translations">
          <p>{{locale.label}}: {{locale.text}}</p>
        </DialogTrigger>
      </div>
    `
  })
};

export const TriggersOnEdges: Story = {
  render: () => ({
    components: {DialogTrigger},
    setup() {
      return {
        placements: [
          'top',
          'top start',
          'top end',
          'bottom',
          'bottom start',
          'bottom end',
          'start',
          'start top',
          'start bottom',
          'end',
          'end top',
          'end bottom'
        ]
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div style="display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 8px;">
          <DialogTrigger
            v-for="placement in placements"
            :key="placement"
            type="popover"
            title="Placement scenario">
            <p>Placement {{placement}}</p>
          </DialogTrigger>
        </div>
      </div>
    `
  })
};
