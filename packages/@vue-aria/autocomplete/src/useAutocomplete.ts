import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useLabels} from '@vue-aria/utils';

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
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  disabled?: MaybeRef<boolean>,
  id?: MaybeRef<string | undefined>,
  inputValue: MaybeRef<string>,
  items: MaybeRef<AutocompleteItemInput[]>,
  shouldAutoFocusFirst?: MaybeRef<boolean>
}

export interface AutocompleteAria {
  collectionProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id?: string,
    role: 'listbox'
  }>,
  filter: (item: AutocompleteItem) => boolean,
  filteredItems: ComputedRef<AutocompleteItem[]>,
  focusedKey: ComputedRef<string | null>,
  inputProps: ComputedRef<{
    'aria-activedescendant'?: string,
    'aria-autocomplete': 'list',
    'aria-controls': string,
    'aria-expanded': boolean,
    autoComplete: 'off',
    autoCorrect: 'off',
    disabled: boolean,
    enterKeyHint: 'go',
    spellCheck: 'false',
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

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

let autocompleteCounter = 0;

export function useAutocomplete(options: AriaAutocompleteOptions): AutocompleteAria {
  autocompleteCounter += 1;

  let generatedCollectionId = `vue-autocomplete-${autocompleteCounter}-listbox`;
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

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']) ?? 'Suggestions');
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let collectionId = computed(() => resolveOptionalString(options.id) ?? generatedCollectionId);
  let collectionLabelProps = computed(() => {
    return useLabels({
      id: collectionId.value,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value
    });
  });
  let collectionProps = computed(() => ({
    role: 'listbox' as const,
    id: collectionLabelProps.value.id as string | undefined,
    'aria-label': collectionLabelProps.value['aria-label'],
    'aria-labelledby': collectionLabelProps.value['aria-labelledby']
  }));

  let inputProps = computed(() => ({
    value: String(unref(options.inputValue)),
    disabled: disabled.value,
    enterKeyHint: 'go' as const,
    'aria-autocomplete': 'list' as const,
    'aria-expanded': filteredItems.value.length > 0,
    'aria-controls': collectionId.value,
    autoCorrect: 'off' as const,
    spellCheck: 'false' as const,
    autoComplete: 'off' as const,
    'aria-activedescendant': focusedKey.value == null
      ? undefined
      : `${collectionId.value}-option-${focusedKey.value}`
  }));

  return {
    inputProps,
    collectionProps,
    filteredItems,
    focusedKey,
    filter
  };
}
