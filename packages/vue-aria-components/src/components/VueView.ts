import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

export const VueView = defineComponent({
  name: 'VueView',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    padding: {
      type: String as PropType<'none' | 's' | 'm' | 'l'>,
      default: 'm'
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-view',
      `vs-view--padding-${props.padding}`,
      props.border ? 'vs-view--bordered' : null,
      context.value.scale === 'large' ? 'vs-view--large' : 'vs-view--medium'
    ]));

    return function render() {
      return h(props.elementType, {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
