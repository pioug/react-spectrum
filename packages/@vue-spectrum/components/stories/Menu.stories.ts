import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueMenu, VuePopover} from '@vue-spectrum/components';
import {ref} from 'vue';

type MenuItem = {
  key: string,
  label: string
};

type MenuSection = {
  label?: string,
  items: MenuItem[]
};

const meta = {
  title: 'React Aria Components/Menu',
  component: VueMenu
} satisfies Meta<typeof VueMenu>;

export default meta;

type MenuStory = StoryFn<typeof VueMenu>;
type SubmenuExampleStory = StoryObj<typeof meta>;

function createTriggerMenuStory(sections: MenuSection[]) {
  return {
    components: {
      VueButton,
      VueMenu,
      VuePopover
    },
    setup() {
      let open = ref(false);
      let selected = ref('');

      let onAction = (value: string) => {
        action('onAction')(value);
        selected.value = value;
        open.value = false;
      };

      return {
        onAction,
        open,
        sections,
        selected
      };
    },
    template: `
      <div>
        <VueButton aria-label="Menu" variant="secondary" @click="open = !open">☰</VueButton>
        <VuePopover :open="open" placement="bottom" @close="open = false">
          <div>
            <template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
              <VueMenu
                v-model="selected"
                class="menu"
                :items="section.items"
                :label="section.label"
                selectionMode="none"
                @action="onAction" />
              <div
                v-if="sectionIndex < sections.length - 1"
                style="border-top: 1px solid gray; margin: 2px 5px;" />
            </template>
          </div>
        </VuePopover>
      </div>
    `
  };
}

export const MenuExample: MenuStory = () => createTriggerMenuStory([
  {
    label: 'Section 1',
    items: [
      {key: 'Foo', label: 'Foo'},
      {key: 'Bar', label: 'Bar'},
      {key: 'Baz', label: 'Baz'},
      {key: 'Google', label: 'Google'}
    ]
  },
  {
    label: 'Section 2',
    items: [
      {key: 'Foo 2', label: 'Foo'},
      {key: 'Bar 2', label: 'Bar'},
      {key: 'Baz 2', label: 'Baz'}
    ]
  }
]);

export const MenuComplex: MenuStory = () => createTriggerMenuStory([
  {
    items: [
      {key: 'Copy', label: 'Copy ⌘C'},
      {key: 'Cut', label: 'Cut ⌘X'},
      {key: 'Paste', label: 'Paste ⌘V'}
    ]
  }
]);

export const MenuScrollPaddingExample: MenuStory = () => createTriggerMenuStory([
  {
    label: 'Section 1',
    items: Array.from({length: 30}, (_, index) => ({
      key: `Item ${index + 1}`,
      label: `Item ${index + 1}`
    }))
  }
]);

export const SubmenuExample: SubmenuExampleStory = {
  render: () => createTriggerMenuStory([
    {
      label: 'Submenu example',
      items: [
        {key: 'Foo', label: 'Foo'},
        {key: 'Bar', label: 'Bar >'},
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ]),
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

export const SubmenuNestedExample: SubmenuExampleStory = {
  render: () => createTriggerMenuStory([
    {
      label: 'Nested submenu example',
      items: [
        {key: 'Foo', label: 'Foo'},
        {key: 'Bar', label: 'Bar > Nested >'},
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ]),
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

export const SubmenuManyItemsExample: SubmenuExampleStory = {
  render: () => createTriggerMenuStory([
    {
      label: 'Many submenu items',
      items: [
        {key: 'Lvl 1 Item 1', label: 'Lvl 1 Item 1'},
        {key: 'Lvl 1 Item 2', label: 'Lvl 1 Item 2 >'},
        ...Array.from({length: 30}, (_, index) => ({
          key: `Lvl 1 Item ${index + 3}`,
          label: `Lvl 1 Item ${index + 3}`
        }))
      ]
    }
  ]),
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

export const SubmenuDisabledExample: SubmenuExampleStory = {
  render: () => createTriggerMenuStory([
    {
      label: 'Disabled submenu example',
      items: [
        {key: 'Foo', label: 'Foo'},
        {key: 'Bar', label: 'Bar (disabled)'},
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ]),
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

export const SubmenuSectionsExample: SubmenuExampleStory = {
  render: () => createTriggerMenuStory([
    {
      label: 'Section 1',
      items: [
        {key: 'Section 1: Foo', label: 'Section 1: Foo'},
        {key: 'Section 1: Bar', label: 'Section 1: Bar >'},
        {key: 'Section 1: Baz', label: 'Section 1: Baz'}
      ]
    },
    {
      label: 'Section 2',
      items: [
        {key: 'Section 2: Foo', label: 'Section 2: Foo'},
        {key: 'Section 2: Bar', label: 'Section 2: Bar'},
        {key: 'Section 2: Baz', label: 'Section 2: Baz'}
      ]
    }
  ])
};

export const SubdialogExample: SubmenuExampleStory = {
  render: () => createTriggerMenuStory([
    {
      label: 'Subdialog example',
      items: [
        {key: 'Foo', label: 'Foo'},
        {key: 'Bar', label: 'Bar > Dialog'},
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ]),
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

export const MenuCustomRender: MenuStory = () => createTriggerMenuStory([
  {
    label: 'Custom render menu',
    items: [
      {key: 'Google', label: 'Google'}
    ]
  }
]);

export const VirtualizedExample: MenuStory = () => createTriggerMenuStory([
  {
    label: 'Virtualized menu',
    items: Array.from({length: 600}, (_, index) => ({
      key: `Item ${index + 1}`,
      label: `Item ${index + 1}`
    }))
  }
]);
