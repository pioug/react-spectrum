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
  excludeStories: ['render']
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
    modelValue: '2'
  })
};

export const SingleDefaultSelectedKeyUncontrolledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    modelValue: 'Kangaroo'
  })
};

export const MultipleDefaultSelectedKeyControlledStatic: Story = {
  render: () => renderMenu({
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['2', '5']
  })
};

export const MultipleSelectedKeyControlledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['Kangaroo', 'Devon']
  })
};

export const MultipleDefaultSelectedKeyUncontrolledStatic: Story = {
  render: () => renderMenu({
    items: SELECTION_STATIC_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['2', '5']
  })
};

export const MultipleDefaultSelectedKeyUncontrolledGenerative: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple',
    modelValue: ['Kangaroo', 'Devon']
  })
};

export const MenuWithAutoFocusTrue: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'autoFocus=true parity scenario')
};

export const MenuWithAutoFocusFalse: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'autoFocus=false parity scenario')
};

export const MenuWithAutoFocusTrueDefaultSelectedKeyUncontrolledSelectionModeSingle: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'single',
    modelValue: 'Kangaroo'
  }, 'autoFocus=true with uncontrolled default selected key parity scenario')
};

export const MenuWithAutoFocusFirst: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'autoFocus="first" parity scenario')
};

export const MenuWithAutoFocusLast: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'autoFocus="last" parity scenario')
};

export const MenuWithKeyboardSelectionWrappingFalse: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'Keyboard wrapping disabled parity scenario')
};

export const AlignEnd: Story = {
  render: () => renderMenuWithNote({
    items: SIMPLE_ITEMS
  }, 'align="end" parity scenario')
};

export const DirectionTop: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="top" parity scenario')
};

export const DirectionBottom: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="bottom" parity scenario')
};

export const DirectionStart: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="start" parity scenario')
};

export const DirectionStartAlignEnd: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="start", align="end" parity scenario')
};

export const DirectionEnd: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="end" parity scenario')
};

export const DirectionEndAlignEnd: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="end", align="end" parity scenario')
};

export const DirectionLeft: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="left" parity scenario')
};

export const DirectionLeftAlignEnd: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="left", align="end" parity scenario')
};

export const DirectionRight: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="right" parity scenario')
};

export const DirectionRightAlignEnd: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'direction="right", align="end" parity scenario')
};

export const ShouldFlip: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'shouldFlip parity scenario')
};

export const IsOpen: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    isExpanded: true
  })
};

export const DefaultOpen: Story = {
  render: () => renderMenu({
    items: SECTION_GENERATIVE_ITEMS,
    isExpanded: true
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
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'closeOnSelect=false parity scenario')
};

export const CloseOnSelectTrueMultiselectMenu: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS,
    selectionMode: 'multiple'
  }, 'closeOnSelect=true with multiselect parity scenario')
};

export const MenuWithSemanticElementsStatic: Story = {
  render: () => renderMenuWithNote({
    items: SEMANTIC_ITEMS,
    label: 'Menu'
  }, 'Semantic labels and shortcut text (static)')
};

export const MenuWithSemanticElementsGenerative: Story = {
  render: () => renderMenuWithNote({
    items: [...SEMANTIC_ITEMS],
    label: 'Menu'
  }, 'Semantic labels and shortcut text (generative)')
};

export const MenuShouldPreventScrolling: Story = {
  render: () => ({
    components: {MenuTrigger},
    setup() {
      return {
        args: {
          items: SECTION_GENERATIVE_ITEMS
        }
      };
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
  })
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
  })
};

export const WithFalsyKey: Story = {
  render: () => renderMenu({
    items: [
      {key: 0, label: 'Key = 0'},
      {key: 1, label: 'Key = 1'}
    ]
  })
};

export const MenuTriggerWithTriggerLongPress: Story = {
  render: () => renderMenuWithNote({
    items: SECTION_GENERATIVE_ITEMS
  }, 'trigger="longPress" parity scenario')
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
  })
};

export const WithTranslations: Story = {
  render: () => renderMenu({
    label: 'Languages',
    items: TRANSLATED_ITEMS
  })
};

export const MenuItemUnavailable: Story = {
  render: () => renderMenuWithNote({
    label: 'Menu',
    items: UNAVAILABLE_ITEMS
  }, 'Unavailable item parity scenario')
};

export const MenuItemUnavailableWithSelection: Story = {
  render: () => renderMenuWithNote({
    label: 'Menu',
    items: UNAVAILABLE_ITEMS,
    selectionMode: 'multiple'
  }, 'Unavailable items with selection parity scenario')
};

export const MenuItemUnavailableDynamic: Story = {
  render: () => renderMenuWithNote({
    label: 'Menu',
    items: FLAT_MENU_ITEMS.map((item) => item === 'Kangaroo' ? `${item} (unavailable)` : item)
  }, 'Unavailable dynamic items parity scenario')
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
  render: (args) => renderMenuWithNote({
    label: 'Menu',
    items: LINK_ITEMS,
    ...args
  }, 'Includes link-like menu items'),
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
