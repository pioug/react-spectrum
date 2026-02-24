import {computed, defineComponent, h} from 'vue';

export const VueAvatar = defineComponent({
  name: 'VueAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    size: {
      type: String as () => 's' | 'm' | 'l',
      default: 'm'
    },
    shape: {
      type: String as () => 'circle' | 'square',
      default: 'circle'
    }
  },
  setup(props, {attrs}) {
    let classes = computed(() => ([
      'vs-avatar',
      `vs-avatar--${props.size}`,
      `vs-avatar--${props.shape}`
    ]));

    let fallbackLabel = computed(() => {
      if (!props.label) {
        return '?';
      }

      return props.label.trim().slice(0, 2).toUpperCase();
    });

    return function render() {
      return h('span', {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        props.src
          ? h('img', {
            class: 'vs-avatar__image',
            src: props.src,
            alt: props.alt || props.label || 'Avatar'
          })
          : h('span', {
            class: 'vs-avatar__fallback',
            'aria-hidden': 'true'
          }, fallbackLabel.value)
      ]);
    };
  }
});
