import '@adobe/spectrum-css-temp/components/illustratedmessage/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, type VNode} from 'vue';
const styles: {[key: string]: string} = {};


export const IllustratedMessage = defineComponent({
  name: 'VueIllustratedMessage',
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: ''
    },
    elementType: {
      type: String,
      default: 'section'
    },
    hidden: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    variant: {
      type: String as PropType<'info' | 'negative' | 'neutral' | 'notice' | 'positive'>,
      default: 'neutral'
    }
  },
  setup(props, {slots, attrs}) {
    let classes = computed(() => ([
      classNames(styles, 'spectrum-IllustratedMessage'),
      'vs-illustrated-message',
      `vs-illustrated-message--${props.variant}`
    ]));

    return () => {
      let illustration = slots.illustration
        ? slots.illustration()
        : [h('span', {class: 'vs-illustrated-message__glyph', 'aria-hidden': 'true'}, '[]')];

      let heading: VNode[] = [];
      if (slots.heading) {
        heading = slots.heading();
      } else if (props.title) {
        heading = [h('p', {
          class: [classNames(styles, 'spectrum-IllustratedMessage-heading'), 'vs-illustrated-message__heading']
        }, props.title)];
      }

      let content: VNode[] = [];
      if (slots.default) {
        content = slots.default();
      } else if (props.description) {
        content = [h('p', {
          class: [classNames(styles, 'spectrum-IllustratedMessage-description'), 'vs-illustrated-message__description']
        }, props.description)];
      }

      return h(props.elementType, {
        ...attrs,
        class: [classes.value, attrs.class],
        hidden: props.hidden || undefined,
        role: 'status',
        'data-vac': ''
      }, [
        h('div', {class: 'vs-illustrated-message__illustration'}, illustration),
        ...heading,
        ...content
      ]);
    };
  }
});

export {IllustratedMessage as VueIllustratedMessage};
export type {SpectrumIllustratedMessageProps} from '@vue-types/illustratedmessage';
