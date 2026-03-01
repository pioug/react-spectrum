import {ActionButton} from '@vue-spectrum/button';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Picker} from '../src';
import {action} from 'storybook/actions';
import {userEvent, within} from 'storybook/test';
import {computed, h, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type PickerKey = number | string;

type PickerStoryItem = {
  id: PickerKey,
  label: string
};

type PickerStoryArgs = {
  align?: 'end' | 'start',
  ariaLabel?: string | null,
  autoFocus?: boolean,
  contextualHelp?: unknown,
  defaultSelectedKey?: PickerKey,
  description?: string,
  direction?: 'bottom' | 'top',
  disabledKeys?: Iterable<PickerKey>,
  isDisabled?: boolean,
  isInvalid?: boolean,
  isLoading?: boolean,
  isQuiet?: boolean,
  items?: Array<PickerStoryItem | {children: PickerStoryItem[], name: string}>,
  label?: string | null,
  menuWidth?: number | string,
  modelValue?: PickerKey,
  necessityIndicator?: 'icon' | 'label',
  placeholder?: string,
  selectedKey?: PickerKey,
  validationState?: 'invalid' | 'valid',
  width?: number | string
};

const DEFAULT_ITEMS: PickerStoryItem[] = [
  {id: 'Short', label: 'Short'},
  {id: 'Normal', label: 'Normal'},
  {id: 'This item is very long and word wraps poorly', label: 'This item is very long and word wraps poorly'}
];

const FLAT_OPTIONS = [
  {id: 1, name: 'Aardvark'},
  {id: 2, name: 'Kangaroo'},
  {id: 3, name: 'Snake'},
  {id: 4, name: 'Danni'},
  {id: 5, name: 'Devon'},
  {id: 6, name: 'Ross'},
  {id: 7, name: 'Puppy'},
  {id: 8, name: 'Doggo'},
  {id: 9, name: 'Floof'}
];

const LONG_ITEM_TEXT = [
  {id: 'short', name: 'One'},
  {id: 'long', name: 'your text here long long long long'},
  {id: 'underscores', name: 'your_text_here_long_long_long_long'},
  {id: 'hypens', name: 'your-text-here-long-long-long-long'},
  {id: 'singleWord', name: 'supercalifragilisticexpialidocious'},
  {id: 'always', name: 'This item is very long and word wraps poorly'}
];

const FALSY_KEY = [
  {id: '', name: 'None'},
  {id: 'One', name: 'One'},
  {id: 'Two', name: 'Two'},
  {id: 'Three', name: 'Three'}
];

const WITH_SECTION = [
  {
    name: 'Animals',
    children: [
      {id: 'Aardvark', label: 'Aardvark'},
      {id: 'Kangaroo', label: 'Kangaroo'},
      {id: 'Snake', label: 'Snake'}
    ]
  },
  {
    name: 'People',
    children: [
      {id: 'Danni', label: 'Danni'},
      {id: 'Devon', label: 'Devon'},
      {id: 'Ross', label: 'Ross'}
    ]
  }
];

function mapItems(items: Array<{id: PickerKey, name: string}>): PickerStoryItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.name
  }));
}

const AsyncLoadingPicker = {
  name: 'AsyncLoadingPickerStory',
  components: {Picker},
  setup() {
    let items = ref<PickerStoryItem[]>([]);
    let selected = ref<PickerKey | undefined>(undefined);
    let isLoading = ref(true);

    window.setTimeout(() => {
      items.value = mapItems(FLAT_OPTIONS);
      selected.value = FLAT_OPTIONS[0].id;
      isLoading.value = false;
    }, 1000);

    return {
      isLoading,
      items,
      selected
    };
  },
  template: `
    <Picker
      :items="items"
      :is-loading="isLoading"
      label="Pick a Pokemon"
      :model-value="selected"
      @update:model-value="selected = $event" />
  `
};

