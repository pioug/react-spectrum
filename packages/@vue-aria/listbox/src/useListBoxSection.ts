import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaListBoxSectionProps {
  'aria-label'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  heading?: MaybeRef<string | undefined>
}

export interface ListBoxSectionAria {
  groupProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    role: 'group'
  }>,
  headingProps: ComputedRef<{
    id?: string,
    onMouseDown?: (event: MouseEvent) => void,
    role?: 'presentation'
  }>,
  itemProps: ComputedRef<{
    role: 'presentation'
  }>
}

let headingCounter = 0;

export function useListBoxSection(props: AriaListBoxSectionProps = {}): ListBoxSectionAria {
  headingCounter += 1;
  let headingId = `vue-listbox-heading-${headingCounter}`;

  let heading = computed(() => unref(props.heading));
  let ariaLabel = computed(() => unref(props.ariaLabel) ?? unref(props['aria-label']));

  return {
    groupProps: computed(() => ({
      role: 'group' as const,
      'aria-label': ariaLabel.value,
      'aria-labelledby': heading.value ? headingId : undefined
    })),
    headingProps: computed(() => {
      if (!heading.value) {
        return {};
      }

      return {
        id: headingId,
        role: 'presentation' as const,
        onMouseDown: (event: MouseEvent) => {
          event.preventDefault();
        }
      };
    }),
    itemProps: computed(() => ({
      role: 'presentation' as const
    }))
  };
}
