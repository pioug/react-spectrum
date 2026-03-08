import '@adobe/spectrum-css-temp/components/calendar/vars.css';
import '@adobe/spectrum-css-temp/components/icon/vars.css';
import {ActionButton} from '@vue-spectrum/button';
import {
  type Calendar as IntlCalendar,
  CalendarDate,
  CalendarDateTime,
  createCalendar as createDefaultCalendar,
  endOfMonth,
  endOfWeek,
  fromDate,
  getDayOfWeek,
  getLocalTimeZone,
  getWeeksInMonth,
  GregorianCalendar,
  isEqualCalendar,
  isSameDay,
  isSameMonth,
  isToday,
  maxDate,
  minDate,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendar,
  toCalendarDate,
  today,
  type CalendarIdentifier,
  type DateDuration,
  ZonedDateTime
} from '@internationalized/date';
import {HelpText} from '@vue-spectrum/label';
import {LocalizedStringDictionary, LocalizedStringFormatter} from '@vue-aria/i18n';
import {useProvider, useProviderProps} from '@vue-spectrum/provider';
import {classNames, useId} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, type PropType, watch} from 'vue';

const styles: {[key: string]: string} = {};
const ariaIntlMessages = Object.fromEntries(
  Object.entries(import.meta.glob('../../../@react-aria/calendar/intl/*.json', {eager: true, import: 'default'})).map(([path, messages]) => {
    return [path.split('/').at(-1)?.replace('.json', '') ?? 'en-US', messages as Record<string, string>];
  })
) as Record<string, Record<string, string>>;

type FirstDayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
type PageBehavior = 'single' | 'visible';
type SelectionAlignment = 'start' | 'center' | 'end';
type CalendarDateValue = CalendarDate | CalendarDateTime | ZonedDateTime;
type CalendarDateParts = {
  day: number,
  month: number,
  toString?: () => string,
  year: number
};
type CalendarInputValue = CalendarDateValue | CalendarDateParts | Date | string | null | undefined;
type DateRangeValue = {
  end: CalendarInputValue,
  start: CalendarInputValue
};
type RangeInputValue = DateRangeValue | null | undefined;
type MutableDateDuration = {
  [key: string]: number | undefined
};
type CalendarMonthValue = CalendarDate;

type CalendarState = {
  focusedDate: CalendarDate,
  isCellDisabled: (date: CalendarDate) => boolean,
  isCellFocused: (date: CalendarDate) => boolean,
  isCellUnavailable: (date: CalendarDate) => boolean,
  isDisabled: boolean,
  isFocused: boolean,
  isNextVisibleRangeInvalid: () => boolean,
  isPreviousVisibleRangeInvalid: () => boolean,
  isReadOnly: boolean,
  isSelected: (date: CalendarDate) => boolean,
  isValueInvalid: boolean,
  maxValue: CalendarDateValue | null,
  minValue: CalendarDateValue | null,
  selectDate: (date: CalendarDate) => void,
  selectFocusedDate: () => void,
  setFocused: (value: boolean) => void,
  setFocusedDate: (date: CalendarDate) => void,
  timeZone: string,
  validationState: 'invalid' | null,
  value: CalendarDate | null,
  visibleRange: {
    end: CalendarDate,
    start: CalendarDate
  },
  focusNextDay: () => void,
  focusNextPage: () => void,
  focusNextRow: () => void,
  focusNextSection: (larger?: boolean) => void,
  focusPreviousDay: () => void,
  focusPreviousPage: () => void,
  focusPreviousRow: () => void,
  focusPreviousSection: (larger?: boolean) => void,
  focusSectionEnd: () => void,
  focusSectionStart: () => void,
  getDatesInWeek: (weekIndex: number, from?: CalendarDate) => Array<CalendarDate | null>,
  title: string
};

type RangeCalendarState = Omit<CalendarState, 'selectDate' | 'selectFocusedDate' | 'value'> & {
  anchorDate: CalendarDate | null,
  highlightedRange: {end: CalendarDate, start: CalendarDate} | null,
  isDragging: boolean,
  setAnchorDate: (date: CalendarDate | null) => void,
  setDragging: (isDragging: boolean) => void,
  highlightDate: (date: CalendarDate) => void,
  selectDate: (date: CalendarDate) => void,
  selectFocusedDate: () => void,
  value: DateRangeValue | null
};

type SharedCalendarProps = {
  'aria-label'?: string,
  'aria-labelledby'?: string,
  autoFocus?: boolean,
  createCalendar?: (identifier: CalendarIdentifier) => IntlCalendar,
  defaultFocusedValue?: CalendarInputValue,
  errorMessage?: string,
  firstDayOfWeek?: FirstDayOfWeek,
  focusedValue?: CalendarInputValue,
  isDateUnavailable?: (date: CalendarDateValue) => boolean,
  isDisabled?: boolean,
  isInvalid?: boolean,
  isReadOnly?: boolean,
  maxValue?: CalendarInputValue,
  minValue?: CalendarInputValue,
  pageBehavior?: PageBehavior,
  selectionAlignment?: SelectionAlignment,
  validationState?: 'invalid' | 'valid',
  visibleMonths?: number
};

type CalendarStore = {
  isFocused: {value: boolean},
  rawValue: {value: CalendarInputValue},
  uncontrolledFocusedDate: {value: CalendarDate},
  visibleRange: {value: {end: CalendarDate, start: CalendarDate}}
};

type RangeCalendarStore = {
  anchorDate: {value: CalendarDate | null},
  availableRange: {value: Partial<{end: CalendarDateValue, start: CalendarDateValue}> | null},
  isDragging: {value: boolean},
  isFocused: {value: boolean},
  rawValue: {value: RangeInputValue},
  uncontrolledFocusedDate: {value: CalendarDate},
  visibleRange: {value: {end: CalendarDate, start: CalendarDate}}
};

const CHEVRON_LEFT_LARGE_PATH = 'M9.605 13.843L3.55 8l6.056-5.84A1.248 1.248 0 1 0 7.876.363L.882 7.1a1.243 1.243 0 0 0 .003 1.797l6.988 6.742a1.248 1.248 0 1 0 1.732-1.796z';
const CHEVRON_RIGHT_LARGE_PATH = 'M1.395 2.157L7.45 8l-6.056 5.84A1.248 1.248 0 0 0 3.124 15.637L10.118 8.9a1.243 1.243 0 0 0-.003-1.797L3.127.362a1.248 1.248 0 1 0-1.732 1.796z';
const VISUALLY_HIDDEN_STYLE = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px'
} as const;

function isCalendarDateValue(value: unknown): value is CalendarDateValue {
  return value instanceof CalendarDate || value instanceof CalendarDateTime || value instanceof ZonedDateTime;
}

function isCalendarDateParts(value: unknown): value is CalendarDateParts {
  return Boolean(value)
    && typeof value === 'object'
    && typeof (value as CalendarDateParts).year === 'number'
    && typeof (value as CalendarDateParts).month === 'number'
    && typeof (value as CalendarDateParts).day === 'number';
}

