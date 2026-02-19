export type DateRange = {
  end: Date | null,
  start: Date | null
};

export function cloneDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfWeek(date: Date): Date {
  let firstDay = cloneDate(date);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  return firstDay;
}

export function addDays(date: Date, days: number): Date {
  let nextDate = cloneDate(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function compareDay(leftDate: Date, rightDate: Date): number {
  let left = startOfDay(leftDate).getTime();
  let right = startOfDay(rightDate).getTime();
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

export function isAfterDay(leftDate: Date, rightDate: Date): boolean {
  return compareDay(leftDate, rightDate) > 0;
}

export function isBeforeDay(leftDate: Date, rightDate: Date): boolean {
  return compareDay(leftDate, rightDate) < 0;
}

export function isSameDay(leftDate: Date, rightDate: Date): boolean {
  return compareDay(leftDate, rightDate) === 0;
}

export function isSameMonth(leftDate: Date, rightDate: Date): boolean {
  return leftDate.getFullYear() === rightDate.getFullYear() && leftDate.getMonth() === rightDate.getMonth();
}

export function formatMonthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date);
}
