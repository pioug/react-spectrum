import {computed, type CSSProperties, defineComponent, h, type PropType} from 'vue';

const SPACE_TOKENS: Record<string, string> = {
  'size-0': '0px',
  'size-25': '2px',
  'size-50': '4px',
  'size-75': '6px',
  'size-100': '8px',
  'size-125': '10px',
  'size-150': '12px',
  'size-175': '14px',
  'size-200': '16px',
  'size-250': '20px',
  'size-300': '24px',
  'size-400': '32px',
  'size-500': '40px',
  'size-600': '48px'
};

function resolveSpace(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return SPACE_TOKENS[value] ?? value;
}

export const VueGrid = defineComponent({
  name: 'VueGrid',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    columns: {
      type: String,
      default: ''
    },
    rows: {
      type: String,
      default: ''
    },
    areas: {
      type: String,
      default: ''
    },
    autoFlow: {
      type: String as PropType<'row' | 'column' | 'dense' | 'row dense' | 'column dense'>,
      default: 'row'
    },
    gap: {
      type: [String, Number] as PropType<string | number>,
      default: 'size-100'
    },
    columnGap: {
      type: [String, Number] as PropType<string | number | null>,
      default: null
    },
    rowGap: {
      type: [String, Number] as PropType<string | number | null>,
      default: null
    },
    alignItems: {
      type: String as PropType<'start' | 'center' | 'end' | 'stretch' | 'baseline'>,
      default: 'stretch'
    },
    justifyItems: {
      type: String as PropType<'start' | 'center' | 'end' | 'stretch'>,
      default: 'stretch'
    }
  },
  setup(props, {slots, attrs}) {
    let styles = computed<CSSProperties>(() => ({
      alignItems: props.alignItems,
      columnGap: props.columnGap == null ? undefined : resolveSpace(props.columnGap),
      display: 'grid',
      gap: resolveSpace(props.gap),
      gridAutoFlow: props.autoFlow || undefined,
      gridTemplateAreas: props.areas || undefined,
      gridTemplateColumns: props.columns || undefined,
      gridTemplateRows: props.rows || undefined,
      justifyItems: props.justifyItems,
      rowGap: props.rowGap == null ? undefined : resolveSpace(props.rowGap)
    }));

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
