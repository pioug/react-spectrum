import type {ComputedRef, Ref} from 'vue';
import type {SelectionKey, SelectionManager} from '@vue-aria/selection';

export type MaybeRef<T> = ComputedRef<T> | Ref<T> | T;

export interface StepListState {
  isSelectable: (key: SelectionKey) => boolean,
  selectedKey: MaybeRef<SelectionKey | null>,
  selectionManager: SelectionManager
}

export interface AriaStepListItemOptions {
  key: SelectionKey
}

export interface StepListItemAria {
  stepProps: ComputedRef<{
    'aria-current'?: 'step',
    'aria-disabled'?: true,
    'aria-selected'?: boolean,
    onClick: () => void,
    onKeyDown: (event: KeyboardEvent) => void,
    role: 'link',
    tabIndex?: number
  }>
}