function parseStringDateValue(value: string): CalendarDateValue | null {
  if (!value) {
    return null;
  }

  try {
    if (value.includes('[') && value.includes('T')) {
      return parseZonedDateTime(value);
    }

    if (value.includes('T')) {
      return parseDateTime(value);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return parseDate(value);
    }
  } catch {
    return null;
  }

  let match = value.match(/\d{4}-\d{2}-\d{2}/);
  if (match) {
    try {
      return parseDate(match[0]);
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeDateValue(value: CalendarInputValue): CalendarDateValue | null {
  if (value == null) {
    return null;
  }

  if (isCalendarDateValue(value)) {
    return value.copy();
  }

  if (typeof value === 'string') {
    return parseStringDateValue(value);
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }
    return toCalendarDate(fromDate(value, getLocalTimeZone()));
  }

  if (isCalendarDateParts(value)) {
    return new CalendarDate(value.year, value.month, value.day);
  }

  if (typeof value.toString === 'function') {
    return parseStringDateValue(value.toString());
  }

  return null;
}

function normalizeRangeValue(value: RangeInputValue): {end: CalendarDateValue | null, start: CalendarDateValue | null} | null {
  if (!value) {
    return null;
  }

  return {
    start: normalizeDateValue(value.start),
    end: normalizeDateValue(value.end)
  };
}

function toCalendarMonthValue(value: CalendarDateValue, calendar: IntlCalendar): CalendarMonthValue {
  return toCalendar(toCalendarDate(value), calendar);
}

function isInvalid(date: CalendarDateValue, minValue?: CalendarDateValue | null, maxValue?: CalendarDateValue | null): boolean {
  return (minValue != null && date.compare(minValue) < 0)
    || (maxValue != null && date.compare(maxValue) > 0);
}

function alignCenter(date: CalendarDate, duration: DateDuration, locale: string, minValue?: CalendarDateValue | null, maxValue?: CalendarDateValue | null): CalendarDate {
  let halfDuration: MutableDateDuration = {};
  for (let key in duration) {
    let value = duration[key];
    if (value == null) {
      continue;
    }

    halfDuration[key] = Math.floor(value / 2);
    if ((halfDuration[key] ?? 0) > 0 && value % 2 === 0) {
      halfDuration[key] = (halfDuration[key] ?? 0) - 1;
    }
  }

  let aligned = alignStart(date, duration, locale).subtract(halfDuration);
  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}

function alignStart(date: CalendarDate, duration: DateDuration, locale: string, minValue?: CalendarDateValue | null, maxValue?: CalendarDateValue | null): CalendarDate {
  let aligned = date;
  if (duration.years) {
    aligned = startOfYear(date);
  } else if (duration.months) {
    aligned = startOfMonth(date);
  } else if (duration.weeks) {
    aligned = startOfWeek(date, locale);
  }

  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}

function alignEnd(date: CalendarDate, duration: DateDuration, locale: string, minValue?: CalendarDateValue | null, maxValue?: CalendarDateValue | null): CalendarDate {
  let adjustedDuration: MutableDateDuration = {...duration};
  if (adjustedDuration.days) {
    adjustedDuration.days--;
  } else if (adjustedDuration.weeks) {
    adjustedDuration.weeks--;
  } else if (adjustedDuration.months) {
    adjustedDuration.months--;
  } else if (adjustedDuration.years) {
    adjustedDuration.years--;
  }

  let aligned = alignStart(date, duration, locale).subtract(adjustedDuration);
  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}

function constrainStart(
  date: CalendarDate,
  aligned: CalendarDate,
  duration: DateDuration,
  locale: string,
  minValue?: CalendarDateValue | null,
  maxValue?: CalendarDateValue | null
): CalendarDate {
  if (minValue && date.compare(minValue) >= 0) {
    let nextDate = maxDate(aligned, alignStart(toCalendarDate(minValue), duration, locale));
    if (nextDate) {
      aligned = nextDate;
    }
  }

  if (maxValue && date.compare(maxValue) <= 0) {
    let nextDate = minDate(aligned, alignEnd(toCalendarDate(maxValue), duration, locale));
    if (nextDate) {
      aligned = nextDate;
    }
  }

  return aligned;
}

function constrainValue(date: CalendarDate, minValue?: CalendarDateValue | null, maxValue?: CalendarDateValue | null): CalendarDate {
  if (minValue) {
    let nextDate = maxDate(date, toCalendarDate(minValue));
    if (nextDate) {
      date = nextDate;
    }
  }

  if (maxValue) {
    let nextDate = minDate(date, toCalendarDate(maxValue));
    if (nextDate) {
      date = nextDate;
    }
  }

  return date;
}

function previousAvailableDate(date: CalendarDate, minValue: CalendarDateValue, isDateUnavailable?: (date: CalendarDate) => boolean): CalendarDate | null {
  if (!isDateUnavailable) {
    return date;
  }

  while (date.compare(minValue) >= 0 && isDateUnavailable(date)) {
    date = date.subtract({days: 1});
  }

  if (date.compare(minValue) >= 0) {
    return date;
  }

  return null;
}

function unitDuration(duration: DateDuration): DateDuration {
  let unit: MutableDateDuration = {};
  for (let key in duration) {
    if (duration[key] != null) {
      unit[key] = 1;
    }
  }

  return unit;
}

function shiftDurationStart(date: CalendarDate, duration: DateDuration): CalendarDate {
  let adjustedDuration: MutableDateDuration = {...duration};
  if (adjustedDuration.days) {
    adjustedDuration.days--;
  } else {
    adjustedDuration.days = -1;
  }

  return date.add(adjustedDuration);
}

function getTimeZoneFromValue(value: CalendarDateValue | null, fallbackTimeZone: string): string {
  if (value instanceof ZonedDateTime) {
    return value.timeZone;
  }

  return fallbackTimeZone;
}

function cloneBoundaryValue(value: CalendarDateValue | null): CalendarDateValue | null {
  return value ? value.copy() : null;
}

function makeFormatter<K extends string = string>(locale: string, strings: Record<string, Record<string, string>>): LocalizedStringFormatter<K, string> {
  return new LocalizedStringFormatter(locale, new LocalizedStringDictionary(strings));
}

function getEraFormat(date: CalendarDate | null | undefined): 'short' | undefined {
  return date?.calendar.identifier === 'gregory' && date.era === 'BC' ? 'short' : undefined;
}

function formatDateValue(date: CalendarDateValue, locale: string, timeZone: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    calendar: date.calendar.identifier,
    timeZone
  }).format(date.toDate(timeZone));
}

function formatRange(
  locale: string,
  start: CalendarDate,
  end: CalendarDate,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
  stringFormatter: LocalizedStringFormatter<'dateRange', string>
): string {
  let formatter = new Intl.DateTimeFormat(locale, {
    ...options,
    calendar: start.calendar.identifier,
    timeZone
  });

  if (typeof formatter.formatRangeToParts !== 'function') {
    return stringFormatter.format('dateRange', {
      startDate: formatter.format(start.toDate(timeZone)),
      endDate: formatter.format(end.toDate(timeZone))
    });
  }

  let parts = formatter.formatRangeToParts(start.toDate(timeZone), end.toDate(timeZone));
  let separatorIndex = -1;
  for (let index = 0; index < parts.length; index++) {
    let part = parts[index];
    if (part.source === 'shared' && part.type === 'literal') {
      separatorIndex = index;
    } else if (part.source === 'endRange') {
      break;
    }
  }

  let startValue = '';
  let endValue = '';
  for (let index = 0; index < parts.length; index++) {
    if (index < separatorIndex) {
      startValue += parts[index].value;
    } else if (index > separatorIndex) {
      endValue += parts[index].value;
    }
  }

  return stringFormatter.format('dateRange', {
    startDate: startValue,
    endDate: endValue
  });
}

function getVisibleRangeDescription(
  locale: string,
  startDate: CalendarDate,
  endDate: CalendarDate,
  timeZone: string,
  isAria: boolean,
  stringFormatter: LocalizedStringFormatter<'dateRange', string>
): string {
  let era = getEraFormat(startDate) || getEraFormat(endDate);

  if (isSameDay(startDate, startOfMonth(startDate))) {
    let startMonth = startDate.calendar.getFormattableMonth ? startDate.calendar.getFormattableMonth(startDate) : startDate;
    let endMonth = endDate.calendar.getFormattableMonth ? endDate.calendar.getFormattableMonth(endDate) : endDate;

    if (isSameDay(endDate, endOfMonth(startDate))) {
      return formatDateValue(startMonth, locale, timeZone, {
        era,
        month: 'long',
        year: 'numeric'
      });
    }

    if (isSameDay(endDate, endOfMonth(endDate))) {
      if (isAria) {
        return formatRange(locale, startMonth, endMonth, timeZone, {
          era,
          month: 'long',
          year: 'numeric'
        }, stringFormatter);
      }

      return new Intl.DateTimeFormat(locale, {
        era,
        month: 'long',
        year: 'numeric',
        calendar: startMonth.calendar.identifier,
        timeZone
      }).formatRange(startMonth.toDate(timeZone), endMonth.toDate(timeZone));
    }
  }

  if (isAria) {
    return formatRange(locale, startDate, endDate, timeZone, {
      day: 'numeric',
      era,
      month: 'long',
      year: 'numeric'
    }, stringFormatter);
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    era,
    month: 'long',
    year: 'numeric',
    calendar: startDate.calendar.identifier,
    timeZone
  }).formatRange(startDate.toDate(timeZone), endDate.toDate(timeZone));
}

function getSelectedDateDescription(
  locale: string,
  state: CalendarState | RangeCalendarState,
  stringFormatter: LocalizedStringFormatter<'dateRange' | 'selectedDateDescription' | 'selectedRangeDescription', string>
): string {
  let start: CalendarDate | undefined;
  let end: CalendarDate | undefined;
  let anchorDate = 'anchorDate' in state ? state.anchorDate : null;

  if ('highlightedRange' in state) {
    start = state.highlightedRange?.start;
    end = state.highlightedRange?.end;
  } else {
    start = state.value ?? undefined;
    end = state.value ?? undefined;
  }

  if (anchorDate || !start || !end) {
    return '';
  }

  if (isSameDay(start, end)) {
    let date = formatDateValue(start, locale, state.timeZone, {
      day: 'numeric',
      era: getEraFormat(start) || getEraFormat(end),
      month: 'long',
      weekday: 'long',
      year: 'numeric'
    });
    return stringFormatter.format('selectedDateDescription', {date});
  }

  let dateRange = formatRange(locale, start, end, state.timeZone, {
    day: 'numeric',
    era: getEraFormat(start) || getEraFormat(end),
    month: 'long',
    weekday: 'long',
    year: 'numeric'
  }, stringFormatter as LocalizedStringFormatter<'dateRange', string>);
  return stringFormatter.format('selectedRangeDescription', {dateRange});
}

function isInvalidSelectedDate(state: CalendarState | RangeCalendarState, date: CalendarDate): boolean {
  if (!state.isValueInvalid) {
    return false;
  }

  if ('highlightedRange' in state) {
    return Boolean(
      !state.anchorDate
      && state.highlightedRange
      && date.compare(state.highlightedRange.start) >= 0
      && date.compare(state.highlightedRange.end) <= 0
    );
  }

  return Boolean(state.value && isSameDay(date, state.value));
}

function isSelectedDate(state: CalendarState | RangeCalendarState, date: CalendarDate): boolean {
  return state.isSelected(date) || isInvalidSelectedDate(state, date);
}

function renderChevronIcon(path: string, iconName: 'ChevronLeftLarge' | 'ChevronRightLarge') {
  return h('svg', {
    class: ['spectrum-Icon', `spectrum-UIIcon-${iconName}`],
    fill: 'currentColor',
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox: '0 0 11 16'
  }, [
    h('path', {d: path})
  ]);
}

function convertOutputValue(newValue: CalendarDate, previousValue: CalendarInputValue, timeZone: string): CalendarDateValue | Date | string | null {
  if (previousValue == null) {
    return toCalendar(newValue, new GregorianCalendar());
  }

  if (isCalendarDateValue(previousValue)) {
    let emittedValue = toCalendar(newValue, previousValue.calendar || new GregorianCalendar());
    if ('hour' in previousValue) {
      return previousValue.set(emittedValue as unknown as CalendarDateTime);
    }
    return emittedValue;
  }

  if (typeof previousValue === 'string') {
    let parsedValue = parseStringDateValue(previousValue);
    if (parsedValue && 'hour' in parsedValue) {
      return parsedValue.set(newValue as unknown as CalendarDateTime).toString();
    }
    return toCalendar(newValue, new GregorianCalendar()).toString();
  }

  if (previousValue instanceof Date) {
    return newValue.toDate(timeZone);
  }

  return toCalendar(newValue, new GregorianCalendar());
}

