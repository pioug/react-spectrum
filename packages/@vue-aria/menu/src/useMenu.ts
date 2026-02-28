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
  let ariaLabel = computed(() => resolveOptionalValue(options.ariaLabel) ?? resolveOptionalValue(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalValue(options.ariaLabelledby) ?? resolveOptionalValue(options['aria-labelledby']));

  if (!ariaLabel.value && !ariaLabelledby.value && process.env.NODE_ENV !== 'production') {
    console.warn('An aria-label or aria-labelledby prop is required for accessibility.');
  }

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
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value
    })),
    onAction: options.onAction,
    selectedKeys,
    selectionMode,
    toggleSelection
  };
}
