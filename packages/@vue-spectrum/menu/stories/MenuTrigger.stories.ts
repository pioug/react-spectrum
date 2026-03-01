import {ActionButton, ToggleButton} from '@vue-spectrum/button';
import {MenuTrigger} from '../src';
import {action} from 'storybook/actions';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const SIMPLE_ITEMS = [
  'One',
  'Two',
  'Three'
];

const FLAT_MENU_ITEMS = [
  'Aardvark',
  'Kangaroo',
  'Snake',
  'Danni',
  'Devon',
  'Ross',
  'Puppy',
  'Doggo',
  'Floof'
];

const SECTION_STATIC_ITEMS = [
  {
    key: 'section-1',
    isSection: true,
    label: 'Section 1',
    children: [
      {key: 'one', label: 'One'},
      {key: 'two', label: 'Two'},
      {key: 'three', label: 'Three'}
    ]
  },
  {
    key: 'section-2',
    isSection: true,
    label: 'Section 2',
    children: [
      {key: 'four', label: 'Four'},
      {key: 'five', label: 'Five'},
      {key: 'six', label: 'Six'}
    ]
  }
];

const SECTION_GENERATIVE_ITEMS = [
  {
    key: 'animals',
    isSection: true,
    label: 'Animals',
    children: [
      {key: 'Aardvark', label: 'Aardvark'},
      {key: 'Kangaroo', label: 'Kangaroo'},
      {key: 'Snake', label: 'Snake'}
    ]
  },
  {
    key: 'people',
    isSection: true,
    label: 'People',
    children: [
      {key: 'Danni', label: 'Danni'},
      {key: 'Devon', label: 'Devon'},
      {key: 'Ross', label: 'Ross'}
    ]
  }
];

const SECTION_GENERATIVE_MANY_ITEMS = [
  {
    key: 'section-1',
    isSection: true,
    label: 'Section 1',
    children: Array.from({length: 50}, (_, index) => ({
      key: `s1-${index}`,
      label: `Item ${index}`
    }))
  },
  {
    key: 'section-2',
    isSection: true,
    label: 'Section 2',
    children: Array.from({length: 50}, (_, index) => ({
      key: `s2-${index}`,
      label: `Item ${index + 50}`
    }))
  }
];

const TITLELESS_SECTION_ITEMS = [
  {
    key: 'section-a',
    ariaLabel: 'Section 1',
    isSection: true,
    children: [
      {key: 'one', label: 'One'},
      {key: 'two', label: 'Two'},
      {key: 'three', label: 'Three'}
    ]
  },
  {
    key: 'section-b',
    ariaLabel: 'Section 2',
    isSection: true,
    children: [
      {key: 'four', label: 'Four'},
      {key: 'five', label: 'Five'},
      {key: 'six', label: 'Six'}
    ]
  }
];

const FALSY_ITEM_KEYS = [
  {
    key: 1,
    isSection: true,
    label: 'Animals',
    children: [
      {key: 0, label: 'id=0'},
      {key: 2, label: 'Snake'}
    ]
  },
  {
    key: 3,
    isSection: true,
    label: 'People',
    children: [
      {key: 4, label: 'Danni'},
      {key: 5, label: 'Devon'},
      {key: 6, label: 'Ross'}
    ]
  }
];

const SELECTION_STATIC_ITEMS = [
  {
    key: 'section-1',
    isSection: true,
    label: 'Section 1',
    children: [
      {key: '1', label: 'One'},
      {key: '2', label: 'Two'},
      {key: '3', label: 'Three'}
    ]
  },
  {
    key: 'section-2',
    isSection: true,
    label: 'Section 2',
    children: [
      {key: '4', label: 'Four'},
      {key: '5', label: 'Five'},
      {key: '6', label: 'Six'},
      {key: '7', label: 'Seven'}
    ]
  }
];

