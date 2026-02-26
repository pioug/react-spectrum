import '@adobe/spectrum-css-temp/components/illustratedmessage/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {defineComponent, h} from 'vue';
import {filterDOMProps} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};

export const IllustratedMessage = defineComponent({
  name: 'VueIllustratedMessage',
  inheritAttrs: false,
  setup(_props, {slots, attrs}) {
    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;

      return h('div', {
        ...otherDomProps,
        class: [
          classNames(styles, 'spectrum-IllustratedMessage', 'flex'),
          domClassName,
          domClass
        ],
        style: domStyle
      }, slots.default ? slots.default() : []);
    };
  }
});

export {IllustratedMessage as VueIllustratedMessage};
export type {SpectrumIllustratedMessageProps} from '@vue-types/illustratedmessage';
