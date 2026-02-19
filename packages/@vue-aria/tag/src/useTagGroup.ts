import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import {type FieldAria, type LabelAriaProps, useField} from '@vue-aria/label';
import {type GridListAria, useGridList} from '@vue-aria/gridlist';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type TagSelectionMode = 'multiple' | 'none' | 'single';

export interface TagGroupItem {
  description?: string,
  isDisabled?: boolean,
  key: string,
  textValue?: string
}

export interface TagGroupItemNode {
  description?: string,
  index: number,
  isDisabled?: boolean,
  key: string,
  textValue?: string
}

export interface AriaTagGroupOptions extends LabelAriaProps {
  description?: MaybeRef<string | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  items: MaybeRef<Iterable<TagGroupItem>>,
  onAction?: (key: string) => void,
  onRemove?: (keys: Set<string>) => void,
  selectedKeys?: Ref<Set<string>>,
  selectionMode?: MaybeRef<TagSelectionMode>,
  shouldSelectOnPressUp?: MaybeRef<boolean>,
  validationState?: MaybeRef<'invalid' | 'valid' | undefined>
}

export interface TagGroupAria {
  collection: ComputedRef<{items: TagGroupItemNode[]}>,
  descriptionProps: FieldAria['descriptionProps'],
  errorMessageProps: FieldAria['errorMessageProps'],
  grid: GridListAria,
  gridProps: ComputedRef<{
    'aria-atomic': false,
    'aria-describedby'?: string,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-live': 'off' | 'polite',
    'aria-relevant': 'additions',
    id: string,
    onFocusin: () => void,
    onFocusout: () => void,
    role: 'grid' | 'group'
  }>,
  isDisabled: ComputedRef<boolean>,
  labelProps: FieldAria['labelProps'],
  onRemove?: (keys: Set<string>) => void,
  remove: (keys: Iterable<string>) => void,
  selectedKeys: Ref<Set<string>>
}

function normalizeItem(item: TagGroupItem, index: number, isDisabled: boolean): TagGroupItemNode {
  return {
    key: String(item.key),
    index,
    textValue: item.textValue ?? String(item.key),
    description: item.description,
    isDisabled: isDisabled || Boolean(item.isDisabled)
  };
}

function toKeySet(keys: Iterable<string>): Set<string> {
  return new Set(Array.from(keys, (key) => String(key)));
}

export function useTagGroup(options: AriaTagGroupOptions): TagGroupAria {
  let selectedKeys = options.selectedKeys ?? ref(new Set<string>());
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isFocusWithin = ref(false);
  let field = useField({
    'aria-label': options['aria-label'],
    'aria-labelledby': options['aria-labelledby'],
    ariaLabel: options.ariaLabel,
    ariaLabelledby: options.ariaLabelledby,
    description: options.description,
    errorMessage: options.errorMessage,
    id: options.id,
    isInvalid: options.isInvalid,
    label: options.label,
    labelElementType: 'span',
    validationState: options.validationState
  });

  let collection = computed(() => ({
    items: Array.from(unref(options.items), (item, index) => normalizeItem(item, index, isDisabled.value))
  }));

  let grid = useGridList({
    ariaLabel: computed(() => field.fieldProps.value['aria-label']),
    ariaLabelledby: computed(() => field.fieldProps.value['aria-labelledby']),
    collection,
    id: computed(() => field.fieldProps.value.id),
    onAction: options.onAction,
    selectedKeys,
    selectionMode: options.selectionMode,
    shouldSelectOnPressUp: options.shouldSelectOnPressUp
  });

  let remove = (keys: Iterable<string>) => {
    let normalizedKeys = toKeySet(keys);
    if (normalizedKeys.size === 0) {
      return;
    }

    options.onRemove?.(normalizedKeys);
  };

  return {
    collection,
    descriptionProps: field.descriptionProps,
    errorMessageProps: field.errorMessageProps,
    grid,
    gridProps: computed(() => ({
      ...grid.gridProps.value,
      role: collection.value.items.length > 0 ? 'grid' as const : 'group' as const,
      'aria-atomic': false as const,
      'aria-relevant': 'additions' as const,
      'aria-live': isFocusWithin.value ? 'polite' as const : 'off' as const,
      'aria-describedby': field.fieldProps.value['aria-describedby'],
      onFocusin: () => {
        isFocusWithin.value = true;
      },
      onFocusout: () => {
        isFocusWithin.value = false;
      }
    })),
    isDisabled,
    labelProps: field.labelProps,
    onRemove: options.onRemove,
    remove,
    selectedKeys
  };
}
