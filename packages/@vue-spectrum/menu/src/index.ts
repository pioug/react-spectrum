import {VueMenu} from '@vue-spectrum/components';

export const Menu = VueMenu;
export const ActionMenu = VueMenu;
export const MenuTrigger = VueMenu;
export const SubmenuTrigger = VueMenu;
export const ContextualHelpTrigger = VueMenu;
export const Item = VueMenu;
export const Section = VueMenu;
export {VueMenu};

export type SpectrumMenuProps<T = unknown> = Record<string, unknown> & {
  item?: T
};
export type SpectrumActionMenuProps<T = unknown> = SpectrumMenuProps<T>;
export type SpectrumMenuTriggerProps = SpectrumMenuProps;
export type SpectrumMenuDialogTriggerProps = SpectrumMenuProps;
export type SpectrumSubmenuTriggerProps<T = unknown> = SpectrumMenuProps<T>;
