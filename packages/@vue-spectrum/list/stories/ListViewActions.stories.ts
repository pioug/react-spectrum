import {ListView} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const ACTION_ITEMS = [
  {id: 'a', label: 'Utilities'},
  {id: 'b', label: 'Adobe Photoshop'},
  {id: 'c', label: 'Adobe Illustrator'},
  {id: 'd', label: 'Adobe XD'}
];

const FOCUS_ITEMS = [
  {id: 1, label: 'Adobe Photoshop'},
  {id: 2, label: 'Adobe XD'},
  {id: 3, label: 'Adobe InDesign'},
  {id: 4, label: 'Adobe AfterEffects'},
  {id: 5, label: 'Adobe Flash'},
  {id: 6, label: 'Adobe Illustrator'},
  {id: 7, label: 'Adobe Lightroom'},
  {id: 8, label: 'Adobe Premiere Pro'},
  {id: 9, label: 'Adobe Fresco'},
  {id: 10, label: 'Adobe Dreamweaver'}
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

function renderActionsExample(args: StoryArgs, note: string) {
  return {
    components: {ListView},
    setup() {
      return {args, note};
    },
    template: `
      <div style="display: grid; gap: 8px; width: 300px;">
        <div>{{note}}</div>
        <ListView
          v-bind="args"
          aria-label="render actions ListView"
          :items="[
            'Utilities',
            'Adobe Photoshop',
            'Adobe Illustrator',
            'Adobe XD'
          ]" />
      </div>
    `
  };
}

export const ActionButtons: Story = {
  render: (args) => renderActionsExample(args, 'ActionButton parity scenario'),
  name: 'ActionButton'
};

export const ActionGroups: Story = {
  render: (args) => renderActionsExample(args, 'ActionGroup parity scenario'),
  name: 'ActionGroup'
};

export const ActionMenus: Story = {
  render: (args) => renderActionsExample(args, 'ActionMenu parity scenario'),
  name: 'ActionMenu'
};

export const ActionMenusGroup: Story = {
  render: (args) => renderActionsExample(args, 'ActionGroup + ActionMenu parity scenario'),
  name: 'ActionGroup + ActionMenu'
};

export function FocusExample(args: StoryArgs = {}) {
  return {
    components: {ListView},
    setup() {
      let items = ref([...FOCUS_ITEMS]);
      let removeFirst = () => {
        if (items.value.length === 0) {
          return;
        }
        items.value = items.value.slice(1);
      };

      return {
        args,
        items,
        removeFirst
      };
    },
    template: `
      <div style="display: grid; gap: 8px; width: 250px;">
        <button type="button" @click="removeFirst">Remove first item</button>
        <ListView
          v-bind="args"
          aria-label="listview with removable items"
          :items="items" />
      </div>
    `
  };
}

export const Focus: Story = {
  render: (args) => FocusExample(args),
  name: 'Restore focus after item removal (disabledBehavior: \"selection\")'
};
