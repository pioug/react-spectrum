import {type AriaToggleButtonOptions, type ToggleButtonAria, useToggleButton} from './useToggleButton';
import {computed, type ComputedRef, isRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ToggleButtonGroupSelectionMode = 'multiple' | 'single';
export type ToggleButtonGroupOrientation = 'horizontal' | 'vertical';

export interface AriaToggleButtonGroupOptions {
  isDisabled?: MaybeRef<boolean>,
  orientation?: MaybeRef<ToggleButtonGroupOrientation>,
  selectedKeys?: Iterable<string> | Ref<Iterable<string>>,
  selectionMode?: MaybeRef<ToggleButtonGroupSelectionMode>
}

export interface ToggleButtonGroupAria {
  groupProps: ComputedRef<{
    'aria-disabled'?: boolean,
    'aria-orientation': ToggleButtonGroupOrientation,
    role: 'radiogroup' | 'toolbar'
  }>,
  isDisabled: ComputedRef<boolean>,
  isSelected: (key: string) => boolean,
  selectedKeys: ComputedRef<Set<string>>,
  selectionMode: ComputedRef<ToggleButtonGroupSelectionMode>,
  setSelected: (key: string, isSelected: boolean) => Set<string>,
  toggleKey: (key: string) => Set<string>
}

function normalizeSelectionMode(value: ToggleButtonGroupSelectionMode | undefined): ToggleButtonGroupSelectionMode {
  if (value === 'single') {
    return 'single';
  }

  return 'multiple';
}

function normalizeOrientation(value: ToggleButtonGroupOrientation | undefined): ToggleButtonGroupOrientation {
  if (value === 'vertical') {
    return 'vertical';
  }

  return 'horizontal';
}

function toKeySet(value: Iterable<string> | undefined): Set<string> {
  if (!value) {
    return new Set();
  }

  return new Set(Array.from(value, (key) => String(key)));
}

function setSelectedKeys(
  selectedKeys: Iterable<string> | Ref<Iterable<string>> | undefined,
  nextSelection: Set<string>
): void {
  if (!selectedKeys || !isRef(selectedKeys)) {
    return;
  }

  selectedKeys.value = new Set(nextSelection);
}

function resolveSelectedKeys(value: Iterable<string> | Ref<Iterable<string>> | undefined): Iterable<string> | undefined {
  if (!value) {
    return undefined;
  }

  if (isRef(value)) {
    return value.value;
  }

  return value;
}

export function useToggleButtonGroup(options: AriaToggleButtonGroupOptions = {}): ToggleButtonGroupAria {
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let selectionMode = computed(() => normalizeSelectionMode(unref(options.selectionMode)));
  let orientation = computed(() => normalizeOrientation(unref(options.orientation)));
  let selectedKeys = computed(() => toKeySet(resolveSelectedKeys(options.selectedKeys)));

  let setSelected = (key: string, isSelectedKey: boolean): Set<string> => {
    let nextSelection = new Set(selectedKeys.value);
    if (isDisabled.value) {
      return nextSelection;
    }

    if (selectionMode.value === 'single') {
      if (isSelectedKey) {
        nextSelection.clear();
        nextSelection.add(key);
      } else {
        nextSelection.delete(key);
      }
    } else if (isSelectedKey) {
      nextSelection.add(key);
    } else {
      nextSelection.delete(key);
    }

    setSelectedKeys(options.selectedKeys, nextSelection);
    return nextSelection;
  };

  let toggleKey = (key: string): Set<string> => {
    let nextSelected = !selectedKeys.value.has(key);
    return setSelected(key, nextSelected);
  };

  let isSelected = (key: string) => selectedKeys.value.has(key);

  let groupProps = computed(() => ({
    role: selectionMode.value === 'single' ? 'radiogroup' as const : 'toolbar' as const,
    'aria-orientation': orientation.value,
    'aria-disabled': isDisabled.value || undefined
  }));

  return {
    groupProps,
    isDisabled,
    isSelected,
    selectedKeys,
    selectionMode,
    setSelected,
    toggleKey
  };
}

export interface AriaToggleButtonGroupItemOptions extends Omit<AriaToggleButtonOptions, 'isSelected' | 'setSelected'> {
  group: ToggleButtonGroupAria,
  id: MaybeRef<string>,
  onSelectionChange?: (key: string, isSelected: boolean, selectedKeys: Set<string>) => void
}

export interface ToggleButtonGroupItemAria extends Omit<ToggleButtonAria, 'buttonProps'> {
  buttonProps: ComputedRef<{
    'aria-checked'?: boolean,
    'aria-controls'?: string,
    'aria-current'?: string,
    'aria-disabled'?: boolean,
    'aria-expanded'?: boolean,
    'aria-haspopup'?: boolean | 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree',
    'aria-pressed'?: boolean,
    disabled?: boolean,
    href?: string,
    rel?: string,
    role?: 'button' | 'radio',
    tabindex?: number,
    target?: string,
    type?: string
  }>,
  id: ComputedRef<string>,
  selectedKeys: ComputedRef<Set<string>>
}

export function useToggleButtonGroupItem(options: AriaToggleButtonGroupItemOptions): ToggleButtonGroupItemAria {
  let id = computed(() => String(unref(options.id)));
  let isSelected = computed(() => options.group.isSelected(id.value));

  let toggleButton = useToggleButton({
    ariaControls: options.ariaControls,
    ariaCurrent: options.ariaCurrent,
    ariaDisabled: options.ariaDisabled,
    ariaExpanded: options.ariaExpanded,
    ariaHasPopup: options.ariaHasPopup,
    ariaPressed: options.ariaPressed,
    elementType: options.elementType,
    href: options.href,
    isDisabled: computed(() => Boolean(unref(options.isDisabled)) || options.group.isDisabled.value),
    isSelected,
    onPress: options.onPress,
    onPressChange: options.onPressChange,
    onPressEnd: options.onPressEnd,
    onPressStart: options.onPressStart,
    onToggle: options.onToggle,
    rel: options.rel,
    setSelected: (nextSelected) => {
      let nextSelection = options.group.setSelected(id.value, nextSelected);
      options.onSelectionChange?.(id.value, nextSelected, nextSelection);
    },
    target: options.target,
    type: options.type
  });

  let buttonProps = computed(() => {
    let nextButtonProps = {
      ...toggleButton.buttonProps.value
    };

    if (options.group.selectionMode.value === 'single') {
      nextButtonProps.role = 'radio';
      nextButtonProps['aria-checked'] = isSelected.value;
      delete nextButtonProps['aria-pressed'];
    }

    return nextButtonProps;
  });

  return {
    ...toggleButton,
    buttonProps,
    id,
    selectedKeys: options.group.selectedKeys
  };
}
