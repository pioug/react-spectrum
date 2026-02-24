import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueComboBox} from 'vue-aria-components';
import {computed, ref} from 'vue';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

interface ComboBoxItem {
  id: string,
  name: string
}

interface StoryOption {
  actionOnly: boolean,
  id: string,
  inputValueOnSelect?: string,
  text: string
}

type StoryOptionInput = ComboBoxItem | StoryOption | string;

type SelectionMode = 'multiple' | 'single';

interface StaticComboBoxStoryConfig {
  baseOptions: StoryOptionInput[],
  createOptionFromInput?: boolean,
  disableLocalFilter?: boolean,
  label?: string,
  placeholder?: string,
  rootStyle?: string,
  selectionMode?: SelectionMode,
  showSelectedStateRegion?: boolean,
  useRelativeField?: boolean,
  virtualized?: boolean
}

const baseOptions = ['Foo', 'Bar', 'Baz', 'Google'];
const staticRenderPropOptions = ['Foo', 'Bar', 'Baz'];
const imeOptions = ['にほんご', 'ニホンゴ', 'ﾆﾎﾝｺﾞ', '日本語', '123', '１２３'];
const renderPropItems: ComboBoxItem[] = [
  {id: '1', name: 'Foo'},
  {id: '2', name: 'Bar'},
  {id: '3', name: 'Baz'}
];
const manyItems: ComboBoxItem[] = Array.from({length: 10000}, (_, index) => ({
  id: String(index),
  name: `Item ${index}`
}));
const animalOptions = ['Aardvark', 'Cat', 'Dog', 'Kangaroo', 'Panda', 'Snake'];
const asyncVirtualizedDynamicOptions = [
  {id: 'luke', name: 'Luke Skywalker'},
  {id: 'leia', name: 'Leia Organa'},
  {id: 'han', name: 'Han Solo'},
  {id: 'vader', name: 'Darth Vader'}
];

const meta = {
  title: 'React Aria Components/ComboBox',
  component: VueComboBox
} satisfies Meta<typeof VueComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;
type ComboBoxStory = StoryFn<typeof VueComboBox>;

let storyInstanceCount = 0;

function normalizeOption(option: StoryOptionInput): StoryOption {
  if (typeof option === 'string') {
    return {
      actionOnly: false,
      id: option,
      text: option
    };
  }

  if ('text' in option) {
    return {
      actionOnly: Boolean(option.actionOnly),
      id: String(option.id),
      inputValueOnSelect: option.inputValueOnSelect,
      text: option.text
    };
  }

  return {
    actionOnly: false,
    id: String(option.id),
    text: option.name
  };
}

