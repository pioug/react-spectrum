import {ActionButton, Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Checkbox} from '@vue-spectrum/checkbox';
import {Heading} from '@vue-spectrum/text';
import {DialogTrigger} from '../src';
import {Divider} from '@vue-spectrum/divider';
import {Form} from '@vue-spectrum/form';
import {Picker} from '@vue-spectrum/picker';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {TextField} from '@vue-spectrum/textfield';
import {action} from 'storybook/actions';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

type RenderProps = {
  isDismissable?: boolean,
  size?: 'L' | 'M' | 'S',
  type?: 'fullscreenTakeover' | 'modal',
  width?: string
} & StoryArgs;

const FIVE_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Sed enim ut sem viverra aliquet eget sit amet tellus. Diam quis enim lobortis scelerisque fermentum dui faucibus in ornare. Diam quam nulla porttitor massa id. Eleifend mi in nulla posuere sollicitudin. Turpis nunc eget lorem dolor sed viverra ipsum nunc. Faucibus in ornare quam viverra. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Nam libero justo laoreet sit amet cursus sit. Netus et malesuada fames ac. Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Eros donec ac odio tempor orci. Ut etiam sit amet nisl purus in mollis nunc. Nisl rhoncus mattis rhoncus urna neque viverra. Convallis aenean et tortor at risus. Diam phasellus vestibulum lorem sed risus ultricies.',
  'Eleifend quam adipiscing vitae proin sagittis nisl. Diam donec adipiscing tristique risus. In fermentum posuere urna nec tincidunt praesent semper. Suspendisse in est ante in. Egestas diam in arcu cursus euismod quis viverra nibh cras. Aliquam sem fringilla ut morbi tincidunt augue interdum. Lacus sed turpis tincidunt id aliquet risus feugiat. Praesent semper feugiat nibh sed pulvinar proin. In massa tempor nec feugiat nisl pretium fusce id velit. Non nisi est sit amet facilisis. Mi in nulla posuere sollicitudin aliquam ultrices. Morbi leo urna molestie at elementum. Laoreet non curabitur gravida arcu ac tortor dignissim convallis. Risus quis varius quam quisque id. Platea dictumst quisque sagittis purus. Etiam non quam lacus suspendisse faucibus interdum posuere. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus.',
  'Risus ultricies tristique nulla aliquet enim tortor at. Ac placerat vestibulum lectus mauris. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Sit amet nulla facilisi morbi tempus iaculis urna. Ut etiam sit amet nisl purus in. Risus at ultrices mi tempus imperdiet. Magna fermentum iaculis eu non diam phasellus. Orci sagittis eu volutpat odio. Volutpat blandit aliquam etiam erat velit scelerisque in dictum non. Amet nulla facilisi morbi tempus iaculis urna id. Iaculis eu non diam phasellus. Eu lobortis elementum nibh tellus molestie nunc. At tempor commodo ullamcorper a lacus vestibulum sed. Mi sit amet mauris commodo quis. Tellus elementum sagittis vitae et leo duis. Vel risus commodo viverra maecenas accumsan lacus.',
  'Ut porttitor leo a diam sollicitudin tempor id eu nisl. Tristique senectus et netus et malesuada fames ac turpis egestas. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Integer feugiat scelerisque varius morbi enim nunc faucibus a. Tempus quam pellentesque nec nam aliquam sem et. Quam viverra orci sagittis eu volutpat odio facilisis mauris. Nunc lobortis mattis aliquam faucibus purus in massa tempor. Tincidunt dui ut ornare lectus sit amet est. Magna fermentum iaculis eu non. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Vitae aliquet nec ullamcorper sit amet risus nullam eget felis. Vitae proin sagittis nisl rhoncus mattis rhoncus. Nunc vel risus commodo viverra maecenas. Diam in arcu cursus euismod. Dolor morbi non arcu risus quis varius quam. Amet nisl suscipit adipiscing bibendum. Nulla pellentesque dignissim enim sit amet venenatis. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit.',
  'Cras semper auctor neque vitae tempus quam pellentesque nec. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere. Pellentesque habitant morbi tristique senectus et. Ipsum dolor sit amet consectetur adipiscing elit pellentesque. Sem et tortor consequat id porta nibh venenatis. Viverra nibh cras pulvinar mattis nunc sed blandit. Urna porttitor rhoncus dolor purus. Vivamus arcu felis bibendum ut. Cras sed felis eget velit aliquet. Sed tempus urna et pharetra pharetra. Viverra adipiscing at in tellus integer feugiat scelerisque varius morbi. Ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Ultrices neque ornare aenean euismod elementum nisi quis eleifend quam. Vel turpis nunc eget lorem. Quisque egestas diam in arcu cursus euismod quis viverra. At tempor commodo ullamcorper a lacus vestibulum sed. Id aliquet lectus proin nibh nisl condimentum id venenatis. Quis viverra nibh cras pulvinar. Purus in mollis nunc sed.'
];

