import '@adobe/spectrum-css-temp/components/avatar/vars.css';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {defineComponent, h} from 'vue';
const styles: {[key: string]: string} = {};

const DEFAULT_SIZE = 'avatar-size-100';
const SIZE_RE = /^size-\d+/;
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
    size: {
      type: [String, Number],
      default: DEFAULT_SIZE
    },
    src: {
      type: String,
      default: ''
    }
  },
  setup(props, {attrs}) {
    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let size = props.size;
      let sizeValue = typeof size !== 'number' && (SIZE_RE.test(String(size)) || !isNaN(size as number))
        ? toDimensionValue(DEFAULT_SIZE)
        : toDimensionValue(size || DEFAULT_SIZE);
      let style = [domProps.style, sizeValue ? {height: sizeValue, width: sizeValue} : undefined];

      return h('img', {
        ...domProps,
        alt: props.alt,
        class: [
          classNames(styles, 'spectrum-Avatar', {'is-disabled': props.isDisabled}),
          domProps.class,
          domProps.className
        ],
        src: props.src,
        style
      });
    };
  }
});

export {Avatar as VueAvatar};
export type {SpectrumAvatarProps} from '@vue-types/avatar';
