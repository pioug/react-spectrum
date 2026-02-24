import {defineComponent, h} from 'vue';

export const VueLink = defineComponent({
  name: 'VueLink',
  props: {
    href: {
      type: String,
      default: '#'
    },
    target: {
      type: String,
      default: undefined
    },
    rel: {
      type: String,
      default: undefined
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {slots, emit, attrs}) {
    return function render() {
      return h('a', {
        ...attrs,
        class: ['vs-link', attrs.class],
        'data-vac': '',
        href: props.href,
        target: props.target,
        rel: props.rel,
        onClick: (event: MouseEvent) => emit('click', event)
      }, slots.default ? slots.default() : props.href);
    };
  }
});