const PICKER_ITEMS = [
  {id: 'Aardvark', label: 'Aardvark'},
  {id: 'Kangaroo', label: 'Kangaroo'},
  {id: 'Snake', label: 'Snake'}
];

const JOB_ITEMS = [
  {value: 'battery', label: 'Battery'},
  {value: 'storage', label: 'Information Storage'},
  {value: 'processor', label: 'Processor'},
  {value: 'zoo', label: 'Zoo stock'},
  {value: 'translator', label: 'Emotional Translator'},
  {value: 'hunter', label: 'Bounty Hunter'},
  {value: 'actor', label: 'Actor'},
  {value: 'tester', label: 'Waterslide Tester'},
  {value: 'psychiatrist', label: 'Psychiatrist'}
];

const meta: Meta<typeof DialogTrigger> = {
  title: 'Dialog',
  component: DialogTrigger,
  providerSwitcher: {status: 'notice'},
  excludeStories: ['singleParagraph']
};

export default meta;

type Story = StoryObj<typeof meta>;

export function singleParagraph() {
  return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.';
}

function renderBaseDialog(props: RenderProps = {}, options: {
  footer?: boolean,
  hero?: boolean,
  verticalButtons?: boolean,
  withThreeButtons?: boolean
} = {}) {
  let {width = 'auto', isDismissable, ...otherProps} = props;
  let dialogArgs: StoryArgs = {...otherProps};
  if (isDismissable !== undefined) {
    dialogArgs.isDismissable = isDismissable;
  }

  return {
    components: {ActionButton, Button, ButtonGroup, Checkbox, DialogTrigger, Heading},
    setup() {
      let isOpen = ref(true);
      return {
        dialogArgs,
        isOpen,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        onDialogClose: () => {
          action('dialogClose')();
          isOpen.value = false;
        },
        options,
        openDialog: () => {
          isOpen.value = true;
        },
        singleParagraphText: singleParagraph(),
        width
      };
    },
    template: `
      <div :style="{display: 'flex', width, margin: '100px 0'}">
        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @close="onDialogClose" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>

          <template v-if="options.hero" #hero>
            <img src="https://i.imgur.com/Z7AzH2c.png" alt="" style="width: 100%; object-fit: cover;" />
          </template>

          <template #heading>
            <Heading>The Heading</Heading>
          </template>
          <template #header>
            <div>The Header</div>
          </template>
          <template #divider>
            <hr />
          </template>

          <div>{{singleParagraphText}}</div>

          <template v-if="options.footer" #footer>
            <Checkbox>I accept</Checkbox>
          </template>

          <template v-if="!Boolean(dialogArgs.isDismissable)" #buttonGroup>
            <ButtonGroup :orientation="options.verticalButtons ? 'vertical' : 'horizontal'">
              <Button v-if="!options.withThreeButtons" variant="secondary" @click="onDialogButtonPress('Cancel')">Cancel</Button>
              <Button v-if="!options.withThreeButtons" variant="cta" @click="onDialogButtonPress('Confirm')">Confirm</Button>

              <Button v-if="options.withThreeButtons" variant="secondary" @click="onDialogButtonPress('Secondary')">Secondary</Button>
              <Button v-if="options.withThreeButtons" variant="primary" @click="onDialogButtonPress('Primary')">Primary</Button>
              <Button v-if="options.withThreeButtons" variant="cta" @click="onDialogButtonPress('CTA')">CTA</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>
      </div>
    `
  };
}

