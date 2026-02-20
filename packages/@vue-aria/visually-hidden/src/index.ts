import {
  VISUALLY_HIDDEN_STYLES,
  useVisuallyHidden as useVisuallyHiddenInternal,
  type AriaVisuallyHiddenOptions,
  type HiddenStyle,
  type VisuallyHiddenAria
} from './useVisuallyHidden';
import {VisuallyHidden, type VisuallyHiddenProps} from './VisuallyHidden';

export {VISUALLY_HIDDEN_STYLES, VisuallyHidden};
export type {AriaVisuallyHiddenOptions, HiddenStyle, VisuallyHiddenAria, VisuallyHiddenProps};

export function useVisuallyHidden(props?: VisuallyHiddenProps): VisuallyHiddenAria;
export function useVisuallyHidden(options: AriaVisuallyHiddenOptions = {}): VisuallyHiddenAria {
  return useVisuallyHiddenInternal(options);
}
