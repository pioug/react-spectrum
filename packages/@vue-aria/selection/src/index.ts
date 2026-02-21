import {type AriaSelectableCollectionOptions, type SelectableCollectionAria, useSelectableCollection} from './useSelectableCollection';
import {type AriaSelectableListOptions, type SelectableListAria, useSelectableList} from './useSelectableList';
import {type AriaTypeSelectOptions, type TypeSelectAria, useTypeSelect} from './useTypeSelect';
import {DOMLayoutDelegate} from './DOMLayoutDelegate';
import type {KeyboardDelegate, MaybeRef, SelectionItem, SelectionKey, SelectionManager} from './types';
import {ListKeyboardDelegate} from './ListKeyboardDelegate';
import {ref} from 'vue';
import {
  type SelectableItemAria,
  type SelectableItemOptions,
  type SelectableItemStates,
  useSelectableItem as useSelectableItemInternal
} from './useSelectableItem';

function createFallbackSelectionManager(): SelectionManager {
  let selectedKeys = ref(new Set<SelectionKey>());
  let focusedKey = ref<SelectionKey | null>(null);

  return {
    focusedKey,
    selectedKeys,
    selectionMode: 'single',
    setFocusedKey: (key) => {
      focusedKey.value = key;
    },
    select: (key) => {
      selectedKeys.value = new Set([key]);
    }
  };
}

export {DOMLayoutDelegate, ListKeyboardDelegate, useSelectableCollection, useSelectableList, useTypeSelect};
export type {
  AriaSelectableCollectionOptions,
  SelectableCollectionAria,
  SelectableItemAria,
  SelectableItemOptions,
  SelectableItemStates,
  AriaSelectableListOptions,
  SelectableListAria,
  AriaTypeSelectOptions,
  TypeSelectAria,
  KeyboardDelegate,
  MaybeRef,
  SelectionItem,
  SelectionKey,
  SelectionManager
};

export function useSelectableItem(options: SelectableItemOptions): SelectableItemAria;
export function useSelectableItem(options: SelectableItemOptions): SelectableItemAria {
  let selectionManager = arguments[1] as SelectionManager | undefined;
  let states = arguments[2] as SelectableItemStates | undefined;

  return useSelectableItemInternal(
    options,
    selectionManager ?? createFallbackSelectionManager(),
    states ?? {}
  );
}
