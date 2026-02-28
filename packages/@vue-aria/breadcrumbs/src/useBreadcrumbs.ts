import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaBreadcrumbsOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>
}

export interface BreadcrumbsAria {
  navProps: ComputedRef<{
    id?: string,
    'aria-label': string,
    role: 'navigation'
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useBreadcrumbs(options: AriaBreadcrumbsOptions = {}): BreadcrumbsAria {
  let navProps = computed(() => {
    let ariaLabel = resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']);
    return {
      role: 'navigation' as const,
      id: resolveOptionalString(options.id),
      'aria-label': ariaLabel === undefined ? 'Breadcrumbs' : ariaLabel
    };
  });

  return {
    navProps
  };
}
