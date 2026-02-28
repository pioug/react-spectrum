import {ToggleButton} from '@vue-spectrum/button';
import {SubmenuTrigger} from '../src';
import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type MenuItem = {
  children?: MenuItem[],
  disabled?: boolean,
  key?: number | string,
  label?: string
} | string;

const STATIC_ITEMS: MenuItem[] = [
  {key: 'lvl1-1', label: 'Lvl 1 Item 1'},
  {
    key: 'lvl1-2',
    label: 'Lvl 1 Item 2',
    children: [
      {key: 'lvl2-1', label: 'Lvl 2 Item 1'},
      {key: 'lvl2-2', label: 'Lvl 2 Item 2'},
      {
        key: 'lvl2-3',
        label: 'Lvl 2 Item 3',
        children: [
          {key: 'lvl3-1', label: 'Lvl 3 Item 1'},
          {key: 'lvl3-2', label: 'Lvl 3 Item 2'},
          {key: 'lvl3-3', label: 'Lvl 3 Item 3'}
        ]
      }
    ]
  },
  {key: 'lvl1-3', label: 'Lvl 1 Item 3'}
];

const DYNAMIC_ITEMS: MenuItem[] = [
  {key: 'd-1', label: 'Lvl 1 Item 1'},
  {
    key: 'd-2',
    label: 'Lvl 1 Item 2',
    children: [
      {key: 'd-2-1', label: 'Lvl 2 Item 1'},
      {key: 'd-2-2', label: 'Lvl 2 Item 2'},
      {
        key: 'd-2-3',
        label: 'Lvl 2 Item 3',
        children: [
          {key: 'd-2-3-1', label: 'Lvl 3 Item 1'},
          {key: 'd-2-3-2', label: 'Lvl 3 Item 2'},
          {key: 'd-2-3-3', label: 'Lvl 3 Item 3'}
        ]
      }
    ]
  },
  {key: 'd-3', label: 'Lvl 1 Item 3'}
];

const MANY_ITEMS: MenuItem[] = [
  {key: 'many-1', label: 'Lvl 1 Item 1'},
  {
    key: 'many-2',
    label: 'Lvl 1 Item 2',
    children: [
      ...Array.from({length: 30}, (_, index) => ({key: `many-2-${index + 1}`, label: `Lvl 2 Item ${index + 1}`})),
      {
        key: 'many-2-31',
        label: 'Lvl 2 Item 31',
        children: [
          {key: 'many-3-1', label: 'Lvl 3 Item 1'},
          {key: 'many-3-2', label: 'Lvl 3 Item 2'},
          {key: 'many-3-3', label: 'Lvl 3 Item 3'}
        ]
      }
    ]
  },
  ...Array.from({length: 30}, (_, index) => ({key: `many-1-${index + 3}`, label: `Lvl 1 Item ${index + 3}`}))
];

const STATIC_SECTIONS_ITEMS: MenuItem[] = [
  {
    key: 'section-1',
    label: 'Section 1',
    children: [
      {key: 's1-1', label: 'Sec 1 Lvl 1 Item 1'},
      {key: 's1-2', label: 'Sec 1 Lvl 1 Item 2', children: [{key: 's1-2-1', label: 'Sec 1 Lvl 2 Item 1'}, {key: 's1-2-2', label: 'Sec 1 Lvl 2 Item 2'}]},
      {key: 's1-3', label: 'Sec 1 Lvl 1 Item 3'}
    ]
  },
  {
    key: 'section-2',
    label: 'Section 2',
    children: [
      {key: 's2-1', label: 'Sec 2 Lvl 1 Item 1'},
      {key: 's2-2', label: 'Sec 2 Lvl 1 Item 2', children: [{key: 's2-2-1', label: 'Sec 2 Lvl 2 Item 1'}, {key: 's2-2-2', label: 'Sec 2 Lvl 2 Item 2'}]},
      {key: 's2-3', label: 'Sec 2 Lvl 1 Item 3'}
    ]
  }
];

