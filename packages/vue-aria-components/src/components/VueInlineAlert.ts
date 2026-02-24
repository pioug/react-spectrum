import {computed, defineComponent, h, type VNodeChild} from 'vue';

export const VueInlineAlert = defineComponent({
  name: 'VueInlineAlert',
  props: {
    variant: {
      type: String as () => 'neutral' | 'info' | 'positive' | 'notice' | 'negative',
      default: 'info'
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup(props, {slots, attrs}) {
    let classes = computed(() => ([
      'vs-inline-alert',
      `vs-inline-alert--${props.variant}`
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
        role: 'status',
        'data-vac': ''
      }, [
        props.title ? h('strong', {class: 'vs-inline-alert__title'}, props.title) : null,
        h('div', {class: 'vs-inline-alert__content'}, content)
      ]);
    };
  }
});
