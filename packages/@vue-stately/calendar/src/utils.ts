import type {DateRange} from './types';

export function addDays(date: Date, amount: number): Date {
  let nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function addMonths(date: Date, amount: number): Date {
  let nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + amount);
  return nextDate;
}

export function cloneDate(date: Date): Date {
  return new Date(date);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function normalizeDateRange(range: DateRange): DateRange {
  return {
    start: range.start ? cloneDate(range.start) : null,
    end: range.end ? cloneDate(range.end) : null
  };
}

export function sameDay(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
