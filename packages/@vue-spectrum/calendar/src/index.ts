import '@adobe/spectrum-css-temp/components/calendar/vars.css';
import {ActionButton} from '@vue-spectrum/button';
import ChevronLeft from '@spectrum-icons-vue/workflow/ChevronLeft';
import ChevronRight from '@spectrum-icons-vue/workflow/ChevronRight';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
import {useProvider} from '@vue-spectrum/provider';
const styles: {[key: string]: string} = {};


type FirstDayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

type DateRangeValue = {
  end: string,
  start: string
};

type CalendarInputValue = Date | {
  day: number,
  month: number,
  toString?: () => string,
  year: number
} | string | undefined | null;

type RangeInputValue = {
  end?: CalendarInputValue,
  start?: CalendarInputValue
} | undefined | null;

type MonthRenderOptions = {
  disabled: boolean,
  firstDayIndex: number,
  focusVisibleKey: string | null,
  focusedKey: string | null,
  hoveredKey: string | null,
  isDateUnavailable: (date: Date) => boolean,
  isDateSelected: (date: Date) => boolean,
  isRangeEnd: (date: Date) => boolean,
  isRangeSelection: boolean,
  isRangeStart: (date: Date) => boolean,
  isSelectionEnd: (date: Date) => boolean,
  isSelectionStart: (date: Date) => boolean,
  maxDate: Date | null,
  minDate: Date | null,
  monthStart: Date,
  onFocus: (key: string | null) => void,
  onFocusVisible: (key: string | null) => void,
  onHover: (key: string | null) => void,
  onPress: (key: string | null) => void,
  onSelectDate: (date: Date) => void,
  pressedKey: string | null,
  weekDayLabels: string[]
};

let firstDayIndexByCode: Record<FirstDayOfWeek, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6
};

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateValue(date: Date): string {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function parseDateValue(value: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  let [year, month, day] = value.split('-').map((part) => Number(part));
  let parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (
    parsed.getFullYear() !== year
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function toDateString(value: CalendarInputValue): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    let match = value.match(/\d{4}-\d{2}-\d{2}/);
    return match?.[0] ?? '';
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : formatDateValue(value);
  }

  if (typeof value === 'object') {
    if (
      typeof value.year === 'number'
      && typeof value.month === 'number'
      && typeof value.day === 'number'
    ) {
      return `${value.year}-${padDatePart(value.month)}-${padDatePart(value.day)}`;
    }

    if (typeof value.toString === 'function') {
      let stringValue = value.toString();
      let match = stringValue.match(/\d{4}-\d{2}-\d{2}/);
      return match?.[0] ?? '';
    }
  }

  return '';
}

function normalizeDateRangeValue(value: RangeInputValue): DateRangeValue {
  return {
    start: toDateString(value?.start),
    end: toDateString(value?.end)
  };
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  let next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameDay(left: Date | null, right: Date | null): boolean {
  if (!left || !right) {
    return false;
  }

  return (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
  );
}

function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function isDateWithinBounds(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  let timestamp = date.getTime();
  if (minDate && timestamp < minDate.getTime()) {
    return false;
  }

  if (maxDate && timestamp > maxDate.getTime()) {
    return false;
  }

  return true;
}

function buildMonthMatrix(monthStart: Date, firstDayIndex: number): Date[][] {
  let firstOfMonth = startOfMonth(monthStart);
  let firstDay = firstOfMonth.getDay();
  let offset = (firstDay - firstDayIndex + 7) % 7;
  let current = addDays(firstOfMonth, -offset);

  let weeks: Date[][] = [];
  for (let week = 0; week < 6; week++) {
    let days: Date[] = [];
    for (let day = 0; day < 7; day++) {
      days.push(current);
      current = addDays(current, 1);
    }
    weeks.push(days);
  }

  return weeks;
}

function getWeekdayLabels(firstDayIndex: number): string[] {
  let formatter = new Intl.DateTimeFormat(undefined, {weekday: 'narrow'});
  let base = new Date(2024, 0, 7);

  return [...new Array(7).keys()].map((offset) => {
    let day = addDays(base, firstDayIndex + offset);
    return formatter.format(day);
  });
}

function getMonthTitle(date: Date): string {
  let formatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric'
  });
  return formatter.format(date);
}