const DYNAMIC_SECTIONS_ITEMS: MenuItem[] = [
  {
    key: 'dynamic-section-1',
    label: 'Section 1',
    children: [
      {key: 'ds1-1', label: 'Sec 1 Lvl 1 Item 1'},
      {
        key: 'ds1-2',
        label: 'Sec 1 Lvl 1 Item 2',
        children: [
          {key: 'dss1-1', label: 'Sec 1 SubSec 1 Lvl 2 Item 1'},
          {key: 'dss1-2', label: 'Sec 1 SubSec 1 Lvl 2 Item 2'},
          {
            key: 'dss1-3',
            label: 'Sec 1 SubSec 1 Lvl 2 Item 3',
            children: [
              {key: 'dss1-3-1', label: 'Sec 1 SubSec 1.1 Lvl 3 Item 1'},
              {key: 'dss1-3-2', label: 'Sec 1 SubSec 1.1 Lvl 3 Item 2'}
            ]
          }
        ]
      },
      {key: 'ds1-3', label: 'Sec 1 Lvl 1 Item 3'}
    ]
  },
  {
    key: 'dynamic-section-2',
    label: 'Section 2',
    children: [
      {key: 'ds2-1', label: 'Sec 2 Lvl 1 Item 1'},
      {key: 'ds2-2', label: 'Sec 2 Lvl 1 Item 2', children: [{key: 'ds2-2-1', label: 'Sec 2 SubSec 1 Lvl 2 Item 1'}, {key: 'ds2-2-2', label: 'Sec 2 SubSec 1 Lvl 2 Item 2'}]},
      {key: 'ds2-3', label: 'Sec 2 Lvl 1 Item 3'}
    ]
  }
];

const MAIN_SECTION_SUB_NO_SECTION_ITEMS: MenuItem[] = [
  {
    key: 'msn-1',
    label: 'Section 1',
    children: [
      {key: 'msn-1-1', label: 'Sec 1 Lvl 1 Item 1', children: [{key: 'msn-1-1-1', label: 'Sec 1 Lvl 2.1 Item 1'}, {key: 'msn-1-1-2', label: 'Sec 1 Lvl 2.1 Item 2'}]},
      {
        key: 'msn-1-2',
        label: 'Sec 1 Lvl 1 Item 2',
        children: [
          {key: 'msn-1-2-1', label: 'Sec 1 Lvl 2.2 Item 1'},
          {key: 'msn-1-2-2', label: 'Sec 1 Lvl 2.2 Item 2'},
          {key: 'msn-1-2-3', label: 'Sec 1 Lvl 2.2 Item 3', children: [{key: 'msn-1-2-3-1', label: 'Sec 1 Lvl 3.2 Item 1'}]}
        ]
      },
      {key: 'msn-1-3', label: 'Sec 1 Lvl 1 Item 3'}
    ]
  }
];

const MAIN_NO_SECTION_SUB_SECTION_ITEMS: MenuItem[] = [
  {key: 'mns-1', label: 'Lvl 1 Item 1', children: [{key: 'mns-1-s1', label: 'Section 1', children: [{key: 'mns-1-s1-1', label: 'Sec 1 Lvl 2.1 Item 1'}]}]},
  {
    key: 'mns-2',
    label: 'Lvl 1 Item 2',
    children: [
      {
        key: 'mns-2-s1',
        label: 'Section 1',
        children: [
          {key: 'mns-2-s1-1', label: 'Sec 1 Lvl 2 Item 1'},
          {key: 'mns-2-s1-2', label: 'Sec 1 Lvl 2 Item 2'},
          {key: 'mns-2-s1-3', label: 'Sec 1 Lvl 2 Item 3', children: [{key: 'mns-2-s1-3-1', label: 'Sec 1.1 Lvl 3 Item 1'}]}
        ]
      }
    ]
  },
  {key: 'mns-3', label: 'Lvl 1 Item 3'}
];

