import {computed, defineComponent, h, type PropType} from 'vue';

export const VueImage = defineComponent({
  name: 'VueImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    fit: {
      type: String as PropType<'cover' | 'contain' | 'fill' | 'none'>,
      default: 'cover'
    },
    borderRadius: {
      type: String,
      default: '8px'
    }
  },
  setup(props, {attrs}) {
    let classes = computed(() => ([
      'vs-image',
      `vs-image--fit-${props.fit}`
    ]));

    return function render() {
      return h('img', {
        ...attrs,
        class: [classes.value, attrs.class],
        src: props.src,
        alt: props.alt,
        style: {
          borderRadius: props.borderRadius
        },
        'data-vac': ''
      });
    };
  }
});
