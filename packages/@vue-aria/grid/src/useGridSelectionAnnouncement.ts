import {type GridCollection, type GridKey, type GridSelectionBehavior, type GridSelectionMode, type MaybeRef} from './types';
import {ref, type Ref, unref} from 'vue';

type GridSelection = Iterable<GridKey> | 'all';

export interface GridSelectionAnnouncementProps {
  getRowText?: (key: GridKey) => string | undefined
}

export interface GridSelectionAnnouncementState {
  collection: MaybeRef<GridCollection>,
  isFocused?: MaybeRef<boolean>,
  selectedKeys: MaybeRef<GridSelection>,
  selectionBehavior?: MaybeRef<GridSelectionBehavior>,
  selectionMode?: MaybeRef<GridSelectionMode>
}

export interface GridSelectionAnnouncementAria {
  announcement: Ref<string>,
  syncAnnouncement: () => void
}

function toSelectionSet(selection: GridSelection): Set<GridKey> | 'all' {
  if (selection === 'all') {
    return 'all';
  }

  return new Set(Array.from(selection, (key) => String(key)));
}

function diffSelection(
  nextSelection: Set<GridKey> | 'all',
  previousSelection: Set<GridKey> | 'all'
): Set<GridKey> {
  if (nextSelection === 'all' || previousSelection === 'all') {
    return new Set();
  }

  let diff = new Set<GridKey>();
  for (let key of nextSelection) {
    if (!previousSelection.has(key)) {
      diff.add(key);
    }
  }

  return diff;
}

export function useGridSelectionAnnouncement(
  props: GridSelectionAnnouncementProps,
  state: GridSelectionAnnouncementState
): GridSelectionAnnouncementAria {
  let announcement = ref('');
  let previousSelection = toSelectionSet(unref(state.selectedKeys));

  let getRowText = (key: GridKey) => {
    let byProp = props.getRowText?.(key);
    if (byProp) {
      return byProp;
    }

    return unref(state.collection).rows.find((row) => row.key === key)?.textValue;
  };

  let syncAnnouncement = () => {
    let isFocused = state.isFocused == null ? true : Boolean(unref(state.isFocused));
    let nextSelection = toSelectionSet(unref(state.selectedKeys));

    if (!isFocused) {
      previousSelection = nextSelection;
      announcement.value = '';
      return;
    }

    let messages: string[] = [];
    let added = diffSelection(nextSelection, previousSelection);
    let removed = diffSelection(previousSelection, nextSelection);
    let selectionMode = unref(state.selectionMode) ?? 'none';
    let selectionBehavior = unref(state.selectionBehavior) ?? 'toggle';

    if (selectionBehavior === 'replace' && nextSelection !== 'all' && nextSelection.size === 1) {
      let firstKey = nextSelection.values().next().value;
      let label = firstKey ? getRowText(firstKey) : undefined;
      if (label) {
        messages.push(`${label} selected.`);
      }
    } else if (added.size === 1 && removed.size === 0) {
      let firstKey = added.values().next().value;
      let label = firstKey ? getRowText(firstKey) : undefined;
      if (label) {
        messages.push(`${label} selected.`);
      }
    } else if (removed.size === 1 && added.size === 0) {
      let firstKey = removed.values().next().value;
      let label = firstKey ? getRowText(firstKey) : undefined;
      if (label) {
        messages.push(`${label} deselected.`);
      }
    }

    if (selectionMode === 'multiple') {
      if (nextSelection === 'all') {
        messages.push('All items selected.');
      } else if (messages.length === 0 || nextSelection.size !== 1 || previousSelection === 'all' || previousSelection.size !== 0) {
        messages.push(`${nextSelection.size} item${nextSelection.size === 1 ? '' : 's'} selected.`);
      }
    }

    announcement.value = messages.join(' ').trim();
    previousSelection = nextSelection;
  };

  return {
    announcement,
    syncAnnouncement
  };
}
