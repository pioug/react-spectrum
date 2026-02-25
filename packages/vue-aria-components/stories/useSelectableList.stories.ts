import {computed} from 'vue';
import {ListKeyboardDelegate, useSelectableCollection, useSelectableItem, useSelectableList} from '@vue-aria/selection';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type SelectableListArgs = {
  disallowEmptySelection?: boolean,
  isSubUlRelativelyPositioned?: boolean,
  isUlRelativelyPositioned?: boolean,
  selectionBehavior?: 'replace' | 'toggle',
  selectionMode?: 'multiple' | 'single'
};

type SelectableOption = {
  key: string,
  textValue: string
};

type SelectableGroup = {
  items: SelectableOption[],
  title: string
};

const groupedOptions = [
  {
    items: [
      {key: 'trumpet', textValue: 'Trumpet'},
      {key: 'horn', textValue: 'Horn'},
      {key: 'trombone', textValue: 'Trombone'},
      {key: 'tuba', textValue: 'Tuba'}
    ],
    title: 'Brass'
  },
  {
    items: [
      {key: 'violin', textValue: 'Violin'},
      {key: 'viola', textValue: 'Viola'},
      {key: 'cello', textValue: 'Cello'},
      {key: 'harp', textValue: 'Harp'}
    ],
    title: 'String'
  },
  {
    items: [
      {key: 'flute', textValue: 'Flute'},
      {key: 'oboe', textValue: 'Oboe'},
      {key: 'clarinet', textValue: 'Clarinet'}
    ],
    title: 'Wind'
  },
  {
    items: [
      {key: 'piano', textValue: 'Piano'},
      {key: 'drums', textValue: 'Drums'}
    ],
    title: 'Percussion'
  }
] satisfies SelectableGroup[];

const simpleOptions = [
  {key: 'paco', textValue: 'Paco de Lucia'},
  {key: 'vicente', textValue: 'Vicente Amigo'},
  {key: 'gerardo', textValue: 'Gerardo Nunez'}
] satisfies SelectableOption[];

const meta = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'list', enabled: false}
        ]
      }
    }
  },
  title: 'useSelectableList'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderGroupedSelectableList(args: SelectableListArgs) {
  const flatOptions = groupedOptions.flatMap((group) => group.items);

  return {
    setup() {
      let selectableList = useSelectableList({
        selectionMode: 'single'
      });
      let selectableCollection = useSelectableCollection({
        keyboardDelegate: new ListKeyboardDelegate(flatOptions),
        selectionManager: selectableList.selectionManager
      });
      let itemMap = new Map(flatOptions.map((option) => [
        option.key,
        useSelectableItem({key: option.key}, selectableList.selectionManager)
      ]));

      selectableList.selectionManager.setFocusedKey(flatOptions[0]?.key ?? null);
      if (flatOptions[0] != null) {
        selectableList.selectionManager.select(flatOptions[0].key);
      }

      let listProps = computed(() => ({
        ...selectableList.listProps.value,
        ...selectableCollection.collectionProps.value
      }));

      return {
        args,
        getItemProps: (key: string) => itemMap.get(key)?.itemProps.value,
        getItemStates: (key: string) => itemMap.get(key)?.states.value,
        groupedOptions,
        listProps
      };
    },
    template: `
      <ul
        v-bind="listProps"
        style="height: 200px; overflow: auto; padding: 10px; margin: 0; list-style: none; border-top-width: 10px; border-bottom-width: 20px; border-style: solid; border-color: transparent;"
        :style="{position: args.isUlRelativelyPositioned ? 'relative' : 'static'}">
        <template v-for="group in groupedOptions" :key="group.title">
          <div style="text-transform: uppercase;">{{group.title}}</div>
          <ul
            style="padding: 0; margin: 0; list-style: none;"
            :style="{position: args.isSubUlRelativelyPositioned ? 'relative' : 'static'}">
            <li
              v-for="item in group.items"
              :key="item.key"
              v-bind="getItemProps(item.key)"
              :style="{
                backgroundColor: getItemStates(item.key)?.isFocused ? 'gray' : 'white',
                fontWeight: getItemStates(item.key)?.isFocused ? 'bold' : 'normal'
              }">
              {{item.textValue}}
            </li>
          </ul>
        </template>
      </ul>
    `
  };
}

function renderSimpleSelectableList(args: SelectableListArgs) {
  return {
    setup() {
      let selectableList = useSelectableList({
        disallowEmptySelection: args.disallowEmptySelection,
        selectionBehavior: args.selectionBehavior,
        selectionMode: args.selectionMode
      });
      let selectableCollection = useSelectableCollection({
        keyboardDelegate: new ListKeyboardDelegate(simpleOptions),
        selectionManager: selectableList.selectionManager
      });
      let itemMap = new Map(simpleOptions.map((option) => [
        option.key,
        useSelectableItem({key: option.key}, selectableList.selectionManager)
      ]));
      let listProps = computed(() => ({
        ...selectableList.listProps.value,
        ...selectableCollection.collectionProps.value,
        'aria-label': 'test listbox'
      }));

      return {
        getItemProps: (key: string) => itemMap.get(key)?.itemProps.value,
        getItemStates: (key: string) => itemMap.get(key)?.states.value,
        listProps,
        simpleOptions
      };
    },
    template: `
      <ul
        v-bind="listProps"
        style="padding: 8px; border: 1px solid #ccc; max-width: 280px; list-style: none;">
        <li
          v-for="item in simpleOptions"
          :key="item.key"
          v-bind="getItemProps(item.key)"
          :style="{
            background: getItemStates(item.key)?.isSelected ? 'dodgerblue' : undefined,
            color: getItemStates(item.key)?.isSelected ? '#fff' : undefined
          }">
          {{item.textValue}}
        </li>
      </ul>
    `
  };
}

export const StaticUlStaticSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: false, isSubUlRelativelyPositioned: false}),
  name: 'Static ul, static sub ul',
  parameters: {
    description: {
      data: 'Built to test if focusing an element scrolls into view.'
    }
  }
};

export const StaticUlRelativeSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: false, isSubUlRelativelyPositioned: true}),
  name: 'Static ul, relative sub ul'
};

export const RelativeUlStaticSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: true, isSubUlRelativelyPositioned: false}),
  name: 'Relative ul, static sub ul'
};

export const RelativeUlRelativeSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: true, isSubUlRelativelyPositioned: true}),
  name: 'Relative ul, relative sub ul'
};

export const SingleSelectAllowEmptySelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'single'}),
  name: 'single select, allow empty, select on focus'
};

export const SingleSelectDisallowEmptySelectionSelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'single', disallowEmptySelection: true}),
  name: 'single select, disallow empty selection, select on focus'
};

export const MultiSelectReplaceOnPressSelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'multiple', selectionBehavior: 'replace'}),
  name: 'multi select, replace on press, select on focus'
};

export const MultiSelectAllowEmptySelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'multiple'}),
  name: 'multi select, allow empty, select on focus'
};

export const MultiSelectDisallowEmptySelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'multiple', disallowEmptySelection: true}),
  name: 'multi select, disallow empty, select on focus'
};
