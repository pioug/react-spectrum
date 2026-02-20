import {ref} from 'vue';
import {DOMLayoutDelegate} from './DOMLayoutDelegate';
import {ListKeyboardDelegate} from './ListKeyboardDelegate';
import {useSelectableCollection, type AriaSelectableCollectionOptions, type SelectableCollectionAria} from './useSelectableCollection';
import {
  useSelectableItem as useSelectableItemInternal,
  type SelectableItemAria,
  type SelectableItemOptions,
  type SelectableItemStates
} from './useSelectableItem';
import {useSelectableList, type AriaSelectableListOptions, type SelectableListAria} from './useSelectableList';
import {useTypeSelect, type AriaTypeSelectOptions, type TypeSelectAria} from './useTypeSelect';
import type {KeyboardDelegate, MaybeRef, SelectionItem, SelectionKey, SelectionManager} from './types';

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
