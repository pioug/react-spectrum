import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import {useMenu, useMenuItem} from '@vue-aria/menu';
import {useInteractOutside} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type MenuOption = {
  key: string,
  label: string
};

const menuOptions: MenuOption[] = [
  {key: 'copy', label: 'Copy'},
  {key: 'cut', label: 'Cut'},
  {key: 'paste', label: 'Paste'}
];

const meta = {
  title: 'useMenu'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function createMenu(menuLabel: string) {
  let menu = useMenu({
    'aria-label': menuLabel,
    onAction: action(`${menuLabel} onAction`)
  });

  let itemHooks = menuOptions.map((option) => {
    let item = useMenuItem({key: option.key}, menu);
    return computed(() => ({
      key: option.key,
      label: option.label,
      props: item.menuItemProps.value,
      isFocused: item.isFocused.value,
      isSelected: item.isSelected.value
    }));
  });

  return {
    menuProps: menu.menuProps,
    items: computed(() => itemHooks.map((item) => item.value))
  };
}

export const DoubleMenuFiresOnInteractOutside: Story = {
  render: () => ({
    setup() {
      let firstMenuRef = ref<HTMLElement | null>(null);
      let secondMenuRef = ref<HTMLElement | null>(null);

      useInteractOutside({
        ref: firstMenuRef,
        onInteractOutside: action('menu 1 onInteractOutside')
      });
      useInteractOutside({
        ref: secondMenuRef,
        onInteractOutside: action('menu 2 onInteractOutside')
      });

      let firstMenu = createMenu('Actions');
      let secondMenu = createMenu('Actions2');

      return {
        firstMenu,
        firstMenuRef,
        secondMenu,
        secondMenuRef
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 420px;">
        <div>
          This should just be there to show that onInteractOutside fires when clicking on another trigger.
        </div>
        <div style="display: flex; gap: 12px;">
          <div ref="firstMenuRef" style="display: inline-block;">
            <button type="button" aria-haspopup="menu">Actions</button>
            <ul
              v-bind="firstMenu.menuProps"
              style="margin-top: 6px; border: 1px solid #8f8f8f; list-style: none; padding: 4px;">
              <li
                v-for="item in firstMenu.items"
                :key="item.key"
                v-bind="item.props"
                :style="{padding: '4px 8px', cursor: 'pointer', background: item.isFocused ? '#e5e5e5' : 'transparent'}">
                {{item.label}}
              </li>
            </ul>
          </div>
          <div ref="secondMenuRef" style="display: inline-block;">
            <button type="button" aria-haspopup="menu">Actions2</button>
            <ul
              v-bind="secondMenu.menuProps"
              style="margin-top: 6px; border: 1px solid #8f8f8f; list-style: none; padding: 4px;">
              <li
                v-for="item in secondMenu.items"
                :key="item.key"
                v-bind="item.props"
                :style="{padding: '4px 8px', cursor: 'pointer', background: item.isFocused ? '#e5e5e5' : 'transparent'}">
                {{item.label}}
              </li>
            </ul>
          </div>
        </div>
        <input aria-label="input after" />
      </div>
    `
  }),
  name: 'double menu fires onInteractOutside'
};
