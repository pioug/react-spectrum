import {action} from '@storybook/addon-actions';
import {ActionGroup, type SpectrumActionGroupProps} from '../src';
import Book from '@spectrum-icons-vue/workflow/Book';
import {type Component, computed, defineComponent, h, type PropType, ref} from 'vue';
import Copy from '@spectrum-icons-vue/workflow/Copy';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Draw from '@spectrum-icons-vue/workflow/Draw';
import Duplicate from '@spectrum-icons-vue/workflow/Duplicate';
import Info from '@spectrum-icons-vue/workflow/Info';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Move from '@spectrum-icons-vue/workflow/Move';
import MoveTo from '@spectrum-icons-vue/workflow/MoveTo';
import Properties from '@spectrum-icons-vue/workflow/Properties';
import Text from '@spectrum-icons-vue/workflow/Text';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import ViewCard from '@spectrum-icons-vue/workflow/ViewCard';
import ViewGrid from '@spectrum-icons-vue/workflow/ViewGrid';
import ViewList from '@spectrum-icons-vue/workflow/ViewList';

type ActionItem = string | {
  children: string,
  name: string
};

function normalizeStorySelectionKeys(value: unknown): string[] {
  if (value == null || typeof value === 'string') {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>)
    .filter((entry): entry is string | number => typeof entry === 'string' || typeof entry === 'number')
    .map((entry) => String(entry));
}

const viewItems: ActionItem[] = [
  {children: 'Grid view', name: '1'},
  {children: 'List view', name: '2'},
  {children: 'Gallery view', name: '3'}
];
const overflowItems = ['Edit', 'Copy', 'Delete', 'Move', 'Duplicate'];
const toolItems = ['Select', 'Brush', 'Heal', 'Draw', 'Vector draw', 'Sampler'];

const iconMap: Record<string, Component> = {
  'Document setup': Book,
  'Settings': Properties,
  'Grid view': ViewGrid,
  'List view': ViewList,
  'Gallery view': ViewCard,
  'Edit': Draw,
  'Copy': Copy,
  'Delete': Delete,
  'Properties': Properties,
  'Info': Info,
  'Keywords': Book,
  'Move': Move,
  'Move to': MoveTo,
  'Duplicate': Duplicate,
  'Select': ViewGrid,
  'Brush': Draw,
  'Heal': Info,
  'Vector draw': Draw,
  'Sampler': ViewCard
};

const baseArgTypes = {
  onAction: {
    table: {
      disable: true
    }
  },
  onSelectionChange: {
    table: {
      disable: true
    }
  },
  disabledKeys: {
    table: {
      disable: true
    }
  },
  items: {
    table: {
      disable: true
    }
  },
  summaryIcon: {
    table: {
      disable: true
    }
  },
  selectionMode: {
    control: 'select',
    options: ['none', 'single', 'multiple']
  },
  isDisabled: {
    control: 'boolean'
  },
  density: {
    control: 'select',
    options: ['compact', 'regular', 'spacious']
  },
  isJustified: {
    control: 'boolean'
  },
  isQuiet: {
    control: 'boolean'
  },
  isEmphasized: {
    control: 'boolean'
  },
  disallowEmptySelection: {
    control: 'boolean'
  },
  orientation: {
    control: 'select',
    options: ['horizontal', 'vertical']
  },
  overflowMode: {
    control: 'select',
    options: ['wrap', 'collapse']
  },
  buttonLabelBehavior: {
    control: 'select',
    options: ['show', 'hide', 'collapse']
  }
} satisfies Meta<SpectrumActionGroupProps>['argTypes'];