function getEventSourceValue(currentValue: CalendarInputValue, defaultValue: CalendarInputValue): CalendarInputValue {
  return currentValue ?? defaultValue;
}

function createCalendarLabelFormatter(locale: string): LocalizedStringFormatter<
  | 'dateRange'
  | 'dateSelected'
  | 'finishRangeSelectionPrompt'
  | 'maximumDate'
  | 'minimumDate'
  | 'next'
  | 'previous'
  | 'selectedDateDescription'
  | 'selectedRangeDescription'
  | 'startRangeSelectionPrompt'
  | 'todayDate'
  | 'todayDateSelected',
  string
> {
  return makeFormatter(locale, ariaIntlMessages as Record<string, Record<string, string>>);
}

function getInvalidSelectionMessage(selectedCount: number): string {
  return selectedCount === 1 ? 'Selected date unavailable.' : 'Selected dates unavailable.';
}

function createBaseStateHelpers(
  locale: string,
  visibleDuration: DateDuration,
  minValue: CalendarDateValue | null,
  maxValue: CalendarDateValue | null,
  isDateUnavailable: ((date: CalendarDate) => boolean) | undefined,
  isDisabled: boolean,
  isReadOnly: boolean,
  validationInvalid: boolean,
  firstDayOfWeek: FirstDayOfWeek | undefined,
  pageBehavior: PageBehavior,
  visibleRangeRef: {value: {end: CalendarDate, start: CalendarDate}},
  focusedDateRef: {value: CalendarDate},
  isFocusedRef: {value: boolean},
  setFocusedDate: (date: CalendarDate) => void
) {
  let pageDuration = pageBehavior === 'visible'
    ? visibleDuration
    : unitDuration(visibleDuration);

  let focusCell = (date: CalendarDate) => {
    setFocusedDate(constrainValue(date, minValue, maxValue));
  };

  let getDatesInWeek = (weekIndex: number, from = visibleRangeRef.value.start): Array<CalendarDate | null> => {
    let date = startOfWeek(from.add({weeks: weekIndex}), locale, firstDayOfWeek);
    let dates: Array<CalendarDate | null> = [];
    let dayOfWeek = getDayOfWeek(date, locale, firstDayOfWeek);

    for (let index = 0; index < dayOfWeek; index++) {
      dates.push(null);
    }

    while (dates.length < 7) {
      dates.push(date);
      let nextDate = date.add({days: 1});
      if (isSameDay(date, nextDate)) {
        break;
      }
      date = nextDate;
    }

    while (dates.length < 7) {
      dates.push(null);
    }

    return dates;
  };

  let base = {
    focusCell,
    focusNextDay: () => focusCell(focusedDateRef.value.add({days: 1})),
    focusPreviousDay: () => focusCell(focusedDateRef.value.subtract({days: 1})),
    focusNextRow: () => {
      if (visibleDuration.days) {
        base.focusNextPage();
      } else if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDateRef.value.add({weeks: 1}));
      }
    },
    focusPreviousRow: () => {
      if (visibleDuration.days) {
        base.focusPreviousPage();
      } else if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDateRef.value.subtract({weeks: 1}));
      }
    },
    focusNextPage: () => {
      let nextStart = visibleRangeRef.value.start.add(pageDuration);
      setFocusedDate(constrainValue(focusedDateRef.value.add(pageDuration), minValue, maxValue));
      visibleRangeRef.value.start = alignStart(
        constrainStart(focusedDateRef.value, nextStart, pageDuration, locale, minValue, maxValue),
        pageDuration,
        locale
      );
      visibleRangeRef.value.end = shiftDurationStart(visibleRangeRef.value.start, visibleDuration);
    },
    focusPreviousPage: () => {
      let nextStart = visibleRangeRef.value.start.subtract(pageDuration);
      setFocusedDate(constrainValue(focusedDateRef.value.subtract(pageDuration), minValue, maxValue));
      visibleRangeRef.value.start = alignStart(
        constrainStart(focusedDateRef.value, nextStart, pageDuration, locale, minValue, maxValue),
        pageDuration,
        locale
      );
      visibleRangeRef.value.end = shiftDurationStart(visibleRangeRef.value.start, visibleDuration);
    },
    focusSectionStart: () => {
      if (visibleDuration.days) {
        focusCell(visibleRangeRef.value.start);
      } else if (visibleDuration.weeks) {
        focusCell(startOfWeek(focusedDateRef.value, locale));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(startOfMonth(focusedDateRef.value));
      }
    },
    focusSectionEnd: () => {
      if (visibleDuration.days) {
        focusCell(visibleRangeRef.value.end);
      } else if (visibleDuration.weeks) {
        focusCell(endOfWeek(focusedDateRef.value, locale));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(endOfMonth(focusedDateRef.value));
      }
    },
    focusNextSection: (larger?: boolean) => {
      if (!larger && !visibleDuration.days) {
        focusCell(focusedDateRef.value.add(unitDuration(visibleDuration)));
        return;
      }

      if (visibleDuration.days) {
        base.focusNextPage();
      } else if (visibleDuration.weeks) {
        focusCell(focusedDateRef.value.add({months: 1}));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDateRef.value.add({years: 1}));
      }
    },
    focusPreviousSection: (larger?: boolean) => {
      if (!larger && !visibleDuration.days) {
        focusCell(focusedDateRef.value.subtract(unitDuration(visibleDuration)));
        return;
      }

      if (visibleDuration.days) {
        base.focusPreviousPage();
      } else if (visibleDuration.weeks) {
        focusCell(focusedDateRef.value.subtract({months: 1}));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(focusedDateRef.value.subtract({years: 1}));
      }
    },
    isInvalid: (date: CalendarDate) => isInvalid(date, minValue, maxValue),
    isCellFocused: (date: CalendarDate) => isFocusedRef.value && isSameDay(date, focusedDateRef.value),
    isCellDisabled: (date: CalendarDate) => {
      return isDisabled
        || date.compare(visibleRangeRef.value.start) < 0
        || date.compare(visibleRangeRef.value.end) > 0
        || base.isInvalid(date);
    },
    isCellUnavailable: (date: CalendarDate) => isDateUnavailable ? isDateUnavailable(date) : false,
    isPreviousVisibleRangeInvalid: () => {
      let previousDate = visibleRangeRef.value.start.subtract({days: 1});
      return isSameDay(previousDate, visibleRangeRef.value.start) || base.isInvalid(previousDate);
    },
    isNextVisibleRangeInvalid: () => {
      let nextDate = visibleRangeRef.value.end.add({days: 1});
      return isSameDay(nextDate, visibleRangeRef.value.end) || base.isInvalid(nextDate);
    },
    getDatesInWeek,
    validationState: validationInvalid ? 'invalid' as const : null
  };

  return base;
}

