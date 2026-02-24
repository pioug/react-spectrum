import {computed, defineComponent, h, type PropType, type VNode} from 'vue';
import {getSpectrumContext} from '../context';

export const VueIllustratedMessage = defineComponent({
  name: 'VueIllustratedMessage',
  props: {
    elementType: {
      type: String,
      default: 'section'
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    variant: {
      type: String as PropType<'neutral' | 'info' | 'positive' | 'notice' | 'negative'>,
      default: 'neutral'
    }
  },
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-illustrated-message',
      `vs-illustrated-message--${props.variant}`,
      context.value.scale === 'large' ? 'vs-illustrated-message--large' : 'vs-illustrated-message--medium'
    ]));

    return function render() {
      let illustration = slots.illustration
        ? slots.illustration()
        : [h('span', {class: 'vs-illustrated-message__glyph', 'aria-hidden': 'true'}, '[]')];

      let heading: VNode[] = [];
      if (slots.heading) {
        heading = slots.heading();
      } else if (props.title) {
        heading = [h('p', {class: 'vs-illustrated-message__heading'}, props.title)];
      }

      let content: VNode[] = [];
      if (slots.default) {
        content = slots.default();
      } else if (props.description) {
        content = [h('p', {class: 'vs-illustrated-message__description'}, props.description)];
      }

      return h(props.elementType, {
        ...attrs,
        class: [classes.value, attrs.class],
        'data-vac': '',
        role: 'status'
      }, [
        h('div', {class: 'vs-illustrated-message__illustration'}, illustration),
        ...heading,
        ...content
      ]);
    };
  }
});
