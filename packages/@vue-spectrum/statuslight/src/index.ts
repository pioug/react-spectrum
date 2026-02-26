import '@adobe/spectrum-css-temp/components/statuslight/vars.css';
import {filterDOMProps} from '@vue-aria/utils';
import {useProviderProps} from '@vue-spectrum/provider';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type Variant = 'celery' | 'chartreuse' | 'fuchsia' | 'indigo' | 'info' | 'magenta' | 'negative' | 'neutral' | 'notice' | 'positive' | 'purple' | 'seafoam' | 'yellow';

export const StatusLight = defineComponent({
  name: 'VueStatusLight',
  inheritAttrs: false,
  props: {
    isDisabled: {
      type: Boolean,
      default: false
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
    let resolvedProps = computed(() => useProviderProps(props));

    return () => {
      let ariaLabel = attrs['aria-label'];
      let ariaLabelledby = attrs['aria-labelledby'];
      let content = slots.default ? slots.default() : [];

      if (content.length === 0 && !ariaLabel && process.env.NODE_ENV !== 'production') {
        console.warn('If no children are provided, an aria-label must be specified');
      }

      if (!resolvedProps.value.role && (ariaLabel || ariaLabelledby) && process.env.NODE_ENV !== 'production') {
        console.warn('A labelled StatusLight must have a role.');
      }

      let domProps = filterDOMProps(
        attrs as Record<string, unknown>,
        {labelable: Boolean(resolvedProps.value.role)}
      ) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      delete otherDomProps.role;

      return h('div', {
        ...otherDomProps,
        role: resolvedProps.value.role,
        class: [classNames(
        styles,
        'spectrum-StatusLight',
        `spectrum-StatusLight--${resolvedProps.value.variant}`,
        {
          'is-disabled': resolvedProps.value.isDisabled
        }
      ), domClassName, domClass],
        style: domStyle
      }, content);
    };
  }
});

export const VueStatusLight = StatusLight;
export type {SpectrumStatusLightProps} from '@vue-types/statuslight';
