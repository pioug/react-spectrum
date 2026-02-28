import {computed, type ComputedRef, type Ref, unref, watchEffect} from 'vue';
import {
  type Key,
  type SingleSelectListProps,
  type SingleSelectListState,
  useSingleSelectListState
} from '@vue-stately/list';
import {useControlledState} from '@vue-stately/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

function buildKeyMaps<T>(state: SingleSelectListState<T>) {
  let indexMap = new Map<Key, number>();
  let previousKeyMap = new Map<Key, Key | null>();

  let previousKey: Key | null = null;
  let index = 0;
  for (let key of state.collection.getKeys()) {
    indexMap.set(key, index);
    previousKeyMap.set(key, previousKey);
    previousKey = key;
    index += 1;
  }

  return {
    indexMap,
    previousKeyMap
  };
}

export interface StepListProps<T> extends Omit<SingleSelectListProps<T>, 'onSelectionChange'> {
  defaultLastCompletedStep?: Key | null,
  isDisabled?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  lastCompletedStep?: Ref<Key | null | undefined>,
  onLastCompletedStepChange?: (key: Key | null) => void,
  onSelectionChange?: (key: Key) => void
}

export interface StepListState<T> extends SingleSelectListState<T> {
  lastCompletedStep: ComputedRef<Key | null>,
  isCompleted: (key: Key | null | undefined) => boolean,
  isSelectable: (key: Key) => boolean,
  setLastCompletedStep: (key: Key | null) => void,
  setSelectedKey: (key: Key | null) => void
}

/**
 * Provides state management for step-list selection and completion flows.
 */
export function useStepListState<T extends object>(props: StepListProps<T>): StepListState<T> {
  let state = useSingleSelectListState<T>({
    ...props,
    onSelectionChange: props.onSelectionChange
      ? (key) => {
        if (key != null) {
          props.onSelectionChange?.(key);
        }
      }
      : undefined
  });

  let [lastCompletedStep, setLastCompletedStepInternal] = useControlledState(
    props.lastCompletedStep,
    props.defaultLastCompletedStep ?? null,
    props.onLastCompletedStepChange
  );

  let setLastCompletedStep = (key: Key | null): void => {
    setLastCompletedStepInternal(key);
  };

  let {indexMap, previousKeyMap} = buildKeyMaps(state);

  let isCompleted = (step: Key | null | undefined): boolean => {
    if (step == null || lastCompletedStep.value == null) {
      return false;
    }

    let stepIndex = indexMap.get(step);
    let completedIndex = indexMap.get(lastCompletedStep.value);
    if (stepIndex == null || completedIndex == null) {
      return false;
    }

    return stepIndex <= completedIndex;
  };

  let findDefaultSelectedKey = (): Key | null => {
    if (state.collection.size === 0) {
      return null;
    }

    let firstKey = state.collection.getFirstKey();
    let lastKey = state.collection.getLastKey();
    let key = firstKey;

    while (
      key != null &&
      key !== lastKey &&
      (state.disabledKeys.has(key) || isCompleted(key))
    ) {
      key = state.collection.getKeyAfter(key);
    }

    return key;
  };

  watchEffect(() => {
    let selectedKey = state.selectedKey.value;
    if (selectedKey == null || !state.collection.getItem(selectedKey)) {
      let fallbackKey = findDefaultSelectedKey();
      if (fallbackKey != null) {
        state.selectionManager.replaceSelection(fallbackKey);
        selectedKey = fallbackKey;
      }
    }

    if (state.selectionManager.focusedKey.value == null) {
      state.selectionManager.setFocusedKey(selectedKey);
    }

    let selectedIndex = selectedKey == null ? undefined : indexMap.get(selectedKey);
    let completedIndex = lastCompletedStep.value == null ? -1 : (indexMap.get(lastCompletedStep.value) ?? -1);
    if (selectedIndex != null && selectedIndex > 0 && selectedIndex > completedIndex + 1) {
      let previousKey = previousKeyMap.get(selectedKey!) ?? null;
      setLastCompletedStep(previousKey);
    }
  });

  let isSelectable = (step: Key): boolean => {
    if (Boolean(unref(props.isDisabled)) || Boolean(unref(props.isReadOnly)) || state.disabledKeys.has(step)) {
      return false;
    }

    if (isCompleted(step)) {
      return true;
    }

    let previousStep = previousKeyMap.get(step) ?? null;
    return step === state.collection.getFirstKey() || isCompleted(previousStep);
  };

  let realSetSelectedKey = state.setSelectedKey;
  let setSelectedKey = (key: Key | null): void => {
    if (key == null) {
      realSetSelectedKey(null);
      return;
    }

    let previousStep = previousKeyMap.get(key) ?? null;
    if (previousStep != null && !isCompleted(previousStep)) {
      setLastCompletedStep(previousStep);
    }

    realSetSelectedKey(key);
  };

  return {
    ...state,
    lastCompletedStep,
    setLastCompletedStep,
    isCompleted,
    isSelectable,
    setSelectedKey
  };
}
