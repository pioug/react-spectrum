import {addDays, cloneDate, startOfMonth, startOfWeek} from './utils';
import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaCalendarGridOptions {
  firstDayOfWeek?: MaybeRef<number | undefined>,
  locale?: MaybeRef<string>,
  visibleDate: MaybeRef<Date>
}

export interface CalendarGridAria {
  gridProps: ComputedRef<{
    role: 'grid'
  }>,
  headerProps: ComputedRef<{
    role: 'row'
  }>,
  weekDays: ComputedRef<string[]>,
  weeks: ComputedRef<Date[][]>
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
    role: 'grid' as const
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
