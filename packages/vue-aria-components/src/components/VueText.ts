import {computed, defineComponent, h, type PropType} from 'vue';

export const VueText = defineComponent({
  name: 'VueText',
  props: {
    elementType: {
      type: String,
      default: 'p'
    },
    variant: {
      type: String as PropType<'body' | 'detail' | 'heading'>,
      default: 'body'
    },
    truncate: {
      type: Boolean,
      default: false
    },
    emphasized: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots, attrs}) {
    let classes = computed(() => ([
      'vs-text',
      `vs-text--${props.variant}`,
      props.truncate ? 'is-truncated' : null,
      props.emphasized ? 'is-emphasized' : null
    ]));

    return function render() {
      return h(props.elementType, {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
