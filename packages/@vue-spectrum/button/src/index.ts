import {VueButton} from '@vue-spectrum/components';

export const Button = VueButton;
export const ActionButton = VueButton;
export const FieldButton = VueButton;
export const LogicButton = VueButton;
export const ClearButton = VueButton;
export const ToggleButton = VueButton;
export {VueButton};

export type SpectrumButtonProps = Record<string, unknown>;
export type SpectrumActionButtonProps = SpectrumButtonProps;
export type SpectrumLogicButtonProps = SpectrumButtonProps;
export type SpectrumToggleButtonProps = SpectrumButtonProps;
