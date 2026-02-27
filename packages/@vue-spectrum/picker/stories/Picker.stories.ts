import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Picker} from '../src';
import {action} from '@storybook/addon-actions';
import {computed, defineComponent, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type PickerStoryArgs = {
  ariaLabel?: string,
  autoFocus?: boolean,
  description?: string,
  disabledKeys?: Iterable<string>,
  isDisabled?: boolean,
  isInvalid?: boolean,
  isQuiet?: boolean,
  items?: Array<{id: string, label: string}>,
  label?: string,
  modelValue?: string,
  placeholder?: string,
  validationState?: 'invalid' | 'valid'
};

const baseItems = [
  {id: 'option-1', label: 'Option 1'},
  {id: 'option-2', label: 'Option 2'},
  {id: 'option-3', label: 'Option 3'},
  {id: 'option-4', label: 'Option 4'}
];

const DynamicPicker = defineComponent({
  name: 'DynamicPickerStory',
  components: {Picker},
  props: {
    sections: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let items = ref(props.sections
      ? [
        {id: 'group-a-1', label: 'Group A / Item 1'},
        {id: 'group-a-2', label: 'Group A / Item 2'},
        {id: 'group-b-1', label: 'Group B / Item 1'}
      ]
      : [...baseItems]);
    let selected = ref(items.value[0]?.id ?? '');

    let addItem = () => {
      let next = items.value.length + 1;
      let id = `dynamic-${next}`;
      items.value = [
        ...items.value,
        {
          id,
          label: props.sections ? `Group C / Item ${next}` : `Dynamic Item ${next}`
        }
      ];
    };

    return {
      items,
      selected,
      addItem
    };
  },
  template: `
    <div style="display: grid; gap: 8px; max-width: 280px;">
      <Picker
        label="Dynamic picker"
        :items="items"
        :model-value="selected"
        @update:model-value="selected = $event" />
      <button type="button" @click="addItem">Add item</button>
    </div>
  `
});

const AsyncLoadingPicker = defineComponent({
  name: 'AsyncLoadingPickerStory',
  components: {Picker},
  setup() {
    let items = ref<Array<{id: string, label: string}>>([]);
    let selected = ref('');
    let isLoading = ref(false);

    let loadItems = () => {
      if (isLoading.value || items.value.length > 0) {
        return;
      }

      isLoading.value = true;
      window.setTimeout(() => {
        items.value = [...baseItems];
        selected.value = baseItems[0].id;
        isLoading.value = false;
      }, 350);
    };

    loadItems();

    return {
      items,
      selected,
      isLoading,
      loadItems
    };
  },
  template: `
    <div style="display: grid; gap: 8px; max-width: 280px;">
      <Picker
        label="Async picker"
        :items="items"
        :model-value="selected"
        :placeholder="isLoading ? 'Loading...' : 'Select...'
        "
        @update:model-value="selected = $event" />
      <button type="button" :disabled="isLoading" @click="loadItems">Reload</button>
    </div>
  `
});

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
      let selected = ref('');

      watch(mergedArgs, (nextArgs) => {
        selected.value = nextArgs.modelValue ?? '';
      }, {deep: true, immediate: true});

      return {
        mergedArgs,
        selected
      };
    },
    template: `
      <div ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <Picker
          :aria-label="mergedArgs.ariaLabel"
          :auto-focus="mergedArgs.autoFocus"
          :description="mergedArgs.description"
          :disabled-keys="mergedArgs.disabledKeys"
          :is-disabled="mergedArgs.isDisabled"
          :is-invalid="mergedArgs.isInvalid"
          :is-quiet="mergedArgs.isQuiet"
          :items="mergedArgs.items"
          :label="mergedArgs.label"
          :model-value="selected"
          :placeholder="mergedArgs.placeholder"
          :validation-state="mergedArgs.validationState"
          @update:model-value="selected = $event" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderPicker({items: [...baseItems]})
};

export const Disabled: Story = {
  render: renderPicker({
    items: [
      {id: 'option-1', label: 'Option 1'},
      {id: 'option-2', label: 'Option 2'},
      {id: 'option-3', label: 'Option 3'}
    ],
    disabledKeys: ['option-2']
  }),
  name: 'disabled keys'
};

export const Sections: Story = {
  render: renderPicker({
    items: [
      {id: 'group-a-1', label: 'Group A / Item 1'},
      {id: 'group-a-2', label: 'Group A / Item 2'},
      {id: 'group-b-1', label: 'Group B / Item 1'}
    ]
  })
};

export const Dynamic: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {DynamicPicker},
    template: '<DynamicPicker />'
  }),
  name: 'dynamic'
};

export const DynamicSections: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {DynamicPicker},
    template: '<DynamicPicker :sections="true" />'
  }),
  name: 'dynamic with sections'
};

export const ComplexItems: Story = {
  render: renderPicker({
    items: [
      {id: 'usd', label: 'United States Dollar (USD)'},
      {id: 'eur', label: 'Euro (EUR)'},
      {id: 'jpy', label: 'Japanese Yen (JPY)'}
    ],
    modelValue: 'usd'
  }),
  name: 'complex items'
};

export const WithAvatars: Story = {
  render: renderPicker({
    items: [
      {id: 'avery', label: 'Avery'},
      {id: 'kai', label: 'Kai'},
      {id: 'lena', label: 'Lena'}
    ]
  })
};

export const LongItemText: Story = {
  render: renderPicker({
    items: [
      {id: 'long-1', label: 'Very long picker item text to validate truncation and overflow behavior in the trigger.'},
      {id: 'long-2', label: 'Second long picker option for scrolling and clipping behavior.'}
    ]
  }),
  name: 'long item text'
};

export const FalsyKey: Story = {
  render: renderPicker({
    items: [
      {id: '', label: 'Empty key option'},
      {id: '0', label: 'Zero key option'},
      {id: 'value', label: 'Value option'}
    ],
    modelValue: ''
  }),
  name: 'falsy item key'
};

export const LabelledBy: Story = {
  render: () => ({
    components: {Picker},
    setup() {
      let selected = ref('option-1');
      return {
        selected,
        items: [...baseItems]
      };
    },
    template: `
      <div style="max-width: 280px;">
        <p id="picker-label">Picker external label</p>
        <Picker
          aria-labelledby="picker-label"
          :items="items"
          label=""
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
  render: () => ({
    components: {ContextualHelp, Picker},
    setup() {
      let selected = ref('option-1');
      return {
        selected,
        items: [...baseItems]
      };
    },
    template: `
      <div style="display: flex; align-items: end; gap: 8px; max-width: 420px;">
        <Picker
          label="Picker with help"
          :items="items"
          :model-value="selected"
          @update:model-value="selected = $event" />
        <ContextualHelp title="Picker help">Additional context for picker options.</ContextualHelp>
      </div>
    `
  }),
  name: 'contextual help'
};

