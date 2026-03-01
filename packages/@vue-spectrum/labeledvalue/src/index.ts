import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import {CalendarDate, CalendarDateTime, getLocalTimeZone, Time, toCalendarDateTime, today, ZonedDateTime} from '@internationalized/date';
import {Field} from '@vue-spectrum/label';
import {useDateFormatter, useListFormatter, useNumberFormatter} from '@vue-aria/i18n';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {computed, defineComponent, h, isVNode, onMounted, ref, type PropType, type VNode, type VNodeChild} from 'vue';
const styles: {[key: string]: string} = {};

type DateTime = Date | CalendarDate | CalendarDateTime | ZonedDateTime | Time;
type RangeValue<T> = {start: T, end: T};
type SpectrumLabeledValueData = string[] | string | DateTime | number | RangeValue<number> | RangeValue<DateTime> | VNode;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRangeValue(value: unknown): value is RangeValue<unknown> {
  return isObject(value) && 'start' in value && 'end' in value;
}

function isDateTime(value: unknown): value is DateTime {
  if (value instanceof Date) {
    return true;
  }

  if (!isObject(value)) {
    return false;
  }

  return 'calendar' in value || 'hour' in value || 'timeZone' in value;
}

function toDate(value: DateTime, timeZone: string): Date {
  if (value instanceof Date) {
    return value;
  }

  if ('timeZone' in value) {
    return value.toDate();
  }

  if ('calendar' in value) {
    return value.toDate(timeZone);
  }

  return toCalendarDateTime(today(getLocalTimeZone()), value).toDate(timeZone);
}

function defaultFormatOptions(value: DateTime): Intl.DateTimeFormatOptions {
  if (value instanceof Date) {
    return {dateStyle: 'long', timeStyle: 'short'};
  }

  if ('timeZone' in value) {
    return {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: value.timeZone, timeZoneName: 'short'};
  }

  if ('hour' in value && 'year' in value) {
    return {dateStyle: 'long', timeStyle: 'short'};
  }

  if ('hour' in value) {
    return {timeStyle: 'short'};
  }

  return {dateStyle: 'long'};
}

function toDimensionValue(value: string | number | null | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (!value) {
    return undefined;
  }

  return String(value);
}

export const LabeledValue = defineComponent({
  name: 'VueSpectrumLabeledValue',
  inheritAttrs: false,
  props: {
    contextualHelp: {
      type: [String, Number, Object] as PropType<unknown>,
      default: undefined
    },
    formatOptions: {
      type: Object as PropType<Intl.DateTimeFormatOptions | Intl.NumberFormatOptions | Intl.ListFormatOptions | undefined>,
      default: undefined
    },
    label: {
      type: [String, Number, Object] as PropType<unknown>,
      default: ''
    },
    labelAlign: {
      type: String as PropType<'start' | 'end' | null | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<'top' | 'side' | null | undefined>,
      default: 'top'
    },
    value: {
      type: [String, Number, Object, Array, Date] as PropType<SpectrumLabeledValueData>,
      default: ''
    },
    width: {
      type: [String, Number] as PropType<string | number | null | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let rootRef = ref<HTMLElement | {$el?: Element | null} | null>(null);

    onMounted(() => {
      let rootElement = rootRef.value instanceof HTMLElement
        ? rootRef.value
        : rootRef.value && '$el' in rootRef.value && rootRef.value.$el instanceof HTMLElement
          ? rootRef.value.$el
          : null;

      if (rootElement?.querySelector('input, [contenteditable], textarea')) {
        throw new Error('LabeledValue cannot contain an editable value.');
      }
    });

    let listFormatter = computed(() => useListFormatter(props.formatOptions as Intl.ListFormatOptions | undefined));
    let numberFormatter = computed(() => useNumberFormatter(props.formatOptions as Intl.NumberFormatOptions | undefined));

    let formattedValue = computed(() => {
      let value = props.value as SpectrumLabeledValueData;
      let content: VNodeChild = '';

      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        content = listFormatter.value.format(value);
      }

      if (isRangeValue(value) && typeof value.start === 'number' && typeof value.end === 'number') {
        let formatter = numberFormatter.value;
        let withRange = formatter as Intl.NumberFormat & {formatRange?: (start: number, end: number) => string};
        if (typeof withRange.formatRange === 'function') {
          content = withRange.formatRange(value.start, value.end);
        } else {
          content = `${formatter.format(value.start)} \u2013 ${formatter.format(value.end)}`;
        }
      }

      if (typeof value === 'number') {
        content = numberFormatter.value.format(value);
      }

      if (isRangeValue(value) && isDateTime(value.start) && isDateTime(value.end)) {
        let options = props.formatOptions as Intl.DateTimeFormatOptions | undefined;
        let resolvedOptions = options ?? defaultFormatOptions(value.start);
        let formatter = useDateFormatter(resolvedOptions);
        let timeZone = new Intl.DateTimeFormat(undefined, resolvedOptions).resolvedOptions().timeZone || getLocalTimeZone();
        let start = toDate(value.start, timeZone);
        let end = toDate(value.end, timeZone);
        if (typeof formatter.formatRange === 'function') {
          content = formatter.formatRange(start, end);
        } else {
          content = `${formatter.format(start)} \u2013 ${formatter.format(end)}`;
        }
      }

      if (isDateTime(value)) {
        let options = props.formatOptions as Intl.DateTimeFormatOptions | undefined;
        let resolvedOptions = options ?? defaultFormatOptions(value);
        let formatter = useDateFormatter(resolvedOptions);
        let timeZone = new Intl.DateTimeFormat(undefined, resolvedOptions).resolvedOptions().timeZone || getLocalTimeZone();
        content = formatter.format(toDate(value, timeZone));
      }

      if (typeof value === 'string') {
        content = value;
      }

      if (isVNode(value)) {
        content = value;
      }

      return content;
    });

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;
      let width = toDimensionValue(props.width);
      let valueContent = slots.default
        ? slots.default()
        : isVNode(formattedValue.value)
          ? [formattedValue.value]
          : formattedValue.value;

      return h(Field, {
        ref: rootRef,
        label: slots.label ? undefined : props.label,
        labelAlign: props.labelAlign ?? undefined,
        labelPosition: props.labelPosition === null ? undefined : props.labelPosition ?? undefined,
        contextualHelp: slots.contextualHelp ? undefined : props.contextualHelp,
        elementType: 'span',
        wrapperClassName: classNames(styles, 'spectrum-LabeledValue'),
        wrapperProps: {
          ...restDomProps,
          class: [domClassName, domClass],
          style: [domStyle, width ? {width} : undefined]
        }
      }, {
        default: () => [
          h('span', valueContent as never)
        ],
        label: slots.label,
        contextualHelp: slots.contextualHelp
      });
    };
  }
});

export const VueLabeledValue = LabeledValue;
export type SpectrumLabeledValueProps = InstanceType<typeof LabeledValue>['$props'];
