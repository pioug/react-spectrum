import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref} from 'vue';
import {getSpectrumContext} from '../context';

interface AccordionContextValue {
  expandedKeys: ComputedRef<string[]>,
  isQuiet: ComputedRef<boolean>,
  toggleKey: (key: string) => void
}

interface DisclosureContextValue {
  disabled: ComputedRef<boolean>,
  expanded: ComputedRef<boolean>,
  isQuiet: ComputedRef<boolean>,
  toggle: () => void
}

const accordionContextKey: InjectionKey<AccordionContextValue> = Symbol('vue-spectrum-accordion-context');
const disclosureContextKey: InjectionKey<DisclosureContextValue> = Symbol('vue-spectrum-disclosure-context');
let disclosureId = 0;

export const VueAccordion = defineComponent({
  name: 'VueAccordion',
  props: {
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
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-accordion',
      context.value.scale === 'large' ? 'vs-accordion--large' : 'vs-accordion--medium'
    ]));

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
      isQuiet: computed(() => props.quiet),
      toggleKey
    });

    return function render() {
      return h('div', {
        ...attrs,
        class: ['react-aria-DisclosureGroup', classes.value, attrs.class],
        'data-rac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueDisclosure = defineComponent({
  name: 'VueDisclosure',
  props: {
    id: {
      type: String,
      default: undefined
    },
    defaultExpanded: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    quiet: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    toggle: (expanded: boolean) => typeof expanded === 'boolean',
    'update:expanded': (expanded: boolean) => typeof expanded === 'boolean'
  },
  setup(props, {emit, slots, attrs}) {
    let accordion = inject(accordionContextKey, null);
    let generatedId = `vs-disclosure-${++disclosureId}`;
    let disclosureKey = computed(() => props.id ?? generatedId);
    let localExpanded = ref(props.expanded ?? props.defaultExpanded);
    let expanded = computed(() => accordion
      ? accordion.expandedKeys.value.includes(disclosureKey.value)
      : (props.expanded ?? localExpanded.value));
    let isQuiet = computed(() => accordion ? accordion.isQuiet.value : props.quiet);

    let toggle = () => {
      if (props.disabled) {
        return;
      }

      let nextValue = !expanded.value;
      if (accordion) {
        accordion.toggleKey(disclosureKey.value);
      } else {
        if (props.expanded === undefined) {
          localExpanded.value = nextValue;
        }
      }
      emit('update:expanded', nextValue);
      emit('toggle', nextValue);
    };

    provide(disclosureContextKey, {
      disabled: computed(() => props.disabled),
      expanded,
      isQuiet,
      toggle
    });

    return function render() {
      return h('section', {
        ...attrs,
        class: [
          'react-aria-Disclosure',
          'vs-accordion__item',
          expanded.value ? 'is-expanded' : null,
          props.disabled ? 'is-disabled' : null,
          isQuiet.value ? 'is-quiet' : null,
          attrs.class
        ],
        'data-rac': '',
        'data-expanded': expanded.value ? 'true' : undefined,
        'data-disabled': props.disabled ? 'true' : undefined
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueDisclosureTitle = defineComponent({
  name: 'VueDisclosureTitle',
  props: {
    level: {
      type: Number,
      default: 3
    }
  },
  setup(props, {slots, attrs}) {
    let disclosure = inject(disclosureContextKey, null);
    let headingTag = computed(() => {
      let safeLevel = Math.min(6, Math.max(1, Math.trunc(props.level)));
      return `h${safeLevel}`;
    });

    return function render() {
      if (!disclosure) {
        return h(headingTag.value, {
          ...attrs,
          class: ['react-aria-Heading', 'vs-disclosure__heading', attrs.class],
          'data-rac': ''
        }, slots.default ? slots.default() : []);
      }

      return h(headingTag.value, {class: ['react-aria-Heading', 'vs-disclosure__heading']}, [
        h('button', {
          ...attrs,
          class: ['react-aria-Button', 'vs-disclosure__trigger', attrs.class],
          type: 'button',
          disabled: disclosure.disabled.value,
          'aria-expanded': disclosure.expanded.value ? 'true' : 'false',
          onClick: disclosure.toggle,
          'data-rac': '',
          'data-react-aria-pressable': 'true'
        }, slots.default ? slots.default() : 'Section')
      ]);
    };
  }
});

export const VueDisclosurePanel = defineComponent({
  name: 'VueDisclosurePanel',
  setup(_props, {slots, attrs}) {
    let disclosure = inject(disclosureContextKey, null);

    return function render() {
      if (disclosure && !disclosure.expanded.value) {
        return null;
      }

      return h('div', {
        ...attrs,
        class: ['react-aria-DisclosurePanel', 'vs-disclosure__panel', disclosure?.isQuiet.value ? 'is-quiet' : null, attrs.class],
        role: 'region',
        'data-rac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
