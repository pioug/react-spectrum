import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type SelectableListArgs = {
  disallowEmptySelection?: boolean,
  isSubUlRelativelyPositioned?: boolean,
  isUlRelativelyPositioned?: boolean,
  selectionBehavior?: 'replace' | 'toggle',
  selectionMode?: 'multiple' | 'single'
};

const groupedOptions = [
  {
    title: 'Brass',
    items: ['Trumpet', 'Horn', 'Trombone', 'Tuba']
  },
  {
    title: 'String',
    items: ['Violin', 'Viola', 'Cello', 'Harp']
  },
  {
    title: 'Wind',
    items: ['Flute', 'Oboe', 'Clarinet']
  },
  {
    title: 'Percussion',
    items: ['Piano', 'Drums']
  }
];

const simpleOptions = ['Paco de Lucia', 'Vicente Amigo', 'Gerardo Nunez'];

const meta = {
  title: 'useSelectableList'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderGroupedSelectableList(args: SelectableListArgs) {
  return {
    setup() {
      return {
        args,
        groupedOptions
      };
    },
    template: `
      <ul
        role="listbox"
        style="height: 200px; overflow: auto; padding: 10px; margin: 0; list-style: none; border: 1px solid #ccc;"
        :style="{position: args.isUlRelativelyPositioned ? 'relative' : 'static'}">
        <li v-for="group in groupedOptions" :key="group.title" style="margin-bottom: 8px;">
          <div style="text-transform: uppercase; font-size: 12px; color: #666;">{{group.title}}</div>
          <ul
            style="padding: 0; margin: 0; list-style: none;"
            :style="{position: args.isSubUlRelativelyPositioned ? 'relative' : 'static'}">
            <li
              v-for="option in group.items"
              :key="option"
              role="option"
              style="padding: 2px 4px;">
              {{option}}
            </li>
          </ul>
        </li>
      </ul>
    `
  };
}

function renderSimpleSelectableList(args: SelectableListArgs) {
  return {
    setup() {
      let selected = ref<string[]>([]);
      let toggle = (name: string) => {
        if (args.selectionMode === 'single') {
          if (args.disallowEmptySelection && selected.value[0] === name) {
            return;
          }

          selected.value = selected.value[0] === name ? [] : [name];
          return;
        }

        let next = new Set(selected.value);
        if (next.has(name)) {
          if (args.disallowEmptySelection && next.size === 1) {
            return;
          }
          next.delete(name);
        } else if (args.selectionBehavior === 'replace') {
          next.clear();
          next.add(name);
        } else {
          next.add(name);
        }
        selected.value = Array.from(next);
      };

      return {
        args,
        selected,
        simpleOptions,
        toggle
      };
    },
    template: `
      <ul role="listbox" style="padding: 8px; border: 1px solid #ccc; max-width: 280px; list-style: none;">
        <li
          v-for="name in simpleOptions"
          :key="name"
          role="option"
          :aria-selected="selected.includes(name)"
          :style="{padding: '4px 6px', cursor: 'pointer', background: selected.includes(name) ? '#e8e8e8' : 'transparent'}"
          @click="toggle(name)">
          {{name}}
        </li>
      </ul>
    `
  };
}

export const StaticUlStaticSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: false, isSubUlRelativelyPositioned: false}),
  name: 'Static Ul Static Sub Ul'
};

export const StaticUlRelativeSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: false, isSubUlRelativelyPositioned: true}),
  name: 'Static Ul Relative Sub Ul'
};

export const RelativeUlStaticSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: true, isSubUlRelativelyPositioned: false}),
  name: 'Relative Ul Static Sub Ul'
};

export const RelativeUlRelativeSubUl: Story = {
  render: () => renderGroupedSelectableList({isUlRelativelyPositioned: true, isSubUlRelativelyPositioned: true}),
  name: 'Relative Ul Relative Sub Ul'
};

export const SingleSelectAllowEmptySelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'single'}),
  name: 'Single Select Allow Empty Select On Focus'
};

export const SingleSelectDisallowEmptySelectionSelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'single', disallowEmptySelection: true}),
  name: 'Single Select Disallow Empty Selection Select On Focus'
};

export const MultiSelectReplaceOnPressSelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'multiple', selectionBehavior: 'replace'}),
  name: 'Multi Select Replace On Press Select On Focus'
};

export const MultiSelectAllowEmptySelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'multiple'}),
  name: 'Multi Select Allow Empty Select On Focus'
};

export const MultiSelectDisallowEmptySelectOnFocus: Story = {
  render: () => renderSimpleSelectableList({selectionMode: 'multiple', disallowEmptySelection: true}),
  name: 'Multi Select Disallow Empty Select On Focus'
};
