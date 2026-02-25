import {ActionButton} from '@vue-spectrum/button';
import {MenuTrigger} from '../src';
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
    label: 'Section 1',
    children: [
      {key: 'one', label: 'One'},
      {key: 'two', label: 'Two'},
      {key: 'three', label: 'Three'}
    ]
  },
  {
    key: 'section-2',
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
    label: 'Animals',
    children: [
      {key: 'Aardvark', label: 'Aardvark'},
      {key: 'Kangaroo', label: 'Kangaroo'},
      {key: 'Snake', label: 'Snake'}
    ]
  },
  {
    key: 'people',
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
    label: 'Section 1',
    children: Array.from({length: 50}, (_, index) => ({
      key: `s1-${index}`,
      label: `Item ${index}`
    }))
  },
  {
    key: 'section-2',
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
    children: [
      {key: 'one', label: 'One'},
      {key: 'two', label: 'Two'},
      {key: 'three', label: 'Three'}
    ]
  },
  {
    key: 'section-b',
    ariaLabel: 'Section 2',
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
    label: 'Animals',
    children: [
      {key: 0, label: 'id=0'},
      {key: 2, label: 'Snake'}
    ]
  },
  {
    key: 3,
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
    label: 'Section 1',
    children: [
      {key: '1', label: 'One'},
      {key: '2', label: 'Two'},
      {key: '3', label: 'Three'}
    ]
  },
  {
    key: 'section-2',
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
  {key: 'en', label: 'English'},
  {key: 'ar', label: 'العربية'},
  {key: 'he', label: 'עברית'},
  {key: 'ja', label: '日本語'},
  {key: 'ko', label: '한국어'},
  {key: 'zh-cn', label: '简体中文'},
  {key: 'zh-tw', label: '繁體中文'}
];

const LINK_ITEMS = [
  {key: 'copy', label: 'Copy'},
  {key: 'paste', label: 'Paste'},
  {key: 'google', label: 'Google (https://google.com)'}
];

const UNAVAILABLE_ITEMS = [
  {key: '1', label: 'One'},
  {key: 'foo', label: 'Two (unavailable)'},
  {key: 'baz', label: 'Two point five (unavailable)'},
  {key: '3', label: 'Three'},
  {key: 'bar', label: 'Four (unavailable)'},
  {key: '5', label: 'Five'}
];

