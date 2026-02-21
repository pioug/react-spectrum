import '@adobe/spectrum-css-temp/components/avatar/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h} from 'vue';
const styles: {[key: string]: string} = {};


export const Avatar = defineComponent({
  name: 'VueAvatar',
  inheritAttrs: false,
  props: {
    alt: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    shape: {
      type: String as () => 'circle' | 'square',
      default: 'circle'
    },
    size: {
      type: String as () => 's' | 'm' | 'l',
      default: 'm'
    },
    src: {
      type: String,
      default: ''
    }
  },
  setup(props, {attrs}) {
    let fallbackLabel = computed(() => {
      if (!props.label) {
        return '?';
      }

      return props.label.trim().slice(0, 2).toUpperCase();
    });

    return () => h('span', {
      ...attrs,
      class: [
        classNames(styles, 'spectrum-Avatar', {'is-disabled': props.isDisabled}),
        'vs-avatar',
        `vs-avatar--${props.size}`,
        `vs-avatar--${props.shape}`,
        attrs.class
      ],
      'data-vac': ''
    }, [
      props.src
        ? h('img', {
          class: 'vs-avatar__image',
          src: props.src,
          alt: props.alt || props.label || 'Avatar',
          'aria-hidden': props.isDisabled ? 'true' : undefined
        })
        : h('span', {
          class: 'vs-avatar__fallback',
          'aria-hidden': 'true'
        }, fallbackLabel.value)
    ]);
  }
});

export {Avatar as VueAvatar};
export type {SpectrumAvatarProps} from '@vue-types/avatar';
