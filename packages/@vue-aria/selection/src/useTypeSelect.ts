import {computed, type ComputedRef} from 'vue';
import type {KeyboardDelegate, SelectionManager} from './types';

const TYPEAHEAD_DEBOUNCE_WAIT_MS = 1000;

export interface AriaTypeSelectOptions {
  keyboardDelegate: KeyboardDelegate,
  onTypeSelect?: (key: string | number) => void,
  selectionManager: SelectionManager
}

export interface TypeSelectAria {
  typeSelectProps: ComputedRef<{
    onKeyDownCapture: (event: KeyboardEvent) => void
  }>
}

function getStringForKey(key: string): string {
  if (key.length === 1 || !/^[A-Z]/i.test(key)) {
    return key;
  }

  return '';
}

export function useTypeSelect(options: AriaTypeSelectOptions): TypeSelectAria {
  let state: {search: string, timeout: ReturnType<typeof setTimeout> | null} = {
    search: '',
    timeout: null
  };

  let onKeyDownCapture = (event: KeyboardEvent) => {
    let character = getStringForKey(event.key);
    if (!character || event.ctrlKey || event.metaKey || (state.search.length === 0 && character === ' ')) {
      return;
    }

    if (character === ' ' && state.search.trim().length > 0) {
      event.preventDefault();
    }

    state.search += character;

    let key = options.keyboardDelegate.getKeyForSearch?.(state.search, options.selectionManager.focusedKey.value);
    if (key == null) {
      key = options.keyboardDelegate.getKeyForSearch?.(state.search);
    }

    if (key != null) {
      options.selectionManager.setFocusedKey(key);
      options.onTypeSelect?.(key);
    }

    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(() => {
      state.search = '';
      state.timeout = null;
    }, TYPEAHEAD_DEBOUNCE_WAIT_MS);
  };

  return {
    typeSelectProps: computed(() => ({
      onKeyDownCapture
    }))
  };
}
