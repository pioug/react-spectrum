import {computed, defineComponent, h, type VNodeChild} from 'vue';
import {getSpectrumContext} from '../context';

export const VueWell = defineComponent({
  name: 'VueWell',
  props: {
    variant: {
      type: String as () => 'default' | 'positive' | 'notice' | 'negative',
      default: 'default'
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-well',
      `vs-well--${props.variant}`,
      context.value.scale === 'large' ? 'vs-well--large' : 'vs-well--medium'
    ]));

    return function render() {
      let content: VNodeChild[] = [];
      if (slots.default) {
        content = slots.default();
      } else if (props.label) {
        content = [props.label];
      }

      return h('section', {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, content);
    };
  }
});
