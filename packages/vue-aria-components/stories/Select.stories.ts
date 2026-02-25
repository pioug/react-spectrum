import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePicker} from 'vue-aria-components';
import {computed, ref} from 'vue';

type SelectionMode = 'single' | 'multiple';
type StoryArgs = {
  selectionMode?: SelectionMode
};

type SelectOption = {
  disabled?: boolean,
  href?: string,
  key: string,
  label: string
};

const meta = {
  title: 'React Aria Components/Select',
  component: VuePicker,
  argTypes: {
    validationBehavior: {
      control: 'select',
      options: ['native', 'aria']
    },
    selectionMode: {
      control: 'radio',
      options: ['single', 'multiple']
    }
  }
} satisfies Meta<typeof VuePicker>;

export default meta;

type Story = StoryObj<typeof meta>;
type SelectStory = StoryFn<typeof VuePicker>;

const selectLabelStyle = 'color: oklch(0.410821 0 0); display: block; font: 500 14px system-ui; line-height: normal; margin: 0 0 8px;';

const basicOptions: SelectOption[] = [
  {key: 'foo', label: 'Foo'},
  {key: 'bar', label: 'Bar'},
  {key: 'baz', label: 'Baz'},
  {key: 'google', label: 'Google', href: 'http://google.com'}
];

const usStateOptions: SelectOption[] = [
  {key: 'AL', label: 'Alabama'},
  {key: 'AK', label: 'Alaska'},
  {key: 'AS', label: 'American Samoa'},
  {key: 'AZ', label: 'Arizona'},
  {key: 'AR', label: 'Arkansas'},
  {key: 'CA', label: 'California'},
  {key: 'CO', label: 'Colorado'},
  {key: 'CT', label: 'Connecticut'},
  {key: 'DE', label: 'Delaware'},
  {key: 'DC', label: 'District Of Columbia'},
  {key: 'FL', label: 'Florida'},
  {key: 'GA', label: 'Georgia'},
  {key: 'HI', label: 'Hawaii'},
  {key: 'ID', label: 'Idaho'},
  {key: 'IL', label: 'Illinois'},
  {key: 'IN', label: 'Indiana'},
  {key: 'IA', label: 'Iowa'},
  {key: 'KS', label: 'Kansas'},
  {key: 'KY', label: 'Kentucky'},
  {key: 'LA', label: 'Louisiana'},
  {key: 'ME', label: 'Maine'},
  {key: 'MD', label: 'Maryland'},
  {key: 'MA', label: 'Massachusetts'},
  {key: 'MI', label: 'Michigan'},
  {key: 'MN', label: 'Minnesota'},
  {key: 'MS', label: 'Mississippi'},
  {key: 'MO', label: 'Missouri'},
  {key: 'MT', label: 'Montana'},
  {key: 'NE', label: 'Nebraska'},
  {key: 'NV', label: 'Nevada'},
  {key: 'NH', label: 'New Hampshire'},
  {key: 'NJ', label: 'New Jersey'},
  {key: 'NM', label: 'New Mexico'},
  {key: 'NY', label: 'New York'},
  {key: 'NC', label: 'North Carolina'},
  {key: 'ND', label: 'North Dakota'},
  {key: 'OH', label: 'Ohio'},
  {key: 'OK', label: 'Oklahoma'},
  {key: 'OR', label: 'Oregon'},
  {key: 'PA', label: 'Pennsylvania'},
  {key: 'RI', label: 'Rhode Island'},
  {key: 'SC', label: 'South Carolina'},
  {key: 'SD', label: 'South Dakota'},
  {key: 'TN', label: 'Tennessee'},
  {key: 'TX', label: 'Texas'},
  {key: 'UT', label: 'Utah'},
  {key: 'VT', label: 'Vermont'},
  {key: 'VA', label: 'Virginia'},
  {key: 'WA', label: 'Washington'},
  {key: 'WV', label: 'West Virginia'},
  {key: 'WI', label: 'Wisconsin'},
  {key: 'WY', label: 'Wyoming'}
];

const manyItems: SelectOption[] = Array.from({length: 100}, (_entry, index) => ({
  key: `item-${index}`,
  label: `Item ${index}`
}));

interface LiveSelectStoryOptions {
  defaultSelectedKeys?: string[],
  label: string,
  menuStyle?: Record<string, string>,
  options: SelectOption[],
  placeholder?: string,
  selectionMode?: SelectionMode,
  showOpenArrow?: boolean,
  valueTextBuilder?: (props: {
    placeholder: string,
    selectedOptions: SelectOption[],
    selectionMode: SelectionMode
  }) => string
}

