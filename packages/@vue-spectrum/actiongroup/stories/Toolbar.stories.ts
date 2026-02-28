import './toolbar.css';
import {ActionGroup} from '../src';
import {Divider} from '@vue-spectrum/divider';
import {type Component, computed, defineComponent, type PropType, ref} from 'vue';
import Copy from '@spectrum-icons-vue/workflow/Copy';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Draw from '@spectrum-icons-vue/workflow/Draw';
import Info from '@spectrum-icons-vue/workflow/Info';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Properties from '@spectrum-icons-vue/workflow/Properties';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import ViewCard from '@spectrum-icons-vue/workflow/ViewCard';
import ViewGrid from '@spectrum-icons-vue/workflow/ViewGrid';
import ViewList from '@spectrum-icons-vue/workflow/ViewList';

type ToolbarOrientation = 'horizontal' | 'vertical';

const manageItems = ['edit', 'copy', 'delete'];
const viewItems = ['grid', 'list', 'card'];
const inspectItems = ['properties', 'info'];

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
    ActionGroup,
    Divider,
    TooltipTrigger
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
  },
  setup(props) {
    let manageSelection = ref<string[]>([]);
    let viewSelection = ref<string[]>([]);
    let inspectSelection = ref<string[]>([]);

    let dividerOrientation = computed(() => props.orientation === 'horizontal' ? 'vertical' : 'horizontal');

    let manageDisabledKeys = computed(() => props.isDisabledKeysExample ? new Set(['copy']) : new Set<string>());
    let manageSelectionMode = computed(() => props.isDisabledKeysExample ? 'multiple' : 'single');
    let viewSelectionMode = computed(() => props.isDisabledKeysExample ? 'none' : 'single');
    let viewDisabled = computed(() => props.isDisabledKeysExample);

    return {
      dividerOrientation,
      iconMap,
      inspectItems,
      inspectSelection,
      labelMap,
      manageDisabledKeys,
      manageItems,
      manageSelectionMode,
      manageSelection,
      props,
      viewDisabled,
      viewItems,
      viewSelectionMode,
      viewSelection
    };
  },
  template: `
    <div
      class="spectrum-Toolbar"
      :data-orientation="props.orientation"
      role="toolbar"
      :aria-orientation="props.orientation"
      :aria-label="props.ariaLabel">
      <ActionGroup
        aria-label="manage"
        :selection-mode="manageSelectionMode"
        :orientation="props.orientation"
        :items="manageItems"
        :disabled-keys="manageDisabledKeys"
        v-model="manageSelection">
        <template #item="{item}">
          <TooltipTrigger :delay="0" trigger="hover">
            <component :is="iconMap[item]" :aria-label="labelMap[item]" size="S" />
            <template #tooltip>
              {{ labelMap[item] }}
            </template>
          </TooltipTrigger>
        </template>
      </ActionGroup>
      <Divider size="S" :orientation="dividerOrientation" />
      <ActionGroup
        aria-label="view"
        :selection-mode="viewSelectionMode"
        :orientation="props.orientation"
        :items="viewItems"
        :is-disabled="viewDisabled"
        v-model="viewSelection">
        <template #item="{item}">
          <component :is="iconMap[item]" :aria-label="labelMap[item]" size="S" />
        </template>
      </ActionGroup>
      <template v-if="props.isDisabledKeysExample">
        <Divider size="S" :orientation="dividerOrientation" />
        <ActionGroup
          aria-label="inspect"
          selection-mode="single"
          :orientation="props.orientation"
          :items="inspectItems"
          v-model="inspectSelection">
          <template #item="{item}">
            <component :is="iconMap[item]" :aria-label="labelMap[item]" size="S" />
          </template>
        </ActionGroup>
      </template>
    </div>
  `
});

export const Toolbar = ToolbarExample;

const meta: Meta = {
  title: 'Toolbar',
  component: Toolbar,
  excludeStories: ['Toolbar'],
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
    'aria-label': 'The big toolbar'
  },
  render: (args) => ({
    components: {ToolbarExample},
    setup() {
      return {args};
    },
    template: '<ToolbarExample :aria-label="args[\'aria-label\']" :orientation="args.orientation" is-disabled-keys-example />'
  })
};
