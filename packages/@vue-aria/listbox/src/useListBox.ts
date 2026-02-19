import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {listData, type ListData, type ListKey} from './utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type SelectionMode = 'multiple' | 'none' | 'single';

export interface ListBoxItemNode {
  description?: string,
  index: number,
  isDisabled?: boolean,
  key: ListKey,
  textValue?: string
}

export interface ListBoxCollection {
  items: ListBoxItemNode[]
}

export interface AriaListBoxOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  isVirtualized?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  onAction?: (key: ListKey) => void,
  selectionMode?: MaybeRef<SelectionMode>,
  shouldFocusOnHover?: MaybeRef<boolean>,
  shouldSelectOnPressUp?: MaybeRef<boolean>,
  shouldUseVirtualFocus?: MaybeRef<boolean>
}

export interface ListBoxAria {
  collection: ComputedRef<ListBoxCollection>,
  focusedKey: Ref<ListKey | null>,
  isVirtualized: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    id?: string,
    role?: 'presentation'
  }>,
  listBoxProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-multiselectable'?: 'true',
    id: string,
    role: 'listbox'
  }>,
  onAction?: (key: ListKey) => void,
  selectKey: (key: ListKey) => void,
  selectedKeys: Ref<Set<ListKey>>,
  selectionMode: ComputedRef<SelectionMode>,
  shouldFocusOnHover: ComputedRef<boolean>,
  shouldSelectOnPressUp: ComputedRef<boolean>,
  shouldUseVirtualFocus: ComputedRef<boolean>,
  toggleSelection: (key: ListKey) => void
}

let listBoxCounter = 0;

function resolveOptionalValue(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useListBox(options: AriaListBoxOptions, collection: MaybeRef<ListBoxCollection>, selectedKeys?: Ref<Set<ListKey>>): ListBoxAria {
  listBoxCounter += 1;

  let internalSelectedKeys = selectedKeys ?? ref(new Set<ListKey>());
  let focusedKey = ref<ListKey | null>(null);
  let resolvedCollection = computed(() => unref(collection));
  let selectionMode = computed(() => unref(options.selectionMode) ?? 'single');
  let isVirtualized = computed(() => Boolean(unref(options.isVirtualized)));
  let shouldSelectOnPressUp = computed(() => Boolean(unref(options.shouldSelectOnPressUp)));
  let shouldFocusOnHover = computed(() => Boolean(unref(options.shouldFocusOnHover)));
  let shouldUseVirtualFocus = computed(() => Boolean(unref(options.shouldUseVirtualFocus)));

  let id = computed(() => resolveOptionalValue(options.id) ?? `vue-listbox-${listBoxCounter}`);
  let label = computed(() => resolveOptionalValue(options.label));
  let labelId = computed(() => (label.value ? `${id.value}-label` : undefined));

  let listBox = {
    collection: resolvedCollection,
    focusedKey,
    isVirtualized,
    labelProps: computed(() => ({
      id: labelId.value,
      role: label.value ? ('presentation' as const) : undefined
    })),
    listBoxProps: computed(() => ({
      id: id.value,
      role: 'listbox' as const,
      'aria-label': resolveOptionalValue(options.ariaLabel) ?? resolveOptionalValue(options['aria-label']),
      'aria-labelledby': labelId.value
        ? [labelId.value, resolveOptionalValue(options.ariaLabelledby) ?? resolveOptionalValue(options['aria-labelledby'])].filter(Boolean).join(' ')
        : resolveOptionalValue(options.ariaLabelledby) ?? resolveOptionalValue(options['aria-labelledby']),
      'aria-multiselectable': selectionMode.value === 'multiple' ? ('true' as const) : undefined
    })),
    onAction: options.onAction,
    selectKey: (key: ListKey) => {
      if (selectionMode.value === 'none') {
        return;
      }

      if (selectionMode.value === 'single') {
        internalSelectedKeys.value = new Set([key]);
      } else {
        let nextKeys = new Set(internalSelectedKeys.value);
        nextKeys.add(key);
        internalSelectedKeys.value = nextKeys;
      }
    },
    selectedKeys: internalSelectedKeys,
    selectionMode,
    shouldFocusOnHover,
    shouldSelectOnPressUp,
    shouldUseVirtualFocus,
    toggleSelection: (key: ListKey) => {
      if (selectionMode.value === 'none') {
        return;
      }

      if (selectionMode.value === 'single') {
        let nextKeys = new Set<ListKey>();
        if (!internalSelectedKeys.value.has(key)) {
          nextKeys.add(key);
        }
        internalSelectedKeys.value = nextKeys;
        return;
      }

      let nextKeys = new Set(internalSelectedKeys.value);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }
      internalSelectedKeys.value = nextKeys;
    }
  } satisfies ListBoxAria;

  let data: ListData = {
    id: id.value,
    isVirtualized: isVirtualized.value,
    onAction: options.onAction,
    shouldFocusOnHover: shouldFocusOnHover.value,
    shouldSelectOnPressUp: shouldSelectOnPressUp.value,
    shouldUseVirtualFocus: shouldUseVirtualFocus.value
  };

  listData.set(listBox as object, data);

  return listBox;
}
