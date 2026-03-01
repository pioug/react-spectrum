import {computed, type CSSProperties, defineComponent, h, type PropType} from 'vue';

type Responsive<T> = T | {
  [custom: string]: T | undefined,
  base?: T,
  L?: T,
  M?: T,
  S?: T
};
type GridTemplateValue = string | number | Array<string | number>;

const UNIT_RE = /(%|px|em|rem|vw|vh|auto|cm|mm|in|pt|pc|ex|ch|rem|vmin|vmax|fr)$/;
const FUNC_RE = /^\s*\w+\(/;
const GRID_KEYWORD_RE = /^(max-content|min-content|subgrid|auto)$/;
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
    return (first ?? '') as T;
  }

  return value as T;
}

function toDimensionValue(value: string | number | null | undefined): string | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (GRID_KEYWORD_RE.test(value.trim())) {
    return value;
  }

  if (UNIT_RE.test(value)) {
    return value;
  }

  if (FUNC_RE.test(value)) {
    return value.replace(SPECTRUM_VARIABLE_RE, 'var(--spectrum-global-dimension-$&, var(--spectrum-alias-$&))');
  }

  return `var(--spectrum-global-dimension-${value}, var(--spectrum-alias-${value}))`;
}

function gridTemplateAreasValue(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.map((row) => `"${row}"`).join('\n');
  }

  return value;
}

function gridTemplateValue(value: GridTemplateValue): string {
  if (Array.isArray(value)) {
    return value
      .map((part) => toDimensionValue(part))
      .filter((part): part is string => part != null)
      .join(' ');
  }

  return toDimensionValue(value) ?? '';
}

function assignStyle<K extends keyof CSSProperties>(styles: CSSProperties, key: K, value: CSSProperties[K] | undefined): void {
  if (value != null && value !== '') {
    styles[key] = value;
  }
}

export const VueGrid = defineComponent({
  name: 'VueGrid',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    columns: {
      type: [String, Number, Array, Object] as PropType<Responsive<GridTemplateValue> | undefined>,
      default: undefined
    },
    rows: {
      type: [String, Number, Array, Object] as PropType<Responsive<GridTemplateValue> | undefined>,
      default: undefined
    },
    areas: {
      type: [String, Array, Object] as PropType<Responsive<string | string[]> | undefined>,
      default: undefined
    },
    autoColumns: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    autoRows: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    autoFlow: {
      type: String as PropType<'row' | 'column' | 'dense' | 'row dense' | 'column dense'>,
      default: 'row'
    },
    gap: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    columnGap: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    rowGap: {
      type: [String, Number, Object] as PropType<Responsive<string | number> | undefined>,
      default: undefined
    },
    alignItems: {
      type: [String, Object] as PropType<Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>>,
      default: 'stretch'
    },
    justifyItems: {
      type: [String, Object] as PropType<Responsive<'start' | 'center' | 'end' | 'stretch'>>,
      default: 'stretch'
    },
    justifyContent: {
      type: [String, Object] as PropType<Responsive<string> | undefined>,
      default: undefined
    },
    alignContent: {
      type: [String, Object] as PropType<Responsive<string> | undefined>,
      default: undefined
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
        alignItems: resolveResponsive(props.alignItems),
        display: 'grid',
        gridAutoFlow: props.autoFlow || undefined,
        justifyItems: resolveResponsive(props.justifyItems)
      };

      assignStyle(style, 'alignContent', props.alignContent != null ? resolveResponsive(props.alignContent) : undefined);
      assignStyle(style, 'gap', props.gap != null ? toDimensionValue(resolveResponsive(props.gap)) : undefined);
      assignStyle(style, 'columnGap', props.columnGap != null ? toDimensionValue(resolveResponsive(props.columnGap)) : undefined);
      assignStyle(style, 'rowGap', props.rowGap != null ? toDimensionValue(resolveResponsive(props.rowGap)) : undefined);
      assignStyle(style, 'gridAutoColumns', props.autoColumns != null ? toDimensionValue(resolveResponsive(props.autoColumns)) : undefined);
      assignStyle(style, 'gridAutoRows', props.autoRows != null ? toDimensionValue(resolveResponsive(props.autoRows)) : undefined);
      assignStyle(style, 'gridTemplateAreas', props.areas != null ? gridTemplateAreasValue(resolveResponsive(props.areas)) : undefined);
      assignStyle(style, 'gridTemplateColumns', props.columns != null ? gridTemplateValue(resolveResponsive(props.columns)) : undefined);
      assignStyle(style, 'gridTemplateRows', props.rows != null ? gridTemplateValue(resolveResponsive(props.rows)) : undefined);
      assignStyle(style, 'justifyContent', props.justifyContent != null ? resolveResponsive(props.justifyContent) : undefined);
      assignStyle(style, 'width', props.width != null ? toDimensionValue(resolveResponsive(props.width)) : undefined);
      assignStyle(style, 'height', props.height != null ? toDimensionValue(resolveResponsive(props.height)) : undefined);

      return style;
    });

    return function render() {
      return h(props.elementType, {
        ...attrs,
        class: ['vs-grid', attrs.class],
        style: [styles.value, attrs.style],
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
