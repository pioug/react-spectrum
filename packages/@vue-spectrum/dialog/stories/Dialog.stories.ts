import {Button} from '@vue-spectrum/button';
import {Checkbox} from '@vue-spectrum/checkbox';
import {Dialog} from '../src';
import {TextField} from '@vue-spectrum/textfield';
import {action} from '@storybook/addon-actions';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type DialogRenderOptions = {
  buttons?: 'none' | 'three' | 'three-footer' | 'three-vertical' | 'two',
  content?: 'default' | 'form' | 'horizontal' | 'iframe' | 'long',
  footer?: boolean,
  hero?: boolean,
  isDismissable?: boolean,
  size?: 'L' | 'M' | 'S',
  type?: 'fullscreenTakeover' | 'modal',
  withContentDivider?: boolean
};

const LONG_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Eleifend quam adipiscing vitae proin sagittis nisl. Diam donec adipiscing tristique risus. In fermentum posuere urna nec tincidunt.',
  'Risus ultricies tristique nulla aliquet enim tortor at. Ac placerat vestibulum lectus mauris. Sed viverra tellus in hac habitasse.',
  'Ut porttitor leo a diam sollicitudin tempor id eu nisl. Tristique senectus et netus et malesuada fames ac turpis egestas.'
];

const meta: Meta<typeof Dialog> = {
  title: 'Dialog',
  component: Dialog,
  excludeStories: ['singleParagraph'],
  argTypes: {
    dismissable: {control: 'boolean'},
    isDismissable: {control: 'boolean'},
    isHidden: {control: 'boolean'},
    isOpen: {control: 'boolean'},
    onDismiss: {
      table: {
        disable: true
      }
    },
    open: {control: 'boolean'},
    role: {control: 'text'},
    size: {
      control: 'select',
      options: ['S', 'M', 'L']
    },
    title: {control: 'text'},
    type: {
      control: 'select',
      options: ['modal', 'fullscreenTakeover']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export function singleParagraph() {
  return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem.';
}

function renderDialog(args: StoryArgs = {}, options: DialogRenderOptions = {}) {
  let mergedArgs: StoryArgs = {
    isDismissable: false,
    ...args
  };

  if (options.isDismissable !== undefined) {
    mergedArgs.isDismissable = options.isDismissable;
  }
  if (options.size) {
    mergedArgs.size = options.size;
  }
  if (options.type) {
    mergedArgs.type = options.type;
  }

  let buttons = options.buttons ?? ((mergedArgs.isDismissable as boolean) ? 'none' : 'two');
  let contentType = options.content ?? 'default';
  let wrapperStyle = contentType === 'horizontal'
    ? 'display: flex; width: 420px; margin: 100px 0; overflow-x: auto;'
    : 'display: flex; width: auto; margin: 100px 0;';

  return {
    components: {Button, Checkbox, Dialog, TextField},
    setup() {
      return {
        dialogArgs: mergedArgs,
        longParagraphs: LONG_PARAGRAPHS,
        onButtonPress: action('buttonPress'),
        onDialogClose: action('dialogClose'),
        singleParagraphText: singleParagraph(),
        options: {
          ...options,
          buttons,
          contentType,
          wrapperStyle
        }
      };
    },
    template: `
      <div :style="options.wrapperStyle">
        <Dialog v-bind="dialogArgs" @close="onDialogClose()">
          <template #heading>
            <h2>The Heading</h2>
          </template>
          <template #header>
            <div>The Header</div>
          </template>
          <template #divider>
            <hr />
          </template>

          <img
            v-if="options.hero"
            src="https://i.imgur.com/Z7AzH2c.png"
            alt=""
            style="width: 100%; object-fit: cover; border-radius: 6px;" />

          <div v-if="options.contentType === 'iframe'">
            <iframe width="100%" title="wikipedia" src="https://wikipedia.org/wiki/Main_Page" />
          </div>

          <div v-else-if="options.contentType === 'form'" style="display: grid; gap: 12px;">
            <TextField label="Last Words" />
            <Checkbox>Acknowledge robot overlords</Checkbox>
            <TextField label="Additional context" />
            <div>Preferred Job: Battery / Information Storage / Processor</div>
          </div>

          <div v-else-if="options.contentType === 'long'" style="display: grid; gap: 12px;">
            <TextField label="Top textfield" />
            <p v-for="paragraph in longParagraphs" :key="paragraph">{{paragraph}}</p>
            <TextField label="Bottom textfield" />
          </div>

          <div v-else-if="options.contentType === 'horizontal'" style="width: 1200px; white-space: nowrap;">
            Horizontal scrolling dialog content preview with intentionally long line to force overflow.
          </div>

          <div v-else>
            {{singleParagraphText}}
            <hr v-if="options.withContentDivider" />
            <div v-if="options.withContentDivider">Additional cleared content area.</div>
          </div>

          <template v-if="options.footer" #footer>
            <Checkbox>I accept</Checkbox>
          </template>

          <template v-if="options.buttons !== 'none'" #buttonGroup>
            <div :style="options.buttons === 'three-vertical' ? 'display: grid; gap: 8px;' : 'display: flex; gap: 8px; flex-wrap: wrap;'">
              <Button v-if="options.buttons === 'two'" variant="secondary" @press="onButtonPress('Cancel')">Cancel</Button>
              <Button v-if="options.buttons === 'two'" variant="primary" @press="onButtonPress('Confirm')">Confirm</Button>
              <Button v-if="options.buttons !== 'two'" variant="secondary" @press="onButtonPress('Secondary')">Secondary</Button>
              <Button v-if="options.buttons !== 'two'" variant="primary" @press="onButtonPress('Primary')">Primary</Button>
              <Button v-if="options.buttons !== 'two'" variant="primary" @press="onButtonPress('CTA')">CTA</Button>
            </div>
          </template>
        </Dialog>
      </div>
    `
  };
}

function renderThreeButtonsFooter(args: StoryArgs = {}) {
  return {
    components: {Button, Dialog},
    setup() {
      let selectedAction = ref('CTA');
      return {
        dialogArgs: {isDismissable: false, ...args},
        singleParagraphText: singleParagraph(),
        selectedAction
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 100px 0;">
        <Dialog v-bind="dialogArgs">
          <template #heading><h2>The Heading</h2></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>
          <div>{{singleParagraphText}}</div>
          <template #footer>
            <div>Selected action: {{selectedAction}}</div>
          </template>
          <template #buttonGroup>
            <div style="display: flex; gap: 8px;">
              <Button variant="secondary" @press="selectedAction = 'Secondary'">Secondary</Button>
              <Button variant="primary" @press="selectedAction = 'Primary'">Primary</Button>
              <Button variant="primary" @press="selectedAction = 'CTA'">CTA</Button>
            </div>
          </template>
        </Dialog>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDialog(args),
  name: 'default'
};

export const IsDismissable: Story = {
  render: (args) => renderDialog(args, {isDismissable: true, buttons: 'none'}),
  name: 'isDismissable'
};

export const LongContent: Story = {
  render: (args) => renderDialog(args, {content: 'long'}),
  name: 'long content'
};

export const WithHero: Story = {
  render: (args) => renderDialog(args, {hero: true}),
  name: 'with hero'
};

export const WithHeroIsDimissable: Story = {
  render: (args) => renderDialog(args, {hero: true, isDismissable: true, buttons: 'none'}),
  name: 'with hero, isDimissable'
};

export const WithFooter: Story = {
  render: (args) => renderDialog(args, {footer: true}),
  name: 'with footer'
};

export const Small: Story = {
  render: (args) => renderDialog(args, {size: 'S'}),
  name: 'small'
};

export const Medium: Story = {
  render: (args) => renderDialog(args, {size: 'M'}),
  name: 'medium'
};

export const Large: Story = {
  render: (args) => renderDialog(args, {size: 'L'}),
  name: 'large'
};

export const _Form: Story = {
  render: (args) => renderDialog(args, {content: 'form'}),
  name: 'form'
};

export const FullscreenTakeoverForm: Story = {
  render: (args) => renderDialog(args, {content: 'form', type: 'fullscreenTakeover'}),
  name: 'fullscreenTakeover form'
};

export const ThreeButtons: Story = {
  render: (args) => renderDialog(args, {buttons: 'three'}),
  name: 'three buttons'
};

export const ThreeButtonsVerticalOrientation: Story = {
  render: (args) => renderDialog(args, {buttons: 'three-vertical'}),
  name: 'three buttons, vertical orientation'
};

export const ThreeButtonsFooter: Story = {
  render: (args) => renderThreeButtonsFooter(args),
  name: 'three buttons, footer'
};

export const ClearedContent: Story = {
  render: (args) => renderDialog(args, {withContentDivider: true}),
  name: 'cleared content'
};

export const WithIframe: Story = {
  render: (args) => renderDialog(args, {content: 'iframe'}),
  name: 'with iframe'
};

export const HorizontalScrolling: Story = {
  render: (args) => renderDialog(args, {content: 'horizontal'})
};
