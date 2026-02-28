import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaDisclosureOptions {
  defaultExpanded?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  isExpanded?: Ref<boolean>,
  onExpandedChange?: (isExpanded: boolean) => void
}

export interface DisclosureAria {
  buttonProps: ComputedRef<{
    'aria-controls': string,
    'aria-expanded': boolean,
    disabled: boolean,
    id: string
  }>,
  collapse: () => void,
  expand: () => void,
  isExpanded: ComputedRef<boolean>,
  panelProps: ComputedRef<{
    'aria-hidden': boolean,
    'aria-labelledby': string,
    hidden: boolean,
    id: string,
    role: 'group'
  }>,
  toggle: () => void
}

let disclosureCounter = 0;

export function useDisclosure(options: AriaDisclosureOptions = {}): DisclosureAria {
  disclosureCounter += 1;

  let triggerId = `vue-disclosure-trigger-${disclosureCounter}`;
  let panelId = `vue-disclosure-panel-${disclosureCounter}`;
  let internalExpanded = ref(Boolean(unref(options.defaultExpanded)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));

  let isExpanded = computed(() => {
    return options.isExpanded ? options.isExpanded.value : internalExpanded.value;
  });

  let setExpanded = (nextExpanded: boolean) => {
    if (isDisabled.value) {
      return;
    }

    if (isExpanded.value === nextExpanded) {
      return;
    }

    if (options.isExpanded) {
      options.isExpanded.value = nextExpanded;
    } else {
      internalExpanded.value = nextExpanded;
    }

    options.onExpandedChange?.(nextExpanded);
  };

  let toggle = () => {
    setExpanded(!isExpanded.value);
  };

  let expand = () => {
    setExpanded(true);
  };

  let collapse = () => {
    setExpanded(false);
  };

  let buttonProps = computed(() => ({
    id: triggerId,
    disabled: isDisabled.value,
    'aria-expanded': isExpanded.value,
    'aria-controls': panelId
  }));

  let panelProps = computed(() => ({
    id: panelId,
    role: 'group' as const,
    hidden: !isExpanded.value,
    'aria-hidden': !isExpanded.value,
    'aria-labelledby': triggerId
  }));

  return {
    buttonProps,
    collapse,
    expand,
    isExpanded,
    panelProps,
    toggle
  };
}