const SEMANTIC_ITEMS = [
  {key: 'copy', label: 'Copy  ⌘C'},
  {key: 'cut', label: 'Cut  ⌘X'},
  {key: 'paste', label: 'Paste  ⌘V'}
];

const TRANSLATED_ITEMS = [
  {key: 'copy', label: 'Copy  ⌘C'},
  {key: 'cut', label: 'Cut  ⌘X'},
  {key: 'paste', label: 'Paste  ⌘V'}
];

const LINK_ITEMS = [
  {key: 'adobe', label: 'Adobe', href: 'https://adobe.com'},
  {key: 'google', label: 'Google', href: 'https://google.com'},
  {key: 'apple', label: 'Apple', href: 'https://apple.com'}
];

const UNAVAILABLE_ITEMS = [
  {key: '1', label: 'One'},
  {key: 'foo', label: 'Two', disabled: true},
  {key: 'baz', label: 'Two point five', disabled: true},
  {key: '3', label: 'Three'},
  {key: 'bar', label: 'Four', disabled: true},
  {key: '5', label: 'Five'}
];

const UNAVAILABLE_WITH_SELECTION_ITEMS = [
  {key: '1', label: 'One'},
  {key: 'foo', label: 'Two', disabled: true},
  {key: 'baz', label: 'Two point five'},
  {key: '3', label: 'Three'},
  {key: 'bar', label: 'Four'},
  {key: '5', label: 'Five'}
];

const meta: Meta<typeof MenuTrigger> = {
  title: 'MenuTrigger',
  component: MenuTrigger,
  excludeStories: ['render']
};

export default meta;

type Story = StoryObj<typeof meta>;

type RenderMenuOptions = {
  triggerLabel?: string
};