function dateKeyFormatter(date: Date): string {
  return formatDateValue(date);
}

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) {
    return false;
  }

  let timestamp = date.getTime();
  let startTimestamp = start.getTime();
  let endTimestamp = end.getTime();

  return timestamp >= startTimestamp && timestamp <= endTimestamp;
}

function renderCalendarMonth(options: MonthRenderOptions) {
  let cellDateFormatter = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric'
  });

  let monthMatrix = buildMonthMatrix(options.monthStart, options.firstDayIndex);

  return h('table', {
    class: classNames(styles, 'spectrum-Calendar-body', 'spectrum-Calendar-table')
  }, [
    h('thead', [
      h('tr', options.weekDayLabels.map((dayLabel) => h('th', {
        class: classNames(styles, 'spectrum-Calendar-tableCell')
      }, [
        h('span', {class: classNames(styles, 'spectrum-Calendar-dayOfWeek')}, dayLabel)
      ])))
    ]),
    h('tbody', monthMatrix.map((week, weekIndex) => h('tr', {key: weekIndex}, week.map((day, dayIndex) => {
      let dayKey = dateKeyFormatter(day);
      let isOutsideMonth = !isSameMonth(day, options.monthStart);
      let isWithinBounds = isDateWithinBounds(day, options.minDate, options.maxDate);
      let isCustomUnavailable = !isOutsideMonth && options.isDateUnavailable(day);
      let isUnavailable = !isOutsideMonth && (!isWithinBounds || isCustomUnavailable);
      let isDisabled = options.disabled || isOutsideMonth || isUnavailable;
      let isSelected = options.isDateSelected(day);
      let isToday = isSameDay(day, new Date());

      let isFocused = options.focusVisibleKey === dayKey;
      let isHovered = options.hoveredKey === dayKey && !isDisabled;
      let isPressed = options.pressedKey === dayKey && !isDisabled;
      let isSelectionStart = options.isSelectionStart(day);
      let isSelectionEnd = options.isSelectionEnd(day);
      let isRangeStart = options.isRangeStart(day);
      let isRangeEnd = options.isRangeEnd(day);
      let isInvalid = isSelected && !isWithinBounds;
      let tabIndex = isDisabled
        ? -1
        : options.focusedKey
          ? (options.focusedKey === dayKey ? 0 : -1)
          : (isSelected ? 0 : -1);

      return h('td', {
        class: classNames(styles, 'spectrum-Calendar-tableCell'),
        key: `${weekIndex}-${dayIndex}`
      }, [
        h('span', {
          'aria-disabled': isDisabled ? 'true' : undefined,
          'aria-label': cellDateFormatter.format(day),
          'aria-selected': isSelected ? 'true' : 'false',
          class: classNames(styles, 'spectrum-Calendar-date', {
            'is-disabled': isDisabled,
            'is-focused': isFocused,
            'is-hovered': isHovered,
            'is-invalid': isInvalid,
            'is-outsideMonth': isOutsideMonth,
            'is-pressed': isPressed,
            'is-range-end': isRangeEnd,
            'is-range-selection': isSelected && options.isRangeSelection,
            'is-range-start': isRangeStart,
            'is-selected': isSelected,
            'is-selection-end': isSelectionEnd,
            'is-selection-start': isSelectionStart,
            'is-today': isToday,
            'is-unavailable': isUnavailable
          }),
          role: 'button',
          tabindex: tabIndex,
          onBlur: () => {
            options.onFocus(null);
            options.onFocusVisible(null);
            options.onPress(null);
          },
          onClick: () => {
            if (isDisabled) {
              return;
            }

            options.onSelectDate(day);
          },
          onFocus: (event: FocusEvent) => {
            if (isDisabled) {
              return;
            }

            options.onFocus(dayKey);
            let target = event.currentTarget as HTMLElement | null;
            options.onFocusVisible(target?.matches(':focus-visible') ? dayKey : null);
          },
          onKeydown: (event: KeyboardEvent) => {
            if (isDisabled) {
              return;
            }

            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
              event.preventDefault();
              options.onPress(dayKey);
            }
          },
          onKeyup: (event: KeyboardEvent) => {
            if (isDisabled) {
              return;
            }

            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
              event.preventDefault();
              options.onPress(null);
              options.onSelectDate(day);
            }
          },
          onMousedown: () => {
            if (isDisabled) {
              return;
            }

            options.onFocusVisible(null);
            options.onPress(dayKey);
          },
          onMouseenter: () => {
            if (isDisabled) {
              return;
            }

            options.onHover(dayKey);
          },
          onMouseleave: () => {
            options.onHover(null);
            options.onPress(null);
          },
          onMouseup: () => {
            options.onPress(null);
          }
        }, [
          h('span', {class: classNames(styles, 'spectrum-Calendar-dateText')}, [
            h('span', day.getDate())
          ])
        ])
      ]);
    }))))
  ]);
}

