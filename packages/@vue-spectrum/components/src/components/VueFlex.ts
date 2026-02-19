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

function normalizeFlexAlignment(value: 'start' | 'center' | 'end' | 'stretch' | 'baseline'): CSSProperties['alignItems'] {
  if (value === 'start') {
    return 'flex-start';
  }

  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}

function normalizeFlexDistribution(value: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'): CSSProperties['justifyContent'] {
  if (value === 'start') {
    return 'flex-start';
  }

  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}

export const VueFlex = defineComponent({
  name: 'VueFlex',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    direction: {
      type: String as PropType<'row' | 'column'>,
      default: 'row'
    },
    gap: {
      type: [String, Number] as PropType<string | number>,
      default: 'size-100'
    },
    alignItems: {
      type: String as PropType<'start' | 'center' | 'end' | 'stretch' | 'baseline'>,
      default: 'stretch'
    },
    justifyContent: {
      type: String as PropType<'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'>,
      default: 'start'
    },
    wrap: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots, attrs}) {
    let styles = computed<CSSProperties>(() => ({
      alignItems: normalizeFlexAlignment(props.alignItems),
      display: 'flex',
      flexDirection: props.reverse ? `${props.direction}-reverse` : props.direction,
      flexWrap: props.wrap ? 'wrap' : 'nowrap',
      gap: resolveSpace(props.gap),
      justifyContent: normalizeFlexDistribution(props.justifyContent)
    }));

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