function renderIframe(props: RenderProps = {}) {
  let {width = 'auto', isDismissable, ...otherProps} = props;
  let dialogArgs: StoryArgs = {...otherProps};
  if (isDismissable !== undefined) {
    dialogArgs.isDismissable = isDismissable;
  }

  return {
    components: {ActionButton, Button, ButtonGroup, DialogTrigger, Heading},
    setup() {
      let isOpen = ref(true);
      return {
        dialogArgs,
        isOpen,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        width
      };
    },
    template: `
      <div :style="{display: 'flex', width, margin: '100px 0'}">
        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template #heading><Heading>The Heading</Heading></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>

          <div>
            <iframe width="100%" title="wikipedia" src="https://wikipedia.org/wiki/Main_Page" />
          </div>

          <template v-if="!Boolean(dialogArgs.isDismissable)" #buttonGroup>
            <ButtonGroup>
              <Button variant="secondary" @click="onDialogButtonPress('Cancel')">Cancel</Button>
              <Button variant="cta" @click="onDialogButtonPress('Confirm')">Confirm</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>
      </div>
    `
  };
}

function renderWithForm(props: RenderProps = {}) {
  let {width = 'auto', ...dialogArgs} = props;

  return {
    components: {
      ActionButton,
      Button,
      ButtonGroup,
      Checkbox,
      DialogTrigger,
      Form,
      Picker,
      Radio,
      RadioGroup,
      TextField,
      Heading
    },
    setup() {
      let isOpen = ref(true);
      return {
        dialogArgs,
        isOpen,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        pickerItems: PICKER_ITEMS,
        jobs: JOB_ITEMS,
        width
      };
    },
    template: `
      <div :style="{display: 'flex', width, margin: '100px 0'}">
        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template #heading><Heading>The Heading</Heading></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>

          <Form>
            <TextField label="Last Words" auto-focus />
            <Checkbox>Acknowledge robot overlords</Checkbox>
            <Picker aria-label="Animals" :items="pickerItems" is-disabled />
            <Button variant="primary" UNSAFE_style="display: none;">Hidden</Button>
            <Button variant="primary" UNSAFE_style="visibility: hidden; position: absolute;">Hidden</Button>
            <RadioGroup label="Preferred Job" name="jobs">
              <Radio v-for="job in jobs" :key="job.value" :value="job.value">{{job.label}}</Radio>
            </RadioGroup>
          </Form>

          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="secondary" @click="onDialogButtonPress('Cancel')">Cancel</Button>
              <Button variant="cta" @click="onDialogButtonPress('Confirm')">Confirm</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>
      </div>
    `
  };
}

