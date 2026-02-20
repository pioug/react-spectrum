import {useSpinButton as useSpinButtonInternal} from './useSpinButton';
import type {
  MaybeRef,
  SpinButtonKeyboardEvent,
  SpinButtonPointerType,
  SpinButtonPressEvent
} from './types';
import type {
  SpinButtonAria,
  SpinButtonOptions,
  SpinButtonProps,
  SpinButtonStepButtonProps
} from './useSpinButton';
type SpinbuttonAria = SpinButtonAria;

export type {
  MaybeRef,
  SpinButtonKeyboardEvent,
  SpinButtonPointerType,
  SpinButtonPressEvent
};
export type {
  SpinButtonAria,
  SpinButtonAria as SpinbuttonAria,
  SpinButtonOptions,
  SpinButtonProps,
  SpinButtonStepButtonProps
};

export function useSpinButton(props: SpinButtonProps): SpinbuttonAria;
export function useSpinButton(options: SpinButtonOptions = {}): SpinbuttonAria {
  return useSpinButtonInternal(options) as SpinbuttonAria;
}
