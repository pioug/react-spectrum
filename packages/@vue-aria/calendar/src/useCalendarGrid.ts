import {addDays, cloneDate, formatMonthLabel, startOfMonth, startOfWeek} from './utils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useLabels} from '@vue-aria/utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaCalendarGridOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  firstDayOfWeek?: MaybeRef<number | undefined>,
  id?: MaybeRef<string | undefined>,
  locale?: MaybeRef<string>,
  visibleDate: MaybeRef<Date>
}

export interface CalendarGridAria {
  gridProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id?: string,
    role: 'grid'
  }>,
  headerProps: ComputedRef<{
    role: 'row'
  }>,
  weekDays: ComputedRef<string[]>,
  weeks: ComputedRef<Date[][]>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useCalendarGrid(options: AriaCalendarGridOptions): CalendarGridAria {
  let locale = computed(() => unref(options.locale) ?? 'en-US');
  let firstDayOfWeek = computed(() => {
    let value = unref(options.firstDayOfWeek);
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 0;
    }

    let normalized = Math.trunc(value) % 7;
    return normalized < 0 ? normalized + 7 : normalized;
  });

  let weekDays = computed(() => {
    let formatter = new Intl.DateTimeFormat(locale.value, {weekday: 'short'});
    let firstWeekday = new Date(2026, 0, 4);
    return Array.from({length: 7}, (_entry, index) => formatter.format(addDays(firstWeekday, firstDayOfWeek.value + index)));
  });

  let weeks = computed(() => {
    let monthStartDate = startOfMonth(cloneDate(unref(options.visibleDate)));
    let firstVisibleDate = startOfWeek(monthStartDate, firstDayOfWeek.value);

    return Array.from({length: 6}, (_weekEntry, weekIndex) => {
      return Array.from({length: 7}, (_dayEntry, dayIndex) => {
        return addDays(firstVisibleDate, (weekIndex * 7) + dayIndex);
      });
    });
  });

  let gridProps = computed(() => ({
    role: 'grid' as const,
    ...useLabels({
      id: resolveOptionalString(options.id),
      'aria-label': [
        resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']),
        formatMonthLabel(cloneDate(unref(options.visibleDate)), locale.value)
      ].filter(Boolean).join(', ') || undefined,
      'aria-labelledby': resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby'])
    })
  }));

  let headerProps = computed(() => ({
    role: 'row' as const
  }));

  return {
    gridProps,
    headerProps,
    weekDays,
    weeks
  };
}
