import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type IconSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

const iconProps = {
  elementType: {
    type: String,
    default: 'span'
  },
  size: {
    type: String as PropType<IconSize | undefined>,
    default: undefined
  },
  label: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  hidden: {
    type: Boolean,
    default: false
  }
};

function resolveSize(size: IconSize | undefined, scale: 'medium' | 'large'): IconSize {
  if (size) {
    return size;
  }

  return scale === 'large' ? 'l' : 'm';
}

export const VueIcon = defineComponent({
  name: 'VueIcon',
  props: iconProps,
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let resolvedSize = computed(() => resolveSize(props.size, context.value.scale));
    let classes = computed(() => ([
      'vs-icon',
      `vs-icon--${resolvedSize.value}`
    ]));

    return function render() {
      return h(props.elementType, {
        ...attrs,
        class: [classes.value, attrs.class],
        style: [{color: props.color}, attrs.style],
        role: 'img',
        'aria-label': props.label || undefined,
        'aria-hidden': props.hidden || props.label ? undefined : 'true',
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueUIIcon = defineComponent({
  name: 'VueUIIcon',
  props: iconProps,
  setup(props, {slots, attrs}) {
    return function render() {
      return h(VueIcon, {
        ...attrs,
        ...props,
        class: ['vs-ui-icon', attrs.class]
      }, slots);
    };
  }
});

export const VueIllustration = defineComponent({
  name: 'VueIllustration',
  props: {
    label: {
      type: String,
      default: ''
    },
    hidden: {
      type: Boolean,
      default: false
    },
    elementType: {
      type: String,
      default: 'div'
    }
  },
  setup(props, {slots, attrs}) {
    return function render() {
      return h(props.elementType, {
        ...attrs,
        class: ['vs-illustration', attrs.class],
        role: 'img',
        'aria-label': props.label || undefined,
        'aria-hidden': props.hidden || props.label ? undefined : 'true',
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