function createLiveSelectStory(args: StoryArgs = {}, options: LiveSelectStoryOptions) {
  return {
    setup() {
      let selectionMode = computed<SelectionMode>(() => args.selectionMode ?? options.selectionMode ?? 'single');
      let selectedKeys = ref<string[]>(options.defaultSelectedKeys ? [...options.defaultSelectedKeys] : []);
      let isOpen = ref(false);
      let placeholder = options.placeholder ?? 'Select an item';
      let menuStyle = options.menuStyle ?? {};

      let selectedOptions = computed(() => options.options.filter((option) => selectedKeys.value.includes(option.key)));
      let isPlaceholder = computed(() => selectedOptions.value.length === 0);
      let valueText = computed(() => {
        if (options.valueTextBuilder) {
          return options.valueTextBuilder({
            placeholder,
            selectedOptions: selectedOptions.value,
            selectionMode: selectionMode.value
          });
        }

        if (selectedOptions.value.length === 0) {
          return placeholder;
        }

        if (selectionMode.value === 'multiple' && selectedOptions.value.length > 1) {
          return `${selectedOptions.value.length} selected items`;
        }

        return selectedOptions.value[0].label;
      });
      let arrowSymbol = computed(() => {
        if (!options.showOpenArrow) {
          return '▼';
        }

        return isOpen.value ? '▲' : '▼';
      });

      let toggleMenu = () => {
        isOpen.value = !isOpen.value;
      };

      let selectOption = (option: SelectOption) => {
        if (option.disabled) {
          return;
        }

        action('onAction')(option.key);

        if (selectionMode.value === 'multiple') {
          selectedKeys.value = selectedKeys.value.includes(option.key)
            ? selectedKeys.value.filter((key) => key !== option.key)
            : [...selectedKeys.value, option.key];
        } else {
          selectedKeys.value = [option.key];
          isOpen.value = false;
        }

        action('onSelectionChange')(selectedKeys.value);
      };

      return {
        arrowSymbol,
        isOpen,
        isPlaceholder,
        label: options.label,
        menuStyle,
        options: options.options,
        selectOption,
        selectedKeys,
        selectionMode,
        toggleMenu,
        valueText
      };
    },
    template: `
      <div class="react-aria-Select" data-rac="">
        <span class="react-aria-Label" style="${selectLabelStyle}">{{ label }}</span>
        <button
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button"
          @click="toggleMenu">
          <span class="react-aria-SelectValue" :data-placeholder="isPlaceholder ? 'true' : undefined">{{ valueText }}</span>
          <span aria-hidden="true" style="padding-left: 5px;">{{ arrowSymbol }}</span>
        </button>
        <div
          v-if="isOpen"
          class="react-aria-Popover"
          data-rac=""
          style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 5px;">
          <div
            class="menu"
            role="listbox"
            :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
            :style="menuStyle">
            <div
              v-for="option in options"
              :key="option.key"
              class="item"
              role="option"
              :aria-selected="selectedKeys.includes(option.key) ? 'true' : 'false'"
              :aria-disabled="option.disabled ? 'true' : undefined"
              :data-selected="selectedKeys.includes(option.key) ? '' : undefined"
              :data-disabled="option.disabled ? '' : undefined"
              @click="selectOption(option)">
              <a v-if="option.href" :href="option.href" @click.prevent>{{ option.label }}</a>
              <template v-else>{{ option.label }}</template>
            </div>
          </div>
        </div>
      </div>
    `
  };
}

export const SelectExample: SelectStory = (args) => createLiveSelectStory(args as StoryArgs, {
  label: 'Test',
  options: basicOptions
});

export const SelectRenderProps: SelectStory = (args) => createLiveSelectStory(args as StoryArgs, {
  label: 'Test',
  options: basicOptions,
  showOpenArrow: true,
  valueTextBuilder: ({placeholder, selectedOptions, selectionMode}) => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectionMode === 'multiple' && selectedOptions.length > 1) {
      return `${selectedOptions.length} selected items`;
    }

    return selectedOptions[0].label;
  }
});

