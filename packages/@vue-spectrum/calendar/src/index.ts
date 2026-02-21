import '@adobe/spectrum-css-temp/components/calendar/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
const styles: {[key: string]: string} = {};


type FirstDayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

type DateRangeValue = {
  end: string,
  start: string
};

type MonthRenderOptions = {
  disabled: boolean,
  firstDayIndex: number,
  focusedKey: string | null,
  hoveredKey: string | null,
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
  let formatter = new Intl.DateTimeFormat(undefined, {weekday: 'short'});
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
      let isDisabled = options.disabled || isOutsideMonth || !isWithinBounds;
      let isUnavailable = !isOutsideMonth && !isWithinBounds;
      let isSelected = options.isDateSelected(day);
      let isToday = isSameDay(day, new Date());

      let isFocused = options.focusedKey === dayKey;
      let isHovered = options.hoveredKey === dayKey && !isDisabled;
      let isPressed = options.pressedKey === dayKey && !isDisabled;
      let isSelectionStart = options.isSelectionStart(day);
      let isSelectionEnd = options.isSelectionEnd(day);
      let isRangeStart = options.isRangeStart(day);
      let isRangeEnd = options.isRangeEnd(day);
      let isInvalid = isSelected && !isWithinBounds;
      let tabIndex = isSelected && !isDisabled ? 0 : -1;

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
            options.onPress(null);
          },
          onClick: () => {
            if (isDisabled) {
              return;
            }

            options.onSelectDate(day);
          },
          onFocus: () => {
            if (isDisabled) {
              return;
            }

            options.onFocus(dayKey);
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
    label: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    visibleMonths: {
      type: Number,
      default: 1
    }
  },
  emits: {
    change: (value: string) => typeof value === 'string',
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let selectedDate = computed(() => parseDateValue(props.modelValue));
    let minDate = computed(() => parseDateValue(props.min));
    let maxDate = computed(() => parseDateValue(props.max));

    let visibleMonthStart = ref(startOfMonth(selectedDate.value ?? new Date()));
    watch(() => props.modelValue, (nextValue) => {
      let parsed = parseDateValue(nextValue);
      if (parsed) {
        visibleMonthStart.value = startOfMonth(parsed);
      }
    });

    let firstDayIndex = computed(() => firstDayIndexByCode[props.firstDayOfWeek] ?? firstDayIndexByCode.sun);
    let visibleMonths = computed(() => Math.max(1, props.visibleMonths));
    let monthStarts = computed(() => [...new Array(visibleMonths.value).keys()].map((offset) => addMonths(visibleMonthStart.value, offset)));
    let weekDayLabels = computed(() => getWeekdayLabels(firstDayIndex.value));

    let hoveredKey = ref<string | null>(null);
    let pressedKey = ref<string | null>(null);
    let focusedKey = ref<string | null>(null);

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

      return !isDateWithinBounds(selectedDate.value, minDate.value, maxDate.value);
    });

    let selectDate = (date: Date) => {
      let value = formatDateValue(date);
      emit('update:modelValue', value);
      emit('change', value);
    };

    let emitInputValue = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let value = target?.value ?? '';
      emit('update:modelValue', value);
      emit('change', value);
    };

    return () => h('div', {
      ...attrs,
      'aria-label': ariaLabel.value,
      class: [
        classNames(styles, 'spectrum-Calendar'),
        'vs-calendar',
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
          ? h('button', {
            'aria-label': 'Previous month',
            class: [classNames(styles, 'spectrum-Calendar-prevMonth'), 'vs-calendar__prev-month'],
            disabled: props.disabled,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, -1);
            },
            type: 'button'
          }, '\u2039')
          : null,
        h('h2', {
          'aria-hidden': 'true',
          class: classNames(styles, 'spectrum-Calendar-title')
        }, getMonthTitle(monthDate)),
        index === monthStarts.value.length - 1
          ? h('button', {
            'aria-label': 'Next month',
            class: [classNames(styles, 'spectrum-Calendar-nextMonth'), 'vs-calendar__next-month'],
            disabled: props.disabled,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, 1);
            },
            type: 'button'
          }, '\u203a')
          : null
      ]))),
      h('div', {class: classNames(styles, 'spectrum-Calendar-months')}, monthStarts.value.map((monthStartDate) => renderCalendarMonth({
        disabled: props.disabled,
        firstDayIndex: firstDayIndex.value,
        focusedKey: focusedKey.value,
        hoveredKey: hoveredKey.value,
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
          focusedKey.value = key;
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
        disabled: props.disabled,
        hidden: true,
        max: props.max || undefined,
        min: props.min || undefined,
        onInput: emitInputValue,
        tabindex: -1,
        type: 'date',
        value: props.modelValue
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
    ariaLabel: {
      type: String,
      default: ''
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
    label: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object as PropType<DateRangeValue>,
      default: () => ({
        end: '',
        start: ''
      })
    },
    visibleMonths: {
      type: Number,
      default: 1
    }
  },
  emits: {
    change: (value: DateRangeValue) => value != null && typeof value === 'object',
    'update:modelValue': (value: DateRangeValue) => value != null && typeof value === 'object'
  },
  setup(props, {attrs, emit}) {
    let startDate = computed(() => parseDateValue(props.modelValue.start));
    let endDate = computed(() => parseDateValue(props.modelValue.end));
    let minDate = computed(() => parseDateValue(props.min));
    let maxDate = computed(() => parseDateValue(props.max));

    let visibleMonthStart = ref(startOfMonth(startDate.value ?? new Date()));
    watch(() => props.modelValue.start, (nextStart) => {
      let parsed = parseDateValue(nextStart);
      if (parsed) {
        visibleMonthStart.value = startOfMonth(parsed);
      }
    });

    let firstDayIndex = computed(() => firstDayIndexByCode[props.firstDayOfWeek] ?? firstDayIndexByCode.sun);
    let visibleMonths = computed(() => Math.max(1, props.visibleMonths));
    let monthStarts = computed(() => [...new Array(visibleMonths.value).keys()].map((offset) => addMonths(visibleMonthStart.value, offset)));
    let weekDayLabels = computed(() => getWeekdayLabels(firstDayIndex.value));

    let hoveredKey = ref<string | null>(null);
    let pressedKey = ref<string | null>(null);
    let focusedKey = ref<string | null>(null);

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

    let isValueInvalid = computed(() => {
      let invalidStart = Boolean(startDate.value) && !isDateWithinBounds(startDate.value as Date, minDate.value, maxDate.value);
      let invalidEnd = Boolean(endDate.value) && !isDateWithinBounds(endDate.value as Date, minDate.value, maxDate.value);
      return invalidStart || invalidEnd;
    });

    let emitRange = (nextValue: DateRangeValue) => {
      emit('update:modelValue', nextValue);
      emit('change', nextValue);
    };

    let selectDate = (date: Date) => {
      let dateValue = formatDateValue(date);
      if (!startDate.value || (startDate.value && endDate.value)) {
        emitRange({
          end: '',
          start: dateValue
        });
        return;
      }

      if (date.getTime() < startDate.value.getTime()) {
        emitRange({
          end: formatDateValue(startDate.value),
          start: dateValue
        });
        return;
      }

      emitRange({
        end: dateValue,
        start: formatDateValue(startDate.value)
      });
    };

    let isFirstSelectedAfterUnavailable = (date: Date) => {
      let previous = addDays(date, -1);
      return !isDateWithinBounds(previous, minDate.value, maxDate.value);
    };

    let isLastSelectedBeforeUnavailable = (date: Date) => {
      let next = addDays(date, 1);
      return !isDateWithinBounds(next, minDate.value, maxDate.value);
    };

    let dayIndexFromFirstDay = (date: Date) => (date.getDay() - firstDayIndex.value + 7) % 7;

    return () => h('div', {
      ...attrs,
      'aria-label': ariaLabel.value,
      class: [
        classNames(styles, 'spectrum-Calendar'),
        'vs-range-calendar',
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
          ? h('button', {
            'aria-label': 'Previous month',
            class: [classNames(styles, 'spectrum-Calendar-prevMonth'), 'vs-range-calendar__prev-month'],
            disabled: props.disabled,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, -1);
            },
            type: 'button'
          }, '\u2039')
          : null,
        h('h2', {
          'aria-hidden': 'true',
          class: classNames(styles, 'spectrum-Calendar-title')
        }, getMonthTitle(monthDate)),
        index === monthStarts.value.length - 1
          ? h('button', {
            'aria-label': 'Next month',
            class: [classNames(styles, 'spectrum-Calendar-nextMonth'), 'vs-range-calendar__next-month'],
            disabled: props.disabled,
            onClick: () => {
              visibleMonthStart.value = addMonths(visibleMonthStart.value, 1);
            },
            type: 'button'
          }, '\u203a')
          : null
      ]))),
      h('div', {class: classNames(styles, 'spectrum-Calendar-months')}, monthStarts.value.map((monthStartDate) => renderCalendarMonth({
        disabled: props.disabled,
        firstDayIndex: firstDayIndex.value,
        focusedKey: focusedKey.value,
        hoveredKey: hoveredKey.value,
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
          disabled: props.disabled,
          hidden: true,
          max: props.max || undefined,
          min: props.min || undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            emitRange({
              end: props.modelValue.end,
              start: target?.value ?? ''
            });
          },
          tabindex: -1,
          type: 'date',
          value: props.modelValue.start
        }),
        h('input', {
          'aria-hidden': 'true',
          class: 'vs-range-calendar__input',
          disabled: props.disabled,
          hidden: true,
          max: props.max || undefined,
          min: props.min || undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            emitRange({
              end: target?.value ?? '',
              start: props.modelValue.start
            });
          },
          tabindex: -1,
          type: 'date',
          value: props.modelValue.end
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
