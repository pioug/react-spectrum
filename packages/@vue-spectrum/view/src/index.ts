import {filterDOMProps} from '@vue-aria/utils';
import {defineComponent, h, type PropType} from 'vue';

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

type ColorType = 'background';

function colorValue(value: string, type: ColorType = 'background', version = 5): string {
  if (version > 5) {
    return `var(--spectrum-${value}, var(--spectrum-semantic-${value}-color-${type}))`;
  }

  return `var(--spectrum-legacy-color-${value}, var(--spectrum-global-color-${value}, var(--spectrum-semantic-${value}-color-${type})))`;
}

function backgroundColorValue(value: string, version = 5): string {
  return `var(--spectrum-alias-background-color-${value}, ${colorValue(value, 'background', version)})`;
}

const baseProps = {
  UNSAFE_className: {
    type: String,
    default: ''
  },
  UNSAFE_style: {
    type: [String, Object, Array] as PropType<string | Record<string, unknown> | Array<unknown> | undefined>,
    default: undefined
  },
  backgroundColor: {
    type: String as PropType<string | undefined>,
    default: undefined
  },
  colorVersion: {
    type: Number as PropType<number | undefined>,
    default: undefined
  },
  width: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  },
  height: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined
  }
};

function createElementComponent(name: string, defaultElementType: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      ...baseProps,
      elementType: {
        type: String,
        default: defaultElementType
      }
    },
    setup(props, {attrs, slots}) {
      return () => {
        let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
        let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;
        let width = toDimensionValue(props.width);
        let height = toDimensionValue(props.height);
        let classList = [props.UNSAFE_className, domClassName, domClass].filter(Boolean);

        return h(props.elementType, {
          ...restDomProps,
          class: classList.length > 0 ? classList : undefined,
          style: [
            props.UNSAFE_style,
            domStyle,
            {
              ...(width && {width}),
              ...(height && {height}),
              ...(props.backgroundColor && {backgroundColor: backgroundColorValue(props.backgroundColor, props.colorVersion)})
            }
          ]
        }, slots.default ? slots.default() : []);
      };
    }
  });
}

export const View = createElementComponent('VueSpectrumView', 'div');
export const Header = createElementComponent('VueSpectrumHeader', 'header');
export const Content = createElementComponent('VueSpectrumContent', 'section');
export const Footer = createElementComponent('VueSpectrumFooter', 'footer');

export type {ContentProps, FooterProps, HeaderProps, ViewProps} from '@vue-types/view';
