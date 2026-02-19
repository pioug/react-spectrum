import {VueDialog} from '@vue-spectrum/components';

export const Dialog = VueDialog;
export const AlertDialog = VueDialog;
export const DialogTrigger = VueDialog;
export const DialogContainer = VueDialog;
export {VueDialog};

export interface DialogContainerValue {
  close: () => void
}

export function useDialogContainer(): DialogContainerValue {
  return {
    close: () => {}
  };
}

export type SpectrumDialogProps = Record<string, unknown>;
export type SpectrumAlertDialogProps = SpectrumDialogProps;
export type SpectrumDialogTriggerProps = SpectrumDialogProps;
export type SpectrumDialogContainerProps = SpectrumDialogProps;