function createCalendarState(
  props: SharedCalendarProps & {
    defaultValue?: CalendarInputValue,
    modelValue?: CalendarInputValue,
    onChange?: (value: CalendarDateValue | Date | string | null) => void,
    onFocusChange?: (value: CalendarDate) => void,
    value?: CalendarInputValue
  },
  store: CalendarStore,
  emit: (event: 'change' | 'focusChange' | 'update:modelValue' | 'update:value', value: unknown) => void,
  locale: string,
  displayCalendar: IntlCalendar,
  fallbackTimeZone: string
): CalendarState {
  let controlledValue = props.value !== undefined || props.modelValue !== undefined;
  let currentRawValue = controlledValue ? (props.value ?? props.modelValue) : store.rawValue.value;
  let normalizedValue = normalizeDateValue(currentRawValue);
  let displayValue = normalizedValue ? toCalendarMonthValue(normalizedValue, displayCalendar) : null;
  let minValue = cloneBoundaryValue(normalizeDateValue(props.minValue));
  let maxValue = cloneBoundaryValue(normalizeDateValue(props.maxValue));
  let timeZone = getTimeZoneFromValue(normalizedValue, fallbackTimeZone);
  let visibleDuration: DateDuration = {
    months: Math.max(props.visibleMonths ?? 1, 1)
  };
  let resolvedIsDateUnavailable = (date: CalendarDate) => props.isDateUnavailable?.(date) ?? false;
  let defaultFocusedDate = constrainValue(
    props.defaultFocusedValue
      ? toCalendarMonthValue(normalizeDateValue(props.defaultFocusedValue) ?? today(timeZone), displayCalendar)
      : displayValue || toCalendarMonthValue(today(timeZone), displayCalendar),
    minValue,
    maxValue
  );
  let normalizedFocusedValue = normalizeDateValue(props.focusedValue);
  let controlledFocusedDate = normalizedFocusedValue
    ? constrainValue(toCalendarMonthValue(normalizedFocusedValue, displayCalendar), minValue, maxValue)
    : undefined;
  let focusedDate = controlledFocusedDate ?? store.uncontrolledFocusedDate.value ?? defaultFocusedDate;
  let initialAlignment = props.selectionAlignment ?? 'center';
  let initialStartDate = initialAlignment === 'start'
    ? alignStart(focusedDate, visibleDuration, locale, minValue, maxValue)
    : initialAlignment === 'end'
      ? alignEnd(focusedDate, visibleDuration, locale, minValue, maxValue)
      : alignCenter(focusedDate, visibleDuration, locale, minValue, maxValue);

  if (!store.uncontrolledFocusedDate.value) {
    store.uncontrolledFocusedDate.value = defaultFocusedDate;
  }

  if (!store.visibleRange.value.start) {
    store.visibleRange.value = {
      start: initialStartDate,
      end: shiftDurationStart(initialStartDate, visibleDuration)
    };
  }

  let setFocusedDate = (date: CalendarDate) => {
    let nextDate = constrainValue(date, minValue, maxValue);
    if (!controlledFocusedDate) {
      store.uncontrolledFocusedDate.value = nextDate;
    }
    emit('focusChange', nextDate);
    props.onFocusChange?.(nextDate);
  };

  let setValue = (date: CalendarDate | null) => {
    if (props.isDisabled || props.isReadOnly) {
      return;
    }

    if (date === null) {
      if (!controlledValue) {
        store.rawValue.value = null;
      }
      emit('update:modelValue', null);
      emit('update:value', null);
      emit('change', null);
      props.onChange?.(null);
      return;
    }

    let constrainedDate = constrainValue(date, minValue, maxValue);
    let availableDate = previousAvailableDate(constrainedDate, store.visibleRange.value.start, resolvedIsDateUnavailable);
    if (!availableDate) {
      return;
    }

    let emittedValue = convertOutputValue(availableDate, getEventSourceValue(currentRawValue, props.defaultValue), timeZone);
    if (!controlledValue) {
      store.rawValue.value = emittedValue as CalendarInputValue;
    }
    emit('update:modelValue', emittedValue);
    emit('update:value', emittedValue);
    emit('change', emittedValue);
    props.onChange?.(emittedValue);
  };

  let isUnavailableSelection = Boolean(displayValue) && (
    Boolean(props.isDateUnavailable?.(displayValue))
    || isInvalid(displayValue, minValue, maxValue)
  );
  let isValueInvalid = Boolean(props.isInvalid || props.validationState === 'invalid' || isUnavailableSelection);
  let helpers = createBaseStateHelpers(
    locale,
    visibleDuration,
    minValue,
    maxValue,
    resolvedIsDateUnavailable,
    Boolean(props.isDisabled),
    Boolean(props.isReadOnly),
    isValueInvalid,
    props.firstDayOfWeek,
    props.pageBehavior ?? 'visible',
    store.visibleRange,
    {
      get value() {
        return controlledFocusedDate ?? store.uncontrolledFocusedDate.value;
      },
      set value(nextValue) {
        setFocusedDate(nextValue);
      }
    },
    store.isFocused,
    setFocusedDate
  );

  if (helpers.isInvalid(focusedDate)) {
    setFocusedDate(constrainValue(focusedDate, minValue, maxValue));
  } else if (focusedDate.compare(store.visibleRange.value.start) < 0) {
    store.visibleRange.value.start = alignEnd(focusedDate, visibleDuration, locale, minValue, maxValue);
    store.visibleRange.value.end = shiftDurationStart(store.visibleRange.value.start, visibleDuration);
  } else if (focusedDate.compare(store.visibleRange.value.end) > 0) {
    store.visibleRange.value.start = alignStart(focusedDate, visibleDuration, locale, minValue, maxValue);
    store.visibleRange.value.end = shiftDurationStart(store.visibleRange.value.start, visibleDuration);
  }

  let stringFormatter = createCalendarLabelFormatter(locale);
  let title = getVisibleRangeDescription(
    locale,
    store.visibleRange.value.start,
    store.visibleRange.value.end,
    timeZone,
    false,
    stringFormatter as LocalizedStringFormatter<'dateRange', string>
  );

  return {
    focusedDate,
    focusNextDay: helpers.focusNextDay,
    focusNextPage: helpers.focusNextPage,
    focusNextRow: helpers.focusNextRow,
    focusNextSection: helpers.focusNextSection,
    focusPreviousDay: helpers.focusPreviousDay,
    focusPreviousPage: helpers.focusPreviousPage,
    focusPreviousRow: helpers.focusPreviousRow,
    focusPreviousSection: helpers.focusPreviousSection,
    focusSectionEnd: helpers.focusSectionEnd,
    focusSectionStart: helpers.focusSectionStart,
    getDatesInWeek: helpers.getDatesInWeek,
    isCellDisabled: helpers.isCellDisabled,
    isCellFocused: helpers.isCellFocused,
    isCellUnavailable: helpers.isCellUnavailable,
    isDisabled: Boolean(props.isDisabled),
    isFocused: store.isFocused.value,
    isNextVisibleRangeInvalid: helpers.isNextVisibleRangeInvalid,
    isPreviousVisibleRangeInvalid: helpers.isPreviousVisibleRangeInvalid,
    isReadOnly: Boolean(props.isReadOnly),
    isSelected: (date) => {
      return displayValue != null
        && isSameDay(date, displayValue)
        && !helpers.isCellDisabled(date)
        && !helpers.isCellUnavailable(date);
    },
    isValueInvalid,
    maxValue,
    minValue,
    selectDate: (date) => setValue(date),
    selectFocusedDate: () => {
      if (!resolvedIsDateUnavailable(focusedDate)) {
        setValue(focusedDate);
      }
    },
    setFocused: (value) => {
      store.isFocused.value = value;
    },
    setFocusedDate,
    timeZone,
    title,
    validationState: helpers.validationState,
    value: displayValue,
    visibleRange: store.visibleRange.value
  };
}

function makeRange(start: CalendarDateValue | null | undefined, end: CalendarDateValue | null | undefined): {end: CalendarDate, start: CalendarDate} | null {
  if (!start || !end) {
    return null;
  }

  let normalizedStart = toCalendarDate(start);
  let normalizedEnd = toCalendarDate(end);
  if (normalizedEnd.compare(normalizedStart) < 0) {
    return {
      start: normalizedEnd,
      end: normalizedStart
    };
  }

  return {
    start: normalizedStart,
    end: normalizedEnd
  };
}

function nextUnavailableDate(anchorDate: CalendarDate, state: Pick<RangeCalendarState, 'isCellUnavailable' | 'visibleRange'>, direction: number): CalendarDate | undefined {
  let nextDate = anchorDate.add({days: direction});
  while (
    (direction < 0 ? nextDate.compare(state.visibleRange.start) >= 0 : nextDate.compare(state.visibleRange.end) <= 0)
    && !state.isCellUnavailable(nextDate)
  ) {
    nextDate = nextDate.add({days: direction});
  }

  if (state.isCellUnavailable(nextDate)) {
    return nextDate.add({days: -direction});
  }

  return undefined;
}

