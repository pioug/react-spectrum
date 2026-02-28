import {computed, type ComputedRef, unref} from 'vue';
import {type MaybeRef} from './types';
import {useLabels} from '@vue-aria/utils';

export interface AriaGridListSectionProps {
  ariaLabel?: MaybeRef<string | undefined>
}

export interface GridListSectionAria {
  rowGroupProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id?: string,
    role: 'rowgroup'
  }>,
  rowHeaderProps: ComputedRef<{
    id: string,
    role: 'rowheader'
  }>,
  rowProps: ComputedRef<{
    role: 'row'
  }>
}

export function useGridListSection(props: AriaGridListSectionProps = {}): GridListSectionAria {
  let headingId = computed(() => {
    let label = unref(props.ariaLabel) ?? 'section';
    let normalizedLabel = String(label).replace(/\s+/g, '-').toLowerCase();
    return `vue-gridlist-section-heading-${normalizedLabel}`;
  });
  let rowGroupId = computed(() => `${headingId.value}-group`);
  let labelProps = computed(() => {
    return useLabels({
      id: rowGroupId.value,
      'aria-label': unref(props.ariaLabel),
      'aria-labelledby': headingId.value
    });
  });

  let rowProps = computed(() => ({
    role: 'row' as const
  }));

  let rowHeaderProps = computed(() => ({
    id: headingId.value,
    role: 'rowheader' as const
  }));

  let rowGroupProps = computed(() => ({
    role: 'rowgroup' as const,
    id: labelProps.value.id as string | undefined,
    'aria-label': labelProps.value['aria-label'],
    'aria-labelledby': labelProps.value['aria-labelledby']
  }));

  return {
    rowGroupProps,
    rowHeaderProps,
    rowProps
  };
}
