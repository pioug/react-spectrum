import {computed, defineComponent, h, type PropType, resolveDynamicComponent} from 'vue';
import {type HiddenStyle, useVisuallyHidden} from './useVisuallyHidden';
import {mergeProps} from '@vue-aria/utils';

export interface VisuallyHiddenProps {
  elementType?: string,
  isFocusable?: boolean,
  style?: HiddenStyle
}

/**
 * VisuallyHidden hides its children visually while keeping content
 * available to assistive technology.
 */
export const VisuallyHidden = defineComponent({
  name: 'VueAriaVisuallyHidden',
  inheritAttrs: false,
  props: {
    elementType: {
      type: String as PropType<string | undefined>,
      default: 'div'
    },
    isFocusable: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object as PropType<HiddenStyle | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let {visuallyHiddenProps} = useVisuallyHidden({
      isFocusable: computed(() => props.isFocusable),
      style: computed(() => props.style)
    });

    return () => h(
      resolveDynamicComponent(props.elementType || 'div'),
      mergeProps(attrs as Record<string, unknown>, visuallyHiddenProps.value as Record<string, unknown>) as Record<string, unknown>,
      slots.default ? slots.default() : []
    );
  }
});