function createRangeCalendarState(
  props: SharedCalendarProps & {
    allowsNonContiguousRanges?: boolean,
    defaultValue?: RangeInputValue,
    modelValue?: RangeInputValue,
    onChange?: (value: DateRangeValue | null) => void,
    onFocusChange?: (value: CalendarDate) => void,
    value?: RangeInputValue
  },
  store: RangeCalendarStore,
  emit: (event: 'change' | 'focusChange' | 'update:modelValue' | 'update:value', value: unknown) => void,
  locale: string,
  displayCalendar: IntlCalendar,
  fallbackTimeZone: string
): RangeCalendarState {
  let controlledValue = props.value !== undefined || props.modelValue !== undefined;
  let currentRawValue = controlledValue ? (props.value ?? props.modelValue) : store.rawValue.value;
  let normalizedValue = normalizeRangeValue(currentRawValue);
  let displayValue: DateRangeValue | null = normalizedValue
    ? {
      start: normalizedValue.start ? toCalendarMonthValue(normalizedValue.start, displayCalendar) : null,
      end: normalizedValue.end ? toCalendarMonthValue(normalizedValue.end, displayCalendar) : null
    }
    : null;
  let minValue = cloneBoundaryValue(normalizeDateValue(props.minValue));
  let maxValue = cloneBoundaryValue(normalizeDateValue(props.maxValue));
  let timeZone = getTimeZoneFromValue(normalizedValue?.start ?? normalizedValue?.end ?? null, fallbackTimeZone);
  let visibleDuration: DateDuration = {
    months: Math.max(props.visibleMonths ?? 1, 1)
  };
  let defaultFocusedValue = normalizeDateValue(props.defaultFocusedValue);
  let defaultFocusedDate = constrainValue(
    defaultFocusedValue
      ? toCalendarMonthValue(defaultFocusedValue, displayCalendar)
      : ((displayValue?.start as CalendarDate | null) ?? toCalendarMonthValue(today(timeZone), displayCalendar)),
    minValue,
    maxValue
  );
  let normalizedFocusedValue = normalizeDateValue(props.focusedValue);
  let controlledFocusedDate = normalizedFocusedValue
    ? constrainValue(toCalendarMonthValue(normalizedFocusedValue, displayCalendar), minValue, maxValue)
    : undefined;
  let focusedDate = controlledFocusedDate ?? store.uncontrolledFocusedDate.value ?? defaultFocusedDate;

  let initialAlignment: 'center' | 'start' = 'center';
  if (normalizedValue?.start && normalizedValue.end) {
    let centeredStart = alignCenter(toCalendarDate(normalizedValue.start), visibleDuration, locale, minValue, maxValue);
    let centeredEnd = shiftDurationStart(centeredStart, visibleDuration);
    if (toCalendarDate(normalizedValue.end).compare(centeredEnd) > 0) {
      initialAlignment = 'start';
    }
  }

  let initialStartDate = (props.selectionAlignment ?? initialAlignment) === 'start'
    ? alignStart(focusedDate, visibleDuration, locale, minValue, maxValue)
    : alignCenter(focusedDate, visibleDuration, locale, minValue, maxValue);

  if (!store.uncontrolledFocusedDate.value) {
    store.uncontrolledFocusedDate.value = defaultFocusedDate;
  }

  if (!store.visibleRange.value.start) {
    store.visibleRange.value = {
      start: initialStartDate,
      end: shiftDurationStart(initialStartDate, visibleDuration)
    };
  }

  let activeMinValue = maxDate(minValue, store.availableRange.value?.start ?? null);
  let activeMaxValue = minDate(maxValue, store.availableRange.value?.end ?? null);
  let resolvedIsDateUnavailable = (date: CalendarDate) => props.isDateUnavailable?.(date) ?? false;

  let setFocusedDate = (date: CalendarDate) => {
    let nextDate = constrainValue(date, activeMinValue, activeMaxValue);
    if (!controlledFocusedDate) {
      store.uncontrolledFocusedDate.value = nextDate;
    }
    emit('focusChange', nextDate);
    props.onFocusChange?.(nextDate);
  };

  let baseStateShape = {
    get visibleRange() {
      return store.visibleRange.value;
    },
    isCellUnavailable(date: CalendarDate) {
      return resolvedIsDateUnavailable(date);
    }
  };

  let updateAvailableRange = (date: CalendarDate | null) => {
    if (date && props.isDateUnavailable && !props.allowsNonContiguousRanges) {
      store.availableRange.value = {
        start: nextUnavailableDate(date, baseStateShape, -1),
        end: nextUnavailableDate(date, baseStateShape, 1)
      };
    } else {
      store.availableRange.value = null;
    }
  };

  let setAnchorDate = (date: CalendarDate | null) => {
    store.anchorDate.value = date;
    updateAvailableRange(date);
  };

  let helpers = createBaseStateHelpers(
    locale,
    visibleDuration,
    activeMinValue,
    activeMaxValue,
    resolvedIsDateUnavailable,
    Boolean(props.isDisabled),
    Boolean(props.isReadOnly),
    false,
    props.firstDayOfWeek,
    props.pageBehavior ?? 'visible',
    store.visibleRange,
    {
      get value() {
        return controlledFocusedDate ?? store.uncontrolledFocusedDate.value;
      },
      set value(nextValue) {
        setFocusedDate(nextValue);
      }
    },
    store.isFocused,
    setFocusedDate
  );

  updateAvailableRange(store.anchorDate.value);

  if (helpers.isInvalid(focusedDate)) {
    setFocusedDate(constrainValue(focusedDate, activeMinValue, activeMaxValue));
  } else if (focusedDate.compare(store.visibleRange.value.start) < 0) {
    store.visibleRange.value.start = alignEnd(focusedDate, visibleDuration, locale, activeMinValue, activeMaxValue);
    store.visibleRange.value.end = shiftDurationStart(store.visibleRange.value.start, visibleDuration);
  } else if (focusedDate.compare(store.visibleRange.value.end) > 0) {
    store.visibleRange.value.start = alignStart(focusedDate, visibleDuration, locale, activeMinValue, activeMaxValue);
    store.visibleRange.value.end = shiftDurationStart(store.visibleRange.value.start, visibleDuration);
  }

  let highlightedRange = store.anchorDate.value
    ? makeRange(store.anchorDate.value, focusedDate)
    : makeRange(displayValue?.start as CalendarDate | null, displayValue?.end as CalendarDate | null);

  let selectDate = (date: CalendarDate) => {
    if (props.isReadOnly) {
      return;
    }

    let constrainedDate = constrainValue(date, activeMinValue, activeMaxValue);
    let availableDate = previousAvailableDate(constrainedDate, store.visibleRange.value.start, resolvedIsDateUnavailable);
    if (!availableDate) {
      return;
    }

    if (!store.anchorDate.value) {
      setAnchorDate(availableDate);
      setFocusedDate(availableDate);
      return;
    }

    let range = makeRange(store.anchorDate.value, availableDate);
    if (!range) {
      return;
    }

    let sourceValue = currentRawValue ?? props.defaultValue;
    let nextValue: DateRangeValue = {
      start: convertOutputValue(range.start, sourceValue?.start, timeZone),
      end: convertOutputValue(range.end, sourceValue?.end, timeZone)
    };

    if (!controlledValue) {
      store.rawValue.value = nextValue;
    }

    emit('update:modelValue', nextValue);
    emit('update:value', nextValue);
    emit('change', nextValue);
    props.onChange?.(nextValue);
    setAnchorDate(null);
    setFocusedDate(availableDate);
  };

  let isInvalidSelection = Boolean(displayValue?.start && displayValue?.end && !store.anchorDate.value) && (
    Boolean(props.isDateUnavailable && (props.isDateUnavailable(displayValue.start as CalendarDate) || props.isDateUnavailable(displayValue.end as CalendarDate)))
    || isInvalid(displayValue.start as CalendarDate, minValue, maxValue)
    || isInvalid(displayValue.end as CalendarDate, minValue, maxValue)
  );
  let isValueInvalid = Boolean(props.isInvalid || props.validationState === 'invalid' || isInvalidSelection);
  let stringFormatter = createCalendarLabelFormatter(locale);
  let title = getVisibleRangeDescription(
    locale,
    store.visibleRange.value.start,
    store.visibleRange.value.end,
    timeZone,
    false,
    stringFormatter as LocalizedStringFormatter<'dateRange', string>
  );

  return {
    anchorDate: store.anchorDate.value,
    focusedDate,
    focusNextDay: helpers.focusNextDay,
    focusNextPage: helpers.focusNextPage,
    focusNextRow: helpers.focusNextRow,
    focusNextSection: helpers.focusNextSection,
    focusPreviousDay: helpers.focusPreviousDay,
    focusPreviousPage: helpers.focusPreviousPage,
    focusPreviousRow: helpers.focusPreviousRow,
    focusPreviousSection: helpers.focusPreviousSection,
    focusSectionEnd: helpers.focusSectionEnd,
    focusSectionStart: helpers.focusSectionStart,
    getDatesInWeek: helpers.getDatesInWeek,
    highlightDate: (date) => {
      if (store.anchorDate.value) {
        setFocusedDate(date);
      }
    },
    highlightedRange,
    isCellDisabled: helpers.isCellDisabled,
    isCellFocused: helpers.isCellFocused,
    isCellUnavailable: helpers.isCellUnavailable,
    isDisabled: Boolean(props.isDisabled),
    isDragging: store.isDragging.value,
    isFocused: store.isFocused.value,
    isNextVisibleRangeInvalid: helpers.isNextVisibleRangeInvalid,
    isPreviousVisibleRangeInvalid: helpers.isPreviousVisibleRangeInvalid,
    isReadOnly: Boolean(props.isReadOnly),
    isSelected: (date) => {
      return Boolean(
        highlightedRange
        && date.compare(highlightedRange.start) >= 0
        && date.compare(highlightedRange.end) <= 0
        && !helpers.isCellDisabled(date)
        && !helpers.isCellUnavailable(date)
      );
    },
    isValueInvalid,
    maxValue,
    minValue,
    selectDate,
    selectFocusedDate: () => selectDate(focusedDate),
    setAnchorDate,
    setDragging: (nextDragging) => {
      store.isDragging.value = nextDragging;
    },
    setFocused: (value) => {
      store.isFocused.value = value;
    },
    setFocusedDate,
    timeZone,
    title,
    validationState: isValueInvalid ? 'invalid' : null,
    value: displayValue,
    visibleRange: store.visibleRange.value
  };
}

function buildCalendarRootAriaLabel(externalAriaLabel: string | undefined, title: string): string {
  return [externalAriaLabel, title].filter(Boolean).join(', ') || title;
}

function createCellAriaLabel(
  locale: string,
  date: CalendarDate,
  timeZone: string,
  state: CalendarState | RangeCalendarState,
  stringFormatter: LocalizedStringFormatter<
    | 'dateSelected'
    | 'finishRangeSelectionPrompt'
    | 'maximumDate'
    | 'minimumDate'
    | 'selectedDateDescription'
    | 'selectedRangeDescription'
    | 'startRangeSelectionPrompt'
    | 'todayDate'
    | 'todayDateSelected',
    string
  >,
  selectedDateDescription: string
): string {
  let isSelected = isSelectedDate(state, date);
  let label = formatDateValue(date, locale, timeZone, {
    day: 'numeric',
    era: getEraFormat(date),
    month: 'long',
    weekday: 'long',
    year: 'numeric'
  });

  if ('highlightedRange' in state && state.value && !state.anchorDate) {
    let start = state.value.start as CalendarDate | null;
    let end = state.value.end as CalendarDate | null;
    if ((start && isSameDay(date, start)) || (end && isSameDay(date, end))) {
      label = `${selectedDateDescription}, ${label}`;
    }
  }

  if (isToday(date, timeZone)) {
    label = stringFormatter.format(isSelected ? 'todayDateSelected' : 'todayDate', {date: label});
  } else if (isSelected) {
    label = stringFormatter.format('dateSelected', {date: label});
  }

  if (state.minValue && isSameDay(date, state.minValue)) {
    label += `, ${stringFormatter.format('minimumDate')}`;
  } else if (state.maxValue && isSameDay(date, state.maxValue)) {
    label += `, ${stringFormatter.format('maximumDate')}`;
  }

  return label;
}

