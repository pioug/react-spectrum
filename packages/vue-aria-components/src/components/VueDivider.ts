import {defineComponent, h} from 'vue';

export const VueDivider = defineComponent({
  name: 'VueDivider',
  props: {
    orientation: {
      type: String as () => 'horizontal' | 'vertical',
      default: 'horizontal'
    },
    decorative: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {attrs}) {
    return function render() {
      return h('div', {
        class: ['vs-divider', `vs-divider--${props.orientation}`, attrs.class],
        role: props.decorative ? undefined : 'separator',
        'aria-hidden': props.decorative ? 'true' : undefined,
        'aria-orientation': !props.decorative ? props.orientation : undefined,
        'data-vac': ''
      });
    };
  }
});