export const VueCalendar = defineComponent({
  name: 'VueCalendar',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    defaultFocusedValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    defaultValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    firstDayOfWeek: {
      type: String as PropType<FirstDayOfWeek>,
      default: 'sun'
    },
    focusedValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    isDateUnavailable: {
      type: Function as PropType<(date: Date) => boolean>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    maxValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    min: {
      type: String,
      default: ''
    },
    minValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    modelValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
      default: undefined
    },
    onFocusChange: {
      type: Function as PropType<(value: string | null) => void>,
      default: undefined
    },
    value: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    visibleMonths: {
      type: Number,
      default: 1
    }
  },
  emits: {
    change: (value: string) => typeof value === 'string',
    focusChange: (value: string | null) => value == null || typeof value === 'string',
    'update:value': (value: string) => typeof value === 'string',
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let isControlled = computed(() => props.value !== undefined || props.modelValue !== undefined);
    let controlledValue = computed(() => toDateString(props.value ?? props.modelValue));
    let uncontrolledValue = ref(toDateString(props.defaultValue));

    watch(controlledValue, (nextValue) => {
      if (isControlled.value) {
        uncontrolledValue.value = nextValue;
      }
    }, {immediate: true});

    let selectedValue = computed(() => isControlled.value ? controlledValue.value : uncontrolledValue.value);
    let selectedDate = computed(() => parseDateValue(selectedValue.value));

    let minValue = computed(() => toDateString(props.minValue) || toDateString(props.min));
    let maxValue = computed(() => toDateString(props.maxValue) || toDateString(props.max));
    let minDate = computed(() => parseDateValue(minValue.value));
    let maxDate = computed(() => parseDateValue(maxValue.value));

    let firstDayIndex = computed(() => firstDayIndexByCode[props.firstDayOfWeek] ?? firstDayIndexByCode.sun);
    let visibleMonths = computed(() => Math.max(1, props.visibleMonths));
    let initialVisibleDate = (
      parseDateValue(toDateString(props.focusedValue))
      ?? parseDateValue(toDateString(props.defaultFocusedValue))
      ?? selectedDate.value
      ?? new Date()
    );
    let visibleMonthStart = ref(startOfMonth(initialVisibleDate));
    let monthStarts = computed(() => [...new Array(visibleMonths.value).keys()].map((offset) => addMonths(visibleMonthStart.value, offset)));
    let weekDayLabels = computed(() => getWeekdayLabels(firstDayIndex.value));

    let hoveredKey = ref<string | null>(null);
    let pressedKey = ref<string | null>(null);
    let focusedKey = ref<string | null>(toDateString(props.focusedValue) || toDateString(props.defaultFocusedValue) || null);
    let focusVisibleKey = ref<string | null>(null);

    let controlledFocusedValue = computed(() => toDateString(props.focusedValue));
    watch(controlledFocusedValue, (nextValue) => {
      if (nextValue) {
        focusedKey.value = nextValue;
      }
    }, {immediate: true});

    watch(selectedValue, (nextValue) => {
      let parsed = parseDateValue(nextValue);
      if (parsed) {
        visibleMonthStart.value = startOfMonth(parsed);
      }
    }, {immediate: true});

    watch(focusedKey, (nextValue) => {
      let parsed = parseDateValue(nextValue ?? '');
      if (parsed) {
        visibleMonthStart.value = startOfMonth(parsed);
      }
    });

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);

    let ariaLabel = computed(() => {
      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      if (props.ariaLabel) {
        return props.ariaLabel;
      }

      if (props.label) {
        return props.label;
      }

      return 'Calendar';
    });

    let isValueInvalid = computed(() => {
      if (!selectedDate.value) {
        return false;
      }

      if (!isDateWithinBounds(selectedDate.value, minDate.value, maxDate.value)) {
        return true;
      }

      return props.isDateUnavailable?.(selectedDate.value) ?? false;
    });

    let emitValue = (value: string) => {
      if (!isControlled.value) {
        uncontrolledValue.value = value;
      }

      emit('update:modelValue', value);
      emit('update:value', value);
      emit('change', value);
      props.onChange?.(value);
    };

    let setFocusedKey = (key: string | null) => {
      focusedKey.value = key;
      emit('focusChange', key);
      props.onFocusChange?.(key);
    };

    let selectDate = (date: Date) => {
      let value = formatDateValue(date);
      emitValue(value);
      setFocusedKey(value);
    };

    let emitInputValue = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      emitValue(target?.value ?? '');
    };

    let provider = useProvider();
    let isRtl = computed(() => provider.dir === 'rtl');

    return () => h('div', {
      ...attrs,
      'aria-label': ariaLabel.value,
      role: 'application',
      class: [
        classNames(styles, 'spectrum-Calendar'),
        attrs.class
      ],
      'data-vac': ''
    }, [
      props.label
        ? h('span', {class: 'vs-calendar__label'}, props.label)
        : null,
      h('h2', {hidden: true}, ariaLabel.value),
      h('div', {class: classNames(styles, 'spectrum-Calendar-header')}, monthStarts.value.map((monthDate, index) => h('div', {
        class: classNames(styles, 'spectrum-Calendar-monthHeader'),
        key: formatDateValue(monthDate)
      }, [
        index === 0
          ? h(ActionButton, {
            'aria-label': 'Previous month',
            class: classNames(styles, 'spectrum-Calendar-prevMonth'),
            isDisabled: isDisabled.value,
            isQuiet: true,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, -1);
            }
          }, {
            default: () => isRtl.value
              ? h(ChevronRight, {'aria-hidden': 'true'})
              : h(ChevronLeft, {'aria-hidden': 'true'})
          })
          : null,
        h('h2', {
          'aria-hidden': 'true',
          class: classNames(styles, 'spectrum-Calendar-title')
        }, getMonthTitle(monthDate)),
        index === monthStarts.value.length - 1
          ? h(ActionButton, {
            'aria-label': 'Next month',
            class: classNames(styles, 'spectrum-Calendar-nextMonth'),
            isDisabled: isDisabled.value,
            isQuiet: true,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, 1);
            }
          }, {
            default: () => isRtl.value
              ? h(ChevronLeft, {'aria-hidden': 'true'})
              : h(ChevronRight, {'aria-hidden': 'true'})
          })
          : null
      ]))),
      h('div', {class: classNames(styles, 'spectrum-Calendar-months')}, monthStarts.value.map((monthStartDate) => renderCalendarMonth({
        disabled: isDisabled.value,
        firstDayIndex: firstDayIndex.value,
        focusVisibleKey: focusVisibleKey.value,
        focusedKey: focusedKey.value,
        hoveredKey: hoveredKey.value,
        isDateUnavailable: (date) => props.isDateUnavailable?.(date) ?? false,
        isDateSelected: (date) => isSameDay(date, selectedDate.value),
        isRangeEnd: () => false,
        isRangeSelection: false,
        isRangeStart: () => false,
        isSelectionEnd: () => false,
        isSelectionStart: () => false,
        maxDate: maxDate.value,
        minDate: minDate.value,
        monthStart: monthStartDate,
        onFocus: (key) => {
          setFocusedKey(key);
        },
        onFocusVisible: (key) => {
          focusVisibleKey.value = key;
        },
        onHover: (key) => {
          hoveredKey.value = key;
        },
        onPress: (key) => {
          pressedKey.value = key;
        },
        onSelectDate: selectDate,
        pressedKey: pressedKey.value,
        weekDayLabels: weekDayLabels.value
      }))),
      h('input', {
        'aria-hidden': 'true',
        class: 'vs-calendar__input',
        disabled: isDisabled.value,
        hidden: true,
        max: maxValue.value || undefined,
        min: minValue.value || undefined,
        onInput: emitInputValue,
        tabindex: -1,
        type: 'date',
        value: selectedValue.value
      }),
      isValueInvalid.value
        ? h('p', {class: 'spectrum-Calendar-helpText'}, props.errorMessage || 'Invalid selection')
        : null
    ]);
  }
});

