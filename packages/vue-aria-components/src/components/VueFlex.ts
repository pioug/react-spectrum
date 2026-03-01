import {computed, type CSSProperties, defineComponent, h, type PropType} from 'vue';

type Responsive<T> = T | {
  [custom: string]: T | undefined,
  base?: T,
  L?: T,
  M?: T,
  S?: T
};

const UNIT_RE = /(%|px|em|rem|vw|vh|auto|cm|mm|in|pt|pc|ex|ch|rem|vmin|vmax|fr)$/;
const FUNC_RE = /^\s*\w+\(/;
const SPECTRUM_VARIABLE_RE = /(static-)?size-\d+|single-line-(height|width)/g;

function resolveResponsive<T>(value: Responsive<T>): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    let responsiveValue = value as Record<string, T | undefined>;
    let viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

    if (viewportWidth >= 1024 && responsiveValue.L != null) {
      return responsiveValue.L;
    }

    if (viewportWidth >= 768 && responsiveValue.M != null) {
      return responsiveValue.M;
    }

    if (viewportWidth >= 640 && responsiveValue.S != null) {
      return responsiveValue.S;
    }

    if (responsiveValue.base != null) {
      return responsiveValue.base;
    }

    for (let key of ['L', 'M', 'S']) {
      if (responsiveValue[key] != null) {
        return responsiveValue[key] as T;
      }
    }

    let first = Object.values(responsiveValue).find((entry) => entry != null);
    return (first ?? 'row') as T;
  }

  return value as T;
}

function toDimensionValue(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (UNIT_RE.test(value)) {
    return value;
  }

  if (FUNC_RE.test(value)) {
    return value.replace(SPECTRUM_VARIABLE_RE, 'var(--spectrum-global-dimension-$&, var(--spectrum-alias-$&))');
  }

  return `var(--spectrum-global-dimension-${value}, var(--spectrum-alias-${value}))`;
}

function assignStyle<K extends keyof CSSProperties>(styles: CSSProperties, key: K, value: CSSProperties[K] | undefined): void {
  if (value != null && value !== '') {
    styles[key] = value;
  }
}

function normalizeFlexAlignment(value: string): CSSProperties['alignItems'] {
  if (value === 'start') {
    return 'flex-start';
  }

  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}

function normalizeFlexDistribution(value: string): CSSProperties['justifyContent'] {
  if (value === 'start') {
    return 'flex-start';
  }

  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}

function normalizeWrap(value: boolean | string): CSSProperties['flexWrap'] {
  if (typeof value === 'string') {
    if (value === 'nowrap' || value === 'wrap' || value === 'wrap-reverse') {
      return value;
    }
    return value ? 'wrap' : 'nowrap';
  }

  return value ? 'wrap' : 'nowrap';
}

function normalizeDirection(value: string, reverse: boolean): CSSProperties['flexDirection'] {
  if (reverse) {
    if (value === 'column') {
      return 'column-reverse';
    }

    if (value === 'row') {
      return 'row-reverse';
    }
  }

  return value as CSSProperties['flexDirection'];
}

export const VueFlex = defineComponent({
  name: 'VueFlex',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    direction: {
      type: [String, Object] as PropType<Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>>,
      default: 'row'
    },
    gap: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    alignItems: {
      type: [String, Object] as PropType<Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>>,
      default: 'stretch'
    },
    justifyContent: {
      type: [String, Object] as PropType<Responsive<'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'>>,
      default: 'start'
    },
    alignContent: {
      type: [String, Object] as PropType<Responsive<'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'>>,
      default: undefined
    },
    wrap: {
      type: [Boolean, String, Object] as PropType<Responsive<boolean | 'nowrap' | 'wrap' | 'wrap-reverse'>>,
      default: false
    },
    columnGap: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    rowGap: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    reverse: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    height: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let styles = computed<CSSProperties>(() => {
      let style: CSSProperties = {
        alignItems: normalizeFlexAlignment(resolveResponsive(props.alignItems)),
        display: 'flex',
        flexDirection: normalizeDirection(resolveResponsive(props.direction), props.reverse),
        flexWrap: normalizeWrap(resolveResponsive(props.wrap)),
        justifyContent: normalizeFlexDistribution(resolveResponsive(props.justifyContent))
      };

      assignStyle(style, 'alignContent', props.alignContent != null ? normalizeFlexAlignment(resolveResponsive(props.alignContent)) : undefined);
      assignStyle(style, 'gap', props.gap != null ? toDimensionValue(resolveResponsive(props.gap)) : undefined);
      assignStyle(style, 'columnGap', props.columnGap != null ? toDimensionValue(resolveResponsive(props.columnGap)) : undefined);
      assignStyle(style, 'rowGap', props.rowGap != null ? toDimensionValue(resolveResponsive(props.rowGap)) : undefined);
      assignStyle(style, 'width', props.width != null ? toDimensionValue(resolveResponsive(props.width)) : undefined);
      assignStyle(style, 'height', props.height != null ? toDimensionValue(resolveResponsive(props.height)) : undefined);

      return style;
    });

    return function render() {
      return h(props.elementType, {
        ...attrs,
        class: ['vs-flex', attrs.class],
        style: [styles.value, attrs.style],
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
