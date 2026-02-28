import {computed, type ComputedRef, type Ref, unref} from 'vue';
import type {TabKey, TabListState} from './useTabList';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;
const TAB_ID_WARNING = 'There is no tab id, please check if you have rendered the tab panel before the tab list.';

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
  let hasWarnedMissingState = false;
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

    if (!hasWarnedMissingState && process.env.NODE_ENV !== 'production') {
      console.error(TAB_ID_WARNING);
      hasWarnedMissingState = true;
    }

    return 'vue-tabpanel';
  });

  let resolvedAriaLabelledby = computed(() => {
    return resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']);
  });
  let ariaLabelledby = computed(() => {
    let ids = new Set<string>();
    let labelledBy = resolvedAriaLabelledby.value ?? (state && selectedKey.value != null ? state.getTabId(selectedKey.value) : undefined);
    if (labelledBy) {
      for (let nextId of labelledBy.trim().split(/\s+/)) {
        if (nextId) {
          ids.add(nextId);
        }
      }
    }

    let ariaLabel = resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']);
    if (ariaLabel && ids.size > 0) {
      ids.add(id.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let hasTabbableChild = computed(() => Boolean(unref(options.hasTabbableChild)));

  return {
    tabPanelProps: computed(() => ({
      id: id.value,
      role: 'tabpanel' as const,
      tabIndex: hasTabbableChild.value ? undefined : 0,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabelledby.value,
      'aria-describedby': resolveOptionalString(options['aria-describedby']),
      'aria-details': resolveOptionalString(options['aria-details'])
    }))
  };
}
