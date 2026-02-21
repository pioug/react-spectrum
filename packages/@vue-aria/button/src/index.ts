import {type AriaButtonOptions as AriaButtonOptionsBase, type AriaHasPopup, type ButtonAria as ButtonAriaBase, type ButtonProps, useButton as useButtonInternal} from './useButton';
import {
  type AriaToggleButtonGroupItemOptions as AriaToggleButtonGroupItemOptionsBase,
  type AriaToggleButtonGroupOptions as AriaToggleButtonGroupOptionsBase,
  type ToggleButtonGroupAria as ToggleButtonGroupAriaBase,
  type ToggleButtonGroupItemAria as ToggleButtonGroupItemAriaBase,
  type ToggleButtonGroupOrientation,
  type ToggleButtonGroupSelectionMode,
  useToggleButtonGroup as useToggleButtonGroupInternal,
  useToggleButtonGroupItem as useToggleButtonGroupItemInternal
} from './useToggleButtonGroup';
import {type AriaToggleButtonOptions as AriaToggleButtonOptionsBase, type ToggleButtonAria as ToggleButtonAriaBase, useToggleButton as useToggleButtonInternal} from './useToggleButton';

type RefObject<T> = {
  current: T
};

type ElementType = 'a' | 'button' | 'div' | 'input' | 'span' | (string & {});
type DOMAttributes = Record<string, unknown>;
type AnchorHTMLAttributes<T> = DOMAttributes;
type ButtonHTMLAttributes<T> = DOMAttributes;
type HTMLAttributes<T> = DOMAttributes;
type InputHTMLAttributes<T> = DOMAttributes;
type AriaButtonOptions<T extends ElementType = ElementType> = AriaButtonOptionsBase;
type AriaToggleButtonOptions<T extends ElementType = ElementType> = AriaToggleButtonOptionsBase;
type AriaToggleButtonGroupOptions = AriaToggleButtonGroupOptionsBase;
type AriaToggleButtonGroupItemOptions<T extends ElementType = ElementType> = AriaToggleButtonGroupItemOptionsBase;
type ButtonAria<T = DOMAttributes> = ButtonAriaBase;
type ToggleButtonAria<T = DOMAttributes> = ToggleButtonAriaBase;
type ToggleButtonGroupAria = ToggleButtonGroupAriaBase;
type ToggleButtonGroupItemAria = ToggleButtonGroupItemAriaBase;

export interface AriaButtonProps extends Record<string, unknown> {}
export interface AriaToggleButtonProps extends AriaButtonProps {}
export interface AriaToggleButtonGroupProps extends AriaToggleButtonGroupOptions {}
export interface AriaToggleButtonGroupItemProps extends AriaToggleButtonGroupItemOptions {}

export type {
  AriaToggleButtonGroupItemOptions,
  AriaToggleButtonGroupOptions,
  ToggleButtonGroupAria,
  ToggleButtonGroupItemAria,
  ToggleButtonGroupOrientation,
  ToggleButtonGroupSelectionMode,
  AriaButtonOptions,
  AriaHasPopup,
  ButtonAria,
  ButtonProps,
  AriaToggleButtonOptions,
  ToggleButtonAria
};

export function useButton<T extends ElementType>(
  options: AriaButtonOptions<T>,
  ref: RefObject<Element | null>
): ButtonAria;
export function useButton(options: AriaButtonOptions<'a'>, ref: RefObject<HTMLAnchorElement | null>): ButtonAria<AnchorHTMLAttributes<HTMLAnchorElement>>;
export function useButton(options: AriaButtonOptions<'button'>, ref: RefObject<HTMLButtonElement | null>): ButtonAria<ButtonHTMLAttributes<HTMLButtonElement>>;
export function useButton(options: AriaButtonOptions<'div'>, ref: RefObject<HTMLDivElement | null>): ButtonAria<HTMLAttributes<HTMLDivElement>>;
export function useButton(options: AriaButtonOptions<'input'>, ref: RefObject<HTMLInputElement | null>): ButtonAria<InputHTMLAttributes<HTMLInputElement>>;
export function useButton(options: AriaButtonOptions<'span'>, ref: RefObject<HTMLSpanElement | null>): ButtonAria<HTMLAttributes<HTMLSpanElement>>;
export function useButton(options: AriaButtonOptions<ElementType>, ref: RefObject<Element | null>): ButtonAria<DOMAttributes>;
export function useButton(options: AriaButtonOptions): ButtonAria;
export function useButton(options: AriaButtonOptions): ButtonAria {
  return useButtonInternal(options);
}

