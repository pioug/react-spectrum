import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

export const VueButtonGroup = defineComponent({
  name: 'VueButtonGroup',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    align: {
      type: String as PropType<'start' | 'center' | 'end'>,
      default: 'start'
    }
  },
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-button-group',
      `vs-button-group--${props.orientation}`,
      `vs-button-group--align-${props.align}`,
      context.value.scale === 'large' ? 'vs-button-group--large' : 'vs-button-group--medium'
    ]));

    return function render() {
      return h(props.elementType, {
        ...attrs,
        class: [classes.value, attrs.class],
        role: 'group',
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
