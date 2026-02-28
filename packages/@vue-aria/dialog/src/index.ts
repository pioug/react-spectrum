import {type AriaDialogOptions, type DialogAria, useDialog as useDialogInternal} from './useDialog';
import type {AriaDialogProps as ReactAriaDialogProps} from '@vue-types/dialog';

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
  let reactProps = options as AriaDialogProps & AriaDialogOptions;

  return useDialogInternal({
    ...options,
    ariaDescribedby: reactProps.ariaDescribedby ?? reactProps['aria-describedby'],
    ariaLabel: reactProps.ariaLabel ?? reactProps['aria-label'],
    ariaLabelledby: reactProps.ariaLabelledby ?? reactProps['aria-labelledby']
  });
}