function renderCalendarGrid(
  state: CalendarState | RangeCalendarState,
  locale: string,
  firstDayOfWeek: FirstDayOfWeek | undefined,
  monthDate: CalendarDate,
  errorMessageId: string | undefined,
  selectedDateDescription: string,
  focusVisibleKey: string | null,
  hoveredKey: string | null,
  pressedKey: string | null,
  rangeSelectionDescriptionId: string,
  registerCellRef: (key: string, element: HTMLElement | null) => void,
  setFocusVisibleKey: (key: string | null) => void,
  setHoveredKey: (key: string | null) => void,
  setPressedKey: (key: string | null) => void
) {
  let stringFormatter = createCalendarLabelFormatter(locale);
  let gridAriaLabel = getVisibleRangeDescription(
    locale,
    monthDate,
    endOfMonth(monthDate),
    state.timeZone,
    true,
    stringFormatter as LocalizedStringFormatter<'dateRange', string>
  );
  let weekStart = startOfWeek(today(state.timeZone), locale, firstDayOfWeek);
  let weekDays = [...new Array(7).keys()].map((index) => formatDateValue(weekStart.add({days: index}), locale, state.timeZone, {
    day: undefined,
    month: undefined,
    weekday: 'narrow',
    year: undefined
  }));
  let weeksInMonth = getWeeksInMonth(monthDate, locale, firstDayOfWeek);

  let rows = [...new Array(weeksInMonth).keys()].map((weekIndex) => {
    return h('tr', {key: weekIndex}, state.getDatesInWeek(weekIndex, monthDate).map((date, index) => {
      if (!date) {
        return h('td', {key: index});
      }

      let cellKey = date.toString();
      let isDisabled = !isSameMonth(date, monthDate) || state.isCellDisabled(date);
      let isUnavailable = state.isCellUnavailable(date) && !isDisabled;
      let isInvalid = isInvalidSelectedDate(state, date);
      let isSelected = isSelectedDate(state, date);

      let highlightedRange = 'highlightedRange' in state ? state.highlightedRange : null;
      let isSelectionStart = Boolean(isSelected && highlightedRange && isSameDay(date, highlightedRange.start));
      let isSelectionEnd = Boolean(isSelected && highlightedRange && isSameDay(date, highlightedRange.end));
      let dayOfWeek = getDayOfWeek(date, locale, firstDayOfWeek);
      let isLastSelectedBeforeDisabled = !isDisabled && !isInvalid && state.isCellUnavailable(date.add({days: 1}));
      let isFirstSelectedAfterDisabled = !isDisabled && !isInvalid && state.isCellUnavailable(date.subtract({days: 1}));
      let isRangeStart = Boolean(isSelected && (isFirstSelectedAfterDisabled || dayOfWeek === 0 || date.day === 1));
      let isRangeEnd = Boolean(isSelected && (isLastSelectedBeforeDisabled || dayOfWeek === 6 || date.day === monthDate.calendar.getDaysInMonth(monthDate)));
      let isFocused = state.isCellFocused(date) && !isDisabled && !(!isSameMonth(date, monthDate));
      let isFocusVisible = focusVisibleKey === cellKey;
      let tabIndex = isDisabled ? undefined : isSameDay(date, state.focusedDate) ? 0 : -1;
      let isSelectable = !isDisabled && !isUnavailable && !state.isReadOnly;
      let rangeSelectionPrompt = '';
      if ('anchorDate' in state && isFocused && !state.isReadOnly && !isDisabled && !isUnavailable) {
        rangeSelectionPrompt = state.anchorDate
          ? stringFormatter.format('finishRangeSelectionPrompt')
          : stringFormatter.format('startRangeSelectionPrompt');
      }

      let describedBy = [
        isInvalid ? errorMessageId : undefined,
        rangeSelectionPrompt ? rangeSelectionDescriptionId : undefined
      ].filter(Boolean).join(' ') || undefined;

      return h('td', {
        role: 'gridcell',
        'aria-disabled': !isSelectable || undefined,
        'aria-invalid': isInvalid || undefined,
        'aria-selected': isSelected || undefined,
        class: classNames(styles, 'spectrum-Calendar-tableCell'),
        key: index
      }, [
        h('span', {
          ref: (element: Element | null) => {
            registerCellRef(cellKey, element instanceof HTMLElement ? element : null);
          },
          role: 'button',
          tabindex: tabIndex,
          'aria-disabled': !isSelectable || undefined,
          'aria-describedby': describedBy,
          'aria-invalid': isInvalid || undefined,
          'aria-label': createCellAriaLabel(locale, date, state.timeZone, state, stringFormatter, selectedDateDescription),
          class: classNames(styles, 'spectrum-Calendar-date', {
            'is-disabled': isDisabled && !isInvalid,
            'is-focused': isFocused && isFocusVisible,
            'is-hovered': hoveredKey === cellKey && isSelectable,
            'is-invalid': isInvalid,
            'is-outsideMonth': !isSameMonth(date, monthDate),
            'is-pressed': pressedKey === cellKey && !state.isReadOnly,
            'is-range-end': isRangeEnd,
            'is-range-selection': isSelected && 'highlightedRange' in state,
            'is-range-start': isRangeStart,
            'is-selected': isSelected,
            'is-selection-end': isSelectionEnd,
            'is-selection-start': isSelectionStart,
            'is-today': isToday(date, state.timeZone),
            'is-unavailable': isUnavailable || (isInvalid && isDisabled)
          }),
          onBlur: () => {
            setFocusVisibleKey(null);
          },
          onClick: () => {
            if (state.isReadOnly) {
              state.setFocusedDate(date);
              state.setFocused(true);
              return;
            }

            state.selectDate(date);
            state.setFocusedDate(date);
            state.setFocused(true);
          },
          onContextmenu: (event: MouseEvent) => {
            event.preventDefault();
          },
          onFocus: (event: FocusEvent) => {
            state.setFocusedDate(date);
            state.setFocused(true);
            let target = event.currentTarget as HTMLElement | null;
            setFocusVisibleKey(target?.matches(':focus-visible') ? cellKey : null);
          },
          onKeydown: (event: KeyboardEvent) => {
            switch (event.key) {
              case 'Enter':
              case ' ':
              case 'Spacebar':
                event.preventDefault();
                state.selectFocusedDate();
                break;
              case 'PageUp':
                event.preventDefault();
                event.stopPropagation();
                state.focusPreviousSection(event.shiftKey);
                break;
              case 'PageDown':
                event.preventDefault();
                event.stopPropagation();
                state.focusNextSection(event.shiftKey);
                break;
              case 'End':
                event.preventDefault();
                event.stopPropagation();
                state.focusSectionEnd();
                break;
              case 'Home':
                event.preventDefault();
                event.stopPropagation();
                state.focusSectionStart();
                break;
              case 'ArrowLeft':
                event.preventDefault();
                event.stopPropagation();
                state.focusPreviousDay();
                break;
              case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                state.focusPreviousRow();
                break;
              case 'ArrowRight':
                event.preventDefault();
                event.stopPropagation();
                state.focusNextDay();
                break;
              case 'ArrowDown':
                event.preventDefault();
                event.stopPropagation();
                state.focusNextRow();
                break;
              case 'Escape':
                if ('setAnchorDate' in state) {
                  event.preventDefault();
                  state.setAnchorDate(null);
                }
                break;
            }
          },
          onMousedown: (event: MouseEvent) => {
            if (isSelectable) {
              setPressedKey(cellKey);
            }
            event.preventDefault();
          },
          onMouseenter: () => {
            if ('highlightDate' in state && isSelectable) {
              state.highlightDate(date);
            }
            setHoveredKey(cellKey);
          },
          onMouseleave: () => {
            setHoveredKey(null);
            setPressedKey(null);
          },
          onMouseup: () => {
            setPressedKey(null);
          },
          onPointerenter: (event: PointerEvent) => {
            if ('highlightDate' in state && (event.pointerType !== 'touch' || state.isDragging) && isSelectable) {
              state.highlightDate(date);
            }
          }
        }, [
          h('span', {class: classNames(styles, 'spectrum-Calendar-dateText')}, [
            h('span', formatDateValue(date, locale, state.timeZone, {
              day: 'numeric'
            }))
          ])
        ])
      ]);
    }));
  });

  return h('table', {
    role: 'grid',
    'aria-disabled': state.isDisabled || undefined,
    'aria-label': gridAriaLabel,
    'aria-multiselectable': 'highlightedRange' in state || undefined,
    'aria-readonly': state.isReadOnly || undefined,
    class: classNames(styles, 'spectrum-Calendar-body', 'spectrum-Calendar-table')
  }, [
    h('thead', {'aria-hidden': true}, [
      h('tr', weekDays.map((day, index) => h('th', {
        class: classNames(styles, 'spectrum-Calendar-tableCell'),
        key: index
      }, [
        h('span', {class: classNames(styles, 'spectrum-Calendar-dayOfWeek')}, day)
      ])))
    ]),
    h('tbody', rows)
  ]);
}

