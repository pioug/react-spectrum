import {computed, defineComponent, h} from 'vue';

export const VueLabel = defineComponent({
  name: 'VueLabel',
  props: {
    forId: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots, attrs}) {
    let classes = computed(() => ([
      'vs-label',
      props.required ? 'is-required' : null
    ]));

    return function render() {
      return h('label', {
        class: [classes.value, attrs.class],
        for: props.forId || undefined,
        'data-vac': ''
      }, [
        slots.default ? slots.default() : 'Label',
        props.required ? h('span', {class: 'vs-label__required', 'aria-hidden': 'true'}, '*') : null
      ]);
    };
  }
});
