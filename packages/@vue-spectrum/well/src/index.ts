import '@adobe/spectrum-css-temp/components/well/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {defineComponent, h, type PropType} from 'vue';
import './styles.css';
const wellStyles: {[key: string]: string} = {};
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
    if (!props.role && (attrs['aria-label'] || attrs['aria-labelledby'])) {
      console.warn(WELL_LABEL_WARNING);
    }

    return () => {
      let domAttrs: Record<string, unknown> = {...attrs};
      if (!props.role) {
        delete domAttrs['aria-label'];
        delete domAttrs['aria-labelledby'];
      }

      return h('div', {
        ...domAttrs,
        role: props.role || undefined,
        class: [classNames(wellStyles, 'spectrum-Well'), 'vs-spectrum-well', domAttrs.class],
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueWell = Well;
export type {SpectrumWellProps} from '@vue-types/well';
