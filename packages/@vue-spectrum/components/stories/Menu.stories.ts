import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueMenu} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Menu',
  component: VueMenu
} satisfies Meta<typeof VueMenu>;

export default meta;

type MenuStory = StoryFn<typeof VueMenu>;
type SubmenuExampleStory = StoryObj<typeof meta>;

function createMenuStory(items: string[], label = 'Menu') {
  return {
    components: {
      VueMenu
    },
    setup() {
      let value = ref('');
      return {
        items,
        label,
        onAction: action('onAction'),
        value
      };
    },
    template: `
      <VueMenu
        v-model="value"
        :items="items"
        :label="label"
        @select="onAction" />
    `
  };
}

export const MenuExample: MenuStory = () => createMenuStory(['Foo', 'Bar', 'Baz', 'Google'], 'Section 1');

export const MenuComplex: MenuStory = () => createMenuStory(['Copy ⌘C', 'Cut ⌘X', 'Paste ⌘V'], 'Complex menu');

export const MenuScrollPaddingExample: MenuStory = () => createMenuStory(
  Array.from({length: 30}, (_, index) => `Item ${index + 1}`),
  'Scrollable menu'
);

export const SubmenuExample: SubmenuExampleStory = {
  render: () => createMenuStory(['Foo', 'Bar >', 'Baz', 'Google'], 'Submenu example'),
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
  render: () => createMenuStory(['Foo', 'Bar > Nested >', 'Baz', 'Google'], 'Nested submenu example'),
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
  render: () => createMenuStory(
    ['Lvl 1 Item 1', 'Lvl 1 Item 2 >', ...Array.from({length: 30}, (_, index) => `Lvl 1 Item ${index + 3}`)],
    'Many submenu items'
  ),
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
  render: () => createMenuStory(['Foo', 'Bar (disabled)', 'Baz', 'Google'], 'Disabled submenu example'),
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
  render: () => createMenuStory(['Section 1: Foo', 'Section 1: Bar >', 'Section 1: Baz', 'Section 2: Foo', 'Section 2: Bar', 'Section 2: Baz'], 'Sectioned submenu example')
};

export const SubdialogExample: SubmenuExampleStory = {
  render: () => createMenuStory(['Foo', 'Bar > Dialog', 'Baz', 'Google'], 'Subdialog example'),
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

export const MenuCustomRender: MenuStory = () => createMenuStory(['Google'], 'Custom render menu');

export const VirtualizedExample: MenuStory = () => createMenuStory(
  Array.from({length: 600}, (_, index) => `Item ${index + 1}`),
  'Virtualized menu'
);
