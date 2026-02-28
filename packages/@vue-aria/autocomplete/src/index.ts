import {type AutocompleteItem, type AutocompleteItemInput, useAutocomplete as useAutocompleteInternal, type AriaAutocompleteOptions as VueAriaAutocompleteOptions, type AutocompleteAria as VueAutocompleteAria} from './useAutocomplete';
import {computed, isRef, ref, type Ref, watch} from 'vue';
import type {AutocompleteState} from '@vue-stately/autocomplete';
import type {ComboBoxState} from '@vue-stately/combobox';
import {useSearchAutocomplete as useSearchAutocompleteInternal, type AriaSearchAutocompleteOptions as VueAriaSearchAutocompleteOptions, type SearchAutocompleteAria as VueSearchAutocompleteAria} from './useSearchAutocomplete';

type AnyRecord = Record<string, unknown>;

function readMaybeRef<T>(value: unknown): T {
  if (isRef(value)) {
    return value.value as T;
  }

  return value as T;
}

function normalizeAutocompleteItem(value: unknown): AutocompleteItemInput | null {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  let record = value as AnyRecord;
  let id = record.id ?? record.key ?? record.value ?? record.textValue;
  if (typeof id !== 'string' && typeof id !== 'number') {
    return null;
  }

  let textValue = record.textValue;
  if (typeof textValue !== 'string') {
    textValue = String(id);
  }

  return {
    id: String(id),
    textValue
  };
}

function getAutocompleteItems(source: unknown): AutocompleteItemInput[] {
  let resolvedSource = readMaybeRef<unknown>(source);
  if (!resolvedSource) {
    return [];
  }

  if (Array.isArray(resolvedSource)) {
    return resolvedSource
      .map((entry) => normalizeAutocompleteItem(entry))
      .filter((entry): entry is AutocompleteItemInput => entry != null);
  }

  if (resolvedSource && typeof resolvedSource === 'object' && Symbol.iterator in resolvedSource) {
    return Array.from(resolvedSource as Iterable<unknown>)
      .map((entry) => normalizeAutocompleteItem(entry))
      .filter((entry): entry is AutocompleteItemInput => entry != null);
  }

  return [];
}

function createInputValueRef(stateRecord: AnyRecord): Ref<string> {
  let stateInputValue = stateRecord.inputValue;
  if (isRef(stateInputValue)) {
    return computed<string>({
      get: () => String(stateInputValue.value ?? ''),
      set: (nextValue) => {
        if (typeof stateRecord.setInputValue === 'function') {
          stateRecord.setInputValue(nextValue);
          return;
        }

        stateInputValue.value = nextValue;
      }
    }) as Ref<string>;
  }

  if (typeof stateRecord.setInputValue === 'function') {
    return computed<string>({
      get: () => String(readMaybeRef<unknown>(stateRecord.inputValue) ?? ''),
      set: (nextValue) => {
        stateRecord.setInputValue(nextValue);
      }
    }) as Ref<string>;
  }

  return ref('');
}

function createAutocompleteFromState(
  options: VueAriaAutocompleteOptions,
  stateRecord: AnyRecord
): VueAutocompleteAria {
  let inputValue = options.inputValue ?? createInputValueRef(stateRecord);
  let stateItems = stateRecord.filteredCollection ?? stateRecord.collection ?? stateRecord.items;
  let items = options.items ?? computed(() => getAutocompleteItems(stateItems));
  let shouldAutoFocusFirst = options.shouldAutoFocusFirst
    ?? (typeof (options as AnyRecord).disableAutoFocusFirst === 'boolean'
      ? !(options as AnyRecord).disableAutoFocusFirst
      : undefined);

  let autocomplete = useAutocompleteInternal({
    ...options,
    inputValue,
    items,
    shouldAutoFocusFirst
  });

  if (typeof stateRecord.setFocusedNodeId === 'function') {
    watch(
      () => [autocomplete.collectionProps.value.id, autocomplete.focusedKey.value] as const,
      ([collectionId, focusedKey]) => {
        stateRecord.setFocusedNodeId(focusedKey == null ? null : `${collectionId}-option-${focusedKey}`);
      },
      {immediate: true}
    );
  }

  return autocomplete;
}

function isAutocompleteStateLike(value: unknown): value is AnyRecord {
  return Boolean(value && typeof value === 'object' && ('inputValue' in (value as AnyRecord) || 'setInputValue' in (value as AnyRecord)));
}

export type AriaAutocompleteOptions<T = unknown> = VueAriaAutocompleteOptions;
export type AriaSearchAutocompleteOptions<T = unknown> = VueAriaSearchAutocompleteOptions;
export type AutocompleteAria<T = unknown> = VueAutocompleteAria;
export type SearchAutocompleteAria<T = unknown> = VueSearchAutocompleteAria;
export type {
  AutocompleteItem,
  AutocompleteItemInput
};
export type {
  AriaAutocompleteOptions as AriaAutocompleteProps,
  AriaAutocompleteOptions as CollectionOptions
};
export type {AriaSearchAutocompleteOptions as AriaSearchAutocompleteProps};
export type {AutocompleteAria as InputProps};

export function useAutocomplete<T>(
  options: AriaAutocompleteOptions<T>,
  state: AutocompleteState
): AutocompleteAria<T>;
export function useAutocomplete(options: VueAriaAutocompleteOptions): VueAutocompleteAria;
export function useAutocomplete(
  options: VueAriaAutocompleteOptions,
  state?: AutocompleteState
): VueAutocompleteAria {
  if (state && isAutocompleteStateLike(state)) {
    return createAutocompleteFromState(options, state as AnyRecord);
  }

  return useAutocompleteInternal(options);
}

export function useSearchAutocomplete<T>(
  options: AriaSearchAutocompleteOptions<T>,
  state: ComboBoxState<T>
): SearchAutocompleteAria<T>;
export function useSearchAutocomplete(options: VueAriaSearchAutocompleteOptions): VueSearchAutocompleteAria;
export function useSearchAutocomplete(
  options: VueAriaSearchAutocompleteOptions,
  state?: ComboBoxState<unknown>
): VueSearchAutocompleteAria {
  if (state && isAutocompleteStateLike(state)) {
    let stateRecord = state as unknown as AnyRecord;
    let items = options.items ?? computed(() => getAutocompleteItems(stateRecord.filteredCollection ?? stateRecord.collection ?? stateRecord.items));
    return useSearchAutocompleteInternal({
      ...options,
      inputValue: options.inputValue ?? createInputValueRef(stateRecord),
      items
    });
  }

  return useSearchAutocompleteInternal(options);
}