export const VueRangeCalendar = defineComponent({
  name: 'VueRangeCalendar',
  inheritAttrs: false,
  props: {
    allowsNonContiguousRanges: {
      type: Boolean,
      default: false
    },
    ariaLabel: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: Object as PropType<RangeInputValue>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    firstDayOfWeek: {
      type: String as PropType<FirstDayOfWeek>,
      default: 'sun'
    },
    isDateUnavailable: {
      type: Function as PropType<(date: Date) => boolean>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    maxValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    min: {
      type: String,
      default: ''
    },
    minValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    modelValue: {
      type: Object as PropType<RangeInputValue>,
      default: undefined
    },
    onChange: {
      type: Function as PropType<(value: DateRangeValue) => void>,
      default: undefined
    },
    value: {
      type: Object as PropType<RangeInputValue>,
      default: undefined
    },
    visibleMonths: {
      type: Number,
      default: 1
    }
  },
  emits: {
    change: (value: DateRangeValue) => value != null && typeof value === 'object',
    'update:value': (value: DateRangeValue) => value != null && typeof value === 'object',
    'update:modelValue': (value: DateRangeValue) => value != null && typeof value === 'object'
  },
  setup(props, {attrs, emit}) {
    let isControlled = computed(() => props.value !== undefined || props.modelValue !== undefined);
    let controlledRange = computed(() => normalizeDateRangeValue(props.value ?? props.modelValue));
    let uncontrolledRange = ref(normalizeDateRangeValue(props.defaultValue));

    watch(controlledRange, (nextRange) => {
      if (isControlled.value) {
        uncontrolledRange.value = nextRange;
      }
    }, {immediate: true});

    let selectedRange = computed(() => isControlled.value ? controlledRange.value : uncontrolledRange.value);
    let startDate = computed(() => parseDateValue(selectedRange.value.start));
    let endDate = computed(() => parseDateValue(selectedRange.value.end));

    let minValue = computed(() => toDateString(props.minValue) || toDateString(props.min));
    let maxValue = computed(() => toDateString(props.maxValue) || toDateString(props.max));
    let minDate = computed(() => parseDateValue(minValue.value));
    let maxDate = computed(() => parseDateValue(maxValue.value));

    let visibleMonthStart = ref(startOfMonth(startDate.value ?? new Date()));
    watch(() => selectedRange.value.start, (nextStart) => {
      let parsed = parseDateValue(nextStart);
      if (parsed) {
        visibleMonthStart.value = startOfMonth(parsed);
      }
    }, {immediate: true});

    let firstDayIndex = computed(() => firstDayIndexByCode[props.firstDayOfWeek] ?? firstDayIndexByCode.sun);
    let visibleMonths = computed(() => Math.max(1, props.visibleMonths));
    let monthStarts = computed(() => [...new Array(visibleMonths.value).keys()].map((offset) => addMonths(visibleMonthStart.value, offset)));
    let weekDayLabels = computed(() => getWeekdayLabels(firstDayIndex.value));

    let hoveredKey = ref<string | null>(null);
    let pressedKey = ref<string | null>(null);
    let focusedKey = ref<string | null>(selectedRange.value.start || null);
    let focusVisibleKey = ref<string | null>(null);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);

    let ariaLabel = computed(() => {
      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      if (props.ariaLabel) {
        return props.ariaLabel;
      }

      if (props.label) {
        return props.label;
      }

      return 'Range calendar';
    });

    let isUnavailable = (date: Date): boolean => {
      if (!isDateWithinBounds(date, minDate.value, maxDate.value)) {
        return true;
      }

      return props.isDateUnavailable?.(date) ?? false;
    };

    let isValueInvalid = computed(() => {
      let invalidStart = Boolean(startDate.value) && isUnavailable(startDate.value as Date);
      let invalidEnd = Boolean(endDate.value) && isUnavailable(endDate.value as Date);
      return invalidStart || invalidEnd;
    });

    let emitRange = (nextValue: DateRangeValue) => {
      if (!isControlled.value) {
        uncontrolledRange.value = nextValue;
      }

      emit('update:modelValue', nextValue);
      emit('update:value', nextValue);
      emit('change', nextValue);
      props.onChange?.(nextValue);
    };

    let selectDate = (date: Date) => {
      if (isUnavailable(date)) {
        return;
      }

      let dateValue = formatDateValue(date);
      if (!startDate.value || (startDate.value && endDate.value)) {
        emitRange({
          end: '',
          start: dateValue
        });
        focusedKey.value = dateValue;
        return;
      }

      if (date.getTime() < startDate.value.getTime()) {
        emitRange({
          end: formatDateValue(startDate.value),
          start: dateValue
        });
        focusedKey.value = dateValue;
        return;
      }

      emitRange({
        end: dateValue,
        start: formatDateValue(startDate.value)
      });
      focusedKey.value = dateValue;
    };

    let isFirstSelectedAfterUnavailable = (date: Date) => {
      let previous = addDays(date, -1);
      return isUnavailable(previous);
    };

    let isLastSelectedBeforeUnavailable = (date: Date) => {
      let next = addDays(date, 1);
      return isUnavailable(next);
    };

    let dayIndexFromFirstDay = (date: Date) => (date.getDay() - firstDayIndex.value + 7) % 7;
    let provider = useProvider();
    let isRtl = computed(() => provider.dir === 'rtl');

    return () => h('div', {
      ...attrs,
      'aria-label': ariaLabel.value,
      role: 'application',
      class: [
        classNames(styles, 'spectrum-Calendar'),
        attrs.class
      ],
      'data-vac': ''
    }, [
      props.label
        ? h('span', {class: 'vs-range-calendar__label'}, props.label)
        : null,
      h('h2', {hidden: true}, ariaLabel.value),
      h('div', {class: classNames(styles, 'spectrum-Calendar-header')}, monthStarts.value.map((monthDate, index) => h('div', {
        class: classNames(styles, 'spectrum-Calendar-monthHeader'),
        key: formatDateValue(monthDate)
      }, [
        index === 0
          ? h(ActionButton, {
            'aria-label': 'Previous month',
            class: classNames(styles, 'spectrum-Calendar-prevMonth'),
            isDisabled: isDisabled.value,
            isQuiet: true,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, -1);
            }
          }, {
            default: () => isRtl.value
              ? h(ChevronRight, {'aria-hidden': 'true'})
              : h(ChevronLeft, {'aria-hidden': 'true'})
          })
          : null,
        h('h2', {
          'aria-hidden': 'true',
          class: classNames(styles, 'spectrum-Calendar-title')
        }, getMonthTitle(monthDate)),
        index === monthStarts.value.length - 1
          ? h(ActionButton, {
            'aria-label': 'Next month',
            class: classNames(styles, 'spectrum-Calendar-nextMonth'),
            isDisabled: isDisabled.value,
            isQuiet: true,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, 1);
            }
          }, {
            default: () => isRtl.value
              ? h(ChevronLeft, {'aria-hidden': 'true'})
              : h(ChevronRight, {'aria-hidden': 'true'})
          })
          : null
      ]))),
      h('div', {class: classNames(styles, 'spectrum-Calendar-months')}, monthStarts.value.map((monthStartDate) => renderCalendarMonth({
        disabled: isDisabled.value,
        firstDayIndex: firstDayIndex.value,
        focusVisibleKey: focusVisibleKey.value,
        focusedKey: focusedKey.value,
        hoveredKey: hoveredKey.value,
        isDateUnavailable: (date) => props.isDateUnavailable?.(date) ?? false,
        isDateSelected: (date) => {
          if (!startDate.value) {
            return false;
          }

          if (!endDate.value) {
            return isSameDay(date, startDate.value);
          }

          return isDateInRange(date, startDate.value, endDate.value);
        },
        isRangeEnd: (date) => {
          if (!startDate.value) {
            return false;
          }

          if (endDate.value && !isDateInRange(date, startDate.value, endDate.value)) {
            return false;
          }

          let selected = endDate.value ? isDateInRange(date, startDate.value, endDate.value) : isSameDay(date, startDate.value);
          if (!selected) {
            return false;
          }

          return dayIndexFromFirstDay(date) === 6 || date.getDate() === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() || isLastSelectedBeforeUnavailable(date);
        },
        isRangeSelection: Boolean(startDate.value && endDate.value),
        isRangeStart: (date) => {
          if (!startDate.value) {
            return false;
          }

          if (endDate.value && !isDateInRange(date, startDate.value, endDate.value)) {
            return false;
          }

          let selected = endDate.value ? isDateInRange(date, startDate.value, endDate.value) : isSameDay(date, startDate.value);
          if (!selected) {
            return false;
          }

          return dayIndexFromFirstDay(date) === 0 || date.getDate() === 1 || isFirstSelectedAfterUnavailable(date);
        },
        isSelectionEnd: (date) => isSameDay(date, endDate.value),
        isSelectionStart: (date) => isSameDay(date, startDate.value),
        maxDate: maxDate.value,
        minDate: minDate.value,
        monthStart: monthStartDate,
        onFocus: (key) => {
          focusedKey.value = key;
        },
        onFocusVisible: (key) => {
          focusVisibleKey.value = key;
        },
        onHover: (key) => {
          hoveredKey.value = key;
        },
        onPress: (key) => {
          pressedKey.value = key;
        },
        onSelectDate: selectDate,
        pressedKey: pressedKey.value,
        weekDayLabels: weekDayLabels.value
      }))),
      h('div', {class: 'vs-range-calendar__compat-inputs', hidden: true}, [
        h('input', {
          'aria-hidden': 'true',
          class: 'vs-range-calendar__input',
          disabled: isDisabled.value,
          hidden: true,
          max: maxValue.value || undefined,
          min: minValue.value || undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            emitRange({
              end: selectedRange.value.end,
              start: target?.value ?? ''
            });
          },
          tabindex: -1,
          type: 'date',
          value: selectedRange.value.start
        }),
        h('input', {
          'aria-hidden': 'true',
          class: 'vs-range-calendar__input',
          disabled: isDisabled.value,
          hidden: true,
          max: maxValue.value || undefined,
          min: minValue.value || undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            emitRange({
              end: target?.value ?? '',
              start: selectedRange.value.start
            });
          },
          tabindex: -1,
          type: 'date',
          value: selectedRange.value.end
        })
      ]),
      isValueInvalid.value
        ? h('p', {class: 'spectrum-Calendar-helpText'}, props.errorMessage || 'Invalid selection')
        : null
    ]);
  }
});

export const Calendar = VueCalendar;
export const RangeCalendar = VueRangeCalendar;

export type {SpectrumCalendarProps, SpectrumRangeCalendarProps} from '@vue-types/calendar';
