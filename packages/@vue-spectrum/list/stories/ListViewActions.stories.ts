import {ActionButton} from '@vue-spectrum/button';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {ActionMenu} from '@vue-spectrum/menu';
import {ListView} from '../src';
import {Text} from '@vue-spectrum/text';
import {ref} from 'vue';
import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Add from '@spectrum-icons-vue/workflow/Add';
import Copy from '@spectrum-icons-vue/workflow/Copy';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Folder from '@spectrum-icons-vue/workflow/Folder';
import Info from '@spectrum-icons-vue/workflow/Info';
import RemoveCircle from '@spectrum-icons-vue/workflow/RemoveCircle';

type StoryArgs = Record<string, unknown>;

const ACTION_ITEMS = [
  {id: 'a', label: 'Utilities', description: '16 items', type: 'folder'},
  {id: 'b', label: 'Adobe Photoshop', description: 'Application'},
  {id: 'c', label: 'Adobe Illustrator', description: 'Application'},
  {id: 'd', label: 'Adobe XD', description: 'Application'}
];

const FOCUS_ITEMS = [
  {id: 1, label: 'Adobe Photoshop'},
  {id: 2, label: 'Adobe XD'},
  {id: 3, label: 'Adobe InDesign'},
  {id: 4, label: 'Adobe AfterEffects'},
  {id: 5, label: 'Adobe Flash', isDisabled: true},
  {id: 6, label: 'Adobe Illustrator'},
  {id: 7, label: 'Adobe Lightroom'},
  {id: 8, label: 'Adobe Premiere Pro'},
  {id: 9, label: 'Adobe Fresco'},
  {id: 10, label: 'Adobe Dreamweaver'}
];

const ACTION_TOOL_ITEMS = [
  {key: 'add', label: 'Add'},
  {key: 'delete', label: 'Delete'}
];

const ACTION_GROUP_ITEMS = [
  {name: 'add', children: 'Add'},
  {name: 'delete', children: 'Delete'}
];

const meta: Meta<typeof ListView> = {
  title: 'ListView/Actions',
  component: ListView,
  excludeStories: ['FocusExample'],
  args: {
    density: 'regular',
    disabledBehavior: 'selection',
    isQuiet: false,
    overflowMode: 'truncate',
    selectionMode: 'multiple',
    selectionStyle: 'checkbox'
  },
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious']
    },
    disabledBehavior: {
      control: 'radio',
      options: ['selection', 'all']
    },
    isQuiet: {
      control: 'boolean'
    },
    overflowMode: {
      control: 'radio',
      options: ['truncate', 'wrap']
    },
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionStyle: {
      control: 'radio',
      options: ['checkbox', 'highlight']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderActionsExample(args: StoryArgs, variant: 'ActionButton' | 'ActionGroup' | 'ActionGroup + ActionMenu' | 'ActionMenu') {
  return {
    components: {ActionButton, ActionGroup, ActionMenu, Add, Copy, Delete, Folder, Info, ListView, Text},
    setup() {
      return {
        actionGroupItems: ACTION_GROUP_ITEMS,
        actionItems: ACTION_TOOL_ITEMS,
        args,
        listItems: ACTION_ITEMS,
        variant,
        onAction: action('onAction'),
        onSelectionChange: action('onSelectionChange'),
        onActionGroupAction: action('actionGroupAction'),
        onActionMenuAction: action('actionMenuAction'),
        onActionButtonPress: action('actionPress')
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="render actions ListView"
        width="300px"
        selection-mode="single"
        :items="listItems"
        @action="onAction"
        @selection-change="onSelectionChange">
        <template #item="{item}">
          <Folder v-if="item.type === 'folder'" class="react-spectrum-ListViewItem-thumbnail" />
          <Text class="react-spectrum-ListViewItem-content">{{ item.label }}</Text>
          <Text class="react-spectrum-ListViewItem-description">{{ item.description }}</Text>
          <ActionButton
            v-if="variant === 'ActionButton'"
            class="react-spectrum-ListViewItem-actions"
            aria-label="Copy"
            @press="onActionButtonPress">
            <Copy />
          </ActionButton>
          <div v-else-if="variant === 'ActionGroup'" class="react-spectrum-ListViewItem-actions">
            <ActionGroup
              button-label-behavior="hide"
              is-quiet
              density="compact"
              selection-mode="none"
              :items="actionGroupItems"
              @action="onActionGroupAction">
              <template #item="{item: actionItem}">
                <Add v-if="actionItem.name === 'add'" />
                <Delete v-else />
              </template>
            </ActionGroup>
          </div>
          <div v-else-if="variant === 'ActionMenu'" class="react-spectrum-ListViewItem-actionmenu">
            <ActionMenu
              :items="actionItems"
              aria-label="Row actions"
              @action="onActionMenuAction" />
          </div>
          <template v-else>
            <div class="react-spectrum-ListViewItem-actions">
              <ActionGroup
                button-label-behavior="hide"
                is-quiet
                density="compact"
                selection-mode="none"
                :items="[{name: 'info', children: 'Info'}]"
                @action="onActionGroupAction">
                <template #item="{item: actionItem}">
                  <Info v-if="actionItem.name === 'info'" />
                </template>
              </ActionGroup>
            </div>
            <div class="react-spectrum-ListViewItem-actionmenu">
              <ActionMenu
                :items="actionItems"
                aria-label="Row actions"
                @action="onActionMenuAction" />
            </div>
          </template>
        </template>
      </ListView>
    `
  };
}

export const ActionButtons: Story = {
  render: (args) => renderActionsExample(args, 'ActionButton'),
  name: 'ActionButton'
};

export const ActionGroups: Story = {
  render: (args) => renderActionsExample(args, 'ActionGroup'),
  name: 'ActionGroup'
};

export const ActionMenus: Story = {
  render: (args) => renderActionsExample(args, 'ActionMenu'),
  name: 'ActionMenu'
};

export const ActionMenusGroup: Story = {
  render: (args) => renderActionsExample(args, 'ActionGroup + ActionMenu'),
  name: 'ActionGroup + ActionMenu'
};

export function FocusExample(args: StoryArgs = {}) {
  return {
    components: {ActionButton, ListView, RemoveCircle, Text},
    setup() {
      let items = ref([...FOCUS_ITEMS]);
      let removeItem = (id: number) => {
        items.value = items.value.filter((item) => item.id !== id);
      };

      return {
        args,
        items,
        removeItem
      };
    },
    template: `
      <ListView
        v-bind="args"
        aria-label="listview with removable items"
        width="250px"
        :items="items"
        :disabled-keys="['5']">
        <template #item="{item}">
          <Text class="react-spectrum-ListViewItem-content">{{ item.label }}</Text>
          <ActionButton
            class="react-spectrum-ListViewItem-actions"
            :aria-label="'Remove ' + item.label"
            is-quiet
            :is-disabled="item.isDisabled"
            @press="removeItem(item.id)">
            <RemoveCircle />
          </ActionButton>
        </template>
      </ListView>
    `
  };
}

export const Focus: Story = {
  render: (args) => FocusExample(args),
  name: 'Restore focus after item removal (disabledBehavior: \"selection\")'
};