function setupCalendarComponent(
  props: SharedCalendarProps & {
    allowsNonContiguousRanges?: boolean,
    ariaLabel?: string,
    defaultValue?: CalendarInputValue | RangeInputValue,
    disabled?: boolean,
    max?: string,
    min?: string,
    modelValue?: CalendarInputValue | RangeInputValue,
    onChange?: ((value: unknown) => void) | undefined,
    onFocusChange?: ((value: CalendarDate) => void) | undefined,
    value?: CalendarInputValue | RangeInputValue
  },
  attrs: Record<string, unknown>,
  emit: (event: 'change' | 'focusChange' | 'update:modelValue' | 'update:value', value: unknown) => void,
  isRange: boolean
) {
  let provider = useProvider();
  let providerProps = useProviderProps(props);
  let resolvedProps = computed(() => Object.assign({}, props, providerProps));
  let locale = computed(() => provider.locale || 'en-US');
  let fallbackTimeZone = computed(() => new Intl.DateTimeFormat(locale.value).resolvedOptions().timeZone || getLocalTimeZone());
  let calendarIdentifier = computed(() => {
    return (new Intl.DateTimeFormat(locale.value).resolvedOptions().calendar || 'gregory') as CalendarIdentifier;
  });
  let displayCalendar = shallowRef<IntlCalendar>((resolvedProps.value.createCalendar ?? createDefaultCalendar)(calendarIdentifier.value));
  watch([calendarIdentifier, () => resolvedProps.value.createCalendar], ([nextIdentifier, createCalendarFactory]) => {
    displayCalendar.value = (createCalendarFactory ?? createDefaultCalendar)(nextIdentifier);
  }, {immediate: true});

  let normalizedMinValue = computed(() => normalizeDateValue(resolvedProps.value.minValue ?? resolvedProps.value.min));
  let normalizedMaxValue = computed(() => normalizeDateValue(resolvedProps.value.maxValue ?? resolvedProps.value.max));
  let baseProps = computed(() => ({
    'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : resolvedProps.value.ariaLabel,
    'aria-labelledby': typeof attrs['aria-labelledby'] === 'string' ? attrs['aria-labelledby'] : undefined,
    autoFocus: resolvedProps.value.autoFocus,
    createCalendar: resolvedProps.value.createCalendar,
    defaultFocusedValue: resolvedProps.value.defaultFocusedValue,
    errorMessage: resolvedProps.value.errorMessage,
    firstDayOfWeek: resolvedProps.value.firstDayOfWeek,
    focusedValue: resolvedProps.value.focusedValue,
    isDateUnavailable: resolvedProps.value.isDateUnavailable,
    isDisabled: resolvedProps.value.isDisabled ?? resolvedProps.value.disabled,
    isInvalid: resolvedProps.value.isInvalid,
    isReadOnly: resolvedProps.value.isReadOnly,
    maxValue: normalizedMaxValue.value,
    minValue: normalizedMinValue.value,
    pageBehavior: resolvedProps.value.pageBehavior ?? 'visible',
    selectionAlignment: resolvedProps.value.selectionAlignment,
    validationState: resolvedProps.value.validationState,
    visibleMonths: Math.max(resolvedProps.value.visibleMonths ?? 1, 1)
  }));

  let calendarStore: CalendarStore = {
    isFocused: ref(Boolean(resolvedProps.value.autoFocus)),
    rawValue: ref(resolvedProps.value.defaultValue as CalendarInputValue),
    uncontrolledFocusedDate: ref(undefined as unknown as CalendarDate),
    visibleRange: ref({} as {end: CalendarDate, start: CalendarDate})
  };
  let rangeStore: RangeCalendarStore = {
    anchorDate: ref(null),
    availableRange: ref(null),
    isDragging: ref(false),
    isFocused: ref(Boolean(resolvedProps.value.autoFocus)),
    rawValue: ref(resolvedProps.value.defaultValue as RangeInputValue),
    uncontrolledFocusedDate: ref(undefined as unknown as CalendarDate),
    visibleRange: ref({} as {end: CalendarDate, start: CalendarDate})
  };

  watch(displayCalendar, (nextCalendar, previousCalendar) => {
    if (previousCalendar && !isEqualCalendar(nextCalendar, previousCalendar)) {
      if (calendarStore.uncontrolledFocusedDate.value) {
        calendarStore.uncontrolledFocusedDate.value = toCalendar(calendarStore.uncontrolledFocusedDate.value, nextCalendar);
      }
      if (calendarStore.visibleRange.value.start && calendarStore.visibleRange.value.end) {
        calendarStore.visibleRange.value = {
          start: toCalendar(calendarStore.visibleRange.value.start, nextCalendar),
          end: toCalendar(calendarStore.visibleRange.value.end, nextCalendar)
        };
      }
      if (rangeStore.uncontrolledFocusedDate.value) {
        rangeStore.uncontrolledFocusedDate.value = toCalendar(rangeStore.uncontrolledFocusedDate.value, nextCalendar);
      }
      if (rangeStore.visibleRange.value.start && rangeStore.visibleRange.value.end) {
        rangeStore.visibleRange.value = {
          start: toCalendar(rangeStore.visibleRange.value.start, nextCalendar),
          end: toCalendar(rangeStore.visibleRange.value.end, nextCalendar)
        };
      }
      rangeStore.anchorDate.value = rangeStore.anchorDate.value ? toCalendar(rangeStore.anchorDate.value, nextCalendar) : null;
    }
  });

  let state = computed<CalendarState | RangeCalendarState>(() => {
    if (isRange) {
      return createRangeCalendarState({
        ...baseProps.value,
        allowsNonContiguousRanges: Boolean(resolvedProps.value.allowsNonContiguousRanges),
        defaultValue: resolvedProps.value.defaultValue as RangeInputValue,
        modelValue: resolvedProps.value.modelValue as RangeInputValue,
        onChange: resolvedProps.value.onChange as ((value: DateRangeValue | null) => void) | undefined,
        onFocusChange: resolvedProps.value.onFocusChange,
        value: resolvedProps.value.value as RangeInputValue
      }, rangeStore, emit, locale.value, displayCalendar.value, fallbackTimeZone.value);
    }

    return createCalendarState({
      ...baseProps.value,
      defaultValue: resolvedProps.value.defaultValue as CalendarInputValue,
      modelValue: resolvedProps.value.modelValue as CalendarInputValue,
      onChange: resolvedProps.value.onChange as ((value: CalendarDateValue | Date | string | null) => void) | undefined,
      onFocusChange: resolvedProps.value.onFocusChange,
      value: resolvedProps.value.value as CalendarInputValue
    }, calendarStore, emit, locale.value, displayCalendar.value, fallbackTimeZone.value);
  });

  let focusVisibleKey = ref<string | null>(null);
  let hoveredKey = ref<string | null>(null);
  let pressedKey = ref<string | null>(null);
  let cellRefs = new Map<string, HTMLElement>();
  let errorMessageId = useId();
  let rangeSelectionDescriptionId = useId();
  let rangeSelectionDescriptionText = computed(() => {
    if (!isRange || !('anchorDate' in state.value) || state.value.isReadOnly) {
      return '';
    }

    return createCalendarLabelFormatter(locale.value).format(
      state.value.anchorDate ? 'finishRangeSelectionPrompt' : 'startRangeSelectionPrompt'
    );
  });
  let rangeSelectionDescriptionElement: HTMLDivElement | null = null;

  let syncRangeSelectionDescription = () => {
    if (!rangeSelectionDescriptionElement) {
      return;
    }

    rangeSelectionDescriptionElement.textContent = rangeSelectionDescriptionText.value;
  };

  let registerCellRef = (key: string, element: HTMLElement | null) => {
    if (element) {
      cellRefs.set(key, element);
      return;
    }

    cellRefs.delete(key);
  };

  watch(() => [state.value.visibleRange.start.toString(), state.value.focusedDate.toString(), state.value.isFocused], async () => {
    if (!state.value.isFocused) {
      return;
    }

    await nextTick();
    cellRefs.get(state.value.focusedDate.toString())?.focus();
  }, {flush: 'post'});

  onMounted(async () => {
    if (typeof document !== 'undefined' && isRange) {
      rangeSelectionDescriptionElement = document.createElement('div');
      rangeSelectionDescriptionElement.id = rangeSelectionDescriptionId;
      rangeSelectionDescriptionElement.style.display = 'none';
      document.body.appendChild(rangeSelectionDescriptionElement);
      syncRangeSelectionDescription();
    }

    if (!state.value.isFocused) {
      return;
    }
    await nextTick();
    cellRefs.get(state.value.focusedDate.toString())?.focus();
  });

  watch(rangeSelectionDescriptionText, () => {
    syncRangeSelectionDescription();
  }, {immediate: true});

  onBeforeUnmount(() => {
    rangeSelectionDescriptionElement?.remove();
    rangeSelectionDescriptionElement = null;
  });

  let selectedDateDescription = computed(() => getSelectedDateDescription(
    locale.value,
    state.value,
    createCalendarLabelFormatter(locale.value) as LocalizedStringFormatter<'dateRange' | 'selectedDateDescription' | 'selectedRangeDescription', string>
  ));
  let rootAriaDescription = computed(() => getVisibleRangeDescription(
    locale.value,
    state.value.visibleRange.start,
    state.value.visibleRange.end,
    state.value.timeZone,
    true,
    createCalendarLabelFormatter(locale.value) as LocalizedStringFormatter<'dateRange', string>
  ));
  let rootAriaLabel = computed(() => buildCalendarRootAriaLabel(baseProps.value['aria-label'], rootAriaDescription.value));

  return {
    errorMessageId,
    focusVisibleKey,
    hoveredKey,
    locale,
    pressedKey,
    rangeSelectionDescriptionId,
    registerCellRef,
    rootAriaLabel,
    selectedDateDescription,
    state
  };
}