export const SelectWithTagGroup: SelectStory = (args) => ({
  setup() {
    let selectionMode = computed<SelectionMode>(() => args.selectionMode ?? 'multiple');
    let selectedKeys = ref<string[]>([]);
    let isOpen = ref(false);
    let options = usStateOptions.slice(0, 12);
    let selectedOptions = computed(() => options.filter((option) => selectedKeys.value.includes(option.key)));

    let toggleOption = (option: SelectOption) => {
      if (selectionMode.value === 'multiple') {
        selectedKeys.value = selectedKeys.value.includes(option.key)
          ? selectedKeys.value.filter((key) => key !== option.key)
          : [...selectedKeys.value, option.key];
      } else {
        selectedKeys.value = [option.key];
      }

      action('onSelectionChange')(selectedKeys.value);
    };

    let removeTag = (key: string) => {
      selectedKeys.value = selectedKeys.value.filter((entry) => entry !== key);
      action('onRemove')(key);
    };

    return {
      isOpen,
      options,
      removeTag,
      selectedKeys,
      selectedOptions,
      toggleOption
    };
  },
  template: `
    <div class="react-aria-Select" data-rac="">
      <span class="react-aria-Label" style="${selectLabelStyle}">States</span>
      <div style="display: flex; gap: 8px; align-items: start; max-width: 250px;">
        <div class="react-aria-TagGroup" data-rac="" aria-label="Selected states" style="display: flex; flex-wrap: wrap; gap: 6px;">
          <span v-if="selectedOptions.length === 0" style="color: oklch(0.410821 0 0); font: 14px system-ui;">No selected items</span>
          <div
            v-for="option in selectedOptions"
            :key="option.key"
            class="react-aria-Tag"
            data-rac=""
            style="display: inline-flex; align-items: center; border: 1px solid #c9c9c9; border-radius: 12px; padding: 2px 8px;">
            <span class="react-aria-Text" slot="label">{{ option.label }}</span>
            <button slot="remove" type="button" style="margin-left: 6px;" @click.stop="removeTag(option.key)">×</button>
          </div>
        </div>
        <button class="react-aria-Button" data-rac="" type="button" @click="isOpen = !isOpen">+</button>
      </div>
      <div
        v-if="isOpen"
        class="react-aria-Popover"
        data-rac=""
        style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 5px; margin-top: 8px; max-width: 250px;">
        <div class="menu" role="listbox" aria-multiselectable="true">
          <div
            v-for="option in options"
            :key="option.key"
            class="item"
            role="option"
            :aria-selected="selectedKeys.includes(option.key) ? 'true' : 'false'"
            :data-selected="selectedKeys.includes(option.key) ? '' : undefined"
            @click="toggleOption(option)">
            {{ option.label }}
          </div>
        </div>
      </div>
    </div>
  `
});

export const SelectManyItems: SelectStory = (args) => createLiveSelectStory(args as StoryArgs, {
  label: 'Test',
  options: usStateOptions,
  menuStyle: {
    maxHeight: '220px',
    overflow: 'auto'
  }
});

export const VirtualizedSelect: SelectStory = (args) => createLiveSelectStory(args as StoryArgs, {
  label: 'Test',
  options: manyItems,
  menuStyle: {
    height: '200px',
    overflow: 'auto'
  }
});