function renderThreeButtonsFooter(props: RenderProps = {}) {
  let {width = 'auto', ...dialogArgs} = props;

  return {
    components: {ActionButton, Button, ButtonGroup, Checkbox, DialogTrigger, Heading},
    setup() {
      let labels = [
        {
          heading: 'The Heading',
          checkboxLabel: 'I have read and accept',
          secondaryButtonLabel: 'Secondary',
          primaryButtonLabel: 'Primary'
        },
        {
          heading: 'Terms of Service',
          checkboxLabel: 'I have read and accept the terms of use and privacy policy',
          secondaryButtonLabel: 'Secondary and best button',
          primaryButtonLabel: 'Primary and worst'
        }
      ];
      let whichLabels = ref(0);
      let isOpen = ref(true);

      return {
        dialogArgs,
        isOpen,
        labels,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        singleParagraphText: singleParagraph(),
        toggleLabels: () => {
          whichLabels.value = whichLabels.value ? 0 : 1;
        },
        whichLabels,
        width
      };
    },
    template: `
      <div :style="{display: 'flex', width, margin: '100px 0'}">
        <Button variant="primary" @click="toggleLabels">Toggle labels</Button>
        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template #heading><Heading>{{labels[whichLabels].heading}}</Heading></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>

          <div>{{singleParagraphText}}</div>

          <template #footer>
            <Checkbox>{{labels[whichLabels].checkboxLabel}}</Checkbox>
          </template>

          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="secondary" @click="onDialogButtonPress('Secondary')">{{labels[whichLabels].secondaryButtonLabel}}</Button>
              <Button variant="primary" @click="onDialogButtonPress('Primary')">{{labels[whichLabels].primaryButtonLabel}}</Button>
              <Button variant="cta" @click="onDialogButtonPress('CTA')">CTA</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>
      </div>
    `
  };
}

function renderWithDividerInContent(props: RenderProps = {}) {
  let {width = 'auto', ...dialogArgs} = props;

  return {
    components: {ActionButton, Button, ButtonGroup, DialogTrigger, Divider, Heading},
    setup() {
      let isOpen = ref(true);
      return {
        dialogArgs,
        isOpen,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        width
      };
    },
    template: `
      <div :style="{display: 'flex', width, margin: '100px 0'}">
        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template #heading><Heading>The Heading</Heading></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>

          <div style="padding: 10px; display: flex; align-items: stretch;">
            <div style="flex-grow: 1; flex-basis: 0;">
              Column number one. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
            <Divider orientation="vertical" size="S" UNSAFE_style="margin-inline: 10px;" />
            <div style="flex-grow: 1; flex-basis: 0;">
              Column number two. Eleifend quam adipiscing vitae proin sagittis nisl. Diam donec adipiscing tristique risus.
            </div>
          </div>

          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="primary" @click="onDialogButtonPress('Primary')">Primary</Button>
              <Button variant="cta" @click="onDialogButtonPress('CTA')">CTA</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>
      </div>
    `
  };
}

function renderLongContent(props: RenderProps = {}) {
  let {width = 'auto', ...dialogArgs} = props;

  return {
    components: {ActionButton, Button, ButtonGroup, DialogTrigger, TextField, Heading},
    setup() {
      let isOpen = ref(false);
      return {
        dialogArgs,
        fiveParagraphs: FIVE_PARAGRAPHS,
        isOpen,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        width
      };
    },
    template: `
      <div :style="{display: 'flex', flexDirection: 'column', alignItems: 'start', width, padding: '0 20px'}">
        <p>Test instructions on mobile:</p>
        <ol>
          <li>Scroll down and open dialog.</li>
          <li>Tap on the top input. Dialog should resize when the keyboard comes up and remain at the top of the screen. The rest of the page should not scroll (the first time you do this it may scroll slightly due to the bottom toolbar showing).</li>
          <li>Close the software keyboard.</li>
          <li>Scroll down and tap on the bottom input. Dialog should resize as before, and focused input should scroll into view.</li>
          <li>Tap the previous button in the software keyboard. Focus should move to the first input in the dialog. Dialog should not move and page should not scroll.</li>
          <li>Tap the previous button again. Focus should stay on the first input in the dialog and not move out to the textfield outside the dialog. The page may jump slightly, and come back but there is nothing we can do about this.</li>
        </ol>
        <p>Note: all this only works outside the storybook iframe due to VisualViewport limitations.</p>

        <TextField label="Outer textfield" />

        <p v-for="(paragraph, index) in fiveParagraphs" :key="'before-' + index">{{paragraph}}</p>

        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template #heading>
            <Heading level="3">The Heading is also very long and demonstrates what happens if there is no Header</Heading>
          </template>
          <template #divider><hr /></template>

          <div>
            <TextField label="Top textfield" />
            <p v-for="(paragraph, index) in fiveParagraphs" :key="'inner-' + index">{{paragraph}}</p>
            <TextField label="Bottom textfield" />
          </div>

          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="secondary" @click="onDialogButtonPress('Cancel')">Cancel</Button>
              <Button auto-focus variant="cta" @click="onDialogButtonPress('Confirm')">Confirm</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>

        <p v-for="(paragraph, index) in fiveParagraphs" :key="'after-' + index">{{paragraph}}</p>
      </div>
    `
  };
}

