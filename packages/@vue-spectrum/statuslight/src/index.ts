import '@adobe/spectrum-css-temp/components/statuslight/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type Variant = 'active' | 'celery' | 'chartreuse' | 'fuchsia' | 'indigo' | 'info' | 'magenta' | 'negative' | 'neutral' | 'notice' | 'positive' | 'purple' | 'seafoam' | 'yellow';

export const StatusLight = defineComponent({
  name: 'VueStatusLight',
  inheritAttrs: false,
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: undefined
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'neutral'
    }
  },
  setup(props, {slots, attrs}) {
    return () => h('div', {
      ...attrs,
      role: props.role || attrs.role,
      class: [classNames(
        styles,
        'spectrum-StatusLight',
        `spectrum-StatusLight--${props.variant}`,
        {
          'is-disabled': props.isDisabled
        }
      ), 'vs-status-light', attrs.class],
      'data-vac': ''
    }, [
      slots.default ? slots.default() : props.label
    ]);
  }
});

export const VueStatusLight = StatusLight;
export type {SpectrumStatusLightProps} from '@vue-types/statuslight';