function createStaticComboBoxStory(config: StaticComboBoxStoryConfig) {
  return {
    setup() {
      let inputValue = ref('');
      let isOpen = ref(false);
      let activeIndex = ref(-1);
      let selectedKeys = ref<string[]>([]);
      let storyId = `vs-static-combobox-${++storyInstanceCount}`;
      let listBoxId = `${storyId}-listbox`;
      let normalizedBaseOptions = computed(() => config.baseOptions.map((option) => normalizeOption(option)));

      let options = computed(() => {
        if (!config.createOptionFromInput || inputValue.value.length === 0) {
          return normalizedBaseOptions.value;
        }

        return [
          {
            actionOnly: true,
            id: `create-${inputValue.value}`,
            inputValueOnSelect: '',
            text: `Create "${inputValue.value}"`
          },
          ...normalizedBaseOptions.value
        ];
      });

      let filteredOptions = computed(() => {
        if (config.disableLocalFilter || inputValue.value.length === 0) {
          return options.value;
        }

        let filterText = inputValue.value.toLocaleLowerCase();
        return options.value.filter((option) => option.text.toLocaleLowerCase().includes(filterText));
      });

      let visibleOptions = computed(() => config.virtualized
        ? filteredOptions.value.slice(0, 24)
        : filteredOptions.value);

      let optionDomId = (optionId: string) => `${storyId}-option-${optionId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

      let activeDescendant = computed(() => {
        let option = filteredOptions.value[activeIndex.value];
        return option ? optionDomId(option.id) : undefined;
      });

      let isOptionSelected = (optionId: string) => selectedKeys.value.includes(optionId);

      let openMenu = (focus: 'first' | 'last' | 'preserve' = 'first') => {
        isOpen.value = true;

        if (filteredOptions.value.length === 0) {
          activeIndex.value = -1;
          return;
        }

        if (focus === 'last') {
          activeIndex.value = filteredOptions.value.length - 1;
          return;
        }

        if (focus === 'preserve' && activeIndex.value >= 0 && activeIndex.value < filteredOptions.value.length) {
          return;
        }

        activeIndex.value = 0;
      };

      let closeMenu = () => {
        isOpen.value = false;
        activeIndex.value = -1;
      };

      let moveActiveOption = (delta: -1 | 1) => {
        if (!isOpen.value) {
          openMenu(delta > 0 ? 'first' : 'last');
          return;
        }

        if (filteredOptions.value.length === 0) {
          activeIndex.value = -1;
          return;
        }

        let nextIndex = activeIndex.value + delta;
        if (activeIndex.value < 0) {
          nextIndex = delta > 0 ? 0 : filteredOptions.value.length - 1;
        }

        activeIndex.value = Math.max(0, Math.min(filteredOptions.value.length - 1, nextIndex));
      };

      let selectOption = (index: number) => {
        let option = filteredOptions.value[index];
        if (!option) {
          return;
        }

        if ((config.selectionMode ?? 'single') === 'multiple') {
          if (!option.actionOnly) {
            let nextSelection = new Set(selectedKeys.value);
            if (nextSelection.has(option.id)) {
              nextSelection.delete(option.id);
            } else {
              nextSelection.add(option.id);
            }
            selectedKeys.value = Array.from(nextSelection);
          }

          inputValue.value = option.inputValueOnSelect ?? '';
          openMenu('preserve');
          return;
        }

        if (option.actionOnly) {
          inputValue.value = option.inputValueOnSelect ?? '';
          selectedKeys.value = [];
          closeMenu();
          return;
        }

        inputValue.value = option.inputValueOnSelect ?? option.text;
        selectedKeys.value = [option.id];
        closeMenu();
      };

      let onInput = (event: Event) => {
        let target = event.currentTarget as HTMLInputElement | null;
        inputValue.value = target?.value ?? '';
        openMenu('first');
      };

      let onTriggerPress = () => {
        if (isOpen.value) {
          closeMenu();
          return;
        }

        openMenu('first');
      };

      let onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          moveActiveOption(1);
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveActiveOption(-1);
          return;
        }

        if (event.key === 'Enter' && isOpen.value && activeIndex.value >= 0) {
          event.preventDefault();
          selectOption(activeIndex.value);
          return;
        }

        if (event.key === 'Escape') {
          closeMenu();
        }
      };

      let onOptionMouseDown = (event: MouseEvent, index: number) => {
        event.preventDefault();
        selectOption(index);
      };

      let selectedStateText = computed(() => {
        if (selectedKeys.value.length === 0) {
          return 'No selected items';
        }

        let textById = new Map(normalizedBaseOptions.value.map((option) => [option.id, option.text]));
        return selectedKeys.value
          .map((key) => textById.get(key) ?? key)
          .join(', ');
      });

      return {
        activeDescendant,
        activeIndex,
        inputValue,
        isOpen,
        isOptionSelected,
        label: config.label ?? 'Test',
        listBoxId,
        listBoxStyle: config.virtualized
          ? 'max-height: 500px; overflow: auto; width: 220px; white-space: nowrap;'
          : 'max-height: 240px; overflow: auto; width: 220px; white-space: nowrap;',
        onInput,
        onKeyDown,
        onOptionMouseDown,
        onTriggerPress,
        optionDomId,
        placeholder: config.placeholder ?? '',
        rootStyle: config.rootStyle ?? '',
        selectedStateText,
        showSelectedStateRegion: Boolean(config.showSelectedStateRegion),
        useRelativeField: config.useRelativeField !== false,
        visibleOptions
      };
    },
    template: `
      <div class="react-aria-ComboBox" data-rac="" :style="rootStyle || undefined">
        <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">{{ label }}</label>
        <div :style="useRelativeField ? 'display: flex; position: relative;' : 'display: flex;'">
          <input
            class="react-aria-Input"
            data-rac=""
            type="text"
            :value="inputValue"
            :placeholder="placeholder || undefined"
            role="combobox"
            :aria-controls="listBoxId"
            :aria-expanded="isOpen ? 'true' : 'false'"
            :aria-activedescendant="activeDescendant"
            aria-haspopup="listbox"
            @input="onInput"
            @keydown="onKeyDown">
          <button
            class="react-aria-Button"
            data-rac=""
            type="button"
            aria-haspopup="listbox"
            :aria-expanded="isOpen ? 'true' : 'false'"
            :aria-controls="listBoxId"
            @click="onTriggerPress">
            <span aria-hidden="true" style="padding: 0 2px;">▼</span>
          </button>
        </div>
        <div
          v-if="isOpen"
          class="react-aria-ListBox"
          :id="listBoxId"
          role="listbox"
          :aria-multiselectable="showSelectedStateRegion ? 'true' : undefined"
          :style="listBoxStyle">
          <div
            v-for="(option, optionIndex) in visibleOptions"
            :id="optionDomId(option.id)"
            :key="option.id"
            class="react-aria-ListBoxItem"
            role="option"
            :aria-selected="isOptionSelected(option.id) ? 'true' : 'false'"
            :data-focused="optionIndex === activeIndex ? 'true' : undefined"
            @mouseenter="activeIndex = optionIndex"
            @mousedown="onOptionMouseDown($event, optionIndex)">
            {{ option.text }}
          </div>
        </div>
        <div v-if="showSelectedStateRegion" class="react-aria-TagGroup">
          <div
            class="react-aria-TagList"
            style="display: flex; color: oklch(0.410821 0 0); font-family: system-ui; line-height: normal;"
            data-rac=""
            aria-label="Selected states"
            role="group"
            tabindex="0"
            aria-atomic="false"
            aria-relevant="additions"
            aria-live="off"
            :data-empty="selectedStateText === 'No selected items' ? 'true' : undefined">
            {{ selectedStateText }}
          </div>
        </div>
      </div>
    `
  };
}

export const ComboBoxExample: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions,
  rootStyle: "font: 14px / 21px adobe-clean, 'Source Sans Pro', -apple-system, 'system-ui', 'Segoe UI', Roboto, Ubuntu, 'Trebuchet MS', 'Lucida Grande', sans-serif; color: oklch(0.410821 0 0);"
});

export const ComboBoxRenderPropsStatic: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: staticRenderPropOptions
});

export const ComboBoxRenderPropsDefaultItems: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: renderPropItems
});

export const ComboBoxRenderPropsItems: Story = {
  render: () => createStaticComboBoxStory({
    baseOptions: renderPropItems,
    disableLocalFilter: true
  }),
  parameters: {
    description: {
      data: 'Note this won\'t filter the items in the listbox because it is fully controlled'
    }
  }
};

export const ComboBoxRenderPropsListBoxDynamic: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: renderPropItems
});

export const ComboBoxAsyncLoadingExample: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: renderPropItems
});

export const ComboBoxImeExample: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: imeOptions,
  label: 'IME Test'
});

export const VirtualizedComboBox: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: manyItems,
  virtualized: true
});

const AsyncVirtualizedDynamicComboboxRender = (_props: {delay: number}) => createStaticComboBoxStory({
  baseOptions: asyncVirtualizedDynamicOptions,
  label: 'Async Virtualized Dynamic ComboBox',
  virtualized: true
});

export const AsyncVirtualizedDynamicCombobox: StoryObj<typeof AsyncVirtualizedDynamicComboboxRender> = {
  render: (args: {delay: number}) => AsyncVirtualizedDynamicComboboxRender(args),
  args: {
    delay: 50
  }
};

export function WithCreateOption() {
  return createStaticComboBoxStory({
    baseOptions: animalOptions,
    createOptionFromInput: true,
    label: 'Favorite Animal',
    useRelativeField: false
  });
}

export const ComboBoxListBoxItemWithAriaLabel: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: [
    {id: 'foo', name: 'Item Foo'},
    {id: 'bar', name: 'Item Bar'},
    {id: 'baz', name: 'Item Baz'}
  ]
});

export const MultiSelectComboBox: ComboBoxStory = () => createStaticComboBoxStory({
  baseOptions: usStateOptions,
  placeholder: 'Select an item',
  selectionMode: 'multiple',
  showSelectedStateRegion: true
});

const usStateOptions = [
  {id: 'AL', name: 'Alabama'},
  {id: 'AK', name: 'Alaska'},
  {id: 'AS', name: 'American Samoa'},
  {id: 'AZ', name: 'Arizona'},
  {id: 'AR', name: 'Arkansas'},
  {id: 'CA', name: 'California'},
  {id: 'CO', name: 'Colorado'},
  {id: 'CT', name: 'Connecticut'},
  {id: 'DE', name: 'Delaware'},
  {id: 'DC', name: 'District Of Columbia'},
  {id: 'FM', name: 'Federated States Of Micronesia'},
  {id: 'FL', name: 'Florida'},
  {id: 'GA', name: 'Georgia'},
  {id: 'GU', name: 'Guam'},
  {id: 'HI', name: 'Hawaii'},
  {id: 'ID', name: 'Idaho'},
  {id: 'IL', name: 'Illinois'},
  {id: 'IN', name: 'Indiana'},
  {id: 'IA', name: 'Iowa'},
  {id: 'KS', name: 'Kansas'},
  {id: 'KY', name: 'Kentucky'},
  {id: 'LA', name: 'Louisiana'},
  {id: 'ME', name: 'Maine'},
  {id: 'MH', name: 'Marshall Islands'},
  {id: 'MD', name: 'Maryland'},
  {id: 'MA', name: 'Massachusetts'},
  {id: 'MI', name: 'Michigan'},
  {id: 'MN', name: 'Minnesota'},
  {id: 'MS', name: 'Mississippi'},
  {id: 'MO', name: 'Missouri'},
  {id: 'MT', name: 'Montana'},
  {id: 'NE', name: 'Nebraska'},
  {id: 'NV', name: 'Nevada'},
  {id: 'NH', name: 'New Hampshire'},
  {id: 'NJ', name: 'New Jersey'},
  {id: 'NM', name: 'New Mexico'},
  {id: 'NY', name: 'New York'},
  {id: 'NC', name: 'North Carolina'},
  {id: 'ND', name: 'North Dakota'},
  {id: 'MP', name: 'Northern Mariana Islands'},
  {id: 'OH', name: 'Ohio'},
  {id: 'OK', name: 'Oklahoma'},
  {id: 'OR', name: 'Oregon'},
  {id: 'PW', name: 'Palau'},
  {id: 'PA', name: 'Pennsylvania'},
  {id: 'PR', name: 'Puerto Rico'},
  {id: 'RI', name: 'Rhode Island'},
  {id: 'SC', name: 'South Carolina'},
  {id: 'SD', name: 'South Dakota'},
  {id: 'TN', name: 'Tennessee'},
  {id: 'TX', name: 'Texas'},
  {id: 'UT', name: 'Utah'},
  {id: 'VT', name: 'Vermont'},
  {id: 'VI', name: 'Virgin Islands'},
  {id: 'VA', name: 'Virginia'},
  {id: 'WA', name: 'Washington'},
  {id: 'WV', name: 'West Virginia'},
  {id: 'WI', name: 'Wisconsin'},
  {id: 'WY', name: 'Wyoming'}
];
