import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueMenu, VuePopover} from 'vue-aria-components';
import {ref} from 'vue';

type MenuItem = {
  childSections?: MenuSection[],
  children?: MenuItem[],
  disabled?: boolean,
  href?: string,
  key: string,
  label: string
};

type MenuSection = {
  ariaLabel?: string,
  label?: string,
  items: MenuItem[],
  separatorAfter?: boolean
};

const meta = {
  title: 'React Aria Components/Menu',
  component: VueMenu
} satisfies Meta<typeof VueMenu>;

export default meta;

type MenuStory = StoryFn<typeof VueMenu>;
type SubmenuExampleStory = StoryObj<typeof meta>;

function createTriggerMenuStory(sections: MenuSection[], menuArgs: Record<string, unknown> = {}) {
  return {
    components: {
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
        menuArgs,
        onAction,
        open,
        sections,
        selected
      };
    },
    template: `
      <button
        aria-label="Menu"
        aria-haspopup="true"
        class="react-aria-Button"
        :aria-expanded="open ? 'true' : 'false'"
        type="button"
        @click="open = !open">☰</button>
      <VuePopover :open="open" placement="bottom" @close="open = false">
        <VueMenu
          v-model="selected"
          v-bind="menuArgs"
          class="menu"
          :sections="sections"
          selectionMode="none"
          @action="onAction" />
      </VuePopover>
    `
  };
}

export const MenuExample: MenuStory = () => createTriggerMenuStory([
  {
    ariaLabel: 'Section 1',
    items: [
      {key: 'Foo', label: 'Foo'},
      {key: 'Bar', label: 'Bar'},
      {key: 'Baz', label: 'Baz'},
      {key: 'Google', label: 'Google'}
    ],
    separatorAfter: true
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
  render: (args) => createTriggerMenuStory([
    {
      items: [
        {key: 'Foo', label: 'Foo'},
        {
          key: 'Bar',
          label: 'Bar',
          children: [
            {key: 'Submenu Foo', label: 'Submenu Foo'},
            {key: 'Submenu Bar', label: 'Submenu Bar'},
            {key: 'Submenu Baz', label: 'Submenu Baz'}
          ]
        },
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ], {delay: args.delay}),
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
  render: (args) => createTriggerMenuStory([
    {
      items: [
        {key: 'Foo', label: 'Foo'},
        {
          key: 'Bar',
          label: 'Bar',
          children: [
            {key: 'Submenu Foo', label: 'Submenu Foo'},
            {key: 'Submenu Bar', label: 'Submenu Bar'},
            {
              key: 'Submenu Baz',
              label: 'Submenu Baz',
              children: [
                {key: 'Second Submenu Foo', label: 'Second Submenu Foo'},
                {key: 'Second Submenu Bar', label: 'Second Submenu Bar'},
                {key: 'Second Submenu Baz', label: 'Second Submenu Baz'}
              ]
            }
          ]
        },
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ], {delay: args.delay}),
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
  render: (args) => createTriggerMenuStory([
    {
      items: [
        {key: 'Lvl 1 Item 1', label: 'Lvl 1 Item 1'},
        {
          key: 'Lvl 1 Item 2',
          label: 'Lvl 1 Item 2',
          children: [
            ...Array.from({length: 30}, (_, index) => ({
              key: `Lvl 2 Item ${index + 1}`,
              label: `Lvl 2 Item ${index + 1}`
            })),
            {
              key: 'Lvl 2 Item 31',
              label: 'Lvl 2 Item 31',
              children: [
                {key: 'Lvl 3 Item 1', label: 'Lvl 3 Item 1'},
                {key: 'Lvl 3 Item 2', label: 'Lvl 3 Item 2'},
                {key: 'Lvl 3 Item 3', label: 'Lvl 3 Item 3'}
              ]
            }
          ]
        },
        ...Array.from({length: 30}, (_, index) => ({
          key: `Lvl 1 Item ${index + 3}`,
          label: `Lvl 1 Item ${index + 3}`
        }))
      ]
    }
  ], {delay: args.delay}),
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
  render: (args) => createTriggerMenuStory([
    {
      items: [
        {key: 'Foo', label: 'Foo'},
        {
          key: 'Bar',
          label: 'Bar',
          disabled: true,
          children: [
            {key: 'Submenu Foo', label: 'Submenu Foo'},
            {key: 'Submenu Bar', label: 'Submenu Bar'},
            {key: 'Submenu Baz', label: 'Submenu Baz'}
          ]
        },
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ], {delay: args.delay}),
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
        {key: 'Foo', label: 'Foo'},
        {
          key: 'Bar',
          label: 'Bar',
          childSections: [
            {
              label: 'Submenu Section 1',
              items: [
                {key: 'Submenu Foo', label: 'Submenu Foo'},
                {key: 'Submenu Bar', label: 'Submenu Bar'},
                {key: 'Submenu Baz', label: 'Submenu Baz'},
                {key: 'Submenu Google', label: 'Google'}
              ],
              separatorAfter: true
            },
            {
              label: 'Submenu Section 2',
              items: [
                {key: 'Submenu Foo 2', label: 'Submenu Foo'},
                {key: 'Submenu Bar 2', label: 'Submenu Bar'},
                {key: 'Submenu Baz 2', label: 'Submenu Baz'}
              ]
            }
          ]
        },
        {key: 'Baz', label: 'Baz'}
      ],
      separatorAfter: true
    },
    {
      label: 'Section 2',
      items: [
        {key: 'Foo section 2', label: 'Foo'},
        {key: 'Bar section 2', label: 'Bar'},
        {key: 'Baz section 2', label: 'Baz'}
      ]
    }
  ])
};

export const SubdialogExample: SubmenuExampleStory = {
  render: (args) => createTriggerMenuStory([
    {
      items: [
        {key: 'Foo', label: 'Foo'},
        {
          key: 'Bar',
          label: 'Bar',
          children: [
            {key: 'Subdialog field', label: 'Subdialog field'},
            {key: 'Subdialog submit', label: 'Submit'}
          ]
        },
        {key: 'Baz', label: 'Baz'},
        {key: 'Google', label: 'Google'}
      ]
    }
  ], {delay: args.delay}),
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
      {key: 'Google', label: 'Google', href: 'https://google.com'}
    ]
  }
]);

export const VirtualizedExample: MenuStory = () => ({
  components: {
    VueMenu,
    VuePopover
  },
  setup() {
    let open = ref(false);
    let selected = ref('');
    let items = Array.from({length: 600}, (_, index) => ({
      key: `Object ${index + 1}`,
      label: `Object ${index + 1}`
    }));

    let onAction = (value: string) => {
      action('onAction')(value);
      selected.value = value;
      open.value = false;
    };

    return {
      items,
      onAction,
      open,
      selected
    };
  },
  template: `
    <button
      aria-label="Actions"
      aria-haspopup="true"
      class="react-aria-Button"
      :aria-expanded="open ? 'true' : 'false'"
      type="button"
      @click="open = !open">Menu ☰</button>
    <VuePopover :open="open" placement="bottom" @close="open = false">
      <VueMenu
        v-model="selected"
        class="menu"
        :items="items"
        label="Virtualized menu"
        selectionMode="none"
        virtualized
        :visibleItemCount="20"
        :estimatedItemHeight="16"
        @action="onAction" />
    </VuePopover>
  `
});
