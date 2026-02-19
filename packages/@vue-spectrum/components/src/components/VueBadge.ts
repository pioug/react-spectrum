import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

export const VueBadge = defineComponent({
  name: 'VueBadge',
  props: {
    variant: {
      type: String as () => 'neutral' | 'info' | 'positive' | 'notice' | 'negative',
      default: 'neutral'
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-badge',
      `vs-badge--${props.variant}`,
      context.value.scale === 'large' ? 'vs-badge--large' : 'vs-badge--medium'
    ]));

    return function render() {
      return h('span', {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, slots.default ? slots.default() : props.label);
    };
  }
});
