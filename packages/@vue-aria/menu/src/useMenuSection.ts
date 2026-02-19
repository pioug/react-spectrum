import {computed, type ComputedRef, unref} from 'vue';
import type {MaybeRef} from './types';

export interface AriaMenuSectionProps {
  'aria-label'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  heading?: MaybeRef<string | undefined>
}

export interface MenuSectionAria {
  groupProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    role: 'group'
  }>,
  headingProps: ComputedRef<{
    id?: string,
    role?: 'presentation'
  }>
}

let menuSectionCounter = 0;

export function useMenuSection(props: AriaMenuSectionProps = {}): MenuSectionAria {
  menuSectionCounter += 1;

  let heading = computed(() => unref(props.heading));
  let headingId = `vue-menu-section-heading-${menuSectionCounter}`;
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
        role: 'presentation' as const
      };
    })
  };
}