function renderHorizontalScrolling(props: RenderProps = {}) {
  let {width = 'auto', ...dialogArgs} = props;

  return {
    components: {ActionButton, Button, ButtonGroup, DialogTrigger, TextField, Heading},
    setup() {
      let isOpen = ref(true);
      return {
        dialogArgs,
        fiveParagraphs: FIVE_PARAGRAPHS,
        isOpen,
        onDialogButtonPress: (label: string) => {
          action('buttonPress')(label);
          isOpen.value = false;
        },
        openDialog: () => {
          isOpen.value = true;
        },
        width
      };
    },
    template: `
      <div :style="{display: 'flex', flexDirection: 'column', alignItems: 'start', width}">
        <p v-for="(paragraph, index) in fiveParagraphs" :key="'before-' + index">{{paragraph}}</p>

        <DialogTrigger v-bind="dialogArgs" :open="isOpen" @open-change="isOpen = $event">
          <template #trigger>
            <ActionButton @click="openDialog">Trigger</ActionButton>
          </template>
          <template #heading><Heading>The Heading</Heading></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>

          <div style="overflow: auto; touch-action: pan-x;">
            <TextField label="Top textfield" UNSAFE_style="min-width: 100vw;" />
            <p>scroll this content horizontally</p>
          </div>

          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="secondary" @click="onDialogButtonPress('Cancel')">Cancel</Button>
              <Button auto-focus variant="cta" @click="onDialogButtonPress('Confirm')">Confirm</Button>
            </ButtonGroup>
          </template>
        </DialogTrigger>

        <p v-for="(paragraph, index) in fiveParagraphs" :key="'after-' + index">{{paragraph}}</p>
      </div>
    `
  };
}

export const Default: Story = {
  render: () => renderBaseDialog({})
};

export const IsDismissable: Story = {
  render: () => renderBaseDialog({isDismissable: true})
};

export const LongContent: Story = {
  render: () => renderLongContent({})
};

export const WithHero: Story = {
  render: () => renderBaseDialog({}, {hero: true})
};

export const WithHeroIsDimissable: Story = {
  render: () => renderBaseDialog({isDismissable: true}, {hero: true})
};

export const WithFooter: Story = {
  render: () => renderBaseDialog({}, {footer: true})
};

export const Small: Story = {
  render: () => renderBaseDialog({size: 'S'})
};

export const Medium: Story = {
  render: () => renderBaseDialog({size: 'M'})
};

export const Large: Story = {
  render: () => renderBaseDialog({size: 'L'})
};

export const _Form: Story = {
  render: () => renderWithForm({})
};

export const FullscreenTakeoverForm: Story = {
  render: () => renderWithForm({type: 'fullscreenTakeover'})
};

export const ThreeButtons: Story = {
  render: () => renderBaseDialog({}, {withThreeButtons: true})
};

export const ThreeButtonsVerticalOrientation: Story = {
  render: () => renderBaseDialog({}, {verticalButtons: true, withThreeButtons: true})
};

export const ThreeButtonsFooter: Story = {
  render: () => renderThreeButtonsFooter({})
};

export const ClearedContent: Story = {
  render: () => renderWithDividerInContent({})
};

export const WithIframe: Story = {
  render: () => renderIframe({})
};

export const HorizontalScrolling: Story = {
  render: () => renderHorizontalScrolling({})
};