function renderMenu(args: StoryArgs, options: RenderMenuOptions = {}) {
  let {triggerLabel = 'Menu Button'} = options;
  return {
    components: {ActionButton, MenuTrigger},
    setup() {
      return {
        args,
        triggerLabel,
        onActionEvent: action('onAction'),
        onOpenChange: action('onOpenChange')
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 250px 0;">
        <MenuTrigger
          v-bind="args"
          @action="onActionEvent($event)"
          @open-change="onOpenChange($event)">
          <template #trigger>
            <ActionButton :is-disabled="Boolean(args.isDisabled)">
              {{ triggerLabel }}
            </ActionButton>
          </template>
        </MenuTrigger>
      </div>
    `
  };
}

export function render(args: StoryArgs) {
  return renderMenu(args);
}

export const DefaultMenuStatic: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: SIMPLE_ITEMS
  })
};

export const DefaultMenuGenerative: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: FLAT_MENU_ITEMS
  })
};

export const DefaultMenuWSectionStatic: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: SECTION_STATIC_ITEMS
  })
};

export const DefaultMenuWSectionGenerative: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: SECTION_GENERATIVE_ITEMS
  })
};

export const DefaultMenuWSectionGenerativeManyItems: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: SECTION_GENERATIVE_MANY_ITEMS
  })
};

export const DefaultMenuWTitlelessSectionsStatic: Story = {
  render: () => renderMenu({
    items: TITLELESS_SECTION_ITEMS
  })
};

export const DefaultMenuWTitlelessSectionsGenerative: Story = {
  render: () => renderMenu({
    items: TITLELESS_SECTION_ITEMS
  })
};

export const WithFalsyItemKeys: Story = {
  render: () => renderMenu({
    items: FALSY_ITEM_KEYS
  })
};

export const SingleSelectedKeyControlledStatic: Story = {
  render: () => renderMenu({
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'single',
    modelValue: '2'
  })
};

export const SingleSelectedKeyControlledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    modelValue: 'Kangaroo'
  })
};

export const SingleDefaultSelectedKeyUncontrolledStatic: Story = {
  render: () => renderMenu({
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'single',
    defaultSelectedKeys: new Set(['2'])
  })
};

export const SingleDefaultSelectedKeyUncontrolledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    defaultSelectedKeys: new Set(['Kangaroo'])
  })
};

export const MultipleDefaultSelectedKeyControlledStatic: Story = {
  render: () => renderMenu({
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'multiple',
    modelValue: new Set(['2', '5']),
    disabledKeys: new Set(['1', '3'])
  })
};

export const MultipleSelectedKeyControlledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple',
    modelValue: new Set(['Kangaroo', 'Devon'])
  })
};

export const MultipleDefaultSelectedKeyUncontrolledStatic: Story = {
  render: () => renderMenu({
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'multiple',
    defaultSelectedKeys: new Set(['2', '5']),
    disabledKeys: new Set(['1', '3'])
  })
};

export const MultipleDefaultSelectedKeyUncontrolledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple',
    defaultSelectedKeys: new Set(['Kangaroo', 'Devon'])
  })
};

export const MenuWithAutoFocusTrue: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    autoFocus: true
  })
};

export const MenuWithAutoFocusFalse: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    autoFocus: false
  })
};

export const MenuWithAutoFocusTrueDefaultSelectedKeyUncontrolledSelectionModeSingle: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    autoFocus: true,
    selectionMode: 'single',
    defaultSelectedKeys: new Set(['Kangaroo'])
  })
};

export const MenuWithAutoFocusFirst: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    autoFocus: 'first'
  })
};

export const MenuWithAutoFocusLast: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    autoFocus: 'last'
  })
};

export const MenuWithKeyboardSelectionWrappingFalse: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    shouldFocusWrap: false
  })
};

export const AlignEnd: Story = {
  render: () => renderMenu({
    items: SIMPLE_ITEMS,
    align: 'end'
  })
};

export const DirectionTop: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    direction: 'top'
  })
};

export const DirectionBottom: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    direction: 'bottom'
  })
};

export const DirectionStart: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    direction: 'start'
  })
};

export const DirectionStartAlignEnd: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    align: 'end',
    direction: 'start'
  })
};

export const DirectionEnd: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    direction: 'end'
  })
};

export const DirectionEndAlignEnd: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    align: 'end',
    direction: 'end'
  })
};

export const DirectionLeft: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    direction: 'left'
  })
};

export const DirectionLeftAlignEnd: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    align: 'end',
    direction: 'left'
  })
};

export const DirectionRight: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    direction: 'right'
  })
};

export const DirectionRightAlignEnd: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    align: 'end',
    direction: 'right'
  })
};

export const ShouldFlip: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    shouldFlip: true
  })
};

export const IsOpen: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    isOpen: true
  })
};

export const DefaultOpen: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    defaultOpen: true
  })
};

export const DisabledButton: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    isDisabled: true
  })
};

export const MultiselectMenu: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple'
  })
};

export const NoSelectionAllowedMenu: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'none'
  })
};

export const CloseOnSelectFalse: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    closeOnSelect: false
  })
};

export const CloseOnSelectTrueMultiselectMenu: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    closeOnSelect: true,
    selectionMode: 'multiple'
  })
};

export const MenuWithSemanticElementsStatic: Story = {
  render: () => renderMenu({
    items: SEMANTIC_ITEMS,
    label: 'Menu'
  })
};

export const MenuWithSemanticElementsGenerative: Story = {
  render: () => renderMenu({
    items: [...SEMANTIC_ITEMS],
    label: 'Menu'
  })
};

export const MenuShouldPreventScrolling: Story = {
  render: () => ({
    components: {ActionButton, MenuTrigger},
    setup() {
      return {
        args: {
          defaultOpen: true,
          direction: 'top',
          items: SECTION_GENERATIVE_ITEMS
        }
      };
    },
    template: `
      <div style="height: 100px; display: flex;">
        <div style="padding-top: 100px; height: 100px; overflow: auto; background: antiquewhite;">
          <div style="height: 200px;">
            <div>Shouldn't be able to scroll here while Menu is open.</div>
            <MenuTrigger v-bind="args">
              <template #trigger>
                <ActionButton>Menu Button</ActionButton>
              </template>
            </MenuTrigger>
          </div>
        </div>
        <div style="padding-top: 100px; height: 100px; overflow: auto; flex: 1; background: grey;">
          <div style="height: 200px;">Also shouldn't be able to scroll here while Menu is open.</div>
        </div>
      </div>
    `
  })
};

export const MenuClosesOnBlur: Story = {
  render: () => ({
    components: {ActionButton, MenuTrigger},
    setup() {
      return {
        items: SECTION_GENERATIVE_ITEMS
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 250px 0;">
        <label for="focus-before">Focus before</label>
        <input id="focus-before" />
        <MenuTrigger
          :items="items"
          :disabled-keys="['Snake', 'Ross']">
          <template #trigger>
            <ActionButton>Menu Button</ActionButton>
          </template>
        </MenuTrigger>
        <label for="focus-after">Focus after</label>
        <input id="focus-after" />
      </div>
    `
  })
};

export const WithFalsyKey: Story = {
  render: () => renderMenu({
    items: [
      {key: '1', label: 'One'},
      {key: '', label: 'Two'},
      {key: '3', label: 'Three'}
    ]
  })
};

export const MenuTriggerWithTriggerLongPress: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    trigger: 'longPress'
  })
};

