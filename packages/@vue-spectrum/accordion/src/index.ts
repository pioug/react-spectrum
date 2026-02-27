import '@adobe/spectrum-css-temp/components/accordion/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, onMounted, type PropType, provide, ref, watch} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


interface AccordionContextValue {
  expandedKeys: ComputedRef<string[]>,
  isDisabled: ComputedRef<boolean>,
  isQuiet: ComputedRef<boolean>,
  toggleKey: (key: string) => void
}

interface DisclosureContextValue {
  disabled: ComputedRef<boolean>,
  expanded: ComputedRef<boolean>,
  id: ComputedRef<string>,
  isQuiet: ComputedRef<boolean>,
  toggle: () => void
}

const accordionContextKey: InjectionKey<AccordionContextValue> = Symbol('vue-spectrum-accordion-context');
const disclosureContextKey: InjectionKey<DisclosureContextValue> = Symbol('vue-spectrum-disclosure-context');
let disclosureId = 0;

function normalizeExpandedKeys(value: Iterable<string> | undefined): string[] {
  if (!value) {
    return [];
  }

  return Array.from(value).filter((key): key is string => typeof key === 'string');
}

function isExpandedKeyIterable(value: unknown): value is Iterable<string> {
  if (value == null || typeof value === 'string') {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'string') {
      return false;
    }
  }

  return true;
}

