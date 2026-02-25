import '@adobe/spectrum-css-temp/components/buttongroup/vars.css';
import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  isVNode,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  Text,
  type PropType
} from 'vue';

type Alignment = 'start' | 'end' | 'center';
type Orientation = 'horizontal' | 'vertical';

function decorateChild(child: unknown, isDisabled: boolean): unknown {
  if (Array.isArray(child)) {
    return child.map((item) => decorateChild(item, isDisabled));
  }

  if (!isVNode(child)) {
    return child;
  }

  if (child.type === Comment || child.type === Text) {
    return child;
  }

  if (child.type === Fragment) {
    let children = Array.isArray(child.children)
      ? child.children.map((item) => decorateChild(item, isDisabled))
      : child.children;
    return h(Fragment, {key: child.key}, children as never);
  }

  let props: Record<string, unknown> = {
    class: 'spectrum-ButtonGroup-Button'
  };
  if (isDisabled) {
    if (typeof child.type === 'string') {
      props.disabled = true;
      props['aria-disabled'] = 'true';
    } else {
      props.isDisabled = true;
    }
  }

  return cloneVNode(child, props, true);
}

export const VueButtonGroup = defineComponent({
  name: 'VueButtonGroup',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<Alignment>,
      default: 'start'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String as PropType<Orientation>,
      default: 'horizontal'
    }
  },
  setup(props, {attrs, slots}) {
    let rootRef = ref<HTMLElement | null>(null);
    let parentRef = ref<HTMLElement | null>(null);
    let hasOverflow = ref(false);
    let resizeObserver: ResizeObserver | null = null;

    let computeHasOverflow = () => {
      if (!rootRef.value || props.orientation !== 'horizontal') {
        return false;
      }

      let root = rootRef.value;
      let restoreVerticalClass = false;
      if (root.classList.contains('spectrum-ButtonGroup--vertical')) {
        restoreVerticalClass = true;
        root.classList.remove('spectrum-ButtonGroup--vertical');
      }

      let buttonGroupChildren = Array.from(root.children) as HTMLElement[];
      let maxX = root.offsetWidth + 1;
      let overflow = buttonGroupChildren.some((child) => child.offsetLeft < 0 || child.offsetLeft + child.offsetWidth > maxX);

      if (restoreVerticalClass) {
        root.classList.add('spectrum-ButtonGroup--vertical');
      }

      return overflow;
    };

    let checkForOverflow = () => {
      if (props.orientation !== 'horizontal') {
        hasOverflow.value = false;
        return;
      }

      hasOverflow.value = computeHasOverflow();
    };

    let onResize = () => {
      checkForOverflow();
    };

    onMounted(() => {
      checkForOverflow();
      parentRef.value = rootRef.value ? rootRef.value.parentElement : null;

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', onResize);
      }

      if (typeof ResizeObserver !== 'undefined' && parentRef.value) {
        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(parentRef.value);
      }
    });

    onUpdated(() => {
      checkForOverflow();
    });

    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    return () => {
      let domProps = {...attrs} as Record<string, unknown>;
      delete domProps.class;
      let children = slots.default ? slots.default().map((child) => decorateChild(child, props.isDisabled)) : [];
      return h('div', {
        ...domProps,
        ref: rootRef,
        class: [
          'spectrum-ButtonGroup',
          props.orientation === 'vertical' || hasOverflow.value ? 'spectrum-ButtonGroup--vertical' : null,
          props.align === 'end' ? 'spectrum-ButtonGroup--alignEnd' : null,
          props.align === 'center' ? 'spectrum-ButtonGroup--alignCenter' : null,
          attrs.class
        ]
      }, children as never);
    };
  }
});

export const ButtonGroup = VueButtonGroup;
export type {SpectrumButtonGroupProps} from '@vue-types/buttongroup';
