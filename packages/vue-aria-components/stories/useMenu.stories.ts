import {action} from '@storybook/addon-actions';
import {computed, ref, type Ref} from 'vue';
import {useInteractOutside} from '@vue-aria/interactions';
import {useMenu, useMenuItem, useMenuTrigger} from '@vue-aria/menu';
import {useOverlay} from '@vue-aria/overlays';
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

function createMenuState(
  label: string,
  onInteractOutsideName: string,
  overlayRef: Ref<HTMLElement | null>
) {
  let menuTrigger = useMenuTrigger();
  let menu = useMenu({
    'aria-label': label,
    onAction: action(`${label} onAction`)
  });

  useInteractOutside({
    ref: overlayRef,
    onInteractOutside: action(onInteractOutsideName)
  });

  let overlay = useOverlay({
    isDismissable: true,
    isOpen: menuTrigger.isOpen,
    onClose: () => {
      menuTrigger.close();
    },
    overlayRef,
    shouldCloseOnBlur: true
  });

  let itemMap = new Map(menuOptions.map((option) => [
    option.key,
    useMenuItem({
      key: option.key,
      onAction: () => {
        menuTrigger.close();
      }
    }, menu)
  ]));

  return {
    isOpen: menuTrigger.isOpen,
    menuProps: computed(() => ({
      ...menu.menuProps.value,
      ...menuTrigger.menuProps.value,
      ...overlay.overlayProps.value
    })),
    menuTriggerProps: menuTrigger.menuTriggerProps,
    getItemProps: (key: string) => itemMap.get(key)?.menuItemProps.value,
    isFocused: (key: string) => Boolean(itemMap.get(key)?.isFocused.value)
  };
}

export const DoubleMenuFiresOnInteractOutside: Story = {
  render: () => ({
    setup() {
      let firstOverlayRef = ref<HTMLElement | null>(null);
      let secondOverlayRef = ref<HTMLElement | null>(null);

      let firstMenu = createMenuState('Actions', 'onInteractOutside', firstOverlayRef);
      let secondMenu = createMenuState('Actions2', 'onInteractOutside', secondOverlayRef);

      return {
        firstMenu,
        firstOverlayRef,
        menuOptions,
        secondMenu,
        secondOverlayRef
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>
          This should just be there to show that onInteractOutside fires when clicking on another trigger.
        </div>
        <div style="display: flex; gap: 12px;">
          <div style="position: relative; display: inline-block;">
            <button v-bind="firstMenu.menuTriggerProps" type="button" style="height: 30px; font-size: 14px;">
              Actions
              <span aria-hidden="true" style="padding-left: 5px;">▼</span>
            </button>
            <div v-if="firstMenu.isOpen" ref="firstOverlayRef">
              <ul
                v-bind="firstMenu.menuProps"
                style="position: absolute; width: 100%; margin: 4px 0 0 0; padding: 0; list-style: none; border: 1px solid gray; background: lightgray;">
                <li
                  v-for="option in menuOptions"
                  :key="option.key"
                  v-bind="firstMenu.getItemProps(option.key)"
                  :style="{background: firstMenu.isFocused(option.key) ? 'gray' : 'transparent', color: firstMenu.isFocused(option.key) ? 'white' : 'black', padding: '2px 5px', outline: 'none', cursor: 'pointer'}"
                  tabindex="0">
                  {{option.label}}
                </li>
              </ul>
            </div>
          </div>
          <div style="position: relative; display: inline-block;">
            <button v-bind="secondMenu.menuTriggerProps" type="button" style="height: 30px; font-size: 14px;">
              Actions2
              <span aria-hidden="true" style="padding-left: 5px;">▼</span>
            </button>
            <div v-if="secondMenu.isOpen" ref="secondOverlayRef">
              <ul
                v-bind="secondMenu.menuProps"
                style="position: absolute; width: 100%; margin: 4px 0 0 0; padding: 0; list-style: none; border: 1px solid gray; background: lightgray;">
                <li
                  v-for="option in menuOptions"
                  :key="option.key"
                  v-bind="secondMenu.getItemProps(option.key)"
                  :style="{background: secondMenu.isFocused(option.key) ? 'gray' : 'transparent', color: secondMenu.isFocused(option.key) ? 'white' : 'black', padding: '2px 5px', outline: 'none', cursor: 'pointer'}"
                  tabindex="0">
                  {{option.label}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <input aria-label="input after">
      </div>
    `
  }),
  name: 'double menu fires onInteractOutside'
};
