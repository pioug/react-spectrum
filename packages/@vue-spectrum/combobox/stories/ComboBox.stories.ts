import {action} from '@storybook/addon-actions';
import {Button} from '@vue-spectrum/button';
import {ComboBox} from '../src';
import {computed, onBeforeUnmount, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type ComboOption = {
  id: string,
  textValue: string
};

const STATIC_OPTIONS: ComboOption[] = [
  {id: 'one', textValue: 'Item One'},
  {id: 'two', textValue: 'Item Two'},
  {id: 'three', textValue: 'Item Three'}
];

const BASIC_ANIMALS: ComboOption[] = [
  {id: '1', textValue: 'Aardvark'},
  {id: '2', textValue: 'Kangaroo'},
  {id: '3', textValue: 'Snake'}
];

const WITH_SECTION_OPTIONS: ComboOption[] = [
  {id: '1', textValue: 'Animals: Aardvark'},
  {id: '2', textValue: 'Animals: Kangaroo'},
  {id: '3', textValue: 'Animals: Snake'},
  {id: '4', textValue: 'People: Danni'},
  {id: '5', textValue: 'People: Devon'},
  {id: '6', textValue: 'People: Ross'}
];

const MANY_SECTION_OPTIONS: ComboOption[] = Array.from({length: 50}, (_section, sectionIndex) => (
  Array.from({length: 50}, (_item, itemIndex) => ({
    id: `section-${sectionIndex}-item-${itemIndex}`,
    textValue: `Section ${sectionIndex}: Item ${itemIndex}`
  }))
)).flat();

const COMPLEX_OPTIONS: ComboOption[] = [
  {id: 'add-to-queue', textValue: 'Add to queue - Add to current watch queue.'},
  {id: 'add-review', textValue: 'Add review - Post a review for the episode.'},
  {
    id: 'subscribe',
    textValue: 'Subscribe to series - Add series to your subscription list and be notified when a new episode airs.'
  },
  {id: 'report', textValue: 'Report - Report an issue or violation.'}
];

const AVATAR_OPTIONS: ComboOption[] = [
  {id: 'user-1', textValue: 'User 1'},
  {id: 'user-2', textValue: 'User 2'},
  {id: 'user-3', textValue: 'User 3'},
  {id: 'user-4', textValue: 'User 4'}
];

const DISABLED_KEYS_OPTIONS: ComboOption[] = [
  {id: 'Aardvark', textValue: 'Aardvark'},
  {id: 'Kangaroo', textValue: 'Kangaroo'},
  {id: 'Snake', textValue: 'Snake'},
  {id: 'Danni', textValue: 'Danni'},
  {id: 'Devon', textValue: 'Devon'},
  {id: 'Ross', textValue: 'Ross'}
];

const CUSTOM_FILTER_ITEMS: ComboOption[] = [
  {id: '1', textValue: 'The first item'},
  {id: '2', textValue: 'The second item'},
  {id: '3', textValue: 'The third item'}
];

const STAR_WARS_ITEMS = [
  'Luke Skywalker',
  'Leia Organa',
  'Han Solo',
  'Chewbacca',
  'Darth Vader',
  'Obi-Wan Kenobi',
  'Yoda'
];

const LINKS_OPTIONS: ComboOption[] = [
  {id: 'foo', textValue: 'Foo'},
  {id: 'bar', textValue: 'Bar'},
  {id: 'google', textValue: 'Google (https://google.com)'}
];

const meta: Meta<typeof ComboBox> = {
  title: 'ComboBox',
  component: ComboBox,
  args: {
    label: 'Combobox',
    onOpenChange: action('onOpenChange'),
    onInputChange: action('onInputChange'),
    onSelectionChange: action('onSelectionChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus')
  },
  argTypes: {
    defaultItems: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    onOpenChange: {
      table: {
        disable: true
      }
    },
    disabledKeys: {
      table: {
        disable: true
      }
    },
    inputValue: {
      table: {
        disable: true
      }
    },
    defaultInputValue: {
      table: {
        disable: true
      }
    },
    defaultSelectedKey: {
      table: {
        disable: true
      }
    },
    selectedKey: {
      table: {
        disable: true
      }
    },
    onInputChange: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    onBlur: {
      table: {
        disable: true
      }
    },
    onFocus: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    'aria-label': {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    labelAlign: {
      control: 'select',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    validationState: {
      control: 'select',
      options: [null, 'valid', 'invalid']
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    menuTrigger: {
      control: 'select',
      options: ['focus', 'manual']
    },
    direction: {
      control: 'radio',
      options: ['top', 'bottom']
    },
    align: {
      control: 'radio',
      options: ['start', 'end']
    },
    allowsCustomValue: {
      control: 'boolean'
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
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderStatic(args: StoryArgs, options: ComboOption[] = STATIC_OPTIONS) {
  return {
    components: {ComboBox},
    setup() {
      return {
        args,
        options
      };
    },
    template: '<ComboBox v-bind="args" :options="options" />'
  };
}

function getOptionTextById(options: ComboOption[], key: string | null | undefined) {
  if (!key) {
    return '';
  }

  let match = options.find(option => option.id === key);
  if (!match) {
    return '';
  }

  let [_, text] = match.textValue.split(': ');
  return text ?? match.textValue;
}

export const Default: Story = {
  render: (args) => renderStatic(args, STATIC_OPTIONS),
  name: 'static items'
};

export const Dynamic: Story = {
  render: (args) => renderStatic(args, BASIC_ANIMALS),
  name: 'dynamic items'
};

export const NoItems: Story = {
  render: (args) => renderStatic(args, []),
  name: 'no items'
};

export const MappedItems: Story = {
  render: (args) => ({
    components: {Button, ComboBox},
    setup() {
      let options = ref<ComboOption[]>([
        {id: 'one', textValue: 'The first item'},
        {id: 'two', textValue: 'The second item'},
        {id: 'three', textValue: 'The third item'}
      ]);

      let updateItems = () => {
        options.value = [
          {id: 'one', textValue: 'The first item new text'},
          {id: 'two', textValue: 'The second item new text'},
          {id: 'three', textValue: 'The third item new text'}
        ];
      };

      return {
        args,
        options,
        updateItems
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <Button variant="secondary" @click="updateItems">Press to change items</Button>
        <ComboBox v-bind="args" :options="options" />
      </div>
    `
  }),
  name: 'with mapped items (defaultItem and items undef)'
};

export const Sections: Story = {
  render: (args) => renderStatic(args, WITH_SECTION_OPTIONS),
  name: 'with sections'
};

export const ManySections: Story = {
  render: (args) => renderStatic(args, MANY_SECTION_OPTIONS),
  name: 'with many sections'
};

export const ComplexItems: Story = {
  args: {
    label: 'Select action'
  },
  render: (args) => renderStatic(args, COMPLEX_OPTIONS)
};

export const WithAvatars: Story = {
  args: {
    label: 'Select a user'
  },
  render: (args) => renderStatic(args, AVATAR_OPTIONS)
};

export const UserProvidedLabel: Story = {
  args: {
    label: 'Select action'
  },
  render: (args) => ({
    components: {ComboBox},
    setup() {
      return {
        args,
        options: STATIC_OPTIONS
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: min(100%, 320px);">
        <label id="test-label" for="test-id">Combobox</label>
        <ComboBox v-bind="args" id="test-id" aria-labelledby="test-label" :options="options" />
      </div>
    `
  })
};

export const DisabledKeys: Story = {
  args: {
    label: 'Combobox',
    disabledKeys: ['Snake', 'Ross']
  },
  render: (args) => renderStatic(args, DISABLED_KEYS_OPTIONS)
};

export const ContextualHelpStory: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      return {
        args,
        options: STATIC_OPTIONS
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <p style="margin: 0; max-width: 520px;">
          What is a segment? Segments identify who your visitors are, what devices and services they use,
          where they navigated from, and much more.
        </p>
        <ComboBox v-bind="args" :options="options" />
      </div>
    `
  }),
  name: 'contextual help'
};

export const Resize: Story = {
  render: (args) => ({
    components: {Button, ComboBox},
    setup() {
      let isCompact = ref(true);
      let toggleSize = () => {
        isCompact.value = !isCompact.value;
      };

      return {
        args,
        isCompact,
        options: STATIC_OPTIONS,
        toggleSize
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <div :style="{width: isCompact ? '200px' : '300px'}">
          <ComboBox v-bind="args" :options="options" style="width: 100%;" />
        </div>
        <Button variant="secondary" @click="toggleSize">Toggle size</Button>
      </div>
    `
  })
};

export const SmallDiv: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      return {
        args,
        options: STATIC_OPTIONS
      };
    },
    template: `
      <div style="width: 120px;">
        <ComboBox v-bind="args" :options="options" />
      </div>
    `
  }),
  name: 'in small div'
};

export const ControlledInputValueStory: Story = {
  args: {
    modelValue: 'Snake',
    disabledKeys: ['2', '6']
  },
  render: (args) => ({
    components: {Button, ComboBox},
    setup() {
      let inputValue = ref(typeof args.modelValue === 'string' ? args.modelValue : 'Snake');
      let setInputValue = (value: string) => {
        inputValue.value = value;
      };

      return {
        args,
        inputValue,
        options: WITH_SECTION_OPTIONS,
        setInputValue
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div>Current input value: {{inputValue}}</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <Button variant="secondary" @click="setInputValue('Blah')">Blah</Button>
          <Button variant="secondary" @click="setInputValue('Kangaroo')">Kangaroo</Button>
          <Button variant="secondary" @click="setInputValue('')">Clear field</Button>
        </div>
        <ComboBox
          v-bind="args"
          :options="options"
          :model-value="inputValue"
          @update:model-value="setInputValue"
        />
      </div>
    `
  }),
  name: 'inputValue (controlled)'
};

export const DefaultInputValue: Story = {
  args: {
    modelValue: 'Item Three',
    disabledKeys: ['two']
  },
  render: (args) => renderStatic(args, STATIC_OPTIONS),
  name: 'defaultInputValue (uncontrolled)'
};

export const ControlledSelectedKey: Story = {
  args: {
    selectedKey: '4',
    disabledKeys: ['2', '6']
  },
  render: (args) => ({
    components: {Button, ComboBox},
    setup() {
      let selectedKey = ref(typeof args.selectedKey === 'string' ? args.selectedKey : '4');
      let setSelectedKey = (value: string | number | undefined | null) => {
        selectedKey.value = value == null ? '' : String(value);
      };

      return {
        args,
        options: WITH_SECTION_OPTIONS,
        selectedKey,
        setSelectedKey
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div>Current selectedKey: {{selectedKey || 'none'}}</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <Button variant="secondary" @click="setSelectedKey('3')">Snake</Button>
          <Button variant="secondary" @click="setSelectedKey('6')">Ross</Button>
          <Button variant="secondary" @click="setSelectedKey('')">Clear key</Button>
        </div>
        <ComboBox
          v-bind="args"
          :options="options"
          :selected-key="selectedKey || undefined"
          @update:selected-key="setSelectedKey"
        />
      </div>
    `
  }),
  name: 'selectedKey (controlled)'
};

export const DefaultSelectedKey: Story = {
  args: {
    selectedKey: 'two',
    disabledKeys: ['one']
  },
  render: (args) => renderStatic(args, STATIC_OPTIONS),
  name: 'defaultSelectedKey (uncontrolled)'
};

export const AllControlled: Story = {
  args: {
    selectedKey: '2',
    modelValue: 'Kangaroo',
    disabledKeys: ['2', '6']
  },
  render: (args) => ({
    components: {Button, ComboBox},
    setup() {
      let inputValue = ref(typeof args.modelValue === 'string' ? args.modelValue : 'Kangaroo');
      let selectedKey = ref(typeof args.selectedKey === 'string' ? args.selectedKey : '2');

      let setSnake = () => {
        selectedKey.value = '3';
        inputValue.value = 'Snake';
      };
      let setRoss = () => {
        selectedKey.value = '6';
        inputValue.value = 'Ross';
      };
      let clearAll = () => {
        selectedKey.value = '';
        inputValue.value = '';
      };
      let onInputChange = (value: string) => {
        inputValue.value = value;
        if (value === '') {
          selectedKey.value = '';
        }
      };
      let onSelectionChange = (value: string | number | undefined | null) => {
        selectedKey.value = value == null ? '' : String(value);
        inputValue.value = getOptionTextById(WITH_SECTION_OPTIONS, selectedKey.value) || inputValue.value;
      };

      return {
        args,
        clearAll,
        inputValue,
        onInputChange,
        onSelectionChange,
        options: WITH_SECTION_OPTIONS,
        selectedKey,
        setRoss,
        setSnake
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div>Current selectedKey: {{selectedKey || 'none'}}</div>
        <div>Current input value: {{inputValue}}</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <Button variant="secondary" @click="setSnake">Snake</Button>
          <Button variant="secondary" @click="setRoss">Ross</Button>
          <Button variant="secondary" @click="clearAll">Clear key</Button>
        </div>
        <ComboBox
          v-bind="args"
          :options="options"
          :selected-key="selectedKey || undefined"
          :model-value="inputValue"
          @update:model-value="onInputChange"
          @update:selected-key="onSelectionChange"
        />
      </div>
    `
  }),
  name: 'inputValue and selectedKey (controlled)'
};

export const DefaultInputAndKey: Story = {
  args: {
    modelValue: 'Item Two',
    selectedKey: 'two',
    disabledKeys: ['two']
  },
  render: (args) => renderStatic(args, STATIC_OPTIONS),
  name: 'defaultInputValue and defaultSelectedKey (uncontrolled)'
};

export const ControlledInputDefaultKey: Story = {
  args: {
    modelValue: 'K',
    selectedKey: 'two',
    disabledKeys: ['2', '6']
  },
  render: (args) => ({
    components: {ComboBox},
    setup() {
      let inputValue = ref(typeof args.modelValue === 'string' ? args.modelValue : 'K');
      let onInputChange = (value: string) => {
        inputValue.value = value;
      };

      return {
        args,
        inputValue,
        onInputChange,
        options: STATIC_OPTIONS
      };
    },
    template: `
      <ComboBox
        v-bind="args"
        :options="options"
        :model-value="inputValue"
        @update:model-value="onInputChange"
      />
    `
  }),
  name: 'inputValue and defaultSelectedKey (controlled by inputvalue)'
};

export const ControlledInputValue: Story = {
  args: {
    modelValue: 'Blah',
    selectedKey: '2',
    disabledKeys: ['2', '6']
  },
  render: (args) => ({
    components: {ComboBox},
    setup() {
      let selectedKey = ref(typeof args.selectedKey === 'string' ? args.selectedKey : '2');
      let setSelectedKey = (value: string | number | undefined | null) => {
        selectedKey.value = value == null ? '' : String(value);
      };

      return {
        args,
        options: WITH_SECTION_OPTIONS,
        selectedKey,
        setSelectedKey
      };
    },
    template: `
      <ComboBox
        v-bind="args"
        :options="options"
        :selected-key="selectedKey || undefined"
        @update:selected-key="setSelectedKey"
      />
    `
  }),
  name: 'defaultInputValue and selectedKey (controlled by selectedKey)'
};

export const CustomFilter: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      let inputValue = ref('');
      let options = computed(() => {
        let filter = inputValue.value.trim().toLowerCase();
        if (!filter) {
          return CUSTOM_FILTER_ITEMS;
        }

        return CUSTOM_FILTER_ITEMS.filter(option => option.textValue.toLowerCase().startsWith(filter));
      });

      return {
        args,
        inputValue,
        options
      };
    },
    template: `
      <ComboBox
        v-bind="args"
        label="Combobox"
        :options="options"
        :model-value="inputValue"
        @update:model-value="inputValue = $event"
      />
    `
  })
};

export const LoadingState: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      return {
        args,
        options: BASIC_ANIMALS
      };
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <ComboBox v-bind="args" label="Combobox (loading)" :options="options" placeholder="Loading..." />
        <ComboBox v-bind="args" label="Combobox (filtering)" :options="options" placeholder="Filtering..." />
        <ComboBox v-bind="args" label="Combobox (loading + manual open)" :options="options" placeholder="Loading..." />
        <ComboBox v-bind="args" label="Combobox (loading more)" :options="options" placeholder="Loading more..." />
      </div>
    `
  })
};

export const FilteringListData: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      let filterText = ref('Snake');
      let showAll = ref(false);

      let filteredOptions = computed(() => {
        if (showAll.value) {
          return BASIC_ANIMALS;
        }

        let filter = filterText.value.trim().toLowerCase();
        if (!filter) {
          return BASIC_ANIMALS;
        }

        return BASIC_ANIMALS.filter(option => option.textValue.toLowerCase().includes(filter));
      });

      let onInputChange = (value: string) => {
        showAll.value = false;
        filterText.value = value;
      };

      return {
        args,
        filterText,
        filteredOptions,
        onInputChange,
        showAll
      };
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <ComboBox
          v-bind="args"
          label="ComboBox (show all on open)"
          :options="filteredOptions"
          :model-value="filterText"
          @open="showAll = true"
          @update:model-value="onInputChange"
        />
        <ComboBox
          v-bind="args"
          label="ComboBox (default controlled items behavior)"
          :options="filteredOptions"
          :model-value="filterText"
          @update:model-value="onInputChange"
        />
      </div>
    `
  }),
  name: 'filtering with useListData'
};

function renderServerSideFiltering(args: StoryArgs, controlledKey: boolean, resetOnBlur: boolean) {
  return {
    components: {ComboBox},
    setup() {
      let inputValue = ref(controlledKey ? 'Luke Skywalker' : '');
      let selectedKey = ref<string | undefined>(controlledKey ? 'Luke Skywalker' : undefined);
      let options = ref<ComboOption[]>([]);
      let loading = ref(false);
      let timer: ReturnType<typeof setTimeout> | null = null;

      let performLoad = (filterText: string) => {
        if (timer) {
          clearTimeout(timer);
        }

        loading.value = true;
        timer = setTimeout(() => {
          let filter = filterText.trim().toLowerCase();
          let matches = STAR_WARS_ITEMS.filter(name => name.toLowerCase().includes(filter));
          options.value = matches.map(name => ({id: name, textValue: name}));
          loading.value = false;

          if (controlledKey && selectedKey.value && !matches.includes(selectedKey.value)) {
            selectedKey.value = undefined;
          }
        }, 400);
      };

      watch(inputValue, value => {
        performLoad(value);
      }, {immediate: true});

      onBeforeUnmount(() => {
        if (timer) {
          clearTimeout(timer);
        }
      });

      let onInputChange = (value: string) => {
        inputValue.value = value;
        if (controlledKey && value === '') {
          selectedKey.value = undefined;
        }
      };

      let onSelectionChange = (value: string | number | undefined | null) => {
        if (!controlledKey) {
          return;
        }

        selectedKey.value = value == null ? undefined : String(value);
        if (selectedKey.value) {
          inputValue.value = selectedKey.value;
        }
      };

      let onBlur = () => {
        if (!resetOnBlur) {
          return;
        }

        if (selectedKey.value) {
          inputValue.value = selectedKey.value;
          return;
        }

        inputValue.value = '';
      };

      return {
        args,
        inputValue,
        loading,
        onBlur,
        onInputChange,
        onSelectionChange,
        options,
        selectedKey
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div v-if="loading">Loading…</div>
        <ComboBox
          v-bind="args"
          label="Star Wars Character Lookup"
          :options="options"
          :model-value="inputValue"
          :selected-key="selectedKey"
          @blur="onBlur"
          @update:model-value="onInputChange"
          @update:selected-key="onSelectionChange"
        />
      </div>
    `
  };
}

export const SeverSideFiltering: Story = {
  render: (args) => renderServerSideFiltering(args, false, false),
  name: 'server side filtering with useAsyncList'
};

export const SeverSideFilteringControlled: Story = {
  render: (args) => renderServerSideFiltering(args, true, false),
  name: 'server side filtering with useAsyncList (controlled key)'
};

export const SeverSideFilteringControlledReset: Story = {
  render: (args) => renderServerSideFiltering(args, true, true),
  name: 'server side filtering with controlled key and inputValue reset if not focused'
};

export const InDialog: Story = {
  render: (args) => ({
    components: {Button, ComboBox},
    setup() {
      let isOpen = ref(false);
      let selectedKey = ref<string | undefined>(undefined);

      return {
        args,
        isOpen,
        options: WITH_SECTION_OPTIONS,
        selectedKey
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <Button variant="secondary" @click="isOpen = true">Show ComboBox</Button>
        <div
          v-if="isOpen"
          style="display: grid; gap: 12px; width: min(100%, 440px); padding: 16px; border: 1px solid #d4d4d8; border-radius: 8px;">
          <ComboBox
            v-bind="args"
            label="Combo Box"
            placeholder="choose wisely"
            :options="options"
            :selected-key="selectedKey"
            @update:selected-key="selectedKey = ($event == null ? undefined : String($event))"
          />
          <Button variant="secondary" @click="isOpen = false">Cancel</Button>
        </div>
      </div>
    `
  }),
  name: 'within a dialog'
};

export const WHCM: Story = {
  render: (args) => ({
    components: {ComboBox},
    setup() {
      return {
        args,
        options: STATIC_OPTIONS
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div>
          Shows the different states from
          <a href="https://spectrum.adobe.com/static/Windows-High-Contrast-Kits/Combobox-WindowsHighContrast.xd" target="_blank" rel="noreferrer">spectrum</a>.
        </div>
        <ComboBox v-bind="args" label="Label" placeholder="Type here..." :options="options" />
        <ComboBox v-bind="args" label="Label" :options="options" />
        <ComboBox v-bind="args" label="Label" is-quiet :options="options" />
        <ComboBox v-bind="args" label="Label" is-invalid :options="options" />
        <ComboBox v-bind="args" label="Label" is-invalid is-quiet :options="options" />
      </div>
    `
  })
};

export const Links: Story = {
  render: (args) => renderStatic(args, LINKS_OPTIONS)
};
