import {computed, type ComputedRef, type Ref, unref} from 'vue';
import type {TabKey, TabListState} from './useTabList';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaTabPanelOptions {
  'aria-describedby'?: MaybeRef<string | undefined>,
  'aria-details'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  hasTabbableChild?: MaybeRef<boolean>,
  id?: MaybeRef<string | undefined>,
  selectedKey?: MaybeRef<TabKey | null | undefined>
}

export interface TabPanelAria {
  tabPanelProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-details'?: string,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id: string,
    role: 'tabpanel',
    tabIndex?: 0
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useTabPanel(options: AriaTabPanelOptions = {}, state: TabListState | null): TabPanelAria {
  let selectedKey = computed(() => {
    let overrideSelectedKey = options.selectedKey ? unref(options.selectedKey) : undefined;
    if (overrideSelectedKey !== undefined && overrideSelectedKey !== null) {
      return String(overrideSelectedKey);
    }

    return state?.selectedKey.value ?? null;
  });

  let id = computed(() => {
    let resolvedId = resolveOptionalString(options.id);
    if (resolvedId) {
      return resolvedId;
    }

    if (state) {
      return state.getTabPanelId(selectedKey.value);
    }

    return 'vue-tabpanel';
  });

  let resolvedAriaLabelledby = computed(() => {
    return resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']);
  });
  let ariaLabelledby = computed(() => {
    return resolvedAriaLabelledby.value ?? (state && selectedKey.value != null ? state.getTabId(selectedKey.value) : undefined);
  });

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let hasTabbableChild = computed(() => Boolean(unref(options.hasTabbableChild)));

  return {
    tabPanelProps: computed(() => ({
      id: id.value,
      role: 'tabpanel' as const,
      tabIndex: hasTabbableChild.value ? undefined : 0,
      'aria-label': ariaLabelledby.value ? undefined : ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value,
      'aria-describedby': resolveOptionalString(options['aria-describedby']),
      'aria-details': resolveOptionalString(options['aria-details'])
    }))
  };
}