export const SelectedKey: Story = {
  render: renderPicker({modelValue: 'option-3'}),
  name: 'selectedKey'
};

export const DefaultSelectedKey: Story = {
  render: renderPicker({modelValue: 'option-2'}),
  name: 'defaultSelectedKey (uncontrolled)'
};

export const Loading: Story = {
  render: renderPicker({items: [], placeholder: 'Loading...'}),
  name: 'isLoading, no items'
};

export const AsyncLoading: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {AsyncLoadingPicker},
    template: '<AsyncLoadingPicker />'
  }),
  name: 'async loading'
};

export const Focus: Story = {
  render: renderPicker({autoFocus: true}),
  name: 'keyboard tab focus'
};

export const Resize: Story = {
  render: renderPicker({}, 'min-width: 180px; width: 260px; resize: horizontal; overflow: auto; border: 1px solid var(--spectrum-global-color-gray-300); padding: 8px;'),
  name: 'resize'
};

export const Scrolling: Story = {
  render: renderPicker(
    {
      items: Array.from({length: 18}, (_, index) => ({
        id: `item-${index + 1}`,
        label: `Scrollable option ${index + 1}`
      }))
    },
    'max-height: 120px; overflow: auto; border: 1px solid var(--spectrum-global-color-gray-300); padding: 8px;'
  ),
  name: 'scrolling container'
};

export const Links: Story = {
  render: renderPicker({
    items: [
      {id: 'https://adobe.com', label: 'https://adobe.com'},
      {id: 'https://react-spectrum.adobe.com', label: 'https://react-spectrum.adobe.com'},
      {id: 'https://vuejs.org', label: 'https://vuejs.org'}
    ]
  })
};

export const Quiet: Story = {
  render: renderPicker({isQuiet: true})
};