const MIXED_SECTIONS_ITEMS: MenuItem[] = [
  {key: 'mix-1', label: 'Lvl 1 Item 1'},
  {
    key: 'mix-2',
    label: 'Lvl 1 Item 2',
    children: [
      {
        key: 'mix-2-s1',
        label: 'Section 1',
        children: [
          {key: 'mix-2-s1-1', label: 'Sec 1 Lvl 2 Item 1'},
          {key: 'mix-2-s1-2', label: 'Sec 1 Lvl 2 Item 2'},
          {
            key: 'mix-2-s1-3',
            label: 'Sec 1 Lvl 2 Item 3',
            children: [
              {key: 'mix-2-s1-3-1', label: 'Sec 1 Lvl 3 Item 1', children: [{key: 'mix-2-s1-3-1-1', label: 'Sec 1.1 Lvl 4 Item 1'}]},
              {key: 'mix-2-s1-3-2', label: 'Sec 1 Lvl 3 Item 2'}
            ]
          }
        ]
      }
    ]
  },
  {key: 'mix-3', label: 'Lvl 1 Item 3'}
];

const COMPLEX_ITEMS: MenuItem[] = [
  {
    key: 'font',
    label: 'Font',
    children: [
      {key: 'show-fonts', label: 'Show Fonts'},
      {key: 'bold', label: 'Bold'},
      {key: 'italics', label: 'Italics'},
      {key: 'baseline', label: 'Baseline', children: [{key: 'baseline-default', label: 'Use default'}, {key: 'baseline-super', label: 'Superscript'}]}
    ]
  },
  {
    key: 'text',
    label: 'Text',
    children: [
      {key: 'align-left', label: 'Align Left'},
      {key: 'align-center', label: 'Center'},
      {key: 'align-right', label: 'Align Right'}
    ]
  },
  {
    key: 'indentation',
    label: 'Indentation',
    children: [
      {key: 'indent-inc', label: 'Increase'},
      {key: 'indent-dec', label: 'Decrease'}
    ]
  }
];

const NO_KEYS_ITEMS: MenuItem[] = [
  {label: 'Lvl 1 Item 1'},
  {
    label: 'Lvl 1 Item 2',
    children: [
      {label: 'Lvl 2 Item 1'},
      {label: 'Lvl 2 Item 2'},
      {label: 'Lvl 2 Item 3', children: [{label: 'Lvl 3 Item 1'}, {label: 'Lvl 3 Item 2'}, {label: 'Lvl 3 Item 3'}]}
    ]
  },
  {label: 'Lvl 1 Item 3'}
];

const TAB_ITEMS: MenuItem[] = [
  {key: 'tab-1', label: 'Lvl 1 Item 1'},
  {key: 'tab-2', label: 'Lvl 1 Item 2', children: [{key: 'tab-2-1', label: 'Lvl 2 Item 1'}, {key: 'tab-2-2', label: 'Lvl 2 Item 2'}, {key: 'tab-2-3', label: 'Lvl 2 Item 3'}]},
  {key: 'tab-3', label: 'Lvl 1 Item 3'}
];

function cloneItems(items: MenuItem[]) {
  return JSON.parse(JSON.stringify(items)) as MenuItem[];
}

