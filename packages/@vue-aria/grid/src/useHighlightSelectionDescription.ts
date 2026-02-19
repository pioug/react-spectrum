import {computed, type ComputedRef, unref} from 'vue';
import {type GridSelectionBehavior, type GridSelectionMode, type MaybeRef} from './types';

export interface HighlightSelectionDescriptionProps {
  hasItemActions?: MaybeRef<boolean>,
  interactionModality?: MaybeRef<'keyboard' | 'pointer' | 'virtual' | null | undefined>,
  selectionBehavior?: MaybeRef<GridSelectionBehavior>,
  selectionMode?: MaybeRef<GridSelectionMode>
}

export interface HighlightSelectionDescriptionAria {
  descriptionProps: ComputedRef<{
    'aria-description'?: string
  }>
}

export function useHighlightSelectionDescription(
  props: HighlightSelectionDescriptionProps = {}
): HighlightSelectionDescriptionAria {
  let descriptionProps = computed(() => {
    let modality = unref(props.interactionModality);
    let hasItemActions = Boolean(unref(props.hasItemActions));
    let selectionBehavior = unref(props.selectionBehavior) ?? 'toggle';
    let selectionMode = unref(props.selectionMode) ?? 'none';

    let shouldDescribe = hasItemActions
      && selectionBehavior === 'replace'
      && selectionMode !== 'none'
      && (modality == null || modality === 'pointer' || modality === 'virtual');

    return {
      'aria-description': shouldDescribe ? 'Long press to select items.' : undefined
    };
  });

  return {
    descriptionProps
  };
}
