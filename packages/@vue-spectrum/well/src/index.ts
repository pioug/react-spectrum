import '@adobe/spectrum-css-temp/components/well/vars.css';
import {filterDOMProps} from '@vue-aria/utils';
import {defineComponent, h, type PropType} from 'vue';
const WELL_LABEL_WARNING = 'A labelled Well must have a role.';

export const Well = defineComponent({
  name: 'VueWell',
  inheritAttrs: false,
  props: {
    role: {
      type: String as PropType<'group' | 'region' | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    return () => {
      if (!props.role && (attrs['aria-label'] || attrs['aria-labelledby']) && process.env.NODE_ENV !== 'production') {
        console.warn(WELL_LABEL_WARNING);
      }

      let domAttrs = filterDOMProps(attrs as Record<string, unknown>, {labelable: !!props.role}) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomAttrs
      } = domAttrs;

      return h('div', {
        ...otherDomAttrs,
        role: props.role || undefined,
        class: ['spectrum-Well', domClassName, domClass],
        style: domStyle
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueWell = Well;
export type {SpectrumWellProps} from '@vue-types/well';