const meta: Meta<typeof SubmenuTrigger> = {
  title: 'MenuTrigger/Submenu',
  component: SubmenuTrigger,
  excludeStories: ['SubmenuStaticRender', 'SubmenuDynamicRender', 'ComplexRender', 'TabBehaviorRender']
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderSubmenu(args: StoryArgs) {
  return {
    components: {SubmenuTrigger},
    setup() {
      return {
        args,
        onAction: action('onAction'),
        onOpenChange: action('onOpenChange'),
        onSelect: action('onSelectionChange')
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <SubmenuTrigger
          v-bind="args"
          @action="onAction($event)"
          @open-change="onOpenChange($event)"
          @select="onSelect($event)" />
      </div>
    `
  };
}

function renderTabBehavior(args: StoryArgs) {
  return {
    components: {SubmenuTrigger},
    setup() {
      return {
        args
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <input data-testid="inputleft" />
        <div style="display: flex; width: auto; margin: 80px 0;">
          <SubmenuTrigger v-bind="args" />
        </div>
        <input data-testid="inputright" />
      </div>
    `
  };
}

function renderConditionalSubmenu(args: StoryArgs) {
  return {
    components: {SubmenuTrigger, ToggleButton},
    setup() {
      let unavailable = ref(false);
      let items = computed<MenuItem[]>(() => {
        let conditionalItem = unavailable.value
          ? {
            key: 'conditional-2',
            label: 'Lvl 1 Item 2',
            disabled: true
          }
          : {
            key: 'conditional-2',
            label: 'Lvl 1 Item 2',
            children: [
              {key: 'conditional-2-1', label: 'Lvl 2 Item 1'},
              {key: 'conditional-2-2', label: 'Lvl 2 Item 2'},
              {key: 'conditional-2-3', label: 'Lvl 2 Item 3'}
            ]
          };

        return [
          {key: 'conditional-1', label: 'Lvl 1 Item 1'},
          conditionalItem,
          {key: 'conditional-3', label: 'Lvl 1 Item 3'}
        ];
      });

      return {
        args,
        items,
        unavailable
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <ToggleButton v-model="unavailable">Toggle item 2 unavailable</ToggleButton>
        <SubmenuTrigger v-bind="args" :items="items" />
      </div>
    `
  };
}

export const SubmenuStaticRender = (args: StoryArgs = {}) => renderSubmenu({
  label: 'Menu Button',
  items: cloneItems(STATIC_ITEMS),
  isExpanded: true,
  openKeys: new Set(['lvl1-2', 'lvl2-3']),
  ...args
});

export const SubmenuStatic: Story = {
  render: (args) => SubmenuStaticRender(args),
  name: 'static submenu items'
};

export const SubmenuDynamicRender = (args: StoryArgs = {}) => renderSubmenu({
  label: 'Menu Button',
  items: cloneItems(DYNAMIC_ITEMS),
  isExpanded: true,
  openKeys: new Set(['d-2', 'd-2-3']),
  ...args
});

export const SubmenuDynamic: Story = {
  render: (args) => SubmenuDynamicRender(args),
  name: 'dynamic submenu items'
};

export const SubmenuManyItems: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(MANY_ITEMS),
    isExpanded: true,
    openKeys: new Set(['many-2', 'many-2-31']),
    ...args
  }),
  name: 'dynamic submenu with many items'
};

export const SubmenuStaticSections: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(STATIC_SECTIONS_ITEMS),
    isExpanded: true,
    openKeys: new Set(['section-1', 's1-2']),
    ...args
  }),
  name: 'static submenu items with sections'
};

export const SubmenuDynamicSections: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(DYNAMIC_SECTIONS_ITEMS),
    isExpanded: true,
    openKeys: new Set(['dynamic-section-1', 'ds1-2', 'dss1-3']),
    ...args
  }),
  name: 'dynamic submenu items with sections'
};

export const MainSectionsSubNoSections: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(MAIN_SECTION_SUB_NO_SECTION_ITEMS),
    isExpanded: true,
    openKeys: new Set(['msn-1', 'msn-1-2', 'msn-1-2-3']),
    ...args
  }),
  name: 'dynamic, main menu w/ sections, sub menu no sections'
};

export const MainNoSectionsSubSections: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(MAIN_NO_SECTION_SUB_SECTION_ITEMS),
    isExpanded: true,
    openKeys: new Set(['mns-2', 'mns-2-s1', 'mns-2-s1-3']),
    ...args
  }),
  name: 'dynamic, main menu no sections, sub menu w/ sections'
};

export const MixedSections: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(MIXED_SECTIONS_ITEMS),
    isExpanded: true,
    openKeys: new Set(['mix-2', 'mix-2-s1', 'mix-2-s1-3', 'mix-2-s1-3-1']),
    ...args
  }),
  name: 'dynamic, mix of menus w/ sections and w/o sections'
};

export const ComplexRender = (args: StoryArgs = {}) => renderSubmenu({
  label: 'Menu Button',
  items: cloneItems(COMPLEX_ITEMS),
  isExpanded: true,
  openKeys: new Set(['font', 'baseline']),
  ...args
});

export const Complex: Story = {
  render: (args) => ComplexRender(args),
  name: 'complex'
};

export const SubmenuActions: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(STATIC_ITEMS),
    isExpanded: true,
    openKeys: new Set(['lvl1-2', 'lvl2-3']),
    ...args
  }, 'Each level reports actions independently via onAction / onOpenChange.'),
  name: 'submenu onAction and onClose',
  parameters: {
    description: {
      data: 'Each menu has its own onAction and onClose that are triggered only if its direct menu option was acted upon.'
    }
  }
};

export const SubmenuSelection: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(STATIC_ITEMS),
    selectionMode: 'multiple',
    modelValue: new Set(['lvl1-1', 'lvl3-2']),
    isExpanded: true,
    openKeys: new Set(['lvl1-2', 'lvl2-3']),
    ...args
  }),
  name: 'submenu selectionMode and onSelectionChange',
  parameters: {
    description: {
      data: 'Lvl 1 and Lvl 3 menus have multiple selection, Lvl 2 menu has single selection'
    }
  }
};

export const DisabledSubmenuTrigger: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: [
      {key: 'd1', label: 'Lvl 1 Item 1'},
      {
        key: 'd2',
        label: 'Lvl 1 Item 2',
        children: [
          {key: 'd2-1', label: 'Lvl 2 Item 1'},
          {key: 'd2-2', label: 'Lvl 2 Item 2'},
          {key: 'd2-3', label: 'Lvl 2 Item 3', disabled: true, children: [{key: 'd3-1', label: 'Lvl 3 Item 1'}]}
        ]
      },
      {key: 'd3', label: 'Lvl 1 Item 3'}
    ],
    isExpanded: true,
    openKeys: new Set(['d2']),
    ...args
  }),
  name: 'disabled submenu trigger',
  parameters: {
    description: {
      data: 'Lvl 2 submenu trigger is disabled'
    }
  }
};

export const NoKeysProvided: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: cloneItems(NO_KEYS_ITEMS),
    isExpanded: true,
    ...args
  }),
  name: 'no keys provided',
  parameters: {
    description: {
      data: 'No keys are provided so they should be autogenerated. It should allow for duplicated menu item keys across each submenu level, reflected in onAction'
    }
  }
};

export const ConditionalSubmenu: Story = {
  render: (args) => renderConditionalSubmenu({
    label: 'Menu Button',
    isExpanded: true,
    ...args
  }),
  name: 'conditional submenu'
};

export const UnavailableWithSubmenu: Story = {
  render: (args) => renderSubmenu({
    label: 'Menu Button',
    items: [
      {key: 'u1', label: 'Lvl 1 Item 1'},
      {
        key: 'u2',
        label: 'Lvl 1 Item 2',
        children: [
          {key: 'u2-1', label: 'Lvl 2.2 Item 1', disabled: true},
          {key: 'u2-2', label: 'Lvl 2.2 Item 2'},
          {
            key: 'u2-3',
            label: 'Lvl 2.2 Item 3',
            children: [
              {key: 'u3-1', label: 'Lvl 3 Item 1'},
              {key: 'u3-2', label: 'Lvl 3 Item 2'},
              {key: 'u3-3', label: 'Lvl 3 Item 3'}
            ]
          }
        ]
      },
      {key: 'u3', label: 'Lvl 1 Item 3', disabled: true},
      {
        key: 'u4',
        label: 'Lvl 1 Item 4',
        children: [
          {key: 'u4-1', label: 'Lvl 2.4 Item 1'},
          {key: 'u4-2', label: 'Lvl 2.4 Item 2'},
          {key: 'u4-3', label: 'Lvl 2.4 Item 3'}
        ]
      }
    ],
    isExpanded: true,
    openKeys: new Set(['u2', 'u2-3']),
    ...args
  }),
  name: 'with unavailable menu item'
};

export const TabBehaviorRender = (args: StoryArgs = {}) => renderTabBehavior({
  label: 'Menu Button',
  items: cloneItems(TAB_ITEMS),
  isExpanded: true,
  openKeys: new Set(['tab-2']),
  ...args
});

export const TabBehavior: Story = {
  render: (args) => TabBehaviorRender(args),
  name: 'tab behavior',
  parameters: {
    description: {
      data: 'Test tabbing and shift tabbing from within a submenu'
    }
  }
};