export const VueCalendar = defineComponent({
  name: 'VueCalendar',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    createCalendar: {
      type: Function as PropType<(identifier: CalendarIdentifier) => IntlCalendar>,
      default: undefined
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
      default: undefined
    },
    focusedValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    isDateUnavailable: {
      type: Function as PropType<(date: CalendarDateValue) => boolean>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
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
      type: Function as PropType<(value: CalendarDateValue | Date | string | null) => void>,
      default: undefined
    },
    onFocusChange: {
      type: Function as PropType<(value: CalendarDate) => void>,
      default: undefined
    },
    pageBehavior: {
      type: String as PropType<PageBehavior>,
      default: 'visible'
    },
    selectionAlignment: {
      type: String as PropType<SelectionAlignment>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'invalid' | 'valid' | undefined>,
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
    change: () => true,
    focusChange: (value: CalendarDate) => value instanceof CalendarDate,
    'update:modelValue': () => true,
    'update:value': () => true
  },
  setup(props, {attrs, emit}) {
    let provider = useProvider();
    let calendar = setupCalendarComponent(props, attrs as Record<string, unknown>, emit, false);

    return () => {
      let monthStarts = [...new Array(Math.max(props.visibleMonths, 1)).keys()].map((offset) => {
        return calendar.state.value.visibleRange.start.add({months: offset});
      });

      return h('div', {
        ...attrs,
        role: 'application',
        'aria-label': calendar.rootAriaLabel.value,
        class: [classNames(styles, 'spectrum-Calendar'), attrs.class]
      }, [
        h('div', {style: VISUALLY_HIDDEN_STYLE}, [
          h('h2', calendar.rootAriaLabel.value)
        ]),
        h('div', {class: classNames(styles, 'spectrum-Calendar-header')}, monthStarts.map((monthDate, index) => {
          let titleDate = monthDate.calendar.getFormattableMonth ? monthDate.calendar.getFormattableMonth(monthDate) : monthDate;
          return h('div', {
            class: classNames(styles, 'spectrum-Calendar-monthHeader'),
            key: monthDate.toString()
          }, [
            index === 0
              ? h(ActionButton, {
                'aria-label': createCalendarLabelFormatter(calendar.locale.value).format('previous'),
                class: classNames(styles, 'spectrum-Calendar-prevMonth'),
                isDisabled: calendar.state.value.isDisabled || calendar.state.value.isPreviousVisibleRangeInvalid(),
                isQuiet: true,
                onClick: () => calendar.state.value.focusPreviousPage()
              }, {
                default: () => provider.dir === 'rtl'
                  ? renderChevronIcon(CHEVRON_RIGHT_LARGE_PATH, 'ChevronRightLarge')
                  : renderChevronIcon(CHEVRON_LEFT_LARGE_PATH, 'ChevronLeftLarge')
              })
              : null,
            h('h2', {
              'aria-hidden': 'true',
              class: classNames(styles, 'spectrum-Calendar-title')
            }, formatDateValue(titleDate, calendar.locale.value, calendar.state.value.timeZone, {
              era: getEraFormat(titleDate),
              month: 'long',
              year: 'numeric'
            })),
            index === monthStarts.length - 1
              ? h(ActionButton, {
                'aria-label': createCalendarLabelFormatter(calendar.locale.value).format('next'),
                class: classNames(styles, 'spectrum-Calendar-nextMonth'),
                isDisabled: calendar.state.value.isDisabled || calendar.state.value.isNextVisibleRangeInvalid(),
                isQuiet: true,
                onClick: () => calendar.state.value.focusNextPage()
              }, {
                default: () => provider.dir === 'rtl'
                  ? renderChevronIcon(CHEVRON_LEFT_LARGE_PATH, 'ChevronLeftLarge')
                  : renderChevronIcon(CHEVRON_RIGHT_LARGE_PATH, 'ChevronRightLarge')
              })
              : null
          ]);
        })),
        h('div', {class: classNames(styles, 'spectrum-Calendar-months')}, monthStarts.map((monthDate) => {
          return renderCalendarGrid(
            calendar.state.value,
            calendar.locale.value,
            props.firstDayOfWeek,
            monthDate,
            calendar.state.value.isValueInvalid ? calendar.errorMessageId : undefined,
            calendar.selectedDateDescription.value,
            calendar.focusVisibleKey.value,
            calendar.hoveredKey.value,
            calendar.pressedKey.value,
            calendar.rangeSelectionDescriptionId,
            calendar.registerCellRef,
            (key) => {
              calendar.focusVisibleKey.value = key;
            },
            (key) => {
              calendar.hoveredKey.value = key;
            },
            (key) => {
              calendar.pressedKey.value = key;
            }
          );
        })),
        h('div', {style: VISUALLY_HIDDEN_STYLE}, [
          h('button', {
            'aria-label': createCalendarLabelFormatter(calendar.locale.value).format('next'),
            disabled: calendar.state.value.isDisabled || calendar.state.value.isNextVisibleRangeInvalid(),
            tabindex: -1,
            onClick: () => calendar.state.value.focusNextPage()
          })
        ]),
        calendar.state.value.isValueInvalid
          ? h(HelpText, {
            errorMessage: props.errorMessage || getInvalidSelectionMessage(1),
            errorMessageProps: {id: calendar.errorMessageId},
            isInvalid: true,
            showErrorIcon: true,
            UNSAFE_className: 'spectrum-Calendar-helpText'
          })
          : null
      ]);
    };
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
    autoFocus: {
      type: Boolean,
      default: false
    },
    createCalendar: {
      type: Function as PropType<(identifier: CalendarIdentifier) => IntlCalendar>,
      default: undefined
    },
    defaultFocusedValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
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
      default: undefined
    },
    focusedValue: {
      type: [String, Object, Date] as PropType<CalendarInputValue>,
      default: undefined
    },
    isDateUnavailable: {
      type: Function as PropType<(date: CalendarDateValue) => boolean>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
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
      type: Function as PropType<(value: DateRangeValue | null) => void>,
      default: undefined
    },
    onFocusChange: {
      type: Function as PropType<(value: CalendarDate) => void>,
      default: undefined
    },
    pageBehavior: {
      type: String as PropType<PageBehavior>,
      default: 'visible'
    },
    selectionAlignment: {
      type: String as PropType<SelectionAlignment>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'invalid' | 'valid' | undefined>,
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
    change: () => true,
    focusChange: (value: CalendarDate) => value instanceof CalendarDate,
    'update:modelValue': () => true,
    'update:value': () => true
  },
  setup(props, {attrs, emit}) {
    let calendar = setupCalendarComponent(props, attrs as Record<string, unknown>, emit, true);
    let provider = useProvider();

    return () => {
      let monthStarts = [...new Array(Math.max(props.visibleMonths, 1)).keys()].map((offset) => {
        return calendar.state.value.visibleRange.start.add({months: offset});
      });

      return h('div', {
        ...attrs,
        role: 'application',
        'aria-label': calendar.rootAriaLabel.value,
        class: [classNames(styles, 'spectrum-Calendar'), attrs.class]
      }, [
        h('div', {style: VISUALLY_HIDDEN_STYLE}, [
          h('h2', calendar.rootAriaLabel.value)
        ]),
        h('div', {class: classNames(styles, 'spectrum-Calendar-header')}, monthStarts.map((monthDate, index) => {
          let titleDate = monthDate.calendar.getFormattableMonth ? monthDate.calendar.getFormattableMonth(monthDate) : monthDate;
          return h('div', {
            class: classNames(styles, 'spectrum-Calendar-monthHeader'),
            key: monthDate.toString()
          }, [
            index === 0
              ? h(ActionButton, {
                'aria-label': createCalendarLabelFormatter(calendar.locale.value).format('previous'),
                class: classNames(styles, 'spectrum-Calendar-prevMonth'),
                isDisabled: calendar.state.value.isDisabled || calendar.state.value.isPreviousVisibleRangeInvalid(),
                isQuiet: true,
                onClick: () => calendar.state.value.focusPreviousPage()
              }, {
                default: () => provider.dir === 'rtl'
                  ? renderChevronIcon(CHEVRON_RIGHT_LARGE_PATH, 'ChevronRightLarge')
                  : renderChevronIcon(CHEVRON_LEFT_LARGE_PATH, 'ChevronLeftLarge')
              })
              : null,
            h('h2', {
              'aria-hidden': 'true',
              class: classNames(styles, 'spectrum-Calendar-title')
            }, formatDateValue(titleDate, calendar.locale.value, calendar.state.value.timeZone, {
              era: getEraFormat(titleDate),
              month: 'long',
              year: 'numeric'
            })),
            index === monthStarts.length - 1
              ? h(ActionButton, {
                'aria-label': createCalendarLabelFormatter(calendar.locale.value).format('next'),
                class: classNames(styles, 'spectrum-Calendar-nextMonth'),
                isDisabled: calendar.state.value.isDisabled || calendar.state.value.isNextVisibleRangeInvalid(),
                isQuiet: true,
                onClick: () => calendar.state.value.focusNextPage()
              }, {
                default: () => provider.dir === 'rtl'
                  ? renderChevronIcon(CHEVRON_LEFT_LARGE_PATH, 'ChevronLeftLarge')
                  : renderChevronIcon(CHEVRON_RIGHT_LARGE_PATH, 'ChevronRightLarge')
              })
              : null
          ]);
        })),
        h('div', {class: classNames(styles, 'spectrum-Calendar-months')}, monthStarts.map((monthDate) => {
          return renderCalendarGrid(
            calendar.state.value,
            calendar.locale.value,
            props.firstDayOfWeek,
            monthDate,
            calendar.state.value.isValueInvalid ? calendar.errorMessageId : undefined,
            calendar.selectedDateDescription.value,
            calendar.focusVisibleKey.value,
            calendar.hoveredKey.value,
            calendar.pressedKey.value,
            calendar.rangeSelectionDescriptionId,
            calendar.registerCellRef,
            (key) => {
              calendar.focusVisibleKey.value = key;
            },
            (key) => {
              calendar.hoveredKey.value = key;
            },
            (key) => {
              calendar.pressedKey.value = key;
            }
          );
        })),
        h('div', {style: VISUALLY_HIDDEN_STYLE}, [
          h('button', {
            'aria-label': createCalendarLabelFormatter(calendar.locale.value).format('next'),
            disabled: calendar.state.value.isDisabled || calendar.state.value.isNextVisibleRangeInvalid(),
            tabindex: -1,
            onClick: () => calendar.state.value.focusNextPage()
          })
        ]),
        calendar.state.value.isValueInvalid
          ? h(HelpText, {
            errorMessage: props.errorMessage || getInvalidSelectionMessage(2),
            errorMessageProps: {id: calendar.errorMessageId},
            isInvalid: true,
            showErrorIcon: true,
            UNSAFE_className: 'spectrum-Calendar-helpText'
          })
          : null
      ]);
    };
  }
});

export const Calendar = VueCalendar;
export const RangeCalendar = VueRangeCalendar;

export type {SpectrumCalendarProps, SpectrumRangeCalendarProps} from '@vue-types/calendar';
