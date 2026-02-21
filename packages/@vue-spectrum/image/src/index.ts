import '@adobe/spectrum-css-temp/components/image/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


export const Image = defineComponent({
  name: 'VueImage',
  inheritAttrs: false,
  props: {
    alt: {
      type: String,
      default: ''
    },
    borderRadius: {
      type: String,
      default: '8px'
    },
    fit: {
      type: String as PropType<'contain' | 'cover' | 'fill' | 'none'>,
      default: 'cover'
    },
    hidden: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    }
  },
  setup(props, {attrs}) {
    let fitClassName = computed(() => `vs-image--fit-${props.fit}`);

    return () => h('div', {
      ...attrs,
      class: [classNames(styles, 'spectrum-Image'), 'vs-image', fitClassName.value, attrs.class],
      hidden: props.hidden || undefined,
      style: {
        ...((attrs.style as Record<string, unknown>) ?? {}),
        borderRadius: props.borderRadius,
        overflow: 'hidden'
      },
      'data-vac': ''
    }, [
      h('img', {
        class: [classNames(styles, 'spectrum-Image-img'), 'vs-image__img'],
        src: props.src,
        alt: props.alt,
        style: {
          objectFit: props.fit
        },
        onError: (attrs as Record<string, unknown>).onError as ((event: Event) => void) | undefined,
        onLoad: (attrs as Record<string, unknown>).onLoad as ((event: Event) => void) | undefined,
        crossOrigin: (attrs as Record<string, unknown>).crossOrigin as string | undefined
      })
    ]);
  }
});

export {Image as VueImage};
export type {SpectrumImageProps} from '@vue-types/image';
