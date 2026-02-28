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
import {computed, unref} from 'vue';

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

function toKeySet(values: unknown): Set<string> {
  let resolvedValues = unref(values as unknown);
  values = resolvedValues;

  if (!values || typeof values !== 'object') {
    return new Set();
  }

  if (values instanceof Set) {
    return new Set(Array.from(values, (key) => String(key)));
  }

  if (Symbol.iterator in values) {
    return new Set(Array.from(values as Iterable<unknown>, (key) => String(key)));
  }

  return new Set();
}

function applySelectedKeysToState(stateRecord: ToggleGroupState, nextSelection: Set<string>): void {
  let setSelectedKeys = stateRecord.setSelectedKeys;
  if (typeof setSelectedKeys === 'function') {
    setSelectedKeys(new Set(nextSelection));
    return;
  }

  let previousSelection = toKeySet(stateRecord.selectedKeys);
  let setSelected = stateRecord.setSelected;
  if (typeof setSelected === 'function') {
    for (let key of previousSelection) {
      if (!nextSelection.has(key)) {
        setSelected(key, false);
      }
    }

    for (let key of nextSelection) {
      if (!previousSelection.has(key)) {
        setSelected(key, true);
      }
    }

    return;
  }

  let toggleKey = stateRecord.toggleKey;
  if (typeof toggleKey === 'function') {
    for (let key of previousSelection) {
      if (!nextSelection.has(key)) {
        toggleKey(key);
      }
    }

    for (let key of nextSelection) {
      if (!previousSelection.has(key)) {
        toggleKey(key);
      }
    }

    return;
  }

  stateRecord.selectedKeys = new Set(nextSelection);
}

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
export function useToggleButton(
  options: AriaToggleButtonOptions,
  state?: ToggleState,
  refObject?: RefObject<Element | null>
): ToggleButtonAria {
  void refObject;
  if (state) {
    let stateRecord = state as ToggleState;
    return useToggleButtonInternal({
      ...options,
      isSelected: computed(() => Boolean(unref(stateRecord.isSelected as boolean | undefined))),
      setSelected: (isSelected) => {
        if (Boolean(unref(stateRecord.isSelected as boolean | undefined)) === isSelected) {
          return;
        }

        let toggle = stateRecord.toggle;
        if (typeof toggle === 'function') {
          toggle();
          return;
        }

        let setSelected = stateRecord.setSelected;
        if (typeof setSelected === 'function') {
          setSelected(isSelected);
          return;
        }

        stateRecord.isSelected = isSelected;
      }
    });
  }

  return useToggleButtonInternal(options);
}

export function useToggleButtonGroup(
  options: AriaToggleButtonGroupProps,
  state: ToggleGroupState,
  ref: RefObject<HTMLElement | null>
): ToggleButtonGroupAria;
export function useToggleButtonGroup(options: AriaToggleButtonGroupProps): ToggleButtonGroupAria;
export function useToggleButtonGroup(
  options: AriaToggleButtonGroupProps,
  state?: ToggleGroupState,
  refObject?: RefObject<HTMLElement | null>
): ToggleButtonGroupAria {
  void refObject;
  if (state) {
    let stateRecord = state as ToggleGroupState;
    let selectedKeys = computed<Set<string>>({
      get: () => toKeySet(stateRecord.selectedKeys),
      set: (nextSelection) => {
        applySelectedKeysToState(stateRecord, new Set(nextSelection));
      }
    });
    let selectionMode = computed(() => {
      let mode = unref(stateRecord.selectionMode as 'single' | 'multiple' | undefined);
      if (mode === 'single' || mode === 'multiple') {
        return mode;
      }

      let optionMode = unref(options.selectionMode);
      return optionMode === 'single' ? 'single' : 'multiple';
    });

    return useToggleButtonGroupInternal({
      ...options,
      isDisabled: computed(() => Boolean(unref(options.isDisabled)) || Boolean(unref(stateRecord.isDisabled as boolean | undefined))),
      selectedKeys,
      selectionMode
    });
  }

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
export function useToggleButtonGroupItem(
  options: AriaToggleButtonGroupItemOptions,
  state?: ToggleGroupState,
  refObject?: RefObject<Element | null>
): ToggleButtonGroupItemAria {
  if (state) {
    let stateRecord = state as ToggleGroupState;
    let optionsRecord = options as Record<string, unknown>;
    let group = useToggleButtonGroup({
      isDisabled: computed(() => Boolean(unref(stateRecord.isDisabled as boolean | undefined))),
      selectedKeys: computed<Set<string>>({
        get: () => toKeySet(stateRecord.selectedKeys),
        set: (nextSelection) => {
          applySelectedKeysToState(stateRecord, new Set(nextSelection));
        }
      }),
      selectionMode: computed(() => {
        let mode = unref(stateRecord.selectionMode as 'single' | 'multiple' | undefined);
        return mode === 'single' ? 'single' : 'multiple';
      })
    }, stateRecord, refObject as RefObject<HTMLElement | null> | undefined);

    return useToggleButtonGroupItemInternal({
      ...options,
      group,
      id: String(optionsRecord.id ?? '')
    });
  }

  return useToggleButtonGroupItemInternal(options);
}
