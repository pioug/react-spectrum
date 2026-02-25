import '@adobe/spectrum-css-temp/components/image/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};
const IMAGE_ALT_WARNING = 'The `alt` prop was not provided to an image. Add `alt` text for screen readers, or set `alt=\"\"` prop to indicate that the image is decorative or redundant with displayed text and should not be announced by screen readers.';


export const Image = defineComponent({
  name: 'VueImage',
  inheritAttrs: false,
  props: {
    alt: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    crossOrigin: {
      type: String as PropType<'anonymous' | 'use-credentials' | undefined>,
      default: undefined
    },
    objectFit: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    src: {
      type: String,
      default: ''
    }
  },
  setup(props, {attrs}) {
    if (props.alt == null) {
      console.warn(IMAGE_ALT_WARNING);
    }

    return () => h('div', {
      ...attrs,
      class: [classNames(styles, 'spectrum-Image'), 'vs-image', attrs.class],
      style: {
        ...((attrs.style as Record<string, unknown>) ?? {}),
        overflow: 'hidden'
      },
      'data-vac': ''
    }, [
      h('img', {
        class: [classNames(styles, 'spectrum-Image-img'), 'vs-image__img'],
        src: props.src,
        alt: props.alt,
        style: {
          objectFit: props.objectFit
        },
        onError: (attrs as Record<string, unknown>).onError as ((event: Event) => void) | undefined,
        onLoad: (attrs as Record<string, unknown>).onLoad as ((event: Event) => void) | undefined,
        crossOrigin: props.crossOrigin
      })
    ]);
  }
});

export {Image as VueImage};
export type {SpectrumImageProps} from '@vue-types/image';