export const ControlledIsOpen: Story = {
  render: () => ({
    components: {ActionButton, MenuTrigger},
    setup() {
      let expanded = ref(false);
      return {
        expanded
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 250px 0;">
        <MenuTrigger
          label="Menu"
          :items="[
            {key: '1', label: 'One'},
            {key: '', label: 'Two'},
            {key: '3', label: 'Three'}
          ]"
          :is-open="expanded"
          @open-change="expanded = $event">
          <template #trigger>
            <ActionButton>Menu Button</ActionButton>
          </template>
        </MenuTrigger>
      </div>
    `
  })
};

export const WithTranslations: Story = {
  render: () => renderMenu({
    items: TRANSLATED_ITEMS
  }, {
    triggerLabel: 'Edit'
  }),
  parameters: {
    description: {
      data: 'Translations included for: Arabic, English, Hebrew, Japanese, Korean, Simplified Chinese, and Traditional Chinese.'
    }
  }
};

export const MenuItemUnavailable: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: UNAVAILABLE_ITEMS
  })
};

export const MenuItemUnavailableWithSelection: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: UNAVAILABLE_WITH_SELECTION_ITEMS,
    selectionMode: 'multiple'
  })
};

export const MenuItemUnavailableDynamic: Story = {
  render: () => renderMenu({
    label: 'Menu',
    items: FLAT_MENU_ITEMS.map((item) => ({
      key: item,
      label: item,
      disabled: item === 'Kangaroo'
    }))
  })
};

export const MenuItemUnavailableToggling: Story = {
  render: () => ({
    components: {ActionButton, MenuTrigger, ToggleButton},
    setup() {
      let unavailable = ref(false);
      return {
        unavailable
      };
    },
    template: `
      <div>
        <ToggleButton v-model="unavailable">Toggle item 2</ToggleButton>
        <div style="display: flex; width: auto; margin: 250px 0;">
          <MenuTrigger
            label="Menu"
            :items="[
              {key: '1', label: 'One'},
              {key: '2', label: 'Two', disabled: unavailable},
              {key: '3', label: 'Three'}
            ]">
            <template #trigger>
              <ActionButton>Menu Button</ActionButton>
            </template>
          </MenuTrigger>
          <input />
        </div>
      </div>
    `
  })
};

export const MenuWithLinks: Story = {
  render: (args) => renderMenu({
    label: 'Menu',
    items: LINK_ITEMS,
    ...args
  }),
  args: {
    selectionMode: 'none'
  },
  argTypes: {
    selectionMode: {
      control: {
        type: 'inline-radio',
        options: ['none', 'single', 'multiple']
      }
    }
  }
};
