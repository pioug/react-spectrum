import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type NumberRange = {start: number, end: number};
type DateRange = {start: Date, end: Date};
type LabeledValueInput = string | number | Date | string[] | NumberRange | DateRange | null;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumberRange(value: unknown): value is NumberRange {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.start === 'number' && typeof value.end === 'number';
}

function isDateRange(value: unknown): value is DateRange {
  if (!isObject(value)) {
    return false;
  }

  return value.start instanceof Date && value.end instanceof Date;
}

function formatNumberRange(value: NumberRange, locale: string, options?: Intl.NumberFormatOptions): string {
  let formatter = new Intl.NumberFormat(locale, options);
  let rangeFormatter = formatter as Intl.NumberFormat & {formatRange?: (start: number, end: number) => string};
  if (typeof rangeFormatter.formatRange === 'function') {
    return rangeFormatter.formatRange(value.start, value.end);
  }

  return `${formatter.format(value.start)} - ${formatter.format(value.end)}`;
}

function formatDateRange(value: DateRange, locale: string, options?: Intl.DateTimeFormatOptions): string {
  let formatter = new Intl.DateTimeFormat(locale, options);
  let rangeFormatter = formatter as Intl.DateTimeFormat & {formatRange?: (start: Date, end: Date) => string};
  if (typeof rangeFormatter.formatRange === 'function') {
    return rangeFormatter.formatRange(value.start, value.end);
  }

  return `${formatter.format(value.start)} - ${formatter.format(value.end)}`;
}

export const VueLabeledValue = defineComponent({
  name: 'VueLabeledValue',
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Date, Array, Object] as PropType<LabeledValueInput>,
      default: ''
    },
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical'
    },
    locale: {
      type: String,
      default: 'en-US'
    },
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions | Intl.DateTimeFormatOptions | undefined>,
      default: undefined
    },
    emptyValue: {
      type: String,
      default: '--'
    }
  },
  setup(props, {slots, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-labeled-value',
      `vs-labeled-value--${props.orientation}`,
      context.value.scale === 'large' ? 'vs-labeled-value--large' : 'vs-labeled-value--medium'
    ]));

    let formattedValue = computed(() => {
      let value = props.value;
      if (value == null || value === '') {
        return props.emptyValue;
      }

      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        return value.join(', ');
      }

      if (isNumberRange(value)) {
        return formatNumberRange(value, props.locale, props.formatOptions as Intl.NumberFormatOptions | undefined);
      }

      if (isDateRange(value)) {
        return formatDateRange(value, props.locale, props.formatOptions as Intl.DateTimeFormatOptions | undefined);
      }

      if (typeof value === 'number') {
        let formatter = new Intl.NumberFormat(props.locale, props.formatOptions as Intl.NumberFormatOptions | undefined);
        return formatter.format(value);
      }

      if (value instanceof Date) {
        let formatter = new Intl.DateTimeFormat(props.locale, props.formatOptions as Intl.DateTimeFormatOptions | undefined);
        return formatter.format(value);
      }

      if (typeof value === 'string') {
        return value;
      }

      if (isObject(value)) {
        return JSON.stringify(value);
      }

      return String(value);
    });

    return function render() {
      return h(props.elementType, {
        ...attrs,
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        h('span', {class: 'vs-labeled-value__label'}, slots.label ? slots.label() : props.label),
        h('span', {class: 'vs-labeled-value__value'}, slots.default ? slots.default() : formattedValue.value)
      ]);
    };
  }
});