const ActionGroupDisplayExample = defineComponent({
  name: 'ActionGroupDisplayExample',
  components: {
    ActionGroup
  },
  props: {
    args: {
      type: Object as PropType<SpectrumActionGroupProps & {
        onAction?: (key: string) => void,
        onSelectionChange?: (keys: string[]) => void
      }>,
      required: true
    }
  },
  setup(props) {
    let textSelection = ref<string[]>([]);
    let bothSelection = ref<string[]>([]);
    let iconSelection = ref<string[]>([]);
    let getLabel = (item: ActionItem) => typeof item === 'string' ? item : item.children;

    let forwardSelection = (keys: string[]) => {
      props.args.onSelectionChange?.(keys);
    };

    return {
      bothSelection,
      iconMap,
      getLabel,
      iconSelection,
      textSelection,
      viewItems,
      forwardSelection,
      props
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-300); margin: var(--spectrum-global-dimension-size-100); width: 100%;">
      <ActionGroup
        v-bind="props.args"
        v-model="textSelection"
        :items="viewItems"
        @action="props.args.onAction"
        @change="forwardSelection">
        <template #item="{item}">
          <span class="spectrum-ActionButton-label">{{ getLabel(item) }}</span>
        </template>
      </ActionGroup>
      <ActionGroup
        v-bind="props.args"
        v-model="bothSelection"
        :items="viewItems"
        @action="props.args.onAction"
        @change="forwardSelection">
        <template #item="{item, hideButtonText}">
          <component :is="iconMap[getLabel(item)]" />
          <span v-if="!hideButtonText" class="spectrum-ActionButton-label">{{ getLabel(item) }}</span>
        </template>
      </ActionGroup>
      <ActionGroup
        v-bind="props.args"
        v-model="iconSelection"
        :items="viewItems"
        @action="props.args.onAction"
        @change="forwardSelection">
        <template #item="{item}">
          <component :is="iconMap[getLabel(item)]" />
        </template>
      </ActionGroup>
    </div>
  `
});

const OverflowActionGroupExample = defineComponent({
  name: 'OverflowActionGroupExample',
  components: {
    ActionGroup
  },
  props: {
    args: {
      type: Object as PropType<SpectrumActionGroupProps & {
        onAction?: (key: string) => void,
        onSelectionChange?: (keys: string[]) => void
      }>,
      required: true
    },
    containerStyle: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({
        padding: '10px',
        resize: 'both',
        overflow: 'auto',
        width: '250px',
        backgroundColor: 'var(--spectrum-global-color-gray-50)'
      })
    },
    items: {
      type: Array as PropType<ActionItem[]>,
      default: () => overflowItems.slice()
    },
    selectionMode: {
      type: String as PropType<'none' | 'single' | 'multiple'>,
      default: 'none'
    }
  },
  setup(props) {
    let selected = ref<string[]>([]);
    let resolvedSelectionMode = computed(() => props.args.selectionMode ?? props.selectionMode);
    let getLabel = (item: ActionItem) => typeof item === 'string' ? item : item.children;

    let forwardSelection = (keys: string[]) => {
      props.args.onSelectionChange?.(keys);
    };

    return {
      getLabel,
      iconMap,
      props,
      selected,
      resolvedSelectionMode,
      forwardSelection
    };
  },
  template: `
    <div :style="props.containerStyle">
      <ActionGroup
        v-bind="props.args"
        v-model="selected"
        :items="props.items"
        :selection-mode="resolvedSelectionMode"
        @action="props.args.onAction"
        @change="forwardSelection">
        <template #item="{item, hideButtonText}">
          <component :is="iconMap[getLabel(item)]" />
          <span v-if="!hideButtonText" class="spectrum-ActionButton-label">{{ getLabel(item) }}</span>
        </template>
      </ActionGroup>
    </div>
  `
});

const TooltipActionGroupExample = defineComponent({
  name: 'TooltipActionGroupExample',
  components: {
    ActionGroup,
    TooltipTrigger
  },
  props: {
    args: {
      type: Object as PropType<SpectrumActionGroupProps & {
        onAction?: (key: string) => void,
        onSelectionChange?: (keys: string[]) => void
      }>,
      required: true
    }
  },
  setup(props) {
    let selected = ref<string[]>([]);
    let getLabel = (item: ActionItem) => typeof item === 'string' ? item : item.children;

    let forwardSelection = (keys: string[]) => {
      props.args.onSelectionChange?.(keys);
    };

    return {
      getLabel,
      iconMap,
      props,
      selected,
      viewItems,
      forwardSelection
    };
  },
  template: `
    <ActionGroup
      v-bind="props.args"
      v-model="selected"
      :items="viewItems"
      button-label-behavior="hide"
      @action="props.args.onAction"
      @change="forwardSelection">
      <template #item="{item}">
        <TooltipTrigger :delay="0" trigger="hover">
          <component :is="iconMap[getLabel(item)]" />
          <template #tooltip>
            {{ getLabel(item) }}
          </template>
        </TooltipTrigger>
      </template>
    </ActionGroup>
  `
});

const FalsyKeysActionGroupExample = defineComponent({
  name: 'FalsyKeysActionGroupExample',
  components: {
    ActionGroup
  },
  props: {
    args: {
      type: Object as PropType<SpectrumActionGroupProps & {
        onAction?: (key: string) => void,
        onSelectionChange?: (keys: string[]) => void
      }>,
      required: true
    }
  },
  setup(props) {
    let selected = ref<string[]>([]);
    let items = ['add', '', 'edit'];
    let labels: Record<string, string> = {
      add: 'Add',
      '': 'Delete',
      edit: 'Edit'
    };

    let forwardSelection = (keys: string[]) => {
      props.args.onSelectionChange?.(keys);
    };

    return {
      items,
      labels,
      props,
      selected,
      forwardSelection
    };
  },
  template: `
    <ActionGroup
      v-bind="props.args"
      v-model="selected"
      :items="items"
      @action="props.args.onAction"
      @change="forwardSelection">
      <template #item="{item}">
        <span class="spectrum-ActionButton-label">{{ labels[item] }}</span>
      </template>
    </ActionGroup>
  `
});

const VerticalOverflowExample = defineComponent({
  name: 'VerticalOverflowExample',
  components: {
    OverflowActionGroupExample
  },
  props: {
    args: {
      type: Object as PropType<SpectrumActionGroupProps & {
        onAction?: (key: string) => void,
        onSelectionChange?: (keys: string[]) => void
      }>,
      required: true
    }
  },
  setup(props) {
    return {
      props,
      toolItems
    };
  },
  template: `
    <div style="display: flex; flex-direction: column;">
      <p>Note: this is currently unsupported by Spectrum. Container should scroll.</p>
      <OverflowActionGroupExample
        :args="props.args"
        :items="toolItems"
        selection-mode="single"
        :container-style="{
          padding: '10px',
          resize: 'vertical',
          overflow: 'auto',
          width: '32px',
          backgroundColor: 'var(--spectrum-global-color-gray-50)'
        }" />
    </div>
  `
});

const meta: Meta<SpectrumActionGroupProps> = {
  title: 'ActionGroup',
  component: ActionGroup,
  args: {
    onAction: action('onAction'),
    onSelectionChange: action('onSelectionChange')
  },
  argTypes: baseArgTypes
};

export default meta;

type ActionGroupStory = StoryObj<typeof meta>;

export const Default: ActionGroupStory = {
  args: {
    items: viewItems
  },
  render: (args) => ({
    components: {ActionGroupDisplayExample},
    setup() {
      return {args};
    },
    template: '<ActionGroupDisplayExample :args="args" />'
  })
};

export const FalsyKeys: ActionGroupStory = {
  render: (args) => ({
    components: {FalsyKeysActionGroupExample},
    setup() {
      return {args};
    },
    template: '<FalsyKeysActionGroupExample :args="args" />'
  })
};

export const AllKeysDisabled: ActionGroupStory = {
  ...Default,
  args: {
    disabledKeys: ['1', '2', '3'],
    items: viewItems
  }
};

export const SomeKeysDisabled: ActionGroupStory = {
  ...Default,
  args: {
    disabledKeys: ['1', '2'],
    items: viewItems
  }
};

export const StaticColorWhite: ActionGroupStory = {
  args: {
    staticColor: 'white',
    defaultSelectedKeys: ['1'],
    items: viewItems
  },
  render: (args) => ({
    components: {ActionGroupDisplayExample},
    setup() {
      return {
        args: {
          ...args,
          modelValue: normalizeStorySelectionKeys(args.defaultSelectedKeys)
        }
      };
    },
    template: `
      <div style="background-color: var(--spectrum-global-color-static-blue-700); padding: var(--spectrum-global-dimension-size-1000);">
        <ActionGroupDisplayExample :args="args" />
      </div>
    `
  }),
  name: 'staticColor=white'
};

export const StaticColorBlack: ActionGroupStory = {
  args: {
    staticColor: 'black',
    defaultSelectedKeys: ['1'],
    items: viewItems
  },
  render: (args) => ({
    components: {ActionGroupDisplayExample},
    setup() {
      return {
        args: {
          ...args,
          modelValue: normalizeStorySelectionKeys(args.defaultSelectedKeys)
        }
      };
    },
    template: `
      <div style="background-color: var(--spectrum-global-color-static-yellow-400); padding: var(--spectrum-global-dimension-size-1000);">
        <ActionGroupDisplayExample :args="args" />
      </div>
    `
  }),
  name: 'staticColor=black'
};

export const WithTooltips: ActionGroupStory = {
  args: {items: viewItems},
  render: (args) => ({
    components: {TooltipActionGroupExample},
    setup() {
      return {args};
    },
    template: '<TooltipActionGroupExample :args="args" />'
  })
};

export const Overflow: ActionGroupStory = {
  args: {
    disabledKeys: ['1', '5']
  },
  render: (args) => ({
    components: {OverflowActionGroupExample},
    setup() {
      return {
        args: {
          ...args,
          buttonLabelBehavior: 'collapse',
          overflowMode: 'collapse'
        },
        overflowItems
      };
    },
    template: '<OverflowActionGroupExample :args="args" :items="overflowItems" />'
  }),
  name: 'overflowMode'
};

export const SummaryIcon: ActionGroupStory = {
  args: {
    disabledKeys: ['1', '5'],
    summaryIcon: h(Text)
  },
  render: (args) => ({
    components: {OverflowActionGroupExample},
    setup() {
      return {
        args: {
          ...args,
          buttonLabelBehavior: 'collapse',
          overflowMode: 'collapse'
        },
        overflowItems
      };
    },
    template: '<OverflowActionGroupExample :args="args" :items="overflowItems" />'
  }),
  name: 'summary icon overflow'
};

export const VerticalOverflow: ActionGroupStory = {
  render: (args) => ({
    components: {VerticalOverflowExample},
    setup() {
      return {
        args: {
          ...args,
          orientation: 'vertical',
          overflowMode: 'collapse',
          selectionMode: 'single',
          buttonLabelBehavior: 'hide',
          isEmphasized: true,
          isQuiet: true
        }
      };
    },
    template: '<VerticalOverflowExample :args="args" />'
  }),
  name: 'special vertical overflow case'
};