function AsyncVirtualizedCollectionRenderSelectRender(args: {delay: number}) {
  return {
    setup() {
      let allItems: SelectOption[] = [
        {key: 'luke', label: 'Luke Skywalker'},
        {key: 'leia', label: 'Leia Organa'},
        {key: 'han', label: 'Han Solo'},
        {key: 'chewie', label: 'Chewbacca'},
        {key: 'vader', label: 'Darth Vader'},
        {key: 'obiwan', label: 'Obi-Wan Kenobi'},
        {key: 'r2d2', label: 'R2-D2'},
        {key: 'c3po', label: 'C-3PO'},
        {key: 'lando', label: 'Lando Calrissian'},
        {key: 'yoda', label: 'Yoda'},
        {key: 'boba', label: 'Boba Fett'},
        {key: 'anakin', label: 'Anakin Skywalker'}
      ];
      let selectedKey = ref<string | null>(null);
      let isOpen = ref(false);
      let isLoading = ref(false);
      let loadedCount = ref(0);
      let pageSize = 4;
      let delay = computed(() => Number(args.delay ?? 50));
      let visibleItems = computed(() => allItems.slice(0, loadedCount.value));
      let selectedItem = computed(() => allItems.find((item) => item.key === selectedKey.value));

      let loadMore = () => {
        if (isLoading.value || loadedCount.value >= allItems.length) {
          return;
        }

        isLoading.value = true;
        setTimeout(() => {
          loadedCount.value = Math.min(loadedCount.value + pageSize, allItems.length);
          isLoading.value = false;
        }, delay.value);
      };

      let toggleMenu = () => {
        isOpen.value = !isOpen.value;
        if (isOpen.value && loadedCount.value === 0) {
          loadMore();
        }
      };

      let selectOption = (option: SelectOption) => {
        selectedKey.value = option.key;
        isOpen.value = false;
        action('onSelectionChange')(option.key);
      };

      return {
        isLoading,
        isOpen,
        loadMore,
        selectedItem,
        selectOption,
        toggleMenu,
        visibleItems
      };
    },
    template: `
      <div class="react-aria-Select" data-rac="">
        <span class="react-aria-Label" style="${selectLabelStyle}">Async Virtualized Collection render Select</span>
        <button
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button"
          @click="toggleMenu">
          <span class="react-aria-SelectValue" :data-placeholder="selectedItem ? undefined : 'true'">
            {{ selectedItem ? selectedItem.label : 'Select an item' }}
          </span>
          <span v-if="isLoading" aria-hidden="true" style="padding-left: 12px;">⏳</span>
          <span aria-hidden="true" style="padding-left: 5px;">▼</span>
        </button>
        <div
          v-if="isOpen"
          class="react-aria-Popover"
          data-rac=""
          style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 5px;">
          <div class="menu" role="listbox" style="max-height: 180px; overflow: auto;">
            <div
              v-for="option in visibleItems"
              :key="option.key"
              class="item"
              role="option"
              @click="selectOption(option)">
              {{ option.label }}
            </div>
            <button type="button" style="margin-top: 8px;" :disabled="isLoading" @click="loadMore">
              {{ isLoading ? 'Loading...' : 'Load more' }}
            </button>
          </div>
        </div>
      </div>
    `
  };
}

export const AsyncVirtualizedCollectionRenderSelect: Story = {
  render: (args: {delay: number}) => AsyncVirtualizedCollectionRenderSelectRender(args),
  args: {
    delay: 50
  }
};

export const SelectSubmitExample: SelectStory = () => ({
  template: `
    <form style="align-items: flex-start; column-gap: 24px; display: flex; flex-direction: column; row-gap: 24px;">
      <div class="v7C2Sq_textfieldExample" data-rac="" data-required="true" style="display: flex; flex-direction: column;">
        <label class="react-aria-Label" style="${selectLabelStyle}">Username</label>
        <input autocomplete="username" class="react-aria-Input" data-rac="" name="username" required type="text" value="">
      </div>
      <template data-react-aria-hidden="true"></template>
      <div class="react-aria-Select" data-rac="" data-required="true" style="width: 153px;">
        <span class="react-aria-Label" style="${selectLabelStyle}">Company</span>
        <button
          aria-expanded="false"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button">
          <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
          <span aria-hidden="true" style="padding-left: 5px;">▼</span>
        </button>
      </div>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  `
});

export const RequiredSelectWithManyItems = (_props: {selectionMode?: string}) => ({
  template: `
    <form>
      <template data-react-aria-hidden="true"></template>
      <div class="react-aria-Select" data-rac="" data-required="true">
        <span class="react-aria-Label" style="${selectLabelStyle}">Required Select with many items</span>
        <button
          aria-expanded="false"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button">
          <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
          <span aria-hidden="true" style="padding-left: 5px;">▼</span>
        </button>
        <input name="select" required style="display: none;" type="text" value="">
      </div>
      <button class="react-aria-Button" data-rac="" type="submit">Submit</button>
    </form>
  `
});

export const SelectScrollBug = () => ({
  template: `
    <div style="display: flex; flex-direction: row; height: 100vh;">
      <div style="flex: 3;">Scrolling here should do nothing.</div>
      <div style="flex: 1; overflow-y: auto;">
        Scrolling here should scroll the right side.
        <br />
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        <div class="react-aria-Select" data-rac="">
          <span class="react-aria-Label" style="${selectLabelStyle}">Favorite Animal</span>
          <button
            aria-expanded="false"
            aria-haspopup="listbox"
            class="react-aria-Button"
            data-rac=""
            type="button">
            <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
            <span aria-hidden="true">▼</span>
          </button>
        </div>
      </div>
    </div>
  `
});