const meta: Meta<typeof MenuTrigger> = {
  title: 'MenuTrigger',
  component: MenuTrigger,
  excludeStories: ['render'],
  args: {
    label: 'Menu trigger',
    items: SIMPLE_ITEMS,
    selectionMode: 'single'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    dataTestid: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isExpanded: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    openKeys: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'select',
      options: [
        'none',
        'single',
        'multiple'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderMenu(args: StoryArgs) {
  return {
    components: {MenuTrigger},
    setup() {
      return {args};
    },
    template: '<MenuTrigger v-bind="args" />'
  };
}

export function render(args: StoryArgs) {
  return renderMenu(args);
}

function renderMenuWithNote(args: StoryArgs, note: string) {
  return {
    components: {MenuTrigger},
    setup() {
      return {args, note};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>{{note}}</div>
        <MenuTrigger v-bind="args" />
      </div>
    `
  };
}

export const DefaultMenuStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    label: 'Menu',
    items: SIMPLE_ITEMS
  },
  name: 'default menu (static)'
};

export const DefaultMenuGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    label: 'Menu',
    items: FLAT_MENU_ITEMS
  },
  name: 'default menu (generative)'
};

export const DefaultMenuWSectionStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    label: 'Menu',
    items: SECTION_STATIC_ITEMS
  },
  name: 'default menu w/ section (static)'
};

export const DefaultMenuWSectionGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    label: 'Menu',
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'default menu w/ section (generative)'
};

export const DefaultMenuWSectionGenerativeManyItems: Story = {
  render: (args) => renderMenu(args),
  args: {
    label: 'Menu',
    items: SECTION_GENERATIVE_MANY_ITEMS
  },
  name: 'default menu w/ section (generative), many items per section'
};

export const DefaultMenuWTitlelessSectionsStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: TITLELESS_SECTION_ITEMS
  },
  name: 'default menu w/ titleless sections (static)'
};

export const DefaultMenuWTitlelessSectionsGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: TITLELESS_SECTION_ITEMS
  },
  name: 'default menu w/ titleless sections (generative)'
};

export const WithFalsyItemKeys: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: FALSY_ITEM_KEYS
  },
  name: 'with falsy item keys'
};

export const SingleSelectedKeyControlledStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'single',
    modelValue: '2'
  },
  name: 'single selected key (controlled, static)'
};

export const SingleSelectedKeyControlledGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    modelValue: 'Kangaroo'
  },
  name: 'single selected key (controlled, generative)'
};

export const SingleDefaultSelectedKeyUncontrolledStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'single',
    modelValue: '2'
  },
  name: 'single default selected key (uncontrolled, static)'
};

export const SingleDefaultSelectedKeyUncontrolledGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    modelValue: 'Kangaroo'
  },
  name: 'single default selected key (uncontrolled, generative)'
};

export const MultipleDefaultSelectedKeyControlledStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['2', '5']
  },
  name: 'multiple default selected key (controlled, static)'
};

export const MultipleSelectedKeyControlledGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['Kangaroo', 'Devon']
  },
  name: 'multiple selected key (controlled, generative)'
};

export const MultipleDefaultSelectedKeyUncontrolledStatic: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['2', '5']
  },
  name: 'multiple default selected key (uncontrolled, static)'
};

export const MultipleDefaultSelectedKeyUncontrolledGenerative: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['Kangaroo', 'Devon']
  },
  name: 'multiple default selected key (uncontrolled, generative)'
};

export const MenuWithAutoFocusTrue: Story = {
  render: (args) => renderMenuWithNote(args, 'autoFocus=true parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'Menu with autoFocus=true'
};

export const MenuWithAutoFocusFalse: Story = {
  render: (args) => renderMenuWithNote(args, 'autoFocus=false parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'Menu with autoFocus=false'
};

export const MenuWithAutoFocusTrueDefaultSelectedKeyUncontrolledSelectionModeSingle: Story = {
  render: (args) => renderMenuWithNote(args, 'autoFocus=true with uncontrolled default selected key parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    modelValue: 'Kangaroo'
  },
  name: 'Menu with autoFocus=true, default selected key (uncontrolled), selectionMode single'
};

export const MenuWithAutoFocusFirst: Story = {
  render: (args) => renderMenuWithNote(args, 'autoFocus="first" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'Menu with autoFocus="first"'
};

export const MenuWithAutoFocusLast: Story = {
  render: (args) => renderMenuWithNote(args, 'autoFocus="last" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'Menu with autoFocus="last"'
};

export const MenuWithKeyboardSelectionWrappingFalse: Story = {
  render: (args) => renderMenuWithNote(args, 'Keyboard wrapping disabled parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'Menu with keyboard selection wrapping false'
};

export const AlignEnd: Story = {
  render: (args) => renderMenuWithNote(args, 'align="end" parity scenario'),
  args: {
    items: SIMPLE_ITEMS
  },
  name: 'align="end"'
};

export const DirectionTop: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="top" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="top"'
};

export const DirectionBottom: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="bottom" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="bottom"'
};

export const DirectionStart: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="start" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="start"'
};

export const DirectionStartAlignEnd: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="start", align="end" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="start", align="end"'
};

export const DirectionEnd: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="end" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="end"'
};

export const DirectionEndAlignEnd: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="end", align="end" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="end", align="end"'
};

export const DirectionLeft: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="left" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="left"'
};

export const DirectionLeftAlignEnd: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="left", align="end" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="left", align="end"'
};

export const DirectionRight: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="right" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="right"'
};

export const DirectionRightAlignEnd: Story = {
  render: (args) => renderMenuWithNote(args, 'direction="right", align="end" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'direction="right", align="end"'
};

export const ShouldFlip: Story = {
  render: (args) => renderMenuWithNote(args, 'shouldFlip parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'shouldFlip'
};

export const IsOpen: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    isExpanded: true
  },
  name: 'isOpen'
};

export const DefaultOpen: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    isExpanded: true
  },
  name: 'defaultOpen'
};

export const DisabledButton: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    isDisabled: true
  },
  name: 'disabled button'
};

export const MultiselectMenu: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple'
  },
  name: 'multiselect menu'
};

export const NoSelectionAllowedMenu: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'none'
  },
  name: 'no selection allowed menu'
};

export const CloseOnSelectFalse: Story = {
  render: (args) => renderMenuWithNote(args, 'closeOnSelect=false parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'closeOnSelect=false'
};

export const CloseOnSelectTrueMultiselectMenu: Story = {
  render: (args) => renderMenuWithNote(args, 'closeOnSelect=true with multiselect parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple'
  },
  name: 'closeOnSelect=true, multiselect menu'
};

export const MenuWithSemanticElementsStatic: Story = {
  render: (args) => renderMenuWithNote(args, 'Semantic labels and shortcut text (static)'),
  args: {
    items: SEMANTIC_ITEMS,
    label: 'Menu'
  },
  name: 'menu with semantic elements (static)'
};

export const MenuWithSemanticElementsGenerative: Story = {
  render: (args) => renderMenuWithNote(args, 'Semantic labels and shortcut text (generative)'),
  args: {
    items: [...SEMANTIC_ITEMS],
    label: 'Menu'
  },
  name: 'menu with semantic elements (generative)'
};

export const MenuShouldPreventScrolling: Story = {
  render: (args) => ({
    components: {MenuTrigger},
    setup() {
      return {args};
    },
    template: `
      <div style="height: 200px; overflow: auto; border: 1px solid #d4d4d8; padding: 12px;">
        <div style="height: 320px; display: grid; align-content: start; gap: 12px;">
          <div>Scroll this area. Menu should remain usable.</div>
          <MenuTrigger v-bind="args" />
          <div>Extra content to force scrolling.</div>
        </div>
      </div>
    `
  }),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'menu should prevent scrolling'
};

export const MenuClosesOnBlur: Story = {
  render: () => ({
    components: {ActionButton, MenuTrigger},
    setup() {
      let expanded = ref(true);
      return {
        expanded
      };
    },
    template: `
      <div style="display: grid; gap: 10px;" @click="expanded = false">
        <div>Click outside the menu region to close.</div>
        <div @click.stop style="display: grid; gap: 8px;">
          <ActionButton @click="expanded = true">Open menu</ActionButton>
          <MenuTrigger
            label="Menu"
            :items="[
              {key: 'one', label: 'One'},
              {key: 'two', label: 'Two'},
              {key: 'three', label: 'Three'}
            ]"
            :is-expanded="expanded"
          />
        </div>
      </div>
    `
  }),
  name: 'menu closes on blur'
};

export const WithFalsyKey: Story = {
  render: (args) => renderMenu(args),
  args: {
    items: [
      {key: 0, label: 'Key = 0'},
      {key: 1, label: 'Key = 1'}
    ]
  },
  name: 'with falsy key'
};

export const MenuTriggerWithTriggerLongPress: Story = {
  render: (args) => renderMenuWithNote(args, 'trigger="longPress" parity scenario'),
  args: {
    items: SECTION_GENERATIVE_ITEMS
  },
  name: 'MenuTrigger with trigger="longPress"'
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
      <div style="display: grid; gap: 10px; justify-items: start;">
        <ActionButton @click="expanded = !expanded">
          {{expanded ? 'Close menu' : 'Open menu'}}
        </ActionButton>
        <MenuTrigger
          label="Menu"
          :items="[
            {key: 'Aardvark', label: 'Aardvark'},
            {key: 'Kangaroo', label: 'Kangaroo'},
            {key: 'Snake', label: 'Snake'}
          ]"
          :is-expanded="expanded"
          @open-change="expanded = $event.length > 0"
        />
      </div>
    `
  }),
  name: 'controlled isOpen'
};

export const WithTranslations: Story = {
  render: (args) => renderMenu(args),
  args: {
    label: 'Languages',
    items: TRANSLATED_ITEMS
  },
  name: 'with translations'
};

export const MenuItemUnavailable: Story = {
  render: (args) => renderMenuWithNote(args, 'Unavailable item parity scenario'),
  args: {
    label: 'Menu',
    items: UNAVAILABLE_ITEMS
  }
};

export const MenuItemUnavailableWithSelection: Story = {
  render: (args) => renderMenuWithNote(args, 'Unavailable items with selection parity scenario'),
  args: {
    label: 'Menu',
    items: UNAVAILABLE_ITEMS,
    selectionMode: 'multiple'
  }
};

export const MenuItemUnavailableDynamic: Story = {
  render: (args) => renderMenuWithNote(args, 'Unavailable dynamic items parity scenario'),
  args: {
    label: 'Menu',
    items: FLAT_MENU_ITEMS.map((item) => item === 'Kangaroo' ? `${item} (unavailable)` : item)
  }
};

export const MenuItemUnavailableToggling: Story = {
  render: () => ({
    components: {ActionButton, MenuTrigger},
    setup() {
      let unavailable = ref(false);
      return {
        unavailable
      };
    },
    template: `
      <div style="display: grid; gap: 10px;">
        <ActionButton @press="unavailable = !unavailable">
          {{unavailable ? 'Set item two available' : 'Set item two unavailable'}}
        </ActionButton>
        <MenuTrigger
          label="Menu"
          :items="[
            {key: '1', label: 'One'},
            {key: '2', label: unavailable ? 'Two (unavailable)' : 'Two'},
            {key: '3', label: 'Three'}
          ]"
        />
      </div>
    `
  })
};

export const MenuWithLinks: Story = {
  render: (args) => renderMenuWithNote(args, 'Includes link-like menu items'),
  args: {
    label: 'Menu',
    items: LINK_ITEMS
  },
  name: 'Menu with links'
};