export const Accordion = defineComponent({
  name: 'VueAccordion',
  inheritAttrs: false,
  props: {
    defaultExpandedKeys: {
      type: [Array, Set] as PropType<Iterable<string>>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    expandedKeys: {
      type: [Array, Set] as PropType<Iterable<string> | undefined>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    modelValue: {
      type: [Array, Set] as PropType<Iterable<string> | undefined>,
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: true
    },
    quiet: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:expandedKeys': (value: Iterable<string>) => isExpandedKeyIterable(value),
    'update:modelValue': (value: Iterable<string>) => isExpandedKeyIterable(value)
  },
  setup(props, {emit, slots, attrs}) {
    let internalExpandedKeys = ref(normalizeExpandedKeys(props.defaultExpandedKeys));
    let expandedKeys = computed(() => normalizeExpandedKeys(props.modelValue ?? props.expandedKeys ?? internalExpandedKeys.value));
    let isDisabled = computed(() => props.isDisabled || props.disabled);
    let resolvedQuiet = computed(() => props.isQuiet ?? props.quiet);

    let toggleKey = (key: string) => {
      let currentExpanded = expandedKeys.value;
      let nextExpanded: string[];

      if (currentExpanded.includes(key)) {
        nextExpanded = currentExpanded.filter((item) => item !== key);
      } else if (props.multiple) {
        nextExpanded = [...currentExpanded, key];
      } else {
        nextExpanded = [key];
      }

      if (props.modelValue === undefined && props.expandedKeys === undefined) {
        internalExpandedKeys.value = nextExpanded;
      }

      let nextExpandedKeys = new Set(nextExpanded);
      emit('update:modelValue', nextExpandedKeys);
      emit('update:expandedKeys', nextExpandedKeys);
    };

    provide(accordionContextKey, {
      expandedKeys,
      isDisabled,
      isQuiet: resolvedQuiet,
      toggleKey
    });

    return () => h('div', {
      ...attrs,
      class: [classNames(styles, 'spectrum-Accordion'), attrs.class],
      'data-rac': '',
      'data-vac': ''
    }, slots.default ? slots.default() : []);
  }
});

export const Disclosure = defineComponent({
  name: 'VueDisclosure',
  inheritAttrs: false,
  props: {
    defaultExpanded: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isExpanded: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    quiet: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:expanded': (expanded: boolean) => typeof expanded === 'boolean',
    'update:isExpanded': (expanded: boolean) => typeof expanded === 'boolean',
    toggle: (expanded: boolean) => typeof expanded === 'boolean'
  },
  setup(props, {emit, slots, attrs}) {
    let accordion = inject(accordionContextKey, null);
    let generatedId = `vs-disclosure-${++disclosureId}`;
    let disclosureKey = computed(() => props.id ?? generatedId);
    let localExpanded = ref(props.defaultExpanded);
    let isControlled = computed(() => props.isExpanded !== undefined || props.expanded !== undefined);
    let disabled = computed(() => props.isDisabled || props.disabled || accordion?.isDisabled.value || false);
    let expanded = computed(() => accordion
      ? accordion.expandedKeys.value.includes(disclosureKey.value)
      : (props.isExpanded ?? props.expanded ?? localExpanded.value));
    let resolvedQuiet = computed(() => {
      if (accordion) {
        return accordion.isQuiet.value;
      }
      if (props.isQuiet !== undefined) {
        return props.isQuiet;
      }
      return props.quiet;
    });

    let toggle = () => {
      if (disabled.value) {
        return;
      }

      let nextValue = !expanded.value;
      if (accordion) {
        accordion.toggleKey(disclosureKey.value);
      } else if (!isControlled.value) {
        localExpanded.value = nextValue;
      }
      emit('update:isExpanded', nextValue);
      emit('update:expanded', nextValue);
      emit('toggle', nextValue);
    };

    provide(disclosureContextKey, {
      disabled,
      expanded,
      id: disclosureKey,
      isQuiet: resolvedQuiet,
      toggle
    });

    return () => h('div', {
      ...attrs,
      class: [classNames(
        styles,
        'spectrum-Accordion-item',
        {
          'spectrum-Accordion-item--quiet': resolvedQuiet.value,
          'is-expanded': expanded.value,
          'is-disabled': disabled.value,
          'in-accordion': accordion !== null
        }
      ), attrs.class],
      'data-rac': '',
      'data-vac': ''
    }, slots.default ? slots.default() : []);
  }
});

export const DisclosureTitle = defineComponent({
  name: 'VueDisclosureTitle',
  inheritAttrs: false,
  props: {
    level: {
      type: Number,
      default: 3
    }
  },
  setup(props, {slots, attrs}) {
    let disclosure = inject(disclosureContextKey, null);
    let isHovered = ref(false);
    let isPressed = ref(false);
    let isFocusVisible = ref(false);

    let headingTag = computed(() => {
      let safeLevel = Math.min(6, Math.max(1, Math.trunc(props.level)));
      return `h${safeLevel}`;
    });

    return () => {
      if (!disclosure) {
        return h(headingTag.value, {
          ...attrs,
          class: [classNames(styles, 'spectrum-Accordion-itemHeading'), attrs.class],
          'data-vac': ''
        }, slots.default ? slots.default() : []);
      }

      return h(headingTag.value, {
        class: [classNames(styles, 'spectrum-Accordion-itemHeading')]
      }, [
        h('button', {
          ...attrs,
          class: [classNames(
            styles,
            'spectrum-Accordion-itemHeader',
            {
              'is-hovered': isHovered.value && !disclosure.disabled.value,
              'is-pressed': isPressed.value && !disclosure.disabled.value,
              'focus-ring': isFocusVisible.value
            }
          ), attrs.class],
          id: `${disclosure.id.value}-trigger`,
          slot: 'trigger',
          type: 'button',
          disabled: disclosure.disabled.value,
          'aria-controls': `${disclosure.id.value}-panel`,
          'aria-expanded': disclosure.expanded.value ? 'true' : 'false',
          onMouseenter: () => {
            if (disclosure.disabled.value) {
              return;
            }
            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
            isPressed.value = false;
          },
          onMousedown: () => {
            if (disclosure.disabled.value) {
              return;
            }
            isPressed.value = true;
          },
          onMouseup: () => {
            isPressed.value = false;
          },
          onFocus: (event: FocusEvent) => {
            let target = getEventTarget(event);
            isFocusVisible.value = target instanceof HTMLElement ? !isPressed.value : false;
          },
          onBlur: () => {
            isFocusVisible.value = false;
          },
          onClick: () => {
            isPressed.value = false;
            disclosure.toggle();
          },
          'data-rac': '',
          'data-vac': ''
        }, [
          h('svg', {
            class: [classNames(styles, 'spectrum-Accordion-itemIndicator'), 'spectrum-Icon', 'spectrum-UIIcon-ChevronRightMedium'],
            focusable: 'false',
            'aria-hidden': 'true',
            role: 'img',
            viewBox: '0 0 6 10',
            width: '6',
            height: '10'
          }, [
            h('path', {
              d: 'M5.99 5a.997.997 0 0 0-.293-.707L1.717.303A1 1 0 1 0 .303 1.717L3.586 5 .303 8.283a1 1 0 1 0 1.414 1.414l3.98-3.99A.997.997 0 0 0 5.99 5z'
            })
          ]),
          ...(slots.default ? slots.default() : ['Section'])
        ])
      ]);
    };
  }
});

export const DisclosurePanel = defineComponent({
  name: 'VueDisclosurePanel',
  inheritAttrs: false,
  setup(_props, {slots, attrs}) {
    let disclosure = inject(disclosureContextKey, null);
    let isExpanded = computed(() => disclosure?.expanded.value ?? true);
    let panelRef = ref<HTMLElement | null>(null);
    let panelHidden = ref<string | undefined>(undefined);
    let panelSizeVars = ref<Record<string, string>>({});

    let syncPanelState = () => {
      if (isExpanded.value) {
        panelHidden.value = undefined;
        panelSizeVars.value = {
          '--disclosure-panel-height': 'auto',
          '--disclosure-panel-width': 'auto'
        };
        panelRef.value?.removeAttribute('hidden');
        return;
      }

      panelHidden.value = 'until-found';
      panelSizeVars.value = {
        '--disclosure-panel-height': '0px',
        '--disclosure-panel-width': '0px'
      };
      panelRef.value?.setAttribute('hidden', 'until-found');
    };

    onMounted(() => {
      syncPanelState();
    });

    watch(isExpanded, () => {
      syncPanelState();
    });

    return () => {
      let panelId = disclosure ? `${disclosure.id.value}-panel` : attrs.id;
      let labelledBy = disclosure ? `${disclosure.id.value}-trigger` : attrs['aria-labelledby'];

      return h('div', {
        ...attrs,
        ref: panelRef,
        id: panelId,
        class: [classNames(styles, 'spectrum-Accordion-itemContent'), attrs.class],
        role: 'group',
        hidden: panelHidden.value,
        style: [panelSizeVars.value, attrs.style],
        'aria-hidden': isExpanded.value ? 'false' : 'true',
        'aria-labelledby': labelledBy,
        'data-rac': '',
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueAccordion = Accordion;
export const VueDisclosure = Disclosure;
export const VueDisclosurePanel = DisclosurePanel;
export const VueDisclosureTitle = DisclosureTitle;

export type SpectrumAccordionProps = InstanceType<typeof Accordion>['$props'];
export type SpectrumDisclosureProps = InstanceType<typeof Disclosure>['$props'];
export type SpectrumDisclosurePanelProps = InstanceType<typeof DisclosurePanel>['$props'];
export type SpectrumDisclosureTitleProps = InstanceType<typeof DisclosureTitle>['$props'];
