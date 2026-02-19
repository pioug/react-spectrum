import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaBreadcrumbsOptions {
  ariaLabel?: MaybeRef<string | undefined>
}

export interface BreadcrumbsAria {
  navProps: ComputedRef<{
    'aria-label': string,
    role: 'navigation'
  }>
}

export function useBreadcrumbs(options: AriaBreadcrumbsOptions = {}): BreadcrumbsAria {
  let navProps = computed(() => {
    let ariaLabel = unref(options.ariaLabel);
    return {
      role: 'navigation' as const,
      'aria-label': ariaLabel === undefined ? 'Breadcrumbs' : ariaLabel
    };
  });

  return {
    navProps
  };
}
