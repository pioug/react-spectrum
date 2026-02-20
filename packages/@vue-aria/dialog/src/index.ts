import {useDialog as useDialogInternal, type AriaDialogOptions, type DialogAria} from './useDialog';
import type {AriaDialogProps as ReactAriaDialogProps} from '@react-types/dialog';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;

export type AriaDialogProps = ReactAriaDialogProps;
export type {AriaDialogOptions, DialogAria};

export function useDialog(props: AriaDialogProps, ref: RefObject<FocusableElement | null>): DialogAria;
export function useDialog(
  options: AriaDialogOptions = {},
  refObject?: RefObject<FocusableElement | null>
): DialogAria {
  void refObject;
  return useDialogInternal(options);
}
