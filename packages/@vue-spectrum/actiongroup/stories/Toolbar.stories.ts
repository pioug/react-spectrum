import {ActionGroup} from '../src';
import {type Component, computed, defineComponent, type PropType, ref} from 'vue';
import Copy from '@spectrum-icons-vue/workflow/Copy';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Draw from '@spectrum-icons-vue/workflow/Draw';
import Info from '@spectrum-icons-vue/workflow/Info';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Properties from '@spectrum-icons-vue/workflow/Properties';
import ViewCard from '@spectrum-icons-vue/workflow/ViewCard';
import ViewGrid from '@spectrum-icons-vue/workflow/ViewGrid';
import ViewList from '@spectrum-icons-vue/workflow/ViewList';

type ToolbarOrientation = 'horizontal' | 'vertical';

const manageItems = ['edit', 'copy', 'delete'];
const viewItems = ['grid', 'list', 'card'];
const inspectItems = ['properties', 'info'];
const DEFAULT_CHILDREN = {
  key: null,
  ref: null,
  props: {
    children: [{
      type: {},
      key: null,
      ref: null,
      props: {
        items: [
          {id: 'edit', textValue: 'Edit'},
          {id: 'copy', textValue: 'Copy'},
          {id: 'delete', textValue: 'Delete'}
        ],
        'aria-label': 'manage',
        selectionMode: 'single'
      }
    }, {
      type: {},
      key: null,
      ref: null,
      props: {}
    }, {
      type: {},
      key: null,
      ref: null,
      props: {
        items: [
          {id: 'grid', textValue: 'Grid view'},
          {id: 'list', textValue: 'List view'},
          {id: 'card', textValue: 'Gallery view'}
        ],
        'aria-label': 'view',
        selectionMode: 'single'
      }
    }]
  }
};

const labelMap: Record<string, string> = {
  edit: 'Edit',
  copy: 'Copy',
  delete: 'Delete',
  grid: 'Grid view',
  list: 'List view',
  card: 'Gallery view',
  properties: 'Properties',
  info: 'Info'
};

const iconMap: Record<string, Component> = {
  edit: Draw,
  copy: Copy,
  delete: Delete,
  grid: ViewGrid,
  list: ViewList,
  card: ViewCard,
  properties: Properties,
  info: Info
};

const ToolbarExample = defineComponent({
  name: 'ToolbarExample',
  components: {
    ActionGroup
  },
  props: {
    ariaLabel: {
      type: String,
      default: undefined
    },
    orientation: {
      type: String as PropType<ToolbarOrientation>,
      default: 'horizontal'
    },
    isDisabledKeysExample: {
      type: Boolean,
      default: false
    },
    children: {
      type: Object as PropType<unknown>,
      default: undefined
    }
  },
  setup(props) {
    let manageSelection = ref<string[]>([]);
    let viewSelection = ref<string[]>([]);
    let inspectSelection = ref<string[]>([]);

    let isVertical = computed(() => props.orientation === 'vertical');
    let toolbarStyle = computed(() => ({
      display: 'flex',
      gap: '8px',
      width: 'fit-content',
      flexDirection: isVertical.value ? 'column' : 'row'
    }));
    let dividerStyle = computed(() => isVertical.value
      ? {
        height: '1px',
        width: '100%',
        backgroundColor: 'var(--spectrum-global-color-gray-300)'
      }
      : {
        width: '1px',
        height: '32px',
        backgroundColor: 'var(--spectrum-global-color-gray-300)'
      });

    let manageDisabledKeys = computed(() => props.isDisabledKeysExample ? ['copy'] : []);
    let viewDisabled = computed(() => props.isDisabledKeysExample);

    return {
      dividerStyle,
      iconMap,
      inspectItems,
      inspectSelection,
      labelMap,
      manageDisabledKeys,
      manageItems,
      manageSelection,
      props,
      toolbarStyle,
      viewDisabled,
      viewItems,
      viewSelection
    };
  },
  template: `
    <div
      :style="toolbarStyle"
      role="toolbar"
      :aria-orientation="props.orientation"
      :aria-label="props.ariaLabel">
      <ActionGroup
        aria-label="manage"
        selection-mode="single"
        :orientation="props.orientation"
        :items="manageItems"
        :disabled-keys="manageDisabledKeys"
        v-model="manageSelection">
        <template #item="{item}">
          <component :is="iconMap[item]" :aria-label="labelMap[item]" />
        </template>
      </ActionGroup>
      <div aria-hidden="true" :style="dividerStyle" />
      <ActionGroup
        aria-label="view"
        selection-mode="single"
        :orientation="props.orientation"
        :items="viewItems"
        :is-disabled="viewDisabled"
        v-model="viewSelection">
        <template #item="{item}">
          <component :is="iconMap[item]" :aria-label="labelMap[item]" />
        </template>
      </ActionGroup>
      <template v-if="props.isDisabledKeysExample">
        <div aria-hidden="true" :style="dividerStyle" />
        <ActionGroup
          aria-label="inspect"
          selection-mode="single"
          :orientation="props.orientation"
          :items="inspectItems"
          v-model="inspectSelection">
          <template #item="{item}">
            <component :is="iconMap[item]" :aria-label="labelMap[item]" />
          </template>
        </ActionGroup>
      </template>
    </div>
  `
});

const meta: Meta = {
  title: 'Toolbar',
  args: {
    children: DEFAULT_CHILDREN
  },
  argTypes: {
    children: {
      table: {
        disable: true
      }
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    }
  }
};

export default meta;
type ToolbarStory = StoryObj<typeof meta>;

export const Default: ToolbarStory = {
  render: (args) => ({
    components: {ToolbarExample},
    setup() {
      return {args};
    },
    template: '<ToolbarExample :orientation="args.orientation" />'
  })
};

export const DisabledKeys: ToolbarStory = {
  args: {
    'aria-label': 'The big toolbar',
    children: DEFAULT_CHILDREN
  },
  render: (args) => ({
    components: {ToolbarExample},
    setup() {
      return {args};
    },
    template: '<ToolbarExample :aria-label="args[\'aria-label\']" :orientation="args.orientation" is-disabled-keys-example />'
  })
};
