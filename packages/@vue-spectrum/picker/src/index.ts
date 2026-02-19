import {VuePicker} from '@vue-spectrum/components';

export type PickerItem = {
  disabled?: boolean,
  id: string,
  label: string
};

export type PickerSection = {
  id: string,
  items: PickerItem[],
  title: string
};

export const Picker = VuePicker;

export const Item = <T extends PickerItem>(item: T): T => item;
export const Section = <T extends PickerSection>(section: T): T => section;

export {VuePicker};
export type {SpectrumPickerProps} from '@react-types/select';
