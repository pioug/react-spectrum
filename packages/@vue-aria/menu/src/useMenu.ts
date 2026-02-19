import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef, MenuKey, SelectionMode} from './types';

export interface AriaMenuOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  onAction?: (key: MenuKey) => void,
  selectedKeys?: Ref<Set<MenuKey>>,
  selectionMode?: MaybeRef<SelectionMode>
}

export interface MenuAria {
  focusKey: (key: MenuKey | null) => void,
  focusedKey: Ref<MenuKey | null>,
  menuProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id: string,
    role: 'menu'
  }>,
  onAction?: (key: MenuKey) => void,
  selectedKeys: Ref<Set<MenuKey>>,
  selectionMode: ComputedRef<SelectionMode>,
  toggleSelection: (key: MenuKey) => void
}

let menuCounter = 0;

function resolveOptionalValue(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useMenu(options: AriaMenuOptions = {}): MenuAria {
  menuCounter += 1;

  let id = computed(() => resolveOptionalValue(options.id) ?? `vue-menu-${menuCounter}`);
  let focusedKey = ref<MenuKey | null>(null);
  let selectedKeys = options.selectedKeys ?? ref(new Set<MenuKey>());
  let selectionMode = computed(() => unref(options.selectionMode) ?? 'none');

  let toggleSelection = (key: MenuKey) => {
    if (selectionMode.value === 'none') {
      return;
    }

    if (selectionMode.value === 'single') {
      if (selectedKeys.value.has(key)) {
        selectedKeys.value = new Set();
      } else {
        selectedKeys.value = new Set([key]);
      }
      return;
    }

    let nextKeys = new Set(selectedKeys.value);
    if (nextKeys.has(key)) {
      nextKeys.delete(key);
    } else {
      nextKeys.add(key);
    }
    selectedKeys.value = nextKeys;
  };

  return {
    focusKey: (key) => {
      focusedKey.value = key;
    },
    focusedKey,
    menuProps: computed(() => ({
      id: id.value,
      role: 'menu' as const,
      'aria-label': resolveOptionalValue(options.ariaLabel) ?? resolveOptionalValue(options['aria-label']),
      'aria-labelledby': resolveOptionalValue(options.ariaLabelledby) ?? resolveOptionalValue(options['aria-labelledby'])
    })),
    onAction: options.onAction,
    selectedKeys,
    selectionMode,
    toggleSelection
  };
}
