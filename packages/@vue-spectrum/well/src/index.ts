import '@adobe/spectrum-css-temp/components/well/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {defineComponent, h} from 'vue';
import './styles.css';
const wellStyles: {[key: string]: string} = {};

export const Well = defineComponent({
  name: 'VueWell',
  inheritAttrs: false,
  props: {
    role: {
      type: String,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    return () => h('div', {
      ...attrs,
      role: props.role || undefined,
      class: [classNames(wellStyles, 'spectrum-Well'), 'vs-spectrum-well', attrs.class],
      'data-vac': ''
    }, slots.default ? slots.default() : []);
  }
});

export const VueWell = Well;
export type {SpectrumWellProps} from '@vue-types/well';
