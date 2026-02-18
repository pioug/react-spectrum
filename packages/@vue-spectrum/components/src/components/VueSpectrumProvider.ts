import {computed, defineComponent, h, type PropType, provide} from 'vue';
import {isRtlLocale} from '../utils';
import {spectrumContextKey, type SpectrumContextValue} from '../context';

export const VueSpectrumProvider = defineComponent({
  name: 'VueSpectrumProvider',
  props: {
    scale: {
      type: String as PropType<SpectrumContextValue['scale']>,
      default: 'medium'
    },
    colorScheme: {
      type: String as PropType<SpectrumContextValue['colorScheme']>,
      default: 'light'
    },
    locale: {
      type: String,
      default: 'en-US'
    },
    dir: {
      type: String as PropType<SpectrumContextValue['dir'] | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let direction = computed(() => props.dir ?? (isRtlLocale(props.locale) ? 'rtl' : 'ltr'));

    let context = computed<SpectrumContextValue>(() => ({
      scale: props.scale,
      colorScheme: props.colorScheme,
      locale: props.locale,
      dir: direction.value
    }));

    provide(spectrumContextKey, context);

    return function render() {
      return h('div', {
        ...attrs,
        class: ['vs-provider', attrs.class],
        lang: props.locale,
        dir: direction.value,
        'data-scale': props.scale,
        'data-color-scheme': props.colorScheme
      }, slots.default ? slots.default() : []);
    };
  }
});
