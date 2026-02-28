import {computed, type ComputedRef, type Ref, ref, unref, watch, watchEffect} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export type Key = string | number;

export interface DisclosureGroupProps {
  /** Whether multiple items can be expanded at the same time. */
  allowsMultipleExpanded?: MaybeRef<boolean>,
  /** Whether all items are disabled. */
  isDisabled?: MaybeRef<boolean>,
  /** The currently expanded keys in the group (controlled). */
  expandedKeys?: Ref<Set<Key> | undefined>,
  /** The initial expanded keys in the group (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>,
  /** Handler that is called when items are expanded or collapsed. */
  onExpandedChange?: (keys: Set<Key>) => void
}

export interface DisclosureGroupState {
  /** Whether multiple items can be expanded at the same time. */
  allowsMultipleExpanded: ComputedRef<boolean>,

  /** Whether all items are disabled. */
  isDisabled: ComputedRef<boolean>,

  /** A set of keys for items that are expanded. */
  expandedKeys: ComputedRef<Set<Key>>,

  /** Toggles the expanded state for an item by its key. */
  toggleKey: (key: Key) => void,

  /** Replaces the set of expanded keys. */
  setExpandedKeys: (keys: Set<Key>) => void
}

/**
 * Manages state for a group of disclosures, e.g. an accordion.
 * It supports both single and multiple expanded items.
 */
export function useDisclosureGroupState(props: DisclosureGroupProps = {}): DisclosureGroupState {
  let allowsMultipleExpanded = computed(() => Boolean(unref(props.allowsMultipleExpanded)));
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let uncontrolledExpandedKeys = ref(new Set(props.defaultExpandedKeys ?? []));
  let isControlled = computed(() => props.expandedKeys !== undefined && props.expandedKeys.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let expandedKeys = computed(() => {
    if (isControlled.value && props.expandedKeys) {
      return props.expandedKeys.value;
    }

    return uncontrolledExpandedKeys.value;
  });

  let setExpandedKeys = (nextKeys: Set<Key>): void => {
    let normalizedKeys = new Set(nextKeys);

    if (!allowsMultipleExpanded.value && normalizedKeys.size > 1) {
      let firstKey = normalizedKeys.values().next().value;
      normalizedKeys = firstKey == null ? new Set() : new Set([firstKey]);
    }

    if (isControlled.value && props.expandedKeys) {
      props.expandedKeys.value = normalizedKeys;
    } else {
      uncontrolledExpandedKeys.value = normalizedKeys;
    }

    props.onExpandedChange?.(new Set(normalizedKeys));
  };

  watchEffect(() => {
    if (!allowsMultipleExpanded.value && expandedKeys.value.size > 1) {
      let firstKey = expandedKeys.value.values().next().value;
      setExpandedKeys(firstKey == null ? new Set() : new Set([firstKey]));
    }
  });

  let toggleKey = (key: Key): void => {
    if (isDisabled.value) {
      return;
    }

    if (allowsMultipleExpanded.value) {
      let nextKeys = new Set(expandedKeys.value);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }

      setExpandedKeys(nextKeys);
      return;
    }

    if (expandedKeys.value.has(key)) {
      setExpandedKeys(new Set());
      return;
    }

    setExpandedKeys(new Set([key]));
  };

  return {
    allowsMultipleExpanded,
    isDisabled,
    expandedKeys,
    toggleKey,
    setExpandedKeys
  };
}
