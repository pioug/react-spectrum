import {computed, defineComponent, h} from 'vue';

export const VueStatusLight = defineComponent({
  name: 'VueStatusLight',
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
    let classes = computed(() => ([
      'vs-status-light',
      `vs-status-light--${props.variant}`
    ]));

    return function render() {
      return h('span', {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        h('span', {class: 'vs-status-light__dot', 'aria-hidden': 'true'}),
        h('span', {class: 'vs-status-light__label'}, slots.default ? slots.default() : props.label)
      ]);
    };
  }
});
