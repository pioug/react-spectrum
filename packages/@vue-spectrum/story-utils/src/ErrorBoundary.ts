import {defineComponent, h, onErrorCaptured, ref} from 'vue';

export const VueErrorBoundary = defineComponent({
  name: 'VueErrorBoundary',
  props: {
    message: {
      type: String,
      default: 'Something went wrong.'
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
        return h('div', {
          class: 'vs-story-utils__error-boundary'
        }, props.message);
      }

      return slots.default ? slots.default() : null;
    };
  }
});
