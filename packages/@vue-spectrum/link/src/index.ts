import '@adobe/spectrum-css-temp/components/link/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


type Variant = 'negative' | 'overBackground' | 'primary' | 'secondary';

export const Link = defineComponent({
  name: 'VueLink',
  inheritAttrs: false,
  props: {
    href: {
      type: String,
      default: ''
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    rel: {
      type: String,
      default: undefined
    },
    target: {
      type: String,
      default: undefined
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'primary'
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    click: (event: MouseEvent) => event instanceof MouseEvent,
    focus: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {slots, emit, attrs}) {
    let isHovered = ref(false);
    let isFocusVisible = ref(false);

    let className = computed(() => classNames(
      styles,
      'spectrum-Link',
      {
        'spectrum-Link--quiet': props.isQuiet,
        [`spectrum-Link--${props.variant}`]: props.variant,
        'is-hovered': isHovered.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => {
      let tag = props.href ? 'a' : 'span';
      return h(tag, {
        ...attrs,
        class: [className.value, 'vs-link', attrs.class],
        'data-vac': '',
        href: props.href || undefined,
        target: props.target,
        rel: props.rel,
        onMouseenter: () => {
          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
        },
        onFocus: (event: FocusEvent) => {
          let target = getEventTarget(event);
          if (target instanceof HTMLElement && target.matches(':focus-visible')) {
            isFocusVisible.value = true;
          } else {
            isFocusVisible.value = true;
          }
          emit('focus', event);
        },
        onBlur: (event: FocusEvent) => {
          isFocusVisible.value = false;
          emit('blur', event);
        },
        onClick: (event: MouseEvent) => emit('click', event)
      }, slots.default ? slots.default() : (props.href || 'Link'));
    };
  }
});

export const VueLink = Link;
export type {SpectrumLinkProps} from '@vue-types/link';
