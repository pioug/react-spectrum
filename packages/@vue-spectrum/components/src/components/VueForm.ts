import {defineComponent, h} from 'vue';

export const VueForm = defineComponent({
  name: 'VueForm',
  emits: {
    submit: (event: SubmitEvent) => event instanceof SubmitEvent,
    reset: (event: Event) => event instanceof Event
  },
  setup(_props, {slots, emit, attrs}) {
    return function render() {
      return h('form', {
        ...attrs,
        class: ['vs-form', attrs.class],
        'data-vac': '',
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault();
          emit('submit', event);
        },
        onReset: (event: Event) => emit('reset', event)
      }, slots.default ? slots.default() : []);
    };
  }
});
