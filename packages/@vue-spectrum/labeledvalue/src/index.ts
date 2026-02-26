import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import {CalendarDate, CalendarDateTime, getLocalTimeZone, Time, toCalendarDateTime, today, ZonedDateTime} from '@internationalized/date';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {computed, defineComponent, h, isVNode, onMounted, ref, type PropType, type VNode} from 'vue';
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
    let rootRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (rootRef.value?.querySelector('input, [contenteditable], textarea')) {
        throw new Error('LabeledValue cannot contain an editable value.');
      }
    });

    let formattedValue = computed(() => {
      let value = props.value as SpectrumLabeledValueData;

      if (isVNode(value)) {
        return value;
      }

      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        return new Intl.ListFormat(undefined, props.formatOptions as Intl.ListFormatOptions | undefined).format(value);
      }

      if (isRangeValue(value) && typeof value.start === 'number' && typeof value.end === 'number') {
        let formatter = new Intl.NumberFormat(undefined, props.formatOptions as Intl.NumberFormatOptions | undefined);
        let withRange = formatter as Intl.NumberFormat & {formatRange?: (start: number, end: number) => string};
        if (typeof withRange.formatRange === 'function') {
          return withRange.formatRange(value.start, value.end);
        }

        return `${formatter.format(value.start)} - ${formatter.format(value.end)}`;
      }

      if (typeof value === 'number') {
        return new Intl.NumberFormat(undefined, props.formatOptions as Intl.NumberFormatOptions | undefined).format(value);
      }

      if (isRangeValue(value) && isDateTime(value.start) && isDateTime(value.end)) {
        let options = props.formatOptions as Intl.DateTimeFormatOptions | undefined;
        let resolvedOptions = options ?? defaultFormatOptions(value.start);
        let formatter = new Intl.DateTimeFormat(undefined, resolvedOptions);
        let withRange = formatter as Intl.DateTimeFormat & {formatRange?: (start: Date, end: Date) => string};
        let timeZone = formatter.resolvedOptions().timeZone || getLocalTimeZone();
        let start = toDate(value.start, timeZone);
        let end = toDate(value.end, timeZone);
        if (typeof withRange.formatRange === 'function') {
          return withRange.formatRange(start, end);
        }

        return `${formatter.format(start)} - ${formatter.format(end)}`;
      }

      if (isDateTime(value)) {
        let options = props.formatOptions as Intl.DateTimeFormatOptions | undefined;
        let resolvedOptions = options ?? defaultFormatOptions(value);
        let formatter = new Intl.DateTimeFormat(undefined, resolvedOptions);
        let timeZone = formatter.resolvedOptions().timeZone || getLocalTimeZone();
        return formatter.format(toDate(value, timeZone));
      }

      return value;
    });

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;
      let width = toDimensionValue(props.width);
      let contextualHelp = slots.contextualHelp ? slots.contextualHelp() : props.contextualHelp;
      let valueContent = slots.default
        ? slots.default()
        : isVNode(formattedValue.value)
          ? [formattedValue.value]
          : formattedValue.value;

      return h('div', {
        ...restDomProps,
        ref: rootRef,
        class: [
          classNames(
            styles,
            'spectrum-Field',
            'spectrum-LabeledValue',
            {
              'spectrum-Field--alignEnd': props.labelAlign === 'end',
              'spectrum-Field--hasContextualHelp': !!contextualHelp,
              'spectrum-Field--positionSide': props.labelPosition === 'side',
              'spectrum-Field--positionTop': props.labelPosition !== 'side'
            }
          ),
          domClassName,
          domClass
        ],
        style: [
          domStyle,
          width ? {width} : undefined
        ]
      }, [
        h('span', {class: classNames(styles, 'spectrum-FieldLabel')}, slots.label ? slots.label() : props.label as never),
        contextualHelp
          ? h('span', {class: classNames(styles, 'spectrum-Field-contextualHelp')}, contextualHelp as never)
          : null,
        h('span', {class: classNames(styles, 'spectrum-Field-field')}, valueContent as never)
      ]);
    };
  }
});

export const VueLabeledValue = LabeledValue;
export type SpectrumLabeledValueProps = InstanceType<typeof LabeledValue>['$props'];
