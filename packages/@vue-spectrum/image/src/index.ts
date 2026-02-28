import '@adobe/spectrum-css-temp/components/image/vars.css';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};
const IMAGE_ALT_WARNING = 'The `alt` prop was not provided to an image. Add `alt` text for screen readers, or set `alt=\"\"` prop to indicate that the image is decorative or redundant with displayed text and should not be announced by screen readers.';

const UNIT_RE = /(%|px|em|rem|vw|vh|auto|cm|mm|in|pt|pc|ex|ch|rem|vmin|vmax|fr)$/;
const FUNC_RE = /^\s*\w+\(/;
const SPECTRUM_VARIABLE_RE = /(static-)?size-\d+|single-line-(height|width)/g;

function toDimensionValue(value: string | number | null | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (!value) {
    return undefined;
  }

  if (UNIT_RE.test(value)) {
    return value;
  }

  if (FUNC_RE.test(value)) {
    return value.replace(SPECTRUM_VARIABLE_RE, 'var(--spectrum-global-dimension-$&, var(--spectrum-alias-$&))');
  }

  return `var(--spectrum-global-dimension-${value}, var(--spectrum-alias-${value}))`;
}

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
    },
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    height: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    UNSAFE_className: {
      type: String,
      default: ''
    },
    UNSAFE_style: {
      type: [String, Object, Array] as PropType<string | Record<string, unknown> | Array<unknown> | undefined>,
      default: undefined
    },
    onError: {
      type: Function as PropType<((event: Event) => void) | undefined>,
      default: undefined
    },
    onLoad: {
      type: Function as PropType<((event: Event) => void) | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    if (props.alt == null && process.env.NODE_ENV !== 'production') {
      console.warn(IMAGE_ALT_WARNING);
    }

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;
      let width = toDimensionValue(props.width);
      let height = toDimensionValue(props.height);

      return h('div', {
        ...restDomProps,
        class: [props.UNSAFE_className, domClassName, domClass],
        style: [
          props.UNSAFE_style,
          domStyle,
          {
            overflow: 'hidden',
            ...(width && {width}),
            ...(height && {height})
          }
        ]
      }, [
        h('img', {
          class: classNames(styles, 'spectrum-Image-img'),
          src: props.src,
          alt: props.alt,
          style: {objectFit: props.objectFit},
          onError: props.onError,
          onLoad: props.onLoad,
          crossOrigin: props.crossOrigin
        })
      ]);
    };
  }
});

export {Image as VueImage};
export type {SpectrumImageProps} from '@vue-types/image';
