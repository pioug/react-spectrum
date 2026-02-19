import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type AutocompleteItem = {
  id: string,
  textValue: string
};

export type AutocompleteItemInput =
  | string
  | {
      id: string,
      textValue: string
    };

export interface AriaAutocompleteOptions {
  disabled?: MaybeRef<boolean>,
  inputValue: MaybeRef<string>,
  items: MaybeRef<AutocompleteItemInput[]>,
  shouldAutoFocusFirst?: MaybeRef<boolean>
}

export interface AutocompleteAria {
  collectionProps: ComputedRef<{
    role: 'listbox'
  }>,
  filter: (item: AutocompleteItem) => boolean,
  filteredItems: ComputedRef<AutocompleteItem[]>,
  focusedKey: ComputedRef<string | null>,
  inputProps: ComputedRef<{
    'aria-autocomplete': 'list',
    'aria-expanded': boolean,
    disabled: boolean,
    value: string
  }>
}

function normalizeItem(item: AutocompleteItemInput): AutocompleteItem {
  if (typeof item === 'string') {
    return {
      id: item,
      textValue: item
    };
  }

  return {
    id: item.id,
    textValue: item.textValue
  };
}

function normalizeQuery(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function useAutocomplete(options: AriaAutocompleteOptions): AutocompleteAria {
  let query = computed(() => normalizeQuery(String(unref(options.inputValue))));
  let disabled = computed(() => Boolean(unref(options.disabled)));
  let shouldAutoFocusFirst = computed(() => Boolean(unref(options.shouldAutoFocusFirst ?? true)));

  let items = computed(() => {
    let sourceItems = unref(options.items);
    return sourceItems.map((item) => normalizeItem(item));
  });

  let filter = (item: AutocompleteItem) => {
    if (!query.value) {
      return true;
    }

    return item.textValue.toLocaleLowerCase().includes(query.value);
  };

  let filteredItems = computed(() => items.value.filter((item) => filter(item)));

  let focusedKey = computed(() => {
    if (!shouldAutoFocusFirst.value || filteredItems.value.length === 0) {
      return null;
    }

    return filteredItems.value[0].id;
  });

  let collectionProps = computed(() => ({
    role: 'listbox' as const
  }));

  let inputProps = computed(() => ({
    value: String(unref(options.inputValue)),
    disabled: disabled.value,
    'aria-autocomplete': 'list' as const,
    'aria-expanded': filteredItems.value.length > 0
  }));

  return {
    inputProps,
    collectionProps,
    filteredItems,
    focusedKey,
    filter
  };
}
