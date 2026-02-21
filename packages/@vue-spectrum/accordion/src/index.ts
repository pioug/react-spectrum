import '@adobe/spectrum-css-temp/components/accordion/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


interface AccordionContextValue {
  expandedKeys: ComputedRef<string[]>,
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

export const Accordion = defineComponent({
  name: 'VueAccordion',
  inheritAttrs: false,
  props: {
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => []
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
    'update:modelValue': (value: string[]) => Array.isArray(value)
  },
  setup(props, {emit, slots, attrs}) {
    let resolvedQuiet = computed(() => props.isQuiet ?? props.quiet);

    let toggleKey = (key: string) => {
      let expanded = props.modelValue.includes(key);

      if (expanded) {
        emit('update:modelValue', props.modelValue.filter((item) => item !== key));
        return;
      }

      if (props.multiple) {
        emit('update:modelValue', [...props.modelValue, key]);
        return;
      }

      emit('update:modelValue', [key]);
    };

    provide(accordionContextKey, {
      expandedKeys: computed(() => props.modelValue),
      isQuiet: resolvedQuiet,
      toggleKey
    });

    return () => h('div', {
      ...attrs,
      class: [classNames(styles, 'spectrum-Accordion'), 'vs-accordion', attrs.class],
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
    id: {
      type: String,
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
    toggle: (expanded: boolean) => typeof expanded === 'boolean'
  },
  setup(props, {emit, slots, attrs}) {
    let accordion = inject(accordionContextKey, null);
    let generatedId = `vs-disclosure-${++disclosureId}`;
    let disclosureKey = computed(() => props.id ?? generatedId);
    let localExpanded = ref(props.defaultExpanded);
    let expanded = computed(() => accordion
      ? accordion.expandedKeys.value.includes(disclosureKey.value)
      : localExpanded.value);
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
      if (props.disabled) {
        return;
      }

      let nextValue = !expanded.value;
      if (accordion) {
        accordion.toggleKey(disclosureKey.value);
      } else {
        localExpanded.value = nextValue;
      }
      emit('toggle', nextValue);
    };

    provide(disclosureContextKey, {
      disabled: computed(() => props.disabled),
      expanded,
      id: disclosureKey,
      isQuiet: resolvedQuiet,
      toggle
    });

    return () => h('section', {
      ...attrs,
      class: [classNames(
        styles,
        'spectrum-Accordion-item',
        {
          'spectrum-Accordion-item--quiet': resolvedQuiet.value,
          'is-expanded': expanded.value,
          'is-disabled': props.disabled,
          'in-accordion': accordion !== null
        }
      ), 'vs-accordion__item', attrs.class],
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
          class: [classNames(styles, 'spectrum-Accordion-itemHeading'), 'vs-disclosure__heading', attrs.class],
          'data-vac': ''
        }, slots.default ? slots.default() : []);
      }

      return h(headingTag.value, {
        class: [classNames(styles, 'spectrum-Accordion-itemHeading'), 'vs-disclosure__heading']
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
          ), 'vs-disclosure__trigger', attrs.class],
          id: `${disclosure.id.value}-trigger`,
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
            if (target instanceof HTMLElement && target.matches(':focus-visible')) {
              isFocusVisible.value = true;
            } else {
              isFocusVisible.value = true;
            }
          },
          onBlur: () => {
            isFocusVisible.value = false;
          },
          onClick: () => {
            isPressed.value = false;
            disclosure.toggle();
          },
          'data-vac': ''
        }, [
          h('span', {class: 'vs-disclosure__label'}, slots.default ? slots.default() : 'Section'),
          h('span', {
            class: [classNames(styles, 'spectrum-Accordion-itemIndicator'), 'vs-disclosure__indicator'],
            'aria-hidden': 'true'
          }, '›')
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

    return () => {
      let isExpanded = disclosure?.expanded.value ?? true;
      let panelId = disclosure ? `${disclosure.id.value}-panel` : attrs.id;
      let labelledBy = disclosure ? `${disclosure.id.value}-trigger` : attrs['aria-labelledby'];

      if (!isExpanded) {
        return h('div', {
          ...attrs,
          id: panelId,
          hidden: true,
          'aria-hidden': 'true',
          'aria-labelledby': labelledBy,
          class: attrs.class,
          'data-vac': ''
        });
      }

      return h('div', {
        ...attrs,
        id: panelId,
        class: [classNames(styles, 'spectrum-Accordion-itemContent'), 'vs-disclosure__panel', disclosure?.isQuiet.value ? 'is-quiet' : null, attrs.class],
        role: 'region',
        'aria-hidden': 'false',
        'aria-labelledby': labelledBy,
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
