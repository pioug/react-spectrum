import {useLocale} from './context';

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  calendar?: string
}

export type DateFormatter = Intl.DateTimeFormat;

export function useDateFormatter(options: DateFormatterOptions = {}): DateFormatter {
  let {locale} = useLocale();
  return new Intl.DateTimeFormat(locale, options);
}
