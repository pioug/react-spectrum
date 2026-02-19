import {useLocale} from './context';

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  calendar?: string
}

export class DateFormatter {
  private formatter: Intl.DateTimeFormat;

  constructor(locale: string, options: Intl.DateTimeFormatOptions = {}) {
    this.formatter = new Intl.DateTimeFormat(locale, options);
  }

  format(date: Date | number): string {
    return this.formatter.format(date);
  }

  formatRange?(startDate: Date | number, endDate: Date | number): string {
    if (typeof this.formatter.formatRange === 'function') {
      return this.formatter.formatRange(startDate, endDate);
    }
    return `${this.format(startDate)} \u2013 ${this.format(endDate)}`;
  }
}

export function useDateFormatter(options: DateFormatterOptions = {}): DateFormatter {
  let {locale} = useLocale();
  return new DateFormatter(locale, options);
}