const meta: Meta<typeof Picker> = {
  title: 'Picker',
  component: Picker,
  args: {
    label: 'Test',
    onSelectionChange: action('onSelectionChange'),
    onOpenChange: action('onOpenChange')
  },
  argTypes: {
    layout: {
      table: {
        disable: true
      }
    },
    children: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    onOpenChange: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    labelAlign: {
      control: 'radio',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'radio',
      options: ['side', 'top']
    },
    necessityIndicator: {
      control: 'radio',
      options: ['icon', 'label']
    },
    isRequired: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    direction: {
      control: 'radio',
      options: ['top', 'bottom']
    },
    align: {
      control: 'radio',
      options: ['start', 'end']
    },
    width: {
      control: {
        type: 'radio',
        options: [null, '100px', '480px', 'size-4600']
      }
    },
    menuWidth: {
      control: {
        type: 'radio',
        options: [null, '100px', '480px', 'size-4600']
      }
    },
    isLoading: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    defaultOpen: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderPicker(baseArgs: Partial<PickerStoryArgs> = {}, wrapperStyle?: string) {
  return (args: PickerStoryArgs) => ({
    components: {Picker},
    setup() {
      let mergedArgs = computed<PickerStoryArgs>(() => ({...args, ...baseArgs}));
      let selected = ref<PickerKey | undefined>(undefined);

      watch(mergedArgs, (nextArgs) => {
        selected.value = nextArgs.modelValue;
      }, {deep: true, immediate: true});

      return {
        mergedArgs,
        selected
      };
    },
    template: `
      <div ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <Picker
          :align="mergedArgs.align"
          :aria-label="mergedArgs.ariaLabel ?? undefined"
          :auto-focus="mergedArgs.autoFocus"
          :contextual-help="mergedArgs.contextualHelp"
          :default-selected-key="mergedArgs.defaultSelectedKey"
          :description="mergedArgs.description"
          :direction="mergedArgs.direction"
          :disabled-keys="mergedArgs.disabledKeys"
          :is-disabled="mergedArgs.isDisabled"
          :is-invalid="mergedArgs.isInvalid"
          :is-loading="mergedArgs.isLoading"
          :is-quiet="mergedArgs.isQuiet"
          :items="mergedArgs.items"
          :label="mergedArgs.label ?? undefined"
          :menu-width="mergedArgs.menuWidth"
          :model-value="selected"
          :necessity-indicator="mergedArgs.necessityIndicator"
          :placeholder="mergedArgs.placeholder"
          :selected-key="mergedArgs.selectedKey"
          :validation-state="mergedArgs.validationState"
          :width="mergedArgs.width"
          @update:model-value="selected = $event" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderPicker({items: DEFAULT_ITEMS})
};

Default.play = async ({canvasElement}) => {
  let canvas = within(canvasElement);
  let button = await canvas.findByRole('button');
  await userEvent.click(button);
  let body = canvasElement.ownerDocument.body;
  await within(body).findByRole('listbox');
};

export const Disabled: Story = {
  render: renderPicker({
    disabledKeys: ['Short'],
    items: DEFAULT_ITEMS
  }),
  name: 'disabled keys'
};

export const Sections: Story = {
  render: renderPicker({
    items: [
      {
        children: [
          {id: 'Aardvark', label: 'Aardvark'},
          {id: 'Kangaroo', label: 'Kangaroo'},
          {id: 'Snake', label: 'Snake'}
        ],
        name: 'Animals'
      }
    ]
  })
};

export const Dynamic: Story = {
  render: renderPicker({
    items: mapItems(FLAT_OPTIONS)
  }),
  name: 'dynamic'
};

export const DynamicSections: Story = {
  render: renderPicker({
    items: WITH_SECTION as PickerStoryArgs['items']
  }),
  name: 'dynamic with sections'
};

export const ComplexItems: Story = {
  render: renderPicker({
    items: [
      {
        name: 'Section 1',
        children: [
          {id: 'Copy', label: 'Copy'},
          {id: 'Cut', label: 'Cut'},
          {id: 'Paste', label: 'Paste'}
        ]
      },
      {
        name: 'Section 2',
        children: [
          {id: 'Puppy', label: 'Puppy'},
          {id: 'Doggo with really really really long long long text', label: 'Doggo with really really really long long long text'},
          {id: 'Floof', label: 'Floof'}
        ]
      }
    ]
  }),
  name: 'complex items'
};

export const WithAvatars: Story = {
  render: renderPicker({
    items: [
      {id: 'User 1', label: 'User 1'},
      {id: 'User 2', label: 'User 2'},
      {id: 'User 3', label: 'User 3'},
      {id: 'User 4', label: 'User 4'}
    ],
    label: 'Select a user'
  })
};

export const LongItemText: Story = {
  render: renderPicker({
    items: mapItems(LONG_ITEM_TEXT)
  }),
  name: 'long item text'
};

export const FalsyKey: Story = {
  render: renderPicker({
    items: mapItems(FALSY_KEY)
  }),
  name: 'falsy item key'
};

export const LabelledBy: Story = {
  args: {
    'aria-label': null,
    'aria-labelledby': true,
    label: null
  },
  argTypes: {
    'aria-label': {
      control: 'text'
    },
    'aria-labelledby': {
      control: 'boolean'
    }
  },
  render: (args) => ({
    components: {Picker},
    setup() {
      let resolvedArgs = computed(() => ({
        'aria-label': null,
        'aria-labelledby': true,
        label: null,
        ...args
      }));
      let selected = ref<PickerKey | undefined>(undefined);
      let items = mapItems(FLAT_OPTIONS);
      return {
        resolvedArgs,
        items,
        selected
      };
    },
    template: `
      <div>
        <div id="test">Test label</div>
        <Picker
          :aria-label="resolvedArgs['aria-label'] ?? undefined"
          :aria-labelledby="resolvedArgs['aria-labelledby'] ? 'test' : undefined"
          :items="items"
          :label="resolvedArgs.label ?? undefined"
          :model-value="selected"
          @update:model-value="selected = $event" />
      </div>
    `
  }),
  name: 'no visible label combination story',
  parameters: {
    description: {
      data: 'Use controls to add/remove a visible label, aria-label, and toggle the aria-labelledby on/off'
    }
  }
};

export const ContextualHelpPicker: Story = {
  render: renderPicker({
    contextualHelp: h(ContextualHelp, {title: 'What is a segment?'}, {
      default: () => 'Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.'
    }),
    items: mapItems(FLAT_OPTIONS)
  }),
  name: 'contextual help'
};

export const SelectedKey: Story = {
  render: renderPicker({
    items: mapItems(FLAT_OPTIONS),
    selectedKey: 7
  }),
  name: 'selectedKey'
};

export const DefaultSelectedKey: Story = {
  render: (args) => ({
    components: {Picker},
    setup() {
      return {
        args,
        items: mapItems(FLAT_OPTIONS)
      };
    },
    template: `
      <Picker v-bind="args" :items="items" :default-selected-key="7" />
    `
  }),
  name: 'defaultSelectedKey (uncontrolled)'
};

export const Loading: Story = {
  render: renderPicker({
    isLoading: true,
    items: []
  }),
  name: 'isLoading, no items'
};

export const AsyncLoading: Story = {
  render: () => ({
    components: {AsyncLoadingPicker},
    template: '<AsyncLoadingPicker />'
  }),
  name: 'async loading'
};

export const Focus: Story = {
  render: (args) => ({
    components: {Picker},
    setup() {
      return {
        args,
        items: mapItems(FLAT_OPTIONS)
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 250px 0; align-items: center; gap: 8px;">
        <label for="focus-before">Focus before</label>
        <input id="focus-before" data-testid="before" />
        <Picker v-bind="args" label="Focus-Test" :items="items" />
        <label for="focus-after">Focus after</label>
        <input id="focus-after" data-testid="after" />
      </div>
    `
  }),
  name: 'keyboard tab focus'
};

export const Resize: Story = {
  render: (args) => ({
    components: {ActionButton, Picker},
    setup() {
      let isCompact = ref(true);
      let toggleSize = () => {
        isCompact.value = !isCompact.value;
      };

      return {
        args,
        isCompact,
        items: [
          {id: 'A1', label: 'A1'},
          {id: 'A2', label: 'A2'},
          {id: 'A3', label: 'A3'}
        ],
        toggleSize
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <div :style="{width: isCompact ? '200px' : '300px'}">
          <Picker v-bind="args" label="Choose A" :items="items" width="100%" />
        </div>
        <ActionButton @click="toggleSize">Toggle size</ActionButton>
      </div>
    `
  }),
  name: 'resize'
};

export const Scrolling: Story = {
  render: (args) => ({
    components: {Picker},
    setup() {
      return {
        args,
        items: [
          {id: 'One', label: 'One'},
          {id: 'Two', label: 'Two'},
          {id: 'Three', label: 'Three'}
        ]
      };
    },
    template: `
      <div style="width: 300px; height: 120px; overflow: auto;">
        <div style="width: 500px;">
          <Picker v-bind="args" label="Test" :items="items" />
        </div>
      </div>
    `
  }),
  name: 'scrolling container'
};

export const Links: Story = {
  render: renderPicker({
    items: [
      {id: 'foo', label: 'Foo'},
      {id: 'bar', label: 'Bar'},
      {id: 'google', label: 'Google'}
    ]
  })
};

export const Quiet: Story = {
  render: () => ({
    components: {Picker},
    setup() {
      return {
        items: [
          {id: 'rarely', label: 'Rarely'},
          {id: 'sometimes', label: 'Sometimes'},
          {id: 'always', label: 'Always'}
        ],
        longItems: [
          {id: 'rarely', label: 'Rarely'},
          {id: 'sometimes', label: 'This text is very long and will overflow the container'},
          {id: 'always', label: 'Always'}
        ],
        wideItems: [
          {id: 'rarely', label: 'Rarely'},
          {id: 'sometimes', label: 'This text is very long the picker should expand to fit'},
          {id: 'always', label: 'Always'}
        ]
      };
    },
    template: `
      <div>
        <div>
          <h4>Quiet picker with label</h4>
          <Picker label="Choose frequency" :items="items" is-quiet />
        </div>
        <hr />
        <div>
          <h4>Quiet picker without label</h4>
          <Picker aria-label="Choose frequency" :items="items" is-quiet />
        </div>
        <hr />
        <div style="width: 200px;">
          <h4>Quiet picker with label and fixed width (200px)</h4>
          <Picker default-selected-key="sometimes" is-quiet label="Choose frequency" :items="longItems" />
        </div>
        <hr />
        <div style="width: 600px;">
          <h4>Quiet picker with label and fixed width (600px)</h4>
          <Picker default-selected-key="sometimes" is-quiet label="Choose frequency" :items="wideItems" />
        </div>
      </div>
    `
  })
};