type ToggleState = Record<string, unknown>;
type ToggleGroupState = Record<string, unknown>;

export function useToggleButton<T extends ElementType>(
  options: AriaToggleButtonOptions<T>,
  state: ToggleState,
  ref: RefObject<Element | null>
): ToggleButtonAria;
export function useToggleButton(options: AriaToggleButtonOptions<'a'>, state: ToggleState, ref: RefObject<HTMLAnchorElement | null>): ToggleButtonAria<AnchorHTMLAttributes<HTMLAnchorElement>>;
export function useToggleButton(options: AriaToggleButtonOptions<'button'>, state: ToggleState, ref: RefObject<HTMLButtonElement | null>): ToggleButtonAria<ButtonHTMLAttributes<HTMLButtonElement>>;
export function useToggleButton(options: AriaToggleButtonOptions<'div'>, state: ToggleState, ref: RefObject<HTMLDivElement | null>): ToggleButtonAria<HTMLAttributes<HTMLDivElement>>;
export function useToggleButton(options: AriaToggleButtonOptions<'input'>, state: ToggleState, ref: RefObject<HTMLInputElement | null>): ToggleButtonAria<InputHTMLAttributes<HTMLInputElement>>;
export function useToggleButton(options: AriaToggleButtonOptions<'span'>, state: ToggleState, ref: RefObject<HTMLSpanElement | null>): ToggleButtonAria<HTMLAttributes<HTMLSpanElement>>;
export function useToggleButton(options: AriaToggleButtonOptions<ElementType>, state: ToggleState, ref: RefObject<Element | null>): ToggleButtonAria<DOMAttributes>;
export function useToggleButton(options: AriaToggleButtonOptions): ToggleButtonAria;
export function useToggleButton(options: AriaToggleButtonOptions): ToggleButtonAria {
  return useToggleButtonInternal(options);
}

export function useToggleButtonGroup(
  options: AriaToggleButtonGroupProps,
  state: ToggleGroupState,
  ref: RefObject<HTMLElement | null>
): ToggleButtonGroupAria;
export function useToggleButtonGroup(options: AriaToggleButtonGroupProps): ToggleButtonGroupAria;
export function useToggleButtonGroup(options: AriaToggleButtonGroupProps): ToggleButtonGroupAria {
  return useToggleButtonGroupInternal(options);
}

export function useToggleButtonGroupItem<T extends ElementType>(
  options: AriaToggleButtonGroupItemOptions<T>,
  state: ToggleGroupState,
  ref: RefObject<Element | null>
): ToggleButtonAria;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions<'a'>, state: ToggleGroupState, ref: RefObject<HTMLAnchorElement | null>): ToggleButtonAria<AnchorHTMLAttributes<HTMLAnchorElement>>;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions<'button'>, state: ToggleGroupState, ref: RefObject<HTMLButtonElement | null>): ToggleButtonAria<ButtonHTMLAttributes<HTMLButtonElement>>;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions<'div'>, state: ToggleGroupState, ref: RefObject<HTMLDivElement | null>): ToggleButtonAria<HTMLAttributes<HTMLDivElement>>;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions<'input'>, state: ToggleGroupState, ref: RefObject<HTMLInputElement | null>): ToggleButtonAria<InputHTMLAttributes<HTMLInputElement>>;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions<'span'>, state: ToggleGroupState, ref: RefObject<HTMLSpanElement | null>): ToggleButtonAria<HTMLAttributes<HTMLSpanElement>>;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions<ElementType>, state: ToggleGroupState, ref: RefObject<Element | null>): ToggleButtonAria<DOMAttributes>;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions): ToggleButtonGroupItemAria;
export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions): ToggleButtonGroupItemAria {
  return useToggleButtonGroupItemInternal(options);
}
