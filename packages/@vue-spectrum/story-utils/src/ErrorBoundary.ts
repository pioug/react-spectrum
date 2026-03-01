import {defineComponent, h, onErrorCaptured, ref} from 'vue';

export const VueErrorBoundary = defineComponent({
  name: 'VueErrorBoundary',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  setup(props, {slots}) {
    let hasError = ref(false);

    onErrorCaptured(() => {
      hasError.value = true;
      return false;
    });

    return () => {
      if (hasError.value) {
        return h('div', props.message);
      }

      return slots.default ? slots.default() : null;
    };
  }
});
