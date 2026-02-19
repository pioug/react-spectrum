import {useLocale} from './context';

export type NumberFormatOptions = Intl.NumberFormatOptions;
export type NumberFormatter = Intl.NumberFormat;

export function useNumberFormatter(options: NumberFormatOptions = {}): NumberFormatter {
  let {locale} = useLocale();
  return new Intl.NumberFormat(locale, options);
}
