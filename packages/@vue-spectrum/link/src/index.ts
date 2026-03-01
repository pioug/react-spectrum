import '@adobe/spectrum-css-temp/components/link/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {cloneVNode, computed, defineComponent, h, isVNode, mergeProps, type PropType, ref} from 'vue';
import {useProviderProps} from '@vue-spectrum/provider';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


type Variant = 'overBackground' | 'primary' | 'secondary';

export const Link = defineComponent({
  name: 'VueLink',
  inheritAttrs: false,
  props: {
    href: {
      type: String,
      default: undefined
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
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    press: (event: MouseEvent) => event instanceof MouseEvent,
    pressend: (event: KeyboardEvent | MouseEvent) => event instanceof KeyboardEvent || event instanceof MouseEvent,
    pressstart: (event: KeyboardEvent | MouseEvent) => event instanceof KeyboardEvent || event instanceof MouseEvent
  },
  setup(props, {slots, emit, attrs}) {
    let isHovered = ref(false);
    let isFocusVisible = ref(false);
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));

    let className = computed(() => classNames(
      styles,
      'spectrum-Link',
      {
        'spectrum-Link--quiet': resolvedProps.value.isQuiet,
        [`spectrum-Link--${resolvedProps.value.variant}`]: resolvedProps.value.variant,
        'is-hovered': isHovered.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => {
      let contentNodes = slots.default ? slots.default() : [];
      let wrappedChild = !resolvedProps.value.href && contentNodes.length === 1 && isVNode(contentNodes[0]) ? contentNodes[0] : null;
      let wrappedChildType = wrappedChild && typeof wrappedChild.type === 'string' ? wrappedChild.type : null;
      let isWrappedAnchor = wrappedChildType === 'a';
      let tabIndex = attrs.tabindex ?? 0;

      let baseProps = {
        class: [className.value, attrs.class],
        'data-react-aria-pressable': 'true',
        tabindex: tabIndex,
        role: !resolvedProps.value.href && !isWrappedAnchor ? 'link' : undefined,
        ...(resolvedProps.value.href ? {href: resolvedProps.value.href} : {}),
        ...(resolvedProps.value.target ? {target: resolvedProps.value.target} : {}),
        ...(resolvedProps.value.rel ? {rel: resolvedProps.value.rel} : {}),
        onMouseenter: () => {
          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
        },
        onMousedown: (event: MouseEvent) => {
          emit('pressstart', event);
        },
        onMouseup: (event: MouseEvent) => {
          emit('pressend', event);
        },
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            emit('pressstart', event);
          }
        },
        onKeyup: (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            emit('pressend', event);
          }
        },
        onFocus: (event: FocusEvent) => {
          let target = getEventTarget(event);
          if (target instanceof HTMLElement && target.matches(':focus-visible')) {
            isFocusVisible.value = true;
          } else {
            isFocusVisible.value = false;
          }
          emit('focus', event);
        },
        onBlur: (event: FocusEvent) => {
          isFocusVisible.value = false;
          emit('blur', event);
        },
        onClick: (event: MouseEvent) => {
          emit('press', event);
          emit('click', event);
        }
      };

      if (wrappedChild && wrappedChildType) {
        return cloneVNode(wrappedChild, mergeProps(wrappedChild.props ?? {}, attrs, baseProps));
      }

      let tag = resolvedProps.value.href ? 'a' : 'span';
      return h(tag, mergeProps(attrs, baseProps), contentNodes.length > 0 ? contentNodes : []);
    };
  }
});

export const VueLink = Link;
export type {SpectrumLinkProps} from '@vue-types/link';
