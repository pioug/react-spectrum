import '@adobe/spectrum-css-temp/components/rule/vars.css';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};

const sizeMap: Record<'S' | 'M' | 'L', string> = {
  S: 'small',
  M: 'medium',
  L: 'large'
};

export const Divider = defineComponent({
  name: 'VueSpectrumDivider',
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<'S' | 'M' | 'L'>,
      default: 'L'
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    }
  },
  setup(props, {attrs}) {
    return () => {
      let elementType = props.orientation === 'vertical' ? 'div' : 'hr';
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;

      return h(elementType, {
        ...restDomProps,
        class: [
          classNames(
            styles,
            'spectrum-Rule',
            `spectrum-Rule--${sizeMap[props.size]}`,
            {
              'spectrum-Rule--vertical': props.orientation === 'vertical',
              'spectrum-Rule--horizontal': props.orientation === 'horizontal'
            }
          ),
          domClassName,
          domClass
        ],
        style: domStyle,
        role: elementType === 'hr' ? undefined : 'separator',
        'aria-orientation': props.orientation === 'vertical' ? 'vertical' : undefined
      });
    };
  }
});

export const VueDivider = Divider;
export type {SpectrumDividerProps} from '@vue-types/divider';
